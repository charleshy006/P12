const { ccclass, property } = cc._decorator;

import { UICtrl } from "./../../Managers/UIMgr";
import EventMgr from "../../Managers/EventMgr";

@ccclass // 注意修改类名
export default class ResLoading_Ctrl extends UICtrl {
    private progressBar: cc.Sprite = null;

    onLoad() {
        super.onLoad();

        this.progressBar = this.view["UIProgress/value"].getComponent(cc.Sprite);
        this.progressBar.fillRange = 0;

        EventMgr.Instance.add_event_listenner("ResLoadProgress", this, this.onProgress);
    }

    private onProgress(uname, udata) {
        var per = udata;
        this.progressBar.fillRange = per;
    }

    onDestroy() {
        EventMgr.Instance.remove_event_listenner("ResLoadProgress", this, this.onProgress);
    }
}
