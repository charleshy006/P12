const redis = require('redis');
let app = require('pomelo').app;
const _ = require("underscore");
const mongoose = require("./mongodb");

let redisClient = null;
let redisSubscriber = null;

async function connectToRedis() {
    redisClient = redis.createClient(app.Configs.RedisOptions);

    // 监听连接错误
    redisClient.on('error', (err) => {
        console.error('[Redis] Redis Error:', err);
    });

    // 连接成功后打印信息
    redisClient.on('connect', () => {
        console.info(`[Redis] Connected to ${app.Configs.RedisOptions.socket.host}:${app.Configs.RedisOptions.socket.port}/Redis_DB:[${app.Configs.Redis_DB}].`);
    });

    try {
        // 等待连接成功
        await redisClient.connect();

        // 选择数据库
        await redisClient.select(app.Configs.Redis_DB);
        console.log(`[Redis] Selected DB: ${app.Configs.Redis_DB}`);

    } catch (err) {
        console.error('[Redis] Redis连接或选择数据库时出错:', err);
    }

    return redisClient;
}

async function connectToRedisSubscriber() {
    redisSubscriber = redis.createClient(app.Configs.RedisOptions);

    // 监听连接错误
    redisSubscriber.on('error', (err) => {
        console.error('[redisSubscriber] Redis Error:', err);
    });

    // 连接成功后打印信息
    redisSubscriber.on('connect', () => {
        console.info(`[redisSubscriber] Connected to ${app.Configs.RedisOptions.socket.host}:${app.Configs.RedisOptions.socket.port}/Redis_DB:[${app.Configs.Redis_DB}].`);
    });

    try {
        // 等待连接成功
        await redisSubscriber.connect();

        // 选择数据库
        await redisSubscriber.select(app.Configs.Redis_DB);
        console.log(`[redisSubscriber] Selected DB: ${app.Configs.Redis_DB}`);

    } catch (err) {
        console.error('[redisSubscriber] Redis连接或选择数据库时出错:', err);
    }

    return redisSubscriber;
}

async function run() {
    try {
        redisClient = await connectToRedis();
        redisSubscriber = await connectToRedisSubscriber();

        // 确保 redis 和 redisSubscriber 都连接成功后再导出
        exports.redis = redisClient;
        exports.redisSubscriber = redisSubscriber;

        console.log('Redis client and subscriber are both connected and exported.');
    } catch (err) {
        console.error('Error during Redis connection:', err);
    }
}

run();



const initUser = {//16
    user_id : app.Configs.RedisFather.user_id,//唯一，且必须为string类型
    invite_id: "",
    is_sign:false,
    isNFTVip:false,
    isInviteStatus:false,
    
    current_time: app.UserDB.ToUTCData(Date.now()),
    last_login_time: app.UserDB.ToUTCData(Date.now()),
    last_hand_up_time: app.UserDB.ToUTCData(Date.now()),
    last_power_time: app.UserDB.ToUTCData(Date.now()),
    invite_number:0,
    day: 1,    //签到第几天
    
    
    game_score_lishi:0,  //历史最高得分
    game_gold:0,  //游戏金币
    game_medal:0,  //游戏奖章 用于购买宠物
    level:1,  //玩家打到了多少关
    skill_1:3,  //技能1数量 ..普通导弹
    skill_2:4,  //技能2数量 ..寒冰导弹
    hedan:3,  //核弹
    shield: 1,		//防护力
    power:1,  //攻击力
    pet:'',// 使用的僚机 ""为无 "pet_1"为有 1,2,3,4,5
    planeName:app.Configs.config_planeName,
    petName:app.Configs.config_petName,
    
    config_PlaneInfo:app.Configs.config_PlaneInfo,
    config_WeaponInfo:app.Configs.config_WeaponInfo,
    config_PetInfo:app.Configs.config_PetInfo,
    plane:app.Configs.config_Plane,
};

// const initRoom = {//16
//     room_id : "",//唯一，且必须为string类型
//    
// };

