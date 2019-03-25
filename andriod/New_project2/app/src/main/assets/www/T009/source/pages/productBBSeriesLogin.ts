/**
 * 产品组件--BB产品系列
 */

import Global = require("../modules/global");
import ProductBBSeries = require("../components/Product_BB_Series");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var product_BB_Series = new ProductBBSeries();
new BaseShell();
