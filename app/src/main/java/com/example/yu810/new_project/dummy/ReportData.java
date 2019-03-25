package com.example.yu810.new_project.dummy;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.example.yu810.new_project.Account_bet_Fragment;
import com.example.yu810.new_project.GameActivity;
import com.example.yu810.new_project.MainActivity;
import com.example.yu810.new_project.R;
import com.example.yu810.new_project.utils.ApiHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;

import java.util.ArrayList;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.loopj.android.http.RequestParams;

import cz.msebera.android.httpclient.Header;

import com.example.yu810.new_project.Account_betRecyclerViewAdapter;

public class ReportData {
    public static final String strNodata = "暂无记录";
    public static final int bet = 1;
    public static final int rebate = 2;
    public static final int deposit_drawings_money = 3;
    public static final int transfer_money = 4;
    public static final int promotion_history = 5;
    public static final int qryrebatenow = 6;
    public static final int setrebatenow = 7;
    public static final int checkrebatenow = 8;
    public static final int idNodate = 999999;
    public static final Map<String, String> ACTION_MAP = new HashMap<String, String>();
    private Account_bet_Fragment.OnListFragmentInteractionListener mListener;

    static {
        // Add some sample items.
        ACTION_MAP.put(String.valueOf(bet), "report/bet.json");//report/bet.json?startDate=2019-03-01&endDate=2019-03-13&gameType=&drpc=2&gameKey=&_=1552439268475
        ACTION_MAP.put(String.valueOf(rebate), "report/rebate.json");//startDate=2019-03-01&endDate=2019-03-13&_=1552439470437
        ACTION_MAP.put(String.valueOf(deposit_drawings_money), "report/deposit_drawings_money.json");//startDate=2019-03-01T00%3A00&endDate=2019-03-13T09%3A12&operationType=0&operationState=0&operationMethod=0&_=1552439523244
        ACTION_MAP.put(String.valueOf(transfer_money), "report/transfer_money.json");//?startDate=2019-03-01&endDate=2019-03-13&operationType=&operationState=&_=1552439654008
        ACTION_MAP.put(String.valueOf(promotion_history), "promotion/get_promotion_history.json");
        ACTION_MAP.put(String.valueOf(qryrebatenow), "report/qryrebatenow.json");
        ACTION_MAP.put(String.valueOf(setrebatenow), "report/setrebatenow.json");//startDate=2019-03-01&endDate=2019-03-13&_=1552439887403
        ACTION_MAP.put(String.valueOf(checkrebatenow), "report/checkrebatenow.json");
    }

    //定义报表类型
    public enum ReportType {
        bet,//下注记录
        rebate,//反水记录
        deposit_drawings_money,//存取款记录
        transfer_money,//转账记录
        promotion_history,//存款优惠
        qryrebatenow,//反水记录-查询
        setrebatenow,//反水记录-提交
        checkrebatenow//反水记录-提交
    }


