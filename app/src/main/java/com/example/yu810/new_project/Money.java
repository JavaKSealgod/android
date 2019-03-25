package com.example.yu810.new_project;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class Money extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_money);
    }
    public void back_site(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");

        if(site_name.equals("MAIN")){
            Intent main = new Intent(Money.this,MainActivity.class);
            startActivity(main);
            finish();
        }else if(site_name.equals("FISH")){
            Intent fish = new Intent(Money.this,Fish_game.class);
            startActivity(fish);
            finish();
        }else if(site_name.equals("SLOT")){
            Intent slot = new Intent(Money.this,Slot_game.class);
            startActivity(slot);
            finish();
        }else if(site_name.equals("LUCKY")){
            Intent lucky = new Intent(Money.this, Lucky_game.class);
            startActivity(lucky);
            finish();
        }else if(site_name.equals("CARD")){
            Intent card = new Intent(Money.this,Card_game.class);
            startActivity(card);
            finish();
        }
    }
    public void ChangeFragment123(View view){

        Fragment fr;
        if(view == findViewById(R.id.login_in_first)){
            fr = new Login_in_first();
            FragmentManager fm = getSupportFragmentManager();
            FragmentTransaction ft = fm.beginTransaction();
            ft.replace(R.id.fragment_online,fr);
            ft.commit();
        }
        if(view == findViewById(R.id.quick_registration)){
            fr = new Quick_registration();
            FragmentManager fm = getSupportFragmentManager();
            FragmentTransaction ft = fm.beginTransaction();
            ft.replace(R.id.fragment_online,fr);
            ft.commit();
        }
        if(view == findViewById(R.id.forget_code)) {
            fr = new Forget_code();
            FragmentManager fm = getSupportFragmentManager();
            FragmentTransaction ft = fm.beginTransaction();
            ft.replace(R.id.fragment_place, fr);
            ft.commit();
        }
    }
}
