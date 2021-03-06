import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
import { appConfig } from '../../api/config';
import {
    getShipmentDisplayStatus,
    moneyFormatter,
    dateFormatter,
    isOrderComplete,
    transformToServerTime,
    weightFormatter,
    volumeFormatter,
    checkNetwork
  } from '../../utils/index';
var Promise = require('../../libs/es6-promise.min.js');
export function getShipmentDetail(shipmentCode) {
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
        totalVolume: volumeFormatter(res.totalVolume),
        totalWeight: weightFormatter(res.totalWeight),
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
    mask: true
  })

  return new Promise((resolve, reject) => {
    return checkNetwork().then(() => {
      wx.getSetting({
        success: function (res) {
          if ('scope.userLocation' in res.authSetting) {
            if (res.authSetting['scope.userLocation']) {
              getLocation(data, url).then((resp) => resolve(resp))
                .catch(error => reject(error));
            } else {
              wx.hideLoading();
              reject("showPopup");
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
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            content: '由于网络或其它原因导致系统异常，请检查后重试',
            showCancel: false,
            confirmText: '确定'
          })
        }
      })

    }).catch(() => {
      wx.hideLoading();
      wx.showModal({
        content: '由于网络或其它原因导致系统异常，请检查后重试',
        showCancel: false,
        confirmText: '确定'
      })
    })
  });
}

function getLocation(data, url) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      success: function (res) {
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
          }
        }).then((resp) => resolve(resp))
          .catch(error => reject(error));
      },
      fail: function (error) {
        wx.hideLoading();
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