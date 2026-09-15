import { previousWeek, weeksBefore, last7Days } from '../../../lib/analyticsDigest/period'
import { findSpikes, longestQuietStreak, percentChange, buildReport } from '../../../lib/analyticsDigest/report'

describe('period', () => {
  it('picks the Monday-to-Sunday week before the current one', () => {
    const week = previousWeek(new Date('2026-09-21T05:30:00Z')) // a Monday
    expect(week.since).toBe('2026-09-14T00:00:00.000Z')
    expect(week.until).toBe('2026-09-20T23:59:59.999Z')
    expect(week.label).toBe('14 Sept – 20 Sept 2026')
  })

  it('gives the same week on any day of the following week', () => {
    expect(previousWeek(new Date('2026-09-27T23:00:00Z')).since).toBe('2026-09-14T00:00:00.000Z')
  })

  it('steps back whole weeks', () => {
    const week = previousWeek(new Date('2026-09-21T05:00:00Z'))
    expect(weeksBefore(week, 1).since).toBe('2026-09-07T00:00:00.000Z')
    expect(weeksBefore(week, 1).until).toBe('2026-09-13T23:59:59.999Z')
    expect(weeksBefore(week, 3).since).toBe('2026-08-24T00:00:00.000Z')
  })

  it('covers the 7 full days before today for a test email', () => {
    const r = last7Days(new Date('2026-09-16T10:00:00Z'))
    expect(r.since).toBe('2026-09-09T00:00:00.000Z')
    expect(r.until).toBe('2026-09-15T23:59:59.999Z')
  })
})

describe('report checks', () => {
  const day = (date, pageviews) => ({ date, pageviews })

  it('flags days far above the usual daily page views', () => {
    const baseline = Array.from({ length: 21 }, (_, i) => day(`b${i}`, 10))
    const week = [day('a', 12), day('b', 45), day('c', 29)]
    expect(findSpikes(week, baseline).map((d) => d.date)).toEqual(['b'])
  })

  it('needs at least 20 page views to call a spike', () => {
    const baseline = Array.from({ length: 21 }, (_, i) => day(`b${i}`, 1))
    expect(findSpikes([day('a', 5)], baseline)).toEqual([])
  })

  it('finds runs of days with no traffic', () => {
    expect(longestQuietStreak([day('a', 3), day('b', 0), day('c', 0), day('d', 0), day('e', 1)])).toBe(3)
  })

  it('works out week-over-week change', () => {
    expect(percentChange(120, 100)).toBe(20)
    expect(percentChange(50, 0)).toBeNull()
  })
})

describe('buildReport', () => {
  const vercel = {
    totals: { visitors: 40, pageviews: 90 },
    previousTotals: { visitors: 50, pageviews: 100 },
    days: [{ date: '2026-09-14T00:00:00.000Z', pageviews: 10 }],
    baselineDays: [],
    pages: [{ name: '/blog', pageviews: 30 }],
    referrers: [{ name: '', visitors: 20 }, { name: 'www.linkedin.com', visitors: 5 }],
    countries: [{ name: 'GR', visitors: 12 }],
    outbound: [{ name: '/download/TaniaPapazafeiropoulou-CV.pdf', pageviews: 3 }],
  }
  const cloudflare = {
    current: { pageviews: 80, visits: 30, sampleInterval: 1 },
    previous: { pageviews: 70, visits: 20, sampleInterval: 10 },
  }

  it('summarises both sources', () => {
    const { subject, text } = buildReport({ label: '14 Sept – 20 Sept 2026', vercel, cloudflare })
    expect(subject).toBe('tany4.com weekly analytics, 14 Sept – 20 Sept 2026: 40 visitors')
    expect(text).toContain('Visitors: 40 (-20% vs the week before)')
    expect(text).toContain('Direct / unknown: 20')
    expect(text).toContain('Greece: 12')
    expect(text).toContain('/download/TaniaPapazafeiropoulou-CV.pdf: 3')
    expect(text).toContain('Visits: 30 (+50% vs the week before)')
    expect(text).toContain('estimates')
    expect(text).toContain('Nothing unusual.')
  })

  it('still sends when a source fails, and says so', () => {
    const { subject, text, html } = buildReport({
      label: 'x',
      vercel: null,
      cloudflare: null,
      errors: ['Vercel Web Analytics (VERCEL_ANALYTICS_TOKEN is not set)'],
    })
    expect(subject).toContain('data unavailable (needs a look)')
    expect(text).toContain('Could not load Vercel Web Analytics')
    expect(html).toContain('Needs a look')
  })

  it('escapes page paths in the HTML', () => {
    const { html } = buildReport({
      label: 'x',
      vercel: { ...vercel, pages: [{ name: '/<script>', pageviews: 1 }] },
      cloudflare: null,
    })
    expect(html).toContain('/&lt;script&gt;')
    expect(html).not.toContain('/<script>')
  })
})
