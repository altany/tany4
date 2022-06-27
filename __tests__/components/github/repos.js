import { render } from '@testing-library/react'
import Repos from '../../../components/github/repos'

jest.mock('swr')
const swr = require('swr').default

it('renders repos without language unchanged', () => {
    const Repos = require('../../../components/github/repos').default
    const { container } = render(<Repos />)
    expect(container).toMatchSnapshot()
})

it('renders repos for language unchanged', () => {
    const data=['repo1', 'repo 2', 'repo 3']
    const error=undefined
    swr.mockImplementation(()=>({data, error}))
    
    const { container } = render(<Repos language='Javascript' />)
    expect(container).toMatchSnapshot()
})

it('renders repos for language and no data unchanged', () => {
    const data=undefined
    const error=undefined
    swr.mockImplementation(()=>({data, error}))

    const { container } = render(<Repos language='Javascript' />)
    expect(container).toMatchSnapshot()
})

it('renders repos for language with error unchanged', () => {
    const data=undefined
    const error='test error'
    swr.mockImplementation(()=>({data, error}))

    const { container } = render(<Repos language='Javascript' />)
    expect(container).toMatchSnapshot()
})