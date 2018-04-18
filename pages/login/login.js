// pages/login/login.js
import { Login } from './actions.js';

Page({

  /**
   * 页面的初始数据
   */
  onLoad: function (options) {
    const accessToken = wx.getStorageSync('access_Token');
    if (accessToken) {
      wx.redirectTo({
        url: '../list/list',
      })
    }
  },
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
    Login({
      username: 'D00000281',
      password: 'e10adc3949ba59abbe56e057f20f883e',
    }).then(() =>
      wx.redirectTo({
        url: '../list/list',
      })).catch((error) => {
      this.setData({
        errorMessage: error.errMsg,
      });
    });
  }
})