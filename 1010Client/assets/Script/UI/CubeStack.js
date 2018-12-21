var defines = require("../Const/Defines");
var Cube = require("./Cube");

cc.Class({
    extends: cc.Component,

    properties: {
        cubes: {
            default: [],
            type: [cc.Sprite],
            visible: false
        },
        boxCollider: {
            get: function () {
                return this.getComponent(cc.BoxCollider);
            },
            type: cc.BoxCollider,
        },
        worldSpaceAR: {
            get: function () {
                return this.node.convertToWorldSpaceAR(cc.p(0, 0));
            }
        },
        myCubeData: {
            default: null,
            visible: false,
        },
        id: {
            default: 0,
            visible: false,
        },
        color: {
            default: null,
            visible: false,
        },
        data: {
            default: null,
            visible: false,
        },
        height: {
            default: 0,
            visible: false,
        },
        halfWidth: {
            default: 0,
            visible: false
        },
        halfHeight: {
            default: 0,
            visible: false
        },
        myRow: {
            default: 0,
            visible: false
        },
        myColumn: {
            default: 0,
            visible: false
        },
        isActive: {
            default: true,
            visible: false,
        },
        pType: {
            default: 0,
            visible: false
        },
        isAlive: {
            default: true,
            visible: true,
        },
        graySp: {
            default: null,
            type: cc.SpriteFrame,
            visible: false
        },
        offset: 0,
        maxNum: 5,
        isBig: false,
        idx: 0,
    },

    onLoad() {
        for (var i = 0; i < 9; i++) {
            this.cubes[i] = this.node.getChildByName(i.toString()).getComponent(Cube);
        }
        this.height = this.isBig ? defines.spriteWidth : 40;
        
        if (this.boxCollider != null) {
            this.halfWidth = 110;
            this.halfHeight = 110;
        }
    },



    init(id, color, gray) {
        this.hideAll();
        // cc.log("init id = ",id,"-->",this.node.name);

        this.id = id;
        this.color = color;
        this.isAlive = true;
        this.data = defines.cubeType[id];
        this.myCubeData = this.data['array'];
        this.pType = this.data['type'];
        this.myRow = this.myCubeData.length;
        this.myColumn = 0;
        this.offset = this.data['offset'] == null ? 0 : this.data['offset'];
        this.graySp = gray;

        this.setBodyColor(this.color);

        // cc.log("-----------------------------------------init myCube = ",this.myCubeData);
    },

    setBodyColor(color) {
        this.node.scale = 0.8;
        this.color = color;
        this.idx = 0;
        var offsetX = (this.myRow - 1) * 0.5;
        var len = 0;
        for (var i = 0; i < this.myRow; i++) {
            len = this.myCubeData[i].length;
            if (len > this.myColumn) {
                this.myColumn = len;
            }

            var offsetY = (len - 1) * 0.5;
            for (var j = 0; j < len; j++) {
                var x = (j - offsetY) * this.height;
                var y = -(i - offsetX) * this.height;
                this.cubes[this.idx].node.setPosition(x, y);
                if (this.myCubeData[i][j] == 1) {
                    this.cubes[this.idx].node.active = true;
                    this.cubes[this.idx].setSprite(color);
                }
                ++this.idx;
            }
        }
    },

    setDeath() {
        //cc.log("setDeath = ", this.isAlive);
        this.isAlive = false;
    },

    setPosition(pos) {
        this.node.setPosition(cc.v2(pos.x, pos.y + 50 + defines.moveOffsetY * this.myRow));
    },

    touchAction(pos, isBack, nodeScripts, idx) {
        this.setActive(true);
        this.node.stopAllActions();
        if (!isBack) {
            this.node.setPosition(cc.v2(pos.x, pos.y));
        }
        if (isBack) {
            this.node.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.moveTo(0.05, cc.v2(pos.x, pos.y + 20)),
                        cc.scaleTo(0.05, 0.45),
                    ),
                    cc.callFunc(function () {
                        this.setActive(false);
                        for (var i = 0; i < 3; i = i + 1) {
                            if (nodeScripts[i].isAlive) {
                                nodeScripts[i].setActive(true);
                            }
                        }
                    }.bind(this), this)
                )
            );
        } else {
            this.node.runAction(
                cc.spawn(
                    cc.moveTo(0.05, cc.v2(pos.x, pos.y + 50 + defines.moveOffsetY * this.myRow)),
                    cc.scaleTo(0.05, 1),
                    cc.callFunc(function () {
                        for (var i = 0; i < 3; i = i + 1) {
                            if (nodeScripts[i].isAlive && i != idx) {
                                nodeScripts[i].setActive(true);
                            }else{
                                nodeScripts[i].setActive(false);
                            }
                        }
                    }.bind(this), this),
                )
            );

        }
    },

    getFirstPos() {
        return this.cubes[0].getWorldPosition();
    },

    getAllPos() {
        var arr = new Array();
        for (var i = 0; i <= this.idx; i++) {
            arr[i] = this.cubes[i].getWorldPosition();
        }

        return arr;
    },

    setActive(isactive) {
        this.isActive = isactive;
        this.node.active = isactive;
    },

    hideAll() {
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].node.active = false;
        }
    },

    changeAlpha(alpha) {
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setSprite(alpha == 1 ? this.color : this.graySp);
            // this.cubes[i].node.opacity = alpha == 1 ? 255 : 180;
        }
    },

    pointInCollider(pos) {
        if (pos.x >= (this.worldSpaceAR.x - this.halfWidth) && pos.x <= (this.worldSpaceAR.x + this.halfWidth) &&
            pos.y >= (this.worldSpaceAR.y - this.halfHeight) && (pos.y <= this.worldSpaceAR.y + this.halfHeight)) {
            return true;
        }
        return false;
    },

});
