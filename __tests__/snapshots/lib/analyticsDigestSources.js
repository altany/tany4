import nodemailer from 'nodemailer'
import { getVercelWeek } from '../../../lib/analyticsDigest/vercel'
import { getCloudflareWeek } from '../../../lib/analyticsDigest/cloudflare'
import { sendReport } from '../../../lib/analyticsDigest/email'
import { buildReport } from '../../../lib/analyticsDigest/report'
import handler from '../../../pages/api/cron/weekly-analytics'
import previewHandler from '../../../pages/api/cron/weekly-analytics-preview'

jest.mock('nodemailer')

// Captures messages instead of connecting to an SMTP server
const mockMailer = () => {
  const sent = []
  nodemailer.createTransport.mockImplementation((options) => ({
    sendMail: async (message) => {
      sent.push({ options, message })
      return { messageId: `<message-${sent.length}>` }
    },
  }))
  return sent
}

const week = {
  since: '2026-09-21T00:00:00.000Z',
  until: '2026-09-27T23:59:59.999Z',
  label: '21 Sept – 27 Sept 2026',
}

const json = (body) => ({ ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) })

const originalEnv = process.env
beforeEach(() => {
  process.env = {
    ...originalEnv,
    VERCEL_ANALYTICS_TOKEN: 'vercel-test',
    CLOUDFLARE_API_TOKEN: 'cf-test',
    CLOUDFLARE_ACCOUNT_ID: 'a'.repeat(32),
    SMTP_USER: 'sender@example.com',
    SMTP_PASSWORD: 'app-password-test',
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
    day: [{ timestamp: '2026-09-21T00:00:00.000Z', visitors: 5, pageviews: 12 }],
    requestPath: [
      { requestPath: '/blog', visitors: 20, pageviews: 30 },
      { requestPath: '/blog/posts/marios-helper-v2', visitors: 3, pageviews: 4 },
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
    expect(counts.map((u) => u.searchParams.get('until'))).toContain('2026-09-28T00:00:00.000Z')
    const aggregates = calls.filter((u) => u.pathname.endsWith('/aggregate') && u.searchParams.get('since') === week.since)
    expect(aggregates.every((u) => u.searchParams.get('until') === week.until)).toBe(true)
    expect(calls.every((u) => u.searchParams.get('projectId') && u.searchParams.get('teamId'))).toBe(true)
    const daily = calls.filter((u) => u.searchParams.get('by') === 'day')
    expect(daily).toHaveLength(2)
    expect(daily.every((u) => u.searchParams.get('filter').includes("not startswith(requestPath,'/out/')"))).toBe(true)

    expect(result.totals).toEqual({ visitors: 40, pageviews: 90 })
    expect(result.previousTotals.visitors).toBe(50)
    expect(result.pages).toEqual([
      { name: '/blog', title: undefined, pageviews: 30 },
      // Title read from posts/marios-helper-v2.md
      { name: '/blog/posts/marios-helper-v2', title: "Fixing the app I built for my dog's medication schedule", pageviews: 4 },
    ])
    expect(result.outbound).toEqual([{ name: '/out/linkedin.com', pageviews: 5 }])

    const early = await getVercelWeek({ since: '2026-09-14T00:00:00.000Z', until: '2026-09-20T23:59:59.999Z', label: 'x' })
    expect(early.days.map((d) => d.date.slice(0, 10))[0]).toBe('2026-09-15')
    expect(early.trackedWholeWeek).toBe(false)
    expect(result.days).toHaveLength(7)
    expect(result.days[0]).toEqual({ date: week.since, pageviews: 12 })
    expect(result.days[6]).toEqual({ date: '2026-09-27T00:00:00.000Z', pageviews: 0 })
    // The three weeks before run 31 Aug – 20 Sept; tracking began on 15 Sept
    expect(result.baselineDays).toHaveLength(6)
    expect(result.trackedWholeWeek).toBe(true)
  })

  it('warns when the whole week had no traffic', async () => {
    global.fetch = async (input) => {
      const url = new URL(input)
      return json({ data: url.pathname.endsWith('/count') ? { visitors: 0, pageviews: 0 } : [] })
    }
    const { subject, text } = buildReport({ label: week.label, vercel: await getVercelWeek(week), cloudflare: null })
    expect(subject).toContain('(needs a look)')
    expect(text).toContain('7 days in a row with no page views')
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
        data: {
          viewer: {
            accounts: [
              {
                pageloads: [{ count: 80, sum: { visits: 30 }, avg: { sampleInterval: 1 } }],
                performance: [{ count: 70, quantiles: { pageLoadTimeP50: 1234567 } }],
              },
            ],
          },
        },
      })
    }
    const result = await getCloudflareWeek(week)
    expect(bodies).toHaveLength(2)
    expect(bodies[0]).toContain('requestHost_in: ["tany4.com","www.tany4.com"]')
    expect(bodies[0]).toContain(`datetime_geq: "${week.since}"`)
    expect(result.current).toEqual({ pageviews: 80, visits: 30, sampleInterval: 1, loadTimeMs: 1235 })
  })

  it('has no load time for a week without performance data', async () => {
    global.fetch = async () =>
      json({ data: { viewer: { accounts: [{ pageloads: [], performance: [{ count: 0, quantiles: { pageLoadTimeP50: 0 } }] }] } } })
    const result = await getCloudflareWeek(week)
    expect(result.current).toEqual({ pageviews: 0, visits: 0, sampleInterval: 1, loadTimeMs: null })
  })

  it('fails clearly when the token cannot read the account', async () => {
    global.fetch = async () => json({ data: { viewer: { accounts: [] } } })
    await expect(getCloudflareWeek(week)).rejects.toThrow('cannot read')
  })

  it('surfaces GraphQL errors', async () => {
    global.fetch = async () => json({ errors: [{ message: 'not authorized' }] })
    await expect(getCloudflareWeek(week)).rejects.toThrow('not authorized')
  })
})

