/*
 * Copyright(c) 2009 北京飞�?畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

//#if SMS == 3
//# import cost.CostListener;
//#endif
//#if UPDATA == 1
//# import com.tencent.mbox.MBoxClient;
//#endif

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.util.Hashtable;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 *
 * @author 何召卫@fishfly.com
 */
//#if SMS == 3
//# public class MainScreen extends Page implements BoxListener, CostListener{
//#elif UPDATA == 1
//# public class MainScreen extends Page implements BoxListener, MenuViewEvent{
//#else
public class MainScreen extends Page implements BoxListener{
//#endif

    boolean isKeyLeft;
    boolean isKeyRight;
    int startCartoonCount;
    boolean isStartCartoon;

    int itemIdx;
    final int NEW_GAME_ITEM = 0;
    final int LOAD_ITEM = 1;
    final int SET_VOLUME_ITEM = 2;
    final int HELP_ITEM = 3;
    final int ABOUT_ITEM = 4;
    final int EXIT_ITEM = 5;
    final int ITEM_CNT = 6;
    int itemCnt = ITEM_CNT;

    //选项中的网络连接
    final int LINK_ITEM = 6;
    //QQ社区
    final int QQ_HOME_ITEM = 7;
    //QQ积分榜单
    final int UPDATA_ITEM = 8;

    //#if N5800
//#     int[] ITEM_INDEX;
    //#endif

    //#if UPDATA == 1
//#     final int[] QQ_ITEM_INDEX = {0, 1, 7, 8, 2, 3, 4, 6, 5};
    //#endif

    int linkIndex;
    boolean isLinkState;
    boolean canExit;
    /**
     * 是否有游戏连接
     */
    boolean isHaveGameLink;

    String[] gameStr;

    String[] gameWapLink;

    /**
     * 按任意键继续
     */
    char[] keyWord;
    char[] leftTxt;
    char[] rightTxt;
    //#if POINT == 1
    char[] setVolTxt;
    //#endif

    //是否有子菜单覆盖
    boolean subMenu;

    //背景
    Image mainBack;
    //选项
    Image imgItems;
    //按键
    Image imgBtn;
    Image imgBtnWord;
    Image imgArcBtnBack;
    Image imgArcBtnWord;
    //蒙版
    Image imgMask;
    final int MASK_CNT = 15;
    //菜单
    Image imgLaceUp;
    Image imgLaceBottom;
    Image imgLaceAngle;
    Image imgRedUpLine;
    Image imgSawtooth;
    Image imgWheel;
    Image imgChain;
    Image imgBigWheel;
    //声音
    Image imgSoundIcon;
    Image imgSoundCursor;

    AnimationManager aniMgr;
    public PaintUnit smallLight;

    int saveIdx;
    FishFont font;
    MusicPlayer musicPlayer;

    final int TEXT_OFFX = 22;
    final int TEXT_OFFY = 34;
    final int TEXT_W = 300;
    final int TEXT_H = 180;
    int txtOffsetY;
    int txtHeight;

    boolean loading = true;
    //载入计数�?
    int loadingCnt = 0;

    Dialog dlg;

    public MainScreen() {
        fullScreen = true;
        dlg = new Dialog();
        dlg.lsnr = this;
        //#if N5800
//#         isStartCartoon = true;
        //#endif
    }

    public void start() {
        LoadingPage loadingPage = new LoadingPage();
        loadingPage.startThread();
        MainCanvas.addPage(loadingPage);
        loading = true;
    }

    public void doOkButtonFire() {
        if (dlg.btnBoxOp == Dialog.NEW_GAME_OP)
        {
            subMenu = false;
            release();
            MissionManager.getInstance().init();
            MusicPlayer.getInstance().kill();
            MainCanvas.removePage();
            GamePage page = GameContext.page;
            MainCanvas.addPage(GameContext.page);
            page.startGame();
            return;
        }
        else if (dlg.btnBoxOp == Dialog.EXIT_GAME_OP) {
            if (isHaveGameLink) {
                isLinkState = true;
                canExit = true;
                linkIndex = 0;
                return;
            }
            if (GameContext.pushUrl == null || GameContext.pushUrl.equals("null")) {
                GameContext.canvas.live = false;
            }
            else {
                itemIdx = LINK_ITEM;
                subMenu = true;
            }
            return;
        }
        return;
    }

    public ScriptEngine getScript() {
        return null;
    }

    private void loadImages() {
        GameContext.actor = null;
        if(GameContext.map != null)
        {
            GameContext.map.release();
        }
        ImageManager imgMgr = ImageManager.getInstance();
        //#if K790
//#         imgMgr.imgPkg.preload();
//#         AnimationManager.getInstance().aniPkg.preload();
//#         RoleManager.getInstance().pkg.preload();
//#         ScriptEngine.loadPackage();
//#         ScriptEngine.scriptPkg.preload();
        //#endif

        GameContext.page = new GamePage();
        mainBack = imgMgr.getImage((short)281);
        imgItems = imgMgr.getImage((short)282);
        imgBtn = imgMgr.getImage((short)98);
        imgBtnWord = imgMgr.getImage((short)200);
        imgArcBtnBack = Dialog.imgArcBtnBack;
        imgArcBtnWord = Dialog.imgArcBtnWord;
        //蒙版
        int MASK_WIDTH = (SCREEN_WIDTH / MASK_CNT) + 3;
        int MASK_HEIGHT = SCREEN_HEIGHT;
        int TRANSPARENCY = 65;
        int MASK_COLOR = 0;
        imgMask = GameContext.createMaskImage(MASK_WIDTH, MASK_HEIGHT, MASK_COLOR, TRANSPARENCY);
        //菜单
        imgLaceUp = Dialog.imgLaceUp;
        imgLaceBottom = Dialog.imgLaceBottom;
        imgLaceAngle = Dialog.imgLaceAngle;
        imgSawtooth = imgMgr.getImage((short)96);
        imgWheel = imgMgr.getImage((short)119);
        imgChain = imgMgr.getImage((short)101);
        imgRedUpLine = imgMgr.getImage((short)120);
        imgBigWheel = imgMgr.getImage((short)116);
        imgSoundIcon = imgMgr.getImage((short)178);
        imgSoundCursor = imgMgr.getImage((short)179);

        menuBack = imgMgr.getImage((short)314);
        gameName = imgMgr.getImage((short)315);
        reflection = imgMgr.getImage((short)316);
        body = imgMgr.getImage((short)317);
        bodyShadow = imgMgr.getImage((short)323);

        lightShadow1 = imgMgr.getImage((short) 319);
        lightShadow2 = imgMgr.getImage((short) 320);
        lightShadow3 = imgMgr.getImage((short) 321);

        imgMenuItem = imgMgr.getImage((short)324);

        smallLight = new PaintUnit();
        final short SMALLLIGHT_ID = 148;
        AnimationManager.getInstance().getAnimation(SMALLLIGHT_ID, smallLight);
        smallLight.actId = 0;
        smallLight.initFrame();

        Mountain = new PaintUnit();
        final short MOUNT_ID = 147;
        AnimationManager.getInstance().getAnimation(MOUNT_ID, Mountain);
        Mountain.actId = 0;
        Mountain.initFrame();

        Oval = new PaintUnit();
        final short OVAL_ID = 149;
        AnimationManager.getInstance().getAnimation(OVAL_ID, Oval);
        Oval.actId = 0;
        Oval.initFrame();


        final short WORD_GO_ID = 110;
        keyWord = StringManager.getInstance().getString(WORD_GO_ID);
        final short LEFT_ID = 27;
        leftTxt = StringManager.getInstance().getString(LEFT_ID);
        final short RIGHT_ID = 28;
        rightTxt = StringManager.getInstance().getString(RIGHT_ID);
        //#if POINT == 1
        final short SET_VOLUME_ID = 194;
        setVolTxt = StringManager.getInstance().getString(SET_VOLUME_ID);
        //#endif
        initWave();
        screenSize();
    }

    private void release() {
        GameContext.page = new GamePage();
        
        ImageManager imgMgr = ImageManager.getInstance();
        imgMgr.removeImage(imgItems);
        imgMgr.removeImage(imgBtn);
        imgMgr.removeImage(imgBtnWord);
        imgItems = null;
        imgBtn = null;
        imgBtnWord = null;

        imgMgr.removeImage(imgArcBtnBack);
        imgMgr.removeImage(imgArcBtnWord);
        imgMgr.removeImage(imgLaceUp);
        imgMgr.removeImage(imgLaceBottom);
        imgMgr.removeImage(imgLaceAngle);
        imgMgr.removeImage(imgSawtooth);
        imgMgr.removeImage(imgWheel);
        imgMgr.removeImage(imgChain);
        imgMgr.removeImage(imgRedUpLine);
        imgMgr.removeImage(imgBigWheel);
        imgArcBtnBack = null;
        imgArcBtnWord = null;
        imgMask = null;
        imgLaceUp = null;
        imgLaceBottom = null;
        imgLaceAngle = null;
        imgSawtooth = null;
        imgWheel = null;
        imgChain = null;
        imgRedUpLine = null;
        imgBigWheel = null;

        imgMgr.removeImage(imgSoundIcon);
        imgMgr.removeImage(imgSoundCursor);
        imgSoundIcon = null;
        imgSoundCursor = null;

        imgGame = null;
        imgGameName = null;
        imgGameNum = null;
        imgGameNumBack = null;
        imgGamePoint = null;
        imgDesktopLink = null;



        imgMgr.removeImage(imgMenuItem);
        imgMgr.removeImage(imgBtn);
        imgMgr.removeImage(imgBtnWord);

        imgMgr.removeImage(menuBack);
        imgMgr.removeImage(body);
        imgMgr.removeImage(gameName);
        imgMgr.removeImage(bodyShadow);
        imgMgr.removeImage(reflection);
        imgMgr.removeImage(lightShadow1);
        imgMgr.removeImage(lightShadow2);
        imgMgr.removeImage(lightShadow3);
        imgMgr.removeImage(shadow1);
        menuBack = null;
        body = null;
        gameName = null;
        bodyShadow = null;
        reflection = null;
        lightShadow1 = null;
        lightShadow2 = null;
        lightShadow3 = null;
        shadow1 = null;
        imgMenuItem = null;
        imgBtn = null;
        imgBtnWord = null;

        Mountain.releaseImages();
        smallLight.releaseImages();

        releaseMenuData();
    }

