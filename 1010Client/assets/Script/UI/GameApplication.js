var MainView = require("./MainView");
var GameView = require("./GameView");
var ResultView = require("./ResultView");
var Utils = require("./Utils/Utils");
var SoundManager = require("../GameLogic/SoundManager");

cc.Class({
    extends: cc.Component,

    properties: {
        mainView: {
            default: null,
            type: MainView,
        },
        gameView: {
            default: null,
            type: GameView,
        },
        resultView: {
            default: null,
            type: ResultView,
        },
        soundManager: {
            default: null,
            type: SoundManager,
        },
        starAnimTarget: {
            default: null,
            type: cc.Node,
        },
        starSprite: {
            default: null,
            type: cc.Node,
        },
        starAnim: {
            default: null,
            type: cc.Node,
        },
        brokenFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        starLable: {
            default: null,
            type: cc.Label,
        },
        highest: {
            default: null,
            type: cc.Label,
        },
        reviveView: {
            default: null,
            type: cc.Node,
        },
        VideoView: {
            default: null,
            type: cc.Node,
            visible: false,
        },
        VideoView_prefab: {
            default: null,
            type: cc.Prefab,
        },
        SharaView: {
            default: null,
            type: cc.Node,
            visible: false,
        },
        SharaView_prefab: {
            default: null,
            type: cc.Prefab,
        },
        fbView: {
            default: null,
            type: cc.Node,
            visible: false,
        },
        fbView_prefab: {
            default: null,
            type: cc.Prefab,
        },
        object_prefab: {
            default: null,
            type: cc.Prefab,
        },
        viewAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        _playTimes: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        playTimes: {
            get: function () {
                return this._playTimes;
            },
            set: function (val) {
                this._playTimes = val;
                //播放插屏广告条件判断
                if ((this._playTimes > 1 && this._playTimes % SDK().getInterstitialCount() == 0 && this._playTimes >= SDK().getInterstitialCount()) || (SDK().getInterstitialCount() <= 1 && this._playTimes > 1)) {
                    console.log("播放插屏广告");
                    var delayTime = 0.2 + Math.random();
                    this.scheduleOnce(function () {
                        SDK().showInterstitialAd(function (isCompleted) {
                            console.log("播放Done");
                        }, false);
                    }, delayTime);

                    SDK().canCreateShortcutAsync();
                }

                /* if (this._playTimes == 5) {
                    SDK().shareBestScore("highScore", null);
                } */
            },
        },
    },

    onEnable() {
        SDK().getItem("highScore", function (score) {
            this.highest.string = score.toString();
        }.bind(this));
        SDK().getItem("all", function (stars) {
            this.starLable.string = stars.toString();
        }.bind(this));
    },

    onLoad() {
        window.gameApplication = this;
    },

    start() {
        var myVolume = Utils.getStringFromLocal("otherVolume");
        if (myVolume == null) {
            myVolume = 1;
        }
        this.setVolumn(myVolume);

        this.mainView.init(this, myVolume);
        this.gameView.init(this, myVolume);
        SDK().init();

        this.showDailyView(true);
        this.changeToMainView();
    },


    setNodeActive(nodePath, active) {
        var view = cc.find("Canvas/" + nodePath);
        if (view != null) {
            view.active = active;
            view.opacity = 0;
            view.runAction(cc.fadeIn(0.5));
        }
    },

    changeToGameView() {
        this.mainView.node.active = false;
        this.resultView.node.active = false;
        this.setNodeActive("GameView", true);
        this.gameView.restartGame();
        this.showPasueView(false);
        this.showOverView(false);
        this.showDailyView(false);
    },

    changeToMainView(event,type) {
        window.gameApplication.playMusic("button");
        this.resultView.node.active = false;
        this.gameView.node.active = false;
        this.setNodeActive("MainView", true);
        this.showPasueView(false);
        this.showOverView(false);
        this.showDailyView(false);
        if(type == "rank"){

        }
    },

    openGiftView: function (isOpen) {
        this.setNodeActive("GiftView", isOpen);
    },

    changeToResultView() {
        this.resultView.node.active = true;
    },

    hideResultView() {
        this.playMusic("button");
        this.resultView.node.active = false;
    },

    showOverView(isOpen) {
        this.setNodeActive("OverView", isOpen);
    },

    showPasueView(isOpen) {
        this.setNodeActive("PasueView", isOpen);
    },

    showDailyView(isOpen) {
        this.setNodeActive("DailyView", isOpen);
    },

    showPopGame(isOpen) {
        this.setNodeActive("PopGame", isOpen);
    },


    //显示复活界面
    showReviveView(cb) {
        var bg = cc.find("Bg", this.reviveView);
        bg.scale = 0;
        this.reviveView.active = true;
        bg.runAction(cc.scaleTo(1, 1).easing(cc.easeInOut(2)));
        let light = this.reviveView.getChildByName("Bg").getChildByName("LightSmall");
        light.stopAllActions();
        light.runAction(cc.repeatForever(
            cc.spawn(
                cc.sequence(
                    cc.fadeIn(0.5), cc.fadeOut(0.5), cc.delayTime(0.1)
                ),
                cc.rotateBy(1.1, 100),
            )
        ));
        let sureBtn = this.reviveView.getChildByName("Bg").getChildByName("Sure");
        sureBtn.off(cc.Node.EventType.TOUCH_END);
        sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("button");
            this.onVideoBtnClick(function(isCompleted){
                if(isCompleted){
                    cb(isCompleted)
                }else{
                    cb(1);
                }
                this.reviveView.active = !isCompleted;
            }.bind(this));
        }, this);

        var laterBtn = this.reviveView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("button");
            cb(false);
            this.reviveView.active = false;
        }, this);
    },

    //显示是否观看视频的提示框
    showVideoView(cb , isCount) {
        if (this.VideoView == null) {
            var view = cc.instantiate(this.VideoView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.VideoView = view;
        }
        this.VideoView.active = true;
        let light = this.VideoView.getChildByName("Bg").getChildByName("LightSmall");
        light.stopAllActions();
        light.runAction(cc.repeatForever(
            cc.spawn(
                cc.sequence(
                    cc.fadeIn(0.5), cc.fadeOut(0.5), cc.delayTime(0.1)
                ),
                cc.rotateBy(1.1, 100),
            )
        ));
        let sureBtn = this.VideoView.getChildByName("Bg").getChildByName("Sure");
        let sureText = sureBtn.getChildByName("Text").getComponent(cc.Label);
        var myDate = new Date();
        let month = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate();        //获取当前日(1-31)
        let viewCount = 0;

        sureBtn.off(cc.Node.EventType.TOUCH_END);

        this.checkDailyCount("video", false, function (val) {
            viewCount = 5 - val;
            if (viewCount > 0) {
                sureBtn.getComponent(cc.Button).interactable = true;
            } else {
                sureBtn.getComponent(cc.Button).interactable = false;
            }
            if(isCount){
                sureText.string = "FREE(" + viewCount + ")";
            }else{
                sureText.string = "FREE";
                sureBtn.getComponent(cc.Button).interactable = true;
            }
            sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                if (viewCount > 0 || !isCount) {
                    window.gameApplication.soundManager.playSound("button");
                    this.onVideoBtnClick(function(isCompleted){
                        cb(isCompleted)
                        this.VideoView.active = !isCompleted;
                    }.bind(this),isCount);
                }
            }, this);
        }.bind(this));

        var laterBtn = this.VideoView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("button");
            cb(false);
            this.VideoView.active = false;
        }, this);
    },

    //视频奖励
    onVideoBtnClick(cb, isCount) {
        SDK().showVideoAd(
            function (isCompleted) {
                if (null == isCompleted) {
                    console.log("没有观看成功")
                    this.fbFail(1);
                    if (cb != null) {
                        cb(false);
                    }
                } else if (isCompleted) {
                    if (cb != null) {
                        cb(true);
                    }
                    if (isCount) {
                        this.checkDailyCount("video", true);
                    }
                } else {
                    console.log("没有观看成功")
                    this.fbFail(1);
                    if (cb != null) {
                        cb(false);
                    }
                }
            }.bind(this)
        );
    },

    //检查日常次数限制
    checkDailyCount(key, isAdd, cb) {
        var myDate = new Date();
        let month = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate();        //获取当前日(1-31)
        SDK().getItem(month + "_" + day + "_" + key, function (val) {
            if (val == null) {
                val = 0;
            }
            val = parseInt(val);
            if (isAdd) {
                val = val + 1
                var param = {};
                param[month + "_" + day + "_" + key] = val;
                SDK().setItem(param);
            }
            if (cb != null) {
                cb(val);
            }
        })
    },

    //显示是否观看视频的提示框
    showSharaView(cb) {
        if (this.SharaView == null) {
            var view = cc.instantiate(this.SharaView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.SharaView = view;
        }
        this.SharaView.active = true;
        let sureBtn = this.SharaView.getChildByName("Bg").getChildByName("Sure");
        let light = this.SharaView.getChildByName("Bg").getChildByName("LightSmall");
        light.stopAllActions();
        light.runAction(cc.repeatForever(
            cc.spawn(
                cc.sequence(
                    cc.fadeIn(0.5), cc.fadeOut(0.5), cc.delayTime(0.1)
                ),
                cc.rotateBy(1.1, 100),
            )
        ));
        sureBtn.off(cc.Node.EventType.TOUCH_END);
        sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onShareBtnClick(cb);
            this.SharaView.active = false;
            window.gameApplication.soundManager.playSound("button");
        }, this);

        var laterBtn = this.SharaView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.SharaView.active = false;
            window.gameApplication.soundManager.playSound("button");
        }, this);
    },



    //插屏广告按钮
    onGiftBtnClick(cb) {
        SDK().showInterstitialAd(
            function (isCompleted) {
                if (null == isCompleted) {
                    console.log("没有观看成功")
                    this.fbFail(1);
                } else if (isCompleted) {
                    if (cb != null) {
                        cb(true)
                    }
                } else {
                    console.log("没有观看成功")
                    this.fbFail(1);
                }
            }.bind(this)
            , true);
    },

    //FB失败界面
    fbFail(type) {
        var view = cc.instantiate(this.fbView_prefab);
        var Canvas = cc.find("Canvas");
        view.parent = Canvas;
        view.width = window.width;
        view.height = window.height;
        var btn = view.getChildByName("Okay");
        btn.off(cc.Node.EventType.TOUCH_END);
        btn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.fbView.active = false;
            btn.parent.destroy();
            window.gameApplication.soundManager.playSound("button");
        }, this);
        this.fbView = view;
        if (type == 1) {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = true;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = false;
        } else {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = false;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = true;
        }
        this.fbView.active = true;

    },

    //分享按钮
    onShareBtnClick(cb) {
        SDK().getItem("highScore", function (score) {
            SDK().share(score, function (isCompleted) {
                if (isCompleted) {//分享激励
                    console.log("share:" + score);
                    if (cb != null) {
                        cb(true)
                    }
                } else {
                    this.fbFail(2);
                }
                window.gameApplication.soundManager.audioSource.play();
                window.gameApplication.soundManager.audioSource.loop = true;
            }.bind(this));
        }.bind(this))
    },

    //互推按钮时间
    popClick(event,type){
        SDK().switchGameAsync(type);
    },

    //获得提示动画
    flyTipAnim(val) {
        window.gameApplication.playMusic("getReward");
        let reward = cc.instantiate(this.object_prefab);
        reward.getComponent(cc.Sprite).spriteFrame = this.viewAtlas.getSpriteFrame("bigStar");
        var num = reward.getChildByName("Num").getComponent(cc.Label);
        num.string = "+" + val;
        num.node.scale = 10;
        reward.scale = 0.1;
        reward.parent = cc.find("Canvas");
        reward.position = cc.v2(0, 0);
        reward.runAction(cc.sequence(
            cc.moveBy(1, cc.v2(0, 400)).easing(cc.easeIn(2)),
            cc.callFunc(function () {
                reward.destroy();
            }),
        ));
    },

    shareBtnClicked(event, type) {
        window.gameApplication.playMusic("button");
        window.gameApplication.onShareBtnClick(function (success) {
            if (success) {
                if (type != null) {
                    SDK().getItem("all", function (stars) {
                        stars = parseInt(stars);
                        stars = stars + parseInt(type);
                        SDK().setItem({ all: stars })
                        if (window.gameApplication.starLable != null) {
                            window.gameApplication.starLable.string = stars;
                        }
                        window.gameApplication.flyTipAnim(parseInt(type));
                    }.bind(this))
                }
            }
            console.log("分享成功！!!", success);
        });
    },

    shake(node) {
        node.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(0.1, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, -5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.1, 0).easing(cc.easeIn(2)),
            cc.delayTime(0.5)
        )));
    },


    scaleUpAndDowm(node) {
        node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2)),
                    cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)),
                    cc.scaleTo(0.6, 1.1).easing(cc.easeIn(2)),
                    cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)),
                )
            )
        );
    },

    playMusic(ptype) {
        this.soundManager.playSound(ptype);
    },

    setVolumn(vol) {
        this.myVolume = vol;
        Utils.saveStringToLocal("otherVolume", vol);
        this.soundManager.setOtherVoiceVolume(vol);
    },


    addStar() {
        SDK().getItem("all", function (stars) {
            stars = parseInt(stars) + 1;
            SDK().setItem({ all: stars });
            //动画
            this.starSprite.position = cc.v2(0, 0);
            this.starSprite.scale = 0;
            this.starSprite.active = true;
            var bezier = [
                cc.p(0, 0),
                cc.p(this.starAnimTarget.x / 2, this.starAnimTarget.y / 1.5),
                cc.p(this.starAnimTarget.x, this.starAnimTarget.y)
            ];
            this.starSprite.runAction(
                cc.spawn(
                    cc.sequence(
                        cc.scaleTo(0.1, 1),
                        cc.delayTime(0.1),
                        cc.bezierTo(1, bezier).easing(cc.easeIn(1)),
                        cc.callFunc(function () {
                            this.starSprite.active = false;
                            window.gameApplication.playMusic("getCoin");
                            this.brokenBoom(this.starAnimTarget, this.brokenFrame);
                            window.gameApplication.starLable.string = stars;
                        }.bind(this), this)
                    ),
                    cc.sequence(
                        cc.delayTime(0.2),
                        cc.rotateBy(1, 720),
                    ),
                ));
        }.bind(this))
    },


    brokenBoom(target) {
        this.starAnim.position = target.position;
        var list = [];
        for (var i = 0; i < 6; i = i + 1) {
            list[i] = this.starAnim.getChildByName("" + i);
            list[i].opacity = 255;
            list[i].active = true;
            list[i].position = cc.v2(0, 0);
            list[i].getComponent(cc.Sprite).SpriteFrame = this.brokenFrame;
        }
        for (var i = 0; i < 3; i = i + 1) {
            this.brokenBoomAction(list[i], list[5 - i], i)
        }
    },

    brokenBoomAction(l, r, i) {
        var bezier;
        var disVal = 100;
        bezier = [
            cc.p(-disVal * 0.2 + (i * disVal * 0.1), disVal * 0.6 - (i * disVal * 0.1)),
            cc.p(-disVal * 0.5 + (i * disVal * 0.2), disVal * 0.2 - (i * disVal * 0.1)),
            cc.p(-disVal * 0.8 + (i * disVal * 0.3), -disVal * 0.3 - (i * disVal * 0.15))
        ];
        l.runAction(cc.spawn(
            cc.bezierTo(0.5, bezier).easing(cc.easeIn(1)),
            cc.fadeOut(0.5).easing(cc.easeIn(3)),
        ));
        bezier = [
            cc.p(-(- disVal * 0.2 + (i * disVal * 0.1)), disVal * 0.6 - (i * disVal * 0.1)),
            cc.p(-(-disVal * 0.5 + (i * disVal * 0.2)), disVal * 0.2 - (i * disVal * 0.1)),
            cc.p(-(-disVal * 0.8 + (i * disVal * 0.3)), -disVal * 0.3 - (i * disVal * 0.15))
        ];
        r.runAction(cc.spawn(
            cc.bezierTo(0.5, bezier).easing(cc.easeIn(1)),
            cc.fadeOut(0.5).easing(cc.easeIn(3)),
        ));
    },
});
