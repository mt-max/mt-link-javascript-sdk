import { stringify } from 'qs';

import { generateConfigs, mergeConfigs } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server_paths';
import { StoredOptions, RequestMagicLinkOptions } from '../typings';

export default async function requestMagicLink(
  storedOptions: StoredOptions,
  options: RequestMagicLinkOptions = {}
): Promise<void> {
  const { clientId, mode, email: defaultEmail } = storedOptions;
  const { email = defaultEmail, magicLinkTo, ...rest } = options;
  const configs = mergeConfigs(storedOptions, rest, ['email']);

  if (!email) {
    throw new Error(
      '[MT-Link-SDK] Missing option `email` in `requestMagicLink`, make sure to pass one via `requestMagicLink` options or `init` options.'
    );
  }

  const queryString = stringify({
    client_id: clientId,
    configs: generateConfigs(configs)
  });

  const url: string = `${MY_ACCOUNT_DOMAINS[mode]}/magic-link.json?${queryString}`;

  let magicLinkToValue = magicLinkTo || '/settings';

  if (magicLinkToValue[0] !== '/') {
    magicLinkToValue = `/${magicLinkToValue}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        magic_link_to: magicLinkToValue
      })
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw new Error(`[MT-Link-SDK] \`requestMagicLink\` execution failed. ${error}`);
  }
}
