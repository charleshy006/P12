let app = require('pomelo').app;

//通过唯一的userId去db查找玩家是否存在
exports.findInviteByUserId = async function(filter){
    try {
        let user = await app.InviteModel.findOne(filter);
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
exports.updateOrCreateInvite = async function(filter, updateData){
    try {
        return await app.InviteModel.findOneAndUpdate(filter, updateData, { upsert: true, new: true });
    } catch (error) {
        console.error('updateOrCreateInvite:', error.message);
        return null;
    }
}

//按gold+total排行
exports.rankBySortByIvNum = async function(filter){
    try {
        return await app.InviteModel.find(filter).sort({ InvNumber: -1 }).limit(30);
    } catch (error) {
        console.error('rankBySortByIvNum:', error.message);
        return null;
    }

}

//按InvNumber排行
exports.getMyInvRank = async function(userInvNumber){
    try {
        return await app.InviteModel.countDocuments({ InvNumber: { $gt: userInvNumber } });
    } catch (error) {
        console.error('getMyInvRank', error.message);
        return null;
    }
}

