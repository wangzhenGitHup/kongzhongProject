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
public class SoundPage extends Page{
    char[] msg;
    char[] leftKey;
    int leftX;
    
    char[] rightKey;
    int rightX;
    int topY;
    
    static final int XMARGIN = 2;
    static final int YMARGIN = 2;
    
    FishFont font;
    MusicPlayer player;
    
    public SoundPage() {
        fullScreen = true;
        
        player = MusicPlayer.getInstance();
        final short MSG_ID = 0;
        
        StringManager strMgr = StringManager.getInstance();
        
        msg = strMgr.getString(MSG_ID);
        
        //移植时需要调整这两个键的值
        final short LEFT_KEY = 1;
        final short RIGHT_KEY = 2;
        
        leftKey = strMgr.getString(LEFT_KEY);
        rightKey = strMgr.getString(RIGHT_KEY);
        
        font = FishFont.getInstance();
        
        topY = SCREEN_HEIGHT - YMARGIN - FishFont.FONT_HEIGHT;
        leftX = XMARGIN;
        rightX = SCREEN_WIDTH - XMARGIN - font.charsWidth(rightKey);

        ImageManager.getInstance();
    }
    
    public void paint(Graphics g) {
        Util.clearScreen(g, 0);
        g.setColor(0xffffff);
        Util.drawTextAlignCenter(g, msg, 100, 280);
        paintSoftkey(g);
    }
    
    private void paintSoftkey(Graphics g) {
        font.drawChars(g, leftKey, 0, leftKey.length, leftX, topY);
        
        font.drawChars(g, rightKey, 0, rightKey.length, rightX, topY);
    }
    
    public void keyPressed(int keyCode) {
        switch(keyCode) {
            case Keys.KEY_LEFT_SOFT:
                openSound();
                break;
                
            case Keys.KEY_RIGHT_SOFT:
                closeSound();
                break;
        }
    }
    
    //#if POINT == 1
    public void pointerPressed(int px, int py) {
        if (GameContext.point(px, py, leftX, topY - 10, font.charsWidth(leftKey) + 10, FishFont.FONT_HEIGHT + 10)) {
            openSound();
        }
        else if (GameContext.point(px, py, rightX - 10, topY - 10, font.charsWidth(rightKey) + 10, FishFont.FONT_HEIGHT + 10)) {
            closeSound();
        }
    }
    //#endif
    
    private void openSound() {
        MainCanvas.removePage();
        player.isOpenMusic = true;
        MainScreen main = new MainScreen();
        MainCanvas.addPage(main);
        main.start();        
    }
    
    private void closeSound() {
        MainCanvas.removePage();
        player.isOpenMusic = false;
        player.curSoundLv = 0;
        MainScreen main = new MainScreen();
        MainCanvas.addPage(main);
        main.start();        
    }
}
