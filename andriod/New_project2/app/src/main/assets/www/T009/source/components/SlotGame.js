/**
 * 电子游戏列表
 */
/// <amd-dependency path="Global/libs/jquery.md5" />
define('T009/source/components/SlotGame', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars", "Global/libs/jquery.md5"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    var SlotGame = /** @class */ (function () {
        function SlotGame() {
            var _this = this;
            this.siteMessage = null;
            this.productList = [];
            this.gameItemContainer = '[data-cashap-id="gameItemContainer"]';
            this.gameItem = '[data-cashap-id="gameItem"]';
            this.tpl_gameItem = '[data-cashap-id="gameItemTpl"]';
            this.gameCategoryList = '[data-cashap-id="gameCategoryList"]';
            this.gameCategoryItem = '[data-cashap-id="gameCategoryItem"]';
            //跑马灯
            this.noticeTpl = '[data-cashap-id="noticeTpl"]';
            this.noticeContent = '[data-cashap-id="noticeContent"]';
            this.marquee = '[data-cashap-id="marquee"]';
            this.slotgameroductTitle = '[data-cashap-id="slotgame-product-title"]';
            //搜寻
            this.gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
            this.gameNameInput = 'input[name="gamename"]';
            this.searchGameName = "";
            this.gameId = "";
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
        SlotGame.prototype.init = function () {
            var _this = this;
            Global.Log.log("Product_SlotGame.init");
            Global.Tips.showSystemLoading();
            Api.message.site_message(true)
                .done(function (result) {
                Global.Tips.hideSystemLoading();
                _this.siteMessageCallback(result);
            });
            //游戏列表点击事件
            $(this.gameCategoryList).delegate(this.gameCategoryItem, "click", function (e) {
                if (e)
                    e.preventDefault();
                var $target = $(e.currentTarget), item = $($target).attr("data-pkg-product-id");
                $('.row-50').removeClass('active');
                $($target).addClass('active');
                _this.getProductList(item);
                //切换后回到最左侧
                $(_this.gameItemContainer).scrollLeft(0);
            });
            //绑定游戏点击事件
            $(this.gameItemContainer).delegate(this.gameItem, "click", function (e) {
                if (e)
                    e.preventDefault();
                if (e)
                    e.preventDefault();
                var $target = $(e.currentTarget), targetItem = $target.attr("data-game-id"), GameCode = $target.attr("data-game-code"), gameKey = $target.attr("data-game-key"), gameName = $target.attr("data-member-rule"), item = {
                    "GameName": gameName,
                    "GameId": targetItem,
                    "memberRule": gameName,
                    "GameCode": GameCode,
                    "GameKey": gameKey
                };
                _this.checkPermission(item);
            });
            //绑定gameNameSearch
            $(this.gameNameSearchForm)[0].onsubmit = function () {
                Global.Log.log("gameNameSearchForm submit");
                _this.searchByName();
                return false;
            };
            //默认显示第一个游戏
            $(this.gameCategoryList).find(".row-50:first-child").addClass('active');
            var firstGame = $(this.gameCategoryList).find(".row-50:first-child").attr("data-pkg-product-id");
            this.getProductList(firstGame);
        };
        SlotGame.prototype.siteMessageCallback = function (result) {
            var content = [];
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
        SlotGame.prototype.getProductList = function (item) {
            var _this = this;
            //显示系统 loading 并隐藏列表
            Global.Tips.showSystemLoading();
            $('[data-cashap-state="state_open"]').addClass("hide");
            $('[data-cashap-state="state_maintenance"]').addClass("hide");
            var gameName, data, stateName;
            switch (item) {
                case "SlotGame_MGCasino":
                    data = { gameKind: 1 };
                    gameName = "mgcasino";
                    stateName = item.toLowerCase();
                    break;
                case "PTCasino":
                    data = { "gameType": "", "gameName": "" };
                    gameName = "PTCasino";
                    stateName = item.toLowerCase();
                    break;
                case "GNSCasino":
                    gameName = "gnsgame";
                    stateName = item.toLowerCase();
                    break;
                case "bb":
                    gameName = "bb_list";
                    stateName = item.toLowerCase();
                    break;
                case "SlotGame_AGCasino":
                    gameName = "agcasino_list";
                    stateName = "agcasino";
                    break;
                case "WG":
                    gameName = "wg_series";
                    stateName = item.toLowerCase();
                    break;
                case "MegawinCasinoH5":
                    gameName = "megawincasino";
                    stateName = 'megawincasino';
                    break;
                case "SpinCube_slot":
                    gameName = item;
                    stateName = "spincube";
                    break;
                default:
                    stateName = item.toLowerCase();
                    gameName = item;
            }
            Api.message.site_message(true)
                .done(function (sitemessage) {
                if (sitemessage[stateName].state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceDesc"]').html(Com_Gametree_Cashap.Language["Model.Game_ID"][stateName]);
                    $('[data-cashap-id="maintenanceDesc1"]').html(Com_Gametree_Cashap.Language["Model.Game_ID"][stateName] + " 正在维护中");
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage[stateName].info["zh-cn"]);
                    $('[data-cashap-state="state_maintenance"]').removeClass("hide");
                    //隐藏系统loading
                    Global.Tips.hideSystemLoading();
                }
                else {
                    $('[data-cashap-state="state_open"]').removeClass("hide");
                    var productInfo;
                    if (gameName === 'MegawinCasino') {
                        //隐藏系统loading
                        Global.Tips.hideSystemLoading();
                        productInfo = {
                            url: "MegawinCasino_Login.html?mode=app",
                            memberRule: gameName
                        };
                        _this.checkProductPermission(productInfo);
                        return;
                    }
                    else if (gameName === 'SpinCube_slot') {
                        //隐藏系统loading
                        Global.Tips.hideSystemLoading();
                        productInfo = {
                            url: "SpinCube_Login.html",
                            memberRule: gameName
                        };
                        _this.checkProductPermission(productInfo);
                        return;
                    }
                    else if (gameName === 'MTCasino') {
                        //隐藏系统loading
                        Global.Tips.hideSystemLoading();
                        productInfo = {
                            url: "MTCasino_Login.html",
                            memberRule: gameName
                        };
                        _this.checkProductPermission(productInfo);
                        return;
                    }
                    else {
                        Api[gameName.toLowerCase()][Com_Gametree_Cashap.Language.GameAPI[item]](data)
                            .done(function (data) {
                            //隐藏系统loading
                            Global.Tips.hideSystemLoading();
                            _this.setProductList(data, item);
                        });
                    }
                }
            });
        };
        SlotGame.prototype.setProductList = function (data, GameName) {
            var productList = [];
            if (GameName === 'SlotGame_MGCasino') {
                data.data.forEach(function (element) { return productList.push(element); });
            }
            else {
                data.data.map(function (element) {
                    if (element.Category != 'hot' && element.Category !== 'new' && element.Category !== 'recommend') {
                        return element.game;
                    }
                }).forEach(function (element) { return productList.push.apply(productList, element); });
            }
            for (var i = 0, l = productList.length; i < l; i++) {
                var item = productList[i];
                item.GameName = GameName;
                item.rule = item.GameName;
                if (item.GameName === 'PTCasino') {
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/ptcasino/gameicon/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat["ptcasino"];
                }
                else if (item.GameName === 'JDBGame') {
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/jdbgame2/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat["jdbgame"];
                }
                else if (item.GameName === 'bb') {
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/bbgame/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                }
                else if (item.GameName === 'SlotGame_AGCasino') {
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/aggame/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat["aggame"];
                }
                else if (item.GameName === 'SlotGame_MGCasino') {
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + '/mgmobile/' + item.img;
                    item.Name = item.name;
                    item.GameId = item.gameid;
                    item.isMG = true;
                }
                else if (item.GameName === 'AGIGame' || item.GameName === 'MegawinCasinoH5') {
                    item.imgURL = item.GameIcon;
                }
                else if (item.GameName === 'WG') {
                    item.imgURL = item.GameIcon.replace(/^\/{2}.+?\//, Com_Gametree_Cashap.Language.fileDomain + '/');
                }
                else if (item.GameName === 'toggame') {
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + '/toggame2/' + item.GameId + ".jpg";
                }
                else {
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/" + item.GameName + "/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName.toLowerCase()];
                }
            }
            //依照sort 排序
            productList.forEach(function (element) { return parseInt(element.Sort); });
            productList = productList.sort(function (a, b) { return a.Sort - b.Sort; });
            this.gameListData = productList;
            Global.Log.log("game list data ", productList);
            this.setGameList(productList);
        };
        //没有列表的登入检查
        SlotGame.prototype.checkProductPermission = function (item) {
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(item.memberRule, baseInfo.memberLevel)) {
                        window.open(item.url);
                    }
                });
            }
            else {
                //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
                //此处默认会弹出 提示登录 的信息
                Global.App.accessCheck(item.memberRule, -1);
            }
        };
        SlotGame.prototype.checkPermission = function (item) {
            var _this = this;
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
        };
        SlotGame.prototype.openProductUrl = function (item) {
            var url;
            switch (item.GameName) {
                case "MegawinCasinoH5":
                    url = "MegawinCasino_Login.html?mode=h5&gameId=" + item.GameId;
                    break;
                case "slotgame_mgcasino":
                    url = item.GameName + "_Login.html?gameid=" + item.GameId + "&language=zh";
                    break;
                case "bb":
                    url = "bb_Login.html?html=true&game=" + item.GameId + "&mode=game";
                    break;
                case "GNSCasino":
                    url = item.GameName + "_Login.html?key=" + item.GameKey;
                    break;
                case "PTCasino":
                    url = "PTCasino_SlotGame_Login.html?gameCode=" + item.GameId;
                    break;
                case "SlotGame_AGCasino":
                    url = item.GameName + "_Login.html?game=" + item.GameId;
                    break;
                case "CQCasino":
                    url = item.GameName + "_Login.html?gamecode=" + item.GameId + "&gamekind=Slot&gamehall=cq9";
                    break;
                case "JDBGame":
                    url = item.GameName + "_Login.html?GameId=" + item.GameId + "&GameType=" + item.GameCode;
                    break;
                case "DTGame":
                case "VGGame":
                    url = item.GameName + "_Login.html?GameKey=" + item.GameId;
                    break;
                case "WG":
                    url = item.GameName + "_Login.html?id=" + item.GameId;
                    break;
                default:
                    url = item.GameName + "_Login.html?gameid=" + item.GameId;
            }
            window.open(url);
        };
        //透过 API回传的 GameId取得物件 及透过 ShowType判断 h5 或 app
        SlotGame.prototype.getItemByGameId = function (GameId, ShowType) {
            var result = null;
            for (var i = 0, l = this.gameListData.length; i < l; i++) {
                if (this.gameListData[i].GameId === GameId && this.gameListData[i].ShowType === ShowType) {
                    result = this.gameListData[i];
                    break;
                }
            }
            return result;
        };
        SlotGame.prototype.setGameList = function (productList) {
            var list = productList;
            var result = list;
            this.setHtml($(this.gameItemContainer), result, $(this.tpl_gameItem).html());
        };
        //设置跑马灯宽度
        SlotGame.prototype.setMarqueeWidth = function () {
            var width = 0;
            $(this.marquee + " > span > *").forEach(function (item) {
                width += $(item).width();
            });
            $(this.marquee + " > span").width(width);
            requestAnimationFrame(this.scrollDown);
        };
        //搜寻游戏
        SlotGame.prototype.searchByName = function () {
            var name = $(".leftSidebar").find(this.gameNameInput).val();
            Global.Log.log("searchByName", name);
            this.searchGameName = name;
            this.gameId = "";
            if (name.length > 0) {
                $('input').blur();
                setTimeout(function () {
                    location.href = 'SlotGame_search.html?search=' + name;
                }, 500);
            }
        };
        /**
         * 创建html结构
         */
        SlotGame.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        return SlotGame;
    }());
    return SlotGame;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/SlotGame.js.map