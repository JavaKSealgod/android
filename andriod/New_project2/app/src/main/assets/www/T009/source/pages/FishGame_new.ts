/**
 * 捕鱼大厅游戏列表
 */
import Global = require("../modules/global");
import FishGameList = require("../components/Product_FishGame_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var fishGameList = new FishGameList();

new BaseShell();

