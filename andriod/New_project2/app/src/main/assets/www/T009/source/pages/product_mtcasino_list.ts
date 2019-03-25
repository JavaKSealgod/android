/**
 * 产品组件--美天棋牌产品列表
 */
import Global = require("../modules/global");
import ProductMTCasinoList = require("../components/Product_MTCasino_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var mt_list = new ProductMTCasinoList({
    page: "MTCasinoPage",
    loginUrl:"MTCasino.html"
});
new BaseShell();

//搜索框样式事件
// $('input[type="search"]').on("focus", (e: Event)=>{
//     var target = e.target || e.srcElement;
//     $(target).parents(".mui-search").addClass("mui-active");
// });
//
// $('input[type="search"]').on("blur", (e: Event)=>{
//     var target = e.target || e.srcElement,
//         hasVal = $(target).val().trim() != "";
//
//     if(!hasVal){
//         $(target).parents(".mui-search").removeClass("mui-active");
//     }
// });
