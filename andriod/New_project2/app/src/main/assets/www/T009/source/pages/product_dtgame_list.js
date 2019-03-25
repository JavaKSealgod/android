define('T009/source/pages/product_dtgame_list', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_DTGame_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductDTList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    new ProductDTList({
        loginUrl: "DTGame_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_dtgame_list.js.map