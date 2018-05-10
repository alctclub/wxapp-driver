import { URLTypes, buildURL, fetch } from '../../api/fetch.js';

/**
 * 获取验证码
 */
export function GetVerificationCode(phoneNumber) {
  const url = buildURL('/auth/verification-code/' + phoneNumber, URLTypes.MINIPROGRAM);
  return fetch(url, {
    method: 'GET',
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
            data: {
              phoneNumber: phoneNumber,
              verificationCode: smsVerificationCode,
              weixinCode: res.code
            },
          }).then(() => (resolve()));
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  })
}