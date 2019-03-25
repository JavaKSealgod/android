define('T009/source/pages/product_megawincasino_list', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_MegawinCasino_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductMegawinCasinoList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_MegawinCasino = new ProductMegawinCasinoList({
        page: "MegawinCasinoPage",
        loginUrl: "MegawinCasino_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_megawincasino_list.js.map