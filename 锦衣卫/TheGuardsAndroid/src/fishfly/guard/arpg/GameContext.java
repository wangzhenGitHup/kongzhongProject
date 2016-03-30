/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

//#if UPDATA == 1
//# import com.tencent.mbox.MBoxClient;
//#endif
//#if SMS == 1 || SMS == 2
import cost.Cost;
//#endif
import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Random;
import javax.microedition.lcdui.Display;
import javax.microedition.lcdui.Image;
import javax.microedition.rms.RecordStore;
import share.GameNetWork;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class GameContext {
    public static GameMidlet midlet;
    public static MainCanvas canvas;
    public static Display display;
    public static int version;
    public static GameNetWork netWork;
    //推荐信息
    public static String pushTitle;
    public static String pushUrl;
    
    public static Actor actor;
    
    //一定被主角遮挡的绘制矩阵
    public static PaintMatrix undergroundMat;
    
    //地面上的绘制矩阵
    public static PaintMatrix groundMat;
            
    //空中绘制矩阵
    public static PaintMatrix flyMat;

    //#if SMS == 1 || SMS == 2
    public static Cost cost = new Cost();
    //#endif
    
    /**
     * 是否百分之百
     */
    public static boolean isSucess;

    /**
     * 小游戏
     */
    public static MiniGame miniGame;

    //#if UPDATA == 1
//#     public static MBoxClient qqForum = null;
//#     public static int GAME_ID = 10;
//#     public static int CP_ID = 123;
    //#endif

    /**
     * 是否在几率之内
     * @param pro 几率
     * @param min 几率下限
     * @param max 几率上限
     * @return
     */
    public static boolean isSucess(int pro, int min, int max)
    {
        if(isSucess)
        {
            isSucess = false;
            return true;
        }
        return pro >= getRand(min, max);
    }

    //#if PHONE == 0 
//#     private static long seed = System.currentTimeMillis();
//#     public static int getRand(int min, int max)
//#     {
//#         int r = (int)(seed = (seed * 10807L) & 0x7fffffffL);
//#         int k = r % ((max - min) + 1) + min;
//#         return k;
//#     }
    //#else
    private static Random ran = new Random(System.currentTimeMillis());
    
    public static int getRand(int min, int max) {
        return min + (Math.abs(ran.nextInt()) % (max - min + 1));
    }
    //#endif
    
    public static boolean point(int px, int py, int rectx, int recty, int rectwidth, int rectheight)
    {
        if(px > rectx && px < rectx + rectwidth && py > recty && py < recty + rectheight)
        {
            return true;
        }
        return false;
    }

    public static int getRadical(int num) {
        int startNum = 0;
        int endNum = 0;
        endNum = num >> 1;
        while (endNum * endNum > num) {
            startNum = endNum;
            endNum >>= 1;
        }
        while (startNum - endNum > 1) {
            int pos = (startNum + endNum) >> 1;
            if (pos * pos > num) {
                startNum = pos;
            }
            else {
                endNum = pos;
            }
        }
        if ((startNum * startNum - num) < (num - endNum * endNum)) {
            endNum = startNum;
        }
        return endNum;
    }
    
    //场景脚本
    public static ScriptEngine script;
    public static ScriptEngine itemScript;
    
    //地图
    public static Map map = new Map();
    
    public static GamePage page;
    
    /**
     * 存档数据
     */
    public static byte[] rmsData = new byte[0];
    
    /**
     * 是否有存档
     * @return
     */
    public static boolean isHaveRms()
    {
        return (rmsData != null && rmsData.length > 0);
    }
    
    //////////////////////////////////////////////////////////////////////////
    //变量保存
    final static Hashtable varMap ;

    /**
     * 机器型号
     */
    final static String phoneModel = "phoneModel";
    /**
     * 触摸
     */
    final static String pointer = "pointer";

    static{
	varMap = new Hashtable();
	//写入常驻的变量
	//#if N7370 || E2 || V8 || E6 || N7370small
//# 	final Integer VAR = new Integer(7370);
	//#elif N5800
//# 	final Integer VAR = new Integer(5800);
	//#elif E62
//# 	final Integer VAR = new Integer(62);
	//#else
	final Integer VAR = new Integer(73);
	//#endif
        //#if POINT == 1
        final Integer POINT = new Integer(1);
        //#else
//#         final Integer POINT = new Integer(0);
        //#endif
	varMap.put(phoneModel, VAR);
	varMap.put(pointer, POINT);
    }

    public static void clearVar(){
	//保存常驻的变量
	int num = getVar(phoneModel);
	int point = getVar(pointer);
        int pass = isPassGame ? 1 : 0;
	varMap.clear();
	varMap.put(phoneModel, new Integer(num));
	varMap.put(pointer, new Integer(point));
        varMap.put(EffortManager.EFFORT_PASS_GAME, new Integer(pass));
    }
    
    public static void setVar(String var, int val) {
        var = ScriptEngine.changeStringKey(var);
        varMap.put(var, new Integer(val));
    }
    
    public static int getVar(String var) {
        var = ScriptEngine.changeStringKey(var);
        Integer valObj = (Integer)varMap.get(var);
        if(valObj == null) {
            return 0;
        }
        
        return valObj.intValue();
    }
    
    public static void addVar(String var, int inc) {
        var = ScriptEngine.changeStringKey(var);
        int val = getVar(var);
        setVar(var, val + inc);
    }
    
    /**
     * 保存常量数据
     * @param dataOut
     * @throws java.io.IOException
     */
    public static void saveVars(DataOutputStream dataOut) throws IOException
    {
        //先要计算一下大于0的个数
        Enumeration data = varMap.elements();
        int count = 0;
        while(data.hasMoreElements())
        {
            int var = ((Integer)data.nextElement()).intValue();
            if(var > 0)
            {
                count++;
            }
        }
        //写入个数
        dataOut.writeShort(count);
        Enumeration key = varMap.keys();
        //写入数据
        while(key.hasMoreElements())
        {
            String s = (String) key.nextElement();
            int var = ((Integer)varMap.get(s)).intValue();
            if(var > 0)
            {
                dataOut.writeUTF(s);
                dataOut.writeInt(var);
            }
        }
        
    }
    
    /**
     * 读取常量数据
     * @param dataIn
     * @throws java.io.IOException
     */
    public static void loadVars(DataInputStream dataIn) throws IOException
    {
        clearVar();
        int count = dataIn.readShort();
        for(int index =0; index < count; index++)
        {
            String s = dataIn.readUTF();
            int var = dataIn.readInt();
            varMap.put(s, new Integer(var));
        }
    }
    
    //////////////////////////////////////////////////////////////////////////////
    //物品相关
    static HashtableShort itemMap;
    //物品指标类型名称
    static HashtableShort itemAttrTypeNameMap;
    
    public static void loadItems()
    {
        try
        {
            final String ITEMS_PATH = "/items.dat";            
            //#if EN == 1
//#             DataInputStream dataIn = new DataInputStream(new ByteArrayInputStream(Util.decryptImage(ITEMS_PATH)));
            //#else
            DataInputStream dataIn = Util.open(ITEMS_PATH);
            //#endif
            ImageManager imgMgr = ImageManager.getInstance();

            int num = dataIn.readInt();
            itemAttrTypeNameMap = new HashtableShort(num);
            for (int index = 0; index < num; index++) {
                String name = dataIn.readUTF();
                itemAttrTypeNameMap.put((short) index, name);
            }
            num = dataIn.readInt();
            for (int index = 0; index < num; index++) {
                dataIn.readUTF();
            }
            for (int i = 0; i < 5; i++) {
                num = dataIn.readInt();
                for (int j = 0; j < num; j++) {
                    dataIn.readUTF();
                    dataIn.readInt();
                    dataIn.readInt();
                }
            }
            
            num = dataIn.readInt();
            if (num > 0) {
                Item.icon = new Image[num];
                Item.iconWidth = new int[num];
                Item.iconHeight = new int[num];
                for (int i = 0; i < num; i++) {
                    int id = dataIn.readInt();
                    Item.icon[i] = imgMgr.getImage((short) id);
                    Item.iconWidth[i] = dataIn.readInt();
                    Item.iconHeight[i] = dataIn.readInt();
                }
            }

            int itemCnt = dataIn.readInt();
            itemMap = new HashtableShort(itemCnt);
            for(int index = 0; index < itemCnt; index++)
            {
                Item item = new Item();
                item.load(dataIn);
                //#if PRINTDEBUG == 1
                System.out.println("写入的物品ID="+item.id+";物品名称="+new String(item.name));
                //#endif
                itemMap.put(item.id, item);
            }
        } catch (Exception ex)
        {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    public static Item getItem(short id) {
        return (Item)itemMap.get(id);
    }

    ///物品结束  
    public static final String RMS_NAME = "guardbig.fs";
    
    /**
     * 读取存盘数据
     */
    public static void readGames()
    {
        //#if SMS == 1 || SMS == 2
        cost.init(midlet, display, sms, canvas, 0, 0, 0, 0, null, null, null, null);
        //#endif
        try
        {
            RecordStore rs = null;
            rs = RecordStore.openRecordStore(RMS_NAME, true);
            if(rs.getNumRecords() == 0)
            {
                rmsData = new byte[0];
                rs.addRecord(rmsData, 0, 0);
                byte[] pass = new byte[1];
                rs.addRecord(pass, 0, pass.length);
                rs.closeRecordStore();
                return;
            }
            rmsData = rs.getRecord(1);
            byte[] pass = rs.getRecord(2);
            isPassGame = pass[0] == 1;
            rs.closeRecordStore();
        }
        catch (Exception ex)
        {            
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }    
    
    public static void saveGame(byte[] data) {
        rmsData = data;
        try
        {
            RecordStore rs = RecordStore.openRecordStore(RMS_NAME, true);
            rs.setRecord(1, rmsData, 0, rmsData.length);
            rs.closeRecordStore();
        }
        catch (Exception e)
        {
        }
    }

    //是否通关过
    static boolean isPassGame;
    public static void saveGamePass() {
        byte[] pass = new byte[1];
        pass[0] = (byte) (isPassGame ? 1 : 0);
        try
        {
            RecordStore rs = RecordStore.openRecordStore(RMS_NAME, true);
            rs.setRecord(2, pass, 0, pass.length);
            rs.closeRecordStore();
        }
        catch (Exception e)
        {
        }
    }
    
    //#if SMS == 1 || SMS == 2
    public static Sms sms = null;
    //#endif
    
    static char[] helpTxt = null;
    static char[] aboutTxt = null;
    
    public static void loadInfo() {
        final short HELP_BODY_TXT = 72;
        helpTxt = StringManager.getInstance().getString(HELP_BODY_TXT);
        String info = Util.decryptText("/info.fs");
        if(info != null) {
            int pos = info.indexOf('&');
            String helpPart = info.substring(0, pos);
            String aboutPart = info.substring(pos + 1);
            StringBuffer buf = new StringBuffer();
            buf.append(helpPart);
            buf.append(helpTxt);
            helpTxt = buf.toString().toCharArray();
            aboutTxt = aboutPart.toCharArray();
        }
    }
    
    public static void loadNpcData()
    {
        try
        {
            final String NPC_DATA_PATH = "/npcdata.dat";
            //#if EN == 1
//#             DataInputStream dataIn = new DataInputStream(new ByteArrayInputStream(Util.decryptImage(NPC_DATA_PATH)));
            //#else
            DataInputStream dataIn = Util.open(NPC_DATA_PATH);
            //#endif
            npcTypeCnt = dataIn.readShort();
            levelDataCnt = dataIn.readShort();
            levelData = new int[npcTypeCnt * levelDataCnt];
            for (int index = 0; index < npcTypeCnt * levelDataCnt; index++) {
                levelData[index] = dataIn.readInt();
            }
            
            final String SCENE_LV_PATH = "/scenelv.dat";
            //#if EN == 1
//#             dataIn = new DataInputStream(new ByteArrayInputStream(Util.decryptImage(SCENE_LV_PATH)));
            //#else
            dataIn = Util.open(SCENE_LV_PATH);
            //#endif
            int itemCnt = dataIn.readShort();
            int chapterCnt = dataIn.readShort();
            chapterData = new int[chapterCnt];
            for (int index = 0; index < chapterCnt; index++) {
                chapterData[index] = dataIn.readInt();
            }
            sceneNpcLvData = new Hashtable(itemCnt);
            for (int index = 0; index < itemCnt; index++) {
                short mapId = dataIn.readShort();
                int length = dataIn.readShort();
                byte[] value = new byte[length];
                dataIn.readFully(value, 0, length);
                sceneNpcLvData.put("" + mapId, value);
            }
            dataIn.close();
        } catch (Exception ex)
        {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    public static Hashtable sceneNpcLvData;
    public static int[] chapterData;
    /**
     * NPC等级
     */
    public static int[] levelData;
    public static int npcTypeCnt;
    public static int levelDataCnt;
    
    /**
     * 初始化特殊脚本对象
     */
    public static void initSpeicalScript()
    {
	//#if K790
//# 	ScriptEngine.scriptPkg.preload();
	//#endif
        String[] name = {Actor.ARROW_SKILL_SCRIPT_NAME};
        for (int index = 0, cnt = name.length; index < cnt; index++)
        {
            ScriptEngine s = new ScriptEngine(name[index]);
            itemScriptHash.put(name[index], s);
        }
    }
    
    /**
     * 物品的脚本hash，用来存放物品的脚本对象
     */
    public static Hashtable itemScriptHash = new Hashtable();

    /**
     * 创建单色透明背景图
     */
    public static Image createMaskImage(int width, int height, int color, int transparenacy) {
        int[] maskData = new int[width * height];
        int finalColor = ((0xff * transparenacy / 100) << 24) | color;
        for (int index = 0, colorCnt = maskData.length; index < colorCnt; index++) {
            maskData[index] = finalColor;
        }
        Image img = Image.createRGBImage(maskData, width, height, true);
        return img;
    }


}
