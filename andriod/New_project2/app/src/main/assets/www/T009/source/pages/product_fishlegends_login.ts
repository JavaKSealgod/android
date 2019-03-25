/**
 * 产品组件--捕鱼传奇
 */
import Global = require("../modules/global");
import Product_FishLegends_Login = require("../components/Product_FishLegends_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_fishlegends_login = new Product_FishLegends_Login();
new BaseShell();