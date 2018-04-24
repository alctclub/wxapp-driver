import { URLTypes, buildURL, fetch } from './fetch.js';
var bmap = require('../../libs/bmap-wx.min.js'); 

//imageType: pickup(提货)、arrive(到货)、pod(签收)
function uploadImage(imageType, data) {
  let reader = new FileReader();
  const BMAP = new bmap.BMapWX({ ak: 'yOO4a5RubTLXdWjdkRbbtEn500m02gzR' });
  reader.onloadend = () => {
    data.fileData = reader.result;
    const picExt = fileName.substr(fileName.lastIndexOf(".") + 1);

    const address = BMAP
    wx.getLocation({
      success: function (res) {
        const url = buildURL(`/app-order-images/${imageType}`, URLTypes.TRADE);
        return fetch(url, {
          data: {
            shipmentCode: data.shipmentCode,
            enterpriseCode: data.enterpriseCode,
            uploadType: 'order',
            orderCode: data.orderCode,
            uploadSubType: imageType, //pickup, arrive, pod
            fileName: Date.now(),
            fileExt: picExt,
            isUnique: true,
            fileData: data.fileData,
            latitudeValue: res.latitude,
            longitudeValue: res.longitude,
            location: res.location,
            fromCamera: true,
            imageTakenDate: new Date().toISOString(),
          }
        })
      },
      fail: function (error) {
        wx.showModal({
          title: '',
        })
      },
    });
  }
  reader.readAsDataURL(data.imageURL);
}