/**
 * 产品组件--PTSGame电子系列产品登入
 */
import Global = require("../modules/global");
import ProductPTSGameLogin = require("../components/Product_PTSGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_ptsgame_login = new ProductPTSGameLogin();
new BaseShell();

