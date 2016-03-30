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
public abstract class Page implements PageSize{
    
    //如果一页是全屏的话，后续的页无需再绘制
    boolean fullScreen;
    //暂停逻辑更新
    boolean pause;
    public static int SCREEN_WIDTH = 0;
    public static int SCREEN_HEIGHT = 0;
    //全屏框
    public static Rect scrRect = new Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    public static Rect scrRectMap = new Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT + 150);

    public abstract void paint(Graphics g);
    public void keyPressed(int keyCode) {};
    public void keyReleased(int keyCode) {};
    //#if POINT == 1
    public void pointerPressed(int px, int py){};
    public void pointerReleased(int px, int py){};
    public boolean pointerDragged(int startX, int startY, int endX, int endY){return false;};
    //#endif
    public void logic() {};

    /**
     * 联网模块的监听
     * @param str
     * @param type
     */
    public void qqListener(String str, int type){};

    public static void initGamePageSize(int screen_width, int screen_height)
    {
        Page.SCREEN_WIDTH = screen_width;
        Page.SCREEN_HEIGHT = screen_height;
        scrRect = new Rect(0, 0, screen_width, screen_height);
        scrRectMap = new Rect(0, 0, screen_width, screen_height + 150);
    }
}
