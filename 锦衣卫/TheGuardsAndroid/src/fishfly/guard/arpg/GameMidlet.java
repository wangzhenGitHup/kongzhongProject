/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

/**
 * MEMORY
 * 0 代表内存大的包
 * 1 代表7370,2MB内存的包 
 */

package fishfly.guard.arpg;
//#if UPDATA == 1
//#endif
import android.content.Context;
import javax.microedition.midlet.*;
import javax.microedition.lcdui.*;

/**
 * @author 何召卫@fishfly.com
 */
public class GameMidlet extends MIDlet {
    MainCanvas canvas;

    private Display disp;

    boolean isRun;
    public GameMidlet()
    {
        disp = Display.getDisplay(this);
        
        GameContext.display = disp;
        GameContext.midlet = this;
        canvas = new MainCanvas(disp);
        GameContext.canvas = canvas;
        //canvas.bootstrap();

    }
    
    public void startApp() {
        disp.setCurrent(canvas);
        if(!isRun)
        {
            canvas.bootstrap();
            isRun = true;
        }
    }

    public void pauseApp() {
        canvas.pause();
    }

    public void destroyApp(boolean unconditional) {
    }
}
