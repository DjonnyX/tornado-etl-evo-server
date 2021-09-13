import * as got from "got";
import { makeRequest } from "../utils/proxy";
import * as config from "../config";
import { ILicense, ILicenseType, IApplication, IIntegration } from "@djonnyx/tornado-types";

const BASE_URL = "api/v0/";

class RefServerApiService {
    private getToken(): string {
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

    public async getLicensesForClient<T = any>(): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/forClient`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async getLicenseForClient<T = any>(id: string, filter?: Array<any>): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license/forClient/byId`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                query: {
                    id,
                }
            }),
        );
    }

    // license types
    public async getLicenseTypes<T = any>(): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license-types`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async getLicenseType<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}license-type/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async createLicenseType<T = any>(licenseType: ILicenseType): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}license-type`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async updateLicenseType<T = any>(id: string, licenseType: ILicenseType): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}license-type/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async deleteLicenseType<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}license-type/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
            }),
        );
    }

    // applications
    public async getApplications<T = any>(): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}applications`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async getApplication<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async createApplication<T = any>(application: IApplication): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}application`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(application),
            }),
        );
    }

    public async updateApplication<T = any>(id: string, application: IApplication): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(application),
            }),
        );
    }

    public async deleteApplication<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}application/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
            }),
        );
    }

    // integrations
    public async getIntegrations<T = any>(): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}integrations`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async getIntegration<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.get(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                }
            }),
        );
    }

    public async createIntegration<T = any>(licenseType: IIntegration): Promise<T> {
        return await makeRequest<T>(
            got.post(`${config.REF_SERVER_HOST}/${BASE_URL}integration`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async updateIntegration<T = any>(id: string, licenseType: IIntegration): Promise<T> {
        return await makeRequest<T>(
            got.put(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
                body: JSON.stringify(licenseType),
            }),
        );
    }

    public async deleteIntegration<T = any>(id: string): Promise<T> {
        return await makeRequest<T>(
            got.delete(`${config.REF_SERVER_HOST}/${BASE_URL}integration/${id}`, {
                headers: {
                    "content-type": "application/json",
                    "authorization": this.getToken(),
                },
            }),
        );
    }
}

export const refServerApiService = new RefServerApiService();