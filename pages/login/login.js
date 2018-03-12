// pages/login/login.js
import fetch from '../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
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
    username = 'D00000281'
    wx.clearStorageSync('access_Token');
    wx.showLoading({
      title: '加载中',
    })
    fetch('/login', {
      method: 'POST',
      urlType: 'driver',
      data: {
        loginIdentity: username,
        // password: 'e397433ba52b69656be325c89581b13a',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        verificationCode: '',
        isAuto: false,
        deviceInfo: {
        }
      },
    }).then((response) => {
      if (response.access_Token) {
        wx.setStorageSync('access_Token', response.access_Token);
        wx.setStorageSync('monilePhone', username);
        wx.navigateTo({
          url: '../list/list',
        });
      } else {
        wx.hideLoading();
        wx.clearStorageSync('access_Token');
        const { errorResult } = response;
        this.setData({
          errorMessage: errorResult.message,
        });
        
      }
    }).catch((error) => {
      wx.hideLoading()
      wx.showToast({ title: '登录失败' });
      wx.clearStorageSync('access_Token');
    });
  }
})