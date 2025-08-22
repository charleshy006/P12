const {app} = require("pomelo");
const _ = require("underscore");

const { changeInviteStatus } = require('../../../db/redisdb');


module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;


// 函数 : @@@ 签到 @@@
// 参数 : 无 
// 返回 : (是否签到 宝箱总数 和 加了多少宝箱)
handler.Sign_In = async function(msg, session, next) {
    // if (undefined === msg.msg_type) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Sign_In msg_type Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['is_sign',  'day', 'score', 'isNFTVip'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Sign_In Redis Search Error!`);
        return;
    }
    let gift_list = [];
    retDatas.extraData = {
        gift_list:gift_list
    };
    if (redis_data.is_sign === true) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`今日已签到!`);
        return;
    }

    redis_data.is_sign = true;

    // 创建一个 Date 对象，它会默认使用当前的日期和时间
    const today = new Date();
    // 使用 getDate() 方法从 Date 对象中获取今天是这个月的第几天

    let gift_info = app.Configs.config_signgift_info[redis_data.day];

    let g_n = gift_info.gift_num;
    if (redis_data.isNFTVip) {
        console.info("isNFTVip 触发双倍 ")

        g_n *= 2;
    }
    
    if (gift_info.gift_tp === 4) {
        console.info("签到积分 + " + g_n)

        redis_data.score += g_n;
    }

    retDatas.extraData.gift_list.push({
        gift_id : gift_info.gift_tp,
        gift_number : gift_info.gift_num,
    })
    
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Sign_In Redis Set Error!`);
    }
}


// 函数 : @@@ time @@@
// 参数 : 无 
// 返回 : 
handler.Get_Current_Time = async function(msg, session, next) {
    // if (undefined === msg.msg_type) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Get_Current_Time msg_type Error!`);
    //     return;
    // }
    
    //需要修改的userdata
    let fields = ['current_time'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Current_Time Redis Search Error!`);
        return;
    }
    retDatas.extraData = {

    };

    redis_data.current_time =  app.UserDB.ToUTCData(Date.now());
    
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Current_Time Redis Set Error!`);
    }
}

// 函数 : @@@ NFTVip @@@
// 参数 : NFTVip_Status true/false
// 返回 : 
handler.Setting_NFTVip = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.NFTVip_Status) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Setting_NFTVip, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['isNFTVip'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {

    };

    //2 逻辑运算 ==============================
    redis_data.isNFTVip = msg.NFTVip_Status
    //============2 逻辑运算 end ==================



    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Set Error!`);
    }
}

// 函数 : @@@ Get_HandUp @@@
// 参数 : NFTVip_Status true/false
// 返回 : 
handler.Get_HandUp = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    // if (undefined === msg.NFTVip_Status) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Setting_NFTVip, Parameter Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['last_hand_up_time', 'score'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addScore:0
    };

    //2 逻辑运算 ==============================
    let current_time =  app.UserDB.ToUTCData(Date.now());
    let t_temp = current_time - redis_data.last_hand_up_time;
    if (t_temp < 60000) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`暂无奖励!`);
        return;
    } else {
        redis_data.last_hand_up_time = app.UserDB.ToUTCData(Date.now());//重置
        let temp_score = Math.floor(t_temp / 60000);
        if (temp_score > 360) {
            temp_score = 360;
        }
        temp_score = temp_score / 10;
        redis_data.score += temp_score;
        retDatas.extraData.addScore = temp_score;
    }
    //============2 逻辑运算 end ==================
    
    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Set Error!`);
    }
}

// 函数 : @@@ Start_Game @@@
// 参数 : type=1 正常开始 ； type=2 扫荡
// 返回 : 
handler.Start_Game = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.id ) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Start_Game, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['power', 'level'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Start_Game, Redis Search Error!`);
        return;
    }
    
    if (redis_data.power < 5) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`体力不支!`);
        return;  
    }

    if (redis_data.level < msg.id) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`关卡id错误!`);
        return;
    }
    
    redis_data.power -= 5;
    
    retDatas.extraData = {
    };

    //============2 逻辑运算 end ==================

    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据
        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Start_Game, Redis Set Error!`);
    }
}

