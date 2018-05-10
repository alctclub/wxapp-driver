import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
import {
    getShipmentDisplayStatus,
    moneyFormatter,
    dateFormatter,
    isOrderComplete,
    transformToServerTime
  } from '../../utils/index';

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
      fail: (error) => reject(error),
    });
  });
}