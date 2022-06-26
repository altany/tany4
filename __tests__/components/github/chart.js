import { render } from '@testing-library/react'

it('renders a chart with data and no error unchanged', () => {
    const data=[{language:'Javascript', value:1}, {language:'CSS', value:2}]
    const error=undefined
    jest.mock('swr', ()=>({
        __esModule: true,
        default: ()=>({data, error})
    }))

    const Chart = require('../../../components/github/chart').default
    const { container } = render(<Chart />)
    expect(container).toMatchSnapshot()
})

it('renders a repo with an error unchanged', () => {
    const data=undefined
    const error='test error'
    jest.mock('swr', ()=>({
        __esModule: true,
        default: ()=>({data, error})
    }))

    const Chart = require('../../../components/github/chart').default
    const { container } = render(<Chart />)
    expect(container).toMatchSnapshot()
})

it('renders a repo with no data and no error unchanged', () => {
    const data=undefined
    const error=undefined
    jest.mock('swr', ()=>({
        __esModule: true,
        default: ()=>({data, error})
    }))

    const Chart = require('../../../components/github/chart').default
    const { container } = render(<Chart />)
    expect(container).toMatchSnapshot()
})