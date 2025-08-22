const { app } = require("pomelo");
const _ = require("underscore");

// 用户断线触发
async function handleUserLogout(session) {

        try {
        if (!session || !session.uid) return;

        // 判断玩家是否在redis中存在
        let user = await app.RedisClient.get_all_hash(session.uid);
        if (user) {
            await app.RedisClient.set_expire_hash(session.uid, app.Configs.LoginTimeOut);
            // 下线前先把数据存db，不等待
            let ret_db = await app.UserDB.updateOrCreateUser({ user_id: user.user_id }, user);
            if (ret_db) {
                console.warn(`########## User_Logout: [${user.user_id}] is Leave Game! ##########`);
            }
        } else {
            console.error("redis 数据存在却无法拿到数据 代码错误 ！！！", session.uid);
        }
    } catch (error) {
        console.error('Error closed:', error.message);
    }
};

// 处理用户登录的核心逻辑
async function handleUserLogin(loginUid, msg) {
    try {
        let loginJsonData = {};

        // 检查 redis 中是否有用户数据
        let is_redis_exist = await app.RedisClient.exists_table_hash(loginUid);
        if (is_redis_exist === 1) {
            let redis_user = await app.RedisClient.get_all_hash(loginUid);
            if (redis_user) {
                await app.RedisClient.del_expire_hash(loginUid);
                loginJsonData = await app.UserDB.ReloadUser(redis_user, 2);
            } else {
                throw new Error(`Redis 用户数据加载失败`);
            }
        } else {
            // 如果 Redis 中没有数据，尝试从 DB 中加载
            let db_user = await app.UserDB.findUserByUserId({ user_id: loginUid });
            if (db_user) {
                loginJsonData = await app.UserDB.ReloadUser(db_user, 3);
            } else {
                // 用户不存在，初始化用户
                loginJsonData = await app.RedisClient.InitPlayer(msg);
            }
        }

        return loginJsonData;
    } catch (error) {
        console.error("Login error:", error.message);
        return null;
    }
}


async function handleUserDataAfterRedisUpdate(loginJsonData) {
    if (loginJsonData.type === 1) { // 创建新用户
        console.debug(`USER_LOGIN [${loginJsonData.user.user_id}] ｜ type: Create...`);
        let mongo_save_finish = await app.UserDB.updateOrCreateUser({ user_id: loginJsonData.user.user_id }, loginJsonData.user);
        if (mongo_save_finish) {
            loginJsonData.loginFlag++;
        }
        let ret = await app.RedisClient.getHashByKey("dnu_user_login_count", "dnu_login_list");
        if (ret) {
            let dnu_login_list = JSON.parse(ret);
            if (!dnu_login_list.includes(loginJsonData.user.user_id)) {
                dnu_login_list.push(loginJsonData.user.user_id);
                await app.RedisClient.setHashByKey("dnu_user_login_count", "dnu_login_list", JSON.stringify(dnu_login_list));
            }
        }
    } else if (loginJsonData.type === 2) { // redis 登录
        console.debug(`USER_LOGIN [${loginJsonData.user.user_id}] ｜ type: Redis...`);
        loginJsonData.user = await app.RedisClient.checkRedisInit(loginJsonData.user);
        let mongo_save_finish = await app.UserDB.updateOrCreateUser({ user_id: loginJsonData.user.user_id }, loginJsonData.user);
        if (mongo_save_finish) {
            console.debug(`同时更新mongodb ！！！`);
        }
    } else if (loginJsonData.type === 3) { // mongo 登录
        console.debug(`USER_LOGIN [${loginJsonData.user.user_id}] type: Mongo...`);
        loginJsonData.user = await app.RedisClient.checkRedisInit(loginJsonData.user);
    }

    if (loginJsonData.type === 1 && loginJsonData.loginFlag !== 2) {
        throw new Error("MongoDB 无法插入账号数据，请联系管理员！");
    }

    // 返回更新后的 loginJsonData
    return loginJsonData;
}




module.exports = {
    handleUserLogout,
    handleUserLogin,
    handleUserDataAfterRedisUpdate,
};