// 函数 : @@@ Sweep_Game @@@
// 参数 :
// 返回 : 
handler.Sweep_Game = async function(msg, session, next) {
//1 参数校验 and fields赋值 ==============================
    if (undefined === msg.id ) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Sweep_Game, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['isNFTVip', 'power', 'level', 'levelWave', 'toolData', 'gold', 'diamond'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Sweep_Game, Redis Search Error!`);
        return;
    }
    

    retDatas.extraData = {
        addItemInfo : [],
        isNFTVip : redis_data.isNFTVip
    };

    if (redis_data.power < 5) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`体力不支!`);
        return;
    }
    redis_data.power -= 5;

    if (redis_data.level <= msg.id) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`未通关!`);
        return;
    }
    
    let config_level_info = app.Configs.config_level_info[msg.id.toString()];

    let t_awards = config_level_info[3];// "1,400",
    
    function convertStringToArray2(a) {
        return a.split(';').map(item => {
            const [id, ...rest] = item.split(',').map(Number);
            return {
                id,
                quality: id === 5 ? rest[0] : 0,
                number: id === 5 ? rest[1] : rest[0]
            };
        });
    }
    // "1": ["1", "1.开心乐园", null, "1,200;5,1,13", null, "3,5,7", null, "1,100", "1,200;3,10", "2,100;5,1,16"],

    //"1,150;5,1,12;5,2,5" => [{id:1, quality:0, number:150}, {id:5, quality:1, number:12}, , {id:5, quality:2, number:5}]
    let awards = convertStringToArray2(t_awards);

    for (let i = 0; i < awards.length; i ++) {
        let t_itemid = awards[i]["id"];
        if (t_itemid === 5) {
            let temp_awards = [];

            for (const equipId in redis_data.toolData) {
                if (redis_data.toolData.hasOwnProperty(equipId)) {
                    const equipData = redis_data.toolData[equipId];
                    // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                    if (equipData.quality === awards[i]["quality"]) {
                        temp_awards.push(equipId);
                    }
                }
            }

            t_itemid = temp_awards[_.random(0, temp_awards.length - 1)];//1006
        }

        let add_num = awards[i]["number"];
        if (redis_data.isNFTVip) {
            add_num *= 2;
        }
        retDatas.extraData.addItemInfo.push({
            itemId: t_itemid,
            count: add_num
        });

        if (t_itemid === 1) {
            redis_data.gold += add_num;
        } else if (t_itemid === 2) {
            redis_data.diamond += add_num;
        } else if (t_itemid === 3) {
            redis_data.power += add_num;
        } else {
            redis_data.toolData[t_itemid]["c"] += add_num;
        }
    }
    

    //============2 逻辑运算 end ==================

    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据
        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Sweep_Game, Redis Set Error!`);
    }
}

