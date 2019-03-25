/**
 * 产品组件--沙巴体育产品登入
 */
import Global = require("../modules/global");
import ProductSBSportLogin = require("../components/Product_SBSport_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_sbsport_login = new ProductSBSportLogin();
new BaseShell();
