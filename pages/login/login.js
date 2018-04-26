// pages/login/login.js
import { Login } from './actions.js';
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  onLoad: function (options) {
    const accessToken = wx.getStorageSync('access_Token');
    if (accessToken) {
      wx.switchTab({
        url: '../shipmentList/shipmentList'
      })
    }
  },
  data: {
    username: '',
    password: '',
    verificationCode: '获取验证码',
    currentTime: 60,
    errorMessage: '',
  },
  bindinput: function (e) {
    this.setData({
      [e.currentTarget.id]: e.detail.value,
      errorMessage: '',
    })
  },
  login: function (e) {

    let { username, password } = this.data;
    Login({
      username: 'D00000281',
      password: 'e10adc3949ba59abbe56e057f20f883e',
    }).then(() =>
      wx.switchTab({
        url: '../shipmentList/shipmentList',
      })).catch((error) => {
        this.setData({
          errorMessage: error.errMsg,
        });
      });
  },
  getVerificationCode: function (e) {
    this.countDown();
  },

  countDown: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      disabled: true
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
          disabled: false
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