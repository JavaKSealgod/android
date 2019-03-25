/**
 * 产品组件--DT 电子产品列表
 */
import Global = require("../modules/global");
import ProductDTList = require("../components/Product_DTGame_List_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

new ProductDTList({
    loginUrl:"DTGame_Login.html"
});
new BaseShell();