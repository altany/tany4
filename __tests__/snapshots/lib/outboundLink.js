import { outboundPath } from '../../../lib/outboundLink'

const site = 'https://tany4.com'

it('labels external links by their site', () => {
  expect(outboundPath('http://www.linkedin.com/in/taniapapazaf', site)).toBe('/out/linkedin.com')
  expect(outboundPath('https://twitter.com/_Tany_', site)).toBe('/out/twitter.com')
  expect(outboundPath('https://gitlab.com/brief-challenges', site)).toBe('/out/gitlab.com')
})

it('labels email links', () => {
  expect(outboundPath('mailto:hello@tany4.com', site)).toBe('/out/email')
})

it('labels file downloads from the site', () => {
  expect(outboundPath('/TaniaPapazafeiropoulou-CV.pdf?version=17032026', site)).toBe('/download/TaniaPapazafeiropoulou-CV.pdf')
})

it('ignores links between pages of the site', () => {
  expect(outboundPath('/blog', site)).toBeNull()
  expect(outboundPath('https://tany4.com/cv', site)).toBeNull()
  expect(outboundPath('#top', site)).toBeNull()
  expect(outboundPath('javascript:void(0)', site)).toBeNull()
})