        private void releaseMenuData() {
        backX = 0;
        shadowX = 0;
        screenSize = 0;
        gameNameX = 0;
        gameNameY = 0;
        itemX = 0;

        menuCounter = 80;

        waterY = 0;

        maskColor = 0x00000000;
        trans = 0xff;

        lightCount = 0;
        light = new int[LIGHT_MAX_COUNT][LIGHT_DATA_LEN];
        lightData = new int[LIGHT_DATA_LEN];
        lightCounter = 0;
    }

    private void loadResources() {
        font = FishFont.getInstance();
        musicPlayer = MusicPlayer.getInstance();
    }

    private void loadRms() {
        //载入存档记录
        GameContext.readGames();
    }

    public void paint(Graphics g) {
        if(isLinkState)
        {
            drawGameLink(g);
            return;
        }
        if (menuCounter < 100) {
            drawMainFirst(g);
        } else {
            drawMainBack(g);
            drawMain(g);
        }
        drawLight(g);
        if (subMenu) {
            drawSubMenu(g);
        }

        if(dlg.isAvailable()) {
            dlg.paint(g);
        }
    }

    final private void drawSubMenu(Graphics g) {
        MENU_FRAME_X = (Page.SCREEN_WIDTH - MENU_FRAME_W) >> 1;
        MENU_FRAME_Y = (Page.SCREEN_HEIGHT - MENU_FRAME_H) >> 1;
        switch(itemIdx) {
       //#endif
            case SET_VOLUME_ITEM:
                drawVolume(g);
                break;
            case HELP_ITEM:
                drawHelp(g);
                break;
            case ABOUT_ITEM:
                drawAbout(g);
                break;
            case LINK_ITEM:
                drawSpLink(g);
                break;
            //#if UPDATA == 1
//#             case UPDATA_ITEM:
//#                 drawUpData(g);
//#                 break;
            //#endif
        }
    }

    final int MENU_FRAME_W = 360;
    final int MENU_FRAME_H = 240;
    int MENU_FRAME_X = (Page.SCREEN_WIDTH - MENU_FRAME_W) >> 1;
    int MENU_FRAME_Y = (Page.SCREEN_HEIGHT - MENU_FRAME_H) >> 1;

    final private void drawFrame(Graphics g) {
        System.out.println("MENU_FRAME_X="+MENU_FRAME_X);
        drawFullScreenMask(g);

        g.setColor(0);
        g.fillRect(MENU_FRAME_X, MENU_FRAME_Y, MENU_FRAME_W, MENU_FRAME_H);

        final int RED_LINE_Y = MENU_FRAME_Y + 7;
        g.drawImage(imgRedUpLine, MENU_FRAME_X, RED_LINE_Y, 0);
        Util.drawRegion(g, imgRedUpLine, 0, 0, imgRedUpLine.getWidth(), imgRedUpLine.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W, RED_LINE_Y, Graphics.RIGHT | Graphics.TOP);
        final int SAWTOOTH_Y = RED_LINE_Y + imgRedUpLine.getHeight() + 1;
        final int SAWTOOTH_CNT = MENU_FRAME_W / imgSawtooth.getWidth();
        for (int index = 0; index < SAWTOOTH_CNT; index++) {
            g.drawImage(imgSawtooth, MENU_FRAME_X + imgSawtooth.getWidth() * index, SAWTOOTH_Y, 0);
        }
        final int BIG_WHEEL_RIGHT_X = MENU_FRAME_X + MENU_FRAME_W - 4;
        final int BIG_WHEEL_Y = RED_LINE_Y + 1;
        g.drawImage(imgBigWheel, BIG_WHEEL_RIGHT_X, BIG_WHEEL_Y, Graphics.RIGHT | Graphics.TOP);

        final int FRAME_LEFT_W = 3;
        g.setColor(0x4a473a);
        g.fillRect(MENU_FRAME_X, MENU_FRAME_Y, FRAME_LEFT_W, MENU_FRAME_H);
        g.fillRect(MENU_FRAME_X + MENU_FRAME_W - FRAME_LEFT_W, MENU_FRAME_Y, FRAME_LEFT_W, MENU_FRAME_H);
        g.setColor(0x6f6556);
        int lineX = MENU_FRAME_X + FRAME_LEFT_W;
        g.drawLine(lineX, MENU_FRAME_Y, lineX, MENU_FRAME_Y + MENU_FRAME_H - 1);
        lineX = MENU_FRAME_X + MENU_FRAME_W - FRAME_LEFT_W - 1;
        g.drawLine(lineX, MENU_FRAME_Y, lineX, MENU_FRAME_Y + MENU_FRAME_H - 1);
        final int LACE_BOTTOM_IMG_W = imgLaceBottom.getWidth();
        final int LACE_BOTTOM_IMG_H = imgLaceBottom.getHeight();
        g.drawImage(imgLaceUp, MENU_FRAME_X, MENU_FRAME_Y, 0);
        Util.drawRegion(g, imgLaceUp, 0, 0, imgLaceUp.getWidth(), imgLaceUp.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W, MENU_FRAME_Y, Graphics.RIGHT | Graphics.TOP);
        g.drawImage(imgLaceBottom, MENU_FRAME_X, MENU_FRAME_Y + MENU_FRAME_H - LACE_BOTTOM_IMG_H, 0);
        Util.drawRegion(g, imgLaceBottom, 0, 0, LACE_BOTTOM_IMG_W, LACE_BOTTOM_IMG_H, Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W, MENU_FRAME_Y + MENU_FRAME_H, Graphics.RIGHT | Graphics.BOTTOM);

        final int ANGLE_DIS = 2;
        g.drawImage(imgLaceAngle, MENU_FRAME_X - ANGLE_DIS, MENU_FRAME_Y - ANGLE_DIS, 0);
        Util.drawRegion(g, imgLaceAngle, 0, 0, imgLaceAngle.getWidth(), imgLaceAngle.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W + ANGLE_DIS, MENU_FRAME_Y - ANGLE_DIS, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, imgLaceAngle, 0, 0, imgLaceAngle.getWidth(), imgLaceAngle.getHeight(), Sprite.TRANS_ROT180, MENU_FRAME_X + MENU_FRAME_W + ANGLE_DIS, MENU_FRAME_Y + MENU_FRAME_H + ANGLE_DIS, Graphics.RIGHT | Graphics.BOTTOM);
        Util.drawRegion(g, imgLaceAngle, 0, 0, imgLaceAngle.getWidth(), imgLaceAngle.getHeight(), Sprite.TRANS_MIRROR_ROT180, MENU_FRAME_X - ANGLE_DIS, MENU_FRAME_Y + MENU_FRAME_H + ANGLE_DIS, Graphics.LEFT | Graphics.BOTTOM);

        final int CHAIN_X = MENU_FRAME_X + 6;
        final int CHAIN_Y = MENU_FRAME_Y + 30;
        final int CHAIN_H = MENU_FRAME_H - 64;
        final int CHAIN_CNT = CHAIN_H / imgChain.getHeight();
        for (int index = 0; index < CHAIN_CNT; index++) {
            g.drawImage(imgChain, CHAIN_X, CHAIN_Y + imgChain.getHeight() * index, 0);
        }
        if (CHAIN_CNT * imgChain.getHeight() < CHAIN_H) {
            Util.drawClipImage(g, imgChain, CHAIN_X, CHAIN_Y + imgChain.getHeight() * CHAIN_CNT, 0, 0, imgChain.getWidth(), CHAIN_H - imgChain.getHeight() * CHAIN_CNT);
        }

        final int WHEEL_OFFX = FRAME_LEFT_W + 1;
        g.drawImage(imgWheel, MENU_FRAME_X + WHEEL_OFFX, MENU_FRAME_Y + MENU_FRAME_H - imgLaceBottom.getHeight(), Graphics.LEFT | Graphics.BOTTOM);
        Util.drawRegion(g, imgWheel, 0, 0, imgWheel.getWidth(), imgWheel.getHeight(), Sprite.TRANS_MIRROR, MENU_FRAME_X + MENU_FRAME_W - WHEEL_OFFX, MENU_FRAME_Y + MENU_FRAME_H - imgLaceBottom.getHeight(), Graphics.RIGHT | Graphics.BOTTOM);
    }

    private void drawFullScreenMask(Graphics g) {
        for (int index = 0; index < MASK_CNT; index++) {
            g.drawImage(imgMask, index * imgMask.getWidth(), 0, 0);
        }
    }

    private void drawMenuButtons(Graphics g, boolean leftState, boolean rightState, boolean isArc) {
        Image btn = isArc ? imgArcBtnBack : imgBtn;
        Image word = isArc ? imgArcBtnWord : imgBtnWord;
        final int BTN_LEFT_X = MENU_FRAME_X - (btn.getWidth() >> 1);
        final int BTN_RIGHT_X = MENU_FRAME_X + MENU_FRAME_W - (btn.getWidth() >> 1);
        final int BTN_BOTTOM_Y = MENU_FRAME_Y + MENU_FRAME_H + 10;
        int wordW = isArc ? word.getWidth() >> 1 : word.getWidth();
        int wordH = isArc ? word.getHeight() : (word.getHeight() / 3);
        int wordOffY = isArc ? 11 : 7;
        int wordY = BTN_BOTTOM_Y - wordOffY - wordH;
        if (leftState) {
            Util.drawRegion(g, btn, 0, 0, btn.getWidth(), btn.getHeight(), Sprite.TRANS_MIRROR, BTN_LEFT_X, BTN_BOTTOM_Y, Graphics.LEFT | Graphics.BOTTOM);
            if (isArc) {
                Util.drawClipImage(g, word, BTN_LEFT_X + 8, wordY, 0, 0, wordW, wordH);
            }
            else {
                Util.drawClipImage(g, word, BTN_LEFT_X + 16, wordY, 0, wordH, wordW, wordH);
            }
        }
        if (rightState) {
            g.drawImage(btn, BTN_RIGHT_X, BTN_BOTTOM_Y, Graphics.LEFT | Graphics.BOTTOM);
            if (isArc) {
                Util.drawClipImage(g, word, BTN_RIGHT_X + 8, wordY, wordW, 0, wordW, wordH);
            }
            else {
                Util.drawClipImage(g, word, BTN_RIGHT_X + 12, wordY, 0, 0, wordW, wordH);
            }
        }
    }

