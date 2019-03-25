
/**
 * 会员中心--额度转换
 */

import Global = require("../modules/global");
import PocketTransfer = require("../components/Member_PocketTransfer");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var pocket_transfer = new PocketTransfer("pocket_transfer");
new BaseShell();