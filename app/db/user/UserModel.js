const mongoose= require('../mongodb');
const {app} = require("pomelo");

let User = {
    //String
    user_id: {type: String, required: true},//用户表唯一
    invite_id: {type: String, required: false},//用户表唯一
    //Boolen
    is_sign: {type: Boolean, default: false},//是否签到
    isNFTVip:{type: Boolean, default: false}, // 是否是nft
    isInviteStatus:{type: Boolean, default: false}, // 是否invite
    //Number
    current_time: {type: Number, default: Date.now()},//当前时间
    last_login_time: {type: Number, default: Date.now()},//上次登陆时间
    last_hand_up_time: {type: Number, default: Date.now()},//上次挂机领取时间
    last_power_time: {type: Number, default: Date.now()},//上次挂机领取时间
    invite_number:{type: Number, default: 0}, // 邀请人数
    day:{type: Number, default: 0}, // 签到第几天
    
    
    level:{type: Number, default: 1},//玩家打到了多少关
    game_gold:{type: Number, default: 0},//玩家打到了多少关
}

const UserSchema = new mongoose.Schema(User, { timestamps: true });
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
