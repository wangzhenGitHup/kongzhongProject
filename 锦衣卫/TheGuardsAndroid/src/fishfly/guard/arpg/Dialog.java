/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 * 弹出式对话框在这里处理
 * @author 何召卫@fishfly.com
 */
public class Dialog {
    public static final int WORD_COLOR = 0xfdfdf1;
    public static final int SPECIAL_WORD_COLOR = 0xff5a00;
    public static final int BORDER_WORD_COLOR = -1;
    ///MessageBox相关
    //消息框的类型，决定后续的操作类型
    final int NONE_BOX = 0;
    //按5或者确定键终止
    final int CONFIRM_BOX = 1;
    //提示对话框，过两秒钟自动消失
    final int NOTE_BOX = 2;
    //带按键的提示框
    final int BUTTON_BOX = 3;
    //菜单提示框
    final int MENU_BOX = 4;
    
    int messageBoxType = NONE_BOX;
    
    /**
     * 需要按得特殊按键
     */
    long messageBoxKeyIndex = -1;
    
    int messageTime;
    final int MESSAGE_TIME_MAX = 5;
    
    //这里保存当前操作
    static final int NONE_OP = 0;
    //新游戏
    static final int NEW_GAME_OP = 1;
    //退出游戏
    static final int EXIT_GAME_OP = 2;
    //返回主菜单
    static final int RET_MAIN_MENU_OP = 3;
    //存储游戏
    static final int SAVE_OP = 4;
    //载入游戏
    static final int LOAD_OP = 5;
    //联网
    static final int INTO_ONLINE_OP = 6;
    //短代逻辑
    static final int SMS_COMMAND = 7;
    //购买复活
    static final int LIFE_OP = 8;
    //购买物品
    static final int BUY_ITEM_OP = 9;
    //卖出物品
    static final int SALE_ITEM_OP = 10;
    //再来一把小游戏
    static final int AGAIN = 11;
    //是否弃牌
    static final int GIVE_UP_POKE = 12;
    //购买金币
    static final int BUY_MONEY_OP = 13;
    int btnBoxOp = NONE_OP;
    
    //对话框数据采用Talk的talkChs、talkParts、talkClrs;
    //对话框高度
    boolean boxScrolling = false;
    int boxHeight = 0;
    final int BOX_SCROLL_STEP = 20;
    
    int txtHeight;
    int txtWidth;
    int eachTxtWidth;
    final int BOX_MARGIN = 0;
    final int BOX_FRAME_WIDTH = 4;
    final int BOX_FRAME_MARGIN_X = 8;
    final int BOX_FRAME_MARGIN_Y = 8;
    final int BOX_DIS_W = 50;
    
    //noteBox起始时间
    long boxStartTime;
    
    //菜单对话框中当前项
    int menuBoxItem;
    int menuBoxLeftX;
    int menuBoxTopY;

    int menuBoxItemStart;
    int menuBoxItemMaxCnt;
    final int MENU_BOX_HEIGHT_MAX = Page.SCREEN_HEIGHT >> 1;
    int[] menuBoxItemOffsetX;
    
    //BUTTON_BOX选项
    //是否当前选项是Yes选项
    boolean isYesItem = true;
    
    /**
     * 选项名字
     */
    char[] talkName;
    char[] talkChs;
    int[] talkParts;
    int[] talkClrs;
    
    FishFont font;
    BoxListener lsnr;
    
    char[] volumeTitleTxt;
    MusicPlayer musicPlayer;
    //空挡
    char[] emptyFileTxt;
    char[] saveLoadTitle;
    static boolean alignLeft = true;

    //提示框花边
    static Image imgLaceUp;
    static Image imgLaceBottom;
    static Image imgLaceAngle;

    //是否按键
    static Image imgArcBtnBack;
    static Image imgArcBtnWord;
    
    public Dialog() {

        font = FishFont.getInstance();
        musicPlayer = MusicPlayer.getInstance();
        
        StringManager strMgr = StringManager.getInstance();
        
        final short VOLUME_TITLE = 71;
        volumeTitleTxt = strMgr.getString(VOLUME_TITLE);
        final short EMPTY_FILE_TXT = 66;
        emptyFileTxt = strMgr.getString(EMPTY_FILE_TXT);
        
        final short SAVE_LOAD_TITLE = 143;
        saveLoadTitle = strMgr.getString(SAVE_LOAD_TITLE);

        imgLaceUp = ImageManager.getInstance().getImage((short)95);
        imgLaceBottom = ImageManager.getInstance().getImage((short)121);
        imgLaceAngle = ImageManager.getInstance().getImage((short)133);
        imgArcBtnBack = ImageManager.getInstance().getImage((short)118);
        imgArcBtnWord = ImageManager.getInstance().getImage((short)195);
    }   
    
    public void update() {
        updateKeys();
        if(messageBoxType != NOTE_BOX) {
            return;
        }
        
        if(MainCanvas.currentTime - boxStartTime >= 2000) {
            closeMessageBox();
        }
    } 
    
