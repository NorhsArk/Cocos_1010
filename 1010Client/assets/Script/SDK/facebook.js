var Utils = require("../UI/Utils/Utils");
var SDK_AD = require("./script/sdk_ad");
var GAME_CHECK_URL = "https://haiwai.31home.com:8003/games.detail";
var GAME_RECOMMEND_URL = "https://haiwai.31home.com:8003/games.recommend";
var GAME_STAT_URL = "https://haiwai.31home.com:8003/games.stat";

var ELoadState = {
    AD_LOADING          : "AD_LOADING",
    AD_LOAD_SUCCESS     : "AD_LOAD_SUCCESS",
    AD_LOAD_FAIL        : "AD_LOAD_FAIL",
    AD_COMPLETE         : "AD_COMPLETE"
};

var GM_PIDS = [1609486632505587, 1759127554126047];
var video_ad_ids = '833237073540250_833238400206784';
var interstitial_ad_ids = '833237073540250_833238150206809';
var game_id = "833237073540250";
var MyPlayer = {}

var interstitialCount = 2;
var videoOn = 1;
var interstitialOn = 1;
var interstitialOp = 0;

var FB_SDK = function() {
    this.cb = null;
    this.videoAd = null;
    this.videoAdState = null;
    this.InterstitialAd = null;
    this.InterstitialAdState = null;

    this.sdk_ad = null;
};

/**
 * 获得游戏ID
**/
FB_SDK.prototype.getGameId = function() {
    return game_id;
};

/**
 * 是否打开视频广告
**/
FB_SDK.prototype.openVideoAd = function() {
    return videoOn >= 1;
};

/**
 * 是否打开插屏广告
**/
FB_SDK.prototype.openinterstitialAd = function() {
    return interstitialOn >= 1;
};

/**
 * 每玩多少局播放一次插屏广告
**/
FB_SDK.prototype.getInterstitialCount = function() {
    // console.log("__interstitialCount",interstitialCount)
    return interstitialCount;
};

//是否显示互推广告（互相推荐自己的游戏）
FB_SDK.prototype.isPlayOpAD = function() {
    var test = cc.random0To1() * 10;
    if (test <= interstitialOp) {
        return true;
    }else{
        return false;
    }
};

/**
 * 根据后台配置，设置属性
**/
FB_SDK.prototype.setUp = function(video_on,interstitial_on,interstitial_count,interstitial_op) {
    // console.log("setUp__interstitialCount",interstitial_count)
    // console.log("interstitialCount",interstitialCount)
    interstitialCount = interstitial_count;
    videoOn = video_on;
    interstitialOn = interstitial_on;
    interstitialOp = interstitial_op;

    // console.log("__________________interstitialCount:",interstitialCount);
    if(interstitialOn >= 1 && interstitialOp >= 1){
        

        //获取
        var sdkADNode = cc.find("Canvas/sdk_ad");
        if(sdkADNode != null){
            this.sdk_ad = sdkADNode.getComponent(SDK_AD);
        }

        //加载互推广告
        this.reLoadOpAd();
    }
};

/**
 * 切换到别的游戏（互推游戏）
**/
FB_SDK.prototype.switchGameAsync = function(game_id) {
    if (typeof FBInstant === 'undefined') return false;
    FBInstant.switchGameAsync(game_id).catch(function (e) {
          // Handle game change failure
    });
};

/**
 * 重新加载互推广告
**/
FB_SDK.prototype.reLoadOpAd = function() {
    cc.log("reLoadOpAd:")
    if(this.sdk_ad != null && interstitialOn >= 1 && interstitialOp >= 1){
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200)) {
                var response = JSON.parse(xhr.responseText);
                // console.log("______________response",response);
                var code = response.code;
                if(code != 500){
                    // cb(true,response);

                    var data = response.data.rows[0];
                    if(data != null){
                        var pic3 = data.pic3;
                        var pic2 = data.pic2;
                        var pic1 = data.pic1;
                        var gid = data.game_id;
                        self.sdk_ad.setAd(pic3,pic2,pic1,gid);
                    }
                }
            }
        };

        xhr.open("GET", GAME_RECOMMEND_URL + "?game_id="+game_id +"&amount=1",true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(); 

        // console.log(GAME_RECOMMEND_URL + "?game_id="+game_id +"&amount=1")
    }
};

