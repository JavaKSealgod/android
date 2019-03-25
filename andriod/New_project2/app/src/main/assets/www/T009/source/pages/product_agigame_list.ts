/**
 * 产品组件--AGI电子产品列表
 */
import Global = require("../modules/global");
import ProductAGIGameList = require("../components/Product_AGIGame_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_AGIGame = new ProductAGIGameList({
    page: "AGIGamePage",
    loginUrl:"AGIGame_Login.html"
});
new BaseShell();