    private void updateKeys() {
        KeyManager keyMgr = GameContext.page.keyMgr;
        if(keyMgr.isPressed(Keys.MASK_FIRE)) {
            keyPressed(Keys.KEY_FIRE);
            keyMgr.resetKey();
            return;
        }
        
        if(keyMgr.isPressed(Keys.MASK_SOFT1)) {
            keyPressed(Keys.KEY_LEFT_SOFT);
            keyMgr.resetKey();
            return;
        }
        
        if(keyMgr.isPressed(Keys.MASK_SOFT2)) {
            keyPressed(Keys.KEY_RIGHT_SOFT);
            keyMgr.resetKey();
            return;
        }
        
        if(keyMgr.isPressed(Keys.MASK_UP)) {
            keyPressed(Keys.KEY_UP);
            keyMgr.resetKey();
            return;
        }

        if(keyMgr.isPressed(Keys.MASK_DOWN)) {
            keyPressed(Keys.KEY_DOWN);
            keyMgr.resetKey();
            return;
        }

        if(keyMgr.isPressed(Keys.MASK_LEFT)) {
            keyPressed(Keys.KEY_LEFT);
            keyMgr.resetKey();
            return;
        }

        if(keyMgr.isPressed(Keys.MASK_RIGHT)) {
            keyPressed(Keys.KEY_RIGHT);
            keyMgr.resetKey();
            return;
        }

        for (int index = Keys.MASK_NUM0; index <= Keys.MASK_NUM9; index++) {
            keyPressed(Keys.KEY_NUM0 + index);
            keyMgr.resetKey();
            return;
        }
    }
    
    public boolean isAvailable() {
        return messageBoxType != NONE_BOX;
    }
    
    public void keyPressed(int keyCode) {
        if(boxScrolling) {
            return;
        }
        
        switch(messageBoxType) {
            case CONFIRM_BOX:
                doConfirmBoxKey(keyCode);
                return;
                
            case BUTTON_BOX:
                doButtonBoxKey(keyCode);
                return;
                
            case MENU_BOX:
                doMenuBoxKey(keyCode);
                return;
        }
    }
    
    //#if POINT == 1
    public boolean pointerPressed(int px, int py) {
        if(boxScrolling) {
            return false;
        }
        MusicPlayer.getInstance().playSound(SoundConst.SYSBUTTON);
        switch(messageBoxType) {
            case CONFIRM_BOX:
                if (doConfirmBoxPoint(px, py)) {
                    return true;
                }
                return false;

            case BUTTON_BOX:
                if (doButtonBoxPoint(px, py)) {
                    return true;
                }
                return false;

            case MENU_BOX:
                if (doMenuBoxPoint(px, py)) {
                    return true;
                }
                return false;
        }
        return false;
    }

    final private boolean doConfirmBoxPoint(int px, int py) {
	if(messageBoxKeyIndex >= 0){
	    if(!GameContext.point(px, py, (int)(messageBoxKeyIndex >> 48) & 0xffff, (int)(messageBoxKeyIndex >> 32) & 0xffff,
	    (int)(messageBoxKeyIndex >> 16) & 0xffff, (int)(messageBoxKeyIndex) & 0xffff))
	    {
		return false;
	    }
            messageBoxKeyIndex = -1;
            messageBoxType = NONE_BOX;
            talkChs = null;
            talkParts = null;
            if(lsnr == null) {
                return false;
            }
            ScriptEngine script = lsnr.getScript();
            if (script != null)
            {
                script.remind(0, 0, null);
                script = null;
            }
	    return false;
	}
        if(!boxScrolling && messageTime > MESSAGE_TIME_MAX && px != -1 && py != -1) {
            GameContext.page.keyMgr.keyPressed(Keys.KEY_FIRE);
            return true;
        }
        return false;
    }

    final private boolean doButtonBoxPoint(int px, int py) {
        final int BUTTON_HEIGHT = 30;
        final int APPEND_WIDTH = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X;
        final int APPEND_HEIGHT = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_Y;
        final int TXT_LEFT_X = (Page.SCREEN_WIDTH - txtWidth) >> 1;
        final int TXT_TOP_Y = (Page.SCREEN_HEIGHT - txtHeight - BUTTON_HEIGHT) >> 1;
        final int BOX_LEFT_X = TXT_LEFT_X - APPEND_WIDTH;
        final int BOX_TOP_Y = TXT_TOP_Y - APPEND_HEIGHT;
        final int BOX_WIDTH = txtWidth + (APPEND_WIDTH << 1);
        final int BOX_HEIGHT = txtHeight + (APPEND_HEIGHT << 1) + BUTTON_HEIGHT + 2;

        final int DIS = 16;
        final int POINT_W = imgArcBtnBack.getHeight() + DIS;
        final int POINT_Y = BOX_TOP_Y + BOX_HEIGHT - BUTTON_HEIGHT - (DIS >> 1);

        if (GameContext.point(px, py, BOX_LEFT_X - (POINT_W >> 1), POINT_Y, POINT_W, POINT_W)) {
            isYesItem = true;
            doButtonBoxKeyFire();
            return true;
        }
        else if (GameContext.point(px, py, BOX_LEFT_X + BOX_WIDTH - (POINT_W >> 1), POINT_Y, POINT_W, POINT_W)) {
            isYesItem = false;
            doButtonBoxKeyFire();
            return true;
        }
        return false;
    }

