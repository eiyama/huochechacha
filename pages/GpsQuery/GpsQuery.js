var util = require('../../utils/util.js');
var Parent = new util.default.Parent();
Parent.lock = true;
Page({
  data: {
    searchType: '',
    userName: '',
    placeholder: '请输入车牌号/VIN码',
    searchValue: '',
    userNameList: [],
    infoIsShow: false,
    carNumIsVINList: [],
    inputDisabled: false,
    timeD: null,
    searchTypeList: ['按车牌号搜索', '按VIN码搜索'],
    index: 0,
    key: 0,
    carInfo: {
      carNum: '',
      state: '',
      speed: '',
      mileage: '',
      time: '',
      curAddress: ''
    },
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
    animetions: true,
    scale: '16',
    lon: '',
    lat: '',
    loginUserName: '',
    loginUserType: 0
  },
  onLoad: function(options) {
    var that = this;

    var UserInfo = wx.getStorageSync("UserInfo")
    that.setData({
      loginUserName: UserInfo.UserName,
      loginUserType: UserInfo.UserType
    })

    Parent.mapCtx = wx.createMapContext('map');
    Parent.ajax(
      'vehiclemanager/Platform/GetPlatforms',
      '',
      function(res) {
        that.setData({
          userNameList: res.result
        })
        //1 安装人员  2 企业
        if (that.data.loginUserType == 2) {
          for (var i = 0; i < res.result.length; i++) {
            if (res.result[i].userName == that.data.loginUserName) {
              that.loginPlatform(res.result[i].Id);
            }
          }
        } else {
          that.loginPlatform(res.result[0].Id);
        }
      }
    );
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        that.data.carInfo.OLNG = res.longitude;
        that.data.carInfo.OLAT = res.latitude;
        that.setData(that.data);
      }
    })
  },
  //获取当前经纬度
  getLatLon() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              that.data.carInfo.OLNG = res.longitude;
              that.data.carInfo.OLAT = res.latitude;
              that.setData(that.data);
            }
          })
          console.log('成功')
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'gcj02',
                success(res) {
                  that.data.carInfo.OLNG = res.longitude;
                  that.data.carInfo.OLAT = res.latitude;
                  that.setData(that.data);
                }
              })
              wx.getLocation();
            }
          })
          console.log('失败')
        }
      }
    })
  },
  //登录平台
  loginPlatform(Id) {
    Parent.ajax(
      'vehiclemanager/Platform/LoginPlatform',
      JSON.stringify(Id),
      function(res) {
        if (res.result) {
          console.log('登录平台成功')
        }
      }
    )
  },
  //当选择框的值发生变化
  bindPickerChangeLeft(e) {
    var index = e.detail.value;
    var Id = this.data.array[index].Id;
    this.setData({
      index: index,
      customer: this.data.array[index].Name
    });
    this.loginPlatform(Id);
  },
  //获取车牌号或者VIN
  getCarNumIsVIN(e) {
    var carNumIsVIN = e.detail.value.toUpperCase(),
      that = this;
    if (!carNumIsVIN) {
      this.setData({
        carNumIsVINList: []
      })
      return;
    }
    this.setData({
      searchValue: carNumIsVIN
    });
    if (carNumIsVIN.length >= 2) {
      this.getCarInfo(carNumIsVIN, function(info) {
        that.setData({
          inputDisabled: false
        })
        if (info != null && info.length > 0) {
          var list = [];
          for (var i in info) {
            if (info[i].CARMARK && info[i].CARMARK.indexOf(carNumIsVIN) > -1 || info[i].VIN && info[i].VIN.indexOf(carNumIsVIN) > -1) {
              if (info[i].CARMARK) {
                if (info[i].CARMARK.indexOf(carNumIsVIN) > -1) {
                  var carNumLeft = info[i].CARMARK.substr(0, info[i].CARMARK.indexOf(carNumIsVIN)),
                    carNumRight = info[i].CARMARK.substring(info[i].CARMARK.indexOf(carNumIsVIN) + carNumIsVIN.length),
                    carNumCenter = carNumIsVIN;
                } else {
                  var carNumLeft = info[i].CARMARK,
                    carNumRight = '',
                    carNumCenter = '';
                }
              } else {
                var carNumLeft = '',
                  carNumRight = '',
                  carNumCenter = '';
              };
              if (info[i].VIN) {
                if (info[i].VIN.indexOf(carNumIsVIN) > -1) {
                  var VINLeft = info[i].VIN.substr(0, info[i].VIN.indexOf(carNumIsVIN)),
                    VINRight = info[i].VIN.substring(info[i].VIN.indexOf(carNumIsVIN) + carNumIsVIN.length),
                    VINCenter = carNumIsVIN;
                } else {
                  var VINLeft = info[i].VIN,
                    VINRight = '',
                    VINCenter = '';
                }
              } else {
                var VINLeft = '',
                  VINRight = '',
                  VINCenter = '';
              }
              info[i].carNumLeft = carNumLeft;
              info[i].carNumCenter = carNumCenter;
              info[i].carNumRight = carNumRight;
              info[i].VINLeft = VINLeft;
              info[i].VINCenter = VINCenter;
              info[i].VINRight = VINRight;
              list.push(info[i]);
            }
          };
          console.log(list)
          that.setData({
            carNumIsVINList: list
          })
        } else {
          that.setData({
            carNumIsVINList: []
          })
        }
      })
    }
  },
  //根据车牌或者VIN获取车辆信息
  getCarInfo(carNumIsVIN, fuc) {
    var that = this;
    that.setData({
      inputDisabled: true
    })
    Parent.ajax(
      'vehiclemanager/Platform/GetVehicleBaseInfo',
      JSON.stringify(carNumIsVIN),
      function(res) {
        var info = res.result.info;
        fuc(info);
      }
    )
  },
  //获取地图信息
  getMapInfo(info) {
    var that = this;
    if (info.OTime == null) {
      this.setData({
        timeD: false
      })
    } else {
      var curTime = new Date().getTime();
      var getOTime = new Date(info.OTime.replace(/\-/g, '/')).getTime();
      console.log(info.OTime.replace(/\-/g, '/'))
      var timeD = parseInt((curTime - getOTime) / 1000 / 60);
      if (timeD <= 15 && timeD >= 0 && info.OTime) {
        this.setData({
          timeD: true
        })
      } else {
        this.setData({
          timeD: false
        })
      }
    }
    console.log(info.ODisOfDay)
    info.ODisOfDay = info.ODisOfDay ? info.ODisOfDay.toFixed(2) : '';
    console.log(info.ODisOfDay)
    that.setData({
      carInfo: info,
      infoIsShow: true
    });
    var list = [];
    var tmp = {
      iconPath: "/images/map/hc.png",
      id: 0,
      latitude: info.OWEBLAT,
      longitude: info.OWEBLNG,
      width: 15,
      height: 34,
      rotate: info.ODIRECT
    }
    wx.getSystemInfo({
      success: function(res) {
        var rotate = info.ODIRECT;
        if (res.system.indexOf('iOS') > -1) {
          tmp.callout = {
            content: info.CARMARK,
            color: "#fff",
            fontSize: 14,
            borderRadius: 5,
            bgColor: "#575757",
            padding: 5,
            display: 'ALWAYS',
            textAlign: "left"
          }
        } else {
          var lon = 0,
            lat = 0;
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
            content: info.CARMARK,
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
    that.getAddress(info.OWEBLAT, info.OWEBLNG, function(res) {
      var address = res.formatted_address;
      that.data.carInfo.curAddress = address;
      console.log(that.data.carInfo.curAddress)
      that.setData(that.data);
    });
  },
  //搜索车辆信息
  searchCarInfo(id) {
    if (id == '1') {
      var title = '您没有需要刷新的车辆！';
      var carNumIsVIN = this.data.carInfo.CARMARK ? this.data.carInfo.CARMARK : this.data.carInfo.VIN;
    } else {
      var title = '请输入正确的车牌号或者VIN！';
      var carNumIsVIN = this.data.searchValue;
    }
    var userName = this.data.userName;
    if (!Parent.isPlateNo(carNumIsVIN) && !Parent.isVin(carNumIsVIN)) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var that = this;
    this.getCarInfo(carNumIsVIN, function(info) {
      that.setData({
        inputDisabled: false
      })
      if (info != null && info.length > 0) {
        that.getMapInfo(info[0]);
      } else {
        wx.showToast({
          title: '没有搜索到该车辆的信息！',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //点击列表项查询车辆
  clickCarInfo(e) {
    var userName = this.data.userName;
    var index = e.currentTarget.dataset.index;
    var info = this.data.carNumIsVINList[index];
    if (info.OWEBLAT == null && info.OWEBLNG == null) {
      wx.showToast({
        title: '没有搜索到该车辆的定位信息！',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        infoIsShow: true,
        searchValue: ''
      })
      this.getMapInfo(info);
    }
  },
  markertap(e) {
    var id = e.markerId;
  },
  getAddress(lat, lng, fuc) {
    var that = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2&location=' + lat + ',' + lng + '&output=json',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        fuc(res.data.result);
      },
      fail: function() {
        // that.setData({ currentCity: "获取定位失败" });
      }

    })
  },
  //刷新
  clickRefresh() {
    this.searchCarInfo('1');
  },
  btnToTrajectory() {
    wx.navigateTo({
      url: '../trajectory/trajectory?plateNo=' + this.data.carInfo.CARMARK,
    })
  },
  bindPickerChangeLeft(e) {
    var index = e.detail.value;
    var Id = this.data.userNameList[index].Id;
    this.setData({
      index: index,
      userName: this.data.userNameList[index].Name
    })
    this.loginPlatform(Id);
  },
  bindPickerChangeRight(e) {
    var key = e.detail.value;
    this.setData({
      key: key,
      searchType: this.data.searchTypeList[key]
    })
    if (this.data.searchType == '按车牌号搜索') {
      this.setData({
        placeholder: '请输入车牌号'
      })
    } else if (this.data.searchType == '按VIN码搜索') {
      this.setData({
        placeholder: '请输入VIN'
      })
    }
  },
  downIsUpAnimation() {
    if (!Parent.lock) {
      return;
    }
    Parent.lock = false;
    clearTimeout(tid);
    var tid = setTimeout(() => {
      Parent.lock = true;
    }, 500);
    this.setData({
      animetions: !this.data.animetions
    })
  },
  onShareAppMessage() {}
})