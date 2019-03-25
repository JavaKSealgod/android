/**
 * 棋牌游戏搜寻页
 */
import Global = require("../modules/global");
import cardgamesearch = require("../components/cardGameSearch");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var cardGameSearch = new cardgamesearch({
    page: "CardSearchPage",
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