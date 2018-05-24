// pages/detail/detail.js
import {
  getShipmentDisplayStatus
} from '../../utils/index';
import {
  getShipmentDetail , onPickup
} from './actions';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shipment: {},
    options: {},
  },
  onEvent: function(event) {
    const that = this;
    const {
      ordercode,
      statuscode,
      shipmentcode,
    } = event.currentTarget.dataset;
    if (statuscode === 20) {
      onPickup({
        shipmentCode: shipmentcode,
        orderCode: ordercode,
        nextStatusCode: 30
      }).then(() => {
        getShipmentDetail(shipmentcode).then((res) => {
          const shipment = res;
          shipment['statusDisplay'] = getShipmentDisplayStatus(shipment.statusCode);
          wx.setStorageSync(`${shipment.shipmentCode}`, shipment);
          that.setData({
            shipment
          })
        })
        })
    } else {
      wx.navigateTo({
        url: `../shipmentEvent/shipmentEvent?orderCode=${ordercode}&shipmentCode=${shipmentcode}&statusCode=${statuscode}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getShipmentDetail(options.shipmentCode).then((res) => {
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
    if (! options.shipmentCode) return;
    getShipmentDetail(options.shipmentCode).then((res) => {
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
