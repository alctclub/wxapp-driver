import {
  getRunningShipments,
  signin,
} from './actions';
import { GetSessionId } from '../../api/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    runningShipments: [],
    historyShipment: {
      modelList: [],
      currentPage: 1,
      totalPage: 1,
    },
    username: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getSessionId();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    getRunningShipments().then(
        (res) => this.setData({
          runningShipments: res
        })).then(
        () => wx.stopPullDownRefresh())
      .catch(() => wx.stopPullDownRefresh());
  },
  toDetail: function (event) {
    const {
      enterprisecode,
      shipmentcode
    } = event.currentTarget.dataset;
    wx.showLoading({
      title: '加载中',
    })
    wx.navigateTo({
      url: `../shipmentDetail/shipmentDetail?enterpriseCode=${enterprisecode}&shipmentCode=${shipmentcode}`,
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  signin: function (event) {
    const {
      formId
    } = event.detail;

    wx.getSetting({
      success: function(res) {
        if ('scope.userLocation' in res.authSetting) {
          if (res.authSetting['scope.userLocation']) {
            signin(formId);
          } else {
            wx.showToast({
              title: '请打开地理位置信息',
              icon: 'none',
              success: function() {
                wx.openSetting();
              }
            })
           
          }

        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function() {
              signin(formId);
            },
            fail:function() {
              wx.showToast({
                title: '未授权位置信息',
                icon: 'none'
              })
            }
          })
        }
      }

    })
  },

  getSessionId: function (e) {
    GetSessionId().then(() => {
      getRunningShipments().then(
        (res) => this.setData({
          runningShipments: res
        }));
    }).catch((error) => {
      // 如果server返回的code表示司机未绑定，则跳转到绑定页
      if (error.code === 100001) {
        wx.redirectTo({
          url: '../login/login'
        })
      }
    });
  },
})