package com.example.yu810.new_project;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

public class JsInterface {
    private Context activity;

    public JsInterface(Context activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void loginFinished(String baseInfo){
        Log.i("AppInfo" , "JsInterface loginFinished " + baseInfo);
        ((LoginInActivity)activity).loginSucessProcess(baseInfo);
    }
}