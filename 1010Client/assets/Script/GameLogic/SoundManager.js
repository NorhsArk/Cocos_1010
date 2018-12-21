// SoundManager.getInstance = (function() {
//     var instance;
//     return function(){
//         if (!instance) {
//             instance = new SoundManager();
//         }
//     }
// })();

// module.exports = (function() {
//     var instance;
//     return function() {
//         if (!instance) {
//             instance = new SoundManager();
//         }
//         return instance;
//     }
// })();


cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        button: {
            url: cc.AudioClip,
            default: null
        },
        begin: {
            url: cc.AudioClip,
            default: null
        },
        gameover: {
            url: cc.AudioClip,
            default: null
        },
        remove: {
            url: cc.AudioClip,
            default: null
        },
        putin: {
            url: cc.AudioClip,
            default: null
        },
        clickcube: {
            url: cc.AudioClip,
            default: null
        },
        score: {
            url: cc.AudioClip,
            default: null
        },
        rank: {
            url: cc.AudioClip,
            default: null
        },
        getCoin: {
            url: cc.AudioClip,
            default: null
        },
        getReward: {
            url: cc.AudioClip,
            default: null
        },
        moveFail: {
            url: cc.AudioClip,
            default: null
        },
        moveSuccess: {
            url: cc.AudioClip,
            default: null
        },
        newBatch: {
            url: cc.AudioClip,
            default: null
        },
        newRecord: {
            url: cc.AudioClip,
            default: null
        },
        clear1: {
            url: cc.AudioClip,
            default: null
        },
        clear2: {
            url: cc.AudioClip,
            default: null
        },
        clear4: {
            url: cc.AudioClip,
            default: null
        },
        clear5: {
            url: cc.AudioClip,
            default: null
        },
        isOpen: true,
        isVoiceOpen: true,
        otherVolume: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    playSound: function (soundtype) {
        if (this.otherVolume <= 0) {
            return;
        }

        if (this.isOpen) {
            switch (soundtype) {
                case "button":
                    cc.audioEngine.play(this.button, false, this.otherVolume);
                    break;
                case "begin":
                    cc.audioEngine.play(this.begin, false, this.otherVolume);
                    break;
                case "gameover":
                    cc.audioEngine.play(this.gameover, false, this.otherVolume);
                    break;
                case "remove":
                    cc.audioEngine.play(this.remove, false, this.otherVolume);
                    break;
                case "putin":
                    cc.audioEngine.play(this.putin, false, this.otherVolume);
                    break;
                case "score":
                    cc.audioEngine.play(this.score, false, this.otherVolume);
                    break;
                case "clickcube":
                    cc.audioEngine.play(this.clickcube, false, this.otherVolume);
                    break;
                case "rank":
                    cc.audioEngine.play(this.rank, false, this.otherVolume);
                    break;
                case "getCoin":
                    cc.audioEngine.play(this.getCoin, false, this.otherVolume);
                    break;
                case "getReward":
                    cc.audioEngine.play(this.getReward, false, this.otherVolume);
                    break;
                case "moveFail":
                    cc.audioEngine.play(this.moveFail, false, this.otherVolume);
                    break;
                case "moveSuccess":
                    cc.audioEngine.play(this.moveSuccess, false, this.otherVolume);
                    break;
                case "newBatch":
                    cc.audioEngine.play(this.newBatch, false, this.otherVolume);
                    break;
                case "newRecord":
                    cc.audioEngine.play(this.newRecord, false, this.otherVolume);
                    break;
                case "clear1":
                    cc.audioEngine.play(this.clear1, false, this.otherVolume);
                    break;
                case "clear2":
                    cc.audioEngine.play(this.clear2, false, this.otherVolume);
                    break;
                case "clear4":
                    cc.audioEngine.play(this.clear4, false, this.otherVolume);
                    break;
                case "clear5":
                    cc.audioEngine.play(this.clear5, false, this.otherVolume);
                    break;
            }
        }
    },

    playBg: function () {
        if (this.isOpen) {
            this.audioSource.play();
        }
    },

    setBgVoiceVolume(value) {
        if (this.audioSource) {
            this.audioSource.volume = value;
        }
    },

    setOtherVoiceVolume(value) {
        this.otherVolume = value;
    },

    setVoiceIsOpen: function (isOpen) {
        this.isVoiceOpen = isOpen;

    },

    setIsOpen: function (isOpen) {
        this.isOpen = isOpen;
        if (this.isOpen) {
            this.playBg();

        } else {
            this.audioSource.pause();
        }
    },
});
