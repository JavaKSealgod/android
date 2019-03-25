/**
 * 产品组件--VG娱乐城产品列表
 */
import Global = require("../modules/global");
import ProductVGGameList = require("../components/Product_VGGame_List_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_VGGame = new ProductVGGameList({
    page: "VGGamePage",
    loginUrl:"VGGame_Login.html"
});
new BaseShell();
