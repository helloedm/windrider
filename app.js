//app.js
var netWork = require("./utils/network.js");
App({
  onLaunch: function () {
    let that = this;
    // this.adderschoose();
    wx.getSystemInfo({//  获取页面的有关信息
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
        if (res.model == 'iPhone X (GSM+CDMA)<iPhone10,3>') {
          that.globalData.iphoneX = true;
        }
      }
    });
    //获取授权
    // wx.login({
    //   success: (res) => {
    //     wx.getUserInfo({
    //       success: res => {
    //         // 可以将 res 发送给后台解码出 unionId
    //         this.globalData.userInfo = res.userInfo
    //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //         // 所以此处加入 callback 以防止这种情况
    //         if (this.userInfoReadyCallback) {
    //           this.userInfoReadyCallback(res)
    //         }
    //       }
    //     })
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("userinfo",res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,//登陆后的信息
    user: null,
    qqmapkey: 'RMSBZ-7VU3I-DDGGK-52DP4-VTIKF-YSB6T'
  },
  getUserInfo(source) {
    wx.showLoading({
      title: '正在登陆',
      mask: true
    })
    var _this = this;
    // console.log(_this)
    return new Promise((callBack, errord) => {
      // 登录
      wx.login({
        success: res => {
          // console.log(res);
          // 发送 res.code 到后台换取  sessionId, isBind ,ajtSpFansId(该微信用户在我们系统中的fansId)
          netWork.post("sp/riderSpLogin", { code: res.code }, (res) => {
            wx.hideLoading()
            if (res.status == 200){
              wx.setStorageSync('sessionId', res.data.sessionId);
              _this.globalData.userInfo = res.data.riderInfo;
              //是否注册过
              if (res.data.isBind == '1') {
                wx.redirectTo({
                  url: '../index',
                })
              }
            }
            callBack && callBack(res);
          })
        }
      })
    })
  },
  saveFormId(formId, type) {
    if (!arguments[1]) type = 1;
    console.log(formId, "app");
    netWork.post("formId/index", { type: type, form_id: formId }, (res) => {
      console.log(res);
    })
  }
})