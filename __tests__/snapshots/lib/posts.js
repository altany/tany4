import { addHeadingIds } from '../../../lib/posts'

describe('addHeadingIds', () => {
  it('gives each h2 an id and lists them for the outline', () => {
    const { html, headings } = addHeadingIds('<p>x</p><h2>The problem</h2><h2>What worked &amp; what didn&#x27;t</h2>')
    expect(html).toContain('<h2 id="the-problem">The problem</h2>')
    expect(headings).toEqual([
      { id: 'the-problem', text: 'The problem' },
      { id: 'what-worked-what-didn-t', text: "What worked & what didn't" },
    ])
  })

  it('keeps Greek text and makes repeated headings unique', () => {
    const { headings } = addHeadingIds('<h2>"κάλεσε" (call)</h2><h2>Notes</h2><h2>Notes</h2>')
    expect(headings.map((h) => h.id)).toEqual(['καλεσε-call', 'notes', 'notes-2'])
  })
})
