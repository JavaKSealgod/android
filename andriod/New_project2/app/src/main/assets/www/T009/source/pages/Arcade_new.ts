/**
 * 捕鱼大厅游戏列表
 */
import Global = require("../modules/global");
import ArcadeList = require("../components/Product_Arcade_new");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var arcadeList = new ArcadeList();

new BaseShell();

