define('T009/source/modules/swiperConfig', ["require", "exports", "handlebars", "Global/libs/swiper"], function (require, exports, Handlebars, Swiper) {
    "use strict";
    var bannerConfig = /** @class */ (function () {
        function bannerConfig() {
            var _this = this;
            this.SidelTplVelDom = '[data-cashap-id="SwiperItemContainer"]';
            this.tplDom = '[data-cashap-id="slideItemTpl"]';
            this.nextEl = '.swiper-button-next';
            this.prevEl = '.swiper-button-prev';
            this.paginationEl = '.swiper-pagination';
            var configs;
            var gethtmljson = $('[data-cashap-id="slideConfig"]').text();
            if (gethtmljson == '' || gethtmljson == undefined || gethtmljson == null) {
                console.log('缺少数据');
                return;
            }
            try {
                configs = JSON.parse($('[data-cashap-id="slideConfig"]').text());
            }
            catch (err) {
                console.log("swiperComponent " + err);
                return;
            }
            var SwiperVel = [];
            configs.forEach(function (configelement, index) {
                console.log("bannerConfig is init " + (index + 1));
                //补齐属性对应值
                configelement.ImgConfig.forEach(function (imgItem, idx) {
                    //补齐属性，防止后面判断问题
                    if (!imgItem.hasOwnProperty("href")) {
                        imgItem.href = "";
                    }
                    imgItem["target"] = imgItem.target == "" ? "target=\"_self\"" : "target=" + imgItem.target;
                    //链接为空时，不添加target属性
                    if (imgItem.href == "") {
                        imgItem["target"] = "";
                    }
                    imgItem.href == "" ? imgItem.href = "javascript:void(0);" : "";
                    configelement.ImgConfig[idx] = imgItem;
                });
                // this.init(configelement);
                // SwiperVel.push( new Swiper(configelement.tarDom,configelement.swiperConfig) );
                if ($(configelement.tarDom).length > 0) {
                    _this.init(configelement);
                    SwiperVel.push(new Swiper(configelement.tarDom, configelement.swiperConfig));
                }
                else {
                    console.log('没有找到tarDom ', configelement.tarDom);
                }
            });
        }
        bannerConfig.prototype.init = function (configData) {
            var _this = this;
            if (!configData.hasOwnProperty('tarDom')) {
                console.log("找不到轮播图容器");
                return;
            }
            if (configData.ImgConfig.length == 0) {
                console.log('缺少数据');
                return false;
            }
            this.setHtml($(configData.tarDom), configData.ImgConfig, $(this.tplDom).html());
            setTimeout(function () {
                if (configData.swiperConfig.hasOwnProperty('pagination')) {
                    console.log("show pagination");
                    $(configData.tarDom).find(_this.paginationEl).removeClass('hide');
                }
                if (configData.swiperConfig.hasOwnProperty('navigation')) {
                    console.log("show navigation");
                    $(configData.tarDom).find(_this.nextEl).removeClass('hide');
                    $(configData.tarDom).find(_this.prevEl).removeClass('hide');
                }
            }, 200);
        };
        /**
         * 创建html结构
         */
        bannerConfig.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        ;
        return bannerConfig;
    }());
    var popUpConfig = /** @class */ (function () {
        function popUpConfig() {
            var _this = this;
            this.tplDom = '[data-cashap-id="popUpTpl"]';
            //弹窗
            this.popUpContainer = '[data-cashap-id="popUpContainer"]';
            this.popUpClose = '[data-cashap-id="popUpClose"]';
            var configs, gethtmljson = $('[data-cashap-id="popUpConfig"]').text(), getSession = sessionStorage.getItem("popUpIsRead") === "true" ? true : false;
            if (getSession) {
                return;
            }
            if (gethtmljson == '' || gethtmljson == undefined || gethtmljson == null) {
                console.log('缺少数据');
                return;
            }
            try {
                configs = JSON.parse($('[data-cashap-id="popUpConfig"]').text());
            }
            catch (err) {
                console.log("popUpComponent " + err);
                return;
            }
            var popUpVel = [];
            configs.forEach(function (configelement, index) {
                console.log("popUpConfig is init " + (index + 1));
                //补齐属性对应值
                configelement.ImgConfig.forEach(function (imgItem, idx) {
                    //补齐属性，防止后面判断问题
                    if (!imgItem.hasOwnProperty("href")) {
                        imgItem.href = "";
                    }
                    imgItem["target"] = imgItem.target == "" ? "target=\"_self\"" : "target=" + imgItem.target;
                    //链接为空时，不添加target属性
                    if (imgItem.href == "") {
                        imgItem["target"] = "";
                    }
                    imgItem.href == "" ? imgItem.href = "javascript:void(0);" : "";
                    configelement.ImgConfig[idx] = imgItem;
                });
                if ($(configelement.tarDom).length > 0) {
                    _this.init(configelement);
                }
                else {
                    console.log('没有找到tarDom ', configelement.tarDom);
                }
            });
        }
        popUpConfig.prototype.init = function (configData) {
            var _this = this;
            if (!configData.hasOwnProperty('tarDom')) {
                console.log("找不到弹窗容器");
                return;
            }
            if (configData.ImgConfig.length == 0) {
                console.log('缺少数据');
                return false;
            }
            if (configData.iframeHref.length > 0) {
                configData.hasIfame = true;
                this.setHtml($(configData.tarDom), configData, $(this.tplDom).html());
            }
            else {
                configData.hasIfame = false;
                this.setHtml($(configData.tarDom), configData.ImgConfig, $(this.tplDom).html());
            }
            $(configData.tarDom).removeClass("hide");
            //弹窗关闭按钮事件
            $(this.popUpClose).on("click", function (e) {
                e.preventDefault();
                sessionStorage.setItem("popUpIsRead", "true");
                $(_this.popUpContainer).addClass("hide");
            });
        };
        /**
         * 创建html结构
         */
        popUpConfig.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        ;
        return popUpConfig;
    }());
    new bannerConfig();
    new popUpConfig();
    return { bannerConfig: bannerConfig, popUpConfig: popUpConfig };
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/modules/swiperConfig.js.map