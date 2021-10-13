
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
        console.log(body);
        return {};
    }
}
