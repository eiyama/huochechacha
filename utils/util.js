const app = getApp();
class Parent {
  //所有的属性都写在构造器里面
  constructor() {
    this.host = 'https://gateway.huochechacha.com/';//测试
    // this.host = 'https://wxapi.huochechacha.com/'; // 正式
    // this.host = 'https://wxapitest.huochechacha.com/'; // 新的
    this.lock = true;
  };

  //验证手机号
  isTel(tel) {
    var pattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    return pattern.test(tel);
  };

  //验证车牌号
  isPlateNo(PlateNo) {
      var pattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Za-z]{1}[A-Za-z]{1}[A-Za-z0-9]{4}[A-Za-z0-9挂学警港澳]{1}$/;
    return pattern.test(PlateNo);
  };
  //验证VIN
  isVin(vin) {
    var pattern = /^\S{17}$/;
    return pattern.test(vin);
  };
  //倒计时
  countDown(times,fuc) {
    clearTimeout(tid);
    var tid = setTimeout(() => {
      times--;
      fuc(times);
      if (times == 0) {
        clearTimeout(tid);
      } else {
        this.countDown(times,fuc);
      };
    }, 1000)
  };
  //拼接时间
  getDateTime(times){
    var date = new Date(times);
    var full = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();
    return this.zeroize(full) + '-' + this.zeroize(month) + '-' + this.zeroize(day) + ' ' + this.zeroize(hours) + ':' + this.zeroize(minutes) + ':' + this.zeroize(seconds);
  };
  zeroize(num){
    if(num < 10){
      return '0' + num;
    } else {
      return num;
    }
  };
  //请求
  ajax(url, data, successFn, loading) {
    console.log('请求的Url：' + url);
    console.log('请求的参数：' + JSON.stringify(data));
    var _this = this;
    if (loading || loading == undefined) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    };
    wx.request({
      url: this.host + url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Bearer': wx.getStorageSync("Bearer")
      },
      success(res) {
        console.log('请求的结果：' + JSON.stringify(res.data)) 
        if (loading || loading == undefined) {
          wx.hideLoading();
        }
        var code = res.data.code;       
        if (code == 200) {
          successFn(res.data);
        } else if (res.statusCode == 404) {
          wx.navigateTo({
            url: '/pages/tips/tips?errType=2'
          })
        } else if (code == 398 || code == 399 || code == 395 || code == 396){
          wx.reLaunch({
            url: '/pages/login/login'
          })
        } else if(code == 306) {
          wx.showModal({
            title: '提示',
            content: '登录名错误，请输入正确的登录名！'
          })
        }
      },
      fail(err) {
        if (loading || loading == undefined) {
          wx.hideLoading();
        }
        console.log('请求error')
        wx.navigateTo({
          url: '/pages/tips/tips?errType=2'
        })
      },
      complete() {
        
      }
    })
  };

  //选择图片
  chooseImg(num, index, id, that) {
    var that = this;
    wx.chooseImage({
      count: num,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.uploadImg(res.tempFilePaths, index, num, id, that);
      }
    })
  };

  //上传图片
  uploadImg(imgList, index, num, id, that) {
    var _this = this;
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });
    wx.uploadFile({
      url: this.host + "", //仅为示例，非真实的接口地址
      filePath: imgList[index],
      name: 'images',
      header: { // 默认值,
        "Content-Type": "application/json",
        'Bearer': wx.getStorageSync("userSession")
      },
      success(res) {
        var data = res.data;
        switch (id) {
          case '1':
            that.setData({
              mainImg1: res.data
            });
            break;
          case '2':
            that.setData({
              mainImg2: res.data
            });
            break;
          case '3':
            that.setData({
              mainImg3: res.data
            });
            break;
          case '4':
            that.setData({
              mainImg4: res.data
            });
            break;
          case '5':
            that.setData({
              mainImg5: res.data
            });
            break;
          case '6':
            that.setData({
              mainImg6: res.data
            });
            break;
          case '7':
            that.setData({
              mainImg7: res.data
            });
            break;
          case '8':
            that.setData({
              mainImg8: res.data
            });
            break;
          default:
            that.data.otherImgList[index].imgUrl = res.data;
            that.setData(that.data);
        }
      },
      complete() {
        if (index++ < imgList.length) {
          _this.uploadImg(imgList, index + 1, num, id, that);
        } else {
          _this.lock = true;
          wx.hideLoading();
          return;
        }
      }
    })
  }
}

export default {
  Parent: Parent
}