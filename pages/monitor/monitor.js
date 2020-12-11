var util = require('../../utils/util.js');
var Parent = new util.default.Parent();
Parent.lock = true;
Page({
  data: {
    carInfo: {},
    otherInfo: {
      chargeState: '',
      pattern: '',
      overElectric: '',
      volt: '',
      ampere: '',
      DcState: '',
      gear: '',
      ohm: '',
      speedPedal: '',
      ceasePedal: ''
    },
    timeD: null,
    animetions: false,    
    scale: '16',
    markers: []
  },
  onLoad: function (options) {
    var deviceId = options.deviceId,that = this;
    Parent.mapCtx = wx.createMapContext('map');
    Parent.deviceId = deviceId;
    Parent.ajax(
      'vehiclemanager/Platform/GetVehicleBaseInfo',
      deviceId,
      function(res) {
        var info = res.result.info;
        var curTime = new Date().getTime();
        var getOTime = info[0].OTime ? new Date(info[0].OTime.replace(/\-/g, '/')).getTime() : 0;
        var timeD = parseInt((curTime - getOTime) / 1000 / 60);
        if (timeD <= 15 && timeD >= 0 && info[0].OTime) {
          that.setData({
            timeD: true
          })
        } else {
          that.setData({
            timeD: false
          })
        }
        that.setData({
          carInfo: info[0]
        });
        var list = [];
        for (var i in info) {
          var tmp = {
            iconPath: "/images/map/hc.png",
            id: i,
            latitude: info[i].OLAT,
            longitude: info[i].OLNG,
            width: 15,
            height: 34,
            rotate: info[i].ODIRECT
          }
          wx.getSystemInfo({
            success: function (res) {
              var rotate = info[i].ODIRECT;
              if (res.system.indexOf('iOS') > -1) {
                tmp.callout = {
                  content: info[i].CARMARK,
                  color: "#fff",
                  fontSize: 14,
                  borderRadius: 5,
                  bgColor: "#575757",
                  padding: 5,
                  display: 'ALWAYS',
                  textAlign: "left"
                }
              } else {
                var lon = 0, lat = 0;
                if (rotate <= 20) {
                  lon = 0 - 48;
                  lat = 0 - 85;
                } else if (rotate <= 40) {
                  lon = 0 - 35;
                  lat = 0 - 85;
                } else if (rotate <= 60) {
                  lon = 0 - 40;
                  lat = 0 - 80;
                } else if (rotate <= 80) {
                  lon = 0 - 36;
                  lat = 0 - 75;
                } else if (rotate <= 100) {
                  lon = 0 - 35;
                  lat = 0 - 65;
                } else if (rotate <= 120) {
                  lon = 0 - 40;
                  lat = 0 - 60;
                } else if (rotate <= 140) {
                  lon = 0 - 45;
                  lat = 0 - 60;
                } else if (rotate <= 160) {
                  lon = 0 - 45;
                  lat = 0 - 60;
                } else if (rotate <= 180) {
                  lon = 0 - 50;
                  lat = 0 - 52;
                } else if (rotate <= 200) {
                  lon = 0 - 50;
                  lat = 0 - 55;
                } else if (rotate <= 220) {
                  lon = 0 - 55;
                  lat = 0 - 55;
                } else if (rotate <= 240) {
                  lon = 0 - 60;
                  lat = 0 - 56;
                } else if (rotate <= 260) {
                  lon = 0 - 65;
                  lat = 0 - 60;
                } else if (rotate <= 280) {
                  lon = 0 - 65;
                  lat = 0 - 64;
                } else if (rotate <= 300) {
                  lon = 0 - 65;
                  lat = 0 - 72;
                } else if (rotate <= 320) {
                  lon = 0 - 70;
                  lat = 0 - 78;
                } else if (rotate <= 340) {
                  lon = 0 - 62;
                  lat = 0 - 83;
                } else if (rotate <= 360) {
                  lon = 0 - 55;
                  lat = 0 - 85;
                }
                tmp.callout = {
                  content: '',
                  color: "#333",
                  fontSize: 14,
                  borderRadius: 0,
                  bgColor: "",
                  padding: 0,
                  display: 'BYCLICK',
                  textAlign: "left",
                }
                tmp.label = {
                  content: info[i].CARMARK,
                  color: "#ffffff",
                  fontSize: 14,
                  borderRadius: 5,
                  bgColor: "#575757",
                  padding: 5,
                  // display: 'ALWAYS',
                  textAlign: "left",
                  borderColor: '#333333',
                  borderWidth: 1,
                  anchorX: lon,
                  anchorY: lat
                }
              }
              list.push(tmp); 
              that.setData({
                markers: list
              })             
            }
          })
        }
        that.getAddress(info[0].OLAT, info[0].OLNG,function(res){
          var address = res.formatted_address;
          that.data.carInfo.curAddress = address;
          console.log(that.data.carInfo.curAddress)
          that.setData(that.data);
        });
      }
    )
  },
  markertap(e){
    var id = e.markerId;
  },
  getAddress(lat, lng,fuc) {
    var that = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2&location=' + lat + ',' + lng + '&output=json',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {  
        fuc(res.data.result);
      },
      fail: function () {
        // that.setData({ currentCity: "获取定位失败" });
      },

    })
  },
  //点击刷新
  clickRefresh(){
    this.onLoad(Parent);
  },
  downIsUpAnimation(){
    if(!Parent.lock){
      return;
    }
    Parent.lock = false;
    clearTimeout(tid);
    var tid = setTimeout(()=>{
      Parent.lock = true;
    },500);
    this.setData({
      animetions: !this.data.animetions
    })
  },
  onShareAppMessage() { }  
})