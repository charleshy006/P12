const mongoose= require('../mongodb');
const {app} = require("pomelo");

let User = {
    user_id: {type: String, required: true},//用户表唯一
    invite_id: {type: String, required: false},//用户表唯一
    is_sign: {type: Boolean, default: false},//是否签到
    isNFTVip:{type: Boolean, default: false}, // 是否是nft
    isInviteStatus:{type: Boolean, default: false}, // 是否invite
    current_time: {type: Number, default: Date.now()},//当前时间
    last_login_time: {type: Number, default: Date.now()},//上次登陆时间
    last_hand_up_time: {type: Number, default: Date.now()},//上次挂机领取时间
    last_power_time: {type: Number, default: Date.now()},//上次挂机领取时间

    invite_number:{type: Number, default: 0}, // 邀请人数

    level:{type: Number, default: 1},//等级
    levelWave:{type: Number, default: 0},//第几波
    dayScoreNum:{type: Number, default: 0},//每日任务 积分总和
    dayBoxData: { type: mongoose.Schema.Types.Mixed,default: app.Configs.config_box_data},//
    dailyTask: { type: mongoose.Schema.Types.Mixed,default: app.Configs.config_daily_task},//
    roleData: { type: mongoose.Schema.Types.Mixed,default: app.Configs.config_role_data},//
    levelBoxData: { type: mongoose.Schema.Types.Mixed,default: {1:[0,0,0]}},//
    shopDailyData: { type: mongoose.Schema.Types.Mixed,default: app.Configs.config_shop_daily_data},//
    toolData: { type: mongoose.Schema.Types.Mixed,default: app.Configs.config_equip_save_data},//pos 位置（0，1，2，3，4，5，6，7）

    power:{type: Number, default: 20},
    maxPower:{type: Number, default: 20},
    accumulate_u:{type: Number, default: 0},
    gold:{type: Number, default: 0},
    diamond:{type: Number, default: 0},
    score:{type: Number, default: 0},
    addPowerTime:{type: Number, default: 5},
    videoAddPowerTime:{type: Number, default: 1},
    day:{type: Number, default: 1},
    saodangcount:{type: Number, default: 5},
    todayResetCount:{type: Number, default: 20},
    boxExp:{type: Number, default: 0},
    boxLevel:{type: Number, default: 1},
    box1BuyCount:{type: Number, default: 1},
    box1BuyTotalCount:{type: Number, default: 1},
    box2BuyCount:{type: Number, default: 1},
    box2BuyTotalCount:{type: Number, default: 1},
    videoBuyGoldCount:{type: Number, default: 1},
    todayBuyDiamondCount:{type: Number, default: 1},

    inviteTotalList: { type: mongoose.Schema.Types.Mixed,default: app.Configs.config_invite_info},//
    task_infos: { type: mongoose.Schema.Types.Mixed,default: app.Configs.config_task_info},//
    payfirst: { type: Array,default: [1,1,0,0,0,0,0,0,0]},//
    payftodayShopArrayirst: { type: Array,default: [{shopId: 8, richType: 1, canBuyCount: 1, discount: 0.5, price: 30}]},//
}

const UserSchema = new mongoose.Schema(User, { timestamps: true });
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
