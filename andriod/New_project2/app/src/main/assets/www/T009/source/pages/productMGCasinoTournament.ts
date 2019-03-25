/**
 * 新MG擂台赛
 */

import Global = require("../modules/global");
import ProductMGTournament = require("../components/Product_MGCasino_Tournament");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var product_mg_tournament = new ProductMGTournament();

new BaseShell();

