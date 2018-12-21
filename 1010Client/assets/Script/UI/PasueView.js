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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        musicOff:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable(){
        if(window.gameApplication.myVolume == 1){
            this.musicOff.active = false;
        }else{
            this.musicOff.active = true;
        }
    },


    start() {

    },
    menuClick(event, type) {
        window.gameApplication.playMusic("button");
        //回到首页
        if ("Home" == type) {
            window.gameApplication.changeToMainView()
        }
        //重玩
        else if ("Replay" == type) {
            window.gameApplication.changeToGameView();
        }
        //继续
        else if ("Continue" == type) {
            window.gameApplication.showPasueView(false);
        } 
        //音乐开关
        else if ("Music" == type) {
            if(window.gameApplication.myVolume == 1){
                window.gameApplication.setVolumn(0);
                this.musicOff.active = true;
            }else{
                window.gameApplication.setVolumn(1);
                this.musicOff.active = false;
            }
        }else if(type == "20"){
            window.gameApplication.shareBtnClicked(event,type);
            window.gameApplication.changeToGameView();
        }
    },
    // update (dt) {},
});
