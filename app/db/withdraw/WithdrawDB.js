let app = require('pomelo').app;

//通过唯一的userId去db查找玩家是否存在
exports.findWithdrawByUserId = async function(filter){
    try {
        let user = await app.WithdrawModel.findOne(filter);
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
exports.updateOrCreateWithdraw = async function(filter, updateData){
    try {
        return await app.WithdrawModel.findOneAndUpdate(filter, updateData, { upsert: true, new: true });
    } catch (error) {
        console.error('updateOrCreateWithdraw:', error.message);
        return null;
    }
}


// 查询钻石接口
exports.Withdraw_Order = async function(user_id, start_time, end_time, status) {
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
        
        // 添加 hash 到查询条件
        if (status!== null) {
            query.status = status;
        }


        // 根据查询条件查找订单
        const withdraws = await app.WithdrawModel.find(query);

        let totalUsdt = 0;
        let withdrawList = [];

        withdraws.forEach(withdraw => {
            const withdraw_num = withdraw.withdraw_num || 0;
            totalUsdt += withdraw_num;
            const withdraw_id = withdraw.withdraw_id;
            const hash = withdraw.withdraw_hash;
            const status = withdraw.status;
            const user_id = withdraw.user_id;
            // 提取充值时间和金额信息添加到 rechargeList 中
            const withdrawTime = withdraw.createdAt.toISOString().split('T')[0]; // 转换为 YYYY-MM-DD 格式
            withdrawList.push({
                user_id,
                withdrawTime,
                withdraw_num,
                withdraw_id,
                hash,
                status
            });
        });

        let msg = {
            "totalUsdt": totalUsdt,
            "withdrawList": withdrawList
        };

        return msg;
    } catch (error) {
        console.error('Error querying total diamond:', error.message);
        return null;
    }
};