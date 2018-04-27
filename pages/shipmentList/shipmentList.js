import {
  getRunningShipments,
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    getRunningShipments().then(
      (res) => this.setData({
        runningShipments: res
      }));
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
  signin: function () {
    wx.showToast({
      title: '签到成功',
      icon: 'none'
    });
  }
})