exports.InitCMPPlayer = async function() {
    //先删除再创建
    let ret = await app.RedisClient.del_table_hash(initUser.user_id);
    if (ret) {
        let redis_reload_finish = await app.RedisClient.load_all_hash(initUser);

        if (redis_reload_finish) {
            console.info("InitCMPPlayer init finish !")
        }
    }
}
// 初始化玩家信息
exports.InitPlayer = async function(msg){
    if (msg.user_id == null) {
        return null;
    }
    let user = initUser;
    // 用户模板
    user.user_id=msg.user_id;//唯一，且必须为string类型
    user.invite_id=msg.invite_id;//唯一，且必须为string类型


    let type = 1;
    let loginFlag = 1;
    if (user.invite_id !== "") {//创建逻辑，需要判断邀请码，如果有邀请码  
        let ret = await CreateOrUpdateInvite(user.user_id, user.invite_id);
    }
    return {user, type, loginFlag};
};

// 改变状态
exports.changeInviteStatus = async function(be_user_id, invitat) {
    //先找这个邀请人的大佬在不在
    let user = await app.UserDB.findUserByUserId({user_id :invitat});
    if (user == null) {
        console.info("invitat 玩家不存在", invitat);
        return;
    }
    console.info(user.user_id)

    //去invite表查询是否有历史记录
    let ivUser = await app.InviteDB.findInviteByUserId({user_id : user.user_id});
    if (ivUser == null) {
        console.info("invitat 玩家不存在", invitat);
        return;
    }
    ivUser.finishNumber ++;

    for (let i = 0; i < ivUser.be_invite_list.length; i ++) {
        if (ivUser.be_invite_list[i].user_id === be_user_id) {
            ivUser.be_invite_list[i].status = true;
        }
    }

    //@更新返回
    const fieldsToUpdate = {//更新的内容
        finishNumber:ivUser.finishNumber,
        be_invite_list:ivUser.be_invite_list,
    };
    //插入db不等待
    await app.InviteDB.updateOrCreateInvite({user_id : ivUser.user_id}, fieldsToUpdate);

    return true;
}


// item_type 1 是蓝钻石， 2 是粉钻
exports.addInviteDiamond = async function(invite_id, item_num, item_type) {
    console.info("添加奖励： addInviteDiamond finish.", invite_id, item_num, item_type);
    let is_redis_exist = await app.RedisClient.exists_table_hash(invite_id);
    if (is_redis_exist === 1) {//redis存在
        let redis_user = await app.RedisClient.get_all_hash(invite_id);
        if (redis_user !== null) {
            //在线添加钻石

            let fields = ['diamond', 'fen_diamond'];
            //============1 参数校验 and fields赋值 end ==================
            let redis_data= await app.RedisClient.get_many_hash(invite_id, fields); //@redis 取值
            if (item_type === 1) {
                redis_data.diamond += item_num;
            } else if (item_type === 2) {
                redis_data.fen_diamond += item_num;
            }
            let ret = await app.RedisClient.set_many_hash(invite_id, redis_data);//@redis 赋值 and 返回
            if (ret === true) {
                console.info("redis_user addInviteDiamond finish.");
            }

        } else {
            console.info("redis_user addInviteDiamond error !!!");
        }
    } else {//redis不存在 查找db是否有该玩家
        let db_user = await app.UserDB.findUserByUserId({user_id : invite_id});
        if (db_user !== null) {//有则拼接改玩家数据登陆，且写入redis缓存
            //离线添加钻石
            if (item_type === 1) {
                db_user.diamond += item_num;
            } else if (item_type === 2) {
                db_user.fen_diamond += item_num;
            }
            let ret_db = await app.UserDB.updateOrCreateUser({user_id: invite_id}, db_user);
            if (ret_db) {
                console.info("mongo_user addInviteDiamond finish.");
            }
        } else {//没有这个玩家则自动创建玩家
            console.info("mongo_user addInviteDiamond error !!!");
        }
    }
}


//创建邀请大佬
let CreateOrUpdateInvite = async function (be_user_id, invitat) {
    //先找这个邀请人的大佬在不在
    let user = await app.UserDB.findUserByUserId({user_id :invitat});
    if (user == null) {
        console.info("invitat 玩家不存在", invitat);
        return;
    }

    //去invite表查询是否有历史记录
    let ivUser = await app.InviteDB.findInviteByUserId({user_id : user.user_id});
    if (ivUser == null) {//false找不到创建
        const createData = {
            user_id:user.user_id,
            nickName:user.nickName,
            InvNumber:1,
            finishNumber:0,
            be_invite_list :[{
                user_id:be_user_id,
                status:false,
            }]
        }
        //插入db不等待
        await app.InviteDB.updateOrCreateInvite({user_id : user.user_id}, createData);
    } else {//找到了登陆
        ivUser.InvNumber = ivUser.InvNumber + 1;
        ivUser.be_invite_list.push({
            user_id:be_user_id,
            status:false,
        });
        
        //@更新返回
        const fieldsToUpdate = {//更新的内容
            InvNumber:ivUser.InvNumber,
            be_invite_list:ivUser.be_invite_list,
        };
        //插入db不等待
        await app.InviteDB.updateOrCreateInvite({user_id : ivUser.user_id}, fieldsToUpdate);
    }

    return true;
}


