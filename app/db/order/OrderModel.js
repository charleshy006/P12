const mongoose= require('../mongodb');
const {app} = require("pomelo");

let Order = {
    order_id: {type: String, required: true},
    user_id: {type: String, default: ""},
    order_hash: {type: String, default: ""},
    recharge_id: {type: Number, default: 0},
    UsdtCost: {type: Number, default: 0},
    status: {type: Number, default: 1},//1待审核，2成功，3失败
    is_success: {type: Boolean, default: false},//
    timestamp: {type: Number, default: 0},//当前时间
}

const OrderSchema = new mongoose.Schema(Order, { timestamps: true });
const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
