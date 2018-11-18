Page({
  data: {
    latitude: '',
    longitude: '',
    // controls: [{
    //   id: 1,
    //   iconPath: '../../../images/buyer.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }],
    markers: [{
      id:0,
      latitude: '',
      longitude: '',
      width:80,
      height:80,
      iconPath: '../../../images/buyer.png'
    }, {
      id: 1,
      latitude: '',
      longitude: '',
      width: 80,
      height: 80,
      iconPath: '../../../images/shop.png'
    }, {
        latitude: '',
        id: 2,
        longitude: '',
        width: 80,
        height: 80,
        iconPath: '../../../images/rider.png'
    }],
    //直线连接多个点坐标
    // polyline: [{
    //   points: [{
    //     longitude: 120.05993246098552,
    //     latitude: 30.286868688431984
    //   }, {
    //     longitude: 120.03793,
    //     latitude: 30.292821
    //     }, {
    //       longitude: 120.13026,
    //       latitude: 30.25961
    //     }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    points: [{
      latitude: '',
      longitude: '',
    }, {
      latitude: '',
      longitude: '',
    }, {
      latitude: '',
      longitude: '',
    }]
  },//地图标记点
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let _this = this;
    this.mapCtx = wx.createMapContext('myMap')
    let buyerLatitude = 'markers[0].latitude';
    let buyerLongitude = 'markers[0].longitude';
    let shopLatitude = 'markers[1].latitude';
    let shopLongitude = 'markers[1].longitude';
    this.setData({
      [buyerLatitude]: options.buyerLatitude,
      [buyerLongitude]: options.buyerLongitude,
      [shopLatitude]: options.shopLatitude,
      [shopLongitude]: options.shopLongitude,
      'points[0].latitude': options.buyerLatitude,
      'points[0].longitude': options.buyerLongitude,
      'points[1].latitude': options.shopLatitude,
      'points[1].longitude': options.shopLongitude,
    })    
    //获取当前位置的经纬度
    wx.getLocation({
      type: 'gcj02',//火星坐标系
      success(res) {
        console.log(res);
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        let riderLatitude = 'markers[2].latitude';
        let riderLongitude = 'markers[2].longitude';
        _this.setData({
          latitude: latitude,
          longitude: longitude,
          [riderLatitude]: latitude,
          [riderLongitude]: longitude,
          'points[2].latitude': latitude,
          'points[2].longitude': longitude,
        })   
        console.log(_this.data.points, _this.data.markers);
        // _this.includePoints();
        _this.moveToLocation()
      }
    })
  },
  //获取当前地图中心的经纬度。返回的是 gcj02 坐标系，可以用于wx.openLocation()
  getCenterLocation: function () {
    var _this = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude,res)
        console.log(res.latitude)
        let latitude = 'markers[2].latitude'
        let longitude = 'markers[2].longitude'
        _this.setData({
          [latitude]: res.latitude,
          [longitude]: res.longitude,
        })
        // _this.includePoints();
        console.log(_this.data.markers);
      }
    })
  },
  //将地图中心移动到当前定位点
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 3000,
      destination: {
        latitude: 30.292821,
        longitude: 120.03793,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [100],
      points: this.data.points,
      // success:function(res){
      //   this.moveToLocation() //将地图中心移动到当前定位点  并且获取当前点的坐标
      // }
    })
  },
  markertap(e) {
    console.log(e.markerId)
  },
})
