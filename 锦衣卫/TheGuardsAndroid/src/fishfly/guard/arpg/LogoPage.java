/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.util.Vector;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class LogoPage extends Page {
    private static final long SHOW_TIME = 2000;
    
    Vector logos;
    
    Image logo;
    int leftX;
    int topY;
    
    int imgIdx;
    long startTime;
    boolean changeColor;
    
    public LogoPage() {
        fullScreen = true;
        load();
    }
    
    private void load() {
        final String LOGO_PATH = "/logo.fs";
        String txt = Util.decryptText(LOGO_PATH);
//        String txt = "icon.png;HappyTime;http://www.51fishfly.com"; 
        if(txt == null) {
            toNextPage();
            return;
        }
        
        txt = txt.trim();
        
        if(txt.length() == 0) {
            toNextPage();
            return;
        }
        
        int pos = txt.indexOf(';');
        String logoTxt = txt;
        String pushTxt = null;
        
        if(pos > 0) {
            logoTxt = txt.substring(0, pos);
            pushTxt = txt.substring(pos + 1);
        }
        parseLogos(logoTxt);
        parsePush(pushTxt);
        if(logos.isEmpty()) {
            toNextPage();
            return;
        }
        
        logo = (Image)logos.elementAt(0);
        setLogoPosition();
    }
    
    private void setLogoPosition() {
        startTime = System.currentTimeMillis();
    }
    
    private void parsePush(String txt) {
        if(txt == null) {
            return;
        }
        
        int pos = txt.indexOf(';');
        if(pos > 0) {
            GameContext.pushTitle = txt.substring(0, pos);
            GameContext.pushUrl = txt.substring(pos + 1);
            return;
        }
        GameContext.pushUrl = txt;
    }
    
    private void parseLogos(String txt) {
        logos = new Vector();
        
        int pos = 0;
        
        while(pos < txt.length()) {
            int nextPos = txt.indexOf('&', pos + 1);
            String part = null;
            
            if(nextPos < 0) {
                nextPos = txt.length();
            }
            part = txt.substring(pos, nextPos);
            try {

//                Image img = Image.createImage("/" + part);

                byte[] buf = Util.decryptImage("/" + part);
                Image img = Image.createImage(buf, 0, buf.length);

                logos.addElement(img);
            }catch(Exception ex) {
                //#if PRINTDEBUG == 1
                ex.printStackTrace();
                //#endif
            }
            pos = nextPos + 1;
        }
    }
    
    private void toNextPage() {
        MainCanvas.removePage();
        
        SoundPage soundPage = new SoundPage();
        MainCanvas.addPage(soundPage);
    }
    
    public void paint(Graphics g) {
        int width = Page.SCREEN_WIDTH;
        int height = Page.SCREEN_HEIGHT;
        leftX = (width - logo.getWidth()) >> 1;
        topY = (height - logo.getHeight()) >> 1;
         if (GameContext.version == 2) {
            if (changeColor) {
                g.setColor(0xffffff);
            } else {
                g.setColor(0x00263a);
            }
        } else {
            g.setColor(0xffffff);
        }
       
        g.fillRect(0, 0, width, height);
        
        if(logo == null) {
            return;
        }
        
        g.drawImage(logo, leftX, topY, Graphics.LEFT | Graphics.TOP);
    }
    
    public void logic() {
        long currentTime = System.currentTimeMillis();
        if(currentTime - startTime < SHOW_TIME) {
            return;
        }
        
        imgIdx++;
        if(imgIdx >= logos.size()) {
            toNextPage();
            return;
        }
        startTime = currentTime;
        logo = (Image)logos.elementAt(imgIdx);
        if (GameContext.version == 2) {
            changeColor = true;
        }
        setLogoPosition();
    }
}
