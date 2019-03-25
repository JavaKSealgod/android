/**
 * 报表--时时返水
 * 该记录不着重标记金额颜色 - - 2019-01-19
 */
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import moment = require("moment");
import Handlebars = require("handlebars");

// import BackToTop = require("../../../Global/source/widgets/BackToTop");

class Report_Rebatenow {
    formName: string;
    formElement: JQuery;

    messageNS: string = "Record_Rebatenow";

    formInput = {
        "startDate": "input[name=startDate]",
        "endDate": "input[name=endDate]"
    }

    //submit按钮文字元素
    submitText: string = "[data-cashap-id=submitText]";

    //submit按钮元素
    submitBtn: string = "[data-cashap-id=submitBtn]";
    SetRebeat: string = "[data-cashap-id=SetRebeat]";

    searchOverLay = $("[data-cashap-id=SideBarSearch]").find("[data-cashap-id=sidebarOverlay]");

	/**
	 * submit按钮文字内容(临时存放)
	 * @type string
	 */
    submitTextContent: string;

	/**
	 * 是否提交中
	 * @type {boolean}
	 */
    isSubmitting: boolean = false;

    conditionElement = "[data-cashap-id=condition]";

    //日期格式
    DateFormat = 'YYYY-MM-DD';
    Show_DateFormat = "YYYY-MM-DD";

    //是否启用时间选择，默认不启用(false)
    timePicker: boolean;

    content = null;//报表数据明细
    contentTplTotal = null;//时反总和

    stateTable = '[data-cashap-id=stateTable]';//加载中、无记录 状态
    contentTable = "[data-cashap-id=contentTable]";
    contentTpl = "[data-cashap-id=contentTableTpl]";

    totalTable = "[data-cashap-id=totalTable]";
    totalTpl = "[data-cashap-id=totalTableTpl]";
    
    // 今日共可反水次数
    rebatenowTimes = "[data-cashap-id=rebatenowTimes]";
    contentRebatenowTimes = "[data-cashap-id=contentRebatenowTimes]";
    
    // //时间对照表
    rebeatTimeBtn = '[data-cashap-id="rebeatTimeBtn"]';
    rebeatTime ='[data-cashap-id="rebeatTime"]';
    rebeatTimeTable = '[data-cashap-id="rebeatTimeTable"]';
    rebeatTimeTableHideBtn = '[data-cashap-id="rebeatTimeTableHideBtn"]';
    rebeatTimeTableTpl = '[data-cashap-id="rebeatTimeTableTpl"]';

    recordListContainer = '[data-cashap-id="recordList"]';
    scrollContainer = '[data-cashap-id="scrollContainer"]';

    // 筛选面板
    FilterPannal = '[data-cashap-id="FilterPannal"]';
    FilterPannalShowBtn = '[data-cashap-id="btnSideBarSearch"]';
    FilterPannalHideBtn = '[data-cashap-id="FilterPannalHideBtn"]';

