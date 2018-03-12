const baseurl = {
  driver: 'https://dapi-staging.alct56.com/api/v1/driver',
  trade: 'https://xapi-staging.alct56.com/api/v1/trade'
}

const fetch = (url, options = {
  urlType: 'driver',
  method: 'GET',
  dataType: 'json'
}) => {
  
  const accessToken = wx.getStorageSync('access_Token');
  const finalOpts = {
    url: `${baseurl[options.urlType]}${url}`,
    method: options.method || 'GET',
    dataType: options.dataType || 'json',
    header: {
      'Authorization': `Bearer ${accessToken}`
    },
    data: options.data || null,
  };

  return new Promise((resolve, reject) => {
    finalOpts.success = (response) => {
      if (response.statusCode === 200) {
        resolve(response.data);
      } else if (response.statusCode === 401){
        wx.redirectTo({
          url: 'pages/login/login',
        })
        reject(response.data);
      }
    };
    finalOpts.fail = (error) => {
      reject(error);
    };
    wx.request(finalOpts);
  });
}

export default fetch;