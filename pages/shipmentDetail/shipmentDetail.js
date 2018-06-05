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
        }).catch((error) => {
          if (error === "showPopup") {
            that.showDialogBtn();
          }
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
