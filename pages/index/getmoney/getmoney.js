// pages/index/getmoney/getmoney.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allmoney:0,
    wantmoney:'',
    alipayid:'',
    account:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let account = options.account
    this.setData({
      allmoney: options.allIncome,
      alipayid: options.alipayid,
      account: account.substr(0, 3) + '******'+ account.substr(account.length - 1, 1)
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
  //input 模拟数据双向绑定
  operateInput(e) {
    let prop = e.currentTarget.dataset.prop;
    let value = e.detail.value;
    this.setData({
      [prop]: value
    })
  },
  //全部提现
  wangtall(){
    this.setData({
      wantmoney: this.data.allmoney
    })
  },
  //账号编辑
  editaccount(){
    let alipayid = this.data.alipayid
    wx.navigateTo({
      url: '../payaccountchange/payaccountchange?isnew=0' + '&alipayid=' + alipayid,
    })
  },
  //确认提现
  suregetmoney(){
    if (this.data.wantmoney > this.data.allmoney){
      wx.showToast({
        title: '超出最大可提现金额',
        icon: 'none'
      })
      return false;
    }
    if (this.data.wantmoney <= 0) {
      wx.showToast({
        title: '提现金额不得为负数或零！',
        icon: 'none'
      })
      return false;
    }
    netWork.post('rider/withdraw',{
      money: this.data.wantmoney,
      riderInfoId: app.globalData.userInfo.id,
      agentInfoId: app.globalData.userInfo.agentInfoId
    },(res)=>{
      if(res.status==200){
        wx.showToast({
          title: '提现成功,48小时内到账',
          icon:'none'
        })
        wx.navigateTo({
          url: '../account/account',
        })
      }
    })
  }
})