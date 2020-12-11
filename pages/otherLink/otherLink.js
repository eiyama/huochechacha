Page({
  data: {
    src: ''
  },
  onLoad: function(options) {
    if (options.id == '1') {
      var src = 'https://wxmini.huochechacha.com/AICheGuanJia?Bearer=' + wx.getStorageSync("Bearer");
      // var src = 'https://wxminitest.huochechacha.com/dist';//测试
      // var src = 'https://liweishan.github.io/carMange/?Bearer=' + wx.getStorageSync("Bearer");//github
    }
    this.setData({
      src: src
    })
  },
  onShareAppMessage() { }  
})