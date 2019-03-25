package com.example.yu810.new_project;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.Rect;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.webkit.CookieSyncManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;

import org.json.JSONObject;

import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;

public class LoginInActivity extends WebViewActivity {

    private MyCustomWebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_login_in);

        //設定隱藏標題
//        getSupportActionBar().hide();

        mWebView  = findViewById(R.id.web_login);

        this.setupView();
    }

    @Override
    protected void onStart() {
        super.onStart();

        mWebView.loadUrl("file:///android_asset/www/html/Login_ForApp.html");

        //mWebView.loadUrl("http://192.168.60.147:9012/Login_ForApp.html");
    }

    public void loginSucessProcess(String baseInfo){
        Log.i("AppInfo" , "loginSucessProcess");

        //同步webview登录后产生的cookie，确保后续HttpClient获取数据正常
        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
        GlobalVar.cookies = cookieManager.getCookie(AppSetting.Domain);
        Log.i("AppInfo" , "__cookies loginSucessProcess  " + GlobalVar.cookies);

        try {
            JSONObject response = new JSONObject(baseInfo);
            GlobalVar.account = response.getString("account");
            GlobalVar.accountBalance = response.getString("accountBalance");

            Intent main = new Intent(LoginInActivity.this,MainActivity.class);
            startActivity(main);
            finish();
        }catch (Exception e)
        {
            Log.i("AppInfo" , "loginSucessProcess JSONExecption" + e.getMessage());
        }

//        ApiHttpClient.get("account/profile_baseinfo.json" , null , new JsonHttpResponseHandler(){
//            @Override
//            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
//                Log.i("AppInfo" , "profileBaseinfo onSuccess " + response.toString());
//
//                try {
//                    GlobalVar.account = response.getString("account");
//                    GlobalVar.accountBalance = response.getString("accountBalance");
//
//                    Intent main = new Intent(LoginInActivity.this,MainActivity.class);
//                    startActivity(main);
//                    finish();
//                }catch (Exception e)
//                {
//                    Log.i("AppInfo" , "profileBaseinfo onSuccess JSONExecption" + e.getMessage());
//                }
//            }
//
//            @Override
//            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
//                Log.i("AppInfo" , "profileBaseinfo onFailure" + responseString);
//            }
//        });
    }
    @Override
    protected void onDestroy() {
        if (mWebView != null) {
            ViewGroup parent = (ViewGroup) mWebView.getParent();
            if(parent != null){
                parent.removeView(mWebView);
            }

            mWebView.stopLoading();
            mWebView.setWebChromeClient(null);
            mWebView.setWebViewClient(null);
            mWebView.destroy();
            mWebView = null;
        }

        super.onDestroy();
    }

//    private int computeUsableHeight() {
//        Rect rect = new Rect();
//        mChildOfContent.getWindowVisibleDisplayFrame(rect);
//        // rect.top其实是状态栏的高度，如果是全屏主题，直接 return rect.bottom就可以了
//        return (rect.bottom - rect.top);
//    }
//
//    private void possiblyResizeChildOfContent() {
//        int usableHeightNow = computeUsableHeight();
//        if (usableHeightNow != usableHeightPrevious) {
//            int usableHeightSansKeyboard = mChildOfContent.getRootView().getHeight();
//            int heightDifference = usableHeightSansKeyboard - usableHeightNow;
//            if (heightDifference > (usableHeightSansKeyboard/4)) {
//                // keyboard probably just became visible
//                frameLayoutParams.height = usableHeightSansKeyboard - heightDifference;
//            } else {
//                // keyboard probably just became hidden
//                frameLayoutParams.height = usableHeightSansKeyboard;
//            }
//            mChildOfContent.requestLayout();
//            usableHeightPrevious = usableHeightNow;
//        }
//    }

    //    private CookieManager globalCookieManager = new CookieManager();
//
//    public void login_now(View view) {
//        final String myaccount_in = myaccount.getText().toString();
//        final String mymessage_in = mymessage.getText().toString();
//        final String mynum_in = mynum.getText().toString();
//        //POST读取 cookie
//        CookieHandler.setDefault(globalCookieManager);
//        ((CookieManager)CookieHandler.getDefault()).setCookiePolicy(CookiePolicy.ACCEPT_ALL);
//        if (myaccount_in.equals("") || mymessage_in.equals("")) {
//            mynum.setText("帳密布為空");
//        } else {
//            RequestQueue queue = Volley.newRequestQueue(this);
//            StringRequest postRequest = new StringRequest(Request.Method.POST,post_url,
//                    new Response.Listener<String>()
//                    {
//                        @Override
//                        public void onResponse(String response) {
//                            CookieManager mCookieManager = (CookieManager)CookieHandler.getDefault();
//                            CookieStore mCookieStore = mCookieManager.getCookieStore();
//                            List<HttpCookie> cookieList = mCookieStore.getCookies();
//                            for (int i = 0; i < cookieList.size(); i++) {
//                                String cookieName = cookieList.get(i).getName(); //JSESSIONID,CCH
//                                String cookieValue = cookieList.get(i).getValue();
//                                mynum.setText(cookieName+"+"+cookieValue);
//                            }
//                            // response
//                            String errorInfo = null;
//                            String accountBalance = null;
//                            String account = null;
//                            String result= null;
//                            try {
//                                account = new JSONObject(response).getString("account");
//                                errorInfo = new JSONObject(response).getString("errorInfo");
//                                result = new JSONObject(response).getString("result");
////                                mynum.setText(errorInfo);
//                                if (errorInfo.equals("[{\"errorCode\":\"2001001\",\"error\":\"Verify code incorrect\",\"errorDetail\":\"验证码错误\"}]")){
//                                    mynum.setText("驗證碼錯誤");
//                                }else if(errorInfo.equals("[{\"errorCode\":\"2001003\",\"error\":\"Password incorrect\",\"errorDetail\":\"密码不正确\"}]")){
//                                    mynum.setText("帳號密碼錯誤");
//                                }
//                                if(result.equals("true")) {
//                                    userinfo();
//                                }
//                            } catch (JSONException e) {
//                                e.printStackTrace();
//                            }
//                        }
//                    },
//                    new Response.ErrorListener()
//                    {
//                        @Override
//                        public void onErrorResponse(VolleyError error) {
//                            // error
//                        }
//                    }){
//                @Override
//                protected HashMap<String, String> getParams()throws AuthFailureError
//                {
//                    //在这里设置需要post的参数
//                    HashMap<String, String>  params = new HashMap<String, String>();
//                    String data = null;
//                    params.put("account", myaccount_in);
//                    params.put("password", mymessage_in);
//                    params.put("vcode", mynum_in);
//                    params.put("T",T);
////                    return super.getParams();
//                    return params;
//                }
//            };
//            queue.add(postRequest);
//
//        }
//    }
//    public static Bitmap getBitmapFromURL(String src){
//        try
//        {
//            URL url = new URL(src);
//            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
////            connection.setDoInput(true);
//            connection.connect();
//            InputStream input = connection.getInputStream();
//            Bitmap bitmap = BitmapFactory.decodeStream(input);
//            return bitmap;
//        }
//        catch (IOException e)
//        {
//            e.printStackTrace();
//        }
//        return null;
//    }
}
