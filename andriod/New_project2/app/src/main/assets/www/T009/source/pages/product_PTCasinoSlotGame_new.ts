/**
 * 产品组件--PT电子游戏
 */
import Global = require("../modules/global");
import ProductPTCasinoSlotGame = require("../components/Product_PTCasino_SlotGame_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_ptcasino_slotgame = new ProductPTCasinoSlotGame({
	page: "PTCasinoSlotGamePage",
	loginUrl: "PTCasino_SlotGame_Login.html"
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
