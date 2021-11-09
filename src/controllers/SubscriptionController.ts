
import { IAccountInfo, ISubscription, ITarif, SubscriptionStatuses } from "@djonnyx/tornado-types";
import { refServerApiService } from "../services";
import { Controller, Route, Tags, Example, Request, Get, OperationId, Security, Post, Body } from "tsoa";
import { IAuthRequest, IBaseResponse } from "../interfaces";

interface ISubscriptionEventResponse { }

interface ISubscriptionEventDataResponse {
    client: string;
    owner: string;
}

export enum SubscriptionEventTypes {
    /**
     * новая подписка. Сообщает о том, что пользователь установил приложение в Личном кабинете. Приходит в начале пробного периода или перед сообщением об успешной оплате, если пробного периода нет.
     */
    SUBSCRIPTION_CREATED = "SubscriptionCreated",
    /**
     * список платных опций, выбранных пользователем.
     */
    ADDONS_UPDATED = "AddonsUpdated",
    /**
     * подписка активирована. Сообщает об успешной оплате.
     */
    SUBSCRIPTION_ACTIVATED = "SubscriptionActivated",
    /**
     * подписка продлена на следующий период. Сообщает об успешной оплате очередного периода.
     */
    SUBSCRIPTION_RENEWED = "SubscriptionRenewed",
    /**
     * изменились условия подписки, например, тарифный план или количество устройств.
     */
    SUBSCRIPTION_TERMS_CHANGED = "SubscriptionTermsChanged",
    /**
     * Пользователь отправил запрос на завершение подписки (удалил приложение из Личного кабинета). Пользователь может возобновить подписку до окончания оплаченного периода.
     */
    SUBSCRIPTION_TERMINATION_REQUEST = "SubscriptionTerminationRequested",
    /**
     * Подписка завершена. Приходит если не прошла регулярная оплата, независимо от того запросил пользователь завершение подписки или нет.
     */
    SUBSCRIPTION_TERMINATED = "SubscriptionTerminated",
}

/**
 * @example
 * {
 *  "subscriptionId": "a99fbf70-6307-4acc-b61c-741ee9eef6c0",
 *  "productId": "c0d01x35-5193-4cc2-9bfb-be20e0679498",
 *  "userId": "01-000000000000001",
 *  "timestamp": "2017-04-20T18:26:37.753+0000",
 *  "sequenceNumber": 4,
 *  "type": "SubscriptionCreated",
 *  "planId": "example",
 *  "trialPeriodDuration": "P14DT",
 *  "deviceNumber": 35
 * }
 */
interface ISubscriptionEventData {
    /**
     * subscriptionId (string) Required
     * Идентификатор подписки.
     * Формат – uuid4, в соответствии с RFC.
     */
    subscriptionId: string;
    /**
     * Идентификатор приложения.
     * Формат – uuid4, в соответствии с RFC.
     */
    productId: string;
    /**
     * Идентификатор пользователя в Облаке Эвотор.
     * Не может быть null.
     */
    userId: string;
    /**
     * Дата и время отправки события.
     * В соответствовии с ISO 8601
     */
    timestamp: Date;
    /**
     * Номер события в последовательности. Номер непрерывно возрастает начиная с единицы. Необходим для соблюдения порядка обработки событий. Номер события уникален в рамках подписки (subscriptionId), таким образом, при переустановке приложения номерация событий начнётся сначала
     */
    sequenceNumber: number;
    /**
     * Типы событий
     */
    type: SubscriptionEventTypes | string;
    /**
     * Идентификатор тарифа, который вы создаёте на портале разработчиков.
     */
    planId: string;
    /**
     * Строка вида PnDT, где n – количество дней бесплатного периода, доступных пользователю в момент активации тарифа.
     * PnDT – формат представления времени.
     */
    trialPeriodDuration: string;
    /**
     * Количество оплаченных устройств.
     */
    deviceNumber: number;
}

const SUBSCRIPTION_INFO_RESPONSE: ISubscriptionEventResponse = {};

