// pages/lookupLocation/haveTrajectory/haveTrajectory.js
var post = require("../../utils/util.js");
var data;
var leng;
var list=[];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    polyline: [],
    markers: [],
    showallpoints: [],
    plateNo: '',
    startAddress: '',
    endAddress: '',
    startTime: '',
    endTime: '',
    linkTrajectoryShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('map');
    if (options.id == '1') {
      this.setData({
        linkTrajectoryShow: false
      });
    } else {
      this.setData({
        linkTrajectoryShow: true
      });
    }
    data = JSON.parse(options.value);    
    list = [];
    leng = data.length / 150;
    for (var i = 0; i < 150; i++) {
      if(i<149) {
        list.push({ lat: data[parseInt(i * leng)].lat, lon: data[parseInt(i * leng)].lon, adr: data[parseInt(i * leng)].adr});
      } else {
        list.push({ lat: data[data.length - 1].lat, lon: data[data.length - 1].lon, adr: data[data.length - 1].adr });
        
      }
    }
    this.setInfo(options, data);
    console.log('长度：'+data.length)
  },
  //根据经纬度获取城市名
  getCity(lat, lng, time) {
    var that = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2&location=' + lat + ',' + lng + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var address = res.data.result.formatted_address;
        if (time == '1') {
          that.setData({
            startAddress: address
          })
        } else {
          that.setData({
            endAddress: address
          })
        }
      },
      fail: function () {

      }

    })
  },
  //用户通过分享进入的方法
  shareGetInfo(options) {
    var that = this;
    var postData = {};
    postData.PlateNo = options.plateNo;
    postData.Start = options.startTime + ':00';
    postData.End = options.endTime + ':00';
    post.postNoInterceptResult(
      "/wxmini/composite/QueryTrajectory",
     postData,
      function (req) {
        if (req.result.length != 0) {
          data = req.result;
          that.setInfo(options, data);
        } else {
          that.shareGetInfo(options);
        }
      })
  },
  //封装的重复代码
  setInfo(options, data) {
    var that = this;
    this.setData({
      startTime: options.startTime,
      endTime: options.endTime,
      plateNo: options.plateNo
    });
    var startLat = data[0].WebLat;
    var startLng = data[0].WebLng;
    var endLat = data[data.length - 1].WebLat;
    var endLng = data[data.length - 1].WebLng;
    this.getCity(startLat, startLng, '1');
    this.getCity(endLat, endLng, '2');
    var tmppolyline = {}
    var points = []

    var markerArr = []

    for (var i = 0; i < data.length; i++) {
      var point = {}
      var marker = {};
      if (i == 0 || i == data.length - 1) {
        marker.id = data[i]
        marker.latitude = data[i].WebLat  //纬度
        marker.longitude = data[i].WebLng   //经度
        marker.iconPath = i == 0 ? "../../images/map/shi.png" : "../../images/map/zhong.png"
        marker.width = 28
        marker.height = 33
        marker.callout = {
          content: data[i].adr,
          color: "#f19100",
          fontSize: 14,
          borderRadius: 5,
          bgColor: "#ffffff",
          padding: 5,
          display: 'ALWAYS',
          textAlign: "left"
        }
        markerArr.push(marker)
      }
      point.longitude = data[i].WebLng
      point.latitude = data[i].WebLat
      points.push(point)
    }
    this.mapCtx.includePoints({
      padding: [50],
      points: points
    })
    tmppolyline.points = points
    tmppolyline.color = "#FF0000"
    tmppolyline.width = 5
    tmppolyline.dottedLine = false
    tmppolyline.arrowLine = true
    this.data.polyline.push(tmppolyline)
    this.data.longitude = data[0].WebLng
    this.data.latitude = data[0].WebLat
    this.data.markers = markerArr
    this.setData(this.data)
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
  clickLinkTrajectory() {
    wx.navigateTo({
      url: '/pages/trajectory/trajectory'
    })
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
    var that = this;
    console.log('list:'+list+'长度:' + list.length)
    return {
      title: '车辆轨迹！',
      // path: '/pages/lookupLocation/haveTrajectory/haveTrajectory?value=' + JSON.stringify(data)
      path: '/pages/haveTrajectory/haveTrajectory?value=' + JSON.stringify(list) + '&startTime=' + that.data.startTime + '&endTime=' + that.data.endTime + '&plateNo=' + that.data.plateNo + '&id=2'
    }
  }
})

