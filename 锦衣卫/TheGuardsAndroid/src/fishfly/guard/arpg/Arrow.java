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
public class Arrow extends Role {

    private static Rect box1 = new Rect();
    ArrowFile file;
    int moveSpeedX;
    int moveSpeedY;
    boolean isLine = true;
    long startTime;
    boolean isLive = true;
    //是否攻击过
    boolean isAttack;

    /**
     * 投掷物距离屏幕边界的X距离，如果为0不考虑
     */
    private int disLengthX;
    /**
     * 投掷物距离屏幕边界的Y距离
     */
    private int disLengthY;

    /**
     * 必杀技投掷物ID
     */
    private static final int SUPER_ARROW_ID = 92;
    
    public void setFile(ArrowFile file) {
        this.file = file;
        moveSpeedX = file.aliveAction.getSpeed(UP);
        moveSpeedY = file.aliveAction.getSpeed(LEFT);
        curAct = file.aliveAction;
        if(file.id == SUPER_ARROW_ID)
        {
	    //#if E62
//# 	  setDisLength(20, 20);
	    //#else
            setDisLength(40, 80);
	    //#endif
        }
    }

    /**
     * 设置投掷物运行的边界
     * @param lengthX
     * @param lengthY
     */
    public void setDisLength(int lengthX, int lengthY)
    {
        disLengthX = lengthX;
        disLengthY = lengthY;
    }
    
    public void setThrowPosition(PaintUnit unit)
    {
        if(file.isFullScreenAttack)
        {
            int newX = (Page.SCREEN_WIDTH >> 1) + GameContext.page.offsetX;
            int newY = (Page.SCREEN_HEIGHT >> 1) + GameContext.page.offsetY;
            GameContext.flyMat.updateUnit(this, newX, newY);
            return;            
        }
        
        if(file.isBeside)
        {
            //为了让动画挡住主角 人为把动画下移2个像素
            int newX = GameContext.actor.x;
            int newY = GameContext.actor.y + 2;
            
            GameContext.flyMat.updateUnit(this, newX, newY);
            return;
        }
        
        GameContext.flyMat.updateUnit(this, unit.x, unit.y);
        //如果是敌人并且没有智商的话
        if(!file.isMoveSelf && file.isEnemy)
        {
            dir = DOWN;
        }
    }

    int getAttackPoint()
    {
        int attackPoint = ap;
        return attackPoint;
    }
    
    public void paint(Graphics g, int offsetX, int offsetY) {
        if(file.isHaveLine())
        {
            Role role = RoleManager.getInstance().boss;
            g.setColor(0xff0000);
            g.drawLine(x - offsetX, y - offsetY, role.x - offsetX, role.y - offsetY);
        }
        paintAnimation(g, offsetX, offsetY);
    }    
    
    /**
     * 重置播放动画
     */
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
     * 跟踪
     */
    private void cleverMove()
    {
        GameContext.actor.getPaintBox(box1);
        int moveX = 0;
        int moveY = 0;
        int actorX = GameContext.actor.x;
        int actorY = GameContext.actor.y - (box1.getHeight() >> 1);
        int moveSpeedXBuffer = moveSpeedX;
        int moveSpeedYBuffer = moveSpeedY;
        int disX = Math.abs(actorX - x);
        int disY = Math.abs(actorY - y);
        
        if(MainCanvas.currentTime - startTime < 1000)
        {
            if (disX < disY)
            {
                moveSpeedX = Math.abs(actorX - x) * moveSpeedX / Math.abs(actorY - y);
            }

            if (disY < disX)
            {
                moveSpeedY = Math.abs(actorY - y) * moveSpeedY / Math.abs(actorX - x);
            }
        }
        
        if(disX > moveSpeedX)
        {
            moveX = x + (actorX > x ? moveSpeedX : -moveSpeedX);
        }
        else
        {
            moveX = actorX;            
        }
        if(disY > moveSpeedY)
        {
            moveY = y + (actorY > y ? moveSpeedY : -moveSpeedY);            
        }
        else
        {
            moveY = actorY;            
        }
        if(moveX == actorX && moveY == actorY)
        {
            //运行脚本的时候直接消失不攻击主角
            if(GameContext.script == null)
            {
                GameContext.actor.attacked(this);
                //TODO
            }
            else
            {
                if(observer != null)
                {
                    observer.remind(disY, dir, name);
                    observer = null;
                }
            }
            isLive = false;
            return;
        }
        moveSpeedX = moveSpeedXBuffer;
        moveSpeedY = moveSpeedYBuffer;
        GameContext.flyMat.updateUnit(this, moveX, moveY);
    }
    
