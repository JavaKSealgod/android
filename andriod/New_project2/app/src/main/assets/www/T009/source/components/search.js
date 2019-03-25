define('T009/source/components/search', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars", "Global/libs/zepto.picLazyLoad"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    // import BackToTop = require("../../../Global/source/widgets/BackToTop");
    var Search = /** @class */ (function () {
        function Search(compOption) {
            this.messageNS = "";
            this.scrollContainer = '[data-cashap-id="scrollContainer"]';
            this.gameListContainer = '[data-cashap-id="gameListContainer"]';
            this.gameListTpl = '[data-cashap-id="gameListTpl"]';
            this.gameItem = '[data-cashap-id="gameItem"]';
            this.playNow = '[data-cashap-id="playNow"]';
            this.like = '[data-cashap-id="like"]';
            this.backWard = '[data-cashap-id="backWard"]';
            this.lazyloadItem = '[data-cashap-id="lazyload"]';
            //游戏搜索
            this.searchGameName = "";
            this.gameId = "";
            this.gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
            this.gameNameInput = 'input[name="gamename"]';
            this.page = '[data-cashap-id="' + compOption.page + '"]';
            this.loadSiteMessage();
        }
        Search.prototype.loadSiteMessage = function () {
            var _this = this;
            Api.message.site_message(true)
                .done(function (result) {
                if (result.kygame.state) {
                    _this.KYGameMaintain = 'kygame';
                }
                if (result.vggame.state) {
                    _this.VGGameMaintain = 'vggame';
                }
                if (result.mtcasino.state) {
                    _this.MTCasinoMaintain = 'mtcasino';
                }
                _this.toLoadProductData();
            });
        };
        Search.prototype.toLoadProductData = function () {
            var _this = this;
            Global.Log.log("toLoadProductData");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.cardgame.product_list()
                .done(function (data) {
                //隐藏系统loading
                Global.Tips.hideSystemLoading();
                _this.productListLoadCallback(data);
            });
        };
        Search.prototype.productListLoadCallback = function (data) {
            var _this = this;
            var productList = data.data;
            var favouriteList = JSON.parse(localStorage.getItem('likeList'));
            if (favouriteList === null)
                favouriteList = [];
            for (var i = 0, l = productList.length; i < l; i++) {
                productList[i].imgURL = Com_Gametree_Cashap.Language.fileDomain + "/" + productList[i].GameName + "/" + productList[i].GameId + ".png";
                productList.memberRule = productList.GameName;
                productList[i].isLike = false;
                productList[i].New = productList[i].New === 'true';
                productList[i].Hot = productList[i].Hot === 'true';
                if (favouriteList.map(function (item) { return item.GameId; }).indexOf(productList[i].GameId) >= 0) {
                    productList[i].isLike = true;
                }
            }
            this.gameListData = productList.filter(function (item) { return (item.GameName != _this.KYGameMaintain && item.GameName != _this.MTCasinoMaintain && item.GameName != _this.VGGameMaintain); });
            this.init();
        };
        Search.prototype.init = function () {
            var _this = this;
            //绑定gameNameSearch
            $(this.gameNameSearchForm)[0].onsubmit = function () {
                Global.Log.log("gameNameSearchForm submit");
                _this.searchByName();
                return false;
            };
            //游戏点击事件
            $(this.gameListContainer).delegate(this.playNow, "tap", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, gameId = $(target).parents(_this.gameItem).attr("data-game-id");
                var gameData = _this.gameListData.filter(function (item) {
                    return gameId === item.GameId;
                });
                _this.historyData = JSON.parse(localStorage.getItem('historyList'));
                if (_this.historyData === null)
                    _this.historyData = [];
                if (_this.historyData.map(function (item) { return item.GameId; }).indexOf(gameId) < 0) {
                    (_a = _this.historyData).push.apply(_a, gameData);
                }
                localStorage.setItem('historyList', JSON.stringify(_this.historyData));
                _this.toOpenProductURL(gameData);
                var _a;
            });
            $(this.backWard).tap(function (e) {
                window.history.back();
            });
            //点击爱心加入最爱 
            $(this.gameListContainer).delegate(this.like, "tap", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, targetItem = $(target).parents(_this.gameItem).attr("data-game-id");
                var favouriteList = JSON.parse(localStorage.getItem('likeList'));
                if (favouriteList === null)
                    favouriteList = [];
                if ($(target).hasClass("icon-islike")) {
                    $(target).removeClass("icon-islike");
                    favouriteList = favouriteList.filter(function (item) {
                        return targetItem !== item.GameId;
                    });
                    _this.addFavourite(favouriteList);
                }
                else {
                    $(target).addClass("icon-islike");
                    var favouriteItem = _this.gameListData.filter(function (item) {
                        return targetItem === item.GameId;
                    });
                    favouriteItem[0].isLike = true;
                    favouriteList.push.apply(favouriteList, favouriteItem);
                    _this.addFavourite(favouriteList);
                }
            });
            //绑定搜寻的placeholder显示与否
            $(this.gameNameSearchForm).find(this.gameNameInput).on("blur", function (e) {
                $(".search-placeholder").removeClass("hide");
                if ($(_this.gameNameInput).val()) {
                    $(".search-placeholder").addClass("hide");
                }
            });
        };
        //加入最爱
        Search.prototype.addFavourite = function (item) {
            localStorage.setItem('likeList', JSON.stringify(item));
        };
        /**
         * 游戏搜索
         */
        Search.prototype.searchByName = function () {
            var name = $(this.page).find(this.gameNameInput).val();
            Global.Log.log("searchByName", name);
            this.searchGameName = name;
            this.gameId = "";
            this.setGameList(this.gameListData);
            $(this.gameNameSearchForm).find(this.gameNameInput).blur();
        };
        Search.prototype.toOpenProductURL = function (gameId) {
            Global.Log.log("toOpenProductURL gameId = %s", gameId);
            var game, url;
            switch (gameId[0].GameName) {
                case "kygame":
                    url = "KYGame_Login.html?" + gameId[0].Parameter;
                    game = "KYGame";
                    break;
                case "mtcasino":
                    url = "MTCasino.html?" + gameId[0].Parameter;
                    game = "MTCasino";
                    break;
                case "vggame":
                    url = "VGGame_Login.html?GameKey=" + gameId[0].GameId;
                    game = "VGGame";
                    break;
            }
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId[game], baseInfo.memberLevel)) {
                        window.open(url);
                    }
                });
            }
            else {
                //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                //此处默认会弹出 提示登录 的信息
                Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId[game], -1);
            }
        };
        Search.prototype.setGameList = function (productList) {
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
        Search.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        return Search;
    }());
    return Search;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/search.js.map