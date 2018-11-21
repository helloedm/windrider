// pages/index/changeaccount/changeaccount.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:'',
    getcodeisclick:'',
    code:'获取验证码'
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
  nextstep() {
    netWork.post('sso/modifyPhone',{
      phone: app.globalData.userInfo.phone,
      newPhone:this.data.phone,
      code: this.data.password
    },(res)=>{
      if(res.status == 200){
        wx.showToast({
          title: '手机号修改成功！',
          icon:'none'
        })
        wx.navigateTo({
          url: '../personalcenter/personalcenter',
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
          getcodeisclick: false
        })
      }
    }, 1000)
  },
  //获取验证码
  getcode() {
    if (this.data.code == '获取验证码' & this.data.getcodeisclick == false) {
      this.setData({
        getcodeisclick:true
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