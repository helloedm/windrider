// pages/index/passwordlogin/passwordlogin.js
//index.js
//获取应用实例
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    code:'获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getApp().getUserInfo();
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
  //手机验证登录
  phonelogin: function () {
    wx.redirectTo({  //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
      url: '../passwordlogin/passwordlogin'
    })
  },
  //忘记密码
  passwordforget() {
    wx.redirectTo({  //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
      url: '../phonesure/phonesure'
    })
  },
  // 成为骑手
  becomehorseman() {
    wx.navigateTo({
      url: '../becomehorseman/becomehorseman',
    })
  },
  //进入风达
  login() {
    if (!this.logincheckdata()) {
      return false;
    } else {
      netWork.post("sp/login", {
        phone: this.data.phone,
        code: this.data.password
      }, (res) => {
        if (res.status == 200) {
          app.globalData.userInfo = res.data;
          wx.removeStorage({ key: 'logout' })
          wx.redirectTo({
            url: '../index'
          })
        }
      })
    }
  },
  //input 模拟数据双向绑定
  operateInput(e) {
    let prop = e.currentTarget.dataset.prop;
    let value = e.detail.value;
    this.setData({
      [prop]: value
    })
  },
  //登录校验
  logincheckdata() {
    if (this.data.phone != '' && !util.PregRule.Tel.test(this.data.phone)) {
      wx.showToast({
        icon: 'none',
        title: '您的手机号填写错误！',
      })
      return false;
    } else if (this.data.phone == '') {
      wx.showToast({
        icon: 'none',
        title: '手机号不得为空！',
      })
      return false;
    } else if (this.data.password == ''){
      wx.showToast({
        icon: 'none',
        title: '验证码填写不得为空！',
      })
      return false;
    } else {
      return true;
    }
  },
  //失去焦点数据校验
  checkData(e) {
    let prop = e.currentTarget.dataset.prop;
    let value = e.detail.value;
    if (prop == 'phone') {
      if (value && value != '' && !util.PregRule.Tel.test(value)) {
        wx.showToast({
          icon: 'none',
          title: '您的手机号填写错误！',
        })
        return false;
      }
    }
    if (prop == 'password') {
      if (value == '') {
        wx.showToast({
          icon: 'none',
          title: '验证码填写不得为空！',
        })
        return false;
      }
    }
  },
  /**
   * 计算倒计时
   */
  computeTime() {
    let djs = 60
    let timer = setInterval(() => {
      djs-- 
      this.setData({
        code: djs+"s"
      })
      if(djs <= 0){
        clearInterval(timer);
        this.setData({
          code: "获取验证码"
        })
      }
    }, 1000)
  },
  //获取验证码
  getcode(){
    if (this.data.phone == ''){
      wx.showToast({
        icon: 'none',
        title: '您的手机号填写不得为空！',
      })
      return false;
    }
    if (!util.PregRule.Tel.test(this.data.phone)) {
      wx.showToast({
        icon: 'none',
        title: '您的手机号填写错误！',
      })
      return false;
    }

    this.computeTime();
    if (this.data.code == '获取验证码'){
      netWork.post("note/getRiderCode", {
        phone: this.data.phone,
        type: 3
      }, (res) => {
        if (res.status == 200) {
          // this.computeTime();
        }
      })
    } else {
      wx.showToast({
        title: '验证码已发送，请耐心等待',
        icon: 'none',
        duration: 3000
      })
    }
  }
})