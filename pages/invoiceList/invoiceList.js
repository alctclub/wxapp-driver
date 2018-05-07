// pages/invoiceList/invoiceList.js

import {
  getUnconfirmInvoiceList,
  confirmDriverInvoice,
} from './actions.js';

Page({
  data: {
    invoiceList: {
      modelList: [],
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
        enterpriseCode,
        driverInvoiceCode,
      },
      formId
    } = event.detail;

    confirmDriverInvoice(enterpriseCode, driverInvoiceCode)
      .then(() =>
        getUnconfirmInvoiceList(1))
      .then(
        (res) => this.setData({
          invoiceList: res,
        }))
      .then(() => wx.showToast({ title: '成功', icon: 'success' }))
      .catch(() => wx.showToast({ title: '失败', icon: 'none' }));
  },
})
