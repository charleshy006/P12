let app = require('pomelo').app;

//通过唯一的userId去db查找玩家是否存在
exports.findOrderByUserId = async function(filter){
    try {
        let user = await app.OrderModel.findOne(filter);
        if (user === null) {
            return null;
        } else {
            return user.toJSON();
        }
    } catch (error) {
        console.error('Error finding user:', error.message);
        return null;
    }
};

//根据filter刷新玩家数据updateData，没有该玩家则新建
exports.updateOrCreateOrder = async function(filter, updateData){
    try {
        return await app.OrderModel.findOneAndUpdate(filter, updateData, { upsert: true, new: true });
    } catch (error) {
        console.error('updateOrCreateOrder:', error.message);
        return null;
    }
}


// 查询钻石接口
exports.Get_Recharge_List = async function(start_time, end_time) {
    try {
        let query = {};

        if (start_time!== null && end_time!== null) {
            // 如果 start_time 和 end_time 都不为空，根据时间范围筛选订单
            query.createdAt = {
                $gte: new Date(start_time),
                $lte: new Date(end_time)
            };
        }

        // 根据查询条件查找订单
        const orders = await app.OrderModel.find(query);

        let totalDiamond = 0;
        let rechargeList = [];

        orders.forEach(order => {
            const amount = order.UsdtCost || 0;
            totalDiamond += amount;
            const status = order.status;
            // 提取充值时间和金额信息添加到 rechargeList 中
            const rechargeTime = order.createdAt.toISOString().split('T')[0]; // 转换为 YYYY-MM-DD 格式
            rechargeList.push({
                rechargeTime,
                amount,
                status
            });
        });

        let msg = {
            "countAmount": totalDiamond,
            "rechargeList": rechargeList
        };

        return msg;
    } catch (error) {
        console.error('Error querying total diamond:', error.message);
        return null;
    }
};
// 查询单个玩家钻石接口
exports.Get_Recharge_Personal = async function(user_id, start_time, end_time, order_id, hash) {
    try {
        let query = {};

        // 添加 user_id 到查询条件
        if (user_id!== null) {
            query.user_id = user_id;
        }

        if (start_time!== null && end_time!== null) {
            // 如果 start_time 和 end_time 都不为空，根据时间范围筛选订单
            query.createdAt = {
                $gte: new Date(start_time),
                $lte: new Date(end_time)
            };
        }

        // 添加 order_id 到查询条件
        if (order_id!== null) {
            query.order_id = order_id;
        }

        // 添加 hash 到查询条件
        if (hash!== null) {
            query.order_hash = hash;
        }

        // 根据查询条件查找订单
        const orders = await app.OrderModel.find(query);

        let totalDiamond = 0;
        let rechargeList = [];

        orders.forEach(order => {
            const amount = order.UsdtCost || 0;
            totalDiamond += amount;
            const order_id = order.order_id;
            const hash = order.order_hash;
            const status = order.status;
            // 提取充值时间和金额信息添加到 rechargeList 中
            const rechargeTime = order.createdAt.toISOString().split('T')[0]; // 转换为 YYYY-MM-DD 格式
            rechargeList.push({
                rechargeTime,
                amount,
                order_id,
                hash,
                status,
            });
        });

        let msg = {
            "countAmount": totalDiamond,
            "rechargeList": rechargeList
        };

        return msg;
    } catch (error) {
        console.error('Error querying total diamond:', error.message);
        return null;
    }
};


// 查询钻石接口
exports.Get_Recharge_Replenishment = async function(user_id, start_time, end_time, order_id, hash, status) {
    try {
        let query = {};

        // 添加 user_id 到查询条件
        if (user_id!== null) {
            query.user_id = user_id;
        }

        if (start_time!== null && end_time!== null) {
            // 如果 start_time 和 end_time 都不为空，根据时间范围筛选订单
            query.createdAt = {
                $gte: new Date(start_time),
                $lte: new Date(end_time)
            };
        }

        // 添加 order_id 到查询条件
        if (order_id!== null) {
            query.order_id = order_id;
        }

        // 添加 hash 到查询条件
        if (hash!== null) {
            query.order_hash = hash;
        }

        // 添加 hash 到查询条件
        if (status!== null) {
            query.status = status;
        }


        // 根据查询条件查找订单
        const orders = await app.OrderModel.find(query);

        let totalDiamond = 0;
        let rechargeList = [];

        orders.forEach(order => {
            const amount = order.UsdtCost || 0;
            totalDiamond += amount;
            const order_id = order.order_id;
            const hash = order.order_hash;
            const status = order.status;
            // 提取充值时间和金额信息添加到 rechargeList 中
            const rechargeTime = order.createdAt.toISOString().split('T')[0]; // 转换为 YYYY-MM-DD 格式
            rechargeList.push({
                rechargeTime,
                amount,
                order_id,
                hash,
                status
            });
        });

        let msg = {
            "countAmount": totalDiamond,
            "rechargeList": rechargeList
        };

        return msg;
    } catch (error) {
        console.error('Error querying total diamond:', error.message);
        return null;
    }
};