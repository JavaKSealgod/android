/**
 * 线上取款（我要取款）
 */
import Global = require("../modules/global");
import Api = require("../../../Global/source/modules/api");
import Handlebars = require("handlebars");
import iSlider = require("iSlider");

class withdrawalPage {
	formName: string;
	formElement: JQuery;

	messageNS = "Member_DrawingsApply";

	formInputElement = {
		money:"input[name=money]",
		telphone:"input[name=telphone]",
		drawingsPassword:"input[name=drawingsPassword]",

		paymentBank:"input[name=paymentBank]",          //++++++++++++++++++
		bankAccount:"input[name=bankAccount]",
		bankNumber:"input[name=bankNumber]",
		bankProvince:"input[name=bankProvince]",
		subbranch:"input[name=subbranch]",
		bankAddress:"input[name=bankAddress]",
		alipayAccount:"input[name=alipayAccount]",
		alipayNickName:"input[name=alipayNickName]"
	};

	//freeDrawingsApply=true 表示当前可以免费取款
	freeDrawingsApply = true;

	account = '[data-cashap-id="account"]';
	drawingMoneyMin = '[data-cashap-id="drawingMoneyMin"]';
	drawingMoneyMax = '[data-cashap-id="drawingMoneyMax"]';

	drawings_money_info;

	bank_list = [];
	bankList = '[data-cashap-id="bankList"]';
	bankItem = '[data-cashap-id="bankItem"]';
	bankGroupTpl = '[data-cashap-id="bankGroupTpl"]';
	
	//虚拟的下拉银行列表按钮
	bankListInput = '[data-cashap-id="bankListInput"]';

    //已选择银行的银行名称
    selectedBankName = '[data-cashap-id="bank-name"]';

    bankcheckedText = '[data-cashap-id="bankcheckedText"]';
	bankPannal = '[data-cashap-id="bankPannal"]';
	bankPannalCloseBtn = '[data-cashap-id="bankPannalCloseBtn"]';

	//用户选择的支付银行
	paymentBankVal = null;

	isSubmitting = false;

	submitBtn = '[data-cashap-id="submitBtn"]';

    //是否显示“联系电话”。0=隐藏，1=显示
    requireDrawPhone = 0;

    isAllRequireDataReady = {
    	drawInfo: false,
		bankList: false
	};


	constructor(formName?: string){
		this.formName = formName = "member_drawingapply";
		this.formElement = $('[name="' + formName + '"]');

		this.init();
	}

	init() {
		//判断是否未登录，若是则返回退出继续执行
		if(!Global.App.isLogin()){
            Global.Tips1.show({
                tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                tipsContentTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "noLogin"),
                leftbtnShow: true,
                leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                leftbtnfunction: ()=>{
                    window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
                    Global.Tips1.hide();
                }
            });
			return;
		}

        //默认隐藏“联系电话”项
        $(this.formElement).find(this.formInputElement.telphone).parent().addClass("hide");

		//显示系统loading，全部数据加载完毕后隐藏该loading，取款银行列表读取完毕后才隐藏系统loading
		Global.Tips.showSystemLoading();

