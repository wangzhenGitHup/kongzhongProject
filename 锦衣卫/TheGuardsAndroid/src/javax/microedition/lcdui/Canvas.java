/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package javax.microedition.lcdui;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.graphics.Rect;
import android.os.ResultReceiver;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.BaseInputConnection;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import fishfly.guard.arpg.GameContext;
import fishfly.guard.arpg.Keys;
import fishfly.guard.arpg.MainCanvas;
import fishfly.guard.arpg.Page;
import java.lang.reflect.Method;

/**
 *
 * @author huyang
 */
public class Canvas extends SurfaceView implements SurfaceHolder.Callback{
    public final static int KEY_NUM0 = 48;
    public final static int KEY_NUM1 = 49;
    public final static int KEY_NUM2 = 50;
    public final static int KEY_NUM3 = 51;
    public final static int KEY_NUM4 = 52;
    public final static int KEY_NUM5 = 53;
    public final static int KEY_NUM6 = 54;
    public final static int KEY_NUM7 = 55;
    public final static int KEY_NUM8 = 56;
    public final static int KEY_NUM9 = 57;
    public final static int KEY_STAR = 42;
    public final static int KEY_POUND = 35;
    public final static int KEY_END = 200;
    String inputString = "";
    public InputMethodManager input = null;
    ResultReceiver resultReceiver;

    public float changeWidthF = 1.0f;
    public float changeHeightF = 1.0f;

    public static boolean supportMoreTouch = false;

    private SurfaceHolder holder;
    public static AssetManager assertMgr;

    public Canvas(Context context)
    {
    	super(context);
        input = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);

        Method methods[] = MotionEvent.class.getDeclaredMethods();
        for (Method m : methods) {
            if (m.getName().equals("getPointerCount")) {
                supportMoreTouch = true;
            }
        }

