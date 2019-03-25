define('T009/source/components/Promotion', ["require", "exports", "T009/source/modules/global", "handlebars", "Global/libs/zepto.picLazyLoad"], function (require, exports, Global, Handlebars) {
    "use strict";
    var Promotion = /** @class */ (function () {
        function Promotion() {
            this.PromotionConfigDom = '[data-cashap-id="promotionConfig"]';
            this.CatalogTitTpl = '[data-cashap-id="CatalogTitTpl"]';
            this.PromotionItemTpl = '[data-cashap-id="PromotionItemTpl"]';
            this.PromotionLinkTpl = '[data-cashap-id="PromotionLinkTpl"]';
            // 分类标题容器
            this.CatalogTitContent = '[data-cashap-id="CatalogItemContainer"]';
            // 分类标题
            this.CatalogTit = '[data-cashap-id="CatalogTit"]';
            // 暂无优惠活动
            this.NoPromotion = '[data-cashap-id="NoPromotion"]';
            // 优惠活动容器
            this.PromotionContent = '[data-cashap-id="PromotionItemContainer"]';
            // 优惠活动
            this.PromotionItem = '[data-cashap-id="promotion_item"]';
            // 优惠活动 预览图容器
            this.PromotionPrew = '[data-cashap-id="promotion_prew"]';
            // 优惠活动关闭按钮
            this.Promotion_CloseBtn = '[data-cashap-id="promotion_close"]';
            // 优惠活动链接容器
            this.PromotionLinkContainer = '[data-cashap-id="PromotionLinkContainer"]';
            this.lazyloadItem = '[data-cashap-id="lazyload"]';
            this.scrollContainer = '[data-cashap-id="scrollContainer"]';
            this.scrollContainer = this.PromotionContent;
            try {
                //显示系统loading
                Global.Tips.showSystemLoading();
                if (JSON.parse($(this.PromotionConfigDom).text()) == "") {
                    $(this.NoPromotion).removeClass('hide');
                    $(this.CatalogTitContent).addClass('hide');
                    $(this.PromotionContent).addClass("hide");
                    Global.Tips.hideSystemLoading();
                }
                else {
                    $(this.PromotionContent).removeClass("hide");
                    $(this.CatalogTitContent).removeClass('hide');
                    var temp_CatalogList_1 = JSON.parse($(this.PromotionConfigDom).text());
                    var temp_PromotionList = temp_CatalogList_1.Promotion;
                    // 根据temp_CatalogList.CatalogSort的顺序重新排列分类
                    var tempres_1 = [];
                    temp_CatalogList_1.CatalogSort.forEach(function (SortEle) {
                        temp_CatalogList_1.CatalogList.forEach(function (CatalogEle) {
                            if (SortEle == CatalogEle.CatalogId) {
                                tempres_1.push(CatalogEle);
                            }
                        });
                    });
                    this.CatalogList = tempres_1.slice(0);
                    this.PromotionList = temp_PromotionList.slice(0);
                    this.init();
                }
            }
            catch (err) {
                Global.Tips.hideSystemLoading();
                $(this.PromotionContent).addClass("hide");
                $(this.CatalogTitContent).addClass('hide');
                $(this.NoPromotion).removeClass('hide');
                console.log("get config error: " + err);
                return;
            }
        }
        Promotion.prototype.init = function () {
            var _this = this;
            Global.Log.log("Promotion.init");
            this.setHtml($(this.CatalogTitContent), this.CatalogList, $(this.CatalogTitTpl).html());
            // 根据分类数量创建 活动内容的容器
            this.CatalogList.forEach(function (element, index) {
                var theIndex = index;
                $(_this.PromotionContent).prepend('<div class="PromotionList hide" ></div>');
                setTimeout(function () {
                    var res = [];
                    element.PromotionList.forEach(function (CatalogEle) {
                        _this.PromotionList.forEach(function (PromotionEle) {
                            if (PromotionEle.PromotionId == CatalogEle) {
                                res.push(PromotionEle);
                            }
                        });
                    });
                    var promotionDom = $(_this.PromotionContent).find('.PromotionList').eq(theIndex);
                    _this.setHtml(promotionDom, res, $(_this.PromotionItemTpl).html());
                    res.forEach(function (PromotionLink, IndexPromotion) {
                        var LinkDom = promotionDom.find(_this.PromotionItem).eq(IndexPromotion).find(_this.PromotionLinkContainer);
                        _this.setHtml(LinkDom, PromotionLink.PromoLinks, $(_this.PromotionLinkTpl).html());
                    });
                }, 0);
            });
            // 分类切换事件绑定
            $(this.CatalogTitContent).delegate(this.CatalogTit, "click", function (e) {
                if (e)
                    e.preventDefault();
                $(_this.CatalogTit).removeClass("active");
                $('.PromotionList').addClass("hide");
                if (!$(e.currentTarget).hasClass("active")) {
                    $(e.currentTarget).addClass("active");
                    _this.CatalogList.forEach(function (element, index) {
                        if (element.CatalogId == $(e.currentTarget).attr('data-value-catalogid')) {
                            $(_this.PromotionContent).find('.PromotionList').eq(index).removeClass('hide');
                            if ($(_this.PromotionContent).find('.PromotionList').eq(index).attr('data-newpicLazyLoad-id') == undefined) {
                                // 依据'data-newpicLazyLoad-id' 这个属性是否存在创建picLazyLoad 
                                $(_this.PromotionContent).find('.PromotionList').eq(index).attr('data-newpicLazyLoad-id', 'true');
                                setTimeout(function () {
                                    $(_this.PromotionContent).find('.PromotionList').eq(index).find(_this.lazyloadItem).picLazyLoad({ scrollContainer: _this.scrollContainer, event: "click", threshold: 100, placeholder: "" });
                                }, 0);
                            }
                        }
                    });
                }
            });
            // 活动预览事件绑定
            $(this.PromotionContent).delegate(this.PromotionPrew, "click", function (e) {
                if (e)
                    e.preventDefault();
                _this.toggleDetail($(e.currentTarget));
            });
            $(this.PromotionContent).delegate(this.Promotion_CloseBtn, "click", function (e) {
                if (e)
                    e.preventDefault();
                _this.ClosePromotion($(e.currentTarget));
            });
            $(this.CatalogTit).first().trigger("click");
            if (this.CatalogList.length == 1) {
                // 没有分类
                $(this.PromotionContent).css('width', '100%');
                $(this.CatalogTitContent).addClass('hide');
            }
            // 没有优惠活动时候隐藏所有
            if (this.PromotionList.length == 0) {
                $(this.NoPromotion).removeClass('hide');
                $(this.CatalogTitContent).addClass('hide');
                $(this.PromotionContent).addClass("hide");
            }
            Global.Tips.hideSystemLoading();
        };
        ;
        Promotion.prototype.toggleDetail = function ($target) {
            var par = $target.parents(this.PromotionItem);
            if (par.length == 0) {
                return;
            }
            var tempImgDom = par.find('[data-cashap-id="promotion_cont"] img');
            if (tempImgDom.attr('src') != "") {
                var src = tempImgDom.attr('data-original');
                tempImgDom.attr('src', src);
            }
            if (par.hasClass("active")) {
                par.removeClass("active");
            }
            else {
                par.addClass("active");
            }
        };
        Promotion.prototype.ClosePromotion = function ($target) {
            var par = $target.parents(this.PromotionItem);
            if (par.length == 0) {
                return;
            }
            par.removeClass("active");
        };
        /**
         * 创建html结构
         */
        Promotion.prototype.setHtml = function (target, data, tpl) {
            var template = Handlebars.compile(tpl), html = template(data);
            target.html(html);
        };
        ;
        return Promotion;
    }());
    return Promotion;
});
//# sourceMappingURL=/SGMobile_H5App_V1/T009/source/components/Promotion.js.map