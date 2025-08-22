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

//飞机列表
exports.config_PlaneInfo = [
	{
		id: 0,
		name: "Sly Fox",    // 可删
		url: "player1",
		title: "Nice Try",  // 可删
		hp: 5,
		attack: 1,//攻击力  // 可删
		price: 0,//价格，
		emitter: "player1_emitter",
		emitterStr: "HMG",  // 可删
		isBuy: true,  // 可删
		isChoice: true  // 可删
	},
	{
		id: 1,
		name: "Big Blue",
		url: "player2",
		title: "Iron Goliath",
		hp: 10,
		attack: 2,//攻击力
		price: 1200,//价格，
		emitter: "player2_emitter",
		emitterStr: "Dual Gatling",
		isBuy: false,
		isChoice: false
	},
	{
		id: 2,
		name: "Celestial Star",
		url: "player3",
		title: "Farbulous",
		hp: 12,
		attack: 5,//攻击力
		price: 2900,//价格，
		emitter: "player3_emitter",
		emitterStr: "Fireball",
		isBuy: false,
		isChoice: false
	},
	{
		id: 3,
		name: "Reaper",
		url: "player4",
		title: "Scythe of Destruction",
		hp: 18,
		attack: 8,//攻击力
		price: 4500,//价格，
		emitter: "player4_emitter",
		emitterStr: "Triple Cannon",
		isBuy: false,
		isChoice: false
	},
	{
		id: 4,
		name: "Devourer",
		url: "player5",
		title: "Total Annihilation",
		hp: 20,
		attack: 10,//攻击力
		price: 6200,//价格，
		emitter: "player5_emitter",
		emitterStr: "Particle Cannon",
		isBuy: false,
		isChoice: false
	},
];

exports.config_WeaponInfo = [
	{
		id: 1,
		name: "Basic Missile",  // 可删
		url: "skill_1",  // 可删
		title: "Fires one missile at a time", // 可删
		price: 180,//价格，
	},
	{
		id: 2,
		name: "Frost Missile",
		url: "skill_2",
		title: "Cluster fire, tracks the target",
		price: 380,//价格，
	},
	{
		id: 3,
		name: "Defense Boost",
		url: "shield",
		title: "Defense +3",
		price: 800,//价格，
	},
	{
		id: 4,
		name: "Armor-Piercing",
		url: "power",
		title: "Attack +1",
		price: 1200,//价格，
	},
	{
		id: 5,
		name: "Nuclear Missile",
		url: "hedan",
		title: "Deals devastating damage to all enemies",
		price: 260,//价格，
	},
];

exports.config_PetInfo = [
	{
		id: 0,
		name: "Apex Predator",  // 可删
		url: "pet_1",
		title: "Equipped with two wingmen to assist in enemy destruction",  // 可删
		isBuy: false, // 可删
		isChoice: false,  // 可删
		price: 500,//价格，
	},
	{
		id: 1,
		name: "Guardian Vanguard",
		url: "pet_2",
		title: "Fires forward and from both wings",
		isBuy: false,
		isChoice: false,
		price: 680,//价格，
	},
	{
		id: 2,
		name: "H/PJ CIWS",
		url: "pet_3",
		title: "Equipped with smart Gatling guns, auto-locks onto targets",
		isBuy: false,
		isChoice: false,
		price: 950,//价格，
	},
	{
		id: 3,
		name: "Black Angel",
		url: "pet_4",
		title: "Fires tracking Shadow Missiles at enemies, and launches healing waves restoring 10% health per second",
		isBuy: false,
		isChoice: false,
		price: 1280,//价格，
	},
];

exports.config_petName = [
	{
		id: 0,
		isBuy: true,
		isChoice: true
	},
	{
		id: 1,
		isBuy: false,
		isChoice: false
	},
	{
		id: 2,
		isBuy: false,
		isChoice: false
	},
	{
		id: 3,
		isBuy: false,
		isChoice: false
	}
];

exports.config_planeName = [
	{
		id: 0,
		isBuy: true,
		isChoice: true
	},
	{
		id: 1,
		isBuy: false,
		isChoice: false
	},
	{
		id: 2,
		isBuy: false,
		isChoice: false
	},
	{
		id: 3,
		isBuy: false,
		isChoice: false
	},
	{
		id: 4,
		isBuy: false,
		isChoice: false
	}
];

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