    private int backX = 0;
    private int shadowX = 0;
    private int screenSize = 0;
    private int gameNameX = 0;
    private int gameNameY = 0;
    private int itemX = -180;
    private int itemEndX = 0;

    private void screenSize() {
        switch (SCREEN_WIDTH) {
            case 427:
                screenSize = 1;
                backX = -165;
                shadowX = 50;
                screenSize = 0;
                gameNameX = 5;
                gameNameY = 5;
                itemX = -180;
                itemEndX = 0;
                break;
            case 480:
                screenSize = 2;
                backX = -105;
                shadowX = 50;
                screenSize = 0;
                gameNameX = 5;
                gameNameY = 5;
                itemX = -180;
                itemEndX = 0;
                break;
            case 597:
                screenSize = 3;
                backX = 0;
                shadowX = 70;
                gameNameX = 5;
                gameNameY = 5;
                itemX = -180;
                itemEndX = 30;
                break;
            case 569:
                screenSize = 3;
                backX = -30;
                shadowX = 70;
                gameNameX = 5;
                gameNameY = 5;
                itemX = -180;
                itemEndX = 30;
                break;
            case 640:
                screenSize = 4;
                backX = 0;
                shadowX = 130;
                gameNameX = 50;
                gameNameY = 30;
                itemX = -180;
                itemEndX = 70;
                break;
            case 854:
                 screenSize = 5;
            case 800:
                 screenSize = 6;
            case 960:
                screenSize = 7;
                backX = 0;
                shadowX = 130;
                gameNameX = 50;
                gameNameY = 90;
                itemX = -180;
                itemEndX = 70;
                break;
        }
    }

    int keyLeftDis;
    int keyRightDis;

    public int menuCounter = -20;
    private void menuLogic() {
        if (menuCounter < 200) {
            menuCounter++;
            updataOval();
            System.out.println("menuCounter=" + menuCounter);
        }

        if ((menuCounter % 4 == 0) && (menuCounter < 0) && (trans > 0)) {
            trans -= 40;
        }

        if (menuCounter > 26 && menuCounter < 32) {
            waterY -= 30;
        }
        if (menuCounter == 31) {
            Mountain.actId = 1;
            Mountain.initFrame();
            waterY = 30;
        }
        if (menuCounter > 39 && menuCounter < 44) {
            waterY += 30;
        }
        if (menuCounter == 40) {
            Mountain.actId = 2;
            Mountain.initFrame();
        }
        if (menuCounter > 23) {
            updataLight();
        }
//        if (menuCounter > 43) {
////            updataOval();
//        }
//        if ((menuCounter % 8 == 0) && (menuCounter > 43) && (isDrawLight == 0)) {
//            isDrawLight = 1;
//        }
//        if ((isDrawLight > 0) && (menuCounter > 43)) {
//            isDrawLight++;
//            if (isDrawLight == 6) {
//                isDrawLight = 0;
//                addOval();
//            }
//        }
        if ((menuCounter % 4 == 0) && (menuCounter > 100) && (menuCounter < 120) && (trans > 0)) {
            trans -= 40;
        }
        if ((menuCounter % 4 == 0) && (Util.colorTrans[18] < 1) && (menuCounter < 140) && (menuCounter > 120)) {
            Util.colorTrans[18] += 0.1f;
        }
        if ((menuCounter > 140) && (itemX < 0) && (itemSpeed < 50)) {
            itemX += 50;
        }
    }

    public PaintUnit Mountain;
    private PaintUnit Oval;
    int waterY = 0;
    final int START_Y = 140;
    int maskColor = 0x00000000;
    int trans = 0xff;
    public boolean idDrawMainFirst = true;

    private void drawMainFirst(Graphics g) {
        g.setColor(0);
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        if ((menuCounter > 43) && (menuCounter < 70)) {
//            drawOval(g);
            Oval.paint(g, -((SCREEN_WIDTH >> 1) + 20), -(START_Y + waterY));
            Oval.playNextFrame();
            if (Oval.isEndAnimation()) {
                Oval.releaseImages();
            }
        }
        if (menuCounter < 43) {
            Mountain.paint(g, -((SCREEN_WIDTH >> 1) + 20), -(START_Y + waterY));
            if (menuCounter < 0) {
                maskColor = (trans << 24) | (maskColor & 0x00ffffff);
                Util.fillColor(g, maskColor);
            } else {
                trans = 0xff;
                maskColor = 0x00000000;
                Mountain.playNextFrame();
            }
            if (Mountain.actId == 1) {
                Mountain.update();
            }
        }
    }

  //绘制毛茸茸
    final int LIGHT_MAX_COUNT = 8;
    final int LIGHT_DATA_LEN = 5;
    final int LIGHT_X = 0;
    final int LIGHT_Y = 1;
    final int OFFSET_X = 2;
    final int RECODE_X = 3;
    final int STATE = 4;//1为出现，0为消失

    private int lightX = 13;
    private int lightY = 4;

    //当前数量
    private int lightCount = 0;
    private int[][] light = new int[LIGHT_MAX_COUNT][LIGHT_DATA_LEN];
    private int[] lightData = {lightX, lightY, 2, 0, 0};
    private int lightCounter = 0;

    public void updataLight() {
        addLight();
        for (int lightIndex = 0; lightIndex < lightCount; lightIndex++) {
            updataLight(light[lightIndex], lightIndex);
        }
    }

    public void updataLight(int[] light, int lightIndex) {
        if (light[STATE] == 0) {
            return;
        }
        light[LIGHT_Y] -= 3;
        light[LIGHT_X] += light[OFFSET_X];

        if ((light[LIGHT_X] - light[RECODE_X]) > 20) {
            light[OFFSET_X] = -2;
        }
        if ((light[LIGHT_X] - light[RECODE_X]) < -20) {
            light[OFFSET_X] = 2;
        }
        if (light[LIGHT_Y] < -20) {
            removeLight(lightIndex);
        }
    }

    private void removeLight(int lightIndex) {
        light[lightIndex] = light[lightCount - 1];
        light[lightCount - 1] = null;
        light[lightCount - 1] = new int[]{0, 0, 0, 0, 0};
        lightCount--;
    }


    public void addLight() {
        if (lightCount >= LIGHT_MAX_COUNT) {
            return;
        }
        lightCounter++;
        int randAdd = GameContext.getRand(20, 40);
        if ((lightCounter != randAdd) && (lightCounter != 40)) {
            return;
        }
        lightCounter = 0;
        int rand = GameContext.getRand(0, 6);

        System.arraycopy(lightData, 0, light[lightCount], 0, LIGHT_DATA_LEN);

        light[lightCount][LIGHT_X] = 100 + (rand * 60);
        light[lightCount][RECODE_X] = light[lightCount][LIGHT_X];
        light[lightCount][OFFSET_X] = 2;
        light[lightCount][LIGHT_Y] = SCREEN_HEIGHT + 20;
        light[lightCount][STATE] = 1;
        lightCount ++;
    }

    public void drawLight(Graphics g) {
        for (int lightIndex = 0; lightIndex < lightCount; lightIndex++) {
            drawLight(g, light[lightIndex], lightIndex);
        }
    }

    public void drawLight(Graphics g, int[] light, int lightIndex) {
        if (light[STATE] == 0) {
            return;
        }
        smallLight.paint(g, -light[LIGHT_X], -light[LIGHT_Y]);
        smallLight.playNextFrame();
        if (smallLight.isEndAnimation()) {
            smallLight.initFrame();
        }
    }

    //绘制水滴入水中的椭圆。
    final int OVEL_MAX_COUNT = 4;
    final int OVELY_DATA_LEN = 4;
    final int CHANGE_W = 0;
    final int CHANGE_H = 1;
    final int OVEL_COL = 2;
    final int ISDRAW = 3;
    int changeW = 13;
    int changeH = 4;
    int ovelColor = 8;
    int idDrawOvel = 1;
    //当前数量
    private int ovalCount = 0;
    private int[][] ovel = new int[OVEL_MAX_COUNT][OVELY_DATA_LEN];
    private int[] ovalData = {changeW, changeH, ovelColor, idDrawOvel};

    int isDrawLight = 0;

    public void updataOval() {
        if (ovalCount == 0){
            addOval();
        }
        for (int ovelIndex = 0; ovelIndex < ovalCount; ovelIndex++) {
            updataOval(ovel[ovelIndex],ovelIndex);
        }
    }

    public void updataOval(int[] oval,int ovelIndex) {
        if (oval[CHANGE_W] > 160) {
            oval[ISDRAW] = 0;
            return;
        }
        if ((oval[CHANGE_W] > 100)&&(oval[OVEL_COL] > 0)) {
            oval[OVEL_COL] -= 1;
        }
        if (oval[CHANGE_W] < 160) {
            oval[CHANGE_W] += 9;
        }
        if (oval[CHANGE_H] < 25) {
            oval[CHANGE_H] += 1;
        }
    }

