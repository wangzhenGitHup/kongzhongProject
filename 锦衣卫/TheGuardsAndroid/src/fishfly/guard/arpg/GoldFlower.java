/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 *
 * @author songxiaobo
 */
public class GoldFlower implements MiniGame, BoxListener {

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
    /**
     * 图片资源
     */
    PaintUnit bets = new PaintUnit();//铜钱赌注
    PaintUnit plus = new PaintUnit();//加减符号
    PaintUnit minus = new PaintUnit();//加减符号
    PaintUnit playerGraps1 = new PaintUnit();//骰子
    PaintUnit playerGraps2 = new PaintUnit();
    PaintUnit playerGraps3 = new PaintUnit();
    PaintUnit comGraps1 = new PaintUnit();//骰子
    PaintUnit comGraps2 = new PaintUnit();
    PaintUnit comGraps3 = new PaintUnit();
    private Image imgBackBao;//宝字
    private Image imgPlusBack;//加减背景框
    private Image imgcBetsCover;//骰子盅
    private Image imgPlayerBetsBack;
    private Image imgComputerBetsBack;
    private Image imgBetsNumBack;//赌注的钱数
    private Image imgBackGroundCorner;//桌子斜边
    private Image imgBackGroundSide;//桌边
    private Image imgQianZi;//上上签
    private Image imgMoneyIcon;//金钱小图标
    private Image imgMoneyIconBox;//图标框
    private Image imgNumberBig;//数字图片
    private Image imgUnderLine;//下底框
    private Image imgRetFrame;//投掷边框
    private Image imgAndFireFont;//返回确定
    private Image imgThrowBetsFont;//投掷
    private Image imgZhaJinHua;//扎金花字体
    private Image imgMenuFont;//菜单字体
    private Image imgtriangle;//花边
    private Image imgMask;

    KeyManager keyMgr;
    private int keyCode;
    /**
     * 骰子点数相关
     */
    private byte[] betsNum = new byte[]{1, 2, 4, 8, 16, 32};
    private int[] playerBetsNum = new int[3];
    private int[] comBetsNum = new int[3];
    private int[] comBetsfinal = new int[3];
    private int[] comGrapsId = new int[3];
    private int[] rand = new int[3];
    private int comRand;
    private final int BOOMPOINT = 10000;
    private final int SHUNZI = 5000;
    private final int DOUBLE = 100;
    private boolean start;
    private boolean tishi;
    private boolean isStateCount;
    private int stateCount;
    private boolean canThrow;
    private boolean isMenu = true; // 是否会使菜单那
    private int gameMenuIndex; // 游戏菜单
    private int pointerIndex;
    private boolean isRule;
    private int helpOffsetY;

    public GoldFlower() {
        SCREEN_WIDTH = Page.SCREEN_WIDTH;
        SCREEN_HEIGHT = Page.SCREEN_HEIGHT;
        keyMgr = new KeyManager();
        loadImage();
        dlg = new Dialog();
        dlg.lsnr = this;
        setGameState(STATE_NO);
    }
/**
 *
 * @param changeFirst是否仍第一个筛子
 * @param changeSecond是否仍第二个筛子
 * @param changeThired是否仍第三个筛子
 */
    int playPoint = 0;
    int comPoint = 0;

    private void throwBetsLogic(boolean changeFirst, boolean changeSecond, boolean changeThired) {

        if (changeFirst) {
            rand[0] = GameContext.getRand(0, 5);
            playerBetsNum[0] = betsNum[rand[0]];
        }
        if (changeSecond) {
            rand[1] = GameContext.getRand(0, 5);
            playerBetsNum[1] = betsNum[rand[1]];
        }
        if (changeThired) {
            rand[2] = GameContext.getRand(0, 5);
            playerBetsNum[2] = betsNum[rand[2]];
        }
//        System.out.println("玩家的点数=" + playerBetsNum[0] + " " + playerBetsNum[1] + " " + playerBetsNum[2]);
        setGrapsState(rand[0], rand[1], rand[2], 1);
        playPoint = analysis(playerBetsNum);

        if (recentState == FIRSTTHROW) {
            comBetsfinal = comBet();
            for (int idx = 0, cnt = betsNum.length; idx < cnt; idx++) {
                if (comBetsfinal[0] == betsNum[idx]) {
                    comGrapsId[0] = idx;
                }
                if (comBetsfinal[1] == betsNum[idx]) {
                    comGrapsId[1] = idx;
                }
                if (comBetsfinal[2] == betsNum[idx]) {
                    comGrapsId[2] = idx;
                }
            }
            setGrapsState(comGrapsId[0] + 12, comGrapsId[1] + 12, comGrapsId[2] + 12, 2);
//          System.out.println("电脑的点数=" + comBetsfinal[0] + " " + comBetsfinal[1] + " " + comBetsfinal[2]);
          comPoint = analysis(comBetsfinal);
//        System.out.println("玩家总分=" + playPoint);
//        System.out.println("电脑总分=" + comPoint);
        }
        compareNum(playPoint, comPoint);
        if (changeFirst || changeFirst || changeFirst) {
            MusicPlayer.getInstance().playSound(SoundConst.DICE);
        }
    }

    private int level = 4;
    private final int EASY = 3;
    private final int ORDINARY = 4;
    private final int DIFFICULT = 5;
    private boolean isMission = false;

    private int[] comBet() {
        switch (level) {
            case EASY:
                for (int idx = 0, cunt = comBetsNum.length; idx < cunt; idx++) {
                    comRand = GameContext.getRand(0, 5);
                    comBetsNum[idx] = betsNum[comRand];
                }
                break;
            case ORDINARY:
                comBetsNum = new int[ORDINARY];
                for (int idx = 0, cunt = comBetsNum.length; idx < cunt; idx++) {
                    comRand = GameContext.getRand(0, 5);
                    comBetsNum[idx] = betsNum[comRand];
                }
                break;
            case DIFFICULT:
                comBetsNum = new int[DIFFICULT];
                for (int idx = 0, cunt = comBetsNum.length; idx < cunt; idx++) {
                    comRand = GameContext.getRand(0, 5);
                    comBetsNum[idx] = betsNum[comRand];
                }
                break;
        }
        return newThreeBets(comBetsNum);
    }

    private int[] newThreeBets(int[] comRand) {
        if (comRand.length == EASY) {
            return comRand;
        }
        if (comRand.length == ORDINARY) {
             return fourBets(comRand);
        }
        if (comRand.length == DIFFICULT) {
            return fiveBets(comRand);
        }
        return comRand;
    }

