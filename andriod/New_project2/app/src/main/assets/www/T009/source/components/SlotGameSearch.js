/**
 * 电子游戏列表
 */
/// <amd-dependency path="Global/libs/jquery.md5" />
define('T009/source/components/SlotGameSearch', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars", "Global/libs/jquery.md5"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    var SlotGameSearch = /** @class */ (function () {
        function SlotGameSearch() {
            var _this = this;
            this.gameSetting = {
                ptcasino: true
            };
            this.siteMessage = null;
            this.productList = [];
            this.gameItemContainer = '[data-cashap-id="gameItemContainer"]';
            this.gameItem = '[data-cashap-id="gameItem"]';
            this.tpl_gameItem = '[data-cashap-id="gameItemTpl"]';
            //跑马灯
            this.noticeTpl = '[data-cashap-id="noticeTpl"]';
            this.noticeContent = '[data-cashap-id="noticeContent"]';
            this.marquee = '[data-cashap-id="marquee"]';
            // 跑马灯讯息
            this.scrollDown = function () {
                $(_this.marquee + " > span").forEach(function (item) {
                    item = $(item);
                    if (item.css("left") == "auto") {
                        item.css("left", "0px");
                    }
                    var left = parseInt(item.css("left").split("px")[0]);
                    var width = item.width();
                    if (left * -1 >= width) {
                        item.css("left", item.parent().css("width"));
                    }
                    else {
                        item.css("left", left - 1);
                    }
                });
                requestAnimationFrame(_this.scrollDown);
            };
            this.init();
        }
        SlotGameSearch.prototype.init = function () {
            var _this = this;
            Global.Log.log("Product_FishGame.init");
            Global.Tips.showSystemLoading();
            Api.message.site_message(true)
                .done(function (result) {
                Global.Tips.hideSystemLoading();
                _this.siteMessageCallback(result);
            });
        };
        SlotGameSearch.prototype.siteMessageCallback = function (result) {
            var _this = this;
            var content = [];
            if (result.result) {
                this.siteMessage = result;
                this.getProductList();
                $(this.gameItemContainer).delegate(this.gameItem, "tap", function (e) {
                    if (e)
                        e.preventDefault();
                    var $target = $(e.currentTarget), item = _this.getItemByGameId($($target).attr("data-game-id"), $($target).attr("data-show-type"));
                    //函数：accessCheck，无权限时默认会自行显示提示信息
                    if (Global.App.isLogin()) {
                        Api.account.profile_baseInfo(true)
                            .done(function (baseInfo) {
                            if (Global.App.accessCheck(item.memberRule, baseInfo.memberLevel)) {
                                _this.openProductUrl(item);
                            }
                        });
                    }
                    else {
                        //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                        //此处默认会弹出 提示登录 的信息
                        Global.App.accessCheck(item.memberRule, -1);
                    }
                });
            }
            if (result.result && result.siteMessage) {
                result.siteMessage.forEach(function (item, idx) {
                    //未登录且showTag=false时，不显示当前项。showTag不存在，默认显示
                    if (!Global.App.isLogin() && item.hasOwnProperty("showTag") && !item.showTag) {
                        return;
                    }
                    //isDisplay存在且为false时，不显示当前项
                    if (item.hasOwnProperty("isDisplay") && !item.isDisplay) {
                        return;
                    }
                    var date = new Date(item.startDate), day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
                    day = day >= 10 ? day : "0" + day;
                    month = month >= 10 ? month : "0" + month;
                    item["day"] = day;
                    item["month"] = month;
                    item["year"] = year;
                    content.push(item);
                });
            }
            Global.Log.log("generate data ", content);
            content = content.length === 0 ? [{ content: "" }] : content;
            content.map(function (item) { return item.content; });
            this.setHtml($("#notice-content"), content, $(this.noticeTpl).html());
            this.setMarqueeWidth();
        };
        SlotGameSearch.prototype.getProductList = function () {
            var _this = this;
            Api.fishgame.product_list()
                .done(function (data) {
                //隐藏系统loading
                Global.Tips.hideSystemLoading();
                _this.setProductList(data);
            });
        };
        SlotGameSearch.prototype.setProductList = function (data) {
            var productList = data.data;
            for (var i = 0, l = productList.length; i < l; i++) {
                var item = productList[i];
                switch (item.GameName.toLowerCase()) {
                    case 'megawincasino':
                        //item.ShowType 的值目前不清楚 'app' 大小写
                        if (item.GameId === '1051' && item.ShowType === 'H5') {
                            item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/fishgame2/" + item.GameName + '-' + item.GameId + '-' + item.ShowType + '.jpg';
                        }
                        else {
                            item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/fishgame2/" + item.GameName + '-' + item.GameId + '-APP.jpg';
                        }
                        break;
                    default:
                        item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/fishgame2/" + item.GameName + '-' + item.GameId + '.jpg';
                }
                item.memberRule = item.GameName;
            }
            this.gameListData = productList;
            Global.Log.log("game list data ", productList);
            this.setGameList(productList);
        };
        SlotGameSearch.prototype.openProductUrl = function (item) {
            var url;
            switch (item.GameName) {
                case "megawincasino":
                    if (item.ShowType === "APP") {
                        url = item.GameName + "_Login.html?mode=app";
                    }
                    else if (item.ShowType === "H5") {
                        url = item.GameName + "_Login.html?mode=h5&" + item.Parameter;
                    }
                    break;
                case "fishlegends":
                    url = item.GameName + ".html";
                    break;
                case "spincube":
                    url = "SpinCube.html?" + item.Parameter;
                    break;
                case "ptcasino":
                    url = "PTCasino_SlotGame_Login.html?" + item.Parameter;
                    break;
                default:
                    url = item.GameName + "_Login.html?" + item.Parameter;
            }
            window.open(url);
        };
        //透过 API回传的 GameId取得物件 及透过 ShowType判断 h5 或 app
        SlotGameSearch.prototype.getItemByGameId = function (GameId, ShowType) {
            var result = null;
            for (var i = 0, l = this.gameListData.length; i < l; i++) {
                if (this.gameListData[i].GameId === GameId && this.gameListData[i].ShowType === ShowType) {
                    result = this.gameListData[i];
                    break;
                }
            }
            return result;
        };
        SlotGameSearch.prototype.setGameList = function (productList) {
            var list = productList;
            var result = list;
            this.setHtml($(this.gameItemContainer), result, $(this.tpl_gameItem).html());
        };
        //设置跑马灯宽度
        SlotGameSearch.prototype.setMarqueeWidth = function () {
            var width = 0;
            $(this.marquee + " > span > *").forEach(function (item) {
                width += $(item).width();
            });
            $(this.marquee + " > span").width(width);
            requestAnimationFrame(this.scrollDown);
        };
        /**
         * 创建html结构
         */
        SlotGameSearch.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        return SlotGameSearch;
    }());
    return SlotGameSearch;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/SlotGameSearch.js.map