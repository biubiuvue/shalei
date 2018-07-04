// pages/share/share.js
var app = getApp();
var http = require('../../utils/http.js');

Page({
    data: {
        item: {},
        show:true,
        rule:false,
        number:0,
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    rule(){
        console.log(21212)
        this.setData({
            rule: true
        })
    },
    close(){
        this.setData({
            rule:false
        })
    },
    onShow: function () {
        var demo = this;
        wx.showLoading({
            title: '加载中...',
        })
        http.post({
            uri: 'phone/championIco/info.json',
            param: {},
            success: function (res) {
                wx.hideLoading();
                console.log(res.data.data)
                var item=res.data.data;
                if ((typeof item.vote1Name == "undefined") || (item.vote1Name == ' ') || (item.vote1Name== '')){
                    demo.setData({
                        number: 0
                    })
                }else{
                    if ((typeof item.vote2Name == "undefined") || (item.vote2Name == ' ') || (item.vote2Name == '')) {
                        demo.setData({
                            number: 1
                        })
                    } else {
                        demo.setData({
                            number: 2
                        })
                    }
                }
                console.log(demo.data.number)
                demo.setData({
                    item: res.data.data
                })
            }
        })
    },

    onShareAppMessage: function () {
        return {
            title: '球在眼前，该你上场，这个夏天玩转世界杯！',
        }
    }
})