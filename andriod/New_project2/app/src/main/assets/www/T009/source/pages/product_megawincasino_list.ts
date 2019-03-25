/**
 * 产品组件--FULI娱乐城产品列表
 */
import Global = require("../modules/global");
import ProductMegawinCasinoList = require("../components/Product_MegawinCasino_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_MegawinCasino = new ProductMegawinCasinoList({
	page: "MegawinCasinoPage",
	loginUrl:"MegawinCasino_Login.html"
});
new BaseShell();
