import { render } from '@testing-library/react'
import Layout from '../../components/layout'

it('renders the layout unchanged', () => {
  const { container } = render(<Layout />)
  expect(container).toMatchSnapshot()
})