/**
 * 产品维护状态--站点状态维护
 */

import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");

class Status_SiteMaintenance {

	maintenanceInfo = '[data-cashap-id="maintenanceInfo"]';
	cs_link = '[data-cashap-id="CSContainer"]';

	constructor(){
		this.init();
	}

	init(){
		Api.message.site_message()
			.done((result)=>{
				if(result.hasOwnProperty("site")){
					if(result.site.state){
						$(this.maintenanceInfo).html(result.site.info["zh-cn"]);
						return;
					}
				}

				window.location.replace(Com_Gametree_Cashap.SiteConfig.HomePageUrl);
			});

        this.setCSLink();
	}

	setCSLink(){
        var data = Global.App.cs_data_filter(Global.App.fix_cs_data(window["cs_data"] || []));

        if(data.length > 0){
        	$(this.cs_link).removeClass("hide");
        	$(this.cs_link).find("a").attr("href", data[0].Url);
		}
	}
}

export = Status_SiteMaintenance;