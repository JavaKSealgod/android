define('T009/source/pages/product_wg_login', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_WG_Login", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductWGLogin, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_wg_login = new ProductWGLogin();
    new BaseShell();
});
//header后退按钮
// $("[data-cashap-id=backward]").on("tap", function(){
// 	Global.App.backWard();
// });
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_wg_login.js.map