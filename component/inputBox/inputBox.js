// component/inputBox/inputBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    parmValue: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal != oldVal) {
          // var newVal = JSON.parse(newVal)
          this.setData(newVal)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isImportent:false,
    title:"-",
    placeholder:"-",
    isNone:true,
    isArrow:false,
    isPicker:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFocus(event){
      var code = event.currentTarget.dataset.code
      this.triggerEvent('onFocus', { code: code }, { bubbles: true })
    },
    inputClick(event){
      var value = event.detail.value
      var code = event.currentTarget.dataset.code
      this.triggerEvent('inputClick', { code: code ,value:value }, { bubbles: true })
    },
    onBlur(event){
      var code = event.currentTarget.dataset.code
      this.triggerEvent('onBlur', { code: code }, { bubbles: true })
    },
    onChange(event){
      var value = event.detail.value
      var code = event.currentTarget.dataset.code
      this.triggerEvent('changeClick', { code: code, value: value }, { bubbles: true })
    },
    
  }
})