// 函数 : @@@ Finishi_Game @@@
// 参数 : 
// 返回 : 
handler.Finish_Game = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.type  || undefined === msg.id  || undefined === msg.bo_num) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Finish_Game, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = [ 'isNFTVip', 'level', 'levelWave', 'levelBoxData', 'isInviteStatus', 'invite_id', 'user_id', 'toolData', 'power', 'gold', 'diamond'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Finish_Game, Redis Search Error!`);
        return;
    }

    if (redis_data.level < msg.id) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`关卡id错误!`);
        return;
    }
    
    retDatas.extraData = {
        addItemInfo : [],
        isNFTVip : redis_data.isNFTVip
    };



    function convertStringToArray(a) {
        return a.split(',').map(Number);
    }
    function convertStringToArray2(a) {
        return a.split(';').map(item => {
            const [id, ...rest] = item.split(',').map(Number);
            return {
                id,
                quality: id === 5 ? rest[0] : 0,
                number: id === 5 ? rest[1] : rest[0]
            };
        });
    }

    let config_level_info = app.Configs.config_level_info[msg.id.toString()];
    if (!config_level_info) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`关卡错误!`);
        return;
    }

    let bo_list = convertStringToArray(config_level_info[5]);
    let max_bo_num = bo_list[2];
    redis_data.levelWave = msg.bo_num;


    if (msg.type === 1) {
        
        if (msg.bo_num >= max_bo_num) {
            //结算
            if (redis_data.level < 30) {
                if (redis_data.level === msg.id) {
                    redis_data.level ++;
                    redis_data.levelWave = 0;
                    redis_data.levelBoxData[redis_data.level] = [0,0,0];
                }
               

                // bag
                if (msg.id === 2) {
                    redis_data.toolData[1007]["isUnLock"] = true;
                } else if (msg.id === 3) {
                    redis_data.toolData[1008]["isUnLock"] = true;
                } else if (msg.id === 4) {
                    redis_data.toolData[1009]["isUnLock"] = true;
                } else if (msg.id === 5) {
                    redis_data.toolData[1010]["isUnLock"] = true;
                } else if (msg.id === 6) {
                    redis_data.toolData[1011]["isUnLock"] = true;
                } else if (msg.id === 7) {
                    redis_data.toolData[1012]["isUnLock"] = true;
                }
            } else {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`已经达到最大关卡!`);
                return;
            }



            //发奖

            let t_awards = config_level_info[3];// "1,400",
            
            //"1,150;5,1,12;5,2,5" => [{id:1, quality:0, number:150}, {id:5, quality:1, number:12}, , {id:5, quality:2, number:5}]
            let awards = convertStringToArray2(t_awards);

            for (let i = 0; i < awards.length; i++) {
                let t_itemid = awards[i]["id"];
                if (t_itemid === 5) {
                    let temp_awards = [];

                    for (const equipId in redis_data.toolData) {
                        if (redis_data.toolData.hasOwnProperty(equipId)) {
                            const equipData = redis_data.toolData[equipId];
                            // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                            if (equipData.quality === awards[i]["quality"]) {
                                temp_awards.push(equipId);
                            }
                        }
                    }

                    t_itemid = temp_awards[_.random(0, temp_awards.length - 1)];//1006
                }
                let add_num = awards[i]["number"];
                if (redis_data.isNFTVip) {
                    add_num *= 2;
                }
                retDatas.extraData.addItemInfo.push({
                    itemId: t_itemid,
                    count: add_num
                });

                if (t_itemid === 1) {
                    redis_data.gold += add_num;
                } else if (t_itemid === 2) {
                    redis_data.diamond += add_num;
                } else if (t_itemid === 3) {
                    redis_data.power += add_num;
                } else {
                    redis_data.toolData[t_itemid]["c"] += add_num;
                }
            }


            //完成邀请任务
            if (redis_data.invite_id !== "" && msg.id >= 1 && !redis_data.isInviteStatus) {
                redis_data.isInviteStatus = true;

                await changeInviteStatus(redis_data.user_id, redis_data.invite_id);
            }
   
        }


    } else if (msg.type === 2) {
        //发奖

        let t_awards = config_level_info[3];// "1,400",

        //"1,150;5,1,12;5,2,5" => [{id:1, quality:0, number:150}, {id:5, quality:1, number:12}, , {id:5, quality:2, number:5}]
        let awards = convertStringToArray2(t_awards);

        for (let i = 0; i < awards.length; i ++) {
            let t_itemid = awards[i]["id"];
            if (t_itemid === 5) {
                let temp_awards = [];

                for (const equipId in redis_data.toolData) {
                    if (redis_data.toolData.hasOwnProperty(equipId)) {
                        const equipData = redis_data.toolData[equipId];
                        // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                        if (equipData.quality === awards[i]["quality"]) {
                            temp_awards.push(equipId);
                        }
                    }
                }

                t_itemid = temp_awards[_.random(0, temp_awards.length - 1)];//1006
            }
            
            let number = Math.floor(msg.bo_num / max_bo_num  * awards[i]["number"]);
            if (redis_data.isNFTVip) {
                number *= 2;
            }
            retDatas.extraData.addItemInfo.push({
                itemId: t_itemid,
                count: number
            });

            if (t_itemid === 1) {
                redis_data.gold += number;
            } else if (t_itemid === 2) {
                redis_data.diamond += number;
            } else if (t_itemid === 3) {
                redis_data.power += number;
            } else {
                redis_data.toolData[t_itemid]["c"] += number;
            }
        }
    }
    //============2 逻辑运算 end ==================
    


    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据
        delete retDatas.userData.s_unlock_box;
        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Finish_Game, Redis Set Error!`);
    }
}

