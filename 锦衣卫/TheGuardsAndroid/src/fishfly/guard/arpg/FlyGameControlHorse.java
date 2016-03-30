package fishfly.guard.arpg;
/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 * 飞行射击游戏
 * @author 胡阳@fishfly.com
 */
public class FlyGameControlHorse implements MiniGame, BoxListener {

//    Dialog dlg = GameContext.page.dlg;
    Dialog dlg;
    /**
     * 游戏状态
     */
    int gameState;
    /**
     * 啥都没有的状态
     */
    final int STATE_NO = 0;
    /**
     * 小游戏状态
     */
    final int STATE_GAME = 1;
    int SCREEN_WIDTH = Page.SCREEN_WIDTH;
    int SCREEN_HEIGHT = Page.SCREEN_HEIGHT;
    final int ACTOR_STATE_HEIGHT = GamePage.ACTOR_STATE_HEIGHT;
    /**
     * 主角相关
     */
    PaintUnit actor = new PaintUnit();
    PaintUnit dragon = new PaintUnit();
    /**
     * 主角碰撞矩形
     */
    Rect actorBody = new Rect();
    Rect actorAttack = new Rect();
    final int ACTOR_ACT_ID_STAND = 9;
    final int ACTOR_ACT_ID_ATTACK1 = 16;
    final int ACTOR_ACT_ID_HURT = 26;
    final int ACTOR_ACT_ID_DEAD = 19;
    private int actorDir = 0;
    /*
     * 主角速度
     */
    final int ACTOR_SPEED_X = 10;
    final int ACTOR_SPEED_Y = 10;
    /**
     * 主角坐标
     */
    private int actorX = SCREEN_WIDTH >> 1;
    private int actorY = SCREEN_HEIGHT - 50;
    /**
     * 攻击力
     */
    private int actorDp = GameContext.actor.dp;
    /**
     * 按键
     */
    private int keyCode;

    /*-----------背景相关-------------*/

    int backGroundX = (SCREEN_WIDTH - GameContext.map.width)>>1;
    int backGroundY = GameContext.map.height - SCREEN_HEIGHT;
    /*--------------------------------*/
    //*****************敌人数据**************************//
    final int ENEMY_MAX_COUNT = 100;
    PaintUnit[] enemyPaint = new PaintUnit[ENEMY_MAX_COUNT];
    PaintUnit hurtPaint = new PaintUnit();
    PaintUnit deadPaint = new PaintUnit();
    int[] hurtData = new int[ENEMY_MAX_COUNT];
    /**
     * 敌人状态
     */
    final int ENEMY_STATE_WAIT = 0;//待机
    final int ENEMY_STATE_ATTACK = 1;//瞄准
    final int ENEMY_STATE_TRACK = 2;//跟踪
    final int ENEMY_STATE_FIRE = 3;//发射
    final int ENEMY_STATE_HURT = 4;//受伤
    final int ENEMY_STATE_DEAD = 5;//死亡
    final int ENEMY_STATE_DELETE = 6;//消失
    /**
     * 动作id
     */
    private int[] ENEMY_ACT_ID = {8, 12, 8, 13, 24, 20, 8};
    final int[] ENEMY_ACT_FRAME_COUNT = {-1, 4, -1, 4, 8, -1, -1};
    final int ENEMY_KIND1 = 0;
    final int ENEMY_KIND2 = 1;
    final int ENEMY_MAX_HP = 1000;
    //敌人攻击力
    private int enemyAp = GameContext.actor.dp + 50;
    //将类转换成一个数组就醒了
    final int HP = 0;
    final int POS_X = 1;
    final int POS_Y = 2;
    final int KIND = 3;
    final int SPEED_X = 4;
    final int SPEED_Y = 5;
    final int STATE = 6;
    final int COUNT = 7;
    final int ENEMY_DATA_LEN = 8;
    /**
     * 敌人数据,KIND = 0是自由射击、1是射一箭消失、2是没有射箭功能
     */
    private int[][] enemy = new int[ENEMY_MAX_COUNT][ENEMY_DATA_LEN];
    private int[] enemyData = {ENEMY_MAX_HP, 0, 0, ENEMY_KIND1, 0, 0, ENEMY_STATE_TRACK, 0};
    /**
     * 敌人当前数量
     */
    private int enemyCount = 0;
    /**
     * 结束的时间
     */
    private int END_TIME = 900;
    /**
     * 计数器
     */
    //*****************子弹数据**************************//
    final int BULLET_MAX_COUNT = 20;
    PaintUnit[] bulletPaint = new PaintUnit[BULLET_MAX_COUNT];
    final int BUL_DIR_LIFT = 0;
    final int BUL_DIR_RIGHT = 1;
    final int BUL_DIR_DOWN = 3;
    /**
     * 子弹状态
     */
    final int BUL_STATE_ACTOR = 0;//主角的
    final int BUL_STATE_ENEMY= 1;//敌兵1的
     final int BUL_STATE_ENEMY1= 2;//敌兵2的
    final int BUL_STATE_DEAD = 3;//消失
    /**
     * 动作id
     */
    final int[] BUL_ACT_ID = {23, 21,21,1};
    final int[] BUL_ACT_FRAME_COUNT = {-1, -1};
//    //将类转换成一个数组就醒了
    final int BUL_X = 0;
    final int BUL_Y = 1;
    final int BUL_DIR = 2;
    final int BUL_SPEED_X = 3;
    final int BUL_SPEED_Y = 4;
    final int BUL_KIND = 5;
    final int BUL_COUNT = 6;
    final int BUL_DATA_LEN = 7;
    /**
     * 子弹数据
     */
    private int[][] bullet = new int[BULLET_MAX_COUNT][BUL_DATA_LEN];
    private int[] bulletData = {0, 0, 0, 0, 0, 0, 0};
    /**
     * 子弹当前数量
     */
    private int bulletCount = 0;
    
    //*****************路障数据**************************//
    final int STOP_MAX_COUNT = 100;
    PaintUnit[] stopPaint = new PaintUnit[STOP_MAX_COUNT];
    
