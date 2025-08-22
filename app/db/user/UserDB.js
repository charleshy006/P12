const _ = require("underscore");
let app = require('pomelo').app;

//通过唯一的userId去db查找玩家是否存在
exports.findUserByUserId = async function(filter){
    try {
        const data = await app.UserModel.findOne(filter);
        if (data === null) {
            return null;
        } else {
            let user = data.toJSON();
            delete user._id; // 删除 _id 字段
            delete user.__v; // 删除 __v 字段（如果存在）
            delete user.createdAt;
            delete user.updatedAt;
            
            return user;
        }
    } catch (error) {
        console.error('Error finding user:', error.message);
        return null;
    }
};

//根据filter刷新玩家数据updateData，没有该玩家则新建
exports.updateOrCreateUser = async function(filter, updateData){
    try {
        await app.UserModel.findOneAndUpdate(filter, updateData, { upsert: true, new: true });
        return true;
    } catch (error) {
        console.error('Error updating or creating user:', error.message);
        return false;
    }
}

exports.searchUsers = async function(){

    try {
        const users = await app.UserModel.find({}, 'user_id gold');
        return (users.filter(user => user && user.user_id!== null && user.user_id!== undefined && user.user_id!== "").map(user => ({
            score: user.gold ,
            value: user.user_id.toString(),
        })));

    } catch (error) {
        console.error('searchUsers', error.message);
        return null;
    }
}
// // 统计服务器的用户数量
// exports.Get_Analysis_List = async function(start_time, end_time) {
//     try {
//         let query = {};
//
//         if (start_time!== null && end_time!== null) {
//             // 如果 start_time 和 end_time 都不为空，根据时间范围筛选订单
//             query.createdAt = {
//                 $gte: new Date(start_time),
//                 $lte: new Date(end_time)
//             };
//         }
//
//         // 根据查询条件查找用户
//         const users = await app.UserModel.find(query);
//
//         // 统计总用户数量
//         let countUsers = users.length;
//
//         // 用于存储每天的分析数据
//         let analysisList = [];
//
//         // 存储每天的日期，避免重复计算
//         const dateSet = new Set();
//         users.forEach(user => {
//             const createTime = user.createdAt.toISOString().split('T')[0];
//             dateSet.add(createTime);
//         });
//
//         // 遍历每天的日期，计算各项指标
//         for (const date of dateSet) {
//             // 获取当天 0 点的时间戳
//             const currentDate = new Date(date);
//             const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
//             const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0).getTime();
//
//             // 计算当日新增用户数（假设 newUsers 数组存储当天新增用户）
//             const newUsers = users.filter(user => {
//                 const userCreateTime = user.createdAt.getTime();
//                 return userCreateTime >= startOfDay && userCreateTime < endOfDay;
//             });
//             const dnu = newUsers.length;
//
//             // 计算当日活跃用户数
//             const dauUsers = await app.UserDB.UsersLoggedInInOneDay(date);
//             const dau = dauUsers.length;
//
//             // 计算次日留存率
//             const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
//             const oneDayAgoStart = new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate()).getTime();
//             const oneDayAgoEnd = new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate() + 1, 0, 0, 0).getTime();
//             const usersOneDayAgo = newUsers.filter(user => {
//                 const userLastLoginTime = user.last_login_time;
//                 return userLastLoginTime >= oneDayAgoStart && userLastLoginTime < oneDayAgoEnd;
//             });
//             const oneday = usersOneDayAgo.length / newUsers.length || 0;
//
//             // 计算三日留存率
//             const threeDaysAgo = new Date(currentDate.getTime() - 72 * 60 * 60 * 1000);
//             const threeDaysAgoStart = new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate()).getTime();
//             const threeDaysAgoEnd = new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate() + 1, 0, 0, 0).getTime();
//             const usersThreeDaysAgo = newUsers.filter(user => {
//                 const userLastLoginTime = user.last_login_time;
//                 return userLastLoginTime >= threeDaysAgoStart && userLastLoginTime < threeDaysAgoEnd;
//             });
//             const threeday = usersThreeDaysAgo.length / newUsers.length || 0;
//
//             // 计算七日留存率
//             const sevenDaysAgo = new Date(currentDate.getTime() - 168 * 60 * 60 * 1000);
//             const sevenDaysAgoStart = new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate()).getTime();
//             const sevenDaysAgoEnd = new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate() + 1, 0, 0, 0).getTime();
//             const usersSevenDaysAgo = newUsers.filter(user => {
//                 const userLastLoginTime = user.last_login_time;
//                 return userLastLoginTime >= sevenDaysAgoStart && userLastLoginTime < sevenDaysAgoEnd;
//             });
//             const sevenday = usersSevenDaysAgo.length / newUsers.length || 0;
//
//             analysisList.push({
//                 createTime: date,
//                 dau,
//                 dnu,
//                 oneday,
//                 threeday,
//                 sevenday
//             });
//         }
//
//         let msg = {
//             "countUsers": countUsers,
//             "analysisList": analysisList
//         };
//
//         return msg;
//     } catch (error) {
//         console.error('Error querying user analysis:', error.message);
//         return null;
//     }
// };
exports.Get_Analysis_List = async function (start_time, end_time) {
    try {
        let query = {};
        let analysisList = [];

        // 获取开服时间
        const startServerTime = new Date(app.Configs.StartServerTime);
        const now = new Date();

        // 处理 start_time 和 end_time
        if (!start_time || !end_time) {
            start_time = startServerTime;
            end_time = now;
        } else {
            start_time = new Date(start_time);
            end_time = new Date(end_time);

            // 确保 start_time 不小于开服时间
            if (start_time < startServerTime) {
                start_time = startServerTime;
            }

            // 确保 end_time 不大于当前时间
            if (end_time > now) {
                end_time = now;
            }
        }

        // 构建查询条件
        query.createdAt = {
            $gte: start_time,
            $lte: end_time
        };

        const allCounts = await app.CountModel.find(query).sort({ createdAt: 1 });
        for (const count of allCounts) {
            const createTime = count.createdAt;
            const dau = count.dau_count_number;
            const dnu = count.dnu_count_number;

            let oneday = -1;
            // 计算第二天的日期
            const nextDay = new Date(createTime);
            nextDay.setDate(nextDay.getDate() + 1);
            const startOfNextDay = new Date(nextDay);
            startOfNextDay.setHours(0, 0, 0, 0);
            const endOfNextDay = new Date(nextDay);
            endOfNextDay.setHours(23, 59, 59, 999);
            // 构建查询第二天数据的条件
            const nextDayQuery = {
                createdAt: {
                    $gte: startOfNextDay,
                    $lt: endOfNextDay
                }
            };

            // 查询第二天的数据
            const nextDayCount = await app.CountModel.findOne(nextDayQuery);
            if (nextDayCount) {
                let count_number = 0;
                for (const dnu_id of count.dnu_count_list) {
                    if (nextDayCount.dau_count_list.includes(dnu_id)) {
                        count_number++;
                    }
                }

                oneday = count_number / count.dnu_count_number;
            }

            // 查询第四天的数据
            let threeday = -1;

            // 计算第四天的日期
            const nextDay3 = new Date(createTime);
            nextDay3.setDate(nextDay3.getDate() + 3);
            const startOfNextDay3 = new Date(nextDay3);
            startOfNextDay3.setHours(0, 0, 0, 0);
            const endOfNextDay3 = new Date(nextDay3);
            endOfNextDay3.setHours(23, 59, 59, 999);
            // 构建查询第四天数据的条件
            const nextDayQuery3 = {
                createdAt: {
                    $gte: startOfNextDay3,
                    $lt: endOfNextDay3
                }
            };

            // 查询第四天的数据
            const nextDayCount3 = await app.CountModel.findOne(nextDayQuery3);
            if (nextDayCount3) {
                let count_number = 0;
                for (const dnu_id of count.dnu_count_list) {
                    if (nextDayCount3.dau_count_list.includes(dnu_id)) {
                        count_number++;
                    }
                }

                threeday = count_number / count.dnu_count_number;
            }

            // 查询第七天的数据
            let sevenday = -1;

            // 计算第七天的日期
            const nextDay7 = new Date(createTime);
            nextDay7.setDate(nextDay7.getDate() + 7);
            const startOfNextDay7 = new Date(nextDay7);
            startOfNextDay7.setHours(0, 0, 0, 0);
            const endOfNextDay7 = new Date(nextDay7);
            endOfNextDay7.setHours(23, 59, 59, 999);
            // 构建查询第七天数据的条件
            const nextDayQuery7 = {
                createdAt: {
                    $gte: startOfNextDay7,
                    $lt: endOfNextDay7
                }
            };

            // 查询第七天的数据
            const nextDayCount7 = await app.CountModel.findOne(nextDayQuery7);
            if (nextDayCount7) {
                let count_number = 0;
                for (const dnu_id of count.dnu_count_list) {
                    if (nextDayCount7.dau_count_list.includes(dnu_id)) {
                        count_number++;
                    }
                }

                sevenday = count_number / count.dnu_count_number;
            }

            // 添加当天的数据
            analysisList.push({
                startOfDay: createTime.toISOString().split('T')[0],
                dau,
                dnu,
                oneday,
                threeday,
                sevenday
            });
        }

        // 返回统计结果
        return {
            analysisList
        };
    } catch (error) {
        console.error('Error querying user analysis:', error.message);
        return { countUsers: 0, analysisList: [] };
    }
};
exports.Get_Analysis_Listold = async function (start_time, end_time) {
    try {
        let query = {};
        const now = new Date();
        let dateSet = new Set();

        if (start_time === null || end_time === null) {
            // 查询所有数据，找到最早的用户创建时间作为开始日期
            const allUsers = await app.UserModel.find({});
            if (allUsers.length === 0) {
                return { countUsers: 0, analysisList: [] }; // 如果没有用户，直接返回空数据
            }

            const minDate = new Date(Math.min(...allUsers.map(user => user.createdAt.getTime())));
            const maxDate = now;
            let currentDate = minDate;
            while (currentDate <= maxDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                dateSet.add(dateStr);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else {
            // 根据传入的时间范围查询用户数据
            const startDate = new Date(start_time);
            const endDate = new Date(end_time);
            query.createdAt = { $gte: startDate, $lte: endDate };

            let currentDate = new Date(start_time);
            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                dateSet.add(dateStr);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        // 获取符合条件的用户
        const users = await app.UserModel.find(query);
        let countUsers = users.length;

        // 用于存储每天的分析数据
        let analysisList = [];

        // 遍历日期集合，统计每日指标
        for (const date of dateSet) {
            const currentDate = new Date(date);
            const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)).getTime();
            const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)).getTime();

// 新增用户数（DNU）
            const newUsers = users.filter(user => user.createdAt.getTime() >= startOfDay && user.createdAt.getTime() <= endOfDay);
            const dnu = newUsers.length;

// 活跃用户数（DAU）
// 计算当天活跃的用户（更新过的用户）
            const activeUsers = users.filter(user => user.updatedAt && user.updatedAt >= startOfDay && user.updatedAt <= endOfDay);

// 取出当天更新的用户，并去掉已新增的用户（根据用户ID去重）
            const dauSet = new Set(activeUsers.map(user => user.id)); // 用 Set 去重
            newUsers.forEach(user => dauSet.add(user.id)); // 添加新增用户的ID，不重复添加

// DAU = 活跃用户 + 新增用户，但不重复计算新增用户
            const dau = dauSet.size;

            // 次日留存率
            const nextDayStart = new Date(currentDate.setDate(currentDate.getDate() + 1)).setHours(0, 0, 0, 0);
            const nextDayEnd = new Date(currentDate).setHours(23, 59, 59, 999);
            const oneDayRetainedUsers = newUsers.filter(user => user.updatedAt >= nextDayStart && user.updatedAt <= nextDayEnd);
            const oneday = dnu > 0 ? oneDayRetainedUsers.length / dnu : 0;

            // 三日留存率
            const threeDayEnd = new Date(currentDate.setDate(currentDate.getDate() + 3)).setHours(23, 59, 59, 999);
            const threeDayRetainedUsers = newUsers.filter(user => user.updatedAt >= startOfDay && user.updatedAt <= threeDayEnd);
            const threeday = dnu > 0 ? threeDayRetainedUsers.length / dnu : 0;

            // 七日留存率
            const sevenDayEnd = new Date(currentDate.setDate(currentDate.getDate() + 7)).setHours(23, 59, 59, 999);
            const sevenDayRetainedUsers = newUsers.filter(user => user.updatedAt >= startOfDay && user.updatedAt <= sevenDayEnd);
            const sevenday = dnu > 0 ? sevenDayRetainedUsers.length / dnu : 0;

            // 添加当天的数据
            analysisList.push({
                createTime: date,
                dau,
                dnu,
                oneday,
                threeday,
                sevenday
            });
        }

        // 返回统计结果
        return {
            countUsers,
            analysisList
        };

    } catch (error) {
        console.error('Error querying user analysis:', error.message);
        return { countUsers: 0, analysisList: [] };
    }
};
// 查询 1 天时内登录过的玩家
exports.UsersLoggedInInOneDay = async function(dateStr) {
    try {
        const date = new Date(dateStr + "T00:00:00");
// 获取时间戳
        const timestamp = date.getTime();
        // 计算 1 天前的时间戳
        const twentyFourHoursAgo = date - 24 * 60 * 60 * 1000;
        // 查询 last_login_time 大于等于1 天前时间戳的玩家记录
        const users = await app.UserModel.find({ last_login_time: { $gte: twentyFourHoursAgo } });
        // 处理查询结果，只提取 user_id 字段
        const formattedUsers = users.map(user => {
            return user.user_id;
        });
        return formattedUsers;
    } catch (error) {
        console.error('Error finding users logged in within 24 hours:', error.message);
        return null;
    }
};

