import { render } from '@testing-library/react'
import Icon from '../../../components/icon'
import {
    GITHUB,
    GITLAB,
    RESUME,
    ENVELOPE,
    LINKEDIN,
    TWITTER,
    CODEWARS
} from "../../../lib/icons";

it('renders the GITHUB icon unchanged', () => {
  const { container } = render(<Icon icon={GITHUB} />)
  expect(container).toMatchSnapshot()
})

it('renders the GITLAB icon unchanged', () => {
    const { container } = render(<Icon icon={GITLAB} />)
    expect(container).toMatchSnapshot()
})

it('renders the RESUME icon unchanged', () => {
    const { container } = render(<Icon icon={RESUME} />)
    expect(container).toMatchSnapshot()
})

it('renders the ENVELOPE icon unchanged', () => {
    const { container } = render(<Icon icon={ENVELOPE} />)
    expect(container).toMatchSnapshot()
})

it('renders the LINKEDIN icon unchanged', () => {
    const { container } = render(<Icon icon={LINKEDIN} />)
    expect(container).toMatchSnapshot()
})

it('renders the TWITTER icon unchanged', () => {
    const { container } = render(<Icon icon={TWITTER} />)
    expect(container).toMatchSnapshot()
})

it('renders the CODEWARS icon unchanged', () => {
    const { container } = render(<Icon icon={CODEWARS} />)
    expect(container).toMatchSnapshot()
})