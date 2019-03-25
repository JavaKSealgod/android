define('T009/source/components/Report_Bets', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "moment", "handlebars"], function (require, exports, Global, Api, moment, Handlebars) {
    "use strict";
    var Report_Bets = /** @class */ (function () {
        function Report_Bets(option) {
            this.messageNS = "Report_Bets";
            this.formInput = {
                "startDate": "input[name=startDate]",
                "endDate": "input[name=endDate]",
                "gameKey": "input[name=gameKey]",
                "gameType": "select[name=gameType]",
                "drpc": "select[name=drpc]"
            };
            //submit按钮文字元素
            this.submitText = "[data-cashap-id=submitText]";
            //submit按钮元素
            this.submitBtn = "[data-cashap-id=submitBtn]";
            this.searchOverLay = $("[data-cashap-id=SideBarSearch]").find("[data-cashap-id=sidebarOverlay]");
            /**
             * 是否提交中
             * @type {boolean}
             */
            this.isSubmitting = false;
            this.conditionElement = "[data-cashap-id=condition]";
            //日期格式
            this.DateFormat = 'YYYY-MM-DD';
            this.Show_DateFormat = "YYYY-MM-DD";
            //表单数据
            this.formData = null;
            this.content = null; //报表数据明细
            this.total = null; //报表数据合计
            this.content_CacheData = {}; //缓存content报表数据
            this.levelElement = {
                topLevel: "[data-cashap-id=topLevelPage]",
                secondLevel: "[data-cashap-id=secondLevelPage]",
                thirdLevel: "[data-cashap-id=thirdLevelPage]"
            };
            //公用属性。返回上一页按钮，使用时需限定当前页面为父级
            this.prePageBtn = "[data-cashap-id=prePage]";
            //表格
            this.contentTable = "[data-cashap-id=contentTable]";
            this.contentTpl = "[data-cashap-id=contentTableTpl]";
            this.totalTable = "[data-cashap-id=totalTable]";
            this.totalTpl = "[data-cashap-id=totalTableTpl]";
            //加载中...、无数据
            this.stateTable = "[data-cashap-id=stateTable]";
            //弃用。。。当前数据层级，0 = 第一级数据，1 = 第二级数据，2 = 第三级数据
            this.dataLevel = 0;
            //存放当前层级顺序
            this.arr_levelOrder = [];
            //滚动容器
            this.scrollContainer = '[data-cashap-id="scrollContainer"]';
            // 筛选面板
            this.FilterPannal = '[data-cashap-id="FilterPannal"]';
            this.FilterPannalShowBtn = '[data-cashap-id="btnSideBarSearch"]';
            this.FilterPannalHideBtn = '[data-cashap-id="FilterPannalHideBtn"]';
            if (!option.hasOwnProperty("timePicker")) {
                option.timePicker = false;
            }
            this.contentTpl = option.tplContentTable;
            this.totalTpl = option.tplTotalTable;
            this.formName = option.formName;
            this.formElement = $("[name='" + option.formName + "']");
            this.timePicker = option.timePicker;
            if (option.timePicker) {
                this.DateFormat += "THH:mm";
                this.Show_DateFormat += " HH:mm";
                this.formElement.find(this.formInput.startDate).attr("type", "datetime-local");
                this.formElement.find(this.formInput.endDate).attr("type", "datetime-local");
            }
            else {
                this.formElement.find(this.formInput.startDate).attr("type", "date");
                this.formElement.find(this.formInput.endDate).attr("type", "date");
            }
            this.init();
        }
        Report_Bets.prototype.init = function () {
            var _this = this;
            //判断是否未登录，若是则返回退出继续执行
            if (!Global.App.isLogin()) {
                Global.Tips1.show({
                    tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SystemTips"),
                    tipsContentTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "noLogin"),
                    leftbtnShow: true,
                    leftbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                    leftbtnfunction: function () {
                        window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
                        Global.Tips1.hide();
                    }
                });
                return false;
            }
            //设置startDate、endDate初始值
            this.setDate();
            //onTopLevelSubmit需要读取GameType中设置好的option项
            //电子版默认不自动读取数据
            this.setGameType(function () {
                // this.onTopLevelSubmit();
            });
            this.setDrpc();
            //初始化完毕后进行记录加载
            //this.onTopLevelSubmit();
            //开始结束日期
            $(this.conditionElement).on("input", "input", function (e) {
                var target = e.target || e.srcElement, value = _this.dateFormat($(target).val(), _this.Show_DateFormat), showTarget = $(target).attr("data-value-show-target");
                $(showTarget).text(value);
            });
            //游戏类型、派彩状况
            $(this.conditionElement).delegate("select", "change", function (e) {
                var target = e.target || e.srcElement, value = $(target).val(), showTarget = $(target).attr("data-value-show-target");
                $(showTarget).text($(target).find("[value='" + value + "']").text());
            });
            //绑定提交按钮
            this.formElement.find(this.submitBtn).on("click", function (e) {
                if (e.preventDefault)
                    e.preventDefault();
                // 检查开始日期，和结束日期
                if (!_this.checkDate()) {
                    Global.Tips.systemTip(Com_Gametree_Cashap.Language.getMessage_Translate("", "start_endTime_invalid"));
                    return false;
                }
                _this.searchOverLay.trigger("tap");
                _this.onTopLevelSubmit();
                //隐藏筛选面板
                _this.FilterPannalHide();
            });
            //点击gameType读取下一级数据报表
            $("body").delegate("[data-cashap-id=gameType]", "click", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, idx = $(target).attr("data-index");
                _this.getNextLevelReport(_this.content[idx]);
            });
            //绑定筛选面板显示按钮事件
            $(this.FilterPannalShowBtn).tap(function () {
                console.log("FilterPannal is Show");
                _this.FilterPannalShow();
            });
            $(this.FilterPannalHideBtn).tap(function () {
                console.log("FilterPannal is hide");
                _this.FilterPannalHide();
            });
            Global.Log.log("Report_Bets.init");
        };
        Report_Bets.prototype.dateFormat = function (date, formatter) {
            return moment(date).format(formatter);
        };
        /**
         * 设置startDate、endDate初始值
         */
        Report_Bets.prototype.setDate = function () {
            var now, firstDay, firstDate;
            now = moment();
            firstDay = now.date();
            if (firstDay == 1) {
                firstDate = this.timePicker ? now.hours(0).minutes(0).seconds(0).format(this.DateFormat) : now.format(this.DateFormat);
            }
            else {
                firstDate = this.timePicker ? now.set("date", 1).hours(0).minutes(0).seconds(0).format(this.DateFormat) : now.set("date", 1).format(this.DateFormat);
            }
            //设置日期控件
            var startDate = this.formElement.find(this.formInput.startDate);
            if (startDate.length > 0) {
                startDate.val(firstDate);
                var showTarget = startDate.attr("data-value-show-target");
                $(showTarget).text(this.dateFormat(firstDate, this.Show_DateFormat));
                //setTimeout(()=>{
                //	startDate.trigger("change");
                //});
            }
            var endDate = this.formElement.find(this.formInput.endDate);
            if (endDate.length > 0) {
                var endTime = moment().format(this.DateFormat);
                endDate.val(endTime);
                var showTarget = endDate.attr("data-value-show-target");
                $(showTarget).text(this.dateFormat(endTime, this.Show_DateFormat));
                //setTimeout(()=>{
                //	endDate.trigger("change");
                //});
            }
        };
        /**
         * 设置游戏类型
         */
        Report_Bets.prototype.setGameType = function (callback) {
            var _this = this;
            var gameType = this.formElement.find(this.formInput.gameType);
            Api.pocket.pocket_id(true)
                .done(function (result) {
                if (result.hasOwnProperty("pocketID")) {
                    if (gameType.length > 0) {
                        _this.setGameTypeOption(result.pocketID);
                        callback();
                    }
                }
            });
        };
        Report_Bets.prototype.setGameTypeOption = function (pocketId) {
            var form = this.formElement, el = form.find(this.formInput.gameType), pocketID = pocketId, 
            //gameId = Com_Gametree_Cashap.Language["Model.Game_ID"],
            arr = [], 
            //gameType = Com_Gametree_Cashap.Language["Model.ReportGameType"],
            currVal = el.val() || "";
            arr.push('<option value="">' + Com_Gametree_Cashap.Language["Model.Game_ID"]["ALL"] + '</option>');
            for (var i = 0, l = pocketID.length; i < l; i++) {
                var item = pocketID[i];
                //过滤我的钱包
                if (item.id === "myPocket") {
                    continue;
                }
                arr.push('<option value="' + item.value + '">' + item.name + '</option>');
            }
            el.empty().append(arr.join(""));
            // (<HTMLOptionElement>el.find('option[value="'+currVal+'"]')[0]).selected = true;
            //Agreen 修改 选中方式
            el.find('option[value=""]')[0].selected = true;
            setTimeout(function () {
                el.trigger("change");
            }, 100);
        };
        /**
         * 设置派彩状况
         */
        Report_Bets.prototype.setDrpc = function () {
            var drpc = this.formElement.find(this.formInput.drpc);
            if (drpc.length > 0) {
                var drpcList = Com_Gametree_Cashap.Language.getMessage_Translate(this.messageNS, "drpc"), drpcHTML = "";
                for (var i = 0, l = drpcList.length; i < l; i++) {
                    drpcHTML += '<option value="' + drpcList[i].value + '">' + drpcList[i].label + '</option>';
                }
                drpc.append(drpcHTML);
                setTimeout(function () {
                    drpc.trigger("change");
                }, 100);
            }
        };
        /**
         * 清除游戏缓存记录
         */
        Report_Bets.prototype.removeContent_CacheData = function () {
            this.content_CacheData = {};
        };
        Report_Bets.prototype.getAllFormData = function () {
            var d = {};
            for (var key in this.formInput) {
                //Agreen 新增if条件
                if (key != "gameKey") {
                    d[key] = this.formElement.find(this.formInput[key])[0].value;
                }
            }
            return d;
        };
        /**
         * 最顶层数据查询提交
         */
        Report_Bets.prototype.onTopLevelSubmit = function () {
            //清空gameKey条件
            this.formElement.find(this.formInput.gameKey).val("");
            this.toSubmit();
        };
        /**
         * 数据查询表单提交(清空旧有搜索条件)
         */
        Report_Bets.prototype.toSubmit = function () {
            //防止用户在本次操作未完成时重复提交
            if (this.isSubmitting) {
                var text = Com_Gametree_Cashap.Language.getMessage_Translate(this.messageNS, "submiting");
                Global.Tips.systemTip(text);
                return;
            }
            var form_data = this.getAllFormData();
            if (form_data.gameKey == undefined) {
                form_data.gameKey = "";
            }
            if (form_data) {
                //31天查询区间判断
                var validCheck = moment(form_data.startDate).add(31, "d").isAfter(form_data.endDate);
                if (!validCheck) {
                    var text = Com_Gametree_Cashap.Language.getMessage_Translate(this.messageNS, "2201001");
                    Global.Tips.systemTip(text);
                    return;
                }
                //重新提交查询时，显示数据加载中及loading
                var contentTable = $(this.levelElement.topLevel).find(this.contentTable), totalTable = $(this.levelElement.topLevel).find(this.totalTable), stateTable = $(this.levelElement.topLevel).find(this.stateTable);
                contentTable.addClass("hide");
                totalTable.addClass("hide");
                stateTable.removeClass("no-record hide");
                stateTable.addClass("loading");
                //清空层级顺序记录数组
                this.arr_levelOrder = [];
                this.levelChange({ isAdd: true, gameKey: form_data.gameKey });
                //清空缓存
                this.removeContent_CacheData();
                this.toSubmitData(form_data);
            }
        };
        Report_Bets.prototype.toSubmitData = function (data) {
            var _this = this;
            //显示系统loading
            Global.Tips.showSystemLoading();
            //防止重复提交
            this.isSubmitting = true;
            //保存表单结果
            this.formData = data;
            var cache = this.content_CacheData;
            if (cache[data.gameKey] != undefined) {
                Global.Log.log("toSubmitForm hasCache");
                //从缓存中读取数据
                this.content = cache[data.gameKey][0];
                this.total = cache[data.gameKey][1];
                this.isLastLevel = cache[data.gameKey][2];
                this.submitSuccess();
            }
            else {
                Global.Log.log("toSubmitForm api post");
                Api.report.bet(data)
                    .done(function (result) {
                    _this.submitCallback(result);
                });
            }
        };
        Report_Bets.prototype.submitCallback = function (result) {
            if (result.errorInfo != undefined) {
                if (result.errorInfo.length > 0) {
                    this.submitError(result.errorInfo[0]);
                    return;
                }
            }
            //每次加载数据前先清空旧有数据
            this.content = [];
            this.isLastLevel = result.isLastLevel;
            var content = [], total = [], len = result.data.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var obj = {};
                    for (var x = 0; x < result.fields.length; x++) {
                        obj[result.fields[x]] = result.data[i][x];
                    }
                    obj["rowIndex"] = i;
                    if (i % 2 == 0) {
                        obj["rowClass"] = "";
                    }
                    else {
                        obj["rowClass"] = "InterlaceBg";
                    }
                    if (i == (len - 1) && len > 1) {
                        total.push(obj);
                    }
                    else {
                        obj["resultColor"] = obj["resultPrice"] > 0 ? "txt-positive" : (obj["resultPrice"] < 0 ? "txt-negative" : "");
                        content.push(obj);
                    }
                }
                Global.Log.log("total, content ", total, content);
                this.content = content;
                this.total = total;
            }
            var cache = this.content_CacheData;
            cache[this.formData.gameKey] = [content, total, result.isLastLevel];
            this.content_CacheData = cache;
            this.submitSuccess();
        };
        /**
         * 提交表单回调失败
         * @param json
         */
        Report_Bets.prototype.submitError = function (json) {
            //隐藏系统loading
            Global.Tips.hideSystemLoading();
            var text = Com_Gametree_Cashap.Language.getMessage_Translate(this.messageNS, json.errorCode);
            this.isSubmitting = false; //解除防止重复提交限制
            Global.Tips.systemTip(text);
        };
        /**
         * 查询结果返回成功，创建报表dom结构
         */
        Report_Bets.prototype.submitSuccess = function () {
            //隐藏系统loading
            Global.Tips.hideSystemLoading();
            //解除防止重复提交限制
            this.isSubmitting = false;
            //switch(this.dataLevel){
            switch (this.arr_levelOrder.length - 1) {
                case 0:
                    this.showTopLevelData();
                    break;
                case 1:
                    this.showSecondLevelData();
                    break;
                case 2:
                    this.showThirdLevelData();
                    break;
            }
        };
        /**
         * 显示第一层数据
         */
        Report_Bets.prototype.showTopLevelData = function () {
            Global.Log.log("showTopLevelData");
            var hasContent = this.content ? this.content.length > 0 : false, contentTable = $(this.levelElement.topLevel).find(this.contentTable), totalTable = $(this.levelElement.topLevel).find(this.totalTable), stateTable = $(this.levelElement.topLevel).find(this.stateTable);
            if (hasContent) {
                this.setDataTable(contentTable, this.content, $(this.contentTpl).html());
                this.setDataTable(totalTable, this.total, $(this.totalTpl).html());
                contentTable.removeClass("hide");
                stateTable.addClass("hide");
                totalTable.removeClass("hide");
                //顶层数据 回到顶部
                // new BackToTop({
                // 	toTopDomParentContainer: $(this.levelElement.topLevel),
                // 	scrollContainer: $(this.levelElement.topLevel).find(this.scrollContainer)
                // });
            }
            else {
                contentTable.addClass("hide");
                totalTable.addClass("hide");
                stateTable.removeClass("hide"); //再次移除，防止没有移除
                stateTable.removeClass("loading");
                stateTable.addClass("no-record");
            }
        };
        /**
         * 显示第二层数据
         */
        Report_Bets.prototype.showSecondLevelData = function () {
            var _this = this;
            Global.Log.log("showSecondLevelData");
            var hasContent = this.content ? this.content.length > 0 : false, contentTable = $(this.levelElement.secondLevel).find(this.contentTable), totalTable = $(this.levelElement.secondLevel).find(this.totalTable), stateTable = $(this.levelElement.secondLevel).find(this.stateTable), backToTopInst;
            if (hasContent) {
                this.setDataTable(contentTable, this.content, $(this.contentTpl).html());
                this.setDataTable(totalTable, this.total, $(this.totalTpl).html());
                contentTable.removeClass("hide");
                totalTable.removeClass("hide");
                //重置并隐藏用于显示当前状态的table
                stateTable.removeClass("no-record");
                stateTable.addClass("loading");
                stateTable.addClass("hide");
                //绑定上一页按钮事件，若未绑定
                var btn_pre = $(this.levelElement.secondLevel).find(this.prePageBtn), hasBind = btn_pre.attr("data-hasbind");
                if (!hasBind) {
                    btn_pre.attr("data-hasbind", "true");
                    btn_pre.on("click", function (e) {
                        e.preventDefault();
                        _this.hideNextLevelPage($(_this.levelElement.secondLevel));
                        _this.levelChange({ isAdd: false });
                        //销毁返回顶部按钮
                        // backToTopInst.destory();
                    });
                }
                //顶层数据 回到顶部
                // backToTopInst = new BackToTop({
                // 	toTopDomParentContainer: $(this.levelElement.secondLevel),
                // 	scrollContainer: $(this.levelElement.secondLevel).find(this.scrollContainer)
                // });
            }
            else {
                stateTable.removeClass("loading");
                stateTable.addClass("no-record");
            }
        };
        /**
         * 显示第三层数据
         */
        Report_Bets.prototype.showThirdLevelData = function () {
            var _this = this;
            Global.Log.log("showThirdLevelData");
            var hasContent = this.content ? this.content.length > 0 : false, contentTable = $(this.levelElement.thirdLevel).find(this.contentTable), totalTable = $(this.levelElement.thirdLevel).find(this.totalTable), stateTable = $(this.levelElement.thirdLevel).find(this.stateTable), backToTopInst;
            if (hasContent) {
                this.setDataTable(contentTable, this.content, $(this.contentTpl).html());
                this.setDataTable(totalTable, this.total, $(this.totalTpl).html());
                contentTable.removeClass("hide");
                totalTable.removeClass("hide");
                //重置并隐藏用于显示当前状态的table
                stateTable.removeClass("no-record");
                stateTable.addClass("loading");
                stateTable.addClass("hide");
                //绑定上一页按钮事件，若未绑定
                var btn_pre = $(this.levelElement.thirdLevel).find(this.prePageBtn), hasBind = btn_pre.attr("data-hasbind");
                if (!hasBind) {
                    btn_pre.attr("data-hasbind", "true");
                    btn_pre.on("click", function (e) {
                        e.preventDefault();
                        _this.hideNextLevelPage($(_this.levelElement.thirdLevel));
                        _this.levelChange({ isAdd: false });
                        //销毁返回顶部按钮
                        // backToTopInst.destory();
                    });
                }
                //顶层数据 回到顶部
                // backToTopInst = new BackToTop({
                // 	toTopDomParentContainer: $(this.levelElement.thirdLevel),
                // 	scrollContainer: $(this.levelElement.thirdLevel).find(this.scrollContainer)
                // });
            }
            else {
                stateTable.removeClass("loading");
                stateTable.addClass("no-record");
            }
        };
        /**
         * 创建table
         */
        Report_Bets.prototype.setDataTable = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        /**
         * 读取当前行记录对象下一级数据报表
         * @param item
         */
        Report_Bets.prototype.getNextLevelReport = function (items) {
            Global.Log.log("getNextLevelReport", items);
            //判断isLastLevel==true则不允许继续读取下一级数据，调用明细报表
            if (this.isLastLevel || this.arr_levelOrder.length >= 3) {
                Global.Log.log("isLastLevel = true");
                return; //手机版不做处理
                //BSG游戏没有明细报表，直接返回
                if (items.gameKey.toLowerCase().indexOf("bsg_") > -1) {
                    //this.toShowBsgDetailView(items);
                    return;
                }
                //gmageKey不包含MG_字符的才可以进行调用明细报表（MG没有明细报表）
                if (items.gameKey.toLowerCase().indexOf("mg_") == -1 && items.gameKey.toLowerCase().indexOf("mgcasino") == -1) {
                    //this.toShowDetailView(items);
                }
                return;
            }
            var form = this.formElement, startDate = form.find(this.formInput.startDate).val(), endDate = form.find(this.formInput.endDate).val(), url = "";
            //老虎机查看明细报表 gtc:新版 SlotGame_GT:旧版
            if (items.gameKey.toLowerCase().indexOf("gs_live") > -1 ||
                items.gameKey.toLowerCase().indexOf("live_gt_p1") > -1 ||
                items.gameKey.toLowerCase().indexOf("live_gt_vnhlb") > -1 ||
                items.gameKey.toLowerCase().indexOf("slotgame_gt") > -1 ||
                items.gameKey.toLowerCase().indexOf("gtc") > -1 ||
                items.gameKey.toLowerCase().indexOf("live_wn_ph") > -1) {
                url = "record_gtcasino.html?start=" + startDate + "&end=" + endDate;
            }
            //WG游戏报表明细
            if (items.gameKey.toLowerCase() == "wg") {
                url = "record_wg.html?start=" + startDate + "&end=" + endDate;
            }
            //对战游戏报表明细
            if (items.gameKey.toLowerCase() == "dz") {
                url = "record_dzgame.html?start=" + startDate + "&end=" + endDate;
            }
            //幸运彩票报表明细
            if (items.gameKey.toLowerCase() == "lottery") {
                url = "record_luckylottery.html?start=" + startDate + "&end=" + endDate;
            }
            //FULI娱乐城报表明细
            if (items.gameKey.toLowerCase() == "meg") {
                url = "record_MegawinCasino.html?start=" + startDate + "&end=" + endDate;
            }
            //Super娱乐城报表明细
            if (items.gameKey.toLowerCase() == "super") {
                url = "record_SuperCasino.html?start=" + startDate + "&end=" + endDate;
            }
            //打开明细报表方式
            if (url != "" || items.gameKey.toLowerCase() == "kxc" || items.gameKey.toLowerCase() == "dq") {
                //this.openMethod === "window" ? this.openWin(url) : this.openIframe(url);
                Global.Tips.systemTip("暂不支持查看{0}报表".replace("{0}", items.gameType));
                return;
            }
            //当前数据层级向下一层
            //this.dataLevel++;
            this.levelChange({ isAdd: true, gameKey: items.gameKey });
            //显示下一层数据的页面
            var curLevelPage = this.getLevelElementByCurLevel();
            $(curLevelPage).find("[data-cashap-id=pageTitle]").html(items.gameType);
            Global.Log.log("showNextLevel ", this.arr_levelOrder, curLevelPage, items.gameType);
            this.showNextLevelPage($(curLevelPage));
            this.formData.gameKey = items.gameKey;
            this.toSubmitData(this.formData);
        };
        Report_Bets.prototype.getLevelElementByCurLevel = function () {
            var arr = [];
            for (var key in this.levelElement) {
                arr.push(key);
            }
            return this.levelElement[arr[this.arr_levelOrder.length - 1]];
            //return this.levelElement[arr[this.dataLevel]];
        };
        Report_Bets.prototype.showNextLevelPage = function (page) {
            var contentTable = page.find(this.contentTable), totalTable = page.find(this.totalTable), stateTable = page.find(this.stateTable);
            stateTable.removeClass("hide");
            contentTable.addClass("hide");
            totalTable.addClass("hide");
            Global.Log.log("current show level.  ", this.arr_levelOrder, this.arr_levelOrder.length);
            //第一层左移出可视区域，第二层左移进可视区域
            if (this.arr_levelOrder.length == 2) {
                page.prev().velocity({ translateX: "-100%" }, { duration: 300, easing: "ease-in-out" });
            }
            else if (this.arr_levelOrder.length == 3) {
                page.prev().velocity({ translateX: "-200%" }, { duration: 300, easing: "ease-in-out" });
            }
            page.velocity({ translateX: "-100%" }, { duration: 300, easing: "ease-in-out" });
        };
        Report_Bets.prototype.hideNextLevelPage = function (page) {
            //向上一层，将isLastLevel设置为false，以免再次进入时被当成是最后一层而被阻止
            if (this.isLastLevel) {
                this.isLastLevel = false;
            }
            //当前数据层级向上一层
            //this.dataLevel--;
            Global.Log.log("current hide level.  ", this.arr_levelOrder, this.arr_levelOrder.length);
            //第二层右移出可视区域，第一层右移进可视区域
            if (this.arr_levelOrder.length == 2) {
                page.prev().velocity({ translateX: "0" }, { duration: 300, easing: "ease-in-out" });
            }
            else if (this.arr_levelOrder.length == 3) {
                page.prev().velocity({ translateX: "-100%" }, { duration: 300, easing: "ease-in-out" });
            }
            page.velocity({ translateX: "0" }, { duration: 300, easing: "ease-in-out" });
        };
        /**
         *
         * @param
         * o :{
         * 		isAdd: boolean;//是否增加层级，否则为减少层级
         * 		gameKey?: string;//isAdd为true时必须
         * 		delAmount?: number;isAdd为false时，不给则默认只删除最后一层，可以指定删除多少层，当只剩下顶层时，则不再进行删除
         * 		}
         */
        Report_Bets.prototype.levelChange = function (o) {
            if (o.isAdd && typeof o.gameKey == "string") {
                this.arr_levelOrder.push(o.gameKey);
                Global.Log.log("levelChange add ", this.arr_levelOrder);
            }
            else {
                if (o.delAmount) {
                    for (var i = 0; i < o.delAmount; i++) {
                        if (this.arr_levelOrder.length <= 1)
                            break;
                        this.arr_levelOrder.pop();
                    }
                }
                else {
                    if (this.arr_levelOrder.length <= 1) {
                        this.arr_levelOrder.length > 0 ? this.content = this.content_CacheData[this.arr_levelOrder[0]][0] : "";
                    }
                    else {
                        this.arr_levelOrder.pop();
                    }
                }
                var l_length = this.arr_levelOrder.length;
                this.content = this.content_CacheData[this.arr_levelOrder[l_length - 1]][0];
                Global.Log.log("levelChange del ", this.arr_levelOrder, this.arr_levelOrder[l_length - 1]);
            }
        };
        // 筛选面板显示
        Report_Bets.prototype.FilterPannalShow = function () {
            $(this.FilterPannal).removeClass("hide");
        };
        //筛选面板隐藏
        Report_Bets.prototype.FilterPannalHide = function () {
            $(this.FilterPannal).addClass("hide");
        };
        //对比输入开始结束的日期 
        // 开始日期大于结束返回false
        // 开始日期小于结束返回true
        Report_Bets.prototype.checkDate = function () {
            // (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "start_endTime_invalid")
            // Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "start_endTime_invalid"));
            var startDate = new Date($(this.formInput.startDate).val());
            var endDate = new Date($(this.formInput.endDate).val());
            if (startDate <= endDate) {
                return true;
            }
            else if (startDate > endDate) {
                return false;
            }
        };
        return Report_Bets;
    }());
    return Report_Bets;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Report_Bets.js.map