/**
 * 产品组件--GT体育竞猜 H5
 */
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");

class Product_SportGame_GT_H5 {
	constructor(){
		this.toLoadSiteMessage();
		//this.init();
	}

	toLoadSiteMessage() {
		Global.Log.log("toLoadSiteMessage");

		//显示系统loading
		Global.Tips.showSystemLoading();

		Api.message.site_message()
			.done((sitemessage)=>{
				//隐藏系统loading，无论显示哪种状态，都需要隐藏系统loading
				Global.Tips.hideSystemLoading();

				if(sitemessage.sportGame_gt.state) {
					//设置维护内容
					$('[data-cashap-id="maintenanceInfo"]').html(sitemessage.sportGame_gt.info["zh-cn"]);

					$('[data-cashap-id="state_maintenance"]').removeClass("hide");
				}
				else {
					$('[data-cashap-id="state_open"]').removeClass("hide");

					this.init();
				}
			});
	}

	init() {
		Global.Log.log("Product_SportGame_GT_H5.init");

		//函数：accessCheck，无权限时默认会自行显示提示信息
		if(Global.App.isLogin()){
			Api.account.profile_baseInfo(true)
				.done((baseInfo)=>{
					if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.sport_bigBall, baseInfo.memberLevel)){
						this.loadLoginInfo();
						// if(baseInfo.memberLevel == Global.MemberLevel.trial){
						// 	this.loadLoginInfo();
						// }
						// else {
						// 	this.loadLoginInfo();
						// }
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
			//此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.sport_bigBall, -1);
		}

		// if(!Global.App.isLogin()){
		// 	alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
		// 	window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;//登录页
		// 	return false;
		// }
		//
		// this.loadLoginInfo();
	}

	/**
	 * 获取产品登录信息
	 */
	loadLoginInfo(){
		Api.account.logininfo_sportgame_gt({"html5": true})
			.done((result)=>{
				if(result.errorInfo.length > 0 || !result.result){
					if(result.errorInfo[0].errorCode == "1000020"){
						var productName =  (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Model.Game_ID" , "sportGame");
						var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "product_maintenance");
						text = text.replace("{0}" , productName);
						Global.Tips.systemTip(text, false);
						return;
					}

					if(result.errorInfo[0].errorCode == "" && result.errorInfo[0]["errorDetail"] != ""){
						Global.Tips.systemTip(result.errorInfo[0]["errorDetail"], false);
						return;
					}

					Global.Tips.systemTip(Com_Gametree_Cashap.Language["unknowError"], false);
					return;
				}

				var url = result.url,
					homePageUrl = window.location.protocol + "//" + window.location.host + window.location.pathname.replace(/(\/*.*\/)[^\.]*\.html/i, "$1") + Com_Gametree_Cashap.SiteConfig.HomePageUrl;

				if(url.indexOf("?") > -1) {
					url += "&backurl=" + encodeURIComponent(homePageUrl);
				}
				else {
					url += "?backurl=" + encodeURIComponent(homePageUrl);
				}

				window.location.replace(url);
			})
			.fail(()=>{
                Global.Tips1.show({
                    tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                    tipsContentTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "ajax_timeout"),
                    leftbtnShow: true,
                    leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                    leftbtnfunction: ()=>{
                        Global.Tips1.hide();
                    }
                });
			});
	}
}

export = Product_SportGame_GT_H5;