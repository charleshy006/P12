const {app} = require("pomelo");
const _ = require("underscore");
module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;
// 函数 : @@@ 充值 @@@
// 参数 : rc_diamond, 充值
// 返回 : (Player_List)
handler.Recharge = async function(msg, session, next) {
    
}