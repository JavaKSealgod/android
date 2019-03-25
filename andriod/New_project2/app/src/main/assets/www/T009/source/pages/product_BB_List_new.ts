/**
 * 产品组件--BB电子系列产品列表
 */
import Global = require("../modules/global");
import ProductBBList = require("../components/Product_BB_List_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_bb = new ProductBBList({
	page: "BBGamePage",
	loginUrl:"bbin.html"
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
