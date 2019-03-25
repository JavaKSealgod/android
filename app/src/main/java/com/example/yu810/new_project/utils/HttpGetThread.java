package com.example.yu810.new_project.utils;

import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import org.apache.http.HttpResponse;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;

public class HttpGetThread extends Thread {
    Handler callbackHandler;
    private String url;
    private String cookies;

    public HttpGetThread(String url , Handler callback , String cookies){
        this.callbackHandler = callback;
        this.url = url;
        this.cookies = cookies;
    }

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

    public void run(){
        Looper.prepare();

        try{
            android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
            String __cookies = cookieManager.getCookie("http://www.astrde.com/m/default.html");

            BasicCookieStore lCS = getCookieStore(__cookies, "www.astrde.com");

            HttpContext localContext = new BasicHttpContext();
            DefaultHttpClient httpclient = new DefaultHttpClient();
            httpclient.setCookieStore(lCS);
            localContext.setAttribute(ClientContext.COOKIE_STORE, lCS);

            HttpGet get=new HttpGet(url);
            ResponseHandler<String> responseHandler = new BasicResponseHandler();
            HttpResponse result = httpclient.execute(get,localContext);
            String response_str = EntityUtils.toString(result.getEntity());

            Message message = Message.obtain();

            Log.i("AppInfo" , "response_str111 " + response_str);

            message.obj = response_str;

            this.callbackHandler.sendMessage(message);
            Looper.loop();   //Looper好像一定要放在最后才有效。

        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }
}