//CheckRedis是否有新数据字段
exports.checkRedisInit = async function(user){
    // 获取 user1 的键数量
    const lenUser1 = await redisClient.hLen(initUser.user_id);
    // 获取 user2 的键数量
    const lenUser2 = await redisClient.hLen(user.user_id);

    if (lenUser1!== lenUser2) {
        // 获取 user1 的所有键和值
        const user1KeyValuePairs = await redisClient.hGetAll(initUser.user_id);
        // 获取 user2 的所有键
        const keysUser2 = await redisClient.hKeys(user.user_id);

        const setUser1 = new Set(Object.keys(user1KeyValuePairs));
        const setUser2 = new Set(keysUser2.map(key => key.toString()));

        const missingKeys = Array.from(setUser1).filter(key =>!setUser2.has(key));
        const extraKeys = Array.from(setUser2).filter(key =>!setUser1.has(key));

        for (const key of missingKeys) {
            user[key] = user1KeyValuePairs[key];
            await redisClient.hSet(user.user_id, key, user1KeyValuePairs[key]);
        }

        // for (const key of extraKeys) {
        //     await redisClient.hDel(user.userId, key);
        // }

        if (missingKeys.length > 0) {
            console.log(`已将 user[${user.user_id}] 缺失的键（${missingKeys.join(', ')}）从 redisfather 中复制过来`);
        }

        if (extraKeys.length > 0) {
            console.log(`已将 user[${user.user_id}] 多余的键（${extraKeys.join(', ')}）删除`);
        }
    } else {
        console.log("两个哈希表键数量相等");
    }

    return user;
}




//db和redis的变量的转换
let change_value_type = function(key, value, type) { //24  type: REDIS_TO_DB/DB_TO_REDIS
    if (value !== undefined && value !== null) {
        if (key === "user_id" || //2
            key === "invite_id" ||
            
            key === "pet" 
             ) {//[string]
            if (type === "REDIS_TO_DB") {
                return value.toString();
            } else if (type === "DB_TO_REDIS") {
                return value.toString();
            }
        } else if (
           
            key === "day" ||
            key === "invite_number" ||
            key === "last_login_time" ||
            key === "last_hand_up_time" ||
            key === "last_power_time" ||
            key === "current_time"||
            
            key === "game_score_lishi"||
            key === "game_gold"||
            key === "game_medal"||
            key === "level"||
            key === "skill_1"||
            key === "skill_2"||
            key === "hedan"||
            key === "shield"||
            key === "power"


            ) {// [number]·
            if (type === "REDIS_TO_DB") {
                return Number(value);
            } else if (type === "DB_TO_REDIS") {
                return value.toString();
            }
        } else if (
            key === "is_sign" || //3
            key === "isInviteStatus" ||
            key === "isNFTVip") {//[boolean]
            if (type === "REDIS_TO_DB") {
                return (value === 'true');
            } else if (type === "DB_TO_REDIS") {
                return value.toString();
            }
        } else if (key === "planeName" || //5
            key === "config_PlaneInfo" ||
            key === "config_WeaponInfo" ||
            key === "config_PetInfo" ||
            key === "config_Plane" ||
            key === "plane" ||
            key === "petName" ) {// [array]
            if (type === "REDIS_TO_DB") {
                return JSON.parse(value);
            } else if (type === "DB_TO_REDIS") {
                return JSON.stringify(value);
            }
        } else {
            if (type === "REDIS_TO_DB") {
                console.error("REDIS_TO_DB 未声明的数据类型 ！！！", key);
            } else if (type === "DB_TO_REDIS") {
                console.error("DB_TO_REDIS 未声明的数据类型 ！！！", key);
            }
            return null;//未声明类型不支持 0
        }
    }
}

//删除redis的hashtable
exports.del_table_hash = async function(key){
    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error("del_table_hash", error.message);
        return false;
    }
}

//删除过期时间
exports.del_expire_hash = async function(key){
    try {
        return await redisClient.persist(key);
    } catch (error) {
        console.error("del_expire_hash", error.message);
        return null;
    }
}

