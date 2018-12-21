'use strict';

const serverName = "dev"

const expMap = {
    'dev'  			: require('./Const_Dev'),
};

module.exports = expMap[serverName];
