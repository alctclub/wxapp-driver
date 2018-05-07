import {
  getRunningShipments,
  Login,
  signin,
} from './actions';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    runningShipments: [],
    historyShipment: {
      modelList: [],
      currentPage: 1,
      totalPage: 1,
    },
    username: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    const accessToken = wx.getStorageSync('access_Token');
    if (accessToken) {
      getRunningShipments().then(
        (res) => this.setData({
          runningShipments: res
        }));
    } else {
      this.login();
    }
  },
  onShow: function() {
    const accessToken = wx.getStorageSync('access_Token');
    if (accessToken) {
      getRunningShipments().then(
        (res) => this.setData({
          runningShipments: res
        }));
    } else {
      this.login();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    getRunningShipments().then(
        (res) => this.setData({
          runningShipments: res
        })).then(
        () => wx.stopPullDownRefresh())
      .catch(() => wx.stopPullDownRefresh());
  },
  toDetail: function (event) {
    const {
      enterprisecode,
      shipmentcode
    } = event.currentTarget.dataset;
    wx.showLoading({
      title: '加载中',
    })
    wx.navigateTo({
      url: `../shipmentDetail/shipmentDetail?enterpriseCode=${enterprisecode}&shipmentCode=${shipmentcode}`,
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  signin: function (event) {
    const {
      formId
    } = event.detail;

    wx.getSetting({
      success: function(res) {
        if ('scope.userLocation' in res.authSetting) {
          if (res.authSetting['scope.userLocation']) {
            signin(formId);
          } else {
            wx.showToast({
              title: '请打开地理位置信息',
              icon: 'none',
              success: function() {
                wx.openSetting();
              }
            })
           
          }

        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function() {
              signin(formId);
            },
            fail:function() {
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

  login: function (e) {
    let {
      username,
      password
    } = this.data;
    Login({
      username: 'D00000281',
      password: 'e10adc3949ba59abbe56e057f20f883e',
    }).then(() => {
      getRunningShipments().then(
        (res) => this.setData({
          runningShipments: res
        }));
    }).catch((error) => {
      // 如果server返回的code表示司机未绑定，则跳转到绑定页
    });
  },
})