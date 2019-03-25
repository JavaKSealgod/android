/**
 * 会员忘记密码页面
 */
define('T009/source/pages/forgetPassword', ["require", "exports", "T009/source/modules/global", "T009/source/components/Member_ForgetPassword", "T009/source/modules/BaseShell"], function (require, exports, Global, ForgetPassword, BaseShell) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Global.App.init();
    var member_forgetpassword = new ForgetPassword("member_forgetpassword");
    new BaseShell();
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/pages/forgetPassword.js.map