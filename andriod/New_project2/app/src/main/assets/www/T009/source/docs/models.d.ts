interface ErrorModel{
	result:boolean;
	errorInfo:ErrorInfoModel[];
}

interface ErrorInfoModel{
	errorCode:string;
	error:string;
	errorDetail:string;
}

/**
 * @desc 数据模型--会员登入
 */
interface MemberSignInModel extends ErrorModel{
	/**
	 * @desc 帐号
	 */
	account:string;

    accountBalance:string;

    currency?:string;

	/**
	 * 会员等级
	 */
	memberLevel:number;

    logintoken?:string;

    pm_unread?: string;

    lastGetTime?:string;
}

/**
 * 数据模型--会员注册
 */
interface MemberSignUpModel extends ErrorModel{}

interface MemberForgetPassword extends ErrorModel {}


/**
 * 用户基本信息
 */
interface IProfile_BaseInfo extends ErrorModel {
	/**
	 * 会员帐号
	 */
	account: string;
	/**
	 * 会员级别
	 * 1=正式会员
	 * 2=试玩会员
	 * 3=内测会员
	 */
	memberLevel: number;
	/**
	 * 总帐户余额
	 */
	accountBalance: string;
	/**
	 * 币种
	 */
	currency: string;
	/**
	 * 会员状态，包含锁定状态等
	 */
	state?: string;
	/**
	 * 最后读取此消息时间，用于客户端识别(日期格式：2012/10/01 12:30:45)
	 */
	lastGetTime: string;

	/**
	 * 第三方Id
	 */
	thirdPartyId: string;
}

/**
 * 钱包列表
 */
interface IPocketList extends ErrorModel {
	key?: string;
	value?: number | string;
}

interface IPocketId extends ErrorModel {
	pocketID: IPocketIdItem[];
	trailForbidden: string[];
	hasPocketID: any;
}

interface IPocketIdItem {
	id: string;
	value: string;

	isTrail: boolean;
	name: string;
	trailForbidden: boolean;
	trailForbiddenValue: string;
}

/**
 * 银行列表
 */
interface IDrawingsBankList extends ErrorModel {
	data: IBankItem[];
}

interface IBankItem {
	/**
	 * 银行名称
	 */
	bankName: string;

	/**
	 * 银行ID
	 */
	bankID: string;
}

/**
 * 全站消息，包括：站点公告、站点维护状态、游戏维护状态
 */
interface ISiteMessageData extends ErrorModel, IProductList {
	/**
	 * 站点公告
	 */
	siteMessage: ISiteMessage[];

	/**
	 * 站点维护状态
	 */
	site: ILiveBaseInfo;

	/**
	 * 域名信息
	 */
	domain?: IDomain;

	count: number;

	/**
	 * 最后读取此消息时间，用于客户端识别(日期格式：2012/10/01 12:30:45)
	 */
	lastGetTime: string;
}

/**
 * 站点公告
 */
interface ISiteMessage {
	/**
	 * id
	 */
	id: string;

	/**
	 * 标题
	 */
	title: string;

	/**
	 * 正文
	 */
	content: string;

	/**
	 * 生效时间
	 */
	startDate: string;

	/**
	 * 结束时间
	 */
	endDate: string;

	/**
	 * 展示方式，1=列表显示，2=弹窗方式
	 */
	showType: number;

	/**
	 * 置顶
	 */
	setTop: boolean;
}

/**
 * 忘记密码提交问题
 */
interface IForgetpw_answer {
	account: string;
	vcode: string;
	name?: string;
	telephone?: string;
	email?: string;
	drawingspw?: string;
}

/**
 * 域名信息
 */
interface IDomain {
	/**
	 * 无效域名列表信息，使用逗号分隔
	 */
	invalidate: string;

	/**
	 * 无效域名跳转URL地址
	 */
	url: string;
}

/**
 * 产品
 */
interface IProductList {
	/**
	 * 旗舰厅真人
	 */
	liveGame_gt?: ILiveBaseInfo;

	/**
	 * GT黄金厅
	 */
	livegame_gt_gold?: ILiveBaseInfo;

	/**
	 * 卡卡湾真人
	 */
	liveGame_xtd?: ILiveBaseInfo;

	/**
	 * MG真人
	 */
	liveGame_mg?: ILiveBaseInfo;

	/**
	 * GT铂金厅
	 */
	livegame_gt_p1?: ILiveBaseInfo;

	/**
	 * GT真人钻石厅
	 */
	livegame_wn_ph?: ILiveBaseInfo;

	/**
	 * 体育竞猜
	 */
	sportGame_gt?: ILiveBaseInfo;

	/**
	 * 彩票游戏
	 */
	lotteryGame_gt?: ILiveBaseInfo;

	lotteryGame?: ILiveBaseInfo;

	/**
	 * 幸运彩票
	 */
	luckylotteryGame?: ILiveBaseInfo;

	/**
	 * 电子游戏
	 */
	slotMachineGame?: ILiveBaseInfo;

	/**
	 * BB系列产品
	 */
	bb?: ILiveBaseInfo;

	/**
	 * MG系列产品
	 */
	mg?: ILiveBaseInfo;

	/**
	 * WG
	 */
	wg?: ILiveBaseInfo;

	/**
	 * GT娱乐城产品
	 */
	gtcasino?: ILiveBaseInfo;

	/**
	 * OG娱乐城产品
	 */
	oggame?: ILiveBaseInfo;

	/**
	 * 对战游戏
	 */
	dzgame?: ILiveBaseInfo;

	/**
	 * AG
	 */
	agcasino?: ILiveBaseInfo;

	/**
	 * AB
	 */
	allbet?: ILiveBaseInfo;

	/**
	 * tag
	 */
	taglive?: ILiveBaseInfo;
}

interface ILiveBaseInfo {
	/**
	 * 状态，true=维护中,false=开放中
	 */
	state?: boolean;

	/**
	 * 允许钱包转出，true=允许,false=不允许
	 */
	isAllowExport?: boolean;

	/**
	 * 允许钱包转入，true=允许,false=不允许
	 */
	isAllowImport?: boolean;

	/**
	 * 描述文字
	 */
	info?: {
		"zh-cn"?: string;
		"zh-tw"?: string;
		"en-us"?: string;
	};
}

/**
 * 额度转换
 */
interface IPocketChangeReq{
	fromPocket: string;
	toPocket: string;
	money: string;
}

interface IPocketChangeRes extends ErrorModel {
	/**
	 * 转出钱包余额
	 */
	fromPocket: string;

	/**
	 * 转入钱包余额
	 */
	toPocket: string;
}

/**
 * 公司入款
 */
interface IMemberOfflineDepositMoneyReq {
	depositBankID: number | string;

	dueBankID: number | string;

	money: number | string;

	telphone: number | string;

	depositDate: string;

	name: string;

	method: number | string;

	YHSF: number | string;

	YHDZ: number | string;

	YHFH: number | string;
}

interface IMemberOfflineDepositMoneyRes extends ErrorModel{
    depositID: string;
    hasPromotion: boolean;
    promotionList: IPromotionItem[];
}

interface IPromotionItem {
	id: string;
	title: string;
}

interface IMemberOnlineDepositMoneyReq {
	money: number | string;

	vcode: number | string;

	telphone?: number | string;

	payType: number;

	gameCard?: boolean | string;
}

interface IMoneyLimit extends ErrorModel {
	min: number;

	max: number;

    requireDrawPhone: number;
}