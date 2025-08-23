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
    
    
    game_scre_lishi:{type: Number, default: 0}, //历史最高得分
    game_gold:{type: Number, default: 0},//游戏金币
    game_medal:{type: Number, default: 0},//游戏奖章 用于购买宠物
    score:{type: Number, default: 0},//玩家当前分数
    Level:{type: Number, default: 1},//玩家打到了多少关
    skill_1:{type: Number, default: 3},//技能1数量 ..普通导弹
    skill_2:{type: Number, default: 4},//技能2数量 ..寒冰导弹
    hedan:{type: Number, default: 3},//核弹
    shield:{type: Number, default: 1},//防护力
    power:{type: Number, default: 1},//攻击力
    pet:{type: String, default: ""},//使用的僚机 ""为无 "pet_1"为有 1,2,3,4,5
    planeName:{type: Array, default: app.Configs.config_planeName},//等级
    petName:{type: Array, default: app.Configs.config_planeName},//等级
    config_PlaneInfo:{type: mongoose.Schema.Types.Mixed, default: app.Configs.config_PlaneInfo},//等级
    config_WeaponInfo:{type: mongoose.Schema.Types.Mixed, default: app.Configs.config_WeaponInfo},//等级
    config_PetInfo:{type: mongoose.Schema.Types.Mixed, default: app.Configs.config_PetInfo},//等级
    
}

const UserSchema = new mongoose.Schema(User, { timestamps: true });
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
