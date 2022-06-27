import { render } from '@testing-library/react'
import Index from '../../pages/index'

it('renders the whole page unchanged', () => {
  const { container } = render(<Index />)
  expect(container).toMatchSnapshot()
})