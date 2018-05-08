import {
  ImageTypes,
  uploadImage,
  getImages,
  getOrderItems,
  sign,
  onEvent,
} from './actions';


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
              signin(formId);
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
  onClickUpload: function () {
    const {
      order,
      images
    } = this.data;

  },
  selectImage: function () {
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

        // uploadImage(imageType, data);

        images.push(...res.tempFilePaths);

        this.setData({
          images
        });
      },
    })
  },
  onDelete: function (event) {
    let {
      images = []
    } = this.data;
    const deleteSrc = event.currentTarget.dataset.src;
    if (deleteSrc) {
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
    } else if (initData.imageType === ImageTypes.ARRIVE) {
      getOrderItems(order).then((res) => 
      this.setData({ orderItems: res.orderDetailModelList }))
    }
    getImages(initData.imageType, order);
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
