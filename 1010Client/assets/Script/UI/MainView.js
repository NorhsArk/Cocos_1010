var Utils = require("./Utils/Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        myApp: {
            default: null,
            visible: false,
        },
        startBtn: {
            default: null,
            type: cc.Button,
        },
        scoreLable: {
            default: null,
            type: cc.Label,
        },
        upBtn: {
            default: null,
            type: cc.Button,
        },
        soudnBtn: {
            default: null,
            type: cc.Button,
        },
        soundLab: {
            default: null,
            type: cc.Node,
        },
        gemEffect: {
            default: null,
            type: cc.Node,
        },
        gemAct: {
            default: null,
            visible: false
        },
        isOpenMusic: {
            default: false,
            visible: false
        },
        myVolume: {
            default: 0,
            visible: false,
        },
    },

    onLoad() {
        window.Score = this.scoreLable;
        window.Score.string = 0;
    },

    onEnable() {
        if (window.timeGiftScript != null) {
            window.timeGiftScript.checkTime(true);
        }
        if (window.DailyScript != null) {
            window.DailyScript.checkIsReset();
        }
        if (window.gameApplication.myVolume == 1) {
            this.soundLab.active = false;
        } else {
            this.soundLab.active = true;
        }
        window.gameApplication.showPopGame(true);
    },

    onDisable() {
        window.gameApplication.showPopGame(false);
    },

    init(gameApp, vol) {
        this.myApp = gameApp;
        this.myVolume = vol;
        this.isOpenMusic = this.myVolume == 1 ? true : false;
        this.soundLab.active = !this.isOpenMusic;
    },

    playGemEffect() {
        if (this.gemAct == null) {
            this.gemEffect.setScale(0, 0);
            var repeat = cc.repeatForever(cc.rotateBy(0.8, 360));
            this.gemEffect.runAction(repeat);
            var action1 = cc.scaleTo(2, 2, 2);
            var action2 = cc.scaleTo(0.5, 0, 0);
            this.gemAct = cc.sequence(action1, action2);
        }

        this.gemEffect.runAction(this.gemAct);
        this.scheduleOnce(function () {
            this.playGemEffect();
        }, 2);
    },

    startBtnClicked() {
        this.myApp.playMusic("button");
        this.myApp.changeToGameView();
    },

    soudnBtnClicked() {
        this.myApp.playMusic("button");
        this.isOpenMusic = !this.isOpenMusic;
        this.soundLab.active = !this.isOpenMusic;
        this.myVolume = this.isOpenMusic ? 1 : 0;
        this.myApp.setVolumn(this.myVolume);
    },

    upBtnClicked() {
        cc.log("upBtnClicked");
        this.myApp.playMusic("button");
        SDK().getItem("highScore", function (score, key) {
            score = parseInt(score);
            cc.log("highScore = ", score, "-->", key);
            this.myApp.changeToResultView(0, score)
        }.bind(this));
    },


});
