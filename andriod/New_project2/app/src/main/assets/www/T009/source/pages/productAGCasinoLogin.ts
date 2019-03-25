/**
 * 产品组件--新MG真人
 */
import Global = require("../modules/global");
import ProductAGCasino = require("../components/Product_AGCasino");
import BaseShell = require("../modules/BaseShell");
Global.App.init();




var productAGCasinoLogin = new ProductAGCasino({game:"lobby"});
new BaseShell();

