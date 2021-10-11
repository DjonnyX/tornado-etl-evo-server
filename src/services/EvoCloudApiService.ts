

import * as got from "got";
import { makeRequest } from "../utils/proxy";
import * as config from "../config";
import { IEvoCollection, IEvoStore } from "../interfaces/evotor";

class EvoCloudApiService {
    private getToken(): string {
        return `Bearer ${config.EVO_CLOUD_TOKEN}`;
    }

    private async _getAllChunksOfCollection<I = any>(request: (cursor?: string) => Promise<IEvoCollection<I>>,
        cursor?: string, lastCursor?: string, result: Array<I> = []): Promise<Array<I>> {
        if ((lastCursor && cursor) || (!lastCursor && !cursor)) {
            let chunk: IEvoCollection<I>;
            try {
                chunk = await request(cursor);
            } catch (err) {
                throw Error(`Error in getting page by cursor=${cursor}`);
            }

            result.push(...(chunk?.items || []));

            await this._getAllChunksOfCollection(request, chunk.paging.next_cursor, cursor, result);
        } else {
            // end
        }

        return result;
    }

    private async _getStores(cursor?: string): Promise<IEvoCollection<IEvoStore>> {
        return await makeRequest<IEvoCollection<IEvoStore>>(
            got.get(`${config.EVO_API_HOST}/stores`, {
                headers: {
                    "Accept": "application/vnd.evotor.v2+json",
                    "Content-Type": "application/vnd.evotor.v2+json",
                    "authorization": this.getToken(),
                },
                query: {
                    cursor,
                },
            }),
        );
    }
    public async getStores(): Promise<Array<IEvoStore>> {
        return await this._getAllChunksOfCollection(this._getStores);
    }

    private async _getDevices(cursor?: string): Promise<IEvoCollection<IEvoStore>> {
        return await makeRequest<IEvoCollection<IEvoStore>>(
            got.get(`${config.EVO_API_HOST}/devices`, {
                headers: {
                    "Accept": "application/vnd.evotor.v2+json",
                    "Content-Type": "application/vnd.evotor.v2+json",
                    "authorization": this.getToken(),
                },
                query: {
                    cursor,
                },
            }),
        );
    }
    public async getDevices(): Promise<Array<IEvoStore>> {
        return await this._getAllChunksOfCollection(this._getDevices);
    }
}

export const evoCloudApiService = new EvoCloudApiService();