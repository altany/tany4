import { render } from '@testing-library/react'
import Blog from '../../../../pages/blog/index'

it('renders an empty blog page unchanged', () => {
  const { container } = render(<Blog />)
  expect(container).toMatchSnapshot()
})

it('renders an blog page with a post unchanged', () => {
    const post ={
        id:123,
        date: "2020-12-19T15:49:00+0200",
        title: "I am the titel",
        subtitle: "I am the subtitle",
        banner: "banner-path",
        color: "#222222"
    }
    const { container } = render(<Blog posts={[post]} />)
    expect(container).toMatchSnapshot()
  })