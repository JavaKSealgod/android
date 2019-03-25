define('T009/source/components/Product_VGGame_List_new', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars", "Global/libs/zepto.picLazyLoad"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    // import BackToTop = require("../../../Global/source/widgets/BackToTop");
    var Product_VGGame_List = /** @class */ (function () {
        function Product_VGGame_List(compOption) {
            this.messageNS = "";
            this.scrollContainer = '[data-cashap-id="scrollContainer"]';
            this.gameListContainer = '[data-cashap-id="gameListContainer"]';
            this.gameListTpl = '[data-cashap-id="gameListTpl"]';
            this.gameItem = '[data-cashap-id="gameItem"]';
            this.lazyloadItem = '[data-cashap-id="lazyload"]';
            //游戏搜索
            this.searchGameName = "";
            this.gameId = "";
            this.gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
            this.gameNameInput = 'input[name="gamename"]';
            this.page = '[data-cashap-id="' + compOption.page + '"]';
            this.loginUrl = compOption.loginUrl;
            this.toLoadSiteMessage();
            //this.init();
        }
        Product_VGGame_List.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message(true)
                .done(function (sitemessage) {
                if (sitemessage.vggame.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.vggame.info["zh-cn"]);
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
        Product_VGGame_List.prototype.init = function () {
            var _this = this;
            Api.vggame.product_list_new()
                .done(function (data) {
                //隐藏系统loading
                Global.Tips.hideSystemLoading();
                _this.productListLoadCallback(data);
            });
            //绑定gameNameSearch
            $(this.gameNameSearchForm)[0].onsubmit = function () {
                Global.Log.log("gameNameSearchForm submit");
                _this.searchByName();
                return false;
            };
            //绑定搜寻的placeholder显示与否
            $(this.gameNameSearchForm).find(this.gameNameInput).on("blur", function (e) {
                $(".search-placeholder").removeClass("hide");
                if ($(_this.gameNameInput).val()) {
                    $(".search-placeholder").addClass("hide");
                }
            });
            //游戏点击事件
            $(this.gameListContainer).delegate(this.gameItem, "tap", function (e) {
                e.preventDefault();
                var target = e.currentTarget, //e.target || e.srcElement,
                gameId = $(target).attr("data-game-key");
                _this.toOpenProductURL(gameId);
            });
            //顶层数据 回到顶部
            // new BackToTop({
            // 	toTopDomParentContainer: $(this.page),
            // 	scrollContainer: $(this.scrollContainer)
            // });
            Global.Log.log("Product_VGGame_List.init");
        };
        Product_VGGame_List.prototype.productListLoadCallback = function (data) {
            //加入游戏至productList
            var productList = [];
            data.data.map(function (element) { return element.game; }).forEach(function (element) { return productList.push.apply(productList, element); });
            //依照sort 排序
            productList.forEach(function (element) { return parseInt(element.Sort); });
            productList = productList.sort(function (a, b) { return a.Sort - b.Sort; });
            for (var i = 0, l = productList.length; i < l; i++) {
                var item = productList[i];
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/vggame/" + item.GameId + ".png";
            }
            this.gameListData = productList;
            Global.Log.log("game list data ", productList);
            this.setGameList(productList);
        };
        /**
         * 游戏搜索
         */
        Product_VGGame_List.prototype.searchByName = function () {
            var name = $(this.page).find(this.gameNameInput).val();
            Global.Log.log("searchByName", name);
            this.searchGameName = name;
            this.gameId = "";
            this.setGameList(this.gameListData);
        };
        Product_VGGame_List.prototype.toOpenProductURL = function (gameKey) {
            var _this = this;
            Global.Log.log("toOpenProductURL gameKey = %s", gameKey);
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VGGame, baseInfo.memberLevel)) {
                        var url = _this.loginUrl + "?GameKey=" + gameKey;
                        //window.location.href = url;
                        window.open(url);
                    }
                });
            }
            else {
                //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                //此处默认会弹出 提示登录 的信息
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VGGame, -1);
            }
        };
        Product_VGGame_List.prototype.setGameList = function (productList) {
            var list = productList, filterGameName = this.searchGameName;
            var result = list;
            if (Global.Util.trim(filterGameName) != "") {
                result = [];
                var lowName = filterGameName.toLowerCase();
                list.forEach(function (item, idx) {
                    if (item.Name.toLowerCase().indexOf(lowName) > -1) {
                        result.push(item);
                    }
                });
            }
            this.setHtml($(this.gameListContainer), result, $(this.gameListTpl).html());
            $(this.gameListContainer).find(this.lazyloadItem).picLazyLoad({ scrollContainer: this.scrollContainer, threshold: 200, placeholder: "" });
            //滚动区域滚回顶部
            $(this.scrollContainer).scrollTop(0);
        };
        /**
         * 创建html结构
         */
        Product_VGGame_List.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        return Product_VGGame_List;
    }());
    return Product_VGGame_List;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_VGGame_List_new.js.map