/**
 * 产品组件--WMGame产品系列
 */

import Global = require("../modules/global");
import ProductWMGame = require("../components/Product_WMGame_Login");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_WMGame = new ProductWMGame();
new BaseShell();
