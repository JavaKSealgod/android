package com.example.yu810.new_project;

import android.app.AlertDialog;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.widget.TextView;


public class MainActivity extends AppCompatActivity {
    AlertDialog dialog;
    String account,accountBalance;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //設定隱藏標題
//        getSupportActionBar().hide();
        //設定隱藏狀態
        //getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN);

        TextView loginin = (TextView)findViewById(R.id.loginin);
        TextView much = (TextView)findViewById(R.id.much);
        account = GlobalVar.account;
        accountBalance = GlobalVar.accountBalance;
        loginin.setText(account);
        much.setText(accountBalance);
    }
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK)) {   //確定按下退出鍵
            ConfirmExit(); //呼叫ConfirmExit()函數
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    public void ConfirmExit(){

        dialog = new AlertDialog.Builder(MainActivity.this).create();
        dialog.show();
        //點擊屏幕dialog 不消失
        dialog.setCanceledOnTouchOutside(false);
        Window window = dialog.getWindow();
        window.setContentView(R.layout.activity_exit_app);
    }

    public void login_out(View view){
        //關閉activity
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
        android.os.Process.killProcess(android.os.Process.myPid());
    }
    //activity_exit
    public void login_no(View view){
        dialog.dismiss();
    }

    public void slot_game(View view){
        Intent slot = new Intent(MainActivity.this,Slot_game.class);
        slot.putExtra("SITE","MAIN");
        startActivity(slot);
    }

    public void card_game(View view){
        Intent card = new Intent(MainActivity.this,Card_game.class);
        card.putExtra("SITE","MAIN");
        startActivity(card);
    }

    public void fish_game(View view){
        Intent fish = new Intent(MainActivity.this,Fish_game.class);
        fish.putExtra("SITE","MAIN");
        startActivity(fish);
    }

    public void lucky_game(View view){
        Intent lucky = new Intent(MainActivity.this, Lucky_game.class);
        lucky.putExtra("SITE","MAIN");
        startActivity(lucky);
    }
    public void news(View view){
        Intent news = new Intent(MainActivity.this,News.class);
        startActivity(news);
    }
    public void offer (View view){
        Intent offer = new Intent(MainActivity.this,Offer.class);
        startActivity(offer);
    }
    public void wallet (View view){
        Intent offer = new Intent(MainActivity.this, WalletActivity.class);
        startActivity(offer);
    }
    public void service (View view){
        dialog = new AlertDialog.Builder(MainActivity.this).create();
        dialog.show();
        dialog.setCanceledOnTouchOutside(false);
        Window window = dialog.getWindow();
        window.setContentView(R.layout.activity_customer_service);
    }
    //activity_service
    public void back (View view){
        dialog.dismiss();
    }
    public void account_manager (View view){
        Intent account_manager = new Intent(MainActivity.this,Account_manager.class);
        account_manager.putExtra("SITE","MAIN");
        startActivity(account_manager);
    }
    public void account_record (View view){
        Intent account_record = new Intent(MainActivity.this,Account_record.class);
        account_record.putExtra("SITE","MAIN");
        startActivity(account_record);
    }
    public void income(View view){
        Intent income = new Intent(MainActivity.this,InCome.class);
        income.putExtra("SITE","MAIN");
        startActivity(income);
    }
    public void money(View view){
        Intent money = new Intent(MainActivity.this,Money.class);
        money.putExtra("SITE","MAIN");
        startActivity(money);
    }
    public void setting(View view){
        dialog = new AlertDialog.Builder(MainActivity.this).create();
        dialog.show();
        //點擊屏幕dialog 不消失
        dialog.setCanceledOnTouchOutside(false);
        Window window = dialog.getWindow();
        window.setContentView(R.layout.activity_setting);
    }
    //setting
    public void setting_out(View view){
//        dialog.dismiss();
//        dialog = new AlertDialog.Builder(MainActivity.this).create();
//        dialog.show();
//        //點擊屏幕dialog 不消失
//        dialog.setCanceledOnTouchOutside(false);
//        Window window = dialog.getWindow();
//        window.setContentView(R.layout.activity_exit_app);
        Intent No_login = new Intent(MainActivity.this,No_MainActivity.class);
        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
        cookieManager.removeSessionCookie();//移除
        startActivity(No_login);
        finish();
    }
}

