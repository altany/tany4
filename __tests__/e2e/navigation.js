import {screen} from '@testing-library/testcafe'

fixture('Layout')
  .page`localhost:3000`;

test('Renders `work` link', async t => {
  const workLink = screen.getByText('Work')
  const workHeading = screen.getByRole('heading', {name:'My work'})
  await t
    .click(workLink)
    .expect(workHeading.exists).ok()

});
