/**
 * 产品组件--OG娱乐城
 */
define('T009/source/components/Product_OGGame', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api"], function (require, exports, Global, Api) {
    "use strict";
    var Product_OGGame = /** @class */ (function () {
        function Product_OGGame() {
            this.toLoadSiteMessage();
            //this.init();
        }
        Product_OGGame.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message()
                .done(function (sitemessage) {
                //隐藏系统loading，无论显示哪种状态，都需要隐藏系统loading
                Global.Tips.hideSystemLoading();
                if (sitemessage.oggame.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.oggame.info["zh-cn"]);
                    $('[data-cashap-id="state_maintenance"]').removeClass("hide");
                }
                else {
                    $('[data-cashap-id="state_open"]').removeClass("hide");
                    _this.init();
                }
            });
        };
        Product_OGGame.prototype.init = function () {
            var _this = this;
            Global.Log.log("Product_OGGame.init");
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.OGGame, baseInfo.memberLevel)) {
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
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.OGGame, -1);
            }
            //判断是否未登录，若是则返回退出继续执行
            // if(!Global.App.isLogin()){
            // 	alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
            // 	window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;//登录页
            // 	return false;
            // }
            //
            // this.loadLoginInfo();
        };
        Product_OGGame.prototype.loadLoginInfo = function () {
            var _this = this;
            Api.account.loginInfo_OGGaming({ "html5": true })
                .done(function (result) {
                _this.loadLoginInfo_callBack(result);
            });
        };
        Product_OGGame.prototype.loadLoginInfo_callBack = function (result) {
            if (result.errorInfo.length > 0 || !result.result) {
                if (result.errorInfo[0].errorCode == "1000019") {
                    var productName = Com_Gametree_Cashap.Language.getMessage_Translate("Model.Game_ID", "OGGame");
                    var text = Com_Gametree_Cashap.Language.getMessage_Translate("", "product_maintenance");
                    text = text.replace("{0}", productName);
                    Global.Tips.systemTip(text);
                    return;
                }
                if (result.errorInfo[0].errorCode == "" && result.errorInfo[0]["errorDetail"] != "") {
                    Global.Tips.systemTip(result.errorInfo[0]["errorDetail"]);
                    return;
                }
                Global.Tips.systemTip(Com_Gametree_Cashap.Language["unknowError"]);
                return;
            }
            Global.Log.log("url = %s", result.url);
            window.location.replace(result.url);
        };
        return Product_OGGame;
    }());
    return Product_OGGame;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_OGGame.js.map