import { CubAppPage } from './app.po';

describe('cub-app App', () => {
  let page: CubAppPage;

  beforeEach(() => {
    page = new CubAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
