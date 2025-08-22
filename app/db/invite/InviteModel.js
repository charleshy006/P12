const mongoose= require('../mongodb');

let Invite = {
    user_id: {type: String, required: true},
    InvNumber: {type: Number, default: 1},
    finishNumber: {type: Number, default: 0},
    nickName: {type: String, default: ""},
    be_invite_list: { type: Array,default: []},//邀请列表
}

const InviteSchema = new mongoose.Schema(Invite, { timestamps: true });
const InviteModel = mongoose.model('Invite', InviteSchema);
module.exports = InviteModel;
