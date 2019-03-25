// import { promotion } from '../../../Global/source/modules/api'; 不知道这是什么鬼
/**
 * 优惠活动
 */
/// <amd-dependency path="Global/libs/zepto.picLazyLoad" />
import Global = require("../modules/global");
// import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");

class Promotion {
    // 总分类列表
    CatalogList:Array<PromoCatalog>;
    // 总活动列表
    PromotionList:Array<Promotion>;
    // 当前激活的活动列表
    ViewPromotionList:Array<Promotion>;

    PromotionConfigDom = '[data-cashap-id="promotionConfig"]';

    CatalogTitTpl ='[data-cashap-id="CatalogTitTpl"]';
    PromotionItemTpl ='[data-cashap-id="PromotionItemTpl"]';
    PromotionLinkTpl ='[data-cashap-id="PromotionLinkTpl"]';

    // 分类标题容器
    CatalogTitContent = '[data-cashap-id="CatalogItemContainer"]';
    // 分类标题
    CatalogTit = '[data-cashap-id="CatalogTit"]';
    // 暂无优惠活动
    NoPromotion = '[data-cashap-id="NoPromotion"]';

    // 优惠活动容器
    PromotionContent ='[data-cashap-id="PromotionItemContainer"]';
    // 优惠活动
    PromotionItem ='[data-cashap-id="promotion_item"]';
    // 优惠活动 预览图容器
    PromotionPrew ='[data-cashap-id="promotion_prew"]';
    // 优惠活动关闭按钮
    Promotion_CloseBtn ='[data-cashap-id="promotion_close"]';

    // 优惠活动链接容器
    PromotionLinkContainer ='[data-cashap-id="PromotionLinkContainer"]';

    lazyloadItem = '[data-cashap-id="lazyload"]';

    scrollContainer = '[data-cashap-id="scrollContainer"]';

    constructor(){
        this.scrollContainer = this.PromotionContent;

        try{
            //显示系统loading
            Global.Tips.showSystemLoading();
            
            if(JSON.parse( $(this.PromotionConfigDom).text() ) == ""){
                $(this.NoPromotion).removeClass('hide');
                $(this.CatalogTitContent).addClass('hide');
                $(this.PromotionContent).addClass("hide");

                Global.Tips.hideSystemLoading();
            }else{
                $(this.PromotionContent).removeClass("hide");
                $(this.CatalogTitContent).removeClass('hide');

                let temp_CatalogList:{CatalogList?:Array<PromoCatalog>;CatalogSort?:Array<string>,Promotion:Array<Promotion>} = JSON.parse( $(this.PromotionConfigDom).text() );
                let temp_PromotionList:Array<Promotion> = temp_CatalogList.Promotion;

                // 根据temp_CatalogList.CatalogSort的顺序重新排列分类
                let tempres:Array<any> = [];
                temp_CatalogList.CatalogSort.forEach(SortEle => {
                    temp_CatalogList.CatalogList.forEach(CatalogEle => {
                        if(SortEle == CatalogEle.CatalogId){
                            tempres.push(CatalogEle);
                        }
                    });
                });

                this.CatalogList = tempres.slice(0);
                this.PromotionList = temp_PromotionList.slice(0);

                this.init();
            }

            
        }catch(err){
            Global.Tips.hideSystemLoading();

            $(this.PromotionContent).addClass("hide");
            $(this.CatalogTitContent).addClass('hide');
            $(this.NoPromotion).removeClass('hide');

            console.log("get config error: "+err);
            return ;
        }
        
    }

