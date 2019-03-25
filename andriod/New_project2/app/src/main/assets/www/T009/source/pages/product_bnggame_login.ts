/**
 * 产品组件--BNG电子登入
 */
import Global = require("../modules/global");
import ProductBNGLogin = require("../components/Product_BNGGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_bng_login = new ProductBNGLogin();
new BaseShell();