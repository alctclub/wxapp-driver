// pages/detail/detail.js
import { getShipmentDisplayStatus } from '../../utils/index';
import { getShipmentDetail } from './actions';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shipment: {}
  },
  onEvent: (event) => {
    const { ordercode, statuscode, shipmentcode } = event.currentTarget.dataset;
    if (`${statuscode}` === '30') {
      wx.navigateTo({
        url: `../arrival/arrival?orderCode=${ordercode}&shipmentCode=${shipmentcode}`,
        complete: function (res) {
          wx.hideLoading();
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getShipmentDetail(options.enterpriseCode, options.shipmentCode).then((res) => {
      const shipment = res;
      shipment['statusDisplay'] = getShipmentDisplayStatus(shipment.statusCode);
      wx.setStorageSync(`${shipment.shipmentCode}`, shipment);
      this.setData({ shipment })})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
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
  
  }
})