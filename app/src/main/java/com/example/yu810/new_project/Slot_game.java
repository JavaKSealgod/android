package com.example.yu810.new_project;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.design.widget.NavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;

public class Slot_game extends AppCompatActivity {

    AlertDialog dialog;
    private LayoutInflater inflater;
    //串接API網址
    ArrayList<String> game_uu,game_uu111,game_uu222 = new ArrayList<String>();
    ArrayList<String>game_name1 = new ArrayList<String>();
    String url_game,icon;
    String account= null;
    String accountBalance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_slot_game);
        TextView accountBalance1 = (TextView)findViewById(R.id.accountBalance) ;
        Button account1= (Button) findViewById(R.id.loginin);
        account= GlobalVar.account;
        accountBalance = GlobalVar.accountBalance;
        account1.setText(account);
        accountBalance1.setText(accountBalance);
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            account1.setText("請先登入");
            accountBalance1.setText("0.0");
        }
        get_name();
        api();
    }
    public void api(){
        //mg列表
        inflater=getLayoutInflater();
        final LinearLayout inLay=(LinearLayout) findViewById(R.id.innerLay);
        final LinearLayout inLay2=(LinearLayout) findViewById(R.id.innerLay2);

        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest postRequest = new StringRequest(Request.Method.POST,"http://slotgamem.gamestreedemo.net/interface/zh-CN/mgcasino/product_list.json?html5=true",
                    new Response.Listener<String>()
                    {
                        @Override
                        public void onResponse(String response) {
                            String dat = null;
                            String img = null;
                            try {
                                dat = new JSONObject(response).getString("data");
                                for(int i=0; i<dat.length(); i+=2){
                                img = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("img");
                                icon = "http://img1.zaixiongbz.com/mgmobile/"+img;
                                inLay.addView(getView(i));
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            try {
                                dat = new JSONObject(response).getString("data");
                                for(int i=1; i<dat.length(); i+=2){
                                    img = new JSONArray(new JSONObject(response).getString("data")).
                                            getJSONObject(i).getString("img");
                                    icon = "http://img1.zaixiongbz.com/mgmobile/"+img;
                                    inLay2.addView(getView(i));
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    },
                    new Response.ErrorListener()
                    {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            // error
                        }
                    }){
                @Override
                protected HashMap<String, String> getParams()throws AuthFailureError
                {
                    //在这里设置需要post的参数
                    HashMap<String, String>  params = new HashMap<String, String>();
                    String data = null;
                    params.put("gameKind", "1");
                    params.put("html5", "true");
                    return params;
                }
            };
            queue.add(postRequest);
    }
    public void get_name(){
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest postRequest = new StringRequest(Request.Method.POST,"http://slotgamem.gamestreedemo.net/interface/zh-CN/mgcasino/product_list.json?html5=true",
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        String dat = null;
                        String name = null;
                        try {
                            dat = new JSONObject(response).getString("data");
                            Log.i("AppInfo",dat);
                            for(int i=0; i<dat.length(); i++){
                                name = new JSONArray(new JSONObject(response).getString("data")).
                                        getJSONObject(i).getString("name");
                                game_name1.add(name);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                    }
                }){
            @Override
            protected HashMap<String, String> getParams()throws AuthFailureError
            {
                //在这里设置需要post的参数
                HashMap<String, String>  params = new HashMap<String, String>();
                String data = null;
                params.put("gameKind", "1");
                params.put("html5", "true");
                return params;
            }
        };
        queue.add(postRequest);
    }
    View getView(final int i)
    {
        View rootView = inflater.inflate( R.layout.activity_slot__image,null);
        final ImageView image = (ImageView) rootView.findViewById(R.id.img_list_item);
        final TextView  tv = (TextView) rootView.findViewById(R.id.game_name);
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
                tv.setText(game_name1.get(i));
                super.onPostExecute(result);
            }
        }.execute(icon);
        image.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            }
        });
        return rootView;
    }
    public void account_manager (View view){
        Intent account_manager = new Intent(Slot_game.this,Account_manager.class);
        account_manager.putExtra("SITE","SLOT");
        startActivity(account_manager);
    }
    public void money(View view){
        Intent money = new Intent(Slot_game.this,Money.class);
        money.putExtra("SITE","SLOT");
        startActivity(money);
    }
    public void income(View view){
        Intent income = new Intent(Slot_game.this,InCome.class);
        income.putExtra("SITE","SLOT");
        startActivity(income);
    }
    public void service (View view){
        dialog = new AlertDialog.Builder(Slot_game.this).create();
        dialog.show();
        dialog.setCanceledOnTouchOutside(false);
        Window window = dialog.getWindow();
        window.setContentView(R.layout.activity_customer_service);
    }
    //activity_service
    public void back (View view){
        dialog.dismiss();
    }
    public void setting(View view){
        dialog = new AlertDialog.Builder(Slot_game.this).create();
        dialog.show();
        //點擊返回鍵dialog 不消失
        //dialog.setCancelable(false);
        //點擊屏幕dialog 不消失
        dialog.setCanceledOnTouchOutside(false);
        Window window = dialog.getWindow();
        window.setContentView(R.layout.activity_setting);
    }
    //setting
    public void setting_out(View view){
        Intent No_login = new Intent(Slot_game.this,No_MainActivity.class);
        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
        cookieManager.removeSessionCookie();//移除
        startActivity(No_login);
        finish();
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
        dialog.cancel();
    }
    public void goBack (View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goback = new Intent(Slot_game.this,No_MainActivity.class);
            startActivity(goback);
            finish();
        }else {
            Intent goback = new Intent(Slot_game.this, MainActivity.class);
            startActivity(goback);
            finish();
        }
    }
    public void fish01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Slot_game.this, Fish_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent gofish = new Intent(Slot_game.this, Fish_game.class);
            gofish.putExtra("SITE","MAIN");
            startActivity(gofish);
            finish();
        }
    }
    public void card01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Slot_game.this, Card_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent gocard = new Intent(Slot_game.this, Card_game.class);
            gocard.putExtra("SITE","MAIN");
            startActivity(gocard);
            finish();
        }
    }
    public void lucky01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Slot_game.this, Lucky_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent golucky = new Intent(Slot_game.this, Lucky_game.class);
            golucky.putExtra("SITE","MAIN");
            startActivity(golucky);
            finish();
        }
    }
    //點擊開啟drawer視窗
    public void open_drawer(View view){
        DrawerLayout drawer = (DrawerLayout)findViewById(R.id.drawer);
        NavigationView navigationView = (NavigationView)findViewById(R.id.NavigationView);
        drawer.openDrawer(navigationView);
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

    public void Slot_Game(View view){
        switch (view.getId()){
            case R.id.MG:
                GlobalVar.Slot_Item = "mgcasino";
                break;
            case R.id.FULI:
                GlobalVar.Slot_Item = "";
                break;
            case R.id.JDB:
                GlobalVar.Slot_Item = "jdbgame";
                break;
        }
        String url_slot = "http://slotgamem.gamestreedemo.net/interface/zh-CN/"+GlobalVar.Slot_Item+"/product_list.json?html5=true";
        final LinearLayout inLay=(LinearLayout) findViewById(R.id.innerLay);
        final LinearLayout inLay2=(LinearLayout) findViewById(R.id.innerLay2);
        inLay.removeAllViews();
        inLay2.removeAllViews();
        Log.i("AppInfo",GlobalVar.Slot_Item);

        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest postRequest = new StringRequest(Request.Method.POST,url_slot,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        String dat = null;
                        String img = null;
                        try {
                            dat = new JSONObject(response).getString("data");
                            for(int i=0; i<dat.length(); i+=2){
                                img = new JSONArray(new JSONObject(response).getString("data")).
                                        getJSONObject(i).getString("img");
                                icon = "http://img1.zaixiongbz.com/"+GlobalVar.Slot_Item+"/"+img;
                                inLay.addView(getView(i));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        try {
                            dat = new JSONObject(response).getString("data");
                            for(int i=1; i<dat.length(); i+=2){
                                img = new JSONArray(new JSONObject(response).getString("data")).
                                        getJSONObject(i).getString("img");
                                icon = "http://img1.zaixiongbz.com/"+GlobalVar.Slot_Item+"/"+img;
                                inLay2.addView(getView(i));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("AppInfo","NOLOGIN");
                    }
                }){
            @Override
            protected HashMap<String, String> getParams()throws AuthFailureError
            {
                //在这里设置需要post的参数
                HashMap<String, String>  params = new HashMap<String, String>();
                params.put("gameKind", "1");
                params.put("html5", "true");
                return params;
            }
        };
        queue.add(postRequest);    }
}
