// pages/detail/detail.js
import {
  getShipmentDisplayStatus
} from '../../utils/index';
import {
  getShipmentDetail
} from './actions';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shipment: {},
    options: {},
  },
  onEvent: (event) => {
    const {
      ordercode,
      statuscode,
      shipmentcode,
      enterprisecode
    } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../shipmentEvent/shipmentEvent?orderCode=${ordercode}&shipmentCode=${shipmentcode}&statusCode=${statuscode}`,
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  toDetail: function () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getShipmentDetail(options.enterpriseCode, options.shipmentCode).then((res) => {
      const shipment = res;
      shipment['statusDisplay'] = getShipmentDisplayStatus(shipment.statusCode);
      wx.setStorageSync(`${shipment.shipmentCode}`, shipment);
      this.setData({
        shipment,
        options,
      })
    })
  },
  onShow: function () {
    const { options } = this.data;
    if (! options.enterpriseCode || ! options.shipmentCode) return;
    getShipmentDetail(options.enterpriseCode, options.shipmentCode).then((res) => {
      const shipment = res;
      shipment['statusDisplay'] = getShipmentDisplayStatus(shipment.statusCode);
      wx.setStorageSync(`${shipment.shipmentCode}`, shipment);
      this.setData({
        shipment
      })
    })
  },
  callPhone: function (event) {
    const {
      phonenumber,
      active,
    } = event.currentTarget.dataset;

    if (active) {
      wx.makePhoneCall({
        phoneNumber: phonenumber
      });
    }
  }
})
