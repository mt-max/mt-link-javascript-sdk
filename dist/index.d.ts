import { AccessTokenInfo } from './api/get-access-token-info';
import { StoredOptions, ServiceId, ConfigsOptions, InitOptions, AuthorizeOptions, ExchangeAccessTokenOptions, GetAccessTokenInfoOptions, RequestMagicLinkOptions } from './typings';
export * from './typings';
export declare class MtLinkSdk {
    storedOptions: StoredOptions;
    init(clientId: string, options?: InitOptions): void;
    authorize(options?: AuthorizeOptions): void;
    onboard(options?: AuthorizeOptions): void;
    logout(options?: ConfigsOptions): void;
    openService(serviceId: ServiceId, options?: ConfigsOptions): void;
    requestMagicLink(options?: RequestMagicLinkOptions): Promise<void>;
    exchangeAccessToken(options?: ExchangeAccessTokenOptions): Promise<string>;
    getAccessTokenInfo(accessToken: string, options?: GetAccessTokenInfoOptions): Promise<AccessTokenInfo>;
}
declare const mtLinkSdk: MtLinkSdk;
export default mtLinkSdk;
