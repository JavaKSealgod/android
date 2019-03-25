/**
 * 产品组件--OG娱乐城
 */

import Global = require("../modules/global");
import ProductOGGame = require("../components/Product_OGGame");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var productOGGameLogin = new ProductOGGame();

new BaseShell();

