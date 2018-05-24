import { URLTypes, buildURL, fetch } from '../../api/fetch.js';
var Promise = require('../../libs/es6-promise.min.js');

/**
 * 获取验证码
 */
export function GetVerificationCode(phoneNumber) {
  const url = buildURL('/auth/verification-code/' + phoneNumber, URLTypes.MINIPROGRAM);
  return fetch(url, {
    method: 'GET',
    showLoading: true,
    data: {
    },
  });
}

/**
 * 关联账号
 */
export function Bind(driver) {
  const url = buildURL('/auth/bind', URLTypes.MINIPROGRAM);
  const { phoneNumber, smsVerificationCode } = driver;
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code);
          //发起网络请求
          fetch(url, {
            method: 'POST',
            showLoading: false,
            data: {
              phoneNumber: phoneNumber,
              verificationCode: smsVerificationCode,
              weixinCode: res.code
            },
          }).then(() => resolve()).catch(error => reject(error));
        } else {
          reject(res)
        }
      },
      fail: function (error) {
        reject(error)
      }
    });
  })
}