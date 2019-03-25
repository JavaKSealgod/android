/**
 * 产品组件--VG娱乐城产品列表
 */
/// <amd-dependency path="Global/libs/zepto.picLazyLoad" />
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

// import BackToTop = require("../../../Global/source/widgets/BackToTop");

class Product_VGGame_List{
    page: string;

    loginUrl: string;

    messageNS:string = "";

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
                if(sitemessage.vggame.state) {
                    //设置维护内容
                    $('[data-cashap-id="maintenanceInfo"]').html(sitemessage.vggame.info["zh-cn"]);

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
        Api.vggame.product_list()
            .done((data)=>{
                //隐藏系统loading
                Global.Tips.hideSystemLoading();

                this.productListLoadCallback(data);
            });

        //绑定gameNameSearch
        (<HTMLFormElement>$(this.gameNameSearchForm)[0]).onsubmit = ()=> {
            Global.Log.log("gameNameSearchForm submit");

            this.searchByName();
            return false;
        };
        //绑定搜寻的placeholder显示与否
		$(this.gameNameSearchForm).find(this.gameNameInput).on("blur", (e: Event)=>{
            $(".search-placeholder").removeClass("hide");
            if($(this.gameNameInput).val()){
                $(".search-placeholder").addClass("hide");
            }
        });

        //游戏点击事件
        $(this.gameListContainer).delegate(this.gameItem, "tap", (e: Event)=>{
            e.preventDefault();

            var target = e.currentTarget,//e.target || e.srcElement,
                gameId = $(target).attr("data-game-key");

            this.toOpenProductURL(gameId);
        });

        //顶层数据 回到顶部
        // new BackToTop({
        // 	toTopDomParentContainer: $(this.page),
        // 	scrollContainer: $(this.scrollContainer)
        // });

        Global.Log.log("Product_VGGame_List.init");
    }

    productListLoadCallback(data){
        var productList = data.data;

        for (var i = 0, l = productList.length; i < l; i++) {
            var item = productList[i];
            item.imgURL = Com_Gametree_Cashap.Language.fileDomain+"/vggame/" + item.GameId + ".png"
        }

        this.gameListData = productList;

        Global.Log.log("game list data ", productList);

        this.setGameList(productList);
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

    toOpenProductURL(gameKey){
        Global.Log.log("toOpenProductURL gameKey = %s", gameKey);

        //函数：accessCheck，无权限时默认会自行显示提示信息
        if(Global.App.isLogin()){
            Api.account.profile_baseInfo(true)
                .done((baseInfo)=>{
                    if(Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VGGame, baseInfo.memberLevel)){
                        var url = this.loginUrl + "?GameKey=" + gameKey;

                        //window.location.href = url;
                        window.open(url);
                    }
                });
        }
        else {
            //判断当前产品允许的访问权限，accessCheck提供默认提示信息，可通过参数声明不使用默认提示信息
            //此处默认会弹出 提示登录 的信息
            Global.App.accessCheck(Com_Gametree_Cashap.SiteConfig.memberRuleId.VGGame, -1);
        }
    }

    setGameList(productList){
        var list = productList,
            filterGameName = this.searchGameName;

        var result = list;

        if(Global.Util.trim(filterGameName) != ""){
            result = [];

            var lowName = filterGameName.toLowerCase();

            list.forEach((item, idx)=>{
                if(item.GameName.toLowerCase().indexOf(lowName) > -1){
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

export = Product_VGGame_List;