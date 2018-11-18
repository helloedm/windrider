const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({
  data: {
    menuList: [{
      name: "已完成"
    }, {
      name: "投诉"
    }],
    tabScroll: 0,
    currentTab: 0,
    windowHeight: '',
    windowWidth: '',
    finishlist:[],
    applylist:[]
  },
  onLoad: function () {
    this.getOrderList(1);//已完成订单
    // wx.startPullDownRefresh();
    wx.getSystemInfo({  // 获取当前设备的宽高，文档有
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({ currentTab: current })
    }
  },
  changeContent: function (e) {
    var current = e.detail.current // 获取当前内容所在index,文档有
    var tabWidth = this.data.windowWidth / 3
    this.setData({
      currentTab: current,
      tabScroll: current * tabWidth
    })
    console.log(this.data.tabScroll)
    if (current == 0){
      this.getOrderList(1)
    } else {
      this.getOrderList(2)
    }
  },
  //个人中心
  personalcenter() {
    wx.navigateTo({
      url: './personalcenter/personalcenter',
    })
  },
  //已完成订单
  getOrderList(type){
    netWork.post('order/getOrderList',{
      riderInfoId: app.globalData.userInfo.id,
      agentInfoId: app.globalData.userInfo.agentInfoId,
      type: type
    },(res)=>{
      console.log(res);
      if (res.status == 200){
        this.setData({
          finishlist:res.data
        })
      }
    })
  },
})