// 函数 : @@@ Get_Awards @@@
// 参数 : 
// 返回 : 
handler.Get_Awards = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.id  || undefined === msg.bo_num) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Get_Awards, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['level', 'levelWave', 'levelBoxData', 'gold', 'toolData', 'power', 'diamond'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Awards, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    let config_level_info = app.Configs.config_level_info[msg.id.toString()];
    function convertStringToArray(a) {
        return a.split(',').map(Number);
    }

    let bo_list = convertStringToArray(config_level_info[5]);
    
    if (msg.id > redis_data.level) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`关卡错误!`);
        return;
    }
    
    let now_bo = bo_list[msg.bo_num];
    
    if (msg.id === redis_data.level && now_bo > redis_data.levelWave) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没通过对应波数!无法领取`);
        return;
    }
    
    if (redis_data.levelBoxData[msg.id][msg.bo_num] === 1) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`已经领取`);
        return; 
    } else {
        redis_data.levelBoxData[msg.id][msg.bo_num] = 1;
    }

    
    let t_awards = config_level_info[7];// "1,400",
    if (bo_list.indexOf(msg.bo_num) === 1) {
        t_awards = config_level_info[8];//"1,800;3,10", 
    } else if (bo_list.indexOf(msg.bo_num) === 2) {
        t_awards = config_level_info[9];//"2,200;5,1,20;5,2,1"
    }


    function convertStringToArray2(a) {
        return a.split(';').map(item => {
            const [id, ...rest] = item.split(',').map(Number);
            return {
                id,
                quality: id === 5 ? rest[0] : 0,
                number: id === 5 ? rest[1] : rest[0]
            };
        });
    }

    //"1,150;5,1,12;5,2,5" => [{id:1, quality:0, number:150}, {id:5, quality:1, number:12}, , {id:5, quality:2, number:5}]
    let awards = convertStringToArray2(t_awards);

    for (let i = 0; i < awards.length; i ++) {
        let t_itemid = awards[i]["id"];
        if (t_itemid === 5) {
            let temp_awards = [];

            for (const equipId in redis_data.toolData) {
                if (redis_data.toolData.hasOwnProperty(equipId)) {
                    const equipData = redis_data.toolData[equipId];
                    // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                    if (equipData.quality === awards[i]["quality"]) {
                        temp_awards.push(equipId);
                    }
                }
            }

            t_itemid = temp_awards[_.random(0, temp_awards.length - 1)];//1006
        }
        retDatas.extraData.addItemInfo.push({
            itemId: t_itemid,
            count: awards[i]["number"]
        });

        if (t_itemid === 1) {
            redis_data.gold += awards[i]["number"];
        } else if (t_itemid === 2) {
            redis_data.diamond += awards[i]["number"];
        } else if (t_itemid === 3) {
            redis_data.power += awards[i]["number"];
        } else {
            redis_data.toolData[t_itemid]["c"] += awards[i]["number"];
        }
    }
    
    //============2 逻辑运算 end ==================
    
    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据
        delete retDatas.userData.s_unlock_box;
        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Awards, Redis Set Error!`);
    }
}


// 函数 : @@@ Set_Fruit @@@
// 参数 : 
// 返回 : 
handler.Set_Fruit = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.type  || undefined === msg.fruit_id || undefined === msg.fruit_pos) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Set_Fruit, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['toolData'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Set_Fruit, Redis Search Error!`);
        return;
    }

    let cur_fruit = redis_data.toolData[msg.fruit_id];
    if (undefined === cur_fruit) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该水果!`);
        return;
    }

    if (msg.type === 1) {//shang zhen
        if (cur_fruit.pos !== -1) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`该物品已经上阵!`);
            return;
        }

        let flag = 0;
        for (const equipId in redis_data.toolData) {
            if (redis_data.toolData.hasOwnProperty(equipId)) {
                const equipData = redis_data.toolData[equipId];
                // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                if (equipData.pos  === msg.fruit_pos) {
                    flag = equipId;
                }
            }
        }
        
        if (flag !== 0) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`位置被${flag}占!`);
            return; 
        }

        redis_data.toolData[msg.fruit_id].pos = msg.fruit_pos;
        
    } else if (msg.type === 2) {//xia zhen

        redis_data.toolData[msg.fruit_id].pos = -1;

    }

    //============2 逻辑运算 end ==================


    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据
        delete retDatas.userData.s_unlock_box;
        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Awards, Redis Set Error!`);
    }


}

// 函数 : @@@ Up_Fruit @@@
// 参数 : 
// 返回 : 
handler.Up_Fruit = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.fruit_id) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Set_Fruit, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['toolData', 'gold'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Set_Fruit, Redis Search Error!`);
        return;
    }

    let cur_fruit = redis_data.toolData[msg.fruit_id];
    if (undefined === cur_fruit) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该水果!`);
        return;
    }

    if (!cur_fruit["isUnLock"]) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`该水果未解锁!`);
        return;
    }

    let curret_level = cur_fruit["lv"];
    let level_info = app.Configs.config_fruit_level[msg.fruit_id.toString()][curret_level - 1];
    let [chip, gold] = level_info.split(',').map(Number);
    if (gold > redis_data.gold) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`金币不足!`);
        return;
    }
    if (chip > cur_fruit["c"]) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`碎片不足!`);
        return;
    }

    redis_data.gold -= gold;
    redis_data.toolData[msg.fruit_id]["c"] -= chip;
    redis_data.toolData[msg.fruit_id]["lv"] ++;

    //============2 逻辑运算 end ==================


    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据
        delete retDatas.userData.s_unlock_box;
        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Awards, Redis Set Error!`);
    }
}

