/**
 * 产品组件--传奇产品列表
 */
import Global = require("../modules/global");
import ProductCQCasinoList = require("../components/Product_CQCasino_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_cqcasino = new ProductCQCasinoList({
	page: "CQCasinoPage",
	loginUrl:"CQCasino_Login.html"
});
new BaseShell();

//搜索框样式事件
$('input[type="search"]').on("focus", (e: Event)=>{
	var target = e.target || e.srcElement;
	$(target).parents(".search").addClass("active");
});

$('input[type="search"]').on("blur", (e: Event)=>{
	var target = e.target || e.srcElement,
		hasVal = $(target).val().trim() != "";

	if(!hasVal){
		$(target).parents(".search").removeClass("active");
	}
});

//header后退按钮
// $("[data-cashap-id=backward]").on("click", function(){
// 	Global.App.backWard();
// });