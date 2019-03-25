/**
 * 产品组件--玛雅娱乐城
 */
import Global = require("../modules/global");
import Product_MYGame_LiveGame = require("../components/Product_MYGame_LiveGame");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var Product_MYGame = new Product_MYGame_LiveGame();
new BaseShell();
