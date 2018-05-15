App({

  onShow: function (options) {
    /**
     * 接口兼容性检测
     * 基础库 1.9.90 开始支持接口： wx.getUpdateManager
     * 接口wx.getUpdateManager是当前程序基础库版本要求最高的，故检测到设备兼容该接口即可
     */
    if (wx.getUpdateManager) {
      this.updateMiniprogram();
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，建议升级到最新版本的微信后再使用本程序',
        showCancel: false,
        confirmText: '知道了'
      })
    }
  },

  updateMiniprogram: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
      if (res && res.hasUpdate) {
        wx.showLoading({
          title: '加载中',
          mask: true
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
      wx.hideLoading();
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