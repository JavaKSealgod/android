define('T009/source/pages/cardGameSearch', ["require", "exports", "T009/source/modules/global", "T009/source/components/cardGameSearch", "T009/source/modules/BaseShell"], function (require, exports, Global, cardgamesearch, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var cardGameSearch = new cardgamesearch({
        page: "CardSearchPage",
    });
    new BaseShell();
});
// var pt_entrance = '[data-cashap-id="PTGameListEntrance"]';
// if(window.navigator.userAgent.indexOf("GTMobileApp") > -1){
//     $(pt_entrance).on("click",(e: Event)=>{
//         if(e.preventDefault) e.preventDefault();
//         Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "app_nosupport_pt"));
//         return false;
//     });
// } 
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/cardGameSearch.js.map