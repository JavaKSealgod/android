/**
 * 产品组件--开心彩登入
 */
import Global = require("../modules/global");
import ProductKXCLogin = require("../components/Product_KXC_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_kxc_login = new ProductKXCLogin();
new BaseShell();