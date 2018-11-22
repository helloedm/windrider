let config = require("../config.js")
let util = require("./util.js")
let md5 = require("./md5.min.js")
let skeletonApis = ['quickSp/getPositionDetail', 'quickSp/getCompanyBasicInfo', 'positionRecommend/getShareTitleInfo', 'quickSp/getDevHistoryList', 'quickSp/searchCompany']

let network = {
  //post请求
  post: (url, params, successed, failed) => {
    let sign = "";
    // let token = wx.getStorageSync('token') || '';
    if (url.indexOf('wxpay') != '-1') {
      wx.showLoading({
        title: '加载中..',
      })
    }
    // console.log('asd',wx.getStorageSync('sessionId')=='')
    if (wx.getStorageSync('sessionId') != ''){
      params.sessionId = wx.getStorageSync('sessionId')
    }
    /*
    对参数params进行排序
    */
    var newkey = Object.keys(params).sort();//按字母顺序进行排序
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
      newObj[newkey[i]] = params[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }

    for (let key in newObj) {
      if (params[key] != ''){
        sign += key + '=' + params[key];
      }
    }
    sign += 'qs'
    console.log(sign)
    // sign = md5(sign + config.secretKey);
    sign = md5(sign);
    wx.request({
      url: `${config.host}${url}`,
      method: "POST",
      header: {
        "lversion": `${config.lversion}`,
        "content-type": "application/x-www-form-urlencoded",
        // "Token": token,
        "sign": sign,
        "source": 'fengda'
      },
      data: params,
      success: (res) => {
        if (res.data.status != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
        }
        if (url.indexOf('wxpay') != '-1') {
          wx.hideLoading()
        }
        successed && successed(res.data)
      },
      fail: (error) => {
        if (failed) {
          console.log("失败了")
          failed()
        } else {
          util.toast("服务器开小差了！")
        }
      }
    })
  },
  //get请求
  get: (url, params, success, fail) => {
    let sign = "";
    let token = wx.getStorageSync('token') || '';
    /*
   对参数params进行排序
   */
    var newkey = Object.keys(params).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
      newObj[newkey[i]] = params[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }

    for (let key in newObj) {
      sign += key + '=' + params[key];
    }
    sign = md5(sign + config.secretKey);
    wx.request({
      // url: `${config.host}${url}`,
      url: url,
      method: "GET",
      header: {
        "lversion": `${config.lversion}`,
        "content-type": "application/json",
        "Token": token,
        "Sign": sign
      },
      data: params,
      success: res => {
        wx.hideLoading()
        if (success) {
          success(res.data)
        }
      },
      fail: () => {
        if (fail) {
          fail()
        } else {
          util.toast("服务器开小差了！")
        }
      }
    })
  },
}

module.exports = network;