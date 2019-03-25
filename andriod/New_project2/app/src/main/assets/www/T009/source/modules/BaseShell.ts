/**
 * 基础功能外壳，包含头部、底部涉及的脚本资源
 */

import Global = require("./global");
import Api = require("../../../Global/source/modules/api");
import SignShell = require("../components/Member_SignShell");
import DepositShell = require("../components/Deposit_Shell_V1");
import Withdrawal = require("../components/Withdrawal_V1");
import MessageShell = require("../components/Message_Shell");
import PocketShell = require("../components/Member_PocketTransfer");
import PromotionCompnent = require("../components/Promotion");
import PersonalShell = require("../components/Member_Personal_vt009_baseShell");
import RecordListShell = require("../components/RecordListShell_vt009");


import FastClick = require("fastclick");

class BaseShell {
    velocityDurationTime = 300;

    beforeLogin = '[data-cashap-id="before-login"]';
    afterLogin = '[data-cashap-id="after-login"]';
    sidebarManagerObjs: ISidebarManagerRegistObj[] = [];
    sidebarShowing = false;

    //头部属性 --- start
    headerContainer = '[data-cashap-id="header"]';
    
    page_Login = '[data-cashap-id="loginPage"]';
    btn_Login = '[data-cashap-id="loginBtn"]';
    Login_closeBtn = '[data-cashap-id="btn-login-close"]';

    page_Record = '[data-cashap-id="recordPage"]';
    btn_Record = '[data-cashap-id="recordBtn"]';
    Record_closeBtn = '[data-cashap-id="btn-record-close"]';

    page_Personal = '[data-cashap-id="personalPage"]';
    btn_Personal = '[data-cashap-id="personalBtn"]';
    Personal_closeBtn = '[data-cashap-id="btn-personal-close"]';

    header_btn_Recharge = '[data-cashap-id="header-btn-recharge"]';

    //头部属性---end

    //底部属性 --- start
    footerContainer = '[data-cashap-id="footer"]';

    page_News = '[data-cashap-id="newsPage"]';
    btn_News = '[data-cashap-id="btn-news"]';
    News_closeBtn = '[data-cashap-id="btn-news-close"]';

    page_Promotion = '[data-cashap-id="promotionPage"]';
    btn_Promotion = '[data-cashap-id="btn-promotion"]';
    Promotion_closeBtn = '[data-cashap-id="btn-promotion-close"]';

    page_Pocket = '[data-cashap-id="pocketTransferPage"]';
    btn_Pocket = '[data-cashap-id="btn-pocket"]';
    Pocket_closeBtn = '[data-cashap-id="btn-pocket-close"]';

    page_Recharge = '[data-cashap-id="rechargePage"]';
    btn_Recharge = '[data-cashap-id="btn-recharge"]';
    Recharge_closeBtn = '[data-cashap-id="btn-recharge-close"]';

    page_Bank = '[data-cashap-id="bankPage"]';
    btn_Bank = '[data-cashap-id="btn-bank"]';
    Bank_closeBtn = '[data-cashap-id="btn-bank-close"]';

    page_CSLink = '[data-cashap-id="CSLinkPage"]';
    btn_csLink = '[data-cashap-id="btn-cslink"]';
    cs_closeBtn = '[data-cashap-id="btn-cs-close"]';

    page_Setting = '[data-cashap-id="settingPage"]';
    btn_Setting = '[data-cashap-id="btn-setting"]';
    Setting_closeBtn = '[data-cashap-id="btn-setting-close"]';
    //底部属性 --- end

    //私信
    messageUnreadCount = '[data-cashap-id="mess-unread-count"]';

    //登录协议dom selector
    signinAgreeDomSel = {
        subPage: "[data-cashap-id=memberAgreement]",
        triggleOnBtn: "[data-cashap-id=btnMemberAgreement]",
        triggleOffBtn: "[data-cashap-id=memberAgreement] [data-cashap-id=agreement-back]"
    };

    //时时反水按钮
    recordRebatenowbtn = '[data-category-id="recordRebatenow"]';

    constructor(){
        this.init();
    }

