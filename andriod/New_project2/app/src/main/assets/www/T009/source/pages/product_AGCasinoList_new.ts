/**
 * 产品组件--agcasino电子系列产品列表
 */
import Global = require("../modules/global");
import ProductAGCasinoList = require("../components/Product_AGCasino_List_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_agcasino = new ProductAGCasinoList({
	page: "AGCasinoPage",
	loginUrl:"AGCasino.html"
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

