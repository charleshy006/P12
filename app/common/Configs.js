// ============REDIS CONF  START=================
exports.RedisOptions = {
	socket: {
		host: '127.0.0.1', // 根据实际情况修改主机地址
		port: 8899, // 根据实际情况修改端口号
	},
	password: 'Welcome01!' // 这里替换成实际的Redis密码
};
exports.Redis_DB = 4;
exports.RedisFather = {
	user_id: "1111111111",

	// 其他可选配置，如密码等
}
// ============REDIS CONF  END=================

// ============MONGO CONF  START=================
// exports.Mongo_URI = "mongodb://127.0.0.1:27017/CK_DB";
exports.Mongo_URI = "mongodb://mongo_game:Welcome01!@127.0.0.1:6677/CAPY_DB?authSource=admin";
// exports.Mongo_URI = "mongodb://mongo_game:Welcome01!@13.229.104.150:6677/CAPY_DB?authSource=admin";
// exports.Mongo_URI = "mongodb://root:Lovehouse123!@dds-zf8271f3a79232841823-pub.mongodb.kualalumpur.rds.aliyuncs.com:3717,dds-zf8271f3a79232842152-pub.mongodb.kualalumpur.rds.aliyuncs.com:3717/PJ_DB?authSource=admin";
// ============MONGO CONF  END=================

exports.AllChannelName = "AllPushChannel";

// Other Conf
exports.LoginTimeOut = (60 * 60) + 100;
// exports.LoginTimeOut = 10;
exports.StartServerTime = "2025-05-07 00:00:00.00";

