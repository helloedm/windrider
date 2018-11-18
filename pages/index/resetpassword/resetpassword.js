// pages/index/passwordlogin/passwordlogin.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    code:'',
    newPassword:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      phone: options.phone,
      code: options.code
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
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {

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
  back: function () {
    wx.redirectTo({  //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
      url: '../phonesure/phonesure'
    })
  },
  resetsuccess(){
    var reg = /^[a-zA-Z0-9]{6,16}$/;
    if (reg.test(this.data.newPassword) == false) {
      wx.showToast({
        title: '密码不能含有非法字符，长度在6-16之间',
        icon:'none'
      })
      return false;
    }
    netWork.post("sso/newPassword",{
      phone:this.data.phone,
      newPassword: this.data.newPassword,
      code:this.data.code
    },(res)=>{
      if (res.status == 200){
        wx.redirectTo({  //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
          url: '../resetsuccess/resetsuccess'
        })
      }
    })
  },
  operateInput(e) {
    let prop = e.currentTarget.dataset.prop;
    let value = e.detail.value;
    this.setData({
      [prop]: value
    })
  },
})