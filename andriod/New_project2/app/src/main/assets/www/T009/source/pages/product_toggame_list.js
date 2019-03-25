define('T009/source/pages/product_toggame_list', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_toggame_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProducttoggameList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_toggame = new ProducttoggameList({
        page: "toggamePage",
        loginUrl: "toggame_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_toggame_list.js.map