    public void addOval() {
        if (ovalCount == OVEL_MAX_COUNT) {
            isDrawLight = -1;
            return;
        }
        System.arraycopy(ovalData, 0, ovel[ovalCount], 0, OVELY_DATA_LEN);
        ovalCount += 1;
    }

    public void drawOval(Graphics g) {
        drawLightOval(g);
        for (int ovalIndex = 0; ovalIndex < ovalCount; ovalIndex++) {
            drawOval(g, ovel[ovalIndex], ovalIndex);
        }
    }

    public void drawOval(Graphics g, int[] ovel, int ovelIndex) {
        if (ovel[ISDRAW] == 0) {
            return;
        }
        int startX = (SCREEN_WIDTH >> 1) - 20;
        int startY = START_Y + waterY;
//        int startY = START_Y + 100 - 25;
        g.setColor(180, 180, 180);
        if (ovel[CHANGE_W] > 100) {
          g.setColor(ovel[OVEL_COL] * 20, ovel[OVEL_COL] * 20, ovel[OVEL_COL] * 20);
        }else{
//
        }


        g.drawArc(startX - ovel[CHANGE_W], startY - ovel[CHANGE_H], 26 + (ovel[CHANGE_W] << 1), 8 + (ovel[CHANGE_H] << 1), 0, 360);
        g.drawArc(startX - ovel[CHANGE_W] - 1, startY - ovel[CHANGE_H] - 1, 28 + (ovel[CHANGE_W] << 1), 10 + (ovel[CHANGE_H] << 1), 0, 360);
    }

    public void drawLightOval(Graphics g) {
        if (isDrawLight < 1) {
            return;
        }
        if (isDrawLight > 3) {
            return;
        }
        System.out.println("绘制亮圈的时候，变量是isDrawLight="+isDrawLight);
        int startX = (SCREEN_WIDTH >> 1) - 9;
        int startY = START_Y + waterY + 5;
//        int startY = START_Y + 100 - 21;

        g.setColor(255, 255, 255);
        g.drawArc(startX - changeW, startY - changeH, 26, 8, 0, 360);
        g.drawArc(startX - changeW -1, startY - changeH - 1, 28, 10, 0, 360);
    }


    int enterKey = 0;
    int itemSpeed;
    private void drawMain(Graphics g) {
        final int MENU_Y = SCREEN_HEIGHT - 60;
        final int MENU_H = 24;
        if(isHaveGameLink)
        {
            g.drawImage(imgGameName, SCREEN_WIDTH, SCREEN_HEIGHT, Graphics.RIGHT | Graphics.BOTTOM);
        }
        if (imgDesktopLink != null && itemIdx == LINK_ITEM) {
            g.drawImage(imgDesktopLink, (SCREEN_WIDTH - imgDesktopLink.getWidth()) >> 1, MENU_Y + ((MENU_H - imgDesktopLink.getHeight()) >> 1), 0);
            return;
        }
//        int itemIndex = itemIdx;
//        int clipX = enterKey == Keys.KEY_NUM5 ? 155 : 0;
//        Util.drawClipImage(g, imgMenuItem, ((SCREEN_WIDTH - ( imgMenuItem.getWidth() >> 1)) >> 1) + offsetX, MENU_Y, clipX, imgItemHeight * itemIndex, imgMenuItem.getWidth() >> 1, imgItemHeight);
        final int itemY = (SCREEN_HEIGHT - imgMenuItem.getHeight());
        Util.drawClipImage(g, imgMenuItem, itemX, itemY, 0, 0, imgMenuItem.getWidth() >> 1, imgMenuItem.getHeight());
        if (enterKey == Keys.KEY_NUM5) {
            Util.drawClipImage(g, imgMenuItem, itemX + 6, itemY + (imgItemHeight * itemIdx), imgMenuItem.getWidth() >> 1, imgItemHeight * itemIdx, imgMenuItem.getWidth() >> 1, imgItemHeight);
        }
    }

    Image imgBuff;
    Graphics gBuf;
    int waveW, waveH;
    int num = 0;
    double angle;
    int wave;

    private void initWave() {
        waveW = reflection.getWidth();
        waveH = reflection.getHeight() + 2;
        imgBuff = Image.createImage(waveW, waveH);
        gBuf = imgBuff.getGraphics();
        gBuf.drawImage(reflection, 0, 0, 0);
    }

    private void drawWave(Graphics g) {
        g.drawImage(reflection, backX, SCREEN_HEIGHT - waveH, 0);
        angle = num * Math.PI / 9;
        double parm = 12.0;
        for (int i = 0; i < waveH; i++) {
            wave = (int) ((i / parm + 1) * Math.sin(waveH / parm * (waveH - i) / (i + 1) + angle));
            gBuf.drawRegion(reflection, 0, i, waveW, 1, 0, 0, i + wave, 0);
        }
        num = ++num % 18;
        g.drawImage(imgBuff, backX, SCREEN_HEIGHT - waveH, 0);
//        g.drawRegion(imgBuff, 0, 0, waveW, waveH, Sprite.TRANS_MIRROR_ROT180, (SCREEN_WIDTH>>1) - (waveW>>1), SCREEN_HEIGHT - waveH, 0);
    }

    private void drawMainBack(Graphics g)
    {
        g.setColor(0);
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        drawWave(g);

        g.drawImage(menuBack, backX, (SCREEN_HEIGHT - menuBack.getHeight()) - waveH, 0);//背景

        g.drawImage(body, backX + menuBack.getWidth() - body.getWidth() - 65, SCREEN_HEIGHT - waveH - body.getHeight() + 15, 0);//身体
        g.drawImage(bodyShadow, backX + menuBack.getWidth() - body.getWidth() - 58, SCREEN_HEIGHT - waveH + 5, 0);//身体虚边
        if (GameContext.version != 21) {
            GameContext.netWork.drawMainScreen(g);
        }
        if (menuCounter < 102) {
            g.setColor(0);
            g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        }
        if ((menuCounter > 100) && (menuCounter < 120)) {
            maskColor = (trans << 24) | (maskColor & 0x00ffffff);
            Util.fillColor(g, maskColor);
        } else if (menuCounter == 120) {
            trans = 0x00;
            maskColor = 0x00000000;
        }

        if (menuCounter < 121) {
            return;
        }
        if ((menuCounter > 120) && (menuCounter < 140)) {
            Util.setTransparentColor(g, true);
        }
        g.drawImage(gameName, gameNameX, gameNameY, 0);
        if ((menuCounter > 120) && (menuCounter < 140)) {
            Util.setTransparentColor(g, false);
        }
        if (menuCounter > 141) {
            g.drawImage(lightShadow1, SCREEN_WIDTH - (body.getWidth() >> 1) - shadowX, 0, 0);
        }
        if (menuCounter > 142) {
            g.drawImage(lightShadow2, SCREEN_WIDTH - body.getWidth() - shadowX, 0, 0);
        }
        if (menuCounter > 143) {
            g.drawImage(lightShadow3, SCREEN_WIDTH - lightShadow3.getWidth(), 0, 0);
        }

    }

    public void logic() {
        if(loading) {
            doLoadingLogic();
            return;
        }
        //#if SMS == 3
//#         if (payGameInit) {
//#             payGameInit = false;
//#             payGameRunning = true;
//#             GameContext.cost.cost(0, 0, 0, 0, 0, code, "");
//#         }
        //#endif
        if (dlg.isAvailable()) {
            dlg.update();
        }
        //#if N5800
//#         switch(ITEM_INDEX[itemIdx]) {
        //#else
        menuLogic();
        switch (itemIdx) {
            //#endif
            case HELP_ITEM:
            case ABOUT_ITEM:
                textLogic();
                break;
        }
    }

    KeyManager keyMgr = new KeyManager();
    private void textLogic() {
        if (txtHeight <= TEXT_H) {
            return;
        }
        if (keyMgr.isPressed(Keys.MASK_UP) || keyMgr.isPressed(Keys.MASK_NUM2)) {
            if (txtOffsetY > 0) {
                txtOffsetY -= FishFont.LINE_HEIGHT >> 1;
                txtOffsetY = (txtOffsetY < 0) ? 0 : txtOffsetY;
            }
        }
        else if(keyMgr.isPressed(Keys.MASK_DOWN) || keyMgr.isPressed(Keys.MASK_NUM8)) {
            if (txtOffsetY < txtHeight - TEXT_H) {
                txtOffsetY += FishFont.LINE_HEIGHT >> 1;
                txtOffsetY = (txtOffsetY > txtHeight - TEXT_H) ? txtHeight - TEXT_H : txtOffsetY;
            }
        }
    }

    //#if SMS == 3
//#     private boolean payGameInit = false;
//#     private boolean payGameRunning = false;
    //#endif

    private void doLoadingLogic() {
        LoadingPage.working = false;
        switch(loadingCnt) {
            case 0:
                MusicPlayer.getInstance().kill();
                MainCanvas.init();
            case 1:
                loadImages();
                break;
            case 2:
                loadSpLink();
                loadGameLink();
                loadResources();
                break;
            case 3:
                loadRms();
                //#if N5800
//#                 if (GameContext.version == 2) {
//#                     ITEM_INDEX = new int[]{0, 1, 2, 3, 4, 6, 5};
//#                 }
//#                 else {
//#                     ITEM_INDEX = new int[ITEM_CNT];
//#                     for (int index = 0; index < ITEM_INDEX.length; index++) {
//#                         ITEM_INDEX[index] = index;
//#                     }
//#                 }
                //#endif
                //#if UPDATA == 1
//#                 itemCnt += 2;
                //#endif
                //#if SMS == 3
//#                 GameContext.cost.init(GameContext.midlet, GameContext.display, this, GameContext.canvas, 0, 0, 0, 0, null, null, null, null);
//#                 if (GameContext.version == 26) {
//#                     loadSms();
//#                 }
                //#endif
                imgItemHeight = 31;
                break;
        }

        if(loadingCnt < 4) {
            loadingCnt++;
        } else {
            if(GameContext.rmsData != null && GameContext.rmsData.length > 0)
            {
                itemIdx = LOAD_ITEM;
            }
            loading = false;
            MusicPlayer.getInstance().reload("main.ogg", true);
            MainCanvas.removePage();
        }
    }

