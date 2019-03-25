define('T009/source/pages/mgcasino_slotgame', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_MGCasino_SlotGame", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductMGCasinoSlotGame, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_mgcasino_slotgame = new ProductMGCasinoSlotGame({
        page: "mgCasinoSlotGamePage",
        loginUrl: "MGCasino_SlotGame_Login.html",
        imgFolder: "//image888.flc168.net/mgmobile/" //"http://image888.flc168.net/newMGPIC/"//http://image888.flc168.net/mgmobile/BTN_WinSumDimSum_ZH.png
    });
    new BaseShell();
    //搜索框样式事件
    $('input[type="search"]').on("focus", function (e) {
        var target = e.target || e.srcElement;
        $(target).parents(".mui-search").addClass("mui-active");
    });
    $('input[type="search"]').on("blur", function (e) {
        var target = e.target || e.srcElement, hasVal = $(target).val().trim() != "";
        if (!hasVal) {
            $(target).parents(".mui-search").removeClass("mui-active");
        }
    });
});
//header后退按钮
// $("[data-cashap-id=backward]").on("click", function(){
// 	Global.App.backWard();
// });
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/mgcasino_slotgame.js.map