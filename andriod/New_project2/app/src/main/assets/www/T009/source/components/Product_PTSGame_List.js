define('T009/source/components/Product_PTSGame_List', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars", "Global/libs/zepto.picLazyLoad"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    // import BackToTop = require("../../../Global/source/widgets/BackToTop");
    var Product_PTSGame_List = /** @class */ (function () {
        function Product_PTSGame_List(compOption) {
            this.messageNS = "";
            //标签列表总容器
            this.categoryList = '[data-cashap-id="categoryList"]';
            this.categoryTpl = '[data-cashap-id="categoryTpl"]';
            this.categoryItem = '[data-cashap-id="categoryItem"]';
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
        Product_PTSGame_List.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message(true)
                .done(function (sitemessage) {
                if (sitemessage.ptsgame.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.ptsgame.info["zh-cn"]);
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
        Product_PTSGame_List.prototype.init = function () {
            var _this = this;
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.ptsgame.product_list()
                .done(function (data) {
                //隐藏系统loading
                Global.Tips.hideSystemLoading();
                _this.productListLoadCallback(data);
            });
            //游戏类别点击事件(类别)
            $(this.categoryList).delegate(this.categoryItem, "tap", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, id = $(target).attr("data-catalog-id");
                $(_this.categoryList).children("li").removeClass("active");
                $(target).parent().addClass("active");
                _this.changeCategory(id);
            });
            //绑定gameNameSearch
            $(this.gameNameSearchForm)[0].onsubmit = function () {
                Global.Log.log("gameNameSearchForm submit");
                _this.searchByName();
                return false;
            };
            //游戏点击事件(产品)
            $(this.gameListContainer).delegate(this.gameItem, "tap", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, gameId = $(target).parents(_this.gameItem).attr("data-game-id");
                _this.toOpenProductURL(gameId);
            });
            //顶层数据 回到顶部
            // new BackToTop({
            // 	toTopDomParentContainer: $(this.page),
            // 	scrollContainer: $(this.scrollContainer)
            // });
            Global.Log.log("Product_PTSGame_List.init");
        };
        Product_PTSGame_List.prototype.productListLoadCallback = function (data) {
            var productList = data.data, allCount = 0;
            for (var i = 0, l = productList.length; i < l; i++) {
                productList[i].isCurrent = false;
                //Sort转数字后排序
                productList[i].game.forEach(function (element) { return parseInt(element.Sort); });
                var item = productList[i].game.sort(function (a, b) { return a.Sort - b.Sort; });
                allCount += item.length;
                for (var x = 0, xl = item.length; x < xl; x++) {
                    item[x].imgURL = Com_Gametree_Cashap.Language.fileDomain + "/ptsgame/" + item[x].GameId + ".png";
                }
            }
            productList.unshift({
                CategoryName: "全部",
                Category: "ALL",
                game: { "length": allCount },
                isCurrent: true
            });
            this.gameListData = productList;
            Global.Log.log("game list data ", productList);
            this.setHtml($(this.categoryList), productList, $(this.categoryTpl).html());
            //为默认分类添加active类
            $(this.categoryList).children("li:first-child").addClass("active");
            this.setGameList(productList);
        };
        Product_PTSGame_List.prototype.changeCategory = function (Category) {
            Global.Log.log("changeCategory ", Category);
            this.gameListData.forEach(function (item, idx) {
                item.Category === Category ? item.isCurrent = true : item.isCurrent = false;
            });
            //清空游戏名称搜索框内容
            $(this.page).find(this.gameNameInput).val("");
            this.searchGameName = "";
            this.gameId = "";
            this.setGameList(this.gameListData);
        };
        /**
         * 游戏搜索
         */
        Product_PTSGame_List.prototype.searchByName = function () {
            var name = $(this.page).find(this.gameNameInput).val();
            Global.Log.log("searchByName", name);
            this.searchGameName = name;
            this.gameId = "";
            this.setGameList(this.gameListData);
        };
        Product_PTSGame_List.prototype.toOpenProductURL = function (gameId) {
            var _this = this;
            Global.Log.log("toOpenProductURL gameId = %s", gameId);
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.PTSGame, baseInfo.memberLevel)) {
                        var url = _this.loginUrl + "?id=" + gameId;
                        window.open(url);
                        // if(baseInfo.memberLevel == Global.MemberLevel.trial){
                        // 	var url = this.loginUrl + "?id=" + gameId;
                        // 	window.open(url);
                        // }
                        // else {
                        // 	var url = this.loginUrl + "?id=" + gameId;
                        // 	window.open(url);
                        // }
                    }
                });
            }
            else {
                //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                //此处默认会弹出 提示登录 的信息
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.PTSGame, -1);
            }
            //判断是否未登录，若是则返回退出继续执行
            // if(!Global.App.isLogin()){
            // 	//Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("","noLogin"));
            // 	Global.ConfirmDialog.show({
            // 		labelLeftBtn: "试玩",
            // 		labelRightBtn: "登录",
            // 		callbackLeftBtn: Global.App.trialLogin.bind(Global.App),
            // 		callbackRightBtn: Global.App.goToLoginPage.bind(Global.App)
            // 	});
            // 	return;
            // }
            //
            // var url = this.loginUrl + "?id=" + gameId;
            //
            // // window.location.href = url;
            // window.open(url);
        };
        Product_PTSGame_List.prototype.setGameList = function (productList) {
            var list = [], filterGameName = this.searchGameName;
            if (productList.length > 0) {
                if (productList[0].isCurrent) {
                    //显示全部时处理
                    productList.forEach(function (item, idx) {
                        if (item.game instanceof Array) {
                            list = list.concat(item.game);
                        }
                    });
                }
                else {
                    //显示某一分类时处理
                    productList.forEach(function (item, idx) {
                        if (item.isCurrent) {
                            list = list.concat(item.game);
                            return false;
                        }
                    });
                }
            }
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
        Product_PTSGame_List.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        return Product_PTSGame_List;
    }());
    return Product_PTSGame_List;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_PTSGame_List.js.map