    constructor(option: {formName: string; timePicker?:boolean; tplContentTable: string;}) {
        if(!option.hasOwnProperty("timePicker")) {
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

        this.init();
    }

    init() {
        //判断是否未登录，若是则返回退出继续执行
        if (!Global.App.isLogin()) {
            Global.Tips1.show({
                tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                tipsContentTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"),
                leftbtnShow: true,
                leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                leftbtnfunction: ()=>{
                    window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
                    Global.Tips1.hide();
                }
            });
            return false;
        }

        Api.account.profile_baseInfo(true)
            .done((baseInfo) => {
                if (baseInfo.memberLevel == Global.MemberLevel.trial) {
                    //提示仅提供正式会员操作
                    Global.Tips1.show({
                        tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                        tipsContentTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMember"),
                        leftbtnShow: true,
                        leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                        leftbtnfunction: ()=>{
                            window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
                            Global.Tips1.hide();
                        }
                    });
                }
                else {
                    this.afterInit();
                }
            });

        //绑定筛选面板显示按钮事件
        $(this.FilterPannalShowBtn).tap(() => {
            console.log("FilterPannal is Show");
            this.FilterPannalShow();
        });

        $(this.FilterPannalHideBtn).tap(() => {
            console.log("FilterPannal is hide");
            this.FilterPannalHide();
        });

        Global.Log.log("Record_Rebatenow.init");

        // //时间对照表显示按钮
        $(this.rebeatTimeBtn).tap(() => {
            // console.log("FilterPannal is Show");
            this.RebeatTimeTableShow();
        });

        // //时间对照表关闭按钮
        $(this.rebeatTimeTableHideBtn).tap(() => {
            // console.log("FilterPannal is Show");
            this.RebeatTimeTableHide();
        });


        Api.report.rebatenowbtn()
        .done((result) => {
            this.setDataTable($(this.rebatenowTimes), result, $(this.contentRebatenowTimes).html());
        });
    }

    afterInit() {
        //设置startDate、endDate初始值
        this.setDate();

        //电子版默认不自动读取记录
        // this.submit();

        //开始结束日期
        $(this.conditionElement).on("input", "input", (e: Event) => {
            var target = e.target || e.srcElement,
                value = this.dateFormat($(target).val(), this.Show_DateFormat),
                showTarget = $(target).attr("data-value-show-target");

            $(showTarget).text(value);
        });

         //绑定查询按钮
         this.formElement.find(this.submitBtn).on("tap", (e: Event) => {
            if (e.preventDefault) e.preventDefault();

            // 检查开始日期，和结束日期
            this.checkDate();
			// if(!this.checkDate()){
			// 	Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "start_endTime_invalid"));
			// 	return false;
			// }

            this.searchOverLay.trigger("tap");

            this.submit();
        });

        //绑定提交按钮
        this.formElement.find(this.SetRebeat).on("tap", (e: Event) => {
            if (e.preventDefault) e.preventDefault();
            
            // 检查开始日期，和结束日期
			// if(!this.checkDate()){
			// 	Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "start_endTime_invalid"));
			// 	return false;
			// }
            this.checkDate();
            if(!this.checkDate()){
                return;
            }
            this.searchOverLay.trigger("tap");

            this.submitSetRebeat();
        });

        //绑定点击游戏类别显示隐藏的明细
        $(this.contentTable).delegate('[data-cashap-id="product"]', "click", (e: Event) => {
            e.preventDefault();

            var target = e.target || e.srcElement,
                tr = $(target).parents("tr"),
                isActive = tr.hasClass("active");

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

        $(this.totalTable).delegate("[data-cashap-id=productname]", "tap", (e: Event) => {
            e.preventDefault();

            var target = e.target || e.srcElement,
                tr = $(target).parents("tr"),
                isActive = tr.hasClass("active");

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
        //     toTopDomParentContainer: $(this.recordListContainer),
        //     scrollContainer: $(this.scrollContainer)
        // });
    }

	/**
	 * 设置startDate、endDate初始值
	 */
    setDate() {
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
    }

    dateFormat(date: string, formatter: string) {
        return moment(date).format(formatter);
    }

    submit() {
        //防止用户在本次操作未完成时重复提交
        if (this.isSubmitting) {
            var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "submiting");
            Global.Tips.systemTip(text);
            return;
        }

        var form_data = this.getAllFormData();

        if (form_data) {
            //31天查询区间判断
            // var validCheck = moment(form_data.startDate).add(31, "d").isAfter(form_data.endDate);
            // if (!validCheck) {
            //     var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "2202001");
            //     Global.Tips.systemTip(text);
            //     return;
            // }

            //显示系统loading
            Global.Tips.showSystemLoading();

            //重新提交查询时，显示数据加载中及loading
            var contentTable = $(this.contentTable),
                stateTable = $(this.stateTable);

            // contentTable.addClass("hide");

            stateTable.removeClass("no-record hide");
            stateTable.addClass("loading");

            //防止重复提交
            this.isSubmitting = true;

            Api.report.rebatenow(form_data)
                .done((result) => {
                    this.submitCallback(result);
                });
        }

        this.FilterPannalHide();
    }

    //提交时时反水
    submitSetRebeat() {
        //防止用户在本次操作未完成时重复提交
        if (this.isSubmitting) {
            var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "submiting");
            Global.Tips.systemTip(text);
            return;
        }


        var form_data = this.getAllFormData()
           

        if (new Date(form_data.startDate).valueOf() > new Date(form_data.endDate).valueOf()) {
            Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "start_endTime_error"));
            return;
        }

        if (form_data) {
            //显示系统loading
            Global.Tips.showSystemLoading();

            //重新提交查询时，显示数据加载中及loading
            var contentTable = $(this.contentTable),
                totalTable = $(this.totalTable),
                stateTable = $(this.stateTable);

            // contentTable.addClass("hide");
            // totalTable.addClass("hide");

            stateTable.removeClass("no-record hide");
            stateTable.addClass("loading");

            //防止重复提交
            this.isSubmitting = true;

            Api.report.set_rebeat(form_data)
                .done((result) => {
                    this.submitRebeatCallback(result);
                });
        }

        this.FilterPannalHide();
    }

    getAllFormData(): any {
        var d = {};

        for (var key in this.formInput) {
            d[key] = (<HTMLInputElement>this.formElement.find(this.formInput[key])[0]).value;
        }

        return d;
    }

	/**
	 * 报表查询回调
	 * @param result
	 */
    submitCallback(result) {
       //隐藏系统loading
       Global.Tips.hideSystemLoading();

       Global.Log.log("submitForm_Callback", result);

       if (result.errorInfo != undefined) {
           Global.Log.log("errorInfo != undefined");
           // this.submitRebeat();
               if (result.errorInfo.length > 0) {
                   this.submitError(result.errorInfo[0]);
                
                   return;
               }
           
           
       }
       // this.submit();
       
       this.content = result.data;
       this.contentTplTotal = result;

       // Global.Log.log("contentTplTotal:", this.contentTplTotal);
       // this.submitRebeat();
       this.submitSuccess();
    }

    submitRebeatCallback(result) {
        //隐藏系统loading
        Global.Tips.hideSystemLoading();

        Global.Log.log("submitForm_Callback", result);
        var stateTable = $(this.stateTable);
        if (result.errorInfo != undefined) {
            Global.Log.log("errorInfo != undefined");
            // this.submitRebeat();
            if (result.errorInfo.length > 0) {
                this.submitError(result.errorInfo[0]);
                stateTable.removeClass("loading");
                stateTable.addClass("no-record");
                return;
            }
        }
        if(result.result){
            Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "submit_success"));
            this.submitRebeat();
        }
        // this.submit();
        
