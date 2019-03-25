package com.example.yu810.new_project;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.AttributeSet;
import android.webkit.CookieSyncManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;

public class MyCustomWebView extends WebView {

    private CookieManager globalCookieManager = new CookieManager();

    public MyCustomWebView(Context context) {
        super(context);
        initView(context);
    }

    public MyCustomWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView(context);
    }


    private void initView(Context context){
        WebSettings ws = this.getSettings();
        // 网页内容的宽度是否可大于WebView控件的宽度
        ws.setLoadWithOverviewMode(false);
        // 保存表单数据
        ws.setSaveFormData(true);
        // 是否应该支持使用其屏幕缩放控件和手势缩放
        ws.setSupportZoom(true);
        ws.setBuiltInZoomControls(true);
        ws.setDisplayZoomControls(false);
        // 启动应用缓存
        ws.setAppCacheEnabled(true);
        // 设置缓存模式
        ws.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);

        ws.setDefaultTextEncodingName("utf-8");

        // setDefaultZoom  api19被弃用
        // 设置此属性，可任意比例缩放。
        ws.setUseWideViewPort(true);
        // 不缩放
        this.setInitialScale(100);
        // 告诉WebView启用JavaScript执行。默认的是false。
        ws.setJavaScriptEnabled(true);

        ws.setAllowFileAccess(true);


        JsInterface jsInterface = new JsInterface(context);
        this.getSettings().setJavaScriptEnabled(true);
        this.addJavascriptInterface(jsInterface, "JSInterface");

        //允许本地HTML跨域AJAX
        this.getSettings().setAllowFileAccessFromFileURLs(true);
        this.getSettings().setAllowUniversalAccessFromFileURLs(true);

        //  页面加载好以后，再放开图片
        ws.setBlockNetworkImage(false);
        // 使用localStorage则必须打开
        ws.setDomStorageEnabled(true);
        // 获取到UserAgentString
        String userAgent = ws.getUserAgentString();
        userAgent+= " GTMobileApp/1.0";
        //设定自定义user-agent
        ws.setUserAgentString(userAgent);
        // 排版适应屏幕
        ws.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);
        // WebView是否新窗口打开(加了后可能打不开网页)
        // webview从5.0开始默认不允许混合模式,https中不能加载http资源,需要设置开启。
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        ws.setTextZoom(100);


        this.setBackgroundColor(Color.parseColor("#00000000"));

        CookieHandler.setDefault(globalCookieManager);
        ((CookieManager)CookieHandler.getDefault()).setCookiePolicy(CookiePolicy.ACCEPT_ALL);
        CookieSyncManager.createInstance(context);
        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();


        cookieManager.acceptThirdPartyCookies(this);

        cookieManager.setAcceptCookie(true);

        if(android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(this, true);
        }
    }
}
