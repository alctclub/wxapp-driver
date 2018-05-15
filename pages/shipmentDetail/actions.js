import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
import {
    getShipmentDisplayStatus,
    moneyFormatter,
    dateFormatter,
    isOrderComplete,
    transformToServerTime
  } from '../../utils/index';
var Promise = require('../../libs/es6-promise.min.js');
export function getShipmentDetail(enterpriseCode, shipmentCode) {
    const baseURL = `/shipments/detail/${shipmentCode}`;
    const url = buildURL(baseURL, URLTypes.MINIPROGRAM);
    return fetch(url, {
        showLoading: true,
    }).then((res) => shipmentFormatter(res));
}

function shipmentFormatter(res = {}) {
    let orders = res.orders || [];
    orders = orders.map((item) =>({
        shipmentCode: item.shipmentCode,
        enterpriseCode: item.enterpriseCode,
        orderCode: item.orderCode,
        consignor: item.consignor,
        consignee: item.consignee,
        statusCode: item.statusCode,
        nextStatusCode: item.nextStatusCode,
        pickUpAddress: item.pickUpAddress,
        consignorPhoneNumber: item.consignorPhoneNumber,
        requirePickupStartDate: dateFormatter(item.requirePickupStartDate),
        requirePickupEndDate: dateFormatter(item.requirePickupEndDate),
        arrivalAddress: item.arrivalAddress,
        isSignException: item.isSignException,
        consigneePhoneNumber: item.consigneePhoneNumber,
        requireArrivalStartDate: dateFormatter(item.requireArrivalStartDate),
        requireArrivalEndDate: dateFormatter(item.requireArrivalEndDate),
    }));
    return {
        shipmentCode: res.shipmentCode,
        statusCode: res.statusCode,
        statusDisplay: getShipmentDisplayStatus(res.statusCode),
        startAddress: startAddressFormatter(res.startAddress),
        endAddress: res.endAddress,
        totalVolume: res.totalVolume,
        totalWeight: res.totalWeight,
        enterpriseCode: res.enterpriseCode,
        shipmentCharge: moneyFormatter(res.shipmentCharge),
        shipmentConfirmDate: dateFormatter(res.shipmentConfirmDate),
        licensePlateNumber: res.licensePlateNumber,
        enterpriseName: res.enterpriseName,
        orderTotal: orders.length,
        completeOrderNumber: orders.filter((x) => isOrderComplete(x.statusCode)).length,
        orders,
      };
}

function startAddressFormatter(startAddress) {
    if (startAddress && startAddress.length >9) {
        return startAddress.splice(0, 9).join('...');
    }
    return startAddress;
}

//提货
export function onPickup(data) {
  const url = buildURL('/shipments/events/pickup', URLTypes.MINIPROGRAM);
  wx.showLoading({
    title: '加载中',
  })
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      if (networkType === 'none') {
        wx.showModal({
          content: '由于网络或其它原因导致系统异常，请检查后重试',
          showCancel: false,
          confirmText: '确定'
        })
      }
    }
  })
  return new Promise((resolve, reject) => {
   wx.getSetting({
      success: function (res) {
        if ('scope.userLocation' in res.authSetting) {
          if (res.authSetting['scope.userLocation']) {
            getLocation(data, url).then((resp) => resolve(resp))
              .catch(error => reject(error));
          } else {
            wx.showModal({
              content: '获取不到位置信息，请打开地理位置信息权限后重试',
              confirmText: '确定',
              showCancel: false,
              success: function (imageData) {
                wx.openSetting();
              }
            })
          }

        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function () {
              getLocation(data, url).then((resp) => resolve(resp))
                .catch(error => reject(error));
            },
            fail: function () {
              wx.showToast({
                title: '未授权位置信息',
                icon: 'none',
                duration: appConfig.duration
              })
            }
          })
        }
     },
     complete: function () {
       wx.hideLoading();
     }

    })
  });
}

function getLocation(data, url) {
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
          }
        }).then((resp) => resolve(resp))
          .catch(error => reject(error));
      },
      fail: function (error) {
        wx.showModal({
          content: '获取定位失败，请检查地理位置信息权限或GPS开关是否为启用状态后重试',
          showCancel: false,
          confirmText: '确定',
        })
        reject(error);
      }
    })
  })
}