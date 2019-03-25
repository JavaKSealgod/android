define('T009/source/components/Product_PTCasino_SlotGame_new', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars", "Global/libs/zepto.picLazyLoad"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    // import BackToTop = require("../../../Global/source/widgets/BackToTop");
    var Product_PTCasino_SlotGame = /** @class */ (function () {
        function Product_PTCasino_SlotGame(compOption) {
            this.messageNS = "";
            //标签列表总容器
            this.categoryList = '[data-cashap-id="categoryList"]';
            this.categorySelTpl = '[data-cashap-id="categoryTpl"]';
            this.categoryItem = '[data-cashap-id="categoryItem"]';
            this.scrollContainer = '[data-cashap-id="scrollContainer"]';
            this.gameListContainer = '[data-cashap-id="gameListContainer"]';
            this.gameListTpl = '[data-cashap-id="gameListTpl"]';
            this.gameItem = '[data-cashap-id="gameItem"]';
            this.lazyloadItem = '[data-cashap-id="lazyload"]';
            this.content = {
                Jackpot_List: null,
                Product_List: null,
                FilterList: null,
                Category: null
            };
            //游戏搜索
            this.gameName = "";
            this.gameId = "";
            this.gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
            this.gameNameSearch = 'input[name="gamename"]';
            //jackpot
            this.bigJackpotContainer = '[data-cashap-id="bigJackpot"]';
            this.bigJPAmount = '[data-cashap-id="jpAmount"]';
            this.bigJPWins = '[data-cashap-id="jpWins"]';
            this.bigJPWinCount = '[data-cashap-id="jpWinCount"]';
            //刷新jackpot间隔
            this.refreshJockPotInterval = 1000;
            if (window.navigator.userAgent.indexOf("GTMobileApp") > -1) {
                Global.Tips1.show({
                    tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SystemTips"),
                    tipsContentTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "app_nosupport_pt"),
                    leftbtnShow: false,
                    rightbtnShow: true,
                    leftbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "Cancel"),
                    rightbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                    rightbtnfunction: function () { window.location.href = Com_Gametree_Cashap.SiteConfig.HomePageUrl; }
                });
                return;
            }
            this.page = '[data-cashap-id="' + compOption.page + '"]';
            this.loginUrl = compOption.loginUrl;
            this.toLoadSiteMessage();
            //this.init();
        }
        Product_PTCasino_SlotGame.prototype.toLoadSiteMessage = function () {
            var _this = this;
            Global.Log.log("toLoadSiteMessage");
            //显示系统loading
            Global.Tips.showSystemLoading();
            Api.message.site_message(true)
                .done(function (sitemessage) {
                if (sitemessage.ptcasino.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.ptcasino.info["zh-cn"]);
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
        Product_PTCasino_SlotGame.prototype.init = function () {
            var _this = this;
            this.content.Category = Com_Gametree_Cashap.Language["Product_PTCasino_SlotGame"];
            this.setCategoryList();
            this.toLoadJackpotList();
            //游戏类别点击事件
            $(this.categoryList).delegate(this.categoryItem, "tap", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, idx = $(target).attr("data-index");
                $(_this.categoryList).children("li").removeClass("active");
                $(target).parent().addClass("active");
                _this.changeCategory(_this.content.Category[idx]);
            });
            //绑定gameNameSearch
            $(this.gameNameSearchForm)[0].onsubmit = function () {
                Global.Log.log("gameNameSearchForm submit");
                _this.searchByName();
                return false;
            };
            //绑定搜寻的placeholder显示与否
            $(this.gameNameSearchForm).find(this.gameNameSearch).on("blur", function (e) {
                $(".search-placeholder").removeClass("hide");
                if ($(_this.gameNameSearch).val()) {
                    $(".search-placeholder").addClass("hide");
                }
            });
            //游戏点击事件
            $(this.gameListContainer).delegate(this.gameItem, "tap", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, gameCode = $(target).parents(_this.gameItem).attr("data-game-code");
                _this.toOpenProductURL(_this.getGameListItemByGameCode(gameCode));
            });
            //顶层数据 回到顶部
            // new BackToTop({
            // 	toTopDomParentContainer: $(this.page),
            // 	scrollContainer: $(this.scrollContainer)
            // });
            Global.Log.log("Product_PTCasino_SlotGame.init");
        };
        Product_PTCasino_SlotGame.prototype.setCategoryList = function () {
            this.setHtml($(this.categoryList), this.content.Category, $(this.categorySelTpl).html());
            $(this.categoryList).children(":first-child").addClass("active");
        };
        Product_PTCasino_SlotGame.prototype.toLoadJackpotList = function () {
            var _this = this;
            Api.ptcasino.product_jackpotlist(true)
                .done(function (result) {
                if (result.hasOwnProperty("errorInfo")) {
                    if (result.errorInfo.length > 0) {
                        var text;
                        if (result.errorInfo[0].errorCode == "1000039") {
                            var productName = Com_Gametree_Cashap.Language.getMessage_Translate("Model.Game_ID", "PTCasino");
                            text = Com_Gametree_Cashap.Language.getMessage_Translate("", "product_maintenance");
                            text = text.replace("{0}", productName);
                            Global.Tips.systemTip(text);
                            return;
                        }
                        text = result.errorInfo[0].error;
                        Global.Tips.systemTip(Com_Gametree_Cashap.Language.getMessage_Translate("", "unknowError") + " " + text);
                        return;
                    }
                }
                _this.content.Jackpot_List = result;
                _this.toLoadJackpotListCallback();
            });
        };
        Product_PTCasino_SlotGame.prototype.toLoadJackpotListCallback = function () {
            //设置jackpot
            this.setBigJackpot();
            this.toLoadProductList({ "gameType": "", "gameName": "" });
        };
        Product_PTCasino_SlotGame.prototype.setBigJackpot = function () {
            Global.Log.log("Jackpot_List ", this.content.Jackpot_List);
            var bigJackpot = this.content.Jackpot_List.bigjackpot;
            $(this.bigJackpotContainer).find(this.bigJPWins).html(Global.Util.formatChineseNumber(bigJackpot.wins));
            $(this.bigJackpotContainer).find(this.bigJPWinCount).html(Global.Util.formatChineseNumber(bigJackpot.winCount));
            this.setBigJackpotAmount();
        };
        /**
         * 设置总奖金彩池
         */
        Product_PTCasino_SlotGame.prototype.setBigJackpotAmount = function () {
            var _this = this;
            var bigJackpot = this.content.Jackpot_List.bigjackpot, result = "0";
            if (bigJackpot) {
                var amount = bigJackpot.amount || 0, step = bigJackpot.step || 0, lastUpdateTime = this.content.Jackpot_List.lastUpdate, currTime = new Date().valueOf(), subTime = parseInt((currTime - lastUpdateTime) / 1000 + "");
                result = this.accAdd(parseFloat(amount), this.accMul(subTime, parseFloat(step))).toFixed(2).toString();
            }
            $(this.bigJackpotContainer).find(this.bigJPAmount).html(Global.Util.formatChineseNumber(result));
            setTimeout(function () {
                _this.setBigJackpotAmount();
            }, this.refreshJockPotInterval);
        };
        /**
         * 浮点加法运算
         * @param arg1
         * @param arg2
         */
        Product_PTCasino_SlotGame.prototype.accAdd = function (arg1, arg2) {
            var r1, r2, m;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            return (arg1 * m + arg2 * m) / m;
        };
        /**
         * 浮点乘法运算
         * @param arg1
         * @param arg2
         */
        Product_PTCasino_SlotGame.prototype.accMul = function (arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            }
            catch (e) { }
            try {
                m += s2.split(".")[1].length;
            }
            catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        };
        Product_PTCasino_SlotGame.prototype.toLoadProductList = function (data) {
            var _this = this;
            Global.Log.log("toLoadProductList", data);
            Api.ptcasino.product_list_new(data)
                .done(function (result) {
                //隐藏系统loading
                Global.Tips.hideSystemLoading();
                // this.content.Product_List = result;
                _this.content.Product_List = [];
                result.data.map(function (element, idx) {
                    element.game.forEach(function (el) {
                        el.Category = result.data[idx].Category;
                    });
                    return element.game;
                }).forEach(function (element) {
                    return (_a = _this.content.Product_List).push.apply(_a, element);
                    var _a;
                });
                _this.toLoadProductListCallback(result);
            });
        };
        Product_PTCasino_SlotGame.prototype.toLoadProductListCallback = function (result) {
            if (result.hasOwnProperty("errorInfo")) {
                if (result.errorInfo.length > 0) {
                    var text;
                    if (result.errorInfo[0].errorCode == "1000039") {
                        var productName = Com_Gametree_Cashap.Language.getMessage_Translate("Model.Game_ID", "PTCasino");
                        text = Com_Gametree_Cashap.Language.getMessage_Translate("", "product_maintenance");
                        text = text.replace("{0}", productName);
                        Global.Tips.systemTip(text);
                        return;
                    }
                    text = result.errorInfo[0].error;
                    Global.Tips.systemTip(Com_Gametree_Cashap.Language.getMessage_Translate("", "unknowError") + " " + text);
                    return;
                }
            }
            var data = this.content.Product_List, imgFolder = Com_Gametree_Cashap.Language.fileDomain + "/ptcasino/gameicon/";
            //判断图片加载指定文件夹不为空值时，则使用指定路径
            if (imgFolder != "" && imgFolder != undefined) {
                $.each(data, function (i, n) {
                    //将GameId中的空格去掉，防止图片文件名格式错误
                    n.image = imgFolder + n.GameId.replace(" ", "") + ".jpg";
                    //兼容旧版API过渡
                    n.jackPot = n.jackPot || false;
                });
                this.content.Product_List["data"] = data;
            }
            this.isProductListEmpty = data.length == 0;
            this.isLoadding = false;
            Global.Log.log("content ", this.content);
            this.productListPage();
        };
        /**
         * 过滤游戏列表
         */
        Product_PTCasino_SlotGame.prototype.filterData = function () {
            var data = this.content.Product_List.data || [], gameName = this.gameName, gameId = this.gameId;
            var filter_data = [];
            data.forEach(function (item, idx) {
                if (gameName != "") {
                    if (item.Name.toLowerCase().indexOf(gameName.toLowerCase()) > -1)
                        filter_data.push(item);
                }
                else if (gameId != "") {
                    if (gameId.indexOf(item.Category) > -1)
                        filter_data.push(item);
                }
                else {
                    filter_data.push(item);
                }
            });
            this.isProductListEmpty = filter_data.length == 0;
            return filter_data;
        };
        Product_PTCasino_SlotGame.prototype.productListPage = function () {
            var data = this.filterData(), dataLength = data.length - 1, //从0开始计算
            items = [];
            this.setHtml($(this.gameListContainer), data, $(this.gameListTpl).html());
            $(this.gameListContainer).find(this.lazyloadItem).picLazyLoad({ scrollContainer: this.scrollContainer, threshold: 200, placeholder: "" });
            //滚动区域滚回顶部
            $(this.scrollContainer).scrollTop(0);
        };
        /**
         * 游戏搜索
         */
        Product_PTCasino_SlotGame.prototype.searchByName = function () {
            var name = $(this.page).find(this.gameNameSearch).val();
            Global.Log.log("searchByName", name);
            this.gameName = name;
            this.gameId = "";
            $(this.scrollContainer).scrollTop($(this.bigJackpotContainer).height());
            this.productListPage();
        };
        /**
         * 点击游戏类别处理
         * @param item
         */
        Product_PTCasino_SlotGame.prototype.changeCategory = function (item) {
            Global.Log.log("changeCategory", item);
            if (item.hasOwnProperty("sub")) {
                $('ul[data-subcategory="' + item.id + '"]').show();
            }
            else {
                $('ul[data-subcategory="' + item.id + '"]').hide();
            }
            //清空游戏名称搜索框内容
            $(this.page).find(this.gameNameSearch).val("");
            this.gameName = "";
            this.gameId = item.id;
            this.productListPage();
        };
        /**
         * 通过GameId获取gameItem
         * @param id
         * @returns {any}
         */
        Product_PTCasino_SlotGame.prototype.getGameListItemByGameCode = function (code) {
            var data = this.content.Product_List, target;
            data.forEach(function (item, idx) {
                if (item.GameId == code) {
                    target = item;
                    return false;
                }
            });
            return target;
        };
        /**
         * 打开游戏
         * @param item
         */
        Product_PTCasino_SlotGame.prototype.toOpenProductURL = function (item) {
            var _this = this;
            Global.Log.log("toOpenProductURL", item);
            //函数：accessCheck，无权限时默认会自行显示提示信息
            if (Global.App.isLogin()) {
                Api.account.profile_baseInfo(true)
                    .done(function (baseInfo) {
                    if (Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.PTCasino, baseInfo.memberLevel)) {
                        if (baseInfo.memberLevel == Global.MemberLevel.trial) {
                        }
                        else {
                            var url = _this.loginUrl + "?gameCode=" + item.GameId;
                            window.open(url);
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
            // 	//Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
            // 	Global.ConfirmDialog.show({
            // 		labelRightBtn: "马上登录",
            // 		callbackRightBtn: Global.App.goToLoginPage.bind(Global.App)
            // 	});
            // 	return;
            // }
            //
            // Api.account.profile_baseInfo(true)
            // 	.done((result)=>{
            // 		if(result.memberLevel == 2){
            // 			Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("","onlyMemberGame"));
            // 			return;
            // 		}
            //
            // 		var url = this.loginUrl+"?gameCode="+item.gameCode;
            //
            // 		window.open(url);
            // 	});
        };
        /**
         * 创建html结构
         */
        Product_PTCasino_SlotGame.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        return Product_PTCasino_SlotGame;
    }());
    return Product_PTCasino_SlotGame;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Product_PTCasino_SlotGame_new.js.map