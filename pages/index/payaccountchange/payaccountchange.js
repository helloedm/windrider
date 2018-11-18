// pages/index/payaccountchange/payaccountchange.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'更改新支付宝账户',
    ischange:'更改',
    isnew:'',
    account:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.isnew == 1){
      wx.setNavigationBarTitle({
        title: '绑定支付宝'
      })
      this.setData({
        isnew: options.isnew,
        title:'绑定支付宝',
        ischange:'保存'
      })
    }
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
  change(){
    let account = this.data.account
    if (account == '') {
      wx.showToast({
        title: '支付宝账号不得为空！',
        icon: 'none'
      })
      return false;
    }
    let id = app.globalData.userInfo.id
    if(this.data.isnew == 1){
      netWork.post("rider/saveBankCard",{
        riderInfoId: id,
        cardNumber:account
      },(res)=>{
        if (res.status == 200){
          wx.showToast({
            title: '绑定成功！',
            icon: 'none'
          })
          wx.navigateTo({
            url: '../account/account',
          })
        }
      })
    } else {
      netWork.post("rider/updateBankCard", {
        id:'',
        riderInfoId: id,
        cardNumber: account
      }, (res) => {
        wx.showToast({
          title: '修改成功！',
          icon: 'none'
        })
        wx.navigateTo({
          url: '../account/account',
        })
      })
    }
  }
})