// pages/invoiceList/invoiceList.js

import {
  getUnconfirmInvoiceList,
  getConfirmedInvoiceList,
} from './actions.js';

Page({
  data: {
    currentPage: 1,
    invoiceList: {
      modelList: [],
      currentPage: 1,
      totalPage: 1,
    },
  },
  onLoad: function () {
    getConfirmedInvoiceList(this.data.currentPage)
      .then((res) => this.setData({ invoiceList: res}));
  },
})
