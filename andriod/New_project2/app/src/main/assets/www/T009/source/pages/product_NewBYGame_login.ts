/**
 * 产品组件--GT棋牌登入
 */
import Global = require("../modules/global");
import ProductNewBYGameLogin = require("../components/Product_NewBYGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_newbygame_login = new ProductNewBYGameLogin();
new BaseShell();