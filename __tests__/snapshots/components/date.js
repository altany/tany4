import { render } from '@testing-library/react'
import Date from '../../../components/date'

it('renders the date unchanged', () => {
  const { container } = render(<Date dateString="2020-12-19T15:49:00+0200" />)
  expect(container).toMatchSnapshot()
})