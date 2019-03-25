/**
 * 产品组件--新MG真人
 */
import Global = require("../modules/global");
import ProductMGCasinoLiveGame = require("../components/Product_MGCasino_LiveGame");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var productMGCasinoLogin = new ProductMGCasinoLiveGame();
new BaseShell();