    init(){
        Global.Log.log("Promotion.init");

        this.setHtml($(this.CatalogTitContent),this.CatalogList,$(this.CatalogTitTpl).html());

        // 根据分类数量创建 活动内容的容器
        this.CatalogList.forEach((element,index) => {
            let theIndex = index;
            $(this.PromotionContent).prepend('<div class="PromotionList hide" ></div>');
            setTimeout(()=>{
                let res:Array<Promotion> = [];
                element.PromotionList.forEach(CatalogEle => {
                    this.PromotionList.forEach(PromotionEle => {
                        if(PromotionEle.PromotionId == CatalogEle){
                            res.push(PromotionEle);
                        }
                    });
                });
                let promotionDom = $(this.PromotionContent).find('.PromotionList').eq(theIndex);
                this.setHtml(promotionDom,res,$(this.PromotionItemTpl).html());

                res.forEach((PromotionLink,IndexPromotion) => {
                    let LinkDom = promotionDom.find(this.PromotionItem).eq(IndexPromotion).find(this.PromotionLinkContainer);
                    this.setHtml(LinkDom,PromotionLink.PromoLinks,$(this.PromotionLinkTpl).html());
                });        
                
                
            },0);
        });

        // 分类切换事件绑定
        $(this.CatalogTitContent).delegate(this.CatalogTit, "click", (e: Event) => {
            if (e) e.preventDefault();

            $(this.CatalogTit).removeClass("active");
            $('.PromotionList').addClass("hide");

            if(!$(e.currentTarget).hasClass("active")){
                $(e.currentTarget).addClass("active");
                
                this.CatalogList.forEach((element,index) => {
                    if(element.CatalogId == $(e.currentTarget).attr('data-value-catalogid')){
                        $(this.PromotionContent).find('.PromotionList').eq(index).removeClass('hide');

                        if($(this.PromotionContent).find('.PromotionList').eq(index).attr('data-newpicLazyLoad-id') == undefined){
                            // 依据'data-newpicLazyLoad-id' 这个属性是否存在创建picLazyLoad 
                            $(this.PromotionContent).find('.PromotionList').eq(index).attr('data-newpicLazyLoad-id','true');
                            setTimeout(()=>{
                                $(this.PromotionContent).find('.PromotionList').eq(index).find(this.lazyloadItem).picLazyLoad({scrollContainer: this.scrollContainer,event:"click",threshold: 100, placeholder: ""});
                            },0);
                        }
                    }
                });
            }

            


        });
        

        // 活动预览事件绑定
        $(this.PromotionContent).delegate(this.PromotionPrew, "click", (e: Event) => {
            if (e) e.preventDefault();
            
            this.toggleDetail($(e.currentTarget));
        });

        $(this.PromotionContent).delegate(this.Promotion_CloseBtn, "click", (e: Event) => {
            if (e) e.preventDefault();
            
            this.ClosePromotion($(e.currentTarget));
        });

        $(this.CatalogTit).first().trigger("click");

        if(this.CatalogList.length == 1){
            // 没有分类
            $(this.PromotionContent).css('width','100%');
            $(this.CatalogTitContent).addClass('hide');
        }
        // 没有优惠活动时候隐藏所有
        if(this.PromotionList.length == 0){
            $(this.NoPromotion).removeClass('hide');
            $(this.CatalogTitContent).addClass('hide');
            $(this.PromotionContent).addClass("hide");
        }

        Global.Tips.hideSystemLoading();
    };

    
    toggleDetail($target: JQuery){
        var par = $target.parents(this.PromotionItem);

        if(par.length == 0){
            return;
        }

        let tempImgDom = par.find('[data-cashap-id="promotion_cont"] img');
        if(tempImgDom.attr('src') != ""){
            let src = tempImgDom.attr('data-original');
            tempImgDom.attr('src',src);
            
        }

        if(par.hasClass("active")){
            par.removeClass("active");
        }
        else {
            par.addClass("active");
        }
    }

    ClosePromotion($target: JQuery){
        var par = $target.parents(this.PromotionItem);

        if(par.length == 0){
            return;
        }
        par.removeClass("active");

    }

    /**
	 * 创建html结构
	 */
    setHtml(target: JQuery, data, tpl) {
        var template = Handlebars.compile(tpl),
            html = template(data);
        target.html(html);
    };
    

}

export = Promotion;

interface PromotionConfig{
    CatalogList?:Array<PromoCatalog>;
    CatalogSort?:Array<string>,
    Promotion:Array<Promotion>
}


//优惠活动分类
interface PromoCatalog{
    //分类Id 新增无id 修改带上id
    CatalogId: String,

    // 分类名称
    CatalogName:String,

    //优惠活动列表  [优惠活动ID]
    PromotionList:Array<String>
}

//优惠活动
interface Promotion{
    //优惠活动ID 新增无id 修改带上id
    PromotionId:String,

    //活动名称
    PromoName:String,

    // 小图
    PreviewImgUrl:String,
    
    // 大图
    ContentImgUrl:String,
    
    // 活动分类
    PromoCatalogs:Array<String>,

    // 活动链接
    PromoLinks:Array<PromoLink>,
}

//优惠活动链接
interface PromoLink{
    Label:String,
    Href:String
}

