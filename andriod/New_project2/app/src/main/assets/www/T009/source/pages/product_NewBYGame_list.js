define('T009/source/pages/product_NewBYGame_list', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_NewBYGame_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductNewBYGameList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_newbygame = new ProductNewBYGameList({
        page: "NewBYGamePage",
        loginUrl: "NewBYGame_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_NewBYGame_list.js.map