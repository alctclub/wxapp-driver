import {
  URLTypes,
  buildURL,
  fetch
} from '../../api/fetch';
import {
  getOperation,
  transformToServerTime
} from '../../utils/index';
var Promise = require('../../libs/es6-promise.min.js');

export const ImageTypes = {
  PICKUP: 'pickup',
  ARRIVE: 'unload',
  POD: 'pod',
};

export function deleteImage(fileName, imageType, data = {}) {
  const {
    orderCode = '',
    shipmentCode = '',
   } = data;
  const url = buildURL(`/images/${imageType}?orderCode=${orderCode}&shipmentCode=${shipmentCode}&fileName=${fileName}`, URLTypes.MINIPROGRAM);
  return new Promise((resolve, reject) => {
    return fetch(url, {
      method: 'DELETE',
      showLoading: true,
    }).then((resp) => resolve(resp))
      .catch(error => reject(error));
  })
}

export function getOrderItems(data) {
  const {
    orderCode,
    shipmentCode,
  } = data;
  const url = buildURL(`/app-shipments/order?orderCode=${orderCode}&shipmentCode=${shipmentCode}`, URLTypes.MINIPROGRAM);
  return fetch(url);
}

//到货 回单
export function onEvent(data, formId, res) {
  const url = buildURL('/shipments/events/' + getOperation(data.nextStatusCode), URLTypes.MINIPROGRAM);
  wx.hideLoading();
  return fetch(url, {
    method: 'POST',
    showLoading: true,
    data: {
      shipmentCode: data.shipmentCode,
      orderCode: data.orderCode,
      latitudeValue: res.latitude,
      longitudeValue: res.longitude,
      traceDate: transformToServerTime(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
      formId: formId
    }
  })
}
// 签收
export function sign(data, formId, res) {
  const url = buildURL('/shipments/events/sign', URLTypes.MINIPROGRAM);
  return fetch(url, {
    method: 'POST',
    showLoading: true,
    data: {
      shipmentCode: data.shipmentCode,
      orderCode: data.orderCode,
      latitudeValue: res.latitude,
      longitudeValue: res.longitude,
      traceDate: transformToServerTime(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
      formId: formId
    }
  });
}