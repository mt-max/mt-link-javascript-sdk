import { StoredOptions, GetAccessTokenInfoOptions, Scopes } from '../typings';
export interface AccessTokenInfo {
    guestUid: string;
    resourceServer: string;
    country: string;
    currency: string;
    language: string;
    clientName: string;
    clientId: string;
    expTimestamp: number;
    scopes: Scopes;
}
export default function getAccessTokenInfo(storedOptions: StoredOptions, accessToken: string, options?: GetAccessTokenInfoOptions): Promise<AccessTokenInfo>;
