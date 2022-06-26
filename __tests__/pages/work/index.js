import { render } from '@testing-library/react'
import Work from '../../../pages/work/index'

it('renders the work page unchanged', () => {
  const { container } = render(<Work />)
  expect(container).toMatchSnapshot()
})
