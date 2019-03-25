package com.example.yu810.new_project;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.yu810.new_project.utils.ApiHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import cz.msebera.android.httpclient.Header;

public class News extends AppCompatActivity {

    String site_url = "http://slotgamem.gamestreedemo.net/interface/zh-CN/message/site_message.json";
    String url_ip = "http://astrde.com/Interface/zh-CN/fishlegends/fishhall_gamelist.json?html5=true";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_news);
        getapi();
    }
    public void back_site(View view){
        Intent main = new Intent(News.this,MainActivity.class);
        startActivity(main);
    }
    public void getapi(){

        ApiHttpClient.get("message/site_message.json" , null , new JsonHttpResponseHandler(){
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

//    public void ChangeFragmentnews(View view){
//
//        Fragment fr;
//        if(view == findViewById(R.id.news1)){
//            fr = new Login_in_first();
//            FragmentManager fm = getSupportFragmentManager();
//            FragmentTransaction ft = fm.beginTransaction();
//            ft.replace(R.id.fragment_news,fr);
//            ft.commit();
//        }
//        if(view == findViewById(R.id.news2)){
//            fr = new Quick_registration();
//            FragmentManager fm = getSupportFragmentManager();
//            FragmentTransaction ft = fm.beginTransaction();
//            ft.replace(R.id.fragment_news,fr);
//            ft.commit();
//        }
//        if(view == findViewById(R.id.forget_code)) {
//            fr = new Forget_code();
//            FragmentManager fm = getSupportFragmentManager();
//            FragmentTransaction ft = fm.beginTransaction();
//            ft.replace(R.id.fragment_place, fr);
//            ft.commit();
//        }
//    }
}
