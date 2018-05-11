import {
  ImageTypes,
  uploadImage,
  getImages,
  getOrderItems,
  sign,
  onEvent,
  deleteImage,
} from './actions';
import config from '../../api/config';
import {
  transformToServerTime
} from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    images: [],
    orderItems: [],
    pickUpOrderItem: {
      orderExpandItems: [],
      orderUnexpandItems: [],
    },
    imageLimit: 4,
    statusCode: '',
    isExpand: false,
  },
  onClickCancel: function () {
    wx.navigateBack();
  },
  onClickComfirm: function(event) {
    const { order, orderItems } = this.data;
    const { formId } = event.detail;

    wx.getSetting({
      success: function (res) {
        if ('scope.userLocation' in res.authSetting) {
          if (res.authSetting['scope.userLocation']) {
            onEvent(order)
              .then(() => {
                if (`${order.statusCode}` === '30') {
                  return sign({ ...order, ...{ goodsList: orderItems } });
                }
                return true;
              })
              .then(() => wx.navigateBack());
          } else {
            wx.showToast({
              title: '请打开地理位置信息',
              icon: 'none',
              success: function () {
                wx.openSetting();
              }
            })
          }
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function () {
              onEvent(order)
                .then(() => {
                  if (`${order.statusCode}` === '30') {
                    return sign({ ...order, ...{ goodsList: orderItems } });
                  }
                  return true;
                })
                .then(() => wx.navigateBack());
            },
            fail: function () {
              wx.showToast({
                title: '未授权位置信息',
                icon: 'none'
              })
            }
          })
        }
      }
    })

  },

  selectImage: function () {
    var that = this;
    const {
      images,
      imageLimit,
      imageType,
      order,
    } = this.data;
    if (images.length >= imageLimit) {
      return;
    }
    wx.chooseImage({
      count: imageLimit - images.length,
      sourceType: ['camera'],
      success: (res) => {
        const ctx = wx.createCanvasContext('myCanvas');
        const data = {
          shipmentCode: order.shipmentCode,
          enterpriseCode: order.enterpriseCode,
          orderCode: order.orderCode,
          imageURL: res.tempFilePaths[0],
        }

        const imageData = res;

        wx.getSetting({
          success: function (res) {
            if ('scope.userLocation' in res.authSetting) {
              if (res.authSetting['scope.userLocation']) {
                that.getLocation(imageData);
              } else {
                wx.showModal({
                  content: '获取不到位置信息，请打开地理位置信息权限后重试',
                  confirmText: '确定',
                  showCancel: false,
                  success: function (imageData) {
                    wx.openSetting();
                  }
                })
              }

            } else {
              wx.authorize({
                scope: 'scope.userLocation',
                success: function () {
                  that.getLocation(imageData);
                },
                fail: function () {
                  wx.showToast({
                    title: '未授权位置信息',
                    icon: 'none'
                  })
                }
              })
            }
          }

        })
        
        images.push(...res.tempFilePaths);

        this.setData({
          images
        });
      },
    })
  },

  getLocation: function (imageData) {
    const that = this;
    const {
      order,
      imageType,
    } = this.data;
    wx.getLocation({
      success: function (res) {
        if (res && res.latitude && res.longitude) {
          console.log('latitude: ' + res.latitude + ' longitude: ' + res.longitude);
          const tempFilePaths = imageData.tempFilePaths
          const sessionId = wx.getStorageSync('sessionId');
          wx.uploadFile({
            url: config.image,
            filePath: tempFilePaths[0],
            header: {
              SessionId: sessionId
            },
            name: 'myImage',
            formData: {
              orderCode: order.orderCode,
              shipmentCode: order.shipmentCode,
              fileName: tempFilePaths[0].substring(11),
              fileExt: 'jpg',
              latitude: res.latitude,
              longitude: res.longitude,
              imageTakenDate: transformToServerTime(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
              imageType: imageType
            },
            success: function (res) {
              //do something
            }
          })

        } else {
          wx.showModal({
            content: '获取不到位置信息, 拍摄的照片无法满足开票要求, 建议重试',
            confirmText: '确定',
            showCancel: false,
          })
        }
      }
    })
  },

  onDelete: function (event) {
    let {
      images = [],
      order,
      imageType,
    } = this.data;
    const deleteSrc = event.currentTarget.dataset.src;
    if (deleteSrc) {
      const fileName = deleteSrc.substring(11);
      deleteImage(fileName, imageType, order);
      images = images.filter((x => x !== deleteSrc));
      this.setData({
        images
      });
    }
  },

  showMore: function() {
    this.setData({
      isExpand: true,
    });
  },

  collapse: function() {
    this.setData({
      isExpand: false,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      shipmentCode,
      orderCode,
      statusCode
    } = options;
    const shipment = wx.getStorageSync(`${shipmentCode}`);
    const order = shipment.orders.find(x => x.orderCode === orderCode);
    const initData = this.initByStatusCode(statusCode);
    if (initData.imageType === ImageTypes.PICKUP) {
      getOrderItems(order).then((res) =>
        this.setData({
          pickUpOrderItem: {
            orderExpandItems: res.orderDetailModelList,
            orderUnexpandItems: res.orderDetailModelList.splice(0, 3),
          },
          isExpand:false,
        }));
    } 
    //getImages(initData.imageType, order);
    this.setData({
      order,
      statusCode,
      ...initData,
    });
  },

  initByStatusCode: function (statusCode) {
    if (`${statusCode}` === '30') {
      wx.setNavigationBarTitle({
        title: '到货',
      });
      return {
        headerTip: '上传卸货照片',
        confimrText: '确认到货',
        imageLimit: 2,
        imageType: ImageTypes.ARRIVE,
      };
    } else if (`${statusCode}` === '50') {
      wx.setNavigationBarTitle({
        title: '回单',
      });
      return {
        headerTip: '上传回单照片',
        confimrText: '确认回单',
        imageLimit: 4,
        imageType: ImageTypes.POD,
      };
    } else if (`${statusCode}` === '20') {
      wx.setNavigationBarTitle({
        title: '提货',
      });
      return {
        headerTip: '上传提货照片',
        confimrText: '确认提货',
        imageLimit: 4,
        imageType: ImageTypes.PICKUP,
      };
    }
  },
})
