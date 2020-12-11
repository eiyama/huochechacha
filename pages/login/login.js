var util = require('../../utils/util.js');
var Parent = new util.default.Parent();
Page({
  data: {
    userName: '',
    isValueEmpty: false
  },
  onLoad(options) {

  },
  //获取登录名
  getUserName(e) {
    var userName = e.detail.value;
    if (userName != '') {
      this.setData({
        isValueEmpty: false
      })
    }
    this.setData({
      userName: userName
    })
  },
  //登录
  clickLogin() {
    var userName = this.data.userName.trim();
    if (userName == '') {
      this.setData({
        isValueEmpty: true
      })
      return;
    }
    Parent.ajax(
      'vehiclemanager/Account/SysLogin',
      JSON.stringify(userName),
      function(res) {
        if (res.result) {
          wx.showToast({
            title: '登录成功！',
            icon: 'none',
            duration: 2000
          });
          wx.setStorageSync('Bearer', res.result.Token);
          wx.setStorageSync('UserInfo', res.result);
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      }
    )
  },
  onShareAppMessage() {}
})