    private int[] fourBets(int data[]) {
        int[] curBet = new int[3];
        int[][] allBet = new int[10][curBet.length];
        int[] pointList = new int[10];
        int pointIdex = 0;
        for (int i = 0; i <= 1; i++) {
            for (int j = i + 1; j <= 2; j++) {
                for (int k = j + 1; k <= 3; k++) {
                    curBet[0] = data[i];
                    curBet[1] = data[j];
                    curBet[2] = data[k];
                    pointList[pointIdex] = analysis(curBet);
                    System.arraycopy(curBet, 0, allBet[pointIdex], 0, 3);
                    pointIdex++;
                }
            }
        }
        pointIdex = 0;
        return allBet[findMax(pointList)];
    }

    private int[] fiveBets(int data[]) {
        int[] curBet = new int[3];
        int[][] allBet = new int[10][curBet.length];
        int[] pointList = new int[10];
        int pointIdex = 0;
        for (int i = 0; i <= 2; i++) {
            for (int j = i + 1; j <= 3; j++) {
                for (int k = j + 1; k <= 4; k++) {
                    curBet[0] = data[i];
                    curBet[1] = data[j];
                    curBet[2] = data[k];
                    pointList[pointIdex] = analysis(curBet);
                    System.arraycopy(curBet, 0, allBet[pointIdex], 0, 3);
                    pointIdex++;
                }
            }
        }
        pointIdex = 0;
        return allBet[findMax(pointList)];
    }

    private int findMax(int[] m) {
        int maximum = 0;
        int maxIdex = 0;
        for (int idx = 0, cnt = m.length; idx < cnt; idx++) {
            if (maximum < m[idx]) {
                maximum = m[idx];
            }
        }
        for (int idx = 0, cnt = m.length; idx < cnt; idx++) {
            if (maximum == m[idx]) {
                maxIdex = idx;
            }
        }
        return maxIdex;
    }

    private int WHOWIN;
    final int PLAYERWIN = 1;
    final int COMWIN = 2;
    final int PING =3;

 /**
  * 对比得分
  * @param play
  * @param com
  */
    private void compareNum(int play, int com) {
        if (play > com) {
//            System.out.println("玩家赢了");
            WHOWIN = PLAYERWIN;
        } else if (play < com) {
            WHOWIN = COMWIN;
//            System.out.println("电脑赢了");
        } else {
            WHOWIN = PING;
//            System.out.println("平局");
        }
    }

    /**
     *
     * @param throwNum 扔出的三个数字的数组，先判断有几个不同的点数
     * @return
     */
    private int analysis(int[] throwNum) {
        int allNumPoint = 0;
        int differentNum = 0;
        int orNumPoint = throwNum[0] | throwNum[1] | throwNum[2];
        for (int idx = 0, cunt = betsNum.length; idx < cunt; idx++) {
            if (((orNumPoint >> idx) & 0x1) == 0x1) {
                differentNum++;
            }
        }
//        System.out.println("differentNum=" + differentNum);
        if (differentNum == 1) {
            allNumPoint = orNumPoint + BOOMPOINT;
        } else if (differentNum == 3) {
            allNumPoint = threeDifferent(orNumPoint);
        } else if (differentNum == 2) {
            allNumPoint = twoDifferent(throwNum);
        }
        return allNumPoint;
    }

    private int threeDifferent(int orNumPoint) {
        int allNumPoint = 0;
        for (int idx = 0, cunt = betsNum.length - 2; idx < cunt; idx++) {
            if (((orNumPoint >> idx) & 0x7) == 0x7) {
                allNumPoint = orNumPoint + SHUNZI;
                break;
            } else {
                allNumPoint = orNumPoint;
            }
        }
        return allNumPoint;
    }

    private int twoDifferent(int[] throwNum) {
        int allNumPoint = 0;
        if (throwNum[0] == throwNum[1]) {
            allNumPoint = throwNum[0] * DOUBLE + throwNum[2];
        } else if (throwNum[0] == throwNum[2]) {
            allNumPoint = throwNum[0] * DOUBLE + throwNum[1];
        } else if (throwNum[1] == throwNum[2]) {
            allNumPoint = throwNum[0] + throwNum[1] * DOUBLE;
        }
        return allNumPoint;
    }

    private int resultTime = 0;
    private int resetTime = 0;
    private int upSpeed = 10;

    private void resultLogic() {
        flashBets1 = false;
        flashBets2 = false;
        flashBets3 = false;
        resultTime++;
        if (resultTime == 10) {
            tishi = true;
            dlg.showMessageBox("开始决定胜负吧。".toCharArray());
        }
        if (resultTime == 30) {
            dlg.messageBoxType = dlg.NONE_BOX;
            tishi = false;
        }
        if (resultTime > 30) {
            if (grapsCoverY > -100) {
                grapsCoverY -= upSpeed;
                upSpeed++;
            }
        }
        if (resultTime == 60) {
            StringBuffer strGet = new StringBuffer();
            strGet.append("你赢了，获得").append(betsMoney).append("金币");
            StringBuffer strLose = new StringBuffer();
            strLose.append("你输了，失去").append(betsMoney).append("金币");
            String[] WinTxt = new String[]{};
            WinTxt = new String[]{strGet.toString(), strLose.toString(), "平局"};
            upSpeed = 5;
            if (WHOWIN == PLAYERWIN) {
                dlg.showMessageBox(WinTxt[0].toCharArray());
            } else if (WHOWIN == COMWIN) {
                dlg.showMessageBox(WinTxt[1].toCharArray());
            } else if (WHOWIN == PING) {
                dlg.showMessageBox(WinTxt[2].toCharArray());
            }
        }
    }

