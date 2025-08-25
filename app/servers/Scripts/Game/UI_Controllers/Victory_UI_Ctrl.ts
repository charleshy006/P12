const { ccclass, property } = cc._decorator;
import UIMgr, { UICtrl } from "./../../Managers/UIMgr";
import EventMgr from "../../Managers/EventMgr";
import UserData from "../UserData"
import SoundMgr from "../../Managers/SoundMgr";
//import WxMgr from"../../Managers/WxMgr"
import TtMgr from "../../Managers/TtMgr"
import WxMgr from "../../Managers/WxMgr";

//import ResMsg from"../../Managers/ResMgr"


//import { UICtrl } from "./../../Managers/UIMgr";

@ccclass // 注意修改类名
export default class Victory_UI_Ctrl extends UICtrl {
  //public static Instance: Victory_UI_Ctrl = null;

    private level: number = null
    private get_medal: number = null
    private game_score_lishi: number = null
    private score: number = null
    private get_gold: number = null
    private get_jiangli_node: cc.Node = null

    private RankPanel = null //按钮也在里面








    onLoad() {
       
      //  cc["Victory_UI_Ctrl"]=Victory_UI_Ctrl  //android调用的全局

          super.onLoad();
        //   if(Victory_UI_Ctrl.Instance===null)   {
        //     Victory_UI_Ctrl.Instance = this;
           
        //   }   
          







    }

    onDestroy(){
        EventMgr.Instance.remove_event_listenner("lingqu",this,this.lingqu)
    }





    private luping() {
        if (window.tt) {
            TtMgr.Instance.shareVideo(this.lingqu2, this)

        }
    }
    // private lupngJangli() {


    //     this.lingqu2()//如果分享录屏在多给2倍
    //     console.log("分享胜利的录屏成功")
    // }
    start() {
        EventMgr.Instance.add_event_listenner("lingqu",this,this.lingqu)

         if(window.tt){
            console.log("胜利了弹插屏广告tt");
            TtMgr.Instance.showInterstitialAd()
         }else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            console.log("胜利了弹插屏广告wx");
             WxMgr.Instance.showInterstitialAd()
         
         }else if(cc.sys.os == cc.sys.OS_ANDROID){
            console.log("胜利了弹插屏广告android");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openChaPing", "(Ljava/lang/String;)V", '胜利广告');
         }


     
        

        console.log("弹出胜利ui" + this.node.name)


        this.add_button_listen("Content/info/luping", this, this.luping);//录屏按钮 
        this.add_button_listen("Content/info/next", this, this.colse);//下一关按钮
        this.add_button_listen("Content/info/back", this, this.qinghau);//强化战机按钮
        this.add_button_listen("Content1/shaungbei_btn", this, this.getShuangbei);//双倍奖励按钮
        this.add_button_listen("Content1/fangqi_btn", this, this.getFangqi);//放弃双倍奖励按钮
      





