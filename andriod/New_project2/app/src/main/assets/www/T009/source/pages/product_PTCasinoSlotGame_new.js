define('T009/source/pages/product_PTCasinoSlotGame_new', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_PTCasino_SlotGame_new", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductPTCasinoSlotGame, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_ptcasino_slotgame = new ProductPTCasinoSlotGame({
        page: "PTCasinoSlotGamePage",
        loginUrl: "PTCasino_SlotGame_Login.html"
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
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_PTCasinoSlotGame_new.js.map