    /**
     * 路障状态
     */
    final int STOP_STATE_HARD = 0;//坚硬的
    final int STOP_STATE_BROKEN = 1;//破碎的
    final int STOP_STATE_DEAD = 2;//消失
    /**
     * 动作id
     */
    final int[] STOP_ACT_ID = {0, 1, 0};
    final int[] STOP_ACT_FRAME_COUNT = {-1, 7, -1};

//将类转换成一个数组就醒了
    final int STOP_X = 0;
    final int STOP_Y = 1;
    final int STOP_SPEED = 2;
    final int STOP_STATE = 3;
    final int STOP_COUNT = 4;
    final int STOP_DATA_LEN = 5;
    /**
     * 子弹数据
     */
    private int[][] stop = new int[STOP_MAX_COUNT][STOP_DATA_LEN];
    private int[] stopData = {0, 0, 0, 0,0};
    /**
     * 路障当前数量
     */
    private int stopCount = 0;
    private byte keyPadCode;
    final int STATE_CIKE = 2;
    private boolean actorDead;
            
    public FlyGameControlHorse() {
        SCREEN_WIDTH = Page.SCREEN_WIDTH;
        SCREEN_HEIGHT = Page.SCREEN_HEIGHT;
        keyMgr = new KeyManager();
        dlg = new Dialog();
        dlg.lsnr = this;
        loadGameImage();
        setGameState(STATE_NO);
    }

    /**
     * 设置游戏的状态,STATE_CIKE是小游戏第二种
     */
    public void setGameState(int kind) {
        gameState = kind;
        if (kind == STATE_NO) {
            MusicPlayer.getInstance().reload("zhaoze.ogg", true);
            init();
            loadEnemyImage();
            return;
        } else if (kind == STATE_CIKE) {
            changeEnemy();
            return;
        }
    }

    private void init() {
        actorX = SCREEN_WIDTH >> 1;
        actorY = SCREEN_HEIGHT + GamePage.ACTOR_STATE_HEIGHT;
        enemy = new int[ENEMY_MAX_COUNT][ENEMY_DATA_LEN];
        enemyCount = 0;
        bullet = new int[BULLET_MAX_COUNT][BUL_DATA_LEN];
        bulletCount = 0;
        stop = new int[STOP_MAX_COUNT][STOP_DATA_LEN];
        stopCount = 0;
        hurtData = new int[ENEMY_MAX_COUNT];
        allEnemyCount = 0;
        endTime = 0;
        backGroundY = GameContext.map.height - SCREEN_HEIGHT;
    }
    //虚拟按键相关图片
    Image imgState;
    Image imgHpLine;
    Image imgLvNum;
    Image imgKeypadDir;
    Image imgKeypadDirPressed;
    Image imgKeypadFire;
    Image imgKeypadFirePressed;
    Image imgKeypadFireBack;

