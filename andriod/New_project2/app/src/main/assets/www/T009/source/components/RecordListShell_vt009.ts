/**
 * 网站公告、个人消息页面总控
 */
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Util = require("../../../Global/source/modules/Util");
import Handlebars = require("handlebars");

import ReportBets = require("../components/Report_Bets");
import ReportRebate = require("../components/Report_Rebate");
import ReportDeposit = require("../components/Report_Deposit");
import ReportTransfer = require("../components/Report_Transfer");
import ReportPromotion = require("../components/Report_Promotion");
import ReportRebatenow = require("../components/Record_Rebatenow");


class RecordList_Shell {
    page = '[data-cashap-id="recordPage"]';
    $page: JQuery;

    pageContent = '[data-cashap-id="recordpage-content"]';

    //主模板
    tpl_recordBets = '[data-pkg-tpl="recordBetsTpl"]';
    tpl_recordRebate = '[data-pkg-tpl="recordRebateTpl"]';
    tpl_recordDeposit = '[data-pkg-tpl="recordDepositTpl"]';
    tpl_recordTransfer = '[data-pkg-tpl="recordTransferTpl"]';
    tpl_recordPromotion = '[data-pkg-tpl="recordPromotionTpl"]';
    tpl_recordRebatenow = '[data-pkg-tpl="recordRebatenowTpl"]';

    //辅助模板 - - 下注记录
    tpl_bets_contentTable = '[data-cashap-id="recordBets_contentTableTpl"]';
    tpl_bets_totalTable = '[data-cashap-id="recordBets_totalTableTpl"]';

    //辅助模板 - - 返水记录
    tpl_rebate_contentTable  = '[data-cashap-id="recordRebate_contentTableTpl"]';

    //辅助模板 - - 存取款记录
    tpl_deposit_contentTable = '[data-cashap-id="recordDeposit_contentTableTpl"]';

    //辅助模板 - - 转账记录
    tpl_transfer_contentTable = '[data-cashap-id="recordTransfer_contentTableTpl"]';

    //辅助模板 - - 我的存款优惠
    tpl_promotion_contentTable = '[data-cashap-id="recordPromotion_contentTableTpl"]';

    //辅助模板 - - 时时返水
    tpl_recordRebatenow_contentTable = '[data-cashap-id="recordRebatenow_contentTableTpl"]';
    
    curShowCategory = "";

    constructor(){
        this.$page = $(this.page);
        this.init();
    }

    init(){
        const categoryList = [{category:'recordBets'},{category:'recordRebate'},{category:'recordDeposit'},{category:'recordTransfer'},{category:'recordPromotion'},{category:'recordRebatenow'}];

        //未登录处理
        if(!Global.App.isLogin()){
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
            return;
        }

        this.curShowCategory = categoryList[0].category;
        this.changeCategory();

        //绑定按钮切换事件，不能使用tap事件，因为300ms延迟后会再次触发click事件
        this.$page.find("[data-category-id]").on("click", (e: Event)=>{
            const target = e.target || e.srcElement;

            //若当前按钮处于激活状态，则不做处理
            if($(target).hasClass("active")){
                return;
            }

            this.$page.find("[data-category-id]").removeClass("active");

            $(target).addClass("active");

            this.curShowCategory = $(target).attr("data-category-id");

            this.changeCategory();
        });
    }

    changeCategory() {
        //清空内容容器dom
        this.$page.find(this.pageContent).empty();

        const category = this.curShowCategory;

        if(category === 'recordBets'){
            // 初始化html
            this.$page.find(this.pageContent).html($(this.tpl_recordBets).html());

            let obj = {
                formName: "report_bets_search",
                tplContentTable: this.tpl_bets_contentTable,
                tplTotalTable: this.tpl_bets_totalTable
            };
            new ReportBets(obj);
        }
        else if(category === 'recordRebate'){
            this.$page.find(this.pageContent).html($(this.tpl_recordRebate).html());

            let obj = {
                formName: "report_rebate_search",
                tplContentTable: this.tpl_rebate_contentTable
            };
            new ReportRebate(obj);
        }
        else if(category === 'recordDeposit'){
            this.$page.find(this.pageContent).html($(this.tpl_recordDeposit).html());

            let obj = {
                formName: "report_deposit_search",
                tplContentTable: this.tpl_deposit_contentTable,
                timePicker: true
            };
            new ReportDeposit(obj);
        }
        else if(category === 'recordTransfer'){
            this.$page.find(this.pageContent).html($(this.tpl_recordTransfer).html());

            let obj = {
                formName: "report_transfer_search",
                tplContentTable: this.tpl_transfer_contentTable
            };
            new ReportTransfer(obj);
        }
        else if(category === 'recordPromotion'){
            this.$page.find(this.pageContent).html($(this.tpl_recordPromotion).html());

            let obj = {
                formName: "report_promotion_search",
                tplContentTable: this.tpl_promotion_contentTable
            };
            new ReportPromotion(obj);
        }
        else if(category === 'recordRebatenow'){
            this.$page.find(this.pageContent).html($(this.tpl_recordRebatenow).html());

            let obj = {
                formName: "report_rebatenow_search",
                tplContentTable: this.tpl_recordRebatenow_contentTable
            };
            new ReportRebatenow(obj);
        }
    }
}

export = RecordList_Shell;