/**
 * 产品组件--PG电子登入
 */
import Global = require("../modules/global");
import ProductPGLogin = require("../components/Product_PGGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_pg_login = new ProductPGLogin();
new BaseShell();