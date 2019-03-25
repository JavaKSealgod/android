/**
 * 产品组件--美天棋牌登入
 */
import Global = require("../modules/global");
import ProductMTLogin = require("../components/Product_MTCasino_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_mt_login = new ProductMTLogin();
new BaseShell();