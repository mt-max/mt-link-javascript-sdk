import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../server_paths';
import { StoredOptions, GetAccessTokenInfoOptions, Scopes } from '../typings';

export interface AccessTokenInfo {
  guestUid: string;
  resourceServer: string;
  country: string;
  currency: string;
  language: string;
  clientName: string;
  clientId: string;
  expTimestamp: number;
  scopes: Scopes;
}

export default async function getAccessTokenInfo(
  storedOptions: StoredOptions,
  accessToken: string,
  options: GetAccessTokenInfoOptions = {}
): Promise<AccessTokenInfo> {
  const { clientId, redirectUri: defaultRedirectUri, mode } = storedOptions;
  const { redirectUri = defaultRedirectUri } = options;

  if (!accessToken) {
    throw new Error('[MT-Link-SDK] Missing parameter `accessToken` in `getAccessTokenInfo`.');
  }

  if (!redirectUri) {
    throw new Error(
      '[MT-Link-SDK] Missing option `redirectUri` in `getAccessTokenInfo`, make sure to pass one via `getAccessTokenInfo` options or `init` options.'
    );
  }

  const queryParams = qs.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token'
  });

  try {
    const response = await fetch(`${MY_ACCOUNT_DOMAINS[mode]}/oauth/token/info.json?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error_description);
    }

    return {
      guestUid: result.uid,
      resourceServer: result.resource_server,
      country: result.country,
      currency: result.currency,
      language: result.locale,
      clientId: result.aud.uid,
      clientName: result.aud.name,
      expTimestamp: result.exp,
      scopes: result.scopes
    };
  } catch (error) {
    throw new Error(`[MT-Link-SDK] \`getAccessTokenInfo\` execution failed. ${error}`);
  }
}
