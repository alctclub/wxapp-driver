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

export function getImageNames(imageType, data = {}) {
  const {
    orderCode = '',
      shipmentCode = '',
      enterpriseCode = '',
  } = data;
  const url = buildURL(`/app-order-images/${imageType}/names?orderCode=${orderCode}&shipmentCode=${shipmentCode}&enterpriseCode=${enterpriseCode}`, URLTypes.TRADE);
  return fetch(url);
}

export function getImageByName(imageType, data = {}) {
  const {
    orderCode = '',
      shipmentCode = '',
      enterpriseCode = '',
      filename = '',
  } = data;
  const url = buildURL(`/app-order-images/${imageType}/image?
    orderCode=${orderCode}&shipmentCode=${shipmentCode}&enterpriseCode=
      ${enterpriseCode}&filename=${filename}`, URLTypes.TRADE);
  return fetch(url);
}

export function getImages(imageType, data = {}) {
  const {
    orderCode = '',
      shipmentCode = '',
      enterpriseCode = '',
  } = data;
  const result = [];
  return getImageNames(imageType, data).then((result = {}) => {
    const {
      imageNameList = [],
    } = result;
    return Promise.all(imageNameList.map((filename) =>
      getImageByName(imageType, { ...data,
        filename
      })));
  });
}

export function getOrderItems(data) {
  const {
    orderCode,
    enterpriseCode,
    shipmentCode,
  } = data;
  const url = buildURL(`/app-shipments/order?orderCode=${orderCode}&enterpriseCode=${enterpriseCode}&shipmentCode=${shipmentCode}`, URLTypes.TRADE);
  return fetch(url);
}

//到货 回单
export function onEvent(data, formId) {
  const url = buildURL('/shipments/events/' + getOperation(data.nextStatusCode), URLTypes.MINIPROGRAM);

  return new Promise((resolve, reject) => {
   wx.getLocation({
      success: function (res) {
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
        }).then((resp) => resolve(resp))
          .catch(error => reject(error));
      },
      fail: (error) => reject(error),
    });
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