    final private boolean doMenuBoxPoint(int px, int py) {
        int pointerIndex = -1;

        final int APPEND_WIDTH = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X;
        final int APPEND_HEIGHT = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_Y;
        final int SIZE = talkParts.length;
        final int ITEM_TOP_Y = menuBoxTopY + APPEND_HEIGHT + txtHeight - (FishFont.LINE_HEIGHT * SIZE);
        final int BOX_WIDTH = txtWidth + (APPEND_WIDTH << 1);

        if (GameContext.point(px, py, menuBoxLeftX, ITEM_TOP_Y, BOX_WIDTH, FishFont.LINE_HEIGHT * SIZE)) {
            pointerIndex = (py - ITEM_TOP_Y) / FishFont.LINE_HEIGHT;
            if (pointerIndex >= SIZE) {
                pointerIndex = SIZE - 1;
            }
        }

        if (pointerIndex == -1)
        {
            return false;
        }
        else if (pointerIndex == menuBoxItem)
        {
//            keyPressed(Keys.KEY_FIRE);
            GameContext.page.keyMgr.keyPressed(Keys.KEY_FIRE);
        }
        else
        {
            menuBoxItem = pointerIndex;
        }
        return true;
    }
    //#endif
    
    public void paint(Graphics g) {
        if(messageBoxType == NONE_BOX) {
            return;
        }
//        if(messageBoxKeyIndex >= 0)
//        {
//            keyPaintUnit.paint(g, 0, 0);
//            keyPaintUnit.updateAnimation();
//        }
        switch(messageBoxType) {
            case CONFIRM_BOX:
                if (isDrawBoxSetPosition) {
                    drawConfirmBox(g, specialBoxX, specialBoxY, specialBoxWidth);
                }
                drawConfirmBox(g);
                return;
            case NOTE_BOX:
                drawConfirmBox(g);
                return;
            case BUTTON_BOX:
                drawButtonBox(g);
                return;
            case MENU_BOX:
                drawMenuBox(g);
                return;
        }
    }
    
    /**
     * 显示消息对话框
     * @param chs
     * @param clr
     */
    public void showMessageBox(char[] chs) {
        messageTime = 0;
        messageBoxType = CONFIRM_BOX;
        isDrawBoxSetPosition = false;
        showSingleColorBox(chs, WORD_COLOR);
        messageBoxKeyIndex = -1;
    }

    //设定box绘制在某一特殊位置
    boolean isDrawBoxSetPosition = false;
    int specialBoxX;
    int specialBoxY;
    int specialBoxWidth;
    public void showMessageBox(char[] chs, int leftX, int topY, int width) {
        messageTime = 0;
        messageBoxType = CONFIRM_BOX;
        messageBoxKeyIndex = -1;
        boxHeight = 5;
        boxScrolling = true;
        talkChs = chs;
        talkParts = new int[1];
        talkParts[0] = chs.length;
        talkClrs = new int[1];
        talkClrs[0] = WORD_COLOR;
        boxStartTime = MainCanvas.currentTime;
        measureTextSize(width);
        isDrawBoxSetPosition = true;
        specialBoxX = leftX;
        specialBoxY = topY;
        specialBoxWidth = width;
    }
    
    public void showMessageBox(String txt) {
        showMessageBox(txt.toCharArray());
    }
    /**
     * 显示消息对话框
     * @param chs
     * @param clr
     */
    public void showMessageBox(char[] chs, long keyIndex) {
        showMessageBox(chs);
        messageBoxKeyIndex = keyIndex;
    }    
    
    private void showSingleColorBox(char[] chs, int clr) {
        boxHeight = 5;
        boxScrolling = true;
        talkChs = chs;
        talkParts = new int[1];
        talkParts[0] = chs.length;
        talkClrs = new int[1];
        talkClrs[0] = clr;
        measureTextSize();
        boxStartTime = MainCanvas.currentTime;
    }
    
    /**
     * 显示多种文字的对话框
     * @param chs
     * @param parts
     * @param clrs
     */
    public void showMultiColorBox(char[] chs, int[] parts, int[] clrs) {
        messageBoxType = CONFIRM_BOX;
        boxHeight = 5;
        boxScrolling = true;
        talkChs = chs;
        talkParts = parts;
        talkClrs = clrs;
        measureTextSize();
        boxStartTime = MainCanvas.currentTime;
    }
    
    /**
     * 测量文本的尺寸，为绘制做好准备
     */
    private void measureTextSize(int txtMaxWidth) {
        txtHeight = 0;
        txtWidth = 0;
        int lineWidth = 0;
        int fontHeight = FishFont.LINE_HEIGHT;
        //#if N7370 || CT
//#             fontHeight = FishFont.FONT_SMALL.getHeight() + 2;
        //#endif
        for(int ich = 0, size = talkChs.length; ich < size; ich++) {
            char ch = talkChs[ich];
            if(ch == '{' || ch == '}') {
                continue;
            }
            if(ch == '&' || ch == '|') {
                txtHeight += fontHeight;
                if(txtWidth < lineWidth) {
                    txtWidth = lineWidth;
                }
                lineWidth = 0;
                continue;
            }
            int chWidth = font.charWidth(ch);
            //#if N7370 || CT
//#                 chWidth = FishFont.FONT_SMALL.charWidth(ch);
            //#endif
            if(lineWidth + chWidth > txtMaxWidth) {
                txtWidth = txtMaxWidth;
                txtHeight += fontHeight;
                lineWidth = chWidth;
                continue;
            }
            lineWidth += chWidth;
        }

        if(lineWidth > 0) {
            txtHeight += fontHeight;
        }

        if(txtWidth < lineWidth) {
            txtWidth = lineWidth;
        }
    }