/**
    初始化
    1）执行初始化服务器配置
    2）加载视频广告、插屏广告
    3）设置语言
*/
FB_SDK.prototype.init = function() {

    this.initOP();
    if (typeof FBInstant === 'undefined') {
        const i18n = require('LanguageData');
        // i18n.init('zh');
        i18n.init('en');
        return;
    }
    // console.log("playerID",FBInstant.player.getID());

    this.loadVideoAd();
    this.loadInterstitialAd();

    MyPlayer.name = FBInstant.player.getName();
    cc.loader.load(FBInstant.player.getPhoto(), function (err, texture) {
        MyPlayer.head = new cc.SpriteFrame(texture);
    });
    MyPlayer.id = FBInstant.player.getID();

    var locale = FBInstant.getLocale(); // 'en_US'
    // if(locale == 'zh_CN'){
        const i18n = require('LanguageData');
        i18n.init('en');
    // }
};

/**
 * 初始化服务器对游戏的配置
**/
FB_SDK.prototype.initOP = function() {

    //从服务器加载初始化数据
        // cc.log("[gameCheck]" + GAME_CHECK_URL);
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200)) {
            var response = JSON.parse(xhr.responseText);
            // console.log("response",response);
            var code = response.code;
            if(code != 500){
                // cb(true,response);

                var data = response.data;

                var interstitial_op = data.interstitial_op;     //每10局显示几次互推
                var interstitial_count = data.interstitial_count;  //每多少局显示一次插屏广告
                var video_on = data.video_on;    //是否显示视频广告
                var interstitial_on = data.interstitial_on;   //是否显示插屏广告
                self.setUp(video_on,interstitial_on,interstitial_count,interstitial_op);
            }
        }
    };

    xhr.open("GET", GAME_CHECK_URL + "?game_id="+SDK().getGameId(),true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(); 
};

/**
 * 是否GM（调试用）
**/
FB_SDK.prototype.isGM = function() {
    if (typeof FBInstant === 'undefined') return false;

    var playerID = FBInstant.player.getID();
    // console.log("Utils.inArray(playerID,GM_PIDS):",Utils.inArray(playerID,GM_PIDS))
    return Utils.inArray(playerID,GM_PIDS);
};

/**
 * 清除当前玩家所有数据
**/
FB_SDK.prototype.clearData = function() {
    if (typeof FBInstant === 'undefined') return false;

    SDK().setScore({all:0},null);
    SDK().setScore({my_help:0},null);
    var bid = 1;
    for(var mid = 1;mid <=6;mid++){
        for(var lid = 1;lid <= 100;lid++){
            var param = {};
            param[bid+"_"+mid+"_"+lid] = 0;    
            this.setScore(param,null);

            var param1 = {};
            param1[bid+"_"+mid+"_"+lid+"_moves"] = 0;
            this.setScore(param1,null);
        }

        var param2 = {};
        param2[bid+"_"+mid] = 0;    
        this.setScore(param2,null);

        var param3 = {};
        param3["unlock_"+bid+"_"+mid] = 0;
        SDK().setScore(param3,null);
    }
};

/**
 * 获得用户的国家地区语言
**/
FB_SDK.prototype.getLocale = function() {
    if (typeof FBInstant === 'undefined') return;

    return FBInstant.getLocale();
};

//创建桌面快捷方式
FB_SDK.prototype.canCreateShortcutAsync = function(cb) {
    if (typeof FBInstant === 'undefined') return;

    FBInstant.canCreateShortcutAsync()
      .then(function(canCreateShortcut) {
        if (canCreateShortcut) {
          FBInstant.createShortcutAsync()
            .then(function() {
              // Shortcut created
                if(cb!=null){
                    cb(true);    
                }
            })
            .catch(function() {
              // Shortcut not created
                if(cb!=null){
                    cb(false);    
                }
            });
        }else{
            if(cb!=null){
                cb(false);    
            }
        }
    });
};

FB_SDK.prototype.getContextID = function() {
    return FBInstant.context.getID();
};
/**
 * 分享
**/
FB_SDK.prototype.share = function(score,cb) {
    if (typeof FBInstant === 'undefined'){
        if(cb!=null){
            cb(true);    
        }
        return;
    } 
    var self = this;

    FBInstant.context
    .chooseAsync()
    .then(function() {
            // console.log("FBInstant.context.getID():",FBInstant.context.getID());
            self.doShare(score);
            if(cb!=null){
                cb(true);    
            }
        }
    ).catch(function(e) {
        // console.log("catch",e);
        if(e.code != null && e.code == "SAME_CONTEXT"){
            //相同的用户或group，不能再次发消息
            if(cb!=null){
                cb(false);    
            }
        }
    });
};

