define('T009/source/components/Web_Message', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "handlebars"], function (require, exports, Global, Api, Handlebars) {
    "use strict";
    var Web_Message = /** @class */ (function () {
        function Web_Message(opt) {
            this.language = "zh-cn"; //zh-tw=繁体,zh-cn=简体,en-us=英文
            this.currentPage = 1; //当前页码索引
            this.pageSize = 1000;
            this.pageRange = 5; //页码范围，如5:1-5,6-10
            this.messageContainer = '[data-cashap-id="messageContainer"]'; //由外部提供，外部传入值会覆盖此值
            this.tpl_messageItem = '[data-cashap-id="messageItemTpl"]'; //由外部提供，外部传入值会覆盖此值
            this.taps = '[data-cashap-id="new-tabs"]';
            this.messDetails = '[data-cashap-id="message-detail"]';
            this.messageContainer = opt.sel_container;
            this.tpl_messageItem = opt.sel_template;
            this.init();
        }
        Web_Message.prototype.init = function () {
            Global.Log.log("Web_Message.init");
            Global.Tips.showSystemLoading();
            this.setNoticeContent();
        };
        Web_Message.prototype.setNoticeContent = function () {
            var _this = this;
            Api.message.site_message()
                .done(function (result) {
                Global.Tips.hideSystemLoading();
                _this.siteMessageCallback(result);
            });
        };
        /**
         * 请求公告数据
         */
        Web_Message.prototype.siteMessageCallback = function (result) {
            var _this = this;
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
            this.setHtml($(this.messageContainer), content, $(this.tpl_messageItem).html());
            //信息切换区域绑定fastclick，需要在dom渲染完毕后再绑定
            var tapCont = $(this.messageContainer).find(this.taps);
            // if(tapCont.length > 0){
            //     FastClick["attach"](tapCont[0]);
            // }
            //绑定公告项切换事件，不能使用tap事件，因为300ms延迟后会再次触发click事件
            tapCont.children().on("click", function (e) {
                var target = e.currentTarget || e.target, idx = tapCont.children().index(target);
                tapCont.children().removeClass("active").eq(idx).addClass("active");
                $(_this.messDetails).addClass("hide").eq(idx).removeClass("hide");
            });
            //触发选择展开第一个信息
            $(tapCont.children()[0]).trigger("click");
        };
        /**
         * 创建html结构
         */
        Web_Message.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        return Web_Message;
    }());
    return Web_Message;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Web_Message.js.map