/*
 * Copyright(c) 2009 北京飞�?畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;

/**
 *
 * @author 何召卫@fishfly.com
 */
public abstract class Role extends PaintUnit implements RoleConst {

    String name = null;

    //生命值
    int hp;
    int maxHp;
    //攻击力
    int ap;
    //速度
    int speed;

    int status = STAND_STATUS;
    int dir = DOWN;

    //是否可见
    boolean visible = true;
    //是否隐身
    boolean isHide;
    /**
     * 是否眩晕
     */
    boolean isMess;
    /**
     * 有对话的提示
     */
    boolean isTipShow;

    //缓存下一个移动方位的坐标
    int nextX;
    int nextY;

    /**
     * 动作索引，也就是这个方向的第几个动作
     */
    int curActionIndex;
    
    //是否开始移动moveRole
    boolean haveMoveTask;
    ScriptEngine taskScript;
    int[] moveTaskX;
    int[] moveTaskY;
    //移动任务步骤
    int moveTaskIndex;

    //是否在走一条线moveRoleLine
    boolean haveMoveLine;
    //在一条线上移动，行动路线序列
    int taskLineIndex;
    //在一条线上移动的方向
    int[] taskDir;
    //在一条线上移动的距离
    int[] taskLength;
    //在一条线上移动是否反向
    boolean[] taskIsNo;
    int[] taskSpeed;

    int type;
    final static int TYPE_ACTOR = 0;
    final static int TYPE_NPC = 1;
    
    /**
     * 运行动画是否堵塞脚本
     */
    boolean isPlayAnimaitionStopScript;
    /**
     * 是否因为脚本运行而停止
     */
    boolean isScriptStop;
    /**
     * 是否停留在最后一帧  
     */
    boolean isKeepLastFrame;
    
    /**
     * 是否运行完毕之后删除这个role
     */
    boolean isRemoveFinishPlay;
    /**
     * 是否还原动作
     */
    boolean isResumeAct;
    //当前行为
    RoleAction curAct;
    //缓存动作
    AnimationFile bufferAni;
    short bufferActId;
    ScriptEngine observer;

    public Role()
    {
        canDrawRect = Page.scrRect;
    }

    /**
     * 启动移动指令，只会向�?��方向移动，不会寻路，实现�?��
     * 而且，完全可以移�?中间不会有路�?     * @param engine 
     * @param moveX
     * @param moveY
     */
    public void startMoveTask(ScriptEngine engine, int[] moveX, int[] moveY) {     
        haveMoveTask = true;
        taskScript = engine;
        this.moveTaskX = moveX;
        this.moveTaskY = moveY;
        moveTaskIndex = 0;
        int moveDir = dir;
        if(x == moveX[moveTaskIndex]) {
            if(y < moveY[moveTaskIndex]) {
                moveDir = DOWN;
            } else {
                moveDir = UP;
            }
        } else {
            if(x < moveX[moveTaskIndex]) {
                moveDir = RIGHT;
            } else {
                moveDir = LEFT;
            }
        }
        dir = moveDir;
        status = MOVE_STATUS;

        changeAction();
        //#if PRINTDEBUG == 1
        System.out.println("move Dir:" + dir + " speed:" + speed);
        //#endif
    }    
    
    /**
     * 重置播放动画
     */
    public void resetFrame() {
        if(observer != null)
        {
            observer.playAnimation_remind(0, drawX, this);
        }        
        if(isKeepLastFrame)
        {
            return;
        }
        if(isResumeAct && bufferAni != null)
        {
            ani = bufferAni;
            actId = bufferActId;
            bufferAni = null;
            isKeepLastFrame = false;
            initFrame();
            changeAction();
        }
        super.resetFrame();
    }    
    
    /**
     * 逻辑处理
     */
    public void logic(){}
    
    public void updatePaintMatrix(){}
    
    public void removePaintMatrix(){}

    public void addPaintMatrix(){}

    public void setPosition(int x, int y){}
    
    public void initMoveLine(int[] taskDir, int[] length, int[] speed, boolean[] isNo)
    {
        taskLineIndex = 0;
        haveMoveLine = true;
        this.taskDir = taskDir;
        taskLength = length;
        taskSpeed = speed;
        taskIsNo = isNo;
    }
    
    public void updateMoveLineTask(boolean isFly, boolean isFlood)
    {
        if (taskLength[taskLineIndex] == 0 && taskLineIndex >= taskLength.length - 1)
        {
            status = STAND_STATUS;
            changeAction();
            haveMoveLine = false;
            if(GameContext.page.script != null)
            {
                GameContext.page.script.remind(0, 0, null);
                if(!GameContext.page.script.isSuspend)
                {
                    GameContext.page.script = null;
                }
                return;
            }
            return;
        }
        if(status != MOVE_STATUS)
        {
            status = MOVE_STATUS;
            changeAction();
        }
        if(taskLength[taskLineIndex] == 0)
        {
            taskLineIndex ++;
        }
        int newDir = taskDir[taskLineIndex];
        if(dir != newDir)
        {
            dir = newDir; 
            changeDir();
        }
        int s = 0;
        if(taskLength[taskLineIndex] > taskSpeed[taskLineIndex])
        {
            s = taskSpeed[taskLineIndex];
            taskLength[taskLineIndex] -= taskSpeed[taskLineIndex];
        }
        else
        {
            s = taskLength[taskLineIndex];
            taskLength[taskLineIndex] = 0;
        }
        if(taskIsNo[taskLineIndex])
        {
            resetNextPosition(this, dir, -s);
        }
        else
        {
            resetNextPosition(this, dir, s);
        }
        updateRolePaintUnit(this, nextX, nextY, isFly, isFlood);
    }
    