FB_SDK.prototype.doShare = function(score) {
    var self = this;

    var en_text = "Hey，play with me!";
    // var en_text = self.getName() + " finish "+score+" missions,Can you beat me?";
    // var cn_text = self.getName() + "向你发起挑战！他已经到了 "+score+" 分！";

    // if(score <= 0){
    //     var en_text = "Your friend challenges you！";
    //     var cn_text = "你的好友向你发起挑战！";        
    // }
    // console.log("share:"+en_text);

    var framePath = "Texture2D/game_icon";
    // console.log("framePath:",framePath)
    cc.loader.loadRes(framePath, cc.Texture2D, function (err, texture) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 420;

        let image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0);

        var base64Picture = canvas.toDataURL('image/png');

        FBInstant.updateAsync({
          action: 'CUSTOM',
          cta: 'Play Game',
          template:'join_fight',
          image: base64Picture,
          text: en_text,
          data: { myReplayData: '...' },
          strategy: 'IMMEDIATE',
          notification: 'NO_PUSH',
        }).then(function() {
          //当消息发送后
          // console.log("____当消息发送后")
        });
    });
};

FB_SDK.prototype.canCreateShortcutAsync = function(cb){
    if (typeof FBInstant == 'undefined') return;

    FBInstant.canCreateShortcutAsync()
      .then(function(canCreateShortcut) {
        if (canCreateShortcut) {
          FBInstant.createShortcutAsync()
            .then(function() {
              // Shortcut created
                if(cb!=null){
                    cb(true);    
                }
            })
            .catch(function() {
              // Shortcut not created
                if(cb!=null){
                    cb(false);    
                }
            });
        }else{
            if(cb!=null){
                cb(false);    
            }
        }
    });
};

//3分钟内再次点击不分享。
FB_SDK.prototype.shareBestScore3Times = function(key) {
    // console.log("shareBestScore3TimesshareBestScore3TimesshareBestScore3Times")
    SDK().getItem("share_times",function(t){
        t = parseInt(t);
        //如果没有设置过倒计时，那么设置为3分钟
        var now = Math.floor(Date.now() / 1000);
        // console.log("t:",t)
        // console.log("t-now:",t-now)
        if(t == null || t <= 0 || t-now < 0){
            var param = {};
            param['share_times'] = now + 180;
            SDK().setItem(param,function(){
                SDK().shareBestScore(key);
            });
        }
    });
};



FB_SDK.prototype.shareBestScore = function(key,cb) {
    if(key == null || key == ""){
        key = "highScore";
    }
    this.getItem(key,function(score){
        SDK().share(score,function(isCompleted){
            if(cb){
                cb(isCompleted)
            }
        });
        
    }.bind(this));
};

/**
 * 加载插屏广告
**/
FB_SDK.prototype.loadInterstitialAd = function() {
    if (typeof FBInstant === 'undefined') return;
    if(!this.openinterstitialAd()){
        return;
    }

    // console.log("loadInterstitialAd")
    FBInstant.getInterstitialAdAsync(
        interstitial_ad_ids,
    ).then(function(interstitial) {
        // console.log("FBInstant.getInterstitialAdAsync:",interstitial);
        this.InterstitialAd = interstitial;
        this.InterstitialAdState = ELoadState.AD_LOADING;
        return this.InterstitialAd.loadAsync();
    }.bind(this)).catch(function(e) {
            // console.log("load.showInterstitialAd catch");
            // console.log(JSON.stringify(e));
        }.bind(this))
    .then(function(){
        // console.log("FBInstant.getInterstitialAdAsync done:");
        this.InterstitialAdState = ELoadState.AD_LOAD_SUCCESS;
    }.bind(this));
};

//统计显示、点击次数（统计自己的互推广告）
FB_SDK.prototype.stat = function(type,gid) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200)) {
            var response = JSON.parse(xhr.responseText);
            // console.log("______________response",response);
        }
    };

    xhr.open("GET", GAME_STAT_URL + "?game_id="+gid +"&type="+type,true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(); 
};

FB_SDK.prototype.onOpAdBtnClicked = function() {
    if((this.sdk_ad != null)){
        this.sdk_ad.onPlayBtnClicked();
    }
};


