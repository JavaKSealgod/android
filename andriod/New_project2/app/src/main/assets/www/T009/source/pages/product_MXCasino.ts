/**
 * 产品组件--MX真人娱乐
 */
import Global = require("../modules/global");
import Product_MXCasino_LiveGame = require("../components/Product_MXCasino_LiveGame");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var Product_MXGame = new Product_MXCasino_LiveGame();
new BaseShell();
