/**
 * 产品组件--GT棋牌产品列表
 */
import Global = require("../modules/global");
import ProductNewBYGameList = require("../components/Product_NewBYGame_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_newbygame = new ProductNewBYGameList({
    page: "NewBYGamePage",
    loginUrl:"NewBYGame_Login.html"
});
new BaseShell();
