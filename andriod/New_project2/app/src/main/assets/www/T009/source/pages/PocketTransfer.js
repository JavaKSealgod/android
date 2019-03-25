/**
 * 会员中心--额度转换
 */
define('T009/source/pages/PocketTransfer', ["require", "exports", "T009/source/modules/global", "T009/source/components/Member_PocketTransfer", "T009/source/modules/BaseShell"], function (require, exports, Global, PocketTransfer, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var pocket_transfer = new PocketTransfer("pocket_transfer");
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/PocketTransfer.js.map