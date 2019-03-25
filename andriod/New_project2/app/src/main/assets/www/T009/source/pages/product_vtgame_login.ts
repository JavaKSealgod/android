/**
 * 产品组件--VT电子登入
 */
import Global = require("../modules/global");
import ProductVTLogin = require("../components/Product_VTGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_vt_login = new ProductVTLogin();
new BaseShell();