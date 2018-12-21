// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        giftView: {
            default: null,
            type: cc.Node,
        },
        giftBtn: {
            default: null,
            type: cc.Node,
        },
        giftMask: {
            default: null,
            type: cc.Node,
        },
        giftTip: {
            default: null,
            type: cc.Node,
        },
        giftTimeText: {
            default: null,
            type: cc.Label,
        },
        giftTime: {
            default: 0,
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.timeGiftScript = this;
        SDK().getItem("giftTime", function (time) {
            time = parseInt(time);
            this.giftTime = time;
        }.bind(this));
    },

    openBtn() {
        window.gameApplication.playMusic("button");
        if (this.giftTip.active) {
            this.showTimeGiftView();
        }
    },

    start() {
        this.checkTime(true);
    },

    showTimeGiftView() {
        window.gameApplication.openGiftView(true);
        var bg = this.giftView.getChildByName("Bg");
        var receive = bg.getChildByName("ReceiveView");
        receive.active = true;
        var lightBg = receive.getChildByName("LightBg");
        var receiveBtn = receive.getChildByName("Receive");
        var doubleBtn = receive.getChildByName("Double");
        lightBg.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.spawn(
                        cc.rotateBy(1, 120),
                        cc.fadeOut(1).easing(cc.easeOut(2)),
                    ), 
                    cc.spawn(
                        cc.rotateBy(1, 120),
                        cc.fadeIn(1).easing(cc.easeOut(2)),
                    ), 
                )
            )
        );
        receive.runAction(
            cc.spawn(cc.fadeIn(0.5),
                cc.scaleTo(1.2, 1).easing(cc.easeBackInOut())
            )
        );
        //接收按钮
        receiveBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("button");
            this.resetTime();
            SDK().getItem("all", function (stars) {
                stars = parseInt(stars);
                stars = stars + 10;
                SDK().setItem({ all: stars }, null);
                if (null != window.gameApplication.starLable) {
                    window.gameApplication.starLable.string = stars.toString();
                }
                window.gameApplication.soundManager.playSound("tip");
                window.gameApplication.flyTipAnim(10);

            }.bind(this));
            receive.active = true;
            receive.opacity = 0;
            receive.scale = 0;
            window.gameApplication.openGiftView(false);
        }, this);

        //双倍按钮
        doubleBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("button");
            window.gameApplication.onVideoBtnClick(function (isCompleted) {
                if (isCompleted) {
                    this.resetTime();
                    SDK().getItem("all", function (stars) {
                        stars = parseInt(stars);
                        stars = stars + 30;
                        SDK().setItem({ all: stars }, null);
                        if (null != window.gameApplication.starLable) {
                            window.gameApplication.starLable.string = stars.toString();
                        }
                    }.bind(this));
                    this.giftView.active = false;
                    window.gameApplication.soundManager.playSound("tip");
                    window.gameApplication.flyTipAnim(30);

                }
            }.bind(this));
        }, this);
    },

    resetTime() {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        this.giftTime = timestamp;
        SDK().setItem({ giftTime: this.giftTime }, null);
    },

    checkTime(isStart) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        if (timestamp - this.giftTime > 3600) {
            if ((!this.giftTip.active && this.giftMask.active) || isStart) {
                this.giftTip.active = true;
                this.giftMask.active = false;
                this.giftTimeText.node.active = false;
                this.giftBtn.stopAllActions();
                window.gameApplication.shake(this.giftBtn);
            }
        } else {
            if ((this.giftTip.active && !this.giftMask.active) || isStart) {
                this.giftTip.active = false;
                this.giftTip.stopAllActions();
                this.giftMask.active = true;
                this.giftTimeText.node.active = true;
                this.giftBtn.stopAllActions();
                this.giftBtn.rotation = 0;
            }
            var temp = timestamp - this.giftTime;
            temp = 3600 - temp;
            var min = temp / 60 < 10 ? "0" + Math.floor(temp / 60) : "" + Math.floor(temp / 60);
            var sec = temp % 60 < 10 ? "0" + Math.floor(temp % 60) : "" + Math.floor(temp % 60);
            if (temp <= 0) {
                min = "00";
                sec = "00"
            }
            this.giftTimeText.string = min + ":" + sec;
        }
    },

    update(dt) {
        this.checkTime(false);
    },
});
