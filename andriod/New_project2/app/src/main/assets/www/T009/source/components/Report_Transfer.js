define('T009/source/components/Report_Transfer', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "moment", "handlebars"], function (require, exports, Global, Api, moment, Handlebars) {
    "use strict";
    // import BackToTop = require("../../../Global/source/widgets/BackToTop");
    var Report_Transfer = /** @class */ (function () {
        function Report_Transfer(option) {
            this.messageNS = "Report_Transfer_Money";
            this.formInput = {
                "startDate": "input[name=startDate]",
                "endDate": "input[name=endDate]",
                "operationType": "select[name=operationType]",
                "operationState": "select[name=operationState]"
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
            this.content = null; //报表数据明细
            this.total = null; //报表数据合计
            this.stateTable = '[data-cashap-id=stateTable]'; //加载中、无记录 状态
            this.contentTable = "[data-cashap-id=contentTable]";
            this.contentTpl = "[data-cashap-id=contentTableTpl]";
            this.totalTable = "[data-cashap-id=totalTable]";
            this.totalTpl = "[data-cashap-id=totalTableTpl]";
            this.recordListContainer = '[data-cashap-id="recordList"]';
            this.scrollContainer = '[data-cashap-id="scrollContainer"]';
            // 筛选面板
            this.FilterPannal = '[data-cashap-id="FilterPannal"]';
            this.FilterPannalShowBtn = '[data-cashap-id="btnSideBarSearch"]';
            this.FilterPannalHideBtn = '[data-cashap-id="FilterPannalHideBtn"]';
            if (!option.hasOwnProperty("timePicker")) {
                option.timePicker = false;
            }
            this.contentTpl = option.tplContentTable;
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
            this.ReportOperationState = Com_Gametree_Cashap.Language["Report_Transfer_OperationState"];
            this.init();
        }
        Report_Transfer.prototype.init = function () {
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
            Api.account.profile_baseInfo(true)
                .done(function (baseInfo) {
                if (baseInfo.memberLevel == Global.MemberLevel.trial) {
                    //提示仅提供正式会员操作
                    Global.Tips1.show({
                        tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SystemTips"),
                        tipsContentTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "onlyMember"),
                        leftbtnShow: true,
                        leftbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                        leftbtnfunction: function () {
                            window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
                            Global.Tips1.hide();
                        }
                    });
                }
                else {
                    _this.afterInit();
                }
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
            Global.Log.log("Report_Transfer.init");
        };
        Report_Transfer.prototype.afterInit = function () {
            var _this = this;
            //设置startDate、endDate初始值
            this.setDate();
            //设置钱包类型
            this.setOperationType(function () {
                _this.submit();
            });
            //设置交易状态
            this.setOperationState();
            //电子版默认不自动读取数据
            //this.submit();
            //开始结束日期
            $(this.conditionElement).on("input", "input", function (e) {
                var target = e.target || e.srcElement, value = _this.dateFormat($(target).val(), _this.Show_DateFormat), showTarget = $(target).attr("data-value-show-target");
                $(showTarget).text(value);
            });
            //交易类型、交易方式、交易状态
            $(this.conditionElement).delegate("select", "change", function (e) {
                var target = e.target || e.srcElement, value = $(target).val(), showTarget = $(target).attr("data-value-show-target");
                $(showTarget).text($(target).find("[value='" + value + "']").text());
            });
            //绑定提交按钮
            this.formElement.find(this.submitBtn).on("tap", function (e) {
                if (e.preventDefault)
                    e.preventDefault();
                // 检查开始日期，和结束日期
                if (!_this.checkDate()) {
                    Global.Tips.systemTip(Com_Gametree_Cashap.Language.getMessage_Translate("", "start_endTime_invalid"));
                    return false;
                }
                _this.searchOverLay.trigger("tap");
                _this.submit();
            });
            $(this.contentTable).delegate("[data-cashap-id=operationCode]", "click", function (e) {
                e.preventDefault();
                var target = e.target || e.srcElement, tr = $(target).parents("tr"), isActive = tr.hasClass("active");
                //若当前已经显示隐藏部分，则隐藏，否则显示
                if (isActive) {
                    tr.removeClass("active");
                    tr.next().addClass("hide");
                }
                else {
                    tr.addClass("active");
                    tr.next().removeClass("hide");
                }
            });
            //顶层数据 回到顶部
            // new BackToTop({
            // 	toTopDomParentContainer: $(this.recordListContainer),
            // 	scrollContainer: $(this.scrollContainer)
            // });
        };
        Report_Transfer.prototype.dateFormat = function (date, formatter) {
            return moment(date).format(formatter);
        };
        /**
         * 设置startDate、endDate初始值
         */
        Report_Transfer.prototype.setDate = function () {
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
         * 设置钱包类型
         */
        Report_Transfer.prototype.setOperationType = function (callback) {
            var _this = this;
            var operationType = this.formElement.find(this.formInput.operationType);
            if (operationType.length > 0) {
                Api.pocket.pocket_id(true)
                    .done(function (result) {
                    if (result.result) {
                        var form = _this.formElement, el = form.find(_this.formInput.operationType), pocketID = result.pocketID, 
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
                        el.find('option[value="' + currVal + '"]')[0].selected = true;
                        setTimeout(function () {
                            el.trigger("change");
                        }, 100);
                        callback();
                    }
                });
            }
        };
        /**
         * 设置交易状态
         */
        Report_Transfer.prototype.setOperationState = function () {
            var operationState = this.formElement.find(this.formInput.operationState);
            if (operationState.length > 0) {
                var stateList = this.ReportOperationState, html = "";
                for (var i = 0, l = stateList.length; i < l; i++) {
                    html += '<option value="' + stateList[i].value + '">' + stateList[i].name + '</option>';
                }
                operationState.append(html);
                setTimeout(function () {
                    operationState.trigger("change");
                }, 100);
            }
        };
        Report_Transfer.prototype.submit = function () {
            var _this = this;
            //防止用户在本次操作未完成时重复提交
            if (this.isSubmitting) {
                var text = Com_Gametree_Cashap.Language.getMessage_Translate(this.messageNS, "submiting");
                Global.Tips.systemTip(text);
                return;
            }
            var form_data = this.getAllFormData();
            if (form_data) {
                //31天查询区间判断
                var validCheck = moment(form_data.startDate).add(31, "d").isAfter(form_data.endDate);
                if (!validCheck) {
                    var text = Com_Gametree_Cashap.Language.getMessage_Translate(this.messageNS, "2203001");
                    Global.Tips.systemTip(text);
                    return;
                }
                //显示系统loading
                Global.Tips.showSystemLoading();
                //重新提交查询时，显示数据加载中及loading
                var contentTable = $(this.contentTable), stateTable = $(this.stateTable);
                contentTable.addClass("hide");
                stateTable.removeClass("no-record hide");
                stateTable.addClass("loading");
                this.FilterPannalHide();
                //防止重复提交
                this.isSubmitting = true;
                //临时添加此操作，获取acc一并提交
                var acc = Global.Util.getParam("acc");
                if (acc) {
                    form_data["account"] = acc;
                }
                Api.report.transfer_money(form_data)
                    .done(function (result) {
                    _this.submitCallback(result);
                });
            }
        };
        Report_Transfer.prototype.getAllFormData = function () {
            var d = {};
            for (var key in this.formInput) {
                d[key] = this.formElement.find(this.formInput[key])[0].value;
            }
            return d;
        };
        Report_Transfer.prototype.submitCallback = function (result) {
            //隐藏系统loading
            Global.Tips.hideSystemLoading();
            if (result.errorInfo != undefined) {
                if (result.errorInfo.length > 0) {
                    this.submitError(result.errorInfo[0]);
                    return;
                }
            }
            //每次加载数据前先清空旧有数据
            this.content = [];
            var content = [], len = result.data.length;
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
                    var operationFormObj = Api.pocket.getPocketItemByValue(String(obj["operationFrom"]));
                    if (operationFormObj != null) {
                        var operationFromName = operationFormObj.name;
                        //operationFromName = operationFromName.replace('<em class="StarIcon"></em>','');//强制删除图标
                        var regResult = /^<.+[^>]>(.*[^<\/>])<\/.*/.exec(operationFromName); //匹配html标签内容
                        regResult ? operationFromName = regResult[1] : "";
                        obj["operationFromName"] = operationFromName;
                    }
                    else {
                        //无法匹配对应的产品名称，直接跳过不显示此条记录 oscar 2015-6-8
                        obj["operationFromName"] = obj["operationFrom"];
                    }
                    var operationToObj = Api.pocket.getPocketItemByValue(String(obj["operationTo"]));
                    if (operationToObj != null) {
                        var operationToName = operationToObj.name;
                        //operationToName = operationToName.replace('<em class="StarIcon"></em>','');//强制删除图标
                        var regResult = /^<.+[^>]>(.*[^<\/>])<\/.*/.exec(operationToName); //匹配html标签内容
                        regResult ? operationToName = regResult[1] : "";
                        obj["operationToName"] = operationToName;
                    }
                    else {
                        //无法匹配对应的产品名称，直接跳过不显示此条记录 oscar 2015-6-8
                        obj["operationToName"] = obj["operationTo"];
                    }
                    var ss = this.getOperateStateItemByValue(String(obj["operationState"]));
                    if (ss) {
                        obj["operationStateName"] = ss.name;
                    }
                    else {
                        obj["operationStateName"] = "失败";
                    }
                    obj["stateColor"] = "";
                    if (obj["operationState"] == 1)
                        obj["stateColor"] = "txt-negative";
                    if (obj["operationState"] == 0)
                        obj["stateColor"] = "txt-positive";
                    content.push(obj);
                }
                this.content = content;
            }
            this.submitSuccess();
        };
        /**
         * 提交表单回调失败
         * @param json
         */
        Report_Transfer.prototype.submitError = function (json) {
            //解除防止重复提交限制
            this.isSubmitting = false;
            var text = Com_Gametree_Cashap.Language.getMessage_Translate(this.messageNS, json.errorCode);
            Global.Tips.systemTip(text);
        };
        Report_Transfer.prototype.submitSuccess = function () {
            //解除防止重复提交限制
            this.isSubmitting = false;
            this.showDataTable();
        };
        /**
         * 显示记录表格
         */
        Report_Transfer.prototype.showDataTable = function () {
            Global.Log.log("showDataTable");
            var hasContent = this.content ? this.content.length > 0 : false, contentTable = $(this.contentTable), stateTable = $(this.stateTable);
            if (hasContent) {
                this.setDataTable(contentTable, this.content, $(this.contentTpl).html());
                contentTable.removeClass("hide");
                stateTable.addClass("hide");
            }
            else {
                contentTable.addClass("hide");
                stateTable.removeClass("hide"); //再次移除，防止没有移除
                stateTable.removeClass("loading");
                stateTable.addClass("no-record");
            }
        };
        /**
         * 创建table
         */
        Report_Transfer.prototype.setDataTable = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        Report_Transfer.prototype.getOperateStateItemByValue = function (value) {
            var i;
            this.ReportOperationState.forEach(function (item) {
                if (item.value == value) {
                    i = item;
                    return false;
                }
            });
            return i;
        };
        // 筛选面板显示
        Report_Transfer.prototype.FilterPannalShow = function () {
            $(this.FilterPannal).removeClass("hide");
        };
        //筛选面板隐藏
        Report_Transfer.prototype.FilterPannalHide = function () {
            $(this.FilterPannal).addClass("hide");
        };
        //对比输入开始结束的日期 
        // 开始日期大于结束返回false
        // 开始日期小于结束返回true
        Report_Transfer.prototype.checkDate = function () {
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
        return Report_Transfer;
    }());
    return Report_Transfer;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Report_Transfer.js.map