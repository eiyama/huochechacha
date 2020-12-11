var util = require('../../utils/util.js');
var Parent = new util.default.Parent();
Page({
  data: {
    searchV: '',
    list:[],
    pageIndex: 1,
    loaded: true,
    scrollH: ''
  },
  onLoad: function (options) {
    var that = this;
    this.getRecordList();
    this.getDomInfo('.scroll-box',(res)=>{
      that.setData({
        scrollH: res.height
      })
    })
  },
  //安装记录
  getRecordList(){
    var SIM = this.data.searchV,that = this,pageIndex = this.data.pageIndex;
    Parent.ajax(
      'vehiclemanager/Platform/GetInstallRecords',
      {
        "deviceId": SIM,
        "sort": {
          "additionalProp1": {},
          "additionalProp2": {},
          "additionalProp3": {}
        },
        "pageIndex": pageIndex,
        "pageSize": 10,
        "total": 0,
        "skip": 0
      },
      function(res){
        var list = res.result.Data;
        for (var i in list) {
          that.data.list.push(list[i]);
        };
        that.setData(that.data);        
        if(list.length < 10) {
          that.setData({
            loaded: false
          })
        }
      }
    )
  },
  //获取元素的信息
  getDomInfo(dom, callback) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select(dom).boundingClientRect((rect) => {
      callback(rect)
    }).exec();
  },
  //按照SIM搜索历史记录
  serachList(){
    this.setData({
      pageIndex: 1,
      list: [],
      loaded: true
    });
    this.getRecordList();
  },
  //点击上传资料
  linkUpInfo(){
    wx.navigateTo({
      url: '/pages/otherLink/otherLink?id=1'
    })
  },
  //点击查看设备监控
  clickQuery(e){
    var deviceId = e.currentTarget.dataset.deviceid;
    var platformId = e.currentTarget.dataset.id;
    Parent.ajax(
      'vehiclemanager/Platform/LoginPlatform',
      JSON.stringify(platformId),
      function (res) {
        if (res.result) {
          console.log('登录平台成功')
          wx.navigateTo({
            url: '/pages/monitor/monitor?deviceId=' + deviceId
          })
        }
      }
    )
  },
  //点击链接设置页面发送短信
  linksetData(e){
    var index = e.currentTarget.dataset.index;
    var platformId = e.currentTarget.dataset.id;
    var info = this.data.list[index];
    Parent.ajax(
      'vehiclemanager/Platform/LoginPlatform',
      JSON.stringify(platformId),
      function (res) {
        if (res.result) {
          console.log('登录平台成功')
          wx.navigateTo({
            url: '/pages/setData/setData?id=3&info=' + JSON.stringify(info)
          })
        }
      }
    )
  },
  //触底加载
  scrollHandler(){
    //loaded验证是否已加载完毕所有的安装记录
    if (!this.data.loaded) {
      return;
    };
    var pageIndex = this.data.pageIndex;
    pageIndex++;
    this.setData({
      pageIndex: pageIndex
    });
    this.getRecordList();
  },
  //获取输入框的SIM
  getSearchValue(e){
    var searchV = e.detail.value;
    this.setData({
      searchV: searchV
    })
  },
  onShareAppMessage() { }  
})