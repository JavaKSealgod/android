///<reference path="../docs/global_doc.d.ts"/>
///<reference path="../../../Global/libs/require.d.ts"/>
///<reference path="../../../Global/libs/jquery.d.ts"/>
///<reference path="../../../Global/libs/zepto.d.ts"/>
///<reference path="../../../Global/libs/velocity-animate.d.ts"/>
///<reference path="../../../Global/libs/islider.d.ts"/>
///<reference path="../../../Global/libs/handlebars.d.ts"/>
///<reference path="../docs/models.d.ts"/>
///<reference path="../docs/global_doc.d.ts"/>
define('T009/source/modules/global', ["require", "exports", "Global/source/modules/api", "Global/libs/storage", "Global/source/modules/Tips", "Global/source/modules/ConfirmDialog", "Global/source/modules/InfoTip", "Global/source/modules/LoadingPannal", "Global/source/modules/Util", "Global/libs/velocity"], function (require, exports, Api, storage, tips, confirmDialog, newTips, Loading, util) {
    "use strict";
    //import FastClick = require("fastclick");
    var Com_Gametree_Cashap_Module;
    (function (Com_Gametree_Cashap_Module) {
        var App = /** @class */ (function () {
            function App() {
            }
            App.init = function () {
                var _this = this;
                this.isMobile();
                this.userOrientation();
                window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.userOrientation, false);
                $(window).resize(function () { return _this.isMobile; });
                //临时重写该方法，后续需要将引用该方法的地方修改成调用新方法
                Com_Gametree_Cashap_Module.Tips.systemTip = function (mess, autoHide) {
                    if (autoHide === void 0) { autoHide = true; }
                    Com_Gametree_Cashap_Module.Tips1.show({
                        tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SystemTips"),
                        tipsContentTxt: mess,
                        leftbtnShow: true,
                        leftbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "Close"),
                        leftbtnfunction: function () {
                            Com_Gametree_Cashap_Module.Tips1.hide();
                        }
                    });
                };
                var loading = new Loading();
                Com_Gametree_Cashap_Module.Tips.showSystemLoading = function () {
                    loading.show();
                };
                Com_Gametree_Cashap_Module.Tips.hideSystemLoading = function () {
                    loading.hide();
                };
                Com_Gametree_Cashap_Module.ConfirmDialog.show = function (option) {
                    var o = {
                        tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SystemTips"),
                        tipsContentTxt: option.message,
                        leftbtnShow: true,
                        rightbtnShow: true,
                        leftbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "Cancel"),
                        rightbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                        leftbtnfunction: function () { Com_Gametree_Cashap_Module.Tips1.hide(); },
                        rightbtnfunction: function () { Com_Gametree_Cashap_Module.Tips1.hide(); }
                    };
                    if (option.hasOwnProperty("labelLeftBtn")) {
                        o.leftbtnTxt = option.labelLeftBtn;
                    }
                    if (option.hasOwnProperty("labelRightBtn")) {
                        o.rightbtnTxt = option.labelRightBtn;
                    }
                    if (option.hasOwnProperty("callbackLeftBtn")) {
                        o.leftbtnfunction = function () {
                            option.callbackLeftBtn();
                            Com_Gametree_Cashap_Module.Tips1.hide();
                        };
                    }
                    if (option.hasOwnProperty("callbackRightBtn")) {
                        o.rightbtnfunction = function () {
                            option.callbackRightBtn();
                            Com_Gametree_Cashap_Module.Tips1.hide();
                        };
                    }
                    if (option.hasOwnProperty("leftbtnShow")) {
                        o.leftbtnShow = option.leftbtnShow;
                    }
                    if (option.hasOwnProperty("rightbtnShow")) {
                        o.rightbtnShow = option.rightbtnShow;
                    }
                    Com_Gametree_Cashap_Module.Tips1.show(o);
                };
                //方法重写---end
                Com_Gametree_Cashap_Module.Log.log("App init");
                if (window.navigator.userAgent.indexOf("GTMobileApp") == -1) {
                    $('[data-cashap-id="topc"]').removeClass("hide");
                }
                var cId = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId);
                if (cId != null) {
                    Api.cashAppId = cId;
                }
                if (this.isLogin()) {
                    //绑定登出按钮
                    this.bindLogoutBtn();
                    this.keepAlive();
                    //重新设置在线时间（此刻本地时间）。由于登录后只有keepAlive()请求成功后才会重新设置
                    //防止每次时间未到重新调用keepAlive()而刷新页面导致keepAlive()重新计时调用，继而发生“LiveTime”一直未刷新
                    // Com_Gametree_Cashap_Module.Util.cookie("LiveTime",new Date().valueOf(),{path:'/'});
                }
                else {
                    //清除登录记录
                    this.memberLogOutSuccess(false);
                }
                //保存推荐人
                this.setExtendId();
                //生成客服链接
                // this.setCSHtml();
                //处理需要做登陆检测的项
                if (this.isLogin()) {
                    Api.account.profile_baseInfo(true)
                        .done(function (profileInfo) {
                        _this.initHandleMemberRuleTest(profileInfo.memberLevel);
                    });
                }
                else {
                    this.initHandleMemberRuleTest(-1);
                }
                //判断是否打开登录界面
                if (Com_Gametree_Cashap_Module.Util.cookie(this.openLoginPage) != null) {
                    this.goToLoginPage();
                }
                //监听后退按钮事件
                // this.handleBackward();
                //设置input[type=checkbox/radio]时，focus后马上失去焦点
                $("body").on("focus", 'input[type=checkbox],input[type=radio]', function (e) {
                    e.currentTarget.blur();
                });
                // FastClick.attach($(".home-page")[0]);
                // FastClick.attach($('[data-cashap-id="SideBarMenu"]')[0]);
                this.afterInit();
                //处理site_message弹出
                this.handleSiteMessagePop();
                if (Com_Gametree_Cashap_Module.App.isApp()) {
                    // 仅app 修正body的fixed导致弹出虚拟键盘以后视图错位 
                    document.querySelectorAll('input').forEach(function (element) {
                        element.addEventListener('blur', function () {
                            window.scroll(0, 0); //修正body的fixed导致弹出虚拟键盘以后视图错位 
                        });
                    });
                }
            };
            //提示轉向
            App.userOrientation = function () {
                var _this = this;
                setTimeout(function () {
                    var height = document.documentElement.clientHeight, width = document.documentElement.clientWidth, tszaheight = window.screen.availHeight, tszawidth = window.screen.availWidth;
                    if (height > width) {
                        $('.straightwarn').removeClass('hide');
                        $('.horizontalwarn').addClass('hide');
                        $('body').addClass('portrait');
                    }
                    else {
                        if (width > height) {
                            $('.horizontalwarn').removeClass('hide');
                            $('body').removeClass('portrait');
                        }
                    }
                    //判断android 调整左侧按钮键位置
                    if (Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.android && window.navigator.userAgent.indexOf("GTMobileApp") == -1) {
                        $(_this.leftFullscreen).removeClass('hide');
                        //非火狐以外浏览器
                        if (tszaheight > tszawidth) {
                            $('.straightwarn').removeClass('hide');
                            $('.horizontalwarn').addClass('hide');
                            $('body').addClass('portrait');
                        }
                        else {
                            if (tszaheight < tszawidth) {
                                $('.horizontalwarn').removeClass('hide');
                                $('body').removeClass('portrait');
                            }
                        }
                        //判断火狐 调整左侧按钮键位置
                        if (Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.gecko) {
                            setTimeout(function () {
                                var height = document.documentElement.clientHeight, width = document.documentElement.clientWidth;
                                if (height > width) {
                                    $('.straightwarn').removeClass('hide');
                                    $('.horizontalwarn').addClass('hide');
                                    $('body').addClass('portrait');
                                }
                                else {
                                    if (height < width) {
                                        $('.horizontalwarn').removeClass('hide');
                                        $('body').removeClass('portrait');
                                    }
                                }
                            }, 500);
                        }
                    }
                    //判断是否为 IOS以及火狐
                    if (Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.ios && Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.gecko) {
                        var height = window.screen.height, width = window.screen.width;
                        if (height > width) {
                            $('.straightwarn').removeClass('hide');
                            $('.horizontalwarn').addClass('hide');
                            $('body').addClass('portrait');
                        }
                        else {
                            if (height < width) {
                                $('.horizontalwarn').removeClass('hide');
                                $('body').removeClass('portrait');
                            }
                        }
                    }
                    if (window.orientation == 0 || window.orientation == 180) {
                        //竖屏
                        $('body').addClass('portrait');
                        $('.straightwarn').removeClass('hide');
                        $('.horizontalwarn').addClass('hide');
                        $('input').blur();
                    }
                    else if (window.orientation == 90 || window.orientation == -90) {
                        //横屏
                        $('.horizontalwarn').removeClass('hide');
                        $('body').removeClass('portrait');
                    }
                }, 1000 / 60);
                //为APP拿掉全银幕按钮，解决app可移动，白边问题
                if (window.navigator.userAgent.indexOf("GTMobileApp") > -1) {
                    $(this.leftFullscreen).addClass("hide");
                    var metaValue = $('meta[name=viewport]').attr('content');
                    $('meta[name=viewport]').attr('content', metaValue + ",viewport-fit=cover");
                    $('html').addClass("app-html");
                    $('body').addClass("app-body");
                }
            };
            App.isMobile = function () {
                setTimeout(function () {
                    if (!(!Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.mobile ||
                        Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.ios ||
                        Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.android ||
                        Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.iPhone ||
                        Com_Gametree_Cashap_Module.Util.getBrowserInfo().versions.iPad)) {
                        $('body').empty().append('<div class="mobile"></div>');
                    }
                }, 1000 / 60);
            };
            App.isLogin = function () {
                //判断当前keepALive最近读取时间与本地时间对比是否超过指定值，若是则返回false而不需再判断CashAppId是否存在
                var isLogin = false, oldTime = Com_Gametree_Cashap_Module.Util.cookie("LiveTime");
                // if(oldTime != null && new Date().valueOf() - parseInt(oldTime) < 1000 * 60 * 30 && Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId) != null){
                // 	isLogin = true;
                // }
                isLogin = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId) != null;
                return isLogin;
            };
            /**
             * 会员登入成功
             */
            App.memberSignUpSuccess = function () {
                //防止覆盖
                var cId = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId);
                if (cId != null) {
                    return;
                }
                //CashAppId 用于标记当前是否登录
                Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId, (new Date()).valueOf(), { path: '/' });
                // Com_Gametree_Cashap_Module.Util.cookie("LiveTime",new Date().valueOf(),{path:'/'});
                //刚登陆完毕，由于此时请求profileInfo需要CashAppId缓存数据，而当前已经过了App.init()处理时机，此处需要再次设置
                Api.cashAppId = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId);
                //绑定登出按钮
                this.bindLogoutBtn();
                this.keepAlive();
            };
            /**
             * 会员登出成功
             * @param {boolean} clearAutoToken  可选。global初始化时，才会传值覆盖默认值
             */
            App.memberLogOutSuccess = function (clearAutoToken) {
                if (clearAutoToken === void 0) { clearAutoToken = true; }
                Com_Gametree_Cashap_Module.Util.removeCookie(storage.storageID.CashAppId, { path: '/' });
                Com_Gametree_Cashap_Module.Util.removeCookie("LiveTime", { path: '/' });
                clearInterval(parseInt($("body").attr("data-keepalive")));
                //清除自动登入Token
                if (clearAutoToken) {
                    Com_Gametree_Cashap_Module.App.removeToken();
                }
                //删除jstorage
                var storageKeys = storage.getAllKey();
                storageKeys.forEach(function (key) {
                    //site_message不清除
                    if (key == storage.storageID.SiteMessage || key == storage.storageID.site_messageTimeId || key == storage.storageID.IsReadProperty) {
                        return;
                    }
                    storage.removeStorageValueOnlyById(key);
                });
            };
            App.keepAlive = function () {
                var _this = this;
                //会员登录状态时，定时提交保持会员在线统计
                var _showTips = false;
                var timer = setTimeout(function () {
                    Api.account.keep_alive()
                        .done(function (result) {
                        //判断会员是否需要立即登出操作
                        if (result && result.hasOwnProperty("state") && result.state == 0) {
                            var _time;
                            var o = {
                                tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SystemTips"),
                                tipsContentTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", result.statedetail),
                                contentDirection: "center",
                                // leftbtnShow: false,
                                rightbtnShow: true,
                                // leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
                                rightbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                                // leftbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); },
                                rightbtnfunction: function () {
                                    Com_Gametree_Cashap_Module.Tips1.hide();
                                    clearTimeout(_time);
                                    _this.logout();
                                }
                            };
                            if (_showTips)
                                return;
                            Com_Gametree_Cashap_Module.Tips1.show(o);
                            _showTips = true;
                            _time = setTimeout(function () {
                                _this.logout();
                            }, 5000);
                            return;
                        }
                        _this.keepAlive();
                    });
                }, this.keepAliveTime);
                $("body").attr("data-keepalive", timer);
            };
            /**
             * 显示登出按钮并绑定登出按钮
             */
            App.bindLogoutBtn = function () {
                var _this = this;
                $(this.settingBtn).removeClass('hide');
                $(this.logoutBtnSeletor).on("tap", function (e) {
                    _this.logout();
                });
            };
            /**
             * 会员登出
             */
            App.logout = function () {
                var _this = this;
                //判断登出处理中则退出操作
                if (this.logouting) {
                    return;
                }
                //是否询问登出
                this.logouting = true;
                var btn = $(this.logoutBtnSeletor), txtEl = btn.find(this.logoutBtnTxt);
                btn.addClass("disabled");
                btn[0].disabled = true;
                btn.attr("data-txt", txtEl.html());
                txtEl.html(Com_Gametree_Cashap.Language.getMessage_Translate("Profile_BaseInfo", "submitbtn_logout"));
                Com_Gametree_Cashap_Module.Tips.showSystemLoading();
                Api.account.logout()
                    .done(function (json) {
                    if (json.errorInfo.length == 0) {
                        _this.logoutSuccess();
                    }
                    else {
                        _this.logoutError(json);
                    }
                    _this.logouting = false;
                    btn.removeClass("disabled");
                    btn[0].disabled = false;
                    txtEl.html(btn.attr("data-txt"));
                });
            };
            App.logoutSuccess = function () {
                this.memberLogOutSuccess();
                window.location.href = Com_Gametree_Cashap.SiteConfig.LogoutSuccessUrl;
            };
            App.logoutError = function (json) {
                var errorCode = "", errorText;
                if (json.errorInfo.length > 0) {
                    errorCode = json.errorInfo[0].errorCode;
                }
                errorText = Com_Gametree_Cashap.Language.getMessage_Translate("Profile_BaseInfo", errorCode);
                Com_Gametree_Cashap_Module.Tips.systemTip(errorText);
            };
            /**
             * 浏览器后退
             */
            App.backWard = function () {
                window.history.back();
            };
            App.getGameInfo = function (pocketId) {
                var gameId = "", categories = "";
                switch (pocketId) {
                    case "GtCasino":
                        gameId = "gtcasino";
                        categories = "liveGame,slotGame";
                        break;
                    case "BB":
                        gameId = "bb";
                        categories = "liveGame,slotGame,lotteryGame,sportGame";
                        break;
                    case "WG":
                        gameId = "wg";
                        categories = "slotGame";
                        break;
                    case "luckylotteryGame":
                        gameId = "luckylotteryGame";
                        categories = "lotteryGame";
                        break;
                    case "MG":
                        gameId = "mg";
                        categories = "liveGame,slotGame";
                        break;
                    case "sportGame":
                        gameId = "sportGame_gt";
                        categories = "sportGame";
                        break;
                    case "OGGame":
                        gameId = "oggame";
                        categories = "liveGame";
                        break;
                    case "DZGame":
                        gameId = "dzgame";
                        categories = "liveGame";
                        break;
                    case "AGCasino":
                        gameId = "agcasino";
                        categories = "liveGame,lotteryGame";
                        break;
                    case "AllBet":
                        gameId = "allbet";
                        categories = "liveGame";
                        break;
                    case "BsgGame":
                        gameId = "bsggame";
                        categories = "slotGame";
                        break;
                    case "MGCasino":
                        gameId = "livegame_mgcasino";
                        categories = "liveGame,slotGame";
                        break;
                    case "PTCasino":
                        gameId = "ptcasino";
                        categories = "liveGame,slotGame";
                        break;
                    case "MegawinCasino":
                        gameId = "megawincasino";
                        categories = "slotGame";
                        break;
                    case "SuperCasino":
                        gameId = "supercasino";
                        categories = "sportGame";
                        break;
                }
                return { "gameId": gameId, "categories": categories };
            };
            /**
             * 获取推荐人Id
             * @returns {string|string|null}
             */
            App.getExtendId = function () {
                var id = Com_Gametree_Cashap_Module.Util.cookie("Extend");
                id = id !== undefined && id !== null && id !== "" ? id : "";
                id = id.replace(/"/g, "");
                return id;
            };
            /**
             * 保存推荐人Id
             */
            App.setExtendId = function () {
                var id = Com_Gametree_Cashap_Module.Util.getParam("Extend");
                if (id !== undefined && id !== "") {
                    Com_Gametree_Cashap_Module.Util.cookie("Extend", id, { path: '/' });
                }
            };
            /**
             * 点击返回PC版按钮处理
             */
            App.toPCVertion = function (url, newWin) {
                if (!Com_Gametree_Cashap_Module.Util.cookie("allowpc")) {
                    Com_Gametree_Cashap_Module.Util.cookie("allowpc", "true", { path: '/' });
                }
                if (url) {
                    if (newWin) {
                        window.open(url);
                    }
                    else {
                        window.location.href = url;
                    }
                    return false;
                }
                return true;
            };
            App.setCSHtml = function () {
                //客服链接生成
                var data = this.cs_data_filter(this.fix_cs_data(window["cs_data"] || []));
                if (data != undefined) {
                    if (data.length > 0 && $("#CSLink").length > 0) {
                        var targetContainer = $("#CSLink"), tpl = targetContainer.html(), html = "";
                        if (data.length == 1) {
                            html += tpl.replace("{{url}}", data[0].Url).replace("{{name}}", data[0].Name != "" ? data[0].Name : "在线客服");
                        }
                        else {
                            for (var i = 0, l = data.length; i < l; i++) {
                                html += tpl.replace("{{url}}", data[i].Url).replace("{{name}}", data[i].Name != "" ? data[i].Name : "在线客服 " + (i + 1));
                            }
                        }
                        if (targetContainer.attr("data-row-amount")) {
                            if (data.length <= parseInt(targetContainer.attr("data-row-amount"))) {
                                targetContainer.addClass("text-center");
                            }
                            else {
                                targetContainer.addClass("text-left");
                            }
                        }
                        targetContainer.html(html);
                    }
                }
            };
            /**
             * 页面调用打开指定客服链接
             * 排除非手机版客服链接，idx从0开始计算
             */
            App.openCustomer = function (idx) {
                var data = this.fix_cs_data(window["cs_data"]);
                if (data != undefined) {
                    if (idx >= 0 && idx < data.length) {
                        //打开对应链接
                        window.open(data[idx].Url);
                    }
                    else {
                        // alert("指定客服链接序列不存在！");
                        Com_Gametree_Cashap_Module.Tips.systemTip("指定客服链接序列不存在！");
                        return;
                    }
                }
            };
            /**
             * 补齐cs_data字段
             * @param data
             * @returns {any}
             */
            App.fix_cs_data = function (data) {
                data.forEach(function (item, idx) {
                    if (!item.hasOwnProperty("Name")) {
                        item["Name"] = "";
                    }
                    if (!item.hasOwnProperty("Platform")) {
                        item["Platform"] = "ALL";
                    }
                });
                Com_Gametree_Cashap_Module.Log.log("after fix. cs_data = ", data);
                return data;
            };
            /**
             * 过滤cs_data
             * @param data
             */
            App.cs_data_filter = function (data) {
                return data.filter(function (c_value, index, arr) {
                    return c_value.Platform.toLowerCase() == "ALL".toLowerCase() || c_value.Platform.toLowerCase() == "MOBILE".toLowerCase();
                });
            };
            /**
             * 处理绑定项访问权限
             */
            App.initHandleMemberRuleTest = function (memberLevel) {
                var _this = this;
                Com_Gametree_Cashap_Module.Log.log("initHandleMemberRuleTest. ", memberLevel);
                //使用tap触发
                $("[data-member-rule]").each(function (idx, el) {
                    var r_product = $(el).attr("data-member-rule");
                    if (!_this.accessCheck(r_product, memberLevel, false)) {
                        $(el).attr("onclick", "return false;");
                    }
                });
                $('[data-member-rule]').on("tap", function (e) {
                    var r_product = $(e.currentTarget).attr("data-member-rule");
                    _this.accessCheck(r_product, memberLevel);
                });
                //使用click触发
                // FastClick.attach($("[data-member-rule]")[0]);//此处需注意，$("[data-member-rule]")[0]是指一批又该属性的dom还是指拥有该属性的dom中的第一个
                // $('[data-member-rule]').on("click", (e: Event)=>{
                //     var ruleVal = $(e.currentTarget).attr("data-member-rule");
                //
                //     !this.accessCheck(ruleVal, memberLevel) ? e.preventDefault() : "";
                // });
            };
            App.accessCheck = function (itemValue, memberLevel, rejectToShowTips) {
                if (rejectToShowTips === void 0) { rejectToShowTips = true; }
                var memberRules = Com_Gametree_Cashap.SiteConfig.memberRule, curMemberRule = "";
                //查找当前项在config中的规则
                for (var key in memberRules) {
                    if (key.toLowerCase() == itemValue.toLowerCase()) {
                        curMemberRule = memberRules[key];
                        break;
                    }
                }
                var result = this.isAllowVisit(curMemberRule, memberLevel);
                if (!result && rejectToShowTips) {
                    //禁止访问并且允许被禁止访问时显示提示信息
                    if (memberLevel && memberLevel != -1) {
                        //已经登录
                        if (curMemberRule == Com_Gametree_Cashap_Module.MemberRule.onlymember) {
                            Com_Gametree_Cashap_Module.Tips.systemTip(Com_Gametree_Cashap.Language.getMessage_Translate("", "onlyMember"), false);
                            // Com_Gametree_Cashap_Module.ConfirmDialog.show({
                            //    labelRightBtn: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("ConfirmDialog", "labelLoginNow"),
                            //    callbackRightBtn: this.goToLoginPage.bind(this),
                            //    message: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMember")
                            // });
                        }
                    }
                    else {
                        //未登录处理
                        var labelLoginNow = Com_Gametree_Cashap.Language.getMessage_Translate("ConfirmDialog", "labelLoginNow"), labelLogin = Com_Gametree_Cashap.Language.getMessage_Translate("ConfirmDialog", "labelLogin"), labelTrial = Com_Gametree_Cashap.Language.getMessage_Translate("ConfirmDialog", "labelTrial"), message = Com_Gametree_Cashap.Language.getMessage_Translate("", "noLogin");
                        if (curMemberRule == Com_Gametree_Cashap_Module.MemberRule.onlymember) {
                            Com_Gametree_Cashap_Module.ConfirmDialog.show({
                                labelRightBtn: labelLoginNow,
                                callbackRightBtn: this.goToLoginPage.bind(this),
                                message: message
                            });
                        }
                        else if (curMemberRule == Com_Gametree_Cashap_Module.MemberRule.onlylogin) {
                            Com_Gametree_Cashap_Module.ConfirmDialog.show({
                                labelLeftBtn: labelTrial,
                                labelRightBtn: labelLogin,
                                callbackLeftBtn: this.trialLogin.bind(this),
                                callbackRightBtn: this.goToLoginPage.bind(this),
                                message: message
                            });
                        }
                    }
                }
                return result;
            };
            //memberLevel为-1时，代表会员未登录
            App.isAllowVisit = function (memberRule, memberLevel) {
                var result = true;
                //memberRule=unlimit/onlylogin/onlymember
                //当前需要判断的访问规则不为空并且不为“无限制”
                if (memberRule != "" && memberRule != Com_Gametree_Cashap_Module.MemberRule.unlimit) {
                    result = false;
                    //以下判断内容是在会员已登录的基础上，若会员未登录则可判定无权访问
                    if (memberLevel && memberLevel != -1) {
                        if (memberRule == Com_Gametree_Cashap_Module.MemberRule.onlylogin) {
                            result = true;
                        }
                        else {
                            if (memberLevel == Com_Gametree_Cashap_Module.MemberLevel.member) {
                                result = true;
                            }
                        }
                    }
                }
                return result;
            };
            /**
             * 处理返回按钮
             * 对应项：dom中有属性data-cashap-id="backward"的项
             */
            App.handleBackward = function () {
                var _this = this;
                if ($("[data-cashap-id=backward]").length > 0) {
                    $("[data-cashap-id=backward]").on("click", function () {
                        _this.backWard();
                    });
                }
            };
            /**
             * 转到登录
             */
            App.goToLoginPage = function () {
                Com_Gametree_Cashap_Module.Util.removeCookie(this.openLoginPage, { path: '/' });
                if ($('[data-cashap-id="loginBtn"]').length > 0) {
                    $('[data-cashap-id="loginBtn"]').trigger("click");
                }
                else {
                    window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
                }
            };
            App.isToLoginPage = function (val) {
                Com_Gametree_Cashap_Module.Util.cookie(this.openLoginPage, val, { path: '/' });
            };
            /**
             * 试玩登录
             */
            App.trialLogin = function () {
                var _this = this;
                if ($("body").attr("logining") == "1") {
                    return;
                }
                $("body").attr("logining", "1");
                //显示系统loading
                Com_Gametree_Cashap_Module.Tips.showSystemLoading();
                //Api试玩登录完后重刷页面。每个产品入口需要重新检查是否需要判断会员身份
                Api.account.register_trial({})
                    .done(function (result) {
                    $("body").attr("logining", "0");
                    if (result.errorInfo.length > 0) {
                        _this.handleTrialLoginError(result.errorInfo[0]);
                    }
                    else if (!result.result) {
                        _this.handleTrialLoginError({ errorCode: "2002003" });
                    }
                    else {
                        Com_Gametree_Cashap_Module.Util.removeCookie(_this.config.firstSubmitCookie, { path: '/' });
                        _this.memberSignUpSuccess();
                        Api.account.profile_baseInfo()
                            .done(function (baseInfo) {
                            //隐藏系统loading
                            Com_Gametree_Cashap_Module.Tips.hideSystemLoading();
                            //设置会员信息
                            // $('[data-cashap-id="before-login"]').addClass("hide");
                            // $('[data-cashap-id="after-login"]').removeClass("hide");
                            // alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("MemberTrial_Form", "register_success"));
                            Com_Gametree_Cashap_Module.ConfirmDialog.show({
                                leftbtnShow: true,
                                rightbtnShow: false,
                                labelLeftBtn: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                                callbackLeftBtn: function () {
                                    window.location.reload();
                                },
                                message: Com_Gametree_Cashap.Language.getMessage_Translate("MemberTrial_Form", "register_success")
                            });
                            // window.location.reload();
                        });
                    }
                });
            };
            App.handleTrialLoginError = function (result) {
                //隐藏系统loading
                Com_Gametree_Cashap_Module.Tips.hideSystemLoading();
                Com_Gametree_Cashap_Module.Tips.systemTip(Com_Gametree_Cashap.Language.getMessage_Translate("MemberTrial_Form", result.errorCode));
            };
            App.toHomePage = function () {
                window.location.href = Com_Gametree_Cashap.SiteConfig.HomePageUrl;
                return false;
            };
            App.afterInit = function () {
                this["S" + "inUp" + "K" + "ey" + "P" + "ar" + "t"] = new Date().getDate() + this["S" + "inUp" + "K" + "ey" + "P" + "ar" + "t"];
            };
            /**
             * 处理site_message弹出
             */
            App.handleSiteMessagePop = function () {
                var _this = this;
                //判断当前页面Meta标签标记不允许显示公告内容，不显示弹出公告
                if ($('meta[name=cashapp-config]').length > 0) {
                    var cashapp_config = $('meta[name=cashapp-config]').attr('content');
                    if (cashapp_config.indexOf("sitemessage-disable=true") > -1) {
                        return;
                    }
                }
                Api.message.site_message(true)
                    .done(function (result) {
                    if (result.result && result.siteMessage) {
                        var isReadProperty = [], showContent = [];
                        // if(window.sessionStorage){
                        //    isReadProperty = JSON.parse(sessionStorage.getItem(isReadId)) || [];
                        // }
                        // else {
                        //    isReadProperty = JSON.parse(Com_Gametree_Cashap_Module.Util.cookie(isReadId)) || [];
                        // }
                        isReadProperty = storage.getStorageValue(storage.storageID.IsReadProperty, "", false) || [];
                        result.siteMessage.forEach(function (item, idx) {
                            //未登录且showTag=false时，不显示当前项。showTag不存在，默认显示
                            if (!_this.isLogin() && item.hasOwnProperty("showTag") && !item.showTag) {
                                return;
                            }
                            //isDisplay存在且为false时，不显示当前项
                            if (item.hasOwnProperty("isDisplay") && !item.isDisplay) {
                                return;
                            }
                            //遍历匹配出弹出窗口方式公告，然后显示 showType==2(弹窗内容)  showType==4(跑马灯和弹窗内容二合一)
                            if ((item.showType == 2 || item.showType == 4) && $.inArray(item.id, isReadProperty) == -1) {
                                //判断是否只是首页显示公告
                                if (_this.showMessageAtDefaultPage == true &&
                                    (window.location.pathname.toLowerCase() != "/" && window.location.pathname.toLowerCase() != "/default.html")) {
                                    return;
                                }
                                showContent.push(item.content);
                                isReadProperty.push(item.id);
                                // if(window.sessionStorage){
                                // 	sessionStorage.setItem(isReadId, JSON.stringify(isReadProperty));
                                // }
                                // else {
                                //     Com_Gametree_Cashap_Module.Util.cookie(isReadId, isReadProperty, {path: "/"});
                                // }
                                storage.setStorageValue(storage.storageID.IsReadProperty, "", isReadProperty, { TTL: storage.siteMessageReadedExpiredTime }, false);
                            }
                        });
                        //显示收集到的站点消息
                        _this.showPopMessageOneByOne(showContent, 0);
                    }
                });
            };
            /**
             * 显示站点消息，若有多条，则依次显示
             * @param contents
             * @param idx
             */
            App.showPopMessageOneByOne = function (contents, idx) {
                var _this = this;
                if (contents.length == 0) {
                    return;
                }
                //为 true 时，该函数自身处理逐条显示
                // false时，需与Global/source/modules/InfoTip.ts 中_showOneByOne属性配合处理逐条显示
                if (true) {
                    var o = {
                        tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SiteNotice"),
                        tipsContentTxt: contents[idx],
                        contentDirection: "left",
                        // leftbtnShow: false,
                        rightbtnShow: true,
                        // leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
                        rightbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                        // leftbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); },
                        rightbtnfunction: function () {
                            if (idx >= contents.length - 1) {
                                Com_Gametree_Cashap_Module.Tips1.hide();
                            }
                            else {
                                _this.showPopMessageOneByOne(contents, ++idx);
                            }
                        }
                    };
                    Com_Gametree_Cashap_Module.Tips1.show(o);
                }
                else {
                    contents.forEach(function (item, idx) {
                        var o = {
                            tipsTit: Com_Gametree_Cashap.Language.getMessage_Translate("", "SiteNotice"),
                            tipsContentTxt: item,
                            contentDirection: "left",
                            // leftbtnShow: false,
                            rightbtnShow: true,
                            // leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
                            rightbtnTxt: Com_Gametree_Cashap.Language.getMessage_Translate("", "OK"),
                            // leftbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); },
                            rightbtnfunction: function () {
                                Com_Gametree_Cashap_Module.Tips1.hide();
                                return;
                                if (idx >= contents.length - 1) {
                                    Com_Gametree_Cashap_Module.Tips1.hide();
                                }
                                else {
                                    _this.showPopMessageOneByOne(contents, ++idx);
                                }
                            }
                        };
                        Com_Gametree_Cashap_Module.Tips1.show(o);
                    });
                }
            };
            /**
             * 判断是否使用App打开
             */
            App.isApp = function () {
                return window.navigator.userAgent.indexOf("GTMobileApp") > -1;
                // return true;
            };
            /**
             * 获取自动登入Token
             */
            App.getToken = function () {
                return localStorage.getItem("autotoken");
            };
            /**
             * 设置自动登入Token
             * @param {string} token
             */
            App.setToken = function (token) {
                localStorage.setItem("autotoken", token || "");
                // if(token && token != "") {
                //    localStorage.setItem("autotoken", token);
                // }
                // else {
                // 	localStorage.removeItem("autotoken");
                // }
            };
            App.removeToken = function () {
                this.setToken();
            };
            App.config = {
                "goToUrl": storage.storageID.GoToUrl,
                "firstSubmitCookie": storage.storageID.FirstSubmitCookie //首次提交表单Cookie标记
            };
            App.settingBtn = "[data-cashap-id=btn-setting]";
            App.logoutBtnSeletor = "[data-cashap-id=logoutBtn]";
            App.logoutBtnTxt = "[data-cashap-id=logoutBtnText]";
            App.logouting = false;
            App.SinUpKeyPart = "9f7c780b5082ab4ad5e5104e77749882"; //Com_Gametree_Cashap.SiteConfig.signupKeyPart;
            App.openLoginPage = "openLoginPage";
            App.showMessageAtDefaultPage = false;
            App.keepAliveTime = 1000 * 60 * 5;
            App.leftFullscreen = '[data-cashap-id="leftFullscreen"]';
            return App;
        }());
        Com_Gametree_Cashap_Module.App = App;
        var Log = /** @class */ (function () {
            function Log() {
            }
            Log.log = function () {
                var arg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arg[_i] = arguments[_i];
                }
                if (this.debugLog)
                    console.log.apply(console, arguments);
            };
            /**
             * 调试日志模式
             * 永远设置为false，本地预览时，由预览配置设置为true
             * @type {boolean}
             */
            Log.debugLog = true;
            return Log;
        }());
        Com_Gametree_Cashap_Module.Log = Log;
        /**
         * 全局遮罩，用于阻挡tap穿透引发的click
         */
        var GlobalLayer = /** @class */ (function () {
            function GlobalLayer() {
            }
            GlobalLayer.show = function () {
                //若当前页面不存在该元素，则添加
                if ($(this.tmplSelector).length == 0) {
                    $(this.tmpl).appendTo("body");
                }
                $(this.tmplSelector).removeClass("hide");
                //监听事件
                // $(this.tmplSelector).one("click", ()=>{
                //     this.hide();
                // });
            };
            GlobalLayer.hide = function () {
                $(this.tmplSelector).addClass("hide");
            };
            GlobalLayer.hideDelayTime = 350;
            GlobalLayer.tmplSelector = '[data-cashap-id="global-layer"]';
            GlobalLayer.tmpl = '<div class="global-layer hide" data-cashap-id="global-layer"><\/div>';
            return GlobalLayer;
        }());
        Com_Gametree_Cashap_Module.GlobalLayer = GlobalLayer;
        /**
         * 操作localStorage里的值
         */
        var LocalStorage = /** @class */ (function () {
            function LocalStorage() {
            }
            LocalStorage.getLocalStorage = function (keyName) {
                var itemData = JSON.parse(localStorage.getItem(keyName));
                if (itemData === null)
                    itemData = [];
                return itemData;
            };
            LocalStorage.setLocalStorage = function (keyName, value) {
                localStorage.setItem(keyName, JSON.stringify(value));
            };
            LocalStorage.setHistoryList = function (historyList, historyIndex, gameData) {
                if (historyIndex < 0) {
                    if (historyList.length >= 10) {
                        historyList.pop();
                        historyList.unshift(gameData);
                    }
                    else {
                        historyList.unshift(gameData);
                    }
                }
                else {
                    historyList.splice(historyIndex, 1);
                    historyList.unshift(gameData);
                }
                return historyList;
            };
            LocalStorage.setFavoriteList = function (FavoriteList, FavoriteIndex, gameData) {
                if (FavoriteIndex < 0) {
                    if (FavoriteList.length >= 10) {
                        FavoriteList.pop();
                        FavoriteList.unshift(gameData);
                    }
                    else {
                        FavoriteList.unshift(gameData);
                    }
                }
                return FavoriteList;
            };
            return LocalStorage;
        }());
        Com_Gametree_Cashap_Module.LocalStorage = LocalStorage;
        Com_Gametree_Cashap_Module.Tips = tips;
        Com_Gametree_Cashap_Module.Tips1 = new newTips();
        Com_Gametree_Cashap_Module.ConfirmDialog = confirmDialog;
        Com_Gametree_Cashap_Module.Util = util;
        Com_Gametree_Cashap_Module.MemberLevel = {
            "member": 1,
            "trial": 2,
            "debug": 3
        };
        /**
         * 钱包类型
         * 1=多钱包
         * 2=单一钱包
         */
        Com_Gametree_Cashap_Module.WalletType = {
            "MultiWallet": 1,
            "SingleWallet": 2
        };
        /**
         * 钱包模式
         * 1=多钱包模式
         * 2=单一钱包模式
         * 3=切换模式（多钱包和单一切换）
         */
        Com_Gametree_Cashap_Module.WalletMode = {
            "MultiWallet": 1,
            "SingleWallet": 2,
            "SwitchWallet": 3
        };
        Com_Gametree_Cashap_Module.MemberRule = {
            "unlimit": "unlimit",
            "onlylogin": "onlylogin",
            "onlymember": "onlymember"
        };
    })(Com_Gametree_Cashap_Module || (Com_Gametree_Cashap_Module = {}));
    if (typeof window["Com_Gametree_Cashap"] == "undefined") {
        window["Com_Gametree_Cashap"] = {};
    }
    window["Com_Gametree_Cashap"].Tips = Com_Gametree_Cashap_Module.Tips;
    window["Com_Gametree_Cashap"].Tips1 = Com_Gametree_Cashap_Module.Tips1;
    window["Com_Gametree_Cashap"].GlobalLayer = Com_Gametree_Cashap_Module.GlobalLayer;
    window["Com_Gametree_Cashap"].ConfirmDialog = Com_Gametree_Cashap_Module.ConfirmDialog;
    window["Com_Gametree_Cashap"].Util = Com_Gametree_Cashap_Module.Util;
    window["Com_Gametree_Cashap"].MemberLevel = Com_Gametree_Cashap_Module.MemberLevel;
    window["Com_Gametree_Cashap"].MemberRule = Com_Gametree_Cashap_Module.MemberRule;
    window["Com_Gametree_Cashap"].Log = Com_Gametree_Cashap_Module.Log;
    window["Com_Gametree_Cashap"].App = Com_Gametree_Cashap_Module.App;
    window["Com_Gametree_Cashap"].Api = Api;
    return Com_Gametree_Cashap_Module;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/modules/global.js.map