/**
 * 首页，产品导航...
 */
define('T009/source/pages/homePage', ["require", "exports", "T009/source/modules/global", "T009/source/components/HomePage", "T009/source/modules/BaseShell"], function (require, exports, Global, HomePage, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var homePage = new HomePage();
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/homePage.js.map