    public void updateMoveTask(boolean isFly, boolean isFlood) {
        int distX = Math.abs(x - moveTaskX[moveTaskIndex]);
        int distY = Math.abs(y - moveTaskY[moveTaskIndex]);
        if(distX < speed && distY < speed)
        {
            nextX = moveTaskX[moveTaskIndex];
            nextY = moveTaskY[moveTaskIndex];
            distX = 0;
            distY = 0;
        }
        if(distX == 0 && distY == 0 && moveTaskIndex == moveTaskX.length - 1) {
            //#if PRINTDEBUG == 1
            System.out.println(name + "移动结束�?");
            //#endif
            updateRolePaintUnit(this, nextX, nextY, isFly, isFlood);
            taskScript.moveRole_remind(UP, drawX, name);
            haveMoveTask = false;
            taskScript = null;
            moveTaskX[moveTaskIndex] = 0;
            moveTaskY[moveTaskIndex] = 0;
            status = STAND_STATUS;
            changeAction();
            return;
        }
        if(distX == 0 && distY == 0)
        {
            updateRolePaintUnit(this, nextX, nextY, isFly, isFlood);    
            moveTaskIndex++;
            distX = Math.abs(x - moveTaskX[moveTaskIndex]);
            distY = Math.abs(y - moveTaskY[moveTaskIndex]);
            if(distX == 0)
            {
                dir = y - moveTaskY[moveTaskIndex] < 0 ? DOWN : UP;
                changeDir();
            }
            else
            {
                dir = x - moveTaskX[moveTaskIndex] > 0 ? LEFT : RIGHT;
                changeDir();
            }
            return;
        }
        
        if(dir == LEFT || dir == RIGHT) {
            if(distX < speed) {
                nextX = moveTaskX[moveTaskIndex];
                updateRolePaintUnit(this, nextX, nextY, isFly, isFlood);              
                //#if PRINTDEBUG == 1
                System.out.println(name + "X到位");
                //#endif
                dir = y > moveTaskY[moveTaskIndex] ? UP : DOWN;
                changeDir();
                return;
            }
        } else {
            if(distY < speed) {
                updateRolePaintUnit(this, nextX, nextY, isFly, isFlood);              
                nextY = moveTaskY[moveTaskIndex];
                //#if PRINTDEBUG == 1
                System.out.println(name + "Y到位");
                //#endif
                dir = x > moveTaskX[moveTaskIndex] ? LEFT : RIGHT;
                changeDir();
                return;
            }
        }
        
        resetNextPosition(this, dir, speed);
        updateRolePaintUnit(this, nextX, nextY, isFly, isFlood);
        //#if PRINTDEBUG == 1
        System.out.println(name + " " + x + "," + y);
        //#endif
    }
    
    private void updateRolePaintUnit(Role role, int nextX, int nextY, boolean isFly, boolean isFlood)
    {
        if (isFly)
        {
            GameContext.flyMat.updateUnit(role, nextX, nextY);
        }
        else if (isFlood)
        {
            GameContext.undergroundMat.updateUnit(role, nextX, nextY);
        }
        else
        {
            GameContext.groundMat.updateUnit(role, nextX, nextY);
        }         
    }
    
    public void resetNextPosition(Role role, int dir, int speed) {
        nextX = x;
        nextY = y;
        int addSpeedX = 0;
        int addSpeedY = 0;
        switch(dir) {
            case UP:
                nextY -= speed;
                break;
            case DOWN:
                nextY += speed;
                break;
            case LEFT:
                nextX -= speed;
                break;
            case RIGHT:
                nextX += speed;
                break;
        }
        nextX += addSpeedX;
        nextY += addSpeedY;
    }
    
    public void resetNextPosition(int dir, int speed, int speedDis) {
        nextX = x;
        nextY = y;
        
        switch(dir) {
            case UP:
                nextY -= speed;
                nextX += speedDis;
                break;
            case DOWN:
                nextY += speed;
                nextX += speedDis;
                break;
            case LEFT:
                nextX -= speed;
                nextY += speedDis;
                break;
            case RIGHT:
                nextX += speed;
                nextY += speedDis;
                break;
        }
    }    
    
    public void refreshSpeed() {
        curAct.updateSpeed(this);
    }
        
    /**
     * 重置自己的当前行�?     */
    void resetAction() {}
    
    void resetAnimation(boolean updateAnimation) {
        if(updateAnimation) {
            AnimationManager aniMgr = AnimationManager.getInstance();
            aniMgr.getAnimation(curAct.aniId, this);
        }
        actId = curAct.getAnimation(dir, 0);
        curActionIndex = 0;
        resetFrame();
    }
    
    public void paint(Graphics g, int offsetX, int offsetY) {
        paintAnimation(g, offsetX, offsetY);
    }
    
    void changeAction() {
        resetAction();
        resetAnimation(true);
        initFrame();
        curAct.updateSpeed(this);
    }
    
    void changeDir() {
        resetAnimation(false);
        curAct.updateSpeed(this);
    }
}
