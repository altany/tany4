import {screen} from '@testing-library/testcafe'
import { userVariables } from 'testcafe'
import Screen from './screenObjects'

fixture('Layout').page(userVariables.baseUrl)

test.page(`${userVariables.baseUrl}/work`)('`avatar` link navigates to `Home` page', async t => {
    await t
      .click(Screen.navigation.avatar)
      .expect(Screen.homePage.heading.exists).ok()
  
  });

test('home page `work` link navigates to `Work` page', async t => {
  await t
    .click(Screen.homePage.workLink)
    .expect(Screen.workPage.heading.exists).ok()

});

test('`work` link navigates to `Work` page', async t => {
  await t
    .click(Screen.navigation.work)
    .expect(Screen.workPage.heading.exists).ok()

});

test('`blog` link navigates to `Blog` page', async t => {
  await t
    .click(Screen.navigation.blog)
    .expect(Screen.blogPage.heading.exists).ok()

});
