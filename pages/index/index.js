const app = getApp();
const netWork = require("../../utils/network.js");
const util = require("../../utils/util.js");
let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
let qqmapsdk;
Page({
  data: {
    pretentdata:'正在刷新数据',
    active:1,
    menuList: [{
      name: "抢单"
    }, {
      name: "取餐"
    }, {
        name: "配送",
    }],
    tabScroll: 0,
    currentTab: 0,
    windowHeight: '',
    windowWidth: '',
    getorder:[],//抢单
    sendfood:[],//取餐
    sendlist:[]//配送
  },
  onLoad: function () {
    qqmapsdk = new QQMapWX({
      key: app.globalData.qqmapkey
    });
    // wx.startPullDownRefresh();
    wx.getSystemInfo({  // 获取当前设备的宽高，文档有
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    this.canGrabOrderList();
  },
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    console.log(current)
    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({ currentTab: current })
    }
  },
  /**
   * 监听下拉事件
   */
  onPullDownRefresh() {
    console.log('下拉了', this.data.currentTab)
    switch (this.data.currentTab){
      case 0 :
        this.canGrabOrderList();
      break;
      case 1 :
        this.takeOrderList();
      break;
      case 2 :
        this.arriveList();
      break;
    }
  },
  refresh(){
    this.setData({
      active:0
    })
    setTimeout(() => {
      this.setData({
        active: 1
      })
    },1500)
    wx.startPullDownRefresh()
    // switch (this.data.currentTab){
    //   case 0 :
    //     this.canGrabOrderList();
    //   break;
    //   case 1 :
    //     this.takeOrderList();
    //   break;
    //   case 2 :
    //     this.arriveList();
    //   break;
    // }
  },
  changeContent: function (e) {
    var current = e.detail.current // 获取当前内容所在index,文档有
    var tabWidth = this.data.windowWidth / 3
    this.setData({
      currentTab: current,
      tabScroll: current * tabWidth
    })
    switch (current) {
      case 0:
        this.canGrabOrderList();
        break;
      case 1:
        this.takeOrderList();
        break;
      case 2:
        this.arriveList();
        break;
    }
    // console.log(this.data.tabScroll)
  },
  //个人中心
  personalcenter(){
    wx.navigateTo({
      url: './personalcenter/personalcenter',
    })
  },
  //申诉
  apply(){
    wx.navigateTo({
      url: './apply/apply',
    })
  },
  //距离计算
  distance(type,shopone,shoptwo,buyerone,buyertwo){
    //两点之间距离计算
    return new Promise((callBack, errord) => {
      if (type == 0){
        qqmapsdk.calculateDistance({
          to: [{
            latitude: shopone,
            longitude: shoptwo,
          }],
          success: function (res) {
            callBack && callBack(res.result.elements[0].distance);
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        });
      } else {
        qqmapsdk.calculateDistance({
          from: {
            latitude: shopone,
            longitude: shoptwo,
          },
          to: [{
            latitude: buyerone,
            longitude: buyertwo,
          }],
          success: function (res) {
            callBack && callBack(res.result.elements[0].distance);
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        });
      }
    })
  },
  //抢单列表
  canGrabOrderList(){
    var _this = this;
    netWork.post('order/canGrabOrderList',{
      riderInfoId: app.globalData.userInfo.id,
      agentInfoId: app.globalData.userInfo.agentInfoId
    },(res)=>{
      // this.setData({
      //   active: 
      // })
      let i = -1;
      let length = res.data.length
      setTimeout(() => {
        wx.stopPullDownRefresh();
      },1500)
      if(length == 0){
        return false;
      }
      console.log(res);
      //同一个key  单位时间请求不得超过5次  所以用setInterval
      let time = setInterval(() => {
          i++
          //时间差处理
          let starttime = new Date().getTime();
          let endtime = Date.parse(new Date(res.data[i].maybeArrivedTime.replace(/-/g, "/")));
          let residue = Math.floor((endtime - starttime) / (1000 * 60))
          res.data[i].time = residue;
          //两点之间距离计算
          _this.distance(0, res.data[i].shopLatitude, res.data[i].shopLongitude).then(
            function (distance) {
              res.data[i].rtob = distance  //骑手到商家的距离
              _this.setData({
                getorder: res.data
              })
            }
          )
          let btoc = _this.distance(1, res.data[i].shopLatitude, res.data[i].shopLongitude, res.data[i].buyerLatitude, res.data[i].buyerLongitude).then(
            function (distance) {
              res.data[i].btoc = distance //商家到购物者的距离
              _this.setData({
                getorder: res.data
              })
            }
          )
          console.log(i,length)
          if (i >= length-1) {
            clearInterval(time)
          }
        }, 1000)
    })
  },
  //取餐列表
  takeOrderList(){
    netWork.post('order/takeOrderList',{
      riderInfoId: app.globalData.userInfo.id
    },(res)=>{
      this.setData({
        sendfood: res.data,
      })
      setTimeout(() => {
        wx.stopPullDownRefresh();
      },1500)
    })
  },
  //配送列表
  arriveList() {
    netWork.post('order/arriveList', {
      riderInfoId: app.globalData.userInfo.id
    }, (res) => {
      console.log(res);
      this.setData({
        sendlist: res.data,
      })
      setTimeout(() => {
        wx.stopPullDownRefresh();
      },1500)
    })
  },
  //联系商家
  relationshop(e){
    console.log(e);
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //抢单查看地图
  checkmap(e){
    let buyerLatitude = this.data.getorder[e.currentTarget.dataset.id].buyerLatitude;
    let buyerLongitude = this.data.getorder[e.currentTarget.dataset.id].buyerLongitude;
    let shopLatitude = this.data.getorder[e.currentTarget.dataset.id].shopLatitude;
    let shopLongitude = this.data.getorder[e.currentTarget.dataset.id].shopLongitude;    
    wx.navigateTo({
      url: './map/map?buyerLatitude=' + buyerLatitude + '&buyerLongitude=' + buyerLongitude + '&shopLatitude=' + shopLatitude + '&shopLongitude=' + shopLongitude,
    })
  },
  //取餐查看地图
  openrtob(e){
    const latitude = this.data.sendfood[e.currentTarget.dataset.id].shopLatitude;
    const longitude = this.data.sendfood[e.currentTarget.dataset.id].shopLongitude;
    const shopAddress = this.data.sendfood[e.currentTarget.dataset.id].shopAddress;
    const shopName = this.data.sendfood[e.currentTarget.dataset.id].shopName;
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name: shopAddress,
      address: shopName,
      scale: 13
    })
    // console.log(e,'asdasd')
    // let buyerLatitude = this.data.sendfood[e.currentTarget.dataset.id].buyerLatitude;
    // let buyerLongitude = this.data.sendfood[e.currentTarget.dataset.id].buyerLongitude;
    // let shopLatitude = tthis.data.sendfood[e.currentTarget.dataset.id].shopLatitude;
    // let shopLongitude = this.data.sendfood[e.currentTarget.dataset.id].shopLongitude;
    // wx.navigateTo({
    //   url: './drivemap/drivemap?buyerLatitude=' + buyerLatitude + '&buyerLongitude=' + buyerLongitude + '&shopLatitude=' + shopLatitude + '&shopLongitude=' + shopLongitude,
    // })
  },
  //配送查看地图
  openbtoc(e){
    const latitude = this.data.sendlist[e.currentTarget.dataset.id].buyerLatitude;
    const longitude = this.data.sendlist[e.currentTarget.dataset.id].buyerLongitude;
    const buyerAddress = this.data.sendlist[e.currentTarget.dataset.id].buyerAddress;
    const buyerName = this.data.sendlist[e.currentTarget.dataset.id].buyerName;
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name: buyerName,
      address: buyerAddress,
      scale: 13
    })
  },
  //抢单
  roborder(e){
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    netWork.post('order/grabOrder', {
      id: orderid,
      riderInfoId: app.globalData.userInfo.id,
      agentInfoId: app.globalData.userInfo.agentInfoId
    }, (res) => {
      console.log(res);
      if (res.status == 200) {
        wx.showToast({
          title: '抢单成功！',
          icon:'none'
        })
      }
    })
  },
  //确认取货
  suregetgoods(e){
    let orderid = e.currentTarget.dataset.orderid;
    netWork.post('order/takeOrder', {
      id: orderid,
      riderInfoId: app.globalData.userInfo.id,
      agentInfoId: app.globalData.userInfo.agentInfoId
    }, (res) => {
      console.log(res);
      if (res.status == 200) {
        wx.showToast({
          title: '取货成功！',
          icon: 'none'
        })
      }
    })
  },
  //确认送达
  sureeat(e){
    let orderid = e.currentTarget.dataset.orderid;
    netWork.post('order/arrive', {
      id: orderid,
      riderInfoId: app.globalData.userInfo.id,
    }, (res) => {
      console.log(res);
      if (res.status == 200) {
        wx.showToast({
          title: '配送成功！',
          icon: 'none'
        })
      }
    })
  }
})