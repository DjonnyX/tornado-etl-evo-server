/**
 * @example
 * {
 *     "items": [
 *       {
 *         "id": "20170228-F4F1-401B-80FA-9ECCA8451FFB",
 *         "name": "Мой магазин",
 *         "address": "Россия, г. Москва, ул. Тимура Фрунзе, 24",
 *         "user_id": "00-000000000000000",
 *         "created_at": "2018-04-17T10:11:49.393+0000",
 *         "updated_at": "2018-07-16T16:00:10.663+0000"
 *       }
 *     ],
 *     "paging": {
 *       "next_cursor": "string"
 *     }
 *   }
 */
export interface IEvoCollection<I = any> {
  items: Array<I>;
  paging: {
    next_cursor: string;
  };
}