    private void resetLogic() {
        if (WHOWIN == PLAYERWIN) {
            GameContext.actor.addMoney(betsMoney);
        } else if (WHOWIN == COMWIN) {
            GameContext.actor.loseMoney(betsMoney);
        }
        betsState = 0;
        betsMoney = 0;
        firstBets = 0;
        playPoint = 0;
        comPoint = 0;
        start = false;
        if (grapsCoverY < 10) {
            grapsCoverY += upSpeed;
            upSpeed++;

        } else {
            resetTime++;
        }
        if ((resetTime == 5) && (!isMission)) {
            upSpeed = 10;
            dlg.btnBoxOp = Dialog.AGAIN;
            dlg.showButtonBox("再来一次？".toCharArray());
        } else if ((resetTime == 5) && (isMission)) {
            if (GameContext.page.script != null) {
                if (WHOWIN == PLAYERWIN) {
                    GameContext.setVar(ScriptEngine.PLAY_GAME_END, 2);
                } else if (WHOWIN == COMWIN) {
                    GameContext.setVar(ScriptEngine.PLAY_GAME_END, 1);
                } else if (WHOWIN == PING) {
                    GameContext.setVar(ScriptEngine.PLAY_GAME_END, 1);
                }
                GameContext.page.script.remind(300, 0, null);
                GameContext.page.script = null;
            }
        }
    }

    private void logic() {
        if (dlg.isAvailable()) {
            dlg.update();
        }
        switch (recentState) {
            case MAINSTATE:
                if (!start) {
                    tishi = true;
                    dlg.showMessageBox("请选择加码添加赌金".toCharArray());
                }
                start = true;
                resultTime = 0;
                resetTime = 0;
                break;
            case FIRSTTHROW:
                if (isStateCount){
                stateCount++;
                }
                if ((stateCount == 15)) {
                    tishi = true;
                    dlg.showMessageBox("请选择想替换的骰子。".toCharArray());
                    recentState = SECONDTHROW;
                    isStateCount = false;
                    stateCount = 0;
                    canThrow = true;
                }

                break;
            case RESULT:
                resultLogic();
                break;
            case RESET:
                resetLogic();
                break;
        }
    }

    private void init() {
        recentState = 7;
        betsState = 0;
        betsMoney = 0;
        firstBets = 0;
        resultTime = 0;
        resetTime = 0;
        grapsCoverX = (SCREEN_WIDTH >> 1) - 20;
        grapsCoverY = 8;

    }

    private int grapsCoverX = (SCREEN_WIDTH >> 1) - 20;
    private int grapsCoverY = 8;

    private void drawMenu(Graphics g){
        final int FRAME_W = 172;
        final int FRAME_H = 166;
        int startX = (SCREEN_WIDTH - FRAME_W) >> 1;
        int startY = (SCREEN_HEIGHT - FRAME_H) >> 1;
        g.setColor(0x000000);
        g.fillRect(startX, startY, FRAME_W, FRAME_H);
        g.setColor(0xf8ba68);
        g.drawRect(startX, startY, FRAME_W, FRAME_H);
        drawFrameSmallLace(g, startX, startY, FRAME_W, FRAME_H);
        //扎金花
        g.drawImage(imgZhaJinHua, startX + 30, startY + 10, Graphics.LEFT | Graphics.TOP);
        //开始、规则、退出
        int menuItemX = startX + ((FRAME_W - imgMenuFont.getWidth()) >> 1);
        int menuItemY = startY + 62;
        final int INTERVAL = 35;
        for (int idx = 0, cnt = 3; idx < cnt; idx++) {
            Util.drawClipImage(g, imgMenuFont, menuItemX, menuItemY + INTERVAL * idx, 0, 17 * idx, imgMenuFont.getWidth(), (imgMenuFont.getHeight() / 3));
        }


        g.drawImage(imgMask, startX + 44, startY + 56 + pointerIndex*INTERVAL, Graphics.LEFT | Graphics.TOP);
        g.setColor(0xd8d87a);
        final int CHOSE_W = 86;
        final int CHOSE_H = 26;
        g.drawRect(startX + 44, startY + 56 + pointerIndex*INTERVAL, CHOSE_W, CHOSE_H);

        if (isRule) {
            drawRule(g);
            return;
        }
    }

    public void doMenuPoint(int px, int py) {
        final int FRAME_W = 172;
        final int FRAME_H = 166;
        final int INTERVAL = 35;
        final int MENU_CNT = 3;
        final int CHOSE_W = 86;
        final int CHOSE_H = 26;
        int startX = (SCREEN_WIDTH - FRAME_W) >> 1;
        int startY = (SCREEN_HEIGHT - FRAME_H) >> 1;
        int menuItemX = startX + ((FRAME_W - imgMenuFont.getWidth()) >> 1);
        int menuItemY = startY + 62;
        for (int idx = 0, cnt = MENU_CNT; idx < cnt; idx++) {
            if (GameContext.point(px, py, menuItemX, menuItemY + INTERVAL * idx, CHOSE_W, CHOSE_H)) {
                if (pointerIndex == idx) {
                    gameMenuIndex = pointerIndex;
                    doMenuFire();
                }
                pointerIndex = idx;
            }
        }
    }
    final int START = 0;
    final int RULE = 1;
    final int EXIT = 2;


    public void doMenuFire(){
        switch (gameMenuIndex){
            case START:
                isMenu = false;
                recentState = MAINSTATE;
                break;
            case RULE:
                final short HELP_TXT = 237;
                helpTxt = StringManager.getInstance().getString(HELP_TXT);
                recentState = -1;
                isRule = true;
                break;
            case EXIT:
                StringBuffer buf = new StringBuffer();
                buf.append("是否退出？");
                dlg.btnBoxOp = Dialog.GIVE_UP_POKE;
                dlg.showButtonBox(buf.toString().toCharArray());
                break;
        }
    }

    private void drawFrameSmallLace(Graphics g, int x, int y, int width, int height) {
        final int FRAME_X = x;
        final int FRAME_Y = y;
        final int FRAME_W = width;
        final int FRAME_H = height;
        g.setColor(0x414141);
        g.drawRect(FRAME_X, FRAME_Y, FRAME_W - 1, FRAME_H - 1);
        final int LACE_DIS = 2;
        final int LACE_W = imgtriangle.getWidth();
        final int LACE_H = imgtriangle.getHeight();
        g.drawImage(imgtriangle, FRAME_X + FRAME_W + LACE_DIS, FRAME_Y - LACE_DIS, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, imgtriangle, 0, 0, LACE_W, LACE_H, Sprite.TRANS_MIRROR, FRAME_X - LACE_DIS, FRAME_Y - LACE_DIS, 0);
        Util.drawRegion(g, imgtriangle, 0, 0, LACE_W, LACE_H, Sprite.TRANS_ROT90, FRAME_X + FRAME_W + LACE_DIS, FRAME_Y + FRAME_H + LACE_DIS, Graphics.RIGHT | Graphics.BOTTOM);
        Util.drawRegion(g, imgtriangle, 0, 0, LACE_W, LACE_H, Sprite.TRANS_ROT180, FRAME_X - LACE_DIS, FRAME_Y + FRAME_H + LACE_DIS, Graphics.LEFT | Graphics.BOTTOM);
    }

