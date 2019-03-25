/**
 * 产品组件--DS捕鱼
 */
import Global = require("../modules/global");
import Product_Dsbygame_Login = require("../components/Product_Dsbygame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_dsbygame_login = new Product_Dsbygame_Login();
new BaseShell();