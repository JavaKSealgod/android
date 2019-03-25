package com.example.yu810.new_project;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import com.example.yu810.new_project.utils.ApiHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.json.JSONObject;

import java.util.ArrayList;

import cz.msebera.android.httpclient.Header;

public class InCome extends AppCompatActivity {

    TextView user_name;
    String account;
    String site_name;
    private ArrayList<Bank_item> mbankList;
    private BankAdapter mAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_in_come);
        user_name = (TextView)findViewById(R.id.user_name);
        account = GlobalVar.account;
        user_name.setText(account);
        initList();
        findvaule();

    }
    private void initList(){
        mbankList = new ArrayList<>();
        mbankList.add(new Bank_item("11111"));
        mbankList.add(new Bank_item("22222"));
        mbankList.add(new Bank_item("33333"));
        mbankList.add(new Bank_item("44444"));
        mbankList.add(new Bank_item("55555"));
        mbankList.add(new Bank_item("666666"));
        mbankList.add(new Bank_item("777777"));
        mbankList.add(new Bank_item("4444888884"));

    }
    AdapterView.OnItemSelectedListener bank_item = new AdapterView.OnItemSelectedListener() {
        @Override
        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
            Bank_item click = (Bank_item)parent.getItemAtPosition(position);
            String clickname = click.getbankname();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {

        }
    };
    public void bank_ok(View view){
        RequestParams objParams  = GetRequestParams();
        ApiHttpClient.post("pocket/drawings_money_apply.json" , objParams , new JsonHttpResponseHandler(){
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                Log.i("AppInfo" , "ApiHttpClient 1436 " + response.toString());

                try {
                    JSONObject result = new JSONObject(response.toString());
                    TextView t = (TextView)findViewById(R.id.new_site);
                    String siteMessage = result.getString("siteMessage");
                    t.setText(siteMessage.toString());
                }catch (Exception e)
                {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                Log.i("AppInfo" , "ApiHttpClient onFailure " + responseString);
            }
        });
    }
    //准备请求需要的参数
    private  RequestParams GetRequestParams(){
        RequestParams objParams = new RequestParams();
        objParams.put("startDate","2019-02-01");
        objParams.put("startDate","2019-02-01");
        objParams.put("startDate","2019-02-01");

        return objParams;
    }

    public void back(View view){
        Intent get_name = getIntent();
        site_name= get_name.getStringExtra("SITE");
        if(site_name.equals("MAIN")){
            Intent main = new Intent(InCome.this,MainActivity.class);
            startActivity(main);
            finish();
        }else if(site_name.equals("FISH")){
            Intent fish = new Intent(InCome.this,Fish_game.class);
            startActivity(fish);
            finish();
        }else if(site_name.equals("SLOT")){
            Intent slot = new Intent(InCome.this,Slot_game.class);
            startActivity(slot);
            finish();
        }else if(site_name.equals("LUCKY")){
            Intent lucky = new Intent(InCome.this, Lucky_game.class);
            startActivity(lucky);
            finish();
        }else if(site_name.equals("CARD")){
            Intent card = new Intent(InCome.this,Card_game.class);
            startActivity(card);
            finish();
        }
    }
    public void findvaule(){
        //額度
        EditText money = (EditText)findViewById(R.id.editText4);
        //電話
        EditText phone = (EditText)findViewById(R.id.editText5);
        //支付銀行
        Spinner bank = (Spinner)findViewById(R.id.spinner);
        //帳戶姓名
        EditText name = (EditText)findViewById(R.id.edit_name);
        //銀行卡號
        EditText bank_edit = (EditText)findViewById(R.id.bank_edit);
        //開戶省分
        EditText con_edit = (EditText)findViewById(R.id.con_edit);
        //開戶支行
        EditText which_edit = (EditText)findViewById(R.id.which_edit);
        //開戶城市
        EditText place_edit = (EditText)findViewById(R.id.place_edit);
        //提款密碼
        EditText code_edit = (EditText)findViewById(R.id.code_edit);
        mAdapter = new BankAdapter(this,mbankList);
        bank.setAdapter(mAdapter);
        bank.setOnItemSelectedListener(bank_item);
    }
}
