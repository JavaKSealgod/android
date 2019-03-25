/**
 * 产品组件--GNS电子产品登入
 */
import Global = require("../modules/global");
import ProductGNSCasinoLogin = require("../components/Product_GNSCasino_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_gns_login = new ProductGNSCasinoLogin();

new BaseShell();
