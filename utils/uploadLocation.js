import fetch from './api.js';

function uploadLocation() {
  const mobilePhone = wx.getStorageSync('monilePhone');
  let locations = wx.getStorageSync('localtions') || [];
  if (! Array.isArray(locations)) {
    locations = [];
  }
  wx.getLocation({
    success: function(res) {
      console.log(`${new Date()} : ${res.latitude} ${res.longitude}`);
      locations.push({
        traceTime: new Date().toISOString(),
        gpsLatitude: res.latitude,
        gpsLongitude: res.longitude,
      })
      fetch('/trace/phone', {
        urlType: 'driver',
        method: 'POST',
        data: {
          mobilePhone,
          locations,
        }
      }).then(() => {
        wx.removeStorageSync('localtions');
      }).catch(() => {
        wx.setStorageSync('localtions', locations);
      })
    },
  })
}

export default uploadLocation;