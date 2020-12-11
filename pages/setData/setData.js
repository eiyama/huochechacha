var util = require('../../utils/util.js');
var Parent = new util.default.Parent();
Page({
  data: {
    oneIsShow: true,
    curIndex: '0',
    oneForm: {},
    index: 0,
    key: 0,
    num: 0,
    array: [],
    btnShow: true,
    curQuery: true,
    list: [],
    queryList: [],
    idIs3: false,
    departmentList: [],
    nameList: [],
    deviceName: '',
    name: '',
    dptName: '',
    scrollH: ''
  },
  onLoad(options) {
    var that = this;
    Parent.id = options.id;
    //1代表搜索到了信息，2是没有，3是从安装记录跳转过来
    if (options.id == '1') {
      var info = JSON.parse(options.info);
      this.setData({
        oneForm: info
      });
      if (info.OTime) {
        this.setData({
          btnShow: false
        })
      } else {
        this.setData({
          btnShow: true
        })
      }
    } else if (options.id == '2') {
      that.data.oneForm.CARID = options.SIM;
      that.btnShow = false;
      that.setData(that.data);
    } else if (options.id == '3') {
      this.setData({
        oneIsShow: false,
        curIndex: 1,
        idIs3: true
      });
      Parent.info = JSON.parse(options.info);
      this.getCarInfo(Parent.info.DeviceId, (res) => {
        Parent.sim = res.result.info[0].SIMNO;
        that.queryState();
        this.setData({
          oneForm: res.result.info[0]
        })
        if (res.result.info[0].OTime) {
          this.setData({
            btnShow: false
          })
        } else {
          this.setData({
            btnShow: true
          })
        }
      })
      return;
    }
    Parent.platformId = options.platformId;
    Parent.ajax(
      'vehiclemanager/Platform/GetDeviceTypes',
      '',
      (res) => {
        var info = res.result.info;
        if (options.id == '1') {
          for (var i in info) {
            if (that.data.oneForm.DTYPE_ID == info[i].DeviceId) {
              that.setData({
                deviceName: info[i].DeviceName,
                index: i
              })
            }
          }
        };
        this.setData({
          array: info
        })
      }
    );
    Parent.ajax(
      'vehiclemanager/Platform/GetUsers',
      '',
      (res) => {
        var list = res.result;
        if (options.id == '1') {
          for (var i in list) {
            if (list[i] == this.data.oneForm.INSTALLER) {
              this.setData({
                name: list[i],
                num: i
              })
            }
          }
        };
        this.setData({
          nameList: list
        })
      }
    );
    Parent.ajax(
      'vehiclemanager/Platform/GetDepartments',
      '',
      (res) => {
        var list = res.result.info;
        if (options.id == '1') {
          for (var i in list) {
            if (list[i].DptId == this.data.oneForm.DPT_ID) {
              this.setData({
                dptName: list[i].DptName,
                key: i
              })
            }
          }
        };
        this.setData({
          departmentList: res.result.info
        })
      }
    )
  },
  //点击下一步
  tapNext() {
    wx.setNavigationBarTitle({
      title: '设备设置'
    });
    var that = this,
      pltate = this.data.oneForm.CARMARK,
      VIN = this.data.oneForm.VIN,
      deviceTypeId = this.data.array[this.data.index].Id;
    if (!pltate) {
      wx.showToast({
        title: '请输入车牌号！',
        icon: 'none'
      });
      return;
    } else if (!VIN) {
      wx.showToast({
        title: '请输入VIN！',
        icon: 'none'
      });
      return;
    } else if (!this.data.oneForm.SIMNO) {
      wx.showToast({
        title: '请输入SIM卡号！',
        icon: 'none'
      });
      return;
    } else if (!this.data.deviceName) {
      wx.showToast({
        title: '请选择设备类型！',
        icon: 'none'
      });
      return;
    } else if (!this.data.dptName) {
      wx.showToast({
        title: '请选择所属组织！',
        icon: 'none'
      });
      return;
    }
    var obj = this.data.oneForm,
      dtypE_ID = this.data.array[this.data.index].DeviceId,
      INSTALLER = this.data.name,
      dptId = this.data.departmentList[this.data.key].DptId;
    if (Parent.id == '1') {
      Parent.ajax(
        'vehiclemanager/Platform/ChangeVehicleInfo', {
          "platformId": Parent.platformId,
          "deviceTypeId": deviceTypeId,
          "dptId": dptId,
          "carmak": obj.CARMARK,
          "carinfO_ID": obj.CARINFO_ID,
          "simno": obj.SIMNO,
          "carid": obj.CARID,
          "vin": obj.VIN,
          "memo": obj.MEMO,
          "carcolor": obj.CARCOLOR,
          "installer": INSTALLER,
          "dtypE_ID": dtypE_ID
        },
        function(res) {
          if (res.result.info == '操作成功') {
            wx.showToast({
              title: '修改车辆信息成功!',
              icon: 'none',
              duration: 1000
            });
            setTimeout(() => {
              that.setData({
                oneIsShow: false,
                curIndex: '1'
              });
            }, 1000)
          } else {
            wx.showToast({
              title: res.result.msg,
              icon: 'none',
              duration: 1000
            });
          }
        }
      )
    } else if (Parent.id == '2') {
      Parent.ajax(
        'vehiclemanager/Platform/AddVehicleInfo', {
          "platformId": Parent.platformId,
          "deviceTypeId": deviceTypeId,
          "dptId": dptId,
          "carmak": obj.CARMARK,
          "carinfO_ID": obj.CARINFO_ID,
          "simno": obj.SIMNO,
          "carid": obj.CARID,
          "vin": obj.VIN,
          "memo": obj.MEMO,
          "carcolor": obj.CARCOLOR,
          "installer": INSTALLER,
          "dtypE_ID": dtypE_ID
        },
        function(res) {
          if (res.result.info == '操作成功') {
            wx.showToast({
              title: '添加车辆信息成功!',
              icon: 'none',
              duration: 1000
            });
            setTimeout(() => {
              that.setData({
                oneIsShow: false,
                curIndex: '1'
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.result.msg,
              icon: 'none',
              duration: 1000
            });
          }
        }
      )
    }

  },
  //获取元素的信息
  getDomInfo(dom,callback) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select(dom).boundingClientRect((rect) => {
      callback(rect)
    }).exec();
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
  //获取车牌号
  getCarNum(e) {
    var carNum = e.detail.value.toUpperCase();
    this.data.oneForm.CARMARK = carNum;
    this.setData(this.data);
  },
  //获取VIN
  getVIN(e) {
    var VIN = e.detail.value.toUpperCase();
    this.data.oneForm.VIN = VIN;
    this.setData(this.data);
  },
  //获取SIM
  getSIM(e) {
    var SIM = e.detail.value.toUpperCase();
    this.data.oneForm.SIMNO = SIM;
    this.setData(this.data);
  },
  bindPickerChange(e) {
    var index = e.detail.value;
    this.data.index = index;
    this.data.deviceName = this.data.array[index].DeviceName;
    this.setData(this.data);
  },
  //选择组织
  bindPickerChangeDepartment(e) {
    var index = e.detail.value;
    this.data.key = index;
    this.data.dptName = this.data.departmentList[index].DptName;
    this.setData(this.data);
  },
  //选择安装人员
  bindPickerChangeName(e) {
    var index = e.detail.value;
    this.data.num = index;
    this.data.name = this.data.nameList[index];
    this.setData(this.data);
  },
  //点击发送激活短信
  tapSMS() {
    var that = this;
    if (Parent.id == '1' || Parent.id == '2') {
      var obj = this.data.oneForm,
        deviceTypeId = this.data.array[this.data.index].DeviceId;
    } else if (Parent.id == '3') {
      var obj = this.data.oneForm,
        deviceTypeId = this.data.oneForm.DTYPE_ID;
    }

    Parent.ajax(
      'vehiclemanager/Platform/SendSMS', {
        "platformId": Parent.platformId,
        "deviceTypeId": deviceTypeId,
        "deviceId": obj.CARID,
        "plateNo": obj.CARMARK,
        "vin": obj.VIN,
        "sim": obj.SIMNO
      },
      /*{
        "platformId": "872e4725-a102-11e8-9bf2-000c29c8a37b",
        "deviceTypeId": 5,
        "deviceId": "0000000000",
        "plateNo": "川a12345",
        "vin": "0000000000",
        "sim": "1064792811654"
      },*/
      function(res) {
        if (res.result.length > 0) {
          wx.showToast({
            title: '激活短信发送成功!',
            icon: 'none',
            duration: 1000
          });
          var list = [];
          for (var i in res.result) {
            if (res.result[i].result.Code != 0) {
              list.push(res.result[i]);
            }
          };
          that.setData({
            btnShow: false,
            list: list
          })
          that.queryState();
        } else {
          wx.showToast({
            title: '激活短信发送失败!',
            icon: 'none',
            duration: 1000
          });
        }
      }
    )
  },
  //重新发送
  resendOne(e) {
    var id = e.currentTarget.dataset.id,
      item = e.currentTarget.dataset.item;
    var SIM = item.result.SIM,
      directive = item.result.Directive;
    this.resendFn(SIM, directive);
  },
  resendFn(SIM, directive) {
    Parent.ajax(
      'vehiclemanager/Platform/ReSendSMS', {
        "sim": SIM,
        "directive": directive
      },
      (res) => {
        if (res.result.result.Code == 0) {
          wx.showToast({
            title: '激活短信发送成功!',
            icon: 'none',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: res.result.result.Msg,
            icon: 'none',
            duration: 1000
          });
        }
      }
    )
  },
  resendTwo(e) {
    var id = e.currentTarget.dataset.id,
      item = e.currentTarget.dataset.item;
    var SIM = item.result.msisdn,
      directive = item.result.content;
    this.resendFn(SIM, directive);
  },
  //获取焦点
  changeFocusCar() {
    this.setData({
      curQuery: true,
      activeCar: true
    })
  },
  //失去焦点
  changeBlurCar() {
    this.setData({
      activeCar: false
    })
  },
  //获取焦点
  changeFocusVIN() {
    this.setData({
      curQuery: false,
      activeVIN: true
    })
  },
  //失去焦点
  changeBlurVIN() {
    this.setData({
      activeVIN: false
    })
  },
  //查询状态
  queryState() {
    var dateTime = new Date();
    var that = this;
    this.getDomInfo('.scroll-model', (res) => {
      that.setData({
        scrollH: res.height
      })
    })
    var curDate = dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1);
    if (Parent.id == '1' || Parent.id == '2') {
      var SIM = this.data.oneForm.SIMNO;
    } else if (Parent.id == '3') {
      var SIM = Parent.sim;
    }
    Parent.ajax(
      'vehiclemanager/Platform/GetSMS', {
        "imsi": "",
        "iccid": "",
        "msisdn": SIM,
        // "msisdn": 1064792811654,
        "yearMonth": curDate
      },
      (res) => {
        if (!res.result.result || res.result.result.length == 0) {
          wx.showToast({
            title: '暂无状态！',
            icon: 'none',
            duration: 1000
          })
        }
        var list = res.result.result;
        for (var i in list) {
          list[i].time = Parent.getDateTime(list[i].createTime);
        }
        this.setData({
          queryList: list
        });
      }
    )
  },
  //更多设置
  moreSet() {

  },
  //上传资料
  uoloadInfo() {
    wx.navigateTo({
      url: '/pages/otherLink/otherLink?id=1'
    })
  },
  //查看车辆上线情况
  queryCarInfo() {
    var deviceId = this.data.oneForm.CARID;
    wx.navigateTo({
      url: '/pages/monitor/monitor?deviceId=' + deviceId
    })
  },
  //返回上一步
  prevPage() {
    if (Parent.id == '1' || Parent.id == '2') {
      this.setData({
        oneIsShow: true,
        curIndex: 0
      })
    }
  },
  onShareAppMessage() {}
})