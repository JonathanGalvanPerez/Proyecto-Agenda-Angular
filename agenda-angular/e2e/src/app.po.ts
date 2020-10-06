import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(path: string = ''): Promise<unknown> {
    return browser.get(browser.baseUrl + path) as Promise<unknown>;
  }
  getText(selector: string): Promise<string> {
    return element(by.css(selector)).getText() as Promise<string>;
  }
}
