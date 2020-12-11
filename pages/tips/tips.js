Page({
  data: {
    networkErr: false,
    tipsrc: '',
    msgInfo: ''
  },
  onLoad: function (options) {
    var errType = options.errType;
    switch(errType){
      case '2':
      this.setData({
        networkErr: true,
        tipsrc: '/images/tips/neterr.png',
        msgInfo: '网络好像出了点问题'
      })
    }
  }
})