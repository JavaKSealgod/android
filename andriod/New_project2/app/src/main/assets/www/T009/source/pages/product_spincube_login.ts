/**
 * 产品组件--SpinCube 电子
 */
import Global = require("../modules/global");
import Product_SpinCube = require("../components/Product_SpinCube_Login");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var productSpinCube = new Product_SpinCube();
new BaseShell();