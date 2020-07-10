declare const __VERSION__: string;

import { stringify } from 'qs';
import { snakeCase } from 'snake-case';

import { Scopes, InitOptions, ConfigsOptions, AuthAction } from './typings';

export function constructScopes(scopes: Scopes = ''): string | undefined {
  return (Array.isArray(scopes) ? scopes.join(' ') : scopes) || undefined;
}

export function getIsTabValue(isNewTab: boolean = false): '' | '_self' {
  return isNewTab ? '' : '_self';
}

export function mergeConfigs(initValues: InitOptions, newValues: ConfigsOptions, ignoreKeys: string[] = []) {
  const {
    email: defaultEmail,
    backTo: defaultBackTo,
    authAction: defaultAuthAction,
    showAuthToggle: defaultShowAuthToggle,
    showRememberMe: defaultShowRememberMe
  } = initValues;

  const {
    email = defaultEmail,
    backTo = defaultBackTo,
    authAction = defaultAuthAction,
    showAuthToggle = defaultShowAuthToggle,
    showRememberMe = defaultShowRememberMe,
    ...rest
  } = newValues;

  const configs = {
    ...rest,
    email,
    backTo,
    authAction,
    showAuthToggle,
    showRememberMe
  };

  if (ignoreKeys.length) {
    const keys = Object.keys(configs) as Array<keyof ConfigsOptions>;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (ignoreKeys.indexOf(key) !== -1) {
        configs[key] = undefined;
      }
    }
  }

  return configs;
}

export function generateConfigs(configs: ConfigsOptions = {}) {
  const snakeCaseConfigs: { [key: string]: string | AuthAction | boolean | undefined } = {};

  for (const key in configs) {
    if (configs.hasOwnProperty(key)) {
      snakeCaseConfigs[snakeCase(key)] = configs[key as keyof ConfigsOptions];
    }
  }

  return stringify({
    ...snakeCaseConfigs,
    sdk_platform: 'js',
    sdk_version: __VERSION__
  });
}
