import Handlebars = require("handlebars");
// swiper
import Swiper = require("../../../Global/libs/swiper");
class bannerConfig {
    SidelTplVelDom:string = '[data-cashap-id="SwiperItemContainer"]';
    tplDom:string = '[data-cashap-id="slideItemTpl"]';
    nextEl:string = '.swiper-button-next';
    prevEl:string = '.swiper-button-prev';
    paginationEl:string = '.swiper-pagination';
    
    constructor() {        
        let configs:Array<configDataModel>;
        let gethtmljson:string = $('[data-cashap-id="slideConfig"]').text();
        if(gethtmljson == '' || gethtmljson == undefined || gethtmljson == null){
            console.log('缺少数据');
            return ;
        }
        try{
            configs = JSON.parse( $('[data-cashap-id="slideConfig"]').text() );
            
        }catch(err){
            console.log("swiperComponent "+err);
            return ;
        }
        
        var SwiperVel:Array<any> = [];
        configs.forEach((configelement,index) => {
            console.log("bannerConfig is init "+(index+1));

            //补齐属性对应值
            configelement.ImgConfig.forEach((imgItem, idx)=>{
                //补齐属性，防止后面判断问题
                if(!imgItem.hasOwnProperty("href")){
                    imgItem.href = "";
                }

                imgItem["target"] = imgItem.target=="" ? "target=\"_self\"" : "target="+imgItem.target ;
                
                //链接为空时，不添加target属性
                if(imgItem.href == ""){
                    imgItem["target"] = "";
                }

                imgItem.href == "" ? imgItem.href = "javascript:void(0);" : "";

                configelement.ImgConfig[idx] = imgItem;
            });

            // this.init(configelement);
            // SwiperVel.push( new Swiper(configelement.tarDom,configelement.swiperConfig) );
            if($(configelement.tarDom).length > 0){
                this.init(configelement);
                SwiperVel.push( new Swiper(configelement.tarDom,configelement.swiperConfig) );
            }
            else{
                console.log('没有找到tarDom ',configelement.tarDom);
            }
        });
    }
    init(configData:configDataModel) {
        if (!configData.hasOwnProperty('tarDom')) {
            console.log("找不到轮播图容器");
            return ;
        }
        if(configData.ImgConfig.length == 0){
            console.log('缺少数据');
            return false;
        }
        this.setHtml($(configData.tarDom),configData.ImgConfig,$(this.tplDom).html());
        setTimeout(() => {
            if (configData.swiperConfig.hasOwnProperty('pagination')) {
                console.log("show pagination");
                $(configData.tarDom).find(this.paginationEl).removeClass('hide');
            }
            if (configData.swiperConfig.hasOwnProperty('navigation')) {
                console.log("show navigation");
                $(configData.tarDom).find(this.nextEl).removeClass('hide')
                $(configData.tarDom).find(this.prevEl).removeClass('hide')
            }
        }, 200);
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
class popUpConfig {
    tplDom :string = '[data-cashap-id="popUpTpl"]';
    //弹窗
	popUpContainer:string = '[data-cashap-id="popUpContainer"]';
	popUpClose:string = '[data-cashap-id="popUpClose"]';

    
    constructor() {        
        let configs:Array<popUpConfigDataModel>,
            gethtmljson:string = $('[data-cashap-id="popUpConfig"]').text(),
            getSession =  sessionStorage.getItem("popUpIsRead") === "true" ? true : false;
        if(getSession){
            return;
        }
        if(gethtmljson == '' || gethtmljson == undefined || gethtmljson == null){
            console.log('缺少数据');
            return ;
        }
        try{
            configs = JSON.parse( $('[data-cashap-id="popUpConfig"]').text() );
            
        }catch(err){
            console.log("popUpComponent " + err);
            return ;
        }
        
        var popUpVel:Array<any> = [];
        configs.forEach((configelement,index) => {
            console.log("popUpConfig is init "+(index+1));

            //补齐属性对应值
            configelement.ImgConfig.forEach((imgItem, idx)=>{
                //补齐属性，防止后面判断问题
                if(!imgItem.hasOwnProperty("href")){
                    imgItem.href = "";
                }

                imgItem["target"] = imgItem.target == "" ? "target=\"_self\"" : "target="+imgItem.target ;
                
                //链接为空时，不添加target属性
                if(imgItem.href == ""){
                    imgItem["target"] = "";
                }

                imgItem.href == "" ? imgItem.href = "javascript:void(0);" : "";

                configelement.ImgConfig[idx] = imgItem;
            });

            if($(configelement.tarDom).length > 0){
                this.init(configelement);
            }
            else{
                console.log('没有找到tarDom ',configelement.tarDom);
            }
        });
    }
    init(configData:popUpConfigDataModel) {
        if (!configData.hasOwnProperty('tarDom')) {
            console.log("找不到弹窗容器");
            return ;
        }
        if(configData.ImgConfig.length == 0){
            console.log('缺少数据');
            return false;
        }

        if(configData.iframeHref.length > 0){
            configData.hasIfame = true;
            this.setHtml($(configData.tarDom),configData, $(this.tplDom).html());
        }else{
            configData.hasIfame = false;
            this.setHtml($(configData.tarDom),configData.ImgConfig , $(this.tplDom).html());
        }

        $(configData.tarDom).removeClass("hide");

        //弹窗关闭按钮事件
		$(this.popUpClose).on("click", (e: Event)=>{
            e.preventDefault();

            sessionStorage.setItem("popUpIsRead", "true");

			$(this.popUpContainer).addClass("hide");
		});
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

export = {bannerConfig, popUpConfig};

new bannerConfig();

new popUpConfig();

interface configDataModel {
    tarDom?: string;
    swiperConfig?:swiperConfigModel;
    ImgConfig?:any[];
}
interface autoplayModel {
    delay: number,
    stopOnLastSlide?: boolean,
    disableOnInteraction?: boolean,
    reverseDirection?: boolean;
}
interface ImgConfigModel {
    url: string;
}

interface swiperConfigModel {
    initialSlide?: number;
    speed?: number;
    direction?: string;
    navigation_switch?: boolean;
    pagination_switch?: boolean;
    navigation?: {
        nextEl?: string,
        prevEl?: string
    },
    pagination?: {
        el: string;
        type?: string;
        clickable?: boolean;
    },
    autoplay?: boolean | autoplayModel,
    observer?: boolean;
    watchOverflow?: boolean;
    loop?: boolean;
    effect?: string;
}

interface popUpConfigDataModel {
    tarDom?: string;
    iframeHref?:string;
    ImgConfig?:any[];
    hasIfame?:boolean;
    ImgUrl?:string;
    target?:string;
    href?:string;
}