    private void drawBack(Graphics g) {
        g.setColor(0x514c60);
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        final int DESK_Y = 25;
        final int DESK_X = 0;
        final int DESKBIAN_Y = 226;
        g.drawImage(imgBackGroundCorner, DESK_X, DESK_Y, Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, imgBackGroundCorner, 0, 0, imgBackGroundCorner.getWidth(), imgBackGroundCorner.getHeight(), Sprite.TRANS_MIRROR, SCREEN_WIDTH - imgBackGroundCorner.getWidth(), DESK_Y, 0);
        g.setColor(0x9d3112);
        g.fillRect(DESK_X + imgBackGroundCorner.getWidth(), DESK_Y, SCREEN_WIDTH - (imgBackGroundCorner.getWidth() << 1), imgBackGroundCorner.getHeight());
        g.setColor(0x722702);
        g.fillRect(DESK_X, DESK_Y + imgBackGroundCorner.getHeight(), SCREEN_WIDTH, SCREEN_HEIGHT - imgBackGroundCorner.getHeight());
        for (int idx = 0; idx < 8; idx++) {
            g.drawImage(imgBackGroundSide, DESK_X + idx * imgBackGroundSide.getWidth(), DESKBIAN_Y, Graphics.LEFT | Graphics.TOP);
        }

        final int BAOZIY = 75;
        g.drawImage(imgBackBao, SCREEN_WIDTH >> 1, BAOZIY, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, imgBackBao, 0, 0, imgBackBao.getWidth(), imgBackBao.getHeight(), Sprite.TRANS_MIRROR, SCREEN_WIDTH >> 1, BAOZIY, 0);

        final int QIAN_X = 98;
        final int QIAN_Y = 3;
        g.drawImage(imgQianZi, QIAN_X, QIAN_Y, Graphics.HCENTER | Graphics.TOP);

        final int PLAYBACK_X = 7;
        final int COMBACK_X = SCREEN_WIDTH - 168;
        final int PLAYBACK_Y = 137;
        final int COMBACK_Y = 25;
        g.drawImage(imgPlayerBetsBack, PLAYBACK_X, PLAYBACK_Y, Graphics.LEFT | Graphics.TOP);
        g.drawImage(imgComputerBetsBack, COMBACK_X, COMBACK_Y, Graphics.LEFT | Graphics.TOP);

        final int ICONF_X = 14;
        final int ICONF_Y = 5;
        final int ICON_X = 16;
        final int ICON_Y = 7;
        g.drawImage(imgMoneyIconBox, ICONF_X, ICONF_Y, Graphics.LEFT | Graphics.TOP);
        Util.drawClipImage(g, imgMoneyIcon, ICON_X, ICON_Y, 70, 0, (imgMoneyIcon.getWidth()) / 5, imgMoneyIcon.getHeight());


        final int BETNUMONE_X = 107;
        final int BETNUMONE_Y = 126;
        final int BETNUMRTWO_X = SCREEN_WIDTH - 70;
        final int BETNUMRTWO_Y = 15;
        g.drawImage(imgBetsNumBack, BETNUMONE_X, BETNUMONE_Y, Graphics.LEFT | Graphics.TOP);
        g.drawImage(imgBetsNumBack, BETNUMRTWO_X, BETNUMRTWO_Y, Graphics.LEFT | Graphics.TOP);
        Util.drawNumbersAlignRight(g, betsMoney, imgNumberBig, imgNumberBig.getWidth() / 10, 1, BETNUMONE_X + imgBetsNumBack.getWidth() - 10, BETNUMONE_Y + 5);
        Util.drawNumbersAlignRight(g, betsMoney, imgNumberBig, imgNumberBig.getWidth() / 10, 1, BETNUMRTWO_X + imgBetsNumBack.getWidth() - 10, BETNUMRTWO_Y + 5);

        final int DIBIAN_X = 73;
        final int DIBIAN_Y = SCREEN_HEIGHT - 20;
        for (int idx = 0; idx < 4; idx++) {
            g.drawImage(imgUnderLine, DIBIAN_X + (imgUnderLine.getWidth() * idx), DIBIAN_Y, Graphics.LEFT | Graphics.TOP);
        }
        g.setColor(0);
        g.fillRect(DIBIAN_X, DIBIAN_Y - 5, imgUnderLine.getWidth() << 2, 5);

        final int RF_X = 9;
        final int RF_Y = SCREEN_HEIGHT - 35;
        g.drawImage(imgRetFrame, SCREEN_WIDTH - RF_X, RF_Y, Graphics.RIGHT | Graphics.TOP);
        g.drawImage(imgRetFrame, SCREEN_WIDTH >> 1, RF_Y, Graphics.HCENTER | Graphics.TOP);
        Util.drawRegion(g, imgRetFrame, 0, 0, imgRetFrame.getWidth(), imgRetFrame.getHeight(), Sprite.TRANS_MIRROR, RF_X, RF_Y, Graphics.LEFT | Graphics.TOP);

        Util.drawClipImage(g, imgThrowBetsFont, RF_X + 15, RF_Y + 5, 0, 0, imgThrowBetsFont.getWidth(), imgThrowBetsFont.getHeight() / 3);
        Util.drawClipImage(g, imgThrowBetsFont, (SCREEN_WIDTH >> 1) - 29, RF_Y + 5, 0, imgThrowBetsFont.getHeight() / 3, imgThrowBetsFont.getWidth(), imgThrowBetsFont.getHeight() / 3);
        Util.drawClipImage(g, imgThrowBetsFont, SCREEN_WIDTH - 78, RF_Y + 5, 0, (imgThrowBetsFont.getHeight() / 3) << 1, imgThrowBetsFont.getWidth(), imgThrowBetsFont.getHeight() / 3);

        final int MONEY_X = 30;
        final int MONEY_Y = 58;
        GameContext.page.drawMenuMoney(g, GameContext.actor.getMoney(), MONEY_X, MONEY_Y);
//        g.setColor(0xfeff3f);
//        g.drawString(GameContext.actor.getMoney()+"", 30, 58, Graphics.HCENTER | Graphics.TOP);

    }