describe('sendReport', () => {
  it('sends to hello@tany4.com through Gmail by default', async () => {
    const sent = mockMailer()
    const id = await sendReport({ subject: 's', text: 't', html: '<p>h</p>' })
    expect(id).toBe('<message-1>')
    expect(sent[0].options).toEqual({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: 'sender@example.com', pass: 'app-password-test' },
    })
    expect(sent[0].message).toMatchObject({
      from: 'tany4.com analytics <sender@example.com>',
      to: 'hello@tany4.com',
      subject: 's',
      text: 't',
      html: '<p>h</p>',
    })
  })

  it('uses another SMTP host when set', async () => {
    process.env.SMTP_HOST = 'smtp.zoho.com'
    const sent = mockMailer()
    await sendReport({ subject: 's', text: 't', html: '' })
    expect(sent[0].options.host).toBe('smtp.zoho.com')
  })

  it('fails clearly without mailbox credentials', async () => {
    delete process.env.SMTP_PASSWORD
    await expect(sendReport({ subject: 's', text: 't', html: '' })).rejects.toThrow('SMTP_USER or SMTP_PASSWORD is not set')
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
    global.fetch = vercelFetch([])
    const sent = mockMailer()
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const res = response()
    await handler({ headers: { authorization: 'Bearer cron-test' }, query: {} }, res)
    spy.mockRestore()

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ sent: true, id: '<message-1>', problems: 1 })
    expect(sent[0].message.text).toContain('Could not load Cloudflare Web Analytics')
    expect(sent[0].message.text).toContain('Vercel Web Analytics')
  })

  it('previews the email in the logs without sending it', async () => {
    delete process.env.CLOUDFLARE_API_TOKEN
    global.fetch = vercelFetch([])
    const sent = mockMailer()
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const res = response()
    await previewHandler({ headers: { authorization: 'Bearer cron-test' }, query: {} }, res)
    const logged = logSpy.mock.calls.map((c) => c.join(' ')).join('\n')
    errorSpy.mockRestore()
    logSpy.mockRestore()

    expect(sent).toHaveLength(0)
    expect(res.statusCode).toBe(200)
    expect(res.body.sent).toBe(false)
    expect(res.body.reports).toHaveLength(2)
    expect(res.body.reports.every((r) => r.problems === 1)).toBe(true)
    expect(logged).toContain('[weekly-analytics-preview]')
    expect(logged).toContain('Vercel Web Analytics')
  })

  it('rejects previews without the cron secret', async () => {
    const res = response()
    await previewHandler({ headers: {}, query: {} }, res)
    expect(res.statusCode).toBe(401)
  })
})
