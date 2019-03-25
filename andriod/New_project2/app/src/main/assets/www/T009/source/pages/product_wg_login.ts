/**
 * 产品--WG电子游戏登录页
 */
import Global = require("../modules/global");
import ProductWGLogin = require("../components/Product_WG_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_wg_login = new ProductWGLogin();
new BaseShell();

//header后退按钮
// $("[data-cashap-id=backward]").on("tap", function(){
// 	Global.App.backWard();
// });

