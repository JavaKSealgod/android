/**
 * 产品组件--toggame登入
 */
import Global = require("../modules/global");
import ProducttoggameLogin = require("../components/Product_toggame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_toggame_login = new ProducttoggameLogin();
new BaseShell();