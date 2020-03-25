import { MtLinkSdk } from '.';
declare global {
    interface Window {
        mtLinkSdk: MtLinkSdk;
        MtLinkSdk: typeof MtLinkSdk;
    }
}
export declare type AuthAction = 'login' | 'signup';
export interface ConfigsOptions {
    email?: string;
    backTo?: string;
    authAction?: AuthAction;
    showAuthToggle?: boolean;
    showRememberMe?: boolean;
    isNewTab?: boolean;
}
export declare type Scopes = string | string[];
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
export declare type GetAccessTokenInfoOptions = Omit<Omit<OAuthSharedParams, 'state'>, 'codeVerifier'>;
export declare type OnboardOptions = Omit<Omit<Omit<Omit<AuthorizeOptions, 'showAuthToggle'>, 'forceLogout'>, 'showRememberMe'>, 'authAction'>;
export declare type Mode = 'production' | 'staging' | 'develop' | 'local';
export declare type InitOptions = Omit<AuthorizeOptions, 'forceLogout'> & {
    mode?: Mode;
};
export declare type StoredOptions = InitOptions & {
    clientId?: string;
    mode: Mode;
    codeVerifier: string;
    state: string;
};
export declare type ServiceId = string | 'vault' | 'myaccount-settings' | 'linkkit';
export declare type MagicLinkTo = string | 'settings' | 'settings/authorized-applications' | 'settings/change-language' | 'settings/email-preferences' | 'settings/delete-account' | 'settings/update-email' | 'settings/update-password';
export interface RequestMagicLinkOptions extends ConfigsOptions {
    magicLinkTo?: MagicLinkTo;
}
export {};
