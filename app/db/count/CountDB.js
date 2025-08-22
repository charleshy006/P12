let app = require('pomelo').app;

//通过唯一的userId去db查找玩家是否存在
exports.findCountByUserId = async function(filter){
    try {
        let user = await app.CountModel.findOne(filter);
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
exports.updateOrCreateCount = async function(filter, updateData){
    try {
        return await app.CountModel.findOneAndUpdate(filter, updateData, { upsert: true, new: true });
    } catch (error) {
        console.error('updateOrCreateCount:', error.message);
        return null;
    }
}