//0 - -
//1 - - 
//2 - -
//3 通关奖励
//4 - -
//5 关键波 5/10/20
//6 - -	
//7 ，8， 9  关键波奖励
exports.config_level_info = {
	"1": ["1", "1.开心乐园", null, "1,200;5,1,13", null, "3,5,7", null, "1,100", "1,200;3,10", "2,100;5,1,16"],
	"2": ["2", "2.怪物来袭", null, "1,100;5,1,8", null, "5,7,10", null, "1,200", "1,400;3,10", "2,100;5,1,18"],
	"3": ["3", "3.保卫乐园", null, "1,100;5,1,8", null, "5,10,15", null, "1,300", "1,600;3,10", "2,100;5,1,20"],
	"4": ["4", "4.乐园战争", null, "1,100;5,1,8", null, "5,10,15", null, "1,400", "1,800;3,10", "2,100;5,1,22"],
	"5": ["5", "5.僵尸危机", null, "1,100;5,1,9;5,2,4", null, "5,10,15", null, "1,500", "1,1000;3,10", "2,100;5,1,24;5,2,1"],
	"6": ["6", "6.怪物入侵", null, "1,120;5,1,9;5,2,4", null, "5,10,15", null, "1,600", "1,1200;3,10", "2,100;5,1,26;5,2,3"],
	"7": ["7", "7.勇敢卡皮", null, "1,120;5,1,9;5,2,4", null, "5,10,15", null, "1,700", "1,1400;3,10", "2,100;5,1,28;5,2,5"],
	"8": ["8", "8.守护乐园", null, "1,120;5,1,9;5,2,4", null, "5,10,15", null, "1,800", "1,1600;3,10", "2,100;5,1,30;5,2,7"],
	"9": ["9", "9.争夺乐园", null, "1,120;5,1,9;5,2,4", null, "5,10,15", null, "1,900", "1,1800;3,10", "2,100;5,1,32;5,2,9"],
	"10": ["10", "10.乐园乱战", null, "1,140;5,1,9;5,2,4", null, "5,10,15", null, "1,1000", "1,2000;3,10", "2,100;5,1,34;5,2,11"],
	"11": ["11", "11.怪物异动", null, "1,140;5,1,9;5,2,4", null, "5,10,15", null, "1,1100", "1,2200;3,10", "2,100;5,1,36;5,2,13"],
	"12": ["12", "12.乐园异象", null, "1,140;5,1,10;5,2,5", null, "5,10,15", null, "1,1200", "1,2400;3,10", "2,100;5,1,38;5,2,15"],
	"13": ["13", "13.奋起反击", null, "1,140;5,1,10;5,2,5", null, "5,10,15", null, "1,1300", "1,2600;3,10", "2,100;5,1,40;5,2,17"],
	"14": ["14", "14.巅峰对决", null, "1,160;5,1,10;5,2,5", null, "5,10,15", null, "1,1400", "1,2800;3,10", "2,100;5,1,42;5,2,19"],
	"15": ["15", "15.无尽陷阱", null, "1,160;5,1,10;5,2,5", null, "5,10,15", null, "1,1500", "1,3000;3,10", "2,100;5,1,44;5,2,21"],
	"16": ["16", "16.乐园风波", null, "1,160;5,1,10;5,2,5", null, "5,10,15", null, "1,1600", "1,3200;3,10", "2,100;5,1,46;5,2,23"],
	"17": ["17", "17.神秘初现", null, "1,160;5,1,10;5,2,5", null, "5,10,15", null, "1,1700", "1,3400;3,10", "2,100;5,1,48;5,2,25"],
	"18": ["18", "18.战争前夕", null, "1,180;5,1,10;5,2,5", null, "5,10,15", null, "1,1800", "1,3600;3,10", "2,100;5,1,50;5,2,27"],
	"19": ["19", "19.九死一生", null, "1,180;5,1,11;5,2,6", null, "5,10,15", null, "1,1900", "1,3800;3,10", "2,100;5,1,52;5,2,29"],
	"20": ["20", "20.乐园追击", null, "1,180;5,1,11;5,2,6", null, "5,10,15", null, "1,2000", "1,4000;3,10", "2,100;5,1,54;5,2,31"],
	"21": ["21", "21.暗流涌动", null, "1,180;5,1,11;5,2,6", null, "5,10,15", null, "1,2100", "1,4200;3,10", "2,100;5,1,56;5,2,33"],
	"22": ["22", "22.重振旗鼓", null, "1,200;5,1,11;5,2,6", null, "5,10,15", null, "1,2200", "1,4400;3,10", "2,100;5,1,58;5,2,35"],
	"23": ["23", "23.整装待发", null, "1,200;5,1,11;5,2,6", null, "5,10,15", null, "1,2300", "1,4600;3,10", "2,100;5,1,60;5,2,37"],
	"24": ["24", "24.重返乐园", null, "1,200;5,1,11;5,2,6", null, "5,10,15", null, "1,2400", "1,4800;3,10", "2,100;5,1,62;5,2,39"],
	"25": ["25", "25.逐个击破", null, "1,200;5,1,11;5,2,6", null, "5,10,15", null, "1,2500", "1,5000;3,10", "2,100;5,1,64;5,2,41"],
	"26": ["26", "26.怪物袭击", null, "1,220;5,1,12;5,2,7", null, "5,10,15", null, "1,2600", "1,5200;3,10", "2,100;5,1,66;5,2,43"],
	"27": ["27", "27.势均力敌", null, "1,220;5,1,12;5,2,7", null, "5,10,15", null, "1,2700", "1,5400;3,10", "2,100;5,1,68;5,2,45"],
	"28": ["28", "28.首领登场", null, "1,220;5,1,12;5,2,7", null, "5,10,15", null, "1,2800", "1,5600;3,10", "2,100;5,1,70;5,2,47"],
	"29": ["29", "29.最终战役", null, "1,220;5,1,12;5,2,7", null, "5,10,15", null, "1,2900", "1,5800;3,10", "2,100;5,1,72;5,2,49"],
	"30": ["30", "30.重启乐园", null, "1,240;5,1,12;5,2,7", null, "5,10,15", null, "1,3000", "1,6000;3,10", "2,100;5,1,74;5,2,49"]
}