    /**
     * 攻击完毕后的动作
     * @param role
     * @return
     */
    public boolean attackEndLogic(Actor role)
    {
        if(!file.isEnemy)
        {
            return false;
        }
        if(isAttack)
        {
            return false;
        }
        //呵呵，让主角尝尝这个吧,把不良状态放到主角身上
        if(GameContext.actor.keepAttackEffect == null || !GameContext.actor.keepAttackEffect.isLive)
        {
            GameContext.actor.keepAttackEffect = file.attackEffect.clone();
        }
        
        isAttack = true;
        if(file.isFullScreenAttack || file.isBeside)
        {
            return false;
        }
        GameContext.flyMat.updateUnit(this, GameContext.actor.x, GameContext.actor.y);
        
        return false;
    }
    

    void doAnimationEnd()
    {
        //投掷物死亡动作完毕之后就设置成死亡状态
        if(curAct == file.dieAction)
        {
            isLive = false;
            return;
        }
        if (curActionIndex < curAct.aniCnt - 1)
        {
            curActionIndex++;
            actId = curAct.getAnimation(dir, curActionIndex);
            resetFrame();
            curAct.updateSpeed(this);
            return;
        }
        curAct.updateSpeed(this);        
        resetFrame();        
        super.doAnimationEnd();
    }
    
    public void update()
    {
        int curFrame = frameId;
        //先更新当前动画的帧数
        updateAnimation();
        if (frameId != curFrame)
        {
            //写入变速运动功能
            int effort = curAct.getEffect(curActionIndex, frameId);
            if (effort >= 0)
            {
                GameContext.page.setEffort(effort);
            }
        }
        
    }
    
    public void updatePaintMatrix()
    {
        GameContext.flyMat.updateUnit(this, x, y);
    }    
    
    public void logic()
    {
        if(!isLive)
        {
            return;
        }
        //攻击之后立刻死亡
        if(isAttack && status != DEAD_STATUS)
        {
            if(file.dieAction != null && !file.dieAction.isActEmpty())
            {
                status = DEAD_STATUS;
                curAct = file.dieAction;
                changeAction();
                //#if PRINTDEBUG == 1
                System.out.println("arrow logic 1");
                //#endif
                return;
            }
        }
        //如果是终结技，不判断是否出屏幕了
        int disX = x - GameContext.page.offsetX;
        int disY = y - GameContext.page.offsetY;
        if(file.isEnemy && !file.isFullScreenAttack && disLengthX == 0 && disLengthY == 0)
        {
            if(disX < 0 || disX > Page.SCREEN_WIDTH || disY < 0 || disY > Page.SCREEN_HEIGHT)
            {
                isLive = false;
                if (observer != null)
                {
                    observer.remind(disY, dir, name);
                    observer = null;
                }
                //#if PRINTDEBUG == 1
                System.out.println("arrow logic 2:" + disX + "," + disY);
                //#endif
                return;
            }
        }
        else if(disLengthX != 0 || disLengthY != 0)
        {
            //如果投掷物越过了给定的界限速度清零
            if((dir == UP && disY < disLengthY)
                    || (dir == DOWN && disY > GameContext.page.showHeight - disLengthY)
                    || (dir == LEFT && disX < disLengthX)
                    || (dir == RIGHT && disX > GameContext.page.showWidth - disLengthX)
                    )
            {
                if(file.id == SUPER_ARROW_ID && GameContext.actor.isStopKey)
                {
                    GameContext.actor.isStopKey = false;
                }
                moveSpeedX = 0;
                moveSpeedY = 0;
            }
        }
        moveDir();
        if(MainCanvas.curSkillFrame - startTime >= file.aliveTime && isLive)
        {
            isLive = false;
            if (observer != null)
            {
                observer.remind(0, 0, null);
                observer = null;
            }
        }     
    }
    
