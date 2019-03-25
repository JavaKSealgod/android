/**
 * 产品组件--开元棋牌产品列表
 */
import Global = require("../modules/global");
import ProductKYGameList = require("../components/Product_KYGame_List_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_KYGame = new ProductKYGameList({
    page: "KYGamePage",
    loginUrl:"KYGame_Login.html"
});
new BaseShell();
