const mongoose= require('../mongodb');
const {app} = require("pomelo");

let Withdraw = {
    withdraw_id: {type: String, required: true},//提现号 user_id + timestamp
    user_id: {type: String, default: ""},
    withdraw_hash: {type: String, default: ""},//提现hash
    withdraw_num: {type: Number, default: 0},//提现金额
    fee: {type: Number, default: 0.1},//手续费
    status: {type: Number, default: 1},//1待审核，2成功，3失败
    timestamp: {type: Number, default: 0},//当前时间
}

const WithdrawSchema = new mongoose.Schema(Withdraw, { timestamps: true });
const WithdrawModel = mongoose.model('Withdraw', WithdrawSchema);
module.exports = WithdrawModel;
