/**
 * 产品--PT电子游戏
 */
/// <amd-dependency path="Global/libs/zepto.picLazyLoad" />
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

// import BackToTop = require("../../../Global/source/widgets/BackToTop");

class Product_PTCasino_SlotGame{
	page: string;

	loginUrl: string;

	messageNS:string = "";

	//标签列表总容器
	categoryList = '[data-cashap-id="categoryList"]';
	categorySelTpl = '[data-cashap-id="categoryTpl"]';
	categoryItem = '[data-cashap-id="categoryItem"]';

	scrollContainer = '[data-cashap-id="scrollContainer"]';
	gameListContainer = '[data-cashap-id="gameListContainer"]';
	gameListTpl = '[data-cashap-id="gameListTpl"]';
	gameItem = '[data-cashap-id="gameItem"]';

	lazyloadItem = '[data-cashap-id="lazyload"]';

	content = {
		Jackpot_List: null,
		Product_List: null,
		FilterList: null,
		Category: null
	};

	//设置当前产品列表数据是否空值
	isProductListEmpty;

	isLoadding;

	//游戏搜索
	gameName = "";
	gameId = "";

	gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
	gameNameSearch = 'input[name="gamename"]';

	//jackpot
	bigJackpotContainer = '[data-cashap-id="bigJackpot"]';
	bigJPAmount = '[data-cashap-id="jpAmount"]';
	bigJPWins = '[data-cashap-id="jpWins"]';
	bigJPWinCount = '[data-cashap-id="jpWinCount"]';

	//刷新jackpot间隔
	refreshJockPotInterval = 1000;

	constructor(compOption){
        if(window.navigator.userAgent.indexOf("GTMobileApp") > -1){
        	Global.Tips1.show({
                tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                tipsContentTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "app_nosupport_pt"),
                leftbtnShow: false,
                rightbtnShow: true,
                leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "Cancel"),
                rightbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                rightbtnfunction: ()=>{ window.location.href = Com_Gametree_Cashap.SiteConfig.HomePageUrl; }
			});

