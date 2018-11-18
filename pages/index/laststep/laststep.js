// pages/index/becomehorseman/becomehorseman.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    invitecode:'',
    phone:'',
    password:'',
    code:'获取验证码',
    getcode:'',
    name:'',
    idcard:'',
    agentInfoId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      name: options.name,
      idcard: options.idcard,
      agentInfoId: options.agentInfoId
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
  back() {
    wx.navigateBack({})
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
    let djs = 20
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
      }
    }, 1000)
  },
  //获取验证码
  getcode() {
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
    }
    if (this.data.code == '获取验证码') {
      netWork.post("note/getRiderCode", {
        phone: this.data.phone,
        type: 1
      }, (res) => {
        this.computeTime();
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
    if (prop == 'getcode') {
      if (value == '') {
        wx.showToast({
          icon: 'none',
          title: '验证码填写不得为空！',
        })
        return false;
      }
    }
    if (prop == 'password') {
      if (value == '') {
        wx.showToast({
          icon: 'none',
          title: '密码填写不得为空！',
        })
        return false;
      }
    }
  },
  //完成注册
  nextstep() {
    if (this.data.phone && this.data.phone != '' && !util.PregRule.Tel.test(this.data.phone)) {
      wx.showToast({
        icon: 'none',
        title: '您的手机号填写错误！',
      })
      return false;
    }
    if (this.data.getcode == '') {
      wx.showToast({
        icon: 'none',
        title: '验证码填写不得为空！',
      })
      return false;
    }
    if (this.data.password == '') {
      wx.showToast({
        icon: 'none',
        title: '密码填写不得为空！',
      })
      return false;
    }
    netWork.post("/sso/register", {
      phone: this.data.phone,
      password: this.data.password,
      idcard: this.data.idcard,
      inviteCode: this.data.inviteCode,
      agentInfoId: this.data.agentInfoId,
      code: this.data.getcode,
    }, (res) => {
      console.log(res)
      if (res.status == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        wx.navigateTo({
          url: '../idcardup/idcardup',
        })
      }
    })
  },
  back(){
    wx.navigateBack({
      
    })
  },
  useragreement(){
    wx.navigateTo({
      url: '../user_agreement/user_agreement',
    })
  }
})