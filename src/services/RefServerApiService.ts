import * as got from "got";
import { makeRequest } from "../utils/proxy";
import * as config from "../config";
import { ILicense, ILicenseType, IApplication, IIntegration } from "@djonnyx/tornado-types";

interface IRequestOptions {
    clientToken?: string;
}

interface ILoginParams {
    pass: string;
    email: string;
}

interface IRegistrationParams {
    captchaId: string;
    captchaValue: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface IGetClientCheckRestorePasswordParams {
    restorePassCode: string;
}

interface IPostClientRestorePasswordParams {
    restorePassCode: string;
    newPass: string;
}

interface IGetClientRestorePasswordParams {
    email: string;
    captchaId: string;
    captchaVal: string;
}

export interface ICheckLicenseResponse {
    meta?: any;
    data?: ILicense;
    error?: Array<{
        code: number;
        message: string;
    }>;
}

export interface ISetDeviceResponse {
    meta?: any;
    data?: ILicense;
    error?: Array<{
        code: number;
        message: string;
    }>;
}

const BASE_URL = "api/v0/";

class RefServerApiService {
    private getToken(options?: IRequestOptions): string {
        const clientToken = !!options && !!options.clientToken ? options.clientToken : undefined;

        if (!!clientToken) {
            return `Bearer ${options.clientToken}`;
        }

        return `Bearer ${config.REF_SERVER_API_KEY}`;
    }

    public async getCaptcha<T = any>(): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}captcha`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
            }),
        );
    }

    public async signin<T = any>(params: ILoginParams, options?: IRequestOptions): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}clientToken`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(options),
                },
                body: JSON.stringify(params),
            }),
        );
    }

    public async signup<T = any>(params: IRegistrationParams, options?: IRequestOptions): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}auth/registration`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(options),
                },
                body: JSON.stringify(params),
            }),
        );
    }

    public async postClientRestorePassword<T = any>(params: IPostClientRestorePasswordParams, options?: IRequestOptions): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}client/restorePass`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(options),
                },
                body: JSON.stringify(params),
            }),
        );
    }

    public async getClientRestorePassword<T = any>(params: IGetClientRestorePasswordParams, options?: IRequestOptions): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}client/restorePass`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(options),
                },
                query: params,
            }),
        );
    }

    public async clientCheckRestorePassCode<T = any>(params: IGetClientCheckRestorePasswordParams, options?: IRequestOptions): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}client/checkRestorePassCode`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(options),
                },
                query: params,
            }),
        );
    }

    public async getAccounts<T = any>(): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}clients`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async getAccount<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}clients/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async updateAccount<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}clients/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async setDevice(deviceToken: string): Promise<ISetDeviceResponse> {
        return await makeRequest(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}license/setDevice`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: deviceToken,
                    }),
                },
            }),
        );
    }

    public async checkLicense(deviceToken: string): Promise<ICheckLicenseResponse> {
        return await makeRequest(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}deviceToken/check`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: deviceToken,
                    }),
                },
            }),
        );
    }

    // licenses
    public async getLicenses<T = any>(): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async getLicense<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
            }),
        );
    }

    public async createLicense<T = any>(license: ILicense): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(license),
            }),
        );
    }

    public async updateLicense<T = any>(id: string, license: ILicense): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(license),
            }),
        );
    }

    public async unbindLicense<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/unbind/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
            }),
        );
    }

    public async deleteLicense<T = any>(id: String): Promise<T> {
        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
            }),
        );
    }

    public async getLicensesForClient<T = any>(token: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/forClient`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                }
            }),
        );
    }

    public async getLicenseForClient<T = any>(id: string, token: string, filter?: Array<any>): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/forClient/byId`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
                query: {
                    id,
                }
            }),
        );
    }

    // license types
    public async getLicenseTypes<T = any>(token: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license-types`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                }
            }),
        );
    }

    public async getLicenseType<T = any>(id: string, token: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license-type/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                }
            }),
        );
    }

    public async createLicenseType<T = any>(licenseType: ILicenseType, token: string): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}license-type`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async updateLicenseType<T = any>(id: string, licenseType: ILicenseType, token: string): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}license-type/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async deleteLicenseType<T = any>(id: string, token: string): Promise<T> {
        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}license-type/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
            }),
        );
    }

    // applications
    public async getApplications<T = any>(token: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}applications`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                }
            }),
        );
    }

    public async getApplication<T = any>(id: string, token: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                }
            }),
        );
    }

    public async createApplication<T = any>(application: IApplication, token: string): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}application`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
                body: JSON.stringify(application),
            }),
        );
    }

    public async updateApplication<T = any>(id: string, application: IApplication, token: string): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
                body: JSON.stringify(application),
            }),
        );
    }

    public async deleteApplication<T = any>(id: string, token: string): Promise<T> {
        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
            }),
        );
    }

    // integrations
    public async getIntegrations<T = any>(token: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}integrations`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                }
            }),
        );
    }

    public async getIntegration<T = any>(id: string, token: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                }
            }),
        );
    }

    public async createIntegration<T = any>(licenseType: IIntegration, token: string): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}integration`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async updateIntegration<T = any>(id: string, licenseType: IIntegration, token: string): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async deleteIntegration<T = any>(id: string, token: string): Promise<T> {
        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken({
                        clientToken: token,
                    }),
                },
            }),
        );
    }
}

export const refServerApiService = new RefServerApiService();