// pages/invoiceList/invoiceList.js

import {
  getUnconfirmInvoiceList,
  confirmDriverInvoice,
} from './actions.js';
import appConfig from '../../api/appConfig';

Page({
  data: {
    invoiceList: {
      driverInvoices: [],
      currentPage: 1,
      totalPage: 1,
    },
  },
  onLoad: function () {
    getUnconfirmInvoiceList(this.data.invoiceList.currentPage)
      .then((res) => this.setData({
        invoiceList: res
      }));
  },
  onShow: function() {
    getUnconfirmInvoiceList(this.data.invoiceList.currentPage)
    .then((res) => this.setData({
      invoiceList: res
    }));
  },
  onPullDownRefresh: function () {
    getUnconfirmInvoiceList(1).then(
      (res) => this.setData({
        invoiceList: res,
      })).then(
        () => wx.stopPullDownRefresh())
      .catch(() => wx.stopPullDownRefresh());
  },
  onComfirm: function (event) {
    const {
      value: {
        driverInvoiceCode,
      },
      formId
    } = event.detail;

    confirmDriverInvoice(driverInvoiceCode, formId)
      .then(() =>
        getUnconfirmInvoiceList(1))
      .then(
        (res) => this.setData({
          invoiceList: res,
        }))
      .then(() => wx.showToast({ title: '成功', icon: 'success', duration: appConfig.duration }))
      .catch(() => wx.showToast({ title: '失败', icon: 'none', duration: appConfig.duration }));
  },
})
