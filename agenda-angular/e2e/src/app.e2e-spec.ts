import { AppPage } from './app.po';
import { browser, logging, element, by, ExpectedConditions } from 'protractor';

describe('Testing HomePage', () => {
  let page: AppPage;
  var tituloInput = element(by.id('titulo'));
  var fechaInput = element(by.id('fecha'));
  var enviarButton = element(by.css('form button'));
  var tareas = element.all(by.css('app-tarea-agenda'));

  function addTarea(a, b) {
    tituloInput.sendKeys(a);
    fechaInput.sendKeys(b);
    enviarButton.click();
  }

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display new task', () => {
    page.navigateTo();
    addTarea('Tarea', '24-03-2020');
    expect(tareas.count()).toEqual(1);
    expect(tareas.all(by.css('.card-title span')).getText()).toEqual(['Tarea']);
    expect(tareas.all(by.css('.card-header span')).getText()).toEqual(['2020-03-24']);
    for (let i = 0; i < 10; i++)
      enviarButton.click();
    expect(tareas.count()).toEqual(11);
  });
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

describe('Testing Login', () => {
  let page: AppPage;
  var userInput = element(by.name('username'));
  var passInput = element(by.name('password'));
  var loginButton = element(by.css('app-login .btn-success'));

  function addLogin(a, b) {
    userInput.sendKeys(a);
    passInput.sendKeys(b);
    loginButton.click();
  }

  beforeEach(() => {
    page = new AppPage();
  });

  it('should login fail', () => {
    page.navigateTo('/login');
    addLogin('asd', 'asd');
    expect(element(by.css('app-login h3')).getText()).toEqual('Inicio Sesión');
    expect(element(by.css('app-usuario')).isPresent()).toBeFalsy();
  });
  it('should login success', () => {
    page.navigateTo('/login');
    addLogin('user', 'password');
    expect(element(by.css('app-usuario')).isPresent()).toBeTruthy();
    page.navigateTo('/login');
    expect(element(by.css('app-login h3')).getText()).toEqual('Cerrar Sesión');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

  afterAll(async () => {
    // logout
    page.navigateTo('/login');
    element(by.id('logout')).click();
  });
});
