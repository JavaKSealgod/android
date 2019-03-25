package com.example.yu810.new_project;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.OrientationHelper;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.CalendarView;
import android.widget.DatePicker;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.yu810.new_project.dummy.DummyContent;
import com.example.yu810.new_project.dummy.ReportData;

import java.sql.Array;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Account_record extends AppCompatActivity {

    Button date_bt,date_bt2,butSearch,butclose,butbet,butrebate,butdeposit
            ,butrecordPromotion,butrecordBets,butqryrebateSearch,butqryrebateSubmit;
    int year, month,day;
    Calendar calendar;
    TextView tx_in,tx_in2,textStartDt,txtqryrebate;
    int mReportType=ReportData.bet;
    LinearLayout LinBet,Lindeposit,Linqryrebate;
    private ReportData objReportData = new ReportData();
    //grid 容器
    FragmentManager fragmentManager = getSupportFragmentManager();
    FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
    public Handler getReportHandler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            txtqryrebate.setText(txtqryrebate.getText() + DummyContent.ITEMS.get(0).Column3);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account_record);
        initControl(mReportType);//初始化控件

    }

    //初始化控件
    private  void initControl(int vReportType){
        date_bt = (Button)findViewById(R.id.date);
        tx_in = (TextView)findViewById(R.id.date_in);
        date_bt2 = (Button)findViewById(R.id.date2);
        tx_in2 = (TextView)findViewById(R.id.date_in2);
        calendar = Calendar.getInstance();
        year = calendar.get(Calendar.YEAR);
        month = calendar.get(Calendar.MONTH);
        day = calendar.get(Calendar.DAY_OF_MONTH);
        butSearch= (Button)findViewById(R.id.butSearch);
        butclose= (Button)findViewById(R.id.close);
        butbet= (Button)findViewById(R.id.butbet);
        butrebate= (Button)findViewById(R.id.butrebate);
        butdeposit= (Button)findViewById(R.id.butdeposit);
        butrecordPromotion= (Button)findViewById(R.id.butrecordPromotion);
        butrecordBets= (Button)findViewById(R.id.butrecordBets);
        butqryrebateSearch = (Button)findViewById(R.id.butqryrebateSearch);
        butqryrebateSubmit = (Button)findViewById(R.id.butqryrebateSubmit);
        LinBet= (LinearLayout) findViewById(R.id.LinBet);
        Lindeposit= (LinearLayout) findViewById(R.id.Lindeposit);
        Linqryrebate = (LinearLayout) findViewById(R.id.Linqryrebate);
        textStartDt =(TextView) findViewById(R.id.textStartDt);
        txtqryrebate = (TextView)findViewById(R.id.txtqryrebate);
        systeDateFormat();//初始化日期
        setOnClickListener();//注册button事件
        SetLinearLayout(vReportType);//根据grid画表头
    }

    //注册button事件
    private  void setOnClickListener(){
        //开始日期，预设本月第一天
        Calendar cal = Calendar.getInstance();
        cal.set(cal.DAY_OF_MONTH, 1);
        final int dayStart = cal.get(Calendar.DAY_OF_MONTH);
        date_bt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DatePickerDialog datePickerDialog = new DatePickerDialog(Account_record.this,
                        new DatePickerDialog.OnDateSetListener() {
                            @Override
                            public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
                                month = month+1;
                                tx_in.setText(year+"-"+month+"-"+dayOfMonth);
                            }
                        },year,month,dayStart);
                datePickerDialog.show();
            }
        });

        date_bt2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DatePickerDialog datePickerDialog = new DatePickerDialog(Account_record.this,
                        new DatePickerDialog.OnDateSetListener() {
                            @Override
                            public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
                                month = month+1;
                                tx_in2.setText(year+"-"+month+"-"+dayOfMonth);
                            }
                        },year,month,day);
                datePickerDialog.show();
            }
        });
        //查询
        butSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("mReportType", "mReportType == " + mReportType);
                fragmentLine(mReportType);
            }
        });
        //关闭按钮
        butclose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intentMainActivity = new Intent(Account_record.this,MainActivity.class);
                startActivity(intentMainActivity);
            }
        });
        //下注记录
        butbet.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mReportType = ReportData.bet;
                SetLinearLayout(mReportType);
            }
        });
        //返水记录
        butrebate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mReportType = ReportData.rebate;
                SetLinearLayout(mReportType);
            }
        });
        //存取款记录
        butdeposit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mReportType = ReportData.deposit_drawings_money;
                SetLinearLayout(mReportType);
            }
        });
        //我的存款优惠
        butrecordPromotion.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mReportType = ReportData.promotion_history;
                SetLinearLayout(mReportType);
            }
        });
        //时时反水
       butrecordBets.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               //今日共可反水次数
               mReportType = ReportData.checkrebatenow;
               objReportData.GetReportData(String.valueOf(mReportType),getReportHandler);

               mReportType = ReportData.qryrebatenow;
               SetLinearLayout(mReportType);
           }
       });
       //查询，提交
        butqryrebateSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mReportType = ReportData.qryrebatenow;
                Log.i("mReportType", "mReportType == " + mReportType);
                fragmentLine(mReportType);
            }
        });
        butqryrebateSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mReportType = ReportData.setrebatenow;
                Log.i("mReportType", "mReportType == " + mReportType);
                fragmentLine(mReportType);
            }
        });
    }

    //设置fragment
    private  void fragmentTransaction(){
        fragmentManager = getSupportFragmentManager();
        fragmentTransaction = fragmentManager.beginTransaction();
        if(fragmentManager.getFragments().size() >0) {
            fragmentTransaction.hide(fragmentManager.getFragments().get(0));
            fragmentTransaction.remove(fragmentManager.getFragments().get(0));
            fragmentManager.getFragments().remove(0);
            fragmentTransaction.commit();
        }
    }
    private  void fragmentLine(int vReportType){
        fragmentTransaction();
        fragmentManager = getSupportFragmentManager();
        fragmentTransaction = fragmentManager.beginTransaction();
        switch (vReportType)
        {
            case ReportData.rebate:
                Account_rebateFragment objAccount_rebateFragment = new Account_rebateFragment();
                fragmentTransaction.add(R.id.fragment_container, objAccount_rebateFragment);
                fragmentTransaction.show(objAccount_rebateFragment);
                fragmentTransaction.commit();
                break;
            case ReportData.deposit_drawings_money:
                Account_deposit_Fragment objAccount_deposit_Fragment = new Account_deposit_Fragment();
                fragmentTransaction.add(R.id.fragment_container, objAccount_deposit_Fragment);
                fragmentTransaction.show(objAccount_deposit_Fragment);
                fragmentTransaction.commit();
                break;
            case ReportData.promotion_history:
                Account_promotionhistoryFragment objAccount_promotionhistoryFragment = new Account_promotionhistoryFragment();
                fragmentTransaction.add(R.id.fragment_container, objAccount_promotionhistoryFragment);
                fragmentTransaction.show(objAccount_promotionhistoryFragment);
                fragmentTransaction.commit();
                break;
            case ReportData.qryrebatenow:
            case ReportData.setrebatenow:
                Account_qryrebatenowFragment objAccount_qryrebatenowFragment = new Account_qryrebatenowFragment();
                fragmentTransaction.add(R.id.fragment_container, objAccount_qryrebatenowFragment);
                fragmentTransaction.show(objAccount_qryrebatenowFragment);
                fragmentTransaction.commit();
                break;
            default:
                Account_bet_Fragment objAccount_bet_Fragment = new Account_bet_Fragment();
                fragmentTransaction.add(R.id.fragment_container, objAccount_bet_Fragment);
                fragmentTransaction.show(objAccount_bet_Fragment);
                //一定要记得提交
                fragmentTransaction.commit();
                break;
        }
    }

    //设置Grid 表头
    private  void SetLinearLayout(int vReportType){
        Map<String, Integer>  GridheadMap = GetGridHead(vReportType) ;
        LinearLayout objLinearLayout = (LinearLayout)findViewById(R.id.headLayOut);//取到表头LinearLayout，添加动态表头
        int i=0;
        DisplayMetrics metrics= new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        objLinearLayout.removeAllViews();//先清掉所有的表头，再add
        fragmentTransaction();//同时把grid也清空

        for (String key : GridheadMap.keySet()) {
            System.out.println("key= "+ key + " and value= " + GridheadMap.get(key));
            int widthpx = dip2px(this,Float.valueOf(GridheadMap.get(key))); //dp to pixe
            TextView valueTV = new TextView(this);
            valueTV.setText(key);
            valueTV.setId(i);
            valueTV.setWidth(widthpx);
            valueTV.setGravity(Gravity.CENTER);
            valueTV.setLayoutParams(new RelativeLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    60));
            objLinearLayout.addView(valueTV,i);
            i++;
        }
    }
    //依据grid.Items 设定list长度
    private  LinkedHashMap<String, Integer> GetGridHead(int vReportType){
        LinkedHashMap<String, Integer> Heard_MAP = new LinkedHashMap<String, Integer>();
        final int iPage= 23;//dp
        LinBet.setVisibility(View.GONE);//影藏
        Lindeposit.setVisibility(View.GONE);//影藏
        Linqryrebate.setVisibility(View.GONE);//影藏
        Drawable background = ContextCompat.getDrawable(this, R.drawable.btn_tab_854f1dab96);
        Drawable backgroundbtn_tab_active = ContextCompat.getDrawable(this, R.drawable.btn_tab_active_e375cd08c9);
        butbet.setBackground(background);
        butrebate.setBackground(background);
        butdeposit.setBackground(background);
        butrecordPromotion.setBackground(background);
        butrecordBets.setBackground(background);
        textStartDt.setText("下注日期");
        butSearch.setVisibility(View.VISIBLE);//显示
        switch (vReportType){
            case ReportData.bet:
                Heard_MAP.put("类别",80+iPage);
                Heard_MAP.put("下注笔数",80+iPage);
                Heard_MAP.put("总注额",80+iPage);
                Heard_MAP.put("派彩",60+iPage);
                Heard_MAP.put("未计算量",60+iPage);
                Heard_MAP.put("有效投注",60+iPage);

                //控制查询条件是否显示
                LinBet.setVisibility(View.VISIBLE);//显示
                butbet.setBackground(backgroundbtn_tab_active);
                break;
            case ReportData.rebate:
                Heard_MAP.put("游戏类别",180+iPage);
                Heard_MAP.put("发放时间",220+iPage);
                Heard_MAP.put("发放金额",120+iPage);

                butrebate.setBackground(backgroundbtn_tab_active);
                break;
            case ReportData.deposit_drawings_money:
                Heard_MAP.put("事项",130+iPage);
                Heard_MAP.put("交易日期",150+iPage);
                Heard_MAP.put("提交金额",120+iPage);
                Heard_MAP.put("交易状态",80+iPage);

                Lindeposit.setVisibility(View.VISIBLE);//显示
                butdeposit.setBackground(backgroundbtn_tab_active);
                break;
            case ReportData.promotion_history:
                Heard_MAP.put("交易码",220+iPage);
                Heard_MAP.put("参加时间",180+iPage);
                Heard_MAP.put("入款金额",120+iPage);

                textStartDt.setText("起始日期");
                butrecordPromotion.setBackground(backgroundbtn_tab_active);
                break;
            case ReportData.qryrebatenow:
            case ReportData.setrebatenow:
                Heard_MAP.put("游戏名称",110+iPage);
                Heard_MAP.put("返水日期",65+iPage);
                Heard_MAP.put("返水金额",65+iPage);
                Heard_MAP.put("有效投注",70+iPage);
                Heard_MAP.put("笔数",50+iPage);
                Heard_MAP.put("返水百分比",60+iPage);

                butrecordBets.setBackground(backgroundbtn_tab_active);
                Linqryrebate.setVisibility(View.VISIBLE);//显示
                butSearch.setVisibility(View.INVISIBLE);//影藏
                break;
            default:
                break;
        }
        return Heard_MAP;
    }

    //DP TO PX
    public int dip2px(Context context, float dipValue)
    {
        float m=context.getResources().getDisplayMetrics().density ;//当前分辨率 宽度
        return (int)(dipValue * m + 0.5f) ;
    }

    //预设系统时间
    private  void systeDateFormat(){
        long time = System.currentTimeMillis();
        Date date = new Date(time);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_MONTH, 1);
        tx_in.setText(format.format(cal.getTime()) );
        tx_in2.setText(format.format(date));
    }

}
