import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
import {
    getShipmentDisplayStatus,
    moneyFormatter,
    dateFormatter,
    isOrderComplete,
  } from '../../utils/index';

export function getShipmentDetail(enterpriseCode, shipmentCode) {
    const baseURL = `/app-shipments/${enterpriseCode}/${shipmentCode}`;
    const url = buildURL(baseURL, URLTypes.TRADE);
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