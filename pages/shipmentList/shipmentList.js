import { getRunningShipments,  signin, } from './actions';
import { GetSessionId } from '../../api/fetch.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    runningShipments: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getSessionId();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const sessionId = wx.getStorageSync('sessionId');
    if (sessionId) {
      getRunningShipments(true).then(
        (res) => this.setData({
          runningShipments: res
        }));
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    getRunningShipments(false).then(
        (res) => this.setData({
          runningShipments: res
        })).then(
        () => wx.stopPullDownRefresh())
      .catch(() => wx.stopPullDownRefresh());
  },

  toDetail: function (event) {
    const {
      shipmentcode
    } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../shipmentDetail/shipmentDetail?shipmentCode=${shipmentcode}`
    })
  },

  signin: function (event) {
    const { formId } = event.detail;
    signin(formId);
  },

  getSessionId: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.hideTabBar({

    })
    GetSessionId().then(() => {
      wx.hideLoading();
      wx.showTabBar({
        
      })
      getRunningShipments(true).then(
        (res) => this.setData({
          runningShipments: res
        }));
    }).catch((error) => {
      // 如果server返回的code表示司机未绑定，则跳转到绑定页
      if (error.code === 100001) {
        setTimeout(function () {
          wx.redirectTo({
            url: '../login/login',
            complete: function () {
              wx.hideLoading()
            }
          })
        }, 1000)
      } else {
        wx.showTabBar({

        })
        wx.hideLoading()
        wx.showModal({
          content: '由于网络或其它原因导致系统异常，请检查后重试',
          showCancel: false,
          confirmText: '确定'
        })
      }
    });
  },
})