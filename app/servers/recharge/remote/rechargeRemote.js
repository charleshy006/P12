const {app} = require("pomelo");
const _ = require("underscore");
module.exports = function(app) {
    return new rechargeRemoter(app);
};

let rechargeRemoter = function(app) {
    this.app = app;
};

let remoter = rechargeRemoter.prototype;

// 
remoter.GM_Recharge = async function( msg, cb) {

}