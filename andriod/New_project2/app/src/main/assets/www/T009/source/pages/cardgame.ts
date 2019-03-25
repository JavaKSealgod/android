/**
 * 棋牌大厅游戏列表
 */
import Global = require("../modules/global");
import CardGame = require("../components/CardGame");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var cardgame = new CardGame();

new BaseShell();

