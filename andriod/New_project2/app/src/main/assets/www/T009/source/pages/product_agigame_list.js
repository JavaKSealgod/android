define('T009/source/pages/product_agigame_list', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_AGIGame_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductAGIGameList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_AGIGame = new ProductAGIGameList({
        page: "AGIGamePage",
        loginUrl: "AGIGame_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_agigame_list.js.map