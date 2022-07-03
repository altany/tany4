import {screen} from '@testing-library/testcafe'
import { userVariables } from 'testcafe'

fixture('Layout')
  .page(userVariables.baseUrl);

test('Renders `work` link', async t => {
  const workLink = screen.getByText('Work')
  const workHeading = screen.getByRole('heading', {name:'My work'})
  await t
    .click(workLink)
    .expect(workHeading.exists).ok()

});
