import { Controller, Route, Tags, Example, Request, Get, OperationId, Security } from "tsoa";
import { IAuthRequest } from "../interfaces";
import { IRef, RefTypes, IRight, UserRights } from "@djonnyx/tornado-types";

interface IRightInfo extends IRight {}

interface IRightsResponse {
    meta?: IRightInfoMeta;
    data?: Array<IRightInfo>;
    error?: Array<{
        code: number;
        message: string;
    }>;
}

interface IRightInfoMeta {
    ref: IRef;
}

const RIGHTS_RESPONSE_TEMPLATE: Array<IRightInfo> = [
    // backups
    {
        name: "View Backups",
        code: UserRights.VIEW_BACKUPS,
    },
    {
        name: "Form Backups",
        code: UserRights.FORM_BACKUP,
    },
    {
        name: "Upload Backups",
        code: UserRights.UPLOAD_BACKUP,
    },
    // licenses
    {
        name: "Read Licenses",
        code: UserRights.READ_LICENSES,
    },
    {
        name: "Read License",
        code: UserRights.READ_LICENSE,
    },
    {
        name: "Create License",
        code: UserRights.CREATE_LICENSE,
    },
    {
        name: "Update License",
        code: UserRights.UPDATE_LICENSE,
    },
    {
        name: "Delete License",
        code: UserRights.DELETE_LICENSE,
    },
    {
        name: "Revoke License",
        code: UserRights.REVOKE_LICENSE,
    },
    // Languages
    {
        name: "Read Languages",
        code: UserRights.READ_LANGUAGES,
    },
    {
        name: "Read Language",
        code: UserRights.READ_LANGUAGE,
    },
    {
        name: "Create Language",
        code: UserRights.CREATE_LANGUAGE,
    },
    {
        name: "Update Language",
        code: UserRights.UPDATE_LANGUAGE,
    },
    {
        name: "Delete Language",
        code: UserRights.DELETE_LANGUAGE,
    },
    // Tags
    {
        name: "Read Tags",
        code: UserRights.READ_TAGS,
    },
    {
        name: "Read Tag",
        code: UserRights.READ_TAG,
    },
    {
        name: "Create Tag",
        code: UserRights.CREATE_TAG,
    },
    {
        name: "Update Tag",
        code: UserRights.UPDATE_TAG,
    },
    {
        name: "Delete Tag",
        code: UserRights.DELETE_TAG,
    },
    // Products
    {
        name: "Read Products",
        code: UserRights.READ_PRODUCTS,
    },
    {
        name: "Read Product",
        code: UserRights.READ_PRODUCT,
    },
    {
        name: "Create Product",
        code: UserRights.CREATE_PRODUCT,
    },
    {
        name: "Update Product",
        code: UserRights.UPDATE_PRODUCT,
    },
    {
        name: "Delete Product",
        code: UserRights.DELETE_PRODUCT,
    },
    // Selectors
    {
        name: "Read Selectors",
        code: UserRights.READ_SELECTORS,
    },
    {
        name: "Read Selector",
        code: UserRights.READ_SELECTOR,
    },
    {
        name: "Create Selector",
        code: UserRights.CREATE_SELECTOR,
    },
    {
        name: "Update Selector",
        code: UserRights.UPDATE_SELECTOR,
    },
    {
        name: "Delete Selector",
        code: UserRights.DELETE_SELECTOR,
    },
    // Currencies
    {
        name: "Read Currencies",
        code: UserRights.READ_CURRENCIES,
    },
    {
        name: "Read Currency",
        code: UserRights.READ_CURRENCY,
    },
    {
        name: "Create Currency",
        code: UserRights.CREATE_CURRENCY,
    },
    {
        name: "Update Currency",
        code: UserRights.UPDATE_CURRENCY,
    },
    {
        name: "Delete Currency",
        code: UserRights.DELETE_CURRENCY,
    },
    // Stores
    {
        name: "Read Stores",
        code: UserRights.READ_STORES,
    },
    {
        name: "Read Store",
        code: UserRights.READ_STORE,
    },
    {
        name: "Create Store",
        code: UserRights.CREATE_STORE,
    },
    {
        name: "Update Store",
        code: UserRights.UPDATE_STORE,
    },
    {
        name: "Delete Store",
        code: UserRights.DELETE_STORE,
    },
    // Terminals
    {
        name: "Read Terminals",
        code: UserRights.READ_TERMINALS,
    },
    {
        name: "Read Terminal",
        code: UserRights.READ_TERMINAL,
    },
    {
        name: "Create Terminal",
        code: UserRights.CREATE_TERMINAL,
    },
    {
        name: "Update Terminal",
        code: UserRights.UPDATE_TERMINAL,
    },
    {
        name: "Delete Terminal",
        code: UserRights.DELETE_TERMINAL,
    },
    // OrderTypes
    {
        name: "Read OrderTypes",
        code: UserRights.READ_ORDER_TYPES,
    },
    {
        name: "Read OrderType",
        code: UserRights.READ_ORDER_TYPE,
    },
    {
        name: "Create OrderType",
        code: UserRights.CREATE_ORDER_TYPE,
    },
    {
        name: "Update OrderType",
        code: UserRights.UPDATE_ORDER_TYPE,
    },
    {
        name: "Delete OrderType",
        code: UserRights.DELETE_ORDER_TYPE,
    },
    // Checkue
    {
        name: "Read Checkues",
        code: UserRights.READ_CHECKUES,
    },
    {
        name: "Read Checkue",
        code: UserRights.READ_CHECKUE,
    },
    {
        name: "Create Checkue",
        code: UserRights.CREATE_CHECKUE,
    },
    {
        name: "Update Checkue",
        code: UserRights.UPDATE_CHECKUE,
    },
    {
        name: "Delete Checkue",
        code: UserRights.DELETE_CHECKUE,
    },
    // Themes
    {
        name: "Read Themes",
        code: UserRights.READ_THEMES,
    },
    {
        name: "Read Theme",
        code: UserRights.READ_THEME,
    },
    {
        name: "Create Theme",
        code: UserRights.CREATE_THEME,
    },
    {
        name: "Update Theme",
        code: UserRights.UPDATE_THEME,
    },
    {
        name: "Delete Theme",
        code: UserRights.DELETE_THEME,
    },
    // Menu
    {
        name: "Read Menu",
        code: UserRights.READ_MENU,
    },
    {
        name: "Create Menu node",
        code: UserRights.CREATE_MENU_NODE,
    },
    {
        name: "Update Menu node",
        code: UserRights.UPDATE_MENU_NODE,
    },
    {
        name: "Delete Menu node",
        code: UserRights.DELETE_MENU_NODE,
    },
    // Ads
    {
        name: "Read Ads",
        code: UserRights.READ_ADS,
    },
    {
        name: "Read Ad",
        code: UserRights.READ_AD,
    },
    {
        name: "Create Ad",
        code: UserRights.CREATE_AD,
    },
    {
        name: "Update Ad",
        code: UserRights.UPDATE_AD,
    },
    {
        name: "Delete Ad",
        code: UserRights.DELETE_AD,
    },
    // Business period
    {
        name: "Read Business periods",
        code: UserRights.READ_BUSINESS_PERIODS,
    },
    {
        name: "Read Business period",
        code: UserRights.READ_BUSINESS_PERIOD,
    },
    {
        name: "Create Business period",
        code: UserRights.CREATE_BUSINESS_PERIOD,
    },
    {
        name: "Update Business period",
        code: UserRights.UPDATE_BUSINESS_PERIOD,
    },
    {
        name: "Delete Business period",
        code: UserRights.DELETE_BUSINESS_PERIOD,
    },
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
        data: RIGHTS_RESPONSE_TEMPLATE,
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
            data: RIGHTS_RESPONSE_TEMPLATE,
        }
    }
}
