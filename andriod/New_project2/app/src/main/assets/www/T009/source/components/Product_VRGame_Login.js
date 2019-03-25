define('T009/source/components/Product_VRGame_Login', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api"], function (require, exports, Global, Api) {
    "use strict";
    var Product_VRGame_Login = /** @class */ (function () {
        function Product_VRGame_Login() {
            this.messageNS = "Product_SGGame_Login";
            this.toLoadSiteMessage();
            //this.init();
        }
        Product_VRGame_Login.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message()
                .done(function (sitemessage) {
                //隐藏系统loading，无论显示哪种状态，都需要隐藏系统loading
                Global.Tips.hideSystemLoading();
                if (sitemessage.vrgame.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.vrgame.info["zh-cn"]);
                    $('[data-cashap-id="state_maintenance"]').removeClass("hide");
                }
                else {
                    $('[data-cashap-id="state_open"]').removeClass("hide");
                    _this.init();
                }
            });
        };
        Product_VRGame_Login.prototype.init = function () {
            var _this = this;
            Global.Log.log("Product_VRGame_Login.init");
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VRGame, baseInfo.memberLevel)) {
                        _this.loadLoginInfo();
                        // if(baseInfo.memberLevel == Global.MemberLevel.trial){
                        // 	this.loadLoginInfo();
                        // }
                        // else {
                        // 	this.loadLoginInfo();
                        // }
                    }
                });
            }
            else {
                //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                //此处默认会弹出 提示登录 的信息
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VRGame, -1);
            }
            //判断是否未登录，若是则返回退出继续执行
            // if(!Global.App.isLogin()){
            // 	alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
            // 	window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;//登录页
            // 	return false;
            // }
            //
            // var id = Global.Util.getParam("id");
            //
            // if(typeof id == "undefined"){
            // 	Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "id_invalid"));
            // 	return;
            // }
            //
            // this.loadLoginInfo();
        };
        Product_VRGame_Login.prototype.loadLoginInfo = function () {
            var _this = this;
            Api.vrgame.login_product()
                .done(function (result) {
                _this.loadLoginInfo_callBack(result);
            });
        };
        Product_VRGame_Login.prototype.loadLoginInfo_callBack = function (result) {
            if (result.errorInfo.length > 0 || !result.result) {
                if (result.errorInfo[0].errorCode == "1000015") {
                    var text = Com_Gametree_Cashap.Language.getMessage_Translate("", "unknowError");
                    Global.Tips.systemTip(text, false);
                    return;
                }
                if (result.errorInfo[0].errorCode == "1000058") {
                    var productName = Com_Gametree_Cashap.Language.getMessage_Translate("Model.Game_ID", "VRGame");
                    var text = Com_Gametree_Cashap.Language.getMessage_Translate("", "product_maintenance");
                    text = text.replace("{0}", productName);
                    Global.Tips.systemTip(text, false);
                    return;
                }
                if (result.errorInfo[0].errorCode == "" && result.errorInfo[0]["errorDetail"] != "") {
                    Global.Tips.systemTip(result.errorInfo[0]["errorDetail"], false);
                    return;
                }
                Global.Tips.systemTip(Com_Gametree_Cashap.Language["unknowError"], false);
                return;
            }
            Global.Log.log("url = %s", result.url);
            window.location.replace(result.url);
        };
        return Product_VRGame_Login;
    }());
    return Product_VRGame_Login;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_VRGame_Login.js.map