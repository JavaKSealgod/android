/**
 * 产品--新MG电子游戏
 */
import Global = require("../modules/global");
import ProductMGCasinoSlotGame = require("../components/Product_MGCasino_SlotGame");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_mgcasino_slotgame = new ProductMGCasinoSlotGame({
	page: "mgCasinoSlotGamePage",
	loginUrl: "MGCasino_SlotGame_Login.html",
	imgFolder:"//image888.flc168.net/mgmobile/"//"http://image888.flc168.net/newMGPIC/"//http://image888.flc168.net/mgmobile/BTN_WinSumDimSum_ZH.png
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
