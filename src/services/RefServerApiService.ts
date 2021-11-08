import * as got from "got";
import { makeRequest } from "../utils/proxy";
import * as config from "../config";
import {
    ILicense, ITarif, IApplication, IIntegration, IAccount, IAccountInfo,
    ISubscription
} from "@djonnyx/tornado-types";
import { ServerModel } from "../models";
import { IBaseResponse } from "src/interfaces";

const BASE_URL = "api/v1/";

class RefServerApiService {
    private async getToken(): Promise<string> {
        const server = await ServerModel.findOne();
        return `Bearer ${server.token}`;
    }

    public async registration<T = any>(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        extra: {
            userId: string;
            userUuid: string;
        }
    }): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}auth/signup`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify({ ...data, captchaId: "WITHOUT_CAPTCHA", captchaValue: "" }),
            }),
        );
    }

    public async authorization<T = any>(data: {
        email: string;
        password: string;
    }): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}auth/signin`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify({ ...data }),
            }),
        );
    }

    public async getAccounts<T = IBaseResponse<Array<IAccountInfo>, {}>>(query?: { [key: string]: string }): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}accounts`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                query,
            }),
        );
    }

    public async getAccount<T = IBaseResponse<IAccountInfo, {}>>(id: string, query?: { [key: string]: string }): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}account/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                query,
            }),
        );
    }

    public async updateAccount<T = IBaseResponse<IAccountInfo, {}>>(id: string, data: IAccount, query?: { [key: string]: string }): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}account/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                query,
                body: JSON.stringify(data),
            }),
        );
    }

    // licenses
    public async getLicenses<T = any>(): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                }
            }),
        );
    }

    public async getLicense<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
            }),
        );
    }

    public async createLicense<T = any>(license: ILicense): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(license),
            }),
        );
    }

    public async updateLicense<T = any>(id: string, license: ILicense): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(license),
            }),
        );
    }

    public async unbindLicense<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/unbind/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
            }),
        );
    }

    public async deleteLicense<T = any>(id: String): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}license/scope/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
            }),
        );
    }

    public async getLicensesForClient<T = any>(): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/forClient`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                }
            }),
        );
    }

    public async getLicenseForClient<T = any>(id: string, filter?: Array<any>): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/forClient/byId`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                query: {
                    id,
                }
            }),
        );
    }

    // licenses
    public async getSubscriptions<T = any>(query?: { [propName: string]: string }): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}subscription`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                query,
            }),
        );
    }

    public async getSubscription<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}subscription/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
            }),
        );
    }

    public async createSubscription<T = any>(subscription: ISubscription): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}subscription/`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(subscription),
            }),
        );
    }

    public async updateSubscription<T = any>(id: string, subscription: ISubscription): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}subscription/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(subscription),
            }),
        );
    }

    // tarifs
    public async getTarifs<T = any>(): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}tarifs`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                }
            }),
        );
    }

    public async getTarif<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}tarif/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                }
            }),
        );
    }

    public async createTarif<T = any>(tarif: ITarif): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}tarif`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(tarif),
            }),
        );
    }

    public async updateTarif<T = any>(id: string, tarif: ITarif): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}tarif/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(tarif),
            }),
        );
    }

    public async deleteTarif<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}tarif/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
            }),
        );
    }

    // applications
    public async getApplications<T = any>(): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}applications`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                }
            }),
        );
    }

    public async getApplication<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                }
            }),
        );
    }

    public async createApplication<T = any>(application: IApplication): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}application`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(application),
            }),
        );
    }

    public async updateApplication<T = any>(id: string, application: IApplication): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(application),
            }),
        );
    }

    public async deleteApplication<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
            }),
        );
    }

    // integrations
    public async getIntegrations<T = any>(query?: { [key: string]: string }): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}integrations`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                query,
            }),
        );
    }

    public async getIntegration<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                }
            }),
        );
    }

    public async createIntegration<T = any>(integration: IIntegration): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}integration`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(integration),
            }),
        );
    }

    public async updateIntegration<T = any>(id: string, integration: IIntegration): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
                body: JSON.stringify(integration),
            }),
        );
    }

    public async deleteIntegration<T = any>(id: string): Promise<T> {
        const token = await this.getToken();

        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": token,
                },
            }),
        );
    }
}

export const refServerApiService = new RefServerApiService();