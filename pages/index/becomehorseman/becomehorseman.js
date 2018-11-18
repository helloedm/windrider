// pages/index/becomehorseman/becomehorseman.js
const app = getApp();
const netWork = require("../../../utils/network.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname: '',//姓名
    idcard: '',//身份证号
    zone:'',
    agentname:'',
    agentid: '', //服务商/代理商主键id
    agentindex:'',
    agentarray: [],
    agentobjectarray:[],
    regionValue: [],
    showRegion: false,
    areaPlace:[],
    zoneischose:true
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
  back(){
    wx.navigateBack({})
  },
  //选择代理商地区接口
  adderschoose(){
    netWork.post('rider/selectAgentAddr',{},(res)=>{
      this.setData({
        agentname:''
      })
      let areadata = res.data;
      for ( let i = 0; i < res.data.length; i++ ){
        res.data[i].id = 0;
        res.data[i]._child = res.data[i].area;
        delete res.data[i].area
        for (let j=0; j < res.data[i]._child.length; j++){
          res.data[i]._child[j].id = 0;
          res.data[i]._child[j]._child = res.data[i]._child[j].area
          delete res.data[i]._child[j].area
          for (let k = 0; k < res.data[i]._child[j]._child.length; k++){
            let list = {}
            list['name'] = res.data[i]._child[j]._child[k];
            list['id'] = 0
            res.data[i]._child[j]._child[k] = list
          }
        }
      }
      // console.log(areadata);
      this.setData({
        areaPlace: areadata
      })
    })
  },
  chooseRegion: function () {
    this.adderschoose();
    this.setData({
      showRegion: true,
    });
  },
  emitHideRegion: function (e) {
    console.log(e);
    let zone = e.detail.regionValue[0].name + "-" + e.detail.regionValue[1].name + "-" + e.detail.regionValue[2].name;
    this.setData({
      showRegion: e.detail.showRegion,
      regionValue: e.detail.regionValue,
      zone: zone,
      zoneischose: false
    });
    this.selectAgent();
  },
  // 根据地区选择服务商接口
  selectAgent() {
    netWork.post("rider/selectAgent",{
      codeName:this.data.zone
    },(res)=>{
      let allagent = res.data;
      let agentstore = []
      for (let i = 0; i < allagent.length; i++){
        agentstore.push(allagent[i].agentName)
      }
      // agentstore.push('a',"b","c")
      this.setData({
        agentobjectarray: allagent,
        agentarray: agentstore
      })
    })
  },
  //服务商选择器
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value,e)
    let index = Number(e.detail.value)
    // console.log(this.data.agentobjectarray[Number(index)])
    let name = this.data.agentobjectarray[Number(index)].agentName;
    let id = this.data.agentobjectarray[Number(index)].id;
    this.setData({
      agentname: name,
      agentid: id
    })
  },
  //服务商选择
  ischose(){
    if (this.data.zoneischose){
      wx.showToast({
        title: '请先选择服务商地区！',
        icon:'none'
      })
    }
  },
  //input 模拟数据双向绑定
  operateInput(e) {
    let prop = e.currentTarget.dataset.prop;
    let value = e.detail.value;
    this.setData({
      [prop]: value
    })
  },
  //下一步
  nextstep() {
    if (this.data.zone == ''){
      wx.showToast({
        title: '服务商地区不得为空',
        icon:'none'
      })
      return false;
    }

    if (this.data.agentname == '') {
      wx.showToast({
        title: '服务商不得为空',
        icon: 'none'
      })
      return false;
    }
    if (this.data.realname == '') {
      wx.showToast({
        title: '真实姓名不得为空',
        icon: 'none'
      })
      return false;
    }
    if (this.data.idcard == '') {
      wx.showToast({
        title: '身份证不得为空',
        icon: 'none'
      })
      return false;
    }
    let isIDCard1 = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
    isIDCard1.test(this.data.idcard)
    if (!isIDCard1.test(this.data.idcard)){
      wx.showToast({
        title: '身份证格式错误',
        icon: 'none'
      })
      return false;
    }
    
    console.log('../laststep/laststep?agentInfoId=' + this.data.agentid + '&name=' + this.data.realname + '&idcard=' + this.data.idcard)
    wx.navigateTo({
      url: '../laststep/laststep?agentInfoId='+this.data.agentid+'&name='+this.data.realname+'&idcard='+this.data.idcard,
    })
  },
})