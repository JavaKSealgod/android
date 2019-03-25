/**
 * 产品组件--VG娱乐城登入
 */
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");

class Product_VGGame_Login{
    messageNS:string = "";

    constructor(){
        this.toLoadSiteMessage();
        //this.init();
    }

    toLoadSiteMessage() {
        Global.Log.log("toLoadSiteMessage");

        //显示系统loading
        Global.Tips.showSystemLoading();

        Api.message.site_message()
            .done((sitemessage)=>{
                //隐藏系统loading，无论显示哪种状态，都需要隐藏系统loading
                Global.Tips.hideSystemLoading();

                if(sitemessage.vggame.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.vggame.info["zh-cn"]);

                    $('[data-cashap-id="state_maintenance"]').removeClass("hide");
                }
                else {
                    $('[data-cashap-id="state_open"]').removeClass("hide");

                    this.init();
                }
            });
    }

    init(){
        Global.Log.log("Product_VGGame_Login.init");

        if(Global.App.isLogin()){
            Api.account.profile_baseInfo(true)
                .done((baseInfo)=>{
                    if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VGGame, baseInfo.memberLevel)){
                        this.loadLoginInfo();
                    }
                });
        }
        else {
            //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
            //此处默认会弹出 提示登录 的信息
            Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VGGame, -1);
        }
    }

    /**
     * 获取产品登录信息
     */
    loadLoginInfo(){
        var gameKey = Global.Util.getParam("GameKey");
        if(!gameKey){gameKey = 0;}
        var d = {"id": gameKey};

        Api.vggame.login_product(d)
            .done((result)=>{
                this.loadLoginInfo_callBack(result);
            });
    }

    loadLoginInfo_callBack(result){
        if(result.errorInfo.length > 0 || !result.result){
            if(result.errorInfo[0].errorCode == "1000015"){
                var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "unknowError");
                Global.Tips.systemTip(text);
                return;
            }

            if(result.errorInfo[0].errorCode == "1000050"){
                var productName =  (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Model.Game_ID" , "VGGame");
                var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "product_maintenance");
                text = text.replace("{0}" , productName);
                Global.Tips.systemTip(text);
                return;
            }

            if(result.errorInfo[0].errorCode !== ""){
                Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", result.errorInfo[0]["errorCode"]));
                return;
            }

            if(result.errorInfo[0].errorCode == "" && result.errorInfo[0]["errorDetail"] != ""){
                Global.Tips.systemTip(result.errorInfo[0]["errorDetail"]);
                return;
            }

            Global.Tips.systemTip(Com_Gametree_Cashap.Language["unknowError"]);
            return;
        }

        Global.Log.log("url = %s" , result.url);

        window.location.replace(result.url);
    }
}

export = Product_VGGame_Login;