        holder = this.getHolder();//获取holder
        holder.addCallback(this);
        setFocusable(true);
        setFocusableInTouchMode(true);
        setKeepScreenOn(true);
    }
    public void setFullScreenMode(boolean isFull) {
        GameContext.display.requestWindowFeature(Window.FEATURE_NO_TITLE);//不显示程序的标题栏
        GameContext.display.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
        WindowManager.LayoutParams.FLAG_FULLSCREEN);//设置全屏
    }

    @Override
    public InputConnection onCreateInputConnection(EditorInfo outAttrs) {
        // TODO Auto-generated method stub
        //super.onCreateInputConnection(outAttrs);
        return new MyInputConnection(this, false);//super.onCreateInputConnection(outAttrs);
    }

    public class MyInputConnection extends BaseInputConnection{
        public MyInputConnection(View targetView, boolean fullEditor)
        {
            super(targetView, fullEditor);
        }

        public boolean commitText(CharSequence text, int newCursorPosition)
        {
            if(text == null)
            {
                System.out.println("text为空");
                return true;
            }
            inputString = text.toString();
            System.out.println("inputString="+inputString);
            return true;
        }
    }

    public void startCanvas()
    {
        
    }

    public void paint(Graphics g)
    {
        
    }

    public void pointerPressed(int x, int y)
    {
        
    }

    public void pointerReleased(int x, int y)
    {

    }
    
    public void pointerDragged(int x, int y)
    {
        
    }

    /**
     * 长度
     */
    private double moveLength;
    public boolean isBig;
    public boolean isSmall;

    private long setSizeTime;

    public boolean onKeyUp(int keyCode, KeyEvent event)
    {
        System.out.println("input:"+keyCode);
        return super.onKeyUp(keyCode, event);
    }
    
    public boolean onKeyDown(int keyCode, KeyEvent event)
    {
        if(keyCode == KeyEvent.KEYCODE_BACK)
        {
            System.out.println("按下了退出键");
            keyPressed(Keys.KEY_RIGHT_SOFT);
        }
        else
        {
            keyPressed(keyCode);
        }
        return super.onKeyDown(keyCode, event);
    }

    public static int pointPressedX;
    public static int pointPressedY;
    
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        moveLength = 0;
        if(event.getEventTime() - setSizeTime < 100)
        {
            return false;
        }

        float px = event.getX();
        float py = event.getY();
        if (supportMoreTouch) {
            int pointCount = event.getPointerCount();
            px = event.getX(pointCount - 1);
            py = event.getY(pointCount - 1);
        }
        pointPressedX = (int) px;
        pointPressedY = (int) py;
        if (event.getAction() == MotionEvent.ACTION_UP || (supportMoreTouch && event.getAction() == MotionEvent.ACTION_POINTER_2_UP)) {
            pointerReleased((int) px, (int) py);
            return true;
        }
        if (event.getAction() == MotionEvent.ACTION_DOWN || (supportMoreTouch && event.getAction() == MotionEvent.ACTION_POINTER_2_DOWN)) {
            pointerPressed((int) px, (int) py);
            return true;
        }

        if (event.getAction() == MotionEvent.ACTION_MOVE) {
            pointerDragged((int) px, (int) py);
            return true;
        }
        return false;
    }

    /**
     * 屏幕缩小
     */
    public void canvasSmall()
    {

    }

    /**
     * 屏幕放大
     */
    public void canvasBig()
    {
        
    }

    /**
     * 元素缩小
     */
    private void dosizeSmallLogic()
    {
        canvasSmall();
        setScreenSize();
    }

    /**
     * 元素放大
     */
    private void dosizeBigLogic()
    {
        canvasBig();
        setScreenSize();
    }

    public void repaint()
    {
        
    }
    
    private Rect screenRect;
    boolean isCanDraw;
    public float screenWidth;
    public float screenHeight;

    public void surfaceCreated(SurfaceHolder holder) {
        System.out.println("屏幕创建");
        isCanDraw = true;
        if(isStartGame)
        {
            return;
        }
//        resultReceiver = new ResultReceiver(new Handler() {//定义事件处理器。
//
//            public void handleMessage(Message msg) {
//                System.out.println("msg:"+msg.what);
//
//
//            }
//        });


        isStartGame = true;
        screenWidth = getWidth();
        screenHeight = getHeight();
        System.out.println("screenWidth============================="+screenWidth);
        System.out.println("screenHeight============================"+screenHeight);
        screenRect = new Rect(0, 0, (int)screenWidth, (int)screenHeight);
        Page.initGamePageSize((int)screenWidth,(int)screenHeight);
//        float wChangeF = screenWidth / Page.SCREEN_WIDTH;
//        float hChangeF = screenHeight / Page.SCREEN_WIDTH;
        setScreenSize();
        startCanvas();
    }

    public void surfaceChanged(SurfaceHolder arg0, int arg1, int arg2, int arg3) {
    }

    private boolean isStartGame;

    public void surfaceDestroyed(SurfaceHolder arg0) {
        System.out.println("屏幕销毁");
        isCanDraw = false;
//        System.exit(0);
    }

    /**
     * 设置屏幕坐标偏移量
     */
    private void setScreenSize()
    {
    }


    Graphics g = new Graphics(null);
    public void serviceRepaints()
    {
        if(!isCanDraw)
        {
            return;
        }
        android.graphics.Canvas canvas = null;
        try {
            canvas = holder.lockCanvas(screenRect);//获取画布
            if(canvas != null)
            {
                canvas.drawColor(Color.BLACK);
                g.setCanvas(canvas);
                paint(g);
            }
        } catch (Exception e) {
            System.out.println(e.toString());
        } finally {
            holder.unlockCanvasAndPost(canvas);//解锁画布，提交画好的图像
            doSizeChangeLogic();
        }
    }

    private void doSizeChangeLogic()
    {
        dosizeSmallLogic();
        dosizeBigLogic();
    }

    public void addTextInputView()
    {
        EditText e = new EditText(GameContext.display);
        GameContext.display.addContentView(e, getLayoutParams());
    }

    protected void keyPressed(int keyCode)
    {

    }


    public void startInputName() {
        //CandidateView);
//        addTextInputView();

        GameContext.display.setContentView(new EditText(GameContext.display));
//        List<InputMethodInfo> inputMethodInfos = input.getInputMethodList();
//        input.setInputMethod(getWindowToken(), inputMethodInfos.get(1).getId());
//        boolean isShow = input.showSoftInput(this, InputMethodManager.SHOW_FORCED);
//        System.out.println("输入法是否打开：" + isShow);

//        input.showSoftInputFromInputMethod(getApplicationWindowToken(), NO_ID);
//        input.showSoftInputFromInputMethod(getWindowToken(), 0);//开启
    }

}
