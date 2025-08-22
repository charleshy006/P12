


// 飞机基础数据
let user={
  game_scre_lishi:0,  //历史最高得分
  game_gold:0,  //游戏金币
  game_medal:0,  //游戏奖章 用于购买宠物
  score:0,  //玩家当前分数
  Level:1,  //玩家打到了多少关
  skill_1:3,  //技能1数量 ..普通导弹
  skill_2:4,  //技能2数量 ..寒冰导弹
  hedan:3,  //核弹
  shield: 1,		//防护力
  power:1,  //攻击力
  pet:'',// 使用的僚机 ""为无 "pet_1"为有 1,2,3,4,5
  //选飞机时候用plane表
  plane:{
    player_name:"player1",
    emitter:"player1_emitter",
    hp:5
  },

  planeName:[
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
  ],
  petName:[
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
  ]
}

////// 接口
// 登录接口
Login_Game
  invite_id:"" //邀请码

  //返回数据
  {user}
// 购买战机接口 花费金币
Buy_Plane
  plane_id:1 //战机id

  //返回数据
  user.planeName=[] //更新战机列表
  // user.planeName[plane_id].isBuy = true //购买成功
  // user.planeName[plane_id].isChoice = true //选择成功 //其他的都置为false
  user.plane = {
    player_name: PlaneInfo[plane_id].name,
    emitter: PlaneInfo[plane_id].emitter,
    hp: PlaneInfo[plane_id].hp
  }

  user.game_gold  //更新金币数量

  
// 购买武器接口 花费金币
Buy_Weapon
  weapon_id:1 //武器id

  //返回数据
  user.game_gold  //更新金币数量
  // 对应表
  // 1=>skill_1  //普通导弹 +1
  // 2=>skill_2  //寒冰导弹 +1
  // 3=>shield  //防御  +3
  // 4=>power  //攻击力 +1
  // 5=>hedan  //核弹 +1

// 购买宠物接口 花费勋章
Buy_Pet
  pet_id:1 //宠物id

  //返回数据
  user.game_medal //更新勋章数量
  user.petName=[] //更新宠物列表
  // user.petName[pet_id].isBuy = true //购买成功
  // user.petName[pet_id].isChoice = true //选择成功 //其他的都置为false
  user.pet = PetInfo[pet_id].url //使用了宠物
// 选择战机接口
Choice_Plane
  plane_id:1 //战机id

  //返回数据
  user.planeName=[] //更新战机列表
  // user.planeName[plane_id].isChoice = true //选择成功 //其他的都置为false
  user.plane = {
    player_name: PlaneInfo[plane_id].name,
    emitter: PlaneInfo[plane_id].emitter,
    hp: PlaneInfo[plane_id].hp
  }
// 选择宠物接口
Choice_Pet
  pet_id:1 //宠物id

  //返回数据
  user.petName=[] //更新宠物列表
  // user.petName[pet_id].isChoice = true //选择成功 //其他的都置为false
  user.pet = PetInfo[pet_id].url //使用了宠物
// 开始游戏接口
Start_Game
  Level:1 //当前关卡
// 飞机使用技能接口
Plane_UseSkill
  skill_id:1 //技能id
  // 1=>skill_1 普通导弹  -1
  // 2=>skill_2 寒冰导弹  -1
  // 5=>hedan 核弹  -1
// 结束游戏接口
Finish_Game
  type:1 //类型：1 成功 2 失败
  point:100 //得分 增加金币
  medal: 1 // 勋章 增加勋章