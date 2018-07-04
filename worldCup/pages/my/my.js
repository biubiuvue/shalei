// pages/my/my.js
var app = getApp();
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    noData: false,
    selected: true,
    selected1: false,
    selected2:false
  },
  selected: function (e) {
      this.setData({
          selected1: false,
          selected2: false,
          selected: true,
      })
      this.init(1);      
  },
  selected1: function (e) {
      this.setData({
          selected: false,
          selected2: false,
          selected1: true
      })
      this.init(2);      
  },
  selected2: function (e) {
      this.setData({
          selected: false,
          selected2: true,
          selected1: false
      })
      this.init(3);      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   this.init(options)
  // },
  onShow: function (options) {
    this.init(1);
  },
  init: function (options) {
    var demo = this;
    wx.showLoading({
      title: '加载中...'
    })
    http.post({
      uri: 'phone/center/list.json',
      param: {
        //传参
          flag: options
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.status) {
          demo.setData({
            items: res.data.data
          })
          if (demo.data.items.length == 0) {
            demo.setData({
              noData: true,
            })
          }else{
            demo.setData({
              noData: false,
            })
          }
          console.log(demo.data.items)
        } else {
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '疯狂竞猜世界杯，一起瓜分6666！',
      imageUrl: '/img/share.jpg',
    }
  }
})