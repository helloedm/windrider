// pages/index/idcardup/idcardup.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
const config = require("../../../config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    idcardfront: 'http://youxuan.ecbao.cn/material/1541065357380_42.png',
    idcardafter: 'http://youxuan.ecbao.cn/material/1541065350471_1.png',
    idcardhand: 'http://youxuan.ecbao.cn/material/1541065360761_80.png',
    isshowjump: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  choseimg(e){
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],//可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],//可以指定来源是相册还是相机，默认二者都有
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        if (tempFilePaths[0].size > 2 * 1024 * 1024) {
          wx.showToast({
            icon: 'none',
            title: '图片大小不能超过2M',
          })
          return false;
        }
        wx.showLoading({
          title: '图片正在上传',
        })
        switch (e.currentTarget.dataset.type) {
          case '0':
            _this.setData({
              idcardfront: tempFilePaths
            })
            break;
          case '1':
            _this.setData({
              idcardafter: tempFilePaths
            })
            break;
          case '2':
            _this.setData({
              idcardhand: tempFilePaths
            })
            break;
          default:
            console.log("error imagelogin")
        }
        //上传
        wx.uploadFile({
          url: `${config.host}rider/upload`,
          filePath: tempFilePaths,
          name: 'uploadFile',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res);
          },
          fail: function (err) {
            console.log(err);
            wx.hideLoading()
            if (err.errMsg.indexOf('请求超时') > -1) {
              wx.showToast({
                icon: 'none',
                title: '上传超时，请重新上传图片',
              })
            }
          }
        })
      }
    })
  },
  //暂时跳过
  jumpmoment(){
    this.setData({
      isshowjump : true
    })
  },
  // 
  upload(){
    this.setData({
      isshowjump: false
    })
  },
  //上传审核照片
  upimage(){
    wx.redirectTo({
      url: '../passwordlogin/passwordlogin',
    })
  }
})