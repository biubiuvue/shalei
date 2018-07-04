//index.js
const app = getApp()
var http = require('../../utils/http.js');

Page({
    data: {
        items: [],
        showModel: true,
        showRule: false,
        goRank: false,
        music: true,
        msgList: [],
    },
    onLoad: function() {
        console.log(888);  
        this.setData({   
            msgList: []  
        });

        if (wx.getStorageSync('judge') == 2) { //第二次
            wx.getStorageSync('judge', 2)
        } else { //所有人第一次
            console.log('029192182====')
            wx.clearStorageSync()
            wx.setStorageSync('judge', 2)
            this.setData({
                showModel: true
            })
            return false
        }
    },
    getInfo() {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        http.post({
            uri: 'phone/announce/list.json',
            param: {
                //传参
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    that.setData({
                        msgList: res.data.data
                    })
                }
                console.log(res)
            }
        })
    },
    guide: function() {
        console.log('导流');
        wx.showLoading({
            title: '跳转中...',
        })
        this.stop();
        wx.navigateToMiniProgram({
            appId: 'wxf414341f19f8f988',
            path: 'pages/index/index',
            extraData: {
                foo: 'bar'
            },
            envVersion: 'release',
            success(res) {
                // 打开成功
                wx.hideLoading()
                console.log('chengongglsadhsadsajdksa')
            },
            fail(err) {
                wx.showToast({
                    title: '微信版本过低',
                    duration: 1000,
                })
            }
        })
    },
    //事件处理函数
    onShow: function() {
        this.onLoad1()
        if (app.globalData.flag == '' || app.globalData.flag == undefined) {
            this.setData({
                goRank: false
            })
        } else {
            this.setData({
                goRank: true
            })
        }
        console.log(app.globalData.musicSrc)
        if (app.globalData.musicSrc == null || app.globalData.musicSrc == '' || app.globalData.musicSrc == undefined) {
            this.play()
        } else {}

    },
    music: function() {
        var music = this.data.music
        this.setData({
            music: !music
        })
        if (music) {
            this.stop()
        } else {
            this.playBtn()
        }
    },
    playBtn: function() {
        var demo = this;
        wx.playBackgroundAudio({
            dataUrl: app.globalData.musicSrc,
        })

    },
    stop: function() {
        wx.pauseBackgroundAudio()
    },
    play: function() {
        if (wx.getStorageSync('judge') == 2) { //第二次
            wx.getStorageSync('judge', 2)

            var demo = this;
            wx.getBackgroundAudioPlayerState({
                success(res) {
                    console.log('有没有音乐在播放：', res)
                    console.log(res.status)
                    if (res.status == 2) { //表示没有音乐在播放
                        demo.play1();
                    } else { //有音乐在播放,或者暂停的
                        if (res.status == 0) { //暂停中
                            // demo.play1();
                        } else { //没有在播放

                        }
                    }
                },
                fail(err) {
                    console.log('判断失败', err)
                    demo.play1();
                }
            })
        } else { //所有人第一次
        }
        
    },
    play1: function() {
        // return false
        http.post({
            uri: 'phone/ico/info-music.json',
            param: {
                //传参
            },
            success: function(res) {
                console.log('有没有音乐在播放', res)
                app.globalData.musicSrc = res.data.data;
                wx.playBackgroundAudio({
                    dataUrl: app.globalData.musicSrc,
                })
            },
            fail: function(res) {
                wx.showToast({
                    title: '音乐加载失败',
                    duration: 1000,
                })
            }
        })
    },
    onLoad1: function() {
        console.log(9999999)
        var that = this;
        wx.showShareMenu({
            withShareTicket: true
        })
        wx.login({
            success: res => {
                app.globalData.code = res.code
                wx.setStorageSync('code', res.code)
                //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
                console.log(res)
                app.globalData.userInfo = wx.getStorageSync('userInfo')
                console.log(wx.getStorageSync('userInfo'))
                wx.getSetting({
                    success: (res) => {
                        //判断用户已经授权。不需要弹框
                        if (!res.authSetting['scope.userInfo']) { //暂时没有授权
                            console.log('没有授权，回跳转到授权界面')
                            that.setData({
                                showModel: true
                            })
                        } else { //没有授权需要弹框,这里是授权过了
                            that.setData({
                                showModel: false
                            })
                            wx.showLoading({
                                title: '加载中...'
                            })
                            that.getOP(app.globalData.userInfo); //授权过了
                        }
                    },
                    fail: function() {
                        wx.showToast({
                            title: '系统提示:网络错误',
                            icon: 'warn',
                            duration: 1500,
                        })
                        setTimeout(function() {
                            that.setData({
                                showModel: true
                            })
                        }, 500)
                    }
                })
            },
            fail: err => {
                console.log('err登陆失败')
                console.log(err)
                wx.showToast({
                    title: '操作频繁',
                    icon: 'warn',
                    duration: 1000,
                })
            }
        })
    },
    changeData: function() {
        var that = this;
        that.getList();
    },
    //获取用户信息新接口，只有点击允许按钮的时候才会进入，就是我点击允许agree,点击授权的时候
    agreeGetUser: function(e) {
        //设置用户信息本地存储
        //这个时候就可以了，获得到iv encryptedData 等等，
        if (e.detail.errMsg != "getUserInfo:ok") { //点击拒绝授权后继续提示他去授权，点击授权按钮
            wx.showToast({
                title: '请授权',
                icon: 'warn',
                duration: 1500,
            })
        } else { //点击授权允许的时候
            console.log('点了授权按钮允许：', e.detail);
            wx.setStorageSync('data', e.detail);
            app.globalData.dataSum = e.detail;
            wx.setStorageSync('userInfo', e.detail.userInfo)
            // }
            wx.showLoading({
                title: '加载中...'
            })
            let that = this
            that.setData({
                showModel: false
            })
            // that.getOP(e.detail.userInfo)
            console.log(e)
            that.getIv(e.detail.userInfo); //这个是点击授权后重新获取iv data的加密数据的
        }
    },

    getOP: function() { //提交用户信息 获取用户id,重新获取authToken
        let that = this
        var dataInfo = wx.getStorageSync('data');
        var authToken = app.globalData.authToken;

        var encryptedData = dataInfo.encryptedData;
        console.log('===========')
        console.log(app.globalData.dataSum)
        console.log(encryptedData)
        console.log(dataInfo)
        console.log(dataInfo.iv)
        console.log(wx.getStorageSync('code'))
        console.log('==============')
        // return false
        // wx.login({
        //     success: res => {
        // app.globalData.code = res.code;
        app.globalData.code = wx.getStorageSync('code');
        var code = app.globalData.code;
        if (dataInfo.iv == undefined || dataInfo.iv == 'undefined' || encryptedData == undefined || encryptedData == 'undefined') {
            that.setData({
                showModel: true
            })
        } else {}
        var sessionKey = false;
        wx.checkSession({
            success: function() {
                //session_key 未过期，并且在本生命周期一直有效
                sessionKey = true
            },
            fail: function() {
                // session_key 已经失效，需要重新执行登录流程
                sessionKey = true
            },
            complete: function() {
                console.log('【【【【【【【【')
                var authToken = wx.getStorageSync('authToken');
                console.log(authToken)
                if (authToken == undefined || authToken == 'authToken无效' || authToken == null || (!sessionKey)) {
                    //不正常,
                    wx.request({
                        url: app.data.url + 'api/common/wxopen/getMinaAuthTokenByCode.json',
                        method: 'POST',
                        data: {
                            "encryptedData": encryptedData,
                            'iv': dataInfo.iv,
                            "code": code
                        },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: function(res) {
                            console.log('加密结束');
                            var authToken = res.data.data.authToken;
                            app.globalData.authToken = authToken;
                            wx.setStorageSync('authToken', res.data.data.authToken)
                            that.getList();
                        }
                    })
                } else {
                    that.getList();
                    console.log('正常情况')
                }
            }
        })
        //     },
        //     fail: function() {
        //         wx.showToast({
        //             title: '操作频繁',
        //             icon: 'warn',
        //             duration: 1000,
        //         })
        //     }
        // })
    },
    getIv: function(res) { //获取authToken
        let that = this
        let userInfo = res
        app.globalData.userInfo = userInfo
        var dataInfo = wx.getStorageSync('data');
        var encryptedData = dataInfo.encryptedData;
        var code = app.globalData.code;
        console.log(dataInfo)
        console.log(encryptedData)
        console.log(code)
        console.log(wx.getStorageSync('code'))
        // return false
        wx.login({
            success: res => {
                app.globalData.code = res.code;
                wx.setStorageSync('code', res.code)
                var code = app.globalData.code;
                console.log(res)
                // return false
                wx.request({
                    url: app.data.url + 'api/common/wxopen/getMinaAuthTokenByCode.json',
                    method: 'POST',
                    data: {
                        "encryptedData": encryptedData,
                        'iv': dataInfo.iv,
                        "code": code
                    },
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function(res) {
                        console.log('加密结束')
                        console.log(res.data.data.authToken)

                        var authToken = res.data.data.authToken;
                        app.globalData.authToken = authToken;
                        wx.setStorageSync('authToken', res.data.data.authToken)
                        that.getOP(); //这个时候有了authToken
                    }
                })
            },
            fail: function() {
                wx.showToast({
                    title: '操作频繁',
                    icon: 'warn',
                    duration: 1000,
                })
            }
        })
    },
    getList: function() {
        var that = this;
        console.log('00000000')
        if (that.data.goRank) {
            console.log(111111111)
            that.setData({
                goRank: false
            })
            wx.switchTab({
                url: '../rank/rank',
            })
        } else {
            that.judge();
        }
    },
    judge:function(){
        console.log(wx.getStorageSync('judge'))
        if (wx.getStorageSync('judge') == 2) { //第二次
            wx.getStorageSync('judge', 2)
            this.getList1();
        } else { //所有人第一次
            console.log('029192182====')
            wx.clearStorageSync()
            wx.setStorageSync('judge', 2)
            this.setData({
                showModel: true
            })
            return false
        }
    },
    getList1: function() {
        console.log('=============1212')
        var demo = this;
        wx.request({
            url: app.data.url + 'phone/guess/list.json',
            param: {},
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "authToken": wx.getStorageSync('authToken')
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                console.log('getList的接口：', res.data.data)
                demo.play();
                demo.getInfo()

                console.log('getList的接口：', res)
                if (res.data.msg == "authToken无效") {
                    console.log('无效啦')
                    wx.setStorageSync('authToken', res.data.msg)
                    demo.onLoad1()
                }
                if (res.data.status) {
                    demo.setData({
                        items: res.data.data
                    })
                } else {
                    //   wx.showToast({
                    //     title: '请求失败！',
                    //     content: '',
                    //     duration: 1000
                    //   })
                }
            },
            fail: function(err) {
                console.log('biubiubiu:', err)
            }
        })
    },
    beginGuess(e) {
        var indexDemo = parseInt(e.currentTarget.dataset.indexdemo);
        var index = parseInt(e.currentTarget.dataset.index);
        var id = this.data.items[index].matchList[indexDemo].id;
        wx.navigateTo({
            url: '../indexDetail/indexDetail?id=' + id + '&scene=9',
        })
    },
    rule: function() {
        this.setData({
            showRule: true
        })
    },
    close: function() {
        this.setData({
            showRule: false
        })
    },
    onShareAppMessage: function() {
        return {
            title: '疯狂竞猜世界杯，一起瓜分6666！',
            imageUrl: '/img/share.jpg',
        }
    }
})