    final private void drawVolume(Graphics g) {
        drawFullScreenMask(g);
        final int curSoundLv = MusicPlayer.getInstance().curSoundLv;
        //绘制音量图标
        int curx = SCREEN_WIDTH >> 2;
        int cury = (SCREEN_HEIGHT >> 1) - imgSoundIcon.getHeight();
        int w = imgSoundIcon.getWidth();
        int h = imgSoundIcon.getHeight();
        g.drawImage(imgSoundIcon, curx, cury, Graphics.LEFT | Graphics.TOP);
        cury += h;
        Util.drawRegion(g, imgSoundIcon, 0, 0, w, h, Sprite.TRANS_MIRROR_ROT180, curx, cury, Graphics.LEFT | Graphics.TOP);
        //绘制5个矩形区域
        curx = (SCREEN_WIDTH >> 2) + imgSoundIcon.getWidth() + 10;
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
        w = 16;
        h = 36;
        color = (curSoundLv > 2) ? 0x85ffe1 : 0x666869;
        g.setColor(color);
        g.fillRect(curx, cury, w, h);
        g.fillRect(curx - 1, cury + 1, w + 2, h - 2);

        curx += 32;
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

        curx = (SCREEN_WIDTH >> 2) + imgSoundIcon.getWidth() + 15;
        cury = (SCREEN_HEIGHT >> 1) + 20;
        w = 135;
        h = 4;
        g.setColor(0x050e2a);
        g.fillRect(curx, cury, w, h);

        //绘制滚动游标
        int lvX = curSoundLv * w / MusicPlayer.ALL_SOUND_LV;
        lvX += curx;
        w = imgSoundCursor.getWidth();
        h = imgSoundCursor.getHeight();
        int lvY = cury - w + 2;
        g.drawImage(imgSoundCursor, lvX, lvY, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, imgSoundCursor, 0, 0, w, h, Sprite.TRANS_MIRROR, lvX, lvY, Graphics.LEFT | Graphics.TOP);

        final int BTN_X = SCREEN_WIDTH - imgBtn.getWidth() + 10;
        final int BTN_Y = SCREEN_HEIGHT - imgBtn.getHeight() - 3;
        g.drawImage(imgBtn, BTN_X, BTN_Y, 0);
        Util.drawClipImage(g, imgBtnWord, BTN_X + 12, BTN_Y + 7, 0, 0, imgBtnWord.getWidth(), imgBtnWord.getHeight() / 3);
    }

    final private void drawHelp(Graphics g) {
        drawText(g, GameContext.helpTxt);
        drawMenuButtons(g, false, true, false);
    }

    final private void drawAbout(Graphics g) {
        drawText(g, GameContext.aboutTxt);
        drawMenuButtons(g, false, true, false);
    }

    final private void drawSpLink(Graphics g) {
        drawFrame(g);
        font.drawCharsAlignLeftWithoutFont(g, linkStr, MENU_FRAME_X + TEXT_OFFX, MENU_FRAME_Y + TEXT_OFFY, TEXT_W);
        if (isDesktopLink) {
            drawMenuButtons(g, true, true, false);
        }
        else {
            drawMenuButtons(g, true, true, true);
        }
    }

    final private void drawText(Graphics g, char[] txt) {
        drawFrame(g);
        if (txt == null || txt.length == 0) {
            return;
        }
        final int TEXT_X = MENU_FRAME_X + TEXT_OFFX;
        final int TEXT_Y = MENU_FRAME_Y + TEXT_OFFY;
        g.setClip(TEXT_X, TEXT_Y, TEXT_W, TEXT_H);
        g.setColor(0xffffff);
        font.drawCharsAlignLeft(g, txt, TEXT_X, TEXT_Y - txtOffsetY, TEXT_W);
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        if (txtHeight <= TEXT_H) {
            return;
        }
        final int ScrollBarRightOffsetX = 27;
        final int ScrollBarOffsetY = 52;
        final int ScrollBarH = 160;
        FishFont.drawScrollBar(g, MENU_FRAME_X + MENU_FRAME_W - ScrollBarRightOffsetX, MENU_FRAME_Y + ScrollBarOffsetY, ScrollBarH, txtOffsetY, txtHeight - TEXT_H);
    }


    @Override
    public void keyReleased(int keyCode) {
        switch (keyCode) {
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                enterKey = 0;
                break;
        }
    }

    @Override
    public void keyPressed(int keyCode) {
        //#if SMS == 3
//#         if (payGameRunning) {
//#             return;
//#         }
        //#endif
         MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
        if (isStartCartoon) {
            //#if N5800
//#             doStartCartoon(keyCode);
            //#endif
            return;
        }
        if(dlg.isAvailable())
        {
            dlg.keyPressed(keyCode);
            return;
        }
        if(isLinkState)
        {
            gameLinkKeypressed(keyCode);
            return;
        }
        if(subMenu) {
            doSubMenuKey(keyCode);
            return;
        }

        switch(keyCode) {
            case Keys.KEY_RIGHT_SOFT:
                if(!isHaveGameLink)
                {
                    return;
                }
                isLinkState = true;
                canExit = false;
                linkIndex = 0;
                break;
            case Keys.KEY_NUM4:
            case Keys.KEY_LEFT:
                //#if UPDATA == 1
//#             {
//#                 int index = getIndex(itemIdx);
//#                 index--;
//#                 if(index < 0) {
//#                     itemIdx = EXIT_ITEM;
//#                 }
//#                 else {
//#                     itemIdx = QQ_ITEM_INDEX[index];
//#                 }
//#             }
                //#else
                if (isDesktopLink && itemIdx == EXIT_ITEM - 1) {
                    itemIdx = LINK_ITEM;
                }
                else if (isDesktopLink && itemIdx == LINK_ITEM - 1) {
                    itemIdx = ABOUT_ITEM;
                }
                else if(itemIdx < 0) {
                    itemIdx = EXIT_ITEM;
                }
                //#endif
                isKeyLeft = true;
                keyLeftDis = 2;
                break;

            case Keys.KEY_NUM6:
            case Keys.KEY_RIGHT:
                //#if UPDATA == 1
//#             {
//#                 int index = getIndex(itemIdx);
//#                 index++;
//#                 if(index >= QQ_ITEM_INDEX.length) {
//#                     itemIdx = 0;
//#                 }
//#                 else {
//#                     itemIdx = QQ_ITEM_INDEX[index];
//#                 }
//#             }
                //#else
                if(isDesktopLink && itemIdx == EXIT_ITEM)  {
                    itemIdx = LINK_ITEM;
                }
                else if (isDesktopLink && itemIdx == LINK_ITEM + 1) {
                    itemIdx = EXIT_ITEM;
                }
                //#endif
                isKeyRight = true;
                keyRightDis = 2;
                break;

            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                enterKey = Keys.KEY_NUM5;
                doFireKey();
                return;
        }
    }

    //#if UPDATA == 1
//#     private int getIndex(int itemIdx) {
//#         int index = 0;
//#         for (index = 0; index < QQ_ITEM_INDEX.length; index++) {
//#             if (QQ_ITEM_INDEX[index] == itemIdx) {
//#                 return index;
//#             }
//#         }
//#         return index;
//#     }
    //#endif

    final private void doSubMenuKey(int keyCode) {
        if(dlg.isAvailable()) {
            dlg.keyPressed(keyCode);
            return;
        }

        //#if N5800
//#         switch(ITEM_INDEX[itemIdx]) {
        //#else
        switch(itemIdx) {
        //#endif
            case SET_VOLUME_ITEM:
                doSetVolumeKey(keyCode);
                break;

            case HELP_ITEM:
                doTextKey(keyCode);
                break;

            case ABOUT_ITEM:
                doTextKey(keyCode);
                break;

            case LINK_ITEM:
                doSpLinkKey(keyCode);
                break;

            //#if UPDATA == 1
//#             case UPDATA_ITEM:
//#                 doUpdateItem(keyCode);
//#                 break;
            //#endif
        }
    }

    final private void doSetVolumeKey(int keyCode) {
        switch(keyCode) {
            case Keys.KEY_NUM4:
            case Keys.KEY_LEFT:
                musicPlayer.downSoundLevel();
                return;

            case Keys.KEY_NUM6:
            case Keys.KEY_RIGHT:
                musicPlayer.upSoundLevel();
                return;

            case Keys.KEY_RIGHT_SOFT:
                subMenu = false;
                return;
        }
    }

    final private void doTextKey(int keyCode) {
        switch(keyCode) {
//            case Keys.KEY_UP:
//            case Keys.KEY_NUM2:
//                if(txtHeight <= TEXT_H) {
//                    return;
//                }
//
//                txtOffsetY -= FishFont.LINE_HEIGHT;
//                if(txtOffsetY < 0) {
//                    txtOffsetY = 0;
//                }
//                return;
//
//            case Keys.KEY_DOWN:
//            case Keys.KEY_NUM8:
//                if(txtHeight <= TEXT_H) {
//                    return;
//                }
//                txtOffsetY += FishFont.LINE_HEIGHT;
//                if(txtOffsetY >= txtHeight -  2 * FishFont.LINE_HEIGHT) {
//                    txtOffsetY = txtHeight - 2 * FishFont.LINE_HEIGHT;
//                }
//                return;
            case Keys.KEY_RIGHT_SOFT:
                subMenu = false;
                txtOffsetY = 0;
                return;
        }
    }

    final private void startNewGame() {
        release();
        MissionManager.getInstance().init();
        MusicPlayer.getInstance().kill();
        MainCanvas.removePage();
        GamePage page = GameContext.page;
        MainCanvas.addPage(GameContext.page);
        page.startGame();
    }

