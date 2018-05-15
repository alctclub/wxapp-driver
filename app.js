App({

  onShow: function (options) {
    
    // 接口兼容性检测
    if (wx.getUpdateManager) {
      this.updateMiniprogram();
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法立即应用更新，请升级到最新微信版本后重试。',
        showCancel: false,
        confirmText: '知道了'
      })
    }
  },

  updateMiniprogram: function () {
    const updateManager = wx.getUpdateManager();
    wx.showLoading({
      title: '加载中',
    })
    updateManager.onCheckForUpdate(function (res) {
      wx.hideLoading();
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
      if (res && res.hasUpdate) {
        wx.showLoading({
          title: '加载中',
        })
      }
    })

    updateManager.onUpdateReady(function () {
      wx.hideLoading();
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将启用',
        showCancel: false,
        complete: function (res) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败，请检查网络后重试',
        showCancel: false,
        confirmText: '知道了'
      })
    })
  }
})