        if (window.tt) {
            this.view["Content/info/openRank"].active = false//隐藏排行榜
            this.view["Content/info/back"].y-=45//调下强化按钮位置

        } else if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.RankPanel = this.node.getComponent("RankPanel")
            this.add_button_listen("RankPanel/info/rank_share_btn", this, this.rank_share);//分享排行榜的按钮
            this.view["Content/info/luping"].active = false//隐藏录屏

        }
        else if (cc.sys.os == cc.sys.OS_ANDROID) {
            this.view["Content/info/luping"].active = false//隐藏录屏
            this.view["Content/info/openRank"].active = false//隐藏排行榜

            this.view["Content/info/next"].y -= 90
            this.view["Content/info/back"].y -= 90


        }






        this.level = (UserData.Instance.userData["nowLevel"] - 1)
        this.game_score_lishi = UserData.Instance.userData["game_score_lishi"]
        this.score = UserData.Instance.userData["score"]

        //如果是微信吧分数传进去
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            console.log("setScore+="+this.score);
            
            this.RankPanel.setScore(this.score)

        }



        this.get_jiangli_node = this.view["Content1"]//奖励窗口先隐藏
        this.get_jiangli_node.active = false





        SoundMgr.Instance.play_effect("victory")
        this.get_medal = Math.floor(Math.random() * 280) + 1
        if (this.get_medal < 50) {
            this.get_medal = 50
        }

        UserData.Instance.userData["game_medal"] += this.get_medal;


        this.get_gold = Math.floor(Math.random() * 560) + 1
        if (this.get_gold < 100) {
            this.get_gold = 100
        }
        UserData.Instance.userData["game_gold"] += this.get_gold;

        UserData.Instance.saveUserData()



        this.view["Content/info/Level"].getComponent(cc.Label).string = "第" + this.level + "关"
        this.view["Content/info/get_medal"].getComponent(cc.Label).string = this.get_medal
        this.view["Content/info/get_gold"].getComponent(cc.Label).string = this.get_gold
        this.view["Content/info/game_score_lishi"].getComponent(cc.Label).string = this.game_score_lishi
        this.view["Content/info/score"].getComponent(cc.Label).string = this.score

        //刷新历史记录
        if (this.score >= this.game_score_lishi) {
            UserData.Instance.userData["game_score_lishi"] = this.score
            UserData.Instance.saveUserData()
            // console.log("我打破了历史记录")
        }



        this.view["Content"].getComponent("PopDialogCtrl").showDialog(this.showJiangli, this)//奖励页面








    }
    //炫耀排名
    private rank_share() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            WxMgr.Instance.shareAppMessage("keys_xuanyao")
        }

    }
    //打开双倍奖励奖励窗口
    private showJiangli() {
        this.get_jiangli_node.active = true


        this.view["Content1/get_medal"].getComponent(cc.Label).string = "+" + this.get_medal
        this.view["Content1/get_gold"].getComponent(cc.Label).string = "+" + this.get_gold

    

    }


    //强化
    private qinghau() {
        cc.director.resume()//开始游戏

        console.log("我的ui应该被删除" + this.node.name)
        UIMgr.Instance.remove_ui(this.node.name)
        EventMgr.Instance.dispatch_event("qianghua", false)
    }














    //领取奖励
    public  lingqu() {
        // let self= this.Instance
        console.log("点击了获取双倍奖励按钮")
        UserData.Instance.userData["game_medal"] += this.get_medal;
        UserData.Instance.userData["game_gold"] += this.get_gold;
        UserData.Instance.saveUserData()
        this.get_medal = this.get_medal * 2
        this.get_gold = this.get_gold * 2
        this.view["Content/info/get_medal"].getComponent(cc.Label).string = this.get_medal
        this.view["Content/info/get_gold"].getComponent(cc.Label).string = this.get_gold
        this.get_jiangli_node.active = false
    }


    //领取奖励 分享录屏再次获得双倍
    private lingqu2() {

        //    cc.director.resume()//开始游戏
        console.log("点击了获取双倍奖励按钮_录屏")
        UserData.Instance.userData["game_medal"] += this.get_medal;
        UserData.Instance.userData["game_gold"] += this.get_gold;
        UserData.Instance.saveUserData()
        this.get_medal = this.get_medal * 2
        this.get_gold = this.get_gold * 2
        this.view["Content/info/get_medal"].getComponent(cc.Label).string = this.get_medal 
        this.view["Content/info/get_gold"].getComponent(cc.Label).string = this.get_gold 
        this.view["Content/info/luping"].active=false

        tt.showModal({
            title: "分享成功",
            //  content: JSON.stringify(res),
            content: "恭喜！已获取双倍奖励！！！"
          });

    }

    //双倍领取奖励
    private getShuangbei() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            WxMgr.Instance.showVideoAd("keys_shuangbei", this.lingqu, this)//wx看视频领取奖励

        } else if (window.tt) {
            TtMgr.Instance.showVideoAd("keys_shuangbei", this.lingqu, this)//tt看视频领取奖励
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            console.log("我是安卓系统");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "creatorShowAD", "(Ljava/lang/String;)V", 'shuangbei');

        }










    }
    private getFangqi() {
        this.get_jiangli_node.active = false
    }





    private colse() {



        cc.director.resume()//开始游戏

        //  console.log("我的ui应该被删除" + this.node.name)
        UIMgr.Instance.remove_ui(this.node.name)
        EventMgr.Instance.dispatch_event("nextLevel", null)



    }




        //领取奖励安卓
        public static lingqu_android(msg:string) {
            EventMgr.Instance.dispatch_event("lingqu",0)
 
     
       }


}