FB_SDK.prototype.getOpAdPic = function(picNum) {
    if(this.sdk_ad != null){
        if(picNum == 1){
            return this.sdk_ad.pic1;    
        }else if(picNum == 2){
            return this.sdk_ad.pic2;    
        }else if(picNum == 3){
            return this.sdk_ad.pic3;    
        }
        
    }else{
        return null;
    }
};

/**
 * 每玩多少局播放一次插屏广告
 * noOp == true时代表不播放互推广告
**/
FB_SDK.prototype.showInterstitialAd = function(cb,noOp) {
    if (typeof FBInstant === 'undefined'){
        if(cb) {
            cb(false);
        }
        return;
    };
    // console.log("FB_SDK.prototype.showInterstitialAd",this.InterstitialAd);
    // console.log("FB_SDK.prototype.showInterstitialAd",this.InterstitialAd);
    // console.log("interstitialOn",interstitialOn);

    if(interstitialOn < 1){
        return;
    }

    if((this.sdk_ad != null && interstitialOp >= 1 && Utils.GetRandomNum(1,10)<=interstitialOp && !noOp) || (this.InterstitialAd == null && this.sdk_ad != null && !noOp)){
    // if(this.sdk_ad != null){
        // console.log("sdk_ad:",this.sdk_ad)
        this.sdk_ad.show();

        this.stat(1,this.sdk_ad.game_id);
        if (cb) {
            cb(true);
        }

        // console.log("this.sdk_ad.show()");
    }else if(this.InterstitialAd != null){
        // console.log("show Interstitial ad start");
        this.InterstitialAd.showAsync().then(function() {
            // console.log("this.showInterstitialAd.showAsync");
            this.InterstitialAdState = ELoadState.AD_COMPLETE;
            // this.game.paused = false;
            // window.sounds.toggleMusic(false);
            if (cb) {
                cb(true);
            }

            // console.log("show showInterstitialAd success");
            this.loadInterstitialAd();
        }.bind(this))
        .catch(function(e) {
            // console.log("this.showInterstitialAd catch");
            this.InterstitialAdState = ELoadState.AD_COMPLETE;
            // this.game.paused = false;
            // window.sounds.toggleMusic(false);
            // console.log(JSON.stringify(e));
            if (cb) {
                cb(false);
            }
        }.bind(this));

        
    }else{
        // console.log("show showInterstitialAd ad Stop");
        if (cb) {
            cb(false);
        }
        this.loadInterstitialAd();
    }
};

/**
 * 加载视频广告
**/
FB_SDK.prototype.loadVideoAd = function() {
    if (typeof FBInstant === 'undefined') return;

    if(!this.openVideoAd()){
        return;
    }
    // console.log("FB_SDK.prototype.loadVideoAd");
    FBInstant.getRewardedVideoAsync(
        video_ad_ids,
    ).then(function(rewardedVideo) {
        this.videoAd = rewardedVideo;
        this.videoAdState = ELoadState.AD_LOADING;
        return this.videoAd.loadAsync();
    }.bind(this)).then(function(){
        this.videoAdState = ELoadState.AD_LOAD_SUCCESS;
    }.bind(this));
};

/**
 * 是否有视频广告可以播放
**/
FB_SDK.prototype.hasVideoAd = function() {
    if (typeof FBInstant === 'undefined'){
        return false;
    };

    return this.videoAd != null;
};

/**
 * 播放视频广告
**/
FB_SDK.prototype.showVideoAd = function(cb) {
    if (typeof FBInstant === 'undefined'){
        if(cb){
            cb(false);
        }
        return;
    };

    console.log("FB_SDK.prototype.showVideoAd",this.videoAd);

    if(this.videoAd != null){
        // console.log("show video ad start");
        this.videoAd.showAsync().then(function() {
            // console.log("this.videoAd.showAsync");
            this.videoAdState = ELoadState.AD_COMPLETE;
            // this.game.paused = false;
            // window.sounds.toggleMusic(false);
            if (cb) {
                cb(true);
            }

            // console.log("show video ad success");
            this.loadVideoAd();
        }.bind(this))
        .catch(function(e) {
            // console.log("this.videoAd catch");
            this.videoAdState = ELoadState.AD_COMPLETE;
            // this.game.paused = false;
            // window.sounds.toggleMusic(false);
            // console.log(JSON.stringify(e));
            if (cb) {
                cb(false);
            }
            this.loadVideoAd();
        }.bind(this));
    }else{
        // console.log("show video ad Stop");
        if (cb) {
            cb(false);
        }
        this.loadVideoAd();
    }
};

