// pages/index/drivemap/drivemap.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude:'',
    latitude:'',
    riderLatitude: '',
    riderLongitude: '',
    shopLatitude:'',
    shopLongitude:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      shopLatitude: options.shopLatitude,
      shopLongitude: options.shopLongitude,
    })
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    // })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //地图实例化需要在onReady 否则可能会造成地图实例化失败
    this.mapCtx = wx.createMapContext('myMap')
    this.getrideradders();
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
  //获取当前定位点
  getrideradders(){
    var _this = this;
    //获取当前位置的经纬度
    wx.getLocation({
      type: 'gcj02',//火星坐标系
      success(res) {
        console.log(res);
        const riderLatitude = res.latitude
        const riderLongitude = res.longitude
        _this.setData({
          riderLatitude: riderLatitude,
          riderLongitude: riderLongitude,
          longitude: riderLatitude,
          latitude: riderLongitude
        })
        _this.getride()
        _this.moveToLocation()
      }
    })
  },
  //将地图中心移动到当前定位点
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  //获取骑行路线
  getride(){
    console.log(app.globalData)
    let from = this.data.riderLatitude + ',' + this.data.riderLongitude;
    let to = this.data.shopLatitude + ',' + this.data.shopLongitude;
    let params = {
      from: '',
      to: '',
      key: app.globalData.qqmapkey
    }
    params.from = from;
    params.to = to;
    let _this = this;
    netWork.get('https://apis.map.qq.com/ws/direction/v1/walking/',params,(res)=>{
      var ret = res
      if (ret.status != 0) return; //服务异常处理
      var coors = ret.result.routes[0].polyline, pl = [];
      //坐标解压（返回的点串坐标，通过前向差分进行压缩）
      var kr = 1000000;
      for (var i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
      }
      //将解压后的坐标放入点串数组pl中
      for (var i = 0; i < coors.length; i += 2) {
        pl.push({ latitude: coors[i], longitude: coors[i + 1] })
      }
      //设置polyline属性，将路线显示出来
      _this.setData({
        polyline: [{
          points: pl,
          color: '#FF0000DD',
          width: 5
        }]
      })
    })
  },
  //事件回调函数
  driving: function () {
    var _this = this;
    let key = app.globalData.qqmapkey
    //网络请求设置
    var opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: 'https://apis.map.qq.com/ws/direction/v1/driving/?from=39.989221,116.306076&to=39.828050,116.436195&key=RMSBZ-7VU3I-DDGGK-52DP4-VTIKF-YSB6T',
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function (res) {
        var ret = res.data
        if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //设置polyline属性，将路线显示出来
        _this.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 2
          }]
        })
      }
    };
    wx.request(opt);
  }
})