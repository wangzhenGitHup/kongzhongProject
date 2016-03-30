/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class PaintUnit {
    public static final int UP = 0;
    public static final int DOWN = 1;
    public static final int LEFT = 2;
    public static final int RIGHT = 3;
    public static final int DIR_CNT = 4;
    public static final int NO_DIR = 10;

    /**
     * 可以显示的区域
     */
    protected Rect canDrawRect;

    AnimationItem aniItem;
    AnimationFile ani;
    public short actId;
    public byte frameId;
    public byte duration;
    int lastFrame;
    int durationCnt;
    int x;
    int y;
    PaintUnit next;
    static Rect box = new Rect();
    //创建这两个的目的是为了少创建临时变量
    int drawX;
    int drawY;
    //动画改变了
    boolean changeAnimation;
    
    //是否是单张图片
    public boolean singleImg = true;
    
    //单张图片
    public Image img;
    
    //多张图片
    public Image[] imgs;
    //mod对应的图片
    //每个值上半部分是mod的偏移量，下半部分是mod的图片序号
    public int[] modImgs;
    boolean imgReady;

    public PaintUnit()
    {
        canDrawRect = Page.scrRectMap;
    }

    public void paint(Graphics g, int offsetX, int offsetY) {
        paintAnimation(g, offsetX, offsetY);
    }
    
    public void update() {
        updateAnimation();
    }
    
    /**
     * 允许中途变更动作
     * @param actId
     */
    public void setAction(AnimationFile ani, short actId) {
        this.actId = actId;
        this.ani = ani;
        
        resetFrame();
    }
    
    /**
     * 设置一个统一透明色的图片
     * @param A
     */
    public void setImageA(int A)
    {
        if(img == null)
        {
            return;
        }
        int imgWidth = img.getWidth();
        int imgHeight = img.getHeight();
        int[] buf = new int[imgWidth * imgHeight];
        img.getRGB(buf, 0, imgWidth, 0, 0, imgWidth, imgHeight);
        for(int index = 0, cnt = buf.length; index < cnt; index++)
        {
            if((buf[index] & 0xffffff) == 0 || (buf[index] & 0xffffff) == 0xffffff)
            {
                buf[index] = 0;
                continue;
            }
	    //#if E2 || V8 || E6
//#             if((buf[index] & 0xffffff) == 0xfcfcfc)
//#             {
//#                 buf[index] = 0;
//#                 continue;
//#             }
	    //#endif
            //#if N73
//#             if((buf[index] & 0xff) == 0xff)
//#             {
//#                 buf[index] &= 0xffffff;
//#                 continue;
//#             }
            //#endif            
            buf[index] &= 0xffffff;
            buf[index] |= (A << 24);
        }
        img = Image.createRGBImage(buf, imgWidth, imgHeight, true);
    }

    public void paintAnimation(Graphics g, int offsetX, int offsetY) {
        ani.getPaintBox(actId, frameId, box);
        drawX = x - offsetX;
        drawY = y - offsetY;
        box.offset(drawX, drawY);

        if (!canDrawRect.testIntersect(box)) {
            return;
        }
        ani.drawFrame(g, actId, frameId, drawX, drawY, this);
        
        //#if PRINTDEBUG > 1
//#         //调试用，看看相关点在哪里
//#         g.setColor(0x0000ff);
//#         g.drawLine(drawX, drawY - 10, drawX, drawY + 10);
//#         g.drawLine(drawX - 10, drawY, drawX + 10, drawY);
        //#endif
        //#if PRINTDEBUG == 1
//        g.setColor(0xff0000);
//        ani.getBodyBox(actId, frameId, box);
//        box.offset(drawX, drawY);
//        g.drawRect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);
//        g.setColor(0xff00ff);
//        ani.getAttackBox(actId, frameId, box);
//        box.offset(drawX, drawY);
//        g.drawRect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);
        //#endif
    }
    
    public void getBodyBox(Rect box) {
        ani.getBodyBox(actId, frameId, box);
    }
    
    public void getAttackBox(Rect box) {
        ani.getAttackBox(actId, frameId, box);
    }
    
    public void getPaintBox(Rect box) {
        ani.getPaintBox(actId, frameId, box);
    }
    
    public void playNextFrame() {
        duration++;
        if(duration < durationCnt) {
            return;
        }
        
        duration = 0;
        
        if(frameId < lastFrame) {
            frameId++;
            updateDuration();
            return;
        }
    }
    
    public boolean isEndAnimation() {
        return frameId == lastFrame && duration == durationCnt - 1;
    }
    /**
     * 重置播放动画
     */
    public void resetFrame() {
        frameId = 0;
        duration = 0;
        lastFrame = ani.getFrameCount(actId) - 1;
        updateDuration();
    }
    
    /**
     * 初始化
     */
    public void initFrame()
    {
        frameId = 0;
        duration = 0;
        lastFrame = ani.getFrameCount(actId) - 1;
        updateDuration();     
    }
    
    public void updateDuration() {
        durationCnt = ani.getFrameDuration(actId, frameId);
        if(durationCnt == 0) {
            durationCnt = 1;
        }
        //#if PRINTDEBUG == 1
//        System.out.println("durationCnt:" + durationCnt + " actId:" + actId + " frameId:" + frameId);
        //#endif
    }
    
    /**
     * 调整动画相关的部分
     */
    public void updateAnimation() {
        if(changeAnimation) {
            changeAnimation = false;
            return;
        }
        
        //更新动画
        if(isEndAnimation()) {
            doAnimationEnd();
            return;
        }
        playNextFrame();
    }
    
    void doAnimationEnd() {
        resetFrame();
    }
    
    public static int reverseDir(int dir) {
        switch(dir) {
            case UP:
                return DOWN;
            case DOWN:
                return UP;
            case LEFT:
                return RIGHT;
            case RIGHT:
                return LEFT;
        }
        return NO_DIR;
    }
    
    public void releaseImages()
    {        
        AnimationManager.getInstance().releaseAni(ani);
        
        if(singleImg)
        {
            ImageManager.getInstance().removeImage(img);
            return;
        }
        
        ImageManager.getInstance().removeImage(imgs);
    }
}
