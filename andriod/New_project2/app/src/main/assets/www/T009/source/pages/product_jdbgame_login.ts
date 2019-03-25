/**
 * 产品组件--加多宝产品登入
 */
import Global = require("../modules/global");
import ProductJDBGameLogin = require("../components/Product_JDBGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_jdbgame_login = new ProductJDBGameLogin();
new BaseShell();

