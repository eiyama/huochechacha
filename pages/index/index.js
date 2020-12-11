var util = require('../../utils/util.js');
var Parent = new util.default.Parent();
const app = getApp();
Page({
  data: {
    loginUserName: '',
    loginUserType:0,
    ismy:true,
    notmy:true,
    index: 0,
    SIM: '',
    customer: '',
    times: 60,
    isValueEmpty: false,
    array: [],
    SIMList: []
  },
  onLoad(options) {
    var that = this;

    var UserInfo = wx.getStorageSync("UserInfo")
    that.setData({
      loginUserName: UserInfo.UserName,
      loginUserType: UserInfo.UserType
    })
    
    //1 安装人员  2 企业
    if (that.data.loginUserType == 2){
      that.setData({
        ismy: false
      })
    }
    else {
      that.setData({
        notmy: false
      })
    }
    Parent.ajax(
      'vehiclemanager/Platform/GetPlatforms',
      '',
      function(res) {
        that.setData({
          array: res.result
        })
        //1 安装人员  2 企业
        if (that.data.loginUserType == 2) {
          for (var i in res.result) {
            if (res.result[i].UserName == that.data.loginUserName) {
              that.loginPlatform(res.result[i].Id);
            }
          }
        } else {
          that.loginPlatform(res.result[0].Id);
        }
      }
    )
  },
  //当选择框的值发生变化
  bindPickerChange(e) {
    var index = e.detail.value;
    var Id = this.data.array[index].Id;
    this.setData({
      index: index,
      customer: this.data.array[index].Name
    });
    this.loginPlatform(Id);
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
  //点击查询
  clickQuery(e) {
    var SIM = e.currentTarget.dataset.id,
      platformId = this.data.array[this.data.index].Id;
    if (this.data.SIM) {
      this.getCarInfo(SIM, (res) => {
        var info = res.result.info,
          lock = true,
          obj = {};
        for (var i in info) {
          if (info[i].CARID.toUpperCase() == SIM) {
            lock = false;
            obj = info[i];
          }
        }
        if (!lock) {
          wx.navigateTo({
            url: '/pages/setData/setData?info=' + JSON.stringify(obj) + '&id=1' + '&platformId=' + platformId
          });
        } else {
          wx.navigateTo({
            url: '/pages/setData/setData?SIM=' + SIM + '&id=2' + '&platformId=' + platformId
          })
        }
        this.setData({
          SIM: ''
        });
      });
    } else {
      this.setData({
        isValueEmpty: true
      })
    }
  },
  //获取车辆信息
  getCarInfo(SIM, fuc) {
    Parent.ajax(
      'vehiclemanager/Platform/GetVehicleBaseInfo',
      JSON.stringify(SIM),
      function(res) {
        fuc(res);
      }
    )
  },
  linkUpInfo() {
    wx.navigateTo({
      url: '/pages/otherLink/otherLink?id=1'
    })
  },
  linkRecordList() {
    wx.navigateTo({
      url: '/pages/recordList/recordList'
    })
  },
  getSIM(e) {
    var SIM = e.detail.value.toUpperCase(),
      that = this;
    this.setData({
      SIM: SIM.replace(/\s+/g, '')
    })
    if (SIM) {
      this.setData({
        isValueEmpty: false
      })
    } else {
      this.setData({
        SIMList: []
      })
    }
    this.getCarInfo(SIM, function(res) {
      var info = res.result.info,
        list = [];
      for (var i in info) {
        if (info[i].CARID.indexOf(SIM) > -1) {
          var left = info[i].CARID.substr(0, info[i].CARID.indexOf(SIM)),
            right = info[i].CARID.substring(info[i].CARID.indexOf(SIM) + SIM.length);
          info[i].left = left;
          info[i].right = right;
          list.push(info[i]);
        }
      }
      that.setData({
        SIMList: list
      })
    })
  },
  //点击查询车辆位置
  linkQueryLocation() {
    wx.navigateTo({
      url: '/pages/GpsQuery/GpsQuery?loginUserName=' + this.data.loginUserName
    })
  },


  //点击查询车辆轨迹
  linkQueryTrajectory() {
    wx.navigateTo({
      url: '/pages/trajectory/trajectory'
    })
  },

  //退出
  btnExit(){
    wx.clearStorage();
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },

  onShareAppMessage() {}
})