/**
 * 获得玩家昵称
**/
FB_SDK.prototype.getName = function() {
    if (typeof FBInstant === 'undefined') return "undefined";
    return FBInstant.player.getName();
};

/**
 * 获得用户属性（一般来说可以获得设置的分数，以及用户的其他属性）
**/
FB_SDK.prototype.getItem = function(key,cb) {
    if (typeof FBInstant === 'undefined') {
        var score = cc.sys.localStorage.getItem(key);
        if (typeof score === 'undefined' || score == null) {
            score = 0;
        }
        cb(score,key);
    }else{
        var score = 0;
        FBInstant.player
            .getDataAsync([''+key])
            .then(function(data) {
                //console.log('data is loaded',key,data[key]);
                if (typeof data[key] === 'undefined') {
                    score = 0;
                    //console.log(key+"+null")
                }else{
                    score = data[key];
                }
                cb(score,key);
        });    
    }
};

/**
 * 设置属性，如记录分数、记录各类和用户相关的属性
 * param要传递一个对象进来，如{score:100}
**/
FB_SDK.prototype.setItem = function(param,cb) {
    if (typeof FBInstant === 'undefined') {
        for(var p in param){//遍历json对象的每个key/value对,p为key
            //cc.log("setScore:"+ p + "_" + param[p]);
            cc.sys.localStorage.setItem(p, param[p]);
        }
        // 
        if(cb != null){
            cb();
        }
    }else{
        FBInstant.player
            .setDataAsync(param)
        .then(function() {
            if(cb != null){
                cb();
            }
            // console.log('------------data is set',param);
        });
    }
};

//榜单内容----------

//请好友玩
FB_SDK.prototype.playWith = function (id, score, cb) {
    if (typeof FBInstant === 'undefined') {
        if (cb != null) {
            cb(true);
        }
        return;
    }
    var self = this;
    FBInstant.context
        .createAsync(id)
        .then(function () {
            // console.log("FBInstant.context.getID():",FBInstant.context.getID());
            self.doShare(score);
            if(cb!=null){
                cb(true);
            }else{
                cb(false);
            }
        })
        .catch(function(e) {
            // console.log("catch",e);
            if(e.code != null && e.code == "SAME_CONTEXT"){
                //相同的用户或group，不能再次发消息
                if(cb!=null){
                    cb(false);    
                }
            }
        });
};


//获取好友的信息
FB_SDK.prototype.getFriendsInfo = function (cb) {
    if (typeof FBInstant === 'undefined') {
        // console.log("set rank fail");
        if (cb != null) {
            cb({});
        }
    } else {
        var playerList = [];
        FBInstant.player.getConnectedPlayersAsync()
            .then(function (players) {
                for (var i = 0; i < players.length; i=i+1) {
                    playerList[i] = {};
                    playerList[i].id = players[i].getID();
                    playerList[i].name = players[i].getName();
                    playerList[i].headUrl = players[i].getPhoto();
                }
                if (cb != null) {
                    cb(playerList);
                }
            });
    }

}


//获取自身信息
FB_SDK.prototype.getSelfInfo = function (cb) {
    if (typeof FBInstant === 'undefined') {
        // console.log("set rank fail");
        if (cb !== null) {
            cb({});
        }
    } else {
        if (cb != null) {
            cb(MyPlayer);
        }
        return MyPlayer;
    }
}


//保存分数
FB_SDK.prototype.setRankScore = function (type, score, extra, cb) {
    if (typeof FBInstant === 'undefined') {
        // console.log("set rank fail");
    } else {
        var rankName;
        var contextID = FBInstant.context.getID();
        if (contextID != null) {
            contextID = "." + contextID;
        }
        if (type == 1) {
            rankName = "Friends";
            if (contextID == null) {
                // console.log(FBInstant.context.getType());
                contextID = "";
                return;
            }
        } else if (type == 2) {
            rankName = "World";
            contextID = "";
        } else {
            if (null != cb) {
                cb("wrong type")
            }
            // console.log("wrong type");
            return;
        }
        FBInstant
            .getLeaderboardAsync(rankName + contextID)
            .then(leaderboard => {
                // console.log(leaderboard.getName());
                return leaderboard.setScoreAsync(score, extra);
            })
            .then(() => console.log('Score saved'))
            .catch(error => console.error("setRankScoresetRankScoresetRankScore",error));

    }
};

