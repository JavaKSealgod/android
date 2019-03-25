
interface IGetAvailableMerchantsetData{
    [key: string]: IGetAvailableMerchantsetItem[];
}

interface IGetAvailableMerchantsetItem{
    din3wxcheck: boolean;
    levelid: string;
    max: number;
    mid: number;
    min: number;
    newlevelid: string;
    nickname?: string;
    banks: bankItem[];
    number_fixed: boolean;
    onlyint_fixed: boolean;
    moneybox: null | string;
    manualmoney:number;
    name?:string;
    id?:string;
    link?:string;
    sort?:number;
}

interface bankItem {
    id: string;
    name: string;

    //以下属性为程序添加
    imgURL?: string;

    //银行名称第一个中文字的拼音首字母/名称首个字符为字母
    firstLetter?: string;
}


interface IOnlineDepositMoenyApply {
    money?: string;
    payType?: string;
    payMethod?: number;
    tel?: number | string;
    vcode?: string;
    bankname?: string;
    levelid?: string;
    newlevelid?: string;
    merchantid?: string;
    drpFKYH?: string;
    mode?:  string;
}

interface IBaseRespone{
    result?: boolean;
    errorInfo?: IErrorItem[];
}

interface IErrorItem {
    error: string;
    errorCode: string;
    errorDetail: string;
}

//各支付方式实例化 参数结构描述
interface IDepositInstanceOption {
    parent: string;

    config?: IGetAvailableMerchantsetItem[];

    // 原数据中该项移到config中
    // number_fixed?: boolean;

    //点卡
    gameCard?: boolean;

    //商号ID
    merchantSetId?: string;

    //支付模式。app、h5、barcode
    mode?: string;

    /**
     * 1=标准存款（线上存款） 2=点卡 3=微信 4=支付宝 5=QQ钱包 6=银联钱包 7=京东钱包 8=百度钱包 9=快捷支付
     */
    payMethod?: number;
}