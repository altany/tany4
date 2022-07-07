import { render } from '@testing-library/react'
import BlogPost from '../../../../../pages/blog/posts/[id]'


const data = {
    title: "I am the title",
    subtitle: "I am the subtitle",
    date: "2020-12-19T15:49:00+0200",
    contentHtml: "<div>I am the <strong>content</strong></div>"
}
it('renders the blog post unchanged', () => {
  const { container } = render(<BlogPost data={data} />)
  expect(container).toMatchSnapshot()
})