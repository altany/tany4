import { existsSync, readdirSync, readFileSync } from 'fs'
import { smallBanner, SMALL_IMAGES } from '../../../lib/images'

const banners = readdirSync('posts')
  .map((file) => readFileSync(`posts/${file}`, 'utf8').match(/^banner:\s*"([^"]+)"/m)?.[1])
  .filter(Boolean)

describe('small images', () => {
  it('maps banners to their small copies and leaves SVGs alone', () => {
    expect(smallBanner('marios-helper.png')).toBe('/blog/small/marios-helper.webp')
    expect(smallBanner('jsvidcon-banner.jpeg')).toBe('/blog/small/jsvidcon-banner.webp')
    expect(smallBanner('pesto.svg')).toBe('/blog/pesto.svg')
  })

  it.each(banners)('has a small copy of the %s banner (run `npm run images` if not)', (banner) => {
    expect(existsSync(`public${smallBanner(banner)}`)).toBe(true)
  })

  it.each(SMALL_IMAGES.map((i) => i.output))('has %s (run `npm run images` if not)', (output) => {
    expect(existsSync(output)).toBe(true)
  })
})
