/**
 * 产品组件--SGGame电子系列产品登入
 */
import Global = require("../modules/global");
import ProductSGGameLogin = require("../components/Product_SGGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_sggame_login = new ProductSGGameLogin();
new BaseShell();

