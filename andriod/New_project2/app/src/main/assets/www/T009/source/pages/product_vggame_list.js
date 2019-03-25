define('T009/source/pages/product_vggame_list', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_VGGame_List", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductVGGameList, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_VGGame = new ProductVGGameList({
        page: "VGGamePage",
        loginUrl: "VGGame_Login.html"
    });
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/product_vggame_list.js.map