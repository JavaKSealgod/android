interface ICookieOptions{
	expires?: any;
	path?:string;
	domain?:string;
	secure?:string;
}

interface ISiteConfig{
	/**
	 * 登入完成跳转页面Url
	 */
	SignInSuccessUrl:string;

	/**
	 * 会员注册成功跳转页面Url
	 */
	SignUpSuccessUrl: string;

	/**
	 * 会员登出完成跳转页面Url
	 */
	LogoutSuccessUrl: string;

	/**
	 * 会员取款成功跳转页面Url
	 */
	DrawingApplySuccessUrl: string;

	/**
	 * 首页
	 */
	HomePageUrl: string;

	/**
	 * 登录页
	 */
	LoginUrl: string;

	/**
	 * 钱包页面
	 */
	PocketTransferUrl: string;

	/**
	 * MG电子游戏页面
	 */
	MGCasino_SlotGameUrl: string;

	/**
	 * 易宝点卡页面
	 */
	Deposit_Gamecard_PaymentUrl: string;

	/**
	 * 快汇宝3.0页面
	 */
	Deposit_GamecardUrl: string;

	/**
	 * 线上存款回调页
	 */
	Online_Deposit_CallbackUrl: string;

	/**
	 * SysTips隐藏延迟时间
	 */
	SysTips_hideDelayTime: number;

    /**
	 * 支付二维码有效时长
     */
    qrcodeValidMaxTime: number;

	/**
	 * 默认是否显示推荐人
	 */
	defaultShowRecommend: boolean;

	/**
	 * 是否向API请求根据域名获取推荐人帐号
	 */
	LoadRecommendByDomain: boolean;

	/**
	 * 当前发现推荐人信息后显示推荐人
	 */
	ShowHaveRecommend: boolean;

	/**
	 * 当前没有发现推荐人信息后显示推荐人信息项填写
	 */
	ShowRecommend:boolean;

	SignUp_VCode_Pattern: RegExp | string;

	SignUp_Telphone_Pattern: RegExp | string;

	//
	keepAliveTime: number;

	//site_message重新请求的时间间隔
	site_messageRefreshTime: number;

	//会员注册页---key值
	signupKeyPart: string;

	//访问规则ID
	memberRuleId: any;

	//访问规则
	memberRule: any;
}

declare module Com_Gametree_Cashap{
	var Language:any;

	var SiteConfig:ISiteConfig;
}

interface ILanguage{
	/**
	 * 获取错误代码详细说明文字
	 * 文字从语言包中获取
	 * @function
	 * @param {String} namespace 	命名空间
	 * @param {String} code		错误代码
	 * @param {String} subtext	替补文字
	 * @return {String}
	 */
	getMessage_Translate(namespace:string , code:string, subtext?:string):string;
}

//Member_PocketTransfer.ts中引用外部变量，防止ts报错，在此处定义
declare var DisableMGPocketImport;

//手机版V3版变量文档描述
interface ISidebarManagerRegistObj {
    id: string;
    activeBtn: string;
    closeBtn?: string;
    location: string;
    targetContainer: string;
    isShow?: boolean;
    beforeShowCallback?: Function;
    showedCallback?:Function;
    beforeCloseCallback?: Function;
    closedCallback?: Function;
}

//储存于LocalStorage里的文档描述
interface LocalGameData{
	Name : string,
	GameName: string,
	Parameter : string,
	id: string,
	imgURL:string,
	ShowType?:string,
	category?:string
}