    //呼叫api，获取报表需要的数据
    //ReportType=报表类型
    public void GetReportData(String ActionReportType, Handler callBack) {
        final int iReportType = Integer.valueOf(ActionReportType);
        final Handler callbackHandler = callBack;
        String StrURL = ACTION_MAP.get(ActionReportType);
        RequestParams objParams = GetRequestParams(ActionReportType);
        //呼叫api
        ApiHttpClient.get(StrURL, objParams, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                Log.i("AppInfo", "GetReportData == " + response.toString());

                try {
                    JSONObject result = new JSONObject(response.toString());
                    switch (iReportType) {
                        case bet:
                            Getbet(result);
                            break;
                        case rebate:
                            Getrebate(result);
                            break;
                        case deposit_drawings_money:
                            Getdeposit(result);
                            break;
                        case promotion_history:
                            Getpromotion_history(result);
                            break;
                        case qryrebatenow:
                        case setrebatenow:
                            Getrebatenow(result);
                            break;
                        case checkrebatenow:
                            Getcheckrebatenow(result);
                            break;
                        default:
                            break;
                    }

                    callbackHandler.sendMessage(Message.obtain());//api回传数据后，呼叫回调函数getReportHandler
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                Log.i("AppInfo", "GetReportData onFailure " + responseString);
            }
        });
    }

    //准备请求需要的参数
    private RequestParams GetRequestParams(String ActionReportType) {
        RequestParams objParams = new RequestParams();
        final int iReportType = Integer.valueOf(ActionReportType);
        switch (iReportType) {
            case bet:
                objParams.put("startDate", getStartDate());
                objParams.put("endDate", getEndDate());
                objParams.put("gameType", getGameType());
                objParams.put("drpc", getDrpc());
                objParams.put("gameKey", getGameKey());
                objParams.put("_", "1552464090960");
                break;
            case rebate:
                objParams.put("startDate", getStartDate());
                objParams.put("endDate", getEndDate());
                objParams.put("_", "1552464090960");
                break;
            case deposit_drawings_money:
                objParams.put("startDate", getStartDate());
                objParams.put("endDate", getEndDate());
                objParams.put("operationType", getOperationType());
                objParams.put("operationState", getOperationState());
                objParams.put("operationMethod", getOperationMethod());
                objParams.put("_", "1552464090960");
                break;
            case qryrebatenow:
            case setrebatenow:
                objParams.put("startDate", getStartDate());
                objParams.put("endDate", getEndDate());
                objParams.put("_", "1552464090960");
                break;
            default:
                break;
        }

        return objParams;
    }

    //报表function
    private void Getbet(JSONObject result) {
        try {
            DummyContent.ITEMS.clear();//要先清空数据集
            //没有资料，要写一笔no Data
            if(result.toString().indexOf("data")==-1)
                DummyContent.addItem(
                        DummyContent.createDummyItem(
                                String.valueOf(idNodate), "", "", strNodata, ""
                                , "", "",""));
            else {
                JSONArray jarray = result.getJSONArray("data");
                for (int i = 0; i < jarray.length(); i++) {
                    JSONArray jsonArray = jarray.getJSONArray(i);
                    String Column1 = jsonArray.getString(1);
                    String Column2 = jsonArray.getString(2);
                    String Column3 = jsonArray.getString(3);
                    String Column4 = jsonArray.getString(4);
                    String Column5 = jsonArray.getString(5);
                    String Column6 = jsonArray.getString(6);
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(i), Column1, Column2, Column3, Column4, Column5, Column6,""));
                }
                if(DummyContent.ITEMS.size()==0){
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(idNodate), "", "", strNodata
                                    , "", "", "",""));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void Getrebate(JSONObject result) {
        try {
            DummyContent.ITEMS.clear();//要先清空数据集
            //没有资料，要写一笔no Data
            if(result.toString().indexOf("data")==-1)
                DummyContent.addItem(
                        DummyContent.createDummyItem(
                                String.valueOf(idNodate), "", strNodata, "", ""
                                , "", "",""));
            else {
                JSONArray jarray = result.getJSONArray("data");
                for (int i = 0; i < jarray.length(); i++) {
                    JSONArray jsonArray = jarray.getJSONArray(i);
                    String Column1 = jsonArray.getString(7);
                    String Column2 = jsonArray.getString(2);
                    String Column3 = jsonArray.getString(6);
                    String Column4 = jsonArray.getString(0);
                    String Column5 = jsonArray.getString(4);
                    String Column6 = jsonArray.getString(3);
                    String Column7 = jsonArray.getString(5);
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(i), Column1, Column2, Column3, Column4, Column5, Column6,Column7));
                }
                if(DummyContent.ITEMS.size()==0){
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(idNodate), "", strNodata, ""
                                    , "", "", "",""));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void Getdeposit(JSONObject result) {
        try {
            DummyContent.ITEMS.clear();//要先清空数据集
            //没有资料，要写一笔no Data
            if(result.toString().indexOf("data")==-1)
                DummyContent.addItem(
                        DummyContent.createDummyItem(
                                String.valueOf(0), "", strNodata, "", ""
                                , "", "",""));
            else {
                JSONArray jarray = result.getJSONArray("data");
                for (int i = 0; i < jarray.length(); i++) {
                    JSONArray jsonArray = jarray.getJSONArray(i);
                    String Column1 = jsonArray.getString(14);
                    if(Column1.equals("null")) continue;//数据为null，表示有问题，跳过执行下一笔
                    String Column2 = jsonArray.getString(1);
                    String Column3 = jsonArray.getString(13);
                    String Column4 = jsonArray.getString(15);
                    String Column5 = "原始金额：" +jsonArray.getString(7);
                    String Column6 = "目前金额：" +jsonArray.getString(12);
                    String Column7 = "存款优惠："+jsonArray.getString(9);
                    String Column8 = "行政费用："+jsonArray.getString(10);
                    String Column9 = "手续费："+jsonArray.getString(11);
                    String Column10 = "到账金额："+jsonArray.getString(13);

                    String Column11 = "交易码："+jsonArray.getString(2);
                    String Column13 = "账号："+ jsonArray.getString(3);
                    String Column15 ="货币代码："+jsonArray.getString(4);
                    String Column17 ="交易类型："+FrmartType(jsonArray.getString(6));
                    String Column19 ="交易方式："+jsonArray.getString(14);

                    String Column12 = "账户姓名："+jsonArray.getString(16);
                    String Column14 = "联络电话："+ jsonArray.getString(17);
                    String Column16 ="账户号码："+jsonArray.getString(18);
                    String Column18 ="银行所在省："+jsonArray.getString(19);
                    String Column20 ="银行卡开户支行："+jsonArray.getString(20);
                    String Column21 ="银行支行："+jsonArray.getString(21);
                    String Column22 ="银行所在的城市/州/地区："+jsonArray.getString(22);
                    DummyContent.addItem(
                            DummyContent.DummyItemDeposit(
                                    String.valueOf(i), Column1, Column2, Column3, Column4, Column5, Column6,Column7
                                    , Column8, Column9, Column10, Column11, Column12, Column13,Column14
                                    , Column15, Column16, Column17, Column18, Column19, Column20,Column21,Column22));
                }
                if(DummyContent.ITEMS.size()==0){
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(0), "", strNodata, ""
                                    , "", "", "",""));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void Getpromotion_history(JSONObject result) {
        try {
            DummyContent.ITEMS.clear();//要先清空数据集
            //没有资料，要写一笔no Data
            if(result.toString().indexOf("data")==-1)
                DummyContent.addItem(
                        DummyContent.createDummyItem(
                                String.valueOf(0), "", strNodata, "", ""
                                , "", "",""));
            else {
                JSONArray jarray = result.getJSONArray("data");
                JSONObject jsonArray;
                JSONObject jsonArrayChild;
                String Column4="" ,Column5="",Column6="" ;
                for (int i = 0; i < jarray.length(); i++) {
                    jsonArray = jarray.getJSONObject(i);
                    String Column1 = jsonArray.getString("depositID").toString();
                    String Column2 = jsonArray.getString("time").toString();
                    String Column3 = jsonArray.getString("money").toString();
                    jsonArrayChild =  (new JSONArray(jsonArray.getString("promoInfo"))).getJSONObject(0) ;
                    if(jsonArrayChild.length()>0){
                        Column4 = jsonArrayChild.getString("title");
                        Column5 = jsonArrayChild.getString("discount");
                        Column6 = jsonArrayChild.getString("betAmount").toString()+"倍";
                    }
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(i), Column1, Column2, Column3, Column4, Column5, Column6,""));
                }
                if(DummyContent.ITEMS.size()==0){
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(0), "", strNodata, ""
                                    , "", "", "",""));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void Getrebatenow(JSONObject result) {
        try {
            DummyContent.ITEMS.clear();//要先清空数据集
            //没有资料，要写一笔no Data
            if(result.toString().indexOf("data")==-1)
                DummyContent.addItem(
                        DummyContent.createDummyItem(
                                String.valueOf(idNodate), "", "", strNodata, ""
                                , "", "",""));
            else {
                JSONArray jarray = result.getJSONArray("data");
                JSONObject jsonArray;
                JSONObject jsonArrayChild;
                String Column1="", Column2="",Column3="", Column4="" ,Column5="",Column6="" ;
                for (int i = 0; i < jarray.length(); i++) {
                    jsonArray = jarray.getJSONObject(i);
                    Column1 = jsonArray.getString("productname").toString();
                    Column2 = jsonArray.getString("rebatedate").toString();
                    Column3 = jsonArray.getString("rebate").toString();
                    Column4 = jsonArray.getString("availamt");
                    Column5 = jsonArray.getString("count");
                    Column6 = jsonArray.getString("rebatep");
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(i), Column1, Column2, Column3, Column4, Column5, Column6,""));
                }
                if(jarray.length()>0){
                    jsonArray = result;
                    Column1 = "加总";
                    Column2 = "";
                    Column3 = jsonArray.getString("totalRebate").toString();
                    Column4 = jsonArray.getString("totalAvailamt");
                    Column5 = jsonArray.getString("totalCount");
                    Column6 = "";
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(jarray.length()), Column1, Column2, Column3, Column4, Column5, Column6,""));
                }
                if(DummyContent.ITEMS.size()==0){
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(idNodate), "", "", strNodata
                                    , "", "", "",""));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void Getcheckrebatenow(JSONObject result) {
        try {
            DummyContent.ITEMS.clear();//要先清空数据集
            //没有资料，要写一笔no Data
            if(result.toString().indexOf("rebatecount")==-1)
                DummyContent.addItem(
                        DummyContent.createDummyItem(
                                String.valueOf(idNodate), "", "", strNodata, ""
                                , "", "",""));
            else {
                    String Column1 = "",Column2 = "", Column4 = "",Column5 = "",Column6 = "",Column3="";
                    Column3 = result.getString("rebatecount");
                    DummyContent.addItem(
                            DummyContent.createDummyItem(
                                    String.valueOf(1), Column1, Column2, Column3, Column4, Column5, Column6,""));

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String  FrmartState(String objValue){
        String returnValue="";
        switch (objValue){
            case "1":
                returnValue="交易终止";
                break;
            case "2":
                returnValue="交易处理中";
                break;
            case "4":
                returnValue="交易成功";
                break;
            case "5":
                returnValue="已受理";
                break;
            default:
                break;
        }
        return returnValue;
    }
    private String  FrmartType(String objValue){
        String returnValue="";
        switch (objValue){
            case "1":
                returnValue="存款";
                break;
            case "2":
                returnValue="取款";
                break;
            case "3":
                returnValue="奖金";
                break;
            case "4":
                returnValue="调整";
                break;
            case "8":
                returnValue="活动--多倍打码";
                break;
            default:
                break;
        }
        return returnValue;
    }
    //DP TO PX
    public int dip2px(Context context, float dipValue)
    {
        float m=context.getResources().getDisplayMetrics().density ;//当前分辨率 宽度
        return (int)(dipValue * m + 0.5f) ;
    }

    //activity 设定的控件值
    private String startDate = "2019-02-01";
    private String endDate = "2019-03-01";
    private String gameType = "";
    private String drpc = "2";
    private String gameKey = "";
    private String operationType="0";
    private String operationState="0";
    private String operationMethod="0";

    public String getStartDate() {
        return startDate;
    }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
    public String getEndDate() {
        return endDate;
    }
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
    public String getGameType() {
        return gameType;
    }
    public void setGameType(String gameType) {
        this.gameType = gameType;
    }
    public String getDrpc() {
        return drpc;
    }
    public void setDrpc(String drpc) {
        this.drpc = drpc;
    }
    public String getGameKey() {
        return gameKey;
    }
    public void setGameKey(String gameKey) {
        this.gameKey = gameKey;
    }
    public String getOperationType() {
        return operationType;
    }
    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }
    public String getOperationState() {
        return operationState;
    }
    public void setOperationState(String operationState) {
        this.operationState = operationState;
    }
    public String getOperationMethod() {
        return operationMethod;
    }
    public void setOperationMethod(String operationMethod) {
        this.operationMethod = operationMethod;
    }
}


