package com.stardewids.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 创建 WebView
        webView = new WebView(this);
        setContentView(webView);

        // 配置 WebView 设置
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(false);

        // 设置 WebView 客户端
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // 保持在 WebView 内加载
                return false;
            }
        });

        // 设置 Chrome 客户端以支持 JavaScript 弹窗等
        webView.setWebChromeClient(new WebChromeClient());

        // 隐藏滚动条
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);

        // 禁用过度滚动效果
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        // 加载本地 HTML 文件
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        // 如果 WebView 可以返回，则返回上一页
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}