define('T009/source/components/Product_WG_List_new', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars", "Global/libs/zepto.picLazyLoad"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    // import BackToTop = require("../../../Global/source/widgets/BackToTop");
    var Product_WG_List = /** @class */ (function () {
        function Product_WG_List(compOption) {
            //当前Login跳转URL，由外部传入
            this.loginUrl = "";
            this.messageNS = "";
            this.gameList = [];
            this.scrollContainer = '[data-cashap-id="scrollContainer"]';
            this.gameListContainer = '[data-cashap-id="gameListContainer"]';
            this.gameItemContainer = '[data-cashap-id="gameItem"]';
            this.gameItemTpl = '[data-cashap-id="gameItemTpl"]';
            this.lazyloadItem = '[data-cashap-id="lazyload"]';
            this.profileInfo = null;
            this.page = '[data-cashap-id="' + compOption.page + '"]';
            this.loginUrl = compOption.loginUrl;
            this.toLoadSiteMessage();
            //this.init();
        }
        Product_WG_List.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message(true)
                .done(function (sitemessage) {
                if (sitemessage.wg.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.wg.info["zh-cn"]);
                    $('[data-cashap-id="state_maintenance"]').removeClass("hide");
                    //隐藏系统loading
                    Global.Tips.hideSystemLoading();
                }
                else {
                    $('[data-cashap-id="state_open"]').removeClass("hide");
                    _this.init();
                }
            });
        };
        Product_WG_List.prototype.init = function () {
            var _this = this;
            //显示系统loading
            Global.Tips.showSystemLoading();
            this.loadProductList();
            //若当前已经登录，则提前获取会员基本信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (info) {
                    _this.profileInfo = info;
                });
            }
            $(this.page).delegate(this.gameItemContainer, "tap", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, idx = $(target).attr("data-index") || $(target).parents(_this.gameItemContainer).attr("data-index");
                _this.openProductUrl(_this.gameList[idx]);
            });
            //顶层数据 回到顶部
            // new BackToTop({
            // 	toTopDomParentContainer: $(this.page),
            // 	scrollContainer: $(this.scrollContainer)
            // });
            Global.Log.log("Product_WG_List.init");
        };
        /**
         * 加载数据
         */
        Product_WG_List.prototype.loadProductList = function () {
            var _this = this;
            Api.wg_series.product_list_new()
                .done(function (list) {
                //隐藏系统loading
                Global.Tips.hideSystemLoading();
                _this.toLoadCallback(list);
            });
        };
        /**
         * 加载数据,Ajax回调
         * @param result
         */
        Product_WG_List.prototype.toLoadCallback = function (result) {
            var _this = this;
            if (result.errorInfo.length > 0) {
                if (result.errorInfo[0].errorCode == "1000026") {
                    var productName = Com_Gametree_Cashap.Language.getMessage_Translate("Model.Game_ID", "WG");
                    var text = Com_Gametree_Cashap.Language.getMessage_Translate("", "product_maintenance");
                    text = text.replace("{0}", productName);
                    Global.Tips.systemTip(text);
                    return;
                }
                var text = Com_Gametree_Cashap.Language.getMessage_Translate("", result.errorInfo[0].errorCode);
                Global.Tips.systemTip(text);
            }
            else {
                //挑出game再合并
                result.data.map(function (element) { return element.game; }).forEach(function (element) {
                    return (_a = _this.gameList).push.apply(_a, element);
                    var _a;
                });
                //依照sort 排序
                this.gameList.forEach(function (element) { return parseInt(element.Sort); });
                this.gameList = this.gameList.sort(function (a, b) { return a.Sort - b.Sort; });
                this.setGameList();
                $(this.gameListContainer).find(this.lazyloadItem).picLazyLoad({ scrollContainer: this.scrollContainer, threshold: 200, placeholder: "" });
            }
        };
        /**
         * 生成并设置游戏列表html结构
         */
        Product_WG_List.prototype.setGameList = function () {
            var template = Handlebars.compile($(this.gameItemTpl).html()), html = template(this.gameList);
            $(this.gameListContainer).html(html);
        };
        /**
         * 打开产品路径
         * @param item
         */
        Product_WG_List.prototype.openProductUrl = function (item) {
            var _this = this;
            Global.Log.log("openProductUrl=%s", item.GameId);
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.WG, baseInfo.memberLevel)) {
                        if (baseInfo.memberLevel == Global.MemberLevel.trial) {
                        }
                        else {
                            var url = _this.loginUrl + "?id=" + encodeURI(item.GameId) + "&_v=" + (new Date()).valueOf();
                            window.open(url);
                        }
                    }
                });
            }
            else {
                //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                //此处默认会弹出 提示登录 的信息
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.WG, -1);
            }
            // if(!Global.App.isLogin()){
            // 	//Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
            // 	Global.ConfirmDialog.show({
            // 		labelRightBtn: "马上登录",
            // 		callbackRightBtn: Global.App.goToLoginPage.bind(Global.App)
            // 	});
            // 	return;
            // }
            //
            // Api.account.profile_baseInfo(true)
            // 	.done((baseInfo)=>{
            // 		if(baseInfo.memberLevel == Global.MemberLevel.trial){
            // 			Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMemberGame"));
            // 		}
            // 		else {
            // 			var url = this.loginUrl + "?id="+ encodeURI(item.GameId) +"&_v="+(new Date()).valueOf();
            //
            // 			window.open(url);
            // 		}
            // 	});
        };
        return Product_WG_List;
    }());
    return Product_WG_List;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_WG_List_new.js.map