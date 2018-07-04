var app = getApp();
var http = require('../../utils/http.js');

Page({
    data: {
        items: [],
        my: '',
        offset: 0, //分页下标
        pageSize: 10, //分页条数
        stopLoad: false
    },

    onShow: function(options) {
        var demo = this;
        demo.setData({
            offset: 0,
            pageSize: 10,
            stopLoad: false
        })
        wx.showShareMenu({
            withShareTicket: true
        })
        http.post({
            uri: 'phone/rank/list.json',
            param: {
                offset: demo.data.offset,
                pageSize: demo.data.pageSize
            },
            success: function(res) {
                if (res.data.status) {
                    demo.setData({
                        items: res.data.data
                    })
                    http.post({
                        uri: 'phone/rank/self.json',
                        data: {},
                        success: function(res) {
                            if (res.data.status) {
                                demo.setData({
                                    my: res.data.data
                                })
                            } else {}
                        },
                        fail: function(err) {
                            console.log(err)
                        }
                    })
                } else {}
            },
            fail: function(err) {
                console.log(err)
            }
        })

    },
    shareClick: function() {
        this.onShareAppMessage();
    },
    pullDown: function() {
        console.log(7777)
        var demo = this;
        wx.showLoading({
            title: '玩命加载中',
        })


        if (!demo.stopLoad) {
            demo.setData({
                stopLoad: true
            })
            var offset = demo.data.offset + demo.data.pageSize;
            var pageSize = demo.data.pageSize;
            console.log(pageSize)
            console.log(offset)
            http.post({
                uri: 'phone/rank/list.json',
                param: {
                    offset: offset,
                    pageSize: pageSize
                },
                success: function(res) {
                    wx.hideLoading()
                    if (res.data.status) {
                        var items = demo.data.items;
                        console.log(res.data.data)
                        if (res.data.data.length == 0) {
                            wx.showToast({
                                title: '没有更多数据',
                                content: '',
                                duration: 400
                            })
                            demo.setData({
                                stopLoad: true
                            })
                        } else {
                            if (res.data.data.length < 10) {
                                demo.setData({
                                    stopLoad: true
                                })
                            } else {
                                demo.setData({
                                    stopLoad: false
                                })
                            }
                            for (var i = 0; i < res.data.data.length; i++) {
                                items.push(res.data.data[i])
                            }
                            demo.setData({
                                items: items,
                                offset: offset,
                                pageSize: pageSize
                            })
                        }

                    } else {
                        wx.showToast({
                            title: '请求失败！',
                            content: '',
                            duration: 1000
                        })
                    }
                },
                fail: function(err) {
                    console.log(err)
                }
            })
        }

    },
    onShareAppMessage: function() {
        return {
            title: '疯狂竞猜世界杯，一起瓜分6666！',
            imageUrl: '/img/share.jpg',
        }
    },
    goShare() {
        wx.navigateTo({
            url: '../share/share',
        })
    }
})