    private void measureTextSize() {
        final int APPEND_WIDTH = ((BOX_MARGIN + BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X) << 1);
        final int TXT_WIDTH = Page.SCREEN_WIDTH - APPEND_WIDTH - BOX_DIS_W;
        measureTextSize(TXT_WIDTH);
    }
    
    public void showNoteBox(char[] chs) {
        messageBoxType = NOTE_BOX;
        showSingleColorBox(chs, WORD_COLOR);
        boxStartTime = MainCanvas.currentTime;
    }
    
    /**
     * 获得或者失去物品
     * @param isGet
     * @param itemName
     * @param itemCnt
     */
    public void showItemBox(boolean isGet, Item item, int itemLv, int itemCnt) {
        boxStartTime = MainCanvas.currentTime;
        messageBoxType = CONFIRM_BOX;
               
        switch(item.type) {
            //获得装备之后看看是否需要提示他可以打造
            case Item.ADORN:
            case Item.WEAPON:
            case Item.ARMOR:
            case Item.FOOT:
            {
                MyItem i = new MyItem(item);
                StringBuffer buf = new StringBuffer();
                //失去的字符串代码
                short prefixId = 25;
                if (isGet)
                {
                    prefixId = 24;
                }
                char[] prefix = StringManager.getInstance().getString(prefixId);
                buf.append(prefix);
                buf.append(" {").append(item.name).append("} ");
                i.getEffectsDescription();
                talkChs = buf.toString().toCharArray();
                measureTextSize();
            }
            break;
                
            default:
                talkParts = new int[4];
                StringBuffer buf = new StringBuffer();
                //失去的字符串代码
                short prefixId = 25;
                if(isGet) {
                    prefixId = 24;
                }
                char[] prefix = StringManager.getInstance().getString(prefixId);
                buf.append(prefix);
                talkParts[0] = buf.length();
                buf.append(' ');
                buf.append(itemCnt);
                buf.append(' ');
                talkParts[1] = buf.length() - talkParts[0];
                buf.append("{");
                buf.append(item.name);
                buf.append("}");
                talkParts[2] = item.name.length;
                buf.append('&');
                talkParts[3] = 0;
                buf.append(item.desc);
                talkParts[3] += item.desc.length + 1;
                talkChs = buf.toString().toCharArray();
                break;
        }
        measureTextSize();

        boxScrolling = true;
        boxHeight = 5;
    }
    
    public void showButtonBox(char[] chs) {
        messageBoxType = BUTTON_BOX;
        isYesItem = true;
        showSingleColorBox(chs, WORD_COLOR);
    }
    
    public void showBranchBox(char[] chs, char[] name, int[] parts) {
        menuBoxItem = 0;
        menuBoxItemStart = 0;
        menuBoxItemMaxCnt = 0;
        talkName = name;
        setMenuBox(chs, parts);
        boxScrolling = true;
        boxHeight = 5;
        menuBoxLeftX = (Page.SCREEN_WIDTH - txtWidth - ((BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X) << 1)) >> 1;
        menuBoxTopY = (Page.SCREEN_HEIGHT - txtHeight - ((BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_Y) << 1)) >> 1;
    }
    
        /**
     * 在屏幕的某个位置显示一个下拉菜单
     * @param chs
     * @param parts
     * @param leftX
     * @param topY
     */
    public void setMenuBox(char[] chs, int[] parts) {
        messageBoxType = MENU_BOX;
        talkChs = chs;
        talkParts = parts;
        //#if N7370 || CT
//#         txtWidth = FishFont.FONT_SMALL.charsWidth(talkName, 0, talkName.length);
//#         if(txtWidth > SCREEN_WIDTH - BOX_DIS_W)
//#         {
//#             txtWidth = SCREEN_WIDTH - BOX_DIS_W;
//#             txtHeight = font.getCharsWithoutFontHeight(talkName, txtWidth);
//#         }
//#         else
//#         {
//#             txtHeight = FishFont.FONT_SMALL.getHeight() + 2;
//#         }
        //#else
        txtWidth = font.charsWidth(talkName, 0, talkName.length);
        if(txtWidth > Page.SCREEN_WIDTH - BOX_DIS_W)
        {
            txtWidth = Page.SCREEN_WIDTH - BOX_DIS_W;
            txtHeight = font.getCharsHeight(talkName, txtWidth);
        }
        else
        {
            txtHeight = FishFont.LINE_HEIGHT;
        }
        //#endif
        //计算菜单文本的宽高
        eachTxtWidth = 0;
        int offset = 0;
        int partLen = 0;
        for(int ipart = 0, size = parts.length; ipart < size; ipart++) {
            partLen = parts[ipart];
            //#if N7370 || CT
//#             int itemWidth = FishFont.FONT_SMALL.charsWidth(chs, offset, partLen);
            //#else
            int itemWidth = font.charsWidth(chs, offset, partLen);
            //#endif
            if(itemWidth > txtWidth && itemWidth <= Page.SCREEN_WIDTH - BOX_DIS_W) {
                txtWidth = itemWidth;
            }
            if(itemWidth > eachTxtWidth)
            {
                eachTxtWidth = itemWidth;
            }
            if (menuBoxItemMaxCnt == 0) {
                if (txtHeight + FishFont.LINE_HEIGHT > MENU_BOX_HEIGHT_MAX) {
                    menuBoxItemMaxCnt = ipart;
                }
                else {
                    //#if N7370 || CT
//#                     txtHeight += FishFont.FONT_SMALL.getHeight() + 2;
                    //#else
                    txtHeight += FishFont.LINE_HEIGHT;
                    //#endif
                }
            }
            offset += partLen;

            //把这一项的宽度放在顶上
            parts[ipart] |= itemWidth << 16;
        }
        menuBoxItemOffsetX = new int[parts.length];
    }
    
