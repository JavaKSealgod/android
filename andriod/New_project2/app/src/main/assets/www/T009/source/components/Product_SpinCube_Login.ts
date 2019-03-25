/**
 * 产品组件--SpinCube 电子
 */

import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");

class Product_SpinCube_Login {
	//是否直接进入体育页面
	// toSport = false;

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

				if(sitemessage.spincube.state) {
					//设置维护内容
					$('[data-cashap-id="maintenanceInfo"]').html(sitemessage.spincube.info["zh-cn"]);

					$('[data-cashap-id="state_maintenance"]').removeClass("hide");
				}
				else {
					$('[data-cashap-id="state_open"]').removeClass("hide");

					this.init();
				}
			});
	}

	init(){
		Global.Log.log("Product_SpinCube_Login.init");

		//函数：accessCheck，无权限时默认会自行显示提示信息
		if(Global.App.isLogin()){
			Api.account.profile_baseInfo(true)
				.done((baseInfo)=>{
					if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.SpinCube, baseInfo.memberLevel)){
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
			Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.SpinCube, -1);
		}

		//判断是否未登录，若是则返回退出继续执行
		// if(!Global.App.isLogin()){
		// 	alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
		// 	window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;//登录页
		// 	return false;
		// }
		//
		// this.loadLoginInfo();
	}

	loadLoginInfo(){
		// var param = Global.Util.getParam("type");
        //
		// if(param && param.toLowerCase() == "sport"){
		// 	this.toSport = true;
		// }

        //SPS老虎机，SVS虚拟体育,SMF捕鱼
        var gameid = Global.Util.getParam("gameid") || "";
        var lobby = Global.Util.getParam("lobby") || "";
        var data = {"gameid" : gameid , "lobby": lobby}

		Api.spincube.login_product(data)
			.done((result)=>{
				this.loadLoginInfo_callBack(result);
			});
	}

	loadLoginInfo_callBack(result){
		if(result.errorInfo.length > 0 || !result.result){
			if(result.errorInfo[0].errorCode == "1000015"){
				var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "unknowError");
				Global.Tips.systemTip(text, false);
				return;
			}

			if(result.errorInfo[0].errorCode == "1000052"){
				var productName =  (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Model.Game_ID" , "SpinCube");
				var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "product_maintenance");
				text = text.replace("{0}" , productName);
				Global.Tips.systemTip(text, false);
				return;
			}

			if (result.errorInfo[0].errorCode != "") {
				Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", result.errorInfo[0]["errorCode"]), false);
				return;
			}

			if(result.errorInfo[0].errorCode == "" && result.errorInfo[0]["errorDetail"] != ""){
				Global.Tips.systemTip(result.errorInfo[0]["errorDetail"], false);
				return;
			}

			Global.Tips.systemTip(Com_Gametree_Cashap.Language["unknowError"], false);
			return;
		}

		Global.Log.log("url = %s" , result.url);

		// var par = result.url.split("?")[1].split("&");
        //
		// if(this.toSport) {
         //    for (var i = 0, l = par.length; i < l; i++) {
         //        if (par[i].split("=")[0].toLowerCase() == "type") {
         //            if (par[i].split("=")[1] == "") {
         //                par[i] += "SVS"
         //            }
         //        }
         //    }
        // }
        //
		// result.url = result.url.split("?")[0] + "?" + par.join("&");

		Global.Log.log("final url = %s", result.url);

		window.location.replace(result.url);

		//window.open(result.url);
	}
}

export = Product_SpinCube_Login;