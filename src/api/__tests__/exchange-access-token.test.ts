import fetch from 'jest-fetch-mock';

import { MY_ACCOUNT_DOMAINS } from '../../server_paths';
import { MtLinkSdk } from '../..';
import exchangeAccessToken from '../exchange-access-token';

describe('api', () => {
  describe('exchange-access-token', () => {
    const clientId = 'clientId';
    const code = 'code';
    const redirectUri = 'redirectUri';
    const accessToken = 'accessToken';

    const mtLinkSdk = new MtLinkSdk();
    mtLinkSdk.init(clientId, {
      redirectUri
    });

    test('without calling init', async () => {
      await expect(exchangeAccessToken(new MtLinkSdk().storedOptions)).rejects.toThrow(
        '[MT-Link-SDK] Make sure to call `init` before calling `exchangeAccessToken`.'
      );
    });

    test('code is required', async () => {
      await expect(exchangeAccessToken(mtLinkSdk.storedOptions)).rejects.toThrow(
        '[MT-Link-SDK] Missing option `code` in `exchangeAccessToken`, or failed to get `code` from query/hash value from the URL.'
      );
    });

    test('redirectUri is required', async () => {
      const instance = new MtLinkSdk();
      instance.init(clientId);

      await expect(
        exchangeAccessToken(instance.storedOptions, {
          code
        })
      ).rejects.toThrow(
        '[MT-Link-SDK] Missing option `redirectUri` in `exchangeAccessToken`, make sure to pass one via `exchangeAccessToken` options or `init` options.'
      );
    });

    test('make request', async () => {
      fetch.mockClear();

      const state = 'state';

      fetch.mockResponseOnce(JSON.stringify({ access_token: accessToken }));

      await exchangeAccessToken(mtLinkSdk.storedOptions, { code, state, codeVerifier: '' });

      const url = `${MY_ACCOUNT_DOMAINS.production}/oauth/token.json`;

      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          state,
          client_id: clientId,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
    });

    test('failed to request', async () => {
      const error = 'failed';

      fetch.mockClear();
      fetch.mockRejectedValueOnce(error);

      const instance = new MtLinkSdk();
      instance.init(clientId);

      await expect(exchangeAccessToken(instance.storedOptions, { code, redirectUri })).rejects.toThrow(
        `[MT-Link-SDK] \`exchangeAccessToken\` execution failed. ${error}`
      );
    });

    test('throw error on response with error', async () => {
      const error = 'failed';

      fetch.mockClear();
      fetch.mockResponseOnce(JSON.stringify({ error: 'error', error_description: error }));

      await expect(exchangeAccessToken(mtLinkSdk.storedOptions, { code })).rejects.toThrow(error);
    });

    test('auto extract code from url query if no code was passed', async () => {
      fetch.mockClear();

      const code1 = 'code1';
      const code2 = 'code2';

      fetch.mockResponseOnce(JSON.stringify({ access_token: accessToken }));

      jest.spyOn(window, 'location', 'get').mockReturnValueOnce({
        search: `?code=${code1}&code=${code2}`
      } as typeof window.location);

      await exchangeAccessToken(mtLinkSdk.storedOptions);

      const result = fetch.mock.calls[0][1] || {};
      const data = JSON.parse(result.body as string);

      expect(data.code).toBe(code2);
    });

    test('non browser environment will not auto extract code from url', async () => {
      const windowSpy = jest.spyOn(global, 'window', 'get');
      // @ts-ignore
      windowSpy.mockImplementation(() => undefined);

      await expect(exchangeAccessToken(mtLinkSdk.storedOptions)).rejects.toThrow(
        '[MT-Link-SDK] Missing option `code` in `exchangeAccessToken`, or failed to get `code` from query/hash value from the URL.'
      );
    });
  });
});
