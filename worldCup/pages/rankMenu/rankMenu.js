// pages/rank/rank.js
var app = getApp();
var http = require('../../utils/http.js');

Page({

  data: {
    selected: true,
    selected1: false,
    items: [],
    items1: [],
    show: false,
    getActive: false,
    mayClick: true,
    animations: [null, null, null],//动画实例引用数组
    // animationData: {},
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    var demo = this;
    demo.setData({
      selected: false,
      selected1: true
    })
  },
  onLoad: function (options) {
    var demo = this;
    demo.goRank();
  },
  onShow: function (options) {
    var demo = this;
    demo.goRank();
  },

  goRank: function () {
    var demo = this;
    http.post({
      uri: 'phone/star/list.json',
      param: {
        flag: 'WXDCXS'
      },
      success: function (res) {
        console.log(res.data.data)
        wx.switchTab({
          url: '../rank/rank',
        })
        if (res.data.status) {
          demo.setData({
            items: res.data.data
          })
        } else {
          wx.showToast({
            title: '请求失败！',
            content: '',
            duration: 400
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },


  close: function () {
    this.setData({
      show: false
    })
  },
  close1: function () {
    this.setData({
      getActive: false
    })
  },
  getTen: function () {
    this.setData({
      getActive: true
    })
  },
  addOne: function (e) {
    var id = parseInt(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.indexid;
    var demo = this;

    var animation = wx.createAnimation({
      transformOrigin: "50% 0%",
      duration: 400,
      timingFunction: "linear",
      delay: 0
    })
    animation.opacity(1).translate(0, -5).step();
    // animation.opacity(0).translate(0, 0).step();
    animation.opacity(0).translate(0, 0).step();
    // demo.setData({
    //   [`animationData${index}`]: animation.export(),
    //   // animationData: animation.export(),
    // })
    // console.log(`animationData${index}`)

    for (let i = 0; i < demo.data.animations.length; i++) {
      demo.data.animations[i] = null;
    }
    // 添加当前点赞的索引的动画实例引用
    if (index <= 0) {
      demo.data.animations[0] = animation;
    } else {
      demo.data.animations[index] = animation;
    }
    console.log(demo.data)
    console.log(demo.data.animations)
    console.log(index)
    console.log(demo.data.animations[index])
    demo.setData({
      animations: demo.data.animations
    })
  },
  zan: function (e) {
    var id = parseInt(e.currentTarget.dataset.index);
    var demo = this;

    if (demo.data.mayClick) {
      demo.setData({
        mayClick: false
      })
    } else {
      return false
    }
  },
  onShareAppMessage: function () {//电脑是看不到分享结果的，只能在手机上调试
    var demo = this;
    return {
      title: '疯狂竞猜世界杯，一起瓜分6666！',
      imageUrl: '/img/share.jpg',
      success: function (res) {
        console.log(112222)
        demo.setData({
          show: false
        })
        demo.postShare();
      },
      fail: function (err) {
        console.log(err)
      }
    }
  },
  postShare: function () {
  },
  getItems: function () {
    var demo = this
  }
})