    final private void drawScrollingBoxFrameNew(Graphics g, int leftX, int topY, int width, int height) {
        drawScrollingBoxFrame(g, leftX, topY, width, height);
    }
    
    final private void drawScrollingBoxFrame(Graphics g, int leftX, int topY, int width, int height) {
        if(boxScrolling) {
            drawBoxFrame(g, leftX, topY + ((height - boxHeight) >> 1), width, boxHeight);
            boxHeight += height >> 1;
            if(boxHeight >= height) {
                boxHeight = 5;
                boxScrolling = false;
            }
            return;
        }
    } 
    
    private void drawConfirmBox(Graphics g) {
        messageTime++;
        final int APPEND_WIDTH = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X + BOX_MARGIN;
        final int APPEND_HEIGHT = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_Y;
        final int TXT_LEFT_X = (Page.SCREEN_WIDTH - txtWidth) >> 1;
        final int TXT_TOP_Y = (Page.SCREEN_HEIGHT - txtHeight) >> 1;
        final int BOX_LEFT_X = TXT_LEFT_X - APPEND_WIDTH;
        final int BOX_TOP_Y = TXT_TOP_Y - APPEND_HEIGHT;
        final int BOX_WIDTH = txtWidth + (APPEND_WIDTH << 1);
        final int BOX_HEIGHT = txtHeight + (APPEND_HEIGHT << 1);
        if(boxScrolling) {
            drawScrollingBoxFrame(g, BOX_LEFT_X, BOX_TOP_Y, BOX_WIDTH, BOX_HEIGHT);
            return;
        }
        drawBoxFrameNew(g, BOX_LEFT_X, BOX_TOP_Y, BOX_WIDTH, BOX_HEIGHT);
        //#if N7370 || CT
//#         font.drawTxtWithColorWithoutFont(g, talkChs, 0, talkChs.length, txtWidth, 0, TXT_LEFT_X, TXT_TOP_Y + 2, WORD_COLOR, SPECIAL_WORD_COLOR, -1, 0);
        //#else
        font.drawTxtWithColor(g, talkChs, txtWidth, TXT_LEFT_X, TXT_TOP_Y + 2, WORD_COLOR, SPECIAL_WORD_COLOR, -1);
        //#endif
    }

    private void drawConfirmBox(Graphics g, int leftX, int topY, int txtWidth) {
        messageTime++;
        final int APPEND_WIDTH = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X + BOX_MARGIN;
        final int APPEND_HEIGHT = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_Y;
        final int TXT_LEFT_X = leftX;
        final int TXT_TOP_Y = topY;
        final int BOX_LEFT_X = TXT_LEFT_X - APPEND_WIDTH;
        final int BOX_TOP_Y = TXT_TOP_Y - APPEND_HEIGHT;
        final int BOX_WIDTH = txtWidth + (APPEND_WIDTH << 1);
        final int BOX_HEIGHT = txtHeight + (APPEND_HEIGHT << 1);
        if(boxScrolling) {
            drawScrollingBoxFrame(g, BOX_LEFT_X, BOX_TOP_Y, BOX_WIDTH, BOX_HEIGHT);
            return;
        }
        drawBoxFrameNew(g, BOX_LEFT_X, BOX_TOP_Y, BOX_WIDTH, BOX_HEIGHT);
        //#if N7370 || CT
//#         font.drawTxtWithColorWithoutFont(g, talkChs, 0, talkChs.length, txtWidth, 0, TXT_LEFT_X, TXT_TOP_Y + 2, WORD_COLOR, SPECIAL_WORD_COLOR, -1, 0);
        //#else
        font.drawTxtWithColor(g, talkChs, txtWidth, TXT_LEFT_X, TXT_TOP_Y + 2, WORD_COLOR, SPECIAL_WORD_COLOR, -1);
        //#endif
    }
    
