/**
 * 产品组件--BNG电子产品列表
 */
import Global = require("../modules/global");
import ProductBNGGameList = require("../components/Product_BNGGame_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_BNGGame = new ProductBNGGameList({
    page: "BNGGamePage",
    loginUrl:"BNGGame_Login.html"
});
new BaseShell();