/////new 

// 函数 : @@@ 邀请累计列表 @@@
// 参数 : msg_type 1 获取信息  2 领取奖励  || msg_index 领取档位
// 返回 : 
handler.Get_Invite_TotalList_Info = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.msg_type ||  undefined === msg.msg_index) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Get_Invite_List_Info, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['user_id', 'inviteTotalList','score', 'invite_number'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Invite_List_Info, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    //2 逻辑运算 ==============================
    let ivUser = await app.InviteDB.findInviteByUserId({user_id : redis_data.user_id});
    if (ivUser) {
        console.info(ivUser.finishNumber);
        redis_data.invite_number = ivUser.finishNumber;

        for (const key in redis_data.inviteTotalList) {
            if (redis_data.inviteTotalList.hasOwnProperty(key)) {
                const item = redis_data.inviteTotalList[key];
                // console.log(`Key: ${key}, Gift Type: ${item.gift_tp}, Gift Number: ${item.gift_num}, Invite Number: ${item.invite_num}, Status: ${item.status}`);
                if (ivUser.finishNumber >= item.invite_num && item.status === 0) {
                    redis_data.inviteTotalList[key].status = 1;
                }
            }
        }
    }

    if (msg.msg_type === 1) {//获取

    } else if (msg.msg_type === 2) {//领取
        let invite_t = redis_data.inviteTotalList[msg.msg_index];
        if (invite_t) {
            if (invite_t.status === 0) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`未完成！`);
            } else if (invite_t.status === 1) {
                redis_data.score += invite_t.item_num;//todo add item
                redis_data.inviteTotalList[msg.msg_index].status = 2;
                retDatas.extraData.addItemInfo.push({
                    itemId: 4,
                    count: invite_t.item_num
                });
            } else if (invite_t.status === 2) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`已经领取！`);
            }
        } else {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该档位。`);
        }
    }
    //============2 逻辑运算 end ==================



    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Invite_List_Info, Redis Set Error!`);
    }
}

