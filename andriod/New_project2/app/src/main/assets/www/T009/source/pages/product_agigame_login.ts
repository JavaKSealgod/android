/**
 * 产品组件--AGI电子登入
 */
import Global = require("../modules/global");
import ProductAGILogin = require("../components/Product_AGIGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_agi_login = new ProductAGILogin();
new BaseShell();