/**
 * 产品维护状态--站点状态维护
 */
define('T009/source/components/Status_SiteMaintenance', ["require", "exports", "T009/source/modules/global", "Global/source/modules/api"], function (require, exports, Global, Api) {
    "use strict";
    var Status_SiteMaintenance = /** @class */ (function () {
        function Status_SiteMaintenance() {
            this.maintenanceInfo = '[data-cashap-id="maintenanceInfo"]';
            this.cs_link = '[data-cashap-id="CSContainer"]';
            this.init();
        }
        Status_SiteMaintenance.prototype.init = function () {
            var _this = this;
            Api.message.site_message()
                .done(function (result) {
                if (result.hasOwnProperty("site")) {
                    if (result.site.state) {
                        $(_this.maintenanceInfo).html(result.site.info["zh-cn"]);
                        return;
                    }
                }
                window.location.replace(Com_Gametree_Cashap.SiteConfig.HomePageUrl);
            });
            this.setCSLink();
        };
        Status_SiteMaintenance.prototype.setCSLink = function () {
            var data = Global.App.cs_data_filter(Global.App.fix_cs_data(window["cs_data"] || []));
            if (data.length > 0) {
                $(this.cs_link).removeClass("hide");
                $(this.cs_link).find("a").attr("href", data[0].Url);
            }
        };
        return Status_SiteMaintenance;
    }());
    return Status_SiteMaintenance;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Status_SiteMaintenance.js.map