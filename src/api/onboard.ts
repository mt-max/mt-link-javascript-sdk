import { stringify } from 'qs';
import { SHA256, enc } from 'crypto-js';
import { encode } from 'url-safe-base64';

import { constructScopes, generateConfigs, mergeConfigs, getIsTabValue } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server_paths';
import { StoredOptions, OnboardOptions } from '../typings';
import storage from '../storage';

export default function onboard(storedOptions: StoredOptions, options: OnboardOptions = {}): void {
  if (!window) {
    throw new Error('[MT-Link-SDK] `onboard` only works in the browser.');
  }

  const {
    mode,
    clientId,
    scopes: defaultScopes,
    redirectUri: defaultRedirectUri,
    state: defaultState,
    codeVerifier: defaultCodeVerifier,
    country: defaultCountry
  } = storedOptions;

  if (!clientId) {
    throw new Error('[MT-Link-SDK] Make sure to call `init` before calling `onboard`.');
  }

  const {
    scopes = defaultScopes,
    redirectUri = defaultRedirectUri,
    state = defaultState,
    codeVerifier = defaultCodeVerifier,
    country = defaultCountry,
    isNewTab,
    ...rest
  } = options;
  const configs = mergeConfigs(storedOptions, rest, ['authAction', 'showAuthToggle', 'showRememberMe', 'forceLogout']);

  const { email } = configs;

  // update state
  if (state !== defaultState) {
    storage.set('state', state);
  }

  // update codeVerifier
  if (codeVerifier !== defaultCodeVerifier) {
    storage.set('codeVerifier', codeVerifier);
  }

  if (!redirectUri) {
    throw new Error(
      '[MT-Link-SDK] Missing option `redirectUri` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
    );
  }

  if (!email) {
    throw new Error(
      '[MT-Link-SDK] Missing option `email` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
    );
  }

  if (!country) {
    throw new Error(
      '[MT-Link-SDK] Missing option `country` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
    );
  }

  const codeChallenge = codeVerifier && encode(SHA256(codeVerifier).toString(enc.Base64).split('=')[0]);

  const queryString = stringify({
    client_id: clientId,
    response_type: 'code',
    scope: constructScopes(scopes),
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: codeVerifier && 'S256',
    state,
    country,
    configs: generateConfigs(configs)
  });

  window.open(`${MY_ACCOUNT_DOMAINS[mode]}/onboard?${queryString}`, getIsTabValue(isNewTab));
}
