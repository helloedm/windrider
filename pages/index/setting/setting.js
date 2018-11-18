// pages/index/setting/setting.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshowjump:false,
    phone:'',
    workzone:'',
    waiter:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo.agentInfo.agentName)
    this.setData({
      phone: app.globalData.userInfo.phone,
      workzone: app.globalData.userInfo.agentInfo.codeName,
      waiter: app.globalData.userInfo.agentInfo.agentName,
    })
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
  //当前账号
  changeaccount(){
    wx.navigateTo({
      url: '../changeaccount/changeaccount',
    })
  },
  //修改密码
  changepassword(){
    wx.navigateTo({
      url: '../changepassword/changepassword',
    })
  },
  backaccount(){
    this.setData({
      isshowjump: true
    })
  },
  //退出登录
  sure(){
    this.setData({
      isshowjump: false
    })
    netWork.post('sso/logout',{
      riderInfoId: app.globalData.userInfo.id
    },(res)=>{
      console.log(res)
      if (res.status == 200){
        wx.reLaunch({
          url: '../passwordlogin/passwordlogin?type=logout',
        })
        wx.setStorageSync('logout','logout')
      }
    })
  },
  no(){
    this.setData({
      isshowjump: false
    })
  },
  upidcard(){
    wx.navigateTo({
      url: '../idcardup/idcardup',
    })
  }
})