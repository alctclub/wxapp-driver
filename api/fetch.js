export const URLTypes = {
  DRIVER: 'driver',
  TRADE: 'trade',
};

const baseURL = {
  [URLTypes.DRIVER]: 'https://dapi-staging.alct56.com/api/v1/driver',
  [URLTypes.TRADE]: 'https://xapi-staging.alct56.com/api/v1/trade',
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

  const accessToken = wx.getStorageSync('access_Token');
  const finalOpts = {
    url: url,
    method: options.method,
    dataType: options.dataType,
    header: Object.assign({}, {
      'Authorization': `Bearer ${accessToken}`,
      'AccessToken': `Bearer ${accessToken}`,
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
        resolve(response.data);
      } else if (response.statusCode === 401) {
        wx.removeStorageSync('access_Token')
        wx.redirectTo({
          url: '/pages/login/login',
        });
      }
      reject(response.data);
    };

    //失败处理
    finalOpts.fail = (error) => {
      wx.showToast({
        title: error.Message,
        icon: 'none'
      });
      reject(error);
    };



    wx.request(finalOpts);
  });
}
