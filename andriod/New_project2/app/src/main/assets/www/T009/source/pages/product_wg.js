define('T009/source/pages/product_wg', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_WG_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductWGList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_wg_list = new ProductWGList({
        page: "winGamingPage",
        loginUrl: "WG_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_wg.js.map