define('T009/source/components/Product_PTCasino_SlotGame_Login', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api"], function (require, exports, Global, Api) {
    "use strict";
    var Product_PTCasino_SlotGame_Login = /** @class */ (function () {
        function Product_PTCasino_SlotGame_Login() {
            this.toLoadSiteMessage();
            //this.init();
        }
        Product_PTCasino_SlotGame_Login.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message()
                .done(function (sitemessage) {
                //隐藏系统loading，无论显示哪种状态，都需要隐藏系统loading
                Global.Tips.hideSystemLoading();
                if (sitemessage.ptcasino.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.ptcasino.info["zh-cn"]);
                    $('[data-cashap-id="state_maintenance"]').removeClass("hide");
                }
                else {
                    $('[data-cashap-id="state_open"]').removeClass("hide");
                    _this.init();
                }
            });
        };
        Product_PTCasino_SlotGame_Login.prototype.init = function () {
            var _this = this;
            Global.Log.log("Product_PTCasino_SlotGame_Login.init");
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.PTCasino, baseInfo.memberLevel)) {
                        if (baseInfo.memberLevel == Global.MemberLevel.trial) {
                        }
                        else {
                            _this.login();
                        }
                    }
                });
            }
            else {
                //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                //此处默认会弹出 提示登录 的信息
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.PTCasino, -1);
            }
            //判断是否未登录，若是则返回退出继续执行
            // if(!Global.App.isLogin()){
            // 	alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
            // 	window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;//登录页
            // 	return false;
            // }
            //
            // //this.login();
            //
            // Api.account.profile_baseInfo(true)
            // 	.done((result)=>{
            // 		if(result.memberLevel == 2) {
            // 			Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "onlyMemberGame"), false);
            // 			return;
            // 		}
            //
            // 		this.login();
            // 	});
        };
        Product_PTCasino_SlotGame_Login.prototype.login = function () {
            var _this = this;
            var gameCode = Global.Util.getParam("gameCode");
            Api.ptcasino.login_product({ "gameCode": gameCode, "html5": "true" })
                .done(function (result) {
                _this.loadLoginInfoCallBack(result);
            });
        };
        Product_PTCasino_SlotGame_Login.prototype.loadLoginInfoCallBack = function (result) {
            if (result.errorInfo.length > 0 || !result.result) {
                if (result.errorInfo[0].errorCode == "1000039") {
                    var productName = Com_Gametree_Cashap.Language.getMessage_Translate("Model.Game_ID", "PTCasino");
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
            window.location.replace(result.url);
        };
        return Product_PTCasino_SlotGame_Login;
    }());
    return Product_PTCasino_SlotGame_Login;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_PTCasino_SlotGame_Login.js.map