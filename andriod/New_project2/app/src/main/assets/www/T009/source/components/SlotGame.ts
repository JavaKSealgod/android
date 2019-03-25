/**
 * 电子游戏列表
 */
/// <amd-dependency path="Global/libs/jquery.md5" />

import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

class SlotGame {
    siteMessage = null;

    productList = [];

    gameItemContainer = '[data-cashap-id="gameItemContainer"]';
    gameItem = '[data-cashap-id="gameItem"]';
    tpl_gameItem = '[data-cashap-id="gameItemTpl"]';
    gameCategoryList = '[data-cashap-id="gameCategoryList"]';
    gameCategoryItem = '[data-cashap-id="gameCategoryItem"]';
    

    gameListData;

    //跑马灯
	noticeTpl = '[data-cashap-id="noticeTpl"]';
	noticeContent = '[data-cashap-id="noticeContent"]';
	marquee = '[data-cashap-id="marquee"]';

    slotgameroductTitle='[data-cashap-id="slotgame-product-title"]';

    //搜寻
    gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
    gameNameInput = 'input[name="gamename"]';
    searchGameName = "";
    gameId = "";

    constructor() {
        this.init();
    }

    init() {
        Global.Log.log("Product_SlotGame.init");

        Global.Tips.showSystemLoading();

        Api.message.site_message(true)
            .done((result) => {
                Global.Tips.hideSystemLoading();

                this.siteMessageCallback(result);
            });

        //游戏列表点击事件
        $(this.gameCategoryList).delegate(this.gameCategoryItem, "click", (e: Event) => {
            if (e) e.preventDefault();

            var $target = $(e.currentTarget),
            item = $($target).attr("data-pkg-product-id");

            $('.row-50').removeClass('active');
            $($target).addClass('active');

            this.getProductList(item);

            //切换后回到最左侧
            $(this.gameItemContainer).scrollLeft(0)
        });
        
        
        //绑定游戏点击事件
        $(this.gameItemContainer).delegate(this.gameItem, "click", (e: Event) => {
            if (e) e.preventDefault();

            if (e) e.preventDefault();
			var $target = $(e.currentTarget),
                targetItem = $target.attr("data-game-id"),
                GameCode = $target.attr("data-game-code"),
                gameKey = $target.attr("data-game-key"),
                gameName = $target.attr("data-member-rule"),
				item = {
					"GameName": gameName,
					"GameId": targetItem,
                    "memberRule":gameName,
                    "GameCode":GameCode,
                    "GameKey":gameKey
                };
			this.checkPermission(item);
        });

        //绑定gameNameSearch
        (<HTMLFormElement>$(this.gameNameSearchForm)[0]).onsubmit = ()=> {
            Global.Log.log("gameNameSearchForm submit");

            this.searchByName();
            return false;
        };


        //默认显示第一个游戏
        $(this.gameCategoryList).find(".row-50:first-child").addClass('active');
        const firstGame = $(this.gameCategoryList).find(".row-50:first-child").attr("data-pkg-product-id");
        this.getProductList(firstGame);
    }

