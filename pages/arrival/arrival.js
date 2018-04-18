// pages/arrival/arrival.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    images: [],
  },
  onClickCancel:function() {
    wx.navigateBack();
  },
  onClickUpload: function() {
    const { order, images } = this.data;

  },
  selectImage: function() {
    const { images } = this.data;
    if (images.length > 2) {
      return;
    }
    wx.chooseImage({
      count: 2,
      sourceType: ['camera'],
      success: (res) => {
        images.push([...res.tempFilePaths]);
        this.setData({ images });
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { shipmentCode, orderCode } = options;
    const shipment = wx.getStorageSync(`${shipmentCode}`);
    const order = shipment.orders.find(x => x.orderCode === orderCode);
    this.setData({ order });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})