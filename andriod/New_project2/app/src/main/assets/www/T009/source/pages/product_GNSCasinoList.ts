/**
 * 产品组件--GNS电子产品列表
 */
import Global = require("../modules/global");
import ProductGNSCasinoList = require("../components/Product_GNSCasino_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_GNSCasino = new ProductGNSCasinoList({
	page: "GNSCasinoPage",
	loginUrl:"GNSCasino_Login.html"
});
new BaseShell();

//搜索框样式事件
$('input[type="search"]').on("focus", (e: Event)=>{
	var target = e.target || e.srcElement;
	$(target).parents(".mui-search").addClass("mui-active");
});

$('input[type="search"]').on("blur", (e: Event)=>{
	var target = e.target || e.srcElement,
		hasVal = $(target).val().trim() != "";

	if(!hasVal){
		$(target).parents(".mui-search").removeClass("mui-active");
	}
});

//header后退按钮
// $("[data-cashap-id=backward]").on("click", function(){
// 	Global.App.backWard();
// });