    siteMessageCallback(result) {
        var content = [];

        if(result.result && result.siteMessage){
			result.siteMessage.forEach((item, idx)=>{
				//未登录且showTag=false时，不显示当前项。showTag不存在，默认显示
				if(!Global.App.isLogin() && item.hasOwnProperty("showTag") && !item.showTag){
					return;
				}

				//isDisplay存在且为false时，不显示当前项
				if(item.hasOwnProperty("isDisplay") && !item.isDisplay){
					return;
				}

				var date = new Date(item.startDate),
					day: any = date.getDate(),
					month: any = date.getMonth() + 1,
					year = date.getFullYear();

				day = day >= 10 ? day : "0" + day;
				month = month >= 10 ? month : "0" + month;

				item["day"] = day;
				item["month"] = month;
				item["year"] = year;

				content.push(item);
			});
		}

		Global.Log.log("generate data ", content);

		content = content.length === 0 ? [{content:""}] : content;
		content.map(item => item.content);

		this.setHtml($("#notice-content"), content, $(this.noticeTpl).html());
        this.setMarqueeWidth();
    }
    getProductList(item) {
        //显示系统 loading 并隐藏列表
        Global.Tips.showSystemLoading();
        $('[data-cashap-state="state_open"]').addClass("hide");
        $('[data-cashap-state="state_maintenance"]').addClass("hide");

        let gameName,data,stateName;
        switch (item){
            case "SlotGame_MGCasino":
                data = {gameKind : 1}
                gameName = "mgcasino";
                stateName = item.toLowerCase();
                break;
            case "PTCasino":
                data = {"gameType":"","gameName":""}
                gameName = "PTCasino";
                stateName = item.toLowerCase();
                break;
            case "GNSCasino":
                gameName = "gnsgame";
                stateName = item.toLowerCase();
                break;
            case "bb":
                gameName = "bb_list";
                stateName = item.toLowerCase();
                break;
            case "SlotGame_AGCasino":
                gameName = "agcasino_list";
                stateName = "agcasino";
                break;
            case "WG":
                gameName = "wg_series";
                stateName = item.toLowerCase();
                break;
            case "MegawinCasinoH5":
                gameName = "megawincasino";
                stateName = 'megawincasino';
                break;
            case "SpinCube_slot":
                gameName = item;
                stateName = "spincube";
                break;
            default:
                stateName = item.toLowerCase();
                gameName = item;
        }
        Api.message.site_message(true)
			.done((sitemessage)=>{
				if(sitemessage[stateName].state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceDesc"]').html(Com_Gametree_Cashap.Language["Model.Game_ID"][stateName]);
                    $('[data-cashap-id="maintenanceDesc1"]').html(Com_Gametree_Cashap.Language["Model.Game_ID"][stateName] + " 正在维护中");
					$('[data-cashap-id="maintenanceInfo"]').html(sitemessage[stateName].info["zh-cn"]);
                    $('[data-cashap-state="state_maintenance"]').removeClass("hide");

					//隐藏系统loading
					Global.Tips.hideSystemLoading();
				}
				else {
                    $('[data-cashap-state="state_open"]').removeClass("hide");
                    var productInfo;
					if(gameName === 'MegawinCasino'){
                        //隐藏系统loading
                        Global.Tips.hideSystemLoading();
                        productInfo = {
                            url: "MegawinCasino_Login.html?mode=app",
                            memberRule:gameName
                        }
                        this.checkProductPermission(productInfo);
                        return
                    }else if(gameName === 'SpinCube_slot'){
                        //隐藏系统loading
                        Global.Tips.hideSystemLoading();
                        productInfo = {
                            url: "SpinCube_Login.html",
                            memberRule:gameName
                        }
                        this.checkProductPermission(productInfo);
                        return
                    }else if(gameName === 'MTCasino'){
                        //隐藏系统loading
                        Global.Tips.hideSystemLoading();
                        productInfo = {
                            url: "MTCasino_Login.html",
                            memberRule:gameName
                        }
                        this.checkProductPermission(productInfo);
                        return
                    }else{
                        Api[gameName.toLowerCase()][Com_Gametree_Cashap.Language.GameAPI[item]](data)
                        .done((data) => {
                            //隐藏系统loading
                            Global.Tips.hideSystemLoading();
                            this.setProductList(data,item);
                        });
                    }
                }
			});
    }
    setProductList(data,GameName) {
        var productList=[];
        
        if(GameName === 'SlotGame_MGCasino'){
            data.data.forEach(element => productList.push(element));
        }else{
            data.data.map(element =>{ 
                if(element.Category != 'hot' && element.Category !== 'new' && element.Category !== 'recommend'){
                    return element.game
                }
            }).forEach(element =>productList.push(...element));
        }

        for (var i = 0, l = productList.length; i < l; i++) {
            var item = productList[i];
            
            item.GameName = GameName;
            item.rule = item.GameName;

            if(item.GameName === 'PTCasino'){
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/ptcasino/gameicon/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat["ptcasino"];
            }else if(item.GameName === 'JDBGame'){
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/jdbgame2/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat["jdbgame"];
            }else if(item.GameName === 'bb'){
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/bbgame/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
            }else if(item.GameName === 'SlotGame_AGCasino'){
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/aggame/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat["aggame"];
            }else if(item.GameName === 'SlotGame_MGCasino'){
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + '/mgmobile/' + item.img;
                item.Name = item.name;
                item.GameId = item.gameid;
                item.isMG = true;
            }else if(item.GameName === 'AGIGame' || item.GameName === 'MegawinCasinoH5'){
                item.imgURL = item.GameIcon;
            }else if(item.GameName === 'WG'){
                item.imgURL = item.GameIcon.replace(/^\/{2}.+?\//, Com_Gametree_Cashap.Language.fileDomain + '/');
            }else if(item.GameName === 'toggame'){
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + '/toggame2/' + item.GameId + ".jpg";
            }else{
                item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/" + item.GameName + "/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName.toLowerCase()];
            }
        }

        //依照sort 排序
		productList.forEach(element => parseInt(element.Sort))
		productList = productList.sort((a,b) => a.Sort - b.Sort );

        this.gameListData = productList;

        Global.Log.log("game list data ", productList);

        this.setGameList(productList);
    }
    //没有列表的登入检查
    checkProductPermission(item){
		//函数：accessCheck，无权限时默认会自行显示提示信息
		if (Global.App.isLogin()) {
			Api.account.profile_baseInfo(true)
				.done((baseInfo) => {
					if (Global.App.accessCheck(item.memberRule, baseInfo.memberLevel)) {
                        window.open(item.url);
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
            //此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(item.memberRule, -1);
		}
	}

    checkPermission(item){
		//函数：accessCheck，无权限时默认会自行显示提示信息
		if (Global.App.isLogin()) {
			Api.account.profile_baseInfo(true)
				.done((baseInfo) => {
					if (Global.App.accessCheck(item.memberRule, baseInfo.memberLevel)) {
                        this.openProductUrl(item);
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
            //此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(item.memberRule, -1);
		}
	}

    openProductUrl(item) {
        var url;
        switch (item.GameName) {
            case "MegawinCasinoH5":
                url = "MegawinCasino_Login.html?mode=h5&gameId=" + item.GameId;
                break;
            case "slotgame_mgcasino":
                url = item.GameName + "_Login.html?gameid=" + item.GameId +"&language=zh";
                break;
            case "bb":
                url = "bb_Login.html?html=true&game=" + item.GameId + "&mode=game";
                break;
            case "GNSCasino":
                url = item.GameName + "_Login.html?key=" + item.GameKey;
                break;
            case "PTCasino":
                url = "PTCasino_SlotGame_Login.html?gameCode=" + item.GameId;
                break;
            case "SlotGame_AGCasino":
                url = item.GameName + "_Login.html?game=" + item.GameId;
                break; 
            case "CQCasino":
                url = item.GameName + "_Login.html?gamecode=" + item.GameId + "&gamekind=Slot&gamehall=cq9";
                break;
            case "JDBGame":
                url = item.GameName + "_Login.html?GameId=" + item.GameId + "&GameType=" + item.GameCode ;
                break;
            case "DTGame":
            case "VGGame":
                url = item.GameName + "_Login.html?GameKey=" + item.GameId;
                break;
            case "WG":
                url = item.GameName + "_Login.html?id=" + item.GameId;
                break;
            default:
                url = item.GameName + "_Login.html?gameid=" + item.GameId;
        }
        window.open(url);
    }

    //透过 API回传的 GameId取得物件 及透过 ShowType判断 h5 或 app
    getItemByGameId(GameId,ShowType) {
        let result = null;

        for (let i = 0, l = this.gameListData.length; i < l; i++) {
            if (this.gameListData[i].GameId === GameId && this.gameListData[i].ShowType === ShowType) {
                result = this.gameListData[i];
                break;
            }
        }
        return result;
    }
    setGameList(productList) {
        var list = productList;

        var result = list;

        this.setHtml($(this.gameItemContainer), result, $(this.tpl_gameItem).html());
    }
    //设置跑马灯宽度
	setMarqueeWidth(){
		let width = 0;
		$(this.marquee + " > span > *").forEach(item =>{
			width += $(item).width();
		});
		$(this.marquee + " > span").width(width);
		requestAnimationFrame(this.scrollDown);
	}
	// 跑马灯讯息
	scrollDown = () => {
		$(this.marquee + " > span").forEach(item => {
			item = $(item);
			if (item.css("left") == "auto") {
				item.css("left", "0px");
			}
			const left = parseInt(item.css("left").split("px")[0]);
			const width = item.width();
			if (left * -1 >= width) {
				item.css("left", item.parent().css("width"));
			} else {
				item.css("left", left - 1);
			}
		});
		requestAnimationFrame(this.scrollDown);
    }
    //搜寻游戏
    searchByName(){
        var name = $(".leftSidebar").find(this.gameNameInput).val();

        Global.Log.log("searchByName" , name);

        this.searchGameName = name;
        this.gameId = "";
        if(name.length > 0){
            $('input').blur();	
            setTimeout(()=>{
                location.href = 'SlotGame_search.html?search=' + name;
            },500);
        }
    }

    /**
     * 创建html结构
     */
    setHtml(target: JQuery, data, tpl) {
        var template = Handlebars.compile(tpl),
            html = template(data);

        target.html(html);
    }
}

export = SlotGame;