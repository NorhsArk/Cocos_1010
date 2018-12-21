const utils    = {};
var gameApp = null;
var gameController = null;
var gameView = null;
var soundManager = null;

utils.generateUUID = function() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
    	return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
}

utils.containsKey = function(target,key) {
    if (typeof target !== "object" || typeof key !== "string") return false;
    return Object.keys(target).some(k=>(k===key) || utils.containsKey(target[k],key));
}

utils.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};

utils.unique = function(arr){
    var res = [];
    var json = {};
    for(var i = 0; i < arr.length; i++){
        if(!json[arr[i]]){
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
}

utils.scaleBgSize = function(nodes) {
    var winSize = cc.director.getWinSize();
    var t = winSize.height/640;
    nodes.forEach(function(node){
        if(node != null){
          node.setContentSize(cc.size(1136*t,640*t));  
        }
    });
};

utils.destroy = function(){
    gameApp         = null;
    gameView        = null;
    gameController  = null;
};

//保存数据到本地
utils.saveStringToLocal = function(key,text){
    cc.sys.localStorage.setItem(key, text);
};

//从本地获取数据
utils.getStringFromLocal = function(key){
    return cc.sys.localStorage.getItem(key);
};

//把本地数据移除
utils.removeStringFromLocal = function(key){
    cc.sys.localStorage.removeItem(key);
};

//数组乱序
utils.getRandomArray = function(arr){
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) 
    {
        var randomIndex = Math.floor(Math.random() * arr.length);
        result[i] = arr[randomIndex];
        arr.splice(randomIndex, 1);
    }

    return result;
};

//获取随机数
utils.GetRandomNum = function(minNum, maxNum) {

    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
};

//保留小数点后n位
utils.RoundFunc = function(value,n)
{
    return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
}

module.exports = utils;
