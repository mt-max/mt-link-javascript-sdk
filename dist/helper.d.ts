import { Scopes, InitOptions, ConfigsOptions } from './typings';
export declare function constructScopes(scopes?: Scopes): string | undefined;
export declare function getIsTabValue(isNewTab?: boolean): '' | '_self';
export declare function mergeConfigs(initValues: InitOptions, newValues: ConfigsOptions, ignoreKeys?: string[]): {
    email: string | undefined;
    backTo: string | undefined;
    authAction: "login" | "signup" | undefined;
    showAuthToggle: boolean | undefined;
    showRememberMe: boolean | undefined;
    isNewTab?: boolean | undefined;
};
export declare function generateConfigs(configs?: ConfigsOptions): string;