// // item_id 奖励的物品id 0-15 （gold - 图鉴15）101积分
// // item_num 奖励的物品数量  1000 
// // invite_num 完成的条件 邀请多少人
// // status 0不可领取 1可领取 2已领取
// exports.config_invite_total_info = {
// 	1: {item_id: 101, item_num: 28, invite_num: 5, status: 0},
// 	2: {item_id: 101, item_num: 56, invite_num: 10, status: 0},
// 	3: {item_id: 101, item_num: 112, invite_num: 20, status: 0},
// 	4: {item_id: 101, item_num: 224, invite_num: 50, status: 0},
// 	5: {item_id: 101, item_num: 837, invite_num: 100, status: 0},
// 	6: {item_id: 101, item_num: 1674, invite_num: 200, status: 0},
// 	7: {item_id: 101, item_num: 3069, invite_num: 300, status: 0},
// 	8: {item_id: 101, item_num: 4185, invite_num: 400, status: 0},
// 	9: {item_id: 101, item_num: 5580, invite_num: 500, status: 0},
// 	10: {item_id: 101, item_num: 12555, invite_num: 1000, status: 0}
// }
exports.config_role_data = {
	1001: { "unlock_levels": 0, "quality": 1 },
	1002: { "unlock_levels": 0, "quality": 1 },
	1003: { "unlock_levels": 0, "quality": 1 },
	1004: { "unlock_levels": 0, "quality": 2 },
	1005: { "unlock_levels": 0, "quality": 2 },
	1006: { "unlock_levels": 0, "quality": 2 },
	1007: { "unlock_levels": 2, "quality": 3 },
	1008: { "unlock_levels": 3, "quality": 1 },
	1009: { "unlock_levels": 4, "quality": 3 },
	1010: { "unlock_levels": 5, "quality": 2 },
	1011: { "unlock_levels": 6, "quality": 3 },
	1012: { "unlock_levels": 7, "quality": 3 },
}

exports.config_daily_task = {
	1: { "score": 20, award_id_1: 5, award_num_1: 3, award_id_2: 2, award_num_2: 10 },
	2: { "score": 40, award_id_1: 5, award_num_1: 4, award_id_2: 2, award_num_2: 10 },
	3: { "score": 60, award_id_1: 5, award_num_1: 5, award_id_2: 2, award_num_2: 10 },
	4: { "score": 80, award_id_1: 6, award_num_1: 2, award_id_2: 2, award_num_2: 10 },
	5: { "score": 100, award_id_1: 6, award_num_1: 4, award_id_2: 2, award_num_2: 50 },
}

exports.config_box_data = {
	1: { "isReward": false },
	2: { "isReward": false },
	3: { "isReward": false },
	4: { "isReward": false },
	5: { "isReward": false }
}

// 权重 [50,40,10]    // 绿色碎片 quality 2，蓝色碎片quality 3，紫色碎片 quality 4
// 数量 [5,10,20], [3,5], [1]  // 绿色碎片 5或者10或者20个，蓝色碎片 3或者5个， 紫色碎片 1个
// 价格类型 2 金币 3 钻石 999 其他 [999,2,2,3,3,3]
// 金币价格 [5,30,180]    // 绿色碎片每个5金币，蓝色碎片每个30金币，紫色碎片每个180金币
// 钻石价格 [1.2,7,54]  // 绿色碎片每个1.2钻石，蓝色碎片每个7钻石，紫色碎片每个54钻石
// 折扣 [5,7,9,10]    // 5折，7折，9折，10折
// 折扣权重 [5,10,20,65]
// 总价格 价格*数量*折扣


// itemId 3 获得钻石 8获得碎片（固定）
// count 数量 根据权重获取到类型，然后根据类型随机获取到数量
// toolId itemId为8时 碎片id 根据config_role_data quality 获取到id (1001-1012)
// buyTimes 购买次数 1
// priceType 价格类型 2 金币 3 钻石 （固定）
// price 价格 根据计算公式 价格*数量*折扣 算出价格
// discount 折扣 根据折扣权重获取到折扣
// 1 固定死的值
// 点击刷新按钮后刷新 2-6
exports.config_shop_daily_data = {
	1: { "itemId": 3, "count": 100, "toolId": -1, "buyTimes": 1, "priceType": 999, "price": 100, "discount": 10 },
	2: { "itemId": 8, "count": 20, "toolId": 1001, "buyTimes": 1, "priceType": 1, "price": 90, "discount": 9 },
	3: { "itemId": 8, "count": 3, "toolId": 1004, "buyTimes": 1, "priceType": 1, "price": 81, "discount": 9 },
	4: { "itemId": 8, "count": 10, "toolId": 1003, "buyTimes": 1, "priceType": 2, "price": 12, "discount": 10 },
	5: { "itemId": 8, "count": 3, "toolId": 1004, "buyTimes": 1, "priceType": 2, "price": 21, "discount": 10 },
	6: { "itemId": 8, "count": 10, "toolId": 1002, "buyTimes": 1, "priceType": 2, "price": 9, "discount": 7 }
}

