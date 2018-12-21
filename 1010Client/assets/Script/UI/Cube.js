var NormalAnimation = require("./Common/NormalAnimation");

cc.Class({
    extends: cc.Component,

    properties: {
        mySprite: {
            default: null,
            type: cc.Sprite,
        },
        myAnim: {
            default: null,
            type: NormalAnimation,
        },
        point: {
            default: cc.v2(0, 0),
            visible: false,
        },
        isPutIn: {
            get: function () {
                if (this.isActive == false || this.isShowShader) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        spawn: {
            default: null,
            visible: false
        },
        curSpriteFrame: {
            default: null,
            type: cc.Color,
            visible: false,
        },
        colorIdx: {
            default: 0,
            visible: false,
        },

        isActive: false,
        isShowShader: false,
        isPutIn: false,

        deathColor:{
            default: null,
            visible: false,
        },
    },

    init(x, y) {
        this.setActive(false);
        this.colorIdx = 0;
        this.isPutIn = false;
        this.point = cc.v2(x, y);
        this.node.active = true;
        if (this.myAnim != null) {
            this.myAnim.loop = false;
        }
        if (this.spawn == null) {
            var action1 = cc.scaleTo(0.2, 1, 1);
            var action2 = cc.fadeTo(0.2, 255);
            this.spawn = cc.spawn(action1, action2);
        }
    },

    setSprite(sp) {
        this.mySprite.node.color = sp;
        this.setActive(true);
    },

    setShaderSprite(sp) {
        this.mySprite.node.color = sp;
    },

    setNormalSprite(sp) {
        if (this.curSpriteFrame != null) {
            this.mySprite.node.color = this.curSpriteFrame;
        }
    },

    setActive(isactive) {
        this.isActive = isactive;
        this.mySprite.enabled = this.isActive;
        // cc.log("this.mySprite.spriteFrame = ",this.mySprite.spriteFrame.name);
    },

    //显示阴影
    showShader(sp) {
        this.isShowShader = true;
        this.node.setScale(0.9, 0.9);
        this.node.opacity = 150;
        if (sp != null) {
            this.curSpriteFrame = sp;
            this.mySprite.node.color = sp;
        }
        this.setActive(true);
    },

    //隐藏
    hideShader() {
        this.curSpriteFrame = null;
        this.isShowShader = false;
        this.setActive(false);
    },

    //固定在格子里
    showInGrid() {
        this.isPutIn = true;
        this.setActive(true);
        this.node.runAction(this.spawn);
        // this.node.opacity = 255;
        this.isShowShader = false;
        // cc.log("myPoint Put IN ",this.point);
    },

    die(sp, delay , isRevive) {
        this.scheduleOnce(function () {
            if(isRevive == null || !isRevive){
                this.deathColor = this.mySprite.node.color
                this.mySprite.node.color = sp;
            }else{
                this.mySprite.node.color = this.deathColor;
            }
            
        }, delay);
    },

    //消除砖块
    removeCube(delay = 0) {
        this.colorIdx = parseInt(this.mySprite.spriteFrame.name);
        this.scheduleOnce(function () {
            this.isPutIn = false;
            this.isShowShader = false;

            this.node.runAction(cc.sequence(
                cc.scaleTo(0.1, 0),
                cc.callFunc(function () {
                    this.setActive(false);
                }.bind(this))
            ));
            /* if(this.myAnim != null)
            {
                this.myAnim.play((this.colorIdx - 1)*10,10);
            } */
        }, delay);
    },

    getWorldPosition() {
        return this.node.convertToWorldSpaceAR(cc.p(0, 0));
    },

});
