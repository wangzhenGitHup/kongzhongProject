/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

/**
 * SMS == 0:无计费
 * SMS == 1:全计费
 * SMS == 2:只有剧情计费，在游戏中弹出
 * SMS == 3:游戏激活，在主界面触发
 */

package fishfly.guard.arpg;
//#if SMS == 1 || SMS == 2
import android.content.Intent;
import com.uc.paymentsdk.payment.PaymentInfo;
import com.uc.paymentsdk.payment.PaymentsActivity;
import javax.microedition.lcdui.Display;
import cost.CostListener;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;
import javax.microedition.rms.RecordEnumeration;
import javax.microedition.rms.RecordStore;
//#endif
/**
 * 发送短信的线程
 * @author 何召卫@fishfly.com
 */
public class Sms
        //#if SMS == 1 || SMS == 2
        implements CostListener
        //#endif
{
    //#if SMS == 1 || SMS == 2

    //复活的计费点
    public static int RISE_ID = 1;

    final static int STATE_NOT_SHOW = 0;//不显示
    final static int STATE_SHOW_LIST = 1;//显示菜单
    final static int STATE_SHOW_MSG = 2;//显示计费内容
    final static int STATE_SHOW_NOTE = 3;//显示结果
    final static int STATE_SUPER_SHOP = 4;//显示结果
    private int smsState = STATE_NOT_SHOW;
    int oldSmsState = STATE_NOT_SHOW;

    //显示发送确认
    boolean isSendConfirm;
    //确认发送第二条短信
    boolean isSecondMsg;
    
    //是否在发送中，如果在发送中，就不能继续发送
    boolean sendingSms;
    String sendingTxt;
    int sendingStep = 0;

    //发送失败
    boolean sendFail = false;

    /**
     * 监听
     */
    public ScriptEngine observer;
    FishFont font;

    char[][] itemList;
    int itemIdx;
    int[] LIST_REQUEST = {2, 3, 4, 5, 6};
    int ITEM_CNT = LIST_REQUEST.length;

    char[] itemDetail;
    char[] confirmTxt;
    char[] note;

    char[] okTxt;
    char[] retTxt;

    //短信信息的存储格式
    int msgCnt;
    char[][] msgDescs;
    //索引，每个的上16位表示是否有第二组号码
    int[] msgIdxs;

    //钱的上限
    int moneyUpLimit;
    char[][] numbers;
    char[][] msgs;
    int[] counts;
    int[] prices;
    /**
     * 短代判断
     */
    int smsCount;
    /**
     * 每个计费点发送成功的条数
     */
    int[] sucessValue;
    /**
     * 花费的所有钱数
     */
    int allValue;

    //正在显示第几个计费点
    int msgIdx;

    //已经购买过的提示信息
    char[] buyOverTxt;

    //双倍经验
    static boolean doubleExp;
    //双倍金钱
    static boolean doubleMoney;
    //仙锁决
    static boolean needNotKey;
    //完成剧情
    static boolean allStory;

    static int data1;
    static int data2;
    static int data3;
    static int data4;

    final String RMS_NAME = "guardbigsms";
    final String RMS_COUNT_NAME = "guardbigcount";
    //计费请求id
    //唯一标识是哪个计费点，这个一般从显示详细信息开始，就发生作用了
    int requestId;

    /**
     * 计费请求ID相关
     * 剧情计费
     * 复活
     * 双倍金钱
     * 双倍经验
     * 5万金钱
     * 连升5级
     * 官职3级
     */

    /**
     * 开始新游戏的时候需要重置这些值，并存入RMS中
     */
    public void resetRms() {
    }
    int billingId;
    /**
     * 处理所有内部的和外来的计费请求
     * 主要是触发显示环节
     * 调整各个参数的值，为显示做好准备即可
     * @param id
     */
    final public void doChargeRequest(int id) {
        requestId = id;
        GameContext.cost.initSmsData();
        final short SMS_STR_ID = 113;
        String str = new String(StringManager.getInstance().getString(SMS_STR_ID));
        if (GameContext.version == 2) {
        switch (id) {
            case 0://关卡
                billingId = 2;
                break;
            case 2://双倍金钱
            case 3://双倍经验
            case 5://连升五级
            case 6://官升三级
                billingId = 1;
                break;
            case 4://五万金钱
                billingId = 3;
                break;
        }
        }

        switch(id) {
            //开启剧情
            case 0:
                //已经购买了剧情
                if(allStory) {
                    GameContext.setVar(str, 1);
                    if(observer != null && observer.isSuspend) {
                        observer.remind(0, 0, null);
                    }
                    break;
                }
                msgIdx = 0;
                break;

            //复活
            case 1:
                msgIdx = 1;
                break;

            //2倍金钱
            case 2:
                msgIdx = 2;
                break;

            //2倍经验
            case 3:
                msgIdx = 3;
                break;

            //购买金钱
            case 4:
                msgIdx = 4;
                break;

            //购买等级
            case 5:
                msgIdx = 5;
                break;

            //购买官职
            case 6:
                msgIdx = 6;
                break;
        }
        if (GameContext.version == 2) {
            showItem(msgIdx);
        } else {
            startSend();
        }
    }

    /**
     * 处理SMS
     * @param id
     * @param param
     */
    final public void doSmsCommand() {
        Actor actor = GameContext.actor;
        GamePage page = GameContext.page;
        StringBuffer buf = null;
        final short SMS_STR_ID = 113;//这是个神马
        String str = new String(StringManager.getInstance().getString(SMS_STR_ID));
        switch(requestId) {
            //开启剧情
           case 0:
                GameContext.setVar(str, 1);
               allStory = true;
                actor.addMoney(30000);
                actor.addItem((short)30, 5);
                actor.addItem((short)31, 3);
                buf = new StringBuffer();
                buf.append("开启全部剧情！并赠送30000金，5个金疮药，3个百花酿。");
                GameContext.setVar(ScriptEngine.NEED_NOT_STORY, 1);//全部剧情
                page.dlg.showMessageBox(buf.toString().toCharArray());
                return;

            //购买复活
            case 1:
                GameContext.actor.setActorSuper(50);
                GameContext.actor.hp = GameContext.actor.maxHp;
                GameContext.actor.status = RoleConst.STAND_STATUS;
                GameContext.actor.changeAction();
                actor.addLevel(2);
                actor.addMoney(10000);
                GameContext.addVar(EffortManager.EFFORT_BUY_RISE, 1);
                buf = new StringBuffer("原地复活！并连升2级，赠送10000金。");
                page.dlg.showMessageBox(buf.toString().toCharArray());
                return;
                
            //2倍金钱
            case 2:
                doubleMoney = true;
                page.dlg.showMessageBox("开启双倍金钱".toCharArray());
                return;

            //3倍经验
            case 3:
                doubleExp = true;
                page.dlg.showMessageBox("开启双倍经验".toCharArray());
                return;

            //购买金钱
            case 4:
                GameContext.setVar(str, 1);
                actor.addMoney(50000);
                page.dlg.showMessageBox("获得50000金".toCharArray());
                if (GameContext.page.script != null)
                {
                    GameContext.page.script.remind(GamePage.SELECT_OK, 0, null);
                }
                GameContext.addVar(EffortManager.EFFORT_BUY_MONEY, 1);
                return;

            //购买等级
            case 5:
                actor.addLevel(5);
                page.dlg.showMessageBox("连升5级！".toCharArray());
                GameContext.addVar(EffortManager.EFFORT_BUY_LV, 1);
                return;

            //购买官职
            case 6:
                GameContext.addVar(EffortManager.EFFORT_BUY_OFFICIAL, 1);
                actor.officialLv += 3;
                if (GameContext.actor.officialLv > GameContext.page.officialName.length - 2) {
                    GameContext.actor.officialLv = GameContext.page.officialName.length - 2;
                }
                GameContext.actor.featPoints = EffortManager.getInstance().effortOfficialTarget[GameContext.actor.officialLv - 1];
                actor.addMoney(5000);
                page.dlg.showMessageBox("官职连升3级！并赠送5000金。".toCharArray());
                return;

        }
    }

    /**
     * 初始化短代逻辑修改的系统变量
     * @return
     */
    public void initSmsVar()
    {
        if(needNotKey)
        {
            GameContext.setVar(ScriptEngine.NEED_NOT_KEY, 1);
        }
	if(allStory)
	{
	    GameContext.setVar(ScriptEngine.NEED_NOT_STORY, 1);
	}
    }

    final public void loadRms() {
        try {
            RecordStore rs = RecordStore.openRecordStore(RMS_NAME, true);
            int numRecord = rs.getNumRecords();
            //存档为空
            if (numRecord == 0) {
                rs.closeRecordStore();
                return;
            }
            byte[] data = rs.getRecord(1);
            readData(data);
            rs.closeRecordStore();
        } catch (Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    final private void readData(byte[] data) throws IOException {
        ByteArrayInputStream byteIn = new ByteArrayInputStream(data);
        DataInputStream dataIn = new DataInputStream(byteIn);
        allStory = dataIn.readBoolean();
        needNotKey = dataIn.readBoolean();
        doubleExp = dataIn.readBoolean();
        doubleMoney = dataIn.readBoolean();
	data1 = dataIn.readInt();
	data2 = dataIn.readInt();
	data3 = dataIn.readInt();
	data4 = dataIn.readInt();
        dataIn.close();
        byteIn.close();
    }

    final public void saveRms() {
        try {
            RecordStore rs = RecordStore.openRecordStore(RMS_NAME, true);
            ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
            DataOutputStream dataOut = new DataOutputStream(byteOut);
            dataOut.writeBoolean(allStory);
            dataOut.writeBoolean(needNotKey);
            dataOut.writeBoolean(doubleExp);
            dataOut.writeBoolean(doubleMoney);
	    dataOut.writeInt(data1);
	    dataOut.writeInt(data2);
	    dataOut.writeInt(data3);
	    dataOut.writeInt(data4);

            byte[] data = byteOut.toByteArray();
            if(rs.getNumRecords() == 0) {
                rs.addRecord(data, 0, data.length);
            } else {
                rs.setRecord(1, data, 0, data.length);
            }
            rs.closeRecordStore();
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    /**
     * 添加发送成功条数
     * @param smsId
     */
    private void addSucessValue(int smsId)
    {
        sucessValue[smsId] += smsOncePrice == 0 ? smsPrice(smsId) : smsOncePrice;
        if(sucessValue[smsId] >= smsCount(smsId) * smsPrice(smsId))
        {
            sucessValue[smsId] = 0;
        }
        //花费总价格增加
        allValue += smsOncePrice == 0 ? smsPrice(smsId) : smsOncePrice;
    }

    /**
     * 保存成功条数
     */
    private void saveSucessCount()
    {
        try
        {
            RecordStore re = RecordStore.openRecordStore(RMS_COUNT_NAME, true);
            if(re.getNumRecords() == 0)
            {
                byte[] buf = new byte[2];
                re.addRecord(buf, 0, buf.length);
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            DataOutputStream on = new DataOutputStream(out);
            on.writeShort(sucessValue.length);
            for(int index = 0, count = sucessValue.length; index < count; index++)
            {
                on.writeShort(sucessValue[index]);
            }
            on.writeShort(allValue);
            byte[] buf = out.toByteArray();
            re.setRecord(1, buf, 0, buf.length);
            re.closeRecordStore();
        }
        catch (Exception e)
        {
        }
    }

    /**
     * 读取已经发送的成功条数
     */
    private void loadSucessCount()
    {
        try
        {
            RecordStore re = RecordStore.openRecordStore(RMS_COUNT_NAME, true);
            if(re.getNumRecords() == 0)
            {
                return;
            }
            byte[] buf = re.getRecord(1);
            DataInputStream in = new DataInputStream(new ByteArrayInputStream(buf));
            sucessValue = new int[in.readShort()];
            for(int index = 0, count = sucessValue.length; index < count; index++)
            {
                sucessValue[index] = in.readShort();
            }
            allValue = in.readShort();
            re.closeRecordStore();
        }
        catch (Exception e)
        {
        }
    }

    final public void init() {
        System.out.println("初始化计费内容");
        StringManager strMgr = StringManager.getInstance();
        itemList = new char[ITEM_CNT][];
        final short START_ITEM = 84;

        for(int i = 1; i < ITEM_CNT; i++) {
            itemList[i] = strMgr.getString((short)(START_ITEM + i));
        }

        itemList[0] = strMgr.getString((short)(94));
        final short OK_TXT = 27;
        okTxt = strMgr.getString(OK_TXT);

        final short RET_TXT = 28;
        retTxt = strMgr.getString(RET_TXT);
        font = FishFont.getInstance();

        final short BUY_OVER = 100;
        buyOverTxt = strMgr.getString(BUY_OVER);

        final short SENDING_TXT = 107;
        sendingTxt = new String(strMgr.getString(SENDING_TXT));

        confirmTxt = "是否发送".toCharArray();

        loadImages();

        loadSms();

        loadRms();

        loadSucessCount();

        if (!allStory && (counts[0] * prices[0] == 0)) {
            allStory = true;
        }
    }

    final private void loadImages() {
        ImageManager imgMgr = ImageManager.getInstance();
    }

    final private void loadSms() {
        try {
            final String SMS_FILE = "/sms.fs";
            byte[] encryptData = Util.readFully(SMS_FILE);
            byte[] data = Util.decryptDataWithMd5(encryptData);
            ByteArrayInputStream byteIn = new ByteArrayInputStream(data);
            DataInputStream dataIn = new DataInputStream(byteIn);
            msgCnt = dataIn.readShort();
            moneyUpLimit = dataIn.readShort();

            int dataLen = msgCnt << 1;
            msgDescs = new char[msgCnt][];
            msgIdxs = new int[msgCnt];
            char[][] nums = new char[dataLen][];
            char[][] ms = new char[dataLen][];
            int[] cnts = new int[dataLen];
            int[] ps = new int[dataLen];
            int idata = 0;
            for(int i = 0; i < msgCnt; i++) {
                msgDescs[i] = dataIn.readUTF().toCharArray();
                //#if PRINTDEBUG == 1
//                System.out.println(new String(msgDescs[i]));
                //#endif
                nums[idata] = dataIn.readUTF().toCharArray();
                ms[idata] = dataIn.readUTF().toCharArray();
                cnts[idata] = dataIn.readShort();
                ps[idata] = dataIn.readShort();
                msgIdxs[i] = idata;
                idata++;
                boolean hasOne = dataIn.readBoolean();
                if(!hasOne) {
                    continue;
                }
                nums[idata] = dataIn.readUTF().toCharArray();
                ms[idata] = dataIn.readUTF().toCharArray();
                cnts[idata] = dataIn.readShort();
                ps[idata] = dataIn.readShort();

                //把高位标识一下就可以啦
                msgIdxs[i] |= 0x010000;
                idata++;
            }
            sucessValue = new int[msgCnt];
            //将多余的水分挤掉
            numbers = new char[idata][];
            System.arraycopy(nums, 0, numbers, 0, idata);

            msgs = new char[idata][];
            System.arraycopy(ms, 0, msgs, 0, idata);

            counts = new int[idata];
            System.arraycopy(cnts, 0, counts, 0, idata);

            prices = new int[idata];
            System.arraycopy(ps, 0, prices, 0, idata);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    final public void show() {
        smsState = STATE_SHOW_LIST;
        itemIdx = 0;
    }

    final public void close() {
        smsState = STATE_NOT_SHOW;
        itemIdx = 0;
    }

    public boolean isShowing() {
        return smsState != STATE_NOT_SHOW;
    }

    public int getSmsState() {
        return smsState;
    }

    final public void paint(Graphics g) {
        switch(smsState)
        {
            case STATE_SHOW_LIST:
                break;

            case STATE_SHOW_NOTE:
                drawNote(g);
                break;

            case STATE_SHOW_MSG:
                drawItemDetail(g);
                drawConfirm(g);
                drawSending(g);
                break;

            case STATE_SUPER_SHOP:
                break;
        }
    }

    final int FRAME_W = 360;
    final int FRAME_Y = 16;
    final int FRAME_H = 240;
    final private void drawItemDetail(Graphics g) {
        final int FRAME_X = (Page.SCREEN_WIDTH - FRAME_W) >> 1;
        GameContext.page.drawSmsFrameBack(g, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
        drawTxt(g, itemDetail);
        if (isCanSendMsg) {
            GameContext.page.drawMenuButtons(g, true, true, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
        }
        else {
            GameContext.page.drawMenuButtons(g, false, true, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
        }
    }

    final private void drawNote(Graphics g) {
        final int FRAME_X = (Page.SCREEN_WIDTH - FRAME_W) >> 1;
        GameContext.page.drawSmsFrameBack(g, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
        drawTxt(g, note);
        GameContext.page.drawMenuButtons(g, false, true, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
    }

    final private void drawTxt(Graphics g, char[] txt) {
        final int TXT_X = ((Page.SCREEN_WIDTH - FRAME_W) >> 1) + 20;
        final int FRAME_X = (Page.SCREEN_WIDTH - FRAME_W) >> 1;
        g.setColor(0xffffff);
        if (!showTxtScroll) {
            font.drawCharsAlignLeftWithoutFont(g, txt, TXT_X, TXT_Y, TXT_W);
            return;
        }
        g.setClip(TXT_X, TXT_Y, TXT_W - TXT_DIS_W, TXT_H);
        font.drawCharsAlignLeftWithoutFont(g, txt, TXT_X, TXT_Y - txtOffSetY, TXT_W - TXT_DIS_W);
        g.setClip(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
        final int BAR_X = FRAME_X + FRAME_W - 26;
        final int BAR_Y = FRAME_Y + 60;
        final int BAR_H = FRAME_H - 100;
        FishFont.drawScrollBar(g, BAR_X, BAR_Y, BAR_H, txtOffSetY, txtHeight - TXT_H);
    }

    final private void drawSending(Graphics g) {
        if(!sendingSms) {
            return;
        }
        String[] txt = {sendingTxt, "请勿退出游戏", "以免无法正常计费"};
        final int BOX_W = font.charsWidth(txt[2].toCharArray(), 0, txt[2].length()) + 24;
        final int BOX_H = (FishFont.LINE_HEIGHT * 3) + 60;
        final int BOX_X = (Page.SCREEN_WIDTH - BOX_W) >> 1;
        final int BOX_Y = (Page.SCREEN_HEIGHT - BOX_H) >> 1;
        Dialog.drawBoxFrameNew(g, BOX_X, BOX_Y, BOX_W, BOX_H);

        int txtY = BOX_Y + 20;
        g.setColor(0xdf6b00);
        font.drawCharsAlignCenter(g, txt[0].toCharArray(), 0, txt[0].length() - 3 + sendingStep, Page.SCREEN_WIDTH >> 1, txtY);
        g.setColor(0xffffff);
        txtY += FishFont.LINE_HEIGHT;
        font.drawCharsAlignCenter(g, txt[1].toCharArray(), Page.SCREEN_WIDTH >> 1, txtY);
        txtY += FishFont.LINE_HEIGHT;
        font.drawCharsAlignCenter(g, txt[2].toCharArray(), Page.SCREEN_WIDTH >> 1, txtY);
    }

    final private void drawConfirm(Graphics g) {
        if(!isSendConfirm) {
            return;
        }
        final int BOX_W = 160;
        final int BOX_H = 80;
        final int BOX_X = (Page.SCREEN_WIDTH - BOX_W) >> 1;
        final int BOX_Y = (Page.SCREEN_HEIGHT - BOX_H) >> 1;
        Dialog.drawBoxFrameNew(g, BOX_X, BOX_Y, BOX_W, BOX_H);
        g.setColor(0xffffff);
        font.drawCharsAlignCenter(g, confirmTxt, Page.SCREEN_WIDTH >> 1, BOX_Y + 20);

        Image imgArcBtnBack = Dialog.imgArcBtnBack;
        Image imgArcBtnWord = Dialog.imgArcBtnWord;
        final int BUTTON_HEIGHT = 30;
        final int BTN_Y = BOX_Y + BOX_H - BUTTON_HEIGHT;
        g.drawImage(imgArcBtnBack, BOX_X, BTN_Y, Graphics.HCENTER | Graphics.TOP);
        g.drawImage(imgArcBtnBack, BOX_X + BOX_W, BTN_Y, Graphics.HCENTER | Graphics.TOP);
        final int BTN_WORD_W = imgArcBtnWord.getWidth() >> 1;
        final int BTN_WORD_H = imgArcBtnWord.getHeight();
        final int BTN_WORD_Y = BTN_Y + (imgArcBtnBack.getHeight() >> 1) - (BTN_WORD_H >> 1);
        Util.drawClipImage(g, imgArcBtnWord, BOX_X - (BTN_WORD_W >> 1), BTN_WORD_Y, 0, 0, BTN_WORD_W, BTN_WORD_H);
        Util.drawClipImage(g, imgArcBtnWord, BOX_X + BOX_W - (BTN_WORD_W >> 1), BTN_WORD_Y, BTN_WORD_W, 0, BTN_WORD_W, BTN_WORD_H);
    }

    final public void keyPressed(int keyCode) {
        switch(smsState)
        {
            case STATE_SHOW_LIST:
//                doListKey(keyCode);
                break;

            case STATE_SHOW_NOTE:
                doNoteKey(keyCode);
                break;

            case STATE_SHOW_MSG:
                if(sendingSms) {
                    return;
                }
                doDetailKey(keyCode);
                break;

            case STATE_SUPER_SHOP:
                break;
        }
    }

    final private void doListKey(int keyCode) {
        if(GameContext.page.dlg.isAvailable()) {
            GameContext.page.dlg.keyPressed(keyCode);
            return;
        }

        switch(keyCode) {
            case Keys.KEY_NUM2:
            case Keys.KEY_UP:
                if(itemIdx > 0) {
                    itemIdx--;
                } else {
                    itemIdx = ITEM_CNT - 1;
                }
                return;

            case Keys.KEY_NUM8:
            case Keys.KEY_DOWN:
                if(itemIdx < ITEM_CNT - 1) {
                    itemIdx++;
                } else {
                    itemIdx = 0;
                }
                return;

            case Keys.KEY_NUM5:
            case Keys.KEY_LEFT_SOFT:
            case Keys.KEY_FIRE:
                doListFire();
                return;

            case Keys.KEY_RIGHT_SOFT:
                smsState = STATE_NOT_SHOW;
                return;
        }
    }

    final public void doListFire(int itemIdx) {
        this.itemIdx = itemIdx;
        doListFire();
    }

    final private void doListFire() {
        switch(itemIdx) {
            case 0:
                if(doubleMoney)
                {
                    GameContext.page.dlg.showMessageBox("已经开启了");
                    return;
                }
                break;

            case 1:
                if(doubleExp)
                {
                    GameContext.page.dlg.showMessageBox("已经开启了");
                    return;
                }
                break;
            case 4:
                if (GameContext.actor.officialLv >= GameContext.page.officialName.length - 2) {
                    GameContext.page.dlg.showMessageBox("官职已经达到最高等级");
                    return;
                }
                if (!GameContext.page.teachOverEnchant) {
                    GameContext.page.dlg.showMessageBox("官升三级将在后续剧情开启，请耐心等待");
                    return;
                }
                break;
        }

        doChargeRequest(LIST_REQUEST[itemIdx]);
    }

    final private void doDetailKey(int keyCode) {
        if(isSendConfirm) {
            switch(keyCode) {
                case Keys.KEY_LEFT_SOFT:
                    if (isSecondMsg) {
                        //继续发送
                        GameContext.cost.continueCost(true);
                        sendingSms = true;
                        return;
                    }
                    doDetailFireKey();
                    isSendConfirm = false;
                    return;

                case Keys.KEY_RIGHT_SOFT:
                    isSendConfirm = false;
                    return;
            }
            return;
        }

        KeyManager keyMgr = GameContext.page.keyMgr;
        keyMgr.keyPressed(keyCode);
        switch(keyCode) {
            case Keys.KEY_LEFT_SOFT:
                if (!isCanSendMsg)
                {
                    return;
                }
                isSendConfirm = true;
                return;

            case Keys.KEY_RIGHT_SOFT:
                if (isSecondMsg) {
                    //结束发送
                    GameContext.cost.continueCost(false);
                    return;
                }
                smsState = oldSmsState;
                if(observer != null)
                {
                    observer.remind(0, 0, null);
                    observer = null;
                }
                if (requestId == RISE_ID && !GameContext.page.isMiniGame) {
                    GameContext.page.setGameOver(Actor.DIE_STR);
                }
                if (GameContext.version == 2) {
                    if (requestId == 4 && !GameContext.page.isMiniGame && GameContext.actor.isDie) {
                        GameContext.page.dlg.btnBoxOp = Dialog.LIFE_OP;
                        if (!Sms.allStory) {
                            GameContext.page.dlg.showButtonBox("您还未开启关卡，是否免费原地复活？".toCharArray());
                        } else {
                            if (GameContext.version == 2) {
                                GameContext.page.dlg.showButtonBox("是否原地复活？需花费30000金钱".toCharArray());
                            }
                        }
                    }
                }
                return;
        }
    }

    final private void doDetailFireKey() {
        switch(requestId) {
            //剧情计费
            default:
                startSend();
                break;
        }
    }

    public void showStore() {
        GamePage page = GameContext.page;
        final int ITEM_CNT = 30;
        short[] buf = new short[ITEM_CNT];
        int idx = 0;
        for (int index = 30; index <= 38; index++)
        {
            Item i = GameContext.getItem((short) index);
            if (i == null) {
                continue;
            }
            buf[idx] = (short) index;
            idx++;
        }
//        for (int index = 70; index <= 79; index++)
//        {
//            Item i = GameContext.getItem((short) index);
//            if (i == null) {
//                continue;
//            }
//            buf[idx] = (short) index;
//            idx++;
//        }
        for (int index = 50; index <= 54; index++)
        {
            Item i = GameContext.getItem((short) index);
            if (i == null) {
                continue;
            }
            buf[idx] = (short) index;
            idx++;
        }
        short[] items = new short[idx];
        System.arraycopy(buf, 0, items, 0, idx);
        page.showSuperStore(items);
    }

    final private void doNoteKey(int keyCode) {
        switch(keyCode) {
            case Keys.KEY_RIGHT_SOFT:
                if (sendFail && requestId == RISE_ID && !GameContext.page.isMiniGame) {
                    smsState = STATE_NOT_SHOW;
                    GameContext.page.setGameOver(Actor.DIE_STR);
                    return;
                }
                if (requestId == 4 && GameContext.actor.isDie) {//如果购买金钱失败，再次弹出时候购买复活的界面。
                    smsState = STATE_NOT_SHOW;
                    GameContext.page.dlg.btnBoxOp = Dialog.LIFE_OP;
                    if (!Sms.allStory) {
                        GameContext.page.dlg.showButtonBox("您还未开启关卡，是否免费原地复活？".toCharArray());
                    } else {
                        if (GameContext.version == 2) {
                            GameContext.page.dlg.showButtonBox("是否原地复活？需花费30000金钱".toCharArray());
                        }
                    }
                    return;
                }
                smsState = oldSmsState;
                if(observer != null)
                {
                    observer.remind(0, 0, null);
                    observer = null;
                }
                return;
        }
    }

    /**
     * 内部调用，显示提示信息
     * @param note
     */
    final private void showNote(char[] note) {
        this.note = note;
        prepareTxtShow(note);
        smsState = STATE_SHOW_NOTE;
    }
    String strSuccess;

    String[] payName  = {"全部剧情","原地复活","双倍金钱","双倍经验","获得5000金","连升五级","官升三级"};

    final private void startSend() {
        sendingSms = true;//开始发送
        sendingStep = 0;//发送第一布
        if (GameContext.version == 2) {
            strSuccess = GameContext.netWork.qqShare.PreSMSBillingPoint(billingId);
            StringBuffer buf = new StringBuffer().append(msgDescs[msgIdx]);//短信信息
            changeSmsData(buf.append(strSuccess).toString());
            GameContext.netWork.qqShare.SMSBillingPoint(billingId, "1" + System.currentTimeMillis());
        } else if (GameContext.version == 48) {
            StringBuffer buf = new StringBuffer().append(msgDescs[msgIdx]);
            buf.append("点击确定将会发送一条");
            buf.append(smsPrice(msgIdx));
            buf.append("元短信,不含信息费。");
            GameContext.netWork.egameShare.send(getSmsMessage(msgIdx), buf.toString());
        }else if (GameContext.version == 21){
            int smsValue = smsPrice(msgIdx) * smsCount(msgIdx);
            Intent intent = new Intent(Display.dis.getApplicationContext(), PaymentsActivity.class);
            StringBuffer buf = new StringBuffer().append(msgDescs[msgIdx]);//短信信息
            PaymentInfo info = new PaymentInfo(payName[msgIdx], "16", "0" + msgIdx, buf.toString(), smsValue * 10);
            intent.putExtra(PaymentsActivity.EXTRA_KEY_PAYMENTINFO, info);
            Display.dis.startActivityForResult(intent, 0);
        } else if (GameContext.version == 99) {
            remindResult(0, "出错了");
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 0) {
            if (Display.RESULT_OK == resultCode) {// 支付成功
                // 流水号，可以用于消费用户对账。
                String number = data.getStringExtra(PaymentsActivity.EXTRA_KEY_NUMBER);
                // 订单号，可以用于开发者使用
                String orderId = data.getStringExtra(PaymentsActivity.EXTRA_KEY_ORDER_ID);
                GameContext.sms.remindResult(CostListener.COST_OK, "");
            } else {
                GameContext.sms.remindResult(CostListener.COST_FAIL, "");
            }
        }
    }

    /**
     * 发送短信成功
     */
    final private void doSendOk() {
        doSmsCommand();
    }

    /**
     * 发送失败
     * @param str
     */
    final public void doSendFail(char[] str) {
        if (str != null && str.length != 0) {
            showNote(str);
            return;
        }
        final short SEND_FAIL = 102;
        char[] sendFail = StringManager.getInstance().getString(SEND_FAIL);
        showNote(sendFail);
    }

    /**
     * 显示一个计费点的详细信息
     * @param msgIdx
     */
    final public void showItem(int msgIdx) {
        smsCount = 0;
        isSecondMsg = false;
        this.msgIdx = msgIdx;
        if (smsPrice(msgIdx) == 0 && smsCount(msgIdx) == 0) {//短代价格和短信条数都为零
            doSendOk();
            if (observer != null) {
                observer.remind(0, 0, null);
                observer = null;
            }
            return;
        }
        StringBuffer buf = new StringBuffer().append(msgDescs[msgIdx]);//短信信息
        if (GameContext.version == 2) {
            strSuccess = GameContext.netWork.qqShare.PreSMSBillingPoint(billingId);
            changeSmsData(buf.append(strSuccess).toString());
        } else {
            GameContext.cost.flashSmsData(buf, msgIdx, smsPrice(msgIdx) * smsCount(msgIdx), sucessValue[msgIdx], prices[msgIdx]);//刷新短代的数据
        }
        itemDetail = smsStr.toCharArray();//短代内容

        if (GameContext.version == 21) {//如果版本号是21
//            startSend();
        }
        else {
            smsState = STATE_SHOW_MSG;//显示计费内容
            prepareTxtShow(itemDetail);
        }
    }

    //是否显示完信息，可以发送短信了（腾讯要求信息未显示完整，不能发送短信）
    boolean isCanSendMsg = true;

    //显示相关
    int txtOffSetY;
    int txtHeight;
    boolean showTxtScroll;   
    final int TXT_Y = 54;
    final int TXT_W = 324;
    final int TXT_DIS_W = 24;
    final int TXT_H = 160;
    private void prepareTxtShow(char[] txt) {
        txtOffSetY = 0;
        txtHeight = font.getCharsWithoutFontHeight(txt, TXT_W);
        showTxtScroll = txtHeight > TXT_H;
        if (showTxtScroll) {
            txtHeight = font.getCharsWithoutFontHeight(txt, TXT_W - TXT_DIS_W);
            isCanSendMsg = false;
        }
    }

    /**
     * 短代价格
     * @param smsId
     * @return
     */
    private int smsPrice(int smsId)
    {
        //根据当前的短信索引来发送短信
        int dataIdx = msgIdxs[smsId];
        //去掉高位的标记
        dataIdx &= 0xFFFF;
        //第一组号码
        return  prices[dataIdx];
    }

    /**
     * 短信条数
     * @param smsCount
     * @return
     */
    private int smsCount(int smsId)
    {
        //根据当前的短信索引来发送短信
        int dataIdx = msgIdxs[smsId];
        //去掉高位的标记
        dataIdx &= 0xFFFF;
        //第一组号码
        return  counts[dataIdx];
    }

    private String getSmsNumber(int smsId)
    {
        //根据当前的短信索引来发送短信
        int dataIdx = msgIdxs[smsId];
        //去掉高位的标记
        dataIdx &= 0xFFFF;
        //第一组号码
        return  new StringBuffer("sms://").append(numbers[dataIdx]).toString();
    }

    private String getSmsMessage(int smsId)
    {
        //根据当前的短信索引来发送短信
        int dataIdx = msgIdxs[smsId];
        //去掉高位的标记
        dataIdx &= 0xFFFF;
        //第一组号码
        return  new String(msgs[dataIdx]);
    }

    /**
     * 进程提醒
     * @param curCount
     * @param allCount
     * @param reservedInt1
     */
    public void remindProcess(int curCount, int allCount, int reservedInt1)
    {
        addSucessValue(msgIdx);
        saveSucessCount();
        if (sucessValue[msgIdx] == 0) {
            return;
        }
        StringBuffer buf = new StringBuffer().append(msgDescs[msgIdx]);
        GameContext.cost.flashSmsData(buf, msgIdx, smsPrice(msgIdx) * smsCount(msgIdx), sucessValue[msgIdx], prices[msgIdx]);
        itemDetail = smsStr.toCharArray();
        prepareTxtShow(itemDetail);
        sendingSms = false;
        isSecondMsg = true;
    }

    /**
     * 结果提醒
     * @param state
     * @param str
     */
    public void remindResult(int state, String str)
    {
        //#if PRINTDEBUG == 1
        System.out.println("remindResult:" + state + ":" + str);
        //#endif
        sendFail = false;
        sendingSms = false;
        isSendConfirm = false;
        isSecondMsg = false;
        switch(state) {
            case CostListener.COST_OK:
                //做后续工作
                doSendOk();
                if (GameContext.version == 2) {
                    addSucessValue(msgIdx);
                }
                //存盘
                saveRms();
                saveSucessCount();
                if (str != null && str.length() != 0) {
                    showNote(str.toCharArray());
                    return;
                }
                //显示发送成功
                final short SEND_SUCCESS = 101;
                char[] sendSuc = StringManager.getInstance().getString(SEND_SUCCESS);
                showNote(sendSuc);
                return;

            case CostListener.COST_FAIL:
            case CostListener.COST_FAIL_SECURITY:
                sendFail = true;
                doSendFail(str.toCharArray());
                return;

            case CostListener.COST_GIVEUP:
            case CostListener.COST_CONFIRM:
                sendFail = true;
                doSendFail(null);
                return;
        }
    }

    /**
     * 需要添加的短信条数
     */
    private int addSmsCount;
    /**
     * 添加的短代内容
     */
    private String smsStr;

    /**
     * 每条的价格
     */
    private int smsOncePrice;

    /**
     *
     * @param addSmsCount
     * @param smsStr
     * @param smsOncePrice
     */
    public void changeSmsData(int addSmsCount, String smsStr, int smsOncePrice)
    {
        this.addSmsCount = addSmsCount;
        this.smsStr = smsStr;
        this.smsOncePrice = smsOncePrice;
    }

    public void changeSmsData(String smsStr){
        this.smsStr = smsStr;
    }

    public void update() {
        if (smsState != STATE_SHOW_MSG) {
            return;
        }
        if (isSendConfirm || sendingSms) {
            return;
        }
        if (!showTxtScroll) {
            return;
        }
        KeyManager keyMgr = GameContext.page.keyMgr;
        if (keyMgr.isPressed(Keys.MASK_UP) || keyMgr.isPressed(Keys.MASK_NUM2)) {
            if (txtOffSetY > 0) {
                txtOffSetY -= FishFont.FONT_SMALL.getHeight() >> 1;
                txtOffSetY = (txtOffSetY < 0) ? 0 : txtOffSetY;
                isCanSendMsg = false;
            }
        }
        else if(keyMgr.isPressed(Keys.MASK_DOWN) || keyMgr.isPressed(Keys.MASK_NUM8)) {
            if (txtOffSetY < txtHeight - TXT_H) {
                txtOffSetY += FishFont.FONT_SMALL.getHeight() >> 1;
                txtOffSetY = (txtOffSetY > txtHeight - TXT_H) ? txtHeight - TXT_H : txtOffSetY;
                if (txtOffSetY >= txtHeight - TXT_H) {
                    txtOffSetY = txtHeight - TXT_H;
                    isCanSendMsg = true;
                }
            }
        }
    }

    //#if POINT == 1
    final public void pointerPressed(int px, int py) {
        switch(smsState)
        {
            case STATE_SHOW_LIST:
//                doListPoint(px, py);
                break;

            case STATE_SHOW_NOTE:
                final int FRAME_X = (Page.SCREEN_WIDTH - FRAME_W) >> 1;
                GameContext.page.doMenuButtonsPoint(px, py, false, true, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
                break;

            case STATE_SHOW_MSG:
                if(sendingSms) {
                    return;
                }
                doDetailPoint(px, py);
                break;

            case STATE_SUPER_SHOP:
                break;
        }
    }

    final public void doDetailPoint(int px, int py) {
        if (isSendConfirm) {
            final int BOX_W = 160;
            final int BOX_H = 80;
            final int BOX_X = (Page.SCREEN_WIDTH - BOX_W) >> 1;
            final int BOX_Y = (Page.SCREEN_HEIGHT - BOX_H) >> 1;
            final int BUTTON_HEIGHT = 30;
            final int DIS = 16;
            final int POINT_W = Dialog.imgArcBtnBack.getHeight() + DIS;
            final int POINT_Y = BOX_Y + BOX_H - BUTTON_HEIGHT - (DIS >> 1);
            if (GameContext.point(px, py, BOX_X - (POINT_W >> 1), POINT_Y, POINT_W, POINT_W)) {
                keyPressed(Keys.KEY_LEFT_SOFT);
            }
            else if (GameContext.point(px, py, BOX_X + BOX_W - (POINT_W >> 1), POINT_Y, POINT_W, POINT_W)) {
                keyPressed(Keys.KEY_RIGHT_SOFT);
            }
            return;
        }
        final int FRAME_X = (Page.SCREEN_WIDTH - FRAME_W) >> 1;
        if (isCanSendMsg) {
            GameContext.page.doMenuButtonsPoint(px, py, true, true, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
            return;
        }
        GameContext.page.doMenuButtonsPoint(px, py, false, true, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
    }

    final public void doListPoint(int px, int py) {

    }

    /**
     * 拖动
     */
    public boolean pointerDragged(int startX, int startY, int endX, int endY) {
        if (!showTxtScroll) {
            return true;
        }
        if (sendingSms) {
            return false;
        }
        final int DRAG_LIMIT = FishFont.LINE_HEIGHT >> 1;
        int len = (endY - startY) / DRAG_LIMIT;
        if (len == 0) {
            return false;
        }
        txtOffSetY -= len * DRAG_LIMIT;
        txtOffSetY = (txtOffSetY > txtHeight - TXT_H) ? txtHeight - TXT_H : txtOffSetY;
        txtOffSetY = (txtOffSetY < 0) ? 0 : txtOffSetY;
        isCanSendMsg = true;
        if (txtOffSetY < txtHeight - TXT_H) {
            isCanSendMsg = false;
        }
        return true;
    }
    //#endif
    //#endif
}

