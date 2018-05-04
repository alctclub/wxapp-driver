import {
  URLTypes,
  buildURL,
  fetch
} from '../../api/fetch';
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

export function deleteImage(imageType, data) {
  const url = buildURL(`/app-order-images/{UploadSubType}`, URLTypes.TRADE)
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

//提货 到货 回单
export function onEvent(data) {
  const url = buildURL('/app-shipments/events', URLTypes.TRADE);

  return new Promise((resolve, reject) => {

    wx.getLocation({
      success: function (res) {
        regeocoding(res.latitude, res.longitude).then((regResult) => {
          console.log('详细地址', regResult.location);
          console.log('精度', res.accuracy);
          console.log('verticalAccuracy', res.verticalAccuracy);
          console.log('horizontalAccuracy', res.horizontalAccuracy);
          console.log('reglatitude', regResult.baiduLatitude);
          console.log('reglongitude', regResult.baiduLongitude);
          console.log('wxlatitude', res.latitude);
          console.log('wxlongitude', res.longitude);
          const baiduLocation = gcoord.transform([res.latitude, res.longitude],
             gcoord.WGS84, gcoord.Baidu)
          return fetch(url, {
            method: 'PUT',
            showLoading: true,
            data: {
              shipmentCode: data.shipmentCode,
              orderCode: data.orderCode,
              enterpriseCode: data.enterpriseCode,
              latitudeValue: res.latitude,
              longitudeValue: res.longitude,
              location: regResult.location,
              baiduLatitude: baiduLocation[0],
              baiduLongitude: baiduLocation[1],
              time: new Date().toISOString(),
              statusCode: data.nextStatusCode, // It is the same with "nextStatusCode" in model
            }
        }).then((resp) => resolve(resp))
        .catch(error => reject(error));
      });
      },
      fail: (error) => reject(error),
    });
  });
}

function regeocoding(latitude, longitude) {
  const BMAP = new bmap.BMapWX({
    ak: 'yOO4a5RubTLXdWjdkRbbtEn500m02gzR'
  });
  const location = `${latitude},${longitude}`;

  return new Promise((resolve, reject) => {

    const onSuccess = (data) => {
      const result = {
        location: data.wxMarkerData[0].address,
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