//获取自身的排行榜
FB_SDK.prototype.getRankScore = function (type, cb) {
    if (typeof FBInstant === 'undefined') {
        // console.log("get self rank fail");
    } else {
        var rankName;
        var contextID = FBInstant.context.getID();
        if (contextID != null) {
            contextID = "." + contextID;
        }
        if (type == 1) {
            rankName = "Friends";
            if (contextID == null) {
                // console.log(FBInstant.context.getType());
                contextID = "";
                return;
            }
        } else if (type == 2) {
            rankName = "World";
            contextID = "";
        } else {
            if (null != cb) {
                cb("wrong type")
            }
            // console.log("wrong type");
            return;
        }
        FBInstant
            .getLeaderboardAsync(rankName + contextID)
            .then(leaderboard => leaderboard.getPlayerEntryAsync())
            .then(entry => {
                var info = {};
                info.id = entry.getPlayer().getID();
                info.no = entry.getRank();
                info.name = entry.getPlayer().getName();
                info.score = entry.getScore();
                info.headUrl = entry.getPlayer().getPhoto();
                cb(info);
            }).catch(error => console.error(error));
    }
};

//获取榜单百分比
FB_SDK.prototype.getPercent = function (cb) {
    if (typeof FBInstant === 'undefined') {
        console.log("get rank fail");
        if (cb != null) {
            cb(0);
        }
    } else {
        FBInstant.getLeaderboardAsync('World')
            .then(function (leaderboard) {
                return leaderboard.getEntryCountAsync();
            })
            .then(function (count) {
                if (cb != null) {
                    cb(count);
                }
            });
    }
}

//获取榜单
FB_SDK.prototype.getRank = function (type, num, offset, cb) {
    if (typeof FBInstant === 'undefined') {
        // console.log("get rank fail");
    } else {
        var rankName;
        var contextID = FBInstant.context.getID();
        if (contextID != null) {
            contextID = "." + contextID;
        }
        if (type == 1) {
            rankName = "Friends";
            if (contextID == null) {
                // console.log(FBInstant.context.getType());
                contextID = "";
                if (cb != null) {
                    cb([]);
                }
                return;
            }
        } else if (type == 2) {
            rankName = "World";
            contextID = "";
        } else {
            if (null != cb) {
                cb("wrong type")
            }
            // console.log("wrong type");
            return;
        }
        // console.log("rankName + contextID",rankName + contextID)
        var playerList = [];
        FBInstant
            .getLeaderboardAsync(rankName + contextID)
            .then(leaderboard => leaderboard.getEntriesAsync(num, offset))//第一个是获取数量，第二个是起始点
            .then(entries => {
                // console.log("entries",entries)
                for (var i = 0; i < entries.length; i++) {
                    playerList[i] = {};
                    playerList[i].id = entries[i].getPlayer().getID();
                    playerList[i].no = entries[i].getRank();
                    playerList[i].name = entries[i].getPlayer().getName();
                    playerList[i].score = entries[i].getScore();
                    playerList[i].headUrl = entries[i].getPlayer().getPhoto();
                    /* console.log(
                        entries[i].getRank() + '. ' +
                        entries[i].getPlayer().getName() + ': ' +
                        entries[i].getScore()+ 'url ' +
                        entries[i].getPlayer().getPhoto()
                    ); */
                }
                if (cb != null) {
                    cb(playerList);
                }
            }).catch(error => console.error(error));
    }
};

FB_SDK.prototype.postRankToMessage = function (type, cb) {
    if (typeof FBInstant === 'undefined') {
        // console.log("post rank fail");
    } else {
        var rankName;
        var contextID = FBInstant.context.getID();
        if (contextID != null) {
            contextID = "." + contextID;
        }
        if (type == 1) {
            rankName = "Friends";
            if (contextID == null) {
                // console.log(FBInstant.context.getType());
                contextID = "";
                return;
            }
        } else if (type == 2) {
            rankName = "World";
            contextID = "";
        } else {
            if (null != cb) {
                cb("wrong type")
            }
            // console.log("wrong type");
            return;
        }
        FBInstant.updateAsync({
            action: 'LEADERBOARD',
            name: rankName + contextID
        })
            .then(() => console.log('Update Posted'))
            .catch(error => console.error(error));
    }
}


module.exports = (function() {
    var instance;
    return function() {
        if (!instance) {
            instance = new FB_SDK();
        }
        return instance;
    }
})();