// task_type 类型 1通关 2解锁水果 3购买普通礼盒 4购买精致礼盒 5分享
// 函数 : @@@ 任务列表 @@@
// 参数 : msg_type 1 获取信息, 2 领取奖励  || task_id 领取档位
// 返回 : 
handler.Get_Task_List_Info = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.msg_type || undefined === msg.task_id) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Get_Invite_List_Info, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['level', 'box1BuyTotalCount', 'box2BuyTotalCount', 'toolData', 'gold', 'score', 'task_infos'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Invite_List_Info, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo: []
    };


    
    //判断
    for (const key in redis_data.task_infos) {
        if (redis_data.task_infos.hasOwnProperty(key)) {
            const t_task = redis_data.task_infos[key];
            if (t_task.status === 0) {
                if (t_task.task_type === 1) {//家 满9 判断
                    if (redis_data.level >= t_task.finished) {
                        redis_data.task_infos[key].status = 1;
                        console.log(`Key: ${key}, type: ${t_task.task_type}`);
                    }
                } else if (t_task.task_type === 2) {//curLevel 判断
                    for (const equipId in redis_data.toolData) {
                        if (redis_data.toolData.hasOwnProperty(equipId)) {
                            const equipData = redis_data.toolData[equipId];
                            // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                            if (equipData.isUnLock && equipId === t_task.finished) {
                                redis_data.task_infos[key].status = 1;
                                console.log(`Key: ${key}, type: ${t_task.task_type}`);
                            }
                        }
                    }

                } else if (t_task.task_type === 3) {//unlockedCollectArr长度 photo_count 判断
                    if (redis_data.box1BuyTotalCount >= t_task.finished) {
                        redis_data.task_infos[key].status = 1;
                        console.log(`Key: ${key}, type: ${t_task.task_type}`);
                    }
                } else if (t_task.task_type === 4) {//lotto lottery_count 判断
                    if (redis_data.box2BuyTotalCount >= t_task.finished) {
                        redis_data.task_infos[key].status = 1;
                        console.log(`Key: ${key}, type: ${t_task.task_type}`);
                    }
                } else if (t_task.task_type === 5) {//信任客户端
                    //nothing
                    console.log(`nothing Key: ${key}, type: ${t_task.task_type}`);
                }
            }
        }
    }

    //2 逻辑运算 ==============================
    if (msg.msg_type === 1) {//获取

    } else if (msg.msg_type === 2) {//领取
        const t_task = redis_data.task_infos[msg.task_id];

        if (t_task) {
            if (t_task.status === 0) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`未完成！`);
                return;
            } else if (t_task.status === 1) {
                //add
                if (t_task.item_id === 1) {
                    redis_data.gold += t_task.item_num;
                } else if (t_task.item_id === 4) {
                    redis_data.score += t_task.item_num;
                }
                retDatas.extraData.addItemInfo.push({
                    itemId: t_task.item_id,
                    count: t_task.item_num
                });

                redis_data.task_infos[msg.task_id].status = 2;
            } else if (t_task.status === 2) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`已经领取！`);
                return;
            }
        } else {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该任务。`);
            return;
        }
    } else if (msg.msg_type === 3) {//完成
        const t_task = redis_data.task_infos[msg.task_id];
        if (t_task.task_type !== 5) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`只有类型5才能直接完成！`);
            return;
        }
        if (t_task) {
            if (t_task.status === 1) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`任务已经完成！`);
                return;
            }
            redis_data.task_infos[msg.task_id].status = 1;
        } else {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该任务。`);
            return;
        }
    }
    //============2 逻辑运算 end ==================



    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Invite_List_Info, Redis Set Error!`);
    }
}

// 函数 : @@@ Buy_Box @@@
// 参数 : Buy_Box true/false
// 返回 : 
handler.Buy_Box = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.buy_type || undefined === msg.box_type) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Buy_Box, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['isNFTVip', 'box1BuyCount', 'box2BuyCount', 'gold', 'diamond', 'toolData', 'boxExp', 'boxLevel', 'box1BuyTotalCount', 'box2BuyTotalCount'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Box, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    //2 逻辑运算 ==============================
    if (msg.buy_type === 1) {
        if (!redis_data.isNFTVip) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`不是vip！`);
            return;
        }

        if (msg.box_type === 1) {
            if (redis_data.box1BuyCount <= 0) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有普通box次数`);
                return;
            }

            redis_data.box1BuyCount -= 1;
            redis_data.box1BuyTotalCount += 1;
        } else if (msg.box_type === 2) {
            if (redis_data.box2BuyCount <= 0) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有精致box次数`);
                return;
            }

            redis_data.box2BuyCount -= 1;
            redis_data.box2BuyTotalCount += 1;
        }
        
    } else if (msg.buy_type === 2) {
        if (msg.box_type === 1) {
            if (redis_data.diamond < 20) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`钻石不足`);
                return;
            }

            redis_data.diamond -= 20;
        } else if (msg.box_type === 2) {
            if (redis_data.diamond < 150) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`钻石不足`);
                return;
            }

            redis_data.diamond -= 150;
        }
    }

    // 发奖
    // exports.config_shop_box = {
    //     "1": ["1", "1", "300", "50", "9,0,0", "500", "38,4,0"],
    //     "1": ["1", "1", "300", "1,50;5,1,9", "1,500;5,1,38;5,2,4"],
    // 2 exp 
    // 3 普通
    // 4 vip

    // boxExp: 0,		//宝箱经验		（由礼盒打开的次数，普通的增加20，精致的增加150）
    // boxLevel: 0,	//宝箱等级
    let cur_box = app.Configs.config_shop_box[redis_data.boxLevel.toString()];
    let awards = null;
    
    function convertStringToArray2(a) {
        return a.split(';').map(item => {
            const [id, ...rest] = item.split(',').map(Number);
            return {
                id,
                quality: id === 5 ? rest[0] : 0,
                number: id === 5 ? rest[1] : rest[0]
            };
        });
    }
    //"1,150;5,1,12;5,2,5" => [{id:1, quality:0, number:150}, {id:5, quality:1, number:12}, , {id:5, quality:2, number:5}]

    if (msg.box_type === 1) {
        redis_data.boxExp += 20;
        awards = convertStringToArray2(cur_box[3]);

    } else if (msg.box_type === 2) {
        redis_data.boxExp += 150;
        awards = convertStringToArray2(cur_box[4]);
    }

    if (redis_data.boxExp >= cur_box[2]) {
        redis_data.boxLevel ++;
    }

    //============2 逻辑运算 end ==================
    if (awards === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`awards is null`);
        return;
    }

    for (let i = 0; i < awards.length; i ++) {
        let t_itemid = awards[i]["id"];
        if (t_itemid === 5) {
            let temp_awards = [];

            for (const equipId in redis_data.toolData) {
                if (redis_data.toolData.hasOwnProperty(equipId)) {
                    const equipData = redis_data.toolData[equipId];
                    // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                    if (equipData.quality === awards[i]["quality"]) {
                        temp_awards.push(equipId);
                    }
                }
            }

            t_itemid = temp_awards[_.random(0, temp_awards.length - 1)];//1006
        }
        retDatas.extraData.addItemInfo.push({
            itemId: t_itemid,
            count: awards[i]["number"]
        }); 

        if (t_itemid === 1) {
            redis_data.gold += awards[i]["number"];
        } else if (t_itemid === 2) {
            redis_data.diamond += awards[i]["number"];
        } else if (t_itemid === 3) {
            redis_data.power += awards[i]["number"];
        } else {
            redis_data.toolData[t_itemid]["c"] += awards[i]["number"];
        }
    }

    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Box, Redis Set Error!`);
    }
}


