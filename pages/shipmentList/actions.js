import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
import {
  getShipmentDisplayStatus,
  moneyFormatter,
  dateFormatter,
} from '../../utils/index';

export function getRunningShipments() {
  const url = buildURL('/shipments', URLTypes.MINIPROGRAM);
  return fetch(url, {
    method: 'GET',
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
  return res.map((item) =>({
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

export function Login(user) {
  const url = buildURL('/login', URLTypes.DRIVER);
  const { username, password } = user;
  wx.clearStorageSync('access_Token');
  return fetch(url, {
    method: 'POST',
    data: {
      loginIdentity: username,
      // password: 'e397433ba52b69656be325c89581b13a',
      password: password,
      verificationCode: '',
      isAuto: false,
      deviceInfo: {
      },
    },
  }).then((response) => onSuccess(response));
};

function onSuccess(response) {
  if (response.access_Token) {
    wx.setStorageSync('access_Token', response.access_Token);
  } else {
    wx.clearStorageSync('access_Token');
    const { errorResult } = response;
    throw new Error(errorResult.code);
  }
}

export function GetSessionId() {
  const url = buildURL('/auth/login', URLTypes.MINIPROGRAM);
  wx.clearStorageSync('sessionId');
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code);
          //发起网络请求
          return fetch(url, {
            method: 'POST',
            data: {
              weixinCode: res.code
            },
          }).then((response) => getSessionIdSuccess(response).then(response => resolve())).catch(error => reject(error));
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  })
};

function getSessionIdSuccess(response) {
  return new Promise((resolve, reject) => {
    if (response.sessionId) {
      wx.setStorageSync('sessionId', response.sessionId);
      console.log('sessionId: ' + response.sessionId);
      resolve();
    } else {
      wx.clearStorageSync('sessionId');
      reject(response);
    }
  })
}

export function signin(formId) {
  wx.getLocation({
    success: function (res) {
      // success
      wx.showToast({
        title: '签到成功',
        icon: 'none'
      });
    },
    fail: function () {
      wx.showToast({
        title: '签到失败',
        icon: 'none'
      })
    }
  });
}