			return;
        }

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
				if(sitemessage.ptcasino.state) {
					//设置维护内容
					$('[data-cashap-id="maintenanceInfo"]').html(sitemessage.ptcasino.info["zh-cn"]);

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
		this.content.Category = Com_Gametree_Cashap.Language["Product_PTCasino_SlotGame"];

		this.setCategoryList();

		this.toLoadJackpotList();

        this.toLoadProductList({"gameType":"","gameName":""});

		//游戏类别点击事件
		$(this.categoryList).delegate(this.categoryItem, "tap", (e: Event)=>{
			e.preventDefault();

			var target = e.target || e.srcElement,
				idx = $(target).attr("data-index");

			$(this.categoryList).children("li").removeClass("active");
			$(target).parent().addClass("active");

			this.changeCategory(this.content.Category[idx]);
		});

		//绑定gameNameSearch
		(<HTMLFormElement>$(this.gameNameSearchForm)[0]).onsubmit = ()=> {
			Global.Log.log("gameNameSearchForm submit");

			this.searchByName();
			return false;
		}
		//绑定搜寻的placeholder显示与否
		$(this.gameNameSearchForm).find(this.gameNameSearch).on("blur", (e: Event)=>{
            $(".search-placeholder").removeClass("hide");
            if($(this.gameNameSearch).val()){
                $(".search-placeholder").addClass("hide");
            }
        });

		//游戏点击事件
		$(this.gameListContainer).delegate(this.gameItem, "tap", (e: Event)=>{
			e.preventDefault();

			var target = e.target || e.srcElement,
				gameCode = $(target).parents(this.gameItem).attr("data-game-code");

			this.toOpenProductURL(this.getGameListItemByGameCode(gameCode));
		});

		//顶层数据 回到顶部
		// new BackToTop({
		// 	toTopDomParentContainer: $(this.page),
		// 	scrollContainer: $(this.scrollContainer)
		// });

		Global.Log.log("Product_PTCasino_SlotGame.init");
	}

	setCategoryList(){

		this.setHtml($(this.categoryList), this.content.Category, $(this.categorySelTpl).html());

		$(this.categoryList).children(":first-child").addClass("active");
	}

	toLoadJackpotList(){
		Api.ptcasino.product_jackpotlist(true)
			.done((result)=>{
				if(result.hasOwnProperty("errorInfo")) {
					if (result.errorInfo.length > 0) {
						var text;

						if (result.errorInfo[0].errorCode == "1000039") {
							var productName = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Model.Game_ID", "PTCasino");
							text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "product_maintenance");
							text = text.replace("{0}", productName);
							Global.Tips.systemTip(text);
							return;
						}

						text = result.errorInfo[0].error;
						Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "unknowError") +" "+  text);
						return;
					}
				}

				this.content.Jackpot_List = result;
				this.toLoadJackpotListCallback();
			});
	}

	toLoadJackpotListCallback(){
		//设置jackpot
		this.setBigJackpot();

		// this.toLoadProductList({"gameType":"","gameName":""});
	}

	setBigJackpot(){
		Global.Log.log("Jackpot_List ", this.content.Jackpot_List);
		var bigJackpot = this.content.Jackpot_List.bigjackpot;

		$(this.bigJackpotContainer).find(this.bigJPWins).html(Global.Util.formatChineseNumber(bigJackpot.wins));
		$(this.bigJackpotContainer).find(this.bigJPWinCount).html(Global.Util.formatChineseNumber(bigJackpot.winCount));

		this.setBigJackpotAmount();
	}

	/**
	 * 设置总奖金彩池
	 */
	setBigJackpotAmount(){
		var bigJackpot = this.content.Jackpot_List.bigjackpot,
			result = "0";

		if(bigJackpot){
			var amount = bigJackpot.amount || 0,
				step = bigJackpot.step || 0,
				lastUpdateTime = this.content.Jackpot_List.lastUpdate,
				currTime = new Date().valueOf(),
				subTime = parseInt((currTime - lastUpdateTime) / 1000 + "");

			result = this.accAdd(parseFloat(amount), this.accMul(subTime, parseFloat(step))).toFixed(2).toString();
		}

		$(this.bigJackpotContainer).find(this.bigJPAmount).html(Global.Util.formatChineseNumber(result));

		setTimeout(()=>{
			this.setBigJackpotAmount();
		}, this.refreshJockPotInterval);
	}

	/**
	 * 浮点加法运算
	 * @param arg1
	 * @param arg2
	 */
	accAdd(arg1, arg2){
		var r1,r2,m;
		try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
		try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
		m=Math.pow(10,Math.max(r1,r2))
		return (arg1*m+arg2*m)/m
	}

	/**
	 * 浮点乘法运算
	 * @param arg1
	 * @param arg2
	 */
	accMul(arg1,arg2) {
		var m=0,s1=arg1.toString(),s2=arg2.toString();
		try{m+=s1.split(".")[1].length}catch(e){}
		try{m+=s2.split(".")[1].length}catch(e){}
		return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
	}

	toLoadProductList(data){
		Global.Log.log("toLoadProductList" , data);

		Api.ptcasino.product_list(data)
			.done((result)=>{
				//隐藏系统loading
				Global.Tips.hideSystemLoading();

				this.content.Product_List = result;

				this.toLoadProductListCallback(result);
			});
	}

	toLoadProductListCallback(result){
		if(result.hasOwnProperty("errorInfo")) {
			if (result.errorInfo.length > 0) {
				var text;

				if (result.errorInfo[0].errorCode == "1000039") {
					var productName = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("Model.Game_ID", "PTCasino");
					text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "product_maintenance");
					text = text.replace("{0}", productName);
					Global.Tips.systemTip(text);
					return;
				}

				text = result.errorInfo[0].error;
				Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , "unknowError") +" "+  text);
				return;
			}
		}

		var data = this.content.Product_List.data,
			imgFolder = Com_Gametree_Cashap.Language.fileDomain+"/ptcasino/gameicon/";


		//判断图片加载指定文件夹不为空值时，则使用指定路径
		if(imgFolder != "" && imgFolder != undefined){
			$.each(data , function(i , n){
				//将gameCode中的空格去掉，防止图片文件名格式错误
				n.image = imgFolder+ n.gameCode.replace(" ", "") + ".jpg";
				//兼容旧版API过渡
				n.jackPot = n.jackPot || false;
			});

			this.content.Product_List["data"] = data;
		}

		this.isProductListEmpty = data.length == 0;
		this.isLoadding = false;

		Global.Log.log("content ", this.content);

		this.productListPage();
	}

	/**
	 * 过滤游戏列表
	 */
	filterData(){
		var data = this.content.Product_List.data || [],
			gameName = this.gameName,
			gameId = this.gameId;

		var filter_data = [];

		data.forEach((item, idx)=>{
			if(gameName != ""){
				if(item.gameName.toLowerCase().indexOf(gameName.toLowerCase()) > -1) filter_data.push(item);
			}
			else if(gameId != ""){
				if(item.gameId == gameId) filter_data.push(item);
			}
			else {
				filter_data.push(item);
			}
		});

		this.isProductListEmpty = filter_data.length == 0;

		return filter_data;
	}

	productListPage(){
		var data = this.filterData(),
			dataLength = data.length - 1,//从0开始计算
			items = [];

		this.setHtml($(this.gameListContainer), data, $(this.gameListTpl).html());

        $(this.gameListContainer).find(this.lazyloadItem).picLazyLoad({scrollContainer: this.scrollContainer,threshold: 200, placeholder: ""});

		//滚动区域滚回顶部
		$(this.scrollContainer).scrollTop(0);
	}

	/**
	 * 游戏搜索
	 */
	searchByName(){
		var name = $(this.page).find(this.gameNameSearch).val();

		Global.Log.log("searchByName" , name);

		this.gameName = name;
		this.gameId = "";

		$(this.scrollContainer).scrollTop($(this.bigJackpotContainer).height());

		this.productListPage();
	}

	/**
	 * 点击游戏类别处理
	 * @param item
	 */
	changeCategory(item){
		Global.Log.log("changeCategory" , item);

		if(item.hasOwnProperty("sub")){
			$('ul[data-subcategory="'+item.id+'"]').show();
		}else{
			$('ul[data-subcategory="'+item.id+'"]').hide();
		}

		//清空游戏名称搜索框内容
		$(this.page).find(this.gameNameSearch).val("");

		this.gameName = "";
		this.gameId = item.id;

		this.productListPage();
	}

	/**
	 * 通过gameCode获取gameItem
	 * @param id
	 * @returns {any}
	 */
	getGameListItemByGameCode(code: string){
		var data = this.content.Product_List.data,
			target;

		data.forEach((item, idx)=>{
			if(item.gameCode == code){
				target = item;
				return false;
			}
		});

		return target;
	}

	/**
	 * 打开游戏
	 * @param item
	 */
	toOpenProductURL(item){
		Global.Log.log("toOpenProductURL",item);

		//函数：accessCheck，无权限时默认会自行显示提示信息
		if(Global.App.isLogin()){
			Api.account.profile_baseInfo(true)
				.done((baseInfo)=>{
					if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.PTCasino, baseInfo.memberLevel)){
						if(baseInfo.memberLevel == Global.MemberLevel.trial){
						}
						else {
							var url = this.loginUrl+"?gameCode="+item.gameCode;

							window.open(url);
						}
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
			//此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.PTCasino, -1);
		}

		//判断是否未登录，若是则返回退出继续执行
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
		// 	.done((result)=>{
		// 		if(result.memberLevel == 2){
		// 			Global.Tips.systemTip( (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("","onlyMemberGame"));
		// 			return;
		// 		}
		//
		// 		var url = this.loginUrl+"?gameCode="+item.gameCode;
		//
		// 		window.open(url);
		// 	});
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

export = Product_PTCasino_SlotGame;