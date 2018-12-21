
cc.Class({
    extends: cc.Component,

    properties: {
        loop:true,
        isplay:true,
        sprite:{
            default:null,
            type:cc.Sprite,
        },
        sprites:{
            default:[],
            type:[cc.SpriteFrame],
        },
        atlas:{
            default:null,
            type:cc.SpriteAtlas,
        },
        fps: {
            default: 5,
            type : cc.Integer,
        },
        index: {
            default: 0,
            type : cc.Integer,
            visible:false,
        },
        delta: {
            default: 0,
            type : cc.Integer,
            visible:false,
        },
        spriteLength:{
            default:0,
            type : cc.Integer,
            visible:false
        },

        finish:{
            default:null,
        },
    },

    play(idx = 0,length = 0,cb = null)
    {
        if(this.atlas)
        {
            this.sprites = this.atlas.getSpriteFrames();
        }

        if(cb != null)
        {
            this.finish = cb;
        }
        this.index = idx;
        this.delta = 0;
        this.spriteLength = length == 0 ? this.sprites.length : length + idx;
        this.sprite.spriteFrame = this.sprites[this.index];
        this.sprite.node.active = true;
        this.isplay = true;
    },

    stop()
    {
        this.isplay = false;
        this.index = 0;
        this.delta = 0;
        this.sprite.node.active = false;
    },

    update (dt) {
        if(this.isplay){
            this.delta += dt;
            if(this.fps > 0 && this.spriteLength > 0){
                var rate = 1/this.fps;
                if(rate < this.delta){
                    this.delta = rate > 0 ? this.delta - rate : 0;
                    this.sprite.spriteFrame = this.sprites[this.index];
                    this.index = this.index+1 >= this.spriteLength ? 0 : this.index+1;
                    
                    if(this.index <= 0 && this.loop == false)
                    {
                        this.isplay = false;
                        this.sprite.node.active = false;
                        if(this.finish)
                        {
                            this.finish();
                        }
                    }
                }
            }
        }
    },
});
