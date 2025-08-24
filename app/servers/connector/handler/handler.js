const { app } = require("pomelo");
const { handleUserLogout, handleUserLogin, handleUserDataAfterRedisUpdate } = require('../Login/Login');
var CryptoJS = require("crypto-js");
let { Cell } = require("@ton/core");
const {Web3} = require('web3');



module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;

// 函数 : @@@ 游戏登陆 @@@
handler.Login_Game = async function(msg, session, next) {
    try {
        if (!msg.user_id ) {
            return app.NetWork.retClient(next, {}, app.NetWork.Code.Server, `${session.route}, Parameter Error!`);
        }
        
        let type = 1;
        if (msg.type !== undefined) {
            type = msg.type;
        }
        
        let loginUid = msg.user_id.toString();

        if (type === 1) {
            const web3 = new Web3();
            if (!web3.utils.isAddress(loginUid)) {
                return app.NetWork.retClient(next, {}, app.NetWork.Code.Server, `${session.route}, Web3 Address is error !`);
            }
        }

        let sessionService = app.get('sessionService');

        // 断线重连判断
        if (sessionService.getByUid(loginUid)) {
            // app.NetWork.retClient(next, {}, app.NetWork.Code.Server, `该账号有人使用！`);

            sessionService.kick(loginUid, 'Reason for kicking new user connect.', () => {
                // session.unbind(loginUid, () => {
                //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server, `被顶号！！！`);
                // });
            });
            // return;
        }




        let loginJsonData = await handleUserLogin(loginUid, msg);

        if (!loginJsonData) {
            return app.NetWork.retClient(next, {}, app.NetWork.Code.Server, `登录处理失败！`);
        }



        //bind
        session.bind(loginUid);
        session.set('rid', loginUid);
        session.set('sid', session.sid);
        session.push('rid', (err) => {
            if (err) {
                console.error('set rid for session service failed! error is : %j', err.stack);
            }
        });
        session.on('closed', handleUserLogout);

        // 把用户添加到channel 里面
        let pushChannel = app.get('channelService').getChannel(app.Configs.AllChannelName, true);
        pushChannel.add(loginUid, app.getServerId());

        // 无论哪种登陆都需要走redis缓存的更新
        let redis_reload_finish = await app.RedisClient.load_all_hash(loginJsonData.user);

        if (redis_reload_finish) {

            // 检查用户是否在 dau_login_list 中

            let ret = await app.RedisClient.getHashByKey("dau_user_login_count", "dau_login_list");
            if (ret) {
                let dau_login_list = JSON.parse(ret);
                if (!dau_login_list.includes(loginUid)) {
                    dau_login_list.push(loginUid);
                    await app.RedisClient.setHashByKey("dau_user_login_count", "dau_login_list", JSON.stringify(dau_login_list));
                }
            }


            loginJsonData = await handleUserDataAfterRedisUpdate(loginJsonData);

            // 返回客户端数据
            let retDatas = {
                userData: loginJsonData.user,
                extraData: {} // 额外数据可以根据需求填充
            };
            app.NetWork.retClient(next, retDatas);
        } else {
            return app.NetWork.retClient(next, {}, app.NetWork.Code.Server, `redis 无法插入 账号有问题，请联系管理员！`);
        }
    } catch (error) {
        console.error("Login error:", error.message);
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server, `登录过程中发生错误：${error.message}`);
    }
};