// pages/index/personalcenter/personalcenter.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    riderInfo:{}
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
    this.setData({
      riderInfo: app.globalData.userInfo
    })
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
  //账户
  account(){
    wx.navigateTo({
      url: '../account/account',
    })
  },
  //order
  order(){
    wx.navigateTo({
      url: '../order/order',
    })
  },
  //规则
  rule(){
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  //客服
  phonecall(){
    wx.makePhoneCall({
      phoneNumber: '18969175595',
    })
  },
  //设置
  setting(){
    wx.navigateTo({
      url: '../setting/setting',
    })
  }
})