    final private void doFireKey() {
        font.initOffset();
        //#if N5800
//#         switch(ITEM_INDEX[itemIdx]) {
        //#else
        switch(itemIdx) {
        //#endif
            case NEW_GAME_ITEM:
                if (GameContext.isHaveRms())
                {
                    subMenu = true;
                    dlg.showButtonBox("开始新游戏将会覆盖原有数据。&是否重新开始?".toCharArray());
                    dlg.btnBoxOp = Dialog.NEW_GAME_OP;
                    return;
                }
                //#if SMS == 3
//#                 payGameInit = true;
                //#else
                startNewGame();
                //#endif
                return;

            case LOAD_ITEM:
                if (!GameContext.isHaveRms())
                {
                    dlg.showMessageBox("您没有存档".toCharArray());
                    return;
                }
                release();
                MainCanvas.removePage();
                GamePage gamePage = new GamePage();
                MusicPlayer.getInstance().kill();
                MusicPlayer.getInstance().delMusic();
                MainCanvas.addPage(gamePage);
                GameContext.page = gamePage;
                gamePage.startLoad();
                return;

            case SET_VOLUME_ITEM:
                subMenu = true;
                return;

            case HELP_ITEM:
                subMenu = true;
                txtOffsetY = 0;
                if (GameContext.helpTxt == null) {
                    txtHeight = 0;
                    return;
                }
                txtHeight = font.getCharsHeight(GameContext.helpTxt, TEXT_W);
                return;

            case ABOUT_ITEM:
                subMenu = true;
                txtOffsetY = 0;
                if (GameContext.aboutTxt == null) {
                    txtHeight = 0;
                    return;
                }
                txtHeight = font.getCharsHeight(GameContext.aboutTxt, TEXT_W);
                return;

            case LINK_ITEM:
                subMenu = true;
                return;

            //#if UPDATA == 1
//#             case QQ_HOME_ITEM:
//#                 GameContext.qqForum.startMBox(MBoxClient.CONN_TYPE_NOTICE_NETWORK, MBoxClient.PAGE_MAIN);
//#                 break;
//#
//#
//#             case UPDATA_ITEM:
//#                 itemIdx = UPDATA_ITEM;
//#                 subMenu = true;
//#                 dataGetting = true;
//#                 dataGettingError = false;
//#                 GameContext.qqForum.requestData(MBoxClient.REQUEST_TYPE_RANK_WEEK);
//#                 break;
            //#endif

            case EXIT_ITEM:
                dlg.showButtonBox("是否确定退出游戏?".toCharArray());
                dlg.btnBoxOp = Dialog.EXIT_GAME_OP;
                return;
        }
    }

    public void doReturnButtonFire()
    {
        if (dlg.btnBoxOp == Dialog.NEW_GAME_OP)
        {
            subMenu = false;
        }
    }

    //选项中的网络链接，及，退出游戏时的链接显示
    private boolean isDesktopLink = false;
    private char[] linkStr = null;
    private String linkName = null;
    private Image imgDesktopLink = null;
    int imgItemHeight;
    final private void loadSpLink() {
        //#if SMS != 0
        linkName = GameContext.pushTitle;
        isDesktopLink = GameContext.cost.isDesktopLink();
        if (isDesktopLink) {
            itemCnt++;
            linkName = GameContext.cost.desktopLinkName();
            //#if E6 || E2 || V8
//#             char[] c = linkName.toCharArray();
//#             byte[] buf = new byte[c.length];
//#             for(int index = 0; index < c.length; index++)
//#             {
//#                 buf[index] = (byte) (c[index] & 0xff);
//#             }
//#             try {
//#                 linkName = new String(buf, "UTF-8");
//#             } catch (Exception e) {
//#             }
            //#endif
        }

        StringBuffer buf = new StringBuffer();
        buf.append("是否登录“");
        buf.append(linkName);
        buf.append("”？会自动打开网络链接，");
        //#if N5800 || N7370 || N8 || X3
//#         buf.append("退出应用程序，");
        //#endif
        buf.append("是否确定？");
        linkStr = buf.toString().toCharArray();

        if (!isDesktopLink || linkName == null || linkName.equals("QQ游戏中心") || linkName.equals("")) {
            return;
        }

        char[] chs = linkName.toCharArray();
        final int DIS = 2;
        final int wordW = FishFont.FONT_SMALL.charsWidth(chs, 0, chs.length) + chs.length * DIS;
        final int wordH = FishFont.FONT_SMALL.getHeight() + 4;
        int wordX = 0;
        int wordY = 2;
        final int[] offsetOutX = {1, 0, 1};
        final int[] offsetOutY = {0, 1, 1};
        imgDesktopLink = Image.createImage(wordW, wordH);
        Graphics gh = imgDesktopLink.getGraphics();
        gh.setFont(FishFont.FONT_SMALL);
        gh.setColor(0x00ffff);
        gh.fillRect(0, 0, wordW, wordH);
        for (int index = 0; index < chs.length; index++) {
            gh.setColor(0);
            for (int im = 0; im < offsetOutX.length; im++) {
                gh.drawChar(chs[index], wordX + offsetOutX[im], wordY + offsetOutY[im], 0);
            }
            gh.setColor(0xffffff);
            gh.drawChar(chs[index], wordX, wordY, 0);
            wordX += FishFont.FONT_SMALL.charWidth(chs[index]) + DIS;
        }
        int[] imgBuf = new int[wordW * wordH];
        imgDesktopLink.getRGB(imgBuf, 0, wordW, 0, 0, wordW, wordH);
        for (int index = 0; index < imgBuf.length; index++) {
            if ((imgBuf[index] & 0xffffff) == 0x00ffff) {
                imgBuf[index] = 0;
            }
        }
        imgDesktopLink = Image.createRGBImage(imgBuf, wordW, wordH, true);

        //#endif
    }

    final private void doSpLinkKey(int keyCode) {
        switch(keyCode) {
            case Keys.KEY_LEFT_SOFT:
                doLinkFire();
                return;

            case Keys.KEY_RIGHT_SOFT:
                if (isDesktopLink)
                {
                    subMenu = false;
                }
                else
                {
                     GameContext.canvas.live = false;
                }
                return;
        }
    }

    final private void doLinkFire() {
        try {
            if (isDesktopLink) {
                //#if N5800 || N7370 || N8 || X3
//#                     GameContext.canvas.live = false;
                //#endif
                //#if SMS == 1 || SMS == 2
                String url = GameContext.cost.desktopLink();
                //#else
//#                 String url = GameContext.pushUrl;
                //#endif
                GameContext.midlet.platformRequest(url);
            } else {
                //#if !(E2 || E6 || K790)
                    GameContext.canvas.live = false;
                //#endif
                GameContext.midlet.platformRequest(GameContext.pushUrl);
                //#if E2 || E6 || K790
//#                     GameContext.canvas.live = false;
                //#endif
            }
        } catch (Exception ex) {
        }
    }

    Image[] imgGame;
    Image imgGameName;
    Image imgGamePoint;
    Image imgGameNum;
    Image imgGameNumBack;

    Image menuBack;//山洞背景
    Image body;//男女主角
    Image gameName;//游戏标题
    Image bodyShadow;//人物水印
    Image reflection;//水影
    Image lightShadow1;//水影
    Image lightShadow2;//水影
    Image lightShadow3;//水影
    Image imgMenuItem;//菜单文字
    Image shadow1;

