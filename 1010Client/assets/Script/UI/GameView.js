var defines = require("../Const/Defines");
var Utils = require("./Utils/Utils");
var CubeStack = require("./CubeStack");
var Cube = require("./Cube");
// var GameApplication     = require("../../GameApplication");
var deathColor = cc.color(153, 153, 153, 255);
cc.Class({
    extends: cc.Component,

    properties: {
        myApp: {
            default: null,
            // type:GameApplication,
            visible: false,
        },
        vsHead: {
            default: [],
            type: [cc.Sprite]
        },
        vsScore: {
            default: [],
            type: [cc.Label]
        },
        highTxt: {
            default: null,
            type: cc.Label
        },
        scoreTxt: {
            default: null,
            type: cc.Label
        },
        addStarBtn: {
            default: null,
            type: cc.Node,
        },
        addScoreTxt: {
            default: null,
            type: cc.Label,
        },
        gemEffect: {
            default: null,
            type: cc.Node,
        },
        refreshBtn: {
            default: null,
            type: cc.Button,
        },
        refreshShader: {
            default: null,
            type: cc.Node,
        },
        colorSprite: {//方块的全部颜色精灵
            default: [],
            type: [cc.Color]
        },
        removeLab: {
            default: [],
            type: [cc.Node],
        },
        allCubes: {//所有网格方块
            default: [],
            visible: false,
        },
        gridPoints: {//记录每个格子x，y轴的位置
            default: [],
            visible: false
        },
        nextCubes: {//出现的方块堆
            default: [],
            type: [CubeStack],
        },
        cubeColors: {//每种方块类型对应颜色值
            default: [],
            visible: false
        },
        curCubeShader: {//当前出现方块堆阴影
            default: [],
            visible: false,
        },
        curCubeStack: {//当前可移动的方块堆
            default: null,
            type: CubeStack,
        },
        rowNum: {//每行累计方块数
            default: [],
            visible: false
        },
        columnNum: {//每列累计方块数
            default: [],
            visible: false,
        },
        cubeRow: {
            default: [],
            visible: false,
        },
        cubeColumn: {
            default: [],
            visible: false,
        },
        cubeChange: {
            default: [],
            visible: false,
        },
        touchPos: {
            default: cc.v2(0, 0),
            visible: false,
        },
        curPoint: {//当前移动目标点
            default: cc.v2(0, 0),
            visible: false,
        },
        curRemovePoint: {//当前可消除点
            default: cc.v2(-1, -1),
            visible: false,
        },
        removeArr: {
            default: [],
            visible: false,
        },
        recordPoint: {
            default: cc.v2(0, 0),
            visible: false,
        },
        randomCount: {
            default: 0,
            visible: false,
        },
        myScore: {
            default: 0,
            visible: false
        },
        myHighScore: {
            default: 0,
            visible: false
        },
        isRevive: {
            default: false,
            visible: false,
        },
        isFirst: {
            default: true,
            visible: false,
        },
        gemAct: {
            default: null,
            visible: false
        },
        removeAct: {
            default: null,
            visible: false
        },
        fontAct: {
            default: null,
            visible: false,
        },
        scoreAct: {
            default: null,
            visible: false,
        },
        isOpenSound: {
            default: true,
            visible: false,
        },
        myVolumn: {
            default: 0,
            visible: false
        },
        colorNum: {
            default: 0,
            visible: false,
        },
        allCubeNum: {
            default: 0,
            visible: false,
        },
        isTouching: {
            default: false,
            visible: false,
        },
        curMoveIdx: {
            default: 0,
            visible: false,
        },
        buttomY: {
            default: 0,
            visible: false,
        },
        leftX: {
            default: 0,
            visible: false,
        },
        curStackNum: {
            default: 0,
            visible: false,
        },
        removeDelay: {
            default: 0,
            visible: false,
        },
        removeCount: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        decrease: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        decreaseLabel: {
            default: null,
            type: cc.Label,
        },
        headAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        idxList: {
            default: [],
            type: [cc.Integer],
            visible: false,
        },
        overTitel: {
            default: null,
            type: cc.Node,
        },
        overAnim: {
            default: [],
            type: [cc.Node],
        },
        myOver: {
            default: [],
            type: [cc.Node],
        },
        anims: {
            default: [],
            type: [cc.Node],
        },
        gift: {
            default: null,
            type: cc.Node,
        },
        addText: {
            default: null,
            type: cc.Node,
        },
    },

    init(gameApp, vol) {
        this.myApp = gameApp;
        this.myVolumn = vol;
        this.isOpenSound = this.myVolumn > 0 ? true : false;
    },

    onLoad() {
        window.game = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.onMouseDown(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.onMouseMove(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onMouseUp(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.onMouseUp(event);
        }, this);
        var screenWidth = cc.director.getWinSize().width;
        var btnPos = this.node.convertToWorldSpaceAR(this.refreshBtn.node.position);
        // console.log("------->",cc.director.getWinSize(),"-->",this.refreshBtn.node.position,"-->",this.node.convertToWorldSpaceAR(this.refreshBtn.node.position));
        if (screenWidth < btnPos.x + 40) {
            var pos = cc.v2(screenWidth - 40, btnPos.y);
            this.refreshBtn.node.setPosition(this.node.convertToNodeSpaceAR(pos));
        }
        // console.log("AAAA------->",this.refreshBtn.node.position,"-->",this.node.convertToWorldSpaceAR(this.refreshBtn.node.position));
    },

    onEnable() {
        this.addStarBtn.active = true;
        this.decrease = 20;
        this.decreaseLabel.string = this.decrease;
        this.isRevive = false;
        this.getOpAnim();
        if ((window.gameApplication.playTimes + 1) % 1 == 0) {
            this.unschedule(this.flyGift);
            this.scheduleOnce(this.flyGift, 30 + Math.floor(Math.random() * 10));
        }
        this.checkCount();
    },

    onDisable() {
        this.addStarBtn.active = false;
        this.decrease = 20;
        this.decreaseLabel.string = this.decrease;
        this.unschedule(this.flyGift);
        this.gift.stopAllActions();
        this.gift.x = -400;
    },

    //随机排序因子
    randomsort(a, b) {
        if (Math.random() > 0.5) {
            return -1;
        } else {
            return 1;
        }
        //通过随机产生0到1的数，然后判断是否大于0.5从而影响排序，产生随机性的效果。
    },

    //检查能否继续看视频获得星星
    checkCount() {
        window.gameApplication.checkDailyCount("video", false, function (videoCount) {
            if (videoCount >= 4) {
                this.addText.active = false;
            } else {
                this.addText.active = true;
            }
        }.bind(this));
    },

    //飘礼包
    flyGift() {
        var fix = cc.randomMinus1To1();
        var fixY = 200 * fix;
        this.gift.stopAllActions();
        if (fix > 0) {
            fix = 1;
        } else {
            fix = -1;
        }
        this.gift.x = fix * 400;
        this.gift.y = fixY;
        this.gift.runAction(
            cc.spawn(
                cc.moveBy(10, cc.v2(-fix * 1000, 0)),
                cc.sequence(
                    cc.moveBy(0.8, cc.v2(0, 40)),
                    cc.moveBy(0.8, cc.v2(0, -40)),
                    cc.moveBy(0.8, cc.v2(0, 40)),
                    cc.moveBy(0.8, cc.v2(0, -40)),
                    cc.moveBy(0.8, cc.v2(0, 40)),
                    cc.moveBy(0.8, cc.v2(0, -40)),
                    cc.moveBy(0.8, cc.v2(0, 40)),
                    cc.moveBy(0.8, cc.v2(0, -40)),
                    cc.moveBy(0.8, cc.v2(0, 40)),
                    cc.moveBy(0.8, cc.v2(0, -40)),
                    cc.moveBy(0.8, cc.v2(0, 40)),
                    cc.moveBy(0.8, cc.v2(0, -40)),
                )
            )
        )
    },

    //飞行礼包点击事件
    flyGiftClick() {
        window.gameApplication.showVideoView(function (isCompleted) {
            if (isCompleted) {
                SDK().getItem("all", function (stars) {
                    stars = parseInt(stars);
                    stars = stars + 20;
                    SDK().setItem({ all: stars }, null);
                    if (null != window.gameApplication.starLable) {
                        window.gameApplication.starLable.string = stars.toString();
                    }
                    window.gameApplication.soundManager.playSound("tip");
                    window.gameApplication.flyTipAnim(20);
                }.bind(this));

                this.unschedule(this.flyGift);
                this.gift.stopAllActions();
                this.gift.x = -400;
            }
        }.bind(this),false);
    },

    //初始化头像
    getOpAnim() {
        //初始化储存列表和对手头像
        this.idxList = [];
        this.getOpDate(0);

        //设置自己的头像和分数
        SDK().getSelfInfo(function (my) {
            this.vsHead[0].spriteFrame = my.head;
            this.vsHead[0].node.width = 100;
            this.vsHead[0].node.height = 100;
            this.vsScore[0].string = 0;
        }.bind(this))
    },

    //获取对手的头像动画
    getOpDate(score, idx) {
        //循环查看是否有重复
        var isRepeat = true;
        while (isRepeat) {
            isRepeat = false;
            var id = Utils.GetRandomNum(1, 100);
            for (var i = 0; i < this.idxList.length; i = i + 1) {
                if (id == this.idxList[i]) {
                    isRepeat = true;
                    break;
                }
            }
            //没有重复则设置
            if (!isRepeat) {
                this.vsHead[1].spriteFrame = this.headAtlas.getSpriteFrame("head (" + id + ")");
                this.vsHead[1].node.width = 100;
                this.vsHead[1].node.height = 100;
                this.vsScore[1].string = score + 300 + Utils.GetRandomNum(1, 250);
                this.idxList.push(id);
            }
        }
    },

    //超越动画
    breakDown() {
        this.vsScore[1].node.opacity = 0;
        this.getOpDate(parseInt(this.vsScore[1].string));
        window.gameApplication.playMusic("newRecord");
        this.vsHead[1].node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.8, cc.v2(0, 100)),
                    cc.fadeOut(0.8),
                ),
                cc.callFunc(function () {
                    this.vsScore[1].node.runAction(cc.fadeIn(0.8));
                    this.vsHead[1].node.y = -150;
                }.bind(this), this),
                cc.spawn(
                    cc.moveTo(0.8, cc.v2(0, 0)),
                    cc.fadeIn(0.8),
                ),
            )
        );
    },

    //结束界面的点击事件
    overClick() {
        this.idxList.pop();
        var haveBroken = this.idxList.pop();
        if (haveBroken != null) {
            this.idxList.push(haveBroken);
            this.overTitel.active = false;
            window.gameApplication.showPopGame(true);
            this.overBreak();
        } else {
            window.gameApplication.changeToMainView(null, "rank");
        }
    },

    //结束界面超越动画
    overBreak() {
        //将超越的头像放上去
        for (var i = 0; i < 3; i = i + 1) {
            var haveBroken = this.idxList.pop();
            if (haveBroken != null) {
                this.overAnim[i].parent.active = true;
                this.overAnim[i].getComponent(cc.Sprite).spriteFrame = this.headAtlas.getSpriteFrame("head (" + haveBroken + ")");
                this.overAnim[i].width = 120;
                this.overAnim[i].height = 120;
                if (i == 2) {
                    this.overAnim[3].active = true;
                }
            } else {
                this.overAnim[i].parent.active = false;
                if (i == 2) {
                    this.overAnim[3].active = false;
                }
            }
        }
        this.myOver[0].getComponent(cc.Sprite).spriteFrame = this.vsHead[0].spriteFrame
        this.myOver[1].getComponent(cc.Label).string = this.vsScore[0].string;

        this.anims[0].y = -50;
        this.anims[1].y = 250;
        this.anims[2].active = false;
        this.anims[3].opacity = 0;
        this.anims[3].scale = 5;

        this.anims[0].parent.active = true;

        this.anims[3].runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.35),
                    cc.scaleTo(0.35, 1),
                ),
                cc.callFunc(function () {
                    this.anims[0].runAction(
                        cc.spawn(
                            cc.moveTo(0.5, cc.v2(0, 250)).easing(cc.easeIn(2)),
                            cc.sequence(
                                cc.scaleTo(0.25, 1.2),
                                cc.scaleTo(0.25, 1)
                            )
                        ),
                    );

                    this.anims[1].runAction(
                        cc.spawn(
                            cc.moveTo(0.5, cc.v2(0, -50)).easing(cc.easeIn(2)),
                            cc.sequence(
                                cc.scaleTo(0.25, 0.8),
                                cc.scaleTo(0.25, 1),
                            )
                        ),
                    );
                }.bind(this), this),
            )
        );

        this.scheduleOnce(function () {
            window.gameApplication.playMusic("rank");
        }.bind(this), 0.25);

        this.scheduleOnce(function () {
            this.anims[2].runAction(
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
            this.anims[2].active = true;
        }.bind(this), 0.85)
    },


    //暂停游戏
    pauseGame() {
        window.gameApplication.playMusic("button");
        window.gameApplication.showPasueView(true);
    },

    //分享按钮
    shareBtnClick() {
        window.gameApplication.playMusic("button");
        window.gameApplication.onShareBtnClick();
    },

    start() {
        this.colorNum = this.colorSprite.length - 1;
        this.allCubeNum = defines.cubeNum;
        // cc.log("this.allCubeNum = ",this.allCubeNum ,"-->",this.colorNum)
        this.randomColor();

        var cube = null;
        var arr;
        //获取格子里所有砖块
        for (var i = 0; i < defines.row; i++) {
            var _row = cc.find("Bg/Center/Map/row_" + i.toString(), this.node);
            this.gridPoints[i] = cc.v2(0, this.node.convertToWorldSpaceAR(_row.position).y);
            arr = new Array(defines.column);
            for (var j = 0; j < defines.column; j++) {
                cube = _row.getChildByName(j.toString()).getComponent(Cube);//cc.find("Bg/Center/row_"+i.toString()+"/"+j.toString(),this.node).getComponent(Cube);
                cube.init(j, i, deathColor);
                arr[j] = cube;
                if (i == j) {
                    this.gridPoints[i] = cc.v2(this.node.convertToWorldSpaceAR(cube.node.position).x, this.gridPoints[i].y)
                }
            }
            this.allCubes[i] = arr;
        }
        this.buttomY = this.allCubes[0][0].getWorldPosition().y;// - defines.spriteWidth * 0.5;//this.node.convertToWorldSpaceAR(cc.find("Bg/Center/Buttom",this.node).position).y;
        this.leftX = this.allCubes[0][0].getWorldPosition().x;// - defines.spriteWidth * 0.5;//this.node.convertToWorldSpaceAR(cc.find("Bg/Center/Left",this.node).position).x;
        //cc.log(this.allCubes[0][0].getWorldPosition(), "-->", this.leftX, "-->", this.buttomY);
        this.initCubeNum();
        this.showScore();
        this.rundomCube();
        //this.playGemEffect();

        this.getHigheScore();

        this.isFirst = false;
        this.isBreak = false;
    },

    //看视频获得奖励
    getStarBtnClick() {
        window.gameApplication.playMusic("button");
        window.gameApplication.showVideoView(function (isCompleted) {
            if (isCompleted) {
                SDK().getItem("all", function (stars) {
                    stars = parseInt(stars);
                    stars = stars + 20;
                    SDK().setItem({ all: stars })
                    window.gameApplication.starLable.string = stars.toString();
                    window.gameApplication.flyTipAnim(20);
                    this.checkCount();
                }.bind(this));
            }
        }.bind(this),true)
    },

    //初始化累计方块数
    initCubeNum() {
        this.cubeChange = new Array();
        this.rowNum = new Array(defines.row);
        this.columnNum = new Array(defines.column);
        for (var i = 0; i < defines.row; i++) {
            this.rowNum[i] = 0;
            this.columnNum[i] = 0;
        }
    },

    randomColor() {
        //随机颜色值
        for (var i = 0; i < this.allCubeNum; i++) {
            this.cubeColors[i] = Utils.random(0, this.colorNum);
        }
    },

    getHigheScore() {
        SDK().getItem("highScore", function (score, key) {
            //cc.log("getHighScore",score,"-->",key);
            this.myHighScore = score;
            this.highTxt.string = score.toString();
        }.bind(this));
    },

    playGemEffect() {
        if (this.gemAct == null) {
            this.gemEffect.setScale(0, 0);
            var repeat = cc.repeatForever(cc.rotateBy(0.8, 360));
            this.gemEffect.runAction(repeat);
            var action1 = cc.scaleTo(1, 1, 1);
            var action2 = cc.scaleTo(0.5, 0, 0);
            this.gemAct = cc.sequence(action1, action2);
        }

        this.gemEffect.runAction(this.gemAct);
        this.scheduleOnce(function () {
            this.playGemEffect();
        }, 2);
    },

    //消除之后的分数飞字动画
    playRemoveAni(idx) {
        if (this.removeAct == null) {
            var action1 = cc.moveTo(0.5, cc.v2(0, 100));
            var action3 = cc.fadeTo(0.1, 0);
            this.removeAct = cc.sequence(action1, action3);
        }

        this.removeLab[idx].setPosition(0, 0);
        this.removeLab[idx].opacity = 255;
        this.removeLab[idx].runAction(this.removeAct);
    },

    restartGame() {
        window.gameApplication.showPopGame(false);
        this.getOpAnim();
        //cc.log("this.isFirst = ", this.isFirst, "-->", this.myApp.myVolume);
        this.myApp.playMusic("begin");
        this.myVolumn = this.myApp.myVolume;
        this.isOpenSound = this.myVolumn > 0 ? true : false;


        this.decrease = 10;
        this.decreaseLabel.string = this.decrease;
        this.isRevive = false;

        if (this.isFirst == false) {
            for (var i = 0; i < defines.row; i++) {
                for (var j = 0; j < defines.column; j++) {
                    this.allCubes[i][j].init(j, i);
                }
            }
            this.curPoint = cc.v2(0, 0);
            this.randomCount = 0;
            this.myScore = 0;
            this.refreshShader.active = false;
            this.showScore();
            this.randomColor();
            this.initCubeNum();
            this.rundomCube();
            this.getHigheScore();
            this.removeCount = 0;
        }
    },

    reviveAnim() {
        this.myApp.playMusic("clear1");
        for (var i = 2; i <= 5; i++) {
            for (var j = 2; j <= 5; j++) {
                this.allCubes[i][j].removeCube(Math.abs(i - 5) * 0.1);
                if (this.allCubes[i][j].isPutIn) {
                    this.rowNum[i]--;
                    this.columnNum[j]--;
                    if (this.rowNum[i] < 0) {
                        this.rowNum[i] = 0;
                    }
                    if (this.columnNum[j] < 0) {
                        this.columnNum[j] = 0;
                    }
                }
            }
        }

        //恢复
        for (var i = 0; i < defines.row; i++) {
            for (var j = 0; j < defines.column; j++) {
                if (this.allCubes[i][j].isPutIn == true) {
                    this.allCubes[i][j].die(null, 0, true);
                }
            }
        }

        for (var i = 0; i < defines.createNum; i++) {
            var id = Utils.random(0, this.allCubeNum - 1);
            this.nextCubes[i].setBodyColor(this.colorSprite[this.cubeColors[id]]);
        }
    },

    gameOver() {
        this.myApp.playMusic("gameover");
        this.showDeath();
    },

    showDeath() {
        this.unschedule(this.flyGift);
        var x = Utils.random(2, 4);
        var y = Utils.random(2, 4);
        var delay = 0;
        var maxdelay = 0;
        for (var i = 0; i < defines.row; i++) {
            for (var j = 0; j < defines.column; j++) {
                if (this.allCubes[i][j].isPutIn == true) {
                    delay = (Math.abs(i - x) + Math.abs(j - y)) * defines.dieDelay;
                    if (delay > maxdelay) {
                        maxdelay = delay;
                    }
                    // cc.log("----->",delay);
                    this.allCubes[i][j].die(deathColor, delay);
                }
            }
        }

        if (!this.isRevive) {
            window.gameApplication.showReviveView(function (isCompleted) {
                if (isCompleted) {
                    this.isRevive = true;
                    this.reviveAnim();
                } else if(!isCompleted) {
                    this.showEnd(0);
                }
            }.bind(this));
        } else {
            this.showEnd(maxdelay);
        }
    },

    showEnd(maxdelay) {
        window.gameApplication.playTimes++
        this.scheduleOnce(function () {
            if (this.myScore >= this.myHighScore) {
                var json = {};
                json.highScore = this.myScore;
                SDK().setItem(json, function () { });
                SDK().setRankScore(2, this.myScore, "", function () {
                    //cc.log("------------------------上传分数完成");
                });
            }

            if (window.Score != null) {
                window.Score.string = this.myScore;
            }

            //结束界面处理
            this.anims[0].parent.active = false;
            this.myApp.showOverView(true);
            this.overTitel.active = false;
            this.overClick();
            /* this.overTitel.scale = 5;
            this.overTitel.opacity = 0;
            this.overTitel.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.fadeIn(0.25),
                        cc.scaleTo(0.25, 1),
                    ),
                    cc.delayTime(1),
                    cc.callFunc(function () {
                        this.overClick();
                    }.bind(this), this),
                )
            ); */

        }, maxdelay + 0.2);
    },

    //显示分数
    showScore(isshow = true) {
        if (this.scoreAct == null) {
            var action1 = cc.scaleTo(0.2, 2, 2);
            var action2 = cc.scaleTo(0.1, 1, 1);
            this.scoreAct = cc.sequence(action1, action2);
        }
        if (this.myScore > 0 && isshow) {
            this.scoreTxt.node.runAction(this.scoreAct);
        }

        //播放超越动画
        if (this.myScore > parseInt(this.vsScore[1].string)) {
            this.breakDown();
        }

        if (this.myScore > this.myHighScore) {

            this.myHighScore = this.myScore;
            var json = {};
            json.highScore = this.myScore;
            SDK().setItem(json, function () { });
            SDK().setRankScore(2, this.myScore, "", function () {
                //cc.log("------------------------上传分数完成");
            });

            if (!this.isBreak) {
                this.myApp.playMusic("newRecord");
                this.isBreak = true;
            }
            this.highTxt.node.runAction(cc.sequence(
                cc.scaleTo(0.1, 1.2),
                cc.callFunc(function () {
                    this.highTxt.string = this.myHighScore;
                }.bind(this), this),
                cc.scaleTo(0.1, 1),
            ));
        }

        //每两百分加一个星星
        var isAdd = Math.floor(this.myScore / 200);
        if (isAdd > 0 && isAdd != this.removeCount) {
            this.removeCount = isAdd;
            window.gameApplication.addStar();
        }

        this.scoreTxt.string = this.myScore.toString();
        this.vsScore[0].string = this.myScore;
    },

    //消除增加分数
    addScore(line) {
        var add = 0;
        switch (line) {
            case 1:
                add = 10;
                this.myApp.playMusic("clear1");
                break;
            case 2:
                add = 30;
                this.myApp.playMusic("clear2");
                break;
            case 3:
                add = 60;
                this.myApp.playMusic("clear2");
                break;
            case 4:
                add = 150;
                this.myApp.playMusic("clear4");
                break;
            case 5:
                add = 300;
                this.myApp.playMusic("clear5");
                break;
            default:
                add = 600;
                this.myApp.playMusic("clear5");
                break;
        }

        this.myScore += add;
        this.showScore(false);
        this.showAddScore(add);
    },

    //分数上升动画
    showAddScore(add) {
        // cc.log("showAddScore = ",add,"-->",this.curRemovePoint);
        this.addScoreTxt.node.setScale(0.5, 0.5);
        this.addScoreTxt.string = "/" + add;
        var x = 2;
        var y = 2;
        if (this.curRemovePoint.x >= 0) {
            x = this.curRemovePoint.x;
        }
        if (this.curRemovePoint.y >= 0) {
            y = this.curRemovePoint.y;
        }
        this.curRemovePoint = cc.v2(-1, -1);
        this.addScoreTxt.node.position = this.node.convertToNodeSpaceAR(this.allCubes[y][x].getWorldPosition());//.node.position;
        this.addScoreTxt.node.active = true;
        //cc.log(this.addScoreTxt.node.position, this.addScoreTxt.node.active);
        if (this.fontAct == null) {
            var action1 = cc.scaleTo(1, 2.4, 2.4);
            var action2 = cc.moveTo(1, cc.v2(this.addScoreTxt.node.position.x, this.addScoreTxt.node.position.y + 100));
            var spawn = cc.spawn(action1, action2);
            var action3 = cc.callFunc(function () {
                this.addScoreTxt.node.active = false;
            }, this);
            this.fontAct = cc.sequence(spawn, action3);
        }
        this.addScoreTxt.node.runAction(this.fontAct);

    },

    onMouseDown(event) {
        if (this.isTouching) {
            return;
        }
        // cc.log("<<<<----------------onMouseDown---------------->>>>");
        this.touchPos = event.getLocation();
        for (var i = 0; i < defines.createNum; i++) {
            if (this.nextCubes[i].isActive && this.nextCubes[i].pointInCollider(this.touchPos)) {
                // cc.log("BBBBBBBBBBBBBBBBB--->",i,"-->",this.node.convertToNodeSpaceAR(this.touchPos),"-->",this.touchPos);
                this.isTouching = true;
                this.curMoveIdx = i;
                var id = this.nextCubes[i].id;
                this.curCubeStack.init(id, this.colorSprite[this.cubeColors[id]])
                this.curCubeStack.touchAction(this.node.convertToNodeSpaceAR(this.touchPos), false, this.nextCubes, i);
                this.curPoint = this.getGridIdx(this.curCubeStack.getFirstPos());
                this.cubeInGrid();
                this.myApp.playMusic("clickcube");
                break;
            }
        }
    },

    onMouseUp(event) {
        // cc.log("<<<<----------------onMouseUp---------------->>>>");
        if (this.isTouching == true) {
            this.isTouching = false;


            if (this.curCubeShader.length > 0) {
                this.curCubeStack.setActive(false);
                this.nextCubes[this.curMoveIdx].setDeath();
                this.rowNum = [].concat(this.cubeRow);
                this.columnNum = [].concat(this.cubeColumn);

                this.myApp.playMusic("moveSuccess");
                for (var i = 0; i < this.curCubeShader.length; i++) {
                    this.curCubeShader[i].showInGrid();
                }
                this.myScore += this.curCubeShader.length;
                this.showScore();
                this.curCubeShader = new Array();
                --this.curStackNum;
                this.canRemoveCube(this.removeArr);
                if (this.curStackNum <= 0) {
                    this.rundomCube();
                }

            } else {
                this.myApp.playMusic("moveFail");
                var backPos = this.nextCubes[this.curMoveIdx].node.parent.convertToWorldSpaceAR(this.nextCubes[this.curMoveIdx].node.position);
                backPos = this.node.convertToNodeSpaceAR(backPos);
                this.curCubeStack.touchAction(backPos, true, this.nextCubes);
            }
        }
    },

    onMouseMove(event) {
        if (this.isTouching) {
            this.touchPos = event.getLocation();
            this.curCubeStack.setPosition(this.node.convertToNodeSpaceAR(this.touchPos));
            this.recordPoint = this.getGridIdx(this.curCubeStack.getFirstPos());
            if (this.recordPoint != this.curPoint) {
                this.hideShader();
                this.curPoint = this.recordPoint;
                this.cubeInGrid();
            }
        }
    },

    //隐藏阴影的砖块
    hideShader() {
        if (this.curCubeShader.length > 0) {
            for (var i = 0; i < this.curCubeShader.length; i++) {
                this.curCubeShader[i].hideShader();
            }

            this.curCubeShader = new Array();
        }
    },

    //判断是否可以放在格子里
    cubeInGrid() {
        if (this.curPoint.x < 0 || this.curPoint.y < 0 || this.curPoint.x >= defines.row || this.curPoint.y >= defines.column) {
            return;
        }

        this.CubeColorNormal();

        // cc.log("this.curPoint.x: ",this.curPoint.x," this.curCubeStack.myColumn: ",this.curCubeStack.myColumn," this.curPoint.y: ",this.curPoint.y," this.curCubeStack.myRow: ",this.curCubeStack.myRow);
        if (this.curPoint.y >= this.curCubeStack.myRow - 1 && defines.column - this.curPoint.x >= this.curCubeStack.myColumn) {
            var idx = 0;
            var curData = this.curCubeStack.myCubeData;;
            for (var i = this.curPoint.y; i >= this.curPoint.y - this.curCubeStack.myRow + 1; i--) {
                for (var j = this.curPoint.x; j < this.curPoint.x + this.curCubeStack.myColumn; j++) {
                    // cc.log("cubeInGrid-->",i,"-->",j,"-->",this.allCubes[i][j].isPutIn,"-->",curData[this.curPoint.y-i][j-this.curPoint.x])
                    if (curData[this.curPoint.y - i][j - this.curPoint.x] == 1) {
                        if (this.allCubes[i][j].isPutIn == false) {
                            this.curCubeShader[idx] = this.allCubes[i][j];
                            idx++;
                        } else {
                            this.curCubeShader = new Array();
                            return;
                        }
                    }
                }
            }

            this.cubeRow = [].concat(this.rowNum);
            this.cubeColumn = [].concat(this.columnNum);;
            var point;
            idx = 0;
            this.removeArr = new Array();
            this.curRemovePoint = cc.v2(-1, -1);
            for (var i = 0; i < this.curCubeShader.length; i++) {
                this.curCubeShader[i].showShader(this.curCubeStack.color)
                point = this.curCubeShader[i].point
                ++this.cubeRow[point.y];
                ++this.cubeColumn[point.x];
                if (this.cubeRow[point.y] >= defines.row) {
                    if (this.curRemovePoint.y < 0) {
                        this.curRemovePoint = cc.v2(this.curRemovePoint.x, point.x);
                    }
                    this.removeArr[idx] = point.y;
                    ++idx;
                }
                if (this.cubeColumn[point.x] >= defines.column) {
                    if (this.curRemovePoint.x < 0) {
                        this.curRemovePoint = cc.v2(point.y, this.curRemovePoint.y);
                    }
                    this.removeArr[idx] = point.x + defines.row;
                    ++idx;
                }
            }

            this.canRemoveShaderCube(this.removeArr);
        }
        // else
        // {
        //     cc.log("grid state = (",this.curPoint.x+this.curCubeStack.offset,",",this.curPoint.y,")-->",this.allCubes[this.curPoint.x+this.curCubeStack.offset][this.curPoint.y].isPutIn);
        // }
    },

    //获取当前位置所对应的格子位置
    getGridIdx(pos) {
        var gridX = (pos.x - this.leftX) / defines.spriteWidth;
        var gridY = (pos.y - this.buttomY) / defines.spriteWidth;
        gridX = Math.round(gridX);
        gridY = Math.round(gridY);
        // cc.log("getGridIdx = ",gridX,"-->",gridY);
        return cc.v2(gridX, gridY);
    },

    CubeColorNormal() {
        if (this.cubeChange.length > 0) {
            for (var i = 0; i < this.cubeChange.length; i++) {
                this.cubeChange[i].setNormalSprite();
            }
            this.cubeChange = new Array();
        }
    },

    canRemoveShaderCube(arr) {
        if (arr.length > 0) {
            var idx = 0;
            for (var i = 0; i < arr.length; i++) {
                idx = arr[i];
                if (idx >= defines.row) {
                    idx -= defines.row;
                    for (var j = 0; j < defines.column; j++) {
                        this.cubeChange.push(this.allCubes[j][idx]);
                        this.allCubes[j][idx].setShaderSprite(this.curCubeStack.color);
                    }
                } else {
                    for (var j = 0; j < defines.row; j++) {
                        this.cubeChange.push(this.allCubes[idx][j]);
                        this.allCubes[idx][j].setShaderSprite(this.curCubeStack.color);
                    }
                }
            }
        }
    },

    canRemoveCube(arr) {
        //cc.log("canRemoveCube = ", arr.length);
        this.removeDelay = 0;
        var length = arr.length;
        if (length > 0) {
            var idx = 0;
            var delay = 0;
            for (var i = 0; i < length; i++) {
                idx = arr[i];
                if (idx >= defines.row) {
                    idx -= defines.row;
                    // cc.log("==================column remove-->",idx,"-->",this.curRemovePoint);
                    for (var j = 0; j < defines.column; j++) {
                        if (this.curRemovePoint.x >= 0) {
                            delay = Math.abs(j - this.curRemovePoint.x) * defines.removeDelay;
                            if (delay > this.removeDelay) {
                                this.removeDelay = delay;
                            }
                        }
                        this.allCubes[j][idx].removeCube(delay);
                        this.rowNum[j]--;
                        if (this.rowNum[j] < 0) {
                            this.rowNum[j] = 0;
                        }
                    }
                    this.curRemovePoint = cc.v2(idx, this.curRemovePoint.y);
                    this.columnNum[idx] = 0;
                } else {
                    // cc.log("==================row remove-->",idx,"-->",this.curRemovePoint);
                    for (var j = 0; j < defines.row; j++) {
                        if (this.curRemovePoint.y >= 0) {
                            delay = Math.abs(j - this.curRemovePoint.y) * defines.removeDelay;
                            if (delay > this.removeDelay) {
                                this.removeDelay = delay;
                            }
                        }
                        this.allCubes[idx][j].removeCube(delay);
                        this.columnNum[j]--;
                        if (this.columnNum[j] < 0) {
                            this.columnNum[j] = 0;
                        }
                    }
                    this.curRemovePoint = cc.v2(this.curRemovePoint.x, idx);
                    this.rowNum[idx] = 0;
                }
            }

            this.addScore(length);
        }

        // cc.log("this.removeDelay----->",this.removeDelay);
        this.scheduleOnce(function () {
            //cc.log("this.curStackNum = ", this.curStackNum);
            if (this.curStackNum > 0 && this.checkGame() == false) {
                //cc.log("====================================失败了");
                // this.myApp.changeToResultView();
                this.gameOver();
            }
        }, this.removeDelay + 0.2);

    },

    checkGame() {
        var canGoon = false;
        var canput = true;
        var isShake = true;
        for (var i = 0; i < defines.createNum; i++) {
            if (this.nextCubes[i].isAlive || (this.isTouching == true && i == this.curMoveIdx)) {
                // cc.log("checkGame---->",this.nextCubes[i].pType,"-->",this.nextCubes[i].isAlive);
                switch (this.nextCubes[i].pType) {
                    case 0:
                        canput = true;
                        break;
                    case 1://横条
                        canput = this.checkHorizontal(this.nextCubes[i].myColumn);
                        break;
                    case 2://竖条
                        canput = this.checkVertical(this.nextCubes[i].myRow);
                        break;
                    case 3://实心正方形
                        canput = this.checkSolidSquare(this.nextCubes[i].myRow);
                        break;
                    case 4://有空缺
                        canput = this.checkComplexity1(2);
                        break;
                    /* case 5:
                        canput = this.checkComplexity2(3, 1);
                        break;
                    case 6:
                        canput = this.checkComplexity2(3, 0);
                        break;
                    case 7:
                        canput = this.checkComplexity3(3);
                        break; */
                    case 8:
                        canput = this.checkComplexity4(3);
                        break;
                }
                if (canput == true) {
                    canGoon = true;
                    //console.log("-------------ok");
                } else {
                    window.gameApplication.scaleUpAndDowm(this.refreshBtn.node, false);
                    isShake = false;
                }
                this.nextCubes[i].changeAlpha(canput)
            } else {
                //cc.log("death cubeStack----->", i);
            }
        }

        if (isShake) {
            this.refreshBtn.node.stopAllActions();
            this.refreshBtn.node.scale = 1;
        }

        return canGoon;
    },

    //检查水平方向是否可以放置
    checkHorizontal(len) {
        var lastnum = 0;
        var num = 0;
        var j = 0;
        for (var i = defines.row - 1; i >= 0; i--) {
            // cc.log("this.rowNum[",i,"] = ",this.rowNum[i],"-->",Math.floor((defines.row-len)/len),"-->len = ",len);
            if (this.rowNum[i] == 0 || this.rowNum[i] <= Math.floor((defines.row - len) / len)) {
                return true;
            }

            lastnum = defines.row - this.rowNum[i];
            if (lastnum >= len) {
                num = 0;
                j = 0;
                while (j < defines.column) {

                    if (this.allCubes[i][j].isPutIn == false) {
                        ++num;
                    } else {
                        num = 0;
                    }

                    // cc.log("checkHorizontal -- >(",i,",",j,") = ",this.allCubes[i][j].isPutIn,"--->",num);
                    if (num >= len) {
                        return true;
                    }
                    ++j;
                }
            }
        }

        return false;
    },

    //检查垂直方向是否可以放置
    checkVertical(len) {
        var lastnum = 0;
        var num = 0;
        var j = 0;
        for (var i = defines.column - 1; i >= 0; i--) {
            // cc.log("this.columnNum[",i,"] = ",this.columnNum[i],"-->",Math.floor((defines.column-len)/len),"-->len = ",len);
            if (this.columnNum[i] == 0 || this.columnNum[i] <= Math.floor((defines.column - len) / len)) {
                return true;
            }

            lastnum = defines.column - this.columnNum[i];
            if (lastnum >= len) {
                num = 0;
                j = 0;
                while (j < defines.column) {
                    if (this.allCubes[j][i].isPutIn == false) {
                        ++num;
                    } else {
                        num = 0;
                    }
                    // cc.log("checkVertical -- >(",i,",",j,") = ",this.allCubes[j][i].isPutIn,"--->",num);
                    if (num >= len) {
                        return true;
                    }
                    ++j;
                }
                // for(var j = defines.column - len - 1;j >= 0;j--)
                // {
                //     ++allnum;
                //     if(this.allCubes[j][i].isPutIn == false)
                //     {
                //         ++num;
                //     }else
                //     {
                //         num = 0;
                //     }

                //     if(num >= len)
                //     {
                //         return true;
                //     }

                //     if(allnum >= lastnum)
                //     {
                //         break;
                //     }
                // }
            }
        }

        return false;
    },

    //检查实心方阵
    checkSolidSquare(len) {

        var allnum = 0;
        for (var i = defines.row - 1; i >= 0; i--) {
            if (this.rowNum[i] == 0 || this.rowNum[i] <= Math.floor((defines.row - len) / len)) {
                ++allnum;
                if (allnum >= len) {
                    // cc.log("checkSolidSquare --> more");
                    return true;
                }
                continue;
            }
            allnum = 0;
        }

        var lastnum = defines.column - len;
        var j = 0;
        var isnext = true;
        for (var i = defines.row - 1; i >= len - 1; i--) {
            if (defines.row - this.rowNum[i] >= len) {
                j = 0;
                while (j <= lastnum) {
                    isnext = true;
                    for (var a = 0; a < len; a++) {
                        for (var b = 0; b < len; b++) {
                            if (this.allCubes[i - a][b + j].isPutIn == true) {
                                if (a == 0) {
                                    j = b + j;
                                }
                                isnext = false;
                                break;
                            }
                        }
                        if (isnext == false) {
                            break;
                        }
                    }

                    if (isnext) {
                        return true;
                    }

                    ++j;

                }
            }

        }

        return false;
    },

    //检查复杂类型方阵(1,1),(1,0)
    checkComplexity1(len) {
        var allnum = 0;
        for (var i = defines.row - 1; i >= 0; i--) {
            if (this.rowNum[i] == 0 || this.rowNum[i] <= Math.floor((defines.row - len) / len)) {
                ++allnum;
                if (allnum >= len) {
                    return true;
                }
                continue;
            }

            allnum = 0;
        }

        for (var i = defines.row - 1; i > 0; i--) {
            if (defines.column - this.rowNum[i] >= len) {
                var j = 0;
                var isnext = true;
                while (j < defines.column - 1) {
                    isnext = true;
                    for (var a = 0; a < len; a++) {
                        if (this.allCubes[i][a + j].isPutIn == true) {
                            j = a + j;
                            isnext = false;
                            break;
                        }
                    }

                    if (isnext && this.allCubes[i - 1][j].isPutIn == false) {
                        return true;
                    } else {
                        ++j;
                    }
                }
            }
        }

        return false;
    },

    //检查复杂类型方阵[(0,1,0),(1,1,1)][(1,0,0),(1,1,1)]
    checkComplexity2(len, idx) {
        var allnum = 0;
        for (var i = defines.row - 1; i >= 0; i--) {
            if (this.rowNum[i] == 0 || this.rowNum[i] <= Math.floor((defines.row - len) / len)) {
                ++allnum;
                if (allnum >= len) {
                    // cc.log("checkComplexity2 --> more",idx);
                    return true;
                }
                continue;
            }

            allnum = 0;
        }

        var j = 0;
        var neednum = defines.column - len;
        var lastnum = 0;
        var isnext = true;
        for (var i = defines.column - 1; i > 0; i--) {
            lastnum = defines.column - this.rowNum[i - 1]
            if (lastnum >= len) {
                j = 0;
                while (j <= neednum) {
                    isnext = true;
                    for (var a = 0; a < len; a++) {
                        if (this.allCubes[i - 1][a + j].isPutIn == true) {
                            j = a + j;
                            isnext = false;
                            break;
                        }
                    }

                    if (isnext == true && this.allCubes[i][j + idx].isPutIn == false) {
                        // cc.log("checkComplexity2 -->",idx,"-->",this.allCubes[i][j+idx].isPutIn);
                        return true;
                    }

                    ++j;
                }
            }
        }

        return false;
    },

    //检查复杂类型方阵[0,1,1],[1,1,0]
    checkComplexity3(len) {
        var allnum = 0;
        var isnext = true;
        for (var i = defines.row - 1; i >= 0; i--) {
            if (this.rowNum[i] == 0 || this.rowNum[i] <= Math.floor((defines.row - len) / len)) {
                ++allnum;
                if (allnum >= len) {
                    // cc.log("checkComplexity3 --> more");
                    return true;
                }
                continue;
            }

            allnum = 0;
        }

        for (var i = defines.row - 1; i > 0; i--) {
            if (defines.row - this.rowNum[i] >= len - 1) {
                var j = 0;
                while (j <= defines.column - len) {
                    isnext = true;
                    for (var a = 0; a < len - 1; a++) {
                        if (this.allCubes[i][a + j + 1].isPutIn == true) {
                            j = a + j + 1;
                            isnext = false;
                            break;
                        }

                        if (this.allCubes[i - 1][a + j].isPutIn == true) {
                            j = a + j;
                            isnext = false;
                            break;
                        }
                    }

                    if (isnext) {
                        return true;
                    }
                    ++j;
                }
            }
        }

        return false;
    },

    //检查复杂类型方阵[[1,1,1],[0,0,1],[0,0,1]]
    checkComplexity4(len) {
        var allnum = 0;
        for (var i = defines.row - 1; i >= 0; i--) {
            if (this.rowNum[i] == 0 || this.rowNum[i] <= Math.floor((defines.row - len) / len)) {
                ++allnum;
                if (allnum >= len) {
                    return true;
                }
                continue;
            }

            allnum = 0;
        }

        for (var i = defines.row - 1; i > 1; i--) {
            if (defines.column - this.rowNum[i] >= len) {
                var j = 0;
                while (j <= defines.column - len) {
                    var isnext = true;
                    for (var a = 0; a < len; a++) {
                        if (this.allCubes[i][a + j].isPutIn == true) {
                            j = a + j;
                            isnext = false;
                            break;
                        }
                    }

                    if (isnext == true) {
                        if (this.allCubes[i - 1][j + len - 1].isPutIn == false && this.allCubes[i - 2][j + len - 1].isPutIn == false) {
                            return true;
                        } else {
                            ++j;
                        }
                    } else {
                        ++j;
                    }
                }
            }

        }
    },

    //刷新砖块按钮
    refreshBtnClicked() {
        this.myApp.playMusic("button");

        SDK().getItem("all", function (stars) {
            stars = parseInt(stars);
            if (stars >= this.decrease) {
                stars = stars - this.decrease;
                SDK().setItem({ all: stars })
                if (window.gameApplication.starLable != null) {
                    window.gameApplication.starLable.string = stars;
                }

                this.decrease = this.decrease * 2;
                this.decreaseLabel.string = this.decrease;
                this.rundomCube();
            } else {
                //分享获得星星
                window.gameApplication.showSharaView(function (isCompleted) {
                    if (isCompleted) {
                        SDK().getItem("all", function (stars) {
                            stars = parseInt(stars);
                            stars = stars + 20;
                            SDK().setItem({ all: stars })
                            if (window.gameApplication.starLable != null) {
                                window.gameApplication.starLable.string = stars;
                            }
                            window.gameApplication.flyTipAnim(20);
                        }.bind(this))
                    }
                }.bind(this))
            }
        }.bind(this))
    },



    //随机生成方块堆
    rundomCube() {
        this.curStackNum = defines.createNum;
        this.myApp.playMusic("newBatch");
        for (var i = 0; i < defines.createNum; i++) {
            this.nextCubes[i].hideAll();
            var id = Utils.random(0, this.allCubeNum - 1);
            //cc.log("rundomCube----------->",id,"-->",this.cubeColors[id],this.nextCubes[i]);
            this.nextCubes[i].init(id, this.colorSprite[this.cubeColors[id]], deathColor);
            this.nextCubes[i].setActive(true);
        }

        if (this.checkGame() == false) {
            cc.log("rundomCuberundomCuberundomCube====================================失败了");
            this.gameOver();
        }
    },
});
