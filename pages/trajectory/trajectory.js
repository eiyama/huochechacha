// pages/lookupLocation/trajectory/trajectory.js

var util = require("../../utils/util.js")
var Parent = new util.default.Parent();
Parent.lock = true;

var isConfirm = true
var vno = ""
var startDate = ""
var startTime = ""
var endDate = ""
var endTime = ""

var weekday = new Array(7);
weekday[0] = "周日";
weekday[1] = "周一";
weekday[2] = "周二";
weekday[3] = "周三";
weekday[4] = "周四";
weekday[5] = "周五";
weekday[6] = "周六"
var queryRecordList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHiddenPlateNoHistory: true,
    isNone0: true,
    plateNo: "",
    startTime: "",
    endTime: "",
    startTimeArr: [],
    endTimeArr: [],
    startTimeValue: [],
    endTimeValue: [],
    historyPlateNoList: [],
    carNumIsVINList: [],
    carInfo: {
      carNum: '',
      state: '',
      speed: '',
      mileage: '',
      time: '',
      curAddress: ''
    },
    //wo
    tel: '',
    testCode: '',
    popupIsHide: false,
    imgUrl: '',
    msgPopupHide: false,
    testCodeHide: true,
    overTime: 120,
    testTelYes: true,
    onLinkId: '',
    queryRecordList: [],
    height: '',
    recordIsHide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.plateNo)
    if (options.plateNo == null || options.plateNo == undefined || options.plateNo == "") {
      vno = '';
    } else {
      vno = options.plateNo
    }
    this.setData({
      plateNo: vno
    })
    var that = this
    queryRecordList = wx.getStorageSync('trajectoryRecord') ? JSON.parse(wx.getStorageSync('trajectoryRecord')) : [];
    if (queryRecordList.length > 0) {
      this.setData({
        recordIsHide: true,
        height: (queryRecordList.length > 10 ? 10 : queryRecordList.length) * 60
      })
    }
    var now = new Date();
    var start = now.setMonth(now.getMonth() - 6) //
    var days = parseInt((new Date().getTime() - start) / (1000 * 60 * 60 * 24))

    var dateArr = [];
    var timeArr = [];
    var list = [];
    for (var i = 0; i < queryRecordList.length; i++) {
      list.push(queryRecordList[i]);
    }
    this.setData({
      imgUrl: util.host + '/images/searchCar/cha.gif',
      queryRecordList: list
    });
    for (var i = days; i >= 0; i--) {
      var dateTmp = new Date(new Date().setDate(new Date().getDate() - i))
      var monthNow = dateTmp.getMonth() + 1;
      var dayNow = dateTmp.getDate()
      monthNow = (monthNow == 0 ? "12" : monthNow < 10 ? "0" + monthNow : monthNow);
      dateArr.push(dateTmp.getFullYear() + '-' + monthNow.toString() + '-' + (dayNow < 10 ? "0" + dayNow : dayNow.toString()))
      timeArr = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
    }

    startDate = dateTmp.getFullYear() + '-' + monthNow.toString() + '-' + (dayNow < 10 ? "0" + dayNow : dayNow.toString())
    startTime = timeArr[0] // timeArr[parseInt(dateTmp.getHours())]
    endDate = dateTmp.getFullYear() + '-' + monthNow.toString() + '-' + (dayNow < 10 ? "0" + dayNow : dayNow.toString())
    endTime = timeArr[parseInt(dateTmp.getHours())]

    that.data.startTime = startDate + " " + startTime
    that.data.endTime = endDate + " " + endTime
    that.data.startTimeArr[0] = dateArr
    that.data.startTimeArr[1] = timeArr
    that.data.startTimeValue = [days, 0]
    that.data.endTimeArr[0] = dateArr
    that.data.endTimeArr[1] = timeArr
    that.data.endTimeValue = [days, parseInt(dateTmp.getHours())]

    var PlateNohistory = wx.getStorageSync("search_trajectory")
    if (PlateNohistory != null && PlateNohistory.length > 0 && PlateNohistory instanceof Array) {
      that.data.historyPlateNoList = PlateNohistory
      that.data.isHiddenPlateNoHistory = false
    }
    that.setData(that.data)
  },

  inputVNo(e) {
    vno = e.detail.value
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
    if (vno.length >= 2) {
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
  //点击列表项查询车辆
  clickCarInfo(e) {
    var userName = this.data.userName;
    var index = e.currentTarget.dataset.index;
    var info = this.data.carNumIsVINList[index];
    this.setData({
      plateNo: info.CARMARK,
      carNumIsVINList: []
    })
    vno = info.CARMARK
  },
  bindStartTimeChange(e) {
    var value = e.detail.value
    startDate = this.data.startTimeArr[0][value[0]]
    startTime = this.data.startTimeArr[1][value[1]]
    this.setData({
      startTime: (startDate == "" ? this.data.startTimeArr[0][0] : startDate) + ' ' + (startTime == "" ? this.data.startTimeArr[1][0] : startTime)
    })
  },

  bindEndTimeChange(e) {
    var value = e.detail.value
    endDate = this.data.endTimeArr[0][value[0]]
    endTime = this.data.endTimeArr[1][value[1]]
    this.setData({
      endTime: (endDate == "" ? this.data.endTimeArr[0][0] : endDate) + ' ' + (endTime == "" ? this.data.endTimeArr[1][0] : endTime)
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  query(event) {
    var that = this;
    if (vno == '') {
      this.setData({
        isNone0: false
      })
      return;
    }
    var startTimestamp = new Date((startDate + " " + startTime + ":00").replace(/\-/g, '/')).getTime();
    var endTimestamp = new Date((endDate + " " + endTime + ":00").replace(/\-/g, '/')).getTime();
    console.log(startTimestamp)
    console.log(endTimestamp)
    if (startTimestamp > endTimestamp) {
      console.log(3)
      wx.showToast({
        title: '开始时间不能大于结束时间',
        icon: 'none'
      })
      return
    }
    if ((endTimestamp - startTimestamp) > 24 * 60 * 60 * 1000) {
      console.log(3)
      wx.showToast({
        title: '时间段最长为24小时',
        icon: 'none'
      })
      return
    }

    var postData = {};
    postData.PlateNo = vno;
    postData.Start = startDate + " " + startTime + ":00";
    postData.End = endDate + " " + endTime + ":00";

    //str.addHistory("search_trajectory", postData);

    if (queryRecordList.length > 0) {
      var boole = true;
      for (var i = 0; i < queryRecordList.length; i++) {
        if (queryRecordList[i].PlateNo == vno) {
          queryRecordList.splice(i, 1);
          queryRecordList.unshift(postData);
          boole = false;
        }
      }
      if (boole) {
        queryRecordList.unshift(postData);

      }
    } else {
      queryRecordList.unshift(postData);
    }
    wx.setStorageSync('trajectoryRecord', JSON.stringify(queryRecordList));

    Parent.ajax(
      "vehiclemanager/Platform/GetVehicleTrajectory",
      postData,
      function(req) {
        var rst = req.result;
        if (rst.code == 0) {
          if (rst.info != null && rst.info.List.length > 0) {
            var data = rst.info.List;
            wx.navigateTo({
              url: '../haveTrajectory/haveTrajectory?value=' + JSON.stringify(data) + '&startTime=' + that.data.startTime + '&endTime=' + that.data.endTime + '&plateNo=' + vno + '&id=1'
            })
          } else {
            wx.showToast({
              title: '暂无数据!',
              icon: "none"
            })
          }
        } else {
          wx.showToast({
            title: rst.msg,
            icon: "none"
          })
        }
      }
    )
  },
  //点击历史记录查询
  toSearch(e) {
    if (!isConfirm) {
      return;
    };
    var item = e.currentTarget.dataset.item,
      that = this,
      obj = {};
    vno = item.PlateNo;
    obj.PlateNo = item.PlateNo;
    obj.Start = item.Start;
    obj.End = item.End;

    Parent.ajax(
      "vehiclemanager/Platform/GetVehicleTrajectory",
      obj,
      function(req) {
        var rst = req.result;
        if (rst.code == 0) {
          if (rst.info != null && rst.info.List.length > 0) {
            var data = rst.info.List;
            wx.navigateTo({
              url: '../haveTrajectory/haveTrajectory?value=' + JSON.stringify(data) + '&startTime=' + that.data.startTime + '&endTime=' + that.data.endTime + '&plateNo=' + vno + '&id=1'
            })
          } else {
            wx.showToast({
              title: '暂无数据!',
              icon: "none"
            })
          }
        } else {
          wx.showToast({
            title: rst.msg,
            icon: "none"
          })
        }
      }
    )
  },
  //点击删除当前查询记录
  btnRemove(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.queryRecordList.length == queryRecordList.length) {
      queryRecordList.splice(index, 1);
      this.setData({
        queryRecordList: queryRecordList
      });
      if (queryRecordList.length == 0) {
        this.setData({
          recordIsHide: false
        })
      } else {
        this.setData({
          height: (queryRecordList.length > 10 ? 10 : queryRecordList.length) * 60
        })
      }
      wx.setStorageSync('trajectoryRecord', JSON.stringify(queryRecordList));
    } else {
      var num = queryRecordList.length - this.data.queryRecordList.length;
      queryRecordList.splice(index + num, 1);
      this.data.queryRecordList.splice(index, 1);
      this.setData(this.data);
      if (this.data.queryRecordList.length == 0) {
        this.setData({
          recordIsHide: false
        })
      } else {
        this.setData({
          height: (this.data.queryRecordList.length > 10 ? 10 : this.data.queryRecordList.length) * 60
        })
      }
      wx.setStorageSync('trajectoryRecord', JSON.stringify(queryRecordList));
    }
  },

})