import { render } from '@testing-library/react'
import Date from '../../../components/date'

it('renders the date unchanged', () => {
  const { container } = render(<Date dateString="2020-12-19T15:49:00+0200" />)
  expect(container).toMatchSnapshot()
})

it('shows the date the post was written on, whatever the timezone', () => {
  // A late-evening and an early-morning post both land on a different UTC day
  const late = render(<Date dateString="2020-05-07T23:30:00+0200" />).container.textContent
  const early = render(<Date dateString="2020-05-08T01:30:00+0300" />).container.textContent
  expect([late, early]).toEqual(['7 May 2020', '8 May 2020'])
})
