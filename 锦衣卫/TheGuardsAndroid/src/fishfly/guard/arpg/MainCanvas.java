/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

//#if NOKIAUI == 1
//# import com.nokia.mid.ui.FullCanvas;
//#endif

import android.content.Context;
import com.uc.paymentsdk.payment.PaymentsActivity;
import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Display;
import javax.microedition.lcdui.Graphics;
import share.GameNetWork;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class MainCanvas extends Canvas implements Runnable {

    private static int FRAME_TIME = 100;
    static int EN = 1;
    public static boolean isDemo;
    public String pauseStr;
    
    /**
     * 中断需要渲染
     */
    private final int PAUSE_DRAW = 1;    

    public boolean live = true;
    
    /**
     * 中断状态
     */
    int pauseState;
    Display disPlay;
    //调试信息
    long totalTime = 0;
    long paintTime = 0;
    long logicTime = 0;
    String debug = "";
    static String debug1 = "";
    static String debug2 = "";
    
    static long[] debugs = new long[10];
        
    //窗口重叠机制
    static final int PAGE_SIZE = 5;
    static Page[] pages = new Page[PAGE_SIZE];
    static int pageCnt = 0;
    static MusicPlayer music = null;   
    
    //记录当前时间，减少对System.currentTimeMillis()的调用
    //在执行logic之前调用，使所有logic共享这个值，可能会有10~20ms的误差，但是不影响全局
    static long currentTime = 0;
    static int currentFrame;
    static int currentFrameAll;
    static int curSkillFrame;    
    public MainCanvas(Context context) {
        super(context);
        //#if NOKIAUI == 0 
        setFullScreenMode(true);
        //#endif
        String str = GameContext.midlet.getAppProperty("MIDlet-Version");
        str = str.substring(0, str.indexOf("."));
        GameContext.version = Integer.parseInt(str);
        new Thread(this).start();
    }

    public void setThreadFast()
    {
        FRAME_TIME = 80;
    }

    public void setThreadSlow()
    {
        FRAME_TIME = 100;
    }

    public int getThreadSleepTime()
    {
        return FRAME_TIME;
    }
    
    public static void init() {
        
        ImageManager.getInstance();
        AnimationManager.getInstance();
        if(music == null) {
            music = MusicPlayer.getInstance();
        }
        if (GameContext.version == 21) {
            PaymentsActivity.init(Display.dis);
        } else {
            GameContext.netWork = new GameNetWork(Display.dis, GameContext.canvas);
        }
        MissionManager.getInstance();
        GameContext.loadItems();
        GameContext.loadNpcData();
        
        //地图测试代码
        if(GameContext.flyMat == null) {
            GameContext.flyMat = new PaintMatrix();
        }
        else
        {
            GameContext.flyMat.clear();
        }
        
        if(GameContext.groundMat == null) {
            GameContext.groundMat = new PaintMatrix();
        }
        else
        {
            GameContext.groundMat.clear();
        }
        
        if(GameContext.undergroundMat == null) {
            GameContext.undergroundMat = new PaintMatrix();
        }
        else
        {
            GameContext.undergroundMat.clear();
        }
        PaintMatrix.releaseHeads();
        ImageManager.getInstance().clear();
        
        //#if PKG == 1
//#         ScriptEngine.loadPackage();
        //#endif
        GameContext.initSpeicalScript();
        
        FishFont.getInstance();
        //#if SMS == 1 || SMS == 2
        if(GameContext.sms == null) {
            GameContext.sms = new Sms();
            GameContext.sms.init();
        }
        //#endif
        //载入游戏存档
        GameContext.readGames();
        GameContext.loadInfo();
    }
    
    public void bootstrap() {
        startGame();
    }
    
    //启动游戏的代码
    public static void startGame() {
        init();
        addPage(new LogoPage());
        //#else
//        addPage(new SoundPage());
        //#endif
        
//        MainScreen main = new MainScreen();
//        addPage(main);
//        main.start();

//        GamePage page = new GamePage();
//        GameContext.page = page;
//        MainCanvas.addPage(GameContext.page);
//        page.startGame();
    }
    
    public static void addPage(Page page) {
        pages[pageCnt] = page;
        pageCnt++;
    }
    
    public static void removePage() {
        if(pageCnt <= 0) {
            return;
        }
        
        pages[pageCnt - 1] = null;
        pageCnt--;
    }
    
    public void paint(Graphics g) {
        long end = System.currentTimeMillis();
        g.setFont(FishFont.FONT_SMALL);
        if(pauseState >= PAUSE_DRAW)
        {
            final short STRING_ID = 110;
            g.setColor(0);
            g.fillRect(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
            g.setColor(0xffffff);
            if(pauseStr == null)
            {
                pauseStr = new String(StringManager.getInstance().getString(STRING_ID));
            }
            g.drawString(pauseStr, Page.SCREEN_WIDTH >> 1, Page.SCREEN_HEIGHT >> 1, Graphics.HCENTER | Graphics.TOP);
            pauseState ++;
            return;
        }
        if(pauseState != 0)
        {
            return;
        }
        end = System.currentTimeMillis();
        //找到最高的一个全屏的，从那个开始画
        int fullScrIdx = -1;
        
        for(int ipage = pageCnt - 1; ipage >= 0; ipage--) {
            //遇到一个全屏幕的，后面的就不必画了
            if(pages[ipage].fullScreen) {
                fullScrIdx = ipage;
                break;
            }
        }

        if(fullScrIdx >= 0) {
            for(int ipage = fullScrIdx; ipage < pageCnt; ipage++) {
                pages[ipage].paint(g);
            }
        }
        end = System.currentTimeMillis() - end;
        paintTime = end;
    }
    
    private void draw() {
        repaint();
        serviceRepaints();
    }
    static long startTime;
    private void logicRun() throws Exception
    {
        startTime = System.currentTimeMillis();
        draw();
        logic();
        long endTime = System.currentTimeMillis();
        long spendTime = endTime - startTime;
        totalTime = spendTime;
        if (spendTime < FRAME_TIME)
        {
            long sleepTime = FRAME_TIME - spendTime;
            Thread.sleep(sleepTime);
            EffortManager.getInstance().gameTime += FRAME_TIME;
        }
        else {
            EffortManager.getInstance().gameTime += spendTime;
        }
    }
    
    private void sleep(int time)
    {
        try
        {
            Thread.sleep(time);
        }
        catch (Exception e)
        {
        }
    }
    
    public synchronized void run() {
        while (live)
        {
            try
            {
                while (live && pauseState == 0)
                {
                    logicRun();
                }
                if(pauseState >= PAUSE_DRAW)
                {
                    draw();
                    sleep(100);
                }
                else
                {
                    sleep(100);
                }
            }
            catch (Exception ex)
            {
                //#if PRINTDEBUG >= 1
                        debug = ex.toString();
                        ex.printStackTrace();
                //#endif
            }
        }
        MusicPlayer.getInstance().delMusic();
        GameContext.midlet.destroyApp(false);
        if (GameContext.version == 2) {
            GameContext.netWork.qqShare.destroy();
        }
        GameContext.midlet.notifyDestroyed();
    }

    protected void hideNotify()
    {
        pause();
    }
    
    public void pause() {
        //#if SMS == 3
//#         if (pages[0] instanceof MainScreen) {
//#             return;
//#         }
        //#endif
        if(pauseState == 0 || pauseState == 2)
        {
            pauseState = PAUSE_DRAW;
        }
        GamePage gamePage = GameContext.page;
        if(gamePage != null && gamePage.keyMgr != null)
        {
            gamePage.keyMgr.resetKey();
        }
        MusicPlayer.getInstance().pause();
        MusicPlayer.getInstance().kill();
    }
    
    private void startCurrect() {
        pauseState = 0;
        MusicPlayer.getInstance().resume();
    }
    
    public void keyPressed(int keyCode) {
        if(pauseState > PAUSE_DRAW)
        {
            //#if V8
//#             startCurrect();
            //#endif            
            return;
        }
        if(pageCnt == 0) {
            return;
        }
        pages[pageCnt - 1].keyPressed(keyCode);
    }
    
    public void keyReleased(int keyCode) {
        if(pauseState > PAUSE_DRAW)
        {
            //#if !V8
            startCurrect();
            //#endif
            return;
        }
        if(pageCnt == 0) {
            return;
        }
        pages[pageCnt - 1].keyReleased(keyCode);
    }
    
    public void pointerPressed(int px, int py) {
    //#if POINT == 1
        if(pauseState > PAUSE_DRAW)
        {
            return;
        }
        if(pageCnt == 0) {
            return;
        }
        dragStartX = px;
        dragStartY = py;
        dragEndX = -1;
        dragEndY = -1;
        pages[pageCnt - 1].pointerPressed(px, py);
   //#endif
    }
    
    public void pointerReleased(int px, int py) {
    //#if POINT == 1
        if(pauseState > PAUSE_DRAW)
        {
            pauseState = 0;
            MusicPlayer.getInstance().resume();
            return;
        }
        if(pageCnt == 0) {
            return;
        }
        dragStartX = -1;
        dragStartY = -1;
        dragEndX = -1;
        dragEndY = -1;
        pages[pageCnt - 1].pointerReleased(px, py);
    //#endif
    }

    int dragStartX = -1;
    int dragStartY = -1;
    int dragEndX = -1;
    int dragEndY = -1;
    public void pointerDragged(int dx, int dy) {
        //#if POINT == 1
        if(pauseState >= PAUSE_DRAW)
        {
            return;
        }
        if(pageCnt == 0) {
            return;
        }
        dragEndX = dx;
        dragEndY = dy;
        boolean isChange = pages[pageCnt - 1].pointerDragged(dragStartX, dragStartY, dragEndX, dragEndY);
        if (isChange) {
            dragStartX = dragEndX;
            dragStartY = dragEndY;
        }
        //#endif
    }
    
    private void logic() {
        currentFrameAll++;
        logicTime = 0;
        if(pageCnt == 0) {
            return;
        }
        
        long start = System.currentTimeMillis();
        currentTime = start;
        for(int ipage = 0; ipage < pageCnt; ipage++) {
            if(pages[ipage].pause) {
                continue;
            }
            pages[ipage].logic();
        }
        
        if(music != null && (GameContext.page == null || !GameContext.page.loading)) {
            music.update();
        }
        long end = System.currentTimeMillis();
        logicTime = end - start;
    }
}
