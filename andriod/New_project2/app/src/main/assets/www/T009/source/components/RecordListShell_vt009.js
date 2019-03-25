define('T009/source/components/RecordListShell_vt009', ["require", "exports", "T009/source/modules/global", "T009/source/components/Report_Bets", "T009/source/components/Report_Rebate", "T009/source/components/Report_Deposit", "T009/source/components/Report_Transfer", "T009/source/components/Report_Promotion", "T009/source/components/Record_Rebatenow"], function (require, exports, Global, ReportBets, ReportRebate, ReportDeposit, ReportTransfer, ReportPromotion, ReportRebatenow) {
    "use strict";
    var RecordList_Shell = /** @class */ (function () {
        function RecordList_Shell() {
            this.page = '[data-cashap-id="recordPage"]';
            this.pageContent = '[data-cashap-id="recordpage-content"]';
            //主模板
            this.tpl_recordBets = '[data-pkg-tpl="recordBetsTpl"]';
            this.tpl_recordRebate = '[data-pkg-tpl="recordRebateTpl"]';
            this.tpl_recordDeposit = '[data-pkg-tpl="recordDepositTpl"]';
            this.tpl_recordTransfer = '[data-pkg-tpl="recordTransferTpl"]';
            this.tpl_recordPromotion = '[data-pkg-tpl="recordPromotionTpl"]';
            this.tpl_recordRebatenow = '[data-pkg-tpl="recordRebatenowTpl"]';
            //辅助模板 - - 下注记录
            this.tpl_bets_contentTable = '[data-cashap-id="recordBets_contentTableTpl"]';
            this.tpl_bets_totalTable = '[data-cashap-id="recordBets_totalTableTpl"]';
            //辅助模板 - - 返水记录
            this.tpl_rebate_contentTable = '[data-cashap-id="recordRebate_contentTableTpl"]';
            //辅助模板 - - 存取款记录
            this.tpl_deposit_contentTable = '[data-cashap-id="recordDeposit_contentTableTpl"]';
            //辅助模板 - - 转账记录
            this.tpl_transfer_contentTable = '[data-cashap-id="recordTransfer_contentTableTpl"]';
            //辅助模板 - - 我的存款优惠
            this.tpl_promotion_contentTable = '[data-cashap-id="recordPromotion_contentTableTpl"]';
            //辅助模板 - - 时时返水
            this.tpl_recordRebatenow_contentTable = '[data-cashap-id="recordRebatenow_contentTableTpl"]';
            this.curShowCategory = "";
            this.$page = $(this.page);
            this.init();
        }
        RecordList_Shell.prototype.init = function () {
            var _this = this;
            var categoryList = [{ category: 'recordBets' }, { category: 'recordRebate' }, { category: 'recordDeposit' }, { category: 'recordTransfer' }, { category: 'recordPromotion' }, { category: 'recordRebatenow' }];
            //未登录处理
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
                return;
            }
            this.curShowCategory = categoryList[0].category;
            this.changeCategory();
            //绑定按钮切换事件，不能使用tap事件，因为300ms延迟后会再次触发click事件
            this.$page.find("[data-category-id]").on("click", function (e) {
                var target = e.target || e.srcElement;
                //若当前按钮处于激活状态，则不做处理
                if ($(target).hasClass("active")) {
                    return;
                }
                _this.$page.find("[data-category-id]").removeClass("active");
                $(target).addClass("active");
                _this.curShowCategory = $(target).attr("data-category-id");
                _this.changeCategory();
            });
        };
        RecordList_Shell.prototype.changeCategory = function () {
            //清空内容容器dom
            this.$page.find(this.pageContent).empty();
            var category = this.curShowCategory;
            if (category === 'recordBets') {
                // 初始化html
                this.$page.find(this.pageContent).html($(this.tpl_recordBets).html());
                var obj = {
                    formName: "report_bets_search",
                    tplContentTable: this.tpl_bets_contentTable,
                    tplTotalTable: this.tpl_bets_totalTable
                };
                new ReportBets(obj);
            }
            else if (category === 'recordRebate') {
                this.$page.find(this.pageContent).html($(this.tpl_recordRebate).html());
                var obj = {
                    formName: "report_rebate_search",
                    tplContentTable: this.tpl_rebate_contentTable
                };
                new ReportRebate(obj);
            }
            else if (category === 'recordDeposit') {
                this.$page.find(this.pageContent).html($(this.tpl_recordDeposit).html());
                var obj = {
                    formName: "report_deposit_search",
                    tplContentTable: this.tpl_deposit_contentTable,
                    timePicker: true
                };
                new ReportDeposit(obj);
            }
            else if (category === 'recordTransfer') {
                this.$page.find(this.pageContent).html($(this.tpl_recordTransfer).html());
                var obj = {
                    formName: "report_transfer_search",
                    tplContentTable: this.tpl_transfer_contentTable
                };
                new ReportTransfer(obj);
            }
            else if (category === 'recordPromotion') {
                this.$page.find(this.pageContent).html($(this.tpl_recordPromotion).html());
                var obj = {
                    formName: "report_promotion_search",
                    tplContentTable: this.tpl_promotion_contentTable
                };
                new ReportPromotion(obj);
            }
            else if (category === 'recordRebatenow') {
                this.$page.find(this.pageContent).html($(this.tpl_recordRebatenow).html());
                var obj = {
                    formName: "report_rebatenow_search",
                    tplContentTable: this.tpl_recordRebatenow_contentTable
                };
                new ReportRebatenow(obj);
            }
        };
        return RecordList_Shell;
    }());
    return RecordList_Shell;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/RecordListShell_vt009.js.map