    protected void moveDir()
    {
        updateSpeed();
        int moveX = 0;
        int moveY = 0;
        if(file.isClever)
        {
            cleverMove();
            return;
        }        
        if (isLine)
        {
            switch (dir)
            {
                case UP:
                    moveY -= moveSpeedY;
                    moveX += moveSpeedX;
                    break;
                case DOWN:
                    moveY += moveSpeedY;
                    moveX += moveSpeedX;
                    break;
                case LEFT:
                    moveX -= moveSpeedX;
                    moveY += moveSpeedY;
                    break;
                case RIGHT:
                    moveX += moveSpeedX;
                    moveY += moveSpeedY;
                    break;
            }
        }
        else
        {
            switch (dir)
            {
                case UP:
                    moveX -= moveSpeedX;
                    moveY -= moveSpeedY;
                    break;
                case DOWN:
                    moveX += moveSpeedX;
                    moveY += moveSpeedY;
                    break;
                case LEFT:
                    moveX -= moveSpeedX;
                    moveY += moveSpeedY;
                    break;
                case RIGHT:
                    moveX += moveSpeedX;
                    moveY -= moveSpeedY;
                    break;
            }            
        }
        //先判断地图上是否可以走
        nextX = x + moveX;
        nextY = y + moveY;
        
        GameContext.flyMat.updateUnit(this, nextX, nextY);
    }
    
    public void updateSpeed() {
        int speedX = moveSpeedX;
        int speedY = moveSpeedY;
        if (isLine)
        {
            switch (dir)
            {
                case UP:
                case DOWN:
                    moveSpeedX = speedX > speedY ? speedY : speedX;
                    moveSpeedY = speedX < speedY ? speedY : speedX;
                    break;
                
                case LEFT:
                case RIGHT:
                    moveSpeedX = speedX < speedY ? speedY : speedX;
                    moveSpeedY = speedX > speedY ? speedY : speedX;
                    break;
            }
        }
        if(file.isClever)
        {
            moveSpeedX = (moveSpeedX == 0 ? moveSpeedY : moveSpeedX);
            moveSpeedY = (moveSpeedY == 0 ? moveSpeedX : moveSpeedY);
            return;
        }
    }
    
    public void setOtherMoveSpeed()
    {
        if(!file.isEnemy || file.isClever || !file.isMoveSelf)
        {
            return;
        }
        int disX = GameContext.actor.x - x;
        int disY = GameContext.actor.y - y;             
        int lengthX = Math.abs(disX);
        int lengthY = Math.abs(disY);
        if(lengthX == 0)
        {
            lengthX++;            
        }
        if(lengthY == 0)
        {
            lengthY ++;
        }
        isLine = true;
        if(moveSpeedX == moveSpeedY)
        {
            if(moveSpeedX == 0)
            {
                return;
            }
            isLine = false;
        }
        if(isLine)
        {
            updateSpeed();         
            return;
        }
        //斜的方向
        if (disX < 0 && disY < 0)
        {
            setDir(UP);
        }
        else if (disX < 0 && disY > 0)
        {
            setDir(LEFT);
        }
        else if (disX > 0 && disY < 0)
        {
            setDir(RIGHT);
        }
        else
        {
            setDir(DOWN);
        }
        if (lengthX > lengthY)
        {
            moveSpeedX = lengthX * moveSpeedY / lengthY;
            return;
        }
        moveSpeedY = lengthY * moveSpeedX / lengthX; 
    }
    
    public void setDir(int dir) {
        this.dir = dir;
        adjustAnimation();
    }
    
    public void adjustAnimation() {
        AnimationManager aniMgr = AnimationManager.getInstance();
        aniMgr.getAnimation(curAct.aniId, this);
        actId = curAct.getAnimation(dir, 0);
        resetFrame();
    }
}
