var HOST = 'https://worldcup.wxdcxs.com/';
// var HOST = 'http://172.16.0.143/worldCup/';
var app = getApp();
// 网站请求接口，统一为post
function post(req) {
  //发起网络请求
  var sessionKey = false;
  wx.checkSession({
    success: function () {
      sessionKey = true
    },
    fail: function () {
      sessionKey = true
    },
    complete: function () {
      console.log('----------')
      console.log(wx.getStorageSync('authToken'))
      if (wx.getStorageSync('authToken') == undefined || wx.getStorageSync('authToken') == "authToken无效" || wx.getStorageSync('authToken') == '' || (!sessionKey)) {
        console.log(666)
        //跳转界面
        wx.switchTab({
          url: '../index/index',
        })
      } else {
        console.log(77777)
        wx.showLoading({
          title: '加载中...',
        })
        wx.request({
          url: HOST + req.uri,
          data: req.param,
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "authToken": wx.getStorageSync('authToken')
          },
          success: function (res) {
            wx.hideLoading()
            req.success(res);//success也是参数
            var sessionKey = false;
            wx.checkSession({
              success: function () {
                //session_key 未过期，并且在本生命周期一直有效
                sessionKey = true
              },
              fail: function () {
                // session_key 已经失效，需要重新执行登录流程
                sessionKey = true
              },
              complete: function () {
                console.log('封装的Http.js:')
                console.log(res)
                console.log(res.data.msg)
                if (res.data.msg == 'authToken无效' || res.data.msg == '' || (!sessionKey)) {
                  console.log('2222222:', res.data.msg)
                  wx.setStorageSync('authToken', res.data.msg)
                  console.log(wx.getStorageSync('authToken'))
                  wx.switchTab({
                    url: '../index/index',
                  })
                } else {
                  console.log('正常情况111')
                }
              }
            })

          },
          fail: function (res) {
            console.log('2223333:', res.data.msg)
            wx.setStorageSync('authToken', res.data.msg)
            console.log(wx.getStorageSync('authToken'))
            if (res.data.msg == 'authToken无效') {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
      }
    }
  })
}
// 导出模块
module.exports = {
  post: post
}