    private void drawButtonBox(Graphics g) {
//        //#if N7370 || CT
////#         final int fontHeight = FishFont.FONT_SMALL.getHeight() + 2;
//        //#else
//        final int fontHeight = FishFont.LINE_HEIGHT;
//        //#endif
//        final int BUTTON_HEIGHT = fontHeight << 1;
        final int BUTTON_HEIGHT = 30;
        final int APPEND_WIDTH = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X;
        final int APPEND_HEIGHT = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_Y;
        final int TXT_LEFT_X = (Page.SCREEN_WIDTH - txtWidth) >> 1;
        final int TXT_TOP_Y = (Page.SCREEN_HEIGHT - txtHeight - BUTTON_HEIGHT) >> 1;
        final int BOX_LEFT_X = TXT_LEFT_X - APPEND_WIDTH;
        final int BOX_TOP_Y = TXT_TOP_Y - APPEND_HEIGHT;
        final int BOX_WIDTH = txtWidth + (APPEND_WIDTH << 1);
        final int BOX_HEIGHT = txtHeight + (APPEND_HEIGHT << 1) + BUTTON_HEIGHT + 2;
        if(boxScrolling) {
            drawScrollingBoxFrame(g, BOX_LEFT_X, BOX_TOP_Y, BOX_WIDTH, BOX_HEIGHT);
            return;
        }

        drawBoxFrameNew(g, BOX_LEFT_X, BOX_TOP_Y, BOX_WIDTH, BOX_HEIGHT);
        //#if N7370 || CT
//#         font.drawTxtWithColorWithoutFont(g, talkChs, 0, talkChs.length, txtWidth, 0, TXT_LEFT_X, TXT_TOP_Y + 2, WORD_COLOR, SPECIAL_WORD_COLOR, BORDER_WORD_COLOR, 0);
        //#else
        font.drawTxtWithColor(g, talkChs, txtWidth, TXT_LEFT_X, TXT_TOP_Y + 2, WORD_COLOR, SPECIAL_WORD_COLOR, BORDER_WORD_COLOR);
        //#endif

        final int BTN_Y = BOX_TOP_Y + BOX_HEIGHT - BUTTON_HEIGHT;
        g.drawImage(imgArcBtnBack, BOX_LEFT_X, BTN_Y, Graphics.HCENTER | Graphics.TOP);
        g.drawImage(imgArcBtnBack, BOX_LEFT_X + BOX_WIDTH, BTN_Y, Graphics.HCENTER | Graphics.TOP);
        final int TXT_W = imgArcBtnWord.getWidth() >> 1;
        final int TXT_H = imgArcBtnWord.getHeight();
        final int TXT_Y = BTN_Y + (imgArcBtnBack.getHeight() >> 1) - (TXT_H >> 1);
        Util.drawClipImage(g, imgArcBtnWord, BOX_LEFT_X - (TXT_W >> 1), TXT_Y, 0, 0, TXT_W, TXT_H);
        Util.drawClipImage(g, imgArcBtnWord, BOX_LEFT_X + BOX_WIDTH - (TXT_W >> 1), TXT_Y, TXT_W, 0, TXT_W, TXT_H);

//        //移植的时候，直接预编译这里处理
//        g.setColor(0xf8dd36);
//        final char LEFT_CH = '是';
//        final char RIGHT_CH = '否';
//        int buttonY = TXT_TOP_Y + txtHeight;
//        int boxWidth = txtWidth + (BOX_FRAME_MARGIN_X << 1);
//        if(isYesItem) {
//            g.setColor(0x261f31);
//            g.fillRect(BOX_LEFT_X + BOX_FRAME_WIDTH, buttonY, boxWidth, fontHeight);
//            g.setColor(0xed5c0b);
//        }
//        //#if N7370 || CT
////#         int chWidth = FishFont.FONT_SMALL.charWidth(LEFT_CH);
////#         g.drawChar(LEFT_CH, (SCREEN_WIDTH - chWidth) >> 1, buttonY, 0);
//        //#else
//        int chWidth = font.charWidth(LEFT_CH);
//        font.drawChar(g, LEFT_CH, (SCREEN_WIDTH - chWidth) >> 1, buttonY + 1);
//        //#endif
//        g.setColor(0xf8dd36);
//        buttonY += fontHeight;
//        if(!isYesItem) {
//            g.setColor(0x261f31);
//            g.fillRect(BOX_LEFT_X + BOX_FRAME_WIDTH, buttonY, boxWidth, fontHeight);
//            g.setColor(0xed5c0b);
//        }
//        //#if N7370 || CT
////#         chWidth = FishFont.FONT_SMALL.charWidth(RIGHT_CH);
////#         g.drawChar(RIGHT_CH, (SCREEN_WIDTH - chWidth) >> 1, buttonY, 0);
//        //#else
//        chWidth = font.charWidth(RIGHT_CH);
//        font.drawChar(g, RIGHT_CH, (SCREEN_WIDTH - chWidth) >> 1, buttonY + 1);
//        //#endif
    }

