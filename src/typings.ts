import { MtLinkSdk } from '.';

declare global {
  interface Window {
    mtLinkSdk: MtLinkSdk;
    MtLinkSdk: typeof MtLinkSdk;
  }
}

export type AuthAction = 'login' | 'signup';

export interface ConfigsOptions {
  email?: string;
  backTo?: string;
  authAction?: AuthAction;
  showAuthToggle?: boolean;
  showRememberMe?: boolean;
  isNewTab?: boolean;
}

export type Scopes = string | string[];

interface AuthorizeConfigsOptions {
  forceLogout?: boolean;
}

interface OAuthSharedParams {
  state?: string;
  redirectUri?: string;
  codeVerifier?: string;
}

export interface AuthorizeOptions extends OAuthSharedParams, ConfigsOptions, AuthorizeConfigsOptions {
  country?: string;
  scopes?: Scopes;
}

export interface ExchangeAccessTokenOptions extends OAuthSharedParams {
  code?: string;
}

export type GetAccessTokenInfoOptions = Omit<Omit<OAuthSharedParams, 'state'>, 'codeVerifier'>;

export type OnboardOptions = Omit<
  Omit<Omit<Omit<AuthorizeOptions, 'showAuthToggle'>, 'forceLogout'>, 'showRememberMe'>,
  'authAction'
>;

export type Mode = 'production' | 'staging' | 'develop' | 'local';

export type InitOptions = Omit<AuthorizeOptions, 'forceLogout'> & { mode?: Mode };
export type StoredOptions = InitOptions & { clientId?: string; mode: Mode; codeVerifier: string; state: string };

export type ServiceId = string | 'vault' | 'myaccount-settings' | 'linkkit';
export type MagicLinkTo =
  | string
  | 'settings'
  | 'settings/authorized-applications'
  | 'settings/change-language'
  | 'settings/email-preferences'
  | 'settings/delete-account'
  | 'settings/update-email'
  | 'settings/update-password';

export interface RequestMagicLinkOptions extends ConfigsOptions {
  magicLinkTo?: MagicLinkTo;
}
