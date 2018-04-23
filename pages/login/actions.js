import { URLTypes, buildURL, fetch } from '../../api/fetch.js';

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
    throw new Error(errorResult.message);
  }
}