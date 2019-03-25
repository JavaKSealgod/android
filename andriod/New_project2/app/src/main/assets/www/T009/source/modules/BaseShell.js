/**
 * 基础功能外壳，包含头部、底部涉及的脚本资源
 */
define('T009/source/modules/BaseShell', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api", "T009/source/components/Member_SignShell", "T009/source/components/Deposit_Shell_V1", "T009/source/components/Withdrawal_V1", "T009/source/components/Message_Shell", "T009/source/components/Member_PocketTransfer", "T009/source/components/Promotion", "T009/source/components/Member_Personal_vt009_baseShell", "T009/source/components/RecordListShell_vt009", "fastclick"], function (require, exports, Global, Api, SignShell, DepositShell, Withdrawal, MessageShell, PocketShell, PromotionCompnent, PersonalShell, RecordListShell, FastClick) {
    "use strict";
    var BaseShell = /** @class */ (function () {
        function BaseShell() {
            this.velocityDurationTime = 300;
            this.beforeLogin = '[data-cashap-id="before-login"]';
            this.afterLogin = '[data-cashap-id="after-login"]';
            this.sidebarManagerObjs = [];
            this.sidebarShowing = false;
            //头部属性 --- start
            this.headerContainer = '[data-cashap-id="header"]';
            this.page_Login = '[data-cashap-id="loginPage"]';
            this.btn_Login = '[data-cashap-id="loginBtn"]';
            this.Login_closeBtn = '[data-cashap-id="btn-login-close"]';
            this.page_Record = '[data-cashap-id="recordPage"]';
            this.btn_Record = '[data-cashap-id="recordBtn"]';
            this.Record_closeBtn = '[data-cashap-id="btn-record-close"]';
            this.page_Personal = '[data-cashap-id="personalPage"]';
            this.btn_Personal = '[data-cashap-id="personalBtn"]';
            this.Personal_closeBtn = '[data-cashap-id="btn-personal-close"]';
            this.header_btn_Recharge = '[data-cashap-id="header-btn-recharge"]';
            //头部属性---end
            //底部属性 --- start
            this.footerContainer = '[data-cashap-id="footer"]';
            this.page_News = '[data-cashap-id="newsPage"]';
            this.btn_News = '[data-cashap-id="btn-news"]';
            this.News_closeBtn = '[data-cashap-id="btn-news-close"]';
            this.page_Promotion = '[data-cashap-id="promotionPage"]';
            this.btn_Promotion = '[data-cashap-id="btn-promotion"]';
            this.Promotion_closeBtn = '[data-cashap-id="btn-promotion-close"]';
            this.page_Pocket = '[data-cashap-id="pocketTransferPage"]';
            this.btn_Pocket = '[data-cashap-id="btn-pocket"]';
            this.Pocket_closeBtn = '[data-cashap-id="btn-pocket-close"]';
            this.page_Recharge = '[data-cashap-id="rechargePage"]';
            this.btn_Recharge = '[data-cashap-id="btn-recharge"]';
            this.Recharge_closeBtn = '[data-cashap-id="btn-recharge-close"]';
            this.page_Bank = '[data-cashap-id="bankPage"]';
            this.btn_Bank = '[data-cashap-id="btn-bank"]';
            this.Bank_closeBtn = '[data-cashap-id="btn-bank-close"]';
            this.page_CSLink = '[data-cashap-id="CSLinkPage"]';
            this.btn_csLink = '[data-cashap-id="btn-cslink"]';
            this.cs_closeBtn = '[data-cashap-id="btn-cs-close"]';
            this.page_Setting = '[data-cashap-id="settingPage"]';
            this.btn_Setting = '[data-cashap-id="btn-setting"]';
            this.Setting_closeBtn = '[data-cashap-id="btn-setting-close"]';
            //底部属性 --- end
            //私信
            this.messageUnreadCount = '[data-cashap-id="mess-unread-count"]';
            //登录协议dom selector
            this.signinAgreeDomSel = {
                subPage: "[data-cashap-id=memberAgreement]",
                triggleOnBtn: "[data-cashap-id=btnMemberAgreement]",
                triggleOffBtn: "[data-cashap-id=memberAgreement] [data-cashap-id=agreement-back]"
            };
            //时时反水按钮
            this.recordRebatenowbtn = '[data-category-id="recordRebatenow"]';
            this.init();
        }
        BaseShell.prototype.init = function () {
            var _this = this;
            Global.Log.log("BaseShell init.");
            //头部、底部需要用到的非组件式脚本
            this.handleLoginState();
            this.handleHeader();
            this.handleFooter();
            this.toInitOtherResource();
            //已登录，则读取私信未读数量
            if (Global.App.isLogin()) {
                //重置为空
                $(this.messageUnreadCount).addClass('hide');
                Api.account.pm_unread_count()
                    .done(function (result) {
                    if (result.result) {
                        $(_this.messageUnreadCount).removeClass('hide');
                    }
                });
                //判断是否显示时时反水
                Api.report.rebatenowbtn()
                    .done(function (result) {
                    Global.Log.log("rebatenowrebatenow:", result);
                    if (result.show == 0) {
                        Global.Log.log("result.show:", result.show);
                        $(_this.recordRebatenowbtn).addClass("hide");
                    }
                });
            }
            else {
                $(this.messageUnreadCount).addClass('hide');
                //未登录时，登录协议处理
                this.signinAgreement();
                //未登陆时，注册用户协议处理
                this.registerAgreement();
            }
        };
        /**
         * 根据登录状态显示、隐藏dom
         */
        BaseShell.prototype.handleLoginState = function () {
            if (Global.App.isLogin()) {
                //已登录
                $(this.beforeLogin).addClass("hide");
                $(this.afterLogin).removeClass("hide");
            }
            else {
                $(this.beforeLogin).removeClass("hide");
                $(this.afterLogin).addClass("hide");
            }
        };
        /**
         * 头部处理
         */
        BaseShell.prototype.handleHeader = function () {
            var _this = this;
            FastClick["attach"]($(this.headerContainer)[0]);
            var Login = {
                id: "Login",
                activeBtn: this.btn_Login,
                location: "right",
                targetContainer: this.page_Login,
                closeBtn: this.Login_closeBtn,
                showedCallback: function () {
                    // 点击时初始化一次，再次点击不初始化
                    // var hasInit = $(this.btn_Login).attr("data-init") || null;
                    // if(!hasInit){
                    //     $(this.btn_Login).attr("data-init", "true");
                    //     new SignShell();
                    // }
                }
            }, Record = {
                id: "Record",
                activeBtn: this.btn_Record,
                location: "right",
                targetContainer: this.page_Record,
                closeBtn: this.Record_closeBtn,
                showedCallback: function () {
                    // 点击时初始化一次，再次点击不初始化
                    var hasInit = $(_this.btn_Record).attr("data-init") || null;
                    if (!hasInit) {
                        $(_this.btn_Record).attr("data-init", "true");
                        new RecordListShell();
                    }
                }
            }, Personal = {
                id: "Personal",
                activeBtn: this.btn_Personal,
                location: "right",
                targetContainer: this.page_Personal,
                closeBtn: this.Personal_closeBtn,
                showedCallback: function () {
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(_this.btn_Personal).attr("data-init") || null;
                    if (!hasInit) {
                        $(_this.btn_Personal).attr("data-init", "true");
                        new PersonalShell();
                    }
                }
            };
            this.sidebarManagerRegist(Login);
            this.sidebarManagerRegist(Record);
            this.sidebarManagerRegist(Personal);
            $(this.header_btn_Recharge).on("click", function (e) {
                if (e)
                    e.preventDefault();
                $(_this.btn_Recharge).trigger("click");
            });
        };
        /**
         * 侧栏显示效果管理函数
         * @param {ISidebarManagerRegistObj} obj
         */
        BaseShell.prototype.sidebarManagerRegist = function (obj) {
            var _this = this;
            obj["isShow"] = false;
            this.sidebarManagerObjs.push(obj);
            //绑定事件
            $(obj.activeBtn).on("click", function (e) {
                if (e)
                    e.preventDefault();
                //正在进行进场动画，阻止后续操作
                if (_this.sidebarShowing)
                    return false;
                var target = $(e.currentTarget).attr("data-cashap-id");
                //未登录时，强制隐藏登录、注册协议，若登录协议显示且当前点击显示登录面板的按钮，则关闭协议并阻止后续操作
                // if(!Global.App.isLogin()){
                //     $('[data-cashap-id=agreement-back]').each((idx, el)=>{
                //         $(el).trigger("tap");
                //         $(el).trigger("click");
                //     });
                //
                //     if("btn-right-sidebar" == target && !$(this.signinAgreeDomSel.subPage).hasClass("hide")){
                //         return;
                //     }
                // }
                _this.sidebarShowing = true;
                _this.sidebarManagerObjs.forEach(function (item, idx) {
                    //查找每一项，非目标项并且isShow=false时跳过，isShow=true时，调用函数关闭
                    if (item.isShow && item.activeBtn.indexOf(target) == -1) {
                        item.isShow = !item.isShow;
                        _this.toggleSidebar(item.targetContainer, item.location, item.isShow, function () { }, 100);
                    }
                    if (item.activeBtn.indexOf(target) > -1) {
                        //判断是否未登录，若是则返回退出继续执行
                        if (item.id !== 'Login' && item.id !== 'News' && item.id !== 'Promotion' && item.id !== 'CSLink') {
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
                        }
                        item.isShow = !item.isShow;
                        _this.toggleSidebar(item.targetContainer, item.location, item.isShow, function () {
                            _this.sidebarShowing = false;
                            if (item.isShow && item.hasOwnProperty("showedCallback")) {
                                item.showedCallback();
                            }
                        });
                    }
                });
            });
            if (obj.closeBtn) {
                $(obj.targetContainer).find(obj.closeBtn).on("click", function (e) {
                    if (e)
                        e.preventDefault();
                    Global.Util.trigger($(obj.activeBtn), "click");
                });
            }
        };
        /**
         * 侧栏显示、隐藏操作函数
         * @param {string} container
         * @param {string} location
         * @param {boolean} toShow
         * @param {Function} fn
         * @param {number} durationTime
         */
        BaseShell.prototype.toggleSidebar = function (container, location, toShow, fn, durationTime) {
            if (durationTime === void 0) { durationTime = 300; }
            var xPos = location == "left" ? "100%" : "-100%";
            if (toShow) {
                $(container)
                    .removeClass("hide")
                    .velocity({ translateX: xPos }, { duration: durationTime, easing: "easse-in-out", complete: function () {
                        fn();
                    } });
            }
            else {
                $(container)
                    .velocity({ translateX: "0" }, { duration: durationTime, easing: "easse-in-out", complete: function () {
                        $(container).addClass("hide");
                        fn();
                    } });
            }
        };
        /**
         * 底部处理
         */
        BaseShell.prototype.handleFooter = function () {
            var _this = this;
            FastClick["attach"]($(this.footerContainer)[0]);
            var News = {
                id: "News",
                activeBtn: this.btn_News,
                location: "right",
                targetContainer: this.page_News,
                closeBtn: this.News_closeBtn,
                showedCallback: function () {
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(_this.btn_News).attr("data-init") || null;
                    if (!hasInit) {
                        $(_this.btn_News).attr("data-init", "true");
                        new MessageShell();
                    }
                }
            }, Promotion = {
                id: "Promotion",
                activeBtn: this.btn_Promotion,
                location: "right",
                targetContainer: this.page_Promotion,
                closeBtn: this.Promotion_closeBtn,
                showedCallback: function () {
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(_this.btn_Promotion).attr("data-init") || null;
                    if (!hasInit) {
                        $(_this.btn_Promotion).attr("data-init", "true");
                        new PromotionCompnent();
                    }
                }
            }, Pocket = {
                id: "Pocket",
                activeBtn: this.btn_Pocket,
                location: "right",
                targetContainer: this.page_Pocket,
                closeBtn: this.Pocket_closeBtn,
                showedCallback: function () {
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(_this.btn_Pocket).attr("data-init") || null;
                    if (!hasInit) {
                        $(_this.btn_Pocket).attr("data-init", "true");
                        new PocketShell("pocket_transfer");
                    }
                }
            }, Recharge = {
                id: "Recharge",
                activeBtn: this.btn_Recharge,
                location: "right",
                targetContainer: this.page_Recharge,
                closeBtn: this.Recharge_closeBtn,
                showedCallback: function () {
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(_this.btn_Recharge).attr("data-init") || null;
                    if (!hasInit) {
                        $(_this.btn_Recharge).attr("data-init", "true");
                        new DepositShell();
                    }
                }
            }, Bank = {
                id: "Bank",
                activeBtn: this.btn_Bank,
                location: "right",
                targetContainer: this.page_Bank,
                closeBtn: this.Bank_closeBtn,
                showedCallback: function () {
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(_this.btn_Bank).attr("data-init") || null;
                    if (!hasInit) {
                        $(_this.btn_Bank).attr("data-init", "true");
                        new Withdrawal();
                    }
                }
            }, CSLing = {
                id: "CSLink",
                activeBtn: this.btn_csLink,
                location: "right",
                targetContainer: this.page_CSLink,
                closeBtn: this.cs_closeBtn,
            }, Setting = {
                id: "Setting",
                activeBtn: this.btn_Setting,
                location: "right",
                targetContainer: this.page_Setting,
                closeBtn: this.Setting_closeBtn,
            };
            Global.App.setCSHtml();
            this.sidebarManagerRegist(News);
            this.sidebarManagerRegist(Promotion);
            this.sidebarManagerRegist(Pocket);
            this.sidebarManagerRegist(Recharge);
            this.sidebarManagerRegist(Bank);
            this.sidebarManagerRegist(CSLing);
            this.sidebarManagerRegist(Setting);
        };
        /**
         * 登录协议展开、关闭、切换处理
         */
        BaseShell.prototype.signinAgreement = function () {
            //用户协议展开、关闭
            var scrollPageOption = this.signinAgreeDomSel;
            $("body").delegate('form[name="member_singin"] ' + scrollPageOption.triggleOnBtn, "click", function (e) {
                $(scrollPageOption.subPage)
                    .removeClass("hide")
                    .velocity({ translateX: "-100%" }, { duration: 200, easing: "ease-in-out", complete: function () { } });
            });
            $(scrollPageOption.triggleOffBtn).on("click", function (e) {
                // $("body").delegate(scrollPageOption.triggleOffBtn,"click", function(e){
                $(scrollPageOption.subPage).velocity({ translateX: "0" }, { duration: 200, easing: "ease-in-out", complete: function () {
                        $(scrollPageOption.subPage).addClass("hide");
                    } });
            });
            //用户协议展开、关闭 end
            //登录协议tab标签切换
            var tabToggleOpt = {
                tabsContainer: "[data-cashap-id=segmentedControl]",
                contentsContainer: "[data-cashap-id=items]"
            }, $tabContainer = $(tabToggleOpt.tabsContainer), $contentContainer = $(tabToggleOpt.contentsContainer);
            FastClick["attach"]($tabContainer[0]);
            $tabContainer.children().on("click", function (e) {
                if (e)
                    e.preventDefault();
                var $target = $(e.currentTarget), targetIdx = $tabContainer.children().index($target[0]);
                $tabContainer.children().removeClass("active");
                $target.addClass("active");
                $contentContainer.children().removeClass("active");
                $($contentContainer.children()[targetIdx]).addClass("active");
            });
            //登录协议tab标签切换 end
        };
        BaseShell.prototype.registerAgreement = function () {
            var scrollPageOption = {
                subPage: "[data-cashap-id=signUpAgreement]",
                triggleOnBtn: "[data-cashap-id=btnMemberAgreement]",
                triggleOffBtn: '[data-cashap-id=signUpAgreement] [data-cashap-id="agreement-back"]'
            };
            $("body").delegate('form[name="member_signup"] ' + scrollPageOption.triggleOnBtn, "tap", function () {
                $(scrollPageOption.subPage)
                    .removeClass("hide")
                    .velocity({ translateX: "-100%" }, { duration: 200, easing: "ease-in-out", complete: function () { } });
            });
            $("body").delegate(scrollPageOption.triggleOffBtn, "tap", function (e) {
                $(scrollPageOption.subPage)
                    .velocity({ translateX: "0" }, { duration: 200, easing: "ease-in-out", complete: function () {
                        $(scrollPageOption.subPage).addClass("hide");
                    } });
            });
        };
        BaseShell.prototype.toInitOtherResource = function () {
            new SignShell();
        };
        return BaseShell;
    }());
    return BaseShell;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/modules/BaseShell.js.map