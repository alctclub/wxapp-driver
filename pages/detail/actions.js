import { URLTypes, buildURL, fetch } from '../../api/fetch.js';

export function getShipmentDetail(enterpriseCode, shipmentCode) {
    const baseURL = `/app-shipments/${enterpriseCode}/${shipmentCode}`;
    return fetch(baseURL, URLTypes.TRADE);
}