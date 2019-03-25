/**
 * 产品组件--传奇产品登入
 */
import Global = require("../modules/global");
import ProductCQCasinoLogin = require("../components/Product_CQCasino_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_cqcasino_login = new ProductCQCasinoLogin();
new BaseShell();
