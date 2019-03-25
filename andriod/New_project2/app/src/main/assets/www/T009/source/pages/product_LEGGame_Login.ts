/**
 * 产品组件--LEG棋牌产品系列
 */

import Global = require("../modules/global");
import ProductLEGGame = require("../components/Product_LEGGame_Login");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_LEGGame = new ProductLEGGame();
new BaseShell();
