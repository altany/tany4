import { currentSection } from '../../../components/outline'

describe('currentSection', () => {
  const ids = ['a', 'b', 'c']
  const at = (tops, extra = {}) => currentSection(ids, { tops, scrollY: 0, viewport: 800, pageHeight: 3000, ...extra })

  it('starts on the first section', () => {
    expect(at([300, 900, 1500])).toBe('a')
  })

  it('picks the last section whose top has passed the reading line', () => {
    expect(at([-600, 80, 700])).toBe('b')
  })

  it('picks the last section at the bottom of the page', () => {
    expect(at([-900, -300, 400], { scrollY: 2200 })).toBe('c')
  })

  it('skips sections that are missing from the page', () => {
    expect(at([-600, null, 700])).toBe('a')
  })
})
