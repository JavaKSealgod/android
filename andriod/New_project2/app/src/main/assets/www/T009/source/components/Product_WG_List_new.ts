/**
 * 产品组件--WG产品列表
 */
/// <amd-dependency path="Global/libs/zepto.picLazyLoad" />
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

// import BackToTop = require("../../../Global/source/widgets/BackToTop");

class Product_WG_List{
	page: string;

	//当前Login跳转URL，由外部传入
	loginUrl = "";

	messageNS:string = "";

	gameList = [];

	scrollContainer = '[data-cashap-id="scrollContainer"]';
	gameListContainer = '[data-cashap-id="gameListContainer"]';
	gameItemContainer = '[data-cashap-id="gameItem"]';
	gameItemTpl = '[data-cashap-id="gameItemTpl"]';

	lazyloadItem = '[data-cashap-id="lazyload"]';

	profileInfo: IProfile_BaseInfo = null;

	constructor(compOption){
		this.page = '[data-cashap-id="' + compOption.page + '"]';
		this.loginUrl = compOption.loginUrl;

		this.toLoadSiteMessage();

		//this.init();
	}

	toLoadSiteMessage() {
		Global.Log.log("toLoadSiteMessage");

		//显示系统loading
		Global.Tips.showSystemLoading();

		Api.message.site_message(true)
			.done((sitemessage)=>{
				if(sitemessage.wg.state) {
					//设置维护内容
					$('[data-cashap-id="maintenanceInfo"]').html(sitemessage.wg.info["zh-cn"]);

					$('[data-cashap-id="state_maintenance"]').removeClass("hide");

					//隐藏系统loading
					Global.Tips.hideSystemLoading();
				}
				else {
					$('[data-cashap-id="state_open"]').removeClass("hide");

					this.init();
				}
			});
	}

	init(){
		//显示系统loading
		Global.Tips.showSystemLoading();

		this.loadProductList();

		//若当前已经登录，则提前获取会员基本信息
		if(Global.App.isLogin()){
			Api.account.profile_baseInfo(true)
				.done((info)=>{
					this.profileInfo = info;
				});
		}

		$(this.page).delegate(this.gameItemContainer, "tap", (e: Event)=>{
			e.preventDefault();

			var target = e.target || e.srcElement,
				idx = $(target).attr("data-index") || $(target).parents(this.gameItemContainer).attr("data-index");

			this.openProductUrl(this.gameList[idx]);
		});

		//顶层数据 回到顶部
		// new BackToTop({
		// 	toTopDomParentContainer: $(this.page),
		// 	scrollContainer: $(this.scrollContainer)
		// });

		Global.Log.log("Product_WG_List.init");
	}

	/**
	 * 加载数据
	 */
	loadProductList(){
		Api.wg_series.product_list_new()
			.done((list)=>{
				//隐藏系统loading
				Global.Tips.hideSystemLoading();
				this.toLoadCallback(list);
			});
	}

	/**
	 * 加载数据,Ajax回调
	 * @param result
	 */
	toLoadCallback(result){
		if(result.errorInfo.length > 0){
			if(result.errorInfo[0].errorCode == "1000026"){
				var productName =  (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Model.Game_ID" , "WG");
				var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "product_maintenance");
				text = text.replace("{0}" , productName);
				Global.Tips.systemTip(text);
				return;
			}

			var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , result.errorInfo[0].errorCode);
			Global.Tips.systemTip(text);
		}
		else {
			//挑出game再合并
			result.data.map(element => element.game).forEach(element => this.gameList.push(...element));
			//依照sort 排序
			this.gameList.forEach(element => parseInt(element.Sort))
			this.gameList = this.gameList.sort((a,b) => a.Sort - b.Sort );

			this.setGameList();
			$(this.gameListContainer).find(this.lazyloadItem).picLazyLoad({scrollContainer: this.scrollContainer,threshold: 200, placeholder: ""});
		}
	}
	
	/**
	 * 生成并设置游戏列表html结构
	 */
	setGameList(){
		var template = Handlebars.compile($(this.gameItemTpl).html()),
			html = template(this.gameList);

		$(this.gameListContainer).html(html);
	}

	/**
	 * 打开产品路径
	 * @param item
	 */
	openProductUrl(item){
		Global.Log.log("openProductUrl=%s", item.GameId);

		//函数：accessCheck，无权限时默认会自行显示提示信息
		if(Global.App.isLogin()){
			Api.account.profile_baseInfo(true)
				.done((baseInfo)=>{
					if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.WG, baseInfo.memberLevel)){
						if(baseInfo.memberLevel == Global.MemberLevel.trial){
						}
						else {
							var url = this.loginUrl + "?id="+ encodeURI(item.GameId) +"&_v="+(new Date()).valueOf();

							window.open(url);
						}
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
			//此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.WG, -1);
		}

		// if(!Global.App.isLogin()){
		// 	//Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"));
		// 	Global.ConfirmDialog.show({
		// 		labelRightBtn: "马上登录",
		// 		callbackRightBtn: Global.App.goToLoginPage.bind(Global.App)
		// 	});
		// 	return;
		// }
		//
		// Api.account.profile_baseInfo(true)
		// 	.done((baseInfo)=>{
		// 		if(baseInfo.memberLevel == Global.MemberLevel.trial){
		// 			Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMemberGame"));
		// 		}
		// 		else {
		// 			var url = this.loginUrl + "?id="+ encodeURI(item.GameId) +"&_v="+(new Date()).valueOf();
		//
		// 			window.open(url);
		// 		}
		// 	});
	}
}

export = Product_WG_List;
