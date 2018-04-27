import { URLTypes, buildURL, fetch } from '../../api/fetch.js';

/**
 * 获取验证码
 */
export function GetVerificationCode(phoneNumber) {
  const url = buildURL('/verification-code', URLTypes.DRIVER);
  return fetch(url, {
    method: 'POST',
    data: {
      phoneNumber : phoneNumber,
    },
  });
}

/**
 * 关联账号
 */
export function Bind(driver) {
  const url = buildURL('/bind', URLTypes.DRIVER);
  const { phoneNumber, smsVerificationCode } = driver;
  return fetch(url, {
    method: 'POST',
    data: {
      phoneNumber : phoneNumber,
      smsVerificationCode : smsVerificationCode,
    },
  });
}