/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;

/**
 *
 * @author 胡阳@fishfly.com
 */
public class ChestBox extends Role{
    /**
     * 宝箱文件
     */
    public ChestBoxFile file;
    
    /**
     * 存活脚本
     */
    ScriptEngine liveScript;
    
    /**
     * 死亡脚本
     */
    ScriptEngine deadScript;

    /**
     * 创造一个宝箱
     * @param name 宝箱的名字
     * @param x 宝箱的X坐标
     * @param y 宝箱的Y坐标
     */
    public ChestBox(String name, int x, int y)
    {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    /**
     * 设置宝箱的动作
     * @param updateAnimation
     */
    void resetAnimation(boolean updateAnimation) {
        if(updateAnimation) {
            AnimationManager aniMgr = AnimationManager.getInstance();
            aniMgr.getAnimation(file.aniId, this);
        }
        actId = file.getAliveAction(dir);
        curActionIndex = 0;
        resetFrame();
    }    
    
    void changeAction() {
        resetAction();
        resetAnimation(true);
        initFrame();
    }
    
    void changeDir() {
        resetAnimation(false);
    }    

    /**
     * 设置宝箱的脚本
     * @param liveScript 开启脚本
     * @param deadScript 死亡脚本
     */
    public void setChestBoxAi(ScriptEngine liveScript, ScriptEngine deadScript)
    {
        this.liveScript = liveScript;
        this.deadScript = deadScript;
    }

    /**
     * 设置宝箱的位置
     * @param x 宝箱的X坐标
     * @param y 宝箱的Y坐标
     */
    public void setPosition(int x, int y)
    {
        GameContext.groundMat.updateUnit(this, x, y);
    }

    /**
     * 获取宝箱当前的脚本
     * @return 宝箱当前的脚本
     */
    public ScriptEngine getAi()
    {
        if(status == STAND_STATUS)
        {
            return liveScript;
        }
        return deadScript;
    }

    /*
     * 渲染宝箱
     */
    public void paint(Graphics g, int offsetX, int offsetY) {
        paintAnimation(g, offsetX, offsetY);
        drawTip(g, offsetX, offsetY);
    }

    private void drawTip(Graphics g, int offX, int offY)
    {
        Rect paintBox = RoleManager.getInstance().box2;
        getPaintBox(paintBox);
        if (isTipShow) {
            GameContext.page.tipPaint.x = x;
            GameContext.page.tipPaint.y = y - paintBox.getHeight();
            GameContext.page.tipPaint.paint(g, offX, offY);
            GameContext.page.tipPaint.playNextFrame();
            if (GameContext.page.tipPaint.isEndAnimation()) {
            }
        }
    }
    
    public void resetAction() {
        if(status == STAND_STATUS)
        {
            actId = file.getAliveAction(dir);
        }
        else
        {
            actId = file.dieAct;
        }
        resetFrame();
    }

    /**
     * 宝箱是否打开了
     * @return
     */
    public boolean isOpen() {
        return status != STAND_STATUS;
    }

    public void logic()
    {
        updateShowTip();
    }

    private void updateShowTip()
    {
        if (GameContext.script != null && !GameContext.script.isEnd())
        {
            isTipShow = false;
            return;
        }
        if (!visible) {
            isTipShow = false;
            return;
        }
        if (getAi() == null) {
            isTipShow = false;
            return;
        }

        Rect box1 = new Rect();
        getPaintBox(box1);
        if (box1.isEmpty()) {
            isTipShow = false;
            return;
        }

        int dir = GameContext.actor.dir;
        int actorX = GameContext.actor.x;
        int actorY = GameContext.actor.y;
        final int boxRectSize = 8;
        Rect box2 = new Rect();
        box2.set(actorX - boxRectSize, actorY - (boxRectSize), actorX + (boxRectSize << 1), actorY + (boxRectSize));
        box1.offset(x, y);
        if (!box1.testIntersect(box2)) {
            isTipShow = false;
            return;
        }

        if((dir == PaintUnit.UP && y <= actorY)
                || (dir == PaintUnit.DOWN && y >= actorY)
                || (dir == PaintUnit.LEFT && x <= actorX)
                || (dir == PaintUnit.RIGHT && x >= actorX)
                || (box1.getIntersectHeight(box2) > box2.getHeight() && box1.getIntersectWidth(box2) > box2.getWidth())) {
            if (isTipShow)
            {
                return;
            }
            isTipShow = true;
            GameContext.page.tipPaint.x = x;
            GameContext.page.tipPaint.y = y - box1.getHeight();
            GameContext.page.tipPaint.resetFrame();
            return;
        }
        isTipShow = false;
    }
}
