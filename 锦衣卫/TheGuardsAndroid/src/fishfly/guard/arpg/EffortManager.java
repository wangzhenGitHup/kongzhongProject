/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.util.Enumeration;
import java.util.Hashtable;

/**
 * 单独保存读取和存档没有关系
 * 成就的处理类
 * @author 胡阳@fishfly.com
 */
public class EffortManager {
    
    private static EffortManager effortMgr;
    
    private EffortManager()
    {
        finishTime = new long[64];       
    }
    public static EffortManager getInstance()
    {
        if(effortMgr == null)
        {
            effortMgr = new EffortManager();
        }
        return effortMgr;
    }
    
    final String EFFORT_RMS_NAME = "effortRms";

    /**
     * 成就类型
     */
    static final int EFFECT_TYPE_OFFICIAL = 0;
    static final int EFFECT_TYPE_COLLECT = 1;
    static final int EFFECT_TYPE_GLORY = 2;
    static final int EFFECT_TYPE_STATISTICS = 3;
    static final int EFFECT_TYPE_CNT = 4;
        
    /**
     * 系统变量
     */
    static final String EFFORT_CUR_FEAT = "功绩";
    static final String EFFORT_WEAPON_ENCHANT_GOLD = "武器升至金9";
    static final String EFFORT_WEAPON_ENCHANT_SILVER = "武器升至银5";
    static final String EFFORT_ARMOR_ENCHANT = "防具升满";
    static final String EFFORT_SUPER_ARMOR_ENCHANT = "最强防具升满";
    static final String EFFORT_HAVE_STONE_TYPE = "拥有晶石种类";
    static final String EFFORT_STONE_ARTIFICE_20 = "晶石升至20级";
    static final String EFFORT_STONE_ARTIFICE_30 = "晶石升至30级";
    static final String EFFORT_STONE_ARTIFICE_SUCCESS = "晶石炼化成功";
    static final String EFFORT_FORMULA_SUCCESS = "配方合成成功";
    static final String EFFORT_MISSION_EXTENSION = "支线任务";
    static final String EFFORT_OPEN_CHEST = "开宝箱";
    static final String EFFORT_USE_MEDICINE = "吃药";
    static final String EFFORT_LV_UP = "升级";
    static final String EFFORT_KILL_ENEMY = "杀敌";
    static final String EFFORT_KILL_ENEMY_BY_SKILL1 = "匕首杀敌";
    static final String EFFORT_KILL_ENEMY_BY_SKILL2 = "火枪杀敌";
    static final String EFFORT_KILL_ENEMY_BY_SKILL3 = "盾牌杀敌";
    static final String EFFORT_KILL_ENEMY_BY_SKILL4 = "大炮杀敌";
    static final String EFFORT_KILL_BOSS1 = "杀boss1";
    static final String EFFORT_KILL_BOSS2 = "杀boss2";
    static final String EFFORT_KILL_BOSS3 = "杀boss3";
    static final String EFFORT_KILL_BOSS4 = "杀boss4";
    static final String EFFORT_KILL_BOSS5 = "杀boss5";
    static final String EFFORT_PASS_GAME = "通关";
    static final String EFFORT_BUY_RISE = "购买复活";
    static final String EFFORT_BUY_OFFICIAL = "购买官职";
    static final String EFFORT_BUY_MONEY = "购买金钱";
    static final String EFFORT_BUY_LV = "购买升级";
    static final String EFFORT_USE_MONEY = "花费RMB";
    static final String EFFORT_CUR_EFFORT_POINT = "成就点数";

    public static String[] EFFORT_STATISTICS_NAME =
    {
        "最高伤害",
        "最高财富",
        "人民币花费",
        "最高等级",
        "杀死敌人数量",
        "蛇毒技能杀敌",
        "凤鸣技能杀敌",
        "熊吼技能杀敌",
        "龙吟技能杀敌",
        "开启宝箱",
        "游戏总时间",
        "蒙古王子速杀",
        "越女魂速杀",
        "龙啸速杀",
        "孽鬼王速杀",
        "纪纲速杀",
    };

    private String[] codeStr = new String[EFFORT_STATISTICS_NAME.length];

    public int maxAttack;
    public int maxMoney;
    public int maxLv;
    public long gameTime;
    public int timeKillBoss1;
    public int timeKillBoss2;
    public int timeKillBoss3;
    public int timeKillBoss4;
    public int timeKillBoss5;
    
