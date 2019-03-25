
/**
 * 产品组件--VR彩票产品
 */

import Global = require("../modules/global");
import ProductVRGameLogin = require("../components/Product_VRGame_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_vrgame_login = new ProductVRGameLogin();
new BaseShell();


//header后退按钮
// $("[data-cashap-id=backward]").on("tap", function(){
// 	Global.App.backWard();
// });