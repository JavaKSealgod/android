/**
 * 产品组件--开元棋牌登入
 */
import Global = require("../modules/global");
import ProductKygLogin = require("../components/Product_KYGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_kyg_login = new ProductKygLogin();
new BaseShell();