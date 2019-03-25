/**
 * 产品组件--SGGame电子系列产品列表
 */
/// <amd-dependency path="Global/libs/zepto.picLazyLoad" />
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

// import BackToTop = require("../../../Global/source/widgets/BackToTop");

class Product_SGGame_List {
	page: string;

	loginUrl: string;

	messageNS:string = "";

	//标签列表总容器
	categoryList = '[data-cashap-id="categoryList"]';
	categoryTpl = '[data-cashap-id="categoryTpl"]';
	categoryItem = '[data-cashap-id="categoryItem"]';

	scrollContainer = '[data-cashap-id="scrollContainer"]';
	gameListContainer = '[data-cashap-id="gameListContainer"]';
	gameListTpl = '[data-cashap-id="gameListTpl"]';
	gameItem = '[data-cashap-id="gameItem"]';

	lazyloadItem = '[data-cashap-id="lazyload"]';

	gameListData;

	//游戏搜索
	searchGameName = "";
	gameId = "";

	gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
	gameNameInput = 'input[name="gamename"]';

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
				if(sitemessage.sggame.state) {
					//设置维护内容
					$('[data-cashap-id="maintenanceInfo"]').html(sitemessage.sggame.info["zh-cn"]);

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

		Api.sggame.product_list_new()
			.done((data)=>{
				//隐藏系统loading
				Global.Tips.hideSystemLoading();

				this.productListLoadCallback(data);
			});

		//游戏类别点击事件(类别)
		$(this.categoryList).delegate(this.categoryItem, "tap", (e: Event)=>{
			e.preventDefault();

			var target = e.target || e.srcElement,
				id = $(target).attr("data-catalog-id");

			$(this.categoryList).children("li").removeClass("active");
			$(target).parent().addClass("active");

			this.changeCategory(id);
		});

		//绑定gameNameSearch
		(<HTMLFormElement>$(this.gameNameSearchForm)[0]).onsubmit = ()=> {
			Global.Log.log("gameNameSearchForm submit");

			this.searchByName();
			return false;
		}
		//绑定搜寻的placeholder显示与否
		$(this.gameNameSearchForm).find(this.gameNameInput).on("blur", (e: Event)=>{
            $(".search-placeholder").removeClass("hide");
            if($(this.gameNameInput).val()){
                $(".search-placeholder").addClass("hide");
            }
        });

		//游戏点击事件(产品)
		$(this.gameListContainer).delegate(this.gameItem, "tap", (e: Event)=>{
			e.preventDefault();

			var target = e.target || e.srcElement,
				gameId = $(target).parents(this.gameItem).attr("data-game-id");

			this.toOpenProductURL(gameId);
		});

		//顶层数据 回到顶部
		// new BackToTop({
		// 	toTopDomParentContainer: $(this.page),
		// 	scrollContainer: $(this.scrollContainer)
		// });

		Global.Log.log("Product_SGGame_List.init");
	}

	productListLoadCallback(data){
		var productList = data.data,
			allCount = 0;

		for (var i = 0, l = productList.length; i < l; i++) {
			productList[i].isCurrent = false;
			//Sort转数字后排序
			productList[i].game.forEach(element => parseInt(element.Sort))
			var item = productList[i].game.sort((a,b) => a.Sort - b.Sort );
			allCount += item.length;
			for (var x = 0, xl = item.length; x < xl; x++) {
				item[x].imgURL = Com_Gametree_Cashap.Language.fileDomain+"/sggame/" + item[x].GameId + ".jpg"
			}
		}

		productList.unshift({
			CategoryName: "全部",
			Category: "ALL",
			game: {"length": allCount},
			isCurrent: true
		});

		this.gameListData = productList;

		Global.Log.log("game list data ", productList);

		this.setHtml($(this.categoryList), productList, $(this.categoryTpl).html());

		//为默认分类添加active类
		$(this.categoryList).children("li:first-child").addClass("active");

		this.setGameList(productList);
	}

	changeCategory(Category) {
		Global.Log.log("changeCategory ", Category);

		this.gameListData.forEach((item, idx)=>{
			item.Category === Category ? item.isCurrent = true : item.isCurrent = false;
		});

		//清空游戏名称搜索框内容
		$(this.page).find(this.gameNameInput).val("");

		this.searchGameName = "";
		this.gameId = "";

		this.setGameList(this.gameListData);
	}

	/**
	 * 游戏搜索
	 */
	searchByName(){
		var name = $(this.page).find(this.gameNameInput).val();

		Global.Log.log("searchByName" , name);

		this.searchGameName = name;
		this.gameId = "";

		this.setGameList(this.gameListData);
	}

	toOpenProductURL(gameId){
		Global.Log.log("toOpenProductURL gameId = %s", gameId);

		//函数：accessCheck，无权限时默认会自行显示提示信息
		if(Global.App.isLogin()){
			Api.account.profile_baseInfo(true)
				.done((baseInfo)=>{
					if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.SGGame, baseInfo.memberLevel)){
						var url = this.loginUrl + "?id=" + gameId;
						window.open(url);

						// if(baseInfo.memberLevel == Global.MemberLevel.trial){
						// 	var url = this.loginUrl + "?id=" + gameId;
						// 	window.open(url);
						// }
						// else {
						// 	var url = this.loginUrl + "?id=" + gameId;
						// 	window.open(url);
						// }
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
			//此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.SGGame, -1);
		}

		//判断是否未登录，若是则返回退出继续执行
		// if(!Global.App.isLogin()){
		// 	//Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("","noLogin"));
		// 	Global.ConfirmDialog.show({
		// 		labelLeftBtn: "试玩",
		// 		labelRightBtn: "登录",
		// 		callbackLeftBtn: Global.App.trialLogin.bind(Global.App),
		// 		callbackRightBtn: Global.App.goToLoginPage.bind(Global.App)
		// 	});
		// 	return;
		// }
		//
		// var url = this.loginUrl + "?id=" + gameId;
		//
		// // window.location.href = url;
		// window.open(url);
	}

	setGameList(productList){
		var list = [],
			filterGameName = this.searchGameName;

		if (productList.length > 0) {
			if (productList[0].isCurrent) {
				//显示全部时处理
				productList.forEach((item, idx)=> {
					if (item.game instanceof Array) {
						list = list.concat(item.game);
					}
				});
			}
			else {
				//显示某一分类时处理
				productList.forEach((item, idx)=> {
					if (item.isCurrent) {
						list = list.concat(item.game);
						return false;
					}
				});
			}
		}

		var result = list;

		if(Global.Util.trim(filterGameName) != ""){
			result = [];

			var lowName = filterGameName.toLowerCase();

			list.forEach((item, idx)=>{
				if(item.Name.toLowerCase().indexOf(lowName) > -1){
					result.push(item);
				}
			});
		}

		this.setHtml($(this.gameListContainer), result, $(this.gameListTpl).html());

		$(this.gameListContainer).find(this.lazyloadItem).picLazyLoad({scrollContainer: this.scrollContainer,threshold: 200, placeholder: ""});

		//滚动区域滚回顶部
		$(this.scrollContainer).scrollTop(0);
	}

	/**
	 * 创建html结构
	 */
	setHtml(target: JQuery, data, tpl){
		var template = Handlebars.compile(tpl),
			html = template(data);

		target.html(html);
	}
}

export = Product_SGGame_List;