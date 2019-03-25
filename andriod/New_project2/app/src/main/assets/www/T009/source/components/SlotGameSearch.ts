/**
 * 电子游戏列表
 */
/// <amd-dependency path="Global/libs/jquery.md5" />

import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

class SlotGameSearch {
    gameSetting = {
        ptcasino: true
    };

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


    constructor() {
        this.init();
    }

    init() {
        Global.Log.log("Product_FishGame.init");

        Global.Tips.showSystemLoading();

        Api.message.site_message(true)
            .done((result) => {
                Global.Tips.hideSystemLoading();

                this.siteMessageCallback(result);
            });
    }

    siteMessageCallback(result) {
        var content = [];
        if (result.result) {
            this.siteMessage = result;

            this.getProductList();

            $(this.gameItemContainer).delegate(this.gameItem, "tap", (e: Event) => {
                if (e) e.preventDefault();

                var $target = $(e.currentTarget),
                    item = this.getItemByGameId($($target).attr("data-game-id"), $($target).attr("data-show-type"));
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
            });
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
    getProductList() {
        Api.fishgame.product_list()
            .done((data) => {
                //隐藏系统loading
                Global.Tips.hideSystemLoading();

                this.setProductList(data);
            });
    }
    setProductList(data) {
        var productList = data.data;
        
        for (var i = 0, l = productList.length; i < l; i++) {
            var item = productList[i];
            switch(item.GameName.toLowerCase()){
                case 'megawincasino':
                    //item.ShowType 的值目前不清楚 'app' 大小写
                    if(item.GameId === '1051' && item.ShowType === 'H5'){
                        item.imgURL = Com_Gametree_Cashap.Language.fileDomain +"/fishgame2/" +item.GameName+'-'+item.GameId+'-'+item.ShowType+'.jpg';
                    }
                    else{
                        item.imgURL = Com_Gametree_Cashap.Language.fileDomain +"/fishgame2/" +item.GameName+'-'+item.GameId+'-APP.jpg'
                    }
                    break
                default:
                    item.imgURL = Com_Gametree_Cashap.Language.fileDomain +"/fishgame2/"+ item.GameName+'-'+item.GameId+'.jpg';
            }

            item.memberRule = item.GameName;
        }

        this.gameListData = productList;

        Global.Log.log("game list data ", productList);

        this.setGameList(productList);
    }

    openProductUrl(item) {
        var url;
        switch (item.GameName) {
            case "megawincasino":
                if (item.ShowType === "APP") {
                    url = item.GameName + "_Login.html?mode=app";
                }
                else if (item.ShowType === "H5") {
                    url =  item.GameName + "_Login.html?mode=h5&" + item.Parameter;
                }
                break;
            case "fishlegends":
                url = item.GameName + ".html";
                break;
            case "spincube":
                url = "SpinCube.html?" + item.Parameter;
                break;
            case "ptcasino":
                url = "PTCasino_SlotGame_Login.html?" + item.Parameter;
                break;
            default:
                url = item.GameName + "_Login.html?" + item.Parameter;
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

    /**
     * 创建html结构
     */
    setHtml(target: JQuery, data, tpl) {
        var template = Handlebars.compile(tpl),
            html = template(data);

        target.html(html);
    }
}

export = SlotGameSearch;