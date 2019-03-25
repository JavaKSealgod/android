/**
 * 产品组件--GM棋牌产品系列
 */

import Global = require("../modules/global");
import ProductGMGame = require("../components/Product_GMGame_Login");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_GMGame = new ProductGMGame();
new BaseShell();
