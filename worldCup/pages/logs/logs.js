//logs.js
const util = require('../../utils/util.js');
var API_URL = "https://worldcup.wxdcxs.com";
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    var demo=this;
    demo.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    wx.login({//login流程
      success: function (res) {//登录成功
      console.log(res)
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({//getUserInfo流程
            success: function (res2) {//获取userinfo成功
              console.log(res2);
              var encryptedData = encodeURIComponent(res2.encryptedData);//一定要把加密串转成URI编码
              var iv = res2.iv;
              //请求自己的服务器
              demo.Login(code, encryptedData, iv);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  Login:function(code, encryptedData, iv) {
    console.log('code=' + code + '&encryptedData=' + encryptedData + '&iv=' + iv);
    //创建一个dialog
    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: API_URL,
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        console.log('服务器返回' + res.data);

      },
      fail: function () {
        // fail
        // wx.hideToast();
      },
      complete: function () {
        // complete
      }
    })
  }
})
