import { Login, GetVerificationCode, Bind } from './actions.js';
var interval = null //倒计时函数

Page({
  data: {
    labelVerificationCode: '获取验证码',
    currentTime: 60,
    opacity: 1,
    phoneNumber: '',
    smsVerificationCode: ''
  },

  /**
   *  输入手机号
   */
  inputPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value,
    })
  },

  /**
   * 输入短信验证码
   */
  inputSmsVerificationCode: function (e) {
    this.setData({
      smsVerificationCode: e.detail.value,
    })
  },

  /**
   * 获取验证码
   */
  getVerificationCode: function (e) {
    if (this.data.phoneNumber === '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
    } else if (this.data.phoneNumber.length !== 11) {
      wx.showToast({
        title: '无效的手机号，请重新输入',
        icon: 'none'
      });
    } else {
      this.countDown();
      //调用server接口
      /*let phoneNumber = this.data.phoneNumber;
      GetVerificationCode(phoneNumber).then(() => {
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        });
      })*/
    }
  },

  /**
   * 倒计时
   */
  countDown: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      disabled: true,
      opacity: 0.3
    })
    that.setData({
      labelVerificationCode: currentTime + 's'
    });
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        labelVerificationCode: currentTime + 's'
      });
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          labelVerificationCode: '获取验证码',
          currentTime: 60,
          disabled: false,
          opacity: 1
        })
      }
    }, 1000)
  },

  /**
   * 验证
   */
  verify: function () {
    if (this.data.phoneNumber === '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
    } else if (this.data.phoneNumber.length !== 11) {
      wx.showToast({
        title: '无效的手机号，请重新输入',
        icon: 'none'
      });
    } else if (this.data.smsVerificationCode === '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
    } else {
      //调用server接口
      /*let { phoneNumber, smsVerificationCode } = this.data;
      Bind({ phoneNumber, smsVerificationCode }).then(() => {
        wx.switchTab({
          url: '../shipmentList/shipmentList'
        })
      })*/
    }
  },

  /**
   * 查看用户协议
   */
  userAgreement: function () {
    wx.navigateTo({
      url: '../userAgreement/userAgreement'
    })
  }
})