//设置过期时间
exports.set_expire_hash = async function(key, time){
    try {
        return await redisClient.expire(key, time);
    } catch (error) {
        console.error("set_expire_hash", error.message);
        return null;
    }
}

//判断hash表是否存在
exports.exists_table_hash = async function(key){
    try {
        return await redisClient.exists(key);
    } catch (error) {
        console.error("exists_table_hash", error.message);
        // 处理错误
        return 0;
    }
}
exports.clearSortedSet = async function(sortedSetKey){
    try {
        await redisClient.del(sortedSetKey);
        console.warn(`有序集合 [${sortedSetKey}] 已清空 !`);
        return true;
    } catch (error) {
        console.error('clearSortedSet:', error.message);
        return false;
    }
}


// 将用户数据添加到 Redis 有序集合
exports.setHashByKey = async function(sortedSetKey, key, value){
    try {
        await redisClient.hSet(sortedSetKey, key, value);
    } catch (error) {
        console.error("setHashByKey", error.message);
        // 处理错误
    }
}

// 将用户数据添加到 Redis 有序集合
exports.getHashByKey = async function(sortedSetKey, key){
    try {
        let ret = await redisClient.hGet(sortedSetKey, key);
        if (ret) {
            return  ret;
        }
        
        return null;
         
    } catch (error) {
        console.error("getHashByKey", error.message);
        // 处理错误
        return null;
    }
}


// 将用户数据添加到 Redis 有序集合
exports.addUsersToSortedSet = async function(users){
    try {
        for (const user of users) {
            await redisClient.zAdd('user_rank', user);
        }
    } catch (error) {
        console.error("addUsersToSortedSet", error.message);
        // 处理错误
    }
}


//判断hash表是否存在
exports.set_table_and_hash = async function(table, key, value){
    try {
        await redisClient.hSet(table, key, value);

    } catch (error) {
        console.error("set_table_and_hash", error.message);
        // 处理错误
        return 0;
    }
}

//修改redis中user表中的其中多个字段的值
exports.set_many_hash = async function(user_id, fixValues) {
    try {
        for (const key in fixValues) {
            await redisClient.hSet(user_id, key, change_value_type(key, fixValues[key], 'DB_TO_REDIS'));
        }
        return true;
    } catch (error) {
        console.error("set_many_hash", error.message);
        return false;
    }
}

//修改redis中user表中的其中多个字段的值
exports.set_many_players_hash = async function(player_list, fixValues) {
    try {
        for (const user_id_key in player_list) {
            for (const key in fixValues) {
                await redisClient.hSet(player_list[user_id_key], key, change_value_type(key, fixValues[key], 'DB_TO_REDIS'));
            }
        }
        return true;
    } catch (error) {
        console.error("set_many_hash", error.message);
        return false;
    }
}

//修改redis中user表中的其中一个字段的值
exports.set_one_hash = async function(user_id, key, value){
    try {
        await redisClient.hSet(user_id, key, change_value_type(key, value, 'DB_TO_REDIS'));
    } catch (error) {
        console.error("set_one_hash", error.message);
        // 处理错误
    }
}

//把从mongodb读取的数据全部加载到redis
exports.load_all_hash = async function(user){
    try {
        for (const key in user) {
            if (user.hasOwnProperty(key)) {
                let value = user[key];
                if (value !== undefined && value !== null) {
                    await app.RedisClient.set_one_hash(user.user_id.toString(), key, value);
                }
            }
        }

        return true;
    } catch (error) {
        console.error("load_all_hash", error.message);
        // 处理错误
        return false;

    }
}

//获取redis中user表中的一个字段的值
exports.get_many_hash = async function(user_id, fields){
    try {
        let user = await redisClient.hGetAll(user_id);

        const userData = {};

        for (const key in user) {
            if (fields.includes(key)) {
                userData[key] = change_value_type(key, user[key], 'REDIS_TO_DB');
            }
        }

        return userData;
    } catch (error) {
        console.error("get_many_hash", error.message);
        // 处理错误
        return null;
    }
}

//保存所有的redis数据到mongo内
exports.get_all_hash = async function(user_id){
    try {
        let user = await redisClient.hGetAll(user_id);

        const userData = {};

        for (const key in user) {
            userData[key] = change_value_type(key, user[key], 'REDIS_TO_DB');
        }

        return userData;
    } catch (error) {
        console.error("get_all_hash", error.message);
        // 处理错误
        return null;
    }
}
