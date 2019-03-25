/**
 * 捕鱼游戏搜寻页
 */
import Global = require("../modules/global");
import fishSearch = require("../components/fishSearch");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var fishGameSearch = new fishSearch({
    page: "FishSearchPage",
});

new BaseShell();

// var pt_entrance = '[data-cashap-id="PTGameListEntrance"]';

// if(window.navigator.userAgent.indexOf("GTMobileApp") > -1){
//     $(pt_entrance).on("click",(e: Event)=>{
//         if(e.preventDefault) e.preventDefault();

//         Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "app_nosupport_pt"));

//         return false;
//     });
// }