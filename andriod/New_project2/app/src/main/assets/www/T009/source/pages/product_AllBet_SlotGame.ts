/**
 * 产品组件--欧博电子
 */
import Global = require("../modules/global");
import Product_AllBet_SlotGame = require("../components/Product_AllBet_SlotGame");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var productAllBetSlotGame = new Product_AllBet_SlotGame();
new BaseShell();
