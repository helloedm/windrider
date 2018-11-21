// pages/index/changeaccount/changeaccount.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isgetcodeclick:false,
    phone:'',
    password:'',
    code:'获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)
    let tel = app.globalData.userInfo.phone
    this.setData({
      phone: tel
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
  //下一步
  nextstep(){
    if(this.data.password == ''){
      wx.showToast({
        title: '验证码输入不得为空！',
        icon:'none'
      })
      return false;
    }
    wx.navigateTo({
      url: '../changephone/changephone?code='+this.data.password,
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
  /**
   * 计算倒计时
   */
  computeTime() {
    let djs = 60
    let timer = setInterval(() => {
      djs--
      this.setData({
        code: djs + "s"
      })
      if (djs <= 0) {
        clearInterval(timer);
        this.setData({
          code: "获取验证码"
        })
        this.setData({
          isgetcodeclick: false
        })
      }
    }, 1000)
  },
  //获取验证码
  getcode() {
    if (this.data.code == '获取验证码' & this.data.isgetcodeclick == false) {
      this.setData({
        isgetcodeclick:true
      })
      netWork.post("note/getRiderCode", {
        phone: this.data.phone,
        type: 2
      }, (res) => {
        if (res.status == 200) {
          this.computeTime();  
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