    private void drawMenuBox(Graphics g) {
        //#if N7370 || CT
//#         final int fontHeight = FishFont.FONT_SMALL.getHeight() + 2;
        //#else
        final int fontHeight = FishFont.LINE_HEIGHT;
        //#endif
        final int APPEND_WIDTH = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_X;
        final int APPEND_HEIGHT = BOX_FRAME_WIDTH + BOX_FRAME_MARGIN_Y;
        final int TXT_LEFT_X = (Page.SCREEN_WIDTH - eachTxtWidth) >> 1;
        final int TXT_TOP_Y = menuBoxTopY + APPEND_HEIGHT;
        final int BOX_WIDTH = txtWidth + (APPEND_WIDTH << 1);
        final int BOX_HEIGHT = txtHeight + (APPEND_HEIGHT << 1);
        if(boxScrolling) {
            drawScrollingBoxFrame(g, menuBoxLeftX, menuBoxTopY, BOX_WIDTH, BOX_HEIGHT);
            return;
        }

        drawBoxFrameNew(g, menuBoxLeftX, menuBoxTopY, BOX_WIDTH, BOX_HEIGHT);
        int partLen = 0;
        int offset = 0;
        int x = TXT_LEFT_X;
        int y = TXT_TOP_Y;
        g.setColor(0xf8db35);
        int menuX = (Page.SCREEN_WIDTH >> 1) - (txtWidth >> 1);
        if (x < menuX) {
            x = menuX;
        }
        //#if N7370 || CT
//#         font.drawTxtWithColorWithoutFont(g, talkName, 0, talkName.length, txtWidth, 0, menuX, y, WORD_COLOR, SPECIAL_WORD_COLOR, BORDER_WORD_COLOR, 0);
//#         y += font.getCharsWithoutFontHeight(talkName, txtWidth) + 2;
        //#else
        font.drawTxtWithColor(g, talkName, txtWidth, menuX, y, WORD_COLOR, SPECIAL_WORD_COLOR, BORDER_WORD_COLOR);
        y += font.getCharsHeight(talkName, txtWidth);
        //#endif

        int txtY = y;
        int talkPartsCnt = talkParts.length;
        if (menuBoxItemMaxCnt != 0) {
            talkPartsCnt = menuBoxItemMaxCnt;
            talkPartsCnt += menuBoxItemStart;
        }
        for(int ipart = 0, size = talkPartsCnt; ipart < size; ipart++) {
            int part = talkParts[ipart];
            partLen = part & 0xffff;
            if (ipart < menuBoxItemStart) {
                offset += partLen;
                continue;
            }
            int wordColor = 0;
            if(ipart == menuBoxItem) {
                g.setColor(0x261f31);
                g.fillRect(menuX - 3, y - 2, txtWidth + 6, fontHeight);
                wordColor = 0xeb5f0a;
            } else {
                wordColor = 0xfbdc36;
            }
            //#if N7370 || CT
//#             g.setClip(x, y, txtWidth, fontHeight);
//#             g.setColor(wordColor);
//#             g.drawChars(talkChs, offset, partLen, x - menuBoxItemOffsetX[ipart], y, 0);
//#             g.setClip(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
//#             if(eachTxtWidth > txtWidth) {
//#                 int itemW = FishFont.FONT_SMALL.charsWidth(talkChs, offset, partLen);
//#                 if (itemW > txtWidth && ipart == menuBoxItem) {
//#                     menuBoxItemOffsetX[ipart] += 3;
//#                     if (menuBoxItemOffsetX[ipart] >= itemW) {
//#                         menuBoxItemOffsetX[ipart] = - txtWidth;
//#                     }
//#                 }
//#             }
            //#else
            font.drawChars(g, talkChs, offset, partLen, x, y, wordColor, 0xF8382F);
            //#endif
            offset += partLen;
            y += fontHeight;
        }
        if (menuBoxItemMaxCnt != 0) {
            FishFont.drawScrollBar(g, menuBoxLeftX + BOX_WIDTH + 6, txtY + 13, menuBoxItemMaxCnt * fontHeight - 32, menuBoxItem, talkParts.length);
        }
    }
   
    public static void drawBoxFrameNew(Graphics g, int leftX, int topY, int width, int height) {
        drawBoxFrame(g, leftX, topY, width, height);
        g.drawImage(imgLaceAngle, leftX, topY, 0);
        Util.drawRegion(g, imgLaceAngle, 0, 0, imgLaceAngle.getWidth(), imgLaceAngle.getHeight(), Sprite.TRANS_MIRROR, leftX + width, topY , Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, imgLaceAngle, 0, 0, imgLaceAngle.getWidth(), imgLaceAngle.getHeight(), Sprite.TRANS_ROT270, leftX, topY + height - imgLaceAngle.getHeight(), Graphics.LEFT | Graphics.TOP);
        Util.drawRegion(g, imgLaceAngle, 0, 0, imgLaceAngle.getWidth(), imgLaceAngle.getHeight(), Sprite.TRANS_ROT180, leftX + width - imgLaceAngle.getWidth(), topY + height - imgLaceAngle.getHeight(), Graphics.LEFT | Graphics.TOP);
    }
    
