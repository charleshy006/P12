let {app} = require("pomelo");

exports.Code = {
    Success:200,
    Redis:300,
    Server:400,
    Handler:500,
}

//返回客户端
exports.retClient = function(next, data, code, msg){
    data.code = code || app.NetWork.Code.Success;
    data.msg = msg || "Success"
    next(null, data);
}

exports.OnMessage_PvP_Battle = {



    //new 
    Diamond_Recharge_Success:"Diamond_Recharge_Success",

}