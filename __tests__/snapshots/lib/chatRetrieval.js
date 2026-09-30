import { getKeywordContext } from '../../../lib/chat/retrieval'

// The chat can only answer from what the search hands the model, so these check
// that a question reaches the page that actually answers it. They run against
// the real site content.
const sourcesOf = (context) =>
  Array.from(new Set((context.match(/^\[([^\]]+)\]/gm) || []).map((s) => s.slice(1, -1))))

describe('chat retrieval', () => {
  it('finds the work page for something only that page mentions', async () => {
    const context = await getKeywordContext("What is Tomorrow's Collections?")
    expect(sourcesOf(context)).toContain('work')
    expect(context).toMatch(/Tomorrow/i)
  })

  it('finds the CV for a question about the current role', async () => {
    const context = await getKeywordContext('What is her current role?')
    expect(sourcesOf(context).some((s) => s === 'cv' || s === 'cv_data')).toBe(true)
    expect(context).toMatch(/Ready Collective/i)
  })

  it('answers about tools by name when the question only says monitoring', async () => {
    const context = await getKeywordContext('What monitoring tools has she used?')
    expect(context).toMatch(/sentry|datadog|cloudwatch/i)
  })

  it('does not let long blog posts crowd out the page that answers', async () => {
    const context = await getKeywordContext('What did she build for business partners at Olio?')
    expect(sourcesOf(context)).toContain('work')
    expect(context).toMatch(/impact data dashboard/i)
  })

  it('still reaches the blog for a blog question', async () => {
    const context = await getKeywordContext('What has she written about on her blog?')
    expect(sourcesOf(context).some((s) => s.startsWith('blog'))).toBe(true)
  })
})

describe('profile context', () => {
  it('always carries the current role, not just the career-wide title', async () => {
    const context = await getKeywordContext('What do you do now?')
    expect(context).toMatch(/Current role: .+ at The Ready Collective/)
  })

  it('carries the whole career length, not one employer tenure', async () => {
    const context = await getKeywordContext('How many years of experience do you have?')
    expect(context).toMatch(/Total experience: \d+ years as a developer/)
  })
})

describe('questions a recruiter asks', () => {
  it('finds the big rebuilds when asked for the most complex thing', async () => {
    const context = await getKeywordContext('What is the most complex thing you have built?')
    expect(context).toMatch(/scheduling|rebuild|10-year-old/i)
  })

  it('finds the backend work instead of only the front-end pages', async () => {
    const context = await getKeywordContext('Do you have any backend experience?')
    expect(context).toMatch(/node\.js|rails|mongodb/i)
  })
})
