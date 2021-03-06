import {
  ImageTypes,
  getOrderItems,
  sign,
  onEvent,
  deleteImage,
} from './actions';
import { environment } from '../../api/config';
import { GetSessionId } from '../../api/fetch';
import { transformToServerTime, checkNetwork } from '../../utils/index';
var Promise = require('../../libs/es6-promise.min.js');
import { appConfig } from '../../api/config';

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
    formId:'',
    popup: {
      showModal: false,
      message: "",
      confirmText: ""
    }
  },
  /**
  * 显示模态对话框
  */
  showDialogBtn: function () {
    this.setData({
      popup: {
        showModal: true,
        message: "获取不到位置信息，请打开地理位置信息权限后重试",
        confirmText: "确定"
      }
    })
  },
  /**
  * 隐藏模态对话框
  */
  hideModal: function () {
    this.setData({
      popup: {
        showModal: false,
        message: "",
        confirmText: ""
      }
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
  * 对话框确认按钮点击事件
  */
  onConfirm: function () {
    this.hideModal();
  },

  onClickCancel: function () {
    wx.navigateBack();
  },
  onClickComfirm: function(event) {
    const { order, orderItems, images} = this.data;
    const that = this;
    if (images && images.length == 0) {
      wx.showToast({
        title: '请上传至少一张照片',
        icon: 'none',
        duration: appConfig.duration
      })
      return;
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    this.setData({
      formId: event.detail.formId
    })

    checkNetwork().then(() => {
      if (order.statusCode === 50) {
        that.getLocationWithoutCheck();
      } else {
        that.checkLocationPermission();
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showModal({
        content: '由于网络或其它原因导致系统异常，请检查后重试',
        showCancel: false,
        confirmText: '确定'
      })
    });
  }, 

  checkLocationPermission: function () {
    const that = this;
    wx.getSetting({
      success: function (res) {
        if ('scope.userLocation' in res.authSetting) {
          if (res.authSetting['scope.userLocation']) {
            that.getLocation();
          } else {
            wx.hideLoading();
            that.showDialogBtn();
          }

        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function () {
              that.getLocation();
            },
            fail: function () {
              wx.showToast({
                title: '未授权位置信息',
                icon: 'none',
                duration: appConfig.duration
              })
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          content: '由于网络或其它原因导致系统异常，请检查后重试',
          showCancel: false,
          confirmText: '确定'
        })
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
          orderCode: order.orderCode,
          imageURL: res.tempFilePaths[0],
        }

        images.push(...res.tempFilePaths);

        this.setData({
          images
        });
      },
    })
  },

  getLocation: function () {
    const that = this;
    const { images } = this.data;
    wx.getLocation({
      success: function (res) { 
        if (res && res.latitude && res.longitude) {
          console.log('latitude: ' + res.latitude + ' longitude: ' + res.longitude);
          that.uploadImage(images, res);
        } else {
          wx.hideLoading();
          wx.showModal({
            content: '获取不到位置信息, 拍摄的照片无法满足开票要求, 建议重试',
            confirmText: '确定',
            showCancel: false,
          })
        }
      },
      fail: function (error) {
        wx.hideLoading();
        wx.showModal({
          content: '获取定位失败，请检查地理位置信息权限或GPS开关是否为启用状态后重试',
          showCancel: false,
          confirmText: '确定',
        })
        reject(error);
      },
    })
  },

  getLocationWithoutCheck: function () {
    const that = this;
    const { images } = this.data;

    wx.getLocation({
      complete: function (res) {
        that.uploadImage(images, res);
      }
    })
  },

  uploadImage: function (tempFilePaths, res) {
    const that = this;
    const {
      order,
      imageType,
      formId,
    } = this.data;
    const sessionId = wx.getStorageSync('sessionId');
    const promises = tempFilePaths.map(function (tempFilePath) {
      return that.uploadFile({
        order,
        imageType,
        sessionId,
        tempFilePath,
        res
      });
    });
    return Promise.all(promises).then(() => onEvent(order, formId, res))
      .then(() => {
          if (`${order.statusCode}` === '30') {
            return sign(order, formId, res);
          } else {
            return true;
          }
        }).then(() => wx.navigateBack());
  },

  uploadFile: function (tempData) {
    const that = this;
    const {
      order,
      imageType,
      sessionId,
      tempFilePath,
      res
    } = tempData;

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: environment.image,
        filePath: tempFilePath,
        header: {
          SessionId: sessionId
        },
        name: 'myImage',
        formData: {
          orderCode: order.orderCode,
          shipmentCode: order.shipmentCode,
          fileName: tempFilePath.substring(11),
          fileExt: 'jpg',
          latitude: res.latitude,
          longitude: res.longitude,
          imageTakenDate: transformToServerTime(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
          imageType: imageType
        },
        success: function (response) {
          if (response.statusCode === 200) {
            const resData = JSON.parse(response.data);
            
            if (resData.code !== 0) {
              wx.hideLoading();
              wx.showModal({
                content: resData.message || '由于网络或其它原因导致系统异常，请检查后重试',
                showCancel: false,
                confirmText: '确定'
              })
              reject();
            }
            resolve();
          } else if (response.statusCode === 401) {
            wx.hideLoading();
            GetSessionId().then(() => {
              const sessionId = wx.getStorageSync('sessionId');
              tempData.sessionId = sessionId;
              that.uploadFile(tempData).then(() => resolve()).catch(() => reject());
            }).catch(() => reject())
          } else {
            wx.hideLoading();
            wx.showModal({
              content: '照片上传失败',
              showCancel: false,
              confirmText: '确定'
            })
            reject();
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            content: '由于网络或其它原因导致系统异常，请检查后重试',
            showCancel: false,
            confirmText: '确定'
          })
          reject();
        }
      })
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
      //const fileName = deleteSrc.substring(11);
      //deleteImage(fileName, imageType, order);
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
