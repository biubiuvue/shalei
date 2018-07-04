// pages/indexDetail/indexDetail.js
const app = getApp()
var http = require('../../utils/http.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: '',
        id: 1,
        btnshow: 'btnshow',
        btnhide: 'btnhide',
        has: true,
        winWord: '',
        shodowSubmit: false,
        e: '',
        tempFile: null, //合图后临时文件
        maImg: '', //二维码图片
        form_id: '',
    },

    // 生成合图
    createPic() {
        console.log('数据here：');
        console.log(this.data.total);

        var hico, vico, maImgShow;
        var self = this;
        var showWhich;
        if (this.data.total.win == this.data.total.home) {
            showWhich = 'left';
        } else if (this.data.total.win == this.data.total.visiting) {
            showWhich = 'right';
        } else if (this.data.total.win == '平') {
            showWhich = 'middle';
        }

        //下载文件
        wx.downloadFile({ // 主队
            url: this.data.total.hico,
            success: function(res) {
                if (res.statusCode === 200) {
                    hico = res.tempFilePath;
                    wx.downloadFile({ // 次队
                        url: self.data.total.vico,
                        success: function(res) {
                            if (res.statusCode === 200) {
                                vico = res.tempFilePath;
                                wx.downloadFile({
                                    url: self.data.maImg,
                                    success: function(res) {
                                        if (res.statusCode === 200) {
                                            maImgShow = res.tempFilePath;
                                            console.log(maImgShow)
                                            nextDraw(); //图片加载完成
                                        }
                                    }
                                })
                            }
                        }
                    });


                }
            }
        });

        function nextDraw() {
            // 创建 ctx
            const ctx = wx.createCanvasContext('myCanvas')
            ctx.drawImage('/img/bgDetail1.png', 0, 0, 1500, 2668, 0, 0, 750, 1334);
            // 绘制赛事类别
            ctx.setFontSize(30);
            ctx.setFillStyle('white');
            const typeWidth = ctx.measureText(self.data.total.type).width;
            ctx.fillText(self.data.total.type, (750 - typeWidth) / 2, 30 + 35);

            // 绘制创建日期时间
            ctx.setFontSize(20);
            const timeWidth = ctx.measureText(self.data.total.createDate + ' ' + self.data.total.createTime).width;
            ctx.fillText(self.data.total.createDate + ' ' + self.data.total.createTime, (750 - timeWidth) / 2, 20 + 80);

            // 绘制国旗
            ctx.drawImage(hico, 65, 130);
            ctx.drawImage(vico, (750 - 150 - 65), 130);
            // 绘制vs
            ctx.setFontSize(40);
            const vsWidth = ctx.measureText('VS').width;
            ctx.fillText('VS', (750 - vsWidth) / 2, 40 + 150);

            // 绘制国家
            ctx.setFontSize(30);
            ctx.fillText(self.data.total.home, 108, 30 + 250);

            ctx.setFontSize(30);
            const visitWidth = ctx.measureText(self.data.total.visiting).width;
            ctx.fillText(self.data.total.visiting, (750 - visitWidth - 108), 30 + 250);

            // 绘制胜利
            if (showWhich == 'left') { // 左边胜利
                ctx.setFillStyle('#fcc441');
                ctx.fillRect(65, 320, 190, 66);

                ctx.setFontSize(30);
                ctx.setFillStyle('#000');
                ctx.fillText('胜利', 130, 30 + 335);


                ctx.setFillStyle('#cccccc');
                ctx.fillRect(280, 320, 190, 66);

                ctx.setFontSize(30);
                ctx.setFillStyle('#fff');
                ctx.fillText('平局', 345, 30 + 335);

                ctx.setFillStyle('#cccccc');
                ctx.fillRect(495, 320, 190, 66);


                ctx.setFontSize(30);
                ctx.setFillStyle('#fff');
                ctx.fillText('胜利', 560, 30 + 335);
            } else if (showWhich == 'right') { // 右边胜利
                ctx.setFillStyle('#cccccc');
                ctx.fillRect(65, 320, 190, 66);

                ctx.setFontSize(30);
                ctx.setFillStyle('#fff');
                ctx.fillText('胜利', 130, 30 + 335);


                ctx.setFillStyle('#cccccc');
                ctx.fillRect(280, 320, 190, 66);

                ctx.setFontSize(30);
                ctx.setFillStyle('#fff');
                ctx.fillText('平局', 345, 30 + 335);

                ctx.setFillStyle('#fcc441');
                ctx.fillRect(495, 320, 190, 66);


                ctx.setFontSize(30);
                ctx.setFillStyle('#000');
                ctx.fillText('胜利', 560, 30 + 335);
            } else if (showWhich == 'middle') { // 平局
                ctx.setFillStyle('#cccccc');
                ctx.fillRect(65, 320, 190, 66);

                ctx.setFontSize(30);
                ctx.setFillStyle('#fff');
                ctx.fillText('胜利', 130, 30 + 335);


                ctx.setFillStyle('#fcc441');
                ctx.fillRect(280, 320, 190, 66);

                ctx.setFontSize(30);
                ctx.setFillStyle('#000');
                ctx.fillText('平局', 345, 30 + 335);

                ctx.setFillStyle('#ccc');
                ctx.fillRect(495, 320, 190, 66);


                ctx.setFontSize(30);
                ctx.setFillStyle('#fff');
                ctx.fillText('胜利', 560, 30 + 335);
            }

            // 绘制比分
            ctx.setFillStyle('rgba(0, 0, 0, 0.5)');
            ctx.fillRect(20, 442, 710, 168);

            // 绘制国旗
            console.log(hico)
            ctx.drawImage(hico, 0, 0, 140, 105, 85, 489, 60, 42);
            ctx.drawImage(vico, 0, 0, 140, 105, 586, 489, 60, 42);
            // 绘制国家
            ctx.setFillStyle('#fff');
            ctx.setFontSize(18);
            ctx.fillText(self.data.total.home, 90, 18 + 549);

            ctx.setFontSize(18);
            const smallVisiWidth = ctx.measureText(self.data.total.visiting).width;
            ctx.fillText(self.data.total.visiting, 580, 18 + 549);

            // 绘制比分
            var totalLength = 386;
            var leftRatio = self.data.total.hwin / (self.data.total.hwin + self.data.total.vwin);
            var leftWidth = leftRatio * 386;
            var rightWidth = 386 - leftWidth;

            ctx.setFillStyle('#268be5');
            ctx.fillRect(186, 516, leftWidth, 9);

            ctx.setFillStyle('#c31726');
            ctx.fillRect(186 + leftWidth, 516, rightWidth, 9);

            // 绘制火焰
            ctx.drawImage('/img/hot.png', 0, 0, 70, 108, 186 + leftWidth - 17.5, 516 - 54 + 11, 35, 54);

            // 绘制点赞1
            ctx.drawImage('/img/left.png', 0, 0, 46, 50, 186, 547, 23, 25);
            // 绘制点赞数1
            ctx.setFontSize(16);
            ctx.setFillStyle('#fff');
            ctx.fillText(self.data.total.hwin, 226, 550 + 16);

            // 绘制点赞2
            ctx.drawImage('/img/right.png', 0, 0, 46, 50, 542, 547, 23, 25);
            // 绘制点赞数2
            ctx.setFontSize(16);
            ctx.setFillStyle('#fff');
            const wWinWidth = ctx.measureText(self.data.total.vwin).width;
            ctx.fillText(self.data.total.vwin, (750 - wWinWidth - 224), 550 + 16);

            // 绘制说明
            ctx.drawImage('/img/sharebg.png', 57, 650);

            // 
            ctx.setFillStyle('#fcc441');
            ctx.setFontSize(46);
            if (showWhich == 'middle') { // 平局
                ctx.fillText('我猜两队', 180, 790);
                ctx.fillText('不分胜负', 180, 860);
            } else {
                ctx.fillText('我支持', 180, 790);
                ctx.fillText(self.data.total.win, 180, 860);
            }

            ctx.setFillStyle('#fff');
            ctx.setFontSize(35);
            ctx.fillText('不服你来呀!', 460, 850);

            // 绘制宣传
            ctx.setFontSize(28);
            ctx.fillText('2018俄罗斯世界杯', 144, 1004);
            ctx.fillText('疯狂竞猜 给你好看', 144, 1048);


            //二维码
            console.log(maImgShow)
            ctx.drawImage(maImgShow, 0, 0, 294, 294, 462, 932, 147, 147)
            // ctx.drawImage('/img/ma.png', 0, 0, 294, 294, 462, 932, 147, 147)

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
        console.log(3333)
        wx.saveImageToPhotosAlbum({
            filePath: saveImgPath,
            success: (res) => {
                console.log(res)
                wx.showToast({
                    title: '保存成功',
                    content: '',
                    duration: 4002
                })
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },

    // save

    save() {
        console.log(89);
        if (this.data.tempFile) { // 如果临时文件存在
            //   this.friendShare();
        } else {
            wx.showLoading({
                title: '图片保存中...'
            })
            this.createPic();
        }
    },

    // 朋友圈分享
    friendShare() {
        if (!this.data.shareTempFilePath) {
            wx.showModal({
                title: '提示',
                content: '图片绘制中，请稍后重试',
                showCancel: false
            })
        }
        wx.saveImageToPhotosAlbum({
            filePath: this.data.shareTempFilePath,
            success: (res) => {
                console.log(res)
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {
        console.log(options)
        console.log(options)
        // if (options.scene == 1036) {
        //   wx.switchTab({
        //     url: '../index/index',
        //   })
        // }
    },
    onLoad: function(options) {
        console.log('onload0000000');
        console.log(options);
        wx.showShareMenu({
            withShareTicket: true
        })
        var id = options.id
        var demo = this;
        demo.setData({
            id: id
        })
        id = demo.data.id

        http.post({
            uri: 'phone/guess/info-' + id + '.json',
            param: {
                //传参
            },
            success: function(res) {
                console.log(res)
                if (res.data.status) {
                    demo.setData({
                        total: res.data.data,
                        id: id,
                    })
                    // console.log(demo.data.total.state)
                    demo.btnShow(); //界面显示状态
                } else {
                    console.log(res)
                    console.log('请求失败！')
                }
            }
        })
    },
    btnShow: function() {
        var demo = this;
        var total = demo.data.total;
        // console.log(total.win)
        if (demo.data.total.win == '' || demo.data.total.win == undefined) { //反正就是还没投票
        } else { //反正我是投票了，我就可以分享
            if (demo.data.total.win == demo.data.total.home) {
                demo.setData({
                    winWord: demo.data.total.win
                })
            } else if (demo.data.total.win == demo.data.total.visiting) {
                demo.setData({
                    winWord: demo.data.total.win
                })
            } else {
                demo.setData({
                    winWord: '我猜两队不分胜负'
                })
            }
            http.post({
                uri: 'phone/qrcode/info.json',
                param: {
                    //传参
                },
                success: function(res) {
                    console.log(res)
                    demo.setData({
                        maImg: res.data.data
                    })
                }
            })
        }
        if (total.state == 1) { //未开始
            if (demo.data.total.win == '' || demo.data.total.win == undefined) { //未投票
                demo.setData({
                    has: true
                })
            } else { //投票
                demo.setData({
                    has: false
                })
            }
        } else if (total.state == 2) { //进行中

        } else { //结束

        }
    },
    btnSubmit: function(e) {
        var demo = this;
        if (demo.data.total.state == 1 && (demo.data.total.win == '' || demo.data.total.win == undefined)) {
            this.setData({
                shodowSubmit: true,
                e: e
            })
        } else {
            console.log('不满足竞猜条件')
        }
    },
    btnSubmitHide: function() {
        this.setData({
            shodowSubmit: false
        })
    },
    btnSubmitShow: function(e) {
        console.log('from_id')
        console.log(e.detail)
        console.log(e.detail.formId)
        var form_id = e.detail.formId;
        var demo = this;
        demo.setData({
            form_id: form_id
        })
        var e = demo.data.e;
        var index = e.currentTarget.dataset.index;
        if (demo.data.total.state == 1 && (demo.data.total.win == '' || demo.data.total.win == undefined)) {
            demo.sureBtnSubmit(index); //提交
        } else {
            console.log('不满足竞猜条件')
        }
    },
    sureBtnSubmit: function(e) { //提交保存你是投了哪个队的
        var demo = this;
        wx.showLoading({
            title: '加载中...'
        })
        http.post({
            uri: 'phone/guess/save-' + demo.data.id + '.json',
            param: {
                win: e + '',
                form_id: demo.data.form_id
            },
            success: function(res) {
                console.log(res)
                if (res.data.status) {
                    wx.showToast({
                        title: '提交成功！',
                        content: '',
                        duration: 400
                    })
                    demo.setData({
                        shodowSubmit: false
                    })
                    var id = demo.data.id
                    http.post({
                        uri: 'phone/guess/info-' + id + '.json',
                        param: {},
                        success: function(res) {
                            console.log('界面刷新')
                            demo.updata1()
                            wx.hideLoading()
                            if (res.data.status) {
                                demo.setData({
                                    total: res.data.data,
                                    id: id,
                                })
                                console.log(demo.data.total)
                            } else {
                                console.log('请求失败Detail1！')
                            }
                        }
                    })
                } else {
                    console.log('请求失败Detail2！')
                    console.log(res)
                    wx.showToast({
                        title: '提交失败！',
                        content: '',
                        duration: 1000
                    })
                    demo.setData({
                        shodowSubmit: false
                    })
                }
            }
        })
    },
    updata1: function() {
        var demo = this;
        var id = demo.data.id
        http.post({
            uri: 'phone/guess/info-' + id + '.json',
            param: {},
            success: function(res) {
                console.log(res)
                if (res.data.status) {
                    demo.setData({
                        total: res.data.data,
                        id: id,
                    })
                    console.log(demo.data.total.state)
                    demo.btnShow(); //界面显示状态

                    var pages = getCurrentPages(); //上个界面刷新
                    if (pages.length > 1) {
                        //上一个页面实例对象  
                        var prePage = pages[pages.length - 2];
                        //关键在这里,这里面是触发上个界面  
                        prePage.changeData(prePage.data.historyArr) // 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数  
                    }
                } else {
                    console.log(res)
                    console.log('请求失败！')
                }
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: '球在眼前，该你上场，这个夏天玩转世界杯！',
        }
    }
})