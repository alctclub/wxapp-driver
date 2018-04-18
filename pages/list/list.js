// pages/list/list.js
import {
  getRunningShipments,
  getHistoryShipments,
} from './actions.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["执行运单", "历史运单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    runningShipments: [],
    historyShipments: [],
    sliderWidth: 128, // tab 下面线的宽度 只是来计算，实际还是在页面上控制的 8em.
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - that.data.sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getListData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getListData().then(
      () => wx.stopPullDownRefresh())
      .catch(() => wx.stopPullDownRefresh());
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getListData: function () {
    if (this.data.activeIndex === 0) {
      return getRunningShipments().then(
        (res) => this.setData({
          runningShipments: res
        }));
    } else {
      return getHistoryShipments().then(
        (res) => this.setData({
          historyShipments: res
        }));
    }
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
      url: `../detail/detail?enterpriseCode=${enterprisecode}&shipmentCode=${shipmentcode}`,
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})