//lv 等级 c 碎片数量 pos 位置（-1未上阵）
// pos 位置（0，1，2，3，4，5，6，7）
exports.config_equip_save_data = {
	1001: { lv: 1, c: 0, pos: 0 , quality: 1, isUnLock: true},
	1002: { lv: 1, c: 0, pos: 1 , quality: 1, isUnLock: true},
	1003: { lv: 1, c: 0, pos: 2 , quality: 1, isUnLock: true},
	1004: { lv: 1, c: 0, pos: 3 , quality: 2, isUnLock: true},
	1005: { lv: 1, c: 0, pos: 4 , quality: 2, isUnLock: true},
	1006: { lv: 1, c: 0, pos: 5 , quality: 2, isUnLock: true},
	1007: { lv: 1, c: 0, pos: -1 , quality: 3, isUnLock: false},
	1008: { lv: 1, c: 0, pos: -1 , quality: 1, isUnLock: false},
	1009: { lv: 1, c: 0, pos: -1 , quality: 3, isUnLock: false},
	1010: { lv: 1, c: 0, pos: -1 , quality: 2, isUnLock: false},
	1011: { lv: 1, c: 0, pos: -1 , quality: 3, isUnLock: false},
	1012: { lv: 1, c: 0, pos: -1 , quality: 3, isUnLock: false},
}






//101 钻石 201 金币
exports.config_signgift_info = {//sign gift
	1: { gift_tp: 4, gift_num: 20 },
	2: { gift_tp: 4, gift_num: 50 },
	3: { gift_tp: 4, gift_num: 50 },
	4: { gift_tp: 4, gift_num: 50 },
	5: { gift_tp: 4, gift_num: 50 },
	6: { gift_tp: 4, gift_num: 50 },
	7: { gift_tp: 4, gift_num: 100 },
	8: { gift_tp: 4, gift_num: 100 },
	9: { gift_tp: 4, gift_num: 100 },
}


// 升级碎片及金币消耗 最大15级
exports.config_fruit_level = {
	"1001": [
		"5,100",
		"10,200",
		"20,400",
		"50,1000",
		"100,2000",
		"200,6000",
		"400,12000",
		"600,18000",
		"800,24000",
		"1000,30000",
		"1400,42000",
		"1800,54000",
		"2200,66000",
		"2600,78000",
		"3000,90000"
	],
	"1002": [
		"5,100",
		"10,200",
		"20,400",
		"50,1000",
		"100,2000",
		"200,6000",
		"400,12000",
		"600,18000",
		"800,24000",
		"1000,30000",
		"1400,42000",
		"1800,54000",
		"2200,66000",
		"2600,78000",
		"3000,90000"
	],
	"1003": [
		"5,100",
		"10,200",
		"20,400",
		"50,1000",
		"100,2000",
		"200,6000",
		"400,12000",
		"600,18000",
		"800,24000",
		"1000,30000",
		"1400,42000",
		"1800,54000",
		"2200,66000",
		"2600,78000",
		"3000,90000"
	],
	"1004": [
		"2,150",
		"3,450",
		"5,750",
		"10,1500",
		"25,3750",
		"50,9000",
		"100,18000",
		"200,36000",
		"300,54000",
		"400,72000",
		"600,108000",
		"800,144000",
		"1000,180000",
		"1200,216000",
		"1400,252000"
	],
	"1005": [
		"2,150",
		"3,450",
		"5,750",
		"10,1500",
		"25,3750",
		"50,9000",
		"100,18000",
		"200,36000",
		"300,54000",
		"400,72000",
		"600,108000",
		"800,144000",
		"1000,180000",
		"1200,216000",
		"1400,252000"
	],
	"1006": [
		"2,150",
		"3,450",
		"5,750",
		"10,1500",
		"25,3750",
		"50,9000",
		"100,18000",
		"200,36000",
		"300,54000",
		"400,72000",
		"600,108000",
		"800,144000",
		"1000,180000",
		"1200,216000",
		"1400,252000"
	],
	"1007": [
		"1,200",
		"2,400",
		"3,900",
		"4,1200",
		"8,3200",
		"16,6400",
		"32,12800",
		"64,25600",
		"96,38400",
		"128,51200",
		"160,64000",
		"192,76800",
		"224,89600",
		"256,102400",
		"288,115200"
	],
	"1008": [
		"5,100",
		"10,200",
		"20,400",
		"50,1000",
		"100,2000",
		"200,6000",
		"400,12000",
		"600,18000",
		"800,24000",
		"1000,30000",
		"1400,42000",
		"1800,54000",
		"2200,66000",
		"2600,78000",
		"3000,90000"
	],
	"1009": [
		"1,200",
		"2,400",
		"3,900",
		"4,1200",
		"8,3200",
		"16,6400",
		"32,12800",
		"64,25600",
		"96,38400",
		"128,51200",
		"160,64000",
		"192,76800",
		"224,89600",
		"256,102400",
		"288,115200"
	],
	"1010": [
		"2,150",
		"3,450",
		"5,750",
		"10,1500",
		"25,3750",
		"50,9000",
		"100,18000",
		"200,36000",
		"300,54000",
		"400,72000",
		"600,108000",
		"800,144000",
		"1000,180000",
		"1200,216000",
		"1400,252000"
	],
	"1011": [
		"1,200",
		"2,400",
		"3,900",
		"4,1200",
		"8,3200",
		"16,6400",
		"32,12800",
		"64,25600",
		"96,38400",
		"128,51200",
		"160,64000",
		"192,76800",
		"224,89600",
		"256,102400",
		"288,115200"
	],
	"1012": [
		"1,200",
		"2,400",
		"3,900",
		"4,1200",
		"8,3200",
		"16,6400",
		"32,12800",
		"64,25600",
		"96,38400",
		"128,51200",
		"160,64000",
		"192,76800",
		"224,89600",
		"256,102400",
		"288,115200"
	],
}

