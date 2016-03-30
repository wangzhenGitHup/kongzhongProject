/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;
//#if UPDATA == 1
//# import com.tencent.mbox.MBoxClient;
//# import com.tencent.mbox.cp.OppUserInfo;
//#endif
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.util.Hashtable;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class GamePage extends Page implements Runnable, BoxListener {
    /**
     * 是否是小游戏
     */
    public boolean isMiniGame;
    
    /**
     * 为了可以修改入口脚本名称
     */
//    public static String START_SCRIPT = "scene0_0";
      public static String START_SCRIPT = "scene1_6";
    //上边和左边的空间，这个空间只要还有可滚动的部分, 是不允许玩家走到的
    //单位为像素(便于在小屏上调控)
    public static final int X_SPACE = SCREEN_WIDTH / 3;
            
    //主角状态高度
    public static final int ACTOR_STATE_HEIGHT = 0;

    /**
     * 任务计时器
     */
    private int missionLimitCount;

    /**
     * 蒙版
     */
    private final int SCENE_MASK = 1;
    
    /**  
     *
     * 带有透明色的动画
     */
    private PaintUnit cartoonWithAlpha;
    private boolean isDrawCartoonWidthAlpha;
    private int startAlpha;
    private int endAlpha;
    
    KeyManager keyMgr;
    //按键事件序列化
    int keyCodes[] = new int[100];
    int startKey;
    //代表下一个需要填充的位置
    int endKey;
    /**
     * 是否显示购买等级
     */
    boolean isShowLvLimit;
    public Image imgTalkLine;
    public Image imgTalkPos;
    
    /**
     * 添加一个键盘操作
     * @param keyCode 键码
     * @param type 键的类型 0为按下 1为弹起
     */
    synchronized final public void addKey(int keyCode, int type) {
        keyCodes[endKey] = (keyCode << 16) | type;
        endKey++;
        if(endKey >= keyCodes.length) {
            endKey = 0;
        }
    }
    

    public void setCartoonWithAlpha(PaintUnit cartoonWithAlpha, boolean isDrawCartoonWidthAlpha, int startAlpha, int endAlpha)
    {
        this.cartoonWithAlpha = cartoonWithAlpha;
        this.isDrawCartoonWidthAlpha = isDrawCartoonWidthAlpha;
        this.startAlpha = startAlpha;
        this.endAlpha = endAlpha;
    }

    private void drawCartoonWithAlpha(Graphics g)
    {
        if(!isDrawCartoonWidthAlpha)
        {
            return;
        }
        if(cartoonWithAlpha == null)
        {
            return;
        }
        final int SPEED = 6;
        if(startAlpha != endAlpha)
        {
            cartoonWithAlpha.setImageA(startAlpha);
        }
        cartoonWithAlpha.paint(g, offsetX, offsetY);
        if (cartoonWithAlpha.isEndAnimation())
        {
            cartoonWithAlpha.initFrame();
        }
        else
        {
            cartoonWithAlpha.playNextFrame();
        }
        if(startAlpha == endAlpha)
        {
            return;
        }
        if(startAlpha < endAlpha)
        {
            startAlpha += SPEED;
            if(startAlpha >= endAlpha)
            {
                startAlpha = endAlpha;
                if(script != null)
                {
                    script.remind(0, 0, null);
                    script = null;
                }
            }
            return;
        }
        startAlpha -= SPEED;
        if (startAlpha <= endAlpha)
        {
            startAlpha = endAlpha;
            if (script != null)
            {
                script.remind(0, 0, null);
                script = null;
            }
        }
    }

    synchronized private void readKey() {
        //#if PRINTDEBUG == 1
//        System.out.println("readKey");
        //#endif
        for(int i = startKey; i != endKey; i++) {
            if(i >= keyCodes.length) {
                i = 0;
            }
            int keyCode = keyCodes[i] >> 16;
            int type = keyCodes[i] & 0xFFFF;
            if(type == 0) {
                doKeyPressed(keyCode);
            } else {
                doKeyReleased(keyCode);
            }
        }
        //归零
        startKey = endKey = 0;
    }
    //摄像机镜头左上角坐标
    int offsetX;
    int offsetY;
    /**
     * 是否渲染攻击的特效
     */
    boolean isDrawSuperAttackLine;
    int superAttackLineIndex = 0;

    /**
     * 是否游戏结束了
     */
    public boolean isGameOver;

    /**
     * 是否可已经入主菜单了
     */
    private boolean isCanOverMain;

    /**
     * 阳光
     */
    private Image imgLight;
    private boolean isDrawLight;

    /**
     * 结束原因
     */
    private char[] gameOverChar;

    /**
     * 技能见面左右技能书
     */
    int[] leftSkillType;
    int[] rightSkillType;
    char[] passSkilldec;
    char[] passSkillName;

    /**
     * 技能大类说明
     */
    char[] skillTypeDec;
    /**
     * 提示语
     */
    char[] skillTypeStr;
    PaintUnit learnCartoon;
    /**
     * 补充动画
     */
    PaintUnit addCartoon;

    /**
     * 渐变背景
     */
    int[] showBackData;

    /**
     * 渲染背景时间
     */
    int showImageTime = 34;
    int showImageCount = 15;

    /**
     * 主角升级动画
     */
    public PaintUnit actorLevelUpAni;
    public boolean isDrawActorUplv;

    /**
     * 地图掉落物品动画
     */
    public PaintUnit mapItemPaint;

    public static final int NO_STATUS = 0;
    public static final int START_GAME_STATUS = 1;
    public static final int GAME_STATUS = 2;
    public static final int LOAD_STATUS = 3;
    public static final int SAVE_STATUS = 4;

    int status = NO_STATUS;
    //线程执行状态, 是否执行
    boolean threadRuning;

    //在载入的时候分步骤
    int step;
            
            

    /**
     * 是否开始技能教学
     */
    boolean isStartSkillTeach;
    int teachSkillIndex;
    int teachSkillCount;
    int teachSkillBack;

    /**
     * 是否教学
     */
    boolean isLearn;
    /**
     * 教学的进程
     */
    int learnIndex;

    /**
     * 教学的文字
     */
    char[] learnStr;

    /**
     * 教学的数据
     */
    short[][] learnData;

    //仅代表在显示Loading屏幕
    boolean loading;

    //冒险模式开始时间,用在BOSS启动某些技能的时候, 单位是毫秒
    public int startAttackTime;

    //下面是应对Boss说话的数据
    //BOSS说话内容
    BossSpeakActionParam bossSpeakParam;
    int bossSpeakCount;

    //聊天需要的数据
    boolean isSelectTalk;
    boolean isTalk;
    char[] nameChs;
    char[] talkChs;
    final int TALK_SCROLL_MAX_TIME = 5;
    int talkScrollTime = TALK_SCROLL_MAX_TIME;

    //对话相关图片
    Image imgTalkBack;
    Image imgTalkNameBack;
    boolean talkMore;
    PaintUnit talkMoreAni;
    PaintUnit selectTalkMoreAni;

    //对话头像
    short talkFaceAniId;
    short talkExpressionId;
    short talkFaceAniIdOld;
    short talkExpressionIdOld;
    boolean isTalkFaceLeft = true;
    int talkFaceImgWidth;
    PaintUnit talkFaceAni;
    int talkFaceAniX = 0;
//    boolean talkFaceScrolling = true;

    //从哪个部分的哪个字符开始画
    int startPart;
    int startCh;

    //画到哪个部分的哪个字符
    int endPart;
    int endCh;

    //中间状态脚本
    //目前被Say MoveCamera所采用
    ScriptEngine script;

    //字库
    FishFont font;
    //观察者模式
    boolean observerMode;
    boolean sceneMode;

    //移动镜头
    boolean movingCamera;
    int moveCameraX;
    int moveCameraY;
    int cameraSpeedX;
    int cameraSpeedY;

    //屏幕上绘制地图、玩家角色的区域
    int showWidth = SCREEN_WIDTH;
    int showHeight = SCREEN_HEIGHT - ACTOR_STATE_HEIGHT;

    PaintUnit bigAttackedUnit;
    Image imgAttackedNum;
    Image[] imgBigAttackedNum;

    //攻击数字相关数据结构
    final int MAX_ATTACK_NUM = 99999;
    final int ATTACKED_ITEMS = 20;
    final int NUM_WIDTH = 5;
    final int ATTACKED_FRAMES = 3;
    final int BIG_ATTACKED_FRAMES = 8;
    byte[] attackedNums;
    int attackedItems;
    byte[] attackedOffsets;
//    //是否是主角
//    boolean[] attackedTypes;
    //是否是爆机
    boolean[] attackedBigs;

    Role[] attackedRoles;
    //显示数字从什么高度开始
    short[] attackedHeights;
    byte[] attackedFrames;
    //字的个数
    byte[] attackedNumCnts;

    byte[] attackedNexts;
    byte[] attackedPrevs;
    //第一个元素的指针 -1代表空
    int attackedHead = -1;
    //指向下一个插入元素
    int attackedTail = -1;

    /**
     * 最多屏幕是个动画
     */
    final int CURCARTOON_MAX_CONT = 10;
    /**
     * 当前卡通
     */
    PaintUnit[] curCartoon = new PaintUnit[CURCARTOON_MAX_CONT];
    boolean[] isStopScript = new boolean[CURCARTOON_MAX_CONT];
    String[] cartoonName = new String[CURCARTOON_MAX_CONT];
    boolean[] isEndDel = new boolean[CURCARTOON_MAX_CONT];

    /**
     * 表情
     */
    private PaintUnit[] browPaintUnit;
    int browCount;

    /**
     * 有脚本的提示
     */
    public PaintUnit tipPaint;

    /**
     * 脚本KEEPTIME用到的数据
     */
    long keepStartTime;
    long keepKeepTime;

    //检查对话Npc
    boolean checkingTalkNpc;
    //对话Npc
    Npc talkNpc;
    //参与对话的Npc的原始方向
    int talkNpcOldDir;

    //场景名称
    char[] sceneName;

    //显示闪动提示相关的部分, 提示获得物品、金钱
    boolean showFlashNote;
    //最多同时显示10个
    final int FLASH_NOTE_CNT = 100;
    char[][] flashNoteChs = new char[FLASH_NOTE_CNT][];
    //索引开始
    int flashNoteStartIdx = 0;
    int flashNoteEndIdx = 0;
    int flashNoteCnt = 0;
    int flashNoteTopY;

    //公共变量
    RoleManager roleMgr;
    ImageManager imgMgr;
    StringManager strMgr;
    /**
     * 覆盖屏幕颜色
     */
    private int fillColor;

    /**
     * 是否覆盖
     */
    private boolean isFillScreen;

    /**
     * 是否脚本控制震动
     */
    private boolean isScriptVibration;

    /**
     * 脚本控制震动计数器
     */
    private int scriptVibrationCount;

    //***************************变速运动效果参数*****************************//


    /**
     * 设置屏幕全黑或者全白
     */
    public boolean isLightAction;

    /**
     * 覆盖屏幕颜色
     */
    public int lightActionColor;

    /**
     * 是否震动
     */
    private boolean isVibration;
    private int vibrationCount = 0;

    //***********************************************************************//

    //***********************技能相关***************************//

    /**
     * 不良状态渲染
     */
    public PaintUnit[] attackEffectIcon = new PaintUnit[2];

    /**
     * 被攻击特效
     */
    public PaintUnit beattackFile;

    /**
     * 最多被攻击到得NPC
     */
    final int MAX_BEATTACK_ROLE_COUNT = 8;

    /**
     * 有多少个特效
     */
    private int beattackRoleCount;

    /**
     * 被攻击的npc
     */
    private Npc[] beattackNpc;

    /**
     * 被攻击的位置
     */
    private int[] beattackRolePos;
    /**
     * 线段
     */
    private short[] beattackRoleLinePos;

    /**
     * 攻击特效线段的随机数据
     * 这里借鉴一下魔兽世界的经验，利用空间换时间，预先把随机数全部准备好
     * y = a*x;
     * 第一位是公式中的a代表斜率，后面分别是X轴坐标
     */
    private byte[][] beattackLineData;

    /**
     * 攻击特效线段的随机数据索引，一个数代表四个索引
     * 每一个攻击点出现四个线段，每8位代表上面数据的一个索引
     */
    private int[] beattackLineDataIndex;

    /**
     * 被攻击的帧数
     */
    private short[] beattackFrame;

    /**
     * 被攻击的动画ID
     */
    private short[] beattackActId;
    //***********************************************************//

    //绘制用户当前状态用到的
    //#if SMS == 1 || SMS == 2
    Sms sms;
    //#endif

    Dialog dlg;
    AnimationManager aniMgr;

    //电影模式
    boolean movieMode;
    //0 扩张 1 保持 2 收缩
    int movieModeOffsetFlag;
    int movieModeOffsetY;
    final int MOVIE_BORDER_HEIGHT = 40;

    //字幕相关
    boolean showSubtitle;//是否显示字幕
    int showSubtitleMode;//字幕显示模式
    final int SUBTITLE_MODE_SCROLL = 0;//自动滚屏模式
    final int SUBTITLE_MODE_TYPEWRITTER = 1;//打字机模式
    char[] showSubtitleTxt;//字幕内容
    int showSubtitleBackClr;//背景颜色
    int showSubtitleTxtClr;//字幕字体颜色
    int showSubtitleTxtAlpha;//字体alpha值
    boolean showSubtitleWaitKey;//等待按键关闭字幕
    boolean showSubtitleStopKey;//阻止按键响应
    int showSubtitleStartIdx;//字幕显示开始index
    int showSubtitleOffset;//字幕显示个数
    int showSubtitleInterval;//字幕显示间隔

    //屏幕切换
    boolean sceneSwitch;
    int sceneSwitchType;
    int sceneSwitchOffset;
    boolean sceneSwitchFlag;

    char[] menuTxt;
    //秘籍
    char[] cheatsTxt;

    //在打开宝箱
    boolean openBoxStatus;

    //保持镜头
    boolean holdCamera;

    /**
     * 是否让镜头停留在某个npc上
     */
    boolean isNpcCamera;

    /**
     * 需要停留的npc
     */
    String npcNameCamera;

    //*************************水波纹***********************************//

    /**
     * 最多20个水波纹
     */
    final int MAX_DIMPLE = 20;

    /**
     * 保存所有水波纹的动画的
     */
    private int[] dimpleMap = new int[MAX_DIMPLE];

    /**
     * 开始渲染的索引
     */
    private int startDimpleIndex;

    /**
     * 水波纹个数
     */
    private int dimpleSize;

    //*****************************************************************//
    //等待按键
    boolean waitingKey;
    int waitKeyCode;

    //timer相关
    ///现在没用到，注释之
    /*
    final int TIMER_CNT = 10;
    ScriptEngine[] timers;
    //下面的时间选项都是以周期为单位
    int[] timerDelays;
    int[] timerStarts;

    //有timer在运转
    boolean timerWorking;
    //在工作的timer
    int timerIdx;
    int timerCnt;
    */

    /**
     * 主角头像
     */
    PaintUnit actorHead;
    Mission curFinishMission;
    /**
     * 是否可以存盘
     */
    private boolean isCanSave = true;

    /**
     * 飘得类型
     */
    private int sceneType = -1;

    //是否显示了第一个物品
    boolean showingFirstItem;
    //显示获得新法宝
    boolean showingGetMagicWeapon;

    int weaponTeachStep;
    int weaponTeachX;

    //宝箱按下的次数
    //总共打开宝箱的次数，与宝箱无关，只要打开一次就计算一次。
    int totalOpenBoxTimes;
    //每个宝箱的次数，共计12个宝箱，每个宝箱的名字都要不一样，然后用名字来区分
    Hashtable boxTimes;
    //记录触发脚本的宝箱,即当前正在打开的宝箱
    ChestBox curBox;
    Npc curNpc;

    public GamePage() {
        fullScreen = true;
        keyMgr = new KeyManager();
        font = FishFont.getInstance();
        font.init();
        talkFaceAni = new PaintUnit();
        initAttackedNumbers();
        roleMgr = RoleManager.getInstance();
        roleMgr.initRole();
        imgMgr = ImageManager.getInstance();
        aniMgr = AnimationManager.getInstance();
        strMgr = StringManager.getInstance();
        dlg = new Dialog();
        dlg.lsnr = this;
        //#if SMS == 1 || SMS == 2
        sms = GameContext.sms;
        //#endif
        boxTimes = new Hashtable();
    }

    /**
     * 可以存盘
     * @param b
     */
    void canSave(boolean b)
    {
        isCanSave = b;
        if(!b)
        {
            return;
        }
        GameContext.actor.status = RoleConst.STAND_STATUS;
        GameContext.actor.changeAction();
    }

    /**
     * gameover的按键操作
     * @param keyCode
     */
    private void doInputGameOver(int keyCode)
    {
        if(keyCode != Keys.KEY_RIGHT_SOFT)
        {
            return;
        }
        GameContext.setVar("GAMEOVER", 1);
    }

    private void doPointGameOver(int px, int py) {
        final int TXT_W = 75;
        final int TXT_H = 26;
        if (GameContext.point(px, py, SCREEN_WIDTH - TXT_W, SCREEN_HEIGHT - TXT_H, TXT_W, TXT_H)) {
            GameContext.setVar("GAMEOVER", 1);
        }
    }

    /**
     * 游戏gameover
     * @param g
     */
    private void drawGameOver(Graphics g)
    {
        g.setColor(0);
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        g.setColor(0xffffff);
        final int DIS = 20;
        int height = font.getCharsHeight(gameOverChar, SCREEN_WIDTH - (DIS << 1)) >> 1;
        font.drawCharsAlignLeft(g, gameOverChar, DIS, (SCREEN_HEIGHT >> 1) - height, SCREEN_WIDTH - (DIS << 1));
        font.drawString(g, "回主菜单", SCREEN_WIDTH, SCREEN_HEIGHT, Graphics.RIGHT | Graphics.BOTTOM);
    }

    /**
     * 渲染阳光
     * @param g
     */
    private void drawLight(Graphics g)
    {
        if(!isDrawLight)
        {
            return;
        }
//        g.drawImage(imgLight, 0, 0, 0);
    }

    public void showSceneSwitch(int switchType) {
        MusicPlayer.getInstance().playSound(SoundConst.SCENESWITCH);
        checkingTalkNpc = false;
        talkNpc = null;
        sceneSwitch = true;
        sceneSwitchType = switchType;
        switch(switchType) {
            case 1:
                sceneSwitchOffset = 10;
                break;

            case 2:
            case 3:
            case 4:
            case 5:
            case 7:
            case 8:
                sceneSwitchOffset = 0;
                break;

            case 6:
                sceneSwitchOffset = 200;
                break;
            case 9:
                if (showBackData != null)
                {
                    sceneSwitchOffset = 0;
                    return;
                }
            case 10:
                showBackData = new int[(SCREEN_WIDTH >> 1) * (SCREEN_HEIGHT >> 1)];
                for (int index = 0, cnt = showBackData.length; index < cnt; index++)
                {
                    showBackData[index] = 0xffffff;
                }
                sceneSwitchOffset = 0;
                break;
            case 11:
                showBackData = new int[(SCREEN_WIDTH >> 1) * (SCREEN_HEIGHT >> 1)];
                sceneSwitchOffset = 0;
                break;
            case 107:
                sceneSwitchOffset = 45;
                break;
        }
    }

    /**
     * 场景效果背景颜色
     */
    private int sceneEffortBackColor;
    /**
     * 场景效果背景透明度
     */
    private int sceneEffortBackTransparency;
    /**
     * 设置场景飘东西类型
     * @param type
     * @param isOutSide
     */
    public void setSceneEffortType(int type, boolean isOutSide, int backColor, int transparency)
    {
        //如果是室内就释放阳光图片
        if(!isOutSide && isDrawLight)
        {
            imgLight = null;
        }
        isDrawLight = isOutSide;
        if(sceneType == type && sceneType != SCENE_MASK)
        {
            return;
        }
        sceneEffortBackColor = backColor;
        sceneEffortBackTransparency = transparency;
        sceneType = type;
        switch(sceneType)
        {
            case SCENE_MASK:
                {
                    showBackData = new int[(SCREEN_WIDTH >> 1) * (SCREEN_HEIGHT >> 1)];
                    int color = ((0xff * transparency / 100) << 24) | backColor;
                    for (int index = 0, colorCnt = showBackData.length; index < colorCnt; index++)
                    {
                        showBackData[index] = color;
                    }
                }
                break;
            default:
                showBackData = null;
                break;
        }
    }

    /**
     * 渲染场景
     * @param g
     */
    private void drawSceneEffort(Graphics g)
    {
        if(isLightAction)
        {
            return;
        }
        if(sceneType <= 0)
        {
            return;
        }
        if(sceneType == SCENE_MASK)
        {
            if(showBackData == null)
            {
                return;
            }
            int width = SCREEN_WIDTH >> 1;
            int height = SCREEN_HEIGHT >> 1;
            Util.drawRGB(g, showBackData, 0, width, 0, 0, width, height, true);
            Util.drawRGB(g, showBackData, 0, width, 0, height, width, height, true);
            Util.drawRGB(g, showBackData, 0, width, width, 0, width, height, true);
            Util.drawRGB(g, showBackData, 0, width, width, height, width, height, true);
            return;
        }
    }

    private void drawSceneSwitch(Graphics g) {
        if(!sceneSwitch) {
            return;
        }

        int SCR_WIDTH = SCREEN_WIDTH;
        int SCR_HEIGHT = SCREEN_HEIGHT;
        final int BAR_SIZE = 20;
        switch(sceneSwitchType) {
            case 1:
                g.setColor(0);
                g.fillRect(0, 0, sceneSwitchOffset, SCREEN_HEIGHT);
//                int change1 = 10;
                int change1 = SCREEN_WIDTH / 20;
                int change2 = change1 >> 1;
                if(sceneSwitchFlag) {
                    change1 += 2;
                    change2 -= 2;
                } else {
                    change1 -= 2;
                    change2 += 2;
                }
                sceneSwitchFlag = !sceneSwitchFlag;
                g.fillRect(sceneSwitchOffset + change1, 0, change1, SCREEN_HEIGHT);
                g.fillRect(sceneSwitchOffset + (change1 << 1) + change2, 0, change2, SCREEN_HEIGHT);
                sceneSwitchOffset += change1;

                if(sceneSwitchOffset >= SCREEN_WIDTH) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;

            case 2:
                g.setColor(0);
                final int BAR_WIDTH = 15;
                final int BAR_OFFSET = 2;

                for(int x = 0; x < SCR_WIDTH; x += BAR_WIDTH) {
                    g.fillRect(x, 0, sceneSwitchOffset, SCREEN_HEIGHT);
                }
                sceneSwitchOffset += BAR_OFFSET;
                if(sceneSwitchOffset > BAR_WIDTH) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;

            case 3:
                g.setColor(0);

                for(int y = 0; y < SCR_HEIGHT; y += BAR_SIZE) {
                    for(int x = 0; x < SCR_WIDTH; x += BAR_SIZE) {
                        g.fillRect(x, y, sceneSwitchOffset, sceneSwitchOffset);
                    }
                }
                sceneSwitchOffset += 2;
                if(sceneSwitchOffset > BAR_SIZE) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;

            case 4:
                g.setColor(0);
                int boxOffset = (BAR_SIZE - sceneSwitchOffset) >> 1;
                for(int y = 0; y < SCR_HEIGHT; y += BAR_SIZE) {
                    for(int x = 0; x < SCR_WIDTH; x += BAR_SIZE) {
                        g.fillRect(x + boxOffset, y + boxOffset, sceneSwitchOffset, sceneSwitchOffset);
                    }
                }
                sceneSwitchOffset += 2;
                if(sceneSwitchOffset > BAR_SIZE) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;

            case 5:
                g.setColor(0);
                g.fillArc((SCR_WIDTH - sceneSwitchOffset) >> 1, (SCR_HEIGHT - sceneSwitchOffset) >> 1, sceneSwitchOffset, sceneSwitchOffset, 0, 360);
                int SCR_BIG_LINE = (SCR_HEIGHT > SCR_WIDTH) ? SCR_HEIGHT : SCR_WIDTH;
                sceneSwitchOffset += 30;
                if(sceneSwitchOffset > SCR_BIG_LINE) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;

            case 6:
                g.setColor(0);
                int x = sceneSwitchOffset;
                for(int y = 0; y < SCR_HEIGHT; y += 36) {
                    int barSize = 0;
                    x = sceneSwitchOffset;
                    for(int times = 0; times < 9; x += 30, times++) {
                        g.fillRect(x, y + ((36 - barSize) >> 1) , barSize, barSize);
                        barSize += 4;
                    }
                }

                x += 5;
                g.fillRect(x, 0, SCR_WIDTH - x, SCR_HEIGHT);
                sceneSwitchOffset -= 30;
                if(sceneSwitchOffset < -SCR_WIDTH) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;

            case 7:
                int angle = sceneSwitchOffset;
                g.setColor(0);
                int arcW = 40;
                for(int i = 0; i < 12; i++) {
                    g.fillArc(0 - arcW, 0 - arcW, SCR_WIDTH + (arcW << 1), SCR_HEIGHT + (arcW << 1), angle, sceneSwitchOffset);
                    angle += 30;
                }
                sceneSwitchOffset += 2;
                if(sceneSwitchOffset > 30) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;

            case 107:
                //反转扇形
                int a = sceneSwitchOffset;
                g.setColor(0);
                for(int i = 0; i < 8; i++) {
                    g.fillArc(0 - 40, 0 - 40, 240 + 80, 320 + 80, a, sceneSwitchOffset);
                    a += 45;
                }

                sceneSwitchOffset -= 1;
                if(sceneSwitchOffset <= 0) {
                    sceneSwitch = false;
                    if(script != null) {
                        script.remind(0, 0, null);
                    }
                }
                break;

            case 8:
                final int LINE_HEIGHT = 4;

                g.setColor(0);

                for(int y = 0; y < SCR_HEIGHT; y += LINE_HEIGHT) {
                    g.fillRect(0, y, sceneSwitchOffset, LINE_HEIGHT);
                    g.fillRect(SCR_WIDTH - sceneSwitchOffset, y + LINE_HEIGHT, sceneSwitchOffset, LINE_HEIGHT);
                    y += LINE_HEIGHT;
                }

                sceneSwitchOffset += SCREEN_WIDTH / 12;
                if(sceneSwitchOffset > SCR_WIDTH) {
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                }
                break;
            case 11:
            case 9:
            {
                int tr = sceneSwitchOffset * showImageCount + (0xff * sceneEffortBackTransparency / 100);
                int allTime = (0xff * (100 - sceneEffortBackTransparency) / 100) / showImageCount;
                if (sceneSwitchOffset <= showImageTime >> 1)
                {
                    int color = showBackData[0] & 0xffffff;
                    if(color != 0xffffff)
                    {
                        int cR = (color >> 16) & 0xff;
                        int cG = (color >> 8) & 0xff;
                        int cB = color & 0xff;
                        int eR = (sceneEffortBackColor >> 16) & 0xff;
                        int eG = (sceneEffortBackColor >> 8) & 0xff;
                        int eB = sceneEffortBackColor & 0xff;
                        int speedR = (0xff - eR) / (allTime);
                        int speedG = (0xff - eG) / (allTime);
                        int speedB = (0xff - eB) / (allTime);
                        cR = (cR + speedR > 0xff) ? 0xff : (cR + speedR);
                        cG = (cG + speedG > 0xff) ? 0xff : (cG + speedG);
                        cB = (cB + speedB > 0xff) ? 0xff : (cB + speedB);
                        color = (cR << 16) | (cG << 8) | cB;
                    }
                    tr = tr > 0xff ? 0xff : tr;
                    for (int index = 0, cnt = showBackData.length; index < cnt; index++)
                    {
                        showBackData[index] = color;
                        showBackData[index] |= tr << 24;
                    }
                }
                if((sceneSwitchOffset > showImageTime >> 1) || (tr >= 0xff))
                {
                    if(isGameOver)
                    {
                        isCanOverMain = true;
                        showBackData = null;
                        sceneSwitch = false;
                        g.setColor(0);
                        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                        return;
                    }
                    g.setColor(0xffffff);
                    g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                    showBackData = null;
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                    return;
                }
                sceneSwitchOffset++;
                int width = SCREEN_WIDTH >> 1;
                int height = SCREEN_HEIGHT >> 1;
                Util.drawRGB(g, showBackData, 0, width, 0, 0, width, height, true);
                Util.drawRGB(g, showBackData, 0, width, 0, height, width, height, true);
                Util.drawRGB(g, showBackData, 0, width, width, 0, width, height, true);
                Util.drawRGB(g, showBackData, 0, width, width, height, width, height, true);
            }
                break;
            case 10:
                int tr = (0xff - sceneSwitchOffset * showImageCount);
                if (sceneSwitchOffset <= showImageTime >> 1)
                {
                    int color = showBackData[0] & 0xffffff;
                    if(sceneEffortBackColor != 0)
                    {
                        int allTime = (0xff * (100 - sceneEffortBackTransparency) / 100) / showImageCount;
                        int cR = (color >> 16) & 0xff;
                        int cG = (color >> 8) & 0xff;
                        int cB = color & 0xff;
                        int eR = (sceneEffortBackColor >> 16) & 0xff;
                        int eG = (sceneEffortBackColor >> 8) & 0xff;
                        int eB = sceneEffortBackColor & 0xff;
                        int speedR = (0xff - eR) / (allTime) + (sceneSwitchOffset >> 1);
                        int speedG = (0xff - eG) / (allTime) + (sceneSwitchOffset >> 1);
                        int speedB = (0xff - eB) / (allTime) + (sceneSwitchOffset >> 1);

                        cR = (cR - speedR < eR) ? eR : (cR - speedR);
                        cG = (cG - speedG < eG) ? eG : (cG - speedG);
                        cB = (cB - speedB < eB) ? eB : (cB - speedB);
                        color = (cR << 16) | (cG << 8) | cB;
                    }
                    for (int index = 0, cnt = showBackData.length; index < cnt; index++)
                    {
                        showBackData[index] = color;
                        showBackData[index] |= tr << 24;
                    }
                }
                if((sceneSwitchOffset > showImageTime >> 1) || tr <= (0xff * sceneEffortBackTransparency / 100))
                {
                    if (sceneType == SCENE_MASK)
                    {
                        int color = ((0xff * sceneEffortBackTransparency / 100) << 24) | sceneEffortBackColor;
                        for (int index = 0, colorCnt = showBackData.length; index < colorCnt; index++)
                        {
                            showBackData[index] = color;
                        }
                    }
                    else
                    {
                        showBackData = null;
                    }
                    sceneSwitch = false;
                    script.remind(0, 0, null);
                    return;
                }
                sceneSwitchOffset++;
                int width = SCREEN_WIDTH >> 1;
                int height = SCREEN_HEIGHT >> 1;
                Util.drawRGB(g, showBackData, 0, width, 0, 0, width, height, true);
                Util.drawRGB(g, showBackData, 0, width, 0, height, width, height, true);
                Util.drawRGB(g, showBackData, 0, width, width, 0, width, height, true);
                Util.drawRGB(g, showBackData, 0, width, width, height, width, height, true);
                break;
        }
    }

    /**
     * 写入小表情
     * @param browPaintUnit
     * @param aThis
     */
    void setBrowPaintUnit(PaintUnit[] browPaintUnit, ScriptEngine aThis)
    {
        this.browPaintUnit = browPaintUnit;
        script = aThis;
        browCount = 0;
    }

    void setKeepTime(ScriptEngine aThis, int keepTime)
    {
        keepStartTime = 0;
        this.script = aThis;
        this.keepKeepTime = keepTime;
    }

    /**
     * 脚本设置屏幕震动
     * @param vibration
     */
    void setScriteVibration(boolean vibration)
    {
        isScriptVibration = vibration;
        scriptVibrationCount = 0;
//        if(dlg.keyPaintUnit == null)
//        {
//            dlg.keyPaintUnit = new PaintUnit();
//            aniMgr.getAnimation((short)240, dlg.keyPaintUnit);
//            dlg.keyPaintUnit.x = SCREEN_WIDTH >> 1;
//            dlg.keyPaintUnit.y = (SCREEN_HEIGHT >> 1) - 50;
//            dlg.keyPaintUnit.initFrame();
//        }
    }

    /**
     * 处理保持屏幕状态逻辑
     */
    private void doKeepTime()
    {
        if(keepKeepTime == 0)
        {
            return;
        }
        keepKeepTime -= 100;
        //#if PRINTDEBUG == 1
        System.out.println("休息="+((System.currentTimeMillis() - MainCanvas.startTime)));
        System.out.println("keepKeepTime="+keepKeepTime);
        //#endif
        if(keepKeepTime <= 0)
        {
            keepKeepTime = 0;
            if(script != null && script.type == ScriptEngine.KEEP_TIME)
            {
                script.remind(0, 0, null);
            }
        }

//        if(keepStartTime == 0)
//        {
//            keepStartTime = System.currentTimeMillis();
//        }
//        if(System.currentTimeMillis() - keepStartTime >= keepKeepTime)
//        {
//            if(script != null && script.type == ScriptEngine.KEEP_TIME)
//            {
//                script.remind(step, startCh, null);
//            }
//            keepKeepTime = 0;
//            keepStartTime = 0;
//        }
        //#if PRINTDEBUG == 1
//        System.out.println("时间持续="+(System.currentTimeMillis() - keepStartTime));
        //#endif
    }

    /**
     * 渲染脚本里面的小表情
     * @param g
     */
    private void drawBrowPaintUnit(Graphics g)
    {
        final int SLEEP = 10;
        if(browPaintUnit == null)
        {
            return;
        }
        browCount++;
        if(browCount >= SLEEP)
        {
            if(script != null && script.type == ScriptEngine.ROLE_BROW)
            {
                script.remind(step, startCh, null);
            }
            browPaintUnit = null;
            return;
        }
        for(int index = 0; index < browPaintUnit.length; index++)
        {
            browPaintUnit[index].paint(g, offsetX, offsetY);
            browPaintUnit[index].playNextFrame();
        }
    }

    private int getNameIndex(String[] strArray, String str)
    {
        for(int index = 0,cnt = strArray.length; index < cnt; index++)
        {
            if(strArray[index] == null && str == null)
            {
                return index;
            }
            if(strArray[index] != null && strArray[index].equals(str))
            {
                return index;
            }
        }
        return -1;
    }

    /**
     * 要移动的动画名称
     */
    String[] moveCartoonName;

    int[] moveCartoonPosX;
    int[] moveCartoonPosY;
    int[] moveCartoonSpeedX;
    int[] moveCartoonSpeedY;

    int moveCartoonCnt;
    /**
     * 设置动画移动啊
     * @param cartoonN
     * @param posX
     * @param posY
     */
    public void moveCartoon(int cnt, String[] cartoonName, int[] posX, int[] posY, int time)
    {
        moveCartoonPosX = posX;
        moveCartoonPosY = posY;
        moveCartoonName = cartoonName;
        moveCartoonSpeedX = new int[cnt];
        moveCartoonSpeedY = new int[cnt];
        for (int index = 0; index < cnt; index++){
            int curIndex = getNameIndex(this.cartoonName, cartoonName[index]);
            PaintUnit p = curCartoon[curIndex];
            int moveX = Math.abs(posX[index] - p.x);
            int moveY = Math.abs(posY[index] - p.y);
            int moveSpeedX = moveX / time;
            int moveSpeedY = moveY / time;
            moveCartoonSpeedX[index] = posX[index] > p.x ? moveSpeedX : -moveSpeedX;
            moveCartoonSpeedY[index] = posY[index] > p.y ? moveSpeedY : -moveSpeedY;
        }
    }

    private void moveCartoon()
    {
        if(moveCartoonName == null)
        {
            return;
        }
        boolean canResume = true;
        for (int index = 0; index < moveCartoonName.length; index++)
        {
            int curIndex = getNameIndex(cartoonName, moveCartoonName[index]);
            PaintUnit p = curCartoon[curIndex];
            if(p == null)
            {
                continue;
            }
            int moveX = Math.abs(moveCartoonPosX[index] - p.x);
            int moveY = Math.abs(moveCartoonPosY[index] - p.y);
            if(moveX >= Math.abs(moveCartoonSpeedX[index]))
            {
                p.x += moveCartoonSpeedX[index];
            }
            else if(moveX < Math.abs(moveCartoonSpeedX[index]))
            {
                p.x = moveCartoonPosX[index];
            }

            if(moveY >= Math.abs(moveCartoonSpeedY[index]))
            {
                p.y += moveCartoonSpeedY[index];
            }
            else if(moveY < Math.abs(moveCartoonSpeedY[index]))
            {
                p.y = moveCartoonPosY[index];
            }

            if(p.x != moveCartoonPosX[index] || p.y != moveCartoonPosY[index])
            {
                canResume = false;
            }
        }

        if (canResume)
        {
            script.remind(0, 0, null);
            moveCartoonName = null;
        }
    }
   

    /**
     * 写入屏幕上需要渲染的动画
     * @param p
     * @param show
     */
    void setCartoon(PaintUnit p, String scriptName, boolean isShow, boolean isStop, boolean isDel)
    {
        if(p == null)
        {
            int curIndex = getNameIndex(cartoonName, scriptName);
            if(curIndex >= 0)
            {
                curCartoon[curIndex].releaseImages();
                curCartoon[curIndex] = null;
                cartoonName[curIndex] = null;
                this.isStopScript[curIndex] = false;
            }
            return;
        }
        int curIndex = getNameIndex(cartoonName, null);
        if(curIndex < 0)
        {
            return;
        }
        curCartoon[curIndex] = p;
        this.isStopScript[curIndex] = isStop;
        cartoonName[curIndex] = scriptName;
        isEndDel[curIndex] = isDel;
        if (isShow)
        {
            for (int index = 0, count = roleMgr.npcMap.size(); index < count; index++)
            {
                Npc npc = roleMgr.npcs[index];
                npc.updatePaintMatrix();
            }

            for (int index = 0, count = roleMgr.arrowCnt; index < count; index++)
            {
                Arrow arrow = roleMgr.arrows[index];
                arrow.updatePaintMatrix();
            }
            GameContext.actor.updatePaintMatrix();
            return;
        }
        GameContext.groundMat.removeUnit(GameContext.actor);
        for(int index = 0, count = roleMgr.npcMap.size(); index < count; index++)
        {
            Npc npc = roleMgr.npcs[index];
            npc.removePaintMatrix();
        }

        for(int index = 0, count = roleMgr.arrowCnt; index < count; index++)
        {
            Arrow arrow = roleMgr.arrows[index];
            GameContext.flyMat.removeUnit(arrow);
        }
    }

    /**
     * 渲染当前卡通
     */
    private void drawCurCartoon(Graphics g)
    {
        moveCartoon();
        for (int index = 0; index < CURCARTOON_MAX_CONT; index++)
        {
            PaintUnit cartoon = curCartoon[index];
            if (cartoon == null)
            {
                continue;
            }
            if (isMiniGame)
            {
                cartoon.paint(g, 0, 0);
            }
            else
            {
                cartoon.paint(g, offsetX, offsetY);
            }
            if (cartoon.isEndAnimation())
            {
                //只有中断脚本的动画才有资格运行remind，只运行一次remind
                if (script != null && isStopScript[index])
                {
                    script.createCartoon_remind(0, 0, null);
                    isStopScript[index] = false;
                }
                if(isEndDel[index])
                {
                    curCartoon[index].releaseImages();
                    curCartoon[index] = null;
                    cartoonName[index] = null;
                    this.isStopScript[index] = false;
                    continue;
                }
                cartoon.initFrame();
                continue;
            }
            cartoon.playNextFrame();
        }
    }

    /**
     * 主角攻击npc暴击渲染十字
     */
    public void setDrawAttackCross()
    {
        drawAttackCrossCount = 0;
    }
    /**
     * 渲染攻击十字
     */
    private int crossPos;
    /**
     * 攻击十字计数器
     */
    private int drawAttackCrossCount;
    private final int ATTACK_LIGNT_LINE = 3;
    private void drawAttackCrossCount(Graphics g)
    {
        if(drawAttackCrossCount > ATTACK_LIGNT_LINE)
        {
            return;
        }
        g.setColor(0xffffff);
        int actorX = ((crossPos >> 16) & 0x7fff) - offsetX;
        int actorY = (crossPos & 0xffff) - offsetY;
        if(drawAttackCrossCount == 0)
        {
            drawLine(g, actorX, actorY, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 11, 0);
            drawLine(g, actorX, actorY, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 11, 1);
            drawLine(g, actorX, actorY, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 11, 2);
            drawLine(g, actorX, actorY, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 11, 3);
        }
        else if(drawAttackCrossCount == 1)
        {
            int disX = 60;
            drawLine(g, actorX + disX, actorY - disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 7, 0);
            drawLine(g, actorX + disX, actorY + disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 7, 1);
            drawLine(g, actorX - disX, actorY + disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 7, 2);
            drawLine(g, actorX - disX, actorY - disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 7, 3);
        }
        else if(drawAttackCrossCount == 2)
        {
            int disX = 100;
            drawLine(g, actorX + disX, actorY - disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 3, 0);
            drawLine(g, actorX + disX, actorY + disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 3, 1);
            drawLine(g, actorX - disX, actorY + disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 3, 2);
            drawLine(g, actorX - disX, actorY - disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 3, 3);
        }
        else if(drawAttackCrossCount == 3)
        {
            int disX = 140;
            drawLine(g, actorX + disX, actorY - disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 1, 0);
            drawLine(g, actorX + disX, actorY + disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 1, 1);
            drawLine(g, actorX - disX, actorY + disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 1, 2);
            drawLine(g, actorX - disX, actorY - disX, Page.SCREEN_HEIGHT, Page.SCREEN_HEIGHT, 1, 3);
        }
    }

    public void initBeattackRolePos() {
        beattackRoleCount = 0;
        beattackRolePos = new int[MAX_BEATTACK_ROLE_COUNT];
        beattackRoleLinePos = new short[MAX_BEATTACK_ROLE_COUNT];
        beattackFrame = new short[MAX_BEATTACK_ROLE_COUNT];
        beattackActId = new short[MAX_BEATTACK_ROLE_COUNT];
        beattackNpc = new Npc[MAX_BEATTACK_ROLE_COUNT];
    }

    /**
     * 被攻击的位置以及个数
     * @param pos
     * @param count
     */
    public void addBeattackRolePos(Rect box, Npc npc)
    {
        if (beattackRoleCount >= MAX_BEATTACK_ROLE_COUNT) {
            return;
        }
        for (int index = 0; index < beattackRoleCount; index++) {
            if (npc == beattackNpc[index]) {
                return;
            }
        }
        beattackNpc[beattackRoleCount] = npc;
        beattackRolePos[beattackRoleCount] = (npc.x << 16) | ((npc.y - (box.getHeight() >> 1)) & 0xffff);
        if (npc.isBig)
        {
            beattackRolePos[beattackRoleCount] |= 1 << 31;
        }
        beattackRoleLinePos[beattackRoleCount] = (short)GameContext.getRand(0, beattackLineDataIndex.length - 1);
        beattackActId[beattackRoleCount] = (short) (GameContext.getRand(0, 100) & 0x1);
        beattackFrame[beattackRoleCount] = 0;
        beattackRoleCount++;
    }

    private void removeBeattackRolePos() {
        for (int index = 0; index < beattackRoleCount; index++) {
            beattackFrame[index]++;
            if(beattackFrame[index] < beattackFile.ani.getFrameCount(beattackActId[index]))
            {
                continue;
            }
            beattackRoleCount--;
            if (beattackRoleCount == 0 || index == beattackRoleCount) {
                beattackNpc[index] = null;
                return;
            }
            beattackNpc[index] = beattackNpc[beattackRoleCount];
            beattackRolePos[index] = beattackRolePos[beattackRoleCount];
            beattackRoleLinePos[index] = beattackRoleLinePos[beattackRoleCount];
            beattackFrame[index] = beattackFrame[beattackRoleCount];
            beattackActId[index] = beattackActId[beattackRoleCount];
            beattackNpc[beattackRoleCount] = null;
            index--;
        }
    }

    /**
     * 渲染被攻击的特效
     * @param g
     */
    private void drawBeattackRolePos(Graphics g)
    {
        if(beattackRoleCount == 0)
        {
            return;
        }
        int x = 0;
        int y = 0;
        int lineX = 0;
        int lineY = 0;
        final int LINE_CNT = 4;
        int lineX0 = 0;
        int lineY0 = 0;
        boolean isBig = false;
        for(int index = 0, count = beattackRoleCount; index < count; index++)
        {
            isBig = false;
            x = ((beattackRolePos[index] >> 16) & 0x7fff) - offsetX;
            y = (beattackRolePos[index] & 0xffff) - offsetY;
            if(beattackRolePos[index] < 0)
            {
                isBig = true;
            }
            if(x <= 0 && y <= 0)
            {
                continue;
            }
            beattackFile.ani.drawFrame(g, beattackActId[index], beattackFrame[index], x, y, beattackFile);
            g.setColor(0xffffff);
            if(isBig)
            {
                crossPos = beattackRolePos[index] & 0x7fffffff;
                drawAttackCrossCount(g);
                continue;
            }
            int lineIndex = beattackLineDataIndex[beattackRoleLinePos[index]];
            if(beattackFrame[index] >= 3)
            {
                continue;
            }
            for(int drawLineIndex = 1; drawLineIndex < LINE_CNT; drawLineIndex++)
            {
                int i = (lineIndex >> (drawLineIndex << 3)) & 0xff;
                lineX0 = beattackLineData[i][1];
                lineY0 = beattackLineData[i][0] * lineX0 / 10;

                lineX = beattackLineData[i][beattackFrame[index] + 2];
                lineY = beattackLineData[i][0] * lineX / 10;

                g.drawLine(x + lineX0, y + lineY0, x + lineX, y + lineY);

                g.drawLine(x + lineX0 + 1, y + lineY0, x + lineX + 1, y + lineY);

                g.drawLine(x + lineX0 - 1, y + lineY0, x + lineX - 1, y + lineY);
            }
        }
        drawAttackCrossCount++;
        removeBeattackRolePos();
    }

    /**
     * 渲染斜线
     * @param g
     * @param startX
     * @param startY
     * @param width 长度
     * @param height 高度
     * @param kind 0代表/左下  1代表\坐上 2代表/右上 3代表\右下
     * @param dis 厚度
     */
    public static void drawLine(Graphics g, int startX, int startY, int width, int height, int dis, int kind)
    {
        final int UP = 0;
        final int DOWN = 1;
        if(kind == UP)
        {
            for (int index = 0; index < dis; index++)
            {
                int disXY = GameContext.getRand(-5, 5);
                g.drawLine(startX + disXY, startY + index - disXY, startX + width, startY - height + index);
            }
        }
        else if(kind == DOWN)
        {
            for (int index = 0; index < dis; index++)
            {
                int disXY = GameContext.getRand(-5, 5);
                g.drawLine(startX + disXY, startY + index + disXY, startX + width, startY + height + index);
            }
        }
        else if(kind == 2)
        {
            for (int index = 0; index < dis; index++)
            {
                int disXY = GameContext.getRand(-5, 5);
                g.drawLine(startX + disXY, startY + index - disXY, startX - width, startY + height + index);
            }
        }
        else if(kind == 3)
        {
            for (int index = 0; index < dis; index++)
            {
                int disXY = GameContext.getRand(-5, 5);
                g.drawLine(startX + disXY, startY + index + disXY, startX - width, startY - height + index);
            }
        }
    }

    /**
     *
     * @param g
     * @param startX
     * @param startY
     * @param dis
     * @param kind 0代表 左半边 1代表右半边 2代表上半边 3代表下半边
     */
    public void drawLine(Graphics g, int startX, int startY, int dis, int kind)
    {
        for (int index = 0; index <= dis >> 1; index++)
        {
            if(kind == 0)
            {
                g.drawLine(startX - (index << 1), startY + index, startX - (SCREEN_HEIGHT >> 1), startY + index);
                g.drawLine(startX - (index << 1), startY - index, startX - (SCREEN_HEIGHT >> 1), startY - index);
            }
            else if(kind == 1)
            {
                g.drawLine(startX + (index << 1), startY + index, startX + (SCREEN_HEIGHT >> 1), startY + index);
                g.drawLine(startX + (index << 1), startY - index, startX + (SCREEN_HEIGHT >> 1), startY - index);
            }
            else if(kind == 2)
            {
                g.drawLine(startX + index, startY - (index << 1), startX + index, startY - (SCREEN_HEIGHT >> 1));
                g.drawLine(startX - index, startY - (index << 1), startX - index, startY - (SCREEN_HEIGHT >> 1));
            }
            else if(kind == 3)
            {
                g.drawLine(startX + index, startY + (index << 1), startX + index, startY + (SCREEN_HEIGHT >> 1));
                g.drawLine(startX - index, startY + (index << 1), startX - index, startY + (SCREEN_HEIGHT >> 1));
            }
        }
    }


    /**
     * 处理震屏
     * @param g
     */
    private void doVibration(Graphics g)
    {
        int vibrationData = 2;
        if(!isVibration)
        {
            if(vibrationCount == 1)
            {
                g.translate(0, -vibrationData);
                vibrationCount++;
            }
            return;
        }
        isVibration = false;
        g.translate(0, vibrationData);
        vibrationCount++;
    }

    /**
     * 变速运动的效果
     * @param effort
     */
    void setEffort(int effort) {
        setEffort(effort, null);
    }

    void setEffort(int effort, Npc npc) {
        if(dlg.isAvailable() && effort >= RoleAction.SCREEN_DARK && effort <= RoleAction.SCREEN_BLACK)
        {
            return;
        }
        switch(effort)
        {
            case RoleAction.NO_EFFECT:
                isLightAction = false;
                break;
            case RoleAction.SCREEN_DARK:
                isLightAction = true;
                lightActionColor = 0xffffff;
                break;
            case RoleAction.SCREEN_BLACK:
                isLightAction = true;
                lightActionColor = 0;
                break;
            case RoleAction.VIBRATION:
                setVibration();
                break;
            case RoleAction.SLEEP:
                sleep();
                break;
            case RoleAction.ATTACK_THROW:
            case RoleAction.ATTACK_THROW2:
                GameContext.actor.startSuperAttackSkill(effort - RoleAction.ATTACK_THROW);
                break;
            case RoleAction.USE_SUPER_SKILL1:
                MusicPlayer.getInstance().playSound(SoundConst.ARRORW);//触手攻击音效（风特效）
                break;
            case RoleAction.USE_SKILL13:
                MusicPlayer.getInstance().playSound(SoundConst.TENTACLE);//触手攻击音效（风特效）
                break;
            case RoleAction.ENEMY_ATTACK1:
            case RoleAction.ENEMY_ATTACK2:{
                int x = npc.x - 15 + (effort - RoleAction.ENEMY_ATTACK1);
                int y = offsetY - Map.TILE_SIZE;
                int w = (effort == RoleAction.ENEMY_ATTACK1) ? 30 : 28;
                int h = npc.y - 10 - y;
                int backColor = 0xfcfcfc;
                int[] color = new int[]{0xe75d18, 0xe75d18, 0xf8d020, 0xf8d020, 0xf8d020, 0xfbefba, 0xfbefba, 0xfbefba};
                npc.setDrawEffectRect(x, y, w, h, backColor, color, false, Role.UP);
            }
                break;
            case RoleAction.ENEMY_ATTACK3: {
                int x = npc.x - 15;
                int w = 30;
                int y = offsetY - Map.TILE_SIZE;
                int h = npc.y - 10 - y;
                int backColor = 0xfefefe;
                int[] color = new int[]{0xe75d18, 0xe75d18, 0xf8d020, 0xf8d020, 0xf8d020, 0xfbefba, 0xfbefba, 0xfbefba};
                npc.setDrawEffectRect(x, y, w, h, backColor, color, false, Role.UP);
            }
            break;
            case RoleAction.ENEMY_ATTACK4: {
                int x = npc.x - 6;
                int w = 12;
                int y = offsetY - Map.TILE_SIZE;
                int h = npc.y - 10 - y;
                int backColor = 0xffffff;
                int[] color = new int[]{0xee5718, 0xee5718, 0xf8f870, 0xf8f870};
                npc.setDrawEffectRect(x, y, w, h, backColor, color, false, Role.UP);
            }
            break;
            case RoleAction.EFFECT_1: {
                int x = npc.x - 4;
                int w = 8;
                int y = offsetY - Map.TILE_SIZE;
                int h = npc.y - 10 - y;
                int backColor = 0xffffff;
                int[] color = new int[]{0xff663d, 0xff663d};
                npc.setDrawEffectRect(x, y, w, h, backColor, color, false, Role.UP);
            }
            break;
            case RoleAction.USE_SKILL1:
                MusicPlayer.getInstance().playSound(SoundConst.GUN);//主角火枪音效
                break;
            case RoleAction.USE_SKILL2:
                MusicPlayer.getInstance().playSound(SoundConst.SHIELD);//主角盾牌（砸地，成就）音效
                break;
            case RoleAction.USE_SKILL3:
                MusicPlayer.getInstance().playSound(SoundConst.PREPARECANNON);//箱子变大炮音效
                break;
            case RoleAction.USE_SKILL4:
                MusicPlayer.getInstance().playSound(SoundConst.CANNONBOOM);//大炮轰击音效
                break;
            case RoleAction.USE_SKILL5:
                MusicPlayer.getInstance().playSound(SoundConst.MENGGU1);//蒙古王子地裂音效
                break;
            case RoleAction.USE_SKILL6:
                MusicPlayer.getInstance().playSound(SoundConst.MENGGU2);//蒙古王子旋转音效
                break;
            case RoleAction.USE_SKILL7:
                MusicPlayer.getInstance().playSound(SoundConst.HUDIE1);//蝴蝶发鞭子音效
                break;
            case RoleAction.USE_SKILL8:
                MusicPlayer.getInstance().playSound(SoundConst.HUDIE2);//龙啸冰柱音效
                break;
            case RoleAction.USE_SKILL9:
                MusicPlayer.getInstance().playSound(SoundConst.QUBOOM);//蛆虫爆炸音效（大鬼，魔蟹吐毒）
                break;
            case RoleAction.USE_SKILL10:
                MusicPlayer.getInstance().playSound(SoundConst.SUCK);//鬼王吸收音效，狼嚎
                break;
            case RoleAction.USE_SKILL11:
                MusicPlayer.getInstance().playSound(SoundConst.BITE);//鬼王咬音效，狼嚎
                break;
            case RoleAction.USE_SKILL12:
                MusicPlayer.getInstance().playSound(SoundConst.LIGHTNING);//白莲道士雷击音效
                break;
            case RoleAction.EFFECT_2:
                MusicPlayer.getInstance().playSound(SoundConst.FIRE);//着火，火柱音效
                break;
            case RoleAction.EFFECT_3:
                MusicPlayer.getInstance().playSound(SoundConst.KNIFESWINGNULL);//刀挥空音效（小兵用攻击音效）匕首
                break;
            case RoleAction.EFFECT_4:
                MusicPlayer.getInstance().playSound(SoundConst.ARRORW);//射箭音效
                break;

        }
    }

    /**
     * 清空投掷动画
     */
    public void releaseArrowData()
    {
        //删除投掷物动画
        final int[] ARROW_ID =
        {
        //#if MEMORY == 1
//#             144,//电球
//#             125,//必杀技
//#             123,//闪现
//#             73,//斧头
//#             67,//虎爪
//#             66,//不知道啥
//#             63,//火球
//#             62,//地波
        //#endif
        };
        for(int index = 0; index < ARROW_ID.length; index++)
        {
            aniMgr.release(ARROW_ID[index]);
        }
    }

    /**
     * 释放所有地图和人物相关所有数据
     */
    public void memGc()
    {
        if (GameContext.actor != null && GameContext.actor.bufferAni != null)
        {
            GameContext.actor.ani = GameContext.actor.bufferAni;
            GameContext.actor.actId = GameContext.actor.bufferActId;
            GameContext.actor.initFrame();
            GameContext.actor.bufferAni = null;
            GameContext.actor.changeAction();
            GameContext.actor.isKeepLastFrame = false;
        }
        for(int index = 0; index < curCartoon.length; index++)
        {
            if(curCartoon[index] != null)
            {
                curCartoon[index].releaseImages();
                curCartoon[index] = null;
            }
            cartoonName[index] = null;
            this.isStopScript[index] = false;
            isEndDel[index] = false;
        }
        holdCamera = false;
        offsetX = 0;
        offsetY = 0;
        setEffort(0);
        if(GameContext.actor == null)
        {
            return;
        }
        if(status == GamePage.START_GAME_STATUS)
        {
            return;
        }
        dimpleMap = new int[MAX_DIMPLE];
        dimpleSize = 0;
        keyMgr.resetKey();
        keyMgr.resetKeyIm();
        GameContext.actor.status = Role.STAND_STATUS;
        GameContext.actor.changeAction();
        GameContext.actor.changeActGroup(0);
        startAttackTime = 0;

        //删除除了主角之外的头像
        final int[] HEAD_ID = {75, 76, 77, 78, 119, 120};
        for(int index = 0; index < HEAD_ID.length; index++)
        {
            aniMgr.release(HEAD_ID[index]);
        }
        talkFaceAni.releaseImages();

        releaseArrowData();

        //释放攻击状态
        for (int index = 0; index < attackEffectIcon.length; index++) {
            attackEffectIcon[index].releaseImages();
        }

        //地图数据清空
        if(GameContext.map != null)
        {
            GameContext.map.releaseDatas();
        }

        //释放很多元素包括 动画层所有元素 游戏层所有元素 除了主角 主角不要释放
        GameContext.flyMat.releaseImages();
        GameContext.groundMat.releaseImages();
        GameContext.undergroundMat.releaseImages();

        GameContext.flyMat.clear();
        GameContext.groundMat.clear();
        GameContext.undergroundMat.clear();
        PaintMatrix.releaseHeads();
        GameContext.actor.observer = null;
        //主角面前的NPC晴空
        talkNpc = null;
        curBox = null;
        curNpc = null;
        //子节点清空
        GameContext.actor.next = null;
        //释放所有敌人的动画
        roleMgr.releaseNpcAnimations();

        //释放死亡npc
        roleMgr.releaseDeadNpcAnimations();

        //释放宝箱
        roleMgr.releaseChestAnimations();

        //释放箭头
        roleMgr.releaseArrowAnimations();

        //背景效果释放
        showBackData = null;
        roleMgr.initRole();
        GameContext.actor.dieScript = null;
        GameContext.actor.isStopKey = false;
        GameContext.actor.isRunSkillAttack = false;
        Trigger.clearAll();

        //施放按键
        keyPadCode = -1;
        //施放技能冷却时间
        for (int index = 0; index < GameContext.actor.skillCoolTime.length; index++) {
            GameContext.actor.skillCoolTime[index] = 0;
        }

    }

    /**
     * 读取记录
     */
    private void loadLogicOnce()
    {
        try
        {
            switch(step)
            {
                case 1:
                    openBoxStatus = false;
                    curBox = null;
                    curNpc = null;
                    GameContext.script = null;
                    loadImages();
                    initBeattackRolePos();
                    initBeattackLineData();
                    break;
                case 2:
                    if (GameContext.actor == null)
                    {
                        Actor actor = new Actor();
                        actor.name = "侯文麟";
                        GameContext.actor = actor;
                        actor.load("role1.dat");
                        //缺省设置为向下
                        actor.dir = PaintUnit.DOWN;
                        actor.changeAction();
                    }
                    break;

                case 3:
                    memGc();
                    ByteArrayInputStream in = new ByteArrayInputStream(GameContext.rmsData);
                    DataInputStream dataIn = new DataInputStream(in);
                    readGameProgress(dataIn);
                    break;

                case 4:
                    showMenu = false;
                    status = GAME_STATUS;
                    MainCanvas.removePage();
                    holdCamera = false;
                    isNpcCamera = false;
                    movingCamera = false;
                    updateCameraByActor();
                    GameContext.setVar("saveStatus", 1);
                    setEffort(0);
                    threadRuning = false;
                    GameContext.groundMat.addUnit(GameContext.actor);
                    showMapNameFromLoad();
                    //#if SMS == 1
                    sms.initSmsVar();
                    //#endif
                    break;
            }
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
        step++;
    }

    /**
     * 保存游戏进程
     * @param out
     * @throws java.lang.Exception
     */
    public void saveGameProgress(DataOutputStream out) throws Exception
    {
        //先存入金钱和等级
        out.writeInt(EffortManager.getInstance().allEffortCount);
        out.writeShort(GameContext.actor.getLevel());
        out.writeInt(GameContext.actor.getMoney());
        out.writeUTF(new String(mapName));
        
        roleMgr.save(out);
        GameContext.map.saveScene(out);
        GameContext.actor.saveActorData(out);
        MissionManager.getInstance().saveMission(out);
        GameContext.saveVars(out);
        EffortManager.getInstance().saveEffort(out);
        MusicPlayer.getInstance().save(out);
        ScriptEngine s = GameContext.script;
        if(s != null && !s.isEnd()) {
            out.writeBoolean(true);
            out.writeUTF(s.fileName);
            out.writeInt(s.pc);
        } else {
            out.writeBoolean(false);
        }

        //存储用户的防护罩
        out.writeBoolean(observerMode);
        out.writeBoolean(sceneMode);

        //存储获得礼包的次数和奖励金钱
        out.writeShort(getGiftCount);
        out.writeInt(giftMoney);
        out.writeInt(giftTime);
        
        //储存炼化的火焰等级
        out.writeInt(artificeFireMaxLv);

        out.writeInt(sceneType);
        out.writeBoolean(isDrawLight);
        out.writeInt(sceneEffortBackColor);
        out.writeInt(sceneEffortBackTransparency);

        saveCurCartoon(out);
        //保存教学
        out.writeBoolean(teachOverArtifice);
        out.writeBoolean(teachOverEnchant);
        out.writeBoolean(teachOverGift);
        out.writeBoolean(isNotSaleItem);
        out.writeBoolean(teachOverFormula);
        out.writeBoolean(useShop);
        for (int index = 0; index < FORMULA_CNT; index++) {
            out.writeBoolean(isSuccessFormula[index]);
        }
    }

    private void saveCurCartoon(DataOutputStream out) throws Exception
    {
        for(int index = 0, cnt = curCartoon.length; index < cnt; index++)
        {
            if(curCartoon[index] != null)
            {
                out.writeBoolean(true);
                out.writeShort(curCartoon[index].ani.id);
                out.writeShort(curCartoon[index].actId);
                out.writeShort(curCartoon[index].x);
                out.writeShort(curCartoon[index].y);
                out.writeBoolean(isStopScript[index]);
                out.writeUTF(cartoonName[index]);
                out.writeBoolean(isEndDel[index]);
                continue;
            }
            out.writeBoolean(false);
        }
    }

    private void loadCurCartoon(DataInputStream in) throws Exception
    {
        curCartoon = new PaintUnit[CURCARTOON_MAX_CONT];
        isStopScript = new boolean[CURCARTOON_MAX_CONT];
        cartoonName = new String[CURCARTOON_MAX_CONT];
        isEndDel = new boolean[CURCARTOON_MAX_CONT];
        for(int index = 0; index < CURCARTOON_MAX_CONT; index++)
        {
            if(!in.readBoolean())
            {
                continue;
            }
            curCartoon[index] = new PaintUnit();
            aniMgr.getAnimation(in.readShort(), curCartoon[index]);
            curCartoon[index].actId = in.readShort();
            curCartoon[index].x = in.readShort();
            curCartoon[index].y = in.readShort();
            isStopScript[index] = in.readBoolean();
            cartoonName[index] = in.readUTF();
            isEndDel[index] = in.readBoolean();
            curCartoon[index].initFrame();
        }
    }

    boolean readingGame = false;
    /**
     * 读取游戏进程
     * @param in
     * @throws java.lang.Exception
     */
    public void readGameProgress(DataInputStream in) throws Exception
    {
        //忽略两个值
        in.readInt();
        in.readShort();
        in.readInt();
        mapName = in.readUTF().toCharArray();
        //#if N73
//#         readingGame = true;
//#         showSceneSwitch(107);
        //#endif
        roleMgr.initRole();
        roleMgr.load(in);
        GameContext.map.loadScene(in);
        showMapName();

        GameContext.actor.readActorData(in);
        MissionManager.getInstance().readMission(in);
        GameContext.loadVars(in);
        EffortManager.getInstance().loadEffort(in);
        MusicPlayer.getInstance().load(in);
        //载入当前脚本
        boolean hasScript = in.readBoolean();
        if(hasScript) {
            String fileName = in.readUTF();
            script = new ScriptEngine(fileName);
            script.pc = in.readInt();
        }

        //读取防护罩相关
        observerMode = in.readBoolean();
        //人为设置为false
        observerMode = false;
        sceneMode = in.readBoolean();

        //读取获得礼包的次数和奖励金钱
        getGiftCount = in.readShort();
        giftMoney = in.readInt();
        giftTime = in.readInt();

        //储存炼化的火焰等级
        artificeFireMaxLv = in.readInt();

        setSceneEffortType(in.readInt(), in.readBoolean(), in.readInt(), in.readInt());
        loadCurCartoon(in);

        teachOverArtifice = in.readBoolean();
        teachOverEnchant = in.readBoolean();
        teachOverGift = in.readBoolean();
        isNotSaleItem = in.readBoolean();
        teachOverFormula = in.readBoolean();
        useShop = in.readBoolean();
        for (int index = 0; index < FORMULA_CNT; index++) {
            isSuccessFormula[index] = in.readBoolean();
        }
    }

    public void sleep()
    {
        try
        {
            Thread.sleep(50);
        }
        catch (Exception ex)
        {

        }
    }
    public void setVibration()
    {
        if(isVibration)
        {
            return;
        }
        if(!isVibration && vibrationCount == 1)
        {
            return;
        }
        isVibration = true;
        vibrationCount = 0;
    }

    public void showFlashNote(String str) {
        showFlashNote(str.toCharArray());
    }

    public void showFlashNote(char[] chs) {
        flashNoteChs[flashNoteEndIdx] = chs;
        flashNoteEndIdx++;
        if(flashNoteEndIdx >= FLASH_NOTE_CNT) {
            flashNoteEndIdx = 0;
        }
        flashNoteCnt++;

        showFlashNote = true;
    }

    private void drawFlashNote(Graphics g) {
        if(!showFlashNote) {
            return;
        }
        char[] note = flashNoteChs[flashNoteStartIdx];
        int flashNoteWidth = font.charsWidth(note);
        final int LEFT_X = 3;
        final int TOP_Y = SCREEN_HEIGHT - 70;
        final int MARGIN_X = 5;
        final int FRAME_WIDTH = 2;
        final int BOX_HEIGHT = FishFont.FONT_HEIGHT + (FishFont.LINE_MARGIN << 1) + (FRAME_WIDTH << 1);
        final int BOX_WIDTH = flashNoteWidth + (FRAME_WIDTH << 1) + (MARGIN_X << 1);

        final int FRAME_COLOR = (255 << 16) | (215 << 8) | 107;
        g.setColor(FRAME_COLOR);
        g.fillRect(LEFT_X, TOP_Y - flashNoteTopY, BOX_WIDTH, BOX_HEIGHT);

        final int BACK_COLOR = (8 << 16) | (27 << 8) | 16;
        g.setColor(BACK_COLOR);
        g.fillRect(LEFT_X + 2, TOP_Y - flashNoteTopY + 2, BOX_WIDTH - 4, BOX_HEIGHT - 4);
        g.setColor(0xffffff);
        font.drawChars(
                g,
                note,
                LEFT_X + FRAME_WIDTH + MARGIN_X,
                TOP_Y + FRAME_WIDTH + FishFont.LINE_MARGIN - flashNoteTopY);

        if(flashNoteTopY < BOX_HEIGHT) {
            flashNoteTopY += 3;
            if(flashNoteTopY >= BOX_HEIGHT) {
                flashNoteTopY = 0;
                flashNoteStartIdx++;
                if(flashNoteStartIdx >= FLASH_NOTE_CNT)
                {
                    flashNoteStartIdx = 0;
                }
                flashNoteCnt--;
                if(flashNoteCnt == 0) {
                    showFlashNote = false;
                    flashNoteStartIdx = 0;
                    flashNoteEndIdx = 0;
                }
            }
        }
    }

    /**
     * 检测对话逻辑
     */
    private void updateNpcTalk()
    {
        if(!checkingTalkNpc)
        {
            return;
        }
        if(GameContext.script != null && !GameContext.script.isEnd())
        {
            return;
        }
        checkingTalkNpc = false;
        if (talkNpc != null)
        {
            if (!talkNpc.canPass) {//npc不能穿越，该npc为固定物体，与它对话不改变方向
                talkNpc = null;
                return;
            }
            talkNpc.dir = talkNpcOldDir;
            if(talkNpc.bufferAni == null || talkNpc.isResumeAct)
            {
                talkNpc.changeDir();
            }
            talkNpc = null;
        }
    }

    /**
     * 检测宝箱逻辑
     * @param boxName
     * @param boxStatus
     */
    public void setBoxStatus(String boxName, int boxStatus)
    {
        final int BOX_CLOSE = 0;
        final int BOX_OPEN = 1;
        final int BOX_DEL = 2;
        ChestBox box = roleMgr.getChestBox(boxName);
        if(box == null) {
            return;
        }
        switch(boxStatus) {
            case BOX_CLOSE:
                box.status = Role.STAND_STATUS;
                box.resetAction();
                break;

            case BOX_DEL:
                StringBuffer buf = new StringBuffer();
                buf.append(boxName).append(mapName);
                GameContext.setVar(buf.toString(), 1);
                roleMgr.removeChestBox(box);
                GameContext.groundMat.removeUnit(box);
                break;

            case BOX_OPEN:
                box.status = Role.DEAD_STATUS;
                box.resetAction();
                box.initFrame();
                break;
        }
    }

    private void initAttackedNumbers() {
        //每个数占五个字节的位置
        attackedNums = new byte[ATTACKED_ITEMS * NUM_WIDTH];
        attackedOffsets = new byte[ATTACKED_ITEMS];
        attackedHeights = new short[ATTACKED_ITEMS];
        attackedBigs = new boolean[ATTACKED_ITEMS];
        attackedRoles = new Role[ATTACKED_ITEMS];
        attackedNumCnts = new byte[ATTACKED_ITEMS];
        attackedNexts = new byte[ATTACKED_ITEMS];
        attackedPrevs = new byte[ATTACKED_ITEMS];
        attackedFrames = new byte[ATTACKED_ITEMS];
        int offset = 0;
        for(int i = 0; i < ATTACKED_ITEMS; i++) {
            attackedOffsets[i] = (byte)offset;
            offset += NUM_WIDTH;
        }
    }

    /**
     * 添加一个攻击数字
     * @param role 角色
     * @param num 数字
     * @param isBig 是否是暴击
     */
    public void addAttackedNumber(Role role, int num, /*boolean isActor,*/ boolean isBig) {
        if(num > MAX_ATTACK_NUM)
        {
            num = MAX_ATTACK_NUM;
        }
        if(attackedItems >= ATTACKED_ITEMS) {
            //#if PRINTDEBUG == 1
            System.out.println("攻击文字个数超过了" + ATTACKED_ITEMS + "个");
            //#endif
            return;
        }

        int idx = 0;

        //尾部不为空
        if(attackedTail >= 0) {
            //找一个空洞
            for(int i = 0; i < ATTACKED_ITEMS; i++) {
                if(attackedRoles[i] == null) {
                    idx = i;
                    break;
                }
            }
        }

//        attackedTypes[idx] = isActor;
        attackedBigs[idx] = isBig;
        attackedRoles[idx] = role;
        role.getPaintBox(PaintUnit.box);
        attackedHeights[idx] = (short)PaintUnit.box.getHeight();
        if(role.y - attackedHeights[idx] - offsetY < 10)
        {
            attackedHeights[idx] >>= 1;
        }

        int offset = attackedOffsets[idx];
        byte inum = 0;
        if(num > 0) {
            for(int tmp = num; tmp != 0; inum++) {
                int reminder = tmp % 10;
                attackedNums[offset + inum] = (byte)reminder;
                tmp /= 10;
            }
        }
        attackedNumCnts[idx] = inum;
        attackedFrames[idx] = 0;

        attackedNexts[idx] = -1;
        attackedPrevs[idx] = (byte)attackedTail;

        if(attackedHead < 0) {
            attackedHead = idx;
        }

        if(attackedTail >= 0) {
            attackedNexts[attackedTail] = (byte)idx;
        }
        attackedTail = idx;
        attackedItems++;
    }

    private void updateAttackedNumbers() {
        if(attackedHead < 0) {
            return;
        }

        for(int i = attackedHead; i >= 0; ) {
            attackedFrames[i]++;
            byte next = attackedNexts[i];
            final int FRAME_CNT = attackedBigs[i] ? BIG_ATTACKED_FRAMES : ATTACKED_FRAMES;
            if(attackedFrames[i] >= FRAME_CNT) {
                attackedRoles[i] = null;
                int offset = attackedOffsets[i];
                for(int inum = 0; inum < NUM_WIDTH; inum++) {
                    attackedNums[offset + inum] = 0;
                }
                byte prev = attackedPrevs[i];

                attackedNexts[i] = -1;
                attackedPrevs[i] = -1;
                attackedFrames[i] = 0;

                attackedItems--;
                if(attackedItems == 0) {
                    attackedTail = -1;
                }

                if(attackedHead == i) {
                    attackedHead = next;
                    if(next >= 0) {
                        //下一个的前指针置空
                        attackedPrevs[next] = -1;
                    }
                    i = next;
                    continue;
                }
                attackedNexts[prev] = next;
                if (next == -1) {
                    attackedTail = prev;
                    return;
                }
                attackedPrevs[next] = prev;
            }
            i = next;
        }
    }

    private void drawAttackedNumbers(Graphics g){
        if(attackedItems == 0) {
            return;
        }

        for(int idx = attackedHead; idx >= 0; idx = attackedNexts[idx]) {
            int frame = attackedFrames[idx];
            Role role = attackedRoles[idx];

            int x = role.x - offsetX;
            int offset = attackedOffsets[idx];
            int numCnt = attackedNumCnts[idx];
            if(attackedBigs[idx])
            {
                final int[] BIG_ATTACK_NUM_ID = {0, 2, 1, 1, 1, 1, 2, 2};
                final int[] ATTACK_NUM_OFFSET_Y = {0, 17, 5, 5, 9, 9, 6, 6};
                final int bigAttackNumId = BIG_ATTACK_NUM_ID[frame];
                final int ATTACK_NUM_WIDTH = imgBigAttackedNum[bigAttackNumId].getWidth() / 10;
                final int ATTACK_NUM_HEIGHT = imgBigAttackedNum[bigAttackNumId].getHeight();
                int y = role.y - attackedHeights[idx] - offsetY + ACTOR_STATE_HEIGHT - ATTACK_NUM_HEIGHT - ATTACK_NUM_OFFSET_Y[frame];
                int leftX = x + ((numCnt * ATTACK_NUM_WIDTH) >> 1) - ATTACK_NUM_WIDTH;
                for(int i = 0; i < numCnt; i++) {
                    Util.drawClipImage(g, imgBigAttackedNum[bigAttackNumId], leftX, y, ATTACK_NUM_WIDTH * attackedNums[offset + i], 0, ATTACK_NUM_WIDTH, ATTACK_NUM_HEIGHT);
                    leftX -= ATTACK_NUM_WIDTH - 2;
                }
                int unitX = x - 24;
                int unitY = role.y - attackedHeights[idx] - offsetY + ACTOR_STATE_HEIGHT + 24;
                int[] unitFrame = {0, 1, 2, 2, 3, 3, 4, 4};
                bigAttackedUnit.ani.drawFrame(g, 0, unitFrame[frame], unitX, unitY, bigAttackedUnit);
                return;
            }

            final int[] ATTACK_NUM_OFFSET_Y = {0, 12, 14};
            final int ATTACK_NUM_WIDTH = imgAttackedNum.getWidth() / 10;
            final int ATTACK_NUM_HEIGHT = imgAttackedNum.getHeight();
            int y = role.y - attackedHeights[idx] - offsetY + ACTOR_STATE_HEIGHT - ATTACK_NUM_HEIGHT - ATTACK_NUM_OFFSET_Y[frame];
            int leftX = x + ((numCnt * ATTACK_NUM_WIDTH) >> 1) - ATTACK_NUM_WIDTH;
            for(int i = 0; i < numCnt; i++) {
                Util.drawClipImage(g, imgAttackedNum, leftX, y, ATTACK_NUM_WIDTH * attackedNums[offset + i], 0, ATTACK_NUM_WIDTH, ATTACK_NUM_HEIGHT);
                leftX -= ATTACK_NUM_WIDTH - 2;
            }
        }
    }

    public void initTalk() {
        Rect box = new Rect();
        startPart = 0;
        startCh = 0;
        endPart = 0;
        endCh = 0;
        talkScrollTime = TALK_SCROLL_MAX_TIME;
        isTalk = true;
        if(talkFaceAniId <= 0) {
            talkFaceAniId = 0;
            return;
        }
        aniMgr.getAnimation(talkFaceAniId, talkFaceAni);
        talkFaceAni.actId = talkExpressionId;
        talkFaceAni.resetFrame();
        talkFaceAni.getPaintBox(box);
        talkFaceImgWidth = box.getWidth();
        if(isTalkFaceLeft) {
            talkFaceAni.x = -box.getLeftX();
            talkFaceAniX = -talkFaceImgWidth;
        }
        else {
            talkFaceAni.x = SCREEN_WIDTH - box.getRightX();
            talkFaceAniX = talkFaceImgWidth;
        }
        talkFaceAni.y = TALK_Y;
        if (talkFaceAniId == talkFaceAniIdOld && talkExpressionId == talkExpressionIdOld) {
            talkFaceAniX = 0;
        }
        talkFaceAniIdOld = talkFaceAniId;
        talkExpressionIdOld = talkExpressionId;
    }

    public void initTalkFaceId() {
        talkFaceAniIdOld = 0;
        talkExpressionIdOld = 0;
    }

    public void jumpToCameraPosition() {
        offsetX = moveCameraX;
        offsetY = moveCameraY;
        if(GameContext.map.minOffsetX != 0)
        {
            offsetX = GameContext.map.minOffsetX;
        }
        if(GameContext.map.minOffsetY != 0)
        {
            offsetY = GameContext.map.minOffsetY;
        }
    }

    public void resetMoveCameraPosition(int x, int y) {
        //转换为左上角坐标
        moveCameraX = x - (showWidth >> 1);
        moveCameraY = y - (showHeight >> 1);

        if(moveCameraX < 0)
        {
            moveCameraX = 0;
        } else if(GameContext.map.width - showWidth <= moveCameraX && GameContext.map.width >= showWidth)
        {
            moveCameraX = GameContext.map.width - showWidth;
        }

        if(moveCameraY < 0)
        {
            moveCameraY = 0;
        } else if(GameContext.map.height - showHeight <= moveCameraY && GameContext.map.height >= showHeight)
        {
            moveCameraY = GameContext.map.height - showHeight;
        }
    }

    private int lastMoveX;
    private int lastMoveY;
    private int maxCameraSpeedX;
    private int maxCameraSpeedY;
    private int moveCameraTime;
    public void startMoveCamera(ScriptEngine script, int x, int y, int speed) {
        this.script = script;
        resetMoveCameraPosition(x, y);
        movingCamera = true;
        int lengthX = Math.abs(moveCameraX - offsetX);
        int lengthY = Math.abs(moveCameraY - offsetY);
        int maxLength = lengthX > lengthY ? lengthX : lengthY;
        int minLength = lengthX < lengthY ? lengthX : lengthY;
        moveCameraTime = maxLength / speed;
        if(moveCameraTime == 0)
        {
            moveCameraTime = 1;
        }
        int minSpeed = minLength / moveCameraTime;
        if(minSpeed < 1)
        {
            minSpeed = 1;
        }
        if(lengthX == maxLength)
        {
            maxCameraSpeedX = speed;
            maxCameraSpeedY = minSpeed;
            cameraSpeedX = (moveCameraX >= offsetX) ? speed : (-speed);
            cameraSpeedY = (moveCameraY >= offsetY) ? minSpeed : (-minSpeed);
        }
        else
        {
            maxCameraSpeedX = minSpeed;
            maxCameraSpeedY = speed;
            cameraSpeedX = (moveCameraX >= offsetX) ? minSpeed : (-minSpeed);
            cameraSpeedY = (moveCameraY >= offsetY) ? speed : (-speed);
        }
        lastMoveX = 0;
        lastMoveY = 0;
        if(x != moveCameraX)
        {
            lastMoveX = lengthX % Math.abs(maxCameraSpeedX) ;
        }
        if(y != moveCameraY)
        {
            lastMoveY = lengthY % Math.abs(maxCameraSpeedY);
        }
        if(GameContext.map.minOffsetX != 0)
        {
            moveCameraX = offsetX;
        }
        if(GameContext.map.minOffsetY != 0)
        {
            moveCameraY = offsetY;
        }
//        lastMoveX = lengthX % Math.abs(maxCameraSpeedX) + Math.abs(maxCameraSpeedX);
//        lastMoveY = lengthY % Math.abs(maxCameraSpeedY) + Math.abs(maxCameraSpeedY);
    }

    private void updateMoveCamera() {
        if(offsetX == moveCameraX && offsetY == moveCameraY)
        {
            movingCamera = false;
            if (script != null)
            {
                boolean isRemind = script.remind(ScriptEngine.MOVE_CAMERA, 0, 0, null);
                if(!isRemind)
                {
                    isRemind = script.remind(ScriptEngine.RESUME_CAMERA, 0, 0, null);
                }
                if(!isRemind)
                {
                    isRemind = script.remind(ScriptEngine.MOVE_CAMERA_TO_ROLE, 0, 0, null);
                }
                if(isRemind)
                {
                    script = null;
                }
            }
            return;
        }
        final int TIME = 1 + (moveCameraTime  / 3);
        if(offsetX != moveCameraX) {
            int distX = Math.abs(offsetX - moveCameraX);
            if(distX <= lastMoveX)
            {
                boolean isPlus = cameraSpeedX > 0;
                cameraSpeedX = lastMoveX / TIME;
                if(cameraSpeedX == 0)
                {
                    cameraSpeedX = isPlus ? 1 : -1;
                }
                else if(!isPlus)
                {
                    cameraSpeedX *= -1;
                }
            }
            if (distX < Math.abs(cameraSpeedX))
            {
                offsetX = moveCameraX;
                return;
            }
            else
            {
                offsetX += cameraSpeedX;
            }
        }

        if(offsetY != moveCameraY) {
            int distY = Math.abs(offsetY - moveCameraY);
            if(distY <= lastMoveY)
            {
                boolean isPlus = cameraSpeedY > 0;
                cameraSpeedY = lastMoveY / TIME;
                if(cameraSpeedY == 0)
                {
                    cameraSpeedY = isPlus ? 1 : -1;
                }
                else if(!isPlus)
                {
                    cameraSpeedY *= -1;
                }
            }
            if (distY < Math.abs(cameraSpeedY))
            {
                offsetY = moveCameraY;
                return;
            }
            else
            {
                offsetY += cameraSpeedY;
            }
        }
    }

    /**
     * 设置gameover状态
     * @param str
     */
    public void setGameOver(String str)
    {
        if(MainCanvas.pageCnt > 1)
        {
            MainCanvas.removePage();
        }
        if(pause)
        {
            pause = false;
        }
        isGameOver = true;
        isCanOverMain = false;
        showSceneSwitch(11);
        gameOverChar = str.toCharArray();
        if (!GameContext.isPassGame && str.indexOf("通关") != -1) {
            GameContext.isPassGame = true;
            GameContext.saveGamePass();
        }
    }

    private void drawSelectTalk(Graphics g)
    {
        if(!isSelectTalk)
        {
            return;
        }
        drawTalkBack(g);
        int y = TXT_Y;
        for(int index = 0; index < selectTalk.length; index ++)
        {
            if(selectTalkIndex == index)
            {
                g.setColor(0xff0000);
//                font.drawString(g, (index + 1) + ".", TXT_MARGIN_X - 2, y, Graphics.LEFT | Graphics.TOP);
                drawSelectTalkLine(g, selectTalk[index], TXT_MARGIN_X + 10, y, TXT_WIDTH - 10, FishFont.FONT_HEIGHT, 0xff0000, 0xF8382F, 0xf7ffe8, 1);
//                font.drawTxtWithColor(g, selectTalk[index], 0, selectTalk[index].length, TXT_WIDTH, FishFont.FONT_HEIGHT, TXT_MARGIN_X, y, 0xff0000, 0xF8382F, 0xf7ffe8, 1);
            }
            else
            {
                g.setColor(0x3e403f);
//                font.drawString(g, (index + 1) + ".", TXT_MARGIN_X - 2, y, Graphics.LEFT | Graphics.TOP);
                font.drawTxtWithColor(g, selectTalk[index], 0, selectTalk[index].length, TXT_WIDTH - 10, FishFont.FONT_HEIGHT, TXT_MARGIN_X + 10, y, 0x3e403f, 0xF8382F, 0xf7ffe8, 1);
            }
            y += FishFont.FONT_HEIGHT + 1;
        }
//        selectTalkMoreAni.paint(g, 0, 0);
//        selectTalkMoreAni.update();
    }

    int drawSelectTalkCount;
    int drawSelectTalkLineDis;
    private void drawSelectTalkLine(Graphics g, char[] c, int x, int y, int width, int height, int colorWord, int colorOther, int BORDER_CLR, int eachWidth)
    {
        int wordWidth = font.charsWidth(c);
        if(wordWidth < width)
        {
            font.drawTxtWithColor(g, c, 0, c.length, width, height, x, y, colorWord, colorOther, BORDER_CLR, eachWidth);
            return;
        }
        g.setClip(x, y, width, height);
        font.drawTxtWithColor(g, c, 0, c.length, width + drawSelectTalkLineDis, height, x - drawSelectTalkLineDis, y, colorWord, colorOther, BORDER_CLR, eachWidth);
        drawSelectTalkCount++;
        if(drawSelectTalkCount < 10)
        {
            g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            return;
        }
        drawSelectTalkLineDis += 3;
        if(drawSelectTalkLineDis >= wordWidth)
        {
            drawSelectTalkLineDis = -(x + (width >> 1));
        }
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    

    final int BACK_HEIGHT = 80;
    final int TXT_MARGIN_Y = 14;
    final int TXT_MARGIN_X = 27;
    final int TXT_LINE_CNT = 2;
    final int TXT_DIS = 30;
    final int TALK_Y = SCREEN_HEIGHT - BACK_HEIGHT;
    final int TXT_Y = TALK_Y + TXT_MARGIN_Y;
    final int TXT_WIDTH = SCREEN_WIDTH - (TXT_MARGIN_X << 1);
    final int TXT_RIGHT_X = TXT_MARGIN_X + TXT_WIDTH;
    private void drawTalkBack(Graphics g)
    {
        for (int index = 0; index < MASK_CNT + 2; index++) {
            g.drawImage(imgTalkBack, index * imgTalkBack.getWidth(), TALK_Y, 0);
        }
        int BOTTOM_LINE_Y = SCREEN_HEIGHT - 5;
        g.setColor(0);
        g.drawLine(0, TALK_Y, SCREEN_WIDTH, TALK_Y);
        g.drawLine(0, BOTTOM_LINE_Y, SCREEN_WIDTH, BOTTOM_LINE_Y);
        g.setColor(0xc6a677);
        g.drawLine(0, TALK_Y + 1, SCREEN_WIDTH, TALK_Y + 1);
        g.drawLine(0, BOTTOM_LINE_Y + 1, SCREEN_WIDTH, BOTTOM_LINE_Y + 1);
        g.setColor(0x887267);
        g.fillRect(0, TALK_Y + 2, SCREEN_WIDTH, 2);
        g.fillRect(0, BOTTOM_LINE_Y + 2, SCREEN_WIDTH, 2);
        g.setColor(0);
        g.drawLine(0, TALK_Y + 4, SCREEN_WIDTH, TALK_Y + 4);
        g.drawLine(0, BOTTOM_LINE_Y + 4, SCREEN_WIDTH, BOTTOM_LINE_Y + 4);

        final int NAME_BACK_W = imgTalkNameBack.getWidth();
        final int NAME_BACK_H = imgTalkNameBack.getHeight();
        int NAME_X = 5;
        final int NAME_Y = TALK_Y - 2 - NAME_BACK_H;
        if(talkFaceAniId > 0) {
            talkFaceAni.paint(g, -talkFaceAniX, 0);
            if (isTalkFaceLeft) {
                NAME_X = talkFaceImgWidth + NAME_X + talkFaceAniX;
                if (talkFaceAniX != 0) {
                    talkFaceAniX += talkFaceImgWidth >> 2;
                    talkFaceAniX = (talkFaceAniX > 0) ? 0 : talkFaceAniX;
                }
            }
            else {
                NAME_X = SCREEN_WIDTH - (NAME_BACK_W << 1) - talkFaceImgWidth - NAME_X + talkFaceAniX;
                if (talkFaceAniX != 0) {
                    talkFaceAniX -= talkFaceImgWidth >> 2;
                    talkFaceAniX = (talkFaceAniX < 0) ? 0 : talkFaceAniX;
                }
            }
        }
        g.drawImage(imgTalkNameBack, NAME_X, NAME_Y, 0);
        Util.drawRegion(g, imgTalkNameBack, 0, 0, NAME_BACK_W, imgTalkNameBack.getHeight(), Sprite.TRANS_MIRROR, NAME_X + NAME_BACK_W, NAME_Y, 0);
        g.setColor(0xf2edd0);
        font.drawChars(g, nameChs, NAME_X + NAME_BACK_W, NAME_Y + ((NAME_BACK_H - FishFont.FONT_HEIGHT) >> 1), Graphics.HCENTER | Graphics.TOP);

        if (talkScrollTime > 0) {
            talkScrollTime--;
        }
    }

    private void drawTalk(Graphics g) {
        if(!isTalk) {
            return;
        }
        drawTalkBack(g);
        //#if MEMORY == 1 && (N7370 || N7370small)
//#         endPart = font.drawTxtWithColorWithoutFont(g, talkChs, startPart, talkChs.length, TXT_WIDTH, FishFont.FONT_SMALL.getHeight() * TXT_LINE_CNT, TXT_MARGIN_X, TXT_Y, 0xfffeff, 0xF8382F, -1, 1);
        //#else
        endPart = font.drawTxtWithColor(g, talkChs, startPart, talkChs.length, TXT_WIDTH, TXT_DIS * (TXT_LINE_CNT - 1) + FishFont.FONT_HEIGHT, TXT_MARGIN_X, TXT_Y, 0xfffeff, 0xF8382F, -1, 1, TXT_DIS);
        //#endif
        talkMoreAni.paint(g, 0, 0);
        talkMoreAni.update();
    }
    public int wocaX = 0;
    public int wocaY = 0;
    public int wocaW = 0;
    public int wocaH = 0;
    public int kind = 0;

    public void kuang(int x, int y, int w, int h, int kind) {
        this.wocaX = x;
        this.wocaY = y;
        this.wocaW = w;
        this.wocaH = h;
        this.kind = kind;
    }

    public void kuang(Graphics g) {
        if (kind == 1) {
            g.setColor(0xFF0000);
        } else {
            g.setColor(0x00FF00);
        }
        g.drawRect(wocaX, wocaY, wocaW, wocaH);
    }
    public void paint(Graphics g) {
        switch(status) {
            case SAVE_STATUS:
            case GAME_STATUS:
                paintGame(g);
                kuang(g);
                break;
        }
    }

    /**
     * 在loading过程中预读入所有的图片
     */
    private void loadImages() {
        //去掉余数，会有误差，此处加1，确保完全覆盖屏幕
        int MASK_WIDTH = (SCREEN_WIDTH / MASK_CNT) + 2;
        int MASK_HEIGHT = SCREEN_HEIGHT;
        int TRANSPARENCY = 65;
        int MASK_COLOR = 0;
        imgMask = GameContext.createMaskImage(MASK_WIDTH, MASK_HEIGHT, MASK_COLOR, TRANSPARENCY);

        MASK_WIDTH = SCREEN_WIDTH / MASK_CNT;
        MASK_HEIGHT = BACK_HEIGHT;
        TRANSPARENCY = 70;
        MASK_COLOR = 0x25255c;
        imgTalkBack = GameContext.createMaskImage(MASK_WIDTH, MASK_HEIGHT, MASK_COLOR, TRANSPARENCY);
        imgTalkNameBack = imgMgr.getImage((short)269);

        talkMoreAni = new PaintUnit();
        final short TALK_MORE_ANI = 131;
        aniMgr.getAnimation(TALK_MORE_ANI, talkMoreAni);
        talkMoreAni.x = SCREEN_WIDTH - 20;
        talkMoreAni.y = SCREEN_HEIGHT - 7;
        talkMoreAni.resetFrame();

//        selectTalkMoreAni = new PaintUnit();
//        final short SELECT_TALK_MORE_ANI = 137;
//        aniMgr.getAnimation(SELECT_TALK_MORE_ANI, selectTalkMoreAni);
//        selectTalkMoreAni.x = SCREEN_WIDTH - 18;
//        selectTalkMoreAni.y = SCREEN_HEIGHT - 7;
//        selectTalkMoreAni.resetFrame();
//
        tipPaint = new PaintUnit();
        final short BROW_PAINT = 122;
        aniMgr.getAnimation(BROW_PAINT, tipPaint);
        tipPaint.actId = 2;
//
//        addCartoon = new PaintUnit();
//        final short ADD_CARTOON_ID = 140;
//        aniMgr.getAnimation(ADD_CARTOON_ID, addCartoon);
//        addCartoon.initFrame();
//
//        actorLevelUpAni = new PaintUnit();
//        final short ACTOR_UP_ID = 141;
//        aniMgr.getAnimation(ACTOR_UP_ID, actorLevelUpAni);
//        actorLevelUpAni.initFrame();
//
//
        beattackFile = new PaintUnit();
        final short BEATTACK_ID = 86;
        aniMgr.getAnimation(BEATTACK_ID, beattackFile);
        beattackFile.initFrame();

        imgAttackedNum = imgMgr.getImage((short)232);
        imgBigAttackedNum = new Image[3];
        imgBigAttackedNum[0] = imgMgr.getImage((short)233);
        imgBigAttackedNum[1] = imgMgr.getImage((short)234);
        imgBigAttackedNum[2] = imgMgr.getImage((short)231);
        bigAttackedUnit = new PaintUnit();
        final short BIG_ATTACKED_ID = 125;
        aniMgr.getAnimation(BIG_ATTACKED_ID, bigAttackedUnit);
        bigAttackedUnit.initFrame();

        short COMBO_IMG_ID = 236;
        imgComboIcon = imgMgr.getImage(COMBO_IMG_ID++);
        imgComboLine = new Image[3];
        for (int index = 0; index < imgComboLine.length; index++) {
            imgComboLine[index] = imgMgr.getImage(COMBO_IMG_ID++);
        }
        imgComboNumSmall = imgMgr.getImage(COMBO_IMG_ID++);
        imgComboNumBig = imgMgr.getImage(COMBO_IMG_ID++);

//
//        imgTalkLine = imgMgr.getImage((short) 227);
//        imgTalkPos = imgMgr.getImage((short) 229);
//        imgTalkButton = imgMgr.getImage((short) 228);
//        imgTalk = imgMgr.getImage((short) 30);

        final short[] ANI_ID = {145,146};
        for(int effortIndex = 0, length = attackEffectIcon.length; effortIndex < length; effortIndex++)
        {
            attackEffectIcon[effortIndex] = new PaintUnit();
            aniMgr.getAnimation(ANI_ID[effortIndex], attackEffectIcon[effortIndex]);
            attackEffectIcon[effortIndex].actId = 0;
            attackEffectIcon[effortIndex].initFrame();
        }
        loadMenuImages();
        loadMenuResources();
        loadActorStateImages();
        loadMenuBtnsImages();
        loadKeypadImages();
        loadEffortImages();
    }
    
  
    public void setDrawActorLv()
    {
        isDrawActorUplv = true;
        if(actorLevelUpAni != null) {
            actorLevelUpAni.resetFrame();
        }
    }

    private void drawActorLevelUp(Graphics g)
    {
        if (true) {
            return;
        }
        if(!isDrawActorUplv)
        {
            return;
        }
        actorLevelUpAni.x = GameContext.actor.x;
        actorLevelUpAni.y = GameContext.actor.y + 40;
        actorLevelUpAni.paint(g, offsetX, offsetY);
        actorLevelUpAni.playNextFrame();
        if(actorLevelUpAni.isEndAnimation())
        {
            isDrawActorUplv = false;
        }
    }

    private void drawBossSpeak(Graphics g)
    {
        if(bossSpeakParam == null)
        {
            return;
        }

        final int KEEP_TIME = 30;
        g.setColor(bossSpeakParam.color);
        g.setFont(FishFont.FONT_SMALL);
        int y = 0;
        for(int index = 0, size = bossSpeakParam.parts.length;  index < size; index += 2)
        {
            g.drawChars(
                    bossSpeakParam.chs,
                    bossSpeakParam.parts[index],
                    bossSpeakParam.parts[index + 1],
                    SCREEN_WIDTH >> 1,
                    (SCREEN_HEIGHT >> 1) + y,
                    Graphics.HCENTER | Graphics.BOTTOM);
            y += FishFont.FONT_SMALL.getHeight();
        }
        g.setFont(FishFont.FONT_SMALL);
        bossSpeakCount++;
        if(bossSpeakCount > KEEP_TIME)
        {
            bossSpeakParam = null;
            bossSpeakCount = 0;
        }
    }

    /**
     * 渲染地图
     * @param g
     * @param offsetX
     * @param offsetY
     */
    public void drawMap(Graphics g, int offsetX, int offsetY)
    {
        if (isLightAction)
        {
            final int dis = 20;
            g.setColor(lightActionColor);
            g.fillRect(-dis, -dis, SCREEN_WIDTH + (dis << 1), SCREEN_HEIGHT + (dis << 1));
            return;
        }
        GameContext.map.paint(g, offsetX, offsetY);
    }


    public void setFillScreen(boolean isFillScreen, int color)
    {
        this.isFillScreen = isFillScreen;
        fillColor = color;
    }

    /**
     * 渲染全屏颜色
     * @param g
     */
    private void drawFillScreen(Graphics g)
    {
        g.setColor(fillColor);
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    /**
     * 处理脚本震动计数器
     */
    private void doScriptVibration(Graphics g)
    {
        if(!isScriptVibration)
        {
            return;
        }
        scriptVibrationCount++;
        final int DIS = 3;
        if((scriptVibrationCount & 0x1) == 0)
        {
            g.translate(0, DIS);
            return;
        }
        g.translate(0, -DIS);
    }

    private void drawShowImageBack(Graphics g)
    {
        if(lightActionColor > showImageTime)
        {
            return;
        }
        for(int index = 0, cnt = showBackData.length; index < cnt; index++)
        {
            showBackData[index] &= 0xffffff;
            if(lightActionColor <= showImageTime >> 1)
            {
                showBackData[index] |= (lightActionColor * 15) << 24;
            }
            else
            {
                showBackData[index] |= (0x1fe - lightActionColor * 15) << 24;
            }
        }
        final int width = SCREEN_WIDTH >> 1;
        final int height = SCREEN_HEIGHT >> 1;
        Util.drawRGB(g, showBackData, 0, width, 0, 0, width, height, true);
        Util.drawRGB(g, showBackData, 0, width, 0, height, width, height, true);
        Util.drawRGB(g, showBackData, 0, width, width, 0, width, height, true);
        Util.drawRGB(g, showBackData, 0, width, width, height, width, height, true);
    }

    /**
     * 连击需要图
     */
    private Image imgComboIcon;
    private Image imgComboNumSmall;
    private Image imgComboNumBig;
    private Image[] imgComboLine;

    /**
     * 连击数
     */
    private int comboCount;
    /**
     * 最大连击数
     */
    private int maxComboCount;
    /**
     * 变化之前的连击数
     */
    private int comboOldCount = 1;

    /**
     * 计数器
     */
    private int comboIndex;
    /**
     * 连击状态
     */
    final int COMBO_STAGE_NONE = 0;
    final int COMBO_STAGE_ARISE = 1;
    final int COMBO_STAGE_KEEP = 2;
    final int COMBO_STAGE_CLEAR = 3;
    private int comboStage = COMBO_STAGE_NONE;

    /**
     * 连击数的间隔时间
     */
    private int comboTime;
    /**
     * 此周期之内的都算成功
     */
    private final int COMBO_INTERVAL = 20;
    /**
     * 添加连击数
     */
    public void addComboNum()
    {
        comboTime = MainCanvas.currentFrame;
        comboCount++;
        maxComboCount = maxComboCount > comboCount ? maxComboCount : comboCount;
        if (comboStage == COMBO_STAGE_NONE || comboStage == COMBO_STAGE_CLEAR) {
            comboStage = COMBO_STAGE_ARISE;
            comboIndex = 2;
        }
        else {
            comboStage = COMBO_STAGE_KEEP;
            comboIndex = 0;
        }
    }

    /**
     * 渲染连击数
     * @param g
     */
    private void drawComboNum(Graphics g)
    {
        if(comboStage == COMBO_STAGE_NONE)
        {
            return;
        }
        if (comboStage == COMBO_STAGE_ARISE)
        {
            drawComboNum(g, comboIndex, 0);
            comboIndex++;
            comboStage = COMBO_STAGE_KEEP;
            return;
        }
        if (comboStage == COMBO_STAGE_CLEAR)
        {
            comboIndex++;
            int offX = 15 * comboIndex;
            drawComboNum(g, 0, offX);
            if (comboIndex > 4) {
                initComboData();
            }
            return;
        }
        drawComboNum(g, comboIndex, 0);
        comboIndex++;
        if(MainCanvas.currentFrame - comboTime >= COMBO_INTERVAL)
        {
            comboStage = COMBO_STAGE_CLEAR;
            comboIndex = 0;
        }
    }

    private void drawComboNum(Graphics g, int comboIndex, int offX)
    {
        final int COMBO_X = SCREEN_WIDTH - 58 + offX;
        final int COMBO_Y = 120;
        final int NUM_RIGHT_X = COMBO_X - 9;
        final int NUM_RIGHT_X2 = COMBO_X;
        int numX = NUM_RIGHT_X;
        int numWidth = imgComboNumSmall.getWidth();
        int numHeight = imgComboNumSmall.getHeight() / 10;
        int numBigWidth = imgComboNumBig.getWidth();
        int numBigHeight = imgComboNumBig.getHeight() / 10;
        final int numInterval = -4;
        if (comboIndex == 0 || comboIndex > 4) {
            g.drawImage(imgComboIcon, COMBO_X, COMBO_Y, Graphics.LEFT | Graphics.BOTTOM);
            numX = (comboOldCount > 9) ? NUM_RIGHT_X2 : NUM_RIGHT_X;
            Util.drawNumbersAlignRight(g, comboOldCount, imgComboNumSmall, numWidth, numHeight, numInterval, numX, COMBO_Y - numHeight);
        }
        else if (comboIndex == 1) {
            g.drawImage(imgComboLine[0], COMBO_X - 55, COMBO_Y - 2, 0);
            g.drawImage(imgComboIcon, COMBO_X, COMBO_Y, Graphics.LEFT | Graphics.BOTTOM);
            numX = (comboOldCount > 9) ? NUM_RIGHT_X2 : NUM_RIGHT_X;
            Util.drawNumbersAlignRight(g, comboOldCount, imgComboNumSmall, numWidth, numHeight, numInterval, numX, COMBO_Y - numHeight);
        }
        else if (comboIndex == 2) {
            g.drawImage(imgComboLine[1], COMBO_X - 58, COMBO_Y - 1, 0);
            g.drawImage(imgComboIcon, COMBO_X + 10, COMBO_Y, Graphics.LEFT | Graphics.BOTTOM);
            numX = (comboCount > 9) ? NUM_RIGHT_X2 : NUM_RIGHT_X;
            Util.drawNumbersAlignRight(g, comboCount, imgComboNumBig, numBigWidth, numBigHeight, numInterval - 1, numX, COMBO_Y - numBigHeight + 5);
            comboOldCount = comboCount;
        }
        else if (comboIndex == 3) {
            g.drawImage(imgComboLine[2], COMBO_X + 22, COMBO_Y - 6, 0);
            g.drawImage(imgComboIcon, COMBO_X + 5, COMBO_Y, Graphics.LEFT | Graphics.BOTTOM);
            numX = (comboCount > 9) ? NUM_RIGHT_X2 : NUM_RIGHT_X;
            Util.drawNumbersAlignRight(g, comboCount, imgComboNumSmall, numWidth, numHeight, numInterval, numX, COMBO_Y - numHeight - 4);
        }
        else if (comboIndex == 4) {
            g.drawImage(imgComboIcon, COMBO_X + 2, COMBO_Y, Graphics.LEFT | Graphics.BOTTOM);
            numX = (comboCount > 9) ? NUM_RIGHT_X2 : NUM_RIGHT_X;
            Util.drawNumbersAlignRight(g, comboCount, imgComboNumSmall, numWidth, numHeight, numInterval, numX, COMBO_Y - numHeight - 2);
        }
    }

    /**
     * 让连击消失
     */
    public void initComboData()
    {
        comboOldCount = 1;
	comboCount = 0;
	comboStage = COMBO_STAGE_NONE;
    }

    private void paintGame(Graphics g) {
        if(isMiniGame)
        {
            GameContext.miniGame.paint(g);
            drawActorState(g);
            drawCurCartoon(g);
            drawTalk(g);
            drawBrowPaintUnit(g);
            drawSceneSwitch(g);
            //#if SMS == 1
            if (sms.isShowing())
            {
                sms.paint(g);
                if (dlg.isAvailable())
                {
                    dlg.paint(g);
                }
                return;
            }
            //#endif
            if (dlg.isAvailable())
            {
                dlg.paint(g);
            }
            if (isGameOver && isCanOverMain)
            {
                drawGameOver(g);
                return;
            }
            return;
        }

        if(isGameOver && isCanOverMain) {
            drawGameOver(g);
            return;
        }

        if(showSubtitle) {
            showSubtitlePaint(g);
            return;
        }

        if(isFillScreen)
        {
            doScriptVibration(g);
            drawFillScreen(g);
            if(!(movieMode && movieModeOffsetFlag == 4)) {
                g.translate(0, ACTOR_STATE_HEIGHT);
            }
            drawCurCartoon(g);
            drawCartoonWithAlpha(g);
            g.translate(-g.getTranslateX(), -g.getTranslateY());
            drawTalk(g);
            drawSelectTalk(g);
            if (dlg.isAvailable())
            {
                dlg.paint(g);
            }
            return;
        }

        //#if PRINTDEBUG == 1
        long start = System.currentTimeMillis();
        //#endif

        doScriptVibration(g);
        doVibration(g);
        if(!(movieMode && movieModeOffsetFlag == 4)) {
            g.translate(0, ACTOR_STATE_HEIGHT);
        }
        drawMap(g, offsetX, offsetY);
        long end = System.currentTimeMillis();
        //#if PRINTDEBUG == 1
        MainCanvas.debugs[0] = end - start;
        start = System.currentTimeMillis();
        //#endif
        GameContext.undergroundMat.paint(g, offsetX, offsetY);
        //#if PRINTDEBUG == 1
        end = System.currentTimeMillis();
        MainCanvas.debugs[1] = end - start;
        start = System.currentTimeMillis();
        //#endif
        GameContext.groundMat.paint(g, offsetX, offsetY);
        GameContext.map.drawChannelMark(g, offsetX, offsetY);
        //#if PRINTDEBUG == 1
        end = System.currentTimeMillis();
        MainCanvas.debugs[2] = end - start;
        start = System.currentTimeMillis();
        //#endif
        drawBrowPaintUnit(g);
        GameContext.map.drawMapItem(g, offsetX, offsetY);
        GameContext.flyMat.paint(g, offsetX, offsetY);
        drawCurCartoon(g);
        drawCartoonWithAlpha(g);
        //#if PRINTDEBUG == 1
        end = System.currentTimeMillis();
        MainCanvas.debugs[3] = end - start;
        //#endif
        drawBeattackRolePos(g);
        //绘制地图名字
        drawMapName(g);
        //当不对话时再显示这些，否则用户看不到，信息会重复
        if(!isTalk && !isSelectTalk) {
            drawFlashNote(g);
        }
        drawLight(g);
        drawSceneEffort(g);
        drawBossSpeak(g);
        drawActorLevelUp(g);

        g.translate(-g.getTranslateX(), -g.getTranslateY());
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        drawActorState(g);
        drawAttackedNumbers(g);
        drawMovieMode(g);
        drawSceneSwitch(g);
        drawBossHp(g);
        drawComboNum(g);

        //#if SMS == 1 || SMS == 2
        if(sms.isShowing()) {
            sms.paint(g);
            if (dlg.isAvailable())
            {
                dlg.paint(g);
            }
            drawEffortName(g);
            return;
        }
        //#endif
        
        if(showMenu)
        {
            drawMenu(g);
            drawTalk(g);
            drawSelectTalk(g);
            drawTeachTipBox(g);
            if (dlg.isAvailable()) {
                dlg.paint(g);
            }
            drawEffortName(g);
            return;
        }

        drawTalk(g);
        drawSelectTalk(g);
        drawGameBtns(g);
        drawKeypad(g);
        drawTeachTipBox(g);
        if(dlg.isAvailable()) {
            dlg.paint(g);
        }
        drawEffortName(g);
        drawGameTip(g);
        drawMissionLimitTime(g);
        MainCanvas.currentFrame++;
    }

    /**
     * 渲染boss的血条
     */
    private void drawBossHp(Graphics g)
    {
        if(isGameOver || (GameContext.script != null && !GameContext.script.isEnd()))
        {
            return;
        }
        Npc npc = roleMgr.boss;
        if(npc == null)
        {
            return;
        }
        if(!npc.visible)
        {
            return;
        }
        if(!npc.enemy)
        {
            return;
        }
        final int DIS_X = 30;

        final int HP_Y = Page.SCREEN_HEIGHT - 30;
        //#endif
        final int HP_WIDTH = 140;
        final int HP_HEIGHT = 12;
        int hpX = (Page.SCREEN_WIDTH >> 1) - (HP_WIDTH >> 1);
        g.setColor(0x4c0d04);
        g.fillRect(hpX, HP_Y, HP_WIDTH, HP_HEIGHT);
        g.setColor(0xd7e1e0);
        g.fillRect(hpX + 1, HP_Y + 1, HP_WIDTH - 2, HP_HEIGHT - 2);
        g.setColor(0x4b0c03);
        g.fillRect(hpX + 2, HP_Y + 2, HP_WIDTH - 4, HP_HEIGHT - 4);
        g.setColor(0);
        g.fillRect(hpX + 3, HP_Y + 3, HP_WIDTH - 6, HP_HEIGHT - 6);

        if (npc.hp <= 0) {
            npc.hp = 0;
        }
        int curHp = (HP_WIDTH - 8) * npc.hp / npc.maxHp;
        g.setColor(0xba1e07);
        g.fillRect(hpX + 4, HP_Y + 4, curHp, HP_HEIGHT - 8);
        g.setColor(0xef361a);
        g.fillRect(hpX + 4, HP_Y + 4, curHp, 3);
        g.setColor(0xfe816d);
        g.fillRect(hpX + 4, HP_Y + 5, curHp, 1);
        font.drawString(g, npc.name, hpX, HP_Y - 15, 0, 0xfbe432, 0x0);
    }

    String bossName;
    int bossNameWidth;
    public void setBossName(String name)
    {
        bossName = name;
        bossNameWidth = font.charsWidth(name);
    }

    public void showSubtitleInit(int mode, char[] txt, int backClr, int txtClr) {
        showSubtitle = true;
        showSubtitleMode = mode;
        showSubtitleTxt = txt;
        showSubtitleBackClr = backClr;
        showSubtitleTxtClr = txtClr;
        switch (mode) {
            case SUBTITLE_MODE_SCROLL:
                int Y_MARGIN = 20;
                showSubtitleOffset = -(SCREEN_HEIGHT - (Y_MARGIN << 1));
                showSubtitleWaitKey = false;
                break;
            case SUBTITLE_MODE_TYPEWRITTER:
                showSubtitleTxtAlpha = 0xff;
                showSubtitleStartIdx = 0;
                showSubtitleOffset = 0;
                showSubtitleInterval = 2;
                showSubtitleStopKey = false;
                showSubtitleWaitKey = false;
                break;
        }
    }

    private void showSubtitlePaint(Graphics g) {
        Util.clearScreen(g, showSubtitleBackClr);
        drawCurCartoon(g);
        switch (showSubtitleMode) {
            case SUBTITLE_MODE_SCROLL:
                drawScrollUpWords(g);
                break;
            case SUBTITLE_MODE_TYPEWRITTER:
                drawTypeWriterScreen(g);
                break;
        }
    }

    private void drawScrollUpWords(Graphics g) {
        int X_MARGIN = 20;
        int Y_MARGIN = 20;
        int BOX_WIDTH = SCREEN_WIDTH - (X_MARGIN << 1);
        int BOX_HEIGHT = SCREEN_HEIGHT - (Y_MARGIN << 1);
        g.setClip(X_MARGIN, Y_MARGIN, BOX_WIDTH, BOX_HEIGHT);

        int x = X_MARGIN;
        int y = Y_MARGIN - showSubtitleOffset;
        int wordW = BOX_WIDTH;
        int speed = 2;

        g.setClip(X_MARGIN, Y_MARGIN, BOX_WIDTH, BOX_HEIGHT);
        int txtHeight = font.drawTxtWithColor(g, showSubtitleTxt, wordW, x, y, showSubtitleTxtClr, 0xff0000, -1);
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        g.setColor(0xFFFFFF);
        font.drawString(g, "跳过", Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT, Graphics.RIGHT | Graphics.BOTTOM);

        if(showSubtitleOffset < 0) {
            showSubtitleOffset += speed;
            return;
        }
        showSubtitleWaitKey = true;
    }

    private void drawTypeWriterScreen(Graphics g) {
        g.setColor(showSubtitleTxtClr);
        font.alpha = showSubtitleTxtAlpha;
        drawTypeWriterText(g, showSubtitleTxt, showSubtitleInterval);
        font.resetAlpha();
        if(showSubtitleStopKey) {
            showSubtitleTxtAlpha -= 25;
            if(showSubtitleTxtAlpha < 0) {
                showSubtitleStopKey = false;
                showSubtitleWaitKey = false;
                showSubtitleTxtAlpha = 0xff;
                showSubtitle = false;
                script.remind(0, 0, null);
            }
        }
        else if (showSubtitleWaitKey){
            g.setColor(0xFFFFFF);
            font.drawString(g, "确定", Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT, Graphics.RIGHT | Graphics.BOTTOM);
        }
        else {
            g.setColor(0xFFFFFF);
            font.drawString(g, "跳过", Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT, Graphics.RIGHT | Graphics.BOTTOM);
        }
    }

    private void drawTypeWriterText(Graphics g, char[] txts, int interval) {
        final int X_MARGIN = 20;
        final int TXT_WIDTH = SCREEN_WIDTH - (X_MARGIN << 1);
        //计算当前屏幕中文字高度
        //#if N7370
//#         int fontHeight = FishFont.FONT_SMALL.getHeight();
        //#else
        int fontHeight = FishFont.LINE_HEIGHT;
        //#endif
        int txtHeight = fontHeight;
        int lineWidth = 0;
        for(int i = showSubtitleStartIdx, size = txts.length; i < size; i++) {
            char ch = txts[i];
            if (ch == '{' || ch == '}') {
                continue;
            }
            if(ch == '&') {
                txtHeight += fontHeight;
                continue;
            }
            //这表示一屏结束
            if(ch == '$') {
                break;
            }
            int chWidth = font.charWidth(ch);
            if(lineWidth + chWidth > TXT_WIDTH) {
                txtHeight += fontHeight;
                lineWidth = chWidth;
                continue;
            }
            lineWidth += chWidth;
        }

        final int TOP_Y = (SCREEN_HEIGHT - txtHeight) >> 1;
        int x = X_MARGIN;
        int y = TOP_Y;
        lineWidth = 0;
        //#if N7370
//#         font.drawTxtWithColorWithoutFont(g, txts, typeWriterStartIdx, typeWriterOffset, TXT_WIDTH, SCREEN_HEIGHT, x, y, typeWriterTxtClr, 0xff0000, 0, 0);
        //#else
        font.drawTxtWithColor(g, txts, showSubtitleStartIdx, showSubtitleOffset, TXT_WIDTH, SCREEN_HEIGHT, x, y, showSubtitleTxtClr, 0xff0000, 0, 0);
        //#endif

        showSubtitleInterval++;
        if(showSubtitleInterval < interval) {
            return;
        }
        //归零
        showSubtitleInterval = 0;

        //下面要更新啦
        int lastPos = showSubtitleStartIdx + showSubtitleOffset;
        if(lastPos >= txts.length - 1) {
            if (!showSubtitleWaitKey){
                showSubtitleWaitKey = true;
            }
            return;
        }

        char lastCh = txts[lastPos];
        if(lastCh == '$') {
            //已经显示到了本屏最后一个文字
            if (!showSubtitleWaitKey){
                showSubtitleWaitKey = true;
            }
            return;
        }

        lastPos++;
        lastCh = txts[lastPos];
        while(lastCh == '&') {
            lastPos++;
            if(lastPos >= txts.length) {
                break;
            }
            lastCh = txts[lastPos];
        }

        showSubtitleOffset = lastPos - showSubtitleStartIdx;
    }

    private void doScrollUpWords(int keyCode)
    {
        if (!showSubtitleWaitKey) {
            if (keyCode == Keys.KEY_RIGHT_SOFT) {
                showSubtitleOffset = 0;
                showSubtitleWaitKey = true;
            }
            return;
        }
        if(keyCode == Keys.KEY_RIGHT_SOFT)
        {
            showSubtitle = false;
            showSubtitleWaitKey = false;
            showSubtitleOffset = 0;
            script.resume();
        }
    }
    
    private void doShowSubtitle(int keyCode) {
        switch (showSubtitleMode) {
            case SUBTITLE_MODE_SCROLL:
                doScrollUpWords(keyCode);
                break;
            case SUBTITLE_MODE_TYPEWRITTER:
                doTypeWriterMode(keyCode);
                break;
        }
    }

    private void doTypeWriterMode(int keyCode) {
        if (keyCode != Keys.KEY_RIGHT_SOFT) {
            return;
        }
        if (showSubtitleStopKey) {
            return;
        }
        int lastPos = showSubtitleStartIdx + showSubtitleOffset;
        if (lastPos == showSubtitleTxt.length - 1) {
            showSubtitleStopKey = true;
            showSubtitleTxtAlpha = 0xff;
            return;
        }

        char lastCh = showSubtitleTxt[lastPos];
        if (lastCh != '$') {
            for (int i = lastPos, size = showSubtitleTxt.length; i < size; i++) {
                if (showSubtitleTxt[i] == '$' || i == size - 1) {
                    showSubtitleOffset = i - showSubtitleStartIdx;
                    return;
                }
            }
            return;
        }

        showSubtitleStartIdx += showSubtitleOffset + 1;
        showSubtitleOffset = 0;
        if (showSubtitleStartIdx >= showSubtitleTxt.length) {
            showSubtitleStopKey = true;
            showSubtitleTxtAlpha = 0xff;
        }
    }

    public void showMovieMode() {
        movieMode = true;
        movieModeOffsetFlag = 0;
        movieModeOffsetY = 0;
    }

    public void closeMovieMode() {
        movieModeOffsetFlag = 2;
    }

    public void showMovivePrompt()
    {
        movieMode = true;
        movieModeOffsetFlag = 1;
        movieModeOffsetY = MOVIE_BORDER_HEIGHT;
    }

    public void showMoviveAllScreen()
    {
        movieMode = true;
        movieModeOffsetFlag = 4;
    }

    public void closeMovivePrompt()
    {
        movieMode = false;
    }

    private void drawMovieMode(Graphics g) {
        if(!movieMode) {
            return;
        }

        if (movieModeOffsetFlag == 4) {
            return;
        }

        if(movieModeOffsetY > 0) {
            g.setColor(0);
            g.fillRect(0, 0, SCREEN_WIDTH, movieModeOffsetY);
            g.fillRect(0, SCREEN_HEIGHT - movieModeOffsetY, SCREEN_WIDTH, movieModeOffsetY);
//            g.drawImage(imgMenuFrameTop, 0, movieModeOffsetY, 0);
//            Util.drawRegion(g, imgMenuFrameTop, 0, 0, imgMenuFrameTop.getWidth(), imgMenuFrameTop.getHeight(), Sprite.TRANS_ROT180, 0, SCREEN_HEIGHT - movieModeOffsetY, Graphics.LEFT | Graphics.BOTTOM);
        }

        final int STEP = 2;
        if(movieModeOffsetFlag == 0) {
            if(movieModeOffsetY < MOVIE_BORDER_HEIGHT) {
                movieModeOffsetY += STEP;
            }

            if(movieModeOffsetY >= MOVIE_BORDER_HEIGHT) {
                //张开结束
                movieModeOffsetY = MOVIE_BORDER_HEIGHT;
                movieModeOffsetFlag = 1;
                //#if PRINTDEBUG == 1
                System.out.println("MovieMode opened");
                //#endif
//                if(script != null) {
                    script.remind(0, 0, null);
//                }
            }
            return;
        }

        if(movieModeOffsetFlag == 2) {
            movieModeOffsetY -= STEP;
            if(movieModeOffsetY <= 0) {
                movieModeOffsetY = 0;
                //关闭结束
                movieMode = false;
                //#if PRINTDEBUG == 1
                System.out.println("MovieMode closed");
                //#endif
//                if(script != null) {
                    script.remind(0, 0, null);
//                }
            }
        }
    }

    public void logic() {
        switch(status) {
            case GAME_STATUS:
                gameLogicOnce();
                break;
        }
    }

    public void run() {
        try
        {
            while (threadRuning)
            {
                LoadingPage.working = false;
                switch (status)
                {
                    case START_GAME_STATUS:
                        startGameOnce();
                        break;

                    case LOAD_STATUS:
                        loadLogicOnce();
                        break;

                    case SAVE_STATUS:
                        saveGame();
                        return;
                }
            }
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
    }

    /**
     * 刷新状态动画
     */
    private void updateAttackEffert()
    {
        for (int index = 0, count = attackEffectIcon.length; index < count; index++)
        {
            if(attackEffectIcon[index] != null)
            {
                attackEffectIcon[index].update();
            }
        }
    }

    /**
     * 当前显示成就的索引
     */
    private int curEffortIndex;
    /**
     * 成就名称
     */
    public String[] effortDrawName;
    public String[] effortAwardStr;
    
    /**
     * 刷新成就
     */
    private void updateEffort()
    {
        if(GameContext.script != null && !GameContext.script.isEnd())
        {
            return;
        }
        if (dlg.isAvailable()) {
            return;
        }
        EffortManager.getInstance().updateEffort();
        long curFinishEffort = EffortManager.getInstance().curFinishEffort;
        //如果没有成就就算了
        if(curFinishEffort == 0)
        {
            return;
        }
        int count = 0;
        String[] buf = new String[64];
        String[] dec = new String[64];
        for(int index = 0; index < 64; index++)
        {
            if(((curFinishEffort >> index) & 0x1) != 0)
            {

                buf[count] = EffortManager.getInstance().allEffortName[index];
                dec[count] = EffortManager.getInstance().getAwardDec(index);
                count++;
            }
        }
        updateEffortLogic(count, buf, dec);
    }

    public void updateEffortLogic(int count, String[] buf, String[] dec) {
        curEffortIndex = 0;
        drawEffortCount = 0;
        effortDrawName = new String[count];
        effortAwardStr = new String[count];
        System.arraycopy(buf, 0, effortDrawName, 0, count);
        System.arraycopy(dec, 0, effortAwardStr, 0, count);
    }

    /**
     * 游戏过程中的逻辑
     */
    public void gameLogicOnce() {
        updataGiftTime();
        if(isMiniGame)
        {
            if(isTalk)
            {
                doTalkKey();
            }
            if (!threadRuning)
            {
                updateScript();
            }
            if (isGameOver)
            {
                runGameOver();
                return;
            }
            return;
        }
        if(effortDrawName != null)
        {
            if (dlg.isAvailable()) {
                if (keyMgr.isPressed(Keys.MASK_FIRE) || keyMgr.isPressed(Keys.MASK_NUM5)) {
                    dlg.keyPressed(Keys.KEY_FIRE);
                }
                keyMgr.resetKey();
            }
            return;
        }
        readKey();
        if(isGameOver)
        {
            runGameOver();
            return;
        }
        
        if(!showMenu)
        {
            MainCanvas.curSkillFrame ++;
        }
        updateEffort();
        updateAttackEffert();
        //在说话，不更新这些乱七八糟
        if(isTalk) {
            roleMgr.updateArrow();
            updateRoles();
            doTalkKey();
            return;
        }
        if(isSelectTalk)
        {
            roleMgr.updateArrow();
            updateRoles();
            doSelectTalkKey();
            return;
        }

        if(movingCamera) {
            updateMoveCamera();
            roleMgr.updateArrow();
            updateRoles();
            //如果有线程在执行的时候不更新脚本
            if (!threadRuning)
            {
                updateScript();
            }
            doKeepTime();
            return;
        }

        //#if SMS == 1 || SMS == 2
        if(sms.isShowing()) {
            if(dlg.isAvailable()) {
                dlg.update();
                return;
            }
            sms.update();
            return;
        }
        //#endif

        if(showMenu) {
            if(dlg.isAvailable()) {
                dlg.update();
                return;
            }
            updateMenu();
            if (!threadRuning)
            {
                updateScript();
            }
            doKeepTime();
            return;
        }

        if(dlg.isAvailable()) {
            GameContext.groundMat.update();
            GameContext.flyMat.update();
            GameContext.undergroundMat.update();
            dlg.update();
            return;
        }

        //如果有线程在执行的时候不更新脚本
        if(!threadRuning) {
            updateScript();
        }
        //未用到
        updateTimers();
        updateRoles();
        setAttckTime();
        updateAttackedNumbers();
        updateCameraByNpc();
        roleMgr.detectCollision();
        doKeepTime();
    }


    /**
     * 渲染计时任务
     * @param g
     */
    private void drawMissionLimitTime(Graphics g)
    {
        if(missionLimitCount == 0)
        {
            return;
        }
        int numWidth = imgAttackedNum.getWidth() / 10;
        g.setColor(0xff0000);
        Util.drawNumbersAlignRight(g, (missionLimitCount / 10), imgAttackedNum, numWidth, 0, Page.SCREEN_WIDTH - 10, ACTOR_STATE_HEIGHT + 5);
        if((MainCanvas.currentFrame & 0x1) == 0)
        {
            g.drawRect(0, ACTOR_STATE_HEIGHT, Page.SCREEN_WIDTH - 1, Page.SCREEN_HEIGHT - ACTOR_STATE_HEIGHT - 1);
            return;
        }
        g.drawRect(1, ACTOR_STATE_HEIGHT + 1, Page.SCREEN_WIDTH - 3, Page.SCREEN_HEIGHT - ACTOR_STATE_HEIGHT - 3);
        g.drawRect(2, ACTOR_STATE_HEIGHT + 2, Page.SCREEN_WIDTH - 5, Page.SCREEN_HEIGHT - ACTOR_STATE_HEIGHT - 5);
        g.drawRect(3, ACTOR_STATE_HEIGHT + 3, Page.SCREEN_WIDTH - 7, Page.SCREEN_HEIGHT - ACTOR_STATE_HEIGHT - 7);
    }

    /**
     * 限时结束之后的脚本
     */
    ScriptEngine limitTimeEventScript;
    public void setLimitTimeEvent(String scriptName, int limitTime,  boolean isOpen)
    {
        if(!isOpen)
        {
            missionLimitCount = 0;
            limitTimeEventScript = null;
            return;
        }
        missionLimitCount = limitTime * 10;
        limitTimeEventScript = new ScriptEngine(scriptName);
    }

    private void updateTimers()
    {
        if(missionLimitCount == 0)
        {
            return;
        }
        missionLimitCount--;
        if(missionLimitCount <= 0)
        {
            if(limitTimeEventScript != null)
            {
                GameContext.script = null;
                limitTimeEventScript.init();
                GameContext.script = limitTimeEventScript;
                limitTimeEventScript = null;
                GameContext.script.execute();
            }
        }
    }

    /**
     * 游戏是否结束
     */
    private void runGameOver()
    {
        if(GameContext.getVar("GAMEOVER") != 1)
        {
            return;
        }
        GameContext.page.memGc();
        GameContext.page.observerMode = false;
        returnMainMenu();
    }

    /**
     * 设置BOSS战斗时间
     */
    private void setAttckTime()
    {
        if(startAttackTime == 0 && (GameContext.script == null) || (GameContext.script != null && GameContext.script.isEnd()))
        {
            startAttackTime = MainCanvas.currentFrame;
        }
    }

    private void updateScript() {
        ScriptEngine s = GameContext.script;
        if(s == null) {
            return;
        }

        if(s.isEnd()) {
            //#if PRINTDEBUG == 1
            System.out.println("Script:" + s.fileName + " end");
            //#endif
            if(script == GameContext.script) {
                script = null;
            }
            GameContext.script = null;

            //如果是由箱子触发的脚本，那么清空箱子
            if(curBox != null) {
                curBox = null;
                //开箱状态归零
                openBoxStatus = false;
            }
            if (curNpc != null) {
                curNpc = null;
            }
            return;
        }
        setEffort(0);
        if(!s.canExecute()) {
            return;
        }
        //#if PRINTDEBUG == 1
        System.out.println("主脚本执行:" + s.fileName);
        //#endif
        s.execute();
    }

    private void updateRoles() {
        //#if N73
//#         if(isShowMapName && readingGame) {
//#             return;
//#         }
        //#endif
        GameContext.groundMat.update();
        if(GameContext.actor != null) {
            GameContext.actor.logic();
        }
        roleMgr.updateNpc();
        roleMgr.updateChestBox();
        //呵呵，这里都是箭呀
        GameContext.flyMat.update();
        roleMgr.updateArrow();
        GameContext.undergroundMat.update();
        updateNpcTalk();
    }

    public void keyPressed(int keyCode) {
        if(loading || (isGameOver && !isCanOverMain))
        {
            return;
        }
        if(effortDrawName != null)
        {
            if (dlg.isAvailable()) {
                keyMgr.resetKey();
                keyMgr.keyPressed(keyCode);
            }
            return;
        }
        addKey(keyCode, 0);
        if(isMiniGame)
        {
            GameContext.miniGame.keyPressed(keyCode);
            if (isTalk)
            {
                keyMgr.resetKey();
                keyMgr.keyPressed(keyCode);
                return;
            }
            return;
        }
    }

    //#if POINT == 1
    @Override
    public void pointerPressed(int px, int py) {
        if(saving)
        {
            return;
        }
        if (isGameOver && isCanOverMain) {
            doPointGameOver(px,py);
            return;
        }
        if(isMiniGame)
        {
            if (isTalk)
            {
                doTalkPoint(px, py);
                return;
            }
            GameContext.miniGame.pointerPressed(px, py);
            return;
        }

        if(isTalk) {
            doTalkPoint(px, py);
            return;
        }

        if(isSelectTalk)
        {
            doSelectTalkPoint(px, py);
            return;
        }


        if(showSubtitle) {
            if (px != -1 && py != -1) {
                addKey(Keys.KEY_RIGHT_SOFT, 0);
            }
            return;
        }

        if(dlg.isAvailable()) {
            dlg.pointerPressed(px, py);
            return;
        }

        //#if SMS == 1 || SMS == 2
        if(sms != null && sms.isShowing()) {
            sms.pointerPressed(px, py);
            return;
        }
        //#endif

        if (curInterface == SHOP) {
              shopInterfacePointer(px, py);
              return;
         }
        //观察者模式，不考虑按键
        if (observerMode && !isWaitTeachPoint) {
            return;
        }
        if (isWaitTeachPoint) {
            if (!GameContext.point(px, py, teachPointX, teachPointY, teachPointW, teachPointH)) {
                return;
            }
            if (!isWaitTeachKey) {
                closeTeachWait();
            }
        }
        if (showMenu) {
            doMenuPoint(px, py);
            return;
        }

        if (doGameBtnsPoint(px, py)) {
            return;
        }

        if (doActorSkillPoint(px, py)) {
            return;
        }

        doKeyPadPoint(px, py);
    }
    
    //属性界面触摸按键
    private void attributeInterfacePointer(int px, int py) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        final int[] itemX = {startx + 22, startx + 116, startx + 40, startx + 116};
        final int[] itemY = {starty + 70, starty + 72, starty + 167, starty + 167};
        if (showPopMenu) {
            if (doPopMenuPoint(px, py, itemX[attriIndex], itemY[attriIndex], true) || !showDec) {
                showPopMenu = false;
                return;
            }
        }
        if (showDec) {
            final int DEC_X = startx + 170;
            final int DEC_Y = starty + 45;
            if (!GameContext.point(px, py, DEC_X, DEC_Y, FRAME_W, FRAME_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                showDec = false;
                showPopMenu = false;
            }
            return;
        }
        if (GameContext.point(px, py, startx+315, starty + 220, 70, 30)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = SYSMENU;
            return;
        }
        final int POINT_W = weaponFrame.getWidth();
        final int POINT_H = weaponFrame.getHeight();
        final int POINT_OFF = goodsFrame.getWidth() >> 1;
        for (int index = 0; index < itemX.length; index++) {
            if (GameContext.point(px, py, itemX[index] - POINT_OFF, itemY[index] - POINT_OFF, POINT_W, POINT_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                attriIndex = index;
                curItem = GameContext.actor.equipmentItem[attriIndex];
                selectFrameAnimal.actId = (short)((attriIndex == 0) ? 1 : 0);
                selectFrameAnimal.initFrame();
                prepareItemDec(curItem);
                prepareAttrPopMenu(curItem);
                return;
            }
        }
    }
    
    private void attributeInterfaceKeyPressed(int keyCode) {
        
    }
    //强化界面触摸按键
    private void enchantInterfacePointer(int px, int py) {
        if (isPlayerEnchantAnimal) {
            return;
        }
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (GameContext.point(px, py, startx+315, starty + 220, 70, 30)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = oldInterface;
            oldInterface = SYSMENU;
            showDec = false;
            return;
        }
        if (curItem != null && GameContext.point(px, py, startx - 15, starty + 220, 75, 35)) {
            //点击强化按钮
            if (isNotEnoughMoneyEnchant) {
                MusicPlayer.getInstance().playSound(SoundConst.ERROR);
                dlg.showMessageBox("金钱不足，无法强化");
            }
            else if (isNotEnoughLevelEnchant) {
                MusicPlayer.getInstance().playSound(SoundConst.ERROR);
                dlg.showMessageBox("等级不足，无法强化");
            }
            else if (isEnchantToMax) {
                MusicPlayer.getInstance().playSound(SoundConst.ERROR);
                dlg.showMessageBox("已经强化到满级！");
            }
            else {
                MusicPlayer.getInstance().playSound(SoundConst.ENCHANT);
                isPlayerEnchantAnimal = true;
                enchantPlayCount = 0;
                enchantFirst.actId = (short) (isWeaponEnchant ? 1 : 2);
                enchantFirst.initFrame();
                enchantSecond.actId = 0;
                enchantSecond.initFrame();
            }
            return;
        }
        
        if (!isWeaponEnchant) {
            return;
        }
        int enchantStartx = startx + 41;
        int enchantStarty = starty + 42;
        int w = 61;
        int cnt = enchantWeapon.length;
        if (GameContext.point(px, py, enchantStartx, enchantStarty, w * cnt, w)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            enchantIndex = (px - enchantStartx) / w;
            enchantIndex = (enchantIndex >= cnt) ? cnt - 1 : enchantIndex;
            curItem = enchantWeapon[enchantIndex];
            prepareEnchantConditionDec(enchantWeapon[enchantIndex]);
        }
    }
    
    private void enchantInterfaceKeyPressed(int keyCode) {
        
    }
    //成就界面触摸按键
    private void achieveInterfacePointer(int px, int py) {
        int startx = (SCREEN_WIDTH - 360) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (showDec) {
            final int DEC_X = startx + 200;
            final int DEC_Y = starty + 66;
            final int DEC_W = 222;
            final int DEC_H = 200;
            if (!GameContext.point(px, py, DEC_X, DEC_Y, DEC_W, DEC_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                showDec = false;
            }
            return;
        }
        if (GameContext.point(px, py, startx + 310, starty + 218, 75, 34)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = SYSMENU;
            achieveStatisticsStr = null;
            return;
        }
        int pointerIndex = -1;
        final int TYPE_X = startx + 55;
        final int TYPE_Y = starty + 30;
        final int TYPE_W = 67;
        final int TYPE_H = achieveFrame.getHeight();
        final int TYPE_CNT = EffortManager.EFFECT_TYPE_CNT;
        if (GameContext.point(px, py, TYPE_X, TYPE_Y, TYPE_W * TYPE_CNT, TYPE_H)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            pointerIndex = (px - TYPE_X) / TYPE_W;
            if (pointerIndex >= TYPE_CNT) {
                pointerIndex = TYPE_CNT - 1;
            }
        }
        if (pointerIndex != -1) {
            achieveType = pointerIndex;
            achieveSelectIndex = 0;
            achieveStartIndex = 0;
            achieveData = EffortManager.getInstance().getCurSelectEffortArray(achieveType);
            return;
        }

        if (achieveType == EffortManager.EFFECT_TYPE_STATISTICS) {
            return;
        }
        final int ITEM_X = startx + 40;
        final int ITEM_Y = starty + 80;
        final int ITEM_W = 160;
        final int ITEM_H = 45;
        if (GameContext.point(px, py, ITEM_X, ITEM_Y, ITEM_W, ITEM_H * ACHIEVE_SHOW_CNT)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            pointerIndex = (py - ITEM_Y) / ITEM_H;
            if (pointerIndex >= ACHIEVE_SHOW_CNT) {
                pointerIndex = ACHIEVE_SHOW_CNT - 1;
            }
        }
        if (pointerIndex != -1) {
            achieveSelectIndex = achieveStartIndex + pointerIndex;
            prepareAchieveDec();
        }
    }
    
    private void achieveInterfaceKeyPressed(int keyCode) {
        if (showDec) {
            doShowDecKeyPressed(keyCode);
            return;
        }
        switch (keyCode) {
            case Keys.KEY_UP:
            case Keys.KEY_NUM2:
                if (achieveType == EffortManager.EFFECT_TYPE_STATISTICS) {
                    if (achieveStartIndex > 0) {
                        achieveStartIndex--;
                    }
                    return;
                }
                if (achieveSelectIndex > 0) {
                    if (achieveStartIndex >= achieveSelectIndex && achieveStartIndex > 0) {
                        achieveStartIndex--;
                    }
                    achieveSelectIndex--;
                }
                break;
            case Keys.KEY_DOWN:
            case Keys.KEY_NUM8:
                if (achieveType == EffortManager.EFFECT_TYPE_STATISTICS) {
                    if (achieveStartIndex < achieveStatisticsStr.length - ACHIEVE_STATISTICS_SHOW_CNT) {
                        achieveStartIndex++;
                    }
                    return;
                }
                if (achieveSelectIndex < achieveData.length - 1) {
                    if (achieveStartIndex < achieveData.length - ACHIEVE_SHOW_CNT) {
                        achieveStartIndex++;
                    }
                    achieveSelectIndex++;
                }
                break;
            case Keys.KEY_LEFT:
            case Keys.KEY_NUM4:
                if (achieveType > 0) {
                    achieveType--;
                    achieveSelectIndex = 0;
                    achieveStartIndex = 0;
                    achieveData = EffortManager.getInstance().getCurSelectEffortArray(achieveType);
                }
                break;
            case Keys.KEY_RIGHT:
            case Keys.KEY_NUM6:
                if (achieveType < EffortManager.EFFECT_TYPE_CNT - 1) {
                    achieveType++;
                    achieveSelectIndex = 0;
                    achieveStartIndex = 0;
                    achieveData = EffortManager.getInstance().getCurSelectEffortArray(achieveType);
                }
                break;
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                if (achieveType == EffortManager.EFFECT_TYPE_STATISTICS) {
                    return;
                }
                prepareAchieveDec();
                break;
            case Keys.KEY_RIGHT_SOFT:
                curInterface = SYSMENU;
                achieveStatisticsStr = null;
                return;
        }
    }
    //炼化界面触摸按键
    private void artificeInterfacePointer(int px, int py) {
        if (artificeState != ARTIFICE_STATE_NONE && artificeState != ARTIFICE_STATE_WAIT_KEY) {
            return;
        }
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (showDec) {
            final int DEC_X = startx + 5;
            final int DEC_Y = starty + 5;
            final int DEC_W = 200;
            final int DEC_H = 200;
            if (!GameContext.point(px, py, DEC_X, DEC_Y, DEC_W, DEC_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                showDec = false;
            }
            return;
        }

        if (GameContext.point(px, py, startx+315, starty + 220, 70, 30)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = SYSMENU;
            return;
        }

        //炼化按钮
        int w = achieveFrame.getWidth();
        int h = achieveFrame.getHeight();
        int offsetx = 88 - w;
        int offsety = 96;
        int curx = startx + offsetx;
        int cury = starty + offsety;
        if (artificeState == ARTIFICE_STATE_NONE && GameContext.point(px, py, curx, cury, w << 1, h)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSCHOOSE);
            artificeState = ARTIFICE_STATE_FIRE_APPEAR;
            artificeCount = 0;
            return;
        }

        if (artificeState == ARTIFICE_STATE_WAIT_KEY) {
            final int FIRE_START_X = startx + 55;
            final int FIRE_START_Y = starty + 149;
            final int FIRE_W = fireBackFrame.getWidth();
            final int FIRE_H = fireBackFrame.getHeight();
            final int FIRE_INTERVAL = fireBackFrame.getWidth() + arrowFrame.getWidth() + 2;
            if (artificeFireMaxLv != 0 && GameContext.point(px, py, FIRE_START_X + FIRE_INTERVAL * artificeFireMaxLv, FIRE_START_Y, FIRE_W, FIRE_H)) {
                artificeFireLv = artificeFireMaxLv;
                if (GameContext.actor.getMoney() < ARTIFICE_MONEY[artificeFireMaxLv]) {
                    showNotEnoughMoney("无法炼化");
                    return;
                }
                artificeFireLv = artificeFireMaxLv;
                doArtificeUpdateFire();
                doStartArtifice();
                return;
            }
            if (GameContext.point(px, py, FIRE_START_X, FIRE_START_Y, FIRE_W, FIRE_H)) {
                artificeFireLv = 0;
                if (GameContext.actor.getMoney() < ARTIFICE_MONEY[artificeFireLv]) {
                    showNotEnoughMoney("无法炼化");
                    return;
                }
                doArtificeUpdateFire();
                doStartArtifice();
                return;
            }
        }

        //晶石描述
        offsetx = 150;
        offsety = 40;
        final int[] STONE_OFF_X = {52, 88, 14, 125, 14, 125};
        final int[] STONE_OFF_Y = {37, 37, 21, 21, 56, 56};
        final int STONE_W = 32;
        for (int index = 0; index < STONE_OFF_X.length; index++) {
            curx = startx + offsetx + STONE_OFF_X[index];
            cury = starty + offsety + STONE_OFF_Y[index];
            if (GameContext.point(px, py, curx, cury, STONE_W, STONE_W)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                prepareStoneDec(curStoneItem[index]);
                return;
            }
        }
    }
    
    private void artificeInterfaceKeyPressed(int keyCode) {
        if (keyCode == Keys.KEY_RIGHT_SOFT) {
            if (artificeState == ARTIFICE_STATE_WAIT_KEY) {
                artificeState = ARTIFICE_STATE_NONE;
                return;
            }
            curInterface = SYSMENU;
        }
    }
    //配方界面触摸按键
    private void formulaInterfacePointer(int px, int py) {
        if (isShowSucceedStoveAnimal) {
            return;
        }
        int startx = (SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        if (showDec) {
            final int DEC_X = 286;
            final int DEC_Y = 4;
            final int DEC_W = 180;
            final int DEC_H = 180;
            if (!GameContext.point(px, py, DEC_X, DEC_Y, DEC_W, DEC_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                showDec = false;
            }
            return;
        }
        if (doMenuButtonsPoint(px, py, false, true, startx, starty)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            return;
        }

        int offsetx = 44;
        int offsety = 170;
        int curx = startx + offsetx;
        int cury = starty + offsety;
        int w = achieveFrame.getWidth() << 1;
        int h = achieveFrame.getHeight();
        if (GameContext.point(px, py, curx, cury, w, h)) {
            MusicPlayer.getInstance().playSound(SoundConst.ARTIFICE);
            //判断数量是否能够炼制成功
            if (isCanFormula) {
                doFormulaFire();
            }
            else {
                dlg.showMessageBox("材料不足，无法炼制！");
            }
            return;
        }
        offsetx = 148;
        offsety = 160;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = stoveFrameInside.getWidth();
        h = stoveFrameInside.getHeight() + 20;
        int intervalx = 2 * w + 20;
        int cnt = formulaNeedItemId.length;
        if (GameContext.point(px, py, curx, cury, intervalx * cnt, h)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            materialIndex = (px - curx) / intervalx;
            materialIndex = (materialIndex >= cnt) ? cnt - 1 : materialIndex;
            MyItem item = new MyItem((short)formulaNeedItemId[materialIndex]);
            prepareItemDec(item);
        }
    }
    
    private void formulaInterfaceKeyPressed(int keyCode) {
        if (keyCode == Keys.KEY_RIGHT_SOFT) {
            curInterface = oldInterface;
            oldInterface = SYSMENU;
        }
    }
    //任务界面触摸按键

    private void missionInterfacePointer(int px, int py) {
        int startx = (Page.SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (Page.SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        if (showDec) {
            final int DEC_X = startx + 200;
            final int DEC_Y = starty + 40;
            final int DEC_W = 222;
            final int DEC_H = 200;
            if (!GameContext.point(px, py, DEC_X, DEC_Y, DEC_W, DEC_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                showDec = false;
            }
            return;
        }
        if (GameContext.point(px, py, startx+315, starty + 220, 70, 30)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = SYSMENU;
            return;
        }
        final int MISSION_X = startx + 28;
        final int MAIN_MISSION_Y = starty + 55;
        final int MISSION_W = 188;
        final int MISSION_H = 51;
        if (GameContext.point(px, py, MISSION_X, MAIN_MISSION_Y, MISSION_W, MISSION_H)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            prepareMissionDec(mainMission);
            return;
        }

        if (subMissionList[0] == null || subMissionList.length == 0) {
            return;
        }
        final int SUB_MISSION_Y = starty + 135;
        if (GameContext.point(px, py, MISSION_X, SUB_MISSION_Y, MISSION_W, MISSION_H * SUB_MISSION_SHOW_CNT)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            int pointerIndex = (py - SUB_MISSION_Y) / MISSION_H;
            pointerIndex = (pointerIndex >= SUB_MISSION_SHOW_CNT) ? SUB_MISSION_SHOW_CNT - 1 : pointerIndex;
            subMissionSelectIndex = subMissionStartIndex + pointerIndex;
            if (subMissionSelectIndex >= subMissionList.length) {
                return;
            }
            if (subMissionList[subMissionSelectIndex] == null) {
                return;
            }
            prepareMissionDec(subMissionList[subMissionSelectIndex]);
        }
    }
    
    private void missionInterfaceKeyPressed(int keyCode) {
        if (showDec) {
            doShowDecKeyPressed(keyCode);
            return;
        }
        switch (keyCode) {
            case Keys.KEY_RIGHT_SOFT:
                curInterface = SYSMENU;
                return;
        }
    }

    //商店界面触摸按键
    private void shopInterfacePointer(int px, int py) {
        int startx = (Page.SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (Page.SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        if (isDrawChangeTradingCount) {
            doChangeTradingCountPoint(px, py);
            return;
        }
        final int FRAME_X = startx;
        final int FRAME_Y = starty;
        if (showDec) {
            if (doMenuButtonsPoint(px, py, true, false, FRAME_X, FRAME_Y)) {
                return;
            }
            final int DEC_Y = starty + 37;
            final int DEC_W = 172;
            final int DEC_H = 178;
            int DEC_X = Page.SCREEN_WIDTH - DEC_W - 10;
            if (armorCurCol > ARMOR_COLS >> 1) {
                DEC_X = 10;
            }
            if (!GameContext.point(px, py, DEC_X, DEC_Y, DEC_W, DEC_H)) {
                showDec = false;
            }
            return;
        }

        if (doMenuButtonsPoint(px, py, false, true, FRAME_X, FRAME_Y)) {
            return;
        }

        if (curInterface == SUPERSHOP) {
            //计费
            final int SMS_X = startx + 35;
            final int SMS_Y = starty + 41;
            final int SMS_W = 57;
            final int SMS_H = 48;
            if (GameContext.point(px, py, SMS_X, SMS_Y, SMS_W * ARMOR_COLS, SMS_H)) {
                armorCurCol = (px - SMS_X) / SMS_W;
                armorCurCol = (armorCurCol >= ARMOR_COLS) ? ARMOR_COLS - 1 : armorCurCol;
                prepareSmsDec();
                return;
            }
        }

        if (buyItemId == null || buyItemId.length == 0) {
            return;
        }
        final int storeRows = (curInterface == SHOP) ? ARMOR_ROWS : STORE_SUPER_ROWS;
        final int ITEM_X = startx + 30;
        final int ITEM_Y = (curInterface == SHOP) ?starty + 57 : starty + 123;
        final int ITEM_W = 38;
        final int ITEM_DIS_X = 60;
        final int ITEM_DIS_Y = (curInterface == SHOP) ? 60 : 50;
        if (GameContext.point(px, py, ITEM_X, ITEM_Y, ITEM_DIS_X * ARMOR_COLS, ITEM_DIS_Y * storeRows)) {
            int curCol = (px - ITEM_X) / ITEM_DIS_X;
            curCol = (curCol >= ARMOR_COLS) ? ARMOR_COLS - 1 : curCol;
            if (px > ITEM_X + curCol * ITEM_DIS_X + ITEM_W) {
                return;
            }
            int curRow = (py - ITEM_Y) / ITEM_DIS_Y;
            if (py > ITEM_Y + curRow * ITEM_DIS_Y + ITEM_W) {
                return;
            }
            curRow += armorStartRow;
            if (curRow * ARMOR_COLS + curCol >= buyItemId.length) {
                return;
            }
            armorCurCol = curCol;
            armorCurRow = curRow;
            ShowSmsDec = false;
            prepareBuyItemDec();
        }
    }
    private void shopInterfaceKeyPressed(int keyCode) {
        if (isDrawChangeTradingCount) {
            if (doChangeTradingCountKey(keyCode)) {
                dlg.btnBoxOp = Dialog.BUY_ITEM_OP;
                StringBuffer buf = new StringBuffer();
                buf.append("买入该物品共需花费金钱").append(itemPrice * tradingCount).append("，是否确定购买？");
                dlg.showButtonBox(buf.toString().toCharArray());
            }
            return;
        }
        if (showDec) {
            if (keyCode == Keys.KEY_LEFT_SOFT) {
                superShopKeyFire();
                return;
            }
            doShowDecKeyPressed(keyCode);
            return;
        }
        switch (keyCode) {
            case Keys.KEY_RIGHT_SOFT:
                curInterface = oldInterface;
                oldInterface = SYSMENU;
                showMenu = false;
                isNotResumeScript = false;
                if(script != null)
                {
                    script.remind(0, 0, null);
                    script = null;
                }
                break;
        }
    }

    //物品界面触摸按键
    int curItemCenterX = 0;
    int curItemCenterY = 0;
    private void goodsInterfacePointer(int px, int py) {
        if (isDrawChangeTradingCount) {
            doChangeTradingCountPoint(px, py);
            return;
        }
        if (showPopMenu) {
            if (doPopMenuPoint(px, py, curItemCenterX, curItemCenterY, armorCurCol <= ARMOR_COLS >> 1) || !showDec) {
                showPopMenu = false;
                return;
            }
        }
        int startx = (SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        if (showDec) {
            final int DEC_Y = starty + 45;
            final int DEC_W = 208;
            final int DEC_H = 205;
            int DEC_X = goodItemCenterX + 30;
            if (armorCurCol > ARMOR_COLS >> 1) {
                DEC_X = goodItemCenterX - DEC_W - 30;
            }
            if (!GameContext.point(px, py, DEC_X, DEC_Y, DEC_W, DEC_H)) {
                showDec = false;
                showPopMenu = false;
            }
            return;
        }
        if (GameContext.point(px, py, startx+315, starty + 220, 70, 30)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = oldInterface;
            return;
        }

        if (curArmorItems == null || curArmorItems.length == 0) {
            return;
        }
        final int ITEM_X = startx + 41;
        final int ITEM_Y = starty + 48;
        final int ITEM_W = 38;
        final int ITEM_DIS_X = 60;
        final int ITEM_DIS_Y = 55;
        if (GameContext.point(px, py, ITEM_X, ITEM_Y, ITEM_DIS_X * ARMOR_COLS, ITEM_DIS_Y * ARMOR_ROWS)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            int curCol = (px - ITEM_X) / ITEM_DIS_X;
            curCol = (curCol >= ARMOR_COLS) ? ARMOR_COLS - 1 : curCol;
            if (px > ITEM_X + curCol * ITEM_DIS_X + ITEM_W) {
                return;
            }
            int curRow = (py - ITEM_Y) / ITEM_DIS_Y;
            if (py > ITEM_Y + curRow * ITEM_DIS_Y + ITEM_W) {
                return;
            }
            curRow += armorStartRow;
            if (curRow * ARMOR_COLS + curCol >= curArmorItems.length) {
                return;
            }
            armorCurCol = curCol;
            armorCurRow = curRow;
            curItem = curArmorItems[armorCurRow * ARMOR_COLS + armorCurCol];
            prepareItemDec(curItem);
            preparePopMenu(curItem);
            curItemCenterX = ITEM_X + ITEM_DIS_X * armorCurCol + (ITEM_W >> 1);
            curItemCenterY = ITEM_Y + ITEM_DIS_Y * (armorCurRow - armorStartRow) + (ITEM_W >> 1);
        }
    }
    
    //售出物品
    void saleGoods() {
        MusicPlayer.getInstance().playSound(SoundConst.SYSCHOOSE);
        int salePrice = itemPrice >> 1;
        GameContext.actor.removeItem(curItem, tradingCount);
        GameContext.actor.addMoney(salePrice * tradingCount);
        preInitGoodsInterface(curItem);
        curItem = null;
        showDec = false;
        itemDec = null;
    }

    //重新排列背包
    private void preInitGoodsInterface(MyItem item) {
        boolean needInit = false;
        if (!item.canOverPosition() || item.cnt <= 1) {
            needInit = true;
        }
        if (needInit) {
            initGoodsInterface();
//            int curArmorItem = armorCurRow * ARMOR_COLS + armorCurCol;
            if (curArmorItems == null) {// || curArmorItem < curArmorItems.length
                return;
            }
            int lastCols = curArmorItems.length % ARMOR_COLS;
            if (armorStartRow > 0 && lastCols == 0) {
                armorStartRow--;
            }
        }
    }
    
    private void goodsInterfaceKeyPressed(int keyCode) {
        if (isDrawChangeTradingCount) {
            if (doChangeTradingCountKey(keyCode)) {
                int salePrice = itemPrice >> 1;
                StringBuffer buf = new StringBuffer();
                buf.append("总共可卖出").append(salePrice * tradingCount).append("金，是否卖出？");
                dlg.btnBoxOp = Dialog.SALE_ITEM_OP;
                dlg.showButtonBox(buf.toString().toCharArray());
            }
            return;
        }
    }
    //系统菜单界面触摸按键
    private void systemMenuInterfacePointer(int px, int py) {
        int startx = (SCREEN_WIDTH - 350) >> 1;
        int starty = ((SCREEN_HEIGHT - 130) >> 1) - 20;
        int intervalx = 90;
        int intervaly = 79;
        final int MENUW = 80;
        final int MENUH = 39;
        if (GameContext.point(px, py, startx, starty, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 0;
            curInterface = ATTRI;
        } else if(GameContext.point(px, py, startx + intervalx, starty, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 1;
            curInterface = ENCHANT;
        } else if(GameContext.point(px, py, startx + (intervalx << 1), starty, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 2;
            curInterface = GOODS;
        } else if(GameContext.point(px, py, startx + intervalx * 3, starty, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 3;
            curInterface = ARTIFICE;
        } else if(GameContext.point(px, py, startx, starty + intervaly, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 4;
            curInterface = MISSION;
        } else if(GameContext.point(px, py, startx + intervalx, starty + intervaly, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 5;
            curInterface = MAP;
        } else if(GameContext.point(px, py, startx + (intervalx << 1), starty + intervaly, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 6;
            curInterface = ACHIEVE;
        } else if(GameContext.point(px, py, startx + intervalx * 3, starty + intervaly, MENUW, MENUH)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            sysMenuCurIndex = 7;
            curInterface = GAMEMENU;
        } else if(GameContext.point(px, py, SCREEN_WIDTH - 80, SCREEN_HEIGHT - 37, 73, 31)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            showMenu = false;
            return;
        }
        doTabEnter();
    }
    private void systemMenuInterfaceKeyPressed(int keyCode) {
        final int[] ITEM = {ATTRI, ENCHANT, GOODS, ARTIFICE, MISSION, MAP, ACHIEVE, GAMEMENU};
        switch(keyCode)
        {
            case Keys.KEY_RIGHT_SOFT:
                showMenu = false;
                break;
            case Keys.KEY_LEFT_SOFT:
                curInterface = ITEM[sysMenuCurIndex];
                doTabEnter();
                break;
            default:
                if (keyCode >= Keys.KEY_NUM1 && keyCode <= Keys.KEY_NUM8) {
                    sysMenuCurIndex = keyCode - Keys.KEY_NUM1;
                }
                break;
        }
    }
    //游戏菜单界面触摸按键
    private void gameMenuInterfacePointer(int px, int py) {
        if (saving) {
            return;
        }
        if (dlg.isAvailable()) {
            dlg.pointerPressed(px, py);
            return;
        }
        gameMenuPointer = false;
        switch(curGameMenuTab)
        {
            case SYS_MENU_LIST:
                gameMenuListKeyPointer(px, py);
                break;
            case SYS_MENU_HELP:
                int startx = (SCREEN_WIDTH - 370) >> 1;
                int starty = (SCREEN_HEIGHT - 240) >> 1;
                if (GameContext.point(px, py, startx + 315, starty + 220, 70, 30)) {
                    MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                    curInterface = SYSMENU;
                }
                break;
            case SYS_MENU_SOUND:
                final int BTN_W = 84;
                final int BTN_H = 38;
                if (GameContext.point(px, py, SCREEN_WIDTH - BTN_W, SCREEN_HEIGHT - BTN_H, BTN_W, BTN_H)) {
                    MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                    curGameMenuTab = SYS_MENU_LIST;
                }
                break;
        }
    }

    private void gameMenuInterfacePointerReleased(int px, int py) {
        if (saving) {
            return;
        }
        if (dlg.isAvailable()) {
            return;
        }
        if (!gameMenuPointer) {
            return;
        }
        gameMenuPointer = false;
        if (curGameMenuTab == SYS_MENU_LIST) {
            int startx = (SCREEN_WIDTH - 370) >> 1;
            int starty = (SCREEN_HEIGHT - 240) >> 1;
            final int MENU_FRAME_W = menuFrame.getWidth();
            final int MENU_FRAME_H = menuFrame.getHeight();
            final int MENU_FRAME_X = startx + (WIDTH_FRAME >> 1) - MENU_FRAME_W;
            final int MENU_FRAME_Y = starty + 45;
            final int MENU_FRAME_DIS = MENU_FRAME_H + 6;
            if (GameContext.point(px, py, MENU_FRAME_X, MENU_FRAME_Y, MENU_FRAME_W << 1, MENU_FRAME_DIS * SYS_MENU_RETURN_MAIN)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                gameMenuKeyFire();
            }
            return;
        }
    }

    boolean gameMenuPointer;
    private void gameMenuListKeyPointer(int px, int py) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (GameContext.point(px, py, startx + 315, starty + 220, 70, 30)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = SYSMENU;
        }

        int pointerIndex = -1;
        final int MENU_FRAME_W = menuFrame.getWidth();
        final int MENU_FRAME_H = menuFrame.getHeight();
        final int MENU_FRAME_X = startx + (WIDTH_FRAME >> 1) - MENU_FRAME_W;
        final int MENU_FRAME_Y = starty + 45;
        final int MENU_FRAME_DIS = MENU_FRAME_H + 6;
        if (GameContext.point(px, py, MENU_FRAME_X, MENU_FRAME_Y, MENU_FRAME_W << 1, MENU_FRAME_DIS * SYS_MENU_RETURN_MAIN)) {
            pointerIndex = (py - MENU_FRAME_Y) / MENU_FRAME_DIS;
            if (pointerIndex >= SYS_MENU_RETURN_MAIN) {
                pointerIndex = SYS_MENU_RETURN_MAIN - 1;
            }
        }
        if (pointerIndex != -1) {
            gameMenuIndex = pointerIndex;
            gameMenuPointer = true;
        }
    }
    
    private void gameMenuInterfaceKeyPressed(int keyCode) {
        if (saving) {
            return;
        }
        if (dlg.isAvailable()) {
            dlg.keyPressed(keyCode);
            return;
        }
        switch(curGameMenuTab)
        {
            case SYS_MENU_LIST:
                gameMenuListKeyPressed(keyCode);
                break;
            case SYS_MENU_HELP:
                helpInterfaceKeyPressed(keyCode);
                break;
            case SYS_MENU_SOUND:
                soundInterfaceKeyPressed(keyCode);
                break;
        }
    }

    private void gameMenuListKeyPressed(int keyCode) {
        switch(keyCode)
        {
            case Keys.KEY_UP:
            case Keys.KEY_NUM2:
                gameMenuIndex--;
                if (gameMenuIndex < 0) {
                    gameMenuIndex = SYS_MENU_RETURN_MAIN - 1;
                }
                break;
            case Keys.KEY_DOWN:
            case Keys.KEY_NUM8:
                gameMenuIndex++;
                if (gameMenuIndex >= SYS_MENU_RETURN_MAIN) {
                    gameMenuIndex = 0;
                }
                break;
            case Keys.KEY_RIGHT_SOFT:
                curInterface = SYSMENU;
                break;
            case Keys.KEY_LEFT_SOFT:
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                gameMenuKeyFire();
                break;
        }
    }

    final private void gameMenuKeyFire() {
        //存储过程中不处理按键
        if (status == SAVE_STATUS) {
            return;
        }
        switch (gameMenuIndex + 1) {
            case SYS_MENU_SAVE:
                char[] canNotSave = strMgr.getString((short) 185);
                if (roleMgr.boss != null && roleMgr.boss.enemy && roleMgr.boss.visible) {
                    dlg.showMessageBox(canNotSave);
                    curInterface = GAMEMENU;
                    oldInterface = -1;
                    script = null;
                    return;
                }
                if (!GameContext.page.isCanSave) {
                    dlg.showMessageBox(canNotSave);
                    script = null;
                    return;
                }
                short saveConfirmId = 182;
                dlg.btnBoxOp = Dialog.SAVE_OP;
                char[] saveConfirm = strMgr.getString(saveConfirmId);
                dlg.showButtonBox(saveConfirm);
                return;

            case SYS_MENU_HELP:
                helpOffsetY = 0;
                keyMgr.resetKey();
                keyMgr.resetKeyIm();
                break;

            case SYS_MENU_RETURN_MAIN:
                final short RET_TXT = 70;
                char[] retNote = strMgr.getString(RET_TXT);
                dlg.btnBoxOp = Dialog.RET_MAIN_MENU_OP;
                dlg.showButtonBox(retNote);
                return;
        }
        curGameMenuTab = gameMenuIndex + 1;
    }

    //帮助界面
    private void helpInterfaceKeyPressed(int keyCode) {
        switch(keyCode)
        {
//            case Keys.KEY_UP:
//            case Keys.KEY_NUM2:
//                if (helpOffsetY > 0) {
//                    helpOffsetY -= FishFont.LINE_HEIGHT >> 1;
//                    helpOffsetY = (helpOffsetY < 0) ? 0 : helpOffsetY;
//                }
//                break;
//            case Keys.KEY_DOWN:
//            case Keys.KEY_NUM8:
//                final int TXT_DRAW_W = 300;
//                final int TXT_DRAW_H = 172;
//                final int TXT_H = font.getCharsHeight(GameContext.helpTxt, TXT_DRAW_W);
//                if (helpOffsetY < TXT_H - TXT_DRAW_H) {
//                    helpOffsetY += FishFont.LINE_HEIGHT >> 1;
//                    helpOffsetY = (helpOffsetY > TXT_H - TXT_DRAW_H) ? TXT_H - TXT_DRAW_H : helpOffsetY;
//                }
//                break;
            case Keys.KEY_RIGHT_SOFT:
                curGameMenuTab = SYS_MENU_LIST;
                break;
        }
    }

    //计费界面触摸按键
    private void chargeInterfacePointer(int px, int py) {
        
    }
    private void chargeInterfaceKeyPressed(int keyCode) {
        
    }
    //地图界面触摸按键
    private void mapInterfacePointer(int px, int py) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (GameContext.point(px, py, startx+315, starty + 220, 70, 30)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            curInterface = SYSMENU;
        }
    }
    
    private void mapInterfaceKeyPressed(int keyCode) {
        if (keyCode == Keys.KEY_RIGHT_SOFT) {
            curInterface = SYSMENU;
        }
    }
    //音量界面触摸按键
//    private void soundInterfacePointer(int px, int py) {
//
//    }
    private boolean soundInterfaceDragged(int startX, int startY, int endX, int endY) {
        int curSoundLv = MusicPlayer.getInstance().curSoundLv;
        final int DRAG_LIMIT = 40;
        int len = (endX - startX) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        curSoundLv += len;
        curSoundLv = (curSoundLv < 0) ? 0 : curSoundLv;
        curSoundLv = (curSoundLv > MusicPlayer.ALL_SOUND_LV) ? MusicPlayer.ALL_SOUND_LV : curSoundLv;
        MusicPlayer.getInstance().setSoundLevel(curSoundLv);
        return true;
    }

    private void soundInterfaceKeyPressed(int keyCode) {
        switch (keyCode) {
            case Keys.KEY_NUM4:
            case Keys.KEY_LEFT:
                MusicPlayer.getInstance().downSoundLevel();
                return;

            case Keys.KEY_NUM6:
            case Keys.KEY_RIGHT:
                MusicPlayer.getInstance().upSoundLevel();
                return;

            case Keys.KEY_RIGHT_SOFT:
                curGameMenuTab = SYS_MENU_LIST;
                return;
        }
    }

    private boolean helpInterfaceDragged(int startX, int startY, int endX, int endY) {
        final int DRAG_LIMIT = FishFont.LINE_HEIGHT >> 1;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        final int TXT_DRAW_W = 300;
        final int TXT_DRAW_H = 172;
        final int TXT_H = font.getCharsHeight(GameContext.helpTxt, TXT_DRAW_W);
        helpOffsetY -= len * DRAG_LIMIT;
        helpOffsetY = (helpOffsetY > TXT_H - TXT_DRAW_H) ? TXT_H - TXT_DRAW_H : helpOffsetY;
        helpOffsetY = (helpOffsetY < 0) ? 0 : helpOffsetY;
        return true;
    }

    private void doTalkPoint(int px, int py) {
        MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
        if(talkScrollTime > 0) {
            return;
        }
        if (px != -1 && py != -1) {
            keyMgr.resetKey();
            keyMgr.keyPressed(Keys.KEY_FIRE);
        }
    }

    private void doSelectTalkPoint(int px, int py) {
        //在滚动，不接受按键
        if(talkScrollTime > 0) {
            return;
        }
        if (GameContext.point(px, py, 214, 298, 16, 16))
        {
            endSelectTalk();
            return;
        }
        int pointerIndex = -1;
        if (GameContext.point(px, py, TXT_MARGIN_X, TXT_Y, TXT_WIDTH, (FishFont.FONT_HEIGHT + 1) * selectTalk.length)) {
            pointerIndex = (py - TXT_Y) / (FishFont.FONT_HEIGHT + 1);
            if (pointerIndex > selectTalk.length - 1) {
                pointerIndex = selectTalk.length - 1;
            }
        }
        if (pointerIndex == -1) {
            return;
        }
        else if (pointerIndex == selectTalkIndex) {
            endSelectTalk();
        }
        else {
            selectTalkIndex = pointerIndex;
            drawSelectTalkCount = 0;
            drawSelectTalkLineDis = 0;
        }
    }

    final public boolean doGameBtnsPoint(int px, int py) {
        final int ICON_POINT_W = 52;
        final int ICON_POINT_H = 56;
        final int[] MENU_KEY = {Keys.KEY_LEFT_SOFT, Keys.KEY_STAR, Keys.KEY_NUM0};
        for (int index = 0; index < MENU_KEY.length; index++) {
            int iconX = SCREEN_WIDTH - ICON_POINT_W * (index + 1);
            if (GameContext.point(px, py, iconX, 0, ICON_POINT_W, ICON_POINT_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                GameContext.page.addKey(MENU_KEY[index], 0);
                return true;
            }
        }
        return false;
    }

    final public void doGameOverPoint(int px, int py) {
        final int POINT_W = font.chineseWidth * 4;
        final int POINT_H = FishFont.LINE_HEIGHT + 8;
        if(GameContext.point(px, py, SCREEN_WIDTH - POINT_W, SCREEN_HEIGHT - POINT_H, POINT_W, POINT_H)) {
            GameContext.page.addKey(Keys.KEY_RIGHT_SOFT, 0);
        }
    }

    final public boolean doButtonsPoint(int px, int py, int leftX, boolean hasOk, boolean hasRet) {
        final int BTN_Y = SCREEN_HEIGHT - 35;
        return doButtonsPoint(px, py, leftX, SCREEN_WIDTH - leftX, BTN_Y, hasOk, hasRet);
    }

    final public boolean doButtonsPoint(int px, int py, int leftX, int rightX, int y, boolean hasOk, boolean hasRet) {
        final int BTN_H = 32;
        final int BTN_W = 74;
        if (hasOk && GameContext.point(px, py, leftX, y, BTN_W, BTN_H)) {
            GameContext.page.addKey(Keys.KEY_LEFT_SOFT, 0);
            return true;
        }
        if (hasRet && GameContext.point(px, py, rightX - BTN_W, y, BTN_W, BTN_H)) {
            GameContext.page.addKey(Keys.KEY_RIGHT_SOFT, 0);
            return true;
        }
        return false;
    }

    final public boolean doButtonsPoint(int px, int py, int leftX, int rightX, int y, int btnW, int btnH, boolean leftTxt, boolean rightTxt, boolean centerTxt) {
        if (centerTxt && GameContext.point(px, py, leftX + ((rightX - leftX - btnW) >> 1), y, btnW, btnH)) {
            GameContext.page.addKey(Keys.KEY_FIRE, 0);
            return true;
        }
        if (leftTxt && GameContext.point(px, py, leftX, y, btnW, btnH)) {
            GameContext.page.addKey(Keys.KEY_LEFT_SOFT, 0);
            return true;
        }
        if (rightTxt && GameContext.point(px, py, rightX - btnW, y, btnW, btnH)) {
            GameContext.page.addKey(Keys.KEY_RIGHT_SOFT, 0);
            return true;
        }
        return false;
    }

    public boolean doKeyPadPoint(int px, int py) {
        if (!keypadDraw || keypadDrawFrame < 3) {
            return false;
        }

        //确定键
        final int KEYPAD_FIRE_W = imgKeypadFireBack.getWidth() + 10;
        final int KEYPAD_FIRE_X = SCREEN_WIDTH - 75 - (KEYPAD_FIRE_W >> 1);
        final int KEYPAD_FIRE_Y = SCREEN_HEIGHT - 55 - (KEYPAD_FIRE_W >> 1);
        if (GameContext.point(px, py, KEYPAD_FIRE_X, KEYPAD_FIRE_Y, KEYPAD_FIRE_W, KEYPAD_FIRE_W)) {
            keyMgr.resetKey();
            addKey(Keys.KEY_FIRE, 0);
            keyPadCode = Keys.MASK_FIRE;
            return true;
        }

        //方向键
        final int KEYPAD_DIR_W = 80;
        final int KEYPAD_CENTER_X = 90;
        final int KEYPAD_CENTER_Y = SCREEN_HEIGHT - 72;
        final int KEYPAD_LEFT_X = KEYPAD_CENTER_X - KEYPAD_DIR_W;
        final int KEYPAD_RIGHT_X = KEYPAD_CENTER_X + KEYPAD_DIR_W;
        final int KEYPAD_TOP_Y = KEYPAD_CENTER_Y - KEYPAD_DIR_W;
        if (!GameContext.point(px, py, KEYPAD_LEFT_X, KEYPAD_TOP_Y, KEYPAD_DIR_W << 1, KEYPAD_DIR_W << 1)) {
            return false;
        }
        if (px - KEYPAD_LEFT_X >= py - KEYPAD_TOP_Y && KEYPAD_RIGHT_X - px >= py - KEYPAD_TOP_Y) {
//            if (keyPadCode == -1) {
//                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
//            }
            keyMgr.resetKey();
            addKey(Keys.KEY_UP, 0);
            keyPadCode = Keys.MASK_UP;
        } else if (px - KEYPAD_LEFT_X >= py - KEYPAD_TOP_Y) {
//            if (keyPadCode == -1) {
//                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
//            }
            keyMgr.resetKey();
            addKey(Keys.KEY_RIGHT, 0);
            keyPadCode = Keys.MASK_RIGHT;
        } else if (px - KEYPAD_LEFT_X < py - KEYPAD_TOP_Y && KEYPAD_RIGHT_X - px >= py - KEYPAD_TOP_Y) {
//            if (keyPadCode == -1) {
//                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
//            }
            keyMgr.resetKey();
            addKey(Keys.KEY_LEFT, 0);
            keyPadCode = Keys.MASK_LEFT;
        } else if (px - KEYPAD_LEFT_X <= (py - KEYPAD_TOP_Y) && (KEYPAD_RIGHT_X - px <= (py - KEYPAD_TOP_Y))) {
//            if (keyPadCode == -1) {
//                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
//            }
            keyMgr.resetKey();
            addKey(Keys.KEY_DOWN, 0);
            keyPadCode = Keys.MASK_DOWN;
        }
        return true;
    }

     public boolean doKeyPadReleased(int px, int py) {
        if (!keypadDraw || keypadDrawFrame < 3) {
            return false;
        }

        //确定键
        final int KEYPAD_FIRE_W = imgKeypadFireBack.getWidth() + 10;
        final int KEYPAD_FIRE_X = SCREEN_WIDTH - 75 - (KEYPAD_FIRE_W >> 1);
        final int KEYPAD_FIRE_Y = SCREEN_HEIGHT - 55 - (KEYPAD_FIRE_W >> 1);
        if (GameContext.point(px, py, KEYPAD_FIRE_X, KEYPAD_FIRE_Y, KEYPAD_FIRE_W, KEYPAD_FIRE_W)) {
            keyMgr.resetKey();
            addKey(Keys.KEY_FIRE, 1);
            return true;
        }

        //方向键
         final int KEYPAD_DIR_W = 80;
         final int KEYPAD_CENTER_X = 90;
         final int KEYPAD_CENTER_Y = SCREEN_HEIGHT - 72;
         final int KEYPAD_LEFT_X = KEYPAD_CENTER_X - KEYPAD_DIR_W;
         final int KEYPAD_RIGHT_X = KEYPAD_CENTER_X + KEYPAD_DIR_W;
         final int KEYPAD_TOP_Y = KEYPAD_CENTER_Y - KEYPAD_DIR_W;
        if (!GameContext.point(px, py, KEYPAD_LEFT_X, KEYPAD_TOP_Y, KEYPAD_DIR_W << 1, KEYPAD_DIR_W << 1)) {
            return false;
        }
        if (px - KEYPAD_LEFT_X >= py - KEYPAD_TOP_Y && KEYPAD_RIGHT_X - px >= py - KEYPAD_TOP_Y) {
            keyMgr.resetKey();
            addKey(Keys.KEY_UP, 1);
        }
        else if (px - KEYPAD_LEFT_X >= py - KEYPAD_TOP_Y) {
            keyMgr.resetKey();
            addKey(Keys.KEY_RIGHT, 1);
        }
        else if (px - KEYPAD_LEFT_X < py - KEYPAD_TOP_Y && KEYPAD_RIGHT_X - px >= py - KEYPAD_TOP_Y) {
            keyMgr.resetKey();
            addKey(Keys.KEY_LEFT, 1);
        }
        else if (px - KEYPAD_LEFT_X <= (py - KEYPAD_TOP_Y) && (KEYPAD_RIGHT_X - px <= (py - KEYPAD_TOP_Y))) {
            keyMgr.resetKey();
            addKey(Keys.KEY_DOWN, 1);
        }
        return true;
    }

    public boolean doActorSkillPoint(int px, int py) {
        if (sceneMode || GameContext.actor.isStopKey) {
            return false;
        }

        final int[] SKILL_X = {SCREEN_WIDTH - 90, SCREEN_WIDTH - 139, SCREEN_WIDTH - 143, SCREEN_WIDTH - 32};
        final int[] SKILL_Y = {SCREEN_HEIGHT - 124, SCREEN_HEIGHT - 90, SCREEN_HEIGHT - 35, SCREEN_HEIGHT - 106};
        final int[] SKILL_KEY = {1, 3, 7, 9};
        final int SKILL_POINT_W = imgKeypadSkillBack.getWidth();
        for (int index = 0; index < SKILL_X.length; index++) {
            int pointX = SKILL_X[index] - (SKILL_POINT_W >> 1);
            int pointY = SKILL_Y[index] - (SKILL_POINT_W >> 1);
            if (GameContext.point(px, py, pointX, pointY, SKILL_POINT_W, SKILL_POINT_W)) {
                GameContext.page.addKey(SKILL_KEY[index] + Keys.KEY_NUM0, 0);
                keyPadCode = SKILL_KEY[index] - Keys.MASK_NUM0;
                return true;
            }
        }
        return false;
    }

    public void pointerReleased(int px, int py) {
        keyMgr.resetKey();
        keyPadCode = -1;
        if(isMiniGame)
        {
            GameContext.miniGame.pointerReleased(px, py);
            return;
        }
        if (showMenu) {
            switch(curInterface)
            {
                case GAMEMENU:
                    gameMenuInterfacePointerReleased(px, py);
                    break;
            }
            return;
        }
        doKeyPadReleased(px, py);
    }

    public boolean pointerDragged(int startX, int startY, int endX, int endY) {
        if ((isGameOver && isCanOverMain) || showSubtitle || isTalk || isSelectTalk) {
            return false;
        }
        if (isMiniGame) {
             return GameContext.miniGame.pointerDragged(startX, startY, endX, endY);
        }
        if (dlg.isAvailable()) {
            return false;
        }
        //#if SMS == 1
        if (sms.isShowing()) {
            return sms.pointerDragged(startX, startY, endX, endY);
        }
        //#endif
        if (observerMode) {
            return false;
        }
        if(showMenu) {
            return doMenuDragged(startX, startY, endX, endY);
        }
        return doKeyPadPoint(endX, endY);
    }

    private boolean doMenuDragged(int startX, int startY, int endX, int endY) {
        switch(curInterface)
        {
            case MAP:
                return doMapTabDragged(startX, startY, endX, endY);
            case MISSION:
                return doMissionTabDragged(startX, startY, endX, endY);
            case ACHIEVE:
                return doAchieveTabDragged(startX, startY, endX, endY);
            case GAMEMENU:
                return doGameMenuTabDragged(startX, startY, endX, endY);
            case GOODS:
                return doGoodsTabDragged(startX, startY, endX, endY);
            case ATTRI:
                if (showDec) {
                    int startx = (SCREEN_WIDTH - 370) >> 1;
                    int starty = (SCREEN_HEIGHT - 240) >> 1;
                    final int DEC_X = startx + 170;
                    final int DEC_Y = starty + 45;
                    return doShowDecDragged(startX, startY, endX, endY, DEC_X, DEC_Y, FRAME_W, FRAME_H);
                }
                return false;
            case SUPERSHOP:
            case SHOP:
                return doShopTabDragged(startX, startY, endX, endY);
        }
        return false;
    }

    private boolean doMapTabDragged(int startX, int startY, int endX, int endY) {
        final int SHOW_MAP_W = 320;
        final int SHOW_MAP_H = 175;
        final int DIS = 80;

        final int STEP_X = 10;
        final int STEP_Y = 10;
        int moveX = (endX - startX) / STEP_X;
        int moveY = (endY - startY) / STEP_Y;
        if (moveX == 0 && moveY == 0) {
            return false;
        }

        if (moveX != 0) {
            mapOffsetX -= moveX * STEP_X;
            if (mapOffsetX < 0) {
                mapOffsetX = 0;
            }
            if (mapOffsetX > miniMapWidth - SHOW_MAP_W + DIS) {
                mapOffsetX = miniMapWidth - SHOW_MAP_W + DIS;
            }
        }
        if (moveY != 0) {
            mapOffsetY -= moveY * STEP_Y;
            if (mapOffsetY < 0) {
                mapOffsetY = 0;
            }
            if (mapOffsetY > miniMapHeight - SHOW_MAP_H + DIS) {
                mapOffsetY = miniMapHeight - SHOW_MAP_H + DIS;
            }
        }
        return true;
    }

    /**
     * 拖动显示信息
     */
    private boolean doShowDecDragged(int startX, int startY, int endX, int endY, int decX, int decY, int decW, int decH) {
        if (!showDec || !showDecScroll) {
            return true;
        }
        if (!GameContext.point(startX, startY, decX, decY, decW, decH)) {
            return true;
        }
        if (!GameContext.point(endX, endY, decX, decY, decW, decH)) {
            return false;
        }
        final int DRAG_LIMIT = FishFont.LINE_HEIGHT >> 1;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        showDecY -= len * DRAG_LIMIT;
        showDecY = (showDecY > showDecTxtH - showDecFrameH) ? showDecTxtH - showDecFrameH : showDecY;
        showDecY = (showDecY < 0) ? 0 : showDecY;
        return true;
    }

    private boolean doMissionTabDragged(int startX, int startY, int endX, int endY) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (showDec) {
            final int DEC_X = startx + 200;
            final int DEC_Y = starty + 40;
            final int DEC_W = 220;
            final int DEC_H = 200;
            return doShowDecDragged(startX, startY, endX, endY, DEC_X, DEC_Y, DEC_W, DEC_H);
        }
        final int MISSION_X = startx + 222;
        final int MISSION_Y = starty + 46;
        final int MISSION_W = 144;
        final int MISSION_H = 196;
        if (!GameContext.point(startX, startY, MISSION_X, MISSION_Y, MISSION_W, MISSION_H)) {
            return true;
        }
        if (!GameContext.point(endX, endY, MISSION_X, MISSION_Y, MISSION_W, MISSION_H)) {
            return false;
        }
        final int DRAG_LIMIT = 30;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        if (subMissionList[0] != null || subMissionList.length == 0) {
        subMissionStartIndex -= len;
        subMissionStartIndex = (subMissionStartIndex > subMissionList.length - SUB_MISSION_SHOW_CNT) ? subMissionList.length - SUB_MISSION_SHOW_CNT : subMissionStartIndex;
        subMissionStartIndex = (subMissionStartIndex < 0) ? 0 : subMissionStartIndex;
        }
        return true;
    }

    private boolean doAchieveTabDragged(int startX, int startY, int endX, int endY) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (showDec) {
            final int DEC_X = startx + 200;
            final int DEC_Y = starty + 56;
            final int DEC_W = 220;
            final int DEC_H = 200;
            return doShowDecDragged(startX, startY, endX, endY, DEC_X, DEC_Y, DEC_W, DEC_H);
        }
        if (achieveType == EffortManager.EFFECT_TYPE_STATISTICS) {
            final int DRAG_X = startx + 30;
            final int DRAG_Y = starty + 77;
            final int DRAG_W = 328;
            final int DRAG_H = 140;
            if (!GameContext.point(startX, startY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
                return true;
            }
            if (!GameContext.point(endX, endY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
                return false;
            }
            final int DRAG_LIMIT = FishFont.LINE_HEIGHT;
            int len = (endY - startY) / DRAG_LIMIT;
            if (len == 0) {
                return false;
            }
            achieveStartIndex -= len;
            achieveStartIndex = (achieveStartIndex > achieveStatisticsStr.length - ACHIEVE_STATISTICS_SHOW_CNT) ? achieveStatisticsStr.length - ACHIEVE_STATISTICS_SHOW_CNT : achieveStartIndex;
            achieveStartIndex = (achieveStartIndex < 0) ? 0 : achieveStartIndex;
            achieveSelectIndex = achieveStartIndex;
            return true;
        }
        final int DRAG_X = startx + 200;
        final int DRAG_Y = starty + 80;
        final int DRAG_W = 160;
        final int DRAG_H = 145;
        if (!GameContext.point(startX, startY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
            return true;
        }
        if (!GameContext.point(endX, endY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
            return false;
        }
        final int DRAG_LIMIT = 25;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        achieveStartIndex -= len;
        achieveStartIndex = (achieveStartIndex > achieveData.length - ACHIEVE_SHOW_CNT) ? achieveData.length - ACHIEVE_SHOW_CNT : achieveStartIndex;
        achieveStartIndex = (achieveStartIndex < 0) ? 0 : achieveStartIndex;
        achieveSelectIndex = achieveStartIndex;
        return true;
    }

    private boolean doGoodsTabDragged(int startX, int startY, int endX, int endY) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        if (showDec) {
            final int DEC_Y = starty +45;
            final int DEC_W = 208;
            final int DEC_H = 205;
            int DEC_X = goodItemCenterX + 30;
            if (armorCurCol > ARMOR_COLS >> 1) {
               DEC_X = goodItemCenterX - DEC_W - 30;
            }
            return doShowDecDragged(startX, startY, endX, endY, DEC_X, DEC_Y, DEC_W, DEC_H);
        }
        if (curArmorItems == null || curArmorItems.length <= ARMOR_COLS * ARMOR_ROWS) {
            return true;
        }
        final int DRAG_X = startx;
        final int DRAG_W = 360;
        final int DRAG_Y = starty + 40;
        final int DRAG_H = 180;
        if (!GameContext.point(startX, startY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
            return true;
        }
        if (!GameContext.point(endX, endY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
            return false;
        }
        final int DRAG_LIMIT = 30;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        int itemRowCnt = curArmorItems.length / ARMOR_COLS;
        if (itemRowCnt * ARMOR_COLS < curArmorItems.length) {
            itemRowCnt++;
        }
        armorStartRow -= len;
        armorStartRow = (armorStartRow > itemRowCnt - ARMOR_ROWS) ? itemRowCnt - ARMOR_ROWS : armorStartRow;
        armorStartRow = (armorStartRow < 0) ? 0 : armorStartRow;
        return true;
    }

    private boolean doShopTabDragged(int startX, int startY, int endX, int endY) {
        int startx = (Page.SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (Page.SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        if (showDec) {
            final int DEC_Y = startx + 37;
            final int DEC_W = 172;
            final int DEC_H = 178;
            int DEC_X = SCREEN_WIDTH - DEC_W - 10;
            if (armorCurCol > ARMOR_COLS >> 1) {
                DEC_X = 10;
            }
            return doShowDecDragged(startX, startY, endX, endY, DEC_X, DEC_Y, DEC_W, DEC_H);
        }
        final int storeRows = (curInterface == SHOP) ? ARMOR_ROWS : STORE_SUPER_ROWS;
        if (buyItemId == null || buyItemId.length <= ARMOR_COLS * storeRows) {
            return true;
        }
        final int DRAG_X = startx;
        final int DRAG_W = 340;
        final int DRAG_Y = (curInterface == SHOP) ? starty + 40 : starty + 97;
        final int DRAG_H = (curInterface == SHOP) ? 180 : 140;
        if (!GameContext.point(startX, startY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
            return true;
        }
        if (!GameContext.point(endX, endY, DRAG_X, DRAG_Y, DRAG_W, DRAG_H)) {
            return false;
        }
        final int DRAG_LIMIT = 30;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        int butItemRowCnt = buyItemId.length / ARMOR_COLS;
        if (butItemRowCnt * ARMOR_COLS < buyItemId.length) {
            butItemRowCnt++;
        }
        armorStartRow -= len;
        armorStartRow = (armorStartRow > butItemRowCnt - storeRows) ? butItemRowCnt - storeRows : armorStartRow;
        armorStartRow = (armorStartRow < 0) ? 0 : armorStartRow;
        return true;
    }

    private boolean doGameMenuTabDragged(int startX, int startY, int endX, int endY) {
        if (saving) {
            return false;
        }
        switch (curGameMenuTab) {
            case SYS_MENU_LIST:
                gameMenuListKeyPointer(endX, endY);
                return true;
            case SYS_MENU_SOUND:
                return soundInterfaceDragged(startX, startY, endX, endY);
            case SYS_MENU_HELP:
                return helpInterfaceDragged(startX, startY, endX, endY);
        }
        return false;
    }
    //#endif

    public void doKeyPressed(int keyCode) {
        //#if PRINTDEBUG == 1
        System.out.println("keyPressed:" + keyCode);
        //#endif
        //#if N73
//#         if(isShowMapName && readingGame) {
//#             //这时不接受按键
//#             return;
//#         }
        //#endif

        if (isGameOver && isCanOverMain)
        {
            doInputGameOver(keyCode);
            return;
        }

        if(showSubtitle) {
            doShowSubtitle(keyCode);
            return;
        }

        if(isTalk) {
            //#if PRINTDEBUG == 1
            System.out.println("对话模式按键");
            MainCanvas.debug1 = "3";
            //#endif
            keyMgr.resetKey();
            keyMgr.keyPressed(keyCode);
            return;
        }
        if(isSelectTalk)
        {
            keyMgr.resetKey();
            keyMgr.keyPressed(keyCode);
            return;
        }

        if(dlg.isAvailable()) {
            //#if PRINTDEBUG == 1
            System.out.println("对话框按键");
            MainCanvas.debug1 = "13 ";
            //#endif
            keyMgr.resetKey();
            keyMgr.keyPressed(keyCode);
            return;
        }

        //#if SMS == 1 || SMS == 2
        if(sms != null && sms.isShowing()) {
            //#if PRINTDEBUG == 1
            System.out.println("SMS按键");
            //#endif
            sms.keyPressed(keyCode);
            return;
        }
        //#endif

        //观察者模式，不考虑按键
        if (observerMode && !isWaitTeachKey) {
            //#if PRINTDEBUG == 1
            System.out.println("观察者模式按键");
            MainCanvas.debug1 = "15 ";
            //#endif
            if (showMenu) {
                doMenuKey(keyCode);
                return;
            }
            return;
        }
        boolean isTeach = false;
        if (isWaitTeachKey) {
            if (keyCode != teachKey) {
                return;
            }
            closeTeachWait();
            isTeach = true;
        }

        if(showMenu) {
            //#if PRINTDEBUG == 1
            System.out.println("菜单按键");
            MainCanvas.debug1 = "14 ";
            //#endif
            if(curInterface == MAP || (curInterface == GAMEMENU && curGameMenuTab == SYS_MENU_HELP)) {
                keyMgr.keyPressed(keyCode);
            }
            doMenuKey(keyCode);
            if(curInterface != MAP && !(curInterface == GAMEMENU && curGameMenuTab == SYS_MENU_HELP)) {
                keyMgr.resetKey();
                keyMgr.resetKeyIm();
            }
            return;
        }

        if (doGameBtns(keyCode, isTeach)) {
            return;
        }

        keyMgr.keyPressed(keyCode);
        if(GameContext.actor != null) {
            GameContext.actor.keyPressed(keyCode);
        }
    }

    private boolean doGameBtns(int keyCode, boolean isMenuTeach) {
        if (movieMode && !isMenuTeach) {
            return false;
        }
        if (GameContext.actor.isRunSkillAttack) {
            return false;
        }
        if (keyCode == Keys.KEY_NUM0) {
            if (!teachOverGift) {
                dlg.showMessageBox("神秘礼包暂未开启");
                return false;
            }
            MusicPlayer.getInstance().playSound(SoundConst.SYSCHOOSE);
            getGiftLogic();
            return true;
        }

        if(keyCode == Keys.KEY_LEFT_SOFT) {
            showMenu = true;
            curInterface = SYSMENU;
            sysMenuCurIndex = 0;
            return true;
        }

        if (keyCode == Keys.KEY_STAR) {
//            if (!useShop) {
//                dlg.showMessageBox("随身商店暂未开启");
//                return false;
//            }
            if (sms != null) {
                sms.showStore();
            }
            return true;
        }

        return false;
    }

    public ScriptEngine getScript() {
        return script;
    }

    public static void returnMainMenu() {
        MainCanvas.removePage();
        GameContext.page = null;
        GameContext.script = null;
        MainScreen main = new MainScreen();
        main.menuCounter = 100;
        MainCanvas.addPage(main);
        main.start();
    }
    /**
     * 确认操作
     */
    public void doOkButtonFire() {
        switch(dlg.btnBoxOp) {
            case Dialog.LOAD_OP:
                startLoad();
                break;

            case Dialog.SAVE_OP:
                startSave();
                break;

            //#if UPDATA == 1
//#             case Dialog.INTO_ONLINE_OP:
//#                 GameContext.qqForum.startMBox(MBoxClient.CONN_TYPE_NOTICE_NETWORK, MBoxClient.PAGE_MAIN);
//#                 break;
            //#endif

            case Dialog.RET_MAIN_MENU_OP:
                returnMainMenu();
                break;

            case Dialog.SMS_COMMAND:
                //#if SMS == 1 || SMS == 2
                GameContext.sms.doChargeRequest(GameContext.sms.requestId);
                //#endif
                break;

            //复活逻辑
            case Dialog.LIFE_OP:
                //#if SMS == 1
                if (!Sms.allStory) {
                    GameContext.actor.setActorSuper(50);
                    GameContext.actor.hp = GameContext.actor.maxHp;
                    GameContext.actor.status = RoleConst.STAND_STATUS;
                    GameContext.actor.changeAction();
                    return;
                }
                if (sms != null) {
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
                        sms.doChargeRequest(Sms.RISE_ID);
                    }
                }
                //#endif
                break;

            case Dialog.BUY_MONEY_OP:
                if (GameContext.page.script != null) {
                    GameContext.page.script.remind(0, 0, null);
                }
                //#if SMS == 1
                if (sms != null) {
                    sms.doChargeRequest(4);
                }
                //#endif
                break;

            case Dialog.BUY_ITEM_OP:
                doBuyItem();
                break;
                
            case Dialog.SALE_ITEM_OP:
                saleGoods();
                break;

            default:
                break;
        }
    }

    final public void startLoad() {
        MissionManager.getInstance().init();
        MusicPlayer.getInstance().delMusic();
        LoadingPage loadPage = new LoadingPage();
        loadPage.startThread();
        MainCanvas.addPage(loadPage);
        status = LOAD_STATUS;
        step = 0;
        startThread();
    }

    private void startSave() {
        status = SAVE_STATUS;
        saving = true;
        step = 0;
        startThread();
    }

    public void doReturnButtonFire() {
        switch(dlg.btnBoxOp) {
            case Dialog.SMS_COMMAND:
                //#if SMS == 1 || SMS == 2
                GameContext.sms.observer.remind(0, 0, null);
                //#endif
                break;

            case Dialog.LIFE_OP:
                GameContext.page.setGameOver(Actor.DIE_STR);
                break;

            case Dialog.SALE_ITEM_OP:
                showPopMenu = true;
                break;
            case Dialog.BUY_MONEY_OP:
                if (GameContext.actor.isDie) {
                    GameContext.page.dlg.btnBoxOp = Dialog.LIFE_OP;
                    if (GameContext.version == 2) {
                        GameContext.page.dlg.showButtonBox("是否原地复活？需花费30000金钱".toCharArray());
                    }
                }
                break;
        }
    }

    public void keyReleased(int keyCode) {
        addKey(keyCode, 1);
        if(isMiniGame)
        {
            GameContext.miniGame.keyReleased(keyCode);
            return;
        }
    }

    public void doKeyReleased(int keyCode) {
        //#if PRINTDEBUG == 1
        System.out.println("KeyReleased:" + keyCode);
        //#endif
        if(waitingKey) {
            if(keyCode == waitKeyCode) {
                waitingKey = false;
                script.remind(0, 0, null);
            }
            return;
        }

        if(isTalk) {
            return;
        }

        if(observerMode) {
            if(!showMenu) {
                return;
            }
        }

        if(GameContext.actor != null) {
            GameContext.actor.keyReleased(keyCode);
        }
        keyMgr.keyReleased(keyCode);
    }

    private void doTalkKey() {
        //在滚动，不接受按键
        if(talkScrollTime > 0) {
            return;
        }

        if(!keyMgr.isPressed(Keys.MASK_FIRE) &&  !keyMgr.isPressed(Keys.MASK_NUM5)) {
            keyMgr.resetKey();
            return;
        }
        keyMgr.resetKey();
        if(endPart == 0)
        {
            return;
        }
        if(endPart < talkChs.length - 1)
        {
            startPart = endPart;
            return;
        }

        script.remind(0, 0, null);
        endTalk();

        startPart = endPart;
        startCh = endCh;
    }

    private void endTalk() {
        //清空动画索引
        final short ACTOR_FACE_ID = 74;
        if (talkFaceAni != null && talkFaceAni.ani != null && talkFaceAni.ani.id != ACTOR_FACE_ID)
        {
            AnimationManager.getInstance().releaseAni(talkFaceAni.ani);
            talkFaceAni.img = null;
        }
        talkFaceAni.ani = null;
        isTalk = false;
        talkFaceAniId = 0;
        isTalkFaceLeft = true;
    }

    public void startGame() {
        startLoading();

        GameContext.script = null;
        status = START_GAME_STATUS;
        step = 0;
        loading = true;
        startThread();
    }

    private void startThread() {
        threadRuning = true;
        new Thread(this).start();
    }

    public LoadingPage startLoading() {
        loading = true;
        LoadingPage loadingPage = new LoadingPage();
        loadingPage.startThread();
        MainCanvas.addPage(loadingPage);
        return loadingPage;
    }

    /**
     * 初始化线段数据
     */
    private void initBeattackLineData()
    {
        final int MAX_CNT = 100;
        final int EACH_CNT = 5;
        beattackLineData = new byte[MAX_CNT][EACH_CNT];
        for(int index = 0, cnt = beattackLineData.length; index < cnt; index++)
        {
            beattackLineData[index][0] = (byte) GameContext.getRand(-20, 20);
            byte start = (byte) GameContext.getRand(-20, 20);
            for(int eachIndex = 1; eachIndex < EACH_CNT; eachIndex++)
            {
                beattackLineData[index][eachIndex] = start;
                if (start > 0)
                {
                    start += GameContext.getRand(1, 15);
                }
                else
                {
                    start -= GameContext.getRand(1, 15);
                }
            }

        }
        beattackLineDataIndex = new int[MAX_CNT << 2];
        for(int index = 0; index < beattackLineDataIndex.length; index++)
        {
            beattackLineDataIndex[index] = (GameContext.getRand(0, MAX_CNT - 1) << 24)
                    | (GameContext.getRand(0, MAX_CNT - 1) << 16)
                    | (GameContext.getRand(0, MAX_CNT - 1) << 8)
                    | (GameContext.getRand(0, MAX_CNT - 1) & 0xff);

        }

    }

    /**
     * 启动游戏过程中的单步事件
     */
    private void startGameOnce() {
        switch(step) {
            case 0:
                //初始化各个部分
                MainCanvas.init();
                GameContext.clearVar();
                EffortManager.getInstance().initEffortNewGame();
                initBeattackRolePos();
                initBeattackLineData();
                //#if SMS == 1 || SMS == 2
                sms.resetRms();
                sms.saveRms();
                sms.initSmsVar();
                //#endif
                break;

            case 1:
                loadImages();
                break;

            case 2:
                //载入初始化脚本
                GameContext.script = new ScriptEngine(START_SCRIPT);
                break;

            default:
               updateScript();
               if(GameContext.script == null || status != START_GAME_STATUS) {
                   threadRuning = false;
               }
               break;
        }

        step++;
    }

    public void endLoading() {
        //执行主体脚本完毕，载入结束
        status = GAME_STATUS;
        loading = false;

        //去掉Loading
        MainCanvas.removePage();
    }

    /**
     * 获取左边方边界距离
     * @return
     */
    public int getLeftSpace()
    {
        return X_SPACE;
    }

    /**
     * 获取右边方边界距离
     * @return
     */
    public int getRightSpace()
    {
        return X_SPACE;
    }

    /**
     * 获取上方边界距离
     * 注释的部分是设定在特定的BOSS时尽量多露出BOSS的部分
     * @return
     */
    public int getTopSpace()
    {
        final int Y_SPACE = (SCREEN_HEIGHT - ACTOR_STATE_HEIGHT) * 3 / 5;
        return Y_SPACE;
    }

    /**
     * 获取下方边界距离
     * 注释的部分是设定在特定的BOSS时尽量多露出BOSS的部分
     * @return
     */
    private int getDownSpace()
    {
        final int Y_SPACE = (SCREEN_HEIGHT - ACTOR_STATE_HEIGHT) * 2 / 5;
        return Y_SPACE;
    }

    public void updateCameraByActorPos()
    {
        if(holdCamera) {
            return;
        }
        if(isNpcCamera)
        {
            return;
        }
        if(GameContext.actor == null) {
            return;
        }
        //立即跳转到那里
        resetMoveCameraPosition(GameContext.actor.x, GameContext.page.offsetY + (showHeight >> 1));
        jumpToCameraPosition();
    }

    public void setCameraMoveByNpc(boolean isNpcCamera, String nameName)
    {
        this.isNpcCamera = isNpcCamera;
        npcNameCamera = nameName;
    }

    /**
     * 移动摄像机
     * @param x
     * @param y
     */
    private void updateCameraByRole(Role role) {
        Map map = GameContext.map;
        if(map == null) {
            return;
        }

        int x = role.x;
        int y = role.y;
        int leftSpace = x - offsetX;
        int topSpace = y - offsetY;

        if(leftSpace < getLeftSpace()) {
            offsetX -= (getLeftSpace() - leftSpace);
            if(offsetX < 0) {
                offsetX = 0;
            }
        }

        if(topSpace < getTopSpace()) {
            offsetY -= (getTopSpace() - topSpace);
            if(offsetY < 0) {
                offsetY = 0;
            }
        }

        int rightSpace = SCREEN_WIDTH - leftSpace;
        int bottomSpace = SCREEN_HEIGHT - topSpace;

        if(rightSpace < getRightSpace()) {
            offsetX += (getRightSpace() - rightSpace);
            int maxOffsetX = map.width - SCREEN_WIDTH;
            if(offsetX > maxOffsetX) {
                offsetX = maxOffsetX;
            }
        }

        if(bottomSpace < getDownSpace()) {
            offsetY += (getDownSpace() - bottomSpace);
            int maxOffsetY = map.height - (SCREEN_HEIGHT - ACTOR_STATE_HEIGHT);
            if(offsetY > maxOffsetY) {
                offsetY = maxOffsetY;
            }
        }
        if(GameContext.map.minOffsetX != 0)
        {
            offsetX = GameContext.map.minOffsetX;
        }
        if(GameContext.map.minOffsetY != 0)
        {
            offsetY = GameContext.map.minOffsetY;
        }
    }

    /**
     * 摄像机跟随actor
     */
    public void updateCameraByActor() {
        if(holdCamera) {
            return;
        }
        if(isNpcCamera) {
            return;
        }
        if (GameContext.actor == null) {
            return;
        }
        updateCameraByRole(GameContext.actor);
    }

    /**
     * 摄像头跟随npc
     */
    public void updateCameraByNpc()
    {
        if(holdCamera) {
            return;
        }
        if(!isNpcCamera)
        {
            return;
        }
        Role role = RoleManager.getInstance().getNpc(npcNameCamera);
        if (role == null) {
            isNpcCamera = false;
            return;
        }
        updateCameraByRole(role);
    }

    //绘制游戏中主角的状态
    Image imgActorLv;

    //载入过程图片
    final int NO_BALL = 0;
    final int PURPLE_BALL = 1;
    final int BLUE_BALL = 2;
    final int RED_BALL = 3;

    //显示按键9
    boolean show9Key;
    int interval9Key;

    //显示按键7
    boolean show7Key;
    //
    final int MAX_HP = 1100;
    final int MAX_MP = 1200;
    char[] actorLvTitle;
    //下面是绘制主角站立动画的部分
    int actorFrameId;
    int actorDuration;

    //绘制场景开始时显示地图名称的界面
    boolean isShowMapName;
    char[] mapName;
    //显示地图名字的时候的方向
    //0表示向上走
    //1表示停
    //2表示向下走
    int showMapNameDir;
    //停止的时间
    int mapNameHoldTime;
    int mapNameOffset;

    private void showMapNameFromLoad()
    {
        isShowMapName = true;
        showMapNameDir = 0;
        mapNameOffset = 0;
        mapNameHoldTime = 0;
    }


    final public void showMapName() {
        isShowMapName = true;
        showMapNameDir = 0;
        mapNameOffset = 0;
        mapNameHoldTime = 0;
        refreshMapName();
    }

    final public void refreshMapName() {
        int mapId = GameContext.map.id;
        if (mapNames == null) {
            mapName = "未知".toCharArray();
            return;
        }
        for(int i = 0, size = mapNames.length; i < size; i++) {
            if(mapIds[i] == mapId) {
                mapName = mapNames[i];
                return;
            }
        }
        mapName = "未知".toCharArray();
    }
    private void drawMapName(Graphics g) {
        if(!isShowMapName) {
            return;
        }

        final int Y = (SCREEN_HEIGHT >> 1) - 60;

        g.setColor(0xffffff);
        int nameWidth = font.charsWidth(mapName);

        final int WIDTH = nameWidth + 4;
        int lineX = (SCREEN_WIDTH - WIDTH) >> 1;
        g.drawLine(lineX, Y, lineX + WIDTH, Y);
        g.drawLine(lineX, Y + 1, lineX + WIDTH, Y + 1);

        final int TXT_X = (SCREEN_WIDTH - nameWidth) >> 1;

        g.setClip(TXT_X, Y - mapNameOffset, nameWidth, mapNameOffset);
        font.drawTextWithBorder(g, mapName, TXT_X, Y - mapNameOffset, 0xffffff, 0);
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);        
        final int STEP = 1;
        final int MAX_OFFSET = FishFont.FONT_HEIGHT + 5;
        switch(showMapNameDir) {
            case 0:
                mapNameOffset += STEP;
                if(mapNameOffset >= MAX_OFFSET) {
                    mapNameOffset = MAX_OFFSET;
                    showMapNameDir = 1;
                }
                break;

            case 1:
                mapNameHoldTime++;
                if(mapNameHoldTime >= 10) {
                    showMapNameDir = 2;
                }
                break;

            case 2:
                mapNameOffset -= STEP;
                if(mapNameOffset <= 0) {
                    isShowMapName = false;
                    readingGame = false;
                }
                break;
        }
    }

    ///////////////////////////////////////////////////////////////////////////

    boolean showMenu;
    //确定文本
    char[] okTxt;

    //#if POINT == 1
    char[] setVolTxt;
    //#endif

    private void saveGame()
    {
        ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
        DataOutputStream dataOut = new DataOutputStream(byteOut);
        try
        {            
            saveGameProgress(dataOut);
            GameContext.saveGame(byteOut.toByteArray());
            dataOut.close();
            byteOut.close();
            Thread.sleep(1000);
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
        //#if SMS == 1 || SMS == 2
        sms.saveRms();
        //#endif
        status = GAME_STATUS;
        saving = false;
        step = 0;
        threadRuning = false;
    }    

    private char[][] selectTalk;
    private int selectTalkIndex;
    public void initSelectTalk(char[][] selectTalk)
    {
        initTalk();
        drawSelectTalkCount = 0;
        drawSelectTalkLineDis = 0;
        isTalk = false;
        isSelectTalk = true;
        selectTalkIndex = 0;
        this.selectTalk = selectTalk;
    }

    private void doSelectTalkKey()
    {
        //在滚动，不接受按键
        if(talkScrollTime > 0) {
            return;
        }
        if((selectTalk.length >= 1 && keyMgr.isPressed(Keys.MASK_NUM1)))
        {
            selectTalkIndex = 0;
            endSelectTalk();
            keyMgr.resetKey();
            return;
        }
        if((selectTalk.length >= 2 && keyMgr.isPressed(Keys.MASK_NUM2)))
        {
            selectTalkIndex = 1;
            endSelectTalk();
            keyMgr.resetKey();
            return;
        }
        if((selectTalk.length >= 3 && keyMgr.isPressed(Keys.MASK_NUM3)))
        {
            selectTalkIndex = 2;
            endSelectTalk();
            keyMgr.resetKey();
            return;
        }

        if(keyMgr.isPressed(Keys.MASK_UP))
        {
            if(selectTalkIndex > 0)
            {
                selectTalkIndex --;
            }
            drawSelectTalkCount = 0;
            drawSelectTalkLineDis = 0;
            keyMgr.resetKey();
            return;
        }
        if(keyMgr.isPressed(Keys.MASK_DOWN))
        {
            if(selectTalkIndex < selectTalk.length - 1)
            {
                selectTalkIndex ++;
            }
            drawSelectTalkCount = 0;
            drawSelectTalkLineDis = 0;
            keyMgr.resetKey();
            return;
        }

        if(keyMgr.isPressed(Keys.MASK_NUM0)) {
            endSelectTalk();
            keyMgr.resetKey();
            return;
        }
        keyMgr.resetKey();
    }

    private void endSelectTalk() {
        script.remind(0, selectTalkIndex, null);
        //清空动画索引
        final short ACTOR_FACE_ID = 74;
        if (talkFaceAni != null && talkFaceAni.ani != null && talkFaceAni.ani.id != ACTOR_FACE_ID)
        {
            AnimationManager.getInstance().releaseAni(talkFaceAni.ani);
            talkFaceAni.img = null;
        }
        talkFaceAni.ani = null;
        isSelectTalk = false;
        talkFaceAniId = 0;
        isTalkFaceLeft = true;
    }

    public void keyMenuEvent(int event, int data1, Object data2)
    {
        
    }

    public void closeMenu()
    {
        showMenu = false;
    }

    public void openMenu()
    {
        showMenu = true;
    }

    public void initShowScreen()
    {
        showWidth = SCREEN_WIDTH;
        showHeight = SCREEN_HEIGHT - ACTOR_STATE_HEIGHT;
    }

    public void setShowScreen(int width, int height)
    {
        showWidth = width;
        showHeight = height;
    }

    //#if UPDATA == 1
//#     public void qqListener(String str, int type)
//#     {
//#         GameContext.page.menuView.updateOverStr = str.toCharArray();
//#         GameContext.page.menuView.curTab = PageSize.UPDATE_OVER_TAB;
//#     }
    //#endif
    
    //菜单相关
    boolean tabActive;
    int curTab;
    int subMenu;   
    
    //界面索引值
    //属性界面
    static final int ATTRI = 0;
    //强化界面
    static final int ENCHANT = 1;
    //成就界面
    static final int ACHIEVE = 3;
    //任务界面
    static final int MISSION = 4;
    //商店界面
    static final int SHOP = 5;
    //物品界面
    static final int GOODS = 6;
    //系统菜单界面
    static final int SYSMENU = 7;
    //游戏中菜单
    static final int GAMEMENU = 9;
    //炼化界面
    static final int ARTIFICE = 10;
    //配方界面
    static final int FORMULA = 11;
    //计费界面
    static final int CHARGE = 12;
    //地图界面
    static final int MAP = 13;
    //超级商店界面
    static final int SUPERSHOP = 14;

    //系统菜单列表
    static final int SYS_MENU_LIST = 0;
    //存档选项
    static final int SYS_MENU_SAVE = 1;
    //音量选项
    static final int SYS_MENU_SOUND = 2;
    //帮助选项
    static final int SYS_MENU_HELP = 3;
    //回主菜单选项
    static final int SYS_MENU_RETURN_MAIN = 4;
    //系统菜单选项
    int curGameMenuTab = SYS_MENU_LIST;
    int gameMenuIndex;
    
    static final int WIDTH_FRAME = 361;
    static final int HEIGHT_FRAME = 241;
    FishFont fishFont;

    //蒙版
    final int MASK_CNT = 10;
    Image imgMask;

    //上边图片
    Image upSide;
    //左边和右边
    Image leftSide;
    //下边图片
    Image downSide;
    //红条图片
    Image redStrip;
    //锯齿图片
    Image sawtooth;
    //锁链图片
    Image chain;
    //轮子图片
    Image wheel;
    //右上角图片
    Image rightTopAngle;
    //外三角
    Image triangleOutside;
    //界面标题框
    Image titleFrame;
    //界面标题
    Image titleFont;
    //返回框
    Image retFrame;
    //内三角
    Image triangleInside;
    Image upAndDownSide;
    Image leftAndRightSide;
    //是否按钮
    Image yesAndNoButton;
    Image yesAndNoFont;
    //是否字体
    //内三角2
    Image triangleInside2;
    //武器框
    Image weaponFrame;
    //计费物品图标
    Image smsItemIcon;
    //选中框
    Image selectFrame;
    //物品框
    Image goodsFrame;
    //金钱小图片
    Image moneyIcon;
    
    //游戏中菜单界面
    //普通菜单框
    Image menuFrame;
    //选中菜单框
    Image selectMenuFrame;
    
    //炼化界面
    Image blueBack;
    //吊链
    Image suspendChain;
    //箱子
    Image box;
    PaintUnit stove = new PaintUnit();
    //炉子框
    Image stoveFrameOutside;
    Image stoveFrameInside;
    //箭头
    Image arrowPurple;
    Image arrowRed;
    Image arrowFrame;
    //炼化装饰
    Image decorateArtifice;
    //几种火的图标
    Image fireBackFrame;
    Image fireIcon[] = new Image[5];
    
    //人物轮廓
    Image personOutline;
    //红色渐变
    Image redShade;
    //连接线
    //横向
    Image linkLineHori;
    //纵向
    Image linkLineVert;
    //成就界面
    //成就框
    Image achieveFrame;
    Image achieveSelectFrame;
    Image achieveFrameMid;
    Image achieveTypeName;
    
    //滚动条
    Image scrollBarHead;
    Image scrollBarMid;
    //游标
    Image scrollCursor;
    //配方边框
    Image formulaFrame;
    
    //绘制任务界面
    //蓝色渐变
    Image blueShade;
    Image attriBoard;
    
    Image sysMenuBackFrame;
    Image sysMenuFont;
    Image sysMenuFontSelect;
    
    //返回确定字体
    Image retAndFireFont;
    
    Image soundIcon;
    Image soundCursor;
    
    Image bigBackFrame;
    Image smallBackFrameLeft;
    Image smallBackFrameUp;
    
    Image sparBack;
    Image sparIcon;
    Image sparFont;
    Image gameMenuFontSelect;
    Image gameMenuFont;
    
    Image levelFont;
    Image numberBig;
    Image numberSmall;
    Image expFill;
    
    Image stallButton;
    Image artificeFont;

    //任务界面
    Image imgMissionTypeTitle;
    Image imgMissionFinishTxt;
    
    //动态选择框
    PaintUnit selectFrameAnimal = new PaintUnit();
    
    //炼制火苗
    PaintUnit[] fireArtifice;
    
    //物品格中的字体
    Image goodsFont;
    
    //强化动画
    PaintUnit enchantFirst = new PaintUnit();
    PaintUnit enchantSecond = new PaintUnit();
    Image lvNumber;
    Image spritAndLv;
    
    //加载界面图片
    private void loadMenuImages() {
        fishFont = FishFont.getInstance();
        //界面背景框相关图片
        upSide = imgMgr.getImage((short)95);
        leftSide = imgMgr.getImage((short)123);
        downSide = imgMgr.getImage((short)121);
        redStrip = imgMgr.getImage((short)120);
        sawtooth = imgMgr.getImage((short)96);
        chain = imgMgr.getImage((short)101);
        wheel = imgMgr.getImage((short)119);
        rightTopAngle = imgMgr.getImage((short)116);
        triangleOutside = imgMgr.getImage((short)133);
        titleFrame = imgMgr.getImage((short)139);
        retFrame = imgMgr.getImage((short)98);
        
        triangleInside = imgMgr.getImage((short)108);
        triangleInside2 = imgMgr.getImage((short)128);
        weaponFrame = imgMgr.getImage((short)107);
        smsItemIcon = imgMgr.getImage((short)257);
        selectFrame = imgMgr.getImage((short)114);
        goodsFrame = imgMgr.getImage((short)106);
        moneyIcon = imgMgr.getImage((short)103);
        imgItemEquip = imgMgr.getImage((short)285);
        
        menuFrame = imgMgr.getImage((short)111);
        selectMenuFrame = imgMgr.getImage((short)112);
        
        achieveFrame = imgMgr.getImage((short)97);
        achieveFrameMid = imgMgr.getImage((short)99);
        achieveSelectFrame = imgMgr.getImage((short)131);
        achieveTypeName = imgMgr.getImage((short)209);
        scrollCursor = FishFont.scrollCursor;
        scrollBarHead = FishFont.scrollBarHead;
        scrollBarMid = FishFont.scrollBarMid;
        
        blueBack = imgMgr.getImage((short)109);
        suspendChain = imgMgr.getImage((short)102);
        box = imgMgr.getImage((short)138);        
        AnimationManager.getInstance().getAnimation((short)88, stove);
        stove.actId = 0;
        stove.initFrame();
        
        stoveFrameOutside = imgMgr.getImage((short)177);
        stoveFrameInside = imgMgr.getImage((short)176);

        arrowPurple = imgMgr.getImage((short)181);
        arrowRed = imgMgr.getImage((short)180);
        arrowFrame = imgMgr.getImage((short)153);
        decorateArtifice = imgMgr.getImage((short)160);
        fireBackFrame = imgMgr.getImage((short)154);
        fireIcon[0] = imgMgr.getImage((short)155);
        fireIcon[1] = imgMgr.getImage((short)156);
        fireIcon[2] = imgMgr.getImage((short)157);
        fireIcon[3] = imgMgr.getImage((short)158);
        fireIcon[4] = imgMgr.getImage((short)159);
        
        formulaFrame = imgMgr.getImage((short)125);
        blueShade = imgMgr.getImage((short)104);
        redShade = imgMgr.getImage((short)105);
        
        linkLineHori = imgMgr.getImage((short)129);
        linkLineVert = imgMgr.getImage((short)130);
        personOutline = imgMgr.getImage((short)135);
        attriBoard = imgMgr.getImage((short)134);
        
        sysMenuBackFrame = imgMgr.getImage((short)110);
        sysMenuFont = imgMgr.getImage((short)198);
        sysMenuFontSelect = imgMgr.getImage((short)199);
        
        retAndFireFont = imgMgr.getImage((short)200);
        
        upAndDownSide = imgMgr.getImage((short)174);
        leftAndRightSide = imgMgr.getImage((short)175);
        yesAndNoButton = imgMgr.getImage((short)118);
        yesAndNoFont = imgMgr.getImage((short)195);
        
        soundIcon = imgMgr.getImage((short)178);
        soundCursor = imgMgr.getImage((short)179);
        
        bigBackFrame = imgMgr.getImage((short)122);        
        smallBackFrameUp = imgMgr.getImage((short)126);
        smallBackFrameLeft = imgMgr.getImage((short)127);
        
        titleFont = imgMgr.getImage((short)201);
        sparBack = imgMgr.getImage((short)161);
        sparIcon = imgMgr.getImage((short)136);
        sparFont = imgMgr.getImage((short)206);
        
        gameMenuFontSelect = imgMgr.getImage((short)207);
        gameMenuFont = imgMgr.getImage((short)208);
        
        levelFont = imgMgr.getImage((short)205);
        numberBig = imgMgr.getImage((short)196);
        numberSmall = imgMgr.getImage((short)197);
        expFill = imgMgr.getImage((short)217);
        
        stallButton = imgMgr.getImage((short)117);
        artificeFont = imgMgr.getImage((short)204);

        imgMissionTypeTitle = imgMgr.getImage((short)203);
        imgMissionFinishTxt = imgMgr.getImage((short)202);
        
        AnimationManager.getInstance().getAnimation((short)85, selectFrameAnimal);
        selectFrameAnimal.actId = 0;
        selectFrameAnimal.initFrame();
        
        goodsFont = imgMgr.getImage((short)283);
        
        //强化动画
        AnimationManager.getInstance().getAnimation((short)132, enchantFirst);
        enchantFirst.actId = 1;
        enchantFirst.initFrame();
        
        AnimationManager.getInstance().getAnimation((short)132, enchantSecond);
        enchantSecond.actId = 0;
        enchantSecond.initFrame();
        
        lvNumber = imgMgr.getImage((short)264);
        spritAndLv = imgMgr.getImage((short)286); 

        fireArtifice = new PaintUnit[2];
        for (int index = 0; index < fireArtifice.length; index++) {
            fireArtifice[index] = new PaintUnit();
            AnimationManager.getInstance().getAnimation((short)87, fireArtifice[index]);
            fireArtifice[index].actId = 1;
            fireArtifice[index].initFrame();
        }

        addUnit = new PaintUnit();
        AnimationManager.getInstance().getAnimation((short)139, addUnit);
        addUnit.y = 19;
        addUnit.actId = 2;
        addUnit.initFrame();
        minusUnit = new PaintUnit();
        AnimationManager.getInstance().getAnimation((short)139, minusUnit);
        minusUnit.y = 9;
        minusUnit.actId = 3;
        minusUnit.initFrame();
    }
    
    /**
     * 删除菜单图片
     */
    private void releaseMenuImages()
    {       
    }
    
    private void loadMenuResources() {
        strMgr = StringManager.getInstance();
        final short OK_TXT = 27;
        okTxt = strMgr.getString(OK_TXT);
        final short SAVING_TXT = 68;
        savingTxt = strMgr.getString(SAVING_TXT);
        loadMiniMap();
    }

    static int curInterface = SYSMENU;
    static int oldInterface = -1;
    void drawMenu(Graphics g) {
        drawFullScreenMask(g);
        switch (curInterface) {
            //绘制属性界面
            case ATTRI:
                drawAttributeInterface(g);
                break;
            case ENCHANT:
                drawEnchantInterface(g);
                break;
            case ACHIEVE:
                drawAchieveInterface(g);
                break;
            case ARTIFICE:
                drawArtificeInterface(g);
                break;
            case FORMULA:
                drawFormulaInterface(g);
                break;
            case MISSION:
                drawMissionInterface(g);
                break;
            case SHOP:
                drawShopInterface(g);
                break;
            case SUPERSHOP:
                drawSuperShopInterface(g);
                break;
            case GOODS:
                drawGoodsInterface(g);
                break;
            case SYSMENU:
                drawSystemMenuInterface(g);
                break;
            case GAMEMENU:
                drawGameMenuInterface(g);
                break;
            case CHARGE:
                drawChargeInterface(g);
                break;
            case MAP:
                drawMapInterface(g);
                break;
        }
    }
    
    //绘制计费界面
    void drawChargeInterface(Graphics g) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        int offsetx = 0;
        int offsety = 0;
        int curx = 0;
        int cury = 0;
        drawCommonImage(g, startx, starty, offsety);
        
        //填充颜色
        offsetx = 19;
        offsety = 182;
        curx = startx + offsetx;
        cury = starty + offsety;
        g.setColor(0x1f1e1d);
        g.fillRect(curx, cury, 327, 15);        
        
        offsetx = 10;
        offsety = 27;
        int totalw = 343;
        int totalh = 175;
        drawInsideFrame(g, startx, starty, offsetx, offsety, totalw, totalh);
        
        //绘制左下角按钮字体和右下角按钮字体
        offsetx = -16;
        offsety = 209;
        curx = startx + offsetx;
        cury = starty + offsety;
        int w = yesAndNoFont.getWidth();
        int h = yesAndNoFont.getHeight();
        g.drawImage(yesAndNoButton, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, yesAndNoFont, 0, 0, 24, h, Sprite.TRANS_NONE, curx + 8, cury + 10, Graphics.LEFT | Graphics.TOP);
        offsetx = 334;
        offsety = 209;
        curx = startx + offsetx;
        cury = starty + offsety;
        g.drawImage(yesAndNoButton, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, yesAndNoFont, 24, 0, 21, h, Sprite.TRANS_NONE, curx + 8, cury + 10, Graphics.LEFT | Graphics.TOP);
    }
    
    void drawInsideFrame(Graphics g, int startx, int starty, int offsetx, int offsety, int totalw, int totalh) {
        //绘制小背景框
        //绘制左上角        
        int curx = startx + offsetx;
        int cury = starty + offsety;
        int w = triangleInside.getWidth();
        int h = triangleInside.getHeight();
        int clipx = g.getClipX();
        int clipy = g.getClipY();
        int clipw = g.getClipWidth();
        int cliph = g.getClipHeight();
        g.setClip(curx, cury, totalw, totalh);
        
        //绘制左上、右上、右下、左下四个角
        g.drawImage(triangleInside, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, triangleInside, 0, 0, w, h, Sprite.TRANS_ROT90, curx + totalw, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, triangleInside, 0, 0, w, h, Sprite.TRANS_ROT180, curx + totalw - w, cury + totalh - h, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, triangleInside, 0, 0, w, h, Sprite.TRANS_ROT270, curx, cury + totalh - h, Graphics.LEFT | Graphics.TOP);
        curx += w;
        //绘制上边中间部分       
        
        int curClipw = totalw - 2 * w;
        int curClipx = curx;
        w = upAndDownSide.getWidth();
        h = upAndDownSide.getHeight();
        
        int num = curClipw / w + 1;
        for (int i = 0; i < num; i++) {
            g.setClip(curClipx, cury, curClipw, h);
            g.drawImage(upAndDownSide, curx, cury, Graphics.LEFT | Graphics.TOP);
            g.setClip(curClipx, cury + totalh - h, curClipw, h);
            Util.drawRegion(g, upAndDownSide, 0, 0, w, h, Sprite.TRANS_ROT180, curx, cury + totalh - h, Graphics.LEFT | Graphics.TOP);
            curx += w;
        }
        //绘制左边        
        int curCliph = totalh - 2 * triangleInside.getHeight();
        w = leftAndRightSide.getWidth();
        h = leftAndRightSide.getHeight();
        curx = startx + offsetx;
        cury = starty + offsety + triangleInside.getHeight();        
        num = curCliph / h + 1;
        int curClipy = cury;
        for (int i = 0; i < num; i++) {
            g.setClip(curx, curClipy, w, curCliph);
            g.drawImage(leftAndRightSide, curx, cury, Graphics.LEFT | Graphics.TOP);
            g.setClip(curx + totalw - w, curClipy, w, curCliph);
            Util.drawRegion(g, leftAndRightSide, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + totalw - w, cury, Graphics.LEFT | Graphics.TOP);
            cury += h;
        }        
        //重绘右上角框
        offsetx = 51;
        offsety = 7;
        curx = startx + WIDTH_FRAME - offsetx;
        cury = starty + offsety;
        w = rightTopAngle.getWidth();
        h = rightTopAngle.getHeight();
        g.setClip(curx, cury, w, h);
        g.drawImage(rightTopAngle, curx, cury, Graphics.LEFT | Graphics.TOP);
        g.setClip(clipx, clipy, clipw, cliph);
    }

    void drawInterfaceTitle(Graphics g, int startx, int starty, int titleIndex) {
        int offsetx = (WIDTH_FRAME >> 1) - titleFrame.getWidth();
        int offsety = 2;
        int curx = startx + offsetx;
        int cury = starty + offsety;
        int w = titleFrame.getWidth();
        int h = titleFrame.getHeight();
        Util.drawRegion(g, titleFrame, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.VCENTER);
        curx += w;
        g.drawImage(titleFrame, curx, cury, Graphics.LEFT | Graphics.VCENTER);

        final int titleImgW = titleFont.getWidth();
        final int titleImgH = titleFont.getHeight() / 9;
        offsetx = (WIDTH_FRAME - titleImgW) >> 1;
        offsety = -6;
        curx = startx + offsetx;
        cury = starty + offsety;
        Util.drawClipImage(g, titleFont, curx, cury, 0, titleImgH * titleIndex, titleImgW, titleImgH);
    }
    
    //绘制地图界面
    void drawMapInterface(Graphics g) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        //绘制两个线框
        int offsetx = 0;
        int offsety = 0;
        int curx = 0;
        int cury = 0;
        drawCommonImage(g, startx, starty, offsety);
        
        final int mapTitleIndex = 6;
        drawInterfaceTitle(g, startx, starty, mapTitleIndex);
        
//        offsetx = 4;
//        offsety = 20;
//        int totalw = 353;
//        int totalh = 208;
//        drawInsideFrame(g, startx, starty, offsetx, offsety, totalw, totalh);

        offsetx = 15;
        offsety = 26;
        curx = startx + offsetx;
        cury = starty + offsety;
        int totalw = 320;
        int totalh = 175;
        drawMiniMap(g, curx, cury, totalw, totalh);

        //绘制箭头
        final int DIR_CENTER_X = curx + (totalw >> 1);
        final int DIR_CENTER_Y = cury + (totalh >> 1);
        final int DIR_CENTER_X_R = (totalw >> 1) - 10;
        final int DIR_CENTER_Y_R = (totalh >> 1) - 10;
        g.drawImage(imgKeypadDir, DIR_CENTER_X - (imgKeypadDir.getWidth() >> 1), DIR_CENTER_Y - DIR_CENTER_Y_R, Graphics.LEFT | Graphics.BOTTOM);
        Util.drawRegion(g, imgKeypadDir, 0, 0, imgKeypadDir.getWidth(), imgKeypadDir.getHeight(), Sprite.TRANS_ROT180, DIR_CENTER_X - (imgKeypadDir.getWidth() >> 1), DIR_CENTER_Y + DIR_CENTER_Y_R, 0);
        Util.drawRegion(g, imgKeypadDir, 0, 0, imgKeypadDir.getWidth(), imgKeypadDir.getHeight(), Sprite.TRANS_ROT90, DIR_CENTER_X + DIR_CENTER_X_R, DIR_CENTER_Y - (imgKeypadDir.getWidth() >> 1), 0);
        Util.drawRegion(g, imgKeypadDir, 0, 0, imgKeypadDir.getWidth(), imgKeypadDir.getHeight(), Sprite.TRANS_ROT270, DIR_CENTER_X - DIR_CENTER_X_R, DIR_CENTER_Y - (imgKeypadDir.getWidth() >> 1), Graphics.RIGHT | Graphics.TOP);
        
//        //绘制返回框
//        offsetx = 302;
//        offsety = 216;
//        curx = startx + offsetx;
//        cury = starty + offsety;
//        g.drawImage(retFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
//        Util.drawClipImage(g, retAndFireFont, curx + 12, cury + 7, 0, 0, retAndFireFont.getWidth(), retAndFireFont.getHeight() >> 1);
    }
    //绘制音量界面
    void drawSoundInterface(Graphics g) {

        drawFullScreenMask(g);
        final int curSoundLv = MusicPlayer.getInstance().curSoundLv;
        //绘制音量图标
        int curx = SCREEN_WIDTH >> 2;
        int cury = (SCREEN_HEIGHT >> 1) - soundIcon.getHeight();
        int w = soundIcon.getWidth();
        int h = soundIcon.getHeight();
        g.drawImage(soundIcon, curx, cury, Graphics.LEFT | Graphics.TOP);
        cury += h;
        Util.drawRegion(g, soundIcon, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制5个矩形区域
        curx = (SCREEN_WIDTH >> 2) + soundIcon.getWidth() + 10;
        cury = (SCREEN_HEIGHT >> 1) - 8;
        w = 11;
        h = 19;
        int color = (curSoundLv > 0) ? 0x85ffe1 : 0x666869;
        g.setColor(color);
        g.fillRect(curx, cury, w, h);
        g.fillRect(curx - 1, cury + 1, w + 2, h - 2);

        curx+=26;
        cury = (SCREEN_HEIGHT >> 1) - 16;
        w = 13;
        h = 27;
        color = (curSoundLv > 1) ? 0x85ffe1 : 0x666869;
        g.setColor(color);
        g.fillRect(curx, cury, w, h);
        g.fillRect(curx - 1, cury + 1, w + 2, h - 2);

        curx+=29;
        cury = (SCREEN_HEIGHT >> 1) - 25;
        w = 14;
        h = 36;
        color = (curSoundLv > 2) ? 0x85ffe1 : 0x666869;
        g.setColor(color);
        g.fillRect(curx, cury, w, h);
        g.fillRect(curx - 1, cury + 1, w + 2, h - 2);

        curx += 35;
        cury = (SCREEN_HEIGHT >> 1) - 35;
        w = 20;
        h = 46;
        color = (curSoundLv > 3) ? 0x85ffe1 : 0x666869;
        g.setColor(color);
        g.fillRect(curx, cury, w, h);
        g.fillRect(curx - 1, cury + 1, w + 2, h - 2);

        curx += 36;
        cury = (SCREEN_HEIGHT >> 1) - 44;
        w = 25;
        h = 55;
        color = (curSoundLv > 4) ? 0x85ffe1 : 0x666869;
        g.setColor(color);
        g.fillRect(curx, cury, w, h);
        g.fillRect(curx - 1, cury + 1, w + 2, h - 2);
        
        //绘制滚动区域

        curx = (SCREEN_WIDTH >> 2) + soundIcon.getWidth() + 10;
        cury = (SCREEN_HEIGHT >> 1) + 20;
        w = 135;
        h = 4;
        g.setColor(0x050e2a);
        g.fillRect(curx, cury, w, h);

        //绘制滚动游标
        int lvX = curSoundLv * w / MusicPlayer.ALL_SOUND_LV;
        lvX += curx;
        w = soundCursor.getWidth();
        h = soundCursor.getHeight();
        int lvY = cury - w + 2;
        g.drawImage(soundCursor, lvX, lvY, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, soundCursor, 0, 0, w, h, Sprite.TRANS_MIRROR, lvX, lvY, Graphics.LEFT | Graphics.TOP);

        final int BTN_X = SCREEN_WIDTH - retFrame.getWidth() + 10;
        final int BTN_Y = SCREEN_HEIGHT - retFrame.getHeight() - 3;
        g.drawImage(retFrame, BTN_X, BTN_Y, 0);
        Util.drawClipImage(g, retAndFireFont, BTN_X + 12, BTN_Y + 7, 0, 0, retAndFireFont.getWidth(), retAndFireFont.getHeight() / 3);

    }
    
    String officialName[] = {
        "校尉", "小旗", "总旗", "百户", "千户", "镇抚使", "佥事", "同知", "都督", "指挥使"
    };
//    boolean isShowAttriExplainFrame = false;
    boolean isShowAttriStallFrame = false;
    int attriIndex = 0;
    final int FRAME_W = 180;
    final int FRAME_H = 200;
    //绘制属性界面
    void drawAttributeInterface(Graphics g) {
        int offsety = 0;
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        int curx = 0;
        int cury = 0;
        drawCommonImage(g, startx, starty, offsety);
        int titleIndex = 3;
        drawInterfaceTitle(g, startx, starty, titleIndex);
//        //绘制红色渐变区域
//        //左边
        int offsetx = 21;
        offsety = 32;
        curx = startx + offsetx;
        cury = starty + offsety;
        int w = redShade.getWidth();
        int h = redShade.getHeight();
        g.drawImage(redShade, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, redShade, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury + h, Graphics.LEFT | Graphics.TOP);
        //绘制等级字体
        int fontw = levelFont.getWidth();
        int fonth = levelFont.getHeight() / 2;
        Util.drawRegion(g, levelFont, 0, 0, fontw, fonth, Sprite.TRANS_NONE, curx + 4, cury + 1, Graphics.LEFT | Graphics.TOP);
        String str = Integer.toString(GameContext.actor.getLevel());
        int index;
        fontw = numberBig.getWidth() / 10;
        fonth = numberBig.getHeight();
        for (int i = 0; i < str.length(); i++) {
            index = str.charAt(i) - '0';
            Util.drawRegion(g, numberBig, index * fontw, 0, fontw, fonth, Sprite.TRANS_NONE, curx + 53 + i * fontw, cury + 5, Graphics.LEFT | Graphics.TOP);
        }
        //右边
        offsetx = 164;
        offsety = 32;
        curx = startx + offsetx;
        cury = starty + offsety;
        fontw = levelFont.getWidth();
        fonth = levelFont.getHeight() / 2;
        g.drawImage(redShade, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, redShade, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury + h, Graphics.LEFT | Graphics.TOP);
        //绘制官职字体
        Util.drawRegion(g, levelFont, 0, fonth, fontw, fonth, Sprite.TRANS_NONE, curx + 4, cury + 1, Graphics.LEFT | Graphics.TOP);
        g.setColor(0xfdfca5);
        font.drawString(g, officialName[GameContext.actor.officialLv], curx + 52, cury + 2, Graphics.LEFT | Graphics.TOP);
        //绘制人外形
        offsetx = 64;
        offsety = 87;
        curx = startx + offsetx;
        cury = starty + offsety;
        g.drawImage(personOutline, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制连接线
        //上边和下边
        offsetx = 65;
        offsety = 81;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = linkLineHori.getWidth();
        h = linkLineHori.getHeight();
        g.drawImage(linkLineHori, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, linkLineHori, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury + 101, Graphics.LEFT | Graphics.TOP);

        //左边和右边
        offsetx = 41;
        offsety = 106;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = linkLineVert.getWidth();
        h = linkLineVert.getHeight();
        Util.drawRegion(g, linkLineVert, 0, 0, w, h, Sprite.TRANS_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
        g.drawImage(linkLineVert, curx + 80, cury, Graphics.LEFT | Graphics.TOP);

        //绘制物品框
        offsetx = 24;
        offsety = 68;
        curx = startx + offsetx;
        cury = starty + offsety;
        int intervaly = weaponFrame.getHeight() + 47;
        int intervalx = weaponFrame.getWidth() + 38;

        int clipx = g.getClipX();
        int clipy = g.getClipY();
        int clipw = g.getClipWidth();
        int cliph = g.getClipHeight();
        int newCurx = curx;
        int newCury = cury;

        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                if (i * 2 + j == 2) {
                    newCurx = curx + 3;
                    newCury = cury;
                } else {
                    newCurx = curx;
                    newCury = cury;
                }
                if (i * 2 + j == 0) {
                    GameContext.actor.equipmentItem[0] = enchantWeapon[0];
                    g.drawImage(weaponFrame, newCurx, newCury, Graphics.LEFT | Graphics.TOP);
                } else {
                    g.drawImage(goodsFrame, newCurx, newCury, Graphics.LEFT | Graphics.TOP);
                }
                if (GameContext.actor.equipmentItem[i * 2 + j] != null) {
                    if (i * 2 + j == 0) {
                        GameContext.actor.equipmentItem[0].paintIcon(g, newCurx + 3, newCury + 3);
                    } else {
                        GameContext.actor.equipmentItem[i * 2 + j].paintIcon(g, newCurx + 3, newCury + 3);
                    }
                    g.setClip(clipx, clipy, clipw, cliph);
                }

                if (attriIndex == i * 2 + j) {
                    int unitX = newCurx + (goodsFrame.getWidth() >> 1);
                    int unitY = newCury + goodsFrame.getHeight() - 2;
                    if (attriIndex == 0) {
                        unitY = newCury + weaponFrame.getHeight();
                    }
                    selectFrameAnimal.paint(g, -unitX, -unitY);
                    selectFrameAnimal.update();

                    if (showPopMenu) {
                        int itemCenterX = newCurx + (goodsFrame.getWidth() >> 1);
                        int itemCenterY = newCury + (goodsFrame.getHeight() >> 1);
                        drawPopMenu(g, itemCenterX, itemCenterY, true);
                    }
                }
                curx += intervalx;
            }
            curx = startx + offsetx;
            cury += intervaly;
        }

        //绘制属性板
        offsetx = 153;
        offsety = 66;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = attriBoard.getWidth();
        h = attriBoard.getHeight();
        g.drawImage(attriBoard, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, attriBoard, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + w, cury, Graphics.LEFT | Graphics.TOP);
        curx = startx + offsetx;
        Util.drawRegion(g, attriBoard, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury + h, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, attriBoard, 0, 0, w, h, Sprite.TRANS_ROT180, curx + w, cury + h, Graphics.LEFT | Graphics.TOP);
        //绘制人物属性值
        intervaly = 19;
        int firstOffsetx = 13;
        int secondOffsetx = 63;
        int thirdOffsetx = 132;
        offsety = 13;
        int firstColor = 0xfdfaf8;
        int secondColor = 0xab9400;
        int thirdColor = 0x08ab00;
        g.setColor(firstColor);
        font.drawString(g, "气血：", curx + firstOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(secondColor);
        font.drawString(g, Integer.toString(GameContext.actor.hp), curx + secondOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(thirdColor);
        font.drawString(g, "+" + Integer.toString(GameContext.actor.stoneHp), curx + thirdOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        cury += intervaly;

        g.setColor(firstColor);
        font.drawString(g, "内力：", curx + firstOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(secondColor);
        font.drawString(g, Integer.toString(GameContext.actor.mp), curx + secondOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(thirdColor);
        font.drawString(g, "+" + Integer.toString(GameContext.actor.stoneMp), curx + thirdOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        cury += intervaly;

        g.setColor(firstColor);
        font.drawString(g, "攻击：", curx + firstOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(secondColor);
        font.drawString(g, Integer.toString(GameContext.actor.ap), curx + secondOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(thirdColor);
        font.drawString(g, "+" + Integer.toString(GameContext.actor.stoneAp), curx + thirdOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        cury += intervaly;

        g.setColor(firstColor);
        font.drawString(g, "防御：", curx + firstOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(secondColor);
         font.drawString(g, Integer.toString(GameContext.actor.dp), curx + secondOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(thirdColor);
        font.drawString(g, "+" + Integer.toString(GameContext.actor.stoneDp), curx + thirdOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        cury += intervaly;

        g.setColor(firstColor);
        font.drawString(g, "暴击：", curx + firstOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(secondColor);
        font.drawString(g, Integer.toString(GameContext.actor.bigAttackProb) + "%", curx + secondOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(thirdColor);
        font.drawString(g, "+" + Integer.toString(GameContext.actor.stoneBigAttackProb) + "%", curx + thirdOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        cury += intervaly;

        g.setColor(firstColor);
        font.drawString(g, "闪避：", curx + firstOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(secondColor);
        font.drawString(g, Integer.toString(GameContext.actor.avoidProb) + "%", curx + secondOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);
        g.setColor(thirdColor);
        font.drawString(g, "+" + Integer.toString(GameContext.actor.stoneAvoidProb) + "%", curx + thirdOffsetx, cury + offsety, Graphics.LEFT | Graphics.TOP);

        offsetx = 166;
        offsety = 204;
        curx = startx + offsetx;
        cury = starty + offsety;
        g.setColor(firstColor);
        font.drawString(g, "经验：", curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制右下部分
        //绘制经验框
        //绘制滚动条

        offsetx = 209;
        offsety = 206;
        curx = startx + offsetx;
        cury = starty + offsety;
        int totalw = 116;
        w = scrollBarHead.getWidth();
        h = scrollBarHead.getHeight();
        Util.drawRegion(g, scrollBarHead, 0, 0, w, h, Sprite.TRANS_ROT270, curx, cury, Graphics.LEFT | Graphics.TOP);
        curx += scrollBarHead.getHeight();

        g.setClip(curx, cury, totalw, w);
        h = scrollBarMid.getHeight();
        int num = totalw / h - 1;
        for (int i = 0; i < num; i++) {
            Util.drawRegion(g, scrollBarMid, 0, 0, w, h, Sprite.TRANS_ROT270, curx, cury, Graphics.LEFT | Graphics.TOP);
            curx += h;
        }
        g.setClip(clipx, clipy, clipw, cliph);
        w = scrollBarHead.getWidth();
        h = scrollBarHead.getHeight();
        curx = startx + offsetx + totalw - scrollBarHead.getWidth();
        Util.drawRegion(g, scrollBarHead, 0, 0, w, h, Sprite.TRANS_ROT90, curx, cury, Graphics.LEFT | Graphics.TOP);

        clipx = g.getClipX();
        clipy = g.getClipY();
        clipw = g.getClipWidth();
        cliph = g.getClipHeight();
        w = expFill.getWidth();
        h = expFill.getHeight();
        offsetx = 209;
        offsety = 206;
        curx = startx + offsetx;
        cury = starty + offsety;
        curx += 7;
        cury += 3;
        int curClipw = (int)((GameContext.actor.curEx * w) / GameContext.actor.maxEx);
        g.setClip(curx, cury, curClipw, h);
        g.drawImage(expFill, curx, cury, Graphics.LEFT | Graphics.TOP);
        g.setClip(clipx, clipy, clipw, cliph);

        //绘制晶石加成背景
        offsetx = 265;
        offsety = 53;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = sparBack.getWidth();
        h = sparBack.getHeight();
        g.drawImage(sparBack, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, sparBack, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + w, cury, Graphics.LEFT | Graphics.TOP);
        //绘制晶石加成图标
        g.drawImage(sparIcon, curx + 3, cury + 3, Graphics.LEFT | Graphics.TOP);
        //绘制晶石加成字体
        g.drawImage(sparFont, curx + 25, cury + 7, Graphics.LEFT | Graphics.TOP);


        //绘制金钱区域
        offsetx = 87;
        offsety = 208;
        curx = startx + offsetx;
        cury = starty + offsety;
        drawMenuMoney(g, GameContext.actor.getMoney(), curx, cury);

        if (showDec) {
            offsetx = 165;
            offsety = 34;
            curx = startx + offsetx;
            cury = starty + offsety;
            drawDec(g, curx, cury, FRAME_W, FRAME_H, itemDec);
        }

    }

    //是否是武器的强化
    boolean isWeaponEnchant;
    //主角拥有的武器
    MyItem[] enchantWeapon;
    //强化选项
    int enchantIndex = 0;

    //初始化强化界面
    private void initEnchantInterface() {
        isWeaponEnchant = true;
        selectFrameAnimal.actId = 1;
        selectFrameAnimal.initFrame();
        enchantIndex = 0;
        enchantWeapon = new MyItem[GameContext.actor.EQUIP_WEAPON_COUNT];
        for (int index = 0; index < enchantWeapon.length; index++) {
            enchantWeapon[index] = GameContext.actor.getItemFromActorBag((short)(MyItem.WEAPON_START_ID + index));
        }
        curItem = enchantWeapon[enchantIndex];
        prepareEnchantConditionDec(curItem);
    }

    //强化效果
    private void doEnchantOk() {
        boolean isEquip = false;
        if (curItem.isActorEquip) {
            isEquip = true;
            curItem.uninstall();
        }
        curItem.lv++;
        if (isEquip) {
            curItem.install();
        }
        GameContext.actor.loseMoney(itemPrice);
        prepareEnchantConditionDec(curItem);
        if (isWeaponEnchant) {
            if (isEnchantToMax) {
                GameContext.addVar(EffortManager.EFFORT_WEAPON_ENCHANT_GOLD, 1);
            } else if (curItem.lv == 14) {
                GameContext.addVar(EffortManager.EFFORT_WEAPON_ENCHANT_SILVER, 1);
            }
            addSkillLv();
        }
        else {
            if (isEnchantToMax) {
                GameContext.addVar(EffortManager.EFFORT_ARMOR_ENCHANT, 1);
                if (curItem.getId() == MyItem.SUPER_ARMOR_ID) {
                    GameContext.addVar(EffortManager.EFFORT_SUPER_ARMOR_ENCHANT, 1);
                }
            }
        }
    }

    private void addSkillLv() {
        if ((curItem.getId() > 0) && (curItem.getId() > 0)) {
            if ((curItem.lv == 7) || (curItem.lv == 14)) {
                GameContext.actor.updataCurSkill(curItem.getId() - 1);
            }
        }
    }

    //金钱不足
    boolean isNotEnoughMoneyEnchant = false;
    //等级不足
    boolean isNotEnoughLevelEnchant = false;
    //强化到满级
    boolean isEnchantToMax = false;

    //初始化强化物品的强化条件
    private void prepareEnchantConditionDec(MyItem item) {
        if (item == null) {
            showDec = false;
            return;
        }
        if (!item.canUpgrade()) {
            isEnchantToMax = true;
            itemDec = "已达到最高等级".toCharArray();
            initShowDec();
            return;
        }
        isEnchantToMax = false;
        itemPrice = item.getAttrValue(MyItem.强化价格);
        isNotEnoughMoneyEnchant = GameContext.actor.getMoney() < itemPrice;
        StringBuffer buf = new StringBuffer();
        buf.append("强化费用：|").append(isNotEnoughMoneyEnchant ? "{0xff0000" : "").append(itemPrice).append("金||").append(isNotEnoughMoneyEnchant ? "}" : "");
        isNotEnoughLevelEnchant = false;
        int needLv = item.getAttrValue(MyItem.强化等级);
        if (needLv > 0) {
            isNotEnoughLevelEnchant = GameContext.actor.getLevel() < needLv;
            buf.append("等级需求：|").append(isNotEnoughLevelEnchant ? "{0xff0000" : "").append(needLv).append("级").append(isNotEnoughLevelEnchant ? "}" : "");
        }
        itemDec = buf.toString().toCharArray();
        initShowDec();
    }
    
//    int weaponNum = 0;
//    HashtableShort weaponMap;
    //是否开始播放强化动画
    boolean isPlayerEnchantAnimal = false;
    //强化动画的计数器
    int enchantPlayCount = 0;
//    //是否显示第一个动画的最后一帧
//    boolean isPaintLastFrameFirstAnimal = false;
//    boolean isFirstAnimalOver = false;
//    boolean isSecondAnimalOver = false;
    
    //绘制强化界面
    void drawEnchantInterface(Graphics g) {
        int startx = (Page.SCREEN_WIDTH - 370) >> 1;
        int starty = (Page.SCREEN_HEIGHT - 240) >> 1;
        if (enchantPlayCount == 1) {
            starty += 1;
        } else if (enchantPlayCount == 2) {
            starty -= 2;
        } else if (enchantPlayCount == 3) {
            starty += 1;
        }
        drawCommonImage(g, startx, starty, 0);
        int titleIndex = 4;
        drawInterfaceTitle(g, startx, starty, titleIndex);
        
        int offsetx;
        int offsety;
        int curx;
        int cury;
        int totalw = 0;
        int totalh = 0;
        //绘制框
        //绘制矩形
        offsetx = 15;
        offsety = 30;
        curx = startx + offsetx;
        cury = starty + offsety;
        int w = 332;
        int h = 69;
        g.setColor(0x474441);
        g.drawRect(curx, cury, w, h);
        //绘制四个角
        //绘制左上角
        totalw = 339;
        totalh = 76;
        offsetx = 12;
        offsety = 27;
        w = triangleInside.getWidth();
        h = triangleInside.getHeight();
        curx = startx + offsetx;
        cury = starty + offsety;
        g.drawImage(triangleInside, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制右上角
        offsetx = offsetx + totalw - w;
        curx = startx + offsetx;
        cury = starty + offsety;
        Util.drawRegion(g, triangleInside, 0, 0, w, h, Sprite.TRANS_ROT90, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制左下角
        offsetx = 12;
        offsety = offsety + totalh - triangleInside.getHeight();
        curx = startx + offsetx;
        cury = starty + offsety;
        Util.drawRegion(g, triangleInside, 0, 0, w, h, Sprite.TRANS_ROT270, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制右下角
        offsetx = offsetx + totalw - w;
        curx = startx + offsetx;
        cury = starty + offsety;
        Util.drawRegion(g, triangleInside, 0, 0, w, h, Sprite.TRANS_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制5个物品框
        offsetx = 39;
        offsety = 40;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = weaponFrame.getWidth();
        int intervalx = w + 20;
        
        //强化界面
        if (isWeaponEnchant) {
            for (int i = 0; i < enchantWeapon.length; i++) {
                g.drawImage(weaponFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
                if (enchantWeapon[i] != null) {
                    enchantWeapon[i].paintIcon(g, curx + 3, cury + 3);
                }
                if (enchantIndex == i) {
                    int unitX = curx + (w >> 1);
                    int unitY = cury + weaponFrame.getHeight();
                    selectFrameAnimal.paint(g, -unitX, -unitY);
                    selectFrameAnimal.update();
                }                
                curx += intervalx;
            }
        }
        else {
            offsetx = 162;
            offsety = 44;
            curx = startx + offsetx;
            cury = starty + offsety;
            g.drawImage(goodsFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
            curItem.paintIcon(g, curx + 3, cury + 3);
            int unitX = curx + (goodsFrame.getWidth() >> 1);
            int unitY = cury + goodsFrame.getHeight() - 2;
            selectFrameAnimal.paint(g, -unitX, -unitY);
            selectFrameAnimal.update();
        }      
               
        //绘制武器说明区域        
        offsetx = 21;
        offsety = 110;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = 323;
        h = 96;
        g.setColor(0x1b1b20);
        g.fillRect(curx, cury, w, h);
        //绘制武器说明
        curx += 8;
        cury += 5;
        
        //武器强化
         if (curItem != null) {
            int itemLv = curItem.lv + 1;
            g.setColor(curItem.getNameColor());
            StringBuffer name = new StringBuffer();
            name.append(curItem.getName()).append(itemLv).append("级-");
            if (isEnchantToMax) {
                name.append("MAX");
            }
            else {
                name.append(itemLv + 1).append("级");
            }
            font.drawChars(g, name.toString().toCharArray(), curx, cury, Graphics.LEFT | Graphics.TOP);

            w = 240;
            h = 24;
            cury += h;
            int effortCnt = curItem.getAttrCount();
            for (int index = 0; index < effortCnt; index++) {
                int effectType = curItem.item.attrTypes[index];
                int effectCurValue = curItem.getAttrValue(effectType);
                int effectNextValue = 0;
                if (!isEnchantToMax) {
                    effectNextValue = curItem.getAttrValue(effectType, itemLv);
                }
                if (effectCurValue <= 0 && effectNextValue <= 0) {
                    continue;
                }
                String effort = curItem.getEffectsDescription(effectType, effectCurValue);
                if (effort == null || effort.length() == 0) {
                    continue;
                }
                g.setColor(0xab9400);
                if ((curItem.getId() > 0) && (curItem.getId() < 5)) {
                    font.drawString(g, effort + "%", curx, cury, 0);
                    if (!isEnchantToMax) {
                        g.setColor(0xfb4b9e);
                        font.drawString(g, "  +" + (effectNextValue - effectCurValue) + "%", curx + font.charsWidth(effort), cury, 0);
                    }
                } else {
                    font.drawString(g, effort, curx, cury, 0);
                    if (!isEnchantToMax) {
                        g.setColor(0xfb4b9e);
                        font.drawString(g, "+" + (effectNextValue - effectCurValue), curx + font.charsWidth(effort), cury, 0);
                    }
                    String stoneData = "+" + getActorStoneAddDate(effectType);
                    if (effectType == MyItem.增加暴击上限 || effectType == MyItem.增加闪避上限) {
                        stoneData += "%";
                    }
                    g.setColor(0x0b973f);
                    font.drawString(g, stoneData, curx + w, cury, 0);
                }
                cury += h;
            }
             w = 300;
             if (curItem.getId() != MyItem.WEAPON_START_ID) {
                 g.setColor(0xffffff);
                 font.drawCharsAlignLeft(g, curItem.item.desc, curx, cury, w);
             } else {
                 //绘制晶石加成背景
                 offsetx = 250;
                 offsety = 102;
                 int jinshix = startx + offsetx;
                 int jinshiy = starty + offsety;
                 w = sparBack.getWidth();
                 h = sparBack.getHeight();
                 g.drawImage(sparBack, jinshix, jinshiy, Graphics.LEFT | Graphics.TOP);
                 Util.drawRegion(g, sparBack, 0, 0, w, h, Sprite.TRANS_MIRROR, jinshix + w, jinshiy, Graphics.LEFT | Graphics.TOP);
                 //绘制晶石加成图标
                 g.drawImage(sparIcon, jinshix + 3, jinshiy + 3, Graphics.LEFT | Graphics.TOP);
                 //绘制晶石加成字体
                 g.drawImage(sparFont, jinshix + 25, jinshiy + 7, Graphics.LEFT | Graphics.TOP);
             }
        }
        //绘制金钱图标
        offsetx = 152;
        offsety = 213;
        curx = startx + offsetx;
        cury = starty + offsety;
        drawMenuMoney(g, GameContext.actor.getMoney(), curx, cury);

        if (curItem != null) {
            //绘制强化框
            offsetx = -8;
            offsety = 216;
            curx = startx + offsetx;
            cury = starty + offsety;
            g.drawImage(retFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
            offsetx = 4;
            offsety = 222;
            curx = startx + offsetx;
            cury = starty + offsety;
            w = titleFont.getWidth();
            h = titleFont.getHeight() / 9;
            Util.drawRegion(g, titleFont, 0, titleIndex * h, w, h, Sprite.TRANS_NONE, curx, cury, Graphics.LEFT | Graphics.TOP);
        }

        if (showDec) {
            curx = startx + 300;
            cury = starty + 70;
            w = 132;
            h = 143;
            drawDec(g, curx, cury, w, h, itemDec);
        }
        
        //显示强化动画
        if (isPlayerEnchantAnimal) {
            drawEnchantPlay(g, startx, starty);
        }    
    }

    private void drawEnchantPlay(Graphics g, int startx, int starty) {
        final int ITEM_DIS = weaponFrame.getWidth() + 20;
        Image imgFrame = isWeaponEnchant ? weaponFrame : goodsFrame;
        final int ITEM_W = imgFrame.getWidth() - 6;
        final int ITEM_H = imgFrame.getHeight() - 5;
        int ITEM_X = startx + ITEM_DIS * enchantIndex + 42;
        int ITEM_Y = starty + 42;
        if (!isWeaponEnchant) {
            ITEM_X++;
            ITEM_Y += 4;
        }
        g.setColor(0xEDE960);
        int RECT_X = startx + 2;
        int RECT_Y = starty + 222;
        int RECT_W = 55;
        int RECT_H = 20;
        if (enchantPlayCount == 0) {
            g.fillRect(RECT_X, RECT_Y, RECT_W, RECT_H);
        }
        else if (enchantPlayCount == 1) {
            int LINE_W = 2;
            g.fillRect(RECT_X, RECT_Y, RECT_W, LINE_W);
            g.fillRect(RECT_X, RECT_Y, LINE_W, RECT_H);
            g.fillRect(RECT_X, RECT_Y + RECT_H - LINE_W, RECT_W, LINE_W);
            g.fillRect(RECT_X + RECT_W - LINE_W, RECT_Y, LINE_W, RECT_H);
        }
        else if (enchantPlayCount == 8) {
            int LINE_W = 6;
            g.fillRect(ITEM_X - LINE_W, ITEM_Y - LINE_W, ITEM_W + (LINE_W << 1), ITEM_H + (LINE_W << 1));
        }
        if (enchantPlayCount == 1 || enchantPlayCount == 8) {
            g.setColor(0xfff5a4);
            g.fillRect(ITEM_X, ITEM_Y, ITEM_W, ITEM_H);
            g.setColor(0xff5206);
            g.drawRect(ITEM_X, ITEM_Y, ITEM_W - 1, ITEM_H - 1);
            g.setColor(0xffffff);
            g.fillRect(ITEM_X + 3, ITEM_Y + 2, ITEM_W - 6, ITEM_H - 4);
        }
        if (enchantPlayCount < 9) {
            final int FONT_UNIT_X = startx + 118;
            final int FONT_UNIT_Y = starty + 128;
            enchantSecond.paint(g, -FONT_UNIT_X, -FONT_UNIT_Y);
            enchantSecond.update();
        }
        if (enchantPlayCount > 1 && enchantPlayCount < 8) {
            final int ITEM_UNIT_X = ITEM_X + (ITEM_W >> 1) - 1;
            final int ITEM_UNIT_Y = ITEM_Y + (ITEM_H >> 1) + 1;
            enchantFirst.paint(g, -ITEM_UNIT_X, -ITEM_UNIT_Y);
            enchantFirst.update();
        }
        enchantPlayCount++;
        if (enchantPlayCount > 10) {
            isPlayerEnchantAnimal = false;
        }
    }

    //获取主角晶石加成的数值
    private int getActorStoneAddDate(int type) {
        switch(type)
        {
            case MyItem.增加攻击上限:
            case MyItem.增加武器攻击上限:
                return GameContext.actor.stoneAp;
            case MyItem.增加防御上限:
                return GameContext.actor.stoneDp;
            case MyItem.增加暴击上限:
                return GameContext.actor.stoneBigAttackProb;
            case MyItem.增加闪避上限:
                return GameContext.actor.stoneAvoidProb;
            case MyItem.增加生命上限:
                return GameContext.actor.stoneHp;
            case MyItem.增加灵气上限:
                return GameContext.actor.stoneMp;
        }
        return -1;
    }

    //成就类型
    int achieveType = 0;
    //成就选中项
    int achieveSelectIndex = 0;
    //显示相关
    int achieveStartIndex = 0;
    final int ACHIEVE_SHOW_CNT = 3;
    final int ACHIEVE_STATISTICS_SHOW_CNT = 5;
    //当前成就数据
    int[] achieveData;
    //成就描述
    char[] achieveDec;
    //成就统计数据
    String[] achieveStatisticsStr;
    
    //绘制成就界面
    void drawAchieveInterface(Graphics g) {
        int startx = (SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        drawCommonImage(g, startx, starty, 0);
        final int achieveTitleIndex = 0;
        drawInterfaceTitle(g, startx, starty, achieveTitleIndex);
//        int offsetx = 302;
//        int offsety = 216;
//        int curx = startx + offsetx;
//        int cury = starty + offsety;
//        Util.drawClipImage(g, retAndFireFont, curx + 12, cury + 7, 0, 0, retAndFireFont.getWidth(), retAndFireFont.getHeight() >> 1);

        //绘制成就名称框
        int offsetx = 45;
        int offsety = 31;
        int curx = startx + offsetx;
        int cury = starty + offsety;
        int w = 67;
        int h = achieveFrame.getHeight();
        int intervalx = w;
        w = achieveFrame.getWidth();
        final int TYPE_IMG_W = achieveTypeName.getWidth();
        final int TYPE_IMG_H = achieveTypeName.getHeight() / EffortManager.EFFECT_TYPE_CNT;
        for (int i = 0; i < EffortManager.EFFECT_TYPE_CNT; i++) {
            g.drawImage(achieveFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, achieveFrame, 0, 0, w, h, Sprite.TRANS_MIRROR, 
                    curx + intervalx - w, cury, Graphics.LEFT | Graphics.TOP);
            if (achieveType == i) {
                Util.drawRegion(g, achieveSelectFrame, 0, 0, achieveSelectFrame.getWidth(), achieveSelectFrame.getHeight(), 
                        Sprite.TRANS_MIRROR, curx + 7, cury + 4, Graphics.LEFT | Graphics.TOP);
                g.drawImage(achieveSelectFrame, curx + intervalx - 7 - achieveSelectFrame.getWidth(), 
                        cury + 4, Graphics.LEFT | Graphics.TOP);
            }
            Util.drawClipImage(g, achieveTypeName, curx + (intervalx >> 1) - (TYPE_IMG_W >> 1), cury + 10, 0, TYPE_IMG_H * i, TYPE_IMG_W, TYPE_IMG_H);
            curx += intervalx;
        }

        if (achieveType == EffortManager.EFFECT_TYPE_STATISTICS) {
            drawAchieveStatistics(g, startx, starty);
            return;
        }
        
        //绘制背景框
        offsetx = 32;
        offsety = 82;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = 156;
        h = 43;
        int intervaly = h + 2;
        final int NAME_OFFX = 10;
        final int NAME_OFFY = (h - FishFont.FONT_HEIGHT) >> 1;
        for (int i = 0; i < ACHIEVE_SHOW_CNT; i++) {
            g.setColor(0x414141);
            g.drawRect(curx, cury, w, h);
            g.setColor(0xffa846);
            int effortIndex = achieveData[achieveStartIndex + i];
            font.drawString(g, EffortManager.getInstance().allEffortName[effortIndex], curx + NAME_OFFX, cury + NAME_OFFY, 0);
            cury += intervaly;
        }       
        //绘制左上，左下，右上，右下四个角
        //左上
        offsetx = 30;
        offsety = 80;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = triangleInside2.getWidth();
        h = triangleInside2.getHeight();
        Util.drawRegion(g, triangleInside2, 0, 0, w, h, Sprite.TRANS_ROT270, curx, cury, Graphics.LEFT | Graphics.TOP);
        //左下
        offsetx = 30;
        offsety = 204;
        curx = startx + offsetx;
        cury = starty + offsety;        
        Util.drawRegion(g, triangleInside2, 0, 0, w, h, 
                Sprite.TRANS_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
        //右上
        offsetx = 177;
        offsety = 80;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = triangleInside2.getWidth();
        h = triangleInside2.getHeight();        
        g.drawImage(triangleInside2, curx, cury, Graphics.LEFT | Graphics.TOP);
        //右下
        offsetx = 177;
        offsety = 204;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = triangleInside2.getWidth();
        h = triangleInside2.getHeight();
        Util.drawRegion(g, triangleInside2, 0, 0, w, h, 
                Sprite.TRANS_ROT90, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制是否完成框
        offsetx = 210;
        offsety = 87;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = titleFrame.getWidth();
        h = titleFrame.getHeight();
        intervaly = h + 16;
        final int txtW = imgMissionFinishTxt.getWidth();
        final int txtH = imgMissionFinishTxt.getHeight() >> 1;
        for (int i = 0; i < ACHIEVE_SHOW_CNT; i++) {
            Util.drawRegion(g, titleFrame, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);
            g.drawImage(titleFrame, curx + w, cury, Graphics.LEFT | Graphics.TOP);
            int effortIndex = achieveData[achieveStartIndex + i];
            int state = EffortManager.getInstance().allEffortFinish[effortIndex] ? 1 : 0;
            Util.drawClipImage(g, imgMissionFinishTxt, curx + w - (txtW >> 1), cury + 6, 0, txtH * state, txtW, txtH);
            cury += intervaly;
        }

        final int ScrollBarRightOffsetX = 27;
        final int ScrollBarOffsetY = 79;
        final int ScrollBarH = 138;
        FishFont.drawScrollBar(g, startx + WIDTH_FRAME - ScrollBarRightOffsetX, starty + ScrollBarOffsetY, ScrollBarH, achieveStartIndex, achieveData.length - ACHIEVE_SHOW_CNT);

        if (showDec && achieveDec != null) {
            offsetx = 190;
            offsety = 50;
            curx = startx + offsetx;
            cury = starty + offsety;
            w = 222;
            h = 200;
            drawDec(g, curx, cury, w, h, achieveDec);
        }
    }
    //绘制成就统计
    void drawAchieveStatistics(Graphics g, int startx, int starty) {
        final int FRAME_X = startx + 40;
        final int FRAME_Y = starty + 82;
        final int FRAME_W = 278;
        final int FRAME_H = 134;
        drawFrameSmallLace(g, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);

        final int ITEM_H = 21;
        final int ITEM_DIS = 5;
        final int itemX = FRAME_X + ITEM_DIS;
        int itemY = FRAME_Y + ITEM_DIS;
        final int TXT_OFFX = 2;
        final int TXT_OFFY = (ITEM_H - FishFont.FONT_HEIGHT) >> 1;
        for (int index = 0; index < ACHIEVE_STATISTICS_SHOW_CNT; index++) {
            int effectIndex = achieveStartIndex + index;
            g.setColor(0x1b1b1b);
            g.fillRect(itemX, itemY, FRAME_W - (ITEM_DIS << 1), ITEM_H);
            g.setColor(0xffa847);
            String effortName = EffortManager.EFFORT_STATISTICS_NAME[effectIndex];
            if (effortName.indexOf("速杀") != -1 && achieveStatisticsStr[effectIndex].equals("无")) {
                effortName = "???速杀";
            }
            font.drawString(g, effortName, itemX + TXT_OFFX, itemY + TXT_OFFY, 0);
            font.drawString(g, achieveStatisticsStr[effectIndex], FRAME_X + FRAME_W - ITEM_DIS - TXT_OFFX, itemY + TXT_OFFY, Graphics.RIGHT | Graphics.TOP);
            itemY += ITEM_H + ITEM_DIS;
        }

        final int ScrollBarRightOffsetX = 27;
        FishFont.drawScrollBar(g, startx + WIDTH_FRAME - ScrollBarRightOffsetX, FRAME_Y, FRAME_H, achieveStartIndex, EffortManager.EFFORT_STATISTICS_NAME.length - ACHIEVE_STATISTICS_SHOW_CNT);
    }

    /**
     * 绘制带小花边(triangleInside2)的背景框
     */
    void drawFrameSmallLace(Graphics g, int x, int y, int width, int height) {
        final int FRAME_X = x;
        final int FRAME_Y = y;
        final int FRAME_W = width;
        final int FRAME_H = height;
        g.setColor(0x414141);
        g.drawRect(FRAME_X, FRAME_Y, FRAME_W - 1, FRAME_H - 1);
        final int LACE_DIS = 2;
        final int LACE_W = triangleInside2.getWidth();
        final int LACE_H = triangleInside2.getHeight();
        g.drawImage(triangleInside2, FRAME_X + FRAME_W + LACE_DIS, FRAME_Y - LACE_DIS, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, triangleInside2, 0, 0, LACE_W, LACE_H, Sprite.TRANS_MIRROR, FRAME_X - LACE_DIS, FRAME_Y - LACE_DIS, 0);
        Util.drawRegion(g, triangleInside2, 0, 0, LACE_W, LACE_H, Sprite.TRANS_ROT90, FRAME_X + FRAME_W + LACE_DIS, FRAME_Y + FRAME_H + LACE_DIS, Graphics.RIGHT | Graphics.BOTTOM);
        Util.drawRegion(g, triangleInside2, 0, 0, LACE_W, LACE_H, Sprite.TRANS_ROT180, FRAME_X - LACE_DIS, FRAME_Y + FRAME_H + LACE_DIS, Graphics.LEFT | Graphics.BOTTOM);
    }

    //准备成就描述
    void prepareAchieveDec() {
        int effortIndex = achieveData[achieveSelectIndex];
        achieveDec = EffortManager.getInstance().getEffortDec(effortIndex);
        if (achieveDec == null) {
            return;
        }
        initShowDec();
    }

    //炼化状态
    final int ARTIFICE_STATE_NONE = 0;
    final int ARTIFICE_STATE_FIRE_APPEAR = 1;
    final int ARTIFICE_STATE_WAIT_KEY = 2;
    final int ARTIFICE_STATE_CREATE_PLAY = 3;
    final int ARTIFICE_STATE_SHOW_ITEM = 4;
    final int ARTIFICE_STATE_MOVE_ITEM = 5;
    final int ARTIFICE_STATE_GET_ITEM = 6;
    final int ARTIFICE_STATE_UPDATA_FIRE = 7;
    int artificeState = ARTIFICE_STATE_NONE;
    //计时器
    int artificeCount;

    //炼化火的等级
    int artificeFireMaxLv;
    int artificeFireLv;

    //晶石id
    final int[] STONE_ID = {62, 61, 63, 64, 60, 65};
    //主角拥有的晶石
    MyItem[] curStoneItem;

    //炼化能够获得的物品id
    final int[] ARTIFICE_ITEM_ID = {62, 61, 63, 64, 60, 65, 70};
    //炼化费用
    private int[] ARTIFICE_MONEY = {1800, 2600, 3500, 4500, 5600};
    private String[] FIRE_NAME = {"微火", "小火", "中火", "大火", "猛火"};
    //炼化的概率
    private int[][] ARIFICE_SUCCESS_PRO =
    {
        {5, 10, 15, 20, 20, 20, 100},
        {10, 20, 25, 30, 35, 40, 100},
        {10, 20, 30, 40, 50, 60, 100},
        {10, 20, 30, 40, 50, 60, 80, 85, 90, 95, 100},
        {0, 0, 0, 0, 0, 0, 0, 20, 40, 55, 70, 85, 100}
    };

    //炼化生成的物品
    int artificeGetItemIndex;
    MyItem artificeGetItem;
    int artificeGetItemX;
    int artificeGetItemY;
    int artificeGetItemLv;
    boolean artificeGetGarbage;
    //教学过程中生成物品固定
    boolean isArtificeTeach;
    int artificeTeachIndex = 0;
    final int[] ARTIFICE_TEACH_ITEM_INDEX = {6, 4, 4};
    
    //绘制炼化界面
    void drawArtificeInterface(Graphics g) {
        int startx = (Page.SCREEN_WIDTH - 370) >> 1;
        int starty = (Page.SCREEN_HEIGHT - 240) >> 1;
        drawCommonImage(g, startx, starty, 0);
        int titleIndex = 7;
        drawInterfaceTitle(g, startx, starty, titleIndex);
        
        //绘制炉子
        int offsetx = 88;
        int offsety = 135;
        int curx = startx + offsetx;
        int cury = starty + offsety;
        stove.paint(g, -curx, -cury);
        if (artificeState < ARTIFICE_STATE_SHOW_ITEM) {
            if (stove.isEndAnimation()) {
                if (stove.actId == 1) {
                    stove.actId = (short) (artificeGetGarbage ? 2 : 3);
                    stove.resetFrame();
                }
                else if(stove.actId == 0) {
                    stove.resetFrame();
                }
                else {
                    artificeState = ARTIFICE_STATE_SHOW_ITEM;
                }
            }
            else {
                stove.playNextFrame();
            }
        }

        //绘制箱子
        offsetx = 150;
        offsety = 40;
        curx = startx + offsetx;
        cury = starty + offsety;
        int w = box.getWidth();
        int h = box.getHeight();
        g.drawImage(box, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, box, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + w, cury, Graphics.LEFT | Graphics.TOP);
        final int[] STONE_OFF_X = {52, 88, 14, 125, 14, 125};
        final int[] STONE_OFF_Y = {37, 37, 21, 21, 56, 56};
        for (int index = 0; index < STONE_ID.length; index++) {
            if (curStoneItem[index] != null) {
                curStoneItem[index].paintIcon(g, curx + STONE_OFF_X[index], cury + STONE_OFF_Y[index]);
                int lvCnt = Util.getNumberSize(curStoneItem[index].lv);
                final int[] LV_OFF_X = {29, 30};
                final int LV_NUM_W = imgLvNum.getWidth();
                final int LV_NUM_H = imgLvNum.getHeight() / 10;
                Util.drawNumbersAlignRight(g, curStoneItem[index].lv + 1, imgLvNum, LV_NUM_W, LV_NUM_H, 0, LV_OFF_X[lvCnt - 1] + curx + STONE_OFF_X[index], cury + STONE_OFF_Y[index] + 24);
                int spritW = spritAndLv.getWidth();
                int spritH = spritAndLv.getHeight() / 2;
                Util.drawRegion(g, spritAndLv, 0, spritH, spritW, spritH, Sprite.TRANS_NONE, curx + STONE_OFF_X[index] + 10, cury + STONE_OFF_Y[index] + 22, Graphics.LEFT | Graphics.TOP);
            }
        }

        //绘制金钱
        offsetx = 140;
        offsety = 216;
        curx = startx + offsetx;
        cury = starty + offsety;
        drawMenuMoneyAlignLeft(g, GameContext.actor.getMoney(), curx, cury);
        if (artificeState == ARTIFICE_STATE_NONE) {
            //绘制炼制框
            offsetx = 88;
            offsety = 96;
            curx = startx + offsetx;
            cury = starty + offsety;
            w = achieveFrame.getWidth() - 1;
            h = achieveFrame.getHeight();
            g.drawImage(achieveFrame, curx, cury, Graphics.RIGHT | Graphics.TOP);
            Util.drawRegion(g, achieveFrame, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);
            w = artificeFont.getWidth();
            h = artificeFont.getHeight() / 2;
            curx -= w >> 1;
            Util.drawRegion(g, artificeFont, 0, h, w, h, Sprite.TRANS_NONE, curx, cury + 10, Graphics.LEFT | Graphics.TOP);
            drawStoneDec(g);
            return;
        }
        if (artificeState == ARTIFICE_STATE_FIRE_APPEAR) {
            final int APPEAR_TIME_ONCE = 1;
            drawArtificeFire(g, startx, starty, artificeCount / APPEAR_TIME_ONCE);
            artificeCount++;
            if (artificeCount > FIRE_NAME.length * APPEAR_TIME_ONCE) {
                artificeState = ARTIFICE_STATE_WAIT_KEY;
                artificeCount = 0;
            }
            return;
        }
        drawArtificeFire(g, startx, starty, FIRE_NAME.length - 1);
        drawArtificeMoney(g);

        offsetx = 67;
        offsety = 83;
        curx = startx + offsetx;
        cury = starty + offsety;
        //绘制炉子中间的物品
        if (artificeState == ARTIFICE_STATE_SHOW_ITEM) {
            w = stoveFrameOutside.getWidth();
            h = stoveFrameOutside.getHeight();
            g.drawImage(stoveFrameOutside, curx, cury, Graphics.LEFT | Graphics.TOP);
            g.drawImage(stoveFrameInside, curx + 2, cury + 3, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, stoveFrameOutside, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + w, cury, Graphics.LEFT | Graphics.TOP);
            w = stoveFrameInside.getWidth();
            h = stoveFrameInside.getHeight();
            Util.drawRegion(g, stoveFrameInside, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + w + 2, cury + 3, Graphics.LEFT | Graphics.TOP);
            if (artificeGetItem != null) {
                artificeGetItemX = curx + 5;
                artificeGetItemY = cury + 6;
                artificeGetItem.paintIcon(g, artificeGetItemX, artificeGetItemY);
            }
            artificeCount++;
            final int SHOW_ITEM_TIME = 5;
            if (artificeCount > SHOW_ITEM_TIME) {
                artificeState = ARTIFICE_STATE_MOVE_ITEM;
                artificeCount = 1;
            }
        }
        //绘制得到物品的获得过程
        else if(artificeState == ARTIFICE_STATE_MOVE_ITEM) {
            final int MOVE_ITEM_TIME = 4;
            if (artificeGetItem != null) {
                offsetx += 5;
                offsety += 6;
                if (artificeGetGarbage) {
                    artificeGetItemX = startx + offsetx;
                    artificeGetItemY = startx + offsetx - (offsety * artificeCount / MOVE_ITEM_TIME);
                }
                else {
                    int targetOffX = 150 + STONE_OFF_X[artificeGetItemIndex];
                    int targetOffY = 40 + STONE_OFF_Y[artificeGetItemIndex];
                    offsetx += (targetOffX - offsetx) * artificeCount / MOVE_ITEM_TIME;
                    offsety += (targetOffY - offsety) * artificeCount / MOVE_ITEM_TIME;
                    artificeGetItemX = startx + offsetx;
                    artificeGetItemY = starty + offsety;
                }
                g.setColor(0xff0000);
                g.fillRect(artificeGetItemX, artificeGetItemY,20,20);
                artificeGetItem.paintIcon(g, artificeGetItemX, artificeGetItemY);
            }
            artificeCount++;
            if (artificeCount > MOVE_ITEM_TIME) {
                artificeState = ARTIFICE_STATE_GET_ITEM;
                artificeCount = 0;
                enchantFirst.actId = 2;
                enchantFirst.initFrame();
            }
        }
        else if (artificeState == ARTIFICE_STATE_GET_ITEM && !artificeGetGarbage) {
            curx = artificeGetItemX + 16;
            cury = artificeGetItemY + 16;
            enchantFirst.paint(g, -curx, -cury);
        }
        drawStoneDec(g);
    }

    //绘制炼制，控制火的按钮
    private void drawArtificeFire(Graphics g, int startx, int starty, int count) {
        if (count >= FIRE_NAME.length) {
            count = FIRE_NAME.length - 1;
        }

        final int FIRE_START_X = startx + 55;
        final int FIRE_START_Y = starty + 149;
        final int FIRE_INTERVAL = fireBackFrame.getWidth() + arrowFrame.getWidth() + 2;
        final int FIRE_ALL_W = FIRE_INTERVAL * count + fireBackFrame.getWidth();

        int frameX = FIRE_START_X - 3;
        int frameY = FIRE_START_Y;
        int frameW = 45;
        int frameH = 64;
        for (int index = 0; index <= count; index++) {
            g.setColor(0x251e0c);
            g.drawRect(frameX, frameY, frameW, frameH);
            g.setColor(0x4a4a4a);
            if (artificeFireMaxLv == index || index == 0) {
                g.setColor(0xffffff);
            }
            font.drawString(g, FIRE_NAME[index], frameX + 8, frameY + 44, 0);
            frameX += FIRE_INTERVAL;
        }
        frameX = FIRE_START_X - 18;
        frameY = FIRE_START_Y + 6;
        frameW = FIRE_ALL_W + 36;
        frameH = 26;
        g.setColor(0x121210);
        g.fillRect(frameX, frameY, frameW, frameH);
        g.setColor(0x251e0c);
        g.drawRect(frameX, frameY, frameW, frameH);

        int fireX = FIRE_START_X;
        int fireY = FIRE_START_Y;
        int arrowX = FIRE_START_X + fireBackFrame.getWidth() + 1;
        int arrowY = FIRE_START_Y + 14;
        for (int index = 0; index <= count; index++) {
            //画火
            g.drawImage(fireBackFrame, fireX, fireY, 0);
            if (artificeFireMaxLv == index || index == 0) {
                g.drawImage(fireIcon[index], fireX + 4, fireY + 4, 0);
            }
            int fireUnitIndex = -1;
            if (index == 0) {
                fireUnitIndex = 0;
            }
            else if (index == artificeFireMaxLv) {
                fireUnitIndex = 1;
            }
            if (fireUnitIndex != -1) {
                int uniX = fireX + 20;
                int uniY = fireY + 23;
                fireArtifice[fireUnitIndex].paint(g, -uniX, -uniY);
                if (fireArtifice[fireUnitIndex].isEndAnimation()) {
                    fireArtifice[fireUnitIndex].actId = 1;
                    fireArtifice[fireUnitIndex].initFrame();
                }
                else {
                    fireArtifice[fireUnitIndex].playNextFrame();
                }
            }
            //画箭头
            if (index < count) {
                g.drawImage(arrowFrame, arrowX, arrowY, 0);
            }
            if (artificeFireMaxLv != index && artificeFireMaxLv - index == 1) {
                g.drawImage(arrowRed, arrowX + 1, arrowY + 2, 0);
            }
            else if (artificeFireMaxLv > index) {
                g.drawImage(arrowPurple, arrowX + 1, arrowY + 2, 0);
            }
            fireX += FIRE_INTERVAL;
            arrowX += FIRE_INTERVAL;
        }

        int decorateOffX = 4;
        int decorateOffY = 12;
        g.drawImage(decorateArtifice, FIRE_START_X + decorateOffX, FIRE_START_Y + decorateOffY, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, decorateArtifice, 0, 0, decorateArtifice.getWidth(), decorateArtifice.getHeight(), Sprite.TRANS_MIRROR, FIRE_START_X + FIRE_ALL_W - decorateOffX, FIRE_START_Y + decorateOffY, 0);
    }

    //绘制炼化费用描述框
    private void drawArtificeMoney(Graphics g) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        final int DEC_X = startx + 280;
        final int DEC_Y = starty + 40;
        final int DEC_W = 140;
        final int DEC_H = 144;
        drawDecBack(g, DEC_X, DEC_Y, DEC_W, DEC_H);
        int wordX = DEC_X + 10;
        int wordY = DEC_Y + 10;
        g.setColor(0xffffff);
        font.drawString(g, "炼化费用：", wordX, wordY, 0);
        wordY += FishFont.LINE_HEIGHT;
        for (int index = 0; index < FIRE_NAME.length; index++) {
            g.setColor(0x4a4a4a);
            if (artificeFireMaxLv == index || index == 0) {
                g.setColor(0xffffff);
            }
            font.drawString(g, FIRE_NAME[index] + "：" + ARTIFICE_MONEY[index] + "金", wordX, wordY, 0);
            wordY += FishFont.LINE_HEIGHT;
        }
    }

    //绘制晶石描述
    private void drawStoneDec(Graphics g) {
        if (!showDec || itemDec == null) {
            return;
        }
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        final int DEC_X = startx + 5;
        final int DEC_Y = starty + 5;
        final int DEC_W = 200;
        final int DEC_H = 200;
        drawDec(g, DEC_X, DEC_Y, DEC_W, DEC_H, itemDec);
    }

    //初始化晶石描述
    private void prepareStoneDec(MyItem item) {
        if (item == null) {
            return;
        }
        String titleColor = "0xfff29f";
        StringBuffer buf = new StringBuffer();
        int type = item.item.type;
        itemPrice = item.getPrice();
        buf.append("{").append(titleColor).append("名称：}").append(item.getName()).append("|");
        buf.append("{").append(titleColor).append("等级：}").append(item.lv + 1).append("|");
        char[] effect = item.getEffectsDescription();
        if (effect != null && effect.length != 0) {
            buf.append("{").append(titleColor).append("效果：}|").append(effect);
        }
        buf.append("{").append(titleColor).append("描述：}|").append(item.item.desc).append("|");
        itemDec = buf.toString().toCharArray();
        if (itemDec == null) {
            return;
        }
        initShowDec();
    }

    //绘制配方界面
    //显示炉子动画
    boolean isShowSucceedStoveAnimal = false;
    boolean isShowProduceGoods = false;
    int showProceGoodsTime = 0;
    final int ENOUGH_SHOW_TIME = 15;
    //当前选中的材料索引值
    int materialIndex = 0;
    void drawFormulaInterface(Graphics g) {
        int framew = WIDTH_FRAME;
        int frameh = HEIGHT_FRAME;
        int startx = (Page.SCREEN_WIDTH - framew) >> 1;
        int starty = (Page.SCREEN_HEIGHT - frameh) >> 1;
        drawCommonImage(g, startx, starty, 0);
        
        //绘制炉子
        int offsetx = 88;
        int offsety = 136;
        int curx = startx + offsetx;
        int cury = starty + offsety;
        stove.paint(g, -curx, -cury);
        
        //绘制炉子上的框
        offsetx = 68;
        offsety = 84;
        curx = startx + offsetx;
        cury = starty + offsety;        
        int w = stoveFrameOutside.getWidth();
        int h = stoveFrameOutside.getHeight();
        g.drawImage(stoveFrameOutside, curx, cury, Graphics.LEFT | Graphics.TOP);
        g.drawImage(stoveFrameInside, curx + 2, cury + 3, Graphics.LEFT | Graphics.TOP);
        curx += w;
        Util.drawRegion(g, stoveFrameOutside, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);
        w = stoveFrameInside.getWidth();
        h = stoveFrameInside.getHeight();
        Util.drawRegion(g, stoveFrameInside, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury + 3, Graphics.LEFT | Graphics.TOP); 
        //绘制炉子上的物品图标
        curx = startx + offsetx;
        MyItem showItem = isShowProduceGoods ? createItem : curItem;
        showItem.paintIcon(g, curx + 5, cury + 6);

        //绘制炼制框
        offsetx = 44;
        offsety = 170;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = achieveFrame.getWidth() - 1;
        h = achieveFrame.getHeight();
        if (isShowSucceedStoveAnimal || isShowProduceGoods) {
            Util.drawClipImage(g, menuFrame, curx, cury, 0, 0, w, h);
            Util.drawRegion(g, menuFrame, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + w, cury, Graphics.LEFT | Graphics.TOP);
        }
        else {
            g.drawImage(achieveFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, achieveFrame, 0, 0, w, h, Sprite.TRANS_MIRROR, curx + w, cury, Graphics.LEFT | Graphics.TOP);
        }
        w = artificeFont.getWidth();
        h = artificeFont.getHeight() / 2;
        Util.drawRegion(g, artificeFont, 0, 0, w, h, Sprite.TRANS_NONE, curx + 18, cury + 10, Graphics.LEFT | Graphics.TOP);

        //绘制名称描述
        offsetx = 150;
        offsety = 40;
        curx = startx + offsetx;
        cury = starty + offsety;
        font.drawTxtWithDifferentColor(g, formulaDec, curx, cury, WIDTH_FRAME, 0xffffff);
        g.setColor(0xffa746);
        offsetx = 150;
        offsety = 152;
        curx = startx + offsetx;
        cury = starty + offsety;
        font.drawChars(g, "需要材料：".toCharArray(), curx, cury);

        //绘制材料背景框
        offsetx = 158;
        offsety = 170;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = stoveFrameInside.getWidth();
        h = stoveFrameInside.getHeight();
        int intervalx = 2 * w + 20;
        for (int i = 0; i < 3; i++) {
            g.drawImage(stoveFrameInside, curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, stoveFrameInside, 0, 0, w, h, Sprite.TRANS_ROT180, curx + w, cury, Graphics.LEFT | Graphics.TOP);
            //绘制材料图标
            if (formulaNeedItemId.length > i) {
                int id = formulaNeedItemId[i];
                Item materialItem = (Item)GameContext.itemMap.get((short)id);
                materialItem.paintIcon(g, curx + 3, cury + 3);
                //需要材料数量
                int numW = lvNumber.getWidth();
                int numH = lvNumber.getHeight() / 10;
                Util.drawNumbersAlignRight(g, formulaHaveItemCount[i], lvNumber, numW, numH, 0, curx + 21, cury + 29);
                int spritW = spritAndLv.getWidth();
                int spritH = spritAndLv.getHeight() / 2;
                Util.drawRegion(g, spritAndLv, 0, 0, spritW, spritH, Sprite.TRANS_NONE, curx + 23, cury + 27, Graphics.LEFT | Graphics.TOP);
                Util.drawNumbersAlignRight(g, formulaNeedItemCount[i], lvNumber, numW, numH, 0, curx + 20 + spritW + numW, cury + 29);
            }
            curx += intervalx;
        }

        if (showDec && itemDec != null) {
            curx = 286;
            cury = 4;
            w = 180;
            h = 180;
            drawDec(g, curx, cury, w, h, itemDec);
        }
    }
    
    //绘制任务界面
    void drawMissionInterface(Graphics g) {
        int startx = (Page.SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (Page.SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;

        drawCommonImage(g, startx, starty, 0);
        final int missionTitleIndex = 5;
        drawInterfaceTitle(g, startx, starty, missionTitleIndex);

        //绘制主线任务蓝色渐变
        int offsetx = 22;
        int offsety = 29;
        int curx = startx + offsetx;
        int cury = starty + offsety;
        int w = blueShade.getWidth();
        int h = blueShade.getHeight();
        Util.drawRegion(g, blueShade, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
        g.drawImage(blueShade, curx, cury + h, Graphics.LEFT | Graphics.TOP);
        final int TYPE_TITLE_OFFX = 8;
        final int TYPE_TITLE_OFFY = 2;
        final int TYPE_TITLE_W = imgMissionTypeTitle.getWidth();
        final int TYPE_TITLE_H = imgMissionTypeTitle.getHeight() >> 1;
        Util.drawClipImage(g, imgMissionTypeTitle, curx + TYPE_TITLE_OFFX, cury + TYPE_TITLE_OFFY, 0, 0, TYPE_TITLE_W, TYPE_TITLE_H);

        //绘制主线任务名称框
        offsetx = 23;
        offsety = 55;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = 184;
        h = 46;
        drawFrameSmallLace(g, curx, cury, w, h);
        
        final int NAME_OFFX = 10;
        final int NAME_OFFY = (h - FishFont.FONT_HEIGHT) >> 1;
        if (mainMission != null && mainMission.name != null && mainMission.name.length != 0) {
            //主线名称
            g.setColor(0xfff29f);
            font.drawChars(g, mainMission.name, curx + NAME_OFFX, cury + NAME_OFFY);
        }

        //绘制支线任务蓝色渐变
        offsetx = 22;
        offsety = 104;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = blueShade.getWidth();
        h = blueShade.getHeight();
        Util.drawRegion(g, blueShade, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
        g.drawImage(blueShade, curx, cury + h, Graphics.LEFT | Graphics.TOP);
        Util.drawClipImage(g, imgMissionTypeTitle, curx + TYPE_TITLE_OFFX, cury + TYPE_TITLE_OFFY, 0, TYPE_TITLE_H, TYPE_TITLE_W, TYPE_TITLE_H);

        //绘制支线任务描述框上
        offsetx = 23;
        offsety = 130;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = 184;
        h = 46;
        final int ITEM_DIS = 51;
        final int STATE_OFFX = 200;
        final int STATE_OFFY = 5;
        final int STATE_FRAME_W = titleFrame.getWidth();
        final int STATE_FRAME_H = titleFrame.getHeight();
        final int STATE_TXT_W = imgMissionFinishTxt.getWidth();
        final int STATE_TXT_H = imgMissionFinishTxt.getHeight() >> 1;
        for (int index = 0; index < SUB_MISSION_SHOW_CNT; index++) {
            drawFrameSmallLace(g, curx, cury, w, h);
            Util.drawRegion(g, titleFrame, 0, 0, STATE_FRAME_W, STATE_FRAME_H, Sprite.TRANS_MIRROR, curx + STATE_OFFX, cury + STATE_OFFY, Graphics.LEFT | Graphics.TOP);
            g.drawImage(titleFrame, curx + STATE_OFFX + STATE_FRAME_W, cury + STATE_OFFY, Graphics.LEFT | Graphics.TOP);
            if (subMissionList[0] != null && subMissionList.length > 0 && subMissionStartIndex + index < subMissionList.length) {
                Mission subM = subMissionList[subMissionStartIndex + index];
                if (subM != null && subM.name != null && subM.name.length != 0) {
                    g.setColor(0xfff29f);
                    font.drawChars(g, subM.name, curx + NAME_OFFX, cury + NAME_OFFY);
                    Util.drawClipImage(g, imgMissionFinishTxt, curx + STATE_OFFX + STATE_FRAME_W - (STATE_TXT_W >> 1), cury + STATE_OFFY + 6, 0, STATE_TXT_H * (subM.getMissionState() - 1), STATE_TXT_W, STATE_TXT_H);
                }
            }
            cury += ITEM_DIS;
        }

        if (subMissionList != null && subMissionList.length > SUB_MISSION_SHOW_CNT) {
            //滚动条
            final int ScrollBarRightOffsetX = 27;
            final int ScrollBarOffsetY = 52;
            final int ScrollBarH = 162;
            FishFont.drawScrollBar(g, startx + WIDTH_FRAME - ScrollBarRightOffsetX, starty + ScrollBarOffsetY, ScrollBarH, subMissionStartIndex, subMissionList.length - SUB_MISSION_SHOW_CNT);
        }

        if (showDec && missionDec != null) {
            offsetx = 190;
            offsety = 24;
            curx = startx + offsetx;
            cury = starty + offsety;
            w = 222;
            h = 200;
            drawDec(g, curx, cury, w, h, missionDec);
        }
    }

    /**
     * 绘制描述信息
     */
    void drawDec(Graphics g, int x, int y, int width, int height, char[] dec) {
        drawDecBack(g, x, y, width, height);
        final int TXT_TOP_Y = 16;
        final int TXT_LEFT_X = 8;
        final int TXT_RIGHT_X = 25;
        int TXT_W = width - (TXT_LEFT_X << 1);
        final int TXT_H = height - (TXT_TOP_Y << 1);
        
        if (showDecFrameH == 0) {
            showDecFrameH = TXT_H;
            showDecTxtH = font.getCharsHeightWithDifferentColor(dec, TXT_W);
            showDecScroll = showDecTxtH > TXT_H;
            if (showDecScroll) {
                TXT_W = width - TXT_LEFT_X - TXT_RIGHT_X;
                showDecTxtH = font.getCharsHeightWithDifferentColor(dec, TXT_W);
            }
        }

        if (!showDecScroll) {
            font.drawTxtWithDifferentColor(g, dec, x + TXT_LEFT_X, y + TXT_TOP_Y, TXT_W, 0xffffff);
            return;
        }
        TXT_W = width - TXT_LEFT_X - TXT_RIGHT_X;
        g.setClip(x + TXT_LEFT_X, y + TXT_TOP_Y, TXT_W, TXT_H);
        font.drawTxtWithDifferentColor(g, dec, x + TXT_LEFT_X, y + TXT_TOP_Y - showDecY, TXT_W, 0xffffff);
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        final int BAR_OFFX = 24;
        final int BAR_OFFY = 14;
        FishFont.drawScrollBar(g, x + width - BAR_OFFX, y + BAR_OFFY, height - (BAR_OFFY << 1), showDecY, showDecTxtH - showDecFrameH);
    }

    /**
     * 绘制透明背景框
     */
    void drawDecBack(Graphics g, int x, int y, int width, int height) {
        final int MASK_W = imgMask.getWidth();
        int maskCnt = width / MASK_W;
        for (int index = 0; index < maskCnt; index++) {
            Util.drawClipImage(g, imgMask, x + MASK_W * index, y, 0, 0, MASK_W, height);
        }
        if (maskCnt * MASK_W < width) {
            Util.drawClipImage(g, imgMask, x + MASK_W * maskCnt, y, 0, 0, width - maskCnt * MASK_W, height);
        }
        final int LEFT_FRAME_H = smallBackFrameLeft.getHeight();
        int leftFrameCnt = height / LEFT_FRAME_H;
        for (int index = 0; index < leftFrameCnt; index++) {
            g.drawImage(smallBackFrameLeft, x, y + LEFT_FRAME_H * index, 0);
            Util.drawRegion(g, smallBackFrameLeft, 0, 0, smallBackFrameLeft.getWidth(), LEFT_FRAME_H, Sprite.TRANS_MIRROR, x + width, y + LEFT_FRAME_H * index, Graphics.RIGHT | Graphics.TOP);
        }
        if (leftFrameCnt * LEFT_FRAME_H < height) {
            Util.drawClipImage(g, smallBackFrameLeft, x, y + LEFT_FRAME_H * leftFrameCnt, 0, 0, smallBackFrameLeft.getWidth(), height - leftFrameCnt * LEFT_FRAME_H);
            Util.drawRegion(g, smallBackFrameLeft, 0, 0, smallBackFrameLeft.getWidth(), height - leftFrameCnt * LEFT_FRAME_H, Sprite.TRANS_MIRROR, x + width, y + LEFT_FRAME_H * leftFrameCnt, Graphics.RIGHT | Graphics.TOP);
        }
        final int TOP_FRAME_W = bigBackFrame.getWidth();
        int topFrameCnt = (width - 2) / TOP_FRAME_W;
        for (int index = 0; index < topFrameCnt; index++) {
            g.drawImage(bigBackFrame, x + TOP_FRAME_W * index + 1, y, 0);
            Util.drawRegion(g, bigBackFrame, 0, 0, TOP_FRAME_W, bigBackFrame.getHeight(), Sprite.TRANS_ROT180, x + TOP_FRAME_W * index + 1, y + height, Graphics.LEFT | Graphics.BOTTOM);
        }
        if (topFrameCnt * TOP_FRAME_W < width - 2) {
            Util.drawClipImage(g, bigBackFrame, x + topFrameCnt * TOP_FRAME_W + 1, y, 0, 0, width - topFrameCnt * TOP_FRAME_W - 2, bigBackFrame.getHeight());
            Util.drawRegion(g, bigBackFrame, 0, 0, width - topFrameCnt * TOP_FRAME_W - 2, bigBackFrame.getHeight(), Sprite.TRANS_ROT180, x + topFrameCnt * TOP_FRAME_W + 1, y + height, Graphics.LEFT | Graphics.BOTTOM);
        }
    }

    //绘制商店界面
    void drawSuperShopInterface(Graphics g) {
        int startx = (Page.SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (Page.SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        int curx = 0;
        int cury = 0;
        drawCommonImage(g, startx, starty, 0);
        final int shopTitleIndex = 8;
        drawInterfaceTitle(g, startx, starty, shopTitleIndex);
        //绘制商店物品框
        int offsetx = 43;
        int offsety = 34;
        curx = startx + offsetx;
        cury = starty + offsety;
        int w = weaponFrame.getWidth();
        int intervalx = w + 16;
        final int SMS_ITEM_ICON_W = smsItemIcon.getWidth() / ARMOR_COLS;
        final int SMS_ITEM_ICON_H = smsItemIcon.getHeight();
        for (int i = 0; i < ARMOR_COLS; i++) {
            g.drawImage(weaponFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawClipImage(g, smsItemIcon, curx + 3, cury + 2, SMS_ITEM_ICON_W * i, 0, SMS_ITEM_ICON_W, SMS_ITEM_ICON_H);
            curx += intervalx;
        }
        //绘制普通物品框
        offsetx = 40;
        offsety = 116;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = goodsFrame.getWidth();
        int h = goodsFrame.getHeight();
        intervalx = w + 22;
        int intervaly = h + 12;
        for (int i = 0; i < STORE_SUPER_ROWS; i++) {
            for (int j = 0; j < ARMOR_COLS; j++) {
                g.drawImage(goodsFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
                int itemIndex = ARMOR_COLS * (armorStartRow + i) + j;
                if (buyItemId != null && buyItemId.length > itemIndex) {
                    Item item = GameContext.getItem(buyItemId[itemIndex]);
                    item.paintIcon(g, curx + 3, cury + 3);
                }
                curx += intervalx;
            }
            curx = startx + offsetx;
            cury += intervaly;
        }

        drawMenuMoney(g, GameContext.actor.getMoney(), startx + (WIDTH_FRAME >> 1), starty + HEIGHT_FRAME - 28);
        if (showDec && itemDec != null) {
            drawMenuButtons(g, true, true, startx, starty);
        }
        else {
            drawMenuButtons(g, false, true, startx, starty);
        }

        if (buyItemId != null && buyItemId.length > STORE_SUPER_ROWS * ARMOR_COLS) {
            //滚动条
            final int ScrollBarRightOffsetX = 27;
            final int ScrollBarOffsetY = 112;
            final int ScrollBarH = 102;
            int len = ((buyItemId.length - STORE_SUPER_ROWS * ARMOR_COLS - 1) / ARMOR_COLS) + 1;
            FishFont.drawScrollBar(g, startx + WIDTH_FRAME - ScrollBarRightOffsetX, starty + ScrollBarOffsetY, ScrollBarH, armorStartRow, len);
        }

        if (showDec && itemDec != null) {
            if (ShowSmsDec) {
                offsetx = 43;
                offsety = 34;
                w = weaponFrame.getWidth();
                h = weaponFrame.getHeight();
                selectFrameAnimal.actId = 1;
                selectFrameAnimal.initFrame();
                int selectFrameX = startx + offsetx + (w + 16) * armorCurCol + (w >> 1);
                int selectFrameY = starty + 34;
                selectFrameAnimal.paint(g, -selectFrameX, -(selectFrameY + h));
                selectFrameAnimal.update();
            } else {
                offsetx = 40;
                offsety = 116;
                w = goodsFrame.getWidth();
                h = goodsFrame.getHeight();
                selectFrameAnimal.actId = 0;
                selectFrameAnimal.initFrame();
                int selectFrameX = startx + offsetx + intervalx * armorCurCol + (w >> 1);
                int selectFrameY = starty + offsety + intervaly * (armorCurRow - armorStartRow) - 3;
                selectFrameAnimal.paint(g, -selectFrameX, -(selectFrameY + h));
                selectFrameAnimal.update();
            }
            offsetx = 306;
            offsety = starty + 30;
            w = 172;
            h = 178;
            curx = SCREEN_WIDTH - w - 10;
            cury = offsety;
            if (armorCurCol > ARMOR_COLS >> 1) {
                curx = 10;
            }
            drawDec(g, curx, cury, w, h, itemDec);
        }

        if (isDrawChangeTradingCount) {
            drawChangeTradingCountOP(g);
        }
    }
    
    void drawShopInterface(Graphics g) {
        int startx = (Page.SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (Page.SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        int curx = 0;
        int cury = 0;
        drawCommonImage(g, startx, starty, 0);
        final int shopTitleIndex = 8;
        drawInterfaceTitle(g, startx, starty, shopTitleIndex);

        //绘制普通物品框
        int offsetx = 40;
        int offsety = 50;
        curx = startx + offsetx;
        cury = starty + offsety;
        int w = goodsFrame.getWidth();
        int h = goodsFrame.getHeight();
        int intervalx = w + 22;
        int intervaly = h + 22;
        for (int i = 0; i < ARMOR_ROWS; i++) {
            for (int j = 0; j < ARMOR_COLS; j++) {
                g.drawImage(goodsFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
                int itemIndex = ARMOR_COLS * (armorStartRow + i) + j;
                if (buyItemId != null && buyItemId.length > itemIndex) {
                    Item item = GameContext.getItem(buyItemId[itemIndex]);
                    item.paintIcon(g, curx + 3, cury + 3);
                }
                curx += intervalx;
            }
            curx = startx + offsetx;
            cury += intervaly;
        }

        drawMenuMoney(g, GameContext.actor.getMoney(), startx + (WIDTH_FRAME >> 1), starty + HEIGHT_FRAME - 28);
        if (showDec && itemDec != null) {
            drawMenuButtons(g, true, true, startx, starty);
        }
        else {
            drawMenuButtons(g, false, true, startx, starty);
        }

        if (buyItemId != null && buyItemId.length > ARMOR_ROWS * ARMOR_COLS) {
            //滚动条
            final int ScrollBarRightOffsetX = 27;
            final int ScrollBarOffsetY = 60;
            final int ScrollBarH = 150;
            int len = ((buyItemId.length - ARMOR_ROWS * ARMOR_COLS - 1) / ARMOR_COLS) + 1;
            FishFont.drawScrollBar(g, startx + WIDTH_FRAME - ScrollBarRightOffsetX, starty + ScrollBarOffsetY, ScrollBarH, armorStartRow, len);
        }

        if (showDec && itemDec != null) {
            int selectFrameX = startx + offsetx + intervalx * armorCurCol + (w >> 1);
            int selectFrameY = starty + offsety + intervaly * (armorCurRow - armorStartRow) - 3;
            selectFrameAnimal.paint(g, -selectFrameX, -(selectFrameY + h));
            selectFrameAnimal.update();

            offsetx = 306;
            offsety = starty + 30;
            w = 172;
            h = 178;
            curx = SCREEN_WIDTH - w - 10;
            cury = offsety;
            if (armorCurCol > ARMOR_COLS >> 1) {
                curx = 10;
            }
            drawDec(g, curx, cury, w, h, itemDec);
        }

        if (isDrawChangeTradingCount) {
            drawChangeTradingCountOP(g);
        }
    }
    
    //绘制物品界面
    boolean isShowGoodsStallFrame = false;
    boolean isShowGoodsExplainFrame = false;
    int goodsIndex;
    int GOODS_AREA_STARTY = 59;
    int goodsAreaX = 92;
    //物品区域的纵坐标
    int goodsAreaY = GOODS_AREA_STARTY;
    //物品区域的高度
    int goodsAreaHeight = 0;
    final int GOODS_AREA_CLIPX = 92;
    final int GOODS_AREA_CLIPY = 59;
    final int GOODS_AREA_CLIPW = 278;
    final int GOODS_AREA_CLIPH = 158;
    int CURSOR_STARTY = 76;
    int cursorX = 383;
    int cursorY = CURSOR_STARTY;
    int cursorW = 0;
    int cursorH = 0;
    int CURSOR_MOVE_HEIGHT = 123;



    //初始化物品
    private void initGoodsInterface() {
        selectFrameAnimal.actId = 0;
        selectFrameAnimal.initFrame();
        showDec = false;
        itemDec = null;
        curArmorItems = new MyItem[GameContext.actor.bagItemCnt];
        int itemsCount = 0;
        for (int index = Item.ARMOR; index < Item.STONE; index++) {
            MyItem[] items = GameContext.actor.getItemsFromActorBag(index);
            if (items == null || items.length == 0) {
                continue;
            }
            System.arraycopy(items, 0, curArmorItems, itemsCount, items.length);
            itemsCount += items.length;
        }
        MyItem[] items = new MyItem[itemsCount];
        System.arraycopy(curArmorItems, 0, items, 0, itemsCount);
        curArmorItems = items;
    }

    //绘制物品界面
    void drawGoodsInterface(Graphics g) {
        int startx = (SCREEN_WIDTH - WIDTH_FRAME) >> 1;
        int starty = (SCREEN_HEIGHT - HEIGHT_FRAME) >> 1;
        int curx = 0;
        int cury = 0;
        drawCommonImage(g, startx, starty, 0);
        final int titleIndex = 2;
        drawInterfaceTitle(g, startx, starty, titleIndex);

        //绘制普通物品框
        int offsetx = 40;
        int offsety = 45;
        curx = startx + offsetx;
        cury = starty + offsety;
        int w = goodsFrame.getWidth();
        int h = goodsFrame.getHeight();
        int intervalx = w + 22;
        int intervaly = h + 22;
        int numW = numberSmall.getWidth() / 10;
        for (int i = 0; i < ARMOR_ROWS; i++) {
            for (int j = 0; j < ARMOR_COLS; j++) {
                g.drawImage(goodsFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
                int itemIndex = ARMOR_COLS * (armorStartRow + i) + j;
                if (curArmorItems != null && curArmorItems.length > itemIndex) {
                    MyItem item = curArmorItems[itemIndex];
                    item.item.paintIcon(g, curx + 3, cury + 3);
                    if (item.isActorEquip) {
                        g.drawImage(imgItemEquip, curx + w, cury + h, Graphics.RIGHT | Graphics.BOTTOM);
                    }
                    if (item.canOverPosition()) {
                        Util.drawNumbersAlignRight(g, item.cnt, numberSmall, numW, 0, curx + w - 3, cury + h - numberSmall.getHeight() - 3);
                    }
                }
                curx += intervalx;
            }
            curx = startx + offsetx;
            cury += intervaly;
        }

        drawMenuMoney(g, GameContext.actor.getMoney(), startx + (WIDTH_FRAME >> 1), starty + HEIGHT_FRAME - 28);
//        drawMenuButtons(g, false, true, startx, starty);

        if (curArmorItems != null && curArmorItems.length > ARMOR_ROWS * ARMOR_COLS) {
            //滚动条
            final int ScrollBarRightOffsetX = 27;
            final int ScrollBarOffsetY = 60;
            final int ScrollBarH = 150;
            int len = ((curArmorItems.length - ARMOR_ROWS * ARMOR_COLS - 1) / ARMOR_COLS) + 1;
            FishFont.drawScrollBar(g, startx + WIDTH_FRAME - ScrollBarRightOffsetX, starty + ScrollBarOffsetY, ScrollBarH, armorStartRow, len);
        }

        goodItemCenterX = startx + offsetx + intervalx * armorCurCol + (w >> 1);
        goodItemCenterY = starty + offsety + intervaly * (armorCurRow - armorStartRow) + (h >> 1);
        if (showPopMenu) {
            selectFrameAnimal.paint(g, -goodItemCenterX, -(goodItemCenterY + (h >> 1) - 2));
            selectFrameAnimal.update();
            drawPopMenu(g, goodItemCenterX, goodItemCenterY, armorCurCol <= ARMOR_COLS >> 1);
        }

        if (showDec && itemDec != null) {
            offsety = 45;
            w = 208;
            h = 205;
            curx = goodItemCenterX + 30;
            cury = starty + offsety;
            if (armorCurCol > ARMOR_COLS >> 1) {
                curx = goodItemCenterX - w - 30;
            }
            drawDec(g, curx, cury, w, h, itemDec);
        }

        if (isDrawChangeTradingCount) {
            drawChangeTradingCountOP(g);
        }
    }
    
    //获得物品个数
    int getGoodsNum() {
        int goodsCnt = GameContext.actor.bagItemCnt;
        int num = 0;
        for (int i = 0; i < goodsCnt; i++) {
            Item item = (Item)GameContext.actor.bagItems[i].item;            
            if (curInterface == ATTRI) {
                if ((attriIndex == 1 && !Item.getItemTypeName(item.type).equals("防具")) 
                        || (attriIndex == 2 && !Item.getItemTypeName(item.type).equals("鞋子")) 
                        || (attriIndex == 3 && !Item.getItemTypeName(item.type).equals("饰品"))) {
                    continue;
                }
            } else if (Item.getItemTypeName(item.type).equals("武器")){
                continue;
            }
            num++;
        }        
        return num;
    }
    
//    //将某个物品框显示到物品区域的中间
//    void letGoodsFrameShowMiddleOfGoodsArea(int id) {
//        int index = getGoodsIndexCorrespondToId(id) + 1;
//        int intervaly = goodsFrame.getHeight() + 22;
//        int heightToCury = (index / 5 + (index % 5 == 0 ? 0 : 1) - 1) * intervaly;
//        int midH = GOODS_AREA_CLIPH / 2;
//        if (heightToCury > midH) {
//            goodsAreaY = GOODS_AREA_STARTY - (heightToCury - midH);
//        } else {
//            goodsAreaY = GOODS_AREA_STARTY;
//        }
//    }
    
    
    //绘制系统菜单界面
    static int sysMenuCurIndex;
    boolean flag = true;
    void drawSystemMenuInterface(Graphics g) {
        int startx = (SCREEN_WIDTH - 350) >> 1;
        int starty = (SCREEN_HEIGHT - 130) >> 1;    
        int curx = startx;
        int cury = starty - 50;
        int intervalx = 90;
        int intervaly = 79;
        int w1 = suspendChain.getWidth();
        int h1 = suspendChain.getHeight();
        int w2 = sysMenuBackFrame.getWidth();
        int h2 = sysMenuBackFrame.getHeight();
        int w3 = sysMenuFont.getWidth();
        int h3 = sysMenuFont.getHeight() / 8;
        int w4 = sysMenuFontSelect.getWidth();
        int h4 = sysMenuFontSelect.getHeight() / 8;
        
        for (int i = 0; i < 4; i++) {
            //第一个吊链
            g.drawImage(suspendChain, curx + 14, cury - intervaly, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, suspendChain, 0, 0, w1, h1, Sprite.TRANS_MIRROR,
                    curx + 14 + w1, cury - intervaly, Graphics.LEFT | Graphics.TOP);
            //第二个吊链
            g.drawImage(suspendChain, curx + 50, cury - intervaly, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, suspendChain, 0, 0, w1, h1, Sprite.TRANS_MIRROR,
                    curx + 50 + w1, cury - intervaly, Graphics.LEFT | Graphics.TOP);
            curx += intervalx;
        }   
        curx = startx;
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 4; j++) {
                //第一个吊链
                g.drawImage(suspendChain, curx + 14, cury, Graphics.LEFT | Graphics.TOP);
                Util.drawRegion(g, suspendChain, 0, 0, w1, h1, Sprite.TRANS_MIRROR, 
                        curx + 14 + w1, cury, Graphics.LEFT | Graphics.TOP);
                //第二个吊链
                g.drawImage(suspendChain, curx + 50, cury, Graphics.LEFT | Graphics.TOP);
                Util.drawRegion(g, suspendChain, 0, 0, w1, h1, Sprite.TRANS_MIRROR, 
                        curx + 50 + w1, cury, Graphics.LEFT | Graphics.TOP);
                //背景框
                g.drawImage(sysMenuBackFrame, curx, cury + 25, Graphics.LEFT | Graphics.TOP);
                Util.drawRegion(g, sysMenuBackFrame, 0, 0, w2, h2, Sprite.TRANS_MIRROR, curx + w2, cury + 25, Graphics.LEFT | Graphics.TOP);
                
                //绘制字体
                if (sysMenuCurIndex == i * 4 + j) {
                    if (flag) {
                        Util.drawRegion(g, sysMenuFontSelect, 0, h4 * (i * 4 + j), w4, h4, Sprite.TRANS_NONE, curx + 11, cury + 41, Graphics.LEFT | Graphics.TOP);
                    } else {
                        Util.drawRegion(g, sysMenuFont, 0, h3 * (i * 4 + j), w3, h3, Sprite.TRANS_NONE, curx + 11, cury + 41, Graphics.LEFT | Graphics.TOP);
                    }
                    flag = !flag;
                } else {
                    Util.drawRegion(g, sysMenuFont, 0, h3 * (i * 4 + j), w3, h3, Sprite.TRANS_NONE, curx + 11, cury + 41, Graphics.LEFT | Graphics.TOP);
                }                
                curx += intervalx;
            }
            curx = startx;
            cury += intervaly;
        }
        
        //绘制右上角
        int w = rightTopAngle.getWidth();
        curx = Page.SCREEN_WIDTH - w;
        cury = 0;
        g.drawImage(rightTopAngle, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制返回框
        curx = Page.SCREEN_WIDTH - retFrame.getWidth();
        cury = Page.SCREEN_HEIGHT - retFrame.getHeight();
        g.drawImage(retFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制返回字体
        w = retAndFireFont.getWidth();
        int h = 19;
        Util.drawRegion(g, retAndFireFont, 0, 0, w, h, Sprite.TRANS_NONE, curx + 13, cury + 8, Graphics.LEFT | Graphics.TOP);
    }

    //绘制游戏中菜单
    void drawGameMenuInterface(Graphics g) {
        if (curGameMenuTab == SYS_MENU_SOUND) {
            drawSoundInterface(g);
            return;
        }
        if (curGameMenuTab == SYS_MENU_HELP) {
            drawHelpInterface(g);
            return;
        }
        drawGameMenuList(g);
        if (dlg.isAvailable()) {
            dlg.paint(g);
        }
        drawSaving(g);
    }

    //存储中
    char[] savingTxt;
    boolean saving = false;
    private void drawSaving(Graphics g) {
        if (!saving) {
            return;
        }
        //绘制弹出框
        final int POP_WIDTH = 160;
        final int POP_HEIGHT = FishFont.LINE_HEIGHT << 1;
        Dialog.drawBoxFrameNew(g, (SCREEN_WIDTH - POP_WIDTH >> 1), (SCREEN_HEIGHT - FishFont.LINE_HEIGHT) >> 1, POP_WIDTH, POP_HEIGHT);
        g.setColor(0xeee586);
        font.drawCharsAlignCenter(g, savingTxt, 0, savingTxt.length - 3 + step, SCREEN_WIDTH >> 1, (SCREEN_HEIGHT >> 1));
        step++;
        if (step >= 4) {
            step = 0;
        }
    }

    //绘制系统菜单列表
    void drawGameMenuList(Graphics g) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;

        drawCommonImage(g, startx, starty, 0);
        final int mapTitleIndex = 1;
        drawInterfaceTitle(g, startx, starty, mapTitleIndex);

        //选项背景
        final int MENU_FRAME_W = menuFrame.getWidth();
        final int MENU_FRAME_H = menuFrame.getHeight();
        final int MENU_FRAME_X = startx + (WIDTH_FRAME >> 1) - MENU_FRAME_W;
        int menuFrameY = starty + 45;
        final int MENU_FRAME_DIS = MENU_FRAME_H + 6;
        //锁链
        final int CHAIN_OFFSET_X = 22;
        final int CHAIN_W = suspendChain.getWidth();
        final int CHAIN_H = suspendChain.getHeight();
        final int CHAIN_START_H = 31;
        final int CHAIN_END_H = 10;
        int chainLeftX = MENU_FRAME_X + CHAIN_OFFSET_X;
        int chainRightX = MENU_FRAME_X + (MENU_FRAME_W << 1) - CHAIN_OFFSET_X - CHAIN_W;
        //文字
        final int TXT_W = gameMenuFont.getWidth();
        final int TXT_H = gameMenuFont.getHeight() / SYS_MENU_RETURN_MAIN;

        //绘制
        for (int index = 0; index < SYS_MENU_RETURN_MAIN; index++) {
            Image img = (gameMenuIndex == index) ? selectMenuFrame : menuFrame;
            Image imgTxt = (gameMenuIndex == index) ? gameMenuFontSelect : gameMenuFont;
            g.drawImage(img, MENU_FRAME_X, menuFrameY, 0);
            Util.drawRegion(g, img, 0, 0, MENU_FRAME_W, MENU_FRAME_H, Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W, menuFrameY, 0);
            Util.drawClipImage(g, imgTxt, MENU_FRAME_X + MENU_FRAME_W - (TXT_W >> 1), menuFrameY + (MENU_FRAME_H >> 1) - (TXT_H >> 1), 0, TXT_H * index, TXT_W, TXT_H);
            int chainY = menuFrameY - CHAIN_END_H + 2;
            if (index == 0) {
                chainY = menuFrameY - CHAIN_START_H + 2;
                Util.drawClipImage(g, suspendChain, chainLeftX, chainY, 0, 0, CHAIN_W, CHAIN_START_H);
                Util.drawClipImage(g, suspendChain, chainRightX, chainY, 0, 0, CHAIN_W, CHAIN_START_H);
                Util.drawRegion(g, suspendChain, 0, 0, CHAIN_W, CHAIN_START_H, Sprite.TRANS_MIRROR, chainLeftX + CHAIN_W, chainY, 0);
                Util.drawRegion(g, suspendChain, 0, 0, CHAIN_W, CHAIN_START_H, Sprite.TRANS_MIRROR, chainRightX + CHAIN_W, chainY, 0);
            }
            else {
                Util.drawClipImage(g, suspendChain, chainLeftX, chainY, 0, CHAIN_H - CHAIN_END_H, CHAIN_W, CHAIN_END_H);
                Util.drawClipImage(g, suspendChain, chainRightX, chainY, 0, CHAIN_H - CHAIN_END_H, CHAIN_W, CHAIN_END_H);
                Util.drawRegion(g, suspendChain, 0, CHAIN_H - CHAIN_END_H, CHAIN_W, CHAIN_END_H, Sprite.TRANS_MIRROR, chainLeftX + CHAIN_W, chainY, 0);
                Util.drawRegion(g, suspendChain, 0, CHAIN_H - CHAIN_END_H, CHAIN_W, CHAIN_END_H, Sprite.TRANS_MIRROR, chainRightX + CHAIN_W, chainY, 0);
            }
            menuFrameY += MENU_FRAME_DIS;
        }

//        //绘制返回框
//        int offsetx = 302;
//        int offsety = 216;
//        int curx = startx + offsetx;
//        int cury = starty + offsety;
//        g.drawImage(retFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
//        Util.drawClipImage(g, retAndFireFont, curx + 12, cury + 7, 0, 0, retAndFireFont.getWidth(), retAndFireFont.getHeight() >> 1);
    }
    
    //绘制帮助界面
    int helpOffsetY = 0;
    void drawHelpInterface(Graphics g) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        drawCommonImage(g, startx, starty, 0);

        final int TXT_LEFT_X = startx + 22;
        final int TXT_TOP_Y = starty + 40;
        final int TXT_W = 300;
        final int TXT_H = 172;
        g.setClip(TXT_LEFT_X, TXT_TOP_Y, TXT_W, TXT_H);
        g.setColor(0xffffff);
        int txtHeight = font.drawCharsAlignLeft(g, GameContext.helpTxt, TXT_LEFT_X, TXT_TOP_Y - helpOffsetY, TXT_W);
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        //滚动条
        final int ScrollBarRightOffsetX = 27;
        final int ScrollBarOffsetY = 52;
        final int ScrollBarH = 162;
        FishFont.drawScrollBar(g, startx + WIDTH_FRAME - ScrollBarRightOffsetX, starty + ScrollBarOffsetY, ScrollBarH, helpOffsetY, txtHeight - TXT_H);

//        //绘制返回框
//        int offsetx = 302;
//        int offsety = 216;
//        int curx = startx + offsetx;
//        int cury = starty + offsety;
//        g.drawImage(retFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
//        Util.drawClipImage(g, retAndFireFont, curx + 12, cury + 7, 0, 0, retAndFireFont.getWidth(), retAndFireFont.getHeight() >> 1);
    }

    //绘制共有图片，界面大背景框（绘制完毕）
    void drawCommonImage(Graphics g, int sx, int sy, int offy) {
        int clipx = g.getClipX();
        int clipy = g.getClipY();
        int clipw = g.getClipWidth();
        int cliph = g.getClipHeight();
        int offsetx = 0;
        int offsety = offy;
        int startx = sx;
        int starty = sy;
        int curx = startx;
        int cury = starty;
        int w = 0;
        int h = 0;
        int num = 0;
        
        g.setColor(0);
        g.fillRect(startx, starty, WIDTH_FRAME, HEIGHT_FRAME);
        
        //绘制上边
        w = upSide.getWidth();
        h = upSide.getHeight();
        g.setClip(curx, cury, WIDTH_FRAME, h);
        g.drawImage(upSide, curx, cury, Graphics.LEFT | Graphics.TOP);
        curx += upSide.getWidth();
        Util.drawRegion(g, upSide, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制左边和右边
        curx = startx;
        cury += upSide.getHeight();
        int totalh = HEIGHT_FRAME - upSide.getHeight() - downSide.getHeight();
        w = leftSide.getWidth();
        h = leftSide.getHeight();
        num = totalh / h + 1;        
        for (int i = 0; i < num; i++) {
            g.setClip(curx, cury, w, totalh);
            g.drawImage(leftSide, curx, cury, Graphics.LEFT | Graphics.TOP);
            g.setClip(curx + WIDTH_FRAME - leftSide.getWidth(), cury, w, totalh);
            Util.drawRegion(g, leftSide, 0, 0, w, h, Sprite.TRANS_MIRROR, 
                    curx + WIDTH_FRAME - leftSide.getWidth(), cury, Graphics.LEFT | Graphics.TOP);
            cury += h;
        }        
        //绘制下边
        w = downSide.getWidth();
        h = downSide.getHeight();
        curx = startx;
        cury = starty + HEIGHT_FRAME - h;
        g.setClip(curx, cury, WIDTH_FRAME, h);
        g.drawImage(downSide, curx, cury, Graphics.LEFT | Graphics.TOP);
        curx += downSide.getWidth();
        Util.drawRegion(g, downSide, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制红条
        offsetx = leftSide.getWidth();
        offsety = 7;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = redStrip.getWidth();        
        g.setClip(curx, cury, WIDTH_FRAME - 2 * offsetx, redStrip.getHeight());
        g.drawImage(redStrip, curx, cury, Graphics.LEFT | Graphics.TOP);
        curx += w;
        Util.drawRegion(g, redStrip, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);

        int totalw = 0;
        g.setClip(clipx, clipy, clipw, cliph);
        if (curInterface == FORMULA || curInterface == ARTIFICE) {
            //绘制蓝色背景
            offsetx = 13;
            offsety = 30;
            curx = startx + offsetx;
            cury = starty + offsety;
            w = blueBack.getWidth();
            h = blueBack.getHeight();
            g.drawImage(blueBack, curx, cury, Graphics.LEFT | Graphics.TOP);
            curx += w;
            Util.drawRegion(g, blueBack, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);
            curx += w;
            g.drawImage(blueBack, curx, cury, Graphics.LEFT | Graphics.TOP);
            curx += w;
            Util.drawRegion(g, blueBack, 0, 0, w, h, Sprite.TRANS_MIRROR, curx, cury, Graphics.LEFT | Graphics.TOP);
        }
        if (curInterface == SUPERSHOP) {
            offsetx = leftSide.getWidth();
            offsety = 96;
            curx = startx + offsetx;
            cury = starty + offsety;
            w = redStrip.getWidth();
            g.setClip(curx + 10, cury, WIDTH_FRAME - 2 * offsetx - 10, redStrip.getHeight());
            Util.drawRegion(g, redStrip, 0, 0, w, h, Sprite.TRANS_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
            curx += w;
            Util.drawRegion(g, redStrip, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
            offsety = 88;
            curx = startx + offsetx;
            cury = starty + offsety;
            h = sawtooth.getHeight();
            g.setClip(curx + 10, cury, totalw - 10, sawtooth.getHeight());
            for (int i = 0; i < num; i++) {
                g.drawImage(sawtooth, curx, cury, Graphics.LEFT | Graphics.TOP);
                curx += w;
            }
        }
        if (curInterface != MAP) {
            //绘制锯齿
            offsety = 22;
            curx = startx + offsetx;
            cury = starty + offsety;
            w = sawtooth.getWidth();
            totalw = WIDTH_FRAME - 2 * offsetx;
            num = totalw / w + 1;
            g.setClip(curx, cury, totalw, sawtooth.getHeight());
            for (int i = 0; i < num; i++) {
                g.drawImage(sawtooth, curx, cury, Graphics.LEFT | Graphics.TOP);
                curx += w;
            }
            //绘制锁链
            offsetx = 6;
            offsety = 29;
            curx = startx + offsetx;
            cury = starty + offsety;
            totalh = HEIGHT_FRAME - offsety - downSide.getHeight();
            h = chain.getHeight();
            num = totalh / h + 1;
            g.setClip(curx, cury, chain.getWidth(), totalh);
            for (int i = 0; i < num; i++) {
                g.drawImage(chain, curx, cury, Graphics.LEFT | Graphics.TOP);
                cury += h;
            }
            g.setClip(clipx, clipy, clipw, cliph);
            //绘制左下角轮子
            offsetx = leftSide.getWidth();
            offsety = downSide.getHeight() + wheel.getHeight();
            curx = startx + offsetx;
            cury = starty + HEIGHT_FRAME - offsety;
            g.drawImage(wheel, curx, cury, Graphics.LEFT | Graphics.TOP);
            //绘制右上角
            offsetx = 51;
            offsety = 7;
            curx = startx + WIDTH_FRAME - offsetx;
            cury = starty + offsety;
            g.drawImage(rightTopAngle, curx, cury, Graphics.LEFT | Graphics.TOP);
        }
        g.setClip(clipx, clipy, clipw, cliph);
        if (curInterface == MAP) {
            offsetx = 4;
            offsety = 20;
            totalw = 353;
            totalh = 208;
            drawInsideFrame(g, startx, starty, offsetx, offsety, totalw, totalh);
        }
        //绘制四个角
        //左上角
        offsetx = 2;
        offsety = 2;
        curx = startx - offsetx;
        cury = starty - offsety;
        g.drawImage(triangleOutside, curx, cury, Graphics.LEFT | Graphics.TOP);
        //右上角
        offsetx = triangleOutside.getWidth() - 2;
        offsety = 2;
        curx = startx + WIDTH_FRAME - offsetx;
        cury = starty - offsety;
        Util.drawRegion(g, triangleOutside, 0, 0, triangleOutside.getWidth(), triangleOutside.getHeight(), 
                Sprite.TRANS_ROT90, curx, cury, Graphics.LEFT | Graphics.TOP);
        //左下角
        offsetx = 2;
        offsety = triangleOutside.getHeight() - 2;
        curx = startx - offsetx;
        cury = starty + HEIGHT_FRAME - offsety;
        Util.drawRegion(g, triangleOutside, 0, 0, triangleOutside.getWidth(), triangleOutside.getHeight(), 
                Sprite.TRANS_ROT270, curx, cury, Graphics.LEFT | Graphics.TOP);
        //右下角
        offsetx = triangleOutside.getWidth() - 2;
        offsety = triangleOutside.getHeight() - 2;
        curx = startx + WIDTH_FRAME - offsetx;
        cury = starty + HEIGHT_FRAME - offsety;
        Util.drawRegion(g, triangleOutside, 0, 0, triangleOutside.getWidth(), triangleOutside.getHeight(),
                Sprite.TRANS_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);

        if (curInterface == SUPERSHOP || curInterface == SHOP || curInterface == CHARGE) {
            return;
        }

        //绘制返回框
        offsetx = 302;
        offsety = 216;
        curx = startx + offsetx;
        cury = starty + offsety;
        g.drawImage(retFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
        Util.drawClipImage(g, retAndFireFont, curx + 12, cury + 7, 0, 0, retAndFireFont.getWidth(), retAndFireFont.getHeight() / 3);
    }
    
    //绘制大背景框
    public void drawBigBackGroundFrame(Graphics g, int sx, int sy) {
        int framew = 180;
        int frameh = 200;
        int offsetx = 0;
        int offsety = 0;
        int curx = sx + offsetx;
        int cury = sy + offsety;
        
        g.setColor(0x0);
        g.fillRect(curx, cury, framew, frameh);
        
        int clipx = g.getClipX();
        int clipy = g.getClipY();
        int clipw = g.getClipWidth();
        int cliph = g.getClipHeight();
        
        g.setClip(curx, cury, framew, frameh);
        //绘制上边和下边
        int w = bigBackFrame.getWidth();
        int h = bigBackFrame.getHeight();        
        int num = framew / w + 1;
        for (int i = 0; i < num; i++) {
            g.drawImage(bigBackFrame, curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, bigBackFrame, 0, 0, w, h, Sprite.TRANS_ROT180, 
                    curx, cury + frameh - h, Graphics.LEFT | Graphics.TOP);
            curx += w;
        }
        //绘制左边和右边
        offsetx = 0;
        offsety = 0;
        curx = sx + offsetx;
        cury = sy + offsety;
        num = frameh / w + 1;
        for (int i = 0; i < num; i++) {
            Util.drawRegion(g, bigBackFrame, 0, 0, w, h, Sprite.TRANS_ROT270, 
                    curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, bigBackFrame, 0, 0, w, h, Sprite.TRANS_ROT90, 
                    curx + framew - h, cury, Graphics.LEFT | Graphics.TOP);
            cury += w;
        }
        //绘制边上两条线
        offsetx = 0;
        offsety = 0;
        curx = sx + offsetx;
        cury = sy + offsety;
        g.setColor(0x0);
        g.drawRect(curx, cury, framew - 1, frameh - 1);
        g.setColor(0x4f4d3e);
        g.drawRect(curx + 1, cury + 1, framew - 3, frameh - 3);
        g.setClip(clipx, clipy, clipw, cliph);
    }
    
    //绘制小背景框
    public void drawSmallBackGroundFrame(Graphics g, int sx, int sy) {
        int framew = 132;
        int frameh = 143;
        int startx = sx;
        int starty = sy;
        int offsetx = 0;
        int offsety = 0;
        int curx = startx + offsetx;
        int cury = starty + offsety;

        g.setColor(0x0);
        g.fillRect(curx, cury, framew, frameh);

        int clipx = g.getClipX();
        int clipy = g.getClipY();
        int clipw = g.getClipWidth();
        int cliph = g.getClipHeight();

        g.setClip(curx, cury, framew, frameh);
        //绘制上边和下边
        int w = smallBackFrameUp.getWidth();
        int h = smallBackFrameUp.getHeight();
        int num = framew / w + 1;
        for (int i = 0; i < num; i++) {
            g.drawImage(smallBackFrameUp, curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, smallBackFrameUp, 0, 0, w, h, Sprite.TRANS_ROT180,
                    curx, cury + frameh - h, Graphics.LEFT | Graphics.TOP);
            curx += w;
        }
        //绘制左边和右边
        offsetx = 0;
        offsety = 0;
        curx = startx + offsetx;
        cury = starty + offsety;
        w = smallBackFrameLeft.getWidth();
        h = smallBackFrameLeft.getHeight();
        num = frameh / h + 1;
        for (int i = 0; i < num; i++) {
            g.drawImage(smallBackFrameLeft, curx, cury, Graphics.LEFT | Graphics.TOP);
            Util.drawRegion(g, smallBackFrameLeft, 0, 0, w, h, Sprite.TRANS_MIRROR,
                    curx + framew - w, cury, Graphics.LEFT | Graphics.TOP);
            cury += h;
        }
        //绘制边上两条线
        offsetx = 0;
        offsety = 0;
        curx = startx + offsetx;
        cury = starty + offsety;
        g.setColor(0x0);
        g.drawRect(curx, cury, framew - 1, frameh - 1);
        g.setColor(0x4f4d3e);
        g.drawRect(curx + 1, cury + 1, framew - 3, frameh - 3);
        
        g.setClip(clipx, clipy, clipw, cliph);
    }

    //成就获得效果计时器
    int drawEffortCount = 0;
    //成就框边龙
    PaintUnit effortFrameDragon;
    Image imgEffortFrameBack;
    Image imgEffortNameBack;
    Image imgEffortName;
    Image imgEffortNameLight;
    Image imgEffortNameBig;

    void loadEffortImages() {
        short EFFORT_IMG_ID = (short)270;
        imgEffortFrameBack = imgMgr.getImage(EFFORT_IMG_ID++);
        imgEffortNameBack = imgMgr.getImage(EFFORT_IMG_ID++);
        imgEffortName = imgMgr.getImage(EFFORT_IMG_ID++);
        imgEffortNameLight = imgMgr.getImage(EFFORT_IMG_ID++);
        imgEffortNameBig = imgMgr.getImage(EFFORT_IMG_ID++);
        effortFrameDragon = new PaintUnit();
        AnimationManager.getInstance().getAnimation((short)128, effortFrameDragon);
        effortFrameDragon.initFrame();
    }

    /**
     * 绘制成就获得
     */
    void drawEffortName(Graphics g) {
        if (dlg.isAvailable()) {
            return;
        }
        if (effortDrawName == null) {
            return;
        }
        if (curEffortIndex >= effortDrawName.length) {
            effortAwardStr = null;
            effortDrawName = null;
            //#if UPDATA == 1
//#             GameContext.page.dlg.showMessageBox("获得成就点数&可以在{系统菜单}中进行{积分上传}");
            //#endif
            return;
        }
        boolean isOver = isDrawEffortOver(g, effortDrawName[curEffortIndex].toCharArray());
        drawEffortCount++;
        if (!isOver) {
            return;
        }
        drawEffortCount = 0;
        if (effortAwardStr[curEffortIndex] != null) {
            GameContext.page.dlg.showMessageBox(effortAwardStr[curEffortIndex]);
        }
        curEffortIndex++;
    }

    private boolean isDrawEffortOver(Graphics g, char[] showName) {
        if (drawEffortCount == 1) {
            MusicPlayer.getInstance().playSound(SoundConst.SHIELD);
            setVibration();
        }
        final int[] FRAME_Y = {-64, 64, 62, 64};
        final int BACK_OFFY = Dialog.imgLaceUp.getHeight();
        final int BACK_BOTTOM_OFFY = Dialog.imgLaceBottom.getHeight();
        final int FRAME_W = (imgEffortFrameBack.getWidth() + 4) << 1;
        final int FRAME_H = imgEffortFrameBack.getHeight() + BACK_OFFY + BACK_BOTTOM_OFFY;
        final int FRAME_X = (SCREEN_WIDTH - FRAME_W) >> 1;
        final int frameY = (drawEffortCount < FRAME_Y.length) ? FRAME_Y[drawEffortCount] : FRAME_Y[FRAME_Y.length - 1];
        Dialog.drawBoxFrameNew(g, FRAME_X, frameY, FRAME_W, FRAME_H);
        g.drawImage(imgEffortFrameBack, SCREEN_WIDTH >> 1, frameY + BACK_OFFY, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, imgEffortFrameBack, 0, 0, imgEffortFrameBack.getWidth(), imgEffortFrameBack.getHeight(), Sprite.TRANS_MIRROR, SCREEN_WIDTH >> 1, frameY + BACK_OFFY, 0);
        final int DRAGON_OFFY = 85;
        effortFrameDragon.ani.drawFrame(g, 0, 0, FRAME_X, frameY + DRAGON_OFFY, effortFrameDragon);
        effortFrameDragon.ani.drawFrame(g, 1, 0, FRAME_X + FRAME_W, frameY + DRAGON_OFFY, effortFrameDragon);

        final int NAME_BOTTOM_Y = frameY + 49;
        if (drawEffortCount < 2) {
            return false;
        }
        else if (drawEffortCount == 2) {
            g.drawImage(imgEffortNameBig, SCREEN_WIDTH >> 1, NAME_BOTTOM_Y, Graphics.HCENTER | Graphics.BOTTOM);
            return false;
        }
        g.drawImage(imgEffortName, SCREEN_WIDTH >> 1, NAME_BOTTOM_Y, Graphics.HCENTER | Graphics.BOTTOM);

        if (drawEffortCount == 4) {
            g.drawImage(imgEffortNameLight, SCREEN_WIDTH >> 1, NAME_BOTTOM_Y - 3, Graphics.HCENTER | Graphics.BOTTOM);
        }

        if (drawEffortCount >= 7) {
            final int NAME_BACK_Y = frameY + 55;
            final int NAME_BACK_H = imgEffortNameBack.getHeight();
            g.drawImage(imgEffortNameBack, SCREEN_WIDTH >> 1, NAME_BACK_Y, Graphics.RIGHT | Graphics.TOP);
            Util.drawRegion(g, imgEffortNameBack, 0, 0, imgEffortNameBack.getWidth(), NAME_BACK_H, Sprite.TRANS_MIRROR, SCREEN_WIDTH >> 1, NAME_BACK_Y, 0);
            g.setColor(0xffe14a);
            final int NAME_Y = NAME_BACK_Y + ((NAME_BACK_H - FishFont.FONT_HEIGHT) >> 1);
            font.drawChars(g, showName, SCREEN_WIDTH >> 1, NAME_Y, Graphics.HCENTER | Graphics.TOP);
        }

        g.setColor(0xffffff);
        if (drawEffortCount >= 4 && drawEffortCount <= 8) {
            int lineIndex = drawEffortCount - 4;
            final int[] LINE_X = {FRAME_X + 4, FRAME_X + 4, FRAME_X + 4, 0, 0};
            final int[] LINE_Y = {frameY + 69, frameY + 64, frameY + 54, frameY + 63, frameY + 70};
            final int[] LINE_H = {1, 11, 31, 16, 3};
            final int LINE_W = SCREEN_WIDTH - (LINE_X[lineIndex] << 1);
            g.fillRect(LINE_X[lineIndex], LINE_Y[lineIndex], LINE_W, LINE_H[lineIndex]);
        }

        if (drawEffortCount < 20) {
            return false;
        }
        return true;
    }
    
    void drawGameTip(Graphics g) {
        
    }
    
    void updateMenu() {
        if (GameContext.itemScript != null) {
            GameContext.itemScript.execute();
            if (GameContext.itemScript.isEnd()) {
                GameContext.itemScript = null;
            }
        }
        switch (curInterface) {
            case MAP:
                updateMapTab();
                break;
            case ACHIEVE:
                if (achieveType == EffortManager.EFFECT_TYPE_STATISTICS) {
                    achieveStatisticsStr[EffortManager.GAME_TIME_CODE_INDEX] = EffortManager.getInstance().updataGameTimeCodeStr();
                }
                break;
            case GAMEMENU:
                if (curGameMenuTab == SYS_MENU_HELP) {
                    updateHelpInterface();
                }
                break;
            case ENCHANT:
                if (isPlayerEnchantAnimal && enchantPlayCount == 2) {
                    doEnchantOk();
                }
                break;
            case FORMULA:
                if (isShowProduceGoods) {
                    if (!dlg.isAvailable()) {
                        doFormulaOver();
                    }
                    return;
                }
                if (!isShowSucceedStoveAnimal) {
                    return;
                }
                if (!stove.isEndAnimation()) {
                    stove.playNextFrame();
                    return;
                }
                if (stove.actId == 1) {
                    stove.actId = 3;
                    stove.initFrame();
                    return;
                }
                doFormulaOk();
                break;
            case ARTIFICE:
                if (artificeState == ARTIFICE_STATE_GET_ITEM && !dlg.isAvailable()) {
                    doGetArtificeItem();
                    stove.actId = 0;
                    stove.resetFrame();
                }
//                else if(artificeState == ARTIFICE_STATE_UPDATA_FIRE && !dlg.isAvailable())  {
//                    doArtificeUpdateFire();
//                }
                break;
        }
    }

    //开始炼制，从背包里减掉需要的材料
    private void doFormulaFire() {
        isShowSucceedStoveAnimal = true;
        stove.actId = 1;
        stove.initFrame();
        for (int index = 0; index < formulaNeedItemId.length; index++) {
            GameContext.actor.removeItem((short)formulaNeedItemId[index], formulaNeedItemCount[index]);
            formulaHaveItemCount[index] -= formulaNeedItemCount[index];
        }
    }

    //炼制成功
    private void doFormulaOk() {
        int formulaId = curItem.getId();
        if (formulaId - MyItem.FORMULA_START_ID < isSuccessFormula.length) {
            isSuccessFormula[formulaId - MyItem.FORMULA_START_ID] = true;
        }
        isShowSucceedStoveAnimal = false;
        isShowProduceGoods = true;
        stove.actId = 0;
        stove.initFrame();
        GameContext.actor.addItem(createItem);
        GameContext.actor.removeItem(curItem);
        StringBuffer buf = new StringBuffer();
        buf.append(createItem.getName()).append("炼制成功");
        dlg.showMessageBox(buf.toString());
    }

    //炼制结束，自动返回背包界面
    private void doFormulaOver() {
        curInterface = oldInterface;
        oldInterface = SYSMENU;
        createItem = null;
        formulaDec = null;
        formulaNeedItemId = null;
        formulaNeedItemCount = null;
        formulaHaveItemCount = null;
        initGoodsInterface();
        int rows = curArmorItems.length / ARMOR_COLS;
        if (rows * ARMOR_COLS < curArmorItems.length) {
            rows++;
        }
        armorStartRow = rows - ARMOR_ROWS;
        armorStartRow = (armorStartRow < 0) ? 0 : armorStartRow;

        int successCnt = 0;
        for (int index = 0; index < FORMULA_CNT; index++) {
            if (isSuccessFormula[index]) {
                successCnt++;
            }
        }
        GameContext.setVar(EffortManager.EFFORT_FORMULA_SUCCESS, successCnt);
    }
    //是否合成出配方
    final int FORMULA_CNT = 5;
    boolean[] isSuccessFormula = new boolean[FORMULA_CNT];

    //开始炼化
    private void doStartArtifice() {
        MusicPlayer.getInstance().playSound(SoundConst.ARTIFICE);
        artificeState = ARTIFICE_STATE_CREATE_PLAY;
        artificeCount = 0;
        stove.actId = 1;
        stove.initFrame();
        int unitIndex = (artificeFireLv == 0) ? 0 : 1;
        fireArtifice[unitIndex].actId = 0;
        fireArtifice[unitIndex].initFrame();
        GameContext.actor.loseMoney(ARTIFICE_MONEY[artificeFireLv]);

        if (isArtificeTeach) {
            artificeGetItemIndex = ARTIFICE_TEACH_ITEM_INDEX[artificeTeachIndex];
        }
        else {
            artificeGetItemIndex = ARTIFICE_ITEM_ID.length - 1;
            int rand = GameContext.getRand(0, 10000) % 100;
            int[] successPro = ARIFICE_SUCCESS_PRO[artificeFireLv];
            for (int index = 0; index < successPro.length; index++) {
                if (rand < successPro[index]) {
                    artificeGetItemIndex = index;
                    break;
                }
            }
        }
        artificeGetGarbage = artificeGetItemIndex == ARTIFICE_ITEM_ID.length - 1;
        artificeGetItemLv = 0;
        if (artificeGetItemIndex >= ARTIFICE_ITEM_ID.length) {
            artificeGetItemIndex -= ARTIFICE_ITEM_ID.length;
            artificeGetItemLv = 1;
        }
        int itemId = ARTIFICE_ITEM_ID[artificeGetItemIndex];
        artificeGetItem = new MyItem((short)itemId);
    }

    //炼制结束，获得物品
    private void doGetArtificeItem() {
        if (!artificeGetGarbage && !enchantFirst.isEndAnimation()) {
            enchantFirst.playNextFrame();
            return;
        }
        artificeState = ARTIFICE_STATE_WAIT_KEY;
        artificeCount = 0;
        if (artificeGetGarbage) {
            GameContext.actor.addItem(artificeGetItem);
            dlg.showMessageBox("炼制失败，获得垃圾，已放入背包");
            return;
        }
        StringBuffer buf = new StringBuffer("炼制成功，");
        buf.append("获得").append(artificeGetItem.getName()).append("，已放入锦盒。");
        dlg.showMessageBox(buf.toString());
        if ((curStoneItem[artificeGetItemIndex] != null) && (curStoneItem[artificeGetItemIndex].lv == 30)) {
            StringBuffer buff = new StringBuffer(artificeGetItem.getName().toString());
            buff.append("已达到满级。");
            dlg.showMessageBox(buff.toString());
            curStoneItem[artificeGetItemIndex].use();
            artificeGetItem = null;
            return;
        }
        int stoneExp = artificeGetItem.getAttrValue(MyItem.晶石经验, artificeGetItemLv);
        GameContext.actor.stoneExp[artificeGetItemIndex] += stoneExp;
        if (curStoneItem[artificeGetItemIndex] == null) {
            GameContext.actor.addItem(artificeGetItem);
            curStoneItem[artificeGetItemIndex] = GameContext.actor.getItemFromActorBag(artificeGetItem.getId());
            GameContext.addVar(EffortManager.EFFORT_HAVE_STONE_TYPE, 1);
        }
        else {
            stoneExp = artificeGetItem.getAttrValue(MyItem.晶石经验, curStoneItem[artificeGetItemIndex].lv + 1);
            if (GameContext.actor.stoneExp[artificeGetItemIndex] >= stoneExp) {
                curStoneItem[artificeGetItemIndex].lv++;
                if (curStoneItem[artificeGetItemIndex].lv == 29) {
                    GameContext.addVar(EffortManager.EFFORT_STONE_ARTIFICE_20, 1);
                }
                else if (curStoneItem[artificeGetItemIndex].lv == 19) {
                    GameContext.addVar(EffortManager.EFFORT_STONE_ARTIFICE_30, 1);
                }
            }
        }
        curStoneItem[artificeGetItemIndex].use();
        artificeGetItem = null;
    }

    //升级火焰
    private void doArtificeUpdateFire() {
        artificeFireMaxLv = 0;
        artificeState = ARTIFICE_STATE_WAIT_KEY;
        artificeCount = 0;
        if (isArtificeTeach) {
            if (artificeTeachIndex < 2) {
                artificeFireMaxLv = artificeFireLv + 1;
            }
        } else {
            int rand = GameContext.getRand(0, 10000) & 100;
            if (artificeFireMaxLv < FIRE_NAME.length - 1 && rand < 50) {
                artificeFireMaxLv = artificeFireLv + 1;
            }
        }
    }
    
    //处理菜单按键
    void doMenuKey(int keyCode) {
        switch(curInterface)
        {
            case MAP:
                mapInterfaceKeyPressed(keyCode);
                break;
            case MISSION:
                missionInterfaceKeyPressed(keyCode);
                break;
            case ACHIEVE:
                achieveInterfaceKeyPressed(keyCode);
                break;
            case GAMEMENU:
                gameMenuInterfaceKeyPressed(keyCode);
                break;
            case SYSMENU:
                systemMenuInterfaceKeyPressed(keyCode);
                break;
            case SUPERSHOP:
            case SHOP:
                shopInterfaceKeyPressed(keyCode);
                break;
            case ENCHANT:
                enchantInterfaceKeyPressed(keyCode);
                break;
            case FORMULA:
                formulaInterfaceKeyPressed(keyCode);
                break;
            case ARTIFICE:
                artificeInterfaceKeyPressed(keyCode);
                break;
            case GOODS:
                goodsInterfaceKeyPressed(keyCode);
                break;
        }
    }

    private void doMenuPoint(int px, int py) {
        switch (curInterface) {
            case ATTRI:
                attributeInterfacePointer(px, py);
                break;
            case ENCHANT:
                enchantInterfacePointer(px, py);
                break;
            case ACHIEVE:
                achieveInterfacePointer(px, py);
                break;
            case ARTIFICE:
                artificeInterfacePointer(px, py);
                break;
            case FORMULA:
                formulaInterfacePointer(px, py);
                break;
            case MISSION:
                missionInterfacePointer(px, py);
                break;
            case SUPERSHOP:
            case SHOP:
                shopInterfacePointer(px, py);
                break;
            case GOODS:
                goodsInterfacePointer(px, py);
                break;
            case SYSMENU:
                systemMenuInterfacePointer(px, py);
                break;
            case GAMEMENU:
                gameMenuInterfacePointer(px, py);
                break;
            case CHARGE:
                chargeInterfacePointer(px, py);
                break;
            case MAP:
                mapInterfacePointer(px, py);
                break;
        }
    }
    
    void doTabSwitch() {
        
    }
    
    void doTabEnter() {
        showDec = false;
        oldInterface = SYSMENU;
        switch(curInterface)
        {
            case ATTRI:
                attriIndex = 0;
                selectFrameAnimal.actId = 1;
                selectFrameAnimal.initFrame();
                enchantWeapon = new MyItem[GameContext.actor.EQUIP_WEAPON_COUNT];
                for (int index = 0; index < enchantWeapon.length; index++) {
                    enchantWeapon[index] = GameContext.actor.getItemFromActorBag((short) (MyItem.WEAPON_START_ID + index));
                }
                break;
            case ENCHANT:
                if (!teachOverEnchant) {
                    dlg.showMessageBox("强化功能还未开启。");
                    curInterface = SYSMENU;
                    oldInterface = -1;
                    return;
                }
                initEnchantInterface();
                break;
            case ARTIFICE:
                if (!teachOverArtifice) {
                    dlg.showMessageBox("炼化功能还未开启。");
                    curInterface = SYSMENU;
                    oldInterface = -1;
                    return;
                }
                stove.actId = 0;
                stove.initFrame();
                artificeState = ARTIFICE_STATE_NONE;
                artificeCount = 0;
//                artificeFireMaxLv = 0;
                curStoneItem = new MyItem[STONE_ID.length];
                for (int index = 0; index < STONE_ID.length; index++) {
                    curStoneItem[index] = GameContext.actor.getItemFromActorBag((short) STONE_ID[index]);
                }
                break;
            case GOODS:
                initGoodsInterface();
                armorStartRow = 0;
                armorCurRow = 0;
                armorCurCol = 0;
                break;
            case MAP:
                keyMgr.resetKey();
                keyMgr.resetKeyIm();
                updateMiniMapOffset(GameContext.map.id);
                curMissionMapId = MissionManager.getInstance().getMainMissionMapID();
                curSubMissionMapId = MissionManager.getInstance().getSubMissionMapId();
                break;
            case MISSION:
                mainMission = MissionManager.getInstance().getCurMainMission();
                subMissionList = MissionManager.getInstance().getSubMissions();
                subMissionStartIndex = -1;
                if (subMissionList[0] == null || subMissionList.length == 0) {
                    return;
                }
                for (int index = 0; index < subMissionList.length; index++) {
                    if ((subMissionList[index].getMissionState() == Mission.STATE_ACCEPT) || (subMissionList[index].getMissionState() == Mission.STATE_FINISH)) {
                        subMissionStartIndex = index;
                        break;
                    }
                }
                subMissionStartIndex = (subMissionStartIndex == -1) ? subMissionList.length - SUB_MISSION_SHOW_CNT : subMissionStartIndex;
                subMissionSelectIndex = subMissionStartIndex;
                break;
            case ACHIEVE:
                achieveType = EffortManager.EFFECT_TYPE_OFFICIAL;
                achieveData = EffortManager.getInstance().getCurSelectEffortArray(achieveType);
                achieveStartIndex = 0;
                achieveSelectIndex = 0;
                achieveStatisticsStr = EffortManager.getInstance().getCodeStr();
                break;
            case GAMEMENU:
                keyMgr.resetKey();
                keyMgr.resetKeyIm();
                gameMenuIndex = 0;
                gameMenuPointer = false;
                curGameMenuTab = SYS_MENU_LIST;
                break;
            case SUPERSHOP:
            case SHOP:
                selectFrameAnimal.actId = 0;
                selectFrameAnimal.initFrame();
                buyItemId = null;
                itemDec = null;
                armorStartRow = 0;
                armorCurRow = 0;
                armorCurCol = 0;
                break;
        }
    }

    //背包界面数据
    MyItem[] curArmorItems;
    final int ARMOR_COLS = 5;
    final int ARMOR_ROWS = 3;
    int armorStartRow;
    int armorCurRow;
    int armorCurCol;
    Image imgItemEquip;
    int goodItemCenterX;
    int goodItemCenterY;

    //商店物品
    short[] buyItemId;
    boolean isNotResumeScript;
    //商店摆放的行列
    final int STORE_SUPER_ROWS = 2;
    //计费
    boolean isBuySmsItem;
    
    void showSuperStore(short items[]) {
        showMenu = true;
        curInterface = SUPERSHOP;
        doTabEnter();
        buyItemId = items;
    }

    void showStore(short items[]) {
        showMenu = true;
        curInterface = SHOP;
        doTabEnter();
        buyItemId = items;
    }

    /**
     * 初始化计费点的描述
     */
    private void prepareSmsDec() {
        ShowSmsDec = true;
        final int SMS_STR_INDEX = 85;
        char[] chs = strMgr.getString((short) (SMS_STR_INDEX + armorCurCol));
        String[] dec = Util.getString(new String(chs), '|');
        StringBuffer buf = new StringBuffer();
        buf.append("{0xfff29f").append(dec[0]).append("}|");
        buf.append(dec[1]);
        itemDec = buf.toString().toCharArray();
        if (itemDec == null) {
            return;
        }
        initShowDec();
        isBuySmsItem = true;
    }

    /**
     * 初始化购买物品的描述
     */
    private void prepareBuyItemDec() {
        int itemId = buyItemId[armorCurRow * ARMOR_COLS + armorCurCol];
//        Item item = GameContext.getItem((short)itemId);
        MyItem item = new MyItem((short)itemId);
        prepareItemDec(item);
        isBuySmsItem = false;
    }


    //物品描述
    char[] itemDec;
    //物品价格
    int itemPrice;
    //初始化物品描述
    private void prepareItemDec(MyItem item) {
        if (item == null) {
            return;
        }
        String titleColor = "0xfff29f";
        StringBuffer buf = new StringBuffer();
        int type = item.item.type;
        itemPrice = item.getPrice();
        buf.append("{").append(titleColor).append("名称：}").append(item.getName()).append("|");
        buf.append("{").append(titleColor).append("类型：}").append(Item.getItemTypeName(type)).append("|");
        if (type == Item.WEAPON || type == Item.ARMOR) {
            buf.append("{").append(titleColor).append("等级：}").append(item.lv + 1).append("|");
        }
        if (type != Item.WEAPON) {
            itemPrice = curInterface == SUPERSHOP ? (itemPrice + 300) : itemPrice;//如果是超级商店
            buf.append("{").append(titleColor).append("价格：}").append(itemPrice).append("|");
        }
        char[] effect = item.getEffectsDescription();
        if (effect != null && effect.length != 0) {
            buf.append("{").append(titleColor).append("效果：}|").append(effect);
        }
        if (type == Item.FORMULA) {
            buf.append("|");
        }
        if (item.canEquip()) {
            int lvLimit = item.item.extra[Item.EXTRA_TYPE_EQUIP_LV_LIMIT];
            if (lvLimit != 0) {
                buf.append("{").append(titleColor).append("等级限制：}").append(lvLimit).append("|");
            }
        }
        buf.append("{").append(titleColor).append("描述：}|").append(item.item.desc).append("|");
        itemDec = buf.toString().toCharArray();
        if (itemDec == null) {
            return;
        }
        initShowDec();
    }

    private void superShopKeyFire() {
        if (isBuySmsItem) {
            doEnterSms();
        }
        else {
            int itemId = buyItemId[armorCurRow * ARMOR_COLS + armorCurCol];
            MyItem item = new MyItem((short)itemId);
            if (item.canOverPosition()) {
                int max = GameContext.actor.getMoney() / itemPrice;
                max = max > 10 ? 10 : max;
                initChangeTradingCountOP(1, max, false);
                return;
            }
            tradingCount = 1;
            dlg.btnBoxOp = Dialog.BUY_ITEM_OP;
            StringBuffer buf = new StringBuffer();
            buf.append("买入该物品需花费金钱").append(itemPrice).append("，是否确定购买？");
            dlg.showButtonBox(buf.toString().toCharArray());
//          doBuyItem();
        }
    }

    /**
     * 进入短代计费
     */
    private void doEnterSms() {
        if (sms != null) {
            sms.isShowing();
            sms.doListFire(armorCurCol);
        }
    }

    public void showNotEnoughMoney(String str) {
        StringBuffer buf = new StringBuffer("金钱不足");
        if (!str.equals("")) {
            buf.append("，");
        }
        buf.append(str);
        //#if SMS == 1
        if (!Sms.allStory) {
            MusicPlayer.getInstance().playSound(SoundConst.ERROR);
            dlg.showMessageBox(buf.toString());
        }
        else {
            dlg.btnBoxOp = Dialog.BUY_MONEY_OP;
            buf.append("，是否购买金币？");
            dlg.showButtonBox(buf.toString().toCharArray());
        }
        //#else
//#         dlg.showMessageBox(buf.toString());
        //#endif
    }

    /**
     * 购买物品
     */
    private void doBuyItem() {
        if (GameContext.actor.getMoney() < itemPrice * tradingCount) {
             showNotEnoughMoney("无法购买");
            isNotResumeScript = true;
            return;
        }
        MusicPlayer.getInstance().playSound(SoundConst.SYSCHOOSE);
        int itemId = buyItemId[armorCurRow * ARMOR_COLS + armorCurCol];
        MyItem item = new MyItem((short) itemId);
        GameContext.actor.addItem(item, tradingCount);
        GameContext.actor.loseMoney(itemPrice * tradingCount);
        StringBuffer buf = new StringBuffer();
        buf.append("购买成功，获得").append(tradingCount).append("个{").append(item.item.name).append("}");
        dlg.showMessageBox(buf.toString());
        isNotResumeScript = true;
    }


    //是否显示具体信息
    boolean showDec;
    boolean ShowSmsDec;
    //显示信息偏移值
    int showDecY;
    //显示信息是否可以滚动
    boolean showDecScroll;
    //显示信息的文字高度和框高
    int showDecTxtH;
    int showDecFrameH;
    //初始化数据
    private void initShowDec() {
        showDec = true;
        showDecScroll = false;
        showDecY = 0;
        showDecTxtH = 0;
        showDecFrameH = 0;
    }
    //按键逻辑
    private void doShowDecKeyPressed(int keyCode) {
        if (!showDec) {
            return;
        }
        switch(keyCode)
        {
            case Keys.KEY_RIGHT_SOFT:
                showDec = false;
                break;
            case Keys.KEY_UP:
            case Keys.KEY_NUM2:
                showDecY -= FishFont.LINE_HEIGHT >> 1;
                showDecY = (showDecY < 0) ? 0 : showDecY;
                break;
            case Keys.KEY_DOWN:
            case Keys.KEY_NUM8:
                showDecY += FishFont.LINE_HEIGHT >> 1;
                showDecY = (showDecY > showDecTxtH - showDecFrameH) ? showDecTxtH - showDecFrameH : showDecY;
                break;
        }
    }

    //任务界面数据
    Mission mainMission;
    Mission[] subMissionList;
    int subMissionStartIndex;
    int subMissionSelectIndex;
    final int SUB_MISSION_SHOW_CNT = 2;
    //任务描述
    char[] missionDec;

    //准备任务描述
    void prepareMissionDec(Mission m) {
        StringBuffer buf = new StringBuffer();
        buf.append("{0xffffff").append("任务描述").append("|");
        buf.append(m.desc).append("}|");
        char[] varDec = m.getMissionVarDec();
        if (varDec != null) {
            buf.append("{0xfff29f").append(varDec).append("}");
        }
        buf.append("|");
        char[] awardDec = m.getMissionAwardDec();
        if (awardDec != null) {
            buf.append("{0xffffff").append("任务奖励").append("}|");
            buf.append("{0xfff29f").append(awardDec).append("}");
        }
        missionDec = buf.toString().toCharArray();
        if (missionDec == null) {
            return;
        }
        initShowDec();
    }

    //小地图相关数据
    char[][] mapNames;
    short[] mapIds;
    short mapXs[];
    short mapYs[];
    int mapBlockWidth;
    int mapBlockHeight;
    //地图偏移
    int mapOffsetX;
    int mapOffsetY;
    int miniMapWidth;
    int miniMapHeight;
    short mapRelationSrcs[];
    short mapRelationDsts[];
    byte mapRelationLines[];
    int[] curMissionMapId;
    int[][] curSubMissionMapId;

    Image imgMapIconActor;
    Image imgMapIconMainM;
    Image imgMapIconSubM;

    final public void loadMiniMap() {
        short MAP_ICON = 265;
        imgMapIconSubM = imgMgr.getImage(MAP_ICON++);
        imgMapIconActor = imgMgr.getImage(MAP_ICON++);
        imgMapIconMainM = imgMgr.getImage(MAP_ICON++);

        try {
            DataInputStream dataIn = Util.open("/minimap");
            mapBlockWidth = dataIn.readByte();
            mapBlockHeight = dataIn.readByte();

            int mapCnt = dataIn.readShort();
            mapIds = new short[mapCnt];
            mapXs = new short[mapCnt];
            mapYs = new short[mapCnt];
            mapNames = new char[mapCnt][];
            for (int i = 0; i < mapCnt; i++) {
                mapIds[i] = dataIn.readShort();
                short x = dataIn.readShort();
                short y = dataIn.readShort();
                mapNames[i] = dataIn.readUTF().toCharArray();
                mapXs[i] = x;
                mapYs[i] = y;
                if (miniMapWidth < x) {
                    miniMapWidth = x;
                }
                if (miniMapHeight < y) {
                    miniMapHeight = y;
                }
            }

            //添加一点边界空白
            miniMapWidth += 20;
            miniMapHeight += 20;
            int relationCnt = dataIn.readShort();
            mapRelationSrcs = new short[relationCnt];
            mapRelationDsts = new short[relationCnt];
            mapRelationLines = new byte[relationCnt];
            for (int i = 0; i < relationCnt; i++) {
                mapRelationSrcs[i] = dataIn.readShort();
                mapRelationDsts[i] = dataIn.readShort();
                mapRelationLines[i] = dataIn.readByte();
            }
            try {
                dataIn.close();
            }
            catch (Exception e) {
            }
        }
        catch (Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    final private void drawMiniMap(Graphics g, int MAP_LEFT_X, int MAP_TOP_Y, int MAP_W, int MAP_H) {
        g.setClip(MAP_LEFT_X, MAP_TOP_Y, MAP_W, MAP_H);
        g.setColor(0x686949);
        int x1 = 0;
        int x2 = 0;
        int y1 = 0;
        int y2 = 0;

        //先绘制关系
        for (int i = 0, size = mapRelationSrcs.length; i < size; i++) {
            int srcId = mapRelationSrcs[i];
            int dstId = mapRelationDsts[i];
            x1 = mapXs[srcId] - mapOffsetX + MAP_LEFT_X;
            y1 = mapYs[srcId] - mapOffsetY + MAP_TOP_Y;
            x2 = mapXs[dstId] - mapOffsetX + MAP_LEFT_X;
            y2 = mapYs[dstId] - mapOffsetY + MAP_TOP_Y;

            switch (mapRelationLines[i]) {
                case 0:
                    g.drawLine(x1, y1, x2, y2);
                    break;

                case 1:
                    if (y1 < y2) {
                        g.drawLine(x1, y1, x2, y1);
                        g.drawLine(x2, y1, x2, y2);
                        break;
                    }
                    g.drawLine(x1, y1, x1, y2);
                    g.drawLine(x1, y2, x2, y2);
                    break;

                case 2:
                    if (y1 < y2) {
                        g.drawLine(x1, y1, x1, y2);
                        g.drawLine(x1, y2, x2, y2);
                        break;
                    }

                    g.drawLine(x1, y1, x2, y1);
                    g.drawLine(x2, y1, x2, y2);
                    break;
            }
        }

        final int BLOCK_WIDTH = mapBlockWidth;
        final int BLOCK_HEIGHT = mapBlockHeight;
        final int HALF_WIDTH = BLOCK_WIDTH >> 1;
        final int HALF_HEIGHT = BLOCK_HEIGHT >> 1;
        int curMapId = GameContext.map.id;
        //再绘制各个块
        int x = 0;
        int y = 0;
        int leftX = 0;
        int topY = 0;
        int rightX = 0;
        int bottomY = 0;
        char[] name = null;
        int txtWidth = 0;
        for (int i = 0, size = mapIds.length; i < size; i++) {
            int id = mapIds[i];
            x = mapXs[i] - HALF_WIDTH;
            y = mapYs[i] - HALF_HEIGHT;
            leftX = x - mapOffsetX;
            topY = y - mapOffsetY;
            rightX = leftX + BLOCK_WIDTH;
            bottomY = topY + BLOCK_HEIGHT;
            if (leftX > SCREEN_WIDTH || topY > SCREEN_HEIGHT || rightX < 0 || bottomY < 0) {
                continue;
            }
            g.setColor(0x25213d);
            leftX += MAP_LEFT_X;
            topY += MAP_TOP_Y;
            g.fillRect(leftX, topY, BLOCK_WIDTH, BLOCK_HEIGHT);
            g.setColor(0x686949);
            g.drawRect(leftX, topY, BLOCK_WIDTH, BLOCK_HEIGHT);
            g.setColor(0xcdd202);
            name = mapNames[i];
            if (name.length <= 4) {
                txtWidth = font.charsWidth(name);
                font.drawChars(g, name, leftX + ((BLOCK_WIDTH - txtWidth) >> 1) + 1, topY + 8);
            }
            else {
                int nameCenterIndex = name.length >> 1;
                txtWidth = font.charsWidth(name, 0, nameCenterIndex);
                font.drawChars(g, name, 0, nameCenterIndex, leftX + ((BLOCK_WIDTH - txtWidth) >> 1) + 1, topY);
                txtWidth = font.charsWidth(name, nameCenterIndex, name.length - nameCenterIndex);
                font.drawChars(g, name, nameCenterIndex, name.length - nameCenterIndex, leftX + ((BLOCK_WIDTH - txtWidth) >> 1) + 1, topY + FishFont.FONT_HEIGHT);
            }

            int iconX = leftX + BLOCK_WIDTH - 4;
            if (id == curMapId) {
                g.drawImage(imgMapIconActor, iconX, topY + BLOCK_HEIGHT - 10, Graphics.HCENTER | Graphics.VCENTER);
                iconX -= 20;
            }
            if (curMissionMapId != null && curMissionMapId.length != 0) {
                for (int index = 0; index < curMissionMapId.length; index++) {
                    if (curMissionMapId[index] == id) {
                        g.drawImage(imgMapIconMainM, iconX, topY + BLOCK_HEIGHT - 10, Graphics.HCENTER | Graphics.VCENTER);
                        iconX -= 9;
                    }
                }
            }
            if (curSubMissionMapId == null || curSubMissionMapId.length == 0) {
                continue;
            }
            for (int index = 0; index < curSubMissionMapId.length; index++) {
                if (curSubMissionMapId[index] != null && curSubMissionMapId[index].length != 0) {
                    for (int subMapIndex = 0; subMapIndex < curSubMissionMapId[index].length; subMapIndex++) {
                        if (curSubMissionMapId[index][subMapIndex] == id) {
                            g.drawImage(imgMapIconSubM, iconX, topY + BLOCK_HEIGHT - 10, Graphics.HCENTER | Graphics.VCENTER);
                        }
                    }
                }
            }
        }
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        //画图标
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        int SHOW_X = startx + 30;
        int SHOW_Y = starty + 220;
        final int SHOW_DIS = 85;
        g.setColor(0xffffff);
        g.drawImage(imgMapIconActor, SHOW_X, SHOW_Y - 1, 0);
        SHOW_X += imgMapIconActor.getWidth() + 1;
        font.drawChars(g, "玩家位置".toCharArray(), SHOW_X, SHOW_Y);
        SHOW_X += SHOW_DIS;
        g.drawImage(imgMapIconMainM, SHOW_X, SHOW_Y, 0);
        SHOW_X += imgMapIconMainM.getWidth() + 1;
        font.drawChars(g, "主线目标".toCharArray(), SHOW_X, SHOW_Y);
        SHOW_X += SHOW_DIS;
        g.drawImage(imgMapIconSubM, SHOW_X, SHOW_Y, 0);
        SHOW_X += imgMapIconSubM.getWidth() + 1;
        font.drawChars(g, "支线目标".toCharArray(), SHOW_X, SHOW_Y);
    }

    final public void updateMiniMapOffset(int mapId) {
        final int SHOW_MAP_W = 320;
        final int SHOW_MAP_H = 175;
        final int DIS = 80;
        for (int i = 0, size = mapIds.length; i < size; i++) {
            if (mapIds[i] == mapId) {
                mapOffsetX = mapXs[i] - (SHOW_MAP_W >> 1);
                if (mapOffsetX < 0) {
                    mapOffsetX = 0;
                }
                if (mapOffsetX > miniMapWidth - SHOW_MAP_W + DIS) {
                    mapOffsetX = miniMapWidth - SHOW_MAP_W + DIS;
                }
                mapOffsetY = mapYs[i] - (SHOW_MAP_H >> 1);
                if (mapOffsetY < 0) {
                    mapOffsetY = 0;
                }
                if (mapOffsetY > miniMapHeight - SHOW_MAP_H + DIS) {
                    mapOffsetY = miniMapHeight - SHOW_MAP_H + DIS;
                }
                return;
            }
        }
    }

    private void updateHelpInterface() {
        if (keyMgr.isPressed(Keys.MASK_UP) || keyMgr.isPressed(Keys.MASK_NUM2)) {
            if (helpOffsetY > 0) {
                helpOffsetY -= FishFont.LINE_HEIGHT >> 1;
                helpOffsetY = (helpOffsetY < 0) ? 0 : helpOffsetY;
            }
        }
        else if(keyMgr.isPressed(Keys.MASK_DOWN) || keyMgr.isPressed(Keys.MASK_NUM8)) {
            final int TXT_DRAW_W = 300;
            final int TXT_DRAW_H = 172;
            final int TXT_H = font.getCharsHeight(GameContext.helpTxt, TXT_DRAW_W);
            if (helpOffsetY < TXT_H - TXT_DRAW_H) {
                helpOffsetY += FishFont.LINE_HEIGHT >> 1;
                helpOffsetY = (helpOffsetY > TXT_H - TXT_DRAW_H) ? TXT_H - TXT_DRAW_H : helpOffsetY;
            }
        }
    }

    final private void updateMapTab() {
        final int STEP_X = 10;
        final int STEP_Y = 10;
        final int SHOW_MAP_W = 320;
        final int SHOW_MAP_H = 175;
        final int DIS = 80;
        if (keyMgr.isPressed(Keys.MASK_LEFT) || keyMgr.isPressed(Keys.MASK_NUM4)) {
            mapOffsetX -= STEP_X;
            if (mapOffsetX < 0) {
                mapOffsetX = 0;
            }
        }

        if (keyMgr.isPressed(Keys.MASK_RIGHT) || keyMgr.isPressed(Keys.MASK_NUM6)) {
            if (miniMapWidth > SHOW_MAP_W) {
                mapOffsetX += STEP_X;
                if (mapOffsetX > miniMapWidth - SHOW_MAP_W + DIS) {
                    mapOffsetX = miniMapWidth - SHOW_MAP_W + DIS;
                }
            }
        }

        if (keyMgr.isPressed(Keys.MASK_UP) || keyMgr.isPressed(Keys.MASK_NUM2)) {
            mapOffsetY -= STEP_Y;
            if (mapOffsetY < 0) {
                mapOffsetY = 0;
            }
        }

        if (keyMgr.isPressed(Keys.MASK_DOWN) || keyMgr.isPressed(Keys.MASK_NUM8)) {
            if (miniMapHeight > SHOW_MAP_H) {
                mapOffsetY += STEP_Y;
                if (mapOffsetY > miniMapHeight - SHOW_MAP_H + DIS) {
                    mapOffsetY = miniMapHeight - SHOW_MAP_H + DIS;
                }
            }
        }
    }

    //主角状态相关图片
    Image imgState;
    Image imgHpLine;
    Image imgMpLine;
    Image imgExpLine;
    Image imgItemBack;
    Image imgItemNone;
    Image imgGiftTimeNum;
    Image imgLvNum;

    void loadActorStateImages() {
        imgState = imgMgr.getImage((short)250);
        imgHpLine = imgMgr.getImage((short)247);
        imgMpLine = imgMgr.getImage((short)244);
        imgExpLine = imgMgr.getImage((short)260);
        imgItemBack = imgMgr.getImage((short)245);
        imgItemNone = imgMgr.getImage((short)268);
        imgGiftTimeNum = imgMgr.getImage((short)248);
        imgLvNum = imgMgr.getImage((short)264);
    }

    //状态条偏移
    int actorStateOffsetY = 0;

    /**
     * 绘制主角状态
     * @param g
     * @param x
     * @param y
     */
    void drawActorState(Graphics g) {
        if (showMenu) {
            return;
        }

        final int STATE_X = 1;
        int STATE_Y = 0;
        
        int actorX = GameContext.actor.x - GameContext.page.offsetX;
        int actorY = GameContext.actor.y - GameContext.page.offsetY - 30;
        if (observerMode || (actorX <= 300 && actorY <= STATE_Y + imgState.getHeight())) {
            if (actorStateOffsetY < 2) {
                actorStateOffsetY++;
            }
        }
        else {
            if (actorStateOffsetY > 0) {
                actorStateOffsetY--;
            }
        }
        if (actorStateOffsetY > 1) {
            return;
        }
        if (actorStateOffsetY == 1) {
            STATE_Y -= imgState.getHeight() >> 1;
        }
        
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
        final int MP_Y = STATE_Y + 32;
        final int HP_MAX_LEN = imgHpLine.getWidth();
        if (GameContext.actor.hp > 0) {
            int hpLen = GameContext.actor.hp * HP_MAX_LEN / GameContext.actor.maxHp;
            Util.drawClipImage(g, imgHpLine, HP_X, HP_Y, 0, 0, hpLen, imgHpLine.getHeight());
        }
        if (GameContext.actor.mp > 0) {
            int mpLen = GameContext.actor.mp * HP_MAX_LEN / GameContext.actor.maxMp;
            Util.drawClipImage(g, imgMpLine, HP_X, MP_Y, 0, 0, mpLen, imgMpLine.getHeight());
        }

        final int EXP_X = HP_X + 1;
        final int EXP_Y = STATE_Y + 43;
        final int EXP_MAX_LEN = imgExpLine.getWidth();
        if (GameContext.actor.curEx > 0) {
            int expLen = (int) (GameContext.actor.curEx * EXP_MAX_LEN / GameContext.actor.maxEx);
            Util.drawClipImage(g, imgExpLine, EXP_X, EXP_Y, 0, 0, expLen, imgExpLine.getHeight());
        }

        final int ITEM_X = STATE_X + imgState.getWidth() + 2;
        final int ITEM_Y = STATE_Y + 13;
        final int ITEM_RIGHT_X = ITEM_X + imgItemBack.getWidth() + 6;
        final int ITEM_DIS_X = 3;
        final int ITEM_DIS_Y = 4;
        final int ITEM_NUM_OFFX = 41;
        final int ITEM_NUM_OFFY = 31;
        final int ITEM_NUM_W = imgGiftTimeNum.getWidth();
        final int ITEM_NUM_H = imgGiftTimeNum.getHeight() / 11;
        g.drawImage(imgItemBack, ITEM_X, ITEM_Y, 0);
        g.drawImage(imgItemBack, ITEM_RIGHT_X, ITEM_Y, 0);
        g.drawImage(imgItemNone, ITEM_X + ITEM_DIS_X, ITEM_Y + ITEM_DIS_Y, 0);
        g.drawImage(imgItemNone, ITEM_RIGHT_X + ITEM_DIS_X, ITEM_Y + ITEM_DIS_Y, 0);
        if (GameContext.actor.addHPItem != null && GameContext.actor.addHPItem.cnt > 0) {
            GameContext.actor.addHPItem.paintIcon(g, ITEM_X + ITEM_DIS_X, ITEM_Y + ITEM_DIS_Y);
            Util.drawNumbersAlignRight(g, GameContext.actor.addHPItem.cnt, imgGiftTimeNum, ITEM_NUM_W, ITEM_NUM_H, 0, ITEM_X + ITEM_NUM_OFFX, ITEM_Y + ITEM_NUM_OFFY);
        }
        if (GameContext.actor.addMPItem != null && GameContext.actor.addMPItem.cnt > 0) {
            GameContext.actor.addMPItem.paintIcon(g, ITEM_RIGHT_X + ITEM_DIS_X, ITEM_Y + ITEM_DIS_Y);
            Util.drawNumbersAlignRight(g, GameContext.actor.addMPItem.cnt, imgGiftTimeNum, ITEM_NUM_W, ITEM_NUM_H, 0, ITEM_RIGHT_X + ITEM_NUM_OFFX, ITEM_Y + ITEM_NUM_OFFY);
        }
    }

    //游戏菜单图标
    Image imgSysIcon;
    Image imgStoreIcon;
    Image imgGiftIcon;
    Image imgGiftIconAn;

    void loadMenuBtnsImages() {
        imgSysIcon = imgMgr.getImage((short)249);
        imgStoreIcon = imgMgr.getImage((short)246);
        imgGiftIcon = imgMgr.getImage((short)262);
        imgGiftIconAn = imgMgr.getImage((short)263);
    }

    /**
     * 绘制系统菜单图标
     * @param g
     */
    boolean isDrawGameBtns = true;;
    void drawGameBtns(Graphics g) {
        if (showMenu || !isDrawGameBtns) {
            return;
        }
        final int ICON_POINT_W = 52;
        final int ICON_POINT_H = 56;
        Image[] MENU_IMG = {imgSysIcon, imgStoreIcon, imgGiftIcon};
        int iconX = 0;
        int iconY = 0;
        for (int index = 0; index < MENU_IMG.length; index++) {
            Image img = MENU_IMG[index];
            iconX = SCREEN_WIDTH - ICON_POINT_W * (index + 1) + ((ICON_POINT_W - img.getWidth()) >> 1);
            iconY = ((ICON_POINT_H - img.getHeight()) >> 1);
            if (index == MENU_IMG.length - 1 && giftTime > 0) {
                continue;
            }
            if (index == MENU_IMG.length - 1 && !flashGift) {
                continue;
            }
            g.drawImage(img, iconX, iconY, 0);
        }
        if (giftTime == 0) {
            return;
        }
        final int TIME_W = imgGiftTimeNum.getWidth();
        final int TIME_H = imgGiftTimeNum.getHeight() / 11;
        final int TIME_X = iconX + (imgGiftIconAn.getWidth() >> 1) - (TIME_W >> 1);
        final int TIME_Y = iconY + 43;
        g.drawImage(imgGiftIconAn, iconX, iconY, 0);
        int minute = giftTime / 600;
        int second = (giftTime % 600) / 10;
        Util.drawClipImage(g, imgGiftTimeNum, TIME_X, TIME_Y, 0, TIME_H * 10, TIME_W, TIME_H);
        Util.drawNumbersAlignRight(g, minute, imgGiftTimeNum, TIME_W, TIME_H, 0, TIME_X, TIME_Y);
        if (minute < 10) {
            Util.drawClipImage(g, imgGiftTimeNum, TIME_X - (TIME_W << 1), TIME_Y, 0, 0, TIME_W, TIME_H);
        }
        Util.drawNumbersAlignRight(g, second, imgGiftTimeNum, TIME_W, TIME_H, 0, TIME_X + (TIME_W * 3), TIME_Y);
        if (second < 10) {
            Util.drawClipImage(g, imgGiftTimeNum, TIME_X + TIME_W, TIME_Y, 0, 0, TIME_W, TIME_H);
        }
    }

    //虚拟按键相关图片
    Image imgKeypadDir;
    Image imgKeypadDirPressed;
    Image imgKeypadFire;
    Image imgKeypadFirePressed;
    Image imgKeypadFireBack;
    Image imgKeypadSkill;
    Image imgKeypadSkillPressed;
    Image imgKeypadSkillBack;
    Image imgKeypadSkillNo;
    Image imgKeypadSkillArrow;

    void loadKeypadImages() {
        imgKeypadDir = imgMgr.getImage((short)252);
        imgKeypadDirPressed = imgMgr.getImage((short)251);
        imgKeypadFire = imgMgr.getImage((short)253);
        imgKeypadFirePressed = imgMgr.getImage((short)254);
        imgKeypadFireBack = imgMgr.getImage((short)255);
        imgKeypadSkill = imgMgr.getImage((short)259);
        imgKeypadSkillPressed = imgMgr.getImage((short)256);
        imgKeypadSkillBack = imgMgr.getImage((short)258);
        imgKeypadSkillNo = imgMgr.getImage((short)261);
        imgKeypadSkillArrow = imgMgr.getImage((short)288);
    }

    //虚拟按键控制
    int keyPadCode = -1;

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

        if (sceneMode) {
            return;
        }
        
        //技能
//        final int[] SKILL_X = {390, 341, 337, 448};
//         final int[] SKILL_Y = {148, 182, 237, 166};
        final int[] SKILL_X = {SCREEN_WIDTH - 90, SCREEN_WIDTH - 139, SCREEN_WIDTH - 143, SCREEN_WIDTH - 32};
        final int[] SKILL_Y = {SCREEN_HEIGHT - 124, SCREEN_HEIGHT - 90, SCREEN_HEIGHT - 35, SCREEN_HEIGHT - 106};
        final int[] SKILL_KEY = {1, 3, 7, 9};
        final int SKILL_W = imgKeypadSkill.getHeight() >> 1;
        final int SKILL_NO_W = imgKeypadSkillNo.getWidth();
        final int SKILL_COL = 6;
        for (int index = 0; index < SKILL_X.length; index++) {
            int skillX = SKILL_X[index] + OFFSET;
            g.drawImage(imgKeypadSkillBack, skillX, SKILL_Y[index], KEYPAD_ANCHOR);
            if (keyPadCode == Keys.MASK_NUM0 + SKILL_KEY[index]) {
                g.drawImage(imgKeypadSkillPressed, skillX, SKILL_Y[index], KEYPAD_ANCHOR);
            }
            if (index == SKILL_X.length - 1 && GameContext.actor.isLearn[SKILL_X.length] > 0) {
                drawSkillArrowIcon(g, skillX, SKILL_Y[index]);
                continue;
            }
            int skillLv = (GameContext.actor.isLearn[index] == 0) ? 1 : GameContext.actor.isLearn[index];
            skillLv--;
            int row = index >> 1;
            int col = index * GameContext.actor.SKILL_LV_COUNT + skillLv - (row * SKILL_COL);
            Util.drawClipImage(g, imgKeypadSkill, skillX - (SKILL_W >> 1) + 1, SKILL_Y[index] - (SKILL_W >> 1), col * SKILL_W, row * SKILL_W, SKILL_W, SKILL_W);
            if (GameContext.actor.isLearn[index] == 0) {
                g.drawImage(imgKeypadSkillNo, skillX, SKILL_Y[index], KEYPAD_ANCHOR);
            }
            if (GameContext.actor.skillCoolTime[index] > 0) {
                int timeH = GameContext.actor.skillCoolTime[index] * SKILL_NO_W / GameContext.actor.SKILL_NEED_COOL_TIME[index * GameContext.actor.SKILL_LV_COUNT + skillLv];
                int timeX = skillX - (SKILL_NO_W >> 1);
                int timeY = SKILL_Y[index] + (SKILL_NO_W >> 1) - timeH;
                Util.drawClipImage(g, imgKeypadSkillNo, timeX, timeY, 0, SKILL_NO_W - timeH, SKILL_NO_W, timeH);
            }
        }
    }

    void drawSkillArrowIcon(Graphics g, int x, int y) {
        final int SKILL_W = imgKeypadSkillArrow.getWidth();
        final int SKILL_NO_W = imgKeypadSkillNo.getWidth();
        g.drawImage(imgKeypadSkillArrow, x - (SKILL_W >> 1), y - (SKILL_W >> 1), 0);
        if (GameContext.actor.skillCoolTime[GameContext.actor.SKILL_COUNT - 1] > 0) {
            int timeH = GameContext.actor.skillCoolTime[GameContext.actor.SKILL_COUNT - 1] * SKILL_NO_W / GameContext.actor.SKILL_NEED_COOL_TIME[GameContext.actor.SKILL_COUNT * GameContext.actor.SKILL_LV_COUNT - 1];
            int timeX = x - (SKILL_NO_W >> 1);
            int timeY = y + (SKILL_NO_W >> 1) - timeH;
            Util.drawClipImage(g, imgKeypadSkillNo, timeX, timeY, 0, SKILL_NO_W - timeH, SKILL_NO_W, timeH);
        }
    }

    /**
     * 绘制全屏幕蒙版
     * @param g
     */
    void drawFullScreenMask(Graphics g) {
        for (int index = 0; index < MASK_CNT; index++) {
            g.drawImage(imgMask, index * imgMask.getWidth(), 0, 0);
        }
    }

    /**
     * 菜单按键
     */
    public void drawMenuButtons(Graphics g, boolean leftState, boolean rightState, int frameX, int frameY, int frameW, int frameH) {
        final int BTN_LEFT_X = frameX - 19;
        final int BTN_RIGHT_X = frameX + frameW - 60;
        final int BTN_Y = frameY + frameH - 23;
        int wordW = retAndFireFont.getWidth();
        int wordH = retAndFireFont.getHeight() / 3;
        int wordY = BTN_Y + 7;
        if (leftState) {
            Util.drawRegion(g, retFrame, 0, 0, retFrame.getWidth(), retFrame.getHeight(), Sprite.TRANS_MIRROR, BTN_LEFT_X, BTN_Y, 0);
            if (sms.isShowing()) {
                Util.drawClipImage(g, retAndFireFont, BTN_LEFT_X + 16, wordY, 0, wordH << 1, wordW, wordH);
            } else {
                Util.drawClipImage(g, retAndFireFont, BTN_LEFT_X + 16, wordY, 0, wordH, wordW, wordH);
            }
        }
        if (rightState) {
            g.drawImage(retFrame, BTN_RIGHT_X, BTN_Y, 0);
            Util.drawClipImage(g, retAndFireFont, BTN_RIGHT_X + 12, wordY, 0, 0, wordW, wordH);
        }
    }
    public void drawMenuButtons(Graphics g, boolean leftState, boolean rightState, int frameX, int frameY) {
        drawMenuButtons(g, leftState, rightState, frameX, frameY, WIDTH_FRAME, HEIGHT_FRAME);
    }

    public boolean doMenuButtonsPoint(int px, int py, boolean leftState, boolean rightState, int frameX, int frameY, int frameW, int frameH) {
        final int BTN_POINT_W = retFrame.getWidth();
        final int BTN_POINT_H = retFrame.getHeight();
        final int BTN_LEFT_X = frameX - 19;
        final int BTN_RIGHT_X = frameX + frameW - 60;
        final int BTN_Y = frameY + frameH - 23;
        if (leftState && GameContext.point(px, py, BTN_LEFT_X, BTN_Y, BTN_POINT_W, BTN_POINT_H)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            keyPressed(Keys.KEY_LEFT_SOFT);
            return true;
        }
        if (rightState && GameContext.point(px, py, BTN_RIGHT_X, BTN_Y, BTN_POINT_W, BTN_POINT_H)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            keyPressed(Keys.KEY_RIGHT_SOFT);
            return true;
        }
        return false;
    }

    public boolean doMenuButtonsPoint(int px, int py, boolean leftState, boolean rightState, int frameX, int frameY) {
        return doMenuButtonsPoint(px, py, leftState, rightState, frameX, frameY, WIDTH_FRAME, HEIGHT_FRAME);
    }

    /**
     * 绘制菜单中显示的金钱
     */
    public void drawMenuMoney(Graphics g, int money, int centerX, int topY) {
        int numW = numberSmall.getWidth() / 10;
        int numSize = Util.getNumberSize(money);
        int dis = 2;
        int frameW = (numW + 1) * numSize + moneyIcon.getWidth() + (dis << 2);
        int frameH = numberSmall.getHeight() + (dis << 1);
        int frameX = centerX - (frameW >> 1);
        g.setColor(0x28292d);
        g.fillRect(frameX, topY, frameW, frameH);
        g.drawImage(moneyIcon, frameX + dis, topY + dis, 0);
        Util.drawNumbersAlignRight(g, money, numberSmall, numW, 1, frameX + frameW - dis, topY + dis);
    }

    private void drawMenuMoneyAlignLeft(Graphics g, int money, int leftX, int topY) {
        int numW = numberSmall.getWidth() / 10;
        int numSize = Util.getNumberSize(money);
        int dis = 2;
        int frameW = (numW + 1) * numSize + moneyIcon.getWidth() + (dis << 2);
        int frameH = numberSmall.getHeight() + (dis << 1);
        int frameX = leftX;
        g.setColor(0x28292d);
        g.fillRect(frameX, topY, frameW, frameH);
        g.drawImage(moneyIcon, frameX + dis, topY + dis, 0);
        Util.drawNumbersAlignRight(g, money, numberSmall, numW, 1, frameX + frameW - dis, topY + dis);
    }

    /**
     * 绘制计费信息背景
     * @param g
     */
    final public void drawSmsFrameBack(Graphics g, int MENU_FRAME_X, int MENU_FRAME_Y, int MENU_FRAME_W, int MENU_FRAME_H) {
        drawFullScreenMask(g);
        g.setColor(0);
        g.fillRect(MENU_FRAME_X, MENU_FRAME_Y, MENU_FRAME_W, MENU_FRAME_H);

        final int RED_LINE_Y = MENU_FRAME_Y + 7;
        g.drawImage(redStrip, MENU_FRAME_X, RED_LINE_Y, 0);
        Util.drawRegion(g, redStrip, 0, 0, redStrip.getWidth(), redStrip.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W, RED_LINE_Y, Graphics.RIGHT | Graphics.TOP);
        final int SAWTOOTH_Y = RED_LINE_Y + redStrip.getHeight() + 1;
        final int SAWTOOTH_CNT = MENU_FRAME_W / sawtooth.getWidth();
        for (int index = 0; index < SAWTOOTH_CNT; index++) {
            g.drawImage(sawtooth, MENU_FRAME_X + sawtooth.getWidth() * index, SAWTOOTH_Y, 0);
        }

        final int FRAME_LEFT_W = 3;
        g.setColor(0x4a473a);
        g.fillRect(MENU_FRAME_X, MENU_FRAME_Y, FRAME_LEFT_W, MENU_FRAME_H);
        g.fillRect(MENU_FRAME_X + MENU_FRAME_W - FRAME_LEFT_W, MENU_FRAME_Y, FRAME_LEFT_W, MENU_FRAME_H);
        g.setColor(0x6f6556);
        int lineX = MENU_FRAME_X + FRAME_LEFT_W;
        g.drawLine(lineX, MENU_FRAME_Y, lineX, MENU_FRAME_Y + MENU_FRAME_H - 1);
        lineX = MENU_FRAME_X + MENU_FRAME_W - FRAME_LEFT_W - 1;
        g.drawLine(lineX, MENU_FRAME_Y, lineX, MENU_FRAME_Y + MENU_FRAME_H - 1);
        final int LACE_BOTTOM_IMG_W = downSide.getWidth();
        final int LACE_BOTTOM_IMG_H = downSide.getHeight();
        g.drawImage(upSide, MENU_FRAME_X, MENU_FRAME_Y, 0);
        Util.drawRegion(g, upSide, 0, 0, upSide.getWidth(), upSide.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W, MENU_FRAME_Y, Graphics.RIGHT | Graphics.TOP);
        g.drawImage(downSide, MENU_FRAME_X, MENU_FRAME_Y + MENU_FRAME_H - LACE_BOTTOM_IMG_H, 0);
        Util.drawRegion(g, downSide, 0, 0, LACE_BOTTOM_IMG_W, LACE_BOTTOM_IMG_H, Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W, MENU_FRAME_Y + MENU_FRAME_H, Graphics.RIGHT | Graphics.BOTTOM);

        final int ANGLE_DIS = 2;
        g.drawImage(triangleOutside, MENU_FRAME_X - ANGLE_DIS, MENU_FRAME_Y - ANGLE_DIS, 0);
        Util.drawRegion(g, triangleOutside, 0, 0, triangleOutside.getWidth(), triangleOutside.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W + ANGLE_DIS, MENU_FRAME_Y - ANGLE_DIS, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, triangleOutside, 0, 0, triangleOutside.getWidth(), triangleOutside.getHeight(), Sprite.TRANS_ROT180, MENU_FRAME_X + MENU_FRAME_W + ANGLE_DIS, MENU_FRAME_Y + MENU_FRAME_H + ANGLE_DIS, Graphics.RIGHT | Graphics.BOTTOM);
        Util.drawRegion(g, triangleOutside, 0, 0, triangleOutside.getWidth(), triangleOutside.getHeight(), Sprite.TRANS_MIRROR_ROT180, MENU_FRAME_X - ANGLE_DIS, MENU_FRAME_Y + MENU_FRAME_H + ANGLE_DIS, Graphics.LEFT | Graphics.BOTTOM);

        final int CHAIN_X = MENU_FRAME_X + 6;
        final int CHAIN_Y = MENU_FRAME_Y + 30;
        final int CHAIN_H = MENU_FRAME_H - 64;
        final int CHAIN_CNT = CHAIN_H / chain.getHeight();
        for (int index = 0; index < CHAIN_CNT; index++) {
            g.drawImage(chain, CHAIN_X, CHAIN_Y + chain.getHeight() * index, 0);
        }
        if (CHAIN_CNT * chain.getHeight() < CHAIN_H) {
            Util.drawClipImage(g, chain, CHAIN_X, CHAIN_Y + chain.getHeight() * CHAIN_CNT, 0, 0, chain.getWidth(), CHAIN_H - chain.getHeight() * CHAIN_CNT);
        }

        final int WHEEL_OFFX = FRAME_LEFT_W + 1;
        g.drawImage(wheel, MENU_FRAME_X + WHEEL_OFFX, MENU_FRAME_Y + MENU_FRAME_H - downSide.getHeight(), Graphics.LEFT | Graphics.BOTTOM);
        Util.drawRegion(g, wheel, 0, 0, wheel.getWidth(), wheel.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W - WHEEL_OFFX, MENU_FRAME_Y + MENU_FRAME_H - downSide.getHeight(), Graphics.RIGHT | Graphics.BOTTOM);

        final int TXT_BACK_X = MENU_FRAME_X + 12;
        final int TXT_BACK_Y = MENU_FRAME_Y + 30;
        final int TXT_BACK_W = MENU_FRAME_W - 18;
        final int TXT_BACK_H = MENU_FRAME_H - 64;
        final int TXT_BACK_LACE_H = 24;
        g.setColor(0x121211);
        g.fillRect(TXT_BACK_X, TXT_BACK_Y, TXT_BACK_W, TXT_BACK_H);
        g.setColor(0x1f1e1d);
        g.fillRect(TXT_BACK_X, TXT_BACK_Y, TXT_BACK_W, TXT_BACK_LACE_H);
        g.fillRect(TXT_BACK_X, TXT_BACK_Y + TXT_BACK_H - TXT_BACK_LACE_H, TXT_BACK_W, TXT_BACK_LACE_H);
        final int UP_LACE_W = upAndDownSide.getWidth();
        final int UP_LACE_H = upAndDownSide.getHeight();
        int upLaceCnt = TXT_BACK_W / UP_LACE_W;
        for (int index = 0; index < upLaceCnt; index++) {
            g.drawImage(upAndDownSide, TXT_BACK_X + index * UP_LACE_W, TXT_BACK_Y, 0);
            Util.drawRegion(g, upAndDownSide, 0, 0, UP_LACE_W, UP_LACE_H, Sprite.TRANS_ROT180, TXT_BACK_X + index * UP_LACE_W, TXT_BACK_Y + TXT_BACK_H, Graphics.LEFT | Graphics.BOTTOM);
        }
        if (upLaceCnt * UP_LACE_W < TXT_BACK_W) {
            Util.drawClipImage(g, upAndDownSide, TXT_BACK_X + upLaceCnt * UP_LACE_W, TXT_BACK_Y, 0, 0, TXT_BACK_W - upLaceCnt * UP_LACE_W, UP_LACE_H);
            Util.drawRegion(g, upAndDownSide, 0, 0, TXT_BACK_W - upLaceCnt * UP_LACE_W, UP_LACE_H, Sprite.TRANS_ROT180, TXT_BACK_X + upLaceCnt * UP_LACE_W, TXT_BACK_Y + TXT_BACK_H, Graphics.LEFT | Graphics.BOTTOM);
        }
        final int LEFT_LACE_W = leftAndRightSide.getWidth();
        final int LEFT_LACE_H = leftAndRightSide.getHeight();
        int leftLaceCnt = TXT_BACK_H / LEFT_LACE_H;
        for (int index = 0; index < leftLaceCnt; index++) {
            g.drawImage(leftAndRightSide, TXT_BACK_X, TXT_BACK_Y + index * LEFT_LACE_H, 0);
            Util.drawRegion(g, leftAndRightSide, 0, 0, LEFT_LACE_W, LEFT_LACE_H, Sprite.TRANS_MIRROR, TXT_BACK_X + TXT_BACK_W, TXT_BACK_Y + index * LEFT_LACE_H, Graphics.RIGHT | Graphics.TOP);
        }
        if (leftLaceCnt * LEFT_LACE_H < TXT_BACK_H) {
            Util.drawClipImage(g, leftAndRightSide, TXT_BACK_X, TXT_BACK_Y + leftLaceCnt * LEFT_LACE_H, 0, 0, LEFT_LACE_W, TXT_BACK_H - leftLaceCnt * LEFT_LACE_H);
            Util.drawRegion(g, leftAndRightSide, 0, 0, LEFT_LACE_W, TXT_BACK_H - leftLaceCnt * LEFT_LACE_H, Sprite.TRANS_MIRROR, TXT_BACK_X + TXT_BACK_W, TXT_BACK_Y + leftLaceCnt * LEFT_LACE_H, Graphics.RIGHT | Graphics.TOP);
        }
        final int TRI_W = triangleInside.getWidth();
        final int TRI_H = triangleInside.getHeight();
        g.drawImage(triangleInside, TXT_BACK_X, TXT_BACK_Y, 0);
        Util.drawRegion(g, triangleInside, 0, 0, TRI_W, TRI_H, Sprite.TRANS_MIRROR, TXT_BACK_X + TXT_BACK_W, TXT_BACK_Y, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, triangleInside, 0, 0, TRI_W, TRI_H, Sprite.TRANS_ROT180, TXT_BACK_X + TXT_BACK_W, TXT_BACK_Y + TXT_BACK_H, Graphics.RIGHT | Graphics.BOTTOM);
        Util.drawRegion(g, triangleInside, 0, 0, TRI_W, TRI_H, Sprite.TRANS_MIRROR_ROT180, TXT_BACK_X, TXT_BACK_Y + TXT_BACK_H, Graphics.LEFT | Graphics.BOTTOM);

        final int BIG_WHEEL_RIGHT_X = MENU_FRAME_X + MENU_FRAME_W - 4;
        final int BIG_WHEEL_Y = RED_LINE_Y + 1;
        g.drawImage(rightTopAngle, BIG_WHEEL_RIGHT_X, BIG_WHEEL_Y, Graphics.RIGHT | Graphics.TOP);
    }

    /******礼包逻辑*********************************/
    //获得礼包次数
    int getGiftCount = 0;
    //礼包奖励金钱
    int giftMoney = 300;//工作礼包
    final int[] GIFT_MONEY_BASE = {300, 500, 500, 1000, 1500, 2000};
    //礼包间隔时间
    final int[] GIFT_TIME_BASE = {3000, 6000, 9000, 12000, 15000, 18000};
    int giftTime = 0;
    //是否闪烁
    boolean flashGift;
    int flashGiftCtr = 0;
    //礼包物品奖励
    final String[] GIFT_ITEM =
    {
        "30*2|31*2",
        "11*1",
        "12*1",
        "30*3|31*3",
        "-5*1|32*1|33*1",
        "50*1|51*1|52*1|53*1",
    };

    /**
     * 得到礼包
     */
    private void getGiftLogic() {
        if (giftTime != 0) {
            return;
        }
        String title = "薪水大礼包：";
        int money = giftMoney;;
        giftTime = GIFT_TIME_BASE[GIFT_TIME_BASE.length - 1] - 1;
        if (getGiftCount < GIFT_TIME_BASE.length) {
//            money = GIFT_MONEY_BASE[getGiftCount];
            giftTime = GIFT_TIME_BASE[getGiftCount] - 1;
            getGiftCount++;
            title = "薪水大礼包：";
        }else if(getGiftCount > GIFT_TIME_BASE.length){
            money = 18000;
        }
        flashGiftCtr = 0;
        Actor actor = GameContext.actor;
        actor.addMoney(money);
        StringBuffer buf = new StringBuffer(title);
        buf.append("|获得金钱 + ").append(money);
        if (getGiftCount < GIFT_ITEM.length) {
            String[] giftStr = Util.getString(GIFT_ITEM[getGiftCount - 1], '|');
            for (int index = 0; index < giftStr.length; index++) {
                String[] data = Util.getString(giftStr[index], '*');
                int id = Integer.parseInt(data[0]);
                int count = Integer.parseInt(data[1]);
                if (id == EffortManager.getInstance().AWARD_LV) {
                    actor.addLevel(count);
                    buf.append("|").append("等级上升").append(count).append("级");
                    continue;
                }
                MyItem item = new MyItem((short) id);
                if (item != null) {
                    actor.addItem(item, count);
                    buf.append("|").append("获得").append(item.item.name).append(" * ").append(count);
                }
            }
        }
        dlg.showMessageBox(buf.toString());
    }

    private void updataGiftTime() {
        if (giftTime > 0) {
            giftTime--;
            return;
        }
        flashGiftCtr ++;
        if (flashGiftCtr % 5 == 0) {
            flashGift = true;
            return;
        }
         flashGift = false;
    }

    /******教学********************/
    //是否绘制教学指示框
    boolean isDrawTeachTipBox;
    int teachTipBoxX;
    int teachTipBoxY;
    int teachTipBoxW;
    int teachTipBoxH;
    int teachTipBoxClr;
    /**
     * 设置教学指示框
     */
    public void setTeachTipBox(boolean isDraw, int x, int y, int width, int height, int color) {
        isDrawTeachTipBox = isDraw;
        teachTipBoxX = x;
        teachTipBoxY = y;
        teachTipBoxW = width;
        teachTipBoxH = height;
        teachTipBoxClr = color;
    }
    
    //教学指示箭头
    PaintUnit teachTipArrow;

    /**
     * 绘制教学指示
     * @param g
     */
    public void drawTeachTipBox(Graphics g) {
        if (isDrawTeachTipBox) {
            int dis = ((MainCanvas.currentFrameAll & 0x1) == 0) ? 0 : 2;
            g.setColor(teachTipBoxClr);
            g.drawRect(teachTipBoxX - dis, teachTipBoxY - dis, teachTipBoxW + (dis << 1), teachTipBoxH + (dis << 1));
        }
        if (teachTipArrow != null) {
            teachTipArrow.paint(g, 0, 0);
            teachTipArrow.update();
        }
        if (teachDlg != null && teachDlg.isAvailable()) {
            teachDlg.paint(g);
        }
    }

    //教学变量保存
    boolean teachOverArtifice;
    boolean teachOverEnchant;
    boolean teachOverFormula;
    boolean teachOverGift;
    boolean useShop;
    boolean isNotSaleItem;


    //等待教学按键
    boolean isWaitTeachKey;
    boolean isWaitTeachPoint;
    int teachKey;
    int teachPointX;
    int teachPointY;
    int teachPointW;
    int teachPointH;
    Dialog teachDlg;
    //设置教学等待按键
    public void setTeachKey(int key, int x, int y, int width, int height, char[] msg) {
        if (msg != null && msg.length != 0) {
            teachDlg = new Dialog();
            teachDlg.showMessageBox(msg);
        }
        if (key >= 0) {
            isWaitTeachKey = true;
            teachKey = keyMgr.getKeyValue(key);
        }else
        {
            isWaitTeachKey = false;
        }
        if (width > 0 && height > 0) {
            isWaitTeachPoint = true;
            teachPointX = x;
            teachPointY = y;
            teachPointW = width;
            teachPointH = height;
        }
    }

    public void closeTeachWait() {
        isWaitTeachKey = false;
        isWaitTeachPoint = false;
        teachKey = -1;
        teachPointX = 0;
        teachPointY = 0;
        teachPointW = 0;
        teachPointH = 0;
        if (teachDlg != null) {
            teachDlg.closeMessageBox();
            teachDlg = null;
        }
        if (script != null) {
            script.remind(0, 0, null);
            script = null;
        }
    }

    /********物品小菜单******************************/
    //弹出菜单
    boolean showPopMenu;
    //菜单选项个数
    int popMenuItemCnt;
    //当前是第几项
    int popMenuItemIdx;
    //当前选中的物品
    MyItem curItem;
    //绘制选项的坐标
    /*
     * * 2 * 3 * *
     * 0 * * * 5 *
     * * 1 * 4 * *
     */
    final int[] popMenuItemX = {-40, 0, 0, 40};
    final int[] popMenuItemY = {0, 40, -40, 0};
//    final int[] popMenuItemX = {-40, -20, -20, 20, 20, 40};
//    final int[] popMenuItemY = {0, 35, 35, -35, 35, 0};
    //菜单选项
    int[] popMenuItems = new int[popMenuItemX.length];
    //使用选项
    final int USE_POP_ITEM = 4;
    //安装选项
    final int INSTALL_POP_ITEM = 3;
    //更换选项
    final int CHANGE_POP_ITEM = 1;
    //卸下选项
    final int UNINSTALL_POP_ITEM = 2;
    //强化选项
    final int ENCHANT_POP_ITEM = 0;
    //配方炼制选项
    final int FORMULA_POP_ITEM = 5;
    //卖出选项
    final int SALE_POP_ITEM = 6;

    //属性界面弹出小菜单
    final private void prepareAttrPopMenu(MyItem item) {
        curItem = item;
        popMenuItemIdx = 0;
        popMenuItemCnt = 0;
        if (item == null) {
            popMenuItems[popMenuItemCnt] = INSTALL_POP_ITEM;
            popMenuItemCnt++;
            showPopMenu = true;
            return;
        }
        if (item.getType() == Item.WEAPON || !item.canEquip()) {
            return;
        }
        popMenuItems[popMenuItemCnt] = CHANGE_POP_ITEM;
        popMenuItemCnt++;
        popMenuItems[popMenuItemCnt] = UNINSTALL_POP_ITEM;
        popMenuItemCnt++;
        if (item.getType() == Item.ARMOR) {
            popMenuItems[popMenuItemCnt] = ENCHANT_POP_ITEM;
            popMenuItemCnt++;
        }
        showPopMenu = true;
    }

    //背包界面弹出小菜单
    final private void preparePopMenu(MyItem item) {
        curItem = item;
        popMenuItemIdx = 0;
        popMenuItemCnt = 0;
        if (item == null) {
            return;
        }
        if (item.getId() == MyItem.DETOXIFICATION_ID) {//公主解药
            return;
        }
        if (oldInterface == ATTRI) {
            popMenuItems[popMenuItemCnt] = INSTALL_POP_ITEM;
            popMenuItemCnt++;
            showPopMenu = true;
            return;
        }
        int itemType = item.getType();
        if (itemType == Item.WEAPON || itemType == Item.STONE) {
            return;
        }
        switch (itemType)
        {
            case Item.ARMOR:
                popMenuItems[popMenuItemCnt] = item.isActorEquip ? UNINSTALL_POP_ITEM : INSTALL_POP_ITEM;
                popMenuItemCnt++;
                popMenuItems[popMenuItemCnt] = ENCHANT_POP_ITEM;
                popMenuItemCnt++;
                break;
            case Item.FOOT:
            case Item.ADORN:
                popMenuItems[popMenuItemCnt] = item.isActorEquip ? UNINSTALL_POP_ITEM : INSTALL_POP_ITEM;
                popMenuItemCnt++;
                break;
            case Item.MEDICINE:
                popMenuItems[popMenuItemCnt] = USE_POP_ITEM;
                popMenuItemCnt++;
                break;
            case Item.FORMULA:
                popMenuItems[popMenuItemCnt] = FORMULA_POP_ITEM;
                popMenuItemCnt++;
                break;
        }
        if (item.canSale() ) {
            popMenuItems[popMenuItemCnt] = SALE_POP_ITEM;
            popMenuItemCnt++;
        }
        showPopMenu = true;
    }

    //绘制小菜单
    final private void drawPopMenu(Graphics g, int itemX, int itemY, boolean isLeft) {
        if (popMenuItemCnt == 0) {
            showPopMenu = false;
            return;
        }
        final int TITLE_W = goodsFont.getWidth();
        final int TITLE_H = goodsFont.getHeight() / (SALE_POP_ITEM + 1);
        for (int index = 0; index < popMenuItemCnt; index++) {
            int posIndex = isLeft ? index : (popMenuItems.length - index - 1);
            int posX = itemX + popMenuItemX[posIndex];
            int posY = itemY + popMenuItemY[posIndex];
            g.drawImage(stallButton, posX, posY, Graphics.HCENTER | Graphics.VCENTER);
            Util.drawClipImage(g, goodsFont, posX - (TITLE_W >> 1), posY - (TITLE_H >> 1), 0, popMenuItems[index] * TITLE_H, TITLE_W, TITLE_H);
        }
    }

    //小菜单触摸控制
    final private boolean doPopMenuPoint(int px, int py, int itemX, int itemY, boolean isLeft) {
        final int POINT_W = stallButton.getWidth();
        for (int index = 0; index < popMenuItemCnt; index++) {
            int posIndex = isLeft ? index : (popMenuItems.length - index - 1);
            int posX = itemX + popMenuItemX[posIndex] - (POINT_W >> 1);
            int posY = itemY + popMenuItemY[posIndex] - (POINT_W >> 1);
            if (GameContext.point(px, py, posX, posY, POINT_W, POINT_W)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                doPopMenuFire(popMenuItems[index]);
                return true;
            }
        }
        return false;
    }

    //小菜单选中逻辑
    final private void doPopMenuFire(int menuItem) {
        Actor actor = GameContext.actor;
        switch (menuItem)
        {
            case USE_POP_ITEM:
                String str = curItem.use();
                actor.removeItem(curItem);
                preInitGoodsInterface(curItem);
                curItem = null;
                dlg.showMessageBox(str.toCharArray());
                break;
            case INSTALL_POP_ITEM:
            {
                if (curInterface == ATTRI) {
                    initCanEquipGoods(attriIndex);
                    return;
                }
                showDec = false;
                itemDec = null;
                if (actor.getLevel() < curItem.item.extra[Item.EXTRA_TYPE_EQUIP_LV_LIMIT]) {
                    dlg.showMessageBox("等级不足，无法装备");
                    return;
                }
                int itemType = curItem.getType();
                MyItem curEquip = actor.equipmentItem[itemType];
                if (curEquip != null) {
                    curEquip.uninstall();
                }
                actor.equipmentItem[itemType] = curItem;
                actor.equipmentItem[itemType].install();
            }
                break;
            case UNINSTALL_POP_ITEM:
            {
                int itemType = curItem.getType();
                actor.equipmentItem[itemType].uninstall();
                actor.equipmentItem[itemType] = null;
                showDec = false;
                itemDec = null;
                break;
            }
            case CHANGE_POP_ITEM:
                initCanEquipGoods(curItem.getType());
                break;
            case FORMULA_POP_ITEM:
                if (!teachOverFormula) {
                    dlg.showMessageBox("炼制配方功能暂未开启。");
                    curInterface = SYSMENU;
                    oldInterface = -1;
                    return;
                }
                oldInterface = curInterface;
                curInterface = FORMULA;
                initFormulaData();
                showDec = false;
                itemDec = null;
                stove.actId = 0;
                stove.initFrame();
                break;
            case ENCHANT_POP_ITEM:
                oldInterface = curInterface;
                curInterface = ENCHANT;
                isWeaponEnchant = false;
                enchantIndex = 2;
                selectFrameAnimal.actId = 0;
                selectFrameAnimal.initFrame();
                prepareEnchantConditionDec(curItem);
                break;
            case SALE_POP_ITEM:
                if (isNotSaleItem && ((curItem.getId() == 72) || (curItem.getId() == 73))) {//蟹壳，孽鬼眼球不能卖
                    dlg.showMessageBox("任务物品，暂时无法买卖");
                    return;
                }
                if ((curItem.getId() == 80) || (curItem.getId() == 39)) {//云南白药，混元丹不能卖
                    dlg.showMessageBox("任务物品，无法买卖");
                    return;
                }
                if (curItem.canOverPosition() && curItem.cnt > 1) {
                    initChangeTradingCountOP(1, curItem.cnt, true);
                    return;
                }
                tradingCount = 1;
                int salePrice = itemPrice >> 1;
                StringBuffer buf = new StringBuffer();
                buf.append("卖出价格为").append(salePrice).append("，是否卖出？");
                dlg.btnBoxOp = Dialog.SALE_ITEM_OP;
                dlg.showButtonBox(buf.toString().toCharArray());
                break;
        }
    }

    //从属性界面进入物品界面，更换装备
    private void initCanEquipGoods(int type) {
        oldInterface = curInterface;
        curInterface = GOODS;
        showDec = false;
        itemDec = null;
        armorStartRow = 0;
        curArmorItems = GameContext.actor.getItemsFromActorBag(type);
    }

    //炼制生成的物品
    MyItem createItem;
    //配方的描述
    char[] formulaDec;
    //需要的材料
    int[] formulaNeedItemId;
    int[] formulaNeedItemCount;
    int[] formulaHaveItemCount;
    //是否能够炼制
    boolean isCanFormula;
    //初始化配方炼制数据
    public void initFormulaData() {
        isShowProduceGoods = false;
        isShowSucceedStoveAnimal = false;
        int createItemId = curItem.item.extra[Item.EXTRA_TYPE_CREATE_ITEM];
        createItem = new MyItem((short) createItemId);
        int needItemCnt = curItem.getMaxLv();
        formulaNeedItemId = new int[needItemCnt];
        formulaNeedItemCount = new int[needItemCnt];
        formulaHaveItemCount = new int[needItemCnt];
        isCanFormula = true;
        for (int index = 0; index < needItemCnt; index++) {
            formulaNeedItemId[index] = curItem.getAttrValue(MyItem.需要材料, index);
            formulaNeedItemCount[index] = curItem.getAttrValue(MyItem.需要材料数量, index);
            formulaHaveItemCount[index] = GameContext.actor.getItemCount((short) formulaNeedItemId[index]);
            if (formulaHaveItemCount[index] < formulaNeedItemCount[index]) {
                isCanFormula = false;
            }
        }
        StringBuffer buf = new StringBuffer();
        buf.append("{0xffa746").append(curItem.getName()).append("：}|");
        buf.append("{0xffe78d");
        if (createItem.getId() == MyItem.DETOXIFICATION_ID) {
            buf.append(createItem.item.desc);
            formulaDec = buf.toString().toCharArray();
            return;
        }
        buf.append(createItem.getEffectsDescription());
        formulaDec = buf.toString().toCharArray();
    }

    //设置交易数量界面
    boolean isDrawChangeTradingCount;
    int tradingCountMin;
    int tradingCountMax;
    int tradingCount;
    private void initChangeTradingCountOP(int min, int max, boolean isMax) {
        isDrawChangeTradingCount = true;
        tradingCountMin = min;
        tradingCountMax = max;
        tradingCount = isMax ? tradingCountMax : tradingCountMin;
    }

    PaintUnit addUnit;
    PaintUnit minusUnit;
    boolean isPressAdd;
    boolean isPressMinus;
    //绘制设置交易数量界面
    private void drawChangeTradingCountOP(Graphics g) {
        final int BOX_W = 180;
        final int BOX_H = 54;
        final int BOX_X = (SCREEN_WIDTH - BOX_W) >> 1;
        final int BOX_Y = SCREEN_HEIGHT/3;
        g.setColor(0);
        g.fillRect(BOX_X, BOX_Y, BOX_W, BOX_H);
        g.setColor(0xf8ba67);
        g.drawRect(BOX_X, BOX_Y, BOX_W - 1, BOX_H - 1);
        g.setColor(0x41413f);
        g.drawRect(BOX_X + 4, BOX_Y + 4, BOX_W - 9, BOX_H - 9);
        final int TRI_W = triangleInside2.getWidth();
        final int TRI_H = triangleInside2.getHeight();
        Util.drawRegion(g, triangleInside2, 0, 0, TRI_W, TRI_H, Sprite.TRANS_MIRROR, BOX_X + 2, BOX_Y + 2, 0);
        g.drawImage(triangleInside2, BOX_X + BOX_W - 2, BOX_Y + 2, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, triangleInside2, 0, 0, TRI_W, TRI_H, Sprite.TRANS_ROT180, BOX_X + 2, BOX_Y + BOX_H - 2, Graphics.LEFT | Graphics.BOTTOM);
        Util.drawRegion(g, triangleInside2, 0, 0, TRI_W, TRI_H, Sprite.TRANS_ROT90, BOX_X + BOX_W - 2, BOX_Y + BOX_H - 2, Graphics.RIGHT | Graphics.BOTTOM);

        final int UNIT_OFFX = 30;
        final int UNIT_OFFY = BOX_H >> 1;
        int addUnitX = BOX_X + BOX_W - UNIT_OFFX;
        int minusUnitX = BOX_X + UNIT_OFFX;
        int unitY = BOX_Y + UNIT_OFFY;
        if (isPressAdd) {
            addUnit.paint(g, -addUnitX, -unitY);
            if (addUnit.isEndAnimation()) {
                isPressAdd = false;
            }
            addUnit.playNextFrame();
        }
        else {
            addUnit.ani.drawFrame(g, 0, 0, addUnitX, addUnit.y + unitY, addUnit);
        }
        if (isPressMinus) {
            minusUnit.paint(g, -minusUnitX, -unitY);
            if (minusUnit.isEndAnimation()) {
                isPressMinus = false;
            }
            minusUnit.playNextFrame();
        }
        else {
            minusUnit.ani.drawFrame(g, 1, 0, minusUnitX, minusUnit.y + unitY, minusUnit);
        }
        int numW = numberBig.getWidth() / 10;
        int numY = BOX_Y + ((BOX_H - numberBig.getHeight()) >> 1);
        Util.drawNumbersAlignCenter(g, tradingCount, numberBig, numW, 1, SCREEN_WIDTH >> 1, numY);

        int BTN_X = (SCREEN_WIDTH - retFrame.getWidth()) >> 1;
        Util.drawRegion(g, retFrame, 0, 0, retFrame.getWidth(), retFrame.getHeight(), Sprite.TRANS_MIRROR, BTN_X, BOX_Y + BOX_H, 0);
        int wordW = retAndFireFont.getWidth();
        int wordH = retAndFireFont.getHeight() / 3;
        Util.drawClipImage(g, retAndFireFont, BTN_X + 16, BOX_Y + BOX_H + 7, 0, wordH, wordW, wordH);
    }

    //控制
    private boolean doChangeTradingCountKey(int keyCode) {
        switch(keyCode)
        {
            case Keys.KEY_RIGHT:
            case Keys.KEY_NUM6:
                isPressAdd = true;
                addUnit.resetFrame();
                if (tradingCount < tradingCountMax) {
                    tradingCount++;
                }
                return false;
            case Keys.KEY_LEFT:
            case Keys.KEY_NUM2:
                isPressMinus = true;
                minusUnit.resetFrame();
                if (tradingCount > tradingCountMin) {
                    tradingCount--;
                }
                return false;
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                isDrawChangeTradingCount = false;
                return true;
        }
        return false;
    }

    private void doChangeTradingCountPoint(int px, int py) {
        final int BOX_W = 180;
        final int BOX_H = 54;
        final int BOX_X = (SCREEN_WIDTH - BOX_W) >> 1;
        final int BOX_Y = SCREEN_HEIGHT / 3;

        int BTN_X = (SCREEN_WIDTH - retFrame.getWidth()) >> 1;
        if (GameContext.point(px, py, BTN_X, BOX_Y + BOX_H, retFrame.getWidth(), retFrame.getHeight())) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            keyPressed(Keys.KEY_FIRE);
            return;
        }

        final int UNIT_W = 50;
        if (GameContext.point(px, py, BOX_X, BOX_Y, UNIT_W, BOX_H)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            keyPressed(Keys.KEY_LEFT);
            return;
        }
        if (GameContext.point(px, py, BOX_X + BOX_W - UNIT_W, BOX_Y, UNIT_W, BOX_H)) {
            MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
            keyPressed(Keys.KEY_RIGHT);
            return;
        }
    }
}
