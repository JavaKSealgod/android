define('T009/source/pages/product_bnggame_list', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_BNGGame_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductBNGGameList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_BNGGame = new ProductBNGGameList({
        page: "BNGGamePage",
        loginUrl: "BNGGame_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_bnggame_list.js.map