    public String[] getCodeStr()
    {
        codeStr[0] = ""+ maxAttack;
        codeStr[1] = ""+ maxMoney;
        codeStr[2] = ""+ GameContext.getVar(EFFORT_USE_MONEY);
        codeStr[3] = ""+ maxLv;
        codeStr[4] = ""+ GameContext.getVar(EFFORT_KILL_ENEMY);
        codeStr[5] = ""+ GameContext.getVar(EFFORT_KILL_ENEMY_BY_SKILL1);
        codeStr[6] = ""+ GameContext.getVar(EFFORT_KILL_ENEMY_BY_SKILL2);
        codeStr[7] = ""+ GameContext.getVar(EFFORT_KILL_ENEMY_BY_SKILL3);
        codeStr[8] = ""+ GameContext.getVar(EFFORT_KILL_ENEMY_BY_SKILL4);
        codeStr[9] = ""+ GameContext.getVar(EFFORT_OPEN_CHEST);
        codeStr[10] = "" + getStringFromTime((int) (gameTime / 1000));
        codeStr[11] = timeKillBoss1 == 0 ? "无" : getStringFromTime(timeKillBoss1);
        codeStr[12] = timeKillBoss2 == 0 ? "无" : getStringFromTime(timeKillBoss2);
        codeStr[13] = timeKillBoss3 == 0 ? "无" : getStringFromTime(timeKillBoss3);
        codeStr[14] = timeKillBoss4 == 0 ? "无" : getStringFromTime(timeKillBoss4);
        codeStr[15] = timeKillBoss5 == 0 ? "无" : getStringFromTime(timeKillBoss5);
        return codeStr;
    }

    //刷新游戏总时间的数据
    final static int GAME_TIME_CODE_INDEX = 10;
    public String updataGameTimeCodeStr() {
        codeStr[GAME_TIME_CODE_INDEX] = "" + getStringFromTime((int) (gameTime / 1000));
        return codeStr[GAME_TIME_CODE_INDEX];
    }
    
    private String getStringFromTime(int time)
    {
        if(time < 60) {
            return time + "s";
        }
        if (time < 3600) {
            return (time / 60) + "m" + (time % 60) + "s";
        }
        return (time / 3600) + "h" + ((time % 3600) / 60) + "m" + (time % 60) + "s";
    }
    
    public void setKillBossTime(Npc npc, int time)
    {
        switch(npc.file.id)
        {
            case 73:
                GameContext.addVar(EFFORT_KILL_BOSS1, 1);
                if(timeKillBoss1 != 0 && timeKillBoss1 < time)
                {
                    return;
                }
                timeKillBoss1 = time;
                break;
            case 56:
                GameContext.addVar(EFFORT_KILL_BOSS2, 1);
                if(timeKillBoss2 != 0 && timeKillBoss2 < time)
                {
                    return;
                }
                timeKillBoss2 = time;
                break;
            case 62:
                GameContext.addVar(EFFORT_KILL_BOSS3, 1);
                if(timeKillBoss3 != 0 && timeKillBoss3 < time)
                {
                    return;
                }
                timeKillBoss3 = time;
                break;
            case 69:
                GameContext.addVar(EFFORT_KILL_BOSS4, 1);
                if(timeKillBoss4 != 0 && timeKillBoss4 < time)
                {
                    return;
                }
                timeKillBoss4 = time;
                break;
            case 66:
                GameContext.addVar(EFFORT_KILL_BOSS5, 1);
                if(timeKillBoss5 != 0 && timeKillBoss5 < time)
                {
                    return;
                }
                timeKillBoss5 = time;
                break;
        }
    }
    
    public void addMaxAttack(int attack)
    {
        if(maxAttack > attack)
        {
            return;
        }
        maxAttack = attack;
    }
    
    public void addMaxLv(int lv)
    {
        if(maxLv > lv)
        {
            return;
        }
        maxLv = lv;
    }
    
    public void addMaxMoney(int money)
    {
        if(maxMoney > money)
        {
            return;
        }
        maxMoney = money;
    }
    
    //变量保存
    Hashtable varMap = new Hashtable();
    
