import mtLinkSkd, { MtLinkSdk } from '..';

describe('index', () => {
  test('mtLinkSdk', () => {
    expect(mtLinkSkd.init).toBeDefined();
    expect(mtLinkSkd.authorize).toBeDefined();
    expect(mtLinkSkd.onboard).toBeDefined();
    expect(mtLinkSkd.logout).toBeDefined();
    expect(mtLinkSkd.openService).toBeDefined();
    expect(mtLinkSkd.requestMagicLink).toBeDefined();
    expect(mtLinkSkd.exchangeAccessToken).toBeDefined();
    expect(mtLinkSkd.getAccessTokenInfo).toBeDefined();
  });

  test('MtLinkSdk', () => {
    const instance = new MtLinkSdk();

    expect(instance).not.toBe(mtLinkSkd);
    expect(instance.init).toBeDefined();
    expect(instance.authorize).toBeDefined();
    expect(instance.onboard).toBeDefined();
    expect(instance.logout).toBeDefined();
    expect(instance.openService).toBeDefined();
    expect(instance.requestMagicLink).toBeDefined();
    expect(instance.exchangeAccessToken).toBeDefined();
    expect(instance.getAccessTokenInfo).toBeDefined();
  });
});
