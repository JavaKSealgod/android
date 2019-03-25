define('T009/source/pages/product_SGGameList_new', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_SGGame_List_new", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductSGGameList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_sggame = new ProductSGGameList({
        page: "SGGamePage",
        loginUrl: "SGGame_Login.html"
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
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_SGGameList_new.js.map