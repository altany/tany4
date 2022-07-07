import { render } from '@testing-library/react'
import ActiveSector from '../../../../components/github/activeSector'


const props = {
    cx:296,
    cy:131.8046875,
    innerRadius:69.742578125,
    outerRadius:101.44375,
    startAngle:0,
    endAngle: 264.9082571453812,
    fill:'hsl(0,50%,65%)',
    payload: {name: 'Javascipt'},
    percent: 0.799721,
}

it('renders an active sector with language unchanged', () => {
  const { container } = render(<svg><ActiveSector {...props} /></svg>)
  expect(container).toMatchSnapshot()
})

it('renders an active sector without language unchanged', () => {
    const { container } = render(<svg><ActiveSector { ...props} payload={undefined} /></svg>)
    expect(container).toMatchSnapshot()
})