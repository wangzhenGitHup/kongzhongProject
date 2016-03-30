/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class LoadingPage extends Page implements Runnable {
    char[] txt;
    int txtLen;
    int topY;
    
    //共分几步显示
    int step;
    static int MAX_STEP = 3;
    FishFont font = null;
    
    //提示信息
    final short[] IDS = {
        6, 8, 9, 10, 11, 13, 16, 17, 18, 19, 20, 242, 243, 244
    };
    
    char[][] tips;
    int curTip;
    int tipCnt;
    
    static boolean working;
    
    static boolean isRepaint;
    public LoadingPage() {
        final short TXT_ID = 4;
        StringManager strMgr = StringManager.getInstance();
        txt = strMgr.getString(TXT_ID);
        
        txtLen = txt.length;
        font = FishFont.getInstance();
        topY = Page.SCREEN_HEIGHT - (FishFont.LINE_HEIGHT << 1);
        fullScreen = true;
        
        tipCnt = IDS.length;
        tips = new char[tipCnt][];
        for(int itip = 0; itip < tipCnt; itip++) {
            tips[itip] = strMgr.getString(IDS[itip]);
        }
        randomTip();
//        startThread();
    }
    
    public void startThread() {
        if(working)
        {
            return;
        }
        working = true;
        new Thread(this).start();
    }
    
    public synchronized void run() {        
        while(working) {
            if(isRepaint && GameContext.canvas.pauseState == 0)
            {
                GameContext.canvas.repaint();
            }
            try {
                Thread.sleep(500);
            }catch(Exception ex) {
                //#if PRINTDEBUG == 1
                ex.printStackTrace();
                //#endif
            }
        }
    }
    private void randomTip() {
        curTip = GameContext.getRand(0, tipCnt - 1);
    }
    public void paint(Graphics g) {
        Util.clearScreen(g, 0);
        g.setColor(0xffffff);
        Util.drawTextAlignCenter(g, tips[curTip], 100, 220);
        font.drawChars(g, txt, 0, txtLen - MAX_STEP + step, 10, topY);
        step++;
        if(step > MAX_STEP) {
            step = 0;
        }

        if(GameContext.actor == null)
        {
            return;
        }
        if(!GameContext.actor.imgReady)
        {
            return;
        }
        final int ACTOR_X = 30;
        final int ACTOR_Y = topY - 20;
        GameContext.actor.ani.drawFrame(g, 7, step, ACTOR_X, ACTOR_Y, GameContext.actor);
    }
    
    public void logic() {
    }
}
