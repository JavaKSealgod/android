define('T009/source/components/recordListShell', ["require", "exports", "T009/source/modules/global"], function (require, exports, Global) {
    "use strict";
    // import SiteMessage = require("./Web_Message");
    // import PersonalMessage = require("./Member_PrivateMessage");
    var RecordList_Shell = /** @class */ (function () {
        function RecordList_Shell() {
            this.page = '[data-cashap-id="newsPage"]';
            this.btn_personal = '[data-category-id="personal-message"]';
            this.pageContent = '[data-cashap-id="newspage-content"]';
            this.tpl_site = '[data-pkg-tpl="messageItemTpl"]';
            this.tpl_personal = '[data-pkg-tpl="personMessageItemTpl"]';
            this.curShowCategory = "";
            this.$page = $(this.page);
            this.init();
        }
        RecordList_Shell.prototype.init = function () {
            var _this = this;
            //已登录，显示“个人消息”按钮
            if (Global.App.isLogin()) {
                this.$page.find(this.btn_personal).removeClass("hide");
            }
            this.curShowCategory = 'site-message';
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
            if (category === 'site-message') {
                var obj = {
                    sel_container: this.pageContent,
                    sel_template: this.tpl_site
                };
                // new SiteMessage(obj);
            }
            else if (category === 'personal-message') {
                var obj = {
                    sel_container: this.pageContent,
                    sel_template: this.tpl_personal
                };
                // new PersonalMessage(obj);
            }
        };
        return RecordList_Shell;
    }());
    return RecordList_Shell;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/recordListShell.js.map