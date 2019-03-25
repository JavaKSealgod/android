/**
 * 产品组件--加多宝产品列表
 */
import Global = require("../modules/global");
import ProductJDBGameList = require("../components/Product_JDBGame_List_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_JDBGame = new ProductJDBGameList({
	page: "JDBGamePage",
	loginUrl:"JDBGame_Login.html"
});
new BaseShell();
