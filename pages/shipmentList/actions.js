import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
import {
  getShipmentDisplayStatus,
  moneyFormatter,
  dateFormatter,
  weightFormatter,
  volumeFormatter
} from '../../utils/index';
import appConfig from '../../api/appConfig';

export function getRunningShipments(isLoading) {
  const url = buildURL('/shipments', URLTypes.MINIPROGRAM);
  return fetch(url, {
    showLoading: isLoading,
    method: 'GET',
  }).then((res) => shipmentFormatter(res));;
};

function shipmentFormatter(res = []) {
  const shipmentList = res.shipments;
  const tempList = [];
  for (var i = shipmentList.length - 1; i >= 0; i--) {
   if (shipmentList[i].statusCode === 50) {
      tempList.push(shipmentList[i]);
      shipmentList.splice(i,1);
    }
  }

  for (var m = shipmentList.length - 1; m >= 0; m--) {
     if (shipmentList[m].statusCode < 25) {
      tempList.push(shipmentList[m]);
      shipmentList.splice(m,1);
    }
  }

  for (var n = tempList.length - 1; n >= 0; n--) {
    shipmentList.push(tempList[n]);
  }

  return shipmentList.map((item) =>({
    shipmentCode: item.shipmentCode,
    statusDisplay: getShipmentDisplayStatus(item.statusCode),
    startAddress: item.startAddress,
    endAddress: item.endAddress,
    totalVolume: volumeFormatter(item.totalVolume),
    totalWeight: weightFormatter(item.totalWeight),
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