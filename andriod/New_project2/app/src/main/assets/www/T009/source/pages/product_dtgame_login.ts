/**
 * 产品组件--DT 电子产品列表
 */
import Global = require("../modules/global");
import ProductDTLogin = require("../components/Product_DTGame_Login");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

new ProductDTLogin();
new BaseShell();