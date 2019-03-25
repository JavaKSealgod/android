package com.example.yu810.new_project;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class GameActivity extends WebViewActivity {

    private MyCustomWebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_game);

        mWebView  = findViewById(R.id.webview);

        this.setupView();
    }
//    @Override
//    protected void onNewIntent(Intent intent) {
//        super.onNewIntent(intent);
//    }

    @Override
    protected void onStart() {
            super.onStart();
            Log.i("AppInfo","GameStart");

//        Intent intent = new Intent(GameActivity.this, Fish_game.class);
//        intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
//        startActivity(intent);
        mWebView.loadUrl(GlobalVar.Game_Url);

        //mWebView.loadUrl("http://192.168.60.147:9012/Login_ForApp.html");
    }
}
