import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
import {
  getShipmentDisplayStatus,
  moneyFormatter,
  dateFormatter,
} from '../../utils/index';
import appConfig from '../../api/appConfig';

export function getRunningShipments() {
  const url = buildURL('/shipments', URLTypes.MINIPROGRAM);
  return fetch(url, {
    method: 'GET',
    showLoading: true
  }).then((res) => shipmentFormatter(res));;
};

export function getHistoryShipments(currentPage = 1, pageSize = 10) {
  const baseURL = `/app-shipments/history?PageSize=${pageSize}&CurrentPage=${currentPage}`;
  const url = buildURL(baseURL, URLTypes.TRADE);
  return fetch(url, {
    method: 'GET',
  });
};

function shipmentFormatter(res = []) {
  return res.shipments.map((item) =>({
    shipmentCode: item.shipmentCode,
    statusDisplay: getShipmentDisplayStatus(item.statusCode),
    startAddress: item.startAddress,
    endAddress: item.endAddress,
    totalVolume: item.totalVolume,
    totalWeight: item.totalWeight,
    enterpriseCode: item.enterpriseCode,
    shipmentCharge: moneyFormatter(item.shipmentCharge),
    shipmentConfirmDate: dateFormatter(item.shipmentConfirmDate),
    licensePlateNumber: item.licensePlateNumber,
    enterpriseName: item.enterpriseName,
  }));
}

export function signin(formId) {
  wx.showToast({
    title: '签到成功',
    icon: 'none',
    duration: appConfig.duration
  });
}