    /**
     * 初始化游戏连接
     */
    private void loadGameLink()
    {
        try
        {
            //读取数据
            byte[] buf = Util.decryptDataWithMd5(Util.readFully("/1.link"));
            DataInputStream dataIn = new DataInputStream(new ByteArrayInputStream(buf));
            int cnt = dataIn.readByte() & 0xff;
            imgGame = new Image[cnt];
            gameStr = new String[cnt];
            gameWapLink = new String[cnt];
            for(int index = 0; index < cnt; index++)
            {
                byte[] imgBuf = new byte[dataIn.readShort() & 0xffff];
                dataIn.read(imgBuf);
                imgGame[index] = Image.createImage(imgBuf, 0, imgBuf.length);
                gameStr[index] = dataIn.readUTF();
                gameWapLink[index] = dataIn.readUTF();
                if (GameContext.version == 2) {
                    gameWapLink[index] += GameContext.midlet.getAppProperty("Term");
                }
            }
            if(cnt <= 0)
            {
                isHaveGameLink = false;
                return;
            }
            Hashtable img = new Hashtable();
            dataIn.readShort();
            int count = dataIn.readByte() & 0xff;
            for(int index = 0; index < count; index++)
            {
                String str = dataIn.readUTF();
                int imgDataLength = dataIn.readShort();
                byte[] imgBuf = new byte[imgDataLength];
                dataIn.read(imgBuf);
                Image i = Image.createImage(imgBuf, 0, imgBuf.length);
                img.put(str, i);
            }
            imgGameName = (Image)img.get("0.png");
            imgGamePoint= (Image)img.get("1.png");
            imgGameNum= (Image)img.get("3.png");
            imgGameNumBack= (Image)img.get("2.png");
            isHaveGameLink = true;
            img = null;
        }
        catch (Exception e)
        {
            isHaveGameLink = false;
        }
    }
    private final int CHANGE_GAME_TIME = 40;
    private int showGameItem;
    private int linkKeyLeftDis = 0;
    private int linkKeyRightDis = 0;
    private void drawGameLink(Graphics g)
    {
        int roundWidth = imgGameNumBack.getWidth();
        int roundHeight = imgGameNumBack.getHeight() >> 1;
        int roundX = (SCREEN_WIDTH >> 1) - (imgGame[linkIndex].getWidth() >> 1);
        int roundDis = (imgGame[linkIndex].getWidth() - roundWidth) / (imgGame.length - 1);
        int numWidth = imgGameNum.getWidth() / imgGame.length;
        int numHeight = imgGameNum.getHeight();
        int wordX = 10;
        //#if E62
//#         int pointY = 170;
        //#else
        int pointY = 214;
        //#endif
        g.setColor(0);
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        g.drawImage(imgGame[linkIndex], SCREEN_WIDTH >> 1, SCREEN_HEIGHT >> 4, Graphics.HCENTER | Graphics.TOP);
        g.setColor(0xffffff);
        font.drawCharsAlignLeft(g, gameStr[linkIndex].toCharArray(), roundX, (SCREEN_HEIGHT >> 4)+imgGame[linkIndex].getHeight() + 10, SCREEN_WIDTH - (roundX << 1));
        g.drawImage(imgGamePoint, wordX - linkKeyLeftDis, pointY, 0);
        Util.drawRegion(g, imgGamePoint, 0, 0, imgGamePoint.getWidth(), imgGamePoint.getHeight(), 2, SCREEN_WIDTH - wordX + linkKeyRightDis, pointY, Graphics.RIGHT | Graphics.TOP);
        linkKeyLeftDis = 0;
        linkKeyRightDis = 0;
        int lineXDis = 30;
        //#if E62
//#         int lineY = pointY + 30;
        //#else
        int lineY = pointY + 50;
        //#endif
        int lineHeight = 11;
        g.setColor(0xdc1617);
        int lineWidth = SCREEN_WIDTH - (lineXDis << 1);
        int eachAdd = (lineWidth - 2) / CHANGE_GAME_TIME;
        g.drawRect(lineXDis - 1, lineY - 1, lineWidth + 2, lineHeight + 2);
        g.setColor(0xa6a6a6);
        g.fillRect(lineXDis + 1, lineY + 1, showGameItem, lineHeight - 2);
        showGameItem += eachAdd;
        if(showGameItem >= (lineWidth - 2))
        {
            showGameItem = 0;
            linkIndex ++;
            if(linkIndex >= imgGame.length)
            {
                linkIndex = 0;
            }
        }
        for(int index = 0, cnt = imgGame.length; index < cnt; index++)
        {
            Util.drawClipImage(g, imgGameNum, roundX + 6 + roundDis * index, pointY + 2, index * numWidth, 0, numWidth, numHeight);
            if(linkIndex == index)
            {
                Util.drawClipImage(g, imgGameNumBack, roundX + roundDis * index, pointY - 2, 0, 0, roundWidth, roundHeight);
                continue;
            }
            Util.drawClipImage(g, imgGameNumBack, roundX + roundDis * index, pointY - 2, 0, roundHeight, roundWidth, roundHeight);
        }
        g.setColor(0xffffff);
        if (canExit) {
            font.drawString(g, "退出", SCREEN_WIDTH, SCREEN_HEIGHT, Graphics.RIGHT | Graphics.BOTTOM);
        }
        else {
            font.drawString(g, "返回", SCREEN_WIDTH, SCREEN_HEIGHT, Graphics.RIGHT | Graphics.BOTTOM);
        }
        font.drawString(g, "免费下载", 0, SCREEN_HEIGHT, Graphics.LEFT | Graphics.BOTTOM);
    }

    private void gameLinkKeypressed(int keyCode)
    {
        MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
        switch(keyCode)
        {
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
            case Keys.KEY_LEFT_SOFT:
                try
                {
                    GameContext.midlet.platformRequest(gameWapLink[linkIndex]);
                }
                catch (Exception e)
                {
                }
                break;
            case Keys.KEY_RIGHT_SOFT:
                if (canExit) {
                    GameContext.canvas.live = false;
                }
                else {
                    isLinkState = false;
                }
                break;
            case Keys.KEY_LEFT:
            case Keys.KEY_NUM4:
                if(linkIndex > 0)
                {
                    linkIndex --;
                }
                else
                {
                    linkIndex = imgGame.length - 1;
                }
                showGameItem = 0;
                linkKeyLeftDis = 2;
                break;
            case Keys.KEY_RIGHT:
            case Keys.KEY_NUM6:
                if(linkIndex < imgGame.length - 1)
                {
                    linkIndex ++;
                }
                else
                {
                    linkIndex = 0;
                }
                showGameItem = 0;
                linkKeyRightDis = 2;
                break;
        }
    }

    @Override
    public void pointerReleased(int px, int py) {
        enterKey = 0;
        if (dlg.isAvailable()) {
            return;
        }
        if (isLinkState) {
            return;
        }
        if(subMenu) {
            return;
        }
        if (menuCounter < 130){
            return;
        }
        doMenuItemReleased(px, py);
    }

    private void doMenuItemReleased(int px, int py) {
        final int MENU_Y = (SCREEN_HEIGHT - imgMenuItem.getHeight());
        int itemW = imgMenuItem.getWidth() >> 1;
        final int ITEM_H = 31;
        for (int itemIndex = 0; itemIndex < itemCnt; itemIndex++) {
            if (itemIndex == 0) {
                itemW = 110;
            } else if (itemIndex == 1) {
                itemW = imgMenuItem.getWidth() >> 1;
            } else {
                itemW = imgMenuItem.getWidth() >> 2;
            }
            if (GameContext.point(px, py, itemX, MENU_Y + itemIndex * ITEM_H, itemW, ITEM_H)) {
                keyReleased(Keys.KEY_FIRE);
                return;
            }
        }
    }


    //#if POINT == 1
    public void pointerPressed(int px, int py)
    {
        if(dlg.isAvailable())
        {
            dlg.pointerPressed(px, py);
            return;
        }
        if (isLinkState) {
            gameLinkPoint(px, py);
            return;
        }
        if(subMenu) {
            doSubMenuPoint(px, py);
            return;
        }
        if (menuCounter < 130) {
            return;
        }
        doMenuItemPoint(px, py);
        if (GameContext.version != 21) {
            GameContext.netWork.doMainScreenPointerPressed(px, py);
        }
    }

    private void doMenuItemPoint(int px, int py) {
        final int MENU_Y = (SCREEN_HEIGHT - imgMenuItem.getHeight());
        int itemW = imgMenuItem.getWidth() >> 1;
        final int ITEM_H = 31;
        for (int itemIndex = 0; itemIndex < itemCnt; itemIndex++) {
            if (itemIndex == 0) {
                itemW = 110;
            } else if (itemIndex == 1) {
                itemW = imgMenuItem.getWidth() >> 1;
            } else {
                itemW = imgMenuItem.getWidth() >> 2;
            }
            if (GameContext.point(px, py, itemX, MENU_Y + itemIndex * ITEM_H, itemW, ITEM_H)) {
                itemIdx = itemIndex;
                keyPressed(Keys.KEY_FIRE);
                return;
            }
        }
    }

    private void gameLinkPoint(int px, int py)
    {
        int wordX = 10;
        int pointY = 214;
        int wordWidth = 40;
        int wordHeight = 20;

        if(GameContext.point(px, py, wordX, pointY, imgGamePoint.getWidth(), imgGamePoint.getHeight()))
        {
            gameLinkKeypressed(Keys.KEY_LEFT);
            return;
        }
        if(GameContext.point(px, py, SCREEN_WIDTH - wordX - imgGamePoint.getWidth(), pointY, imgGamePoint.getWidth(), imgGamePoint.getHeight()))
        {
            gameLinkKeypressed(Keys.KEY_RIGHT);
            return;
        }
        if(GameContext.point(px, py, 0, SCREEN_HEIGHT - wordHeight, wordWidth, wordHeight))
        {
            gameLinkKeypressed(Keys.KEY_LEFT_SOFT);
            return;
        }
        if(GameContext.point(px, py, SCREEN_WIDTH - wordWidth, SCREEN_HEIGHT - wordHeight, wordWidth, wordHeight))
        {
            gameLinkKeypressed(Keys.KEY_RIGHT_SOFT);
            return;
        }
    }

    final private void doSubMenuPoint(int px, int py) {
        if (dlg.isAvailable()) {
            dlg.pointerPressed(px, py);
            return;
        }

        switch (itemIdx) {
            case SET_VOLUME_ITEM:
                if (GameContext.point(px, py, SCREEN_WIDTH - BTN_POINT_W, SCREEN_HEIGHT - BTN_POINT_H, BTN_POINT_W, BTN_POINT_H)) {
                     MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                    subMenu = false;
                }
                break;

            case HELP_ITEM:
            case ABOUT_ITEM:
                doButtonPoint(px, py, false, true);
                break;

            case LINK_ITEM:
                doButtonPoint(px, py, true, true);
                break;
        }
    }

    final int BTN_POINT_W = 80;
    final int BTN_POINT_H = 48;
    private void doButtonPoint(int px, int py, boolean leftState, boolean rightState) {
        final int BTN_LEFT_X = MENU_FRAME_X - (BTN_POINT_W >> 1);
        final int BTN_RIGHT_X = MENU_FRAME_X + MENU_FRAME_W - (BTN_POINT_W >> 1);
        final int BTN_BOTTOM_Y = MENU_FRAME_Y + MENU_FRAME_H + 10 - (BTN_POINT_H >> 1);
        if (leftState && GameContext.point(px, py, BTN_LEFT_X, BTN_BOTTOM_Y, BTN_POINT_W, BTN_POINT_H)) {
            keyPressed(Keys.KEY_LEFT_SOFT);
            return;
        }
        if (rightState && GameContext.point(px, py, BTN_RIGHT_X, BTN_BOTTOM_Y, BTN_POINT_W, BTN_POINT_H)) {
            keyPressed(Keys.KEY_RIGHT_SOFT);
            return;
        }
    }

    public boolean pointerDragged(int startX, int startY, int endX, int endY) {
        if (isStartCartoon) {
            return false;
        }

        if(dlg.isAvailable())
        {
            return false;
        }
        if (isLinkState) {
            return false;
        }

        if(subMenu) {
            return doSubMenuDragged(startX, startY, endX, endY);
        }
        return false;
    }