    public void paint(Graphics g) {
        input();
        logic();
        drawBack(g);
        drawGraps(g);
        drawBets(g);
        if (isMenu) {
            drawMenu(g);
        }
        if (recentState == ADDBETS) {
            drawChoseBets(g);
        }
        if (GameContext.page.sms.isShowing()) {
            GameContext.page.sms.paint(g);
            GameContext.page.sms.update();
        }
        if (dlg.isAvailable()) {
            dlg.update();
            dlg.paint(g);
        }
        if (GameContext.page.dlg.isAvailable()) {
            GameContext.page.dlg.update();
        }
    }

    public void keyReleased(int keyCode) {
        if (dlg.isAvailable()) {
            return;
        }
        this.keyCode = 0;
    }

    public void keyPressed(int keyCode) {
        if (dlg.isAvailable()) {
            return;
        }
        if (GameContext.page.sms != null && GameContext.page.sms.isShowing()) {
            //#if PRINTDEBUG == 1
            System.out.println("SMS按键");
            //#endif
            GameContext.page.sms.keyPressed(keyCode);
            return;
        }
    }

    public void setGameState(int kind) {
        gameState = kind;
        if (kind == STATE_NO) {
            MusicPlayer.getInstance().reload("qing.ogg", true);
            init();
            loadImage();
            return;
        } else if (kind == EASY) {
            level = EASY;
            isMission = true;
            return;
        } else if (kind == 6) {
            level = EASY;
            isMission = false;
            return;
        } else if (kind == ORDINARY) {
            level = ORDINARY;
            isMission = true;
            return;
        } else if (kind == DIFFICULT) {
            level = DIFFICULT;
            isMission = true;
            return;
        }
        if (isMission){
            recentState = MAINSTATE;
            isMenu = false;
        }
    }

    final int MAINSTATE = 1;
    final int ADDBETS = 2;
    final int FIRSTTHROW = 3;
    final int SECONDTHROW = 4;
    final int RESULT = 5;
    final int RESET = 6;
    final int MENU = 7;
    private int recentState = MENU;

