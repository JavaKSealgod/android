/**
 * 首页，产品导航...
 */

import Global = require("../modules/global");
import HomePage = require("../components/HomePage");
import BaseShell = require("../modules/BaseShell");



Global.App.init();

var homePage = new HomePage();

new BaseShell();