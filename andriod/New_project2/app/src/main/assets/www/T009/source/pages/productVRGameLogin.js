/**
 * 产品组件--VR彩票产品
 */
define('T009/source/pages/productVRGameLogin', ["require", "exports", "T009/source/modules/global", "T009/source/components/Product_VRGame_Login", "T009/source/modules/BaseShell"], function (require, exports, Global, ProductVRGameLogin, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var product_vrgame_login = new ProductVRGameLogin();
    new BaseShell();
});
//header后退按钮
// $("[data-cashap-id=backward]").on("tap", function(){
// 	Global.App.backWard();
// }); 
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/productVRGameLogin.js.map