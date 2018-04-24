// pages/invoiceList/invoiceList.js

import {
  getUnconfirmInvoiceList,
  getConfirmedInvoiceList,
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
  onReachBottom: function () {
    const {
      invoiceList,
    } = this.data;

    if (invoiceList.currentPage < invoiceList.totalPage) {
      getConfirmedInvoiceList(invoiceList.currentPage + 1).then(
        (res) => this.setData({
          invoiceList: {
            modelList: [...invoiceList.modelList, ...res.modelList],
            currentPage: res.currentPage,
            totalPage: res.totalPage,
          },
        }));
    } else {
      this.setData({
        isEnd: true,
      });
    }
  },
  onComfirm: function (event) {
    const {
      enterprisecode,
      driverinvoicecode
    } = event.currentTarget.dataset;

    confirmDriverInvoice(enterprisecode, driverinvoicecode)
      .then(() =>
        getUnconfirmInvoiceList(1));
  },
})
