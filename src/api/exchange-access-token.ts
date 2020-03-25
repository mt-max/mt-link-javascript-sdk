import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../server_paths';
import { StoredOptions, ExchangeAccessTokenOptions } from '../typings';

function getCode(): string {
  // not available in node environment
  if (!window) {
    return '';
  }

  const { code } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });

  return (Array.isArray(code) ? code[code.length - 1] : code) as string;
}

export default async function exchangeAccessToken(
  storedOptions: StoredOptions,
  options: ExchangeAccessTokenOptions = {}
): Promise<string> {
  const {
    clientId,
    redirectUri: defaultRedirectUri,
    state: defaultState,
    mode,
    codeVerifier: defaultCodeVerifier
  } = storedOptions;

  if (!clientId) {
    throw new Error('[MT-Link-SDK] Make sure to call `init` before calling `exchangeAccessToken`.');
  }

  const {
    redirectUri = defaultRedirectUri,
    state = defaultState,
    codeVerifier = defaultCodeVerifier,
    code = getCode()
  } = options;

  if (!code) {
    throw new Error(
      '[MT-Link-SDK] Missing option `code` in `exchangeAccessToken`, or failed to get `code` from query/hash value from the URL.'
    );
  }

  if (!redirectUri) {
    throw new Error(
      '[MT-Link-SDK] Missing option `redirectUri` in `exchangeAccessToken`, make sure to pass one via `exchangeAccessToken` options or `init` options.'
    );
  }

  try {
    const response = await fetch(`${MY_ACCOUNT_DOMAINS[mode]}/oauth/token.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        state,
        client_id: clientId,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier || undefined,
        code_challenge_method: codeVerifier ? 'S256' : undefined
      })
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error_description);
    }

    return result.access_token;
  } catch (error) {
    throw new Error(`[MT-Link-SDK] \`exchangeAccessToken\` execution failed. ${error}`);
  }
}
