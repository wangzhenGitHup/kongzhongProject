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
public class PausePage extends Page {
    char[] msg;
    public PausePage() {
        fullScreen = true;
        
        final short MSG_ID = 3;
        StringManager mgr = StringManager.getInstance();
        msg = mgr.getString(MSG_ID);
    }
    
    public void paint(Graphics g) {
        Util.clearScreen(g, 0);
        g.setColor(0xffffff);
        Util.drawTextAlignCenter(g, msg, 130, 280);
    }
    
    public void keyPressed(int keyCode) {
        toNextPage();
    }
    
    private void toNextPage() {
        //去掉当前界面
        //把自己从最上面移掉
        MainCanvas.removePage();
    }
}

