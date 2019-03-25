
/**
 * 产品--WG电子游戏
 */
import Global = require("../modules/global");
import ProductWGList = require("../components/Product_WG_List_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_wg_list = new ProductWGList({
	page: "winGamingPage",
	loginUrl: "WG_Login.html"
});
new BaseShell();
