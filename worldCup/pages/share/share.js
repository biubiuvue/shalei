// pages/share/share.js
var app = getApp();
var http = require('../../utils/http.js');

Page({
    data: {
        item: {}
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    onShow: function() {
        var demo = this;
        wx.showLoading({
            title: '加载中...',
        })
        http.post({
            uri: 'phone/rank/share.json',
            param: {},
            success: function(res) {
                wx.hideLoading();
                console.log(res.data.data)
                demo.setData({
                    item: res.data.data
                })
                // demo.share2()
            }
        })
    },

    onShareAppMessage: function() {
        return {
            title: '球在眼前，该你上场，这个夏天玩转世界杯！',
        }
    },
    share2() {
        if (this.data.tempFile) { // 如果临时文件存在
            //   this.friendShare();
        } else {
            wx.showLoading({
                title: '图片保存中...'
            })
            this.createPic();
        }
    },
    createPic() {
        var self = this;
        var item = self.data.item;
        console.log(item)
        var bg, head, worldCup, ma;
        wx.downloadFile({ // 主队
            url: item.headimgurl,
            success: function(res) {
                if (res.statusCode === 200) {
                    head = res.tempFilePath;
                    wx.downloadFile({ // 主队
                        url: item.add,
                        success: function(res) {
                            if (res.statusCode === 200) {
                                bg = res.tempFilePath;
                                wx.downloadFile({ // 主队
                                    url: item.worldcup,
                                    success: function(res) {
                                        if (res.statusCode === 200) {
                                            worldCup = res.tempFilePath;
                                            wx.downloadFile({ // 主队
                                                url: item.qrcode,
                                                success: function(res) {
                                                    if (res.statusCode === 200) {
                                                        ma = res.tempFilePath;
                                                        nextDraw(); //图片加载完成
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }); //加载完成
        function nextDraw() {
            //创建ctx
            const ctx = wx.createCanvasContext('myCanvas')
            ctx.drawImage(bg, 0, 0, 812, 1646, 0, 0, 812, 1446);
            ctx.drawImage(head, 315, 120, 120, 120);
            ctx.drawImage(ma, 570, 960, 147, 147);

            //网名
            ctx.setFontSize(26);
            ctx.setFillStyle('white');
            ctx.setTextAlign('center');
            ctx.fillText(item.nickname, 375, 280);

            //我猜中了 
            ctx.setFontSize(38);
            ctx.setFillStyle('white');
            // ctx.setTextAlign('center');
            ctx.fillText('我猜中了', 200, 340);

            //场世界杯比赛
            ctx.setFontSize(38);
            ctx.setFillStyle('white');
            // ctx.setTextAlign('center');
            ctx.fillText('场世界杯比赛', 500, 340);

            //数目
            ctx.setFontSize(50);
            ctx.setFillStyle('#fcc442');
            ctx.setTextAlign('center');
            ctx.fillText(item.win, 330, 340);


            //超越了
            ctx.setFontSize(38);
            ctx.setFillStyle('white');
            // ctx.setTextAlign('center');
            ctx.fillText('超越了', 200, 420);

            //场世界杯比赛
            ctx.setFontSize(38);
            ctx.setFillStyle('white');
            // ctx.setTextAlign('center');
            ctx.fillText('的球迷', 530, 420);

            //数目
            ctx.setFontSize(50);
            ctx.setFillStyle('#fcc442');
            ctx.setTextAlign('center');
            ctx.fillText(item.ranks + '%', 360, 420);

            ctx.draw(false, function() {
                console.log('绘制完成');
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 750,
                    height: 1134,
                    destWidth: 750,
                    destHeight: 1134,
                    canvasId: 'myCanvas',
                    success: function(res) {
                        wx.hideLoading()
                        console.log(res.tempFilePath)
                        self.saveImg(res.tempFilePath)
                    }
                })
            });
        }
    },
    saveImg(saveImgPath) {
        var demo = this;
        console.log(2222)
        console.log(saveImgPath);
        wx.saveImageToPhotosAlbum({
            filePath: saveImgPath,
            success: (res) => {
                console.log(res)
                console.log(12)
                wx.showToast({
                    title: '保存成功',
                    content: '',
                    duration: 4002
                })
            },
            fail: (err) => {
                console.log(err)
                // return false
                if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
                    console.log("用户一开始拒绝了，我们想再次发起授权")
                    console.log('打开设置窗口')
                    wx.getSetting({
                        success(settingdata) {
                            console.log(settingdata)
                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                            } else {
                                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                            }
                        }
                    })
                }
            }
        })
return false
        wx.downloadFile({
            url: saveImgPath,
            success: function(res) {
                console.log(res)
                console.log(2111)

            },
            fail: function(err) {
                console.log(err)
                console.log(444)
            }
        })
    },
})