    private void loadGameImage() {
        ImageManager imgMgr = ImageManager.getInstance();
        imgState = imgMgr.getImage((short) 250);
        imgHpLine = imgMgr.getImage((short) 247);
        imgLvNum = imgMgr.getImage((short) 264);
        imgKeypadDir = imgMgr.getImage((short) 252);
        imgKeypadDirPressed = imgMgr.getImage((short) 251);
        imgKeypadFire = imgMgr.getImage((short) 253);
        imgKeypadFirePressed = imgMgr.getImage((short) 254);
        imgKeypadFireBack = imgMgr.getImage((short) 255);
        try {
            final short ACTOR_ID = 96;
            AnimationManager.getInstance().getAnimation(ACTOR_ID, actor);
            actor.actId = ACTOR_ACT_ID_STAND;
            actor.initFrame();
        } catch (Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    /**
     * 读取飞行射击资源
     */
    private void loadEnemyImage() {
        try {
            final short ENEMY_ID = 96;
            for (int index = 0; index < ENEMY_MAX_COUNT; index++) {
                enemyPaint[index] = new PaintUnit();
                AnimationManager.getInstance().getAnimation(ENEMY_ID, enemyPaint[index]);
                enemyPaint[index].actId = 0;
                enemyPaint[index].initFrame();
            }
            for (int index = 0; index < BULLET_MAX_COUNT; index++) {
                bulletPaint[index] = new PaintUnit();
                AnimationManager.getInstance().getAnimation(ENEMY_ID, bulletPaint[index]);
                bulletPaint[index].actId = 0;
                bulletPaint[index].initFrame();
            }
            final short STOP_ID = 137;
            for (int index = 0; index < STOP_MAX_COUNT; index++) {
                stopPaint[index] = new PaintUnit();
                AnimationManager.getInstance().getAnimation(STOP_ID, stopPaint[index]);
                stopPaint[index].actId = 0;
                stopPaint[index].initFrame();
            }

            final short HURT_ID = 86;
            AnimationManager.getInstance().getAnimation(HURT_ID, hurtPaint);
            hurtPaint.actId = 0;
            hurtPaint.initFrame();
        } catch (Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    public void removeImage() {
        for (int index = 0; index < ENEMY_MAX_COUNT; index++) {
            enemyPaint[index].releaseImages();
        }
        for (int index = 0; index < BULLET_MAX_COUNT; index++) {
            bulletPaint[index].releaseImages();
        }
        for (int index = 0; index < STOP_MAX_COUNT; index++) {
            stopPaint[index].releaseImages();
        }
        hurtPaint.releaseImages();
        deadPaint.releaseImages();
        actor.releaseImages();
        ImageManager imgMgr = ImageManager.getInstance();
        imgMgr.removeImage(imgState);
        imgMgr.removeImage(imgHpLine);
        imgMgr.removeImage(imgLvNum);
        imgMgr.removeImage(imgKeypadDir);
        imgMgr.removeImage(imgKeypadDirPressed);
        imgMgr.removeImage(imgKeypadFire);
        imgMgr.removeImage(imgKeypadFirePressed);
        imgMgr.removeImage(imgKeypadFireBack);
        
        imgState = null;
        imgHpLine = null;
        imgLvNum = null;
        imgKeypadDir = null;
        imgKeypadDirPressed = null;
        imgKeypadFire = null;
        imgKeypadFirePressed = null;
        imgKeypadFireBack = null;
    }

    private void removeBullet(int[][] data, int bulletIndex) {
        data[bulletIndex] = data[bulletCount - 1];
        setBulletState(bulletIndex, data[bulletCount - 1][BUL_KIND]);
        setBulletState(bulletCount - 1, BUL_STATE_DEAD);
        data[bulletCount - 1] = null;
        data[bulletCount - 1] = new int[]{0, 0, 0, 0, 0, 0, 0};
        bulletCount--;
    }

    public void keyPressed(int keyCode) {
        if (dlg.isAvailable()) {
            dlg.keyPressed(keyCode);
            keyCode = 0;
            return;
        }
        //#if SMS == 1
        if (GameContext.sms != null && GameContext.sms.isShowing()) {
            GameContext.sms.keyPressed(keyCode);
            keyCode = 0;
            return;
        }
        //#endif
        this.keyCode = keyCode;
    }

    public void keyReleased(int keyCode) {
        if (dlg.isAvailable()) {
            dlg.keyPressed(keyCode);
            this.keyCode = 0;
            return;
        }
        if (keyCode == Keys.KEY_FIRE || keyCode == Keys.KEY_NUM5) {
            if (actor.actId == ACTOR_ACT_ID_STAND) {
                actor.actId = ACTOR_ACT_ID_ATTACK1;
                actor.initFrame();
            }
        }
        this.keyCode = 0;
    }

    public void paint(Graphics g) {
        input();
        logicBack();
        //#if SMS == 1
//删除        if(!dlg.isAvailable() && !GameContext.sms.isShowing() && !GameContext.page.menuView.isTalk && !GameContext.page.isGameOver)
        //#else
//#         if(!dlg.isAvailable() && !GameContext.page.menuView.isTalk && !GameContext.page.isGameOver)
        //#endif
        {
            logic();
        }
        drawBack(g);

        //#if PRINTDEBUG > 1
//#         g.setColor(0xff0000);
//#         g.drawRect(actorBody.xmin, actorBody.ymin, actorBody.xmax - actorBody.xmin, actorBody.ymax - actorBody.ymin);
//#         g.setColor(0xff00ff);
//#         g.drawRect(actorAttack.xmin, actorAttack.ymin, actorAttack.xmax - actorAttack.xmin, actorAttack.ymax - actorAttack.ymin);
//#
//#         for (int index = 0; index < enemyCount; index++) {
//#             int x = enemy[index][POS_X];
//#             int y = enemy[index][POS_Y];
//#             Rect enemyBox = new Rect();
//#             enemyPaint[index].getBodyBox(enemyBox);
//#             enemyBox.offset(x, y);
//#
//#             Rect enemyAttackBox = new Rect();
//#             enemyPaint[index].getAttackBox(enemyAttackBox);
//#             enemyAttackBox.offset(x, y);
//#
//#             g.setColor(0xff0000);
//#             g.drawRect(enemyBox.xmin, enemyBox.ymin, enemyBox.xmax - enemyBox.xmin, enemyBox.ymax - enemyBox.ymin);
//#             g.setColor(0xff00ff);
//#             g.drawRect(enemyAttackBox.xmin, enemyAttackBox.ymin, enemyAttackBox.xmax - enemyAttackBox.xmin, enemyAttackBox.ymax - enemyAttackBox.ymin);
//#         }
        //#endif
        drawRole(g);
        drawActorState(g);
        drawKeypad(g);
        //#if SMS == 1
        if (GameContext.sms.isShowing()) {
            GameContext.sms.paint(g);
            GameContext.sms.update();
        }
        //#endif
        if (dlg.isAvailable()) {
            dlg.update();
            dlg.paint(g);
        }
        if (GameContext.page.dlg.isAvailable()) {
            GameContext.page.dlg.update();
        }
    }

    private void input() {
        switch (keyCode) {
            case Keys.KEY_NUM4:
            case Keys.KEY_LEFT:
                doLeft();
                break;
            case Keys.KEY_NUM6:
            case Keys.KEY_RIGHT:
                doRight();
                break;
            case Keys.KEY_NUM2:
            case Keys.KEY_UP:
                doUp();
                break;
            case Keys.KEY_NUM8:
            case Keys.KEY_DOWN:
                doDown();
                break;
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                if (actor.actId == ACTOR_ACT_ID_STAND) {
                    actor.actId = ACTOR_ACT_ID_ATTACK1;
                    actor.initFrame();
                }
                break;
        }
    }

    private void doDown() {
        actorDir = 1;
        if (actorY < SCREEN_HEIGHT - ACTOR_SPEED_Y) {
            actorY += ACTOR_SPEED_Y;
        }
    }

    private void doLeft() {
        actorDir = 2;
        if (actorX > ROAD_X + ACTOR_SPEED_X) {
            actorX -= ACTOR_SPEED_X;
        }
    }
    final int ROAD_WIDTH = 360;
    final int ROAD_X = backGroundX + 136;

    private void doRight() {
        actorDir = 3;
        if (actorX < ROAD_WIDTH + backGroundX - ACTOR_SPEED_X) {
            actorX += ACTOR_SPEED_X;
        }
    }

    private void doUp() {
        actorDir = 0;
        if (actorY > (GamePage.ACTOR_STATE_HEIGHT << 1) + ACTOR_SPEED_Y) {
            actorY -= ACTOR_SPEED_Y;
        }
    }

    private void drawBack(Graphics g) {
        GameContext.page.drawMap(g, - backGroundX, backGroundY);
        GameContext.undergroundMat.paint(g, - backGroundX, backGroundY);
        GameContext.groundMat.paint(g, - backGroundX, backGroundY);
        GameContext.flyMat.paint(g, - backGroundX, backGroundY);
    }

    private void logicBack() {
        backGroundY -= 16;
        if (backGroundY < 0) {
            backGroundY = GameContext.map.height - SCREEN_HEIGHT - 48;
        }
    }

    private void logic() {
        //没有开始游戏的时候不运行逻辑
        if (endTime >= END_TIME) {
            if (GameContext.page.script != null) {
                GameContext.setVar(ScriptEngine.PLAY_GAME_END, 1);
                 GameContext.page.script.remind(300, 0, null);
                GameContext.page.script = null;
            }
            return;
        }
        updataEnemy();
        updataBullet();
        updataStop();

     
        addAllEnemy();
        
        actor.getBodyBox(actorBody);
        actorBody.offset(actorX, actorY);
        actor.getAttackBox(actorAttack);
        actorAttack.offset(actorX, actorY);
        detectCollision();
        canMove();
        actorDeadLogic();
//删除        GameContext.actor.curHp[0] = GameContext.actor.hp;
//删除        GameContext.actor.addHp();
        if (actorY > SCREEN_HEIGHT - ACTOR_SPEED_Y) {
            actorY = SCREEN_HEIGHT - 50;
        }
        if (!dlg.isAvailable() && !GameContext.sms.isShowing() && !GameContext.page.isGameOver) {
            endTime++;
        }
        if (endTime % 12 == 0) {//1.2秒播放一次
            playSound();
        }
    }

    public void detectCollision() {
        for (int bulIndex = 0; bulIndex < bulletCount; bulIndex++) {
            int bulletX = bullet[bulIndex][BUL_X];
            int bulletY = bullet[bulIndex][BUL_Y];
            Rect bulletBox = new Rect();
            bulletPaint[bulIndex].getAttackBox(bulletBox);
            bulletBox.offset(bulletX, bulletY);
            actorBeatEnemy(bulIndex, bulletBox);
            enemyBeatActor(bulIndex, bulletBox);
        }
        stopCollision();
    }

    private void actorBeatEnemy(int bulIndex, Rect bulletBox) {
        if (bullet[bulIndex][BUL_KIND] == BUL_STATE_ACTOR) {
            for (int index = 0; index < enemyCount; index++) {
                int x = enemy[index][POS_X];
                int y = enemy[index][POS_Y];
                Rect enemyBox = new Rect();
                enemyPaint[index].getBodyBox(enemyBox);
                enemyBox.offset(x, y);
                if ((enemy[index][STATE] == ENEMY_STATE_DEAD) || (enemy[index][STATE] == ENEMY_STATE_HURT)) {
                    continue;
                }
                if (bulletBox.testIntersect(enemyBox)) {
                    removeBullet(bullet, bulIndex);
                    setEnemyState(index, ENEMY_STATE_HURT);
                    hurtData[index] = 3;
                }
            }
        }
    }

    private void enemyBeatActor(int bulIndex, Rect bulletBox) {
        if (GameContext.actor.isSuper) {
            return;
        }
        if ((bullet[bulIndex][BUL_KIND] == BUL_STATE_ENEMY) || (bullet[bulIndex][BUL_KIND] == BUL_STATE_ENEMY1)) {
            if ((actor.actId == ACTOR_ACT_ID_HURT) || (actor.actId == ACTOR_ACT_ID_DEAD)) {
                return;
            }
            if (bulletBox.testIntersect(actorBody)) {
                int loseActorHp = enemyAp - actorDp;
                if ((loseActorHp > 0 && GameContext.actor.hp > 0)) {
                    GameContext.actor.hp -= loseActorHp;
                    if (GameContext.actor.hp < 0) {
                        GameContext.actor.hp = 0;
                    }
                    if (actor.actId != ACTOR_ACT_ID_HURT) {
                        actor.actId = ACTOR_ACT_ID_HURT;
                        actor.initFrame();
                    }
                }
                removeBullet(bullet, bulIndex);
            }
        }
    }

    private void stopCollision() {
        for (int stopIndex = 0; stopIndex < stopCount; stopIndex++) {
            int stopX = stop[stopIndex][STOP_X];
            int stopY = stop[stopIndex][STOP_Y];
            Rect stopBox = new Rect();
            stopPaint[stopIndex].getAttackBox(stopBox);
            stopBox.offset(stopX, stopY);
            if ((actor.actId == ACTOR_ACT_ID_HURT) || (actor.actId == ACTOR_ACT_ID_DEAD)) {
                return;
            }
            if ((stop[stopIndex][STOP_STATE] == STOP_STATE_BROKEN) || (stop[stopIndex][STOP_STATE] == STOP_STATE_DEAD)) {
                continue;
            }
            if (actorBody.testIntersect(stopBox)) {
                int loseActorHp = enemyAp - actorDp;
                if (loseActorHp > 0) {
                    GameContext.actor.hp -= loseActorHp;
                    if (actor.actId != ACTOR_ACT_ID_HURT) {
                        actor.actId = ACTOR_ACT_ID_HURT;
                        actor.initFrame();
                    }
                }
                setStopState(stopIndex, STOP_STATE_BROKEN);
            }

        }
    }

    final int HALF_BOX = 16;
    final int BOX_HEIGHT = 24;

    private void canMove() {
        Rect actorBox = new Rect();
        actorBox.set(actorX - HALF_BOX, actorY - BOX_HEIGHT, actorX + HALF_BOX, actorY + BOX_HEIGHT);
        actorBox.offset(actorX, actorY);
        for (int index = 0; index < enemyCount; index++) {
            int x = enemy[index][POS_X];
            int y = enemy[index][POS_Y];
            Rect enemyBox = new Rect();
            enemyBox.set(x - HALF_BOX, y - BOX_HEIGHT, x + HALF_BOX, y + BOX_HEIGHT);
            enemyBox.offset(x, y);
            if (actorBox.testIntersect(enemyBox)) {
                if (actorDir == 0) {
                    actorY += ACTOR_SPEED_Y;
                }
                else if(actorDir == 1) {
                    actorY -= ACTOR_SPEED_Y;
                }
                else if(actorDir == 2) {
                    actorX += ACTOR_SPEED_X;
                }
                else {
                    actorX -= ACTOR_SPEED_X;
                }
            }
        }
    }
        
/**
 * 添加一个敌人
 * @param kind=是什么人发射的子弹
 */
    private void addEnemy(int kind, int enemyX) {
        System.arraycopy(enemyData, 0, enemy[enemyCount], 0, ENEMY_DATA_LEN);
        enemy[enemyCount][POS_X] = enemyX;
        enemy[enemyCount][POS_Y] = 0;
        enemy[enemyCount][KIND] = kind;
        setEnemyState(enemyCount, ENEMY_STATE_TRACK);
        enemyCount++;
    }

    private int allEnemyCount = 0;
    private int endTime = 0;//计数器
    
    private int[] allEnemyX = new int[]{152,216,280,344,184,312,248,
   152,344,280,216,152,216,280,344,152,216,280,344,280,216,216,152,152,216,280,360,152,280,344,184,248,312,216,296,
   184,152,216,280,312,216,280,344,216,280,184,248,312};
    private int[] allEnemyList = new int[]{0,20,40,60,80,110,130,
    220,230,240,250,300,300,300,300,380,380,390,390,400,400,410,410,420,430,430,430,440,440,440,460,460,460,500,500,
    530,580,580,580,630,670,700,700,740,740,770,770,770};
    private int[] allEnemyKind = new int[]{2,2,2,2,0,0,0,
    3,3,3,3,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,2,2,
    2,1,1,1,0,1,1,1,0,0,0,0,0};

    public void changeEnemy() {
        END_TIME = 1200;
        ENEMY_ACT_ID = new int[]{10, 14, 10, 15, 25, 20, 10};
        allEnemyX = new int[]{200, 296, 312, 184, 152, 248, 344, 216, 280, 184, 312, 200, 296, 152, 216, 280, 344,
                    152, 216, 280, 344, 216, 280, 152, 344, 216, 296, 216, 344, 152, 280, 152, 216, 344, 152, 280, 344, 216, 280, 344, 152, 216, 280,
                    152, 216, 280, 296, 200, 216, 280, 344, 184, 328, 152, 216, 280, 344, 184, 248, 312, 216, 280, 168, 232, 296, 200, 264, 328};
        allEnemyList = new int[]{0, 40, 60, 80, 120, 120, 120, 180, 180, 230, 230, 280, 280, 350, 350, 350, 350,
                    420, 420, 430, 430, 440, 440, 450, 450, 470, 480, 490, 490, 500, 500, 510, 510, 510, 520, 520, 520, 530, 530, 530, 550, 550, 550,
                    580, 580, 580, 640, 640, 680, 680, 680, 700, 700, 750, 750, 750, 750, 800, 800, 800, 850, 850, 900, 930, 960, 990, 1020,1050};
        allEnemyKind = new int[]{2, 2, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 0, 1, 1, 1, 1,
                    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
                    1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0,};
    }
    
    private void addAllEnemy() {       
        if (allEnemyCount == allEnemyList.length) {
            return;
        }
        if ((endTime > allEnemyList[allEnemyCount]) || (endTime == allEnemyList[allEnemyCount])) {
            if (allEnemyKind[allEnemyCount] == 3) {
                addStop(allEnemyX[allEnemyCount] + backGroundX);
            } else {
                addEnemy(allEnemyKind[allEnemyCount], allEnemyX[allEnemyCount] + backGroundX);
            }
            allEnemyCount++;
        }
    }
/**
 *
 * @param state=什么类型的子弹
 * @param enemydata=敌兵的位置
 */
    private void addBullet(int state, int[] enemydata) {
        System.arraycopy(bulletData, 0, bullet[bulletCount], 0, BUL_DATA_LEN);
        if (state == BUL_STATE_ACTOR) {
            bullet[bulletCount][BUL_X] = actorX;
            bullet[bulletCount][BUL_Y] = actorY - 130;
            bullet[bulletCount][BUL_DIR] = BUL_DIR_DOWN;
            setBulletState(bulletCount, BUL_STATE_ACTOR);
        } else if (state == BUL_STATE_ENEMY) {
            bullet[bulletCount][BUL_X] = enemydata[POS_X];
            bullet[bulletCount][BUL_Y] = enemydata[POS_Y] - 50;
            bullet[bulletCount][BUL_DIR] = BUL_DIR_DOWN;
            setBulletState(bulletCount, BUL_STATE_ENEMY);
        } else if (state == BUL_STATE_ENEMY1) {
            bullet[bulletCount][BUL_X] = enemydata[POS_X];
            bullet[bulletCount][BUL_Y] = enemydata[POS_Y] - 50;
            bullet[bulletCount][BUL_DIR] = (bullet[bulletCount][BUL_X] > actorX) ? BUL_DIR_LIFT : BUL_DIR_RIGHT;
            bullet[bulletCount][BUL_SPEED_X] = (Math.abs(bullet[bulletCount][BUL_X] - actorX) / ((actorY - bullet[bulletCount][BUL_Y]) /15));
            setBulletState(bulletCount, BUL_STATE_ENEMY1);
        }
        bulletCount++;
    }

    private void addStop(int stopX) {
        System.arraycopy(stopData, 0, stop[stopCount], 0, STOP_DATA_LEN);
        stop[stopCount][STOP_X] = stopX;
        stop[stopCount][STOP_Y] = -50;
        setStopState(stopCount, STOP_STATE_HARD);
        stopCount++;
    }

    /**
     * 排序并绘制主角和敌人
     * enemyCount 当前敌人数量
     */
    private void drawRole(Graphics g) {
        for (int stopIndex = 0; stopIndex < stopCount; stopIndex++) {
            drawStop(g, stop[stopIndex], stopIndex);
        }

        int[] enemyYRank = new int[enemyCount];
        enemyYRank[0] = 0;
        int rankCnt = 1;
        for (int index = 1; index < enemyCount; index++) {
            boolean isChange = false;
            int curEnemyY = enemy[index][POS_Y];
            for (int rankIndex = 0; rankIndex < rankCnt; rankIndex++) {
                int y = enemy[enemyYRank[rankIndex]][POS_Y];//第一个Role的Y
                if (curEnemyY < y) {
                    int[] temp = new int[rankCnt - rankIndex];
                    System.arraycopy(enemyYRank, rankIndex, temp, 0, rankCnt - rankIndex);
                    enemyYRank[rankIndex] = index;
                    System.arraycopy(temp, 0, enemyYRank, rankIndex + 1, temp.length);
                    isChange = true;
                    break;
                }
            }
            if (!isChange) {
                enemyYRank[rankCnt] = index;
            }
            rankCnt++;
        }

        int drawIndex = 0;
        for (; drawIndex < enemyCount; drawIndex++) {
            int enemyIndex = enemyYRank[drawIndex];
            if (enemy[enemyIndex][POS_Y] >= actorY) {
                break;
            }
            drawEnemy(g, enemy[enemyIndex], enemyIndex);
        }
        drawActor(g);
        for (; drawIndex < enemyCount; drawIndex++) {
            int enemyIndex = enemyYRank[drawIndex];
            drawEnemy(g, enemy[enemyIndex], enemyIndex);
        }
        for (int bulIndex = 0; bulIndex < bulletCount; bulIndex++) {
            drawBullet(g, bullet[bulIndex], bulIndex);
        }
    }

    /**
     * 渲染主角
     * @param g
     */
    private void drawActor(Graphics g) {
        actor.paint(g, -actorX, -actorY);
        updataActor();
        //#if SMS == 1
        if (GameContext.actor.isSuper && !GameContext.sms.isShowing() && !dlg.isAvailable())
       //#else
//#     if (GameContext.actor.isSuper && !dlg.isAvailable())
        //#endif
        {
            MainCanvas.currentFrame++;
            System.out.println("MainCanvas.currentFrame="+MainCanvas.currentFrame);
            if (MainCanvas.currentFrame - GameContext.actor.superStartTime >= GameContext.actor.superDuration) {
                System.out.println("无敌结束");
                GameContext.actor.isSuper = false;
                GameContext.actor.superStartTime = 0;
                GameContext.actor.superDuration = 0;
            }
        }
    }
    
    private int actorCont = 0;

    private void updataActor() {
        //更新主角动画
        if (actor.actId == ACTOR_ACT_ID_ATTACK1) {
            actorCont++;
            if (actorCont == 3) {
                addBullet(BUL_STATE_ACTOR, null);
                actorCont = 0;
            }
        }
        if (!actor.isEndAnimation()) {
            actor.playNextFrame();
            return;
        }
        actor.actId = ACTOR_ACT_ID_STAND;
        actor.initFrame();
    }

    private void drawEnemy(Graphics g, int[] data, int enemyIndex) {
        if (data[STATE] == ENEMY_STATE_DELETE) {
            return;
        }
        int x = data[POS_X];
        int y = data[POS_Y];
        enemyPaint[enemyIndex].paint(g, -x, -y);
        data[COUNT]++;
        if (enemyPaint[enemyIndex].isEndAnimation()) {
            enemyPaint[enemyIndex].resetFrame();
            return;
        }
        enemyPaint[enemyIndex].playNextFrame();
//        每个敌兵都有3帧，被攻击时大于零，减完收工
        if (hurtData[enemyIndex] > 0) {
            hurtPaint.ani.drawFrame(g, 0, 3 - hurtData[enemyIndex], x, y - 30, hurtPaint);
            hurtData[enemyIndex]--;
        }
    }

    private void drawBullet(Graphics g, int[] data, int bulletIndex) {
        int state = data[BUL_KIND];
        int x = data[BUL_X];
        int y = data[BUL_Y];
        if (state == BUL_STATE_DEAD) {
            return;
        }
        bulletPaint[bulletIndex].paint(g, -x, -y);

////        攻击框
//        g.setColor(0xFF0000);
//        Rect bulletBox = new Rect();
//        bulletPaint[bulletIndex].getAttackBox(bulletBox);
//        bulletBox.offset(x, y);
//        g.drawRect(x - 4, y - 10, bulletBox.getWidth(), bulletBox.getHeight());
    }

    private void drawStop(Graphics g, int[] data, int stopIndex) {
        int state = data[STOP_STATE];
        int x = data[STOP_X];
        int y = data[STOP_Y];
        data[STOP_COUNT]++;
        if (state == STOP_STATE_DEAD) {
            return;
        }
        stopPaint[stopIndex].paint(g, -x, -y);
        if (stopPaint[stopIndex].isEndAnimation()) {
            stopPaint[stopIndex].resetFrame();
            return;
        }
        stopPaint[stopIndex].playNextFrame();
    }

    private void drawActorState(Graphics g) {

        final int STATE_X = 1;
        int STATE_Y = 0;

        int actorX = GameContext.actor.x - GameContext.page.offsetX;
        int actorY = GameContext.actor.y - GameContext.page.offsetY - 30;

        g.drawImage(imgState, STATE_X, STATE_Y, 0);

        int actorLv = GameContext.actor.getLevel();
        int lvCnt = Util.getNumberSize(actorLv);
        final int[] LV_OFF_X = {57, 59, 61};
        final int LV_Y = STATE_Y + 54;
        final int LV_NUM_W = imgLvNum.getWidth();
        final int LV_NUM_H = imgLvNum.getHeight() / 10;
        Util.drawNumbersAlignRight(g, actorLv, imgLvNum, LV_NUM_W, LV_NUM_H, 0, LV_OFF_X[lvCnt - 1] + STATE_X, LV_Y);

        final int HP_X = STATE_X + 53;
        final int HP_Y = STATE_Y + 17;
        final int HP_MAX_LEN = imgHpLine.getWidth();
        if (GameContext.actor.hp > 0) {
            int hpLen = GameContext.actor.hp * HP_MAX_LEN / GameContext.actor.maxHp;
            Util.drawClipImage(g, imgHpLine, HP_X, HP_Y, 0, 0, hpLen, imgHpLine.getHeight());
        }
    }

    /**
     * 绘制虚拟键盘（方向键和确定键）
     */
    boolean keypadDraw = true;
    int keypadDrawFrame = 0;
    public void drawKeypad(Graphics g) {
        if (!keypadDraw && keypadDrawFrame > 0) {
            keypadDrawFrame--;
        }
        else if (keypadDraw && keypadDrawFrame < 3) {
            keypadDrawFrame++;
        }
        if (keypadDrawFrame == 0) {
            return;
        }
        final int OFFSET = (keypadDrawFrame == 1) ? 45 : 0;

        //方向键
        final int KEYPAD_DIR_X = 90 - OFFSET;
        final int KEYPAD_DIR_Y = SCREEN_HEIGHT - 72;
        final int KEYPAD_BACK_R = 42;
        Image imgDir = keyPadCode == Keys.MASK_UP ? imgKeypadDirPressed : imgKeypadDir;
        g.drawImage(imgDir, KEYPAD_DIR_X - (imgDir.getWidth() >> 1), KEYPAD_DIR_Y - KEYPAD_BACK_R, Graphics.LEFT | Graphics.BOTTOM);
        imgDir = keyPadCode == Keys.MASK_DOWN ? imgKeypadDirPressed : imgKeypadDir;
        Util.drawRegion(g, imgDir, 0, 0, imgDir.getWidth(), imgDir.getHeight(), Sprite.TRANS_ROT180, KEYPAD_DIR_X - (imgDir.getWidth() >> 1), KEYPAD_DIR_Y + KEYPAD_BACK_R, 0);
        imgDir = keyPadCode == Keys.MASK_RIGHT ? imgKeypadDirPressed : imgKeypadDir;
        Util.drawRegion(g, imgDir, 0, 0, imgDir.getWidth(), imgDir.getHeight(), Sprite.TRANS_ROT90, KEYPAD_DIR_X + KEYPAD_BACK_R, KEYPAD_DIR_Y - (imgDir.getWidth() >> 1), 0);
        imgDir = keyPadCode == Keys.MASK_LEFT ? imgKeypadDirPressed : imgKeypadDir;
        Util.drawRegion(g, imgDir, 0, 0, imgDir.getWidth(), imgDir.getHeight(), Sprite.TRANS_ROT270, KEYPAD_DIR_X - KEYPAD_BACK_R, KEYPAD_DIR_Y - (imgDir.getWidth() >> 1), Graphics.RIGHT | Graphics.TOP);

        //确定键
        final int KEYPAD_FIRE_X = SCREEN_WIDTH - 75 + OFFSET;
        final int KEYPAD_FIRE_Y = SCREEN_HEIGHT - 55;
        final int KEYPAD_ANCHOR = Graphics.HCENTER | Graphics.VCENTER;
        g.drawImage(imgKeypadFireBack, KEYPAD_FIRE_X, KEYPAD_FIRE_Y, KEYPAD_ANCHOR);
        if (keyPadCode == Keys.MASK_FIRE) {
            g.drawImage(imgKeypadFirePressed, KEYPAD_FIRE_X, KEYPAD_FIRE_Y, KEYPAD_ANCHOR);
        }
        else {
            g.drawImage(imgKeypadFire, KEYPAD_FIRE_X, KEYPAD_FIRE_Y, KEYPAD_ANCHOR);
        }
    }

    private void updataStop() {
        for (int index = 0; index < stopCount; index++) {
            updataStop(stop[index], index);
        }
    }

    private void updataStop(int[] data, int stopIndex) {
        int state = data[STOP_STATE];
        data[STOP_SPEED] = 16;
        if (state == STOP_STATE_DEAD) {
            return;
        }
        data[STOP_Y] += data[STOP_SPEED];
        if (state == STOP_STATE_BROKEN) {
            if (data[STOP_COUNT] < STOP_ACT_FRAME_COUNT[state]) {
                return;
            }
            setStopState(stopIndex, STOP_STATE_DEAD);
        }
        if (data[STOP_Y] > SCREEN_HEIGHT + 48) {
            setStopState(stopIndex, STOP_STATE_DEAD);
        }
    }

    /**
     * 刷新子弹
     *
     */
    private void updataBullet() {
        for (int index = 0; index < bulletCount; index++) {
            updataBullet(bullet[index], index);
        }
    }

    private void updataBullet(int[] data, int bulletIndex) {
        int state = data[BUL_KIND];
        data[BUL_SPEED_Y] = 10;
        data[BUL_SPEED_Y] += 6;
        if (state == BUL_STATE_DEAD) {
            return;
        }
        if (state == BUL_STATE_ACTOR) {
            data[BUL_Y] -= data[BUL_SPEED_Y];
        } else if (state == BUL_STATE_ENEMY) {
            data[BUL_Y] += data[BUL_SPEED_Y];
        } else if (state == BUL_STATE_ENEMY1) {
            data[BUL_Y] += data[BUL_SPEED_Y];
            if (data[BUL_Y] < actorY) {
                if (data[BUL_DIR] == BUL_DIR_LIFT) {
                    data[BUL_X] -= data[BUL_SPEED_X];
                } else if (data[BUL_DIR] == BUL_DIR_RIGHT) {
                    data[BUL_X] += data[BUL_SPEED_X];
                }
            }
        }
        if (data[BUL_Y] > SCREEN_HEIGHT + 50 || data[BUL_Y] < 0 - 32) {
            removeBullet(bullet, bulletIndex);
        }
    }

    private void updataEnemy() {
        for (int index = 0; index < enemyCount; index++) {
            if (enemy[index][STATE] == ENEMY_STATE_DELETE) {    
                continue;
            }
            updataEnemy(enemy[index], index);
        }
    }

    private void updataEnemy(int[] data, int enemyIndex) {
        int state = data[STATE];

        int x = data[POS_X];
        int y = data[POS_Y];
        data[POS_Y] += 3;
        /**
         * 跟踪状态
         */
        if (state == ENEMY_STATE_TRACK) {
            if (data[KIND] == 0) {
                if ((actorY - y) < 200) {
                    setEnemyState(enemyIndex, ENEMY_STATE_ATTACK);
                }
            } else if (data[KIND] == 1) {
                if (data[POS_Y] >= 80) {
                    setEnemyState(enemyIndex, ENEMY_STATE_ATTACK);
                }
            } else if (data[KIND] == 2) {
                if (data[POS_Y] > SCREEN_HEIGHT + 64) {
                    setEnemyState(enemyIndex, ENEMY_STATE_DELETE);
                }
            }
        } else if (state == ENEMY_STATE_ATTACK) {
            if (data[COUNT] < ENEMY_ACT_FRAME_COUNT[state]) {
                return;
            }
            setEnemyState(enemyIndex, ENEMY_STATE_FIRE);
        } else if (state == ENEMY_STATE_FIRE) {
            if (data[COUNT] < ENEMY_ACT_FRAME_COUNT[state] - 1) {
                return;
            }
            if (data[KIND] == 0) {
                addBullet(BUL_STATE_ENEMY1, data);
            } else if (data[KIND] == 1) {
                addBullet(BUL_STATE_ENEMY, data);
            }
            setEnemyState(enemyIndex, ENEMY_STATE_WAIT);
        } else if (state == ENEMY_STATE_HURT) {
            if (data[COUNT] < ENEMY_ACT_FRAME_COUNT[state]) {
                return;
            }
            setEnemyState(enemyIndex, ENEMY_STATE_DEAD);
        } else if (state == ENEMY_STATE_DEAD) {
            data[POS_Y] += 6;
            if ((data[POS_Y] < -16) || (data[POS_Y] > SCREEN_HEIGHT + 64)) {
                setEnemyState(enemyIndex, ENEMY_STATE_DELETE);
            }
        } else if (state == ENEMY_STATE_WAIT) {
            if (data[KIND] == 1) {
                data[POS_Y] -= 6;
                if (data[POS_Y] < -16) {
                    setEnemyState(enemyIndex, ENEMY_STATE_DELETE);
                }
            }
        }
    }

    private void setEnemyState(int enemyIndex, int state) {
        enemy[enemyIndex][STATE] = state;
        enemy[enemyIndex][COUNT] = 0;
        enemyPaint[enemyIndex].actId = (short) ENEMY_ACT_ID[state];
        enemyPaint[enemyIndex].initFrame();
    }

    private void setBulletState(int bulletIndex, int state) {
        if (state == BUL_STATE_DEAD) {
            return;
        }
        bullet[bulletIndex][BUL_KIND] = state;
        bulletPaint[bulletIndex].actId = (short) BUL_ACT_ID[state];
        bulletPaint[bulletIndex].initFrame();
    }

    private void setStopState(int stopIndex, int state) {
        stop[stopIndex][STOP_COUNT] = 0;
        stop[stopIndex][STOP_STATE] = state;
        stopPaint[stopIndex].actId = (short) STOP_ACT_ID[state];
        stopPaint[stopIndex].initFrame();
    }
    KeyManager keyMgr;
//#if POINT == 1

    public void pointerPressed(int px, int py) {
        if (GameContext.page.dlg.isAvailable()) {
            if (GameContext.page.dlg.pointerPressed(px, py)) {
                return;
            }
        }
        if (dlg.isAvailable()) {
            if (dlg.pointerPressed(px, py)) {
                return;
            }
        }
        if (GameContext.sms != null && GameContext.sms.isShowing()) {
            GameContext.sms.pointerPressed(px, py);
            return;
        }

        //确定键
        final int KEYPAD_FIRE_W = imgKeypadFireBack.getWidth() + 10;
        final int KEYPAD_FIRE_X = SCREEN_WIDTH - 75 - (KEYPAD_FIRE_W >> 1);
        final int KEYPAD_FIRE_Y = SCREEN_HEIGHT - 55 - (KEYPAD_FIRE_W >> 1);
        if (GameContext.point(px, py, KEYPAD_FIRE_X, KEYPAD_FIRE_Y, KEYPAD_FIRE_W, KEYPAD_FIRE_W)) {
            keyMgr.resetKey();
            keyPadCode = Keys.MASK_FIRE;
            keyPressed(Keys.KEY_FIRE);
        }

        //方向键
        final int KEYPAD_DIR_W = 80;
        final int KEYPAD_CENTER_X = 90;
        final int KEYPAD_CENTER_Y = SCREEN_HEIGHT - 72;
        final int KEYPAD_LEFT_X = KEYPAD_CENTER_X - KEYPAD_DIR_W;
        final int KEYPAD_RIGHT_X = KEYPAD_CENTER_X + KEYPAD_DIR_W;
        final int KEYPAD_TOP_Y = KEYPAD_CENTER_Y - KEYPAD_DIR_W;
        if (GameContext.point(px, py, KEYPAD_LEFT_X, KEYPAD_TOP_Y, KEYPAD_DIR_W << 1, KEYPAD_DIR_W << 1)) {

            if (px - KEYPAD_LEFT_X >= py - KEYPAD_TOP_Y && KEYPAD_RIGHT_X - px >= py - KEYPAD_TOP_Y) {
                keyMgr.resetKey();
                keyPadCode = Keys.MASK_UP;
                keyPressed(Keys.KEY_UP);
            } else if (px - KEYPAD_LEFT_X >= py - KEYPAD_TOP_Y) {
                keyMgr.resetKey();
                keyPadCode = Keys.MASK_RIGHT;
                keyPressed(Keys.KEY_RIGHT);
            } else if (px - KEYPAD_LEFT_X < py - KEYPAD_TOP_Y && KEYPAD_RIGHT_X - px >= py - KEYPAD_TOP_Y) {
                keyMgr.resetKey();
                keyPadCode = Keys.MASK_LEFT;
                keyPressed(Keys.KEY_LEFT);
            } else {
                keyMgr.resetKey();
                keyPadCode = Keys.MASK_DOWN;
                keyPressed(Keys.KEY_DOWN);
            }
        }
        //确定键
//        final int KEYPAD_FIRE_W = imgKeypadFireBack.getWidth() + 10;
//        final int KEYPAD_FIRE_X = 405 - (KEYPAD_FIRE_W >> 1);
//        final int KEYPAD_FIRE_Y = 217 - (KEYPAD_FIRE_W >> 1);
//        if (GameContext.point(px, py, KEYPAD_FIRE_X, KEYPAD_FIRE_Y, KEYPAD_FIRE_W, KEYPAD_FIRE_W)) {
//            keyMgr.resetKey();
////            keyCode = Keys.MASK_FIRE;
//            keyPressed(Keys.KEY_FIRE);
//        }

    }

    public void pointerReleased(int px, int py) {
        keyMgr.resetKey();
        this.keyCode = 0;
        keyPadCode = -1;
    }
    //#endif
    private void actorDeadLogic() {
        if (GameContext.sms.isShowing() || dlg.isAvailable()) {
            return;
        }
        if (GameContext.actor.hp <= 0) {
            final short BUY_LIFE = 132;
            dlg.btnBoxOp = Dialog.LIFE_OP;
            if (!Sms.allStory) {
                dlg.showButtonBox("您还未开启关卡，是否免费原地复活？".toCharArray());
            } else {
                if (GameContext.version == 2) {
                    dlg.showButtonBox("是否原地复活？需花费30000金钱".toCharArray());
                } else {
                    dlg.showButtonBox(StringManager.getInstance().getString(BUY_LIFE));
                }
            }
        }
    }

    public void doOkButtonFire() {
        switch (dlg.btnBoxOp) {
            case Dialog.LIFE_OP:
                MusicPlayer.getInstance().playSound(SoundConst.SYSCHOOSE);
                //#if SMS == 1
                if (!Sms.allStory) {
                    GameContext.actor.setActorSuper(50);
                    GameContext.actor.hp = GameContext.actor.maxHp;
                    GameContext.actor.status = RoleConst.STAND_STATUS;
                    GameContext.actor.changeAction();
                    return;
                }
                if (GameContext.page.sms != null) {
                    if (GameContext.version == 2) {
                        if (GameContext.actor.getMoney() < 30000) {
                            dlg.btnBoxOp = Dialog.BUY_MONEY_OP;
                            dlg.showButtonBox("金钱不足，是否购买金币？".toCharArray());
                        } else {
                            GameContext.addVar(EffortManager.EFFORT_BUY_RISE, 1);
                            GameContext.actor.loseMoney(30000);
                            GameContext.actor.setActorSuper(50);
                            GameContext.actor.hp = GameContext.actor.maxHp;
                            GameContext.actor.status = RoleConst.STAND_STATUS;
                            GameContext.actor.changeAction();
                        }
                    } else {
                        GameContext.page.sms.doChargeRequest(Sms.RISE_ID);
                    }
                }
                break;
            case Dialog.BUY_MONEY_OP:
                MusicPlayer.getInstance().playSound(SoundConst.SYSCHOOSE);
                if (GameContext.page.sms != null) {
                    GameContext.page.sms.doChargeRequest(4);
                }
                break;
        }
    }

    public void doReturnButtonFire() {
        switch (dlg.btnBoxOp) {
            case Dialog.LIFE_OP:
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                GameContext.actor.hp = GameContext.actor.maxHp;
                init();
                break;
            case Dialog.BUY_MONEY_OP:
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                break;
        }
    }

    public ScriptEngine getScript() {
        return null;
    }

    private void playSound() {
        MusicPlayer.getInstance().playSound(SoundConst.HORSESHOE);//马蹄声
    }

    public boolean pointerDragged(int startX, int startY, int endX, int endY) {
        if (GameContext.sms.isShowing()) {
            return GameContext.sms.pointerDragged(startX, startY, endX, endY);
        }
        return false;
    }
}
