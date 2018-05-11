import config  from './config';
import appConfig from './appConfig';
var Promise = require('../libs/es6-promise.min.js');
export const URLTypes = {
  DRIVER: 'driver',
  TRADE: 'trade',
  MINIPROGRAM: 'miniprogram',
};

const baseURL = {
  [URLTypes.DRIVER]: config.driver,
  [URLTypes.TRADE]: config.trade,
  [URLTypes.MINIPROGRAM]: config.miniprogram,
};

export const buildURL = (url, urlType) => `${baseURL[urlType]}${url}`;

export const fetch = (url, options = {}) => {

  const {
    method = 'GET',
      dataType = 'json',
      header = {},
      data = {},
      showLoading = false,
  } = options;

  const sessionId = wx.getStorageSync('sessionId');
  const finalOpts = {
    url: url,
    method: options.method,
    dataType: options.dataType,
    header: Object.assign({}, {
      'SessionId': `${sessionId}`,
    }, options.header),
    data: options.data || null,
  };

  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: '加载中',
      });
      // 请求完成
      finalOpts.complete = () => wx.hideLoading();
    }

    // 成功的处理
    finalOpts.success = (response) => {
      if (response.statusCode === 200) {
        if (response.data.code !== 0 && response.data.code !== 100001) {
          wx.showToast({
            title: response.data.message || '由于网络等原因导致异常，请检查后重试',
            icon: 'none',
            duration: appConfig.duration
          });
          reject(response.data);
        }
        resolve(response.data);
      } else if (response.statusCode === 401) {
        wx.showToast({
          title: '登录已过期，请关闭小程序后重新打开',
          icon: 'none',
          duration: appConfig.duration
        });
        GetSessionId().then(() => {

        })
        reject(response.data);
      } else {
        wx.showToast({
          title: response.data.message || '由于网络等原因导致异常，请检查后重试',
          icon: 'none',
          duration: appConfig.duration
        });
        reject(response.data);
      }
     
    };

    //失败处理
    finalOpts.fail = (error) => {
      wx.showToast({
        title: '由于网络等原因导致异常，请检查后重试',
        icon: 'none',
        duration: appConfig.duration
      });
      reject(error);
    };
    
    wx.request(finalOpts);
  });
};

export const GetSessionId = () => {
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