        this.content = result.data;
        this.contentTplTotal = result;

        // Global.Log.log("contentTplTotal:", this.contentTplTotal);

        this.submitSuccess();
    }

    submitRebeat() {
        //防止用户在本次操作未完成时重复提交
        // if (this.isSubmitting) {
        //     return;
        // }
        var form_data = this.getAllFormData();

        // var form_data = this.getAllFormData(),
        //     form = $(this.formElement),
        //     curr = new Date(),
        //     currMonth = curr.getMonth() + 1,
        //     totalMonth = (curr.getFullYear()-1) * 12 + currMonth,
        //     subMonth = totalMonth - 2,
        //     modulo = subMonth % 12,
        //     minDateStr = parseInt((subMonth / 12).toString()) + "-" + (modulo == 0 ? 12 : modulo) + "-1",
        //     minDate = new Date(minDateStr + " 0:0:0"),
        //     maxDate_LastDay = this.getLastDay(curr.getFullYear(), currMonth),
        //     maxDateStr = curr.getFullYear() + "-" + currMonth + "-" + maxDate_LastDay,
        //     maxDate = new Date(maxDateStr + " 0:0:0");

        // //判断当前日期是否符合限制范围(当前日期3个月以内)
        // // if (minDate.valueOf() > new Date(form_data.startDate + " 0:0:0").valueOf() || new Date(form_data.endDate + " 0:0:0").valueOf() > maxDate.valueOf()) {
        // //     var msg = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "dateRangeInvalid");
        // //     msg = msg.replace("{0}", minDateStr);
        // //     msg = msg.replace("{1}", maxDateStr);
        // //     Global.Tips.systemTip(msg);
        // //     return;
        // // }

        if (new Date(form_data.startDate).valueOf() > new Date(form_data.endDate).valueOf()) {
            Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "start_endTime_error"));
            return;
        }

        if (form_data) {
            //显示系统loading
            Global.Tips.showSystemLoading();

            //重新提交查询时，显示数据加载中及loading
            var contentTable = $(this.contentTable),
                totalTable = $(this.totalTable),
                stateTable = $(this.stateTable);

            // contentTable.addClass("hide");
            // totalTable.addClass("hide");


            stateTable.removeClass("no-record hide");
            stateTable.addClass("loading");

            //防止重复提交
            this.isSubmitting = true;

            Api.report.rebatenow(form_data)
                .done((result) => {
                    this.submitCallback(result);
                });
        }

        this.FilterPannalHide();
    }

    submitError(json: ErrorInfoModel) {
        var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, json.errorCode);
        this.isSubmitting = false;//解除防止重复提交限制
        Global.Tips.systemTip(text);
    }

    submitSuccess() {
        //解除防止重复提交限制
        this.isSubmitting = false;

        this.showDataTable();
    }

	/**
	 * 显示记录表格
	 */
    showDataTable() {
        Global.Log.log("showDataTable");
        var hasContent = this.content ? this.content.length > 0 : false,
            contentTable = $(this.contentTable),
            totalTable = $(this.totalTable),
            stateTable = $(this.stateTable);

        if (hasContent) {
            this.setDataTable(contentTable, this.content, $(this.contentTpl).html());
            this.setDataTable(totalTable, this.contentTplTotal, $(this.totalTpl).html());

            contentTable.removeClass("hide");
            stateTable.addClass("hide");
            totalTable.removeClass("hide");
        }
        else {
            contentTable.addClass("hide");
            totalTable.addClass("hide");

            // stateTable.removeClass("hide");//再次移除，防止没有移除
            stateTable.removeClass("loading");
            stateTable.addClass("no-record");
        }
    }

	/**
	 * 创建table
	 */
    setDataTable(target: JQuery, data, tpl) {
        var template = Handlebars.compile(tpl),
            html = template(data);

        target.html(html);
    }

    // 筛选面板显示
    FilterPannalShow() {
        $(this.FilterPannal).removeClass("hide");
    }
    //筛选面板隐藏
    FilterPannalHide() {
        $(this.FilterPannal).addClass("hide");
    }

    // //时间对照表显示
    RebeatTimeTableShow() {
        $(this.rebeatTime).removeClass("hide");
        Api.report.rebatenowtime()
        .done((result) => {
            this.setDataTable($(this.rebeatTimeTable), result.data, $(this.rebeatTimeTableTpl).html());
            console.log("rebatenowtime:",result.data);
        });
    }

    // //时间对照表隐藏
    RebeatTimeTableHide() {
        $(this.rebeatTime).addClass("hide");
    }

    //对比输入开始结束的日期 
	// 开始日期大于结束返回false
	// 开始日期小于结束返回true
	checkDate(){
		// (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "start_endTime_invalid")
		// Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "start_endTime_invalid"));
        let today = new Date();
        let startDate = new Date($(this.formInput.startDate).val());
		let endDate = new Date($(this.formInput.endDate).val());
        if(endDate > today){
            Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "endTime_error"),false);
			return ;
		}
        else if(startDate <= endDate){
			return true;
		}
		else if(startDate > endDate){
            Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "start_endTime_error"));
            return false;
        }
	}
}

export = Report_Rebatenow;