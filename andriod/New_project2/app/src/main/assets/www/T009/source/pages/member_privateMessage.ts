/**
 * 会员个人私信
 */
import Global = require("../modules/global");
import person_message = require("../components/Member_PrivateMessage");
import BaseShell = require("../modules/BaseShell");
Global.App.init();

var p_mess = new person_message();
new BaseShell();