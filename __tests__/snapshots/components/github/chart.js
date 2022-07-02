import { render } from '@testing-library/react'
import Chart from'../../../../components/github/chart'

jest.mock('swr')
const swr = require('swr').default

// eslint-disable-next-line react/display-name
jest.mock("react-resize-detector", () => ({children}) => {
    const MockReactResizeDetector = "mock-react-resize-detector";
    return <MockReactResizeDetector>{children}</MockReactResizeDetector>;
  });

it('renders a chart with data and no error unchanged', () => {
    const data=[{language:'Javascript', value:1}, {language:'CSS', value:2}]
    const error=undefined
    swr.mockImplementation(()=>({data, error}))
    const { container } = render(<Chart />)
    expect(container).toMatchSnapshot()
})

it('renders a repo with an error unchanged', () => {
    const data=undefined
    const error='test error'
    swr.mockImplementation(()=>({data, error}))

    const { container } = render(<Chart />)
    expect(container).toMatchSnapshot()
})

it('renders a repo with no data and no error unchanged', () => {
    const data=undefined
    const error=undefined
    swr.mockImplementation(()=>({data, error}))

    const { container } = render(<Chart />)
    expect(container).toMatchSnapshot()
})