    public void pressButten(int px, int py, boolean add, boolean touZhi, boolean giveUp) {
        final int JIAMA_X = 20;
        final int JIAMA_Y = SCREEN_HEIGHT - 30;
        final int JIAMA_W = 55;
        final int JIAMA_H = 20;

        final int TOUZHI_X = (SCREEN_WIDTH>>1) - 35;
        final int TOUZHI_Y = SCREEN_HEIGHT - 30;

        final int QIPAI_X = SCREEN_WIDTH - 85;
        final int QIPAI_Y = SCREEN_HEIGHT - 30;
        if (add) {
            if (GameContext.point(px, py, JIAMA_X, JIAMA_Y, JIAMA_W, JIAMA_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                dlg.messageBoxType = dlg.NONE_BOX;
                this.keyCode = Keys.KEY_LEFT_SOFT;
            }
        }
        if (touZhi) {
            if (GameContext.point(px, py, TOUZHI_X, TOUZHI_Y, JIAMA_W, JIAMA_H)) {
                if (canThrow) {
                    MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                    dlg.messageBoxType = dlg.NONE_BOX;
                    tishi = false;
                    this.keyCode = Keys.KEY_FIRE;
                }
            }
        }
        if (giveUp) {
            if (GameContext.point(px, py, QIPAI_X, QIPAI_Y, JIAMA_W, JIAMA_H)) {
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                if (isMission) {
                    GameContext.setVar(ScriptEngine.PLAY_GAME_END, 1);
                }
                tishi = false;
                this.keyCode = Keys.KEY_RIGHT_SOFT;
            }
        }
    }
    private boolean flashBets1;
    private boolean flashBets2;
    private boolean flashBets3;

    public boolean pointerDragged(int startX, int startY, int endX, int endY) {
        if (GameContext.sms.isShowing()) {
            return GameContext.sms.pointerDragged(startX, startY, endX, endY);
        }
        if (gameMenuIndex == RULE) {
            return doRuleInterfaceDragged(startX, startY, endX, endY);
        }
        return false;
    }

     private void doButtonPoint(int px, int py) {
         int startx = (SCREEN_WIDTH - 370) >> 1;
         int starty = (SCREEN_HEIGHT - 240) >> 1;
         final int BTN_POINT_W = 60;
         final int BTN_POINT_H = 24;
         if (GameContext.point(px, py, startx + 313, starty + 224, BTN_POINT_W, BTN_POINT_H)) {
             recentState = MENU;
             isRule = false;
             return;
         }
    }

    public void pointerPressed(int px, int py) {
        if (dlg.isAvailable() && !tishi) {
            if (recentState == RESULT) {
                dlg.messageBoxType = dlg.NONE_BOX;
                recentState = RESET;
                return;
            }
            dlg.pointerPressed(px, py);
            return;
        }
        if (GameContext.page.dlg.isAvailable()) {
            if (GameContext.page.dlg.pointerPressed(px, py)) {
                return;
            }
        }
        if (GameContext.sms != null && GameContext.sms.isShowing()) {
            GameContext.sms.pointerPressed(px, py);
            return;
        }
        switch (gameMenuIndex) {
            case RULE:
                doButtonPoint(px, py);
                break;
        }
        switch (recentState) {
            case MENU:
                doMenuPoint(px, py);
                break;
            case MAINSTATE:
                pressButten(px, py, true, false, true);
                break;
            case ADDBETS:
                final int FRAME_Y = 65;
                final int JIANHAO_X = ((SCREEN_WIDTH >> 1) - imgPlusBack.getWidth()) + 15;
                final int JIAHAO_X = ((SCREEN_WIDTH >> 1) + imgPlusBack.getWidth()) - 55;
                final int JHAO_Y = 69;
                final int HAO_W = 40;

                final int QUEDING_X = (SCREEN_WIDTH >> 1) - (imgRetFrame.getWidth() >> 1);
                final int QUEDING_Y = FRAME_Y + imgPlusBack.getHeight() + 6;

                if (GameContext.point(px, py, JIANHAO_X, JHAO_Y, HAO_W, HAO_W)) {
                    tishi = false;
                    dlg.messageBoxType = dlg.NONE_BOX;
                    this.keyCode = Keys.KEY_NUM4;
                }
                if (GameContext.point(px, py, JIAHAO_X, JHAO_Y, HAO_W, HAO_W)) {
                    tishi = false;
                    dlg.messageBoxType = dlg.NONE_BOX;
                    this.keyCode = Keys.KEY_NUM6;
                }
                if (GameContext.point(px, py, QUEDING_X, QUEDING_Y, HAO_W + 40, HAO_W)) {
                    tishi = false;
                    dlg.messageBoxType = dlg.NONE_BOX;
                    this.keyCode = Keys.KEY_NUM5;
                }
                break;
            case FIRSTTHROW:
                pressButten(px, py, true, true, true);
                break;
            case SECONDTHROW:
                final int BTS_X = (SCREEN_WIDTH >> 1) - 60;
                final int BTS_Y = 156;
                final int BETS_W = 51;
                final int BETS_H = 60;
                final int BETS_DIS = BETS_H;
                if (GameContext.point(px, py, BTS_X, BTS_Y, BETS_W, BETS_H)) {
                    dlg.messageBoxType = dlg.NONE_BOX;
                    tishi = false;
                    this.keyCode = Keys.KEY_NUM4;
                }
                if (GameContext.point(px, py, BTS_X + BETS_DIS, BTS_Y, BETS_W, BETS_H)) {
                    dlg.messageBoxType = dlg.NONE_BOX;
                    tishi = false;
                    this.keyCode = Keys.KEY_NUM5;
                }
                if (GameContext.point(px, py, BTS_X + (BETS_DIS << 1), BTS_Y, BETS_W, BETS_H)) {
                    dlg.messageBoxType = dlg.NONE_BOX;
                    tishi = false;
                    this.keyCode = Keys.KEY_NUM6;
                }
                pressButten(px, py, true, true, true);
                break;
        }
    }

    private void mainStateKey() {
        switch (keyCode) {
            case Keys.KEY_LEFT_SOFT:
                recentState = ADDBETS;
                break;
            case Keys.KEY_RIGHT_SOFT:
                StringBuffer buf = new StringBuffer();
                buf.append("将失去").append(betsMoney).append("金钱，是否弃牌？");
                dlg.btnBoxOp = Dialog.GIVE_UP_POKE;
                dlg.showButtonBox(buf.toString().toCharArray());
                break;
            case Keys.KEY_FIRE:
                MusicPlayer.getInstance().playSound(SoundConst.ERROR);
                dlg.showMessageBox("您还没有下注。".toCharArray());
                break;
        }
    }
int sb;
    private void addBetsKey() {
        switch (keyCode) {
            case Keys.KEY_NUM4:
                if (recentState == SECONDTHROW) {
                    if (betsMoney > firstBets) {
                        minusBets();
                    }
                    return;
                }
                minusBets();
                break;
            case Keys.KEY_NUM6:
                if (betsMoney < GameContext.actor.getMoney() - 99) {
                    addBets();
                }
                if ((GameContext.actor.getMoney() - betsMoney) < 100) {
                    MusicPlayer.getInstance().playSound(SoundConst.ERROR);
                    dlg.btnBoxOp = Dialog.BUY_MONEY_OP;
                    dlg.showButtonBox("金钱不足，是否购买金币？".toCharArray());
                }
                break;
            case Keys.KEY_NUM5:
                if ((GameContext.actor.getMoney() == 0) && (betsMoney == 0)) {
                    recentState = MAINSTATE;
                    return;
                }
                if (betsMoney == 0) {
                    MusicPlayer.getInstance().playSound(SoundConst.ERROR);
                    dlg.showMessageBox("您尚未选择赌注".toCharArray());
                } else {
                    recentState = FIRSTTHROW;
                    tishi = true;
                    canThrow =  true;
                    dlg.showMessageBox("那么，开始投掷吧。".toCharArray());
                    break;
                }
        }
    }

    private void firstThrowKey() {
        switch (keyCode) {
            case Keys.KEY_LEFT_SOFT:
                recentState = ADDBETS;
                break;
            case Keys.KEY_RIGHT_SOFT:
                StringBuffer buf = new StringBuffer();
                buf.append("将失去").append(betsMoney).append("，是否弃牌？");
                dlg.btnBoxOp = Dialog.GIVE_UP_POKE;
                dlg.showButtonBox(buf.toString().toCharArray());
                break;
            case Keys.KEY_FIRE:
                if ((GameContext.actor.getMoney() == 0) && (betsMoney == 0)) {
                    recentState = MAINSTATE;
                    return;
                }
                if (betsMoney == 0) {
                    MusicPlayer.getInstance().playSound(SoundConst.ERROR);
                    dlg.showMessageBox("您还没有下注。".toCharArray());
                } else {
                    throwBetsLogic(true, true, true);
                    firstBets = betsMoney;
                    isStateCount = true;
                    canThrow = false;
                }
                break;
        }
    }


    private void secondThrowKey() {
        switch (keyCode) {
            case Keys.KEY_NUM4:
                flashBets1 = flashBets1 ? false : true;
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                break;
            case Keys.KEY_NUM5:
                flashBets2 = flashBets2 ? false : true;
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                break;
            case Keys.KEY_NUM6:
                flashBets3 = flashBets3 ? false : true;
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                break;
            case Keys.KEY_FIRE:
                throwBetsLogic(flashBets1, flashBets2, flashBets3);
                recentState = RESULT;
                break;
            case Keys.KEY_RIGHT_SOFT:
                StringBuffer buf = new StringBuffer();
                buf.append("将失去").append(betsMoney).append("，是否弃牌？");
                dlg.btnBoxOp = Dialog.GIVE_UP_POKE;
                dlg.showButtonBox(buf.toString().toCharArray());
                break;
            case Keys.KEY_LEFT_SOFT:
                this.keyCode = Keys.KEY_LEFT_SOFT;
                break;
        }
    }
    private void input() {
        switch (recentState) {
            case MAINSTATE:
                mainStateKey();
                break;
            case ADDBETS:
                addBetsKey();
                break;
            case FIRSTTHROW:
                firstThrowKey();
                break;
            case SECONDTHROW:
                secondThrowKey();
                break;
        }
    }

    public void pointerReleased(int arg0, int arg1) {
        this.keyCode = 0;
    }

    public void removeImage() {
        ImageManager imgMgr = ImageManager.getInstance();
        imgMgr.removeImage(imgBackBao);
        imgMgr.removeImage(imgPlusBack);
        imgMgr.removeImage(imgcBetsCover);
        imgMgr.removeImage(imgPlayerBetsBack);
        imgMgr.removeImage(imgComputerBetsBack);
        imgMgr.removeImage(imgBetsNumBack);
        imgMgr.removeImage(imgBackGroundCorner);
        imgMgr.removeImage(imgBackGroundSide);
        imgMgr.removeImage(imgQianZi);
        imgMgr.removeImage(imgMoneyIcon);
        imgMgr.removeImage(imgNumberBig);
        imgMgr.removeImage(imgUnderLine);
        imgMgr.removeImage(imgRetFrame);
        imgMgr.removeImage(imgAndFireFont);
        imgMgr.removeImage(imgThrowBetsFont);
        imgMgr.removeImage(imgMoneyIconBox);
        imgMgr.removeImage(imgMenuFont);
        imgMgr.removeImage(imgZhaJinHua);
        imgMgr.removeImage(imgtriangle);

        bets.releaseImages();
        plus.releaseImages();
        playerGraps1.releaseImages();
        playerGraps2.releaseImages();
        playerGraps3.releaseImages();
        comGraps1.releaseImages();
        comGraps2.releaseImages();
        comGraps3.releaseImages();
    }

    private void loadImage() {
        ImageManager imgMgr = ImageManager.getInstance();
        imgBackBao = imgMgr.getImage((short) 293);
        imgPlusBack = imgMgr.getImage((short) 295);
        imgcBetsCover = imgMgr.getImage((short) 296);
        imgPlayerBetsBack = imgMgr.getImage((short) 297);
        imgComputerBetsBack = imgMgr.getImage((short) 298);
        imgBetsNumBack = imgMgr.getImage((short) 299);
        imgBackGroundCorner = imgMgr.getImage((short) 300);
        imgBackGroundSide = imgMgr.getImage((short) 301);
        imgQianZi = imgMgr.getImage((short) 303);
        imgMoneyIcon = imgMgr.getImage((short) 257);
        imgNumberBig = imgMgr.getImage((short) 196);
        imgUnderLine = imgMgr.getImage((short) 121);
        imgRetFrame = imgMgr.getImage((short) 98);
        imgAndFireFont = imgMgr.getImage((short) 200);
        imgThrowBetsFont = imgMgr.getImage((short) 304);
        imgMoneyIconBox = imgMgr.getImage((short) 107);
        imgMenuFont = imgMgr.getImage((short)312);
        imgZhaJinHua = imgMgr.getImage((short)313);
        imgtriangle = imgMgr.getImage((short)128);
        int MASK_WIDTH = 86;
        int MASK_HEIGHT = 26;
        int TRANSPARENCY = 55;
        int MASK_COLOR = 14211194;
        imgMask = GameContext.createMaskImage(MASK_WIDTH, MASK_HEIGHT, MASK_COLOR, TRANSPARENCY);

        final short BETS_ID = 138;
        AnimationManager.getInstance().getAnimation(BETS_ID, bets);
        bets.actId = 0;
        bets.initFrame();

        final short PLUS_ID = 139;
        AnimationManager.getInstance().getAnimation(PLUS_ID, plus);
        AnimationManager.getInstance().getAnimation(PLUS_ID, minus);
        plus.actId = 0;
        plus.initFrame();
        minus.actId = 1;
        minus.initFrame();

        final short GRAPS_ID = 140;
        AnimationManager.getInstance().getAnimation(GRAPS_ID, playerGraps1);
        playerGraps1.actId = 6;
        playerGraps1.initFrame();
        AnimationManager.getInstance().getAnimation(GRAPS_ID, playerGraps2);
        playerGraps2.actId = 6;
        playerGraps2.initFrame();
        AnimationManager.getInstance().getAnimation(GRAPS_ID, playerGraps3);
        playerGraps3.actId = 6;
        playerGraps3.initFrame();

        AnimationManager.getInstance().getAnimation(GRAPS_ID, comGraps1);
        comGraps1.actId = 12;
        comGraps1.initFrame();
        AnimationManager.getInstance().getAnimation(GRAPS_ID, comGraps2);
        comGraps2.actId = 12;
        comGraps2.initFrame();
        AnimationManager.getInstance().getAnimation(GRAPS_ID, comGraps3);
        comGraps3.actId = 12;
        comGraps3.initFrame();

    }
    private int grapsCount = 0;//筛子闪烁计数器

    private void drawGraps(Graphics g) {

        final int CG1_X = (SCREEN_WIDTH>>1) + 8;
        final int CG1_Y = 75;
        final int CG2_X = (SCREEN_WIDTH>>1) + 53;
        final int CG2_Y = 78;
        final int CG3_X = (SCREEN_WIDTH>>1) + 29;
        final int CG3_Y = 115;

        comGraps1.paint(g, -CG1_X, -CG1_Y);
        comGraps2.paint(g, -CG2_X, -CG2_Y);
        comGraps3.paint(g, -CG3_X, -CG3_Y);

        comGraps1.playNextFrame();
        comGraps2.playNextFrame();
        comGraps3.playNextFrame();

        g.drawImage(imgcBetsCover, grapsCoverX, grapsCoverY, Graphics.LEFT | Graphics.TOP);

        final int PG_X = (SCREEN_WIDTH>>1) - 40;
        final int PG_Y = 216;
        final int CUT = 60;

        if ((flashBets1 && grapsCount < 3) || !flashBets1) {
            playerGraps1.paint(g, -PG_X, -PG_Y);
        }
        if ((flashBets2 && grapsCount < 3) || !flashBets2) {
            playerGraps2.paint(g, -PG_X - CUT, -PG_Y);
        }
        if ((flashBets3 && grapsCount < 3) || !flashBets3) {
            playerGraps3.paint(g, -PG_X - (CUT << 1), -PG_Y);
        }
        if (grapsCount > 4) {
            grapsCount = 0;
        }
        grapsCount++;

        playerGraps1.playNextFrame();
        playerGraps2.playNextFrame();
        playerGraps3.playNextFrame();

    }

    private final int[] BETS_X = new int[]{78, 62, 105, SCREEN_WIDTH - 99, SCREEN_WIDTH - 119,SCREEN_WIDTH - 75};
    private final int[] BETS_Y = new int[]{167, 197, 210, 66, 93, 106};
    private int betsState = 0;//几个金币
    private int betsMoney = 0;//钱数

    private void setGrapsState(int grapsNum1, int grapsNum2, int grapNum3, int kind) {
        if (kind == 1) {
            if ((flashBets1) || (recentState == FIRSTTHROW)) {
                playerGraps1.actId = (short) grapsNum1;
                playerGraps1.initFrame();
            }
            if ((flashBets2) || (recentState == FIRSTTHROW)) {
                playerGraps2.actId = (short) grapsNum2;
                playerGraps2.initFrame();
            }
            if ((flashBets3) || (recentState == FIRSTTHROW)) {
                playerGraps3.actId = (short) grapNum3;
                playerGraps3.initFrame();
            }
        } else {
            comGraps1.actId = (short) grapsNum1;
            comGraps1.initFrame();
            comGraps2.actId = (short) grapsNum2;
            comGraps2.initFrame();
            comGraps3.actId = (short) grapNum3;
            comGraps3.initFrame();
        }
    }

    private void drawBets(Graphics g) {
        if (betsState == 0) {
            return;
        }
        for (int idx = 0, cunt = BETS_X.length; idx < cunt; idx++) {
            bets.ani.drawFrame(g, betsState - 1, 0, BETS_X[idx], BETS_Y[idx], bets);
        }
    }

    private void drawChoseBets(Graphics g) {
        if (  recentState != ADDBETS){
            return;
        }
        final int FRAME_Y = 65;
        final int JIANHAO_X = ((SCREEN_WIDTH >> 1) -  imgPlusBack.getWidth()) + 38;
        final int JHAO_Y = 99;
        final int JIAHAO_X = ((SCREEN_WIDTH >> 1) + imgPlusBack.getWidth()) - 30 ;
        g.drawImage(imgPlusBack, SCREEN_WIDTH >> 1, FRAME_Y, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, imgPlusBack, 0, 0, imgPlusBack.getWidth(), imgPlusBack.getHeight(), Sprite.TRANS_MIRROR, SCREEN_WIDTH >> 1, FRAME_Y, Graphics.LEFT | Graphics.TOP);

        plus.paint(g, -JIAHAO_X, -JHAO_Y - 10);
        if (plus.isEndAnimation()) {
            if (plus.actId == 2) {
                plus.actId = 0;
            }
            plus.initFrame();
        }

        plus.playNextFrame();
        minus.paint(g, -JIANHAO_X + 10, -JHAO_Y);

        if (minus.isEndAnimation()) {
            if (minus.actId == 3) {
                minus.actId = 1;
            }
            minus.initFrame();
        }

        minus.playNextFrame();
        final int BM_Y = 84;
        final int BM_X = (SCREEN_WIDTH>>1) + 20;
        Util.drawNumbersAlignRight(g, betsMoney, imgNumberBig, imgNumberBig.getWidth() / 10, 1, BM_X, BM_Y);

        g.drawImage(imgRetFrame, SCREEN_WIDTH >> 1, FRAME_Y + imgPlusBack.getHeight(), Graphics.HCENTER | Graphics.TOP);
        Util.drawClipImage(g, imgAndFireFont, (SCREEN_WIDTH >> 1) - (imgAndFireFont.getWidth() >> 1), FRAME_Y + imgPlusBack.getHeight() + 6, 0, 22, imgAndFireFont.getWidth(), imgAndFireFont.getHeight() / 3);

    }

    private int firstBets = 0;//第一次赌金的记录，为了第二次扔判断

    private void addBets() {
        if (betsState > 9) {
            return;
        }
        if (betsMoney < 1000) {
            betsMoney += 100;
        }
        MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
        betsState++;
        plus.actId = 2;
        plus.initFrame();
    }

    private void minusBets() {
        if (betsState < 1) {
            return;
        }
        betsState--;
        if (betsMoney > 0) {
            betsMoney -= 100;
        }
        MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
        minus.actId = 3;
        minus.initFrame();
    }

    public ScriptEngine getScript() {
        return null;
    }

    public void doOkButtonFire() {
        switch (dlg.btnBoxOp) {
            case Dialog.AGAIN:
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                recentState = MAINSTATE;
                break;
            case Dialog.GIVE_UP_POKE:
                MusicPlayer.getInstance().playSound(SoundConst.SYSCHOOSE);
                GameContext.actor.loseMoney(betsMoney);
                if (GameContext.page.script != null) {
                    GameContext.setVar(ScriptEngine.PLAY_GAME_END, 1);
                    GameContext.page.script.remind(300, 0, null);
                    GameContext.page.script = null;
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
            case Dialog.AGAIN:
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                if (GameContext.page.script != null) {
                    GameContext.setVar(ScriptEngine.PLAY_GAME_END, 1);
                    GameContext.page.script.remind(300, 0, null);
                    GameContext.page.script = null;
                }
                break;
            case Dialog.GIVE_UP_POKE:
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                break;
            case Dialog.BUY_MONEY_OP:
                MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
                break;
        }
    }

    char[] helpTxt;

    private void drawRule(Graphics g) {
        int startx = (SCREEN_WIDTH - 370) >> 1;
        int starty = (SCREEN_HEIGHT - 240) >> 1;
        GameContext.page.drawCommonImage(g, startx, starty, 0);

        final int TXT_LEFT_X = startx + 22;
        final int TXT_TOP_Y = starty + 40;
        final int TXT_W = 300;
        final int TXT_H = 172;
        g.setClip(TXT_LEFT_X, TXT_TOP_Y, TXT_W, TXT_H);
        g.setColor(0xffffff);
        int txtHeight = GameContext.page.font.drawCharsAlignLeft(g, helpTxt, TXT_LEFT_X, TXT_TOP_Y - helpOffsetY, TXT_W);
        g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        //滚动条
        final int ScrollBarRightOffsetX = 27;
        final int ScrollBarOffsetY = 52;
        final int ScrollBarH = 162;
        FishFont.drawScrollBar(g, startx + GamePage.WIDTH_FRAME - ScrollBarRightOffsetX, starty + ScrollBarOffsetY, ScrollBarH, helpOffsetY, txtHeight - TXT_H);
    }

    private boolean doRuleInterfaceDragged(int startX, int startY, int endX, int endY){
        final int DRAG_LIMIT = FishFont.LINE_HEIGHT >> 1;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        final int TXT_DRAW_W = 300;
        final int TXT_DRAW_H = 172;
        final int TXT_H = GameContext.page.font.getCharsHeight(helpTxt, TXT_DRAW_W);
        helpOffsetY -= len * DRAG_LIMIT;
        helpOffsetY = (helpOffsetY > TXT_H - TXT_DRAW_H) ? TXT_H - TXT_DRAW_H : helpOffsetY;
        helpOffsetY = (helpOffsetY < 0) ? 0 : helpOffsetY;
        return true;
    }
}
