/**
 * 产品组件--toggame产品列表
 */
import Global = require("../modules/global");
import ProducttoggameList = require("../components/Product_toggame_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_toggame = new ProducttoggameList({
    page: "toggamePage",
    loginUrl:"toggame_Login.html"
});
new BaseShell();
