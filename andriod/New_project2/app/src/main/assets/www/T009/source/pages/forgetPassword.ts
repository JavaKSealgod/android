/**
 * 会员忘记密码页面
 */

import Global = require("../modules/global");
import ForgetPassword = require("../components/Member_ForgetPassword");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var member_forgetpassword = new ForgetPassword("member_forgetpassword");
new BaseShell();