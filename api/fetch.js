import config  from './config';
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
  const accessToken = wx.getStorageSync('access_Token');
  const finalOpts = {
    url: url,
    method: options.method,
    dataType: options.dataType,
    header: Object.assign({}, {
      'Authorization': `Bearer ${accessToken}`,
      'AccessToken': `Bearer ${accessToken}`,
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
        if (response.data.code !== 0) {
          wx.showToast({
            title: response.data.message || '由于网络等原因导致异常，请检查后重试',
            icon: 'none'
          });
        }
        resolve(response.data);
      } else if (response.statusCode === 401) {
        wx.showToast({
          title: '登录已过期，请关闭小程序后重新打开',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: response.data.message || '由于网络等原因导致异常，请检查后重试',
          icon: 'none'
        });
        reject(response.data);
      }
     
    };

    //失败处理
    finalOpts.fail = (error) => {
      wx.showToast({
        title: '由于网络等原因导致异常，请检查后重试',
        icon: 'none'
      });
      reject(error);
    };
    
    wx.request(finalOpts);
  });
}
