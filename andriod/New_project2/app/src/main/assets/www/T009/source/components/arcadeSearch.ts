/**
 * 搜寻页面
 */
/// <amd-dependency path="Global/libs/zepto.picLazyLoad" />
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

// import BackToTop = require("../../../Global/source/widgets/BackToTop");
class search{
    page: string;
    pageName :string;

    loginUrl: string;

    messageNS:string = "";

    siteMessage = null;

    productList = [];

    gameItemContainer = '[data-cashap-id="gameItemContainer"]';
    gameItem = '[data-cashap-id="gameItem"]';
    tpl_gameItem = '[data-cashap-id="gameItemTpl"]';

    gameListData;
    
    //跑马灯
	noticeTpl = '[data-cashap-id="noticeTpl"]';
	noticeContent = '[data-cashap-id="noticeContent"]';
	marquee = '[data-cashap-id="marquee"]';

    //游戏搜索
    searchGameName = "";
    gameId = "";

    gameNameSearchForm = '[data-cashap-id="GameNameSearch"]';
    gameNameInput = 'input[name="gamename"]';

    constructor(compOption){
        this.page = '[data-cashap-id="' + compOption.page + '"]';
        this.pageName = compOption.page;
        this.init();
    }

    init(){
        Api.message.site_message(true)
        .done((result) => {
            Global.Tips.hideSystemLoading();

            this.siteMessageCallback(result);
        });

        const locationParam = decodeURI(location.search.split('search=')[1]).toLowerCase();
		if(locationParam){
            this.searchByName(locationParam);
		}
    
        //绑定gameNameSearch
        (<HTMLFormElement>$(this.gameNameSearchForm)[0]).onsubmit = ()=> {
            Global.Log.log("gameNameSearchForm submit");

            var name = $(this.page).find(this.gameNameInput).val();
            Global.Log.log("searchByName", name);
            this.searchGameName = name;
            this.gameId = "";

            this.searchByName(name);
            return false;
        };
        //绑定游戏点击事件
        $(this.gameItemContainer).delegate(this.gameItem, "tap", (e: Event) => {
            if (e) e.preventDefault();
            
            const $target = $(e.currentTarget),
                targetItem = $target.attr("data-game-id"),
                GameCode = $target.attr("data-game-code"),
                gameName = $target.attr("data-member-rule"),
                gameType = $target.attr("data-show-type"),
                Param = $target.attr("data-cashap-param"),
                item = {
                    "GameName": gameName,
                    "GameId": targetItem,
                    "memberRule":gameName,
                    "GameCode":GameCode,
                    "ShowType":gameType,
                    "Param":Param
                };
            this.checkPermission(item);
        });
    }

    siteMessageCallback(result) {
        var content = [];
        if (result.result) {
            this.siteMessage = result;
        }
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
    //设置游戏列表
    setProductList(data,locationParam) {
        var productList = data.data.filter(item => item.Name.toLowerCase().indexOf(locationParam) >= 0);
        
        for (var i = 0, l = productList.length; i < l; i++) {
            var item = productList[i];
            item.Parameter = decodeURIComponent(JSON.parse('"'+item.Parameter.replace(/\"/g, '\\"')+'"'));
            switch(item.GameName.toLowerCase()){
                case 'megawincasino':
                    //item.ShowType 的值目前不清楚 'app' 大小写
                        item.imgURL = Com_Gametree_Cashap.Language.fileDomain +"/megawincasino/" +item.GameId+'.jpg'
                    break
                default:
                if(item.GameName === 'ptcasino'){
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/ptcasino/gameicon/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                }else if(item.GameName === 'wg_series'){
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/WGGame2/" + item.GameId.toLowerCase().replace(/h5_/g,"").replace(/\s/g,"") + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                    item.GameName = "WG";
                }else if(item.GameName === 'jdbgame'){
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/jdbgame2/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                }else if(item.GameName === 'bb'){
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/bbgame/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                }else if(item.GameName === 'agcasino'){
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/aggame/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                }else if(item.GameName === 'MGCasino_SlotGame'){
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/mgmobile/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                    item.isMG = true;
                }else if(item.GameName === 'spincube' || item.GameName === 'fishlegends'){
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/fishgame2/" + item.GameName + "-" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                }else{
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain + "/" + item.GameName + "/" + item.GameId + "." + Com_Gametree_Cashap.Language.GameImgFormat[item.GameName];
                }
            }

            item.memberRule = item.GameName;
        }

        this.gameListData = productList;

        Global.Log.log("game list data ", productList);

        this.setGameList(productList);
    }

    setGameList(productList) {
        var list = productList;

        var result = list;

        this.setHtml($(this.gameItemContainer), result, $(this.tpl_gameItem).html());
    }

    checkPermission(item){
		//函数：accessCheck，无权限时默认会自行显示提示信息
		if (Global.App.isLogin()) {
			Api.account.profile_baseInfo(true)
				.done((baseInfo) => {
					if (Global.App.accessCheck(item.memberRule, baseInfo.memberLevel)) {
						this.openProductURL(item);
					}
				});
		}
		else {
			//判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
			//此处默认会弹出 提示登录 的信息
			Global.App.accessCheck(item.memberRule, -1);
		}
	}

    openProductURL(item){
        var url;
        switch (item.GameName) {
            case "megawincasino":
                if (item.ShowType === "APP") {
                    url = item.GameName + "_Login.html?mode=app";
                }
                else if (item.ShowType === "H5") {
                    url =  item.GameName + "_Login.html?mode=h5&" + item.Param;
                }
                break;
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
                url = item.GameName + "_Login.html?key=" + item.GameId;
                break;
            case "ptcasino":
                url = "PTCasino_SlotGame_Login.html?" + item.GameId;
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
            case "vggame":
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

    //搜寻游戏
    searchByName(locationParam){
        Api.arcade.product_list()
        .done((data) => {
            //隐藏系统loading
            Global.Tips.hideSystemLoading();

            this.setProductList(data,locationParam);
        });
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

export = search;