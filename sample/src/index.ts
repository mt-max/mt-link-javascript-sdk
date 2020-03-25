import MTLinkSDK from '@moneytree/mt-link-javascript-sdk';
import qs from 'qs';

interface ITokenInfo {
  aud: {
    name: string;
  };
  exp: number;
  scopes: string[];
}

const AWESOME_APP_ID = '05e8b50465a24df8bcfe75f2d4c58d89e89190e3e530d1a02c4db8dd7a770956';

const authorizeBtn = document.getElementById('authorize-btn') as HTMLButtonElement;
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
const goToSettingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
const goToVaultBtn = document.getElementById('vault-btn') as HTMLButtonElement;
const tokenInfoLbl = document.getElementById('access-token-text') as HTMLButtonElement;
const accessTokenLabel = document.getElementById('access-token-text') as HTMLParagraphElement;

if (!authorizeBtn || !logoutBtn || !goToSettingsBtn || !goToVaultBtn) {
  throw new Error('An error occurred');
}

// Launch authorize route when clicked
authorizeBtn.onclick = () => {
  MTLinkSDK.authorize();
};

// Launch logout route when clicked
logoutBtn.onclick = () => {
  const value = document.getElementById('logout-url').value;

  MTLinkSDK.logout({
    backTo: value ? value : undefined
  });
};

// Launch settings route when clicked
goToSettingsBtn.onclick = () => {
  MTLinkSDK.openSettings({ newTab: false });
};

// Launch vault route when clicked
goToVaultBtn.onclick = () => {
  MTLinkSDK.openVault({ newTab: false });
};

const initializeMTLinkSDK = () => {
  MTLinkSDK.init(AWESOME_APP_ID, {
    mode: 'local',
    redirectUri: 'http://localhost:9000'
  });
};

const validateToken = async () => {
  const { hash, search } = location;
  const accessToken =
    qs.parse(hash.slice(1)).access_token || qs.parse(search, { ignoreQueryPrefix: true }).access_token;

  // Disables buttons when a session has not been initialized.
  if (!accessToken) {
    goToSettingsBtn.disabled = true;
    goToVaultBtn.disabled = true;
    // logoutBtn.disabled = true;
    return;
  }

  accessTokenLabel.innerText = `Your access token is ${accessToken}.`;

  const authHeaders = new Headers({
    method: 'GET',
    Authorization: `Bearer ${accessToken}`
  });

  const response = await fetch('https://myaccount-staging.getmoneytree.com/oauth/token/info.json', {
    headers: authHeaders
  });

  const data: ITokenInfo = await response.json();

  tokenInfoLbl.innerText = `
    Your access token is ${accessToken}.
    It was generated for the app: ${data.aud.name}.
    It will expire on ${new Date(data.exp * 1000)}.
    It allows you to: ${data.scopes.join(', ')}
  `;
};

initializeMTLinkSDK();
// tslint:disable-next-line: no-floating-promises
validateToken();
