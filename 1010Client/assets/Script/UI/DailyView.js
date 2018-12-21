// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var dailyVal = [25, 50, 75, 100, 125, 150, 300];
var dayBgColor = [cc.color(125, 125, 125, 255), cc.color(0, 160, 233, 255)];//每日标题的两个背景色
var bgColor = [cc.color(210, 210, 210, 255), cc.color(146, 221, 255, 255)];//整体背景色的两个状态
cc.Class({
    extends: cc.Component,

    properties: {
        items: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        diffDay: {
            default: null,
            visible: false,
        },
        gotMissionTips: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.DailyScript = this;
        if (this.content != null) {
            for (var i = 0; i < 7; i = i + 1) {
                this.items[i] = {};
                this.items[i].node = cc.find("Item" + i, this.content);
                //整体背景色
                this.items[i].bg = cc.find("Bg", this.items[i].node);
                this.items[i].bg.color = bgColor[0];
                //是否领取了的图标
                this.items[i].receve = cc.find("Bg/Receve", this.items[i].node);
                this.items[i].receve.active = false;
                //每日的标题背景
                this.items[i].dayBg = cc.find("Bg/Day", this.items[i].node);
                this.items[i].dayBg.color = dayBgColor[0];
                //领取的数量
                this.items[i].num = cc.find("Bg/Star/Num", this.items[i].node).getComponent(cc.Label);
                this.items[i].num.string = "+" + dailyVal[i];
            }
        } else {
            console.log("content not exsit!!");
        }
    },

    onEnable() {
        this.checkIsReset();
    },

    //检查是否需要重置
    checkIsReset() {
        //获取最后储存的日子
        SDK().getItem("lastDate", function (val) {
            //空则进行设置并初始化
            if (val == null || val == 0 || val == "") {
                this.setCurDay();
                SDK().setItem({ reward: 0 });
                this.diffDay = 0;
                //初始化
                this.refresh(0);
            } else {
                var dates = val.split("-");
                var diffVal = this.dateDiff("d", new Date(dates[0], dates[1], dates[2]));
                this.diffDay = diffVal;
                if (diffVal >= 7) {
                    this.diffDay = 0;
                    this.setCurDay();
                    SDK().setItem({ reward: 0 });
                    this.refresh(0);
                } else {
                    SDK().getItem("reward", function (val) {
                        val = parseInt(val);
                        this.refresh(val);
                    }.bind(this))
                }
            }
        }.bind(this));
    },

    //刷新
    refresh(val) {
        this.gotMissionTips.active = false;
        for (var i = 0; i < 7; i = i + 1) {
            //如果i小于等于日差则亮起
            if (i <= this.diffDay) {
                //整体背景色
                this.items[i].bg.color = bgColor[1];
                //每日的标题背景
                this.items[i].dayBg.color = dayBgColor[1];

                //如果i小于签到的数量则为签到完成状态
                if (i < val) {
                    this.items[i].receve.active = true;
                    this.items[i].node.off(cc.Node.EventType.TOUCH_END);
                }
                //i等于签到的数量，则表示这天没有签到
                else {
                    this.items[i].node.on(cc.Node.EventType.TOUCH_END, function (event) {
                        this.btnClick(event);
                    }, this)
                    this.gotMissionTips.active = true;
                }
            }
            //大于日差的暗淡并取消点击事件 
            else {
                //整体背景色
                this.items[i].bg.color = bgColor[0];
                //每日的标题背景
                this.items[i].dayBg.color = dayBgColor[0];

                this.items[i].receve.active = false;
                this.items[i].node.off(cc.Node.EventType.TOUCH_END);
            }
        }
    },


    //按钮点击事件
    btnClick(event) {
        window.gameApplication.soundManager.playSound("button");
        var curItem = event.target;
        curItem.off(cc.Node.EventType.TOUCH_END);

        for (var i = 0; i < this.items.length; i = i + 1) {
            //点击之后将任务置位完成状态
            if (curItem == this.items[i].node) {
                this.items[i].receve.active = true;
                this.addStar(i);
                break;
            }
        }
    },

    //获得星星
    addStar(i) {
        //递增签到日期
        SDK().getItem("reward", function (val) {
            val = parseInt(val) + 1;
            SDK().setItem({ reward: val }, function () {
                this.checkIsReset();
            }.bind(this));
        }.bind(this))
        //增加星星
        SDK().getItem("all", function (stars) {
            stars = parseInt(stars) + dailyVal[i];
            window.gameApplication.soundManager.playSound("tip");
            window.gameApplication.flyTipAnim(dailyVal[i]);
            if (null != window.gameApplication.starLable) {
                window.gameApplication.starLable.string = stars;
            }
            SDK().setItem({ all: stars })
        }.bind(this))
    },

    setCurDay() {
        var myDate = new Date();
        var paramDate = {}
        paramDate.lastDate = myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate();
        SDK().setItem(paramDate);
    },


    dateDiff(strInterval, dtStart) {
        var dtEnd = new Date();
        dtEnd = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate());
        switch (strInterval) {
            case 's': return parseInt((dtEnd - dtStart) / 1000);
            case 'n': return parseInt((dtEnd - dtStart) / 60000);
            case 'h': return parseInt((dtEnd - dtStart) / 3600000);
            case 'd': return parseInt((dtEnd - dtStart) / 86400000);
            case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
            case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
            case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
        }
    },


    showDailyView(event, type) {
        window.gameApplication.soundManager.playSound("button");
        if (type == "1") {
            window.gameApplication.showDailyView(true);
        } else {
            window.gameApplication.showDailyView(false);
        }
    },


    // update (dt) {},
});
