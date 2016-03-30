package javax.microedition.lcdui;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import fishfly.guard.arpg.GameContext;

import fishfly.guard.arpg.GameMidlet;
import javax.microedition.midlet.MIDlet;

public class Display extends Activity {
    private MIDlet midlet;
    public static Display dis;
   
    public static Display getDisplay(MIDlet midlet)
    {
        dis.midlet = midlet;
        return dis;
    }

    /**
     * 用户按下退出键
     */
    public void onBackPressed()
    {
        if(GameContext.canvas == null)
        {
            return;
        }
        GameContext.canvas.keyPressed(Canvas.KEY_END);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
//        doTitleMemory();
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);//不显示程序的标题栏
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);//设置全屏

        init();
    }

    public static int pointEventCount;
//    @Override
//    public boolean onGenericMotionEvent(MotionEvent event) {
//        if (GameContext.canvas != null) {
//            GameContext.canvas.onTouchEvent1(event);
//        }
//        pointEventCount++;
//        return true;
//    }

    private void init()
    {
        Canvas.assertMgr = getAssets();
        dis = this;
        MIDlet mid = new GameMidlet();
        mid.startApp();
    }

    @Override
    public void onStop() {
    	super.onStop();
    	System.out.println("activity stop");
    }

    @Override
    public void onDestroy() {
    	super.onDestroy();
        midlet.destroyApp(true);
        midlet.notifyDestroyed();
    	System.out.println("activity destroy");
    }

    @Override
    public void onPause() {
    	super.onPause();
        midlet.pauseApp();
    	System.out.println("activity pause");
    }

    @Override
    public void onResume() {
    	super.onResume();
    	System.out.println("activity resume");
    }

    public void setCurrent(Canvas canvas)
    {
        setContentView(canvas);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        GameContext.sms.onActivityResult(requestCode, resultCode, data);
    }


}