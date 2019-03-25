package com.example.yu810.new_project.utils;
import com.example.yu810.new_project.AppSetting;
import com.example.yu810.new_project.GlobalVar;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import cz.msebera.android.httpclient.impl.client.BasicCookieStore;
import cz.msebera.android.httpclient.impl.cookie.BasicClientCookie;


public class ApiHttpClient {
    private static final String BASE_URL = AppSetting.Domain +"/interface/zh-cn/";

    private static AsyncHttpClient client = new AsyncHttpClient();

    public static BasicCookieStore getCookieStore(String cookies, String domain) {
        String[] cookieValues = cookies.split(";");
        BasicCookieStore cs = new BasicCookieStore();

        BasicClientCookie cookie;
        for (int i = 0; i < cookieValues.length; i++) {
            String[] split = cookieValues[i].split("=");
            if (split.length == 2)
                cookie = new BasicClientCookie(split[0], split[1]);
            else
                cookie = new BasicClientCookie(split[0], null);

            cookie.setDomain(domain);
            cs.addCookie(cookie);
        }
        return cs;

    }


    public static void get(String url, RequestParams params, AsyncHttpResponseHandler responseHandler) {
        BasicCookieStore lCS = getCookieStore(GlobalVar.cookies, AppSetting.BaseDomain);

        client.setCookieStore(lCS);

        String getUrl = getAbsoluteUrl(url);
        //wait 电脑太慢了，延长timeout，要不拉不回来数据
        client.setConnectTimeout(30000);
        client.setTimeout(30000);
        client.setResponseTimeout(30000);
        client.get(getUrl, params, responseHandler);
    }

    public static void post(String url, RequestParams params, AsyncHttpResponseHandler responseHandler) {
        BasicCookieStore lCS = getCookieStore(GlobalVar.cookies, AppSetting.BaseDomain);

        client.setCookieStore(lCS);

        client.post(getAbsoluteUrl(url), params, responseHandler);
    }

    private static String getAbsoluteUrl(String relativeUrl) {
        return BASE_URL + relativeUrl;
    }
}