@Route("/subscription")
@Tags("Subscription")
export class SubscriptionEventController extends Controller {
    @Post("/event")
    @Security("checkEvoCloudToken")
    @OperationId("SubscriptionEvent")
    @Example<ISubscriptionEventResponse>(SUBSCRIPTION_INFO_RESPONSE)
    public async event(@Body() body: ISubscriptionEventData, @Request() request: IAuthRequest): Promise<ISubscriptionEventResponse> {
        let accountsResponse: IBaseResponse<Array<IAccountInfo>, {}>;
        try {
            accountsResponse = await refServerApiService.getAccounts(
                {
                    "extra.userId.equals": body?.userId,
                    all: "true",
                    secure: "true",
                }
            );
        } catch (err) {
            this.setStatus(500);
            console.error(`Get account error. ${err}`);
            return err;
        }

        const account = accountsResponse?.data?.[0];

        if (!account) {
            this.setStatus(500);
            console.error("User not found.");
            return;
        }

        let tarifResponse: IBaseResponse<ITarif, {}>;
        try {
            tarifResponse = await refServerApiService.getTarif(body.planId);
        } catch (err) {
            this.setStatus(500);
            console.error(`Get tarif error. ${err}`);
            return;
        }

        const tarif = tarifResponse?.data;

        if (!tarif) {
            this.setStatus(500);
            console.error("Tarif was not found.");
            return;
        }

        let subscriptionsResponse: IBaseResponse<Array<ISubscription>, {}>;
        try {
            subscriptionsResponse = await refServerApiService.getSubscriptions({
                "extra.evoSubscriptionId.equals": body.subscriptionId,
            });
        } catch (err) {
            this.setStatus(500);
            console.error(`Get exists subscription error. ${err}`);
        }

        const existsSubscription = subscriptionsResponse.data?.[0];

        // Если порядковый номер события меньше, чем есть в базе, то обрабатывать не нужно
        if (existsSubscription.extra.evoSequenceNumber > body.sequenceNumber) {
            this.setStatus(200);
            return;
        }

        let subscriptionResponse: IBaseResponse<ISubscription, {}>;


        switch (body.type) {
            case SubscriptionEventTypes.SUBSCRIPTION_CREATED: {
                // новая подписка. Сообщает о том, что пользователь приобрёл приложение в Личном кабинете. Приходит в начале пробного периода или перед сообщением об успешной оплате, если пробного периода нет.
                try {
                    subscriptionResponse = await refServerApiService.createSubscription({
                        client: account.id,
                        tarifId: tarif.id,
                        status: SubscriptionStatuses.NOT_ACTIVATED,
                        devices: body.deviceNumber,
                        extra: {
                            evoSubscriptionId: body.subscriptionId,
                            evoSequenceNumber: body.sequenceNumber,
                        }
                    });
                } catch (err) {
                    this.setStatus(500);
                    console.error(`Create subscription error. ${err}`);
                }
                break;
            }
            case SubscriptionEventTypes.ADDONS_UPDATED: {
                // список платных опций, выбранных пользователем
                try {
                    subscriptionResponse = await refServerApiService.updateSubscription(existsSubscription.id, {
                        devices: body.deviceNumber,
                        extra: {
                            evoSubscriptionId: body.subscriptionId,
                            evoSequenceNumber: body.sequenceNumber,
                        }
                    } as any);
                } catch (err) {
                    this.setStatus(500);
                    console.error(`Update subscription error. ${err}`);
                }
                break;
            }
            case SubscriptionEventTypes.SUBSCRIPTION_RENEWED:
            // Сообщает об успешной оплате очередного периода.
            case SubscriptionEventTypes.SUBSCRIPTION_ACTIVATED: {
                // Успешная оплата
                try {
                    subscriptionResponse = await refServerApiService.activateNextPaymentPeriodSubscription(existsSubscription.id, {
                        extra: {
                            evoSubscriptionId: body.subscriptionId,
                            evoSequenceNumber: body.sequenceNumber,
                        }
                    } as any);
                } catch (err) {
                    this.setStatus(500);
                    console.error(`Update subscription error. ${err}`);
                }
                break;
            }
            case SubscriptionEventTypes.SUBSCRIPTION_TERMINATED: {
            // Подписка завершена. Приходит если не прошла регулярная оплата
            try {
                subscriptionResponse = await refServerApiService.updateSubscription(existsSubscription.id, {
                    status: SubscriptionStatuses.NOT_ACTIVATED,
                    extra: {
                        evoSubscriptionId: body.subscriptionId,
                        evoSequenceNumber: body.sequenceNumber,
                    }
                } as any);
            } catch (err) {
                this.setStatus(500);
                console.error(`Update subscription error. ${err}`);
            }
            break;
        }
            case SubscriptionEventTypes.SUBSCRIPTION_TERMINATION_REQUEST: {
            // Пользователь отправил запрос на завершение подписки (удалил приложение из Личного кабинета). Пользователь может возобновить подписку до окончания оплаченного периода.
            try {
                subscriptionResponse = await refServerApiService.updateSubscription(existsSubscription.id, {
                    status: SubscriptionStatuses.DEACTIVATED,
                    extra: {
                        evoSubscriptionId: body.subscriptionId,
                        evoSequenceNumber: body.sequenceNumber,
                    }
                } as any);
            } catch (err) {
                this.setStatus(500);
                console.error(`Update subscription error. ${err}`);
            }
            break;
        }
            case SubscriptionEventTypes.SUBSCRIPTION_TERMS_CHANGED: {
            // Изменились условия подписки, например, тарифный план или количество устройств.
            try {
                subscriptionResponse = await refServerApiService.updateSubscription(existsSubscription.id, {
                    devices: body.deviceNumber,
                    tarifId: body.planId,
                    extra: {
                        evoSubscriptionId: body.subscriptionId,
                        evoSequenceNumber: body.sequenceNumber,
                    }
                } as any);
            } catch (err) {
                this.setStatus(500);
                console.error(`Update subscription error. ${err}`);
            }
            break;
        }
    }
        return {};
    }
}