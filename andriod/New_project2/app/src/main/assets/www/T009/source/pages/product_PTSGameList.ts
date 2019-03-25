/**
 * 产品组件--PTSGame电子系列产品列表
 */
import Global = require("../modules/global");
import ProductPTSGameList = require("../components/Product_PTSGame_List");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_ptsgame = new ProductPTSGameList({
	page: "PTSGamePage",
	loginUrl:"PTSGame_Login.html"
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