    public static void drawBoxFrame(Graphics g, int leftX, int topY, int width, int height) {
        g.setColor(0);
        g.drawRect(leftX - 1, topY - 1, width + 1, height + 1);
        g.setColor(0x897069);
        g.fillRect(leftX, topY, width, height);
        final int FRAME_LEFT_W = 3;
        g.setColor(0x4a473a);
        g.fillRect(leftX, topY, FRAME_LEFT_W, height);
        g.fillRect(leftX + width - FRAME_LEFT_W, topY, FRAME_LEFT_W, height);
        g.setColor(0x6f6556);
        int lineX = leftX + FRAME_LEFT_W;
        g.drawLine(lineX, topY, lineX, topY + height - 1);
        lineX = leftX + width - FRAME_LEFT_W - 1;
        g.drawLine(lineX, topY, lineX, topY + height - 1);
        final int LACE_BOTTOM_IMG_W = imgLaceBottom.getWidth();
        final int LACE_BOTTOM_IMG_H = imgLaceBottom.getHeight();
        int laceW = width >> 1;
        if (laceW > LACE_BOTTOM_IMG_W) {
            laceW = laceW - LACE_BOTTOM_IMG_W + 1;
            Util.drawRegion(g, imgLaceUp, LACE_BOTTOM_IMG_W - laceW, 0, laceW, imgLaceUp.getHeight(), Sprite.TRANS_MIRROR, Page.SCREEN_WIDTH >> 1, topY, Graphics.RIGHT | Graphics.TOP);
            Util.drawClipImage(g, imgLaceUp, Page.SCREEN_WIDTH >> 1, topY, LACE_BOTTOM_IMG_W - laceW, 0, laceW, imgLaceUp.getHeight());
            Util.drawRegion(g, imgLaceBottom, LACE_BOTTOM_IMG_W - laceW, 0, laceW, LACE_BOTTOM_IMG_H, Sprite.TRANS_MIRROR, Page.SCREEN_WIDTH >> 1, topY + height, Graphics.RIGHT | Graphics.BOTTOM);
            Util.drawClipImage(g, imgLaceBottom, Page.SCREEN_WIDTH >> 1, topY + height - LACE_BOTTOM_IMG_H, LACE_BOTTOM_IMG_W - laceW, 0, laceW, imgLaceBottom.getHeight());
            laceW = LACE_BOTTOM_IMG_W;
        }
        else {
            laceW++;
        }
        Util.drawClipImage(g, imgLaceUp, leftX, topY, 0, 0, laceW, imgLaceUp.getHeight());
        Util.drawRegion(g, imgLaceUp, 0, 0, laceW, imgLaceUp.getHeight(), Sprite.TRANS_MIRROR, leftX + width, topY, Graphics.RIGHT | Graphics.TOP);
        Util.drawClipImage(g, imgLaceBottom, leftX, topY + height - imgLaceBottom.getHeight(), 0, 0, laceW, LACE_BOTTOM_IMG_H);
        Util.drawRegion(g, imgLaceBottom, 0, 0, laceW, LACE_BOTTOM_IMG_H, Sprite.TRANS_MIRROR, leftX + width, topY + height, Graphics.RIGHT | Graphics.BOTTOM);
    }
    
    final private void doMenuBoxKey(int keyCode) {
        switch(keyCode) {
            case Keys.KEY_NUM2:
            case Keys.KEY_UP:
                if(menuBoxItem > 0) {
                    menuBoxItemOffsetX[menuBoxItem] = 0;
                    menuBoxItem--;
                    if (menuBoxItemStart > 0) {
                        menuBoxItemStart--;
                    }
                }
                return;
            case Keys.KEY_NUM8:
            case Keys.KEY_DOWN:
                if(menuBoxItem < talkParts.length - 1) {
                    menuBoxItemOffsetX[menuBoxItem] = 0;
                    menuBoxItem++;
                    if (menuBoxItemMaxCnt != 0 && menuBoxItem >= menuBoxItemMaxCnt) {
                        menuBoxItemStart++;
                    }
                }
                return;
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                messageBoxType = NONE_BOX;
                talkChs = null;
                talkParts = null;
                if(lsnr == null) {
                    return;
                }
                ScriptEngine script = lsnr.getScript();
                if (script != null)
                {
                    script.remind(menuBoxItem, 0, null);
                    script = null;
                }
                return;
        }
    }
    
    final private void doConfirmBoxKey(int keyCode) {
        if(!boxScrolling && messageTime > MESSAGE_TIME_MAX && (keyCode == Keys.KEY_FIRE || keyCode == Keys.KEY_NUM5)) {
            closeMessageBox();
        }
        if(messageBoxKeyIndex >= 0 && keyCode - Keys.KEY_NUM0 == messageBoxKeyIndex)
        {
            messageBoxKeyIndex = -1;
            messageBoxType = NONE_BOX;
            talkChs = null;
            talkParts = null;
            if(lsnr == null) {
                return;
            }
            ScriptEngine script = lsnr.getScript();
            if (script != null)
            {
                script.remind(0, 0, null);
                script = null;
            }           
        }
    }
    
    final public void closeMessageBox() {
        if(messageBoxKeyIndex >= 0)
        {
            return;
        }
        talkChs = null;
        talkParts = null;
        int boxType = messageBoxType;
        messageBoxType = NONE_BOX;
        
        if(boxType == BUTTON_BOX) {
            return;
        }
        
        if(lsnr == null) {
            return;
        }
        
        ScriptEngine script = lsnr.getScript();
        if(script != null) {
            script.remind(0, 0, null);
            script = null;
        }
    }
    
    final private void doButtonBoxKey(int keyCode) {
        switch(keyCode) {
            //预编译直接更换键值，就可以移植了
            case Keys.KEY_LEFT_SOFT:
                isYesItem = true;
                doButtonBoxKeyFire();
                break;
            case Keys.KEY_RIGHT_SOFT:
                isYesItem = false;
                doButtonBoxKeyFire();
                return;
        }
    }

    final private void doButtonBoxKeyFire() {
        closeMessageBox();
        if (lsnr == null) {
            return;
        }
        ScriptEngine script = lsnr.getScript();
        if (script != null && script.type == ScriptEngine.BRANCH_EVENT) {
            int itemIndex = isYesItem ? 0 : 1;
            script.remind(itemIndex, 0, null);
            script = null;
            return;
        }
        if (isYesItem) {
            lsnr.doOkButtonFire();
        }
        else {
            lsnr.doReturnButtonFire();
        }
    }
}