    final private boolean doSubMenuDragged(int startX, int startY, int endX, int endY) {
        if(dlg.isAvailable()) {
            return false;
        }

        //#if N5800
//#         switch(ITEM_INDEX[itemIdx]) {
        //#else
        switch(itemIdx) {
       //#endif
            case SET_VOLUME_ITEM:
                return doVolumeDragged(startX, startY, endX, endY);

            case HELP_ITEM:
            case ABOUT_ITEM:
                return doTextDragged(startX, startY, endX, endY);
        }
        return false;
    }

    private boolean doVolumeDragged(int startX, int startY, int endX, int endY) {
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

    private boolean doTextDragged(int startX, int startY, int endX, int endY) {
        if (txtHeight <= TEXT_H) {
            return false;
        }

        if (!GameContext.point(startX, startY, MENU_FRAME_X, MENU_FRAME_Y, MENU_FRAME_W, MENU_FRAME_H)) {
            return false;
        }
        if (!GameContext.point(endX, endY, MENU_FRAME_X, MENU_FRAME_Y, MENU_FRAME_W, MENU_FRAME_H)) {
            return false;
        }

        final int DRAG_LIMIT = FishFont.LINE_HEIGHT >> 1;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        txtOffsetY -= len * DRAG_LIMIT;
        txtOffsetY = (txtOffsetY > txtHeight - TEXT_H) ? txtHeight - TEXT_H : txtOffsetY;
        txtOffsetY = (txtOffsetY < 0) ? 0 : txtOffsetY;
        return true;
    }
    //#endif

    //#if SMS == 3
//#     public void remindProcess(int i, int i1, int i2) {
//#     }
//#
//#     public void remindResult(int state, String str) {
//#         payGameRunning = false;
//#         switch(state) {
//#             case CostListener.COST_OK:
//# //                dlg.showMessageBox(str.toCharArray());
//#                 startNewGame();
//#                 break;
//#
//#             case CostListener.COST_FAIL:
//#                 if (GameContext.version == 26) {
//#                     dlg.showMessageBox("激活失败".toCharArray());
//#                     return;
//#                 }
//#                 dlg.showMessageBox(str.toCharArray());
//#                 break;
//#         }
//#     }
//#
//#     public void changeSmsData(int i, String string, int i1) {
//#     }
//#
//#     String code = "";
//#     private void loadSms() {
//#         try {
//#             final String SMS_FILE = "/sms.fs";
//#             byte[] encryptData = Util.readFully(SMS_FILE);
//#             byte[] data = Util.decryptDataWithMd5(encryptData);
//#             ByteArrayInputStream byteIn = new ByteArrayInputStream(data);
//#             DataInputStream dataIn = new DataInputStream(byteIn);
//#             int msgCnt = dataIn.readShort();
//#             dataIn.readShort();
//#
//#             int dataLen = msgCnt << 1;
//#             char[][] msgDescs = new char[msgCnt][];
//#             int[] msgIdxs = new int[msgCnt];
//#             char[][] nums = new char[dataLen][];
//#             char[][] ms = new char[dataLen][];
//#             int[] cnts = new int[dataLen];
//#             int[] ps = new int[dataLen];
//#             int idata = 0;
//#             for(int i = 0; i < msgCnt; i++) {
//#                 msgDescs[i] = dataIn.readUTF().toCharArray();
//#                 nums[idata] = dataIn.readUTF().toCharArray();
//#                 ms[idata] = dataIn.readUTF().toCharArray();
//#                 cnts[idata] = dataIn.readShort();
//#                 ps[idata] = dataIn.readShort();
//#                 msgIdxs[i] = idata;
//#                 idata++;
//#                 boolean hasOne = dataIn.readBoolean();
//#                 if(!hasOne) {
//#                     continue;
//#                 }
//#                 nums[idata] = dataIn.readUTF().toCharArray();
//#                 ms[idata] = dataIn.readUTF().toCharArray();
//#                 cnts[idata] = dataIn.readShort();
//#                 ps[idata] = dataIn.readShort();
//#
//#                 //把高位标识一下就可以啦
//#                 msgIdxs[i] |= 0x010000;
//#                 idata++;
//#             }
//#
//#             char[][] msgs = new char[idata][];
//#             System.arraycopy(ms, 0, msgs, 0, idata);
//#
//#             code = new String(msgs[msgIdxs[0] & 0xFFFF]);
//#         }catch(Exception ex) {
//#         }
//#     }
    //#endif

    //#if UPDATA == 1
//#     //信息获取中
//#     private boolean dataGetting;
//#     private boolean dataGettingError;
//#     //积分榜单信息
//#     String[][] rankNameScore;
//#
//#     public void qqListener(int result, String msg, int type)
//#     {
//#         dataGetting = false;
//#         if(result != 0) {
//#             dataGettingError = true;
//#             return;
//#         }
//#         if(type == com.tencent.mbox.cp.InfoListener.NOTIFY_TYPE_GET_RANK)
//#         {
//#             String[] ranks = Util.getString("|" + msg, '#');
//#             String[][] buf = new String[ranks.length - 1][3];
//#             for(int index = 0,cnt = buf.length; index < cnt; index++)
//#             {
//#                 buf[index] = Util.getString(ranks[index], '|');
//#                 buf[index][0] = (index + 1) + "";
//#             }
//#
//# //            //测试
//# //            buf = new String[1][3];
//# //            buf[0][0] = "1";
//# //            buf[0][1] = "100";
//# //            buf[0][2] = "水舞者";
//# //            menuView.getRankInfo(buf);
//#
//#             rankNameScore = buf;
//#         }
//#     }
//#
//#     /**
//#      * 绘制QQ榜单
//#      * @param g
//#      * @param rankNameScore
//#      */
//#     private void drawUpData(Graphics g)
//#     {
//#         drawRankData(g);
//#     }
//#
//#     /**
//#      * 绘制QQ榜单
//#      * @param g
//#      * @param rankNameScore
//#      * return 是否返回了信息
//#      */
//#     public void drawRankData(Graphics g)
//#     {
//#         drawFrame(g);
//#         if(frameHeight < FRAME_HEIGHT) {
//#             frameHeight += FRAME_STEP;
//#             if(frameHeight >= FRAME_HEIGHT) {
//#                 frameHeight = FRAME_HEIGHT;
//#             }
//#             return;
//#         }
//#
//#         final int TXT_Y = 65;
//#         g.setColor(0xfff4c3);
//#         final String[] TITLE = {"排名", "分数", "昵称"};
//#         g.drawString(TITLE[0], 6, TXT_Y, Graphics.LEFT | Graphics.TOP);
//#         g.drawString(TITLE[1], SCREEN_WIDTH >> 2, TXT_Y, Graphics.LEFT | Graphics.TOP);
//#         g.drawString(TITLE[2], SCREEN_WIDTH - 6, TXT_Y, Graphics.RIGHT | Graphics.TOP);
//#
//#         g.setColor(0xffffff);
//#         if(dataGettingError)
//#         {
//#             g.drawString("网络异常，请稍后重试。", SCREEN_WIDTH >> 1, SCREEN_HEIGHT >> 1, Graphics.HCENTER | Graphics.TOP);
//#             drawButtons(g, "QQ社区".toCharArray(), rightTxt, BTN_TOP_Y);
//#             return;
//#         }
//#
//#         if(dataGetting)
//#         {
//#             g.drawString("获取数据中……", SCREEN_WIDTH >> 1, SCREEN_HEIGHT >> 1, Graphics.HCENTER | Graphics.TOP);
//#             drawButtons(g, null, rightTxt, BTN_TOP_Y);
//#             return;
//#         }
//#
//#         if (rankNameScore.length == 0) {
//#             g.drawString("没有相关数据。", SCREEN_WIDTH >> 1, SCREEN_HEIGHT >> 1, Graphics.HCENTER | Graphics.TOP);
//#             drawButtons(g, "QQ社区".toCharArray(), rightTxt, BTN_TOP_Y);
//#             return;
//#         }
//#
//#         final int MAX_COUNT = 10;
//#         int y = TXT_Y + FishFont.FONT_SMALL.getHeight() + 2;
//#         for(int index = 0, cnt = rankNameScore.length; index < cnt; index++)
//#         {
//#             //最多渲染前十名
//#             if(index >= MAX_COUNT) {
//#                 break;
//#             }
//#             if (y + FishFont.FONT_SMALL.getHeight() > BTN_TOP_Y) {
//#                 break;
//#             }
//#             g.setColor(0xffffff);
//#             g.drawString(rankNameScore[index][0], 6 + FishFont.FONT_SMALL.stringWidth("排"), y, Graphics.LEFT | Graphics.TOP);
//#             g.drawString(rankNameScore[index][1], SCREEN_WIDTH >> 2, y, Graphics.HCENTER | Graphics.TOP);
//#             g.setClip(SCREEN_WIDTH >> 1, 0, SCREEN_WIDTH >> 1, SCREEN_HEIGHT);
//#             g.drawString(rankNameScore[index][2], SCREEN_WIDTH  - 6, y, Graphics.RIGHT | Graphics.TOP);
//#             g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
//#             y += FishFont.FONT_SMALL.getHeight();
//#         }
//#         drawButtons(g, "QQ社区".toCharArray(), rightTxt, BTN_TOP_Y);
//#         return;
//#     }
//#
//#     private void doUpdateItem(int keyCode)
//#     {
//#         switch(keyCode) {
//#             case Keys.KEY_LEFT_SOFT:
//#                 if(dataGetting)
//#                 {
//#                     return;
//#                 }
//#                 subMenu = false;
//#                 GameContext.qqForum.startMBox(MBoxClient.CONN_TYPE_NOTICE_NETWORK, MBoxClient.PAGE_MAIN);
//#                 return;
//#
//#             case Keys.KEY_RIGHT_SOFT:
//#                 subMenu = false;
//#                 return;
//#         }
//#     }
//#
//#     public void keyMenuEvent(int event, int data1, Object data2) {
//#     }
//#
//#     public void closeMenu() {
//#     }
//#
//#     public void openMenu() {
//#     }
    //#endif

}
