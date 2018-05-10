import {
  URLTypes,
  buildURL,
  fetch
} from '../../api/fetch';
import {
  getOperation
} from '../../utils/index';

var bmap = require('../../libs/bmap-wx.min.js');
var gcoord = require('../../libs/gcoord.js');

export const ImageTypes = {
  PICKUP: 'pickup',
  ARRIVE: 'arrive',
  POD: 'pod',
};

//imageType: pickup(提货)、arrive(到货)、pod(回单)
export function uploadImage(imageType, data) {
  const {
    shipmentCode,
    enterpriseCode,
    orderCode,
    imageURL,
  } = data;

  const picExt = imageURL.substr(imageURL.lastIndexOf(".") + 1);
  let reader = new FileReader();
  const BMAP = new bmap.BMapWX({
    ak: 'yOO4a5RubTLXdWjdkRbbtEn500m02gzR'
  });
  wx.getLocation({
    success: function (res) {
      const location = `${res.latitude},${res.longitude}`;
      const regeocodingSuccess = (res) => {
        const result = res.wxMarkerData[0].address;
      }
      const address = BMAP.regeocoding({
        location,
        success: regeocodingSuccess,
      })
    }
  });

  reader.onloadend = () => {
    data.fileData = reader.result;
    const picExt = fileName.substr(fileName.lastIndexOf(".") + 1);


    wx.getLocation({
      success: function (res) {
        const url = buildURL(`/app-order-images/${imageType}`, URLTypes.TRADE);
        const location = `${res.latitude},${res.longitude}`;
        const regeocodingSuccess = (data) => {
          wxMarkerData = data.wxMarkerData;
        }
        const address = BMAP.regeocoding({
          location,
          success: regeocodingSuccess,
        })

        return fetch(url, {
          data: {
            shipmentCode: shipmentCode,
            enterpriseCode: enterpriseCode,
            uploadType: 'order',
            orderCode: orderCode,
            uploadSubType: imageType, //pickup, arrive, pod
            fileName: Date.now(),
            fileExt: picExt,
            isUnique: true,
            fileData: data.fileData,
            latitudeValue: res.latitude,
            longitudeValue: res.longitude,
            location: res.location,
            fromCamera: true,
            imageTakenDate: new Date().toISOString(),
          }
        })
      }
    });
  }
}

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
export function onEvent(data) {
  const url = buildURL('/shipments/events/' + getOperation(data.nextStatusCode), URLTypes.MINIPROGRAM);

  return new Promise((resolve, reject) => {

    wx.getLocation({
      success: function (res) {
        regeocoding(res.latitude, res.longitude).then((regResult) => {
          const baiduLocation = gcoord.transform([res.latitude, res.longitude],
             gcoord.WGS84, gcoord.Baidu)
          return fetch(url, {
            method: 'POST',
            showLoading: true,
            data: {
              shipmentCode: data.shipmentCode,
              orderCode: data.orderCode,
              latitudeValue: res.latitude,
              longitudeValue: res.longitude,
              traceDate: new Date().toISOString(),
            }
        }).then((resp) => resolve(resp))
        .catch(error => reject(error));
      });
      },
      fail: (error) => reject(error),
    });
  });
}
// 签收
export function sign(data) {
  const url = buildURL('/shipments/events/sign', URLTypes.MINIPROGRAM);
  return regeocoding().then((res) => fetch(url, {
    method: 'POST',
    showLoading: true,
    data: {
      shipmentCode: data.shipmentCode,
      orderCode: data.orderCode,
      latitudeValue: res.latitudeValue,
      longitudeValue: res.longitudeValue,
      traceDate: new Date().toISOString(),
    }
  }));

}

function regeocoding() {
  const BMAP = new bmap.BMapWX({
    ak: 'yOO4a5RubTLXdWjdkRbbtEn500m02gzR'
  });
  return new Promise((resolve, reject) => {

    const onSuccess = (data) => {
      const result = {
        location: data.wxMarkerData[0].address,
        latitudeValue: data.wxMarkerData[0].latitude,
        longitudeValue: data.wxMarkerData[0].longitude,
        baiduLatitude: data.originalData.result.location.lat,
        baiduLongitude: data.originalData.result.location.lng,
      }
      resolve(result);
    }
    BMAP.regeocoding({
      success: (res) => onSuccess(res),
      fail: (error) => reject(error),
    });
  });
}