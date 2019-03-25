package com.example.yu810.new_project;

import android.app.AlertDialog;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;

public class No_MainActivity extends AppCompatActivity {
    AlertDialog dialog;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_no__main);
//        getSupportActionBar().hide();
    }
    public void no_login(View view){
        dialog = new AlertDialog.Builder(No_MainActivity.this).create();
        dialog.show();
        dialog.setCanceledOnTouchOutside(false);
        Window window = dialog.getWindow();
        window.setContentView(R.layout.activity_no__login);
    }
    public void login(View view){
        Intent login = new Intent(No_MainActivity.this, LoginInActivity.class);
        startActivity(login);
    }
    public void close_login(View view){
        dialog.dismiss();
    }
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK)) {   //確定按下退出鍵
            ConfirmExit(); //呼叫ConfirmExit()函數
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    public void ConfirmExit(){

        dialog = new AlertDialog.Builder(No_MainActivity.this).create();
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
    public void login_no(View view){
        dialog.dismiss();
    }

    public void slot_game(View view){
        Intent slot = new Intent(No_MainActivity.this,Slot_game.class);
        slot.putExtra("SITE","NO_MAIN");
        startActivity(slot);
    }

    public void card_game(View view){
        Intent card = new Intent(No_MainActivity.this,Card_game.class);
        card.putExtra("SITE","NO_MAIN");
        startActivity(card);
    }

    public void fish_game(View view){
        Intent fish = new Intent(No_MainActivity.this,Fish_game.class);
        fish.putExtra("SITE","NO_MAIN");
        fish.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        startActivity(fish);
    }
    public void lucky_game(View view){
        Intent lucky = new Intent(No_MainActivity.this, Lucky_game.class);
        lucky.putExtra("SITE","NO_MAIN");
        startActivity(lucky);
    }
    public void news(View view){
        Intent news = new Intent(No_MainActivity.this,News.class);
        startActivity(news);
    }
    public void offer (View view){
        Intent offer = new Intent(No_MainActivity.this,Offer.class);
        startActivity(offer);
    }
    public void service (View view){
        dialog = new AlertDialog.Builder(No_MainActivity.this).create();
        dialog.show();
        dialog.setCanceledOnTouchOutside(false);
        Window window = dialog.getWindow();
        window.setContentView(R.layout.activity_customer_service);
    }
    //activity_service
    public void back (View view){
        dialog.dismiss();
    }
}
