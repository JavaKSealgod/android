define('T009/source/pages/product_jdbgame_list_new', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_JDBGame_List_new", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductJDBGameList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_JDBGame = new ProductJDBGameList({
        page: "JDBGamePage",
        loginUrl: "JDBGame_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_jdbgame_list_new.js.map