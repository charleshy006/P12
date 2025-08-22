const {app} = require("pomelo");

module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;
// 函数 : @@@ 充值 @@@
// 参数 : item_type (1-4)
// 返回 : 
handler.Add_Item_By_Type = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.add_items) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Add_Item_By_Type, Parameter Error!`);
        return;
    }

    
    //需要修改的userdata
    let fields = ['diamond', 'gold', 'power', 'techP', 'score', 'bag'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Add_Item_By_Type, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {

    };

    //2 逻辑运算 ==============================
    let equip_array = [];
    for(let item_id in msg.add_items) {
        if (msg.add_items[item_id].item_id === 101) {
            redis_data.diamond += msg.add_items[item_id].item_num
            if (redis_data.diamond < 0) {
                redis_data.diamond = 0;
            }
        } else if (msg.add_items[item_id].item_id === 201) {
            redis_data.gold += msg.add_items[item_id].item_num
            if (redis_data.gold < 0) {
                redis_data.gold = 0;
            }
        } else if (msg.add_items[item_id].item_id === 301) {
            redis_data.power += msg.add_items[item_id].item_num
            if (redis_data.power < 0) {
                redis_data.power = 0;
            }
        } else if (msg.add_items[item_id].item_id === 401) {
            redis_data.techP += msg.add_items[item_id].item_num
            if (redis_data.techP < 0) {
                redis_data.techP = 0;
            }
        } else if (msg.add_items[item_id].item_id === 501) {
            redis_data.score += msg.add_items[item_id].item_num
            if (redis_data.score < 0) {
                redis_data.score = 0;
            }
        } else {
            equip_array.push(msg.add_items[item_id].item_id);
        }
    }
    
    if (equip_array.length > 0) {
        for (let equip_id of equip_array) {
            const keys = Object.keys(redis_data.bag);
            const maxKey = keys.length > 0 ? Math.max(...keys.map(Number)) : 0;
            const newKey = (maxKey + 1).toString();
            redis_data.bag[newKey] = equip_id;
            // console.log(`已插入装备 ${equip_id}，新键名为 ${newKey}`);
        }
    }
    //============2 逻辑运算 end ==================


    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Add_Item_By_Type, Redis Set Error!`);
    }
}