exports.config_shop_info = {
	"1": ["1", "1001", "10", "盲眼阿桃", "盲眼阿桃眼神不好会随机攻击目标", "10", "20", "0.5,0.7,0.9,1", "10000", "10000"],
	"2": ["2", "1003", "3", "柠檬精", "柠檬可提升周围友方的属性", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"3": ["3", "1004", "10", "刺客蜜瓜", "刺客蜜瓜对单体伤害高", "10", "20", "0.5,0.7,0.9,1", "10000", "10000"],
	"4": ["4", "1005", "1", "元婴果", "元婴果能攻击多名目标，附带流血效果", "45", "-1", "0.5,0.7,0.9,1", "10000", "0"],
	"5": ["5", "1006", "3", "西瓜大炮", "西瓜大炮命中后爆炸造成范围伤害", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"6": ["6", "1007", "1", "榴莲王", "榴莲王爆发伤害高并且能击退敌人", "45", "-1", "0.5,0.7,0.9,1", "10000", "0"],
	"7": ["7", "1008", "3", "南瓜炸弹", "南瓜炸弹会不断在路径上放置炸弹，充当最后防线", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"8": ["8", "1009", "3", "香蕉射手", "香蕉射手攻速很快，拥有超高的单体伤害", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"9": ["9", "1010", "3", "爆头黄瓜", "黄瓜对精英怪物造成高额伤害", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"10": ["10", "1011", "3", "辣破天", "辣椒能大幅度提升友军战力", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"11": ["11", "1012", "3", "冻斯梨", "冻梨能减速敌人", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"12": ["12", "1013", "3", "老巫蘑", "老巫蘑能让敌人中毒", "15", "60", "0.5,0.7,0.9,1", "10000", "10000"],
	"13": ["13", "1014", "1", "天山雪莲", "天山雪莲对处于冰冻的敌人造成高额伤害", "45", "-1", "0.5,0.7,0.9,1", "10000", "0"],
	"14": ["14", "1001", "20", "盲眼阿桃", "杨桃单体伤害高，但会随机攻击目标", "20", "40", "0.5,0.7,0.9,1", "10000", "10000"],
	"15": ["15", "1003", "5", "柠檬精", "柠檬可提升周围友方的属性", "27", "124", "0.5,0.7,0.9,1", "10000", "10000"],
	"16": ["16", "1004", "20", "刺客蜜瓜", "爆头瓜对单体伤害高", "20", "40", "0.5,0.7,0.9,1", "10000", "10000"],
	"18": ["18", "1006", "5", "西瓜大炮", "西瓜范围伤害高", "27", "124", "0.5,0.7,0.9,1", "10000", "10000"],
	"20": ["20", "1008", "5", "南瓜炸弹", "南瓜炸弹会不断在路径上放置炸弹，保卫家园", "27", "124", "0.5,0.7,0.9,1", "10000", "10000"],
	"22": ["22", "1010", "5", "爆头黄瓜", "爆头黄瓜对精英怪物造成高额伤害", "27", "124", "0.5,0.7,0.9,1", "10000", "10000"],
	"23": ["23", "1011", "5", "辣破天", "辣椒能大幅度提升友军战力", "27", "124", "0.5,0.7,0.9,1", "10000", "10000"],
	"24": ["24", "1012", "5", "冻斯梨", "冻梨能减速敌人", "27", "124", "0.5,0.7,0.9,1", "10000", "10000"],
	"25": ["25", "1013", "5", "老巫蘑", "老巫蘑能让敌人中毒", "27", "124", "0.5,0.7,0.9,1", "10000", "10000"]
}

// "id","level","exp","rewards","bigRewards"

//"1,150;5,1,12;5,2,5" => [{id:1, quality:0, number:150}, {id:5, quality:1, number:12}, , {id:5, quality:2, number:5}]

exports.config_shop_box = {
	"1": ["1", "1", "500", "5,1,12", "1,500;5,1,40;5,2,5"],
	"2": ["2", "2", "1300", "5,1,14", "1,500;5,1,50;5,2,10"],
	"3": ["3", "3", "2200", "5,1,16;5,2,1", "1,500;5,1,60;5,2,20;5,3,1"],
	"4": ["4", "4", "3200", "5,1,18;5,2,2", "1,500;5,1,70;5,2,30;5,3,1"],
	"5": ["5", "5", "4300", "5,1,20;5,2,3", "1,500;5,1,80;5,2,40;5,3,1"],
	"6": ["6", "6", "5500", "5,1,22;5,2,4", "1,500;5,1,90;5,2,50;5,3,2"],
	"7": ["7", "7", "6800", "5,1,24;5,2,5", "1,500;5,1,105;5,2,60;5,3,2"],
	"8": ["8", "8", "8200", "5,1,26;5,2,6", "1,500;5,1,120;5,2,70;5,3,3"],
	"9": ["9", "9", "9700", "5,1,28;5,2,7", "1,500;5,1,135;5,2,80;5,3,3"],
	"10": ["10", "10", "11300", "5,1,30;5,2,8", "1,500;5,1,150;5,2,90;5,3,4"]
}

// item_id 奖励的物品id 0-15 （gold - 图鉴15）101积分 //1：金币，2：钻石，3：体力，4：积分，5：碎片{quality==>1：绿色，2：蓝色，3：紫色}
// item_num 奖励的物品数量  1000 
// finished 完成的条件 （例如finished 1 代表升级到1级） （根据tasktype来判断）
// status 0不可领取 1可领取 2已领取
// task_type 类型 1通关 2解锁水果 3购买普通礼盒 4购买精致礼盒 5分享
// 解锁水果任务 对应水果id
// 27=>1005 28=>1006 29=>1008 30=>1010 31=>1007 32=>1011 32=>1014 👌
exports.config_task_info = {
	1: { item_id: 4, item_num: 1000, finished: 1, status: 0, task_type: 5, name: "Follow Xmultiverse on X", url: "https://x.com/Xmultiverse_org?mx=2" },
	2: { item_id: 4, item_num: 1000, finished: 1, status: 0, task_type: 5, name: "Join the TG community", url: "https://t.me/Xmultiverse_org" },
	3: { item_id: 4, item_num: 1000, finished: 1, status: 0, task_type: 5, name: "Join the Discord server", url: "https://discord.gg/svQ3a43Wz6" },

	4: { item_id: 1, item_num: 100, finished: 3, status: 0, task_type: 1, name: "Reach Level 3", url: "" },
	5: { item_id: 1, item_num: 100, finished: 4, status: 0, task_type: 1, name: "Reach Level 4", url: "" },
	6: { item_id: 1, item_num: 100, finished: 5, status: 0, task_type: 1, name: "Reach Level 5", url: "" },
	7: { item_id: 1, item_num: 200, finished: 6, status: 0, task_type: 1, name: "Reach Level 6", url: "" },
	8: { item_id: 1, item_num: 200, finished: 7, status: 0, task_type: 1, name: "Reach Level 7", url: "" },
	9: { item_id: 1, item_num: 200, finished: 8, status: 0, task_type: 1, name: "Reach Level 8", url: "" },
	10: { item_id: 1, item_num: 200, finished: 9, status: 0, task_type: 1, name: "Reach Level 9", url: "" },
	11: { item_id: 1, item_num: 300, finished: 10, status: 0, task_type: 1, name: "Reach Level 10", url: "" },
	12: { item_id: 1, item_num: 300, finished: 11, status: 0, task_type: 1, name: "Reach Level 11", url: "" },
	13: { item_id: 1, item_num: 300, finished: 12, status: 0, task_type: 1, name: "Reach Level 12", url: "" },
	14: { item_id: 1, item_num: 300, finished: 13, status: 0, task_type: 1, name: "Reach Level 13", url: "" },
	15: { item_id: 1, item_num: 300, finished: 14, status: 0, task_type: 1, name: "Reach Level 14", url: "" },
	16: { item_id: 1, item_num: 400, finished: 15, status: 0, task_type: 1, name: "Reach Level 15", url: "" },
	17: { item_id: 1, item_num: 500, finished: 16, status: 0, task_type: 1, name: "Reach Level 16", url: "" },
	18: { item_id: 1, item_num: 600, finished: 17, status: 0, task_type: 1, name: "Reach Level 17", url: "" },
	19: { item_id: 1, item_num: 700, finished: 18, status: 0, task_type: 1, name: "Reach Level 18", url: "" },
	20: { item_id: 1, item_num: 800, finished: 19, status: 0, task_type: 1, name: "Reach Level 19", url: "" },
	21: { item_id: 1, item_num: 1000, finished: 20, status: 0, task_type: 1, name: "Reach Level 20", url: "" },
	22: { item_id: 1, item_num: 1200, finished: 21, status: 0, task_type: 1, name: "Reach Level 21", url: "" },
	23: { item_id: 1, item_num: 1400, finished: 22, status: 0, task_type: 1, name: "Reach Level 22", url: "" },
	24: { item_id: 1, item_num: 1600, finished: 23, status: 0, task_type: 1, name: "Reach Level 23", url: "" },
	25: { item_id: 1, item_num: 1800, finished: 24, status: 0, task_type: 1, name: "Reach Level 24", url: "" },
	26: { item_id: 1, item_num: 2000, finished: 25, status: 0, task_type: 1, name: "Reach Level 25", url: "" },

	27: { item_id: 1, item_num: 200, finished: 1005, status: 0, task_type: 2, name: "Unlock Hemoberry", url: "" },
	28: { item_id: 1, item_num: 200, finished: 1006, status: 0, task_type: 2, name: "Unlock Blastmelon", url: "" },
	29: { item_id: 1, item_num: 500, finished: 1007, status: 0, task_type: 2, name: "Unlock Trapkin", url: "" },
	30: { item_id: 1, item_num: 500, finished: 1008, status: 0, task_type: 2, name: "Unlock Elitcuke", url: "" },
	31: { item_id: 1, item_num: 1000, finished: 1010, status: 0, task_type: 2, name: "Unlock Smackdurian", url: "" },
	32: { item_id: 1, item_num: 1000, finished: 1011, status: 0, task_type: 2, name: "Unlock Furypepper", url: "" },
	33: { item_id: 1, item_num: 1500, finished: 1014, status: 0, task_type: 2, name: "Unlock Frozelotus", url: "" },

	34: { item_id: 1, item_num: 200, finished: 1, status: 0, task_type: 3, name: "Buy 1 Basic Box", url: "" },
	35: { item_id: 1, item_num: 200, finished: 2, status: 0, task_type: 3, name: "Buy 2 Basic Box", url: "" },
	36: { item_id: 1, item_num: 200, finished: 3, status: 0, task_type: 3, name: "Buy 3 Basic Box", url: "" },
	37: { item_id: 1, item_num: 200, finished: 4, status: 0, task_type: 3, name: "Buy 4 Basic Box", url: "" },
	38: { item_id: 1, item_num: 200, finished: 5, status: 0, task_type: 3, name: "Buy 5 Basic Box", url: "" },
	39: { item_id: 1, item_num: 200, finished: 6, status: 0, task_type: 3, name: "Buy 6 Basic Box", url: "" },
	40: { item_id: 1, item_num: 200, finished: 7, status: 0, task_type: 3, name: "Buy 7 Basic Box", url: "" },
	41: { item_id: 1, item_num: 200, finished: 8, status: 0, task_type: 3, name: "Buy 8 Basic Box", url: "" },
	42: { item_id: 1, item_num: 200, finished: 9, status: 0, task_type: 3, name: "Buy 9 Basic Box", url: "" },
	43: { item_id: 1, item_num: 200, finished: 10, status: 0, task_type: 3, name: "Buy 10 Basic Box", url: "" },

	44: { item_id: 1, item_num: 1500, finished: 1, status: 0, task_type: 4, name: "Buy 1 Deluxe Box", url: "" },
	45: { item_id: 1, item_num: 1500, finished: 2, status: 0, task_type: 4, name: "Buy 2 Deluxe Box", url: "" },
	46: { item_id: 1, item_num: 1500, finished: 3, status: 0, task_type: 4, name: "Buy 3 Deluxe Box", url: "" },
	47: { item_id: 1, item_num: 1500, finished: 4, status: 0, task_type: 4, name: "Buy 4 Deluxe Box", url: "" },
	48: { item_id: 1, item_num: 1500, finished: 5, status: 0, task_type: 4, name: "Buy 5 Deluxe Box", url: "" },
	49: { item_id: 1, item_num: 1500, finished: 6, status: 0, task_type: 4, name: "Buy 6 Deluxe Box", url: "" },
	50: { item_id: 1, item_num: 1500, finished: 7, status: 0, task_type: 4, name: "Buy 7 Deluxe Box", url: "" },
	51: { item_id: 1, item_num: 1500, finished: 8, status: 0, task_type: 4, name: "Buy 8 Deluxe Box", url: "" },
	52: { item_id: 1, item_num: 1500, finished: 9, status: 0, task_type: 4, name: "Buy 9 Deluxe Box", url: "" },
	53: { item_id: 1, item_num: 1500, finished: 10, status: 0, task_type: 4, name: "Buy 10 Deluxe Box", url: "" },
}


// item_id 奖励的物品id 1：金币，2：钻石，3：体力，4：积分，5：碎片{quality==>1：绿色，2：蓝色，3：紫色}
// item_num 奖励的物品数量  1000 
// invite_num 完成的条件 邀请多少人
// status 0不可领取 1可领取 2已领取 👌
exports.config_invite_info = {
	1: { item_id: 4, item_num: 55.8, invite_num: 5, status: 0 },
	2: { item_id: 4, item_num: 111.6, invite_num: 10, status: 0 },
	3: { item_id: 4, item_num: 223.2, invite_num: 20, status: 0 },
	4: { item_id: 4, item_num: 558, invite_num: 50, status: 0 },
	5: { item_id: 4, item_num: 1674, invite_num: 100, status: 0 },
	6: { item_id: 4, item_num: 3348, invite_num: 200, status: 0 },
	7: { item_id: 4, item_num: 5859, invite_num: 300, status: 0 },
	8: { item_id: 4, item_num: 8370, invite_num: 400, status: 0 },
	9: { item_id: 4, item_num: 11160, invite_num: 500, status: 0 },
	10: { item_id: 4, item_num: 25110, invite_num: 1000, status: 0 }

}

//recharge
exports.config_recharge_diamond = {
	1: { DiamondNumber: 300, firstAward: 0, UsdtCost: 3, status: 0 },
	2: { DiamondNumber: 500, firstAward: 50, UsdtCost: 5, status: 0 },
	3: { DiamondNumber: 1000, firstAward: 100, UsdtCost: 10, status: 0 },
	4: { DiamondNumber: 10000, firstAward: 1000, UsdtCost: 99, status: 0 },
	5: { DiamondNumber: 20000, firstAward: 2000, UsdtCost: 198, status: 0 },
	6: { DiamondNumber: 35000, firstAward: 3500, UsdtCost: 328, status: 0 },
}