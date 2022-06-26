import { render } from '@testing-library/react'

it('renders repos without language unchanged', () => {
    const Repos = require('../../../components/github/repos').default
    const { container } = render(<Repos />)
    expect(container).toMatchSnapshot()
})

it('renders repos for language unchanged', () => {
    const data=['repo1', 'repo 2', 'repo 3']
    const error=undefined
    jest.mock('swr', ()=>({
        __esModule: true,
        default: ()=>({data, error})
    }))

    const Repos = require('../../../components/github/repos').default
    
    const { container } = render(<Repos language='Javascript' />)
    expect(container).toMatchSnapshot()
})

it('renders repos for language and no data unchanged', () => {
    const data=undefined
    const error=undefined
    jest.mock('swr', ()=>({
        __esModule: true,
        default: ()=>({data, error})
    }))

    const Repos = require('../../../components/github/repos').default
    const { container } = render(<Repos language='Javascript' />)
    expect(container).toMatchSnapshot()
})

it('renders repos for language with error unchanged', () => {
    const data=undefined
    const error='test error'
    jest.mock('swr', ()=>({
        __esModule: true,
        default: ()=>({data, error})
    }))

    const Repos = require('../../../components/github/repos').default
    const { container } = render(<Repos language='Javascript' />)
    expect(container).toMatchSnapshot()
})