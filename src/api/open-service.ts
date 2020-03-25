import { stringify } from 'qs';

import { generateConfigs, mergeConfigs, getIsTabValue } from '../helper';
import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../server_paths';
import { StoredOptions, ServiceId, ConfigsOptions } from '../typings';

export default function openService(
  storedOptions: StoredOptions,
  serviceId: ServiceId,
  options: ConfigsOptions = {}
): void {
  if (!window) {
    throw new Error('[MT-Link-SDK] `openService` only works in the browser.');
  }

  const { clientId, mode } = storedOptions;
  const { isNewTab, ...rest } = options;

  const queryString = stringify({
    client_id: clientId,
    configs: generateConfigs(mergeConfigs(storedOptions, rest))
  });

  switch (serviceId) {
    case 'vault':
      window.open(`${VAULT_DOMAINS[mode]}?${queryString}`, getIsTabValue(isNewTab));
      break;

    case 'myaccount-settings':
      window.open(`${MY_ACCOUNT_DOMAINS[mode]}/settings?${queryString}`, getIsTabValue(isNewTab));
      break;

    case 'link-kit':
      window.open(`${LINK_KIT_DOMAINS[mode]}?${queryString}`, getIsTabValue(isNewTab));
      break;

    default:
      throw new Error(`[MT-Link-SDK] Invalid \`serviceId\` in \`openService\`, got: ${serviceId}`);
  }
}
