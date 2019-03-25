/**
 * 网站公告
 */
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");
import FastClick = require("fastclick");

class Web_Message {
    language = "zh-cn";//zh-tw=繁体,zh-cn=简体,en-us=英文
    currentPage = 1;//当前页码索引
    pageSize = 1000;
    pageRange = 5;//页码范围，如5:1-5,6-10

    messageContainer = '[data-cashap-id="messageContainer"]';//由外部提供，外部传入值会覆盖此值
    tpl_messageItem = '[data-cashap-id="messageItemTpl"]';//由外部提供，外部传入值会覆盖此值

    taps = '[data-cashap-id="new-tabs"]';
    messDetails = '[data-cashap-id="message-detail"]';

    constructor(opt?:{sel_container: string; sel_template: string;}){
        this.messageContainer =  opt.sel_container;
        this.tpl_messageItem = opt.sel_template;

        this.init();
    }

    init(){
        Global.Log.log("Web_Message.init");

        Global.Tips.showSystemLoading();
        this.setNoticeContent();
    }

    setNoticeContent(){
		Api.message.site_message()
			.done((result)=>{
                Global.Tips.hideSystemLoading();

				this.siteMessageCallback(result); 
			});
    }
    
    /**
     * 请求公告数据
     */
	siteMessageCallback(result){
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

        this.setHtml($(this.messageContainer), content, $(this.tpl_messageItem).html());

        //信息切换区域绑定fastclick，需要在dom渲染完毕后再绑定
        var tapCont = $(this.messageContainer).find(this.taps);
        // if(tapCont.length > 0){
        //     FastClick["attach"](tapCont[0]);
        // }

        //绑定公告项切换事件，不能使用tap事件，因为300ms延迟后会再次触发click事件
        tapCont.children().on("click", (e:Event)=>{
            var target:any = e.currentTarget || e.target,
                idx = tapCont.children().index(target);

            tapCont.children().removeClass("active").eq(idx).addClass("active");

            $(this.messDetails).addClass("hide").eq(idx).removeClass("hide");
        });

        //触发选择展开第一个信息
        $(tapCont.children()[0]).trigger("click");
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

export = Web_Message;