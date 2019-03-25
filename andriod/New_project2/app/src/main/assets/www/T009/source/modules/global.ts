///<reference path="../docs/global_doc.d.ts"/>
///<reference path="../../../Global/libs/require.d.ts"/>
///<reference path="../../../Global/libs/jquery.d.ts"/>
///<reference path="../../../Global/libs/zepto.d.ts"/>
///<reference path="../../../Global/libs/velocity-animate.d.ts"/>
///<reference path="../../../Global/libs/islider.d.ts"/>
///<reference path="../../../Global/libs/handlebars.d.ts"/>
///<reference path="../docs/models.d.ts"/>
///<reference path="../docs/global_doc.d.ts"/>

/// <amd-dependency path="../../../Global/libs/velocity" />

import Api = require("../../../Global/source/modules/api");
import storage = require("../../../Global/libs/storage");
import tips = require("../../../Global/source/modules/Tips");
import confirmDialog = require("../../../Global/source/modules/ConfirmDialog");
import newTips = require("../../../Global/source/modules/InfoTip");
import Loading = require("../../../Global/source/modules/LoadingPannal");
import util = require("../../../Global/source/modules/Util");
//import FastClick = require("fastclick");

module Com_Gametree_Cashap_Module{
	export class App{
		static config = {
			"goToUrl":storage.storageID.GoToUrl,//登录后跳转页面Url
			"firstSubmitCookie":storage.storageID.FirstSubmitCookie//首次提交表单Cookie标记
		}
		static settingBtn = "[data-cashap-id=btn-setting]";
		static logoutBtnSeletor = "[data-cashap-id=logoutBtn]";
		static logoutBtnTxt = "[data-cashap-id=logoutBtnText]";
		static logouting = false;

		static SinUpKeyPart = "9f7c780b5082ab4ad5e5104e77749882";//Com_Gametree_Cashap.SiteConfig.signupKeyPart;

		static openLoginPage = "openLoginPage";

		static showMessageAtDefaultPage = false;

        static keepAliveTime = 1000 * 60 * 5;

		static leftFullscreen = '[data-cashap-id="leftFullscreen"]';

		static init(){
			this.isMobile();
			this.userOrientation();
			
			window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.userOrientation, false);
			$(window).resize(()=> this.isMobile);
			//临时重写该方法，后续需要将引用该方法的地方修改成调用新方法
            Com_Gametree_Cashap_Module.Tips.systemTip = (mess: string, autoHide = true)=>{
                Com_Gametree_Cashap_Module.Tips1.show({
                    tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                    tipsContentTxt: mess,
                    leftbtnShow: true,
                    leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Close"),
                    leftbtnfunction: ()=>{
                        Com_Gametree_Cashap_Module.Tips1.hide();
                    }
                });
			};

            var loading = new Loading();
            Com_Gametree_Cashap_Module.Tips.showSystemLoading = ()=>{
                loading.show();
			};
            Com_Gametree_Cashap_Module.Tips.hideSystemLoading = ()=>{
                loading.hide();
			};

