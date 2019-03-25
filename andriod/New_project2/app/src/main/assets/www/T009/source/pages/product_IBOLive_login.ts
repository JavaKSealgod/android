/**
 * 产品组件--IBO真人娱乐
 */

import Global = require("../modules/global");
import ProductIBOLive = require("../components/Product_IBOLive");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var productIBOLiveLogin = new ProductIBOLive();

new BaseShell();

