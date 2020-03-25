import { stringify } from 'qs';

import { generateConfigs, mergeConfigs, getIsTabValue } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server_paths';
import { StoredOptions, ConfigsOptions } from '../typings';

export default function logout(storedOptions: StoredOptions, options: ConfigsOptions = {}): void {
  if (!window) {
    throw new Error(`[MT-Link-SDK] \`logout\` only works in the browser.`);
  }

  const { clientId, mode } = storedOptions;
  const { isNewTab, ...rest } = options;

  const queryString = stringify({
    client_id: clientId,
    configs: generateConfigs(mergeConfigs(storedOptions, rest))
  });

  window.open(`${MY_ACCOUNT_DOMAINS[mode]}/guests/logout?${queryString}`, getIsTabValue(isNewTab));
}