exports.UsersLoggedInInThreeDay = async function() {
    try {
        // 计算 3 天前的时间戳
        const seventyTwoHoursAgo = app.UserDB.ToUTCData(Date.now()) - 72 * 60 * 60 * 1000;
        // 查询 last_login_time 大于等于 3 天前时间戳的玩家记录
        const users = await app.UserModel.find({ last_login_time: { $gte: seventyTwoHoursAgo } });
        // 处理查询结果，只提取 user_id 字段
        const formattedUsers = users.map(user => {
            return user.user_id;
        });
        return formattedUsers;
    } catch (error) {
        console.error('Error finding users logged in within 72 hours:', error.message);
        return null;
    }
};

// 查询 7 天内登录过的玩家
exports.UsersLoggedInInSevenDay = async function() {
    try {
        // 计算 7 天前的时间戳
        const seventyTwoHoursAgo = app.UserDB.ToUTCData(Date.now()) - 168 * 60 * 60 * 1000;
        // 查询 last_login_time 大于等于 7 天前时间戳的玩家记录
        const users = await app.UserModel.find({ last_login_time: { $gte: seventyTwoHoursAgo } });
        // 处理查询结果，只提取 user_id 字段
        const formattedUsers = users.map(user => {
            return user.user_id;
        });
        return formattedUsers;
    } catch (error) {
        console.error('Error finding users logged in within 72 hours:', error.message);
        return null;
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////
//是否为同一天
exports.ToUTCData = function(currentTime) {
    return currentTime;
    // return currentTime - (8 * 60 * 60 * 1000);
}


//是否为同一天
exports.checkOneDay = function(currentTime, lastLoginTime) {
    // 将时间戳转换为 UTC 日期对象
    const date1 = new Date(currentTime);
    const date2 = new Date(lastLoginTime);
    console.info(date1)
    console.info(date2)
    // 比较 UTC 日期的年、月、日是否完全相同
    return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
    );
}


function generateRandomItem(type) { // 固定值（priceType与传入的type保持一致）
    const itemId = 8;
    const buyTimes = 1;
    const priceType = type; // priceType等于传入的type
// 1. 随机品质 (权重 [50,40,10] 对应 quality 1,2,3)
    const qualityWeights = [50, 40, 10];
    const totalQualityWeight = qualityWeights.reduce ((a, b) => a + b, 0);
    let random = Math.random () * totalQualityWeight;
    let quality;
    if (random < qualityWeights[0]) {
        quality = 1;
    } else if (random < qualityWeights[0] + qualityWeights[1]) {
        quality = 2;
    } else {
        quality = 3;
    }
// 2. 根据品质随机数量
    let count;
    switch (quality) {
        case 1:
            count = [5, 10, 20][Math.floor (Math.random () * 3)];
            break;
        case 2:
            count = [3, 5][Math.floor (Math.random () * 2)];
            break;
        case 3:
            count = 1;
            break;
    }
// 3. 根据品质随机 toolId
    let toolId;
    switch (quality) {
        case 1:
            toolId = [1001, 1002, 1003, 1008][Math.floor (Math.random () * 4)];
            break;
        case 2:
            toolId = [1004, 1005, 1006, 1010][Math.floor (Math.random () * 4)];
            break;
        case 3:
            toolId = [1007, 1009, 1011, 1012][Math.floor (Math.random () * 4)];
            break;
    }
// 4. 随机折扣 (权重 [5,10,20,65] 对应折扣 [5,7,9,10])
    const discountWeights = [5, 10, 20, 65];
    const totalDiscountWeight = discountWeights.reduce ((a, b) => a + b, 0);
    random = Math.random () * totalDiscountWeight;
    let discount;
    if (random < discountWeights[0]) {
        discount = 5;
    } else if (random < discountWeights[0] + discountWeights[1]) {
        discount = 7;
    } else if (random < discountWeights[0] + discountWeights[1] + discountWeights[2]) {
        discount = 9;
    } else {
        discount = 10;
    }
// 5. 根据 priceType（即 type）选择价格池并计算价格
    let basePrices;
    if (priceType === 1) {
        basePrices = [5, 30, 180]; //type=2 时的价格池
    } else if (priceType === 2) {
        basePrices = [1.2, 7, 54]; //type=3 时的价格池
    } else {
// 可选：处理未定义的 type，这里默认使用 type=2 的价格池
        basePrices = [5, 30, 180];
    }
    const basePrice = basePrices [quality - 1];
    const price = basePrice * count * (discount / 10);
// 返回生成的对象
    return {
        itemId,
        count,
        toolId,
        buyTimes,
        priceType,
        price: Number (price.toFixed (2)), // 保留两位小数（处理 type=3 的小数价格）
        discount
    };
}

exports.getTodayShopArray = function() {
    console.info("getTodayShopArray")
    let temp_type = [999, 1,1,2,2,2]
    let temp_list = {};

    for (let i = 0; i < temp_type.length; i ++) {
        if (temp_type[i] === 999) {
            temp_list[i+1] = { "itemId": 3, "count": 100, "toolId": -1, "buyTimes": 1, "priceType": 999, "price": 100, "discount": 10 }
        } else {
            temp_list[i+1] = generateRandomItem(temp_type[i]);
        }
    }

    return temp_list;
}


//重置数据
exports.resetInfo = function(user){
    console.info("[ResetInfo Emit] form User :", user.user_id);
    // user.buySilverTimes = 0;
    user.last_login_time=app.UserDB.ToUTCData(Date.now());
    //如果前一天已经签到  day++ 且重置签到状态
    if (user.is_sign) {
        user.day ++;
        user.is_sign = false;
    }
    if (user.day > 7) {
        user.day = 1;
    }

    user.saodangcount=5;	//免费扫荡次数（第二天重置） 普通/vip每天 3次 
    user.addPowerTime=5;		//增加体力次数（第二天重置） 普通/vip每天 5次
    user.videoAddPowerTime=1;	//权益增加体力次数（第二天重置）【VIP】每天 1次 
    user.todayResetCount=20;		//商城的刷新次数 （第二天重置） 【VIP】每天 20次 
    user.box1BuyCount=1;		//普通礼盒权益开打次数（第二天重置） 【VIP】每天 1次 
    user.box2BuyCount=1;		//精致礼盒权益打开次数（第二天重置）【VIP】每天 1次 
    user.videoBuyGoldCount=1;		//权益获得金币次数 （第二天重置）【VIP】每天 1次 
    user.todayBuyDiamondCount=1;	//权益获得钻石次数 （第二天重置）【VIP】每天 1次 
    user.shopDailyData = app.UserDB.getTodayShopArray();

    return user;
}


//玩家登陆
exports.ReloadUser = async function(user, type){
    let loginFlag = 1;
    
    // //拿到db的老数据user进行处理
    let curTime = app.UserDB.ToUTCData(Date.now());
    let lastTime = user.last_login_time;
    //是否为隔天
    if (!app.UserDB.checkOneDay(curTime, lastTime)) {
        user = app.UserDB.resetInfo(user);
    } else {
        //没有隔天体力需要单独处理下
        user.last_login_time=app.UserDB.ToUTCData(Date.now());
    }
    user.current_time = app.UserDB.ToUTCData(Date.now());


    
    //
    // //确定没有其他宝箱在开
    // let open_flag = -1;
    // let time_remaining = 0;
    // for (let i = 0; i < 4; i ++) {//请求 获得宝箱 且获取状态
    //     if (user.hand_up_bonus[i].box_status === 2) {
    //         open_flag = i;
    //         break;
    //     }
    // }
    // //计算该宝箱剩余时间
    // if (open_flag !== -1) {
    //     let nowtime = Date.now();
    //     let lasttime = user.hand_up_bonus[open_flag].box_open_time;
    //     let time_use = nowtime - lasttime;
    //     time_remaining = app.Configs.config_quality_times[user.hand_up_bonus[open_flag].box_quality].box_time - time_use;
    //     if (time_remaining > 0) {
    //         //还在继续
    //         user.hand_up_bonus[open_flag].box_cur_time = time_remaining;
    //     } else {
    //         //已经完成了
    //         user.hand_up_bonus[open_flag].box_cur_time = 0;
    //         user.hand_up_bonus[open_flag].box_status = 3;//宝箱完成了
    //     }
    // }
    
    return {user,  type, loginFlag};
}