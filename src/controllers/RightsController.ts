import { Controller, Route, Tags, Example, Request, Get, OperationId, Security } from "tsoa";
import { IAuthRequest } from "../interfaces";
import { IRef, RefTypes, UserRights } from "@djonnyx/tornado-types";

interface IRightsResponse {
    meta?: IRightInfoMeta;
    data?: Array<UserRights>;
    error?: Array<{
        code: number;
        message: string;
    }>;
}

interface IRightInfoMeta {
    ref: IRef;
}

export const AVAILABLE_RIGHTS: Array<UserRights> = [
    // Dashboard
    UserRights.READ_DASHBOARD,
    // Backups
    UserRights.VIEW_BACKUPS,
    UserRights.FORM_BACKUP,
    UserRights.UPLOAD_BACKUP,
    // Licenses
    UserRights.READ_LICENSES,
    UserRights.READ_LICENSE,
    UserRights.CREATE_LICENSE,
    UserRights.UPDATE_LICENSE,
    UserRights.DELETE_LICENSE,
    UserRights.REVOKE_LICENSE,
    // Languages
    UserRights.READ_LANGUAGES,
    UserRights.READ_LANGUAGE,
    UserRights.CREATE_LANGUAGE,
    UserRights.UPDATE_LANGUAGE,
    UserRights.DELETE_LANGUAGE,
    // Tags
    UserRights.READ_TAGS,
    UserRights.READ_TAG,
    UserRights.CREATE_TAG,
    UserRights.UPDATE_TAG,
    UserRights.DELETE_TAG,
    // Products
    UserRights.READ_PRODUCTS,
    UserRights.READ_PRODUCT,
    UserRights.CREATE_PRODUCT,
    UserRights.UPDATE_PRODUCT,
    UserRights.DELETE_PRODUCT,
    // Selectors
    UserRights.READ_SELECTORS,
    UserRights.READ_SELECTOR,
    UserRights.CREATE_SELECTOR,
    UserRights.UPDATE_SELECTOR,
    UserRights.DELETE_SELECTOR,
    // Currencies
    // UserRights.READ_CURRENCIES,
    // UserRights.READ_CURRENCY,
    // UserRights.CREATE_CURRENCY,
    // UserRights.UPDATE_CURRENCY,
    // UserRights.DELETE_CURRENCY,
    // Stores
    UserRights.READ_STORES,
    UserRights.READ_STORE,
    UserRights.CREATE_STORE,
    UserRights.UPDATE_STORE,
    UserRights.DELETE_STORE,
    // Terminals
    UserRights.READ_TERMINALS,
    UserRights.READ_TERMINAL,
    UserRights.CREATE_TERMINAL,
    UserRights.UPDATE_TERMINAL,
    UserRights.DELETE_TERMINAL,
    // OrderTypes
    UserRights.READ_ORDER_TYPES,
    UserRights.READ_ORDER_TYPE,
    UserRights.CREATE_ORDER_TYPE,
    UserRights.UPDATE_ORDER_TYPE,
    UserRights.DELETE_ORDER_TYPE,
    // Checkue
    // UserRights.READ_CHECKUES,
    // UserRights.READ_CHECKUE,
    // UserRights.CREATE_CHECKUE,
    // UserRights.UPDATE_CHECKUE,
    // UserRights.DELETE_CHECKUE,
    // Themes
    UserRights.READ_THEMES,
    UserRights.READ_THEME,
    UserRights.CREATE_THEME,
    UserRights.UPDATE_THEME,
    UserRights.DELETE_THEME,
    // Menu
    UserRights.READ_MENU,
    UserRights.CREATE_MENU_NODE,
    UserRights.UPDATE_MENU_NODE,
    UserRights.DELETE_MENU_NODE,
    // Ads
    UserRights.READ_ADS,
    UserRights.READ_AD,
    UserRights.CREATE_AD,
    UserRights.UPDATE_AD,
    UserRights.DELETE_AD,
    // Business period
    UserRights.READ_BUSINESS_PERIODS,
    UserRights.READ_BUSINESS_PERIOD,
    UserRights.CREATE_BUSINESS_PERIOD,
    UserRights.UPDATE_BUSINESS_PERIOD,
    UserRights.DELETE_BUSINESS_PERIOD,
    // Applications
    UserRights.READ_APPLICATIONS,
    UserRights.READ_APPLICATION,
    UserRights.CREATE_APPLICATION,
    UserRights.UPDATE_APPLICATION,
    UserRights.DELETE_APPLICATION,
    // Integrations
    UserRights.READ_INTEGRATIONS,
    UserRights.READ_INTEGRATION,
    UserRights.CREATE_INTEGRATION,
    UserRights.UPDATE_INTEGRATION,
    UserRights.DELETE_INTEGRATION,
    // License types
    UserRights.READ_LICENSE_TYPES,
    UserRights.READ_LICENSE_TYPE,
    UserRights.CREATE_LICENSE_TYPE,
    UserRights.UPDATE_LICENSE_TYPE,
    UserRights.DELETE_LICENSE_TYPE,
    // Accounts
    UserRights.READ_ACCOUNTS,
    UserRights.READ_ACCOUNT,
    UserRights.CREATE_ACCOUNT,
    UserRights.UPDATE_ACCOUNT,
    UserRights.DELETE_ACCOUNT,
    // Account roles
    UserRights.READ_ACCOUNT_ROLES,
    UserRights.READ_ACCOUNT_ROLE,
    UserRights.CREATE_ACCOUNT_ROLE,
    UserRights.UPDATE_ACCOUNT_ROLE,
    UserRights.DELETE_ACCOUNT_ROLE,
];

const META_TEMPLATE: IRightInfoMeta = {
    ref: {
        name: RefTypes.RIGHTS,
        version: 1,
        lastUpdate: new Date(),
    }
};

@Route("/rights")
@Tags("Rights")
export class RightsController extends Controller {
    @Get()
    @Security("clientAccessToken")
    @OperationId("GetAll")
    @Example<IRightsResponse>({
        meta: META_TEMPLATE,
        data: AVAILABLE_RIGHTS,
    })
    public async getRights(@Request() request: IAuthRequest): Promise<IRightsResponse> {
        return {
            meta: {
                ref: {
                    name: RefTypes.RIGHTS,
                    version: 1,
                    lastUpdate: new Date(),
                },
            },
            data: AVAILABLE_RIGHTS,
        }
    }
}
