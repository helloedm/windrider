// pages/index/account/account.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomedata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.income();
    // this.getmoney();
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
    this.income();
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
  //个人账户详情
  income(){
    netWork.post('rider/income',{
      id: app.globalData.userInfo.id
    },(res)=>{
      console.log(res);
      this.setData({
        incomedata: res.data
      })
    })
  },
  getmoneyrecord(){
    wx.navigateTo({
      url: '../getmoneyrecord/getmoneyrecord',
    })
  },
  getmoney(){
    netWork.post('rider/bankCardList',{
      id: app.globalData.userInfo.id
    },(res)=>{
      console.log(res);
      if (res.data == null || res.data.cardNumber == null){
        wx.navigateTo({
          url: '../payaccountchange/payaccountchange?isnew=1',//新增
        })
      } else {
        console.log(this.data.incomedata)
        let allIncome = this.data.incomedata.balance
        let alipayid = this.data.incomedata.bankCard.id
        let account = this.data.incomedata.bankCard.cardNumber
        wx.navigateTo({
          url: '../getmoney/getmoney?isnew=0' + '&allIncome=' + allIncome + '&alipayid=' + alipayid + '&account=' + account,//已有账号
        })
      }
    })
  }
})