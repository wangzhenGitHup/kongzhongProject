/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;


import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.util.Enumeration;
import java.util.Hashtable;
import javax.microedition.lcdui.Image;

/**
 * 脚本引擎，用来载入并执行一段脚本
 * 读入所有的脚本，生成对应的执行对象？会不会造成对象太多（先不考虑，需要的话再合并，这样子设计最优）
 * @author 何召卫@fishfly.com
 */
public class ScriptEngine implements Observer {

    public static Hashtable strBufferAll = new Hashtable();

    public static final String PLAY_GAME_END = "游戏结束";
    public static final String TALK_INDEX = "talkIndex";
    public static final String NEED_NOT_KEY = "开启仙锁决";
    public static final String NEED_NOT_STORY = "全部剧情";

    public static final int UNKNOWN = 0;
    public static final int CREATE_ACTOR = 1;
    //判断
    public static final int IF = 2;
    public static final int ELSEIF = 3;
    public static final int ELSE = 4;
    public static final int ENDIF = 5;
    //跳转
    public static final int JUMP = 6;
    //return跳转
    public static final int RETURN = 7;
    // 脚本跳转到某个位置
    public static final int GOTO = 8;
    // 标签设定
    public static final int LABEL = 9;
    /// <summary>
    /// 特殊功能脚本
    /// </summary>
    public static final int SPECIAL = 10;
    //Npc相关
    public static final int CREATE_NPC = 11;
    public static final int SET_ROLE_POSITION = 12;
    public static final int SET_ROLE_DIR = 13;
    public static final int SET_ROLE_VISIBLE = 14;
    //设置NPC的AI
    public static final int SET_NPC_AI = 15;
    //设置npc状态
    public static final int SET_ROLE_STATUS = 16;
    //设置角色为友方
    public static final int SET_ROLE_AS_FRIEND = 17;
    /// <summary>
    /// NPC的设置是否提示
    /// </summary>
    public static final int SET_NPC_TIPS = 18;
    //设置NPC的穿越状态，可穿越意味着主角可以从其身上穿过去
    public static final int SET_NPC_PASS = 19;
    //NPC死亡时，设置变量+1
    public static final int SET_NPC_VAR = 20;
    //根据游戏进程，设置npc等级
    public static final int SET_NPC_LV = 21;
    //删除角色
    public static final int REMOVE_ROLE = 22;
    /// <summary>
    /// NPC开关
    /// </summary>
    public static final int NPC_SWITCH = 23;
    // 创建一个宝箱
    public static final int CREATE_CHEST = 24;
    /// <summary>
    /// 是否显示游戏画面
    /// </summary>
    public static final int SHOW_GAME = 25;
    /// <summary>
    /// 读取一个场景
    /// </summary>
    public static final int LOAD_SCENE = 26;
    public static final int LOAD_MAP = 27;
    //设置地图Id
    public static final int SET_MAP_ID = 28;
    //添加通道标记
    public static final int ADD_CHANNEL_MARK = 29;
    /// <summary>
    /// 播放音乐
    /// </summary>
    public static final int LOAD_MUSIC = 30;
    //在某个位置放置一个事件
    public static final int SET_EVENT = 31;
    /// <summary>
    /// 删除地图上面的脚本
    /// </summary>
    public static final int REMOVE_EVENT = 32;
    /// <summary>
    /// 设置地图事件
    /// </summary>
    public static final int SET_EVENT_STATUS = 33;
    public static final int SET_OBSERVER_MODE = 34;
    public static final int SET_SCENE_MODE = 35;
    public static final int SET_VAR = 36;
    public static final int ADD_VAR = 37;
    //移动镜头
    public static final int MOVE_CAMERA = 38;
    /// <summary>
    /// 恢复镜头
    /// </summary>
    public static final int RESUME_CAMERA = 39;
    //保持摄像头位置
    public static final int HOLD_CAMERA = 40;
    /// <summary>
    /// 不中断移动摄像头
    /// </summary>
    public static final int MOVE_CAMERA_CONTINUOUS = 41;
    /// <summary>
    /// 摄像头跟随npc移动
    /// </summary>
    public static final int MOVE_CAMERA_BY_NPC = 42;
    //将摄像头移动到特定ROLE
    public static final int MOVE_CAMERA_TO_ROLE = 43;
    public static final int SAY = 44;
    /// <summary>
    /// 选择性对话
    /// </summary>
    public static final int TALK_SELECT = 45;
    /// <summary>
    /// 屏幕信息
    /// </summary>
    public static final int MESSAGE_STR = 46;
    /// <summary>
    /// 事件分支
    /// </summary>
    public static final int BRANCH_EVENT = 47;
    /// <summary>
    /// 获得或者失去物品
    /// </summary>
    public static final int ITEMBOX = 48;
    //npc移动
    public static final int MOVE_ROLE = 49;
    /// <summary>
    /// 让npc向某一个方向移动
    /// </summary>
    public static final int MOVE_ROLE_LINE = 50;
    public static final int PLAY_ANIMATION = 51;
    /// <summary>
    /// 还原动作
    /// </summary>
    public static final int RESTORE_ACTION = 52;
    /// <summary>
    /// 添加动画
    /// </summary>
    public static final int CREATE_CARTOON = 53;
    /// <summary>
    /// 删除动画
    /// </summary>
    public static final int DEL_CATTOON = 54;
    /// <summary>
    /// 移动卡通动画
    /// </summary>
    public static final int MOVE_CARTOON = 55;
    /// <summary>
    /// 创建一个带有透明色的动画（慎用）
    /// </summary>
    public static final int CREATE_A_CARTOON = 56;
    /// <summary>
    /// 删除一个带有透明色的动画
    /// </summary>
    public static final int DEL_A_CARTOON = 57;
    /// <summary>
    /// 给主角一个任务
    /// </summary>
    public static final int GIVE_MISSION_TO_ACTOR = 58;
    /// <summary>
    /// 设置任务状态
    /// </summary>
    public static final int SET_MISSION_STATE = 59;
    /// <summary>
    /// 设置任务是否可见
    /// </summary>
    public static final int SET_MISSION_VISIBLE = 60;
    /// <summary>
    /// 获得一个任务物品
    /// </summary>
    public static final int UPDATA_MISSION_VAR = 61;
    /// <summary>
    /// 运行计费点逻辑
    /// </summary>
    public static final int RUN_SMS_COMMAND = 62;
    //游戏结束
    public static final int GAME_OVER = 63;
    //显示电影模式
    public static final int SHOW_MOVIE_MODE = 64;
    //设置电影模式高度
    public static final int SET_MOVIE_MODE_HEIGHT = 65;
    //显示场景切换
    public static final int SHOW_SCENE_SWITCH = 66;
    /// <summary>
    /// 场景的特效
    /// </summary>
    public static final int SET_SCENE_EFFECTS = 67;
    /// <summary>
    /// 屏幕震动
    /// </summary>
    public static final int SCREEN_VIBRATION = 68;
    /// <summary>
    /// 利用某个颜色覆盖屏幕
    /// </summary>
    public static final int FILL_SCREEN = 69;
    /// <summary>
    /// 保持时间
    /// </summary>
    public static final int KEEP_TIME = 70;
    /// <summary>
    /// 人物头上的小表情
    /// </summary>
    public static final int ROLE_BROW = 71;
    /// <summary>
    /// 滚屏显示文字
    /// </summary>
    public static final int SHOW_SUBTITILE = 72;
    /// <summary>
    /// 买卖物品
    /// </summary>
    public static final int SALE_ROLE = 73;
    //开始游戏
    public static final int PLAY_GAME = 74;
    /// <summary>
    /// 更改主角攻击
    /// </summary>
    public static final int CHANGE_ACTOR_ATTACK = 75;
    /// <summary>
    /// 设置主角的等级
    /// </summary>
    public static final int SET_ACTOR_LV_TYPE = 76;
    /// <summary>
    /// 更改人物属性
    /// </summary>
    public static final int ADD_OR_LOSE_ATTR = 77;
    /// <summary>
    /// 进入特殊界面
    /// </summary>
    public static final int ENTER_PAGE = 78;
    /// <summary>
    /// 获取一个随机数
    /// </summary>
    public static final int GET_RAND = 79;
    /// <summary>
    /// 创建字符串临时变量
    /// </summary>
    public static final int CREATE_STRING = 80;
    /// <summary>
    /// 字符串临时变量修改
    /// </summary>
    public static final int APPEND_STRING = 81;
    /// <summary>
    /// 字符串临时变量修改
    /// </summary>
    public static final int STRING_APPEND_INT = 82;
    /// <summary>
    /// 滚动教学
    /// </summary>
    public static final int GAME_TIP = 83;
    //设置游戏是否能够存档
    public static final int SET_GAME_SAVE = 84;
    /// <summary>
    /// 设置限时事件
    /// </summary>
    public static final int SET_LIMIT_TIME_EVENT = 85;
    //设置开始战斗时间
    public static final int SET_START_ATTACK_TIME = 86;
    //佣兵模式游戏脚本
    //加载缓冲地图
    public static final int LOAD_BUF_MAP = 87;
    //切换和平/战斗界面
    public static final int CHANGE_FIGHT_SCENE = 88;
    //加入/离开队伍
    public static final int JOIN_ACTOR_TROOP = 89;
    //杀死n个npc后运行脚本
    public static final int RUN_SCRIPT_KILL_NPCS = 90;
    //小屏脚本
    public static final int SET_NPC_POINTS = 150;
    public static final int SET_NPC_ITEMS = 1051;
    public static final int SET_SCENE_NAME = 152;
    public static final int SET_MISSION = 153;
    //下面定义用于教学的脚本
    //脚本的Id从200开始
    //本地调用，一些复杂逻辑，无法用脚本实现
    public static final int TEACH_NATIVE = 200;
    public static final int TEACH_TIP_BOX = 201;
    public static final int TEACH_TIP_ARROW = 202;
    public static final int TEACH_MESSAGE_BOX = 203;
    public static final int TEACH_KEY_MAST = 204;
    
    //#if PKG == 1
//#     public static PackageReader scriptPkg = null;
//#
//#     public static void loadPackage() {
//#         if(scriptPkg == null) {
//#             scriptPkg = new PackageReader("/out.idx", "/out.pkg");
//#         }
//#     }
    //#endif
    
    //程序数据
    //当前执行的命令类型，便于remind的时候使用
    int type = UNKNOWN;
    boolean isSuspend;
    //程序计数器
    public int pc;
    int cmdCnt;
    //脚本文件名称
    public String fileName;
    byte[] data;
    FishStream stream;
    
    //子脚本
    ScriptEngine child;
    //标签保存
    Hashtable labelHash = new Hashtable();
    
    //命令运行过程中用到的中间变量
    int data1;
    int data2;
    int data3;
    int data4;
    boolean boolData;
    String strData;
    public ScriptEngine() {
    }

    private void initLabel()
    {
        labelHash.clear();
        int lableCnt = stream.readShort();
        for(int index = 0; index < lableCnt; index++)
        {
            labelHash.put(stream.readUTF(), new Integer(stream.readShort()));
        }
    }

    public ScriptEngine(String filePath) {
        load(filePath);
        stream = new FishStream();
        stream.setData(data);
        initLabel();
        cmdCnt = stream.readShort();
    }

    public ScriptEngine clone()
    {
        ScriptEngine buf = new ScriptEngine();
        buf.fileName = fileName;
        buf.stream = new FishStream();
        buf.stream.setData(data);
        buf.initLabel();
        buf.cmdCnt = buf.stream.readShort();
        return buf;
    }

    /**
     * 是否用了临时变量
     * @param key 变量名称
     * @return 变量对应的名称
     */
    public static String changeStringKey(String key)
    {
        if(strBufferAll.isEmpty())
        {
            return key;
        }
        String s = (String)strBufferAll.get(key);
        return s == null ? key : s;
    }

    private String changeStringKeyFromHash(String data)
    {
        if(strBufferAll.isEmpty())
        {
            return data;
        }
        Enumeration keys =  strBufferAll.keys();
        while(keys.hasMoreElements())
        {
            String key = (String)keys.nextElement();
            data = changeStringKeyFromHash(key, data);
        }
        return data;
    }

    private String changeStringKeyFromHash(String key, String data)
    {
        if(data.indexOf(data) == -1)
        {
            return data;
        }
        String value = (String)strBufferAll.get(key);
        return Util.replace(data, key, value);
    }

    /**
     * 是否可以执行
     * @return true 可以执行 false 不可以执行
     */
    public boolean canExecute() {
        if(child != null) {
            return child.canExecute();
        }
        
        return !isEnd() && !isSuspend;
    }
    
    public void init()
    {
        stream.init();
        isSuspend = false;
        pc = 0;
        initLabel();
        //过滤掉主长度
        stream.skip(2);
        strBufferAll.clear();
    }
    
    public void setEnd()
    {
        isSuspend = false;
        pc = cmdCnt;
    }
    
