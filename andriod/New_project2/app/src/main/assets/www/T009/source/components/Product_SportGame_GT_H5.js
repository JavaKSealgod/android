define('T009/source/components/Product_SportGame_GT_H5', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api"], function (require, exports, Global, Api) {
    "use strict";
    var Product_SportGame_GT_H5 = /** @class */ (function () {
        function Product_SportGame_GT_H5() {
            this.toLoadSiteMessage();
            //this.init();
        }
        Product_SportGame_GT_H5.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message()
                .done(function (sitemessage) {
                //隐藏系统loading，无论显示哪种状态，都需要隐藏系统loading
                Global.Tips.hideSystemLoading();
                if (sitemessage.sportGame_gt.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.sportGame_gt.info["zh-cn"]);
                    $('[data-cashap-id="state_maintenance"]').removeClass("hide");
                }
                else {
                    $('[data-cashap-id="state_open"]').removeClass("hide");
                    _this.init();
                }
            });
        };
        Product_SportGame_GT_H5.prototype.init = function () {
            var _this = this;
            Global.Log.log("Product_SportGame_GT_H5.init");
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.sport_bigBall, baseInfo.memberLevel)) {
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
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.sport_bigBall, -1);
            }
            // if(!Global.App.isLogin()){
            // 	alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
            // 	window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;//登录页
            // 	return false;
            // }
            //
            // this.loadLoginInfo();
        };
        /**
         * 获取产品登录信息
         */
        Product_SportGame_GT_H5.prototype.loadLoginInfo = function () {
            Api.account.logininfo_sportgame_gt({ "html5": true })
                .done(function (result) {
                if (result.errorInfo.length > 0 || !result.result) {
                    if (result.errorInfo[0].errorCode == "1000020") {
                        var productName = Com_Gametree_Cashap.Language.getMessage_Translate("Model.Game_ID", "sportGame");
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
                var url = result.url, homePageUrl = window.location.protocol + "//" + window.location.host + window.location.pathname.replace(/(\/*.*\/)[^\.]*\.html/i, "$1") + Com_Gametree_Cashap.SiteConfig.HomePageUrl;
                if (url.indexOf("?") > -1) {
                    url += "&backurl=" + encodeURIComponent(homePageUrl);
                }
                else {
                    url += "?backurl=" + encodeURIComponent(homePageUrl);
                }
                window.location.replace(url);
            })
                .fail(function () {
                Global.Tips1.show({
                    tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SystemTips"),
                    tipsContentTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "ajax_timeout"),
                    leftbtnShow: true,
                    leftbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                    leftbtnfunction: function () {
                        Global.Tips1.hide();
                    }
                });
            });
        };
        return Product_SportGame_GT_H5;
    }());
    return Product_SportGame_GT_H5;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_SportGame_GT_H5.js.map