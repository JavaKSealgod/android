package com.example.yu810.new_project;

import android.os.Bundle;

public class WalletActivity extends WebViewActivity {

    private MyCustomWebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_wallet);
        mWebView  = findViewById(R.id.web_wallet);

        this.setupView();
    }

    @Override
    protected void onStart() {
        super.onStart();

        mWebView.loadUrl("file:///android_asset/www/html/default.html");
    }
}
