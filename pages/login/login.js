// pages/login/login.js
import { Login } from './actions.js';
var interval = null //倒计时函数

Page({

  /**
   * 页面的初始数据
   */
  onLoad: function (options) {

  },

  data: {
    verificationCode: '获取验证码',
    currentTime: 60,
    errorMessage: '',
    opacity: 1,
  },

  bindinput: function (e) {
    this.setData({
      [e.currentTarget.id]: e.detail.value,
      errorMessage: '',
    })
  },

  getVerificationCode: function (e) {
    this.countDown();
  },

  countDown: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      disabled: true,
      opacity: 0.3
    })
    that.setData({
      verificationCode: currentTime + 's'
    });
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        verificationCode: currentTime + 's'
      });
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          verificationCode: '获取验证码',
          currentTime: 60,
          disabled: false,
          opacity: 1
        })
      }
    }, 1000)
  },

  userAgreement: function () {
    wx.navigateTo({
      url: '../userAgreement/userAgreement'
    })
  }
})