// 函数 : @@@ Buy_Power @@@
// 参数 : Buy_Power true/false
// 返回 : 
handler.Buy_Power = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.buy_type) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Buy_Power, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['isNFTVip', 'videoAddPowerTime', 'addPowerTime', 'power', 'diamond'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Power, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    //2 逻辑运算 ==============================
    if (msg.buy_type === 1) {
        if (!redis_data.isNFTVip) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`不是vip！`);
            return;
        }

        if (redis_data.videoAddPowerTime <= 0) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有VIP次数`);
            return;
        }

        redis_data.videoAddPowerTime -= 1;

    } else if (msg.buy_type === 2) {
        if (redis_data.diamond < 100) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有次数`);
            return;
        }

        if (redis_data.addPowerTime <= 0) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有普通次数`);
            return;
        }

        redis_data.addPowerTime -= 1;
        redis_data.diamond -= 100;
    }

    // 发奖
    redis_data.power += 10;
    retDatas.extraData.addItemInfo.push({
        itemId: 3,
        count: 10
    });

    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Power, Redis Set Error!`);
    }
}

// 函数 : @@@ Buy_Gold @@@
// 参数 : Buy_Gold true/false
// 返回 : 
handler.Buy_Gold = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.buy_type || undefined === msg.item_type) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Buy_Gold, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['isNFTVip', 'videoBuyGoldCount', 'gold', 'diamond'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Gold, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    //2 逻辑运算 ==============================
    if (msg.buy_type === 1) {
        if (!redis_data.isNFTVip) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`不是vip！`);
            return;
        }

        if (redis_data.videoBuyGoldCount <= 0) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有VIP次数`);
            return;
        }

        redis_data.videoBuyGoldCount -= 1;
        redis_data.gold += 500;
        retDatas.extraData.addItemInfo.push({
            itemId: 1,
            count: 500
        });
    } else if (msg.buy_type === 2) {
        if (msg.item_type === 1) {
            if (redis_data.diamond < 400) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`钻石不足`);
                return;
            }
            
            redis_data.diamond -= 400;
            redis_data.gold += 2000;
            retDatas.extraData.addItemInfo.push({
                itemId: 1,
                count: 2000
            });
        } else if (msg.item_type === 2) {
            if (redis_data.diamond < 1200) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`钻石不足`);
                return;
            }

            redis_data.diamond -= 1200;
            redis_data.gold += 10000;
            retDatas.extraData.addItemInfo.push({
                itemId: 1,
                count: 10000
            });
        }
    }

    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Gold, Redis Set Error!`);
    }
}

// 函数 : @@@ Get_Diamond @@@
// 参数 : Get_Diamond true/false
// 返回 : 
handler.Get_Diamond = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    // if (undefined === msg.buy_type || undefined === msg.item_type) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Get_Diamond, Parameter Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['isNFTVip', 'todayBuyDiamondCount', 'diamond'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Diamond, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    //2 逻辑运算 ==============================

    if (!redis_data.isNFTVip) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`不是vip！`);
        return;
    }

    if (redis_data.todayBuyDiamondCount <= 0) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有VIP次数`);
        return;
    }

    redis_data.todayBuyDiamondCount -= 1;
    redis_data.diamond += 150;
    retDatas.extraData.addItemInfo.push({
        itemId: 2,
        count: 150
    });

    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Diamond, Redis Set Error!`);
    }
}

