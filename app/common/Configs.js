// ============REDIS CONF  START=================
exports.RedisOptions = {
	socket: {
		host: '127.0.0.1', // 根据实际情况修改主机地址
		port: 8899, // 根据实际情况修改端口号
	},
	password: 'Welcome01!' // 这里替换成实际的Redis密码
};
exports.Redis_DB = 6;
exports.RedisFather = {
	user_id: "1111111111",

	// 其他可选配置，如密码等
}
// ============REDIS CONF  END=================

// ============MONGO CONF  START=================
// exports.Mongo_URI = "mongodb://127.0.0.1:27017/CK_DB";
exports.Mongo_URI = "mongodb://mongo_game:Welcome01!@127.0.0.1:6677/DB_6?authSource=admin";
// exports.Mongo_URI = "mongodb://mongo_game:Welcome01!@13.229.104.150:6677/DB_6?authSource=admin";
// exports.Mongo_URI = "mongodb://root:Lovehouse123!@dds-zf8271f3a79232841823-pub.mongodb.kualalumpur.rds.aliyuncs.com:3717,dds-zf8271f3a79232842152-pub.mongodb.kualalumpur.rds.aliyuncs.com:3717/PJ_DB?authSource=admin";
// ============MONGO CONF  END=================

exports.AllChannelName = "AllPushChannel";

// Other Conf
exports.LoginTimeOut = (60 * 60) + 100;
// exports.LoginTimeOut = 10;
exports.StartServerTime = "2025-05-07 00:00:00.00";

exports.config_Plane = {
	player_name: "player1",
	emitter: "player1_emitter",
	hp: 5
}

//飞机列表
exports.config_PlaneInfo = {
	0:{
		id: 0,
		url: "player1",
		hp: 5,
		price: 0,//价格，
		emitter: "player1_emitter",
	},
	1:{
		id: 1,
		url: "player2",
		hp: 10,
		price: 1200,//价格，
		emitter: "player2_emitter",
	},
	2:{
		id: 2,
		url: "player3",
		hp: 12,
		price: 2900,//价格，
		emitter: "player3_emitter",
	},
	3:{
		id: 3,
		url: "player4",
		hp: 18,
		price: 4500,//价格，
		emitter: "player4_emitter",
	},
	4:{
		id: 4,
		url: "player5",
		hp: 20,
		price: 6200,//价格，
		emitter: "player5_emitter",
	},
};

exports.config_WeaponInfo = {
	1:{
		id: 1,
		price: 180,//价格，
	},
	2:{
		id: 2,
		price: 380,//价格，
	},
	3:{
		id: 3,
		price: 800,//价格，
	},
	4:{
		id: 4,
		price: 1200,//价格，
	},
	5:{
		id: 5,
		price: 260,//价格，
	},
}

exports.config_PetInfo = {
	0:{
		id: 0,
		url: "pet_1",
		price: 500,//价格，
	},
	1:{
		id: 1,
		url: "pet_2",
		price: 680,//价格，
	},
	2:{
		id: 2,
		url: "pet_3",
		price: 950,//价格，
	},
	3:{
		id: 3,
		url: "pet_4",
		price: 1280,//价格，
	},
};

exports.config_petName = {
	0:{
		id: 0,
		isBuy: true,
		isChoice: true
	},
	1:{
		id: 1,
		isBuy: false,
		isChoice: false
	},
	2:{
		id: 2,
		isBuy: false,
		isChoice: false
	},
	3:{
		id: 3,
		isBuy: false,
		isChoice: false
	}
};

exports.config_planeName = {
	0:{
		id: 0,
		isBuy: false,
		isChoice: false
	},
	1:{
		id: 1,
		isBuy: false,
		isChoice: false
	},
	2:{
		id: 2,
		isBuy: false,
		isChoice: false
	},
	3:{
		id: 3,
		isBuy: false,
		isChoice: false
	},
	4:{
		id: 4,
		isBuy: false,
		isChoice: false
	}
};



// 1：金币，2：钻石，3：体力，4：积分，5：碎片{quality==>1：绿色，2：蓝色，3：紫色}
// 1,300 300金币 5,1,40 40个绿色碎片
exports.config_signgift_info = {//sign gift
	1: { award: "1,300" },
	2: { award: "2,30" },
	3: { award: "5,1,40" },
	4: { award: "2,50" },
	5: { award: "1,2000" },
	6: { award: "5,2,25" },
	7: { award: "1,3000;2,200;5,3,1" },
}

