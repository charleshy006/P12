const mongoose= require('../mongodb');

let Count = {
    count_id: {type: String, required: true},// timestamp
    dau_count_number: {type: Number, default: 0},//login counts
    dnu_count_number: {type: Number, default: 0},//login counts
    dau_count_list: { type: Array,default: []},//user_id list
    dnu_count_list: { type: Array,default: []},//user_id list
}

const CountSchema = new mongoose.Schema(Count, { timestamps: true });
const CountModel = mongoose.model('Count', CountSchema);
module.exports = CountModel;
