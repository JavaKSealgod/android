/**
 * 线上存款回调页面
 */
import Global = require("../modules/global");
import MemberOnlineDepositMoneyCb = require("../components/Member_OnlineDepositMoney_Callback");
import BaseShell = require("../modules/BaseShell");

Global.App.init();

var onlineDepositMoneyCb = new MemberOnlineDepositMoneyCb();
new BaseShell();