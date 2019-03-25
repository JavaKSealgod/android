/**
 * GT真人铂金厅
 */

import Global = require("../modules/global");
import ProductLiveGameGTP1 = require("../components/Product_LiveGame_GT_P1");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

new ProductLiveGameGTP1();
new BaseShell();