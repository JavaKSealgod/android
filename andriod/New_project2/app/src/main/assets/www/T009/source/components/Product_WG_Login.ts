/**
 * 产品组件--WG产品登录页
 */
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");

class Product_WG_Login{
	messageNS:string = "Product_WG_Login";

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

				if(sitemessage.wg.state) {
					//设置维护内容
					$('[data-cashap-id="maintenanceInfo"]').html(sitemessage.wg.info["zh-cn"]);

					$('[data-cashap-id="state_maintenance"]').removeClass("hide");
				}
				else {
					$('[data-cashap-id="state_open"]').removeClass("hide");

					this.init();
				}
			});
	}

	init(){
		Global.Log.log("Product_WG_Login.init");

		//判断是否未登录，若是则返回退出继续执行
		// if(!Global.App.isLogin()){
		// 	alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
		// 	window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;//登录页
		// 	return false;
		// }

		var id = Global.Util.getParam("id");

		if(typeof id == "undefined"){
			Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "id_invalid"), false);
			return;
		}

		//函数：accessCheck，无权限时默认会自行显示提示信息
		if(Global.App.isLogin()){
			Api.account.profile_baseInfo(true)
				.done((baseInfo)=>{
					if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.WG, baseInfo.memberLevel)){
						if(baseInfo.memberLevel == Global.MemberLevel.trial){
						}
						else {
							this.loadLoginInfo();
						}
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
			//此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.WG, -1);
		}

		// if(Global.App.isLogin()){
		// 	Api.account.profile_baseInfo(true)
		// 		.done((result)=>{
		// 			if(result.memberLevel == 1){
		// 				//正式会员
		// 				this.loadLoginInfo();//执行 获取产品登录信息
		// 			}
		// 			else {
		// 				Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMemberGame"), false);
		// 			}
		// 		});
		// }
		// else {
		// 	Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMemberGame"), false);
		// }
	}

	/**
	 * 获取产品登录信息
	 */
	loadLoginInfo(){
		var id = Global.Util.getParam("id");
		if(id===undefined){
            Global.Tips1.show({
                tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                tipsContentTxt: "无法传递有效参数，请重新尝试打开！",
                leftbtnShow: true,
                leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                leftbtnfunction: ()=>{
                    Global.Tips1.hide();
                }
            });
			return;
		}
		var data = {"id":id};

		Api.wg_series.login_product(data)
			.done((result)=>{
				this.loadLoginInfoCallBack(result);
			});
	}

	loadLoginInfoCallBack(result){
		if(result.errorInfo.length > 0 || !result.result){
			if(result.errorInfo[0].errorCode == "1000015"){
				var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "unknowError");
				Global.Tips.systemTip(text, false);
				return;
			}

			if(result.errorInfo[0].errorCode == "1000026"){
				var productName =  (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Model.Game_ID" , "WG");
				var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "product_maintenance");
				text = text.replace("{0}" , productName);
				Global.Tips.systemTip(text, false);
				return;
			}

			if(result.errorInfo[0].errorCode != ""){
				Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", result.errorInfo[0]["errorCode"]));
				return;
			}
		}

		Global.Log.log("url = %s" , result.url);

		window.location.replace(result.url);
	}
}

export = Product_WG_Login;