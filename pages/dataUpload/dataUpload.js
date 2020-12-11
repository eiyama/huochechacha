var util = require('../../utils/util.js');
var Parent = new util.default.Parent();
Page({
  data: {
    curQuery: true,
    activeCar: false,
    activeVIN: false,
    formInfo: {
      mainImg1: '/images/dataUpload/uploadImgBg1.png',
      mainImg2: '/images/dataUpload/uploadImgBg2.png',
      mainImg3: '/images/dataUpload/uploadImgBg3.png',
      mainImg4: '/images/dataUpload/uploadImgBg4.png',
      mainImg5: '/images/dataUpload/uploadImgBg5.png',
      mainImg6: '/images/dataUpload/uploadImgBg6.png',
      mainImg7: '/images/dataUpload/uploadImgBg7.png',
      mainImg8: '/images/dataUpload/uploadImgBg7.png'
    },
    otherImgList: [{
        imgUrl: '/images/dataUpload/uploadImgBg7.png'
      },
      {
        imgUrl: '/images/dataUpload/uploadImgBg7.png'
      },
      {
        imgUrl: '/images/dataUpload/uploadImgBg7.png'
      },
      {
        imgUrl: '/images/dataUpload/uploadImgBg7.png'
      },
      {
        imgUrl: '/images/dataUpload/uploadImgBg7.png'
      },
      {
        imgUrl: '/images/dataUpload/uploadImgBg7.png'
      }
    ]
  },
  onLoad: function(options) {

  },
  //获取车牌号
  getCarNum(e) {
    var carNum = e.detail.value;
    this.data.formInfo.carNum = carNum;
    this.setData(this.data);
  },
  //获取VIN
  getVIN(e){
    var VIN = e.detail.value;
    this.data.formInfo.VIN = VIN;
    this.setData(this.data);
  },
  //获取司机姓名
  getDriverName(e) {
    var driverName = e.detail.value;
    this.data.formInfo.driverName = driverName;
    this.setData(this.data);
  },
  //获取手机号码
  getTel(e) {
    var tel = e.detail.value;
    this.data.formInfo.tel = tel;
    this.setData(this.data);
  },
  //提交
  formSubmit() {
    console.log(this.data.formInfo)
  },
  //点击上传单张图片
  clickUpImg(e) {
    if(!Parent.lock){
      return;
    }
    Parent.lock = false;
    var id = e.currentTarget.dataset.id;
    if(id == '9') {
      var index = 0, list = this.data.otherImgList,num = list.length;
      for(var i = list.length -1;i >= 0;i--) {
        if (i == 3){
          index = i;
          num = num - (i + 1);
          break;
        }
      }
      Parent.chooseImg(num, index + 1, id, this);      
    } else {
      Parent.chooseImg(1, 0, id, this);
    }
  },
  //点击查询
  clickQuery(){

  },
  //获取焦点
  changeFocusCar(){
    this.setData({
      curQuery: true,
      activeCar: true
    })
  },
  //失去焦点
  changeBlurCar(){
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
  onShareAppMessage() { }  
})