// pages/index/changepassword/changepassword.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    oldPassword:'',
    newPassword:'',
    againnewPassword:''
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
  //完成
  nextstep(){
    if (this.data.password == ''){
      wx.showToast({
        title: '旧密码填写不得为空！',
        icon: 'none'
      })
      return false;
    }
    if (this.data.newPassword == '') {
      wx.showToast({
        title: '新密码填写不得为空！',
        icon: 'none'
      })
      return false;
    }
    if (this.data.againnewPassword == '') {
      wx.showToast({
        title: '再次输入新密码填写不得为空！',
        icon: 'none'
      })
      return false;
    }
    if (this.data.newPassword != this.data.againnewPassword) {
      wx.showToast({
        title: '两次密码输入不一致！',
        icon: 'none'
      })
      return false;
    }
    netWork.post('sso/updatePassword',{
      phone: app.globalData.userInfo.phone,
      oldPassword: this.data.password,
      newPassword: this.data.newPassword,
    },(res)=>{
      console.log(res);
      if (res.status == 200){
        wx.showToast({
          title: '修改成功！',
          icon:'none'
        })
        wx.redirectTo({
          url: '../setting/setting',
        })
      }
    })
  },
  //input 模拟数据双向绑定
  operateInput(e) {
    let prop = e.currentTarget.dataset.prop;
    let value = e.detail.value;
    this.setData({
      [prop]: value
    })
  },
})