    private void load(String filePath) {
        fileName = filePath;
        try {
            //#if PKG == 1
//#             //正常使用
//# //            data = scriptPkg.readFile(fileName);
//#             //测试用
//#             if(fileName.equals("ts1.dat")) {
//#                 data = Util.readFully("/" + fileName);
//#             } else {
//#                 data = scriptPkg.readFile(fileName);
//#             }
            //#else 
            data = Util.readFully("/scripts/" + fileName);
            //#endif
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    public void suspend() {
        isSuspend = true;
        //#if PRINTDEBUG == 1
        System.out.println("SUSPEND!!!");
        //#endif
    }
    
    public void resume() {
        //#if PRINTDEBUG == 1
        System.out.println("RESUME!!!");
        //#endif
        if(child != null && child.canExecute()) {
            child.resume();
            return;
        }
        
        isSuspend = false;
    }
    
    public void execute() {
        //对第一次执行的位置报告
        if(!canExecute()) 
        {
            return;
        }
        
        //执行子脚本
        if(child != null && child.canExecute()) {
            child.execute();
            //LoadScene 恢复
            if(child.isEnd()) {
                remind(0, 0, null);
            }
            return;
        }
        while(pc < cmdCnt) {
        //#if PRINTDEBUG == 1
        System.out.println("execute " + fileName + " " + pc);
        //#endif        
            try {
                executeCommand();
            }catch(Exception ex) {
                //#if PRINTDEBUG == 1
                System.out.println("出错脚本:" + fileName);
                ex.printStackTrace();
                //#endif
            }

            //下一条
            pc++;
            
            if(isSuspend) {
                return;
            }
        }
    }
    
    public boolean isEnd() {
        return (pc >= cmdCnt) && !isSuspend;
    }
    
    
    public void jump_execute() {
        int nextPc = stream.readShort();
        toPc(nextPc);
        //#if PRINTDEBUG
        System.out.println("Jump " + nextPc);
        //#endif
    }

    /**
     * 处理特殊脚本功能
     */
    private void Special_execute()
    {
        data1 = stream.readShort();
        data2 = stream.readShort();
        strData = stream.readUTF();
        Actor actor = GameContext.actor;

        //万箭齐发
        if (data1 == 0) {
            actor.startArrowAttacSkill();
            return;
        }

        //打开或关闭主角技能
        if (data1 == 1) {
            if (data2 >= actor.SKILL_COUNT) {
                return;
            }
            if (strData.equals("OFF")) {
                actor.isLearn[data2] = 0;
                return;
            }
            actor.isLearn[data2] = 1;
            return;
        }

        //keypadDraw是否画虚拟按键
        if (data1 == 2) {
            if (data2 == 0) {
                GameContext.page.keypadDraw = strData.equals("ON");
            }
            else if (data2 == 1) {
                GameContext.page.isDrawGameBtns = strData.equals("ON");
            }
            return;
        }
        //强化教学
        if (data1 == 3){
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            int startx = (screen_w - 350) >> 1;
            int starty = ((screen_h - 130) >> 1) - 50;
            if (data2 == 0) {
                setTeachTipArrow(true, screen_w - 25, 31, 133, 0);
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(17, screen_w - 55, 2, 55, 52, null);
//                GameContext.page.kuang(screen_w - 55, 2, 55, 52);
            } else if (data2 == 2) {
                setTeachTipArrow(true, startx + 125, starty + 60, 133, 0);
            } else if (data2 == 3) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 100, starty+30, 70, 39, null);
            } else if (data2 == 4) {
                setTeachTipArrow(false, 0, 0, 0, 0);
            } else if (data2 == 5) {
                setTeachTipArrow(true, startx + 30, starty + 225, 133, 3);
            } else if (data2 == 6) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx - 10, starty + 215, 50, 22, null);
            } else if (data2 == 7) {
                setTeachTipArrow(false, 0, 0, 0, 0);
            }
        }
        if (data1 == 4) {
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            int startx = (screen_w - 350) >> 1;
            int starty = ((screen_h - 130) >> 1) - 50;
            if (data2 == 0) {
                setTeachTipArrow(true, screen_w - 25, 31, 133, 0);
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(17, screen_w - 55, 2, 55, 52, null);
//                GameContext.page.kuang(screen_w - 55, 2, 55, 52);
            } else if (data2 == 2) {
                setTeachTipArrow(true, startx + 322, starty + 57, 133, 0);
            } else if (data2 == 3) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 279, starty + 30, 65, 35, null);
            } else if (data2 == 4) {
                setTeachTipArrow(false, 0, 0, 0, 0);
                startx = (screen_w - 370) >> 1;
                starty = (screen_h - 240) >> 1;
            } else if (data2 == 5) {
                GameContext.page.setTeachTipBox(true, startx + 25, starty + 45, 102, 107, 16776960);
            } else if (data2 == 6) {
                GameContext.page.setTeachTipBox(true, startx + 135, starty + 35, 176, 104, 16776960);
            } else if (data2 == 7) {
                GameContext.page.setTeachTipBox(false, 0, 0, 0, 0, 0);
            } else if (data2 == 8) {
                setTeachTipArrow(true, startx + 80, starty + 115, 133, 0);
            } else if (data2 == 9) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 40, starty + 98, 75, 28, null);
            } else if (data2 == 10) {
                setTeachTipArrow(false, 0, 0, 0, 0);
            } else if (data2 == 11) {
                GameContext.page.setTeachTipBox(true, startx + 43, starty + 138, 300, 70, 16776960);
            } else if (data2 == 12) {
                GameContext.page.setTeachTipBox(true, startx + 270, starty + 33, 136, 140, 16776960);
            } else if (data2 == 13) {
                setTeachTipArrow(true, startx + 67, starty + 170, 133, 0);
            } else if (data2 == 14) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 50, starty + 147, 30, 30, null);
            } else if (data2 == 15) {
                setTeachTipArrow(true, startx + 122, starty + 170, 133, 0);
            } else if (data2 == 16) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 103, starty + 144, 35, 35, null);
            } else if (data2 == 17) {
                setTeachTipArrow(true, startx + 169, starty + 119, 133, 0);
            } else if (data2 == 18) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 157, starty + 90, 25, 30, null);
            } else if (data2 == 19) {
                setTeachTipArrow(true, startx + 175, starty + 170, 133, 0);
            } else if (data2 == 20) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 158, starty + 143, 30, 35, null);
            }
        }
        if (data1 == 5) {
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            int startx = (screen_w - 350) >> 1;
            int starty = ((screen_h - 130) >> 1) - 50;
            if (data2 == 0) {
                setTeachTipArrow(true, screen_w - 25, 31, 133, 0);
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(17, screen_w - 55, 2, 55, 52, null);
            } else if (data2 == 2) {
                setTeachTipArrow(true, startx + 232, starty + 57, 133, 0);
            } else if (data2 == 3) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 189, starty + 30, 65, 35, null);
            } else if (data2 == 4) {
                startx = (screen_w - 366) >> 1;
                starty = (screen_h - 244) >> 1;
                GameContext.page.setTeachTipBox(true, startx + 65, starty + 84, 50, 50, 16776960);
            } else if (data2 == 5) {
                GameContext.page.setTeachTipBox(true, startx + 140, starty + 28, 200, 100, 16776960);
            } else if (data2 == 6) {
                GameContext.page.setTeachTipBox(true, startx + 155, starty + 160, 180, 70, 16776960);
            } else if (data2 == 7) {
               setTeachTipArrow(true, startx + 90, starty + 200, 133, 0);
            } else if (data2 == 8) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 50, starty + 170, 65, 26, null);
            }
        }
        //熊吼教学
        if (data1 == 6) {
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            if (data2 == 0) {
                GameContext.actor.mp += 50;
                setTeachTipArrow(true, screen_w - 143, screen_h - 35, 133, 0);
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                final short XIONGHOU_ID = 246;
                char[] xionghouTxt;
                xionghouTxt = StringManager.getInstance().getString(XIONGHOU_ID);
                GameContext.page.setTeachKey(7, screen_w - 161, screen_h - 53, 35, 35, xionghouTxt);
            }
        }
        //凤鸣教学
        if (data1 == 7) {
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            if (data2 == 0) {
                GameContext.actor.mp += 50;
                setTeachTipArrow(true, screen_w - 139, screen_h - 90, 133, 0);
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                final short FENGMING_ID = 245;
                char[] fengmingTxt;
                fengmingTxt = StringManager.getInstance().getString(FENGMING_ID);
                GameContext.page.setTeachKey(3, screen_w - 159, screen_h - 110, 35, 35, fengmingTxt);
            }
        }
           //礼包
        if (data1 == 8) {
            int screen_w = Page.SCREEN_WIDTH;
            if (data2 == 0) {
                GameContext.page.teachOverGift = true;
                setTeachTipArrow(true, screen_w - 130, 31, 133, 0);
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                final short LIBAO_ID = 247;
                char[] libaoTxt;
                libaoTxt = StringManager.getInstance().getString(LIBAO_ID);
                GameContext.page.setTeachKey(0, screen_w - 160, 2, 55, 52, libaoTxt);
            }
        }
        //官职教学
        if (data1 == 9) {
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            int startx = (screen_w - 350) >> 1;
            int starty = ((screen_h - 130) >> 1) - 50;
            if (data2 == 0) {
                setTeachTipArrow(true, screen_w - 25, 31, 133, 0);
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(17, screen_w - 55, 2, 55, 52, null);
            } else if (data2 == 2) {
                setTeachTipArrow(true, startx + 222, starty + 132, 133, 0);
            } else if (data2 == 3) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, startx + 180, starty + 110, 70, 39, null);
            } else if (data2 == 4) {
                setTeachTipArrow(true, startx + 345, starty + 235, 133, 0);
            } else if (data2 == 5) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1,startx + 310, starty + 215, 68, 26, null);
            } else if (data2 == 6) {
                setTeachTipArrow(true, screen_w - 42, screen_h - 25, 133, 2);
            } else if (data2 == 7) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, screen_w - 78, screen_h - 34, 70, 29, null);
            } else if (data2 == 8) {
                setTeachTipArrow(true, screen_w - 130, 31, 133, 0);
            }
        }
        //万箭齐发
        if (data1 == 10) {
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            if (data2 == 0) {
                setTeachTipArrow(true, screen_w - 32, screen_h - 106, 133, 0);
            }
        }
        if (data1 == 11) {
            if (data2 == 0) {
                GameContext.page.isNotSaleItem = true;
            } else if (data2 == 1) {
                GameContext.page.isNotSaleItem = false;
            }
        }
        if (data1 == 12) {
            if (data2 == 0) {
                GameContext.actor.officialLv = 0;
            }
        }
        if (data1 == 13) {//通关一次
            if (data2 == 0) {
                GameContext.addVar(EffortManager.EFFORT_PASS_GAME, 1);
            }
        }
        if (data1 == 14) {//开启随身商店
            if (data2 == 0) {
                GameContext.page.useShop = true;
            }
        }
    }

    /**
     * 创建一个带有透明色的动画
     */
    private void createACartoon_execute()
    {
        suspend();
        int aniId = stream.readShort();
        int actId = stream.readShort();
        int x = stream.readShort();
        int y = stream.readShort();
        int startA = stream.readShort();
        int endA = stream.readShort();
        PaintUnit paint = new PaintUnit();
        AnimationManager.getInstance().getAnimation((short)aniId, paint);
        paint.actId = (short) actId;
        paint.x = x;
        paint.y = y;        
        paint.initFrame();
        GameContext.page.script = this;        
        ImageManager.getInstance().removeImage(paint.img);
        GameContext.page.setCartoonWithAlpha(paint, true, startA, endA);
    }

    private void createACartoon_rimend()
    {
        resume();
    }

    private void delACartoon_execute()
    {
        GameContext.page.setCartoonWithAlpha(null, false, 0, 0);
    }

    /**
     * 游戏结束
     */
    private void gameOver_execute()
    {
        String str = stream.readUTF();
        GameContext.page.setGameOver(str);
    }

    /**
     * 获取一个随机数
     */
    private void getRand_execute()
    {
        String str = stream.readUTF();
        int min = stream.readShort();
        int max = stream.readShort();
        int rand = GameContext.getRand(min, max);
        GameContext.setVar(str, rand);
    }

    /**
     * 摄像头跟随npc移动
     */
    private void moveCameraByNpc_execute()
    {
        boolean isMove = stream.readBoolean();
        String name = stream.readUTF();
        GameContext.page.setCameraMoveByNpc(isMove, name);
    }

    /**
     * npc在一条线上移动
     */
    private void moveRoleLine_execute()
    {
        suspend();
        int cnt = stream.readShort();
        data1 = cnt;
        data2 = 0;
        String npcName = null;
        int[] npcDir = null;
        int[] npcLength = null;
        int[] npcSpeed = null;
        boolean[] isNpcNo = null;
        for(int index = 0; index < cnt; index++)
        {
            npcName = stream.readUTF();
            int eachCnt = stream.readByte() & 0xff;
            npcDir = new int[eachCnt];
            npcLength = new int[eachCnt];
            npcSpeed = new int[eachCnt];
            isNpcNo = new boolean[eachCnt];
            for(int eachIndex = 0; eachIndex < eachCnt; eachIndex++)
            {
                npcDir[eachIndex] = stream.readByte() & 0xff;
                npcLength[eachIndex] = stream.readByte() & 0xff;
                npcSpeed[eachIndex] = stream.readByte() & 0xff;
                isNpcNo[eachIndex] = stream.readBoolean();                
            }
            Role r = RoleManager.getInstance().getNpc(npcName);
            if(r == null)
            {
                r = GameContext.actor;
            }
            r.initMoveLine(npcDir, npcLength, npcSpeed, isNpcNo);
            GameContext.page.script = this;
        }
    }
    
    private void moveRoleLine_remind()
    {
        data2++;
        if(data2 >= data1)
        {
            resume();
        }
    }
    
    private void executeCommand()
    {
        //抛弃长度
        stream.readShort();
        type = stream.readByte() & 0xff;
        //#if PRINTDEBUG == 1
        System.out.println("运行脚本类型="+type);
        //#endif

        if (type != SAY && type != TALK_SELECT) {
            GameContext.page.initTalkFaceId();
        }
        
        switch(type) {

            case MOVE_CARTOON:
                moveCartoon_execute();
                break;
                
            case GOTO:
                goto_execute();
                break;

            case LABEL:
                label_execute();
                break;

	    case ENTER_PAGE:
		enterPage_execute();
		break;

	    case GAME_TIP:
		gameTip_execute();
		break;

            case APPEND_STRING:
                appendString_execute();
                break;

            case CREATE_STRING:
                createString_execute();
                break;

            case CHANGE_ACTOR_ATTACK:
                changeActorAttack_execute();
                break;

            case SET_LIMIT_TIME_EVENT:
                setLimitTimeEvent_execute();
                break;

            case SET_EVENT_STATUS:
                setMapEvent_execute();
                break;

            case MOVE_ROLE_LINE:
                moveRoleLine_execute();
                break;
                
            case REMOVE_EVENT:
                removeEvent_execute();
                break;
            
            case GAME_OVER:
                gameOver_execute();
                break;
                        
            case SET_GAME_SAVE:
                saveGame_execute();
                break;
            
            case SCREEN_VIBRATION:
                screenVibration_execute();
                break;
            
            case RESTORE_ACTION:
                restoreAction_execute();
                break;
            
            case RUN_SMS_COMMAND:
                runSmsCommand_execute();
                break;            
            case CREATE_ACTOR:
                createActor_execute();
                break;

            case CREATE_NPC:
                createNpc_execute();
                break;

            case SET_ROLE_DIR:
                setRoleDir_execute();
                break;

            case SET_ROLE_POSITION:
                setRolePosition_execute();
                break;

            case SET_ROLE_VISIBLE:
                setRoleVisible_execute();
                break;

            case MOVE_ROLE:
                moveRole_execute();
                break;

            case TALK_SELECT:
                selectTalk_execute();
                break;

            case SAY:
                say_execute();
                break;

            case SET_OBSERVER_MODE:
                setObserverMode_execute();
                break;

            case SET_SCENE_MODE:
                setSceneMode_execute();
                break;

            case LOAD_MAP:
                loadMap_execute();
                break;

            case IF:
                if_execute();
                break;
                
            case ELSEIF:
                elseif_execute();
                break;

            case ELSE:
            case ENDIF:
                return;
                
            case SET_VAR:
                setVar_execute();
                break;

            case ADD_VAR:
                addVar_execute();
                break;

            case MOVE_CAMERA:
                moveCamera_execute();
                break;

            case SET_ROLE_AS_FRIEND:
                setRoleAsFriend_execute();
                break;

            case SET_NPC_AI:
                setNpcAi_execute();
                break;

            case CREATE_A_CARTOON:
                createACartoon_execute();
                break;
                
            case DEL_A_CARTOON:
                delACartoon_execute();
                break;
                
            case SPECIAL:
                Special_execute();
                break;
                
            case SET_EVENT:
                setEvent_execute();
                break;

            case PLAY_ANIMATION:
                playAnimation_execute();
                break;

            case GIVE_MISSION_TO_ACTOR:
                giveMissionToActor_execute();
                break;

            case LOAD_SCENE:
                loadScene_execute();
                break;

            case BRANCH_EVENT:
                branchEvent_execute();
                break;

            case ITEMBOX:
                changeActorItems_execute();
                break;

            case SHOW_GAME:
                showGameScreen_execute();
                break;
                
            case SET_MISSION_STATE:
                setMissionState_execute();
                break;

            case SET_MISSION_VISIBLE:
                setMissionVisible_execute();
                break;

            case UPDATA_MISSION_VAR:
                updataMissionVar_execute();
                break;
                
            case SET_SCENE_EFFECTS:
                setSceneEffect_execute();                
                break;
                
            case MOVE_CAMERA_BY_NPC:
                moveCameraByNpc_execute();
                break;

            case LOAD_MUSIC:
                loadMusic_execute();
                break;

            case FILL_SCREEN:
                fillScreen_execute();
                break;

            case ADD_OR_LOSE_ATTR:
                changeActorAttr_execute();
                break;

            case MESSAGE_STR:
                messageBox_execute();
                break;

            case RESUME_CAMERA:
                resumeCamera_execute();
                break;

            case SET_NPC_TIPS:
                setNpcTip_execute();
                break;

            case SALE_ROLE:
                showSaler_execute();
                break;

            case ROLE_BROW:
                showRoleFaces_execute();
                break;
                
            case CREATE_CHEST:
                createChest_execute();
                break;
                
            case JUMP:
                jump_execute();
                break;
                
            case RETURN:
                //直接跳到最后
                pc = cmdCnt;
                break;
                
            case CREATE_CARTOON:
                createCartoon_execute();
                break;
                
            case DEL_CATTOON:
                delCartoon_execute();
                break;
                
            case SET_ACTOR_LV_TYPE:
                setActorLv_execute();
                break;
                
            case NPC_SWITCH:
                npcSwitch_execute();
                break;
                
            case KEEP_TIME:
                keepTime_execute();
                break;
                
            case ADD_CHANNEL_MARK:
                addChannelMark_execute();
                break;
                
            case SHOW_MOVIE_MODE:
                showMovieMode_execute();
                break;
                
            case REMOVE_ROLE:
                removeRole_execute();
                break;
                
            case SHOW_SCENE_SWITCH:
                showSceneSwitch_execute();
                break;
                
            case HOLD_CAMERA:
                holdCamera_execute();
                break;
            case SET_MAP_ID:
                setMapId_execute();
                break;
            case PLAY_GAME:
                playGame_execute();
                break;
                
            case SET_NPC_PASS:
                setNpcPass_execute();
                break;
                
            case SET_NPC_LV:
                setNpcLevel_execute();
                break;  
                
            case GET_RAND:
                getRand_execute();
                break;

            case SET_ROLE_STATUS:
                setRoleStatus_execute();
                break;

            case SHOW_SUBTITILE:
                showSubtitle_execute();
                break;

            case TEACH_NATIVE:
                teachNative_execute();
                break;

            case TEACH_TIP_BOX:
                teachTipBox_execute();
                break;

            case TEACH_TIP_ARROW:
                teachTipArrow_execute();
                break;

            case TEACH_MESSAGE_BOX:
                teachMessageBox_execute();
                break;

            case TEACH_KEY_MAST:
                teachKeyMast_execute();
                break;
                
            //#if PRINTDEBUG == 1
            default:
                throw new RuntimeException("这个脚本尚未实现:" + type);
            //#endif
        }
    }

    private void removeEvent_execute()
    {
        String eventName = stream.readUTF();
        short[] eventKey = new short[GameContext.map.engines.size()];
        int eventIndex = 0;
        for(int index = 0, cnt = GameContext.map.engines.size(); index < cnt; index++)
        {
            ScriptEngine script = (ScriptEngine) GameContext.map.engines.value(index);
            if(script.fileName.equals(eventName))
            {
                eventKey[eventIndex] = GameContext.map.engines.key(index);
                eventIndex++;
            }
        }
        for(int index = 0; index < eventIndex; index++)
        {
            GameContext.map.engines.remove(eventKey[index]);
        }
    }

    /**
     * 设置场景特效
     */
    private void setSceneEffect_execute()
    {
        boolean isOutSide = stream.readBoolean();
        short effectType = stream.readShort();
        int color = stream.readInt();
        int a = stream.readInt();
        GameContext.page.setSceneEffortType(effectType, isOutSide, color, a);
    }

    final private void showSubtitle_execute() {
        int showType = stream.readByte();
        int backClr = stream.readInt();
        int wordClr = stream.readInt();
        String wordStr = stream.readUTF();
        int exInt = stream.readInt();
        String exWord = stream.readUTF();

        suspend();
        GameContext.actor.status = Role.STAND_STATUS;
        GameContext.actor.changeAction();
        GameContext.page.setEffort(0);
        GameContext.page.script = this;
        GameContext.page.showSubtitleInit(showType, wordStr.toCharArray(), backClr, wordClr);
    }

    final private void showSubtitle_remind() {
        resume();
    }
    
    private void playGame_execute()
    {        
        data1 = stream.readByte();
        data2 = stream.readByte();

        if (data1 == 0) {
            GameContext.setVar(PLAY_GAME_END, 0);
            if (data2 == 0) {
                GameContext.miniGame = new FlyGameControlHorse();
                GameContext.page.isMiniGame = true;
            } else if (data2 == 1) {
                suspend();
                GameContext.page.script = this;
                GameContext.miniGame.setGameState(1);
            } else if (data2 == 3) {
                suspend();
                GameContext.page.script = this;
                GameContext.miniGame.setGameState(2);
            } else if (data2 == 2) {
                GameContext.page.isMiniGame = false;
                GameContext.miniGame.removeImage();
                GameContext.miniGame = null;
            }
            return;
        }
        if (data1 == 1) {
            if (data2 == 0) {
                GameContext.miniGame = new GoldFlower();
                GameContext.page.isMiniGame = true;
            } else if (data2 == 3) {
                suspend();
                GameContext.page.script = this;
                GameContext.miniGame.setGameState(3);
            } else if (data2 == 6) {
                suspend();
                GameContext.page.script = this;
                GameContext.miniGame.setGameState(6);
            } else if (data2 == 4) {
                suspend();
                GameContext.page.script = this;
                GameContext.miniGame.setGameState(4);
            } else if (data2 == 5) {
                suspend();
                GameContext.page.script = this;
                GameContext.miniGame.setGameState(5);
            } else if (data2 == 2) {
                GameContext.page.isMiniGame = false;
                GameContext.miniGame.removeImage();
                GameContext.miniGame = null;
            }

            return;
        }
    }

    private void special_remind(int evtId, int param1, Object param2)
    {
        resume();
    }
    
    /**
     * 游戏结束，通知脚本
     * @param evtId
     * @param dlgType
     */
    private void playGame_remind(int evtId, int dlgType) {
        if (evtId == 300) {
            resume();
        }
    }

    /**
     * 保存游戏进度
     */
    private void saveGame_execute()
    {
        suspend();
        GameContext.page.script = this;
        GameContext.page.canSave(true);
    }
    
    /**
     * 保存游戏进度
     */
    private void saveGame_remind(int a, int b, Object c)
    {
        GameContext.page.canSave(false);
        resume();
    }

    private void setActorLv_execute()
    {
        int lv = stream.readShort();
        GameContext.actor.setActorLv(lv);
    }
    
    private void setMapId_execute() {
        short mapId = stream.readShort();
        GameContext.map.id = mapId;
        GameContext.page.refreshMapName();
    }
    
    private void holdCamera_execute() {
        boolean hold = stream.readBoolean();
        GameContext.page.holdCamera = hold;
        //#if PRINTDEBUG == 1
        System.out.println("HoldCamera " + hold);
        //#endif
    }
    
    private void addChannelMark_execute() {
        
        AnimationManager aniMgr = AnimationManager.getInstance();
        short x = stream.readShort();
        short y = stream.readShort();
        byte dir = stream.readByte();
        
        //#if PRINTDEBUG == 1
        System.out.println("AddChannelMark " + x + " " + y + " " + dir);
        //#endif       
        GameContext.map.addChannelMark(x, y, dir);
        

    }
    
    private void showSceneSwitch_execute() {
        suspend();
        int switchType = stream.read();
        GameContext.page.script = this;
        if(switchType == 0) {
            switchType = GameContext.getRand(1, 8);
        }
        //#if N7370 || N7370small
//#         //7370有可能是因为CreateImage并且调用drawRGB次数过于频繁造成内存问题，目前看游戏的峰值内存并没有到达2MB，如果测试反应再次死机，删除渐白效果
//# //        if(GameContext.getVar("progess") >= 300 && switchType == 9)
//# //        {
//# //            switchType = 1;
//# //        }
//# //        else if(GameContext.getVar("progess") >= 300 && switchType == 10)
//# //        {
//# //            switchType = 107;
//# //        }
        //#endif
        GameContext.page.showSceneSwitch(switchType);
        
        //#if PRINTDEBUG == 1
        System.out.println("ShowSceneSwitch " + switchType);
        //#endif
    }
    
    private void showSceneSwitch_remind() {
        resume();
        //#if PRINTDEBUG == 1
        System.out.println("ShowSceneSwitch RESUME");
        //#endif
    }
    
    private void showMovieMode_execute() {
        suspend();
        int flag = stream.readByte() & 0xff;
//        boolean flag = stream.readBoolean();
        GameContext.page.script = this;
        GameContext.page.initShowScreen();
        if (flag == 1)
        {
            GameContext.page.showMovieMode();
        }
        else if (flag == 0)
        {
            if (GameContext.page.movieMode)
            {
                GameContext.page.closeMovieMode();
            }
            else
            {
                GameContext.page.closeMovivePrompt();
                resume();
            }
        }
        else if (flag == 2)
        {
            GameContext.page.showMovivePrompt();
            resume();
        }
        else if (flag == 3)
        {
            GameContext.page.closeMovivePrompt();
            resume();
        }
        else if (flag == 4)
        {
            GameContext.page.showMoviveAllScreen();
            GameContext.page.setShowScreen(Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
            resume();
        }
        //#if PRINTDEBUG == 1
        System.out.println("ShowMovieMode " + flag);
        //#endif
    }
    
    private void showMovieMode_remind() {
        resume();
        //#if PRINTDEBUG == 1
        System.out.println("ShowMovieMode RESUME");
//        try {
//            throw new RuntimeException();
//        }catch(Exception ex) {
//            ex.printStackTrace();
//        }
        //#endif
    }
    
    private void keepTime_execute()
    {
        suspend();
        int keepTime = stream.readShort();
        //#if PRINTDEBUG == 1
        System.out.println("需要休息时间="+keepTime);
        //#endif
        GameContext.page.setKeepTime(this, keepTime);
    }
    
    private void keepTime_remind(int evtId, int param1, Object param2)
    {
        resume();
    }    
    
    private void npcSwitch_execute()
    {
        boolean isSwitch = stream.readBoolean();
        RoleManager roleMgr = RoleManager.getInstance();
        if(isSwitch)
        {
            roleMgr.openNpcs();
            return;
        }
        roleMgr.lockNpcs();
    }
    
    private void delCartoon_execute()
    {
        String name = stream.readUTF();
        GameContext.page.setCartoon(null, name, true, false, false);
    }
    
    private void createCartoon_execute()
    {
        String name = stream.readUTF();
        int id = stream.readShort();
        int actId = stream.readShort();
        int x = stream.readShort();
        int y = stream.readShort();
        boolean isShow = stream.readBoolean();
        //是否暂停脚本
        boolData = stream.readBoolean();
        if (boolData)
        {
            suspend();
        }
        boolean isEndDel = stream.readBoolean();
        PaintUnit p = new PaintUnit();
        AnimationManager.getInstance().getAnimation((short)id, p);
        p.actId = (short) actId;
        p.x = x;
        p.y = y;
        p.initFrame();
        GameContext.page.script = this;
        GameContext.page.setCartoon(p, name, isShow, boolData, isEndDel);
        //#if PRINTDEBUG == 1
        System.out.println("设置了动画；" + p + "x=" + x + ";y=" + y+";暂停="+boolData);
        //#endif
    }
    
    public void createCartoon_remind(int evtId, int param1, Object param2)
    {
        //#if PRINTDEBUG == 1
        System.out.println("结束动画;="+boolData+";="+evtId);
        //#endif
        resume();
    }    

    private void restoreAction_execute()
    {
        int count = stream.readShort();
        String names = null;
        RoleManager roleMgr = RoleManager.getInstance();
        for (int index = 0; index < count; index++)
        {
            names = stream.readUTF();
            Role bufRole = roleMgr.getNpc(names);
            if(bufRole == null)
            {
                bufRole = GameContext.actor;
            }
            if (bufRole.bufferAni != null)
            {
                bufRole.ani = bufRole.bufferAni;
                bufRole.actId = bufRole.bufferActId;
                bufRole.initFrame();
                bufRole.bufferAni = null;
                bufRole.changeAction();
                bufRole.isKeepLastFrame = false;
            }
        } 
    }

    private void roleWalk_execute()
    {
        String roleName = stream.readUTF();
        int count = stream.readShort();
        int[] moveX = new int[count];
        int[] moveY = new int[count];
        int[] sleepTime = new int[count];
        for (int index = 0; index < count; index++)
        {
            moveX[index] = stream.readShort();
            moveY[index] = stream.readShort();
            sleepTime[index] = stream.readShort();
        }
        Npc npc = RoleManager.getInstance().getNpc(roleName);
        if(npc == null)
        {
            return;
        }
    }

    public void roleWalk_remind(int evtId, int param1, Object param2)
    {
        
    }
    
    /**
     * 设置屏幕震动
     */
    private void screenVibration_execute()
    {
        boolean isVibration = stream.readBoolean();
        GameContext.page.setScriteVibration(isVibration);
    }
    
    private void toPc(int nextPc) {
        pc++;
        while(pc != nextPc && pc < cmdCnt) {
            int cmdLen = stream.readShort();
            stream.skip(cmdLen);
            pc++;
        }
        
        //因为执行完这条指令后pc会自动加一
        pc--;
        //#if PRINTDEBUG == 1
        System.out.println("跳转 execute " + fileName + " " + pc);
        //#endif
    }

    public void remind(int evt, int param1, Object param2) {
        //#if PRINTDEBUG == 1
        System.out.println("REMIND " + evt);
        System.out.println("类型：" + type);
        //#endif
        switch(type) {           

            case MOVE_CARTOON:
                moveCartoon_remind(evt, param1, param2);
                break;
	    case ENTER_PAGE:
		enterPage_rimend();
		break;

            case SPECIAL:
                special_remind(evt, param1, param2);
                break;
            
            case CREATE_A_CARTOON:
                createACartoon_rimend();
                break;
            
            case GET_RAND:
                break;

            case SET_GAME_SAVE:
                saveGame_remind(evt, param1, param2);
                break;
            
            case CREATE_CARTOON:
                createCartoon_remind(evt, param1, param2);
                break;            
            case RUN_SMS_COMMAND:
                runSmsCommand_remind(evt, param1, param1);
                break;            
            
            case MOVE_ROLE:
                moveRole_remind(evt, param1, param2);
                break;

            case TALK_SELECT:
                selectTalk_remind(evt, param1, param2);
                break;

            case SAY:
                say_remind(evt, param1, param2);
                break;
                
            case MOVE_CAMERA:
                moveCamera_remind(evt, param1, param2);
                break;
                
            case PLAY_ANIMATION:
                playAnimation_remind(evt, param1, param2);
                break;
                
            case LOAD_SCENE:
                loadScene_remind(evt, param1, param2);
                break;
                
            case BRANCH_EVENT:
                branchEvent_remind(evt, param1, param2);
                break;
                
            case ITEMBOX:
                changeActorItems_remind(evt, param1, param2);
                break;
                
            case SHOW_GAME:
                showGameScreen_remind(evt, param1, param2);
                break;
                
            case KEEP_TIME:
                keepTime_remind(evt, param1, param2);
                break;
                
            case ADD_OR_LOSE_ATTR:
                changeActorAttr_remind(evt, param1, param2);
                break;
                
            case MESSAGE_STR:
                messageBox_remind(evt, param1, param2);
                break;
                
            case RESUME_CAMERA:
                resumeCamera_remind(evt, param1, param2);
                break;
                
            case SALE_ROLE:
                showSaler_remind(evt, param1, param2);
                break;
                
            case ROLE_BROW:
                showRoleFaces_remind(evt, param1, param2);
                break;
                
            case SHOW_MOVIE_MODE:
                showMovieMode_remind();
                break;
                
            case SHOW_SCENE_SWITCH:
                showSceneSwitch_remind();
                break;
                
            case PLAY_GAME:
                playGame_remind(evt, param1);
                break;
                
            case MOVE_ROLE_LINE:
                moveRoleLine_remind();
                break;

            case SHOW_SUBTITILE:
                showSubtitle_remind();
                break;

            case TEACH_NATIVE:
                teachNative_remind();
                break;

            case TEACH_MESSAGE_BOX:
                teachMessageBox_remind();
                break;

            case TEACH_KEY_MAST:
                teachKeyMast_remind();
                break;
        }
    }
    
    public void elseif_execute() {
        if_execute();
    }
    
    public void if_execute() {
        //#if PRINTDEBUG == 1
            if(type == IF) {
                System.out.print("IF ");
            } else {
                System.out.print("ELSEIF ");
            }
        //#endif
            
        Condition cond = new Condition();
        cond.load(stream);
        int notJumpPc = stream.readShort();
        //#if PRINTDEBUG == 1
        System.out.print(cond + " jump " + notJumpPc);
        //#endif
        
        if(cond.getValue() != 0) {
            //继续执行下一行
            //#if PRINTDEBUG == 1
            System.out.println(" TRUE");
            //#endif
            return;
        }
        
        //如果条件为非直接跳转
        toPc(notJumpPc);
        //#if PRINTDEBUG == 1
        System.out.println(" FALSE");
        //#endif
    }    
    
    /**
     * 在几个人物头上显示小表情
     */
    public void showRoleFaces_execute()
    {
        suspend();     
        //#if PRINTDEBUG == 1
        System.out.print("ShowRoleFaces ");
        //#endif
        
        int cnt = stream.readByte();
        PaintUnit[] browPaintUnit = new PaintUnit[cnt];
        
        final short BROW_PAINT = 122;
        AnimationManager aniMgr = AnimationManager.getInstance();
        
        RoleManager roleMgr = RoleManager.getInstance();
        Rect box = new Rect();
        MusicPlayer.getInstance().playSound(SoundConst.ROLEBROW);
        for (int index = 0; index < cnt; index++)
        {
            String roleName = stream.readUTF();
            short face = stream.readByte();
            
            //#if PRINTDEBUG == 1
            System.out.print(roleName + " " + face + " ");
            //#endif
            Role r = roleMgr.getNpc(roleName);
            PaintUnit unit = new PaintUnit();
            browPaintUnit[index] = unit;
            //不是NPC的话就是主角
            if(r == null)
            {
                r = GameContext.actor;
                r.getPaintBox(box);
                browPaintUnit[index].y = r.y - 50;
            }
            else
            {
                r.getPaintBox(box);
                browPaintUnit[index].y = r.y - box.getHeight();
            }
            aniMgr.getAnimation(BROW_PAINT, unit);
            
            unit.actId = face;
            unit.initFrame();
            unit.x = r.x;
            
        }        
        GameContext.page.setBrowPaintUnit(browPaintUnit, this); 
        
        //#if PRINTDEBUG == 1
        System.out.println();
        //#endif 
    }

    public void showRoleFaces_remind(int evtId, int param1, Object param2)
    {
        //#if PRINTDEBUG == 1
        System.out.println("ShowRoleFaces resume");
        //#endif
        resume();
    }
    
    public void showSaler_execute()
    {
        suspend();
        int count = stream.readShort();
        short[] items = new short[count];
        for (int index = 0; index < count; index++)
        {
            items[index] = stream.readShort();
        }
        
        //#if PRINTDEBUG == 1
        System.out.print("ShowSaler ");
        for (int index = 0; index < items.length; index++)
        {
            System.out.print(items[index]);
            System.out.print(" ");
        }
        System.out.println();
        //#endif
        //TODO 显示卖东西的商店
        GameContext.page.script = this;
        GameContext.page.showStore(items);
    }

    public void showSaler_remind(int evtId, int param1, Object param2)
    {
        //#if PRINTDEBUG == 1
        System.out.println("ShowSaler resume");
        //#endif
        if (GameContext.page.isNotResumeScript) {
            return;
        }
        resume();
    }
    
    /**
     * 显示NPC头上的叹号图标
     */
    public void setNpcTip_execute()
    {
        String roleName = stream.readUTF();
        int tipId = stream.readByte();
        //#if PRINTDEBUG == 1
        System.out.println("SetNpcTip " + roleName + " " + tipId);
        //#endif
        //TODO 显示NPC头上的叹号
        Npc npc = RoleManager.getInstance().getNpc(roleName);
        if(npc == null)
        {
            return;
        }
        npc.setTipData(tipId);
    }
    
    public void resumeCamera_execute()
    {
        boolean isStart = stream.readBoolean();
        int speed = stream.readByte();
        boolean isSuspend = stream.readBoolean();
        //#if PRINTDEBUG == 1
        System.out.println("ResumeCamera " + isStart);
        //#endif
        int x = GameContext.actor.x;
        int y = GameContext.actor.y;
        if(RoleManager.getInstance().boss != null && y >= GameContext.page.getTopSpace())
        {
            y -= GameContext.page.getTopSpace() - (GameContext.page.showHeight >> 1);
        }
        if (isSuspend) {
            suspend();
        }
        adjustCamera(x, y, isStart, speed);
    }
    
    public void resumeCamera_remind(int evtId, int param1, Object param2)
    {
        //#if PRINTDEBUG == 1
        System.out.println("ResumeCamera resume");
        //#endif
        //TODO 镜头拉回完毕
        resume();
    }

    private void setNpcStatus(Npc npc, int status) {
        if (npc == null) {
            return;
        }
         switch (status) {
            case Role.STAND_STATUS:
                if (npc.isHelper) {
                    npc.isHide = true;
                    npc.setDie(true);
                    return;
                }
                if (npc.status == Role.DEAD_STATUS || npc.isDie() || npc.hp == 0) {
                    return;
                }
                npc.status = status;
                npc.changeAction();
                break;
            case Role.DEAD_STATUS:
                npc.haveTriggerAction = false;
                if (npc.file.getAction(Role.DEAD_STATUS) == null) {
                    npc.hp = 1;
                    return;
                }
                npc.status = Role.DEAD_STATUS;
                npc.changeAction();
                break;
        }
    }

    public void setRoleStatus_execute()
    {
        String roleName = stream.readUTF();
        int status = stream.readByte();
        if (roleName.equals("所有npc") || roleName.equals("所有NPC")) {
            RoleManager roleMgr = GameContext.page.roleMgr;
//            roleMgr.delAllArrow();
            for (int index = 0, count = roleMgr.npcMap.size(); index < count; index++) {
                Npc npc = roleMgr.npcs[index];
                if (npc != null) {
                    setNpcStatus(npc, status);
                }
            }
            return;
        }

        //NPC
        if(roleName.equals("curNpc") || roleName.equals("curnpc"))
        {
            roleName = GameContext.page.curNpc.name;
        }
        Npc npc = RoleManager.getInstance().getNpc(roleName);
        if (npc != null) {
            setNpcStatus(npc, status);
            return;
        }

        //宝箱
        if(roleName.equals("curbox"))
        {
            roleName = GameContext.page.curBox.name;
        }
        ChestBox box = RoleManager.getInstance().getChestBox(roleName);
        if(box != null) {
            GameContext.page.setBoxStatus(roleName, status);
            return;
        }

        //主角
        if(status == Role.STAND_STATUS)
        {
            GameContext.page.setEffort(0);
        }
        GameContext.actor.isStopKey = false;
        GameContext.actor.isRunSkillAttack = false;
        GameContext.actor.isPhysical = false;
        GameContext.actor.status = status;
        GameContext.actor.changeAction();
        GameContext.actor.changeActGroup(0);
        GameContext.page.keyMgr.resetKey();
        GameContext.page.keyMgr.resetKeyIm();
    }

    /**
     * 显示一个信息提示框
     * 有时提示框会需要用户按某个键消失，这里就用到了后面两个参数
     * 最后一个参数指定按键的索引，数字键5就是5
     */
    public void messageBox_execute()
    {
        suspend();
        //#if PRINTDEBUG == 1
        System.out.println("MessageBox SUSPEND");
        //#endif
        String msg = stream.readUTF();
        msg = changeStringKeyFromHash(msg);
        boolean isAdd = stream.readBoolean();
        long keyIndex = 0;
        GameContext.page.script = this;
        
        if(isAdd) 
        {
            keyIndex = stream.readLong();
            GameContext.page.dlg.showMessageBox(msg.toCharArray(), keyIndex);
        }
        else
        {
            GameContext.page.dlg.showMessageBox(msg.toCharArray());
        }
        
        //#if PRINTDEBUG == 1
        System.out.println("MessageBox " + msg + " " + isAdd + " " + keyIndex);
        //#endif
    }
    
    public void messageBox_remind(int evtId, int param1, Object param2)
    {
        //#if PRINTDEBUG == 1
        System.out.println("MessageBox resume");
        //#endif
        resume();
    }

    public void changeActorAttr_execute()
    {
        suspend();
        boolean isAdd = stream.readBoolean();
        int attrKind = stream.readShort();
        int attrVal = stream.readShort();
        final int EX = 8;
        final int MONEY = 9;
        //#if SMS == 1
        if(isAdd && attrKind == EX && Sms.doubleExp)
        {
            attrVal *= 2;
        }
        if(isAdd && attrKind == MONEY && Sms.doubleMoney && !GameContext.page.isArtificeTeach)
        {
            attrVal *= 2;
        }
        //#else
//#         if(isAdd && (attrKind == EX || attrKind == MONEY))
//#         {
//#             attrVal *= 3;
//#         }
        //#endif
        StringBuffer strBuffer = new StringBuffer();
        final short GET_ID = 24;
        final short LOSE_ID = 25;
//        if(attrKind == Actor.SKILL_COUNT)
//        {
//            resume();
//            return;
//        }
        if(isAdd)
        {
            strBuffer.append(StringManager.getInstance().getString(GET_ID));
        }
        else
        {
            strBuffer.append(StringManager.getInstance().getString(LOSE_ID));
        }
        //#if PRINTDEBUG == 1
        System.out.print("ChangeActorAttr ");
        if(isAdd) {
            System.out.print("增加 ");
        } else {
            System.out.print("减少 ");
        }
        System.out.println("" + attrKind + " " + attrVal);
        //#endif
        GameContext.actor.addAttr(attrKind, isAdd ? attrVal : -attrVal);
        GameContext.page.script = this;   
//        strBuffer.append(GameContext.actor.getAttrName(attrKind)).append(attrVal);
        strBuffer.append(GameContext.actor.getAttrName(attrKind, attrVal));
        GameContext.page.dlg.showMessageBox(strBuffer.toString().toCharArray());
        data1 = attrKind;
    }

    public void changeActorAttr_remind(int evtId, int param1, Object param2)
    {
        resume();
    }
    
    public void fillScreen_execute()
    {
        boolean isFill = stream.readBoolean();
        int clr = stream.readInt();
        GameContext.page.setFillScreen(isFill, clr);
        //#if PRINTDEBUG == 1
        System.out.println("FillScreen " + isFill + " " + clr);
        //#endif 
        if(isFill)
        {
            GameContext.canvas.setThreadFast();
            return;
        }
        GameContext.canvas.setThreadSlow();
    }
    
    public void loadMusic_execute()
    {
        boolean isRepeat = stream.readBoolean();
        String musicPath = stream.readUTF();      
        
        MusicPlayer.getInstance().reload(musicPath, isRepeat);
        //#if PRINTDEBUG
        System.out.println("LoadMusic " + musicPath);
        //#endif
    }
    
    private void setSceneNpcLv()
    {
        //#if PRINTDEBUG == 1
        System.out.println("setSceneNpcLv:mapId = " + GameContext.map.id);
        //#endif
        byte[] lvData = (byte[]) GameContext.sceneNpcLvData.get("" + GameContext.map.id);
        if (lvData == null) {
            return;
        }
        int chapter = GameContext.getVar("progess");
        //#if PRINTDEBUG == 1
        System.out.println("progess = " + chapter);
        //#endif
        for (int index = 0; index < GameContext.chapterData.length; index++) {
            if (GameContext.chapterData[index] > chapter) {
                chapter = index;
                break;
            }
            if (index == GameContext.chapterData.length - 1) {
                return;
            }
        }
        //#if PRINTDEBUG == 1
        System.out.println("setSceneNpcLv:var = " + chapter);
        //#endif
        
        try
        {
            DataInputStream dataIn = new DataInputStream(new ByteArrayInputStream(lvData));
            int len = 0;
            for (int chapterIdx = 0; chapterIdx < chapter; chapterIdx++) {
                len = dataIn.readShort();
                if (len != 0) {
                    dataIn.skip(len);
                }
            }
            len = dataIn.readShort();
            if (len == 0) {
                return;
            }
            
            int sceneLv = dataIn.readShort();
            int npcCnt = dataIn.readShort();
            
            RoleManager roleMgr = RoleManager.getInstance();
            for (int index = 0; index < roleMgr.npcMap.size(); index++) {
                Npc npc = roleMgr.npcs[index];
                if (npc == null || (!npc.enemy && !npc.file.enemy)) {
                    continue;
                }
                npc.lv = sceneLv;
                npc.setDataFromLevel();
            }
            //#if PRINTDEBUG == 1
            System.out.println("设置所有npc 等级：" + sceneLv);
            //#endif
            
            if (npcCnt == 0)
            {
                dataIn.close();
                return;
            }
            
            for (int index = 0; index < npcCnt; index++) {
                String npcName = dataIn.readUTF();
                int npcLv = dataIn.readShort();
                Npc npc = (Npc) roleMgr.npcMap.get(npcName);
                if (npc != null)
                {
                    npc.lv = npcLv;
                    //#if PRINTDEBUG == 1
                    System.out.println("设置npc：" + npc.name + " 等级：" + npc.lv);
                    //#endif
                    npc.setDataFromLevel();
                }
            }
            dataIn.close();
        }
        catch(Exception e)
        {
        }
    }

    public void showGameScreen_execute()
    {
        boolean show = stream.readBoolean();
        //#if PRINTDEBUG == 1
        System.out.println("ShowGameScreen " + show);
        //#endif
        GamePage page = GameContext.page;
        if(show) {
            LoadingPage.working = false;
            if(page.loading) {
                page.endLoading();
            }            
            //显示地图的名字
            page.showMapName(); 
            setSceneNpcLv();
            //显示场景名称
            if(page.sceneName == null || page.sceneName.length == 0) {
                return;
            }
            page.script = this;
            page.dlg.showNoteBox(page.sceneName);
            suspend();
            return;
        }
        MusicPlayer.getInstance().delMusic();
        if(page.loading) {
            return;
        }
        page.memGc();
        page.startLoading();
    }

    public void showGameScreen_remind(int evtId, int param1, Object param2) {
        resume();
        //#if PRINTDEBUG == 1
        System.out.println("ShowGameScreen resume");
        //#endif
    }

    public void changeActorItems_execute()
    {
        suspend();
        boolData = stream.readBoolean();
        short itemID = stream.readShort();
        int itemCnt = stream.read();
        int itemLv = stream.read();
        //物品等级貌似没用
        //#if PRINTDEBUG == 1
        System.out.println("ChangeActorItems " + boolData + " " + itemID + " " + itemCnt);
        //#endif
        //TODO 失去的话直接删除
        if(!boolData)
        {
            GameContext.actor.removeItem((short)itemID, itemCnt);
            resume();
            return;
        }
        GameContext.actor.addItem((short)itemID, itemCnt);
        GameContext.page.dlg.showItemBox(boolData, GameContext.getItem(itemID), itemLv, itemCnt);
        GameContext.page.script = this;
//        
//        //缓存数据
//        data1 = (itemID << 16) | (itemCnt & 0xffff);
//        data2 = itemLv;
//        data3 = 0;
    }

    public void changeActorItems_remind(int evtId, int param1, Object param2)
    {
        resume();
    }
    
    public void branchEvent_execute()
    {
        suspend();
        String name = stream.readUTF();
        name = changeStringKeyFromHash(name);
        strData = stream.readUTF();
        GameContext.setVar(strData, 0);
        //#if PRINTDEBUG == 1
        System.out.print("BranchEvent " + strData);
        //#endif
        StringBuffer buf = new StringBuffer();
        int itemCnt = stream.read();
        int[] parts = new int[itemCnt];
        String[] txt = new String[itemCnt];
        
        for (int index = 0; index < itemCnt; index++)
        {
            String part = stream.readUTF();
            buf.append(part);
            parts[index] = part.length();
            txt[index] = part;
            //#if PRINTDEBUG == 1
            System.out.print(" " + part + " ");
            //#endif
        }

        if (itemCnt == 2 && txt[0].equals("是") && txt[1].equals("否")) {
            GameContext.page.script = this;
            GameContext.page.dlg.showButtonBox(name.toCharArray());
            return;
        }
        
        GameContext.page.script = this;
        GameContext.page.dlg.showBranchBox(buf.toString().toCharArray(), name.toCharArray(), parts);
    }

    public void branchEvent_remind(int evtId, int param1, Object param2)
    {
        //#if PRINTDEBUG == 1
        System.out.println("BranchEvent resume");
        //#endif
        GameContext.setVar(strData, evtId);
        resume();
    }
    
    private void loadScene_execute()
    {
        suspend();
        LoadingPage.isRepaint = true;
        GameContext.page.isLightAction = false;
        //测试代码
//        GameContext.setVar("lastScene", 2); 
        String scriptFile = stream.readUTF();
        String sceneName = stream.readUTF();
        //#if PRINTDEBUG == 1
        System.out.println("LoadScene " + scriptFile + " " + sceneName);
        //#endif        
        if(sceneName != null && sceneName.length() > 0) {
            GameContext.page.sceneName = sceneName.toCharArray();
        } else {
            GameContext.page.sceneName = null;
        }
        
        //初始场景
        child = new ScriptEngine(scriptFile);
    }     
    
    private void loadScene_remind(int evtId, int param1, Object param2)
    {
        //#if PRINTDEBUG == 1
        System.out.println("LoadScene resume");
        //#endif
        LoadingPage.isRepaint = false;
        child = null;
        resume();
    }
    
    private boolean isStopScriptPlayAnimation;
    public void playAnimation_execute()
    {
        //是否中断脚本进程
        isStopScriptPlayAnimation = stream.readBoolean();
        data2 = stream.readShort();
        if(isStopScriptPlayAnimation && !GameContext.page.loading)
        {
            data1 = 0;
            suspend();
        }
        //#if PRINTDEBUG == 1
        System.out.print("PlayAnimation " + isStopScriptPlayAnimation + " " + data2);
        //#endif
        String roleName = null;
        short grpId = 0;
        short actId = 0;
        RoleManager roleMgr = RoleManager.getInstance();
        AnimationManager aniMgr = AnimationManager.getInstance();
        
        for (int index = 0; index < data2; index++)
        {
            roleName = stream.readUTF();
            grpId = stream.readShort();
            actId = stream.readShort();
            boolean isRepeat = stream.readBoolean();
            boolean isResume = stream.readBoolean();
            //#if PRINTDEBUG == 1
            System.out.print(" " + roleName + " " + grpId + " " + actId);
            //#endif
            Role role = roleMgr.getNpc(roleName);
            if (role == null)
            {
                role = roleMgr.getChestBox(roleName);
            }
            if(role == null)
            {
                role = GameContext.actor;
            }
            if (role.bufferAni == null)
            {
                role.bufferAni = role.ani;
                role.bufferActId = role.actId;
            }
            role.isKeepLastFrame = false;
            role.isResumeAct = false;
            role.imgReady = false;
            role.isRemoveFinishPlay = false;
            aniMgr.getAnimation(grpId, role);
            role.actId = actId;            
            role.isPlayAnimaitionStopScript = isStopScriptPlayAnimation;
            role.initFrame();
            role.observer = this;
            if(!isRepeat && !isResume)
            {
                role.isKeepLastFrame = true;
                role.isResumeAct = false;
            }
            else if(!isRepeat && isResume)
            {
                role.isKeepLastFrame = false;
                role.isResumeAct = true;                
            }
            else if(isRepeat && !isResume)
            {
                role.isKeepLastFrame = false;
                role.isResumeAct = false;                                
            }
            else if(isRepeat && isResume)
            {
                role.isRemoveFinishPlay = true;
            }
        }
        
        //#if PRINTDEBUG == 1
        System.out.println();
        //#endif
    }

    public void playAnimation_remind(int evtId, int param1, Object param2)
    {
        Role role = ((Role)param2);
        if(param2 == null)
        {
            return;
        }
        if(role.isPlayAnimaitionStopScript)
        {
            data1++;
        }
        //#if PRINTDEBUG == 1
        System.out.println("data1="+data1+";谁完了="+role.name);
        //#endif
        role.observer = null;
        boolean isStop = role.isPlayAnimaitionStopScript;
        //如果播放完毕这个动画就删除npc的话
        if(role.isRemoveFinishPlay)
        {
            Npc npc = RoleManager.getInstance().getNpc(role.name);
            if(npc != null)
            {
                RoleManager.getInstance().removeNpc(npc);
                npc.removePaintMatrix();
                npc.releaseImages();
            }
            else
            {
                ChestBox box = RoleManager.getInstance().getChestBox(role.name);
                RoleManager.getInstance().removeChestBox(box);
                box.releaseImages();
                GameContext.groundMat.removeUnit(box);        
            }
        }
        if(data1 >= data2 && isStopScriptPlayAnimation)
        {
            resume();
            data1 = 0;
            //#if PRINTDEBUG == 1
            System.out.println("PlayAnimation End; "+role.name);
            //#endif
        }
    }

    public void setEvent_execute()
    {
        String scriptFile = stream.readUTF();
        //#if PRINTDEBUG == 1
        System.out.print("SetEvent " + scriptFile + " ");
        //#endif
        
        ScriptEngine engine = new ScriptEngine(scriptFile);
        int num = stream.readByte();
        for(int index = 0; index < num; index++)
        {
            short x = stream.readShort();
            short y = stream.readShort();
            GameContext.map.addEventScript(engine, x >> 4, y >> 4);         
            //#if PRINTDEBUG == 1
            System.out.print(x + " " + y + " ");
            //#endif
        } 
        
        //#if PRINTDEBUG == 1
        System.out.println();
        //#endif
    }

    private void setNpcAi_execute()
    {
        String npcName = stream.readUTF();
        int aiKind = stream.read();
        String scriptFile = stream.readUTF();

        //#if N7370small
//#         if (scriptFile.equals("flygame")) {
//#             return;
//#         }
        //#endif
        
        //#if PRINTDEBUG == 1
        System.out.println("SetNpcAi " + npcName + " " + aiKind + " " + scriptFile);
        //#endif

        RoleManager roleMgr = RoleManager.getInstance();
        ScriptEngine allScript = new ScriptEngine(scriptFile);
        if (npcName.startsWith("所有")) {
            String[] otherNpcName = null;
            int otherNpcNameCnt = 0;
            if(!npcName.equals("所有NPC") && !npcName.equals("所有npc"))
            {
                otherNpcName = Util.getString(npcName.substring(6), '^');
                otherNpcNameCnt = otherNpcName.length;
            }
            boolean isCanSet = true;
            for (int index = 0; index < roleMgr.npcMap.size(); index++) {
                Npc npc = roleMgr.npcs[index];
                if (npc == null) {
                    continue;
                }
                isCanSet = true;
                for(int nameIndex = 0; nameIndex < otherNpcNameCnt; nameIndex++)
                {
                    if(npc.name.indexOf(otherNpcName[nameIndex]) != -1)
                    {
                        isCanSet = false;
                        break;
                    }
                }
                if(!isCanSet)
                {
                    continue;
                }
                //如果这个npc的ai和想要赋予它的ai相同就不赋予
                if(npc.getAi(aiKind) != null && npc.getAi(aiKind).fileName.equals(allScript.fileName))
                {
                    continue;
                }
                npc.setAi(allScript.clone(), aiKind);
            }
            return;
        }

        Npc npc = roleMgr.getNpc(npcName);
        ScriptEngine script = new ScriptEngine(scriptFile);
        if(npc == null && npcName.equals(GameContext.actor.name))
        {
            GameContext.actor.dieScript = script;
            return;
        }
        npc.setAi(script, aiKind);
    }

    final private void setNpcLevel_execute() {
        String npcName = stream.readUTF();
        boolean isBaseOnProgess = stream.readBoolean();
        int npcLv = stream.readByte();

        if (isBaseOnProgess) {
            //根据游戏进程设置所有敌方npc等级
            setSceneNpcLv();
            return;
        }

        RoleManager roleMgr = RoleManager.getInstance();

        final String ALL_NAME = "所有NPC";
        if (npcName.equals(ALL_NAME)) {
            for (int index = 0, count = roleMgr.npcMap.size(); index < count; index++) {
                Npc n = roleMgr.npcs[index];
                if (n == null || (!n.enemy && !n.file.enemy)) {
                    continue;
                }
                n.lv = npcLv;
                n.setDataFromLevel();
            }
            return;
        }

        //单独设置某一npc等级
        Npc npc = roleMgr.getNpc(npcName);
        if (npc != null && npc.file.enemy) {
            npc.lv = npcLv;
            npc.setDataFromLevel();
        }
    }
    
    final private void setNpcPass_execute() {
        String npcName = stream.readUTF();
        boolean pass = stream.readBoolean();
        short itemId = stream.readShort();
        String passScript = stream.readUTF();
        
        //#if PRINTDEBUG == 1
        System.out.println("SetNpcPass " + npcName + " " + pass);
        //#endif
        RoleManager roleMgr = RoleManager.getInstance();
        Npc npc = roleMgr.getNpc(npcName);
        if(npc == null) {
            return;
        }
        ScriptEngine ps = null;
        if(passScript != null && passScript.length() != 0)
        {
            ps = new ScriptEngine(passScript);
        }
        npc.canPass = pass;
    }
    
    final private void setRoleAsFriend_execute() {
        String roleName = stream.readUTF();
        boolean isEnemy = stream.readBoolean();
        
        //#if PRINTDEBUG == 1
        System.out.println("SetRoleAsFriend " + roleName + " " + isEnemy);
        //#endif
        
        RoleManager roleMgr = RoleManager.getInstance();
        Npc npc = roleMgr.getNpc(roleName);
        npc.enemy = isEnemy;
        //npc被变成敌人之后先默认站立
        if(npc.enemy)
        {
            npc.haveMoveTask = false;
            npc.haveMoveLine = false;
            npc.status = Role.STAND_STATUS;
            npc.changeAction();
        }
    }

    private void adjustCamera(int x, int y, boolean isStart, int speed) {
        if(isStart) {
            //立即跳转到那里
            GameContext.page.resetMoveCameraPosition(x, y);
            GameContext.page.jumpToCameraPosition();
            resume();
            return;
        }
        
        GameContext.page.startMoveCamera(this, x, y, speed);
    }
    
    public void moveCamera_execute() {
        int x = stream.readShort();
        int y = stream.readShort();
        int speed = stream.readByte();
        boolean isStart = stream.readBoolean();
        boolean isSuspend = stream.readBoolean();
        //#if PRINTDEBUG == 1
        System.out.println("MoveCamera " + x + ", " + y);
        //#endif
        if (isSuspend) {
            suspend();
        }
        adjustCamera(x, y, isStart, speed);
    }
    
    public void moveCamera_remind(int evt, int param1, Object param2) {
        resume();
        
        //#if PRINTDEBUG == 1
        System.out.println("MoveCamera resume");
        //#endif
    }
    
    public void addVar_execute() {
        String varName = stream.readUTF();
        int val = stream.readInt();
        GameContext.addVar(varName, val);
        
        //#if PRINTDEBUG == 1
        System.out.println("AddVar " + varName + " " + val);
        System.out.println("" + varName + "================>" + GameContext.getVar(varName));
        //#endif
    }
    
    public void setVar_execute() {
        String varName = stream.readUTF();
        int val = stream.readInt();        
        GameContext.setVar(varName, val);
        //#if PRINTDEBUG == 1
        System.out.println("SetVar " + varName + " " + val);
        //#endif
    }
    
    public void loadMap_execute() {
        String mapFile = stream.readUTF();
        
        //#if PRINTDEBUG == 1
        System.out.println("LoadMap " + mapFile);
        //#endif
        
        //TODO 载入地图
        GameContext.map = new Map(mapFile);
        GameContext.page.refreshMapName();
    }

    public void setSceneMode_execute() {
        boolean sceneMode = stream.readBoolean();
        
        //场景模式
        //#if PRINTDEBUG == 1
        System.out.println("SetSceneMode " + sceneMode);
        //#endif
        
        //设置场景模式
        GameContext.page.sceneMode = sceneMode;
    }

    public void setObserverMode_execute() {          
        boolean mode = stream.readBoolean();
        //观察者模式
        //#if PRINTDEBUG == 1
        System.out.println("SetObserverMode " + mode);
        //#endif
        if(!mode)
        {
            GameContext.page.openBoxStatus = false;
//            GameContext.page.checkingTalkNpc = false;
        }
        GameContext.page.observerMode = mode;
        GameContext.page.keypadDraw = !mode;
        GameContext.page.isDrawGameBtns = !mode;
        if(!mode)
        {
            GameContext.actor.isStopKey = false;
            GameContext.actor.isRunSkillAttack = false;
        }
    }

    public void say_execute() {
        suspend();
        GamePage page = GameContext.page;
        page.nameChs = stream.readUTF().toCharArray();
        String str = stream.readUTF();
        str = changeStringKeyFromHash(str);
        page.talkChs = str.toCharArray();     
        page.talkFaceAniId = stream.readShort();
        page.talkExpressionId  = stream.readByte();
        page.isTalkFaceLeft = stream.readBoolean();
        page.initTalk();
        page.script = this;
        //清除用户遗留的按键
        page.keyMgr.resetKey();
        //#if PRINTDEBUG == 1
//        System.out.println("Say " + new String(page.nameChs)));
        //#endif
    }
    
    public void say_remind(int evt, int param1, Object param2) {
        //#if PRINTDEBUG == 1
        System.out.println("Say resume");
        //#endif
        resume();
    }

    public void moveRole_execute() {
        suspend();
        int roleCnt = stream.readShort();
        
        RoleManager roleMgr = RoleManager.getInstance();
        //#if PRINTDEBUG == 1
        System.out.print("MoveRole ");
        //#endif
        
        for (int index = 0; index < roleCnt; index++)
        {
            String roleName = stream.readUTF();
            int posCount = stream.readByte() & 0xff;
            int[] x = new int[posCount];
            int[] y = new int[posCount];
            for(int idx = 0; idx < posCount; idx++)
            {
                x[idx] = stream.readShort() & 0xffff;
                y[idx] = stream.readShort() & 0xffff;                
            }
            //#if PRINTDEBUG == 1
             System.out.print(roleName + " " + x + " " + y + " ");
             //#endif
            
            Npc npc = roleMgr.getNpc(roleName);
            if(npc != null) {
                npc.startMoveTask(this, x, y);
                continue;
            }
            
            GameContext.actor.startMoveTask(this, x, y);
        }
        
        //#if PRINTDEBUG == 1
        System.out.println();
        //#endif
        
        data1 = roleCnt;
        data2 = 0;
        //终止脚本引擎
    }
    
    public void moveRole_remind(int evt, int param1, Object param2) {
        data2++;
        //#if PRINTDEBUG == 1
        System.out.println("MoveRole resume " + data1 + " " + data2);
        //#endif 
        
        if(data2 >= data1) {
            resume();
        }
    }
    
    public void setRoleVisible_execute() {
        String roleName = stream.readUTF();
        boolean visible = stream.readBoolean();        
        
        //#if PRINTDEBUG == 1
        System.out.println("SetRoleVisible " + roleName + " " + visible);
        //#endif
        RoleManager roleMgr = RoleManager.getInstance();
        Npc npc = roleMgr.getNpc(roleName);
        if(npc != null) {
            if(!visible) {
                npc.removePaintMatrix();
                npc.visible = false;
                //#if N7370 || N7370small
//#                 if(npc.enemy)
//#                 {
//#                     return;
//#                 }
//#                 AnimationItem item = (AnimationItem) AnimationManager.getInstance().grpMap.get(npc.ani.id);
//#                 if (item == null)
//#                 {
//#                     return;
//#                 }
//#                 npc.img = null;
//#                 ImageManager.getInstance().removeImage(item.imageId);
            //#endif
            } else {
                if(!npc.visible) {
                    //#if N7370 || N7370small
//#                     AnimationItem item = (AnimationItem) AnimationManager.getInstance().grpMap.get(npc.ani.id);
//#                     if (item == null)
//#                     {
//#                         return;
//#                     }
//#                     npc.img = ImageManager.getInstance().getImage(item.imageId);
                    //#endif                    
                    npc.visible = true;
		    roleMgr.setBoss(npc);
                    npc.changeAction();
                    if(npc.file.isFly)
                    {
                        GameContext.flyMat.addUnit(npc);
                        return;
                    }
                    if(npc.file.isUnderGround)
                    {
                        GameContext.undergroundMat.addUnit(npc);
                        return;
                    }
                    GameContext.groundMat.addUnit(npc);
                }
            }
            return;
        }
        
        ChestBox box = roleMgr.getChestBox(roleName);
        if(box != null)
        {
            if(!visible) {
                box.visible = false;
                GameContext.groundMat.removeUnit(box);
            } else {
                box.visible = true;
                GameContext.groundMat.addUnit(box);
            }
            return;
        }
        
        if(roleName.equals(GameContext.actor.name)) {
            if(!visible) {
                GameContext.groundMat.removeUnit(GameContext.actor);
                GameContext.actor.visible = false;
            } else {
                if(!GameContext.actor.visible) {
                    GameContext.actor.visible = true;
                    GameContext.groundMat.addUnit(GameContext.actor);
                }
            }
            return;
        }
    }
    
    public void removeRole_execute() {
        String roleName = stream.readUTF();
        
        //#if PRINTDEBUG == 1
        System.out.println("RemoveRole " + roleName);
        //#endif
        RoleManager roleMgr = RoleManager.getInstance();
        Npc npc = roleMgr.getNpc(roleName);
        if(npc != null) {
            npc.removePaintMatrix();
            npc.visible = false;
            roleMgr.removeNpc(npc);
            npc.releaseImages();
            return;
        }
        
        ChestBox box = roleMgr.getChestBox(roleName);
        if(box != null)
        {
            box.visible = false;
            roleMgr.removeChestBox(box);
            GameContext.groundMat.removeUnit(box);
            box.releaseImages();
            return;
        }
        
        if(roleName.equals(GameContext.actor.name)) {
            GameContext.groundMat.removeUnit(GameContext.actor);
            GameContext.actor.visible = false;
            return;
        }        

        //如果都没有删除投掷物
        roleMgr.delAllArrow();
    }    

    /**
     * 创建主角
     */
    public void createActor_execute() {
        String actorName = stream.readUTF();
        //#if PRINTDEBUG == 1
        System.out.println("CreateActor " + actorName);
        //#endif
        //已经创建了，不需要创建第二次
        if(GameContext.actor != null) {
            //#if PRINTDEBUG
            System.out.println("CreateActor ERROR:Actor has existed!");
            //#endif
            return;
        }
        
        Actor actor = new Actor();
        actor.name = actorName;
        GameContext.actor = actor;
        actor.load("role1.dat");
        actor.initAllData();
        //缺省设置为向下
        actor.dir = PaintUnit.DOWN;
        actor.changeAction();
        actor.loseHp = actor.hp = actor.maxHp;
        actor.mp = actor.maxMp;
    }

    public void createNpc_execute() {
        String npcFileName = stream.readUTF();
        
        String npcName = stream.readUTF();
        int npcLv = stream.readByte();
        
        //#if N7370 || N7370small
//#         if(fileName.equals("C008"))
//#         {
//#             if(npcFileName.equals("role9.dat"))
//#             {
//#                 npcFileName = "role10.dat";
//#             }
//#         }
        //#endif
        
        RoleManager roleMgr = RoleManager.getInstance();
        //保证最后内存足够
        NpcFile file = roleMgr.getNpcFile(npcFileName);
        //#if PRINTDEBUG == 1
        System.out.println("CreateNpc " + npcFileName + " " + npcName + " " + npcLv+" fly="+file.isFly);
        //#endif
        if(roleMgr.npcMap.containsKey(npcName))
        {
            //#if PRINTDEBUG == 1
            throw new RuntimeException("哥们，为啥反复创建这个npc呀,名字是："+npcName);
            //#else
//#             return;
            //#endif
        }
        Npc npc = new Npc();
        npc.setFile(file);
        npc.name = npcName;
        npc.lv = npcLv;
        npc.setHp(1);
        npc.enemy = file.enemy;
        npc.status = Role.STAND_STATUS;
        npc.changeAction();
        npc.setDataFromLevel();
        roleMgr.addNpc(npc);
    }

    public void setRoleDir_execute() {
        String roleName = stream.readUTF();
        int dir = stream.read() & 0xFF;
        //#if PRINTDEBUG == 1
        System.out.println("SetRoleDir " + roleName + " " + dir);
        //#endif
        
        RoleManager roleMgr = RoleManager.getInstance();
        Npc npc = roleMgr.getNpc(roleName);
        if(npc != null) {
            npc.dir = dir;
            npc.changeAction();
            return;
        }
        
        if(roleName.equals(GameContext.actor.name)) {
            GameContext.actor.dir = dir;
            GameContext.actor.changeAction();
            return;
        }
        ChestBox box = roleMgr.getChestBox(roleName);
        if(box != null) {
            box.dir = dir;
            box.resetAction();
            return;
        }
        //#if PRINTDEBUG == 1
        System.out.println("SetRoleDir ERROR: 没找到这个人:" + roleName);
        //#endif
    }

    public void setRolePosition_execute() {
        String roleName = stream.readUTF();
        short x = stream.readShort();
        int y = stream.readShort();
        boolean isDie = stream.readBoolean();        
        
        //#if PRINTDEBUG == 1
        System.out.println("SetRolePosition " + roleName + " " + x + " " + y + " " + isDie);
        //#endif
        
        RoleManager roleMgr = RoleManager.getInstance();
        Npc npc = roleMgr.getNpc(roleName);
        if(npc != null) {
            npc.setPosition(x, y);
            npc.setOriginalPos(x, y);
            if(npc.isFlash()) {
                npc.setFlash(isDie);
                //#if PRINTDEBUG == 1
                System.out.println("npc;"+npc.name+";是否刷新="+npc.isFlash());
                //#endif
            }
            //TODO 处理死亡的情况
            return;
        }
        
        if(roleName.equals(GameContext.actor.name)) {
            GameContext.actor.setPosition(x, y);
            GameContext.page.updateCameraByActor();
            GameContext.page.updateCameraByActorPos();
            return;
        }
        
        ChestBox box = roleMgr.getChestBox(roleName);
        if(box != null) {
            box.setPosition(x, y);
            return;
        }
        //#if PRINTDEBUG == 1
        System.out.println("SetRolePosition ERROR: 没找到这个Role:" + roleName);
        //#endif
    }
    
    private void runSmsCommand_execute()
    {
        suspend();
        final short SMS_STR_ID = 113;
        int smsIndex = stream.readByte();
        String str = new String(StringManager.getInstance().getString(SMS_STR_ID));
        //#if SMS == 0
//#         GameContext.setVar(str, 1);
//#         resume();
//#         return;
        //#elif SMS  == 2
//#         GameContext.sms.observer = this;
//#         final int STORY_ID_SMS = 0;
//#         if (smsIndex != STORY_ID_SMS)
//#         {
//#             GameContext.setVar(str, 1);
//#             resume();
//#             return;
//#         }
//#         else if(Sms.allStory)
//#         {
//#             GameContext.setVar(str, 1);
//#             resume();
//#             return;
//#         }
//#         GameContext.setVar(str, 0);
//#         StringBuffer buf = new StringBuffer();
//#         if(smsIndex == STORY_ID_SMS)
//#         {
//#             buf.append("开启全部后续剧情，享受游戏乐趣！并赠送{20000金，3个长生丹，3个天香露，3个神仙茶}。");
//#             buf.append("&是否立即开启全部后续剧情？");
//#         }
//#         GameContext.page.dlg.btnBoxOp = Dialog.SMS_COMMAND;
//#         GameContext.page.dlg.showButtonBox(buf.toString().toCharArray());
//#         GameContext.sms.requestId = smsIndex;
        //#else
        //如果购买剧情了不提示
        GameContext.sms.observer = this;
        final int STORY_ID_SMS = 0;
        if(smsIndex == STORY_ID_SMS && Sms.allStory)
        {
            GameContext.setVar(str, 1);
            resume();
            return;
        }
        final int KEY_ID_SMS = 5;
        if(smsIndex == KEY_ID_SMS && Sms.needNotKey)
        {
            GameContext.setVar(str, 1);
            resume();
            return;
        }
        GameContext.setVar(str, 0);
        StringBuffer buf = new StringBuffer();
        if(smsIndex == STORY_ID_SMS)
        {
            GameContext.sms.requestId = smsIndex;
            GameContext.sms.doChargeRequest(GameContext.sms.requestId);
            return;
        }
        else if(smsIndex == KEY_ID_SMS)
        {
            buf.append("玄天御宝诀：开启上锁宝箱{不需要钥匙}。");
            buf.append("&是否立即开启玄天御宝诀？");
        }
        GameContext.page.dlg.btnBoxOp = Dialog.SMS_COMMAND;
        GameContext.page.dlg.showButtonBox(buf.toString().toCharArray());
        GameContext.sms.requestId = smsIndex;
        //#if PRINTDEBUG == 1
        System.out.println("RunSmsCommand " + smsIndex);
        //#endif
        //#endif
    }
    
    private void runSmsCommand_remind(int evt, int param1, int param2)
    {  
        //#if SMS == 1 || SMS == 2
        GameContext.sms.observer = null;
        //#endif
        resume();
        //#if PRINTDEBUG == 1
        System.out.println("RunSmsCommand resume");
        //#endif
    }
    
    private static int chestBoxCount;
    /**
     * 创建宝箱，坐标数据可能是两个系统变量
     * @throws java.io.IOException
     */
    private void createChest_execute() 
    {
        chestBoxCount++;
        String roleFile = stream.readUTF();
        String bx = stream.readUTF();
        String by = stream.readUTF();
        
        String openStr = stream.readUTF();
        String dieStr = stream.readUTF();
        String npcName = stream.readUTF();
        //#if PRINTDEBUG == 1
        System.out.println("CreateChest " + roleFile + " " + bx + " " + by + " " + openStr + " " + dieStr + " " + npcName);
        //#endif 
        if(npcName.length() == 0)
        {
            npcName = new StringBuffer("宝箱名称").append(chestBoxCount).toString();
        }
        StringBuffer buf = new StringBuffer();
        buf.append(npcName).append(GameContext.page.mapName);
        //完全交给脚本判断
//        if(GameContext.getVar(buf.toString()) != 0)
//        {
//            return;
//        }
        RoleManager roleMgr = RoleManager.getInstance();
        ChestBoxFile file = roleMgr.getChestBoxFile(roleFile);
        int x = 0;
        int y = 0;
        //就判断第一个char是否是数字
        if(Character.isDigit(bx.charAt(0)))
        {
            x = Integer.parseInt(bx);
        }
        else
        {
            x = GameContext.getVar(bx);
        }
        if(Character.isDigit(by.charAt(0)))
        {
            y = Integer.parseInt(by);
        }   
        else
        {
            y = GameContext.getVar(by);
        }
        ChestBox box = new ChestBox(npcName, x, y);
        box.file = file;  
        AnimationManager aniMgr = AnimationManager.getInstance();
        aniMgr.getAnimation(file.aniId, box);
        ScriptEngine openEngine = null;
        ScriptEngine dieEngine = null;
        if(openStr.length() > 0 && !openStr.equals("null"))
        {
            openEngine = new ScriptEngine(openStr);
        }
        if(dieStr.length() > 0 && !dieStr.equals("null"))
        {
            dieEngine = new ScriptEngine(dieStr);
        }        
        box.setChestBoxAi(openEngine, dieEngine);
        box.resetAction();
        box.initFrame();
        GameContext.groundMat.addUnit(box);
        roleMgr.addChestBox(box);
    }

    private void changeActorAttack_execute()
    {
        int kind = stream.readByte() & 0xff;
        GameContext.actor.changeActGroup(kind);
    }

    private void setMapEvent_execute()
    {
        boolean isOpen = stream.readBoolean();
        if(isOpen)
        {
            GameContext.map.openMapEvent();
            return;
        }
        GameContext.map.closeMapEvent();
    }

    private void setLimitTimeEvent_execute()
    {
        boolean isOpen = stream.readBoolean();
        int time = stream.readInt();
        String scriptName = stream.readUTF();
        GameContext.page.setLimitTimeEvent(scriptName, time, isOpen);
    }

    private void createString_execute()
    {
        String name = stream.readUTF();
        String value = stream.readUTF();
        strBufferAll.put(name, value);
    }

    private void appendString_execute()
    {
        String name = stream.readUTF();
        String value = stream.readUTF();
        value= changeStringKey(value);
        value = (String)strBufferAll.get(name) + value;
        strBufferAll.put(name, value);
    }

    private void gameTip_execute()
    {
	String gameTipStr = stream.readUTF();
        int buttomY = stream.readShort();
//	GameContext.page.pagesetGameTip(gameTipStr, buttomY);
    }

    private void enterPage_rimend()
    {
	
    }

    /**
     * 进入特殊界面
     */
    private void enterPage_execute()
    {
        final int CLOSE_MENU = -1;
	int pageIndex = stream.readInt();
        data1 = stream.readInt();
        data2 = stream.readInt();
        String dataStr = stream.readUTF();
        if (pageIndex == CLOSE_MENU) {
            GameContext.page.showMenu = false;
            return;
        }
    }

    private void label_execute()
    {
        //保存标签的行数
        String labelName = stream.readUTF();
//        labelHash.put(labelName, new Integer(pc));
    }

    private void goto_execute()
    {
        String labelName = stream.readUTF();
        labelName = changeStringKey(labelName);
        int curPc = ((Integer)labelHash.get(labelName)).intValue();
        stream.init();
        isSuspend = false;
        pc = 0;
        initLabel();
        //过滤掉主长度
        stream.skip(2);

        
        while(pc <= curPc) {
            int cmdLen = stream.readShort();
            System.out.println("跳过的类型="+stream.readByte());
            stream.skip(cmdLen - 1);
            pc++;
        }
        pc --;
    }


    /**
     * 选择性对话
     */
    private void selectTalk_execute()
    {
        suspend();
        GameContext.setVar(TALK_INDEX, 0);
        GamePage page = GameContext.page;
        page.nameChs = stream.readUTF().toCharArray();
        page.talkFaceAniId = stream.readShort();
        int cnt = stream.readByte();
        char[][] selectTalk = new char[cnt][];
        for(int index = 0; index < cnt; index++)
        {
            selectTalk[index] = stream.readUTF().toCharArray();
        }
        page.initSelectTalk(selectTalk);
        page.script = this;
        //清除用户遗留的按键
        page.keyMgr.resetKey();

    }

    private void selectTalk_remind(int evt, int param1, Object param2)
    {
        GameContext.setVar(TALK_INDEX, param1);
        resume();
    }

    /**
     * 移动动画
     */
    private void moveCartoon_execute()
    {
        suspend();
        int cnt = stream.readShort();
        String[] str = new String[cnt];
        int[] posX = new int[cnt];
        int[] posY = new int[cnt];
        for (int index = 0; index < cnt; index++)
        {
            str[index] = stream.readUTF();
            posX[index] = stream.readShort();
            posY[index] = stream.readShort();
        }
        int time = stream.readShort();
        GameContext.page.moveCartoon(cnt, str, posX, posY, time);
    }

    private void moveCartoon_remind(int evt, int param1, Object param2)
    {
        resume();
    }

    /**
     * 回调通知
     * @param type 想要通知的脚本类型
     * @param evtId
     * @param param1
     * @param param2
     * @return true 通知了 false没有通知
     */
    public boolean remind(int type, int evtId, int param1, Object param2)
    {
        if(this.type != type)
        {
            //不是当前脚本的通知
            return false;
        }
        remind(evtId, param1, param2);
        return true;
    }

    /***任务相关脚本********************/
    public void giveMissionToActor_execute()
    {
        short missionId = stream.readShort();
        MissionManager missionMgr = MissionManager.getInstance();
        Mission m = missionMgr.getMission(missionId);
        if (m == null) {
            //#if PRINTDEBUG == 1
             throw new RuntimeException("没有这个任务:" + missionId);
            //#else
//#             return;
            //#endif
        }
        m.giveMissionToActor();
        //#if PRINTDEBUG == 1
        System.out.println("给玩家任务：" + missionId);
        //#endif
    }

    /**
     * 设置任务的状态
     */
    private void setMissionState_execute()
    {
        short missionId = stream.readShort();
        int missionState = stream.readShort();
        MissionManager missionMgr = MissionManager.getInstance();
        Mission m = missionMgr.getMission(missionId);
        if (m == null) {
            //#if PRINTDEBUG == 1
             throw new RuntimeException("没有这个任务:" + missionId);
            //#else
//#             return;
            //#endif
        }
        m.setMissionState(missionState);
    }

    /**
     * 设置任务可见/不可见
     */
    private void setMissionVisible_execute()
    {
        int missionId = stream.readInt();
        boolean visible = stream.readBoolean();
        MissionManager missionMgr = MissionManager.getInstance();
        Mission m = missionMgr.getMission((short)missionId);
        if (m == null) {
            //#if PRINTDEBUG == 1
             throw new RuntimeException("没有这个任务:" + missionId);
            //#else
//#             return;
            //#endif
        }
        m.visible = visible;
    }

    /**
     * 刷新任务变量
     */
    private void updataMissionVar_execute()
    {
        String missionVar = stream.readUTF();
        int value = stream.readShort();
        int finishValue = stream.readShort();

        GameContext.addVar(missionVar, value);
        int curValue = GameContext.getVar(missionVar);
        StringBuffer buf = new StringBuffer(missionVar);
        if (finishValue <= 1 || curValue >= finishValue) {
            buf.append("（完成）");
        }
        else {
            buf.append("（").append(curValue).append("/").append(finishValue).append("）");
        }
        MusicPlayer.getInstance().playSound(SoundConst.MISSION);
        GameContext.page.showFlashNote(buf.toString().toCharArray());
        //#if PRINTDEBUG == 1
        System.out.println("AddVar " + missionVar + " " + value + "，当前值为：" + curValue);
        System.out.println("左下角提示框信息：" + buf.toString());
        //#endif
    }

    /*******教学***********************/
    private void teachNative_execute() {
        data1 = stream.readShort();
        data2 = stream.readShort();
        String dataStr = stream.readUTF();
        //开始教学
        if (data1 == 3) {
            if (data2 == 0) {
                GameContext.page.teachOverArtifice = true;
            } else if (data2 == 1) {
                GameContext.page.teachOverEnchant = true;
            } else if (data2 == 2) {
                GameContext.page.teachOverFormula = true;
            }
            return;
        }
        //关闭解释框
        if (data1 == 2) {
            GameContext.page.showDec = false;
            return;
        }
        //炼化教学
        if (data1 == 1) {
            GameContext.page.isArtificeTeach = dataStr.equals("ON");
            GameContext.page.artificeTeachIndex = data2;
            return;
        }
        //配方教学
        if (data1 == 0) {
            //找到相应的配方位置
            if (data2 == 0) {
                int itemId = Integer.parseInt(dataStr);
                for (int index = GameContext.page.curArmorItems.length - 1; index >= 0; index--) {
                    if (GameContext.page.curArmorItems[index].getId() == itemId) {
                        GameContext.page.armorCurRow = index / GameContext.page.ARMOR_COLS;
                        GameContext.page.armorCurCol = index % GameContext.page.ARMOR_COLS;
                        GameContext.page.armorStartRow = GameContext.page.armorCurRow - (GameContext.page.ARMOR_ROWS - 1);
                        if (GameContext.page.armorStartRow < 0) {
                            GameContext.page.armorStartRow = 0;
                        }
                        break;
                    }
                }
                return;
            }
            int screen_w = Page.SCREEN_WIDTH;
            int screen_h = Page.SCREEN_HEIGHT;
            int startx = ((screen_w - 366) >> 1) + 45;
            int starty = ((screen_h - 244) >> 1) + 45;
            int interval = 60;
            int itemX = startx + GameContext.page.armorCurCol * interval;
            int itemY = starty + (GameContext.page.armorCurRow - GameContext.page.armorStartRow) * interval;
            //指示箭头
            final int GRP_ID = 133;
            if (data2 == 1) {
                setTeachTipArrow(true, itemX - 15 + (interval >> 1), itemY + (interval >> 1), GRP_ID, 0);
            }
            //等待按键
            else if (data2 == 2) {
                suspend();
                GameContext.page.script = this;
                GameContext.page.setTeachKey(-1, itemX, itemY, 35, 35, null);
            }
            //指示箭头，指示炼制按钮
            else if(data2 == 3) {
                int arrowX = itemX + (interval >> 1);
                if (GameContext.page.armorCurCol <= GameContext.page.ARMOR_COLS >> 1) {
                    arrowX -= 40;
                }
                else {
                    arrowX += 40;
                }
                setTeachTipArrow(true, arrowX - 5, itemY - 10 + (interval >> 1), GRP_ID, 0);
            }
            //等待按键
            else if (data2 == 4) {
                int arrowX = itemX;
                if (GameContext.page.armorCurCol <= GameContext.page.ARMOR_COLS >> 1) {
                    arrowX -= 40;
                }
                else {
                    arrowX += 40;
                }
                suspend();
                GameContext.page.script = this;
                 GameContext.page.setTeachKey(-1, arrowX - 3, itemY, 30, 30, null);
            }
            //更新材料
            else if (data2 == 5) {
                GameContext.page.initFormulaData();
            }
        }
    }

    private void teachNative_remind() {
        resume();
    }

    private void teachTipBox_execute() {
        boolean isDraw = stream.readBoolean();
        int x = stream.readShort();
        int y = stream.readShort();
        int width = stream.readShort();
        int height = stream.readShort();
        int color = stream.readInt();
        GameContext.page.setTeachTipBox(isDraw, x, y, width, height, color);
    }

    private void teachTipArrow_execute() {
        boolean isDraw = stream.readBoolean();
        int x = stream.readShort();
        int y = stream.readShort();
        short actGroupId = stream.readShort();
        short actId = stream.readShort();
        setTeachTipArrow(isDraw, x, y, actGroupId, actId);
    }

    private void setTeachTipArrow(boolean isDraw, int x, int y, int actGroupId, int actId) {
        if (!isDraw) {
            GameContext.page.teachTipArrow.releaseImages();
            GameContext.page.teachTipArrow = null;
            return;
        }
        if (GameContext.page.teachTipArrow != null && actGroupId != GameContext.page.teachTipArrow.ani.id) {
            GameContext.page.teachTipArrow.releaseImages();
        }
        PaintUnit teachTipArrow = new PaintUnit();
        teachTipArrow = new PaintUnit();
        AnimationManager.getInstance().getAnimation((short) actGroupId,teachTipArrow);
        teachTipArrow.actId = (short) actId;
        teachTipArrow.initFrame();
        teachTipArrow.x = x;
        teachTipArrow.y = y;
        GameContext.page.teachTipArrow = teachTipArrow;
    }

    private void teachMessageBox_execute() {
        char[] msg = stream.readUTF().toCharArray();
        boolean isNormal = stream.readBoolean();
        int x = stream.readShort();
        int y = stream.readShort();
        int width = stream.readShort();
        int height = stream.readShort();

        suspend();
        GameContext.page.script = this;
        if (isNormal) {
            GameContext.page.dlg.showMessageBox(msg);
            return;
        }
        GameContext.page.dlg.showMessageBox(msg, x, y, width);
    }

    private void teachMessageBox_remind() {
        resume();
    }

    private void teachKeyMast_execute() {
        int key = stream.readShort();
        int px = stream.readShort();
        int py = stream.readShort();
        int width = stream.readShort();
        int height = stream.readShort();
        String str = stream.readUTF();

        suspend();
        GameContext.page.script = this;
        GameContext.page.setTeachKey(key, px, py, width, height, str.toCharArray());
    }

    private void teachKeyMast_remind() {
        resume();
    }
}
