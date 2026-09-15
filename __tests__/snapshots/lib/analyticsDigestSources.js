import { getVercelWeek } from '../../../lib/analyticsDigest/vercel'
import { getCloudflareWeek } from '../../../lib/analyticsDigest/cloudflare'
import { sendReport } from '../../../lib/analyticsDigest/email'
import handler from '../../../pages/api/cron/weekly-analytics'

const week = {
  since: '2026-09-07T00:00:00.000Z',
  until: '2026-09-13T23:59:59.999Z',
  label: '7 Sept – 13 Sept 2026',
}

const json = (body) => ({ ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) })

const originalEnv = process.env
beforeEach(() => {
  process.env = {
    ...originalEnv,
    VERCEL_ANALYTICS_TOKEN: 'vercel-test',
    CLOUDFLARE_API_TOKEN: 'cf-test',
    CLOUDFLARE_ACCOUNT_ID: 'a'.repeat(32),
    NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN: 'b'.repeat(32),
    RESEND_API_KEY: 're_test',
    CRON_SECRET: 'cron-test',
  }
})
afterEach(() => {
  process.env = originalEnv
  delete global.fetch
})

// Serves Vercel Web Analytics responses shaped like the real API
const vercelFetch = (calls) => async (input) => {
  const url = new URL(input)
  calls.push(url)
  const p = Object.fromEntries(url.searchParams)
  if (url.pathname.endsWith('/count')) {
    return json({ data: p.since === week.since ? { visitors: 40, pageviews: 95 } : { visitors: 50, pageviews: 100 } })
  }
  const rows = {
    day: [{ timestamp: '2026-09-07T00:00:00.000Z', visitors: 5, pageviews: 12 }],
    requestPath: [
      { requestPath: '/blog', visitors: 20, pageviews: 30 },
      { requestPath: '/out/linkedin.com', visitors: 4, pageviews: 5 },
    ],
    referrerHostname: [{ referrerHostname: '', visitors: 20 }],
    country: [{ country: 'GR', visitors: 12 }],
  }
  return json({ data: rows[p.by] })
}

describe('getVercelWeek', () => {
  it('asks for the right windows and separates link clicks from page views', async () => {
    const calls = []
    global.fetch = vercelFetch(calls)
    const result = await getVercelWeek(week)

    const counts = calls.filter((u) => u.pathname.endsWith('/count'))
    expect(counts.map((u) => u.searchParams.get('until'))).toContain('2026-09-14T00:00:00.000Z')
    const aggregates = calls.filter((u) => u.pathname.endsWith('/aggregate') && u.searchParams.get('since') === week.since)
    expect(aggregates.every((u) => u.searchParams.get('until') === week.until)).toBe(true)
    expect(calls.every((u) => u.searchParams.get('projectId') && u.searchParams.get('teamId'))).toBe(true)

    expect(result.totals).toEqual({ visitors: 40, pageviews: 90 })
    expect(result.previousTotals.visitors).toBe(50)
    expect(result.pages).toEqual([{ name: '/blog', pageviews: 30 }])
    expect(result.outbound).toEqual([{ name: '/out/linkedin.com', pageviews: 5 }])
  })

  it('fails clearly without a token', async () => {
    delete process.env.VERCEL_ANALYTICS_TOKEN
    await expect(getVercelWeek(week)).rejects.toThrow('VERCEL_ANALYTICS_TOKEN is not set')
  })
})

describe('getCloudflareWeek', () => {
  it('queries this week and the one before for the site', async () => {
    const bodies = []
    global.fetch = async (input, init) => {
      bodies.push(JSON.parse(init.body).query)
      return json({
        data: { viewer: { accounts: [{ rumPageloadEventsAdaptiveGroups: [{ count: 80, sum: { visits: 30 }, avg: { sampleInterval: 1 } }] }] } },
      })
    }
    const result = await getCloudflareWeek(week)
    expect(bodies).toHaveLength(2)
    expect(bodies[0]).toContain(`siteTag: "${'b'.repeat(32)}"`)
    expect(bodies[0]).toContain(`datetime_geq: "${week.since}"`)
    expect(result.current).toEqual({ pageviews: 80, visits: 30, sampleInterval: 1 })
  })

  it('surfaces GraphQL errors', async () => {
    global.fetch = async () => json({ errors: [{ message: 'not authorized' }] })
    await expect(getCloudflareWeek(week)).rejects.toThrow('not authorized')
  })
})

describe('sendReport', () => {
  it('sends to hello@tany4.com from the analytics sender', async () => {
    let sent
    global.fetch = async (input, init) => {
      sent = { url: input, headers: init.headers, body: JSON.parse(init.body) }
      return json({ id: 'email_1' })
    }
    const id = await sendReport({ subject: 's', text: 't', html: '<p>h</p>' })
    expect(id).toBe('email_1')
    expect(sent.url).toBe('https://api.resend.com/emails')
    expect(sent.headers.Authorization).toBe('Bearer re_test')
    expect(sent.body).toMatchObject({ from: 'tany4.com analytics <analytics@send.tany4.com>', to: ['hello@tany4.com'], subject: 's' })
  })
})

describe('weekly-analytics endpoint', () => {
  const response = () => {
    const res = { statusCode: 0, body: null }
    res.status = (code) => ((res.statusCode = code), res)
    res.json = (body) => ((res.body = body), res)
    return res
  }

  it('rejects requests without the cron secret', async () => {
    global.fetch = jest.fn()
    const res = response()
    await handler({ headers: {}, query: {} }, res)
    expect(res.statusCode).toBe(401)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('still emails when a source fails', async () => {
    delete process.env.CLOUDFLARE_API_TOKEN
    const vercelCalls = []
    let email
    global.fetch = async (input, init) => {
      if (String(input).includes('api.resend.com')) {
        email = JSON.parse(init.body)
        return json({ id: 'email_2' })
      }
      return vercelFetch(vercelCalls)(input)
    }
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const res = response()
    await handler({ headers: { authorization: 'Bearer cron-test' }, query: {} }, res)
    spy.mockRestore()

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ sent: true, id: 'email_2', problems: 1 })
    expect(email.text).toContain('Could not load Cloudflare Web Analytics')
    expect(email.text).toContain('Vercel Web Analytics')
  })
})