// 函数 : @@@ Buy_Shop_Item @@@
// 参数 : item_id true/false
// 返回 : 
handler.Buy_Shop_Item = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.item_id) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Buy_Shop_Item, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['shopDailyData', 'gold', 'diamond', 'toolData'];// 'isNFTVip', 'todayResetCount'
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Shop_Item, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    //2 逻辑运算 ============================== 

    // 1: { "itemId": 3, "count": 100, "toolId": -1, "buyTimes": 1, "priceType": 999, "price": 100, "discount": 10 },
    // 2: { "itemId": 8, "count": 20, "toolId": 1001, "buyTimes": 1, "priceType": 2, "price": 90, "discount": 9 },
    // 3: { "itemId": 8, "count": 3, "toolId": 1004, "buyTimes": 1, "priceType": 2, "price": 81, "discount": 9 },
    // 4: { "itemId": 8, "count": 10, "toolId": 1003, "buyTimes": 1, "priceType": 3, "price": 12, "discount": 10 },
    // 5: { "itemId": 8, "count": 3, "toolId": 1004, "buyTimes": 1, "priceType": 3, "price": 21, "discount": 10 },
    // 6: { "itemId": 8, "count": 10, "toolId": 1002, "buyTimes": 1, "priceType": 3, "price": 9, "discount": 7 }
    
    let cur_item = redis_data.shopDailyData[msg.item_id];
    
    if (cur_item === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`商店商品id错误！`);
        return;
    }

    if (cur_item["buyTimes"] <= 0) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`商店商品没有购买次数`);
        return;
    }
    
    if (cur_item["priceType"] === 1) {
        if (cur_item["price"] > redis_data.gold) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`金币不足`);
            return;
        }

        redis_data.gold -= cur_item["price"];
        let fruit_id = cur_item["toolId"];
        let fruit_num = cur_item["count"];
        redis_data.shopDailyData[msg.item_id]["buyTimes"] -= 1;
        redis_data.toolData[fruit_id]["c"] += parseInt(fruit_num);
        retDatas.extraData.addItemInfo.push({
            itemId: fruit_id,
            count: fruit_num
        });
    } else if (cur_item["priceType"] === 2) {
        if (cur_item["price"] > redis_data.diamond) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`钻石不足`);
            return;
        }
        
        redis_data.diamond -= cur_item["price"];
        let fruit_id = cur_item["toolId"];
        let fruit_num = cur_item["count"];
        redis_data.shopDailyData[msg.item_id]["buyTimes"] -= 1;
        redis_data.toolData[fruit_id]["c"] += parseInt(fruit_num);
        retDatas.extraData.addItemInfo.push({
            itemId: fruit_id,
            count: fruit_num
        });
    } else {
        redis_data.diamond += cur_item["count"];
        let fruit_id = cur_item["itemId"];
        let fruit_num = cur_item["count"];
        redis_data.shopDailyData[msg.item_id]["buyTimes"] -= 1;
        retDatas.extraData.addItemInfo.push({
            itemId: fruit_id,
            count: fruit_num
        });
    }



    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Buy_Shop_Item, Redis Set Error!`);
    }
}

// 函数 : @@@ Reset_Shop @@@
// 参数 : item_id true/false
// 返回 : 
handler.Reset_Shop = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    // if (undefined === msg.type) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Reset_Shop, Parameter Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['shopDailyData', 'isNFTVip', 'todayResetCount'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Reset_Shop, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };

    //2 逻辑运算 ==============================
    if (!redis_data.isNFTVip) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`不是vip！`);
        return;
    }

    if (redis_data.todayResetCount <= 0) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有VIP次数`);
        return;
    }

    redis_data.todayResetCount --;
    
    
    redis_data.shopDailyData = app.UserDB.getTodayShopArray();
    
    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Reset_Shop, Redis Set Error!`);
    }
}

// 函数 : @@@ Get_HandUp @@@
// 参数 : NFTVip_Status true/false
// 返回 : 
handler.Reset_Power = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    // if (undefined === msg.NFTVip_Status) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Setting_NFTVip, Parameter Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['last_power_time', 'power'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Reset_Power, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addItemInfo : []
    };


    //2 逻辑运算 ==============================
    let current_time =  app.UserDB.ToUTCData(Date.now());
    let t_temp = current_time - redis_data.last_power_time;
    if (t_temp < 1200000) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`暂无体力恢复!`);
        return;
    } else {
        redis_data.last_power_time = app.UserDB.ToUTCData(Date.now());//重置
        let temp_power = Math.floor(t_temp / 1200000);

        let add = temp_power;
        
        if ((redis_data.power + temp_power) > 30) {//20 +60 = 80 > 30
            add = 30 - redis_data.power;
        } 

        redis_data.power += add;

        retDatas.extraData.addItemInfo.push({
            itemId: 3,
            count: add
        });
    }
    //============2 逻辑运算 end ==================

    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Reset_Power, Redis Set Error!`);
    }
}