		//读取profile_baseInfo设置账户名称及账户余额
		Api.account.profile_baseInfo(true)
			.done((baseInfo: IProfile_BaseInfo)=>{
				$(this.account).html(baseInfo.account);

				if(baseInfo.memberLevel == Global.MemberLevel.trial){
					//隐藏系统loading
					Global.Tips.hideSystemLoading();

					//提示仅提供正式会员操作
                    Global.Tips1.show({
                        tipsTit:(<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "SystemTips"),
                        tipsContentTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "onlyMember"),
                        leftbtnShow: true,
                        leftbtnTxt: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
                        leftbtnfunction: ()=>{
                            window.location.href = Com_Gametree_Cashap.SiteConfig.LoginUrl;
                            Global.Tips1.hide();
                        }
                    });
				}
				else {
					this.afterInit();
				}
			});

		Global.Log.log("Member_DrawingsApply.init");
	}

	oneDataReady(key){
		this.isAllRequireDataReady[key] = true;

		var isReady = true;

		for(var k in this.isAllRequireDataReady){
			if(!this.isAllRequireDataReady[k]){
				isReady = false;
				break;
			}
		}

		if(isReady){
			this.allDataReady();
		}
	}

	allDataReady(){
        this.updateBankInfo(this.drawings_money_info);

        //隐藏系统loading
        Global.Tips.hideSystemLoading();
	}

	afterInit(){
		//读取取款额度限制范围
		Api.pocket.drawings_money_info()
			.done((result)=>{
				Global.Log.log("drawings_money_info_callback result=%o" , result);

				if(result.errorInfo.length == 0){
					this.drawings_money_info = result;

					$(this.drawingMoneyMin).html(result.min);
					$(this.drawingMoneyMax).html(result.max);

					this.oneDataReady("drawInfo");

					//不能在此处操作，银行列表未返回，需在银行列表返回后进行该操作。所以需API：drawings_money_info、drawings_bank_list同时请求完成后操作
					// this.updateBankInfo(result);
				}
				else {
                    //隐藏系统loading
                    Global.Tips.hideSystemLoading();

					Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", result.errorInfo[0].errorCode));
				}
			});

		//读取取款银行列表
		Api.pocket.drawings_bank_list()
			.done((result)=>{
				//不作处理。此时有loading存在，loading会在初始化全部完成后才消失
                //显示屏幕遮罩，防止系统loading消失一瞬间，点击屏幕银行列表区域，触发原生radio选择，而此时监听点击事件脚本未初始化完成，导致此次点击无效
                // Global.GlobalLayer.show();

                if(result.errorInfo.length == 0){
                    this.drawingsBank_list_callback(result);

                    //需在callback函数后执行，否则dom未创建
                    this.oneDataReady("bankList");
				}
				else {
                    //隐藏系统loading
                    Global.Tips.hideSystemLoading();

                    Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("" , result.errorInfo[0].errorCode));
				}
			});

		//绑定额度input框change事件
		var moneyCheckTimer = -1,
			moneyInput;

		$(this.formInputElement.money).on("input", (e: Event)=>{
			//将当前input对象寄存到外部变量中，以免匿名函数销毁时连同里面变量一起销毁，导致setTimeout之后查找不到对应变量
			moneyInput = e.currentTarget;

			clearTimeout(moneyCheckTimer);
			moneyCheckTimer = setTimeout(()=>{
				this.onMoneyChange($(moneyInput).val());
			}, 300);
		});

		//银行列表面板按钮关闭事件绑定
		$(this.bankPannalCloseBtn).tap((e:Event)=>{
			//读取当前选择的银行，查找对应银行名称并显示
			if(this.paymentBankVal){
				$(this.selectedBankName).text(this.getBankItemById(this.paymentBankVal).bankName).removeClass("hide");
			}
			this.isAply();
			this.bankPannalHide();
			Global.GlobalLayer.show();

			setTimeout(function(){
				Global.GlobalLayer.hide();
			},Global.GlobalLayer.hideDelayTime);
		});

		//绑定虚拟银行输入框的点击事件
		$(this.bankListInput).tap((e:Event)=>{
			// console.log("click it ");
			Global.GlobalLayer.show();
			this.bankPannalShow();
			setTimeout(function(){
				Global.GlobalLayer.hide();
			},Global.GlobalLayer.hideDelayTime);
		});
	}

	isAply(){
		if(this.paymentBankVal === '2964'){
			$('.aply').removeClass('hide');
			$('.noAply').addClass('hide');
		}else{
			$('.aply').addClass('hide');
			$('.noAply').removeClass('hide');
		}
	}

	/**
	 * 从API中获取数据更新上次使用的银行信息
	 * @param result
	 */
	updateBankInfo(result){
		if (typeof result.bankNumber != 'undefined') {
			$(this.formInputElement.bankNumber).val(result.bankNumber);
		}

		if (typeof result.bankProvince != 'undefined') {
			$(this.formInputElement.bankProvince).val(result.bankProvince);
			if(result.paymentBank === "支付宝"){
				$(this.formInputElement.alipayAccount).val(result.bankProvince);
			}
		}

		if (typeof result.bankAddress != 'undefined') {
			$(this.formInputElement.bankAddress).val(result.bankAddress);
		}

		if (typeof result.subbranch != 'undefined') {
			$(this.formInputElement.subbranch).val(result.subbranch);
			if(result.paymentBank === "支付宝"){
				$(this.formInputElement.alipayNickName).val(result.subbranch);
			}
			
		}

        if(typeof result.telphone != 'undefined'){
            $(this.formInputElement.telphone).val(result.telphone);
        }

        if(typeof result.bankAccount != 'undefined'){
            $(this.formInputElement.bankAccount).val(result.bankAccount);
		}
		//JW特别设置默认支付宝
		var metaSiteID = $("head>meta[name='cashap-siteid']");
		var siteID = metaSiteID.attr("content");
		
        if(typeof result.paymentBank != 'undefined' && result.paymentBank != ""){
            var bankItem = this.getBankItemByName(result.paymentBank);
            if(bankItem){
                this.paymentBankVal = bankItem.bankID;

                var selInput = $(this.bankPannal).find(this.formInputElement.paymentBank + '[value="' + this.paymentBankVal + '"]');
				$(this.selectedBankName).text(this.getBankItemById(this.paymentBankVal).bankName).removeClass("hide");
				if(selInput.length > 0){
                    (<HTMLInputElement>selInput[0]).checked = true;
                }
			}
        }else if(siteID === "CM000207" || siteID === "CM000117"){
			var bankItem = this.getBankItemByName("支付宝");
            if(bankItem){
                this.paymentBankVal = bankItem.bankID;

                var selInput = $(this.bankPannal).find(this.formInputElement.paymentBank + '[value="' + this.paymentBankVal + '"]');
				$(this.selectedBankName).text(this.getBankItemById(this.paymentBankVal).bankName).removeClass("hide");
				if(selInput.length > 0){
                    (<HTMLInputElement>selInput[0]).checked = true;
				}
			}
		}


        if(typeof result.requireDrawPhone != 'undefined'){
            this.requireDrawPhone = result.requireDrawPhone;

            //显示联系电话项
            this.requireDrawPhone == 1 ? $(this.formElement).find(this.formInputElement.telphone).parent().removeClass("hide") : "";
        }
		this.isAply();
        this.addRule();
	}

	addRule(){
		//若有检验项为required时，只有dom不存在才不会校验。每一个校验对象必须要有自己的id（没有则为undefined），出错对象根据id分组
		var formValidatorOption:FormValidatorOption[] = [{
			name: 'money',
			rules: 'required|callback_check_money'
		},
		// 	{
		// 	name: 'telphone',
		// 	rules: 'required|callback_check_telphone'
		// },
			{
			name: 'bankAccount',
			rules: 'required'
		},
		{
			name: 'drawingsPassword',
			rules: 'required|callback_check_drawingsPassword'
		}
		];

        //显示联系电话时，添加格式验证
        if(this.requireDrawPhone == 1){
            formValidatorOption.push({
                name: 'telphone',
                rules: 'required|callback_check_telphone'
            });
        }

		var formElement = <HTMLFormElement>document.getElementsByName(this.formName)[0];

		// var isTelphoneHide = this.formElement.find(this.formInputElement.telphone).parent().attr("hidden");
        //
		// //telphone项隐藏由html打包程序生成html时根据配置项设置的
		// //当telphone项隐藏时，设置telphone为“0”，以免校验不通过，同时使telphone提交时不为空
		// if(isTelphoneHide == "" || isTelphoneHide == "hidden") {
		// 	this.formElement.find(this.formInputElement.telphone).val("0");
		// }

		var validator = new FormValidator(this.formName, formValidatorOption, this.submit.bind(this));

		validator.registerCallback('check_money', (val)=>{
			return this.check_money(val);
		});

		validator.registerCallback('check_telphone', (val)=>{
			var reg = /^[0-9\-]*$/;
			return reg.test(val);
		});

		validator.registerCallback('check_drawingsPassword', (value)=>{
			var result,pattern1;
			pattern1 = /\d{4}/gi;
			result = pattern1.test(value);
			return result;
		});
	}

	check_money(val){
		var result,pattern1;
		result = false;

		Global.Log.log("onMoney_Check val = %s" , val);

		if(val != ""){
			pattern1 = /^[1-9]\d*$/;//匹配正浮点数，允许小数点后2位
			result = pattern1.test(val);

			Global.Log.log("onMoney_Check pattern1 = %o" , result);

			if(result){
				var min = this.drawings_money_info.min,
					max = this.drawings_money_info.max;

				Global.Log.log("onMoney_Check min = %d , max = %d" , min , max);
				Global.Log.log("onMoney_Check max > val" ,  parseInt(max) > parseInt(val));

				result = parseInt(min) <= parseInt(val) && parseInt(max) >= parseInt(val);
			}
		}

		return result;
	}

	/**
	 * 取款额度输入变化处理
	 * @param val
	 */
	onMoneyChange(val){
		Global.Log.log("onMoneyChange");

		var result = this.check_money(val),
			targetSelector = this.formElement.find(this.formInputElement.money).attr("data-error-target");

		//清空错误提示信息
		if(targetSelector){
            this.formElement.find(targetSelector).addClass("hide");
			this.formElement.find(targetSelector).html("");
			$(this.formInputElement.money).parent().removeClass("invalid");
		}

		if(!result && targetSelector){
			var txt = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS  , "money_invalid");

			txt = txt.replace("{0}" , this.drawings_money_info.min);
			txt = txt.replace("{1}" , this.drawings_money_info.max);

			this.formElement.find(targetSelector).html(txt);
            this.formElement.find(targetSelector).removeClass("hide");
			$(this.formInputElement.money).parent().addClass("invalid");
		}
	}

	drawingsBank_list_callback(result){
		Global.Log.log("drawingsBank_list_callback result=%o" , result);

		// let banklist_hight = screen.availHeight-($(".header").height()+$(".page-desc").height()+$(".footer").height()) ;
		const banklist_winHeight = (document.documentElement.clientHeight > screen.height ? document.documentElement.clientHeight : screen.height) * 0.9;
		//由于不同浏览器document.documentElement.clientHeight，screen.height各自读取到的值不一致，只取大者；窗口大小为屏幕大小的90%
		const banklist_hight = banklist_winHeight * 0.4;
		const bankItem_hight = $(this.bankItem).height();

		//banklist_hight*0.4，列表大小为窗口大小的40%，60%显示其他内容
		var data = [],
			amountPerGroup = parseInt((banklist_hight/bankItem_hight).toString()),//(banklist_hight - banklist_hight%bankItem_hight)/bankItem_hight || $(this.bankGroupTpl).data("group-amount") || 7,
			arr = [],
			cache = [];

		for(var i=0; i<result.data.length; i++){
			var o = {
				bankID:result.data[i].bankID,
				bankName:result.data[i].bankName
			};

			data.push(o);
			cache.push(o);

			//根据每部分显示的银行数分组
			if((i+1)%amountPerGroup == 0 || i == (result.data.length - 1)){
				arr.push(cache);
				cache = [];
			}
		}

		this.bank_list = data;

		//进行二次分组，将已经分好的每组amountPerGroup个对象的数组分成左右两部分
		var d = [],
			_obj = {};

		arr.forEach((item, idx)=>{
			if(idx % 2 == 1){//idx从0开始计算
				_obj["g2"] = item;
				d.push(_obj);
				_obj = {};
			}
			else {
				_obj["g1"] = item;

				if(idx == arr.length - 1){
					d.push(_obj);
				}
			}
		});

		//补齐最后一项个数
		var last = d[d.length - 1];
		if(last["g1"].length < amountPerGroup){
			for(var i=0,l=amountPerGroup-last["g1"].length; i<l; i++){
				last["g1"].push({});
			}
		}

		last.hasOwnProperty("g2") ? "" : last["g2"] = [];

		if(last["g2"].length < amountPerGroup){
			for(var i=0,l=amountPerGroup-last["g2"].length; i<l; i++){
				last["g2"].push({});
			}
		}

		Global.Log.log("html generation data ", d);

		this.setHtml($(this.bankList), d, $(this.bankGroupTpl).html());

		this.initBankListSlider();
	}

	/**
	 * 使用iSlider组件实现banklist区域滑动滚动
	 * 只能在当前需要滑动的dom可视时才初始化，否则会因为拿不到对应的宽度高度导致无法完成初始值设置
	 */
	initBankListSlider(){
		//初始化银行列表高度
        const banklist_winHeight = (document.documentElement.clientHeight > screen.height ? document.documentElement.clientHeight : screen.height) * 0.9;
		const banklist_hight = banklist_winHeight * 0.4;//screen.availHeight-($(".header").height()+$(".page-desc").height()+$(".footer").height()) ;
		$(this.bankPannal).height(banklist_winHeight + "px");
		$(this.bankList).height(banklist_hight+"px");

		//初始化银行列表区域滑动组件
		var list = [];
		(<any>$(this.bankList).children()).forEach((item, idx)=>{
			var o = {
				width: "100%",
				height: "100%",
				content: item.outerHTML
			};
			list.push(o);
		});

		//设置导航页码
		$('[data-cashap-id="bankListCurrPage"]').html("1");
		$('[data-cashap-id="bankListAmountPage"]').html(list.length.toString());

		$(this.bankList).children().remove();
		var islider = new iSlider({
			dom: document.querySelector(this.bankList),
			type: "dom",
			data: list,
			fixPage: false,//不拦截默认事件
			onslidechanged: (number, el)=>{
				$('[data-cashap-id="bankListCurrPage"]').html(number + 1);

				//若已经选择了银行，则查找出当前选择的银行并选中
				if(this.paymentBankVal){
					var selInput = $(el).find(this.formInputElement.paymentBank + '[value="' + this.paymentBankVal + '"]');
					if(selInput.length > 0){
						(<HTMLInputElement>selInput[0]).checked = true;
					}
				}
			}
		});

		//监听银行列表点击事件，记录当前选择的银行
		$(this.bankList).delegate(this.bankItem, "tap", (e: Event)=>{
			//判断target是否this.bankItem对象
			var target = e.target || e.srcElement,
				inputEle = $(target).attr("data-cashap-id") == "bankItem" ? $(target).find(this.formInputElement.paymentBank) : $(target).parent().find(this.formInputElement.paymentBank);

			//选中的银行文字
			var inputEleText = $(target);

			if(inputEle.length > 0) {
				(<HTMLInputElement>inputEle[0]).checked = true;
				this.paymentBankVal = inputEle.val();

				//设置虚拟选中框的文本为选中的checkbox 文本
				// console.log("inputEleText is ",inputEleText[0].innerText);
				// $(this.bankcheckedText)[0].innerHTML = inputEleText[0].innerText;


				Global.Log.log("paymentBank select ", this.paymentBankVal);
			}
		});

		//Api.pocket.drawings_bank_list回调中调用显示全局遮罩，监听银行列表点击事件完成后再隐藏
		// Global.GlobalLayer.hide();
	}

	//银行列表面板显示
	bankPannalShow(){
		$(this.bankPannal).removeClass("opacityhide");
	}

	//银行列表面板隐藏
	bankPannalHide(){
		$(this.bankPannal).addClass("opacityhide");
	}



	submit(errors:FormValidatorError[], event:Event){
		event.preventDefault();

		//防止用户在本次操作未完成时重复提交
		if(this.isSubmitting){
			var text = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS , "logining");
			Global.Tips.systemTip(text);
			return;
		}

		//校验paymentBank是否有值
		if(!this.paymentBankVal){
			errors.push({
				element: $(this.bankList).find(this.formInputElement.paymentBank)[0],
				name: "paymentBank",
				message: "",
				value: ""
			});
		}

		Global.Log.log("drawingsApply submit" , errors,  event);

		var formElement = <HTMLFormElement>document.getElementsByName(this.formName)[0],
			form_data:any = {};

		//清空所有错误提示信息
		for(var key in this.formInputElement){
            //新版手机版，支付银行html结构与旧版不同，此处需特殊处理
            if(key == "paymentBank"){
                $("#payment_bank_error").html("");
                $("#payment_bank_error").addClass("hide");
                continue;
            }

			if(formElement.querySelector(this.formInputElement[key])){
				//当为key=paymentBank时，由于querySelector只匹配第一个符合条件的元素，所以不需要取第一个paymentBank元素用于清空错误信息
				var targetSelector = formElement.querySelector(this.formInputElement[key]).getAttribute("data-error-target");
				if(targetSelector){
					(<HTMLDivElement>formElement.querySelector(targetSelector)).innerText = "";

                    this.formElement.find(targetSelector).addClass("hide");

					if(key != "paymentBank") {
						$(this.formInputElement[key]).parent().removeClass("invalid");
					}
				}
			}
		}

		if(this.paymentBankVal === "2964"){
			if(!$(this.formInputElement.alipayAccount).val()){
				errors.push({
					element: $(this.formInputElement.alipayAccount)[0],
					name: "alipayAccount",
					message: "",
					value: ""
				});
			}
			if(!$(this.formInputElement.alipayNickName).val()){
				errors.push({
					element: $(this.formInputElement.alipayNickName)[0],
					name: "alipayNickName",
					message: "",
					value: ""
				});
			}
		}else{
			if(!$(this.formInputElement.bankNumber).val()){
				errors.push({
					element: $(this.formInputElement.bankNumber)[0],
					name: "bankNumber",
					message: "",
					value: ""
				});
			}
			if(!$(this.formInputElement.bankAddress).val()){
				errors.push({
					element: $(this.formInputElement.bankAddress)[0],
					name: "bankAddress",
					message: "",
					value: ""
				});
			}
			if(!$(this.formInputElement.subbranch).val()){
				errors.push({
					element: $(this.formInputElement.subbranch)[0],
					name: "subbranch",
					message: "",
					value: ""
				});
			}
			if(!$(this.formInputElement.bankProvince).val()){
				errors.push({
					element: $(this.formInputElement.bankProvince)[0],
					name: "bankProvince",
					message: "",
					value: ""
				});
			}
		}
		

		if (errors.length > 0) {
			Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "check_error"));

			errors.map((item , index , all)=>{
				//当为radio这些数量可能不止一个的对象时，item.element为对象数组而不是单一对象
				var el = item.element["length"] ? item.element[0] : item.element,
					errTarget = el.getAttribute("data-error-target"),
					errorCode, errorText;

				switch(item.name){
					case "money":
						errorCode = "money_invalid";
						break;

					case "telphone":
						errorCode = "telphone_invalid";
						break;

					case "paymentBank":
						errorCode = "paymentBank_invalid";
						break;

					case "bankAccount":
						errorCode = "bankAccount_invalid";
						break;

					case "bankNumber":
						errorCode = "bankNumber_invalid";
						break;

					case "bankProvince":
						errorCode = "bankProvince_invalid";
						break;

					case "subbranch":
						errorCode = "subbranch_invalid";
						break;

					case "bankAddress":
						errorCode = "bankAddress_invalid";
						break;

					case "drawingsPassword":
						errorCode = "drawingsPassword_invalid";
						break;

					case "alipayNickName":
						errorCode = "alipayNickName_invalid";
						break;
					
					case "alipayAccount":
						errorCode = "alipayAccount_invalid";
						break;

					default:
						errorCode = "";
				}

				errorText = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS  , errorCode);

				if(errorCode == "money_invalid"){
					errorText = errorText.replace("{0}" , this.drawings_money_info.min);
					errorText = errorText.replace("{1}" , this.drawings_money_info.max);
				}

				if(errTarget && formElement.querySelector(errTarget)) {
                    this.formElement.find(errTarget).removeClass("hide");

                    //新版手机版，支付银行html结构与旧版不同，此处需特殊处理
					if(item.name == "paymentBank"){
						$(errTarget).html(errorText);
						return;
					}

					(<HTMLAnchorElement>formElement.querySelector(errTarget)).innerText = errorText;

					//paymentBank项的dom结构与普通input项不同，此处不添加错误class
					if(item.name != "paymentBank"){
						$(el).parent().addClass("invalid");
					}
				}

				Global.Log.log("errorTarget" , errTarget);
			});

			return;
		}

		this.isSubmitting = true;

		//读取表单填写内容
		for(var key in this.formInputElement){
			if(key == "paymentBank"){
				form_data[key] = this.paymentBankVal || "";
				continue;
			}

			var el = <any>formElement.querySelector(this.formInputElement[key]);
			if(el) {
				form_data[key] = el.value;
			}else{
				form_data[key] = "";
			}
		}

		Global.Log.log("submit data " , form_data);

		//只要form_data不为空object就执行
		if(form_data.hasOwnProperty("paymentBank")){
			this.checkOperationCharge(form_data);
		}
	}

	//检查手续费
	checkOperationCharge(form_data){
		//显示系统loading
		Global.Tips.showSystemLoading();

		Api.pocket.get_operation_charge({"money": form_data.money})
			.done((result)=>{
				//隐藏系统loading
				Global.Tips.hideSystemLoading();

				if(result.result){
					if(result.warning){
						var message =  (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS , "operationHasCharge").replace("{0}" , result.charge),
							confirmResult = window.confirm(message);

						if(confirmResult){
							//修改免费取款标记 false
							this.freeDrawingsApply = false;
							this.submitForm(form_data);
						}
						else {
							this.isSubmitting = false;
						}
					}else{
						this.isSubmitting = false;
						this.submitForm(form_data);
					}
				}else{
					Global.Tips.systemTip((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS , "chargeCheckError"));
				}
			});
	}

	submitForm(form_data){
		form_data["paymentBankName"] = this.getBankItemById(form_data.paymentBank).bankName;

        //联系电话隐藏时，设置默认值
        if(this.requireDrawPhone == 0){
            form_data.telphone = "0";
        }

        //新现金系统必须提交手机号码，强制提交默认值
        // if(!form_data.hasOwnProperty("telphone") || form_data.telphone == ""){
        // 	form_data.telphone = "0";
        // }

		//判断当前不是免费取款，询问是否接受有偿取款操作
		if(!this.freeDrawingsApply){
			form_data.agreeToCharge = 1;
		}

		//显示系统loading
		Global.Tips.showSystemLoading();

		Api.pocket.drawings_money_apply(form_data)
			.done((result)=>{
				var data = {};

				if(result.errorInfo.length == 0){
					data["data"] = result.result;
				}
				else {
					data["error"] = result.errorInfo[0];
				}

				this.drawingsMoneyApplyCallback(data);
			});
	}

	drawingsMoneyApplyCallback(result){
		Global.Log.log("onSubmit_callback result = %o" , result);

		this.isSubmitting = false;

		//隐藏系统loading
		Global.Tips.hideSystemLoading();

		if(result.error){
			var message = "";

			switch (result.error.errorCode){
				case "2104012":
					message = result.error.errorDetail;

					if(window.confirm(message)){
						//修改免费取款标记 false
						this.freeDrawingsApply = false;

						//触发表单提交
						$(this.submitBtn).trigger("click");
					}

					return;
					break;

				default :
					message = (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS , result.error.errorCode);
					break;
			}

			Global.Tips.systemTip(message);
			return;
		}

		// alert((<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "success"));

		Global.ConfirmDialog.show(
			{	
				leftbtnShow:true,
				rightbtnShow:false,
				labelLeftBtn: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate("", "OK"),
				callbackLeftBtn: function(){
					this.freeDrawingsApply = true;
					window.location.href = Com_Gametree_Cashap.SiteConfig.DrawingApplySuccessUrl;
				},
				message: (<ILanguage>Com_Gametree_Cashap.Language).getMessage_Translate(this.messageNS, "success"),
				
			}
		)

		// this.freeDrawingsApply = true;
		// window.location.href = Com_Gametree_Cashap.SiteConfig.DrawingApplySuccessUrl;
	}

	getBankItemById(id){
		var bankItem = null;

		this.bank_list.forEach((item, idx)=>{
			if(item.bankID == id){
				bankItem = item;
				return false;
			}
		});

		return bankItem;
	}

    getBankItemByName(name){
        var bankItem = null;

        this.bank_list.forEach((item, idx)=>{
            if(item.bankName == name){
                bankItem = item;
                return false;
            }
        });

        return bankItem;
    }

	/**
	 * 创建html结构
	 */
	setHtml(target: JQuery, data, tpl){
		var template = Handlebars.compile(tpl),
			html = template(data);

		target.html(html);
	}
}


export = withdrawalPage;