    /**
     * 成就的字符串
     */
    private String[] effortVar =
    {
        EFFORT_CUR_FEAT,
        EFFORT_WEAPON_ENCHANT_GOLD,
        EFFORT_WEAPON_ENCHANT_SILVER,
        EFFORT_ARMOR_ENCHANT,
        EFFORT_SUPER_ARMOR_ENCHANT,
        EFFORT_HAVE_STONE_TYPE,
        EFFORT_STONE_ARTIFICE_20,
        EFFORT_STONE_ARTIFICE_30,
        EFFORT_STONE_ARTIFICE_SUCCESS,
        EFFORT_FORMULA_SUCCESS,
        EFFORT_MISSION_EXTENSION,
        EFFORT_OPEN_CHEST,
        EFFORT_USE_MEDICINE,
        EFFORT_LV_UP,
        EFFORT_KILL_ENEMY,
        EFFORT_KILL_ENEMY_BY_SKILL1,
        EFFORT_KILL_ENEMY_BY_SKILL2,
        EFFORT_KILL_ENEMY_BY_SKILL3,
        EFFORT_KILL_ENEMY_BY_SKILL4,
        EFFORT_KILL_BOSS1,
        EFFORT_KILL_BOSS2,
        EFFORT_KILL_BOSS3,
        EFFORT_KILL_BOSS4,
        EFFORT_KILL_BOSS5,
        EFFORT_PASS_GAME,
        EFFORT_BUY_RISE,
        EFFORT_BUY_OFFICIAL,
        EFFORT_BUY_MONEY,
        EFFORT_BUY_LV,
        EFFORT_USE_MONEY,
        EFFORT_CUR_EFFORT_POINT,
    };
    
    private long[] finishTime;
    
    /**
     * 所有的成就点数
     */
    public int allEffortCount;
    
    /**
     * 当前完成的任务
     */
    long curFinishEffort;

