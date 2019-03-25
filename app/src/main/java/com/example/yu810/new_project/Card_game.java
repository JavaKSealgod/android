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
import android.widget.Toast;

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

public class Card_game extends AppCompatActivity {

    // IP 数据分析网址
    public static String url_ip = "http://astrde.com/Interface/zh-CN/vggame/product_list_new.json?html5=true";
    private RequestQueue mRequestQueue;
    private StringRequest mStringRequest;
    AlertDialog dialog;
    ArrayList<String> game_uu = new ArrayList<String>();
    ArrayList<String> game_uu2 = new ArrayList<String>();
    String url_game,icon;
    private LayoutInflater inflater;
    String account,accountBalance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_card_game);
        TextView accountBalance1 = (TextView)findViewById(R.id.accountBalance) ;
        Button account1= (Button) findViewById(R.id.loginin);
        Intent loginOK = getIntent();
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
        api();
    }
    public void api(){
        inflater=getLayoutInflater();
        final LinearLayout inLay=(LinearLayout) findViewById(R.id.innerLay);
        final LinearLayout inLay2=(LinearLayout) findViewById(R.id.innerLay2);

        ApiHttpClient.post("vggame/product_list_new.json?html5=true", null , new JsonHttpResponseHandler(){
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                Log.i("AppInfo" , "ApiHttpClient 1436 " + response.toString());

                try {
                    JSONObject result = new JSONObject(response.toString());
                    JSONArray game = response.getJSONObject("data").getJSONArray("game");
                    Log.i("AppInfo",game.toString());

                }catch (Exception e)
                {
                    e.printStackTrace();
                    Log.i("AppInfo","error");
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                Log.i("AppInfo" , "ApiHttpClient onFailure " + responseString);
            }
        });



//        RequestQueue queue = Volley.newRequestQueue(this);
//        StringRequest request = new StringRequest(Request.Method.GET, url_ip, new Response.Listener<String>(){
//            @Override
//            public void onResponse(String response) {
//                String dat = null;
//                String GameId = null;
//                String GameName = null;
//                String Game_Item = null;
//                try {
//                    Game_Item = new JSONArray(new JSONObject(response).getString("data")).
//                            getJSONObject(0).getString("game");
//                    Toast.makeText(Card_game.this,Game_Item.toString(),Toast.LENGTH_LONG).show();
//                    for (int k=0; k<Game_Item.length(); k++) {
//                        GameId = new JSONArray(new JSONObject(Game_Item).getString("game")).
//                                getJSONObject(k).getString("GameId");
//                        GameName = new JSONArray(new JSONObject(response).getString("game")).
//                                getJSONObject(k).getString("Name");
//                        icon = "http://img1.zaixiongbz.com/fishgame2/" + GameName + "-" + GameId + ".jpg";
//
//                        Log.i("AppInfo",icon);
////                            url_game = "http://astrde.com/m/" + GameName + ".html?" + Parameter;
//                        game_uu.add(url_game);
//
//                        inLay.addView(getView(k));
//                    }
//
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                    Log.i("AppInfo","error");
//                }
//
//
//                try {
//                    dat = new JSONObject(response).getString("data");
////                        Toast.makeText(Lucky_game.this,dat.toString(),Toast.LENGTH_LONG).show();
//                    for(int i=1; i<dat.length(); i+=2){
//                        GameId = new JSONArray(new JSONObject(response).getString("data")).
//                                getJSONObject(i).getString("GameId");
//                        GameName = new JSONArray(new JSONObject(response).getString("data")).
//                                getJSONObject(i).getString("GameName");
//                        icon = "http://img1.zaixiongbz.com/fishgame2/"+GameName+"-"+GameId+".jpg";
////                        url_game = "http://astrde.com/m/"+GameName+".html?"+Parameter;
//                        game_uu.add(url_game);
//                        inLay2.addView(getView(i));
//                    }
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
//            }
//        }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//
//            }
//        });
//        queue.add(request);
    }
    View getView(final int i)
    {
        View rootView = inflater.inflate( R.layout.activity_image,null);
        final ImageView image = (ImageView) rootView.findViewById(R.id.img_list_item);
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
        }.execute(icon);
        image.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent game_url = new Intent(Card_game.this,GameActivity.class);
                game_url.putExtra("GameUrl",game_uu.get(i));
                startActivity(game_url);
            }
        });
        return rootView;
    }

    public void money(View view){
        Intent money = new Intent(Card_game.this,Money.class);
        money.putExtra("SITE","CARD");
        startActivity(money);
    }
    public void wallet(View view){
        Intent wallet = new Intent(Card_game.this,WalletActivity.class);
        wallet.putExtra("SITE","CARD");
        startActivity(wallet);
    }
    public void account_manager (View view){
        Intent account_manager = new Intent(Card_game.this,Account_manager.class);
        account_manager.putExtra("SITE","CARD");
        startActivity(account_manager);
    }
    public void income(View view){
        Intent income = new Intent(Card_game.this,InCome.class);
        income.putExtra("SITE","CARD");
        startActivity(income);
    }
    public void service (View view){
        dialog = new AlertDialog.Builder(Card_game.this).create();
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
        dialog = new AlertDialog.Builder(Card_game.this).create();
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
        Intent No_login = new Intent(Card_game.this,No_MainActivity.class);
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
            Intent goback = new Intent(Card_game.this,No_MainActivity.class);
            startActivity(goback);
            finish();
        }else {
            Intent goback = new Intent(Card_game.this, MainActivity.class);
            startActivity(goback);
            finish();
        }
    }
    public void fish01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Card_game.this, Fish_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent gofish = new Intent(Card_game.this, Fish_game.class);
            gofish.putExtra("SITE","MAIN");
            startActivity(gofish);
            finish();
        }
    }
    public void slot01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Card_game.this, Slot_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent slot01 = new Intent(Card_game.this, Slot_game.class);
            slot01.putExtra("SITE","MAIN");
            startActivity(slot01);
            finish();
        }
    }
    public void lucky01(View view){
        Intent getsite = getIntent();
        String site_name = getsite.getStringExtra("SITE");
        if(site_name.equals("NO_MAIN")){
            Intent goslot = new Intent(Card_game.this, Lucky_game.class);
            goslot.putExtra("SITE", "NO_MAIN");
            startActivity(goslot);
            finish();
        }else {
            Intent golucky = new Intent(Card_game.this, Lucky_game.class);
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
    public void VG_Card(View view){
        api();
    }
    public void MT_Card(View view){

    }
    public void LEG_Card(View view){

    }
}