    init(){
        Global.Log.log("BaseShell init.");


        //头部、底部需要用到的非组件式脚本
        this.handleLoginState();

        this.handleHeader();

        this.handleFooter();

        this.toInitOtherResource();

        //已登录，则读取私信未读数量
        if(Global.App.isLogin()){
            //重置为空
            $(this.messageUnreadCount).addClass('hide');

            Api.account.pm_unread_count()
                .done((result)=>{
                    if(result.result){
                        $(this.messageUnreadCount).removeClass('hide');
                    }
                });
            
            //判断是否显示时时反水
            Api.report.rebatenowbtn()
            .done((result) => {
                Global.Log.log("rebatenowrebatenow:", result);
                if(result.show==0){
                    Global.Log.log("result.show:", result.show);
                    $(this.recordRebatenowbtn).addClass("hide");
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
    }

    /**
     * 根据登录状态显示、隐藏dom
     */
    handleLoginState() {
        if(Global.App.isLogin()){
            //已登录
            $(this.beforeLogin).addClass("hide");
            $(this.afterLogin).removeClass("hide");
        }
        else {
            $(this.beforeLogin).removeClass("hide");
            $(this.afterLogin).addClass("hide");
        }
    }

    /**
     * 头部处理
     */
    handleHeader(){
        FastClick["attach"]($(this.headerContainer)[0]);

        var Login = {
            id:"Login",
            activeBtn: this.btn_Login,
            location: "right",
            targetContainer: this.page_Login,
            closeBtn: this.Login_closeBtn,
            showedCallback: ()=>{
                // 点击时初始化一次，再次点击不初始化
                // var hasInit = $(this.btn_Login).attr("data-init") || null;
                // if(!hasInit){
                //     $(this.btn_Login).attr("data-init", "true");
                //     new SignShell();
                // }
            }
        },
        Record = {
            id:"Record",
            activeBtn: this.btn_Record,
            location: "right",
            targetContainer: this.page_Record,
            closeBtn: this.Record_closeBtn,
            showedCallback: ()=>{
                // 点击时初始化一次，再次点击不初始化
                var hasInit = $(this.btn_Record).attr("data-init") || null;
                if(!hasInit){
                    $(this.btn_Record).attr("data-init", "true");
                    new RecordListShell();
                }
            }
        },
        Personal = {
            id:"Personal",
            activeBtn: this.btn_Personal,
            location: "right",
            targetContainer: this.page_Personal,
            closeBtn: this.Personal_closeBtn,
            showedCallback: ()=>{
                //点击时初始化一次，再次点击不初始化
                var hasInit = $(this.btn_Personal).attr("data-init") || null;
                if(!hasInit){
                    $(this.btn_Personal).attr("data-init", "true");
                    new PersonalShell();
                }
            }
        };

        this.sidebarManagerRegist(Login);
        this.sidebarManagerRegist(Record);
        this.sidebarManagerRegist(Personal);

        $(this.header_btn_Recharge).on("click", (e: Event)=>{
            if(e) e.preventDefault();

            $(this.btn_Recharge).trigger("click");
        });

    }

    /**
     * 侧栏显示效果管理函数
     * @param {ISidebarManagerRegistObj} obj
     */
    sidebarManagerRegist(obj: ISidebarManagerRegistObj){
        obj["isShow"] = false;

        this.sidebarManagerObjs.push(obj);
        
        //绑定事件
        $(obj.activeBtn).on("click", (e: Event)=>{
            if(e) e.preventDefault();
            //正在进行进场动画，阻止后续操作
            if(this.sidebarShowing) return false;

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
            this.sidebarShowing = true;

            this.sidebarManagerObjs.forEach((item, idx)=>{
                //查找每一项，非目标项并且isShow=false时跳过，isShow=true时，调用函数关闭
                if(item.isShow && item.activeBtn.indexOf(target) == -1){
                    item.isShow = !item.isShow;

                    this.toggleSidebar(item.targetContainer, item.location, item.isShow, ()=>{}, 100);
                }

                if(item.activeBtn.indexOf(target) > -1) {
                    //判断是否未登录，若是则返回退出继续执行
                    if(item.id !== 'Login' && item.id !== 'News' && item.id !== 'Promotion' && item.id !== 'CSLink'){
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
                    }
                    item.isShow = !item.isShow;

                    this.toggleSidebar(item.targetContainer, item.location, item.isShow, ()=>{
                        this.sidebarShowing = false;

                        if(item.isShow && item.hasOwnProperty("showedCallback")){
                            item.showedCallback();
                        }
                    });
                }
            });
        });

        if(obj.closeBtn) {
            $(obj.targetContainer).find(obj.closeBtn).on("click", (e: Event) => {
                if (e) e.preventDefault();
                Global.Util.trigger($(obj.activeBtn), "click");
            });
        }
    }

    /**
     * 侧栏显示、隐藏操作函数
     * @param {string} container
     * @param {string} location
     * @param {boolean} toShow
     * @param {Function} fn
     * @param {number} durationTime
     */
    toggleSidebar(container: string, location: string, toShow: boolean, fn: Function, durationTime = 300){
        var xPos = location == "left" ? "100%" : "-100%";

        if(toShow) {
            $(container)
                .removeClass("hide")
                .velocity({translateX: xPos}, {duration: durationTime, easing: "easse-in-out", complete: ()=>{
                    fn();
                } });
        }
        else {
            $(container)
                .velocity({translateX: "0"}, {duration: durationTime, easing: "easse-in-out", complete: ()=>{
                    $(container).addClass("hide");
                    fn();
                } });
        }
    }

    /**
     * 底部处理
     */
    handleFooter() {
        FastClick["attach"]($(this.footerContainer)[0]);

        var News = {
                id:"News",
                activeBtn: this.btn_News,
                location: "right",
                targetContainer: this.page_News,
                closeBtn: this.News_closeBtn,
                showedCallback: ()=>{
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(this.btn_News).attr("data-init") || null;
                    if(!hasInit){
                        $(this.btn_News).attr("data-init", "true");
                        new MessageShell();
                    }
                }
            },
            Promotion = {
                id:"Promotion",
                activeBtn: this.btn_Promotion,
                location: "right",
                targetContainer: this.page_Promotion,
                closeBtn: this.Promotion_closeBtn,
                showedCallback: ()=>{
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(this.btn_Promotion).attr("data-init") || null;
                    if(!hasInit){
                        $(this.btn_Promotion).attr("data-init", "true");
                        new PromotionCompnent();
                    }
                }
            },
            Pocket = {
                id:"Pocket",
                activeBtn: this.btn_Pocket,
                location: "right",
                targetContainer: this.page_Pocket,
                closeBtn: this.Pocket_closeBtn,
                showedCallback: ()=>{
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(this.btn_Pocket).attr("data-init") || null;
                    if(!hasInit){
                        $(this.btn_Pocket).attr("data-init", "true");
                        new PocketShell("pocket_transfer");
                    }
                }
            },
            Recharge = {
                id:"Recharge",
                activeBtn: this.btn_Recharge,
                location: "right",
                targetContainer: this.page_Recharge,
                closeBtn: this.Recharge_closeBtn,
                showedCallback: ()=>{
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(this.btn_Recharge).attr("data-init") || null;
                    if(!hasInit){
                        $(this.btn_Recharge).attr("data-init", "true");
                        new DepositShell();
                    }
                }
            },
            Bank = {
                id:"Bank",
                activeBtn: this.btn_Bank,
                location: "right",
                targetContainer: this.page_Bank,
                closeBtn: this.Bank_closeBtn,
                showedCallback: ()=>{
                    //点击时初始化一次，再次点击不初始化
                    var hasInit = $(this.btn_Bank).attr("data-init") || null;
                    if(!hasInit){
                        $(this.btn_Bank).attr("data-init", "true");
                        new Withdrawal();
                    }
                }
            },
            CSLing = {
                id:"CSLink",
                activeBtn: this.btn_csLink,
                location: "right",
                targetContainer: this.page_CSLink,
                closeBtn: this.cs_closeBtn,
            },
            Setting = {
                id:"Setting",
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
    }
    /**
     * 登录协议展开、关闭、切换处理
     */
    signinAgreement(){
        //用户协议展开、关闭
        var scrollPageOption = this.signinAgreeDomSel;

        $("body").delegate('form[name="member_singin"] ' + scrollPageOption.triggleOnBtn, "click", function(e){
            $(scrollPageOption.subPage)
                .removeClass("hide")
                .velocity({translateX:"-100%"},  { duration: 200, easing: "ease-in-out",complete: ()=>{} });
        });

        $(scrollPageOption.triggleOffBtn).on("click", (e)=>{
        // $("body").delegate(scrollPageOption.triggleOffBtn,"click", function(e){
            $(scrollPageOption.subPage).velocity({translateX:"0"}, { duration: 200, easing: "ease-in-out",complete: ()=>{
                $(scrollPageOption.subPage).addClass("hide");
            }});
        });
        //用户协议展开、关闭 end

        //登录协议tab标签切换
        var tabToggleOpt = {
            tabsContainer: "[data-cashap-id=segmentedControl]",
            contentsContainer: "[data-cashap-id=items]"
        },
            $tabContainer = $(tabToggleOpt.tabsContainer),
            $contentContainer = $(tabToggleOpt.contentsContainer);

        FastClick["attach"]($tabContainer[0]);

        $tabContainer.children().on("click", (e: Event)=>{
            if(e) e.preventDefault();

            var $target = $(e.currentTarget),
                targetIdx = $tabContainer.children().index($target[0]);

            $tabContainer.children().removeClass("active");
            $target.addClass("active");

            $contentContainer.children().removeClass("active");
            $($contentContainer.children()[targetIdx]).addClass("active");
        });
        //登录协议tab标签切换 end
    }

    registerAgreement(){
        var scrollPageOption = {
            subPage: "[data-cashap-id=signUpAgreement]",
            triggleOnBtn: "[data-cashap-id=btnMemberAgreement]",
            triggleOffBtn: '[data-cashap-id=signUpAgreement] [data-cashap-id="agreement-back"]'
        };

        $("body").delegate('form[name="member_signup"] ' + scrollPageOption.triggleOnBtn,"tap", function(){
            $(scrollPageOption.subPage)
                .removeClass("hide")
                .velocity({translateX:"-100%"},  { duration: 200, easing: "ease-in-out", complete: ()=>{} });
        });

        $("body").delegate(scrollPageOption.triggleOffBtn,"tap", function(e){
            $(scrollPageOption.subPage)
                .velocity({translateX:"0"}, { duration: 200, easing: "ease-in-out", complete: ()=>{
                    $(scrollPageOption.subPage).addClass("hide");
                }});
        });
    }

    toInitOtherResource(){
        new SignShell();
    }
}

export = BaseShell;
