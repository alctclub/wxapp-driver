import {
  getRunningShipments,
  Login,
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
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // success
        wx.showToast({
          title: '签到成功',
          icon: 'none'
        });
      },
      fail: function () {
        wx.showToast({
          title: '签到失败',
          icon: 'none'
        });
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