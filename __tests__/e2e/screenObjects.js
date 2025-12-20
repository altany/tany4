import { screen, within } from '@testing-library/testcafe'

import {
    NAME,
    CONTACT_EMAIL
} from "../../lib/constants";
  
class Navigation {
    constructor () {
        this.element = screen.queryByTestId('navigation')
        
        this.about = within(this.element).queryByRole('link', {name: 'About'})
        this.work = within(this.element).queryByRole('link', {name: 'Check out my work'})
        this.blog = within(this.element).queryByRole('link', {name: 'Blog'})
        this.resumeNav = within(this.element).queryByRole('link', {name: 'Resume'})
        this.avatar = within(this.element).queryByAltText(`${NAME} avatar`)

        this.linkedin = within(this.element).queryByTitle('Linkedin profile - in/taniapapazaf')
        this.twitter = within(this.element).queryByTitle('Twitter profile - @_Tany_')
        this.email = within(this.element).queryByTitle(`Email - ${CONTACT_EMAIL}`)

    }
}

class HomePage {
  constructor () {
    this.heading = screen.queryByRole('heading', {name:"Hi, I'm Tania Papazafeiropoulou,"})
    this.workLink = screen.queryByRole('link', {name: 'my work'})
  }
}


class WorkPage {
    constructor () {
      this.heading = screen.queryByRole('heading', {name:'My work'})
    }
  }


class BlogPage {
    constructor () {
        this.heading = screen.queryByRole('heading', {name:'Blog'})
    }
}

class PostPage {
    constructor () {
      
    }
}

class ExternalPage{
  constructor() {
    this.linkedin = undefined
    this.twitter = undefined
    this.resume = undefined
    this.email = undefined
  }
}

class Screen {
  constructor() {
    this.navigation = new Navigation()
    this.homePage = new HomePage()
    this.workPage = new WorkPage()
    this.blogPage = new BlogPage()
    this.postPage = new PostPage()
    this.ExternalPage = new ExternalPage()
  }
}

export default new Screen()