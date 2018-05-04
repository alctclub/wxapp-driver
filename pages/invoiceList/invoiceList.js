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
    isEnd: false,
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
          isEnd: false,
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
        getUnconfirmInvoiceList(1));
  },
})
