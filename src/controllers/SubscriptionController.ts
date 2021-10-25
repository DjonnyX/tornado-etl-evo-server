
import { Controller, Route, Tags, Example, Request, Get, OperationId, Security, Post, Body } from "tsoa";
import { IAuthRequest } from "../interfaces";

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
    deviceNumber: string;
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
        switch(body.type) {
            case SubscriptionEventTypes.SUBSCRIPTION_CREATED: {
                // новая подписка. Сообщает о том, что пользователь приобрёл приложение в Личном кабинете. Приходит в начале пробного периода или перед сообщением об успешной оплате, если пробного периода нет.
                break;
            }
            case SubscriptionEventTypes.ADDONS_UPDATED: {
                // список платных опций, выбранных пользователем
                break;
            }
            case SubscriptionEventTypes.SUBSCRIPTION_ACTIVATED: {
                // Успешная оплата
                break;
            }
            case SubscriptionEventTypes.SUBSCRIPTION_RENEWED: {
                // Сообщает об успешной оплате очередного периода.
                break;
            }
            case SubscriptionEventTypes.SUBSCRIPTION_TERMINATED: {
                // Подписка завершена. Приходит если не прошла регулярная оплата
                break;
            }
            case SubscriptionEventTypes.SUBSCRIPTION_TERMINATION_REQUEST: {
                // Пользователь отправил запрос на завершение подписки (удалил приложение из Личного кабинета). Пользователь может возобновить подписку до окончания оплаченного периода.
                break;
            }
            case SubscriptionEventTypes.SUBSCRIPTION_TERMS_CHANGED: {
                // Изменились условия подписки, например, тарифный план или количество устройств.
                break;
            }
        }
        return {};
    }
}
