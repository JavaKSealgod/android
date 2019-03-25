package com.example.yu810.new_project;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.design.widget.NavigationView;
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

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.yu810.new_project.utils.ApiHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

import cz.msebera.android.httpclient.Header;

public class Lucky_game extends AppCompatActivity {

    //串接API網址
    String url_ip = "http://astrde.com/Interface/zh-CN/slotgame/slot_gamelist.json?html5=true";
    RequestQueue mRequestQueue;
    StringRequest mStringRequest;
    AlertDialog dialog;
    private LayoutInflater inflater;
    ArrayList<String> game_uu = new ArrayList<String>();
    ArrayList<String> game_uu2 = new ArrayList<String>();
    String account,accountBalance;
    ArrayList<String> name_array = new ArrayList<String>();
    String icon,url_game;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
        setContentView(R.layout.activity_luky_game);
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
        game_name();
        game_item();
    }
    public void game_name(){
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest request = new StringRequest(Request.Method.GET, url_ip, new Response.Listener<String>(){
            @Override
            public void onResponse(String response) {
                String dat = null;
                String Name = null;
                String Parameter = null;
                String GameName = null;
                try {
                    dat = new JSONObject(response).getString("data");
                    for(int i=0; i<dat.length(); i++){
                        Name = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("Name");
                        Parameter = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("Parameter");
                        GameName = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("GameName");
                        name_array.add(Name);
                        url_game = Parameter;
                        game_uu.add(url_game);
                        game_uu2.add(GameName);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        queue.add(request);
    }
    public void game_item(){
        inflater=getLayoutInflater();
        final LinearLayout inLay=(LinearLayout) findViewById(R.id.innerLay);
        final LinearLayout inLay2=(LinearLayout) findViewById(R.id.innerLay2);
        //串接API產品
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest request = new StringRequest(Request.Method.GET, url_ip, new Response.Listener<String>(){
            @Override
            public void onResponse(String response) {
                String dat = null;
                String GameId = null;
                String GameName = null;
                String Parameter = null;
                String Icon_Item = null;
                try {
                    dat = new JSONObject(response).getString("data");
//                        Toast.makeText(Lucky_game.this,dat.toString(),Toast.LENGTH_LONG).show();
                    for(int i=0; i<dat.length(); i+=2){
                        GameId = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("GameId");
                        GameName = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("GameName");
                        Parameter = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("Parameter");
                        switch (GameName){
                            case "bnggame":
                                Icon_Item = ".png";
                                break;
                            case "aggame":
                                Icon_Item = ".png";
                                break;
                            case "agcasino":
                                Icon_Item = ".png";
                                GameName = "aggame";
                                break;
                            case "agigame":
                                Icon_Item = ".png";
                                break;
                            case "bb":
                                Icon_Item = ".png";
                                GameName = "bbgame";
                                break;
                            case "bbgame":
                                Icon_Item = ".png";
                                break;
                            case "cqcasino":
                                Icon_Item = ".png";
                                break;
                            case "dtgame":
                                Icon_Item = ".png";
                                break;
                            case "gnscasino":
                                Icon_Item = ".png";
                                break;
                            case "kygame":
                                Icon_Item = ".png";
                                break;
                            case "mgmobile":
                                Icon_Item = ".png";
                                break;
                            case "mtcasino":
                                Icon_Item = ".png";
                                break;
                            case "newbygame":
                                Icon_Item = ".png";
                                break;
                            case "ptsgame":
                                Icon_Item = ".png";
                                break;
                            case "toggame":
                                Icon_Item = ".png";
                                break;
                            case "vggame":
                                Icon_Item = ".png";
                                break;
                            case "vtgame":
                                Icon_Item = ".png";
                                break;
                            case "MGCasino_SlotGame":
                                Icon_Item = ".png";
                                GameName = "mgmobile";
                                break;
                            case "leggame":
                                Icon_Item = ".png";
                                break;
                            case "wmgame":
                                Icon_Item = ".png";
                                break;
                            case "gmgame":
                                Icon_Item = ".png";
                                break;
                            case "pggame":
                                Icon_Item = ".png";
                                break;
                            case "fishgame2":
                                Icon_Item = ".jpg";
                                break;
                            case "jdbgame":
                                Icon_Item = ".jpg";
                                GameName = "jdbgame2";
                                break;
                            case "ptcasino":
                                Icon_Item = ".jpg";
                                break;
                            case "sggame":
                                Icon_Item = ".jpg";
                                break;
                            case "wg_series":
                                Icon_Item = ".jpg";
                                break;
                            case "megawincasino":
                                Icon_Item = ".jpg";
                                break;
                            case "spincube":
                                Icon_Item = ".jpg";
                                break;
                            case "fishlegends":
                                Icon_Item = ".jpg";
                                break;
                        }
                        icon = "http://img1.zaixiongbz.com/"+GameName+"/"+GameId+Icon_Item;
                        url_game = "http://astrde.com/m/"+GameName+".html?"+Parameter;
                        game_uu.add(url_game);

                        inLay.addView(getView(i));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                try {
                    dat = new JSONObject(response).getString("data");
                    for(int i=1; i<dat.length(); i+=2){
                        GameId = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("GameId");
                        GameName = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("GameName");
                        Parameter = new JSONArray(new JSONObject(response).getString("data")).
                                getJSONObject(i).getString("Parameter");
                        switch (GameName){
                            case "bnggame":
                                Icon_Item = ".png";
                                break;
                            case "aggame":
                                Icon_Item = ".png";
                                break;
                            case "agcasino":
                                Icon_Item = ".png";
                                GameName = "aggame";
                                break;
                            case "agigame":
                                Icon_Item = ".png";
                                break;
                            case "bb":
                                Icon_Item = ".png";
                                GameName = "bbgame";
                                break;
                            case "bbgame":
                                Icon_Item = ".png";
                                break;
                            case "cqcasino":
                                Icon_Item = ".png";
                                break;
                            case "dtgame":
                                Icon_Item = ".png";
                                break;
                            case "gnscasino":
                                Icon_Item = ".png";
                                break;
                            case "kygame":
                                Icon_Item = ".png";
                                break;
                            case "mgmobile":
                                Icon_Item = ".png";
                                break;
                            case "mtcasino":
                                Icon_Item = ".png";
                                break;
                            case "newbygame":
                                Icon_Item = ".png";
                                break;
                            case "ptsgame":
                                Icon_Item = ".png";
                                break;
                            case "toggame":
                                Icon_Item = ".png";
                                break;
                            case "vggame":
                                Icon_Item = ".png";
                                break;
                            case "vtgame":
                                Icon_Item = ".png";
                                break;
                            case "MGCasino_SlotGame":
                                Icon_Item = ".png";
                                GameName = "mgmobile";
                                break;
                            case "leggame":
                                Icon_Item = ".png";
                                break;
                            case "wmgame":
                                Icon_Item = ".png";
                                break;
                            case "gmgame":
                                Icon_Item = ".png";
                                break;
                            case "pggame":
                                Icon_Item = ".png";
                                break;
                            case "fishgame2":
                                Icon_Item = ".jpg";
                                break;
                            case "jdbgame":
                                Icon_Item = ".jpg";
                                GameName = "jdbgame2";
                                break;
                            case "ptcasino":
                                Icon_Item = ".jpg";
                                break;
                            case "sggame":
                                Icon_Item = ".jpg";
                                break;
                            case "wg_series":
                                Icon_Item = ".jpg";
                                break;
                            case "megawincasino":
                                Icon_Item = ".jpg";
                                break;
                            case "spincube":
                                Icon_Item = ".jpg";
                                break;
                            case "fishlegends":
                                Icon_Item = ".jpg";
                                break;
                        }
                        icon = "http://img1.zaixiongbz.com/"+GameName+"/"+GameId+Icon_Item;
                        url_game = "http://astrde.com/m/"+GameName+".html?"+Parameter;
                        game_uu.add(url_game);
                        inLay2.addView(getView(i));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        queue.add(request);
    }
    View getView(final int i)
    {
        View rootView = inflater.inflate( R.layout.activity_lucky__image,null);
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
                tv.setText(name_array.get(i));
                super.onPostExecute(result);
            }
        }.execute(icon);
        image.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RequestParams objParams  = GetRequestParams();
                String url = game_uu2.get(i)+"/login_product.json?html5=true&"+game_uu.get(i);
                Log.i("AppInfo",url);
                ApiHttpClient.post(url, objParams , new JsonHttpResponseHandler(){
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        Log.i("AppInfo" , "ApiHttpClient 1436 " + response.toString());

                        try {
                            JSONObject result = new JSONObject(response.toString());
                            String uu = response.getString("url");
                            if(result.equals("true")|| !uu.equals("")){
                                Log.i("AppInfo","Login");
                                GlobalVar.Game_Url = uu;
                                Intent game = new Intent(Lucky_game.this,GameActivity.class);
                                startActivity(game);
                            }
                        }catch (Exception e)
                        {
                            e.printStackTrace();
                            Log.i("AppInfo","Login_fault");
                        }
                    }
                    @Override
                    public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                        Log.i("AppInfo" , "ApiHttpClient onFailure " + responseString);
                        TextView t = (TextView)findViewById(R.id.accountBalance);
//                        t.setText("123123");
                    }
                });
            }
        });
        return rootView;
    }
    //准备请求需要的参数
    private  RequestParams GetRequestParams(){
        RequestParams objParams = new RequestParams();
//        objParams.put("GameName","2019-02-01");
//        objParams.put("startDate","2019-02-01");
//        objParams.put("Html5","true");
//
        return objParams;
    }
    public void goBack (View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goback = new Intent(Lucky_game.this,No_MainActivity.class);
            startActivity(goback);
            finish();
        }else {
            Intent goback = new Intent(Lucky_game.this, MainActivity.class);
            startActivity(goback);
            finish();
        }
    }

    public void account_manager (View view){
        Intent account_manager = new Intent(Lucky_game.this,Account_manager.class);
        account_manager.putExtra("SITE","LUCKY");
        startActivity(account_manager);
    }
    public void money(View view){
        Intent money = new Intent(Lucky_game.this,Money.class);
        money.putExtra("SITE","LUCKY");
        startActivity(money);
    }
    public void income(View view){
        Intent income = new Intent(Lucky_game.this,InCome.class);
        startActivity(income);
    }
    public void service (View view){
        dialog = new AlertDialog.Builder(Lucky_game.this).create();
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
        dialog = new AlertDialog.Builder(Lucky_game.this).create();
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
        Intent No_login = new Intent(Lucky_game.this,No_MainActivity.class);
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
    public void slot01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Lucky_game.this, Slot_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent goslot = new Intent(Lucky_game.this, Slot_game.class);
            goslot.putExtra("SITE","MAIN");
            startActivity(goslot);
            finish();
        }
    }
    public void card01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Lucky_game.this, Card_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent gocard = new Intent(Lucky_game.this, Card_game.class);
            gocard.putExtra("SITE","MAIN");
            startActivity(gocard);
            finish();
        }
    }
    public void fish01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Lucky_game.this, Fish_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent gofish = new Intent(Lucky_game.this, Fish_game.class);
            gofish.putExtra("SITE","MAIN");
            startActivity(gofish);
            finish();
        }
    }
    //點擊開啟drawer視窗
    public void open_drawer(View view){
        DrawerLayout drawer = (DrawerLayout)findViewById(R.id.drawer);
        NavigationView navigationView = (NavigationView)findViewById(R.id.NavigationView);
        drawer.openDrawer(navigationView);
    }
    //讀取網路圖片，型態為Bitmap
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