    public void saveEffort(DataOutputStream on)
    {
        try
        {
            for(int index = 0, cnt = finishTime.length; index < cnt; index++)
            {
                on.writeLong(finishTime[index]);
                on.writeBoolean(allEffortFinish[index]);
            }

            on.writeInt(allEffortCount);
            on.writeInt(maxAttack);
            on.writeInt(maxMoney);
            on.writeInt(maxLv);
            on.writeLong(gameTime);
            on.writeInt(timeKillBoss1);
            on.writeInt(timeKillBoss2);
            on.writeInt(timeKillBoss3);
            on.writeInt(timeKillBoss4);
            on.writeInt(timeKillBoss5);
            
            int count = 0;
            int newCount = 0;
            for(int index = 0,cnt = effortVar.length; index < cnt; index++)
            {
                newCount = GameContext.getVar(effortVar[index]);
                varMap.put(effortVar[index], new Integer(newCount));
            }
            Enumeration data = varMap.elements();
            while (data.hasMoreElements())
            {
                int var = ((Integer) data.nextElement()).intValue();
                if (var > 0)
                {
                    count++;
                }
            }
            //写入个数
            on.writeShort(count);
            Enumeration key = varMap.keys();
            //写入数据
            while (key.hasMoreElements())
            {
                String s = (String) key.nextElement();
                int var = ((Integer) varMap.get(s)).intValue();
                if (var > 0)
                {
                    on.writeUTF(s);
                    on.writeShort(var);
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
    
    public void loadEffort(DataInputStream input)
    {
        try
        {
            for(int index = 0, cnt = finishTime.length; index < cnt; index++)
            {
                finishTime[index] = input.readLong();
                allEffortFinish[index] = input.readBoolean();
            }        
            allEffortCount = input.readInt();
            
            maxAttack = input.readInt();
            maxMoney = input.readInt();
            maxLv = input.readInt();
            gameTime = input.readLong();
            timeKillBoss1 = input.readInt();
            timeKillBoss2 = input.readInt();
            timeKillBoss3 = input.readInt();
            timeKillBoss4 = input.readInt();
            timeKillBoss5 = input.readInt();
            
            int count = input.readShort();
            for (int index = 0; index < count; index++)
            {
                String s = input.readUTF();
                int var = input.readShort();
                varMap.put(s, new Integer(var));
            }
        }
        catch (Exception e)
        {
        }
    }

    /**
     * 成就名称
     */
    public String[] allEffortName = 
    {
        "锦衣小旗",//0
        "锦衣总旗",
        "锦衣百户",
        "锦衣千户",
        "锦衣镇抚使",
        "锦衣佥事",//5
        "锦衣同知",
        "锦衣都督",
        "锦衣指挥使",

        "兵器精良",
        "超强锦盒",//10
        "神兵利器",
        "锦盒传说",
        "护甲精通",
        "最强防御",
        "铜墙铁壁",//15
        "收藏家",
        "专业水准",
        "晶石达人",
        "神级炼化",
        "控火者",//20
        "丹药合成",
        "乐于助人",
        "以德服人",
        "宝箱爱好者",
        "盗墓高手",//25
        "药罐子",
        "破杀千军",

        "平步青云",
        "渐入佳境",
        "登峰造极",//30
        "独孤求败",
        "蛇毒忍者",
        "凤鸣神枪",
        "熊吼坦克",
        "龙吟地狱",//35
        "蒙古打手",
        "山越守护",
        "白莲天敌",
        "灵经巫师",
        "锦衣天下",//40
        "传说",
        "信春哥",
        "飞黄腾达",
        "聚宝盆",
        "飞速升级",//45
        "普通VIP",
        "高级VIP",
        "金卡VIP",
        "略有小成",
        "小有成就",//50
        "成就达人",
    };
    /**
     * 成就描述
     */
    public String[] allEffortDec = 
    {
        "功绩达到10",//0
        "功绩达到25",
        "功绩达到45",
        "功绩达到70",
        "功绩达到100",
        "功绩达到135",//5
        "功绩达到175",
        "功绩达到220",
        "???",

        "1把武器升级成银色5级",
        "4把武器升级成银色5级",//10
        "1把武器升级成金色9级",
        "所有武器全部升级成金色9级",
        "1件护甲升级成满级",
        "“素缨盔”升级成满级",
        "收集全部护甲并且将其升级成满级",//15
        "收集6种属性晶石",
        "1种晶石达到20级",
        "6种属性晶石全部都达到20级",
        "6种属性晶石全部都达到30级",
        "连续10次炼化晶石成功",//20
        "通过配方合成5种增加属性上限的丹药",
        "完成9个支线任务",
        "完成10个支线任务",
        "开启30个宝箱",
        "开启全部宝箱",//25
        "服下了500个丹药，你就是传说中的药罐子",
        "屠得三千九，即为雄中雄",

        "等级达到10级",
        "等级到达30级",
        "等级到达60级",//30
        "等级达到100级",
        "利用匕首技能杀死200个敌人",
        "利用火枪技能杀死200个敌人",
        "利用盾牌技能杀死200个敌人",
        "利用大炮技能屠戮300个敌人",//35
        "成功击杀蒙古小王子苏图",
        "成功击杀越女魂，取得记忆莲",
        "成功击杀龙啸",
        "成功击杀孽鬼王",
        "成功击杀纪纲",//40
        "游戏通关一次",
        "信春哥，得永生，原地满状态复活",
        "官升三级，飞黄腾达",
        "天降钱财，衣食无忧",
        "连升5级，你坐火箭的吧！",//45
        "在游戏中花费10元钱",
        "在游戏中花费20元钱",
        "在游戏中花费30元钱",
        "成就点数达到100点",
        "成就点数达到300点",//50
        "成就点数到达500点",
    };
    /**
     * 成就奖励
     */
    public String[] allEffortAward = 
    {
        "1*1|-4*0|-6*500",//0
        "4*1|-4*3|-6*500",
        "2*1|-4*1|-6*1000",
        "13*1|-6*1000",
        "3*1|-4*2|-6*1000",
        "14*1|-6*1500",//5
        "15*1|-6*1500",
        "16*1|-6*2000",
        "",

        "-1*1000|30*3|30*3",
        "-1*10000|30*5|31*5",//10
        "-1*5000|32*3",
        "-1*30000|-2*20000|38*1",
        "-1*2000|50*1",
        "-1*10000|32*3",
        "-1*30000|33*5",//15
        "-1*5000",
        "-1*20000",
        "-1*30000",
        "-1*50000|38*1",
        "-1*10000",//20
        "-1*2000|50*1|51*1|52*1|53*1",
        "33*5|50*1|51*1|52*1|53*1",
        "-1*8000|33*5",
        "-1*5000|32*5",
        "30*10|31*10",//25
        "-1*30000|32*5|33*5",
        "-1*30000|38*1",
        
        "30*5|31*5",
        "30*8|31*8",
        "32*2|33*2",//30
        "32*5|33*5",
        "-1*10000",
        "-1*10000",
        "-1*10000",
        "-1*10000",//35
        "30*3|31*3",
        "30*5|31*5",
        "32*2|33*2",
        "32*3|33*3",
        "",//40
        "-1*100000",
        "",
        "",
        "",
        "",//45
        "-1*10000|50*2|51*2|52*2|53*2",
        "-1*30000|50*3|51*3|52*3|53*3",
        "-1*50000|38*3|-5*5",
        "-6*1000",
        "-6*2000",//50
        "-6*3000",
    };
    /**
     * 成长成就点数
     */
    public short[] allEffortPoints = 
    {
        2, 3, 5, 8, 10, 12, 15, 20, 0,

        3, 20, 10, 30,
        3, 10, 15,
        5, 5, 10, 30,
        15, 5,
        5, 10,
        5, 10,
        20, 30,

        3, 5, 10, 20,
        10, 10, 10, 10,
        5, 5, 8, 8, 8, 10,
        5, 5, 5, 5,
        10, 15, 20,
        10, 20, 30, 
    };    
    
    /**
     * 所有的成就完成否
     */
    public boolean[] allEffortFinish = new boolean[64];    

    /**
     * 新游戏需要处理的成就
     */
    public void initEffortNewGame()
    {
        //如果玩家没有完成这个成就的话就清空成就内容
        allEffortFinish = new boolean[64];
        finishTime = new long[64];
        for(int index = 0; index < 64; index++)
        {
            finishTime[index] = 64 - index;
        }
	allEffortCount = 0;
        maxAttack = 0;
        maxLv = 0;
        maxMoney = 0;
        timeKillBoss1 = 0;
        varMap.clear();
    }

    /**
     * 官阶成就名称索引
     */
    public int[] effortOfficialNameIndex =
    {
        0, 1, 2, 3, 4, 5, 6, 7, 8,
    };
    /**
     * 官阶成就目标
     */
    public int[] effortOfficialTarget =
    {
        10, 25, 45,
        70, 100, 135,
        175, 220,
        1,
    };
    /**
     * 官阶成就达成变量
     */
    private String[] effortOfficialVarIndex =
    {
        EFFORT_CUR_FEAT, EFFORT_CUR_FEAT, EFFORT_CUR_FEAT,
        EFFORT_CUR_FEAT, EFFORT_CUR_FEAT, EFFORT_CUR_FEAT,
        EFFORT_CUR_FEAT, EFFORT_CUR_FEAT,
        EFFORT_KILL_BOSS5,
    };

    /**
     * 收集成就名称索引
     */
    public int[] effortCollectNameIndex =
    {
        9, 10,
        11, 12,
        13, 14, 15,
        16, 17, 18, 19,
//        20, 
        21,
        22, 23,
        24, 25,
        26, 27,
    };
    /**
     * 收集成就目标
     */
    private int[] effortCollectTarget =
    {
        1, 4,
        1, 5,
        1, 1, 6,
        6, 1, 6, 6,
//        10,
        5,
        5, 10,
        30, 45,
        500, 3999,
    };
    /**
     * 收集成就达成变量
     */
    private String[] effortCollectVarIndex =
    {
        EFFORT_WEAPON_ENCHANT_SILVER, EFFORT_WEAPON_ENCHANT_SILVER,
        EFFORT_WEAPON_ENCHANT_GOLD, EFFORT_WEAPON_ENCHANT_GOLD,
        EFFORT_ARMOR_ENCHANT, EFFORT_SUPER_ARMOR_ENCHANT, EFFORT_ARMOR_ENCHANT,
        EFFORT_HAVE_STONE_TYPE, EFFORT_STONE_ARTIFICE_20, EFFORT_STONE_ARTIFICE_20, EFFORT_STONE_ARTIFICE_30,
//        EFFORT_STONE_ARTIFICE_SUCCESS,
        EFFORT_FORMULA_SUCCESS,
        EFFORT_MISSION_EXTENSION, EFFORT_MISSION_EXTENSION,
        EFFORT_OPEN_CHEST, EFFORT_OPEN_CHEST,
        EFFORT_USE_MEDICINE, EFFORT_KILL_ENEMY,
    };

    /**
     * 荣耀成就名称索引
     */
    public int[] effortGloryNameIndex =
    {
        28, 29, 30, 31,
        32, 33, 34, 35,
        36, 37, 38, 39, 40,
        41,
        42, 43, 44, 45,
        46, 47, 48,
        49, 50, 51, 
    };
    /**
     * 荣耀成就目标
     */
    private int[] effortGloryTarget =
    {
        10, 30, 60, 100,
        200, 200, 200, 300,
        1, 1, 1, 1, 1,
        1,
        1, 1, 1, 1,
        10, 20, 30,
        100, 300, 500,
    };
    /**
     * 荣耀成就达成变量
     */
    private String[] effortGloryVarIndex =
    {
        EFFORT_LV_UP, EFFORT_LV_UP, EFFORT_LV_UP, EFFORT_LV_UP,
        EFFORT_KILL_ENEMY_BY_SKILL1, EFFORT_KILL_ENEMY_BY_SKILL2, EFFORT_KILL_ENEMY_BY_SKILL3, EFFORT_KILL_ENEMY_BY_SKILL4,
        EFFORT_KILL_BOSS1, EFFORT_KILL_BOSS2, EFFORT_KILL_BOSS3, EFFORT_KILL_BOSS4, EFFORT_KILL_BOSS5,
        EFFORT_PASS_GAME,
        EFFORT_BUY_RISE, EFFORT_BUY_OFFICIAL, EFFORT_BUY_MONEY, EFFORT_BUY_LV,
        EFFORT_USE_MONEY, EFFORT_USE_MONEY, EFFORT_USE_MONEY,
        EFFORT_CUR_EFFORT_POINT, EFFORT_CUR_EFFORT_POINT, EFFORT_CUR_EFFORT_POINT, 
    };
    
    /**
     * 获取一个组的成就列表，需要按照时间来排序，小的在上大的在下
     * @param selectIndex 
     * @return
     */
    public int[] getCurSelectEffortArray(int selectIndex)
    {
        int[] array = null;
        if (selectIndex == EFFECT_TYPE_STATISTICS) {
            return array;
        }
        if(selectIndex == EFFECT_TYPE_OFFICIAL)
        {
            array = new int[effortOfficialNameIndex.length];
            System.arraycopy(effortOfficialNameIndex, 0, array, 0, array.length);
        }
        else if(selectIndex == EFFECT_TYPE_COLLECT)
        {
            array = new int[effortCollectNameIndex.length];
            System.arraycopy(effortCollectNameIndex, 0, array, 0, array.length);
        }
        else if(selectIndex == EFFECT_TYPE_GLORY)
        {
            array = new int[effortGloryNameIndex.length];
            System.arraycopy(effortGloryNameIndex, 0, array, 0, array.length);
        }
        for (int index = 0, cnt = array.length; index < cnt; index++)
        {
            for(int idx = index + 1; idx < cnt; idx++)
            {
                if(finishTime[array[index]] < finishTime[array[idx]])
                {
                    array[index] = array[index] ^ array[idx];
                    array[idx] = array[index] ^ array[idx];
                    array[index] = array[index] ^ array[idx];
                }
            }
        }
        return array;
    }

    /**
     * 刷新成就
     * @param nameIndex
     * @param varIndex
     * @param target
     */
    private boolean updateEffort(int[] nameIndex, String[] varIndex, int[] target)
    {
        boolean isFinish = false;
        for (int index = 0, cnt = nameIndex.length; index < cnt; index++)
        {
            if(allEffortFinish[nameIndex[index]])
            {
                continue;
            }
            if(GameContext.getVar(varIndex[index]) >= target[index])
            {
                isFinish = true;
                finishTime[nameIndex[index]] = MainCanvas.currentTime + index;
                allEffortFinish[nameIndex[index]] = true;
                runAward(nameIndex[index]);
                if (nameIndex == effortOfficialNameIndex) {
                    GameContext.actor.officialLv = index + 1;
                }
                curFinishEffort |= 1L << nameIndex[index];
                allEffortCount += allEffortPoints[nameIndex[index]];
                break;
            }
        }
        return isFinish;
    }
        
    /**
     * 刷新所有的成就
     */
    public void updateEffort()
    {
        addMaxMoney(GameContext.actor.getMoney());
        GameContext.setVar(EFFORT_CUR_FEAT, GameContext.actor.featPoints);
        GameContext.setVar(EFFORT_CUR_EFFORT_POINT, allEffortCount);
        GameContext.setVar(EffortManager.EFFORT_USE_MONEY, GameContext.sms.allValue);
        
        initGetAward();
        curFinishEffort = 0;
        if (updateEffort(effortOfficialNameIndex, effortOfficialVarIndex, effortOfficialTarget)) {
            if (GameContext.actor.officialLv != 0) {
                curFinishEffort |= 1L << effortOfficialNameIndex[GameContext.actor.officialLv - 1];
            }
            return;
        }
        updateEffort(effortCollectNameIndex, effortCollectVarIndex, effortCollectTarget);
        updateEffort(effortGloryNameIndex, effortGloryVarIndex, effortGloryTarget);
    }

    public char[] getEffortDec(int index)
    {
        StringBuffer buf = new StringBuffer();
        buf.append("{0xffa847成就内容：}|");
        buf.append(allEffortDec[index]);
        buf.append("|{0xffa847成就状态：}|");
        addDec(buf, index);
        buf.append("|{0xffa847成就点数：}");
        buf.append(allEffortPoints[index]);
        if(allEffortAward[index].length() > 0)
        {
            buf.append("|{0xffa847成就奖励：}|").append(translateDec(allEffortAward[index]));
        }
        return buf.toString().toCharArray();
    }

    private void addDec(StringBuffer buf, int index)
    {
        int allIndex = index;
        if(index <= effortOfficialNameIndex[effortOfficialNameIndex.length - 1])
        {
            addDec(buf, allIndex, effortOfficialNameIndex, effortOfficialVarIndex, effortOfficialTarget);
        }
        else if(index <= effortCollectNameIndex[effortCollectNameIndex.length - 1])
        {
            addDec(buf, allIndex, effortCollectNameIndex, effortCollectVarIndex, effortCollectTarget);
        }
        else
        {
            addDec(buf, allIndex, effortGloryNameIndex, effortGloryVarIndex, effortGloryTarget);
        }
    }

    private void addDec(StringBuffer buf, int allIndex, int[] nameIndex, String[] varIndex, int[] target) {
        int index = getEffortIndexInAllIndex(allIndex, nameIndex);
        addDec(buf, allEffortFinish[allIndex], varIndex[index], target[index]);
    }

    private void addDec(StringBuffer buf, boolean isFinish, String varIndex, int target) {
        if (target > 1 && !isFinish) {
            buf.append("(").append(GameContext.getVar(varIndex)).append("/").append(target).append(")");
        }
        else if (!isFinish) {
            buf.append("未完成");
        }
        else if (isFinish) {
            buf.append("完成");
        }
    }

    private int getEffortIndexInAllIndex(int index, int[] array)
    {
        for(int idx = 0, cnt = array.length; idx < cnt; idx++)
        {
            if(index == array[idx])
            {
                return idx;
            }
        }
        return 0;
    }

    //奖励类型
    final int AWARD_MONEY = -1;
    final int AWARD_EXP = -2;
    final int AWARD_FEAT = -3;
    final int AWARD_SKILL = -4;
    final int AWARD_LV = -5;
    final int AWARD_GIFT = -6;

    private void runAward(int index)
    {
        String effortAward = allEffortAward[index];
        if (effortAward.length() == 0) {
            return;
        }
        String award[] = Util.getString(effortAward, '|');
        for (int i = 0; i < award.length; i++) {
            int strIndex = award[i].indexOf("*");
            int type = Integer.parseInt(award[i].substring(0, strIndex));
            int data = Integer.parseInt(award[i].substring(strIndex + 1));
            if (type == AWARD_MONEY) {
                GameContext.actor.addMoney(data);
                getAwardMoney += data;
            }
            else if(type == AWARD_EXP) {
                GameContext.actor.addEx(data);
                getAwardExp += data;
            }
            else if(type == AWARD_FEAT) {
                GameContext.actor.addFeat(data);
                getAwardFeat += data;
            }
            else if(type == AWARD_SKILL) {
                GameContext.actor.learnCurSkill(data);
                getAwardSkill[data] = true;
            }
            else if(type == AWARD_LV) {
                GameContext.actor.addLevel(data);
                getAwardLv += data;
            }
            else if(type == AWARD_GIFT) {
                GameContext.page.giftMoney += data;
                getAwardGift = true;
            }
            else {
                GameContext.actor.addItem((short)type, data);
                for (int itemIdx = 0; itemIdx < getAwardItemTypeCount; itemIdx++) {
                    if (getAwardItemId[itemIdx] == type) {
                        getAwardItemCnt[itemIdx] += data;
                        return;
                    }
                }
                getAwardItemId[getAwardItemTypeCount] = (short)type;
                getAwardItemCnt[getAwardItemTypeCount] = (short) data;
                getAwardItemTypeCount++;
            }
        }
    }

    private String translateDec(String dec) {
        String award[] = Util.getString(dec, '|');
        StringBuffer buf = new StringBuffer();
        for (int i = 0; i < award.length; i++) {
            int strIndex = award[i].indexOf("*");
            int type = Integer.parseInt(award[i].substring(0, strIndex));
            int data = Integer.parseInt(award[i].substring(strIndex + 1));
            if (type == AWARD_MONEY) {
                buf.append(data).append("金");
            }
            else if(type == AWARD_EXP) {
                buf.append(data).append("经验");
            }
            else if(type == AWARD_FEAT) {
                buf.append(data).append("功绩");
            }
            else if(type == AWARD_SKILL) {
                buf.append("习得技能“").append(Actor.SKILL_NAME[data]).append("”");
            }
            else if(type == AWARD_LV) {
                buf.append("等级上升").append(data).append("级");
            }
            else if(type == AWARD_GIFT) {
                buf.append("礼包中薪金增加").append(data).append("金");
            }
            else {
                buf.append(GameContext.getItem((short)type).name).append("*").append(data);
            }
            buf.append("|");
        }
        return buf.toString();
    }

    public String getAwardDec(int index) {
        if (index < effortOfficialNameIndex.length) {
            return getOfficialAwardDec();
        }
        String effortAward = allEffortAward[index];
        if (effortAward.length() == 0) {
            return null;
        }
        String award[] = Util.getString(effortAward, '|');
        StringBuffer buf = new StringBuffer();
        buf.append("成就奖励：|");
        for (int i = 0; i < award.length; i++) {
            int strIndex = award[i].indexOf("*");
            int type = Integer.parseInt(award[i].substring(0, strIndex));
            int data = Integer.parseInt(award[i].substring(strIndex + 1));
            if (type == AWARD_MONEY) {
                buf.append("获得").append(data).append("金");
            }
            else if(type == AWARD_EXP) {
                buf.append("获得").append(data).append("经验");
            }
            else if(type == AWARD_FEAT) {
                buf.append("获得").append(data).append("功绩");
            }
            else if(type == AWARD_SKILL) {
                buf.append("习得技能“").append(Actor.SKILL_NAME[data]).append("”");
            }
            else if(type == AWARD_LV) {
                buf.append("等级上升").append(data).append("级");
            }
            else if(type == AWARD_GIFT) {
                buf.append("礼包中薪金增加为").append(GameContext.page.giftMoney).append("金");
            }
            else {
                buf.append("获得").append(data).append("个").append(GameContext.getItem((short)type).name);
            }
            if (i < award.length - 1) {
                buf.append("|");
            }
        }
        return buf.toString();
    }

    //本次刷新获得的奖励
    int getAwardMoney;
    int getAwardExp;
    int getAwardFeat;
    boolean[] getAwardSkill;
    int getAwardLv;
    boolean getAwardGift;
    int getAwardItemTypeCount;
    short[] getAwardItemId;
    short[] getAwardItemCnt;

    //初始化本次获得的奖励数据
    private void initGetAward() {
        getAwardMoney = 0;
        getAwardExp = 0;
        getAwardFeat = 0;
        getAwardSkill = new boolean[GameContext.actor.SKILL_COUNT - 1];
        getAwardLv = 0;
        getAwardGift = false;
        getAwardItemTypeCount = 0;
        final int GET_AWARD_ITEM_MAX = 10;
        getAwardItemId = new short[GET_AWARD_ITEM_MAX];
        getAwardItemCnt = new short[GET_AWARD_ITEM_MAX];
    }
    
    /**
     * 刷新官职
     * @param oldOfficial
     * @param curOfficial
     */
    public String getOfficialAwardDec() {
        StringBuffer buf = new StringBuffer("官职升级奖励：|");
        if (getAwardMoney != 0) {
            buf.append("获得").append(getAwardMoney).append("金").append("|");
        }
        if (getAwardExp != 0) {
            buf.append("获得").append(getAwardExp).append("经验").append("|");
        }
        if (getAwardFeat != 0) {
            buf.append("获得").append(getAwardFeat).append("功绩").append("|");
        }
        if (getAwardLv != 0) {
            buf.append("等级上升").append(getAwardLv).append("级").append("|");
        }
        if (getAwardItemTypeCount != 0) {
            for (int index = 0; index < getAwardItemTypeCount; index++) {
                buf.append("获得").append(getAwardItemCnt[index]).append("个").append(GameContext.getItem(getAwardItemId[index]).name).append("|");
            }
        }
        for (int index = 0; index < getAwardSkill.length; index++) {
            if (getAwardSkill[index]) {
                buf.append("习得技能“").append(Actor.SKILL_NAME[index]).append("”").append("|");
            }
        }
        if (getAwardGift) {
            buf.append("礼包中薪金增加为").append(GameContext.page.giftMoney).append("金").append("|");
        }
        return buf.toString();
    }
}
