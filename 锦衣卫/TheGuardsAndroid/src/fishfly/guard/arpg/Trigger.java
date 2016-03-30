/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.IOException;
import java.util.Random;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class Trigger {
    //定义触发条件
    /**
     * 总是
     */
    public static final int ACTOR_ALWAYS_COND = 0;
    /**
     * 与主角之间的距离
     */
    public static final int ACTOR_DISTANCE_COND = 1;
    /**
     * 有一定几率触发
     */
    public static final int PROB_COND = 2;
    /**
     * 一条直线上
     */
    public static final int LINE_COND = 3;
    /**
     * 隐身触发
     */
    public static final int HIDE_COND = 4;
    /**
     * NPC血量是否大于某一百分比
     */
    public static final int NPC_HP_COND = 5;
    /**
     * 可以分身
     */
    public static final int CAN_CREATE_NPC_COND = 6;
    /**
     * 战斗开始时间
     */
    public static final int START_TIME_COND = 7;
    /**
     * 第一次做
     */
    public static final int FIRST_TIME_COND = 8;
    /**
     * boss的阶段
     */
    public static final int BOSS_STAGE = 9;
    /**
     * boss对应主角的方向
     */
    public static final int BOSS_DIR = 10;
    /**
     * 是否有目标
     */
    public static final int HAVE_TARGET = 11;
    /**
     * 是否能使用技能
     */
    public static final int CAN_USE_SKILL = 12;
    /**
     * 主角是否无敌
     */
    public static final int ACTOR_SUPER_COND = 13;
    /**
     * 主角身上是否有debuff
     */
    public static final int ACTOR_DEBUFF = 14;
    /**
     * 主角正在攻击
     */
    public static final int ACTOR_STATE_COND = 15;

    
    //行为定义
    /**
     * 行为类型
     */
    public static final int UNKNOWN_ACTION = -1;
    /**
     * 跟踪主角,本次行为只持续一个动画周期
     */
    public static final int TRACK_ACTOR_ACTION = 0;
    /**
     * NPC逃离主角
     */
    public static final int NPC_RUN_ACTOR_ACTION = 1;
    /**
     * 攻击主角
     */
    public static final int ATTACK_ACTION = 2;
    /**
     * NPC休息
     */
    public static final int SLEEP_ACTION = 3;
    /**
     * 杀死自己
     */
    public static final int KILL_ME_ACTION = 4;
    /**
     * NPC射箭
     */
    public static final int ARCHERY_ACTION = 5;
    /**
     * 分身
     */
    public static final int NPC_CREATE_HELPER_ACTION = 6;
    /**
     * 运行脚本
     */
    public static final int RUN_SCRIPT = 7;
    /**
     * NPC隐身
     */
    public static final int HIDE_ACTION = 8;
    /**
     * BOSS僵硬
     */
    public static final int BOSS_STIFF_ACION = 9;
    /**
     * NPC无敌了
     */
    public static final int SET_SUPER_ACTION = 10;
    /**
     * 播放声音
     */
    public static final int PLAY_SOUND_TYPE = 11;
    /**
     * NPC自己移动
     */
    public static final int NPC_MOVE_ONLY_ACTION = 12;
    /**
     * 瞬移
     */
    public static final int MOVE_INSTANT_ACTION = 13;
    /**
     * 移动到固定位置
     */
    public static final int MOVE_POSITION_ACTION = 14;
    /**
     * 恢复默认位置
     */
    public static final int MOVE_BACK_ACTION = 15;
    /**
     * 粘着某个npc
     */
    public static final int WITH_ACTION = 16;
    /**
     * boss说话
     */
    public static final int BOSS_SPEAK_ACTION = 17;
    /**
     * 切换npc的阶段
     */
    public static final int CHANGE_BOSS_STAGE = 18;
    /**
     * 更改boss攻击范围
     */
    public static final int CHANGE_BOSS_ATTACK_RANGE = 19;
    /**
     * npc使用技能
     */
    public static final int NPC_SKILL = 20;
    /**
     * npc更改速度
     */
    public static final int NPC_SPEED_CHANGE = 21;
    /**
     * 搜索目标
     */
    public static final int CHECK_TARGET_TYPE = 22;
    
    //行为定义结束
    
    /**
     * 第一次执行某项东西的索引
     */
    static short firstTimeIdx;
    
    /**
     * 条件及自带参数依次排列在后面
     */
    short[] conds;
    
    //行为采用type与参数结合的方式
    short[] acts;
    
    //行为的数据
    Object[] actParams;
    
    //做条件检测是的中间变量
    int idata;
    
    //缓存当前冷却时间的向量
    static int coldTime;
    
    //缓存冷却时间的数据结构及操作
    static Npc[] npcs;
    static int[] triggerIdxs;
    static int[] startTimes;
    static int[] keepTimes;
    static int coldTimeCnt;

    static {
        final int CACHE_SIZE = 10;
        npcs = new Npc[CACHE_SIZE];
        triggerIdxs = new int[CACHE_SIZE];
        startTimes = new int[CACHE_SIZE];
        keepTimes = new int[CACHE_SIZE];
    }

    /**
     * 清楚所有的npc技能的冷却
     */
    public static void clearAll()
    {
        final int CACHE_SIZE = 10;
        npcs = new Npc[CACHE_SIZE];
        triggerIdxs = new int[CACHE_SIZE];
        startTimes = new int[CACHE_SIZE];
        keepTimes = new int[CACHE_SIZE];  
        coldTimeCnt = 0;
    }

    /**
     * 给npc添加一个冷却时间
     * @param npc 添加冷却时间的npc
     * @param triggerIdx 行为id
     * @param startTime 使用技能时间
     * @param keepTime 该技能的冷却时间
     */
    public static void addColdTime(Npc npc, int triggerIdx, int startTime, int keepTime) {
        //有原来的替换原来的
        for(int index = 0; index < coldTimeCnt; index++)
        {
            if(npcs[index] == npc && triggerIdxs[index] == triggerIdx)
            {
                startTimes[index] = startTime;
                keepTimes[index] = keepTime;
                return;
            }
        }        
        npcs[coldTimeCnt] = npc;
        triggerIdxs[coldTimeCnt] = triggerIdx;
        startTimes[coldTimeCnt] = startTime;
        keepTimes[coldTimeCnt] = keepTime;
        coldTimeCnt++;
    }

    /**
     * 当动作结束之后，刷新更新时间哈
     * @param npc
     * @param triggerIdx
     * @param startTime
     */
    private void updateCurClodTime(Npc npc, int triggerIdx, int startTime)
    {
        if(coldTimeCnt == 0)
        {
            return;
        }
        for(int index = 0; index < coldTimeCnt; index++)
        {
            if(npcs[index] == npc && triggerIdxs[index] == triggerIdx)
            {
                startTimes[index] = startTime;
                return;
            }
        }

    }

    /*
     * 删除npc行为的冷却时间
     */
    public static void removeColdTime(Npc npc, int triggerIdx) {
        if(coldTimeCnt == 0) {
            return;
        }
        
        for(int i = 0; i < coldTimeCnt; i++) {
            if(npcs[i] == npc && triggerIdx == triggerIdxs[i]) {
                if(i == coldTimeCnt - 1) {
                    npcs[i] = null;
                    coldTimeCnt--;
                    return;
                }
                
                int lastIdx = coldTimeCnt - 1;
                npcs[i] = npcs[lastIdx];
                triggerIdxs[i] = triggerIdxs[lastIdx];
                startTimes[i] = startTimes[lastIdx];
                keepTimes[i] = keepTimes[lastIdx];
                npcs[lastIdx] = null;
            }
        }
    }

    /**
     * 判断当前npc技能是否冷却
     * @param npc 需要判断的npc对象
     * @param triggerIdx 行为ID
     * @return true冷却中 false冷却结束
     */
    public static boolean haveColdTime(Npc npc, int triggerIdx) {
        if(coldTimeCnt == 0) {
            return false;
        }
        for(int i = 0; i < coldTimeCnt; i++) {
            if(npcs[i] == npc && triggerIdx == triggerIdxs[i]) {
                return  MainCanvas.currentFrame < startTimes[i] + GameContext.page.startAttackTime + keepTimes[i];
            }
        }
        return false;
    }

    /**
     * 清除冷却时间
     */
    public static void clearColdTime() {
        for(int i = 0; i < coldTimeCnt; i++) {
            npcs[i] = null;
        }
        coldTimeCnt = 0;
    }
    /**
     * 做条件检测需传入Npc的引用
     */
    public void load(DataInputStream dataIn) throws IOException {
        //先把数据解析后存入一个预估的short数组
        //应该用不了这么多，毕竟一般几个条件就够了
        final int CACHE_SIZE = 100;
        short[] cache = new short[CACHE_SIZE];
        int cacheIdx = 0;
        
        cacheIdx = loadConditions(dataIn, cache, cacheIdx);
        
        conds = new short[cacheIdx];
        System.arraycopy(cache, 0, conds, 0, cacheIdx);
        cache = null;
        
        //下面载入行为
        int actCnt = dataIn.read();
        acts = new short[actCnt];
        actParams = new Object[actCnt];
        
        for(int iact = 0; iact < actCnt; iact++) {
            loadAction(dataIn, iact);
        }
    }
    
    private void loadAction(DataInputStream dataIn, int index) throws IOException {
        int type = dataIn.read();
        acts[index] = (short)type;
        switch(type) {
            case ATTACK_ACTION:// = 2;
                AttackActionParam attackParam = new AttackActionParam();
                attackParam.load(dataIn);
                actParams[index] = attackParam;
                break;

            case SLEEP_ACTION:// = 3;
                int keepTime = dataIn.readInt();
                actParams[index] = new Integer(keepTime);
                break;

            case ARCHERY_ACTION:// = 5;
                NpcArcheryActionParam archeryParam = new NpcArcheryActionParam();
                archeryParam.load(dataIn);
                actParams[index] = archeryParam;
                break;

            case NPC_CREATE_HELPER_ACTION:// = 6;
                NpcCreateNpcParam createNpcParam = new NpcCreateNpcParam();
                createNpcParam.load(dataIn);
                actParams[index] = createNpcParam;
                break;
                
            case RUN_SCRIPT:// = 7;
                String script = dataIn.readUTF();
                actParams[index] = new ScriptEngine(script);
                break;
                
            case HIDE_ACTION:// = 8;
                boolean isHide = dataIn.readBoolean();
                actParams[index] = new Boolean(isHide);
                break;

            case BOSS_STIFF_ACION:// = 9;
                boolean isStiff = dataIn.readBoolean();
                actParams[index] = new Boolean(isStiff);
                break;
                
            case SET_SUPER_ACTION:// = 10;
                boolean isSuper = dataIn.readBoolean();
                actParams[index] = new Boolean(isSuper);
                break;

            case PLAY_SOUND_TYPE:// = 11;
                int sound = dataIn.readShort();
                actParams[index] = new Integer(sound);
                break;

            case NPC_MOVE_ONLY_ACTION:// = 12;
                int range = dataIn.readShort();
                actParams[index] = new Integer(range);
                break;
                
            case MOVE_POSITION_ACTION:// = 14;
                MovePositionActionParam movePosActParam = new MovePositionActionParam();
                movePosActParam.load(dataIn);
                actParams[index] = movePosActParam;
                break;
                
            case WITH_ACTION:// = 16;
                String name = dataIn.readUTF();
                int time = dataIn.readShort();
                actParams[index] = name + "|" + time;
                break;
                
            case BOSS_SPEAK_ACTION:// = 17;
                BossSpeakActionParam bossSpeakActParam = new BossSpeakActionParam();
                bossSpeakActParam.load(dataIn);
                actParams[index] = bossSpeakActParam;
                break;
                
            case CHANGE_BOSS_STAGE:// = 18;
                int stage = dataIn.read() & 0xff;
                actParams[index] = new Integer(stage);
                break;

            case CHANGE_BOSS_ATTACK_RANGE:// = 19;
                int frig = dataIn.read() & 0xff;
                actParams[index] = new Integer(frig);
                break;
                
            case NPC_SKILL:// = 20;
//                NpcSkillParam param = new NpcSkillParam();
//                param.load(dataIn);
//                actParams[index] = param;
                break;
                
            case NPC_SPEED_CHANGE:// = 21;
                byte changeSpeed = dataIn.readByte();
                short s = (short) (changeSpeed & 0xff);
                actParams[index] = new Short(s);
                break;
                
        }
    }
    
    private int loadConditions(DataInputStream dataIn, short[] cache, int cacheIdx) throws IOException {
        short condCnt = (short)dataIn.read();
        cache[cacheIdx] = condCnt;
        cacheIdx++;
        for(int icond = 0; icond < condCnt; icond++) {
            cacheIdx = loadCondition(dataIn, cache, cacheIdx);
        }
        return cacheIdx;
    }
    
    /**
     * 载入一个
     * @param dataIn
     * @param cache 
     * @param cacheIdx 
     * @return 返回下一个cacheIdx应该放的位置
     * @throws java.io.IOException
     */
    private int loadCondition(DataInputStream dataIn, short[] cache, int cacheIdx) throws IOException {
        short type = (short)dataIn.read();
        cache[cacheIdx] = type;
        cacheIdx++;
        
        switch(type) {
            case ACTOR_ALWAYS_COND://0
                break;

            case ACTOR_DISTANCE_COND://1
                cache[cacheIdx] = dataIn.readShort();
                cacheIdx++;
                cache[cacheIdx] = dataIn.readShort();
                cacheIdx++;
                break;

            case PROB_COND://2
                cache[cacheIdx] = dataIn.readShort();
                cacheIdx++;
                break;

            case LINE_COND://3;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;

            case HIDE_COND://4;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;
                
            case NPC_HP_COND://5;
                cache[cacheIdx] = dataIn.readShort();
                cacheIdx++;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;
                
            case CAN_CREATE_NPC_COND://6;
                break;
                
            case START_TIME_COND://7;//转变为毫秒
                cache[cacheIdx] = (short)((dataIn.readByte() & 0xFF) * 10);
                cacheIdx++;
                cache[cacheIdx] = (short)((dataIn.readByte() & 0xFF) * 10);
                cacheIdx++;
                break;

            case FIRST_TIME_COND://8;
                cache[cacheIdx] = firstTimeIdx;
                cacheIdx++;
                firstTimeIdx++;
                break;
                
            case BOSS_STAGE://9;
                cache[cacheIdx] = (short)(dataIn.readByte() & 0xff);
                cacheIdx++;
                break;

            case BOSS_DIR://10;
                int dirCur = dataIn.readByte() & 0xff;
                boolean isFan = dataIn.readBoolean();
                cache[cacheIdx] = (short)((dirCur << 8) | (isFan ? 1 : 0));
                cacheIdx++;
                break;

            case HAVE_TARGET://11;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;
                
            case CAN_USE_SKILL://12;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;
                
            case ACTOR_SUPER_COND://13;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;

            case ACTOR_DEBUFF://14;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;
                
            case ACTOR_STATE_COND://15;
                cache[cacheIdx] = dataIn.readShort();
                cacheIdx++;
                cacheIdx = readBoolean(dataIn, cache, cacheIdx);
                break;
        }
        
        return cacheIdx;
    }
    
    private int readBoolean(DataInputStream dataIn, short[] cache, int cacheIdx) throws IOException {
        boolean b = dataIn.readBoolean();
        short val = (short)(b ? 1 : 0);
        cache[cacheIdx] = val;
        cacheIdx++;
        return cacheIdx;
    }
    
    /**
     * 这个Trigger是否符合条件
     * @param npc
     * @return
     */
    public boolean isAvailable(Npc npc) {
        //抛弃条件个数
        int condCnt = conds[0];        
        boolean isAvail = false;
        idata = 1;
        for(int icond = 0; icond < condCnt; icond++) {
            isAvail = isAvailableCondition(npc);
            if(!isAvail) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * 检测某个条件
     * @param npc
     * @param i
     * @return 如果检测到某个条件为真，返回-1,这也是没办法，正数都被占据了意义，负数没有，所以用负数解决
     */
    private boolean isAvailableCondition(Npc npc) {
        int type = conds[idata];
        idata++;
        
        switch(type) {
            case ACTOR_ALWAYS_COND://0
                return true;

            case ACTOR_DISTANCE_COND://1
                int downLimit = conds[idata];
                idata++;
                int upLimit = conds[idata];
                idata++;
                int distX = Math.abs(npc.x - GameContext.actor.x);
                int distY = Math.abs(npc.y - GameContext.actor.y);
                if(distX < downLimit && distY < downLimit) {
                    return false;
                }

                if(upLimit == 0) {
                    return true;
                }

                if(distX > upLimit || distY > upLimit) {
                    return false;
                }
                return true;
                
            case PROB_COND://2
                int prob = conds[idata];
                idata++;

                int ran = GameContext.getRand(0, 100);
                if(ran <= prob) {
                    return true;
                }
                return false;
                
            case LINE_COND://3;
                int isLine = conds[idata];
                idata++;
                int actorX = GameContext.actor.x;
                int actorY = GameContext.actor.y;
                int lengthX = Math.abs(npc.x - actorX);
                int lengthY = Math.abs(npc.y - actorY);
                if(lengthX > lengthY)
                {
                    int a = lengthX;
                    lengthX = lengthY;
                    lengthY = a;
                }

                if(lengthY == 0)
                {
                    if(isLine == 1) {
                        return true;
                    }
                    return false;
                }
                //if(lengthX * 100 / lengthY <= 40)
                if((lengthX << 3) + lengthX + lengthX <= (lengthY << 2))
                {
                    if(isLine == 1) {
                        return true;
                    }
                    return false;
                }
                if(isLine == 1) {
                    return false;
                }
                return true;
                
            case HIDE_COND://4;
                int isHide = conds[idata];
                idata++;
                if (isHide == 1) {
                    return npc.isHide;
                }
                return !npc.isHide;

            case NPC_HP_COND://5;
                int hpPercent = conds[idata];
                idata++;
                int isBig = conds[idata];
                idata++;
                if(isBig == 1) {
                    if(npc.hpPercent >= hpPercent) {
                        return true;
                    }
                    return false;
                }
                if(npc.hpPercent < hpPercent) {
                    return true;
                }
                return false;
                
            case CAN_CREATE_NPC_COND://6
                if(RoleManager.getInstance().getNpcCount() >= 10)
                {
                    return false;
                }

                //主角（y）身边是X的位置没有物理层就分身
                //0XXX0
                //XXXXX
                //XXYXX
                //XXXXX
                //0XXX0
                //npc.x / TILE_SIZE
                int col = npc.x >> 4;
                //npc.y / TILE_SIZE
                int row = npc.y >> 4;
                for(int colIndex = col - 2; colIndex <= col + 2; colIndex++)
                {
                    for(int rowIndex = row - 2; rowIndex <= row + 2; rowIndex++)
                    {
                        if((colIndex == col - 2 && rowIndex == row - 2)
                            || (colIndex == col + 2 && rowIndex == row - 2)
                            || (colIndex == col - 2 && rowIndex == row + 2)
                            || (colIndex == col + 2 && rowIndex == row + 2)
                            )
                        {
                            continue;
                        }

                        if(!GameContext.map.canMoveTile(colIndex, rowIndex))
                        {
                            return false;
                        }
                    }
                }
                return true;

            case START_TIME_COND://7
                int startTime = conds[idata] & 0xFFFF;
                idata++;
                long interval = conds[idata] & 0xFFFF;
                idata++;
                long curTime = MainCanvas.currentFrame - GameContext.page.startAttackTime;
                if(curTime < startTime) {
                    return false;
                }
                coldTime = (int) (interval & 0xffffffff);
                return true;

            case FIRST_TIME_COND://8
                int firstTimeBitIdx = conds[idata];
                idata++;
                if(((npc.firstTimeFlag >>> firstTimeBitIdx) & 0x01) == 0) {
                    //是第一次
                    npc.firstTimeFlag |= (0x01 << firstTimeBitIdx);
                    return true;
                }
                return false;

            case BOSS_STAGE://9
                int stage = conds[idata];
                idata++;
                return npc.isSaveStage(stage);

            case BOSS_DIR://10
                short data = conds[idata];
                idata++;
                return isBossDir(npc, data);

            case HAVE_TARGET://11;
                int have = conds[idata];
                idata++;
                return false;
                
            case CAN_USE_SKILL://12;
                int canUse = conds[idata];
                idata++;
                return true;

            case ACTOR_SUPER_COND://13;
                int isSuper = conds[idata];
                idata++;
                if(isSuper == 1) {
                    return GameContext.actor.isSuper;
                }
                return !GameContext.actor.isSuper;

            case ACTOR_DEBUFF://14;
                int isHave = conds[idata];
                idata++;
                if(isHave == 1)
                {
                    return (GameContext.actor.keepAttackEffect != null && GameContext.actor.keepAttackEffect.isLive);
                }
                return (GameContext.actor.keepAttackEffect == null || !GameContext.actor.keepAttackEffect.isLive);

            case ACTOR_STATE_COND://15;
                int state = conds[idata];
                idata++;
                int flag = conds[idata];
                idata++;
                if (flag == 1) {
                    return GameContext.actor.status == state;
                }
                return GameContext.actor.status != state;
            }
        return false;
    }

    private boolean isBossDir(Npc npc, short data)
    {
        int dir = (data >> 8) & 0xff;
        boolean isFan = (data & 0xff) == 1;
        if(dir == Role.UP)
        {
            return isFan ? npc.y >= GameContext.actor.y : npc.y <= GameContext.actor.y;
        }
        if(dir == Role.DOWN)
        {
            return isFan ? npc.y >= GameContext.actor.y : npc.y >= GameContext.actor.y;
        }
        if(dir == Role.LEFT)
        {
            return isFan ? npc.x <= GameContext.actor.x : npc.x <= GameContext.actor.x;
        }
        if(dir == Role.RIGHT)
        {
            return isFan ? npc.x >= GameContext.actor.x : npc.x >= GameContext.actor.x;
        }
        return false;
    }

    /**
     * 判断行为是否结束
     * @param npc 判断的npc
     * @return true npc当前行为结束 false npc当前行为没有结束
     */
    public boolean checkActionEnd(Npc npc) {
        int actIdx = npc.trigActIdx;
        int actType = acts[actIdx];
        switch(actType) {
            case TRACK_ACTOR_ACTION:// = 0;
            {
                //动画播放完就结束啦
                int dstX = GameContext.actor.x;
                int dstY = GameContext.actor.y;

                int newDir = GameContext.map.findWayDir(npc, npc.x >> 4, npc.y >> 4, dstX >> 4, dstY >> 4, npc.file.isIgnorePh);

                //需要改变方向了
                if(newDir != npc.dir) {
                    return true;
                }
                return npc.isEndAnimation();
            }
            case NPC_RUN_ACTOR_ACTION:// = 1;
            case NPC_MOVE_ONLY_ACTION:// = 12;
                return npc.isEndAnimation();

            case ATTACK_ACTION:// = 2;
                if(npc.actionDuration == 0) {
                    return npc.isEndAnimation();
                }

                return (MainCanvas.currentFrame - npc.triggerActionStartTime >= npc.actionDuration);
                
            case SLEEP_ACTION:// = 3;
                return (MainCanvas.currentFrame - npc.triggerActionStartTime >= npc.actionDuration);
                
            case RUN_SCRIPT:// = 7;
                if(npc.curScript == null) {
                    return true;
                }
                if(npc.curScript.isEnd()) {
                    npc.curScript = null;
                    return true;
                }
                return false;
                
            case MOVE_POSITION_ACTION:// = 14;
                if(npc.actionDuration > 0) {
                    return MainCanvas.currentFrame - npc.triggerActionStartTime >= npc.actionDuration;
                }
                //必须移动过去
                MovePositionActionParam movePosParam = (MovePositionActionParam) actParams[actIdx];
                return npc.x == movePosParam.posX && npc.y == movePosParam.posY;
                
            case MOVE_BACK_ACTION:// = 15;
                int dstX = (npc.originalPos >> 16) & 0xffff;
                int dstY = npc.originalPos & 0xFFFF;
                return dstX == npc.x && dstY == npc.y;
                
            case WITH_ACTION:// = 16;
                return npc.withTime <= 0;
                
            case BOSS_SPEAK_ACTION:// = 17;
                return GameContext.page.bossSpeakCount == 0;

            case KILL_ME_ACTION:// = 4;
            case ARCHERY_ACTION:// = 5;
            case NPC_CREATE_HELPER_ACTION:// = 6;
            case HIDE_ACTION:// = 8;
            case BOSS_STIFF_ACION:// = 9;
            case SET_SUPER_ACTION:// = 10;
            case PLAY_SOUND_TYPE:// = 11;
            case MOVE_INSTANT_ACTION:// = 13;
            case CHANGE_BOSS_STAGE:// = 18;
            case CHANGE_BOSS_ATTACK_RANGE:// = 19;
            case NPC_SKILL:// = 20;
            case NPC_SPEED_CHANGE:// = 21;
            case CHECK_TARGET_TYPE:// = 22;
                return true;
                
        }
        return false;
    }

    /**
     * 行为结束
     * @param npc 结束行为的npc
     */
    public void doActionEnd(Npc npc) {
        int actIdx = npc.trigActIdx;
        int actType = acts[actIdx];
        updateCurClodTime(npc, npc.trigIdx, (int)(MainCanvas.currentFrame - GameContext.page.startAttackTime));
        //#if PRINTDEBUG == 1
//        System.out.println("Trigger " + npc.name + " 结束 " + actType + " 行为");
        //#endif
        switch(actType) {     
            case ATTACK_ACTION:
                npc.actionData1 = false;
                npc.actionDuration = 0;
                npc.actionData2 = 0;
                if(npc.isSaveStage(1))
                {
                    npc.status = RoleConst.STAND_STATUS;
                    npc.changeAction();
                }
                return;
                
            case TRACK_ACTOR_ACTION:
            case NPC_RUN_ACTOR_ACTION:
            case NPC_MOVE_ONLY_ACTION:
            case MOVE_INSTANT_ACTION:
            case MOVE_BACK_ACTION:
            case MOVE_POSITION_ACTION:
                npc.status = RoleConst.STAND_STATUS;
                npc.changeAction();
                return;
                
            case RUN_SCRIPT:
                npc.curScript = null;
                return;
        }
    }
    
    /**
     * 在执行过程中，更新行为
     * @param npc 更新行为的npc
     */
    public void updateAction(Npc npc) {
        int actIdx = npc.trigActIdx;
        int actType = acts[actIdx];
        switch(actType) {
            case MOVE_BACK_ACTION:
                int dstX = (npc.originalPos >> 16) & 0xffff;
                int dstY = npc.originalPos & 0xFFFF;
                npc.updateDirByDestination(dstX, dstY);
                return;
                
            case MOVE_POSITION_ACTION:
                MovePositionActionParam movePosParam = (MovePositionActionParam) actParams[actIdx];
                if(npc.actionDuration == 0) {
                    npc.updateDirByDestination(movePosParam.posX, movePosParam.posY);
                    return;
                }
                npc.updateDirByDestination(movePosParam.posX, movePosParam.posY);
                return;
                
            case WITH_ACTION:
                Role r = RoleManager.getInstance().getNpc(npc.withNpcName);
                if(r == null)
                {
                    r = GameContext.actor;
                }
                if(npc.dir != r.dir)
                {
                    npc.dir = r.dir;
                    npc.changeDir();
                }
                npc.setPosition(r.x, r.y);
                npc.withTime --;
                return;
        }
    }
    
    private void changeNpcPosition(Npc npc, int dir)
    {
        int actorX = GameContext.actor.x;
        int actorY = GameContext.actor.y;
        int actorCol = actorX >> 4;
        int actorRow = actorY >> 4;
        if (dir == Role.UP)
        {
            npc.nextX = actorX;
            npc.nextY = ((actorRow - 1) << 4) + (Map.TILE_SIZE >> 1);
            npc.dir = Role.DOWN;
        }
        if (dir == Role.DOWN)
        {
            npc.nextX = actorX;
            npc.nextY = ((actorRow + 1) << 4) + (Map.TILE_SIZE >> 1);
            npc.dir = Role.UP;
        }
        if (dir == Role.LEFT)
        {
            npc.nextX = ((actorCol - 1) << 4) + (Map.TILE_SIZE >> 1);
            npc.nextY = actorY;
            npc.dir = Role.RIGHT;
        }
        if (dir == Role.RIGHT)
        {
            npc.nextX = ((actorCol + 1) << 4) + (Map.TILE_SIZE >> 1);
            npc.nextY = actorY;
            npc.dir = Role.LEFT;
        }       
    }

    private int[] npcInstantX = new int[]{232, 88, 232, 376};
    private int[] npcInstantY = new int[]{96, 240, 384, 240};
    private int[] npcInstantDir = new int[]{1, 3, 2, 0};//下右左上
    private void changeNpcPosition(Npc npc) {
        int rand = GameContext.getRand(0, 3);
        npc.nextX = npcInstantX[rand];
        npc.nextY = npcInstantY[rand];
        npc.dir = npcInstantDir[rand];
        npc.setPosition(npc.nextX, npc.nextY);
    }

    /**
     * 释放行为相关资源
     */
    public void release()
    {
        if(acts == null)
        {
            return;
        }
        for(int index = 0; index < acts.length; index++)
        {
            int actType = acts[index];
            switch(actType) 
            {
                case ATTACK_ACTION:
                    AttackActionParam param = (AttackActionParam) actParams[index];
                    AnimationManager.getInstance().release(param.act.aniId);
                    break;
            }
        }
    }

    /**
     * 开始运行新的行为
     * @param npc 运行新行为的npc
     */
    public void startAction(Npc npc) {
        if(acts == null) {
            return;
        }
        
        int actIdx = npc.trigActIdx;
        int actType = acts[actIdx];
        npc.actionStartTime = MainCanvas.currentFrame;
        npc.actType = actType;
        if(!GameContext.actor.isAttackActor() && (actType == ATTACK_ACTION || actType == ARCHERY_ACTION || actType == NPC_CREATE_HELPER_ACTION))
        {
	    //#if PRINTDEBUG == 1
            System.out.println("npc不移动了，name="+npc.name);
	    //#endif
            npc.haveMoveTask = false;
            return;
        }
        //#if PRINTDEBUG == 1
//        System.out.println("Trigger " + npc.name + " 开始 " + actType + " 行为");
        //#endif
        switch(actType) {
            case TRACK_ACTOR_ACTION:// = 0;
                npc.startMove(GameContext.actor.x, GameContext.actor.y);
                return;
                
            case NPC_RUN_ACTOR_ACTION:// = 1;
                {
                //尽量保持当前方向
                //选择与主角对应方向
                int xDir = PaintUnit.LEFT;
                if(npc.x >= GameContext.actor.x) {
                    xDir = PaintUnit.RIGHT;
                }

                int yDir = PaintUnit.UP;
                if(npc.y >= GameContext.actor.y) {
                    yDir = PaintUnit.DOWN;
                }

                //如果有一边不一样，切换到另一边
                int xDist = Math.abs(npc.x - GameContext.actor.x);
                int yDist = Math.abs(npc.y - GameContext.actor.y);
                //先挑远的一边走
                int maxDir = xDir;
                if(xDist < yDist) {
                    maxDir = yDir;
                }

                int newDir = npc.dir;
                if(newDir != xDir && newDir != yDir) {
                    newDir = maxDir;
                }
                //但是要保持连续性
                npc.dir = newDir;
                npc.status = RoleConst.MOVE_STATUS;
                npc.changeAction();
                return;
            }
            
            case ATTACK_ACTION:// = 2;
                AttackActionParam param = (AttackActionParam)actParams[actIdx];
                if (npc.enemy && !npc.isHelper) {
                    int disX = npc.x - GameContext.actor.x;
                    int disY = npc.y - GameContext.actor.y;
                    if (Math.abs(disX) < Math.abs(disY))
                    {
                        npc.dir = disY > 0 ? Role.UP : Role.DOWN;
                    }
                    else
                    {
                        npc.dir = disX > 0 ? Role.LEFT : Role.RIGHT;
                    }
                }
                npc.status = RoleConst.ATTACK_STATUS;
                npc.curAct = param.act;
                npc.attackEffect = param.effect;
                npc.resetAnimation(true);
                npc.refreshSpeed();
                npc.initFrame();
                npc.actionData1 = param.flying;
                //直接把这个值计算出来
                npc.actionData2 = param.upgrade;
                npc.actionDuration = param.duration / 100;
                return;
                
            case SLEEP_ACTION:// = 3;
                npc.triggerActionStartTime = MainCanvas.currentFrame;
                npc.actionDuration = ((Integer)actParams[actIdx]).intValue() / 100;
                return;

            case KILL_ME_ACTION:// = 4;
                npc.isHide = true;
                npc.setDie(true);
                return;
                
            case ARCHERY_ACTION:// = 5;
                NpcArcheryActionParam archeryParam = (NpcArcheryActionParam) actParams[actIdx];
                archeryParam.execute(npc);
                return;
                
            case NPC_CREATE_HELPER_ACTION:// = 6;
                NpcCreateNpcParam createNpcParam = (NpcCreateNpcParam) actParams[actIdx];
                createNpcParam.execute(npc);
                return;
                
            case RUN_SCRIPT:// = 7;
                //为了以防万一，当npc运行脚本的时候将其设置成站立模式
                npc.status = RoleConst.STAND_STATUS;
                npc.changeAction();
                GameContext.page.curNpc = npc;
                npc.curScript = (ScriptEngine) actParams[actIdx];
                npc.curScript.init();
                GameContext.script = npc.curScript;
                return;
                
            case HIDE_ACTION:// = 8;
                boolean isHide = ((Boolean)actParams[actIdx]).booleanValue();
                npc.isHide = isHide;
                return;
                
            case BOSS_STIFF_ACION:// = 9;
                npc.isStiff = ((Boolean)actParams[actIdx]).booleanValue();
                return;
                
            case SET_SUPER_ACTION:// = 10;
                npc.isSuper = ((Boolean)actParams[actIdx]).booleanValue();
                return;
                
            case PLAY_SOUND_TYPE:// = 11;
                return;
                
            case NPC_MOVE_ONLY_ACTION:// = 12;
                int range = ((Integer)actParams[actIdx]).intValue();
                if (range != 0 && !npc.isMoveInRange(npc.x, npc.y, range)) {
                    npc.startMove((npc.originalPos >> 16) & 0xFF, npc.originalPos & 0xffff);
                    return;
                }
                npc.randomMove(range);
                return;
                
            case MOVE_INSTANT_ACTION:// = 13;               
                changeNpcPosition(npc);
                //这个游戏的npc瞬移和原来的不一样了
//                int actorX = GameContext.actor.x;
//                int actorY = GameContext.actor.y;
//                int actorDir = GameContext.actor.dir;
//                int actorCol = actorX >> 4;
//                int actorRow = actorY >> 4;
//                boolean isUp = GameContext.map.canMoveTile(actorCol, actorRow - 1);
//                boolean isDown = GameContext.map.canMoveTile(actorCol, actorRow + 1);
//                boolean isLeft = GameContext.map.canMoveTile(actorCol - 1, actorRow);
//                boolean isRight = GameContext.map.canMoveTile(actorCol + 1, actorRow);
//                if(!isUp && !isDown && !isLeft && !isRight)
//                {
//                    return;
//                }
//                npc.dir = Role.NO_DIR;
//                if(actorDir == Role.UP && isUp)
//                {
//                    npc.dir = Role.DOWN;
//                    changeNpcPosition(npc, Role.UP);
//                }
//                else if(actorDir == Role.DOWN && isDown)
//                {
//                    npc.dir = Role.UP;
//                    changeNpcPosition(npc, Role.DOWN);
//                }
//                else if(actorDir == Role.LEFT && isLeft)
//                {
//                    npc.dir = Role.RIGHT;
//                    changeNpcPosition(npc, Role.LEFT);
//                }
//                else if(actorDir == Role.RIGHT && isRight)
//                {
//                    npc.dir = Role.LEFT;
//                    changeNpcPosition(npc, Role.RIGHT);
//                }
//                if(npc.dir == Role.NO_DIR)
//                {
//                   npc.dir = GameContext.getRand(Role.UP, Role.RIGHT);
//                   if(isUp)
//                   {
//                       changeNpcPosition(npc, Role.UP);
//                   }
//                   if(isDown)
//                   {
//                       changeNpcPosition(npc, Role.DOWN);
//                   }
//                   if(isLeft)
//                   {
//                       changeNpcPosition(npc, Role.LEFT);
//                   }
//                   if(isRight)
//                   {
//                       changeNpcPosition(npc, Role.RIGHT);
//                   }
//                }
//                npc.setPosition(npc.nextX, npc.nextY);
                return;
                
            case MOVE_POSITION_ACTION:// = 14;
                MovePositionActionParam movePosParam = (MovePositionActionParam)actParams[actIdx];
                npc.actionDuration = movePosParam.time / 100;
                if(movePosParam.isActor && movePosParam.time != 0) {
                    movePosParam.posX = GameContext.actor.x;
                    movePosParam.posY = GameContext.actor.y - 60;
                }

                npc.startMove(movePosParam.posX, movePosParam.posY);
                return;
                
            case MOVE_BACK_ACTION:// = 15;
                npc.startMove((npc.originalPos >> 16) & 0xFF, npc.originalPos & 0xffff);
                return;
                
            case WITH_ACTION:// = 16;
                String str = (String)actParams[actIdx];
                npc.withNpcName = str.substring(0, str.indexOf("|"));
                npc.withTime = Integer.parseInt(str.substring(str.indexOf("|") + 1));
                npc.status = Npc.STAND_STATUS;
                npc.changeAction();
                return;

            case BOSS_SPEAK_ACTION:// = 17;
                GameContext.page.bossSpeakParam = (BossSpeakActionParam) actParams[actIdx];
                GameContext.page.bossSpeakCount = 0;
                return;
                
            case CHANGE_BOSS_STAGE:// = 18;
                int stage = ((Integer)actParams[actIdx]).intValue();
                npc.setNpcStage(stage);
                return;

            case CHANGE_BOSS_ATTACK_RANGE:// = 19;
                return;
                
            case NPC_SKILL:// = 20;
                return;
                
            case NPC_SPEED_CHANGE:// = 21;
                short s = ((Short)actParams[actIdx]).shortValue();
                //npc原来的速度
                byte changeSpeed = (byte)(s & 0xff);
                npc.setExSpeed(changeSpeed);
                return;
                
            case CHECK_TARGET_TYPE:// = 22;
                return;
        }
    }
}
