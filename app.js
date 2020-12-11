var util = require('utils/util.js');
var Parent = new util.default.Parent();
App({
  version: 'v0.0.3.8',
  onLaunch: function() {
    // 展示本地存储能力
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    // this.login(function(res){});
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    // if(wx.getStorageSync('token')){
    //   wx.redirectTo({
    //     url: '/pages/index/index'
    //   })
    // }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        
        }
      }
    })
  },
  login(fuc){
    wx.login({
      success: res => {
        if(res.code) {
          var code = res.code;
          console.log(code)
          wx.getSystemInfo({
            success: r =>{
              Parent.ajax(
                'vehiclemanager/Account/Login',
                JSON.stringify({
                  "code": code,
                  "version": r.version,
                  "brand": r.brand,
                  "model": r.model,
                  "pixelRatio": r.pixelRatio,
                  "screenWidth": r.screenWidth,
                  "screenHeight": r.screenHeight,
                  "windowWidth": r.windowWidth,
                  "windowHeight": r.windowHeight,
                  "platform": r.platform,
                  "system": r.system
                }),
                function(res) {
                  fuc(res);
                  wx.setStorageSync('Bearer', res.result);
                  console.log(res)
                },
                false
              )
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})