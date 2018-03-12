// pages/list/list.js
import fetch from '../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shipments: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中',
    })
    fetch('/app-shipments', {
      urlType: 'trade'
    }).then((res) => this.setData({ shipments: res }))
    .then(() => wx.hideLoading())
    .catch((e) => wx.hideLoading());
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
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    fetch('/app-shipments', {
      urlType: 'trade'
    }).then((res) => this.setData({ shipments: res }))
    .then(() => wx.hideLoading())
    .then(() => wx.stopPullDownRefresh());
  },

  toDetail: function(event) {
    const { enterprisecode, shipmentcode} = event.currentTarget.dataset;
    wx.showLoading({
      title: '加载中',
    })
    wx.navigateTo({
      url: `../detail/detail?enterpriseCode=${enterprisecode}&shipmentCode=${shipmentcode}`,
      complete: function(res) {
        wx.hideLoading();
      },
    })
  }
})