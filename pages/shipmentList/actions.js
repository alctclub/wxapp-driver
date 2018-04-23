import { URLTypes, buildURL, fetch } from '../../api/fetch.js';

export function getRunningShipments() {
  const url = buildURL('/app-shipments', URLTypes.TRADE);
  return fetch(url, {
    method: 'GET',
  });
};

export function getHistoryShipments(currentPage = 1, pageSize = 10) {
  const baseURL = `/app-shipments/history?PageSize=${pageSize}&CurrentPage=${currentPage}`;
  const url = buildURL(baseURL, URLTypes.TRADE);
  return fetch(url, {
    method: 'GET',
  });
};