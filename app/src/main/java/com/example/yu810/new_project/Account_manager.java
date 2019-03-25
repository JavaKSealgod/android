package com.example.yu810.new_project;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Account_manager extends AppCompatActivity {

    Fragment fr;
    private LayoutInflater inflater;
    //數字驗證碼
    String num_Verification_code ;
    String T = "";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account_manager);
        num();

        final ImageButton b2 = (ImageButton)findViewById(R.id.change_password) ;
        final ImageButton b1 = (ImageButton)findViewById(R.id.change_login);
        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                num();
                b1.setBackgroundResource(R.drawable.managet_code);
                b2.setBackgroundResource(R.drawable.manager_code02);
                if(view == findViewById(R.id.change_login)){
                    fr = new Change_login();
                    FragmentManager fm = getSupportFragmentManager();
                    FragmentTransaction ft = fm.beginTransaction();
                    ft.replace(R.id.fragment_change_manger,fr);
                    ft.commit();
                }
            }
        });
        b2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                b1.setBackgroundResource(R.drawable.manager_code02);
                b2.setBackgroundResource(R.drawable.managet_code);
                if(view == findViewById(R.id.change_password)){
                    fr = new Change_password();
                    FragmentManager fm = getSupportFragmentManager();
                    FragmentTransaction ft = fm.beginTransaction();
                    ft.replace(R.id.fragment_change_manger,fr);
                    ft.commit();
                }
            }
        });
    }
    View getView(final int i)
    {
        //15位數亂碼
        String a;
        for(int j=0 ; j<=14 ; j++){
            Double var = Math.random();
            int ac = (int) (var * (10));
            a = Integer.toString(ac);
            T += a;
        }
        num_Verification_code = "http://astrde.com/Interface/zh-CN/account/verifycode.json?T="
                +T;

        View rootView = inflater.inflate( R.layout.activity_num__code,null);
        final ImageView image = (ImageView) rootView.findViewById(R.id.num_item);
        new AsyncTask<String, Void, Bitmap>(){

            @Override
            protected Bitmap doInBackground(String... strings) {
                String url = strings[0];
                return getBitmapFromURL(url);
            }
            @Override
            protected void onPostExecute(Bitmap result)
            {
                image. setImageBitmap (result);
                super.onPostExecute(result);
            }
        }.execute(num_Verification_code);
        image.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getView(0);
            }
        });
        return rootView;
    }



    public void back_site(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");

        if(site_name.equals("MAIN")){
            Intent main = new Intent(Account_manager.this,MainActivity.class);
            startActivity(main);
            finish();
        }else if(site_name.equals("FISH")){
            Intent fish = new Intent(Account_manager.this,Fish_game.class);
            startActivity(fish);
            finish();
        }else if(site_name.equals("SLOT")){
            Intent slot = new Intent(Account_manager.this,Slot_game.class);
            startActivity(slot);
            finish();
        }else if(site_name.equals("LUCKY")){
            Intent lucky = new Intent(Account_manager.this, Lucky_game.class);
            startActivity(lucky);
            finish();
        }else if(site_name.equals("CARD")){
            Intent card = new Intent(Account_manager.this,Card_game.class);
            startActivity(card);
            finish();
        }
    }
    public void num(){
        inflater=getLayoutInflater();
        final LinearLayout inLay=(LinearLayout) findViewById(R.id.um_Verification_code);
        inLay.addView(getView(0));
    }
    public static Bitmap getBitmapFromURL(String src){
        try
        {
            URL url = new URL(src);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            Bitmap bitmap = BitmapFactory.decodeStream(input);
            return bitmap;
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return null;
    }
}