            Com_Gametree_Cashap_Module.ConfirmDialog.show = (option)=>{
            	var o = {
                    tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                    tipsContentTxt: option.message,
					leftbtnShow: true,
					rightbtnShow: true,
					leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
					rightbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                    leftbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); },
                    rightbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); }
				};

            	if(option.hasOwnProperty("labelLeftBtn")){
            		o.leftbtnTxt = option.labelLeftBtn;
				}

                if(option.hasOwnProperty("labelRightBtn")){
                    o.rightbtnTxt = option.labelRightBtn;
                }

                if(option.hasOwnProperty("callbackLeftBtn")){
                    o.leftbtnfunction = ()=>{
                        option.callbackLeftBtn();
                        Com_Gametree_Cashap_Module.Tips1.hide();
					};
                }

                if(option.hasOwnProperty("callbackRightBtn")){
                    o.rightbtnfunction = ()=>{
                        option.callbackRightBtn();
                        Com_Gametree_Cashap_Module.Tips1.hide();
                    };
				}
				
				if(option.hasOwnProperty("leftbtnShow")){
            		o.leftbtnShow = option.leftbtnShow;
				}

                if(option.hasOwnProperty("rightbtnShow")){
                    o.rightbtnShow = option.rightbtnShow;
                }

                Com_Gametree_Cashap_Module.Tips1.show(o);
			};
            //方法重写---end

			Com_Gametree_Cashap_Module.Log.log("App init");

            if(window.navigator.userAgent.indexOf("GTMobileApp") == -1){
            	$('[data-cashap-id="topc"]').removeClass("hide");
			}

			var cId = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId);
			if(cId != null) {
				Api.cashAppId = cId;
			}

			if(this.isLogin()){
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
					.done((profileInfo) => {
						this.initHandleMemberRuleTest(profileInfo.memberLevel);
					});
			} else {
				this.initHandleMemberRuleTest(-1);
			}

			//判断是否打开登录界面
			if(Com_Gametree_Cashap_Module.Util.cookie(this.openLoginPage) != null) {
				this.goToLoginPage();
			}

			//监听后退按钮事件
			// this.handleBackward();

			//设置input[type=checkbox/radio]时，focus后马上失去焦点
			$("body").on("focus", 'input[type=checkbox],input[type=radio]', (e: Event)=>{
				(<HTMLInputElement>e.currentTarget).blur();
			});

			// FastClick.attach($(".home-page")[0]);
			// FastClick.attach($('[data-cashap-id="SideBarMenu"]')[0]);

			this.afterInit();

			//处理site_message弹出
			this.handleSiteMessagePop();
			if(Com_Gametree_Cashap_Module.App.isApp()){
				// 仅app 修正body的fixed导致弹出虚拟键盘以后视图错位 
				document.querySelectorAll('input').forEach(element => {
					element.addEventListener('blur', () => {
						window.scroll(0, 0);//修正body的fixed导致弹出虚拟键盘以后视图错位 
					});
				});
			}
		}

		//提示轉向
		static userOrientation() {
			setTimeout(()=>{
				var height = document.documentElement.clientHeight,
				width =  document.documentElement.clientWidth,
				tszaheight =window.screen.availHeight,
				tszawidth =window.screen.availWidth;

				if (height > width) {
					$('.straightwarn').removeClass('hide');
					$('.horizontalwarn').addClass('hide');
					$('body').addClass('portrait');
				}
				else{
					if(width > height){
						$('.horizontalwarn').removeClass('hide');
						$('body').removeClass('portrait');
					}
				}
				//判断android 调整左侧按钮键位置
				if(Util.getBrowserInfo().versions.android && window.navigator.userAgent.indexOf("GTMobileApp") == -1){	
					$(this.leftFullscreen).removeClass('hide');
					//非火狐以外浏览器
					if (tszaheight > tszawidth) {
						$('.straightwarn').removeClass('hide');
						$('.horizontalwarn').addClass('hide');
						$('body').addClass('portrait');
					}
					else{
						if(tszaheight < tszawidth){
							$('.horizontalwarn').removeClass('hide');
							$('body').removeClass('portrait');
						}
					}

					//判断火狐 调整左侧按钮键位置
					if(Util.getBrowserInfo().versions.gecko){
						setTimeout(function(){
							var height = document.documentElement.clientHeight,
								width =  document.documentElement.clientWidth;
							if (height > width) {
								$('.straightwarn').removeClass('hide');
								$('.horizontalwarn').addClass('hide');
								$('body').addClass('portrait');
							}
							else{
								if(height < width){	
									$('.horizontalwarn').removeClass('hide');
									$('body').removeClass('portrait');		
								}
							}
						},500);	
					}
				}
				//判断是否为 IOS以及火狐
				if(Util.getBrowserInfo().versions.ios&&Util.getBrowserInfo().versions.gecko){
					var height = window.screen.height,
						width =   window.screen.width;
						if (height > width) {
							$('.straightwarn').removeClass('hide');
							$('.horizontalwarn').addClass('hide');
							$('body').addClass('portrait');
						}
						else{
							if(height < width){
								$('.horizontalwarn').removeClass('hide');
								$('body').removeClass('portrait');
							}
						}
				}
				if(window.orientation == 0 || window.orientation == 180){
					//竖屏
					$('body').addClass('portrait');
					$('.straightwarn').removeClass('hide');
					$('.horizontalwarn').addClass('hide');
					$('input').blur();	
				}else if(window.orientation == 90 || window.orientation == -90){
					//横屏
					$('.horizontalwarn').removeClass('hide');
					$('body').removeClass('portrait');
				}
			},1000/60);

			//为APP拿掉全银幕按钮，解决app可移动，白边问题
			if(window.navigator.userAgent.indexOf("GTMobileApp") > -1){
				$(this.leftFullscreen).addClass("hide");

				const metaValue = $('meta[name=viewport]').attr('content');
				$('meta[name=viewport]').attr('content',`${metaValue},viewport-fit=cover`);
				$('html').addClass("app-html");
				$('body').addClass("app-body");
			}
		}
		static isMobile(){
			setTimeout(()=>{
				if(!(!Util.getBrowserInfo().versions.mobile || 
					Util.getBrowserInfo().versions.ios || 
					Util.getBrowserInfo().versions.android || 
					Util.getBrowserInfo().versions.iPhone || 
					Util.getBrowserInfo().versions.iPad)){
					$('body').empty().append('<div class="mobile"></div>')
				}
			},1000/60);
		}

		static isLogin():boolean {
			//判断当前keepALive最近读取时间与本地时间对比是否超过指定值，若是则返回false而不需再判断CashAppId是否存在
			var isLogin = false,
				oldTime = Com_Gametree_Cashap_Module.Util.cookie("LiveTime");

			// if(oldTime != null && new Date().valueOf() - parseInt(oldTime) < 1000 * 60 * 30 && Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId) != null){
			// 	isLogin = true;
			// }
			isLogin = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId) != null;

			return isLogin;
		}

		/**
		 * 会员登入成功
		 */
		static memberSignUpSuccess(){
			//防止覆盖
			var cId = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId);
			if(cId != null) {
				return;
			}

			//CashAppId 用于标记当前是否登录
			Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId, (new Date()).valueOf(),{path:'/'});
			// Com_Gametree_Cashap_Module.Util.cookie("LiveTime",new Date().valueOf(),{path:'/'});

			//刚登陆完毕，由于此时请求profileInfo需要CashAppId缓存数据，而当前已经过了App.init()处理时机，此处需要再次设置
			Api.cashAppId = Com_Gametree_Cashap_Module.Util.cookie(storage.storageID.CashAppId);

			//绑定登出按钮
			this.bindLogoutBtn();

			this.keepAlive();
		}

		/**
		 * 会员登出成功
         * @param {boolean} clearAutoToken  可选。global初始化时，才会传值覆盖默认值
		 */
		static memberLogOutSuccess(clearAutoToken = true){
			Com_Gametree_Cashap_Module.Util.removeCookie(storage.storageID.CashAppId, {path:'/'});
			Com_Gametree_Cashap_Module.Util.removeCookie("LiveTime", {path:'/'});

			clearInterval(parseInt($("body").attr("data-keepalive")));

            //清除自动登入Token
            if(clearAutoToken){
                Com_Gametree_Cashap_Module.App.removeToken();
            }

			//删除jstorage
			var storageKeys = storage.getAllKey();
			storageKeys.forEach((key)=>{
				//site_message不清除
				if(key == storage.storageID.SiteMessage || key == storage.storageID.site_messageTimeId || key == storage.storageID.IsReadProperty){
					return;
				}

				storage.removeStorageValueOnlyById(key);
			});
		}

		static keepAlive(){
			//会员登录状态时，定时提交保持会员在线统计
            var _showTips = false;
            var timer = setTimeout(()=>{
                Api.account.keep_alive()
                    .done((result)=>{
                        //判断会员是否需要立即登出操作
                        if(result && result.hasOwnProperty("state") && result.state == 0){
                            var _time;
                            var o = {
                                tipsTit: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                                tipsContentTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", result.statedetail),
                                contentDirection: "center",
                                // leftbtnShow: false,
                                rightbtnShow: true,
                                // leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
                                rightbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                                // leftbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); },
                                rightbtnfunction: () => {
                                    Com_Gametree_Cashap_Module.Tips1.hide();
                                    clearTimeout(_time);
                                    this.logout();
                                }
                            };

                            if(_showTips)return;
                            Com_Gametree_Cashap_Module.Tips1.show(o);
                            _showTips = true;

                            _time = setTimeout(()=>{
                                this.logout();
                            },5000);

                            return;
                        }

                        this.keepAlive();
                    });
            } , this.keepAliveTime);

            $("body").attr("data-keepalive", timer);
		}

		/**
		 * 显示登出按钮并绑定登出按钮
		 */
		static bindLogoutBtn(){
			$(this.settingBtn).removeClass('hide');
			$(this.logoutBtnSeletor).on("tap", (e: Event)=>{
				this.logout();
			});
		}

		/**
		 * 会员登出
		 */
		static logout(){
			//判断登出处理中则退出操作
			if(this.logouting){
				return;
			}

			//是否询问登出

			this.logouting = true;

			var btn = $(this.logoutBtnSeletor),
				txtEl = btn.find(this.logoutBtnTxt);
			btn.addClass("disabled");
			(<HTMLButtonElement>btn[0]).disabled = true;

			btn.attr("data-txt", txtEl.html());

			txtEl.html((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Profile_BaseInfo", "submitbtn_logout"));

            Com_Gametree_Cashap_Module.Tips.showSystemLoading();

			Api.account.logout()
				.done((json: ErrorModel)=>{
					if(json.errorInfo.length == 0){
						this.logoutSuccess();
					}
					else {
						this.logoutError(json);
					}

					this.logouting = false;

					btn.removeClass("disabled");
					(<HTMLButtonElement>btn[0]).disabled = false;

					txtEl.html(btn.attr("data-txt"));
				});
		}

		static logoutSuccess(){
			this.memberLogOutSuccess();

			window.location.href = Com_Gametree_Cashap.SiteConfig.LogoutSuccessUrl;
		}

		static logoutError(json: ErrorModel){
			var errorCode = "",
				errorText;
			if( json.errorInfo.length > 0){
				errorCode = json.errorInfo[0].errorCode;
			}

			errorText = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Profile_BaseInfo" , errorCode);
			Com_Gametree_Cashap_Module.Tips.systemTip(errorText);
		}

		/**
		 * 浏览器后退
		 */
		static backWard(){
			window.history.back();
		}

		static getGameInfo(pocketId){
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

			return {"gameId": gameId , "categories": categories};
		}

		/**
		 * 获取推荐人Id
		 * @returns {string|string|null}
		 */
		static getExtendId(){
			var id = Com_Gametree_Cashap_Module.Util.cookie("Extend");
			id = id !== undefined && id !== null && id !== "" ? id : "";

			id = id.replace(/"/g, "");

			return id;
		}

		/**
		 * 保存推荐人Id
		 */
		static setExtendId(){
			var id = Com_Gametree_Cashap_Module.Util.getParam("Extend");

			if(id !== undefined && id !== ""){
				Com_Gametree_Cashap_Module.Util.cookie("Extend" , id , {path:'/'});
			}
		}

		/**
		 * 点击返回PC版按钮处理
		 */
		static toPCVertion(url?: string, newWin?: string){
            if(!Com_Gametree_Cashap_Module.Util.cookie("allowpc")){
                Com_Gametree_Cashap_Module.Util.cookie("allowpc", "true", {path:'/'});
            }

            if(url){
                if(newWin) {
                    window.open(url);
                }
                else {
                    window.location.href = url;
                }
                return false;
            }

            return true;
		}

		static setCSHtml(){
			//客服链接生成
			var data = this.cs_data_filter(this.fix_cs_data(window["cs_data"] || []));
			if(data != undefined) {
				if(data.length > 0 && $("#CSLink").length > 0){
					var targetContainer = $("#CSLink"),
						tpl = targetContainer.html(),
						html = "";

					if(data.length == 1){
						html += tpl.replace("{{url}}", data[0].Url).replace("{{name}}", data[0].Name != "" ? data[0].Name : "在线客服");
					}
					else {
						for(var i = 0, l = data.length; i < l; i++){
							html += tpl.replace("{{url}}", data[i].Url).replace("{{name}}", data[i].Name != "" ? data[i].Name : "在线客服 " + (i + 1));
						}
					}

					if(targetContainer.attr("data-row-amount")) {
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
		}

        /**
         * 页面调用打开指定客服链接
         * 排除非手机版客服链接，idx从0开始计算
         */
        static openCustomer(idx){
            var data = this.fix_cs_data(window["cs_data"]);
            if(data != undefined) {
                if(idx >= 0 && idx < data.length){
                    //打开对应链接
                    window.open(data[idx].Url);
                }
                else {
                    // alert("指定客服链接序列不存在！");
                    Com_Gametree_Cashap_Module.Tips.systemTip("指定客服链接序列不存在！");
                    return;
                }
            }
        }

		/**
		 * 补齐cs_data字段
		 * @param data
		 * @returns {any}
		 */
		static fix_cs_data(data){
			data.forEach((item, idx)=>{
				if(!item.hasOwnProperty("Name")){
					item["Name"] = "";
				}

				if(!item.hasOwnProperty("Platform")){
					item["Platform"] = "ALL";
				}
			});

			Com_Gametree_Cashap_Module.Log.log("after fix. cs_data = ", data);

			return data;
		}

		/**
		 * 过滤cs_data
		 * @param data
		 */
		static cs_data_filter(data){
			return data.filter((c_value, index, arr)=>{
				return c_value.Platform.toLowerCase() == "ALL".toLowerCase() || c_value.Platform.toLowerCase() == "MOBILE".toLowerCase();
			});
		}

		/**
		 * 处理绑定项访问权限
		 */
		static initHandleMemberRuleTest(memberLevel){
			Com_Gametree_Cashap_Module.Log.log("initHandleMemberRuleTest. ", memberLevel);

			//使用tap触发
			$("[data-member-rule]").each((idx, el)=>{
				var r_product = $(el).attr("data-member-rule");

				if(!this.accessCheck(r_product, memberLevel, false)){
					$(el).attr("onclick", "return false;");
				}
			});

			$('[data-member-rule]').on("tap", (e: Event)=>{
				var r_product = $(e.currentTarget).attr("data-member-rule");

				this.accessCheck(r_product, memberLevel);
			});

			//使用click触发
			// FastClick.attach($("[data-member-rule]")[0]);//此处需注意，$("[data-member-rule]")[0]是指一批又该属性的dom还是指拥有该属性的dom中的第一个
			// $('[data-member-rule]').on("click", (e: Event)=>{
			//     var ruleVal = $(e.currentTarget).attr("data-member-rule");
            //
			//     !this.accessCheck(ruleVal, memberLevel) ? e.preventDefault() : "";
			// });
		}

		static accessCheck(itemValue, memberLevel, rejectToShowTips = true){
			var memberRules = Com_Gametree_Cashap.SiteConfig.memberRule,
				curMemberRule = "";

			//查找当前项在config中的规则
			for(var key in memberRules){
				if(key.toLowerCase() == itemValue.toLowerCase()){
					curMemberRule = memberRules[key];
					break;
				}
			}

			var result = this.isAllowVisit(curMemberRule, memberLevel);

			if(!result && rejectToShowTips){
				//禁止访问并且允许被禁止访问时显示提示信息
				if(memberLevel && memberLevel != -1){
					//已经登录
					if(curMemberRule == Com_Gametree_Cashap_Module.MemberRule.onlymember){
						Com_Gametree_Cashap_Module.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMember"), false);
                        // Com_Gametree_Cashap_Module.ConfirmDialog.show({
                         //    labelRightBtn: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("ConfirmDialog", "labelLoginNow"),
                         //    callbackRightBtn: this.goToLoginPage.bind(this),
                         //    message: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMember")
                        // });
					}
				}
				else {
					//未登录处理
					var labelLoginNow = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("ConfirmDialog", "labelLoginNow"),
						labelLogin = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("ConfirmDialog", "labelLogin"),
						labelTrial = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("ConfirmDialog", "labelTrial"),
						message = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin");

					if(curMemberRule == Com_Gametree_Cashap_Module.MemberRule.onlymember){
						Com_Gametree_Cashap_Module.ConfirmDialog.show({
							labelRightBtn: labelLoginNow,
							callbackRightBtn: this.goToLoginPage.bind(this),
							message: message
						});
					}
					else if(curMemberRule == Com_Gametree_Cashap_Module.MemberRule.onlylogin){
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
		}

		//memberLevel为-1时，代表会员未登录
		static isAllowVisit(memberRule, memberLevel){
			var result = true;

			//memberRule=unlimit/onlylogin/onlymember
			//当前需要判断的访问规则不为空并且不为“无限制”
			if(memberRule != "" && memberRule != Com_Gametree_Cashap_Module.MemberRule.unlimit){
				result = false;

				//以下判断内容是在会员已登录的基础上，若会员未登录则可判定无权访问
				if(memberLevel && memberLevel != -1){
					if(memberRule == Com_Gametree_Cashap_Module.MemberRule.onlylogin){
						result = true;
					}
					else {
						if(memberLevel == Com_Gametree_Cashap_Module.MemberLevel.member){
							result = true;
						}
					}
				}
			}

			return result;
		}

		/**
		 * 处理返回按钮
		 * 对应项：dom中有属性data-cashap-id="backward"的项
		 */
		static handleBackward(){
			if($("[data-cashap-id=backward]").length > 0){
				$("[data-cashap-id=backward]").on("click", ()=>{
					this.backWard();
				});
			}
		}

		/**
		 * 转到登录
		 */
		static goToLoginPage(){
            Com_Gametree_Cashap_Module.Util.removeCookie(this.openLoginPage, {path:'/'});

			if($('[data-cashap-id="loginBtn"]').length > 0) {
                $('[data-cashap-id="loginBtn"]').trigger("click");
			}
			else {
				window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
			}
		}

		static isToLoginPage(val: string){
            Com_Gametree_Cashap_Module.Util.cookie(this.openLoginPage, val,{path:'/'});
		}

		/**
		 * 试玩登录
		 */
		static trialLogin(){
			if($("body").attr("logining") == "1"){
				return;
			}

			$("body").attr("logining", "1");

			//显示系统loading
			Com_Gametree_Cashap_Module.Tips.showSystemLoading();

			//Api试玩登录完后重刷页面。每个产品入口需要重新检查是否需要判断会员身份
			Api.account.register_trial({})
				.done((result)=>{
                    $("body").attr("logining", "0");

					if(result.errorInfo.length > 0){
						this.handleTrialLoginError(result.errorInfo[0]);
					}
					else if(!result.result){
						this.handleTrialLoginError({errorCode: "2002003"});
					}
					else {
						Com_Gametree_Cashap_Module.Util.removeCookie(this.config.firstSubmitCookie, {path:'/'});
						this.memberSignUpSuccess();

						Api.account.profile_baseInfo()
							.done((baseInfo)=>{
								//隐藏系统loading
								Com_Gametree_Cashap_Module.Tips.hideSystemLoading();

								//设置会员信息
								// $('[data-cashap-id="before-login"]').addClass("hide");
								// $('[data-cashap-id="after-login"]').removeClass("hide");

								// alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("MemberTrial_Form", "register_success"));

								Com_Gametree_Cashap_Module.ConfirmDialog.show({
									leftbtnShow:true,
									rightbtnShow:false,
									labelLeftBtn: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
									callbackLeftBtn: function(){
										window.location.reload();
									},
									message: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("MemberTrial_Form", "register_success")
								});

								// window.location.reload();
							});
					}
				});
		}

		private static handleTrialLoginError(result){
			//隐藏系统loading
			Com_Gametree_Cashap_Module.Tips.hideSystemLoading();

			Com_Gametree_Cashap_Module.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("MemberTrial_Form", result.errorCode));
		}

		static toHomePage(){
			window.location.href = Com_Gametree_Cashap.SiteConfig.HomePageUrl;
			return false;
		}

		static afterInit(){
			this["S" + "inUp" + "K" + "ey" + "P" + "ar" + "t"] = new Date().getDate() + this["S" + "inUp" + "K" + "ey" + "P" + "ar" + "t"];
		}

        /**
		 * 处理site_message弹出
         */
		static handleSiteMessagePop() {
            //判断当前页面Meta标签标记不允许显示公告内容，不显示弹出公告
            if( $('meta[name=cashapp-config]').length > 0 ){
                var cashapp_config = $('meta[name=cashapp-config]').attr('content');
                if(cashapp_config.indexOf("sitemessage-disable=true")>-1){
                    return;
                }
            }

            Api.message.site_message(true)
                .done((result)=>{
                    if(result.result && result.siteMessage){
                    	var isReadProperty: any = [],
							showContent = [];

                        // if(window.sessionStorage){
                         //    isReadProperty = JSON.parse(sessionStorage.getItem(isReadId)) || [];
						// }
						// else {
                         //    isReadProperty = JSON.parse(Com_Gametree_Cashap_Module.Util.cookie(isReadId)) || [];
						// }
                        isReadProperty = storage.getStorageValue(storage.storageID.IsReadProperty, "", false) || [];

                        result.siteMessage.forEach((item, idx)=>{
                            //未登录且showTag=false时，不显示当前项。showTag不存在，默认显示
                            if(!this.isLogin() && item.hasOwnProperty("showTag") && !item.showTag){
                                return;
                            }

                            //isDisplay存在且为false时，不显示当前项
                            if(item.hasOwnProperty("isDisplay") && !item.isDisplay){
                                return;
                            }

                            //遍历匹配出弹出窗口方式公告，然后显示 showType==2(弹窗内容)  showType==4(跑马灯和弹窗内容二合一)
                            if ((item.showType == 2 || item.showType == 4) && $.inArray(item.id, isReadProperty) == -1) {
								//判断是否只是首页显示公告
                                if(this.showMessageAtDefaultPage==true &&
                                    (window.location.pathname.toLowerCase() != "/" && window.location.pathname.toLowerCase() != "/default.html") ){
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
								storage.setStorageValue(storage.storageID.IsReadProperty, "", isReadProperty, {TTL: storage.siteMessageReadedExpiredTime}, false);
							}
                        });

                        //显示收集到的站点消息
						this.showPopMessageOneByOne(showContent, 0);
                    }
                });
		}

        /**
		 * 显示站点消息，若有多条，则依次显示
         * @param contents
         * @param idx
         */
        static showPopMessageOneByOne(contents, idx){
            if(contents.length == 0){
                return;
            }

            //为 true 时，该函数自身处理逐条显示
            // false时，需与Global/source/modules/InfoTip.ts 中_showOneByOne属性配合处理逐条显示
            if(true) {
                var o = {
                    tipsTit: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SiteNotice"),
                    tipsContentTxt: contents[idx],
                    contentDirection: "left",
                    // leftbtnShow: false,
                    rightbtnShow: true,
                    // leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
                    rightbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                    // leftbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); },
                    rightbtnfunction: () => {
                        if (idx >= contents.length - 1) {
                            Com_Gametree_Cashap_Module.Tips1.hide();
                        }
                        else {
                            this.showPopMessageOneByOne(contents, ++idx);
                        }
                    }
                };

                Com_Gametree_Cashap_Module.Tips1.show(o);
            }
            else {
                contents.forEach((item, idx)=>{
                    var o = {
                        tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SiteNotice"),
                        tipsContentTxt: item,//contents[idx],
                        contentDirection: "left",
                        // leftbtnShow: false,
                        rightbtnShow: true,
                        // leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
                        rightbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                        // leftbtnfunction: ()=>{ Com_Gametree_Cashap_Module.Tips1.hide(); },
                        rightbtnfunction: ()=>{
                            Com_Gametree_Cashap_Module.Tips1.hide();
                            return;

                            if(idx >= contents.length - 1){
                                Com_Gametree_Cashap_Module.Tips1.hide();
                            }
                            else {
                                this.showPopMessageOneByOne(contents, ++idx);
                            }
                        }
                    };

                    Com_Gametree_Cashap_Module.Tips1.show(o);
                });
            }
        }

        /**
         * 判断是否使用App打开
         */
        static isApp(){
            return window.navigator.userAgent.indexOf("GTMobileApp") > -1;
            // return true;
        }

        /**
         * 获取自动登入Token
         */
        static getToken(){
            return localStorage.getItem("autotoken");
        }

        /**
         * 设置自动登入Token
         * @param {string} token
         */
        static setToken(token?:string){
            localStorage.setItem("autotoken", token || "");
            // if(token && token != "") {
            //    localStorage.setItem("autotoken", token);
            // }
            // else {
            // 	localStorage.removeItem("autotoken");
            // }
        }

        static removeToken(){
            this.setToken();
        }
	}

	export class Log{
		/**
		 * 调试日志模式
         * 永远设置为false，本地预览时，由预览配置设置为true
		 * @type {boolean}
		 */
		static debugLog = false;

		static log(...arg:any[]){
			if(this.debugLog)
				console.log.apply(console , arguments);
		}
	}

	/**
	 * 全局遮罩，用于阻挡tap穿透引发的click
	 */
	export class GlobalLayer {
		static hideDelayTime = 350;
		static tmplSelector = '[data-cashap-id="global-layer"]';
		static tmpl = '<div class="global-layer hide" data-cashap-id="global-layer"><\/div>';

		static show(){
			//若当前页面不存在该元素，则添加
			if($(this.tmplSelector).length == 0){
				$(this.tmpl).appendTo("body");
			}

			$(this.tmplSelector).removeClass("hide");

			//监听事件
			// $(this.tmplSelector).one("click", ()=>{
			//     this.hide();
			// });
		}

		static hide(){
			$(this.tmplSelector).addClass("hide");
		}
	}

	/**
	 * 操作localStorage里的值
	 */
	export class LocalStorage{
		static getLocalStorage(keyName: string){
			let itemData =  JSON.parse(localStorage.getItem(keyName));
			if( itemData === null ) itemData = [];
			return itemData;
		}

		static setLocalStorage(keyName: string, value: LocalGameData){
			localStorage.setItem(keyName, JSON.stringify(value));
		}

		static setHistoryList(historyList: string[], historyIndex: number, gameData){
			if(historyIndex < 0){
				if(historyList.length >= 10){
					historyList.pop();
					historyList.unshift(gameData);
				}else{
					historyList.unshift(gameData);
				}
			}else{
				historyList.splice(historyIndex,1);
				historyList.unshift(gameData);
			}
			return historyList;
		}
		static setFavoriteList(FavoriteList: string[], FavoriteIndex: number, gameData){
			if(FavoriteIndex < 0){
				if(FavoriteList.length >= 10){
					FavoriteList.pop();
					FavoriteList.unshift(gameData);
				}else{
					FavoriteList.unshift(gameData);
				}
			}
			return FavoriteList;
		}
	}

	export var Tips = tips;

	export var Tips1 = new newTips();

	export var ConfirmDialog = confirmDialog;

	export var Util = util;

	export var MemberLevel = {
		"member": 1,
		"trial": 2,
		"debug": 3
	};

	/**
	 * 钱包类型
	 * 1=多钱包
	 * 2=单一钱包
	 */
	export var WalletType = {
		"MultiWallet": 1,
		"SingleWallet": 2
	};

	/**
	 * 钱包模式
	 * 1=多钱包模式
	 * 2=单一钱包模式
	 * 3=切换模式（多钱包和单一切换）
	 */
	export var WalletMode = {
		"MultiWallet": 1,
		"SingleWallet": 2,
		"SwitchWallet": 3
	}

	export var MemberRule = {
		"unlimit": "unlimit",
		"onlylogin": "onlylogin",
		"onlymember": "onlymember"
	};
}

if(typeof window["Com_Gametree_Cashap"] == "undefined"){
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

export = Com_Gametree_Cashap_Module;