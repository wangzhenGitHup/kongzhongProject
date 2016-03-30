/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class NpcFile implements RoleConst {
    /**
     * 移动动作
     */
    public RoleAction moveAct;
    /**
     * 站立动作
     */
    public RoleAction standAct;
    /**
     * 挨打动作
     */
    public RoleAction hurtAct;
    /**
     * 死亡动作
     */
    public RoleAction dieAct;
    /**
     * 额外动作数据
     */
    public RoleAction[] exAct;

    //被主角远程攻击的受伤动作
    final int FALL_ACTION_INDEX = 0;
    
    //注：这里没有攻击行为，攻击行为都来自于外部的Trigger给予
    /**
     * 活动范围
     */
    public int moveX;    
    public int moveY;    
    public int moveWidth;    
    public int moveHeight;

    /********************基础参数*****************/
    /**
     * id
     */
    public int id;
    /**
     * 是否是敌人
     */
    public boolean enemy = true;
    /**
     * 是否是boss
     */
    public boolean boss;
    /**
     * 是否是投掷物
     */
    public boolean helper = false;
    /**
     * 是否忽略物理碰撞
     */
    public boolean isIgnorePh;
    /**
     * 是否漂浮物
     */
    public boolean isFly;
    /**
     * 是否在最底层
     */
    public boolean isUnderGround;
    /**
     * 基础数据
     */
    public int[] exAttr;

    final int EX_ATTR_TYPE_FORMULA_INDEX = 0;
    final int EX_ATTR_TYPE_DROP_MONEY = 1;
    //公式索引
    public int formulaIndex;
    //掉落金钱
    public int dropMoney;
    //
    
    /**
     * 物品掉落数据
     */
    public short[] dropItems;
    /**
     * Tiggers
     */
    Trigger[] trigs;
    
    public NpcFile() {
    }

    /**
     * 获取npc的动作数据
     * @param status 动作类型
     * @return 动作类型所对应的动作
     */
    public RoleAction getAction(int status) {
        switch(status) {
            case MOVE_STATUS:
                return moveAct;
            case STAND_STATUS:
                return standAct;
            case HURT_STATUS:
                return hurtAct;
            case DEAD_STATUS:
                return dieAct;
            case FALL_STATUS:
                return exAct[FALL_ACTION_INDEX];
        }
        return null;
    }

    /**
     * 读取npcfile文件内容
     * @param roleFile 文件名称
     */
    void load(String roleFile) {
        try {
            RoleManager roleMgr = RoleManager.getInstance();
            //#if PKG == 1
//#             DataInputStream dataIn = roleMgr.openFile(roleFile);
            //#else 
            InputStream in = Util.openFile("/role/" + roleFile);
            DataInputStream dataIn = new DataInputStream(in);
            //#endif
            //角色类型，抛弃
            dataIn.readShort();
            //角色名称，抛弃，脚本会重新定义
            dataIn.readUTF();
            
            readActions(dataIn);
            readMoveRange(dataIn);
            readAttributes(dataIn);
            readDropProp(dataIn);
            readTriggers(dataIn);
            //#if PKG == 1
//#             dataIn.close();
            //#else
            in.close();
            dataIn.close();
            //#endif
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    private void readAttributes(DataInputStream dataIn) throws IOException {
        boss = dataIn.readBoolean();
        helper = dataIn.readBoolean();
        isIgnorePh = dataIn.readBoolean();
        enemy = dataIn.readBoolean();
        isFly = dataIn.readBoolean();
        isUnderGround = dataIn.readBoolean();

        int attrCnt = dataIn.readShort();
        if (attrCnt < 0) {
            return;
        }
        exAttr = new int[attrCnt];
        for (int index = 0; index < attrCnt; index++) {
            exAttr[index] = dataIn.readShort();
        }
        dropMoney = exAttr[EX_ATTR_TYPE_DROP_MONEY];
        formulaIndex = exAttr[EX_ATTR_TYPE_FORMULA_INDEX];
    }
    
    private void readTriggers(DataInputStream dataIn) throws IOException {
        int trigCnt = dataIn.readShort();
        trigs = new Trigger[trigCnt];
        for(int itrig = 0; itrig < trigCnt; itrig++) {
            Trigger trig = new Trigger();
            trig.load(dataIn);
            trigs[itrig] = trig;
        }
    }
    
    private void readActions(DataInputStream dataIn) throws IOException {
        int actionCount = dataIn.readShort();

        standAct = RoleAction.loadAction(dataIn);
        moveAct = RoleAction.loadAction(dataIn);
        hurtAct = RoleAction.loadAction(dataIn);
        dieAct = RoleAction.loadAction(dataIn);
        //设定动作类型的目的尚未确定
        if(standAct != null)
        {
            standAct.type = STAND_STATUS;
        }
        if(moveAct != null)
        {
            moveAct.type = MOVE_STATUS;
        }
        if(hurtAct != null)
        {
            hurtAct.type = HURT_STATUS;
        }
        if(dieAct != null)
        {
            dieAct.type = DEAD_STATUS;
        }

        //额外行为数据
        int exActionCount = actionCount - 4;
        if (exActionCount <= 0) {
            return;
        }
        exAct = new RoleAction[exActionCount];
        for (int index = 0; index < exActionCount; index++)  {
            exAct[index] = RoleAction.loadAction(dataIn);
        }
    }
    
    /**
     * 读取活动范围
     */
    private void readMoveRange(DataInputStream dataIn) throws IOException
    {
        moveX = dataIn.readShort();
        moveY = dataIn.readShort();
        moveWidth = dataIn.readShort();
        moveHeight = dataIn.readShort();
    }
    
    /**
     * 读取掉落数据
     */
    private void readDropProp(DataInputStream dataIn) throws IOException
    {
        int count = dataIn.readShort();
        //每个物品有五个数据
        int dataCnt = count * 5;
        dropItems = new short[dataCnt];
        for (int index = 0; index < dataCnt; index += 5)
        {
            dropItems[index + 0] = dataIn.readShort();
            dropItems[index + 1] = dataIn.readShort();
            dropItems[index + 2] = dataIn.readShort();
            dropItems[index + 3] = dataIn.readByte();
            dropItems[index + 4] = dataIn.readByte();
        }
    }

    /**
     * 刷新npc的命令列表
     * @param npc
     */
    public void updateNpc(Npc npc) {
        updateTriggers(npc);
    }
    
    private void updateTriggers(Npc npc) {
        if(trigs == null) {
            return;
        }
        int startCheckTrigActIdx = 0;
        if(npc.haveTriggerAction) {
            //检查是否当前行为执行完毕了
            //如果执行完毕，转到下一个，如果没有了，执行结束
            if(!trigs[npc.trigIdx].checkActionEnd(npc)) {
                //如果没结束，就更新吧
                trigs[npc.trigIdx].updateAction(npc);
                return;
            }
            //执行后续动作
            trigs[npc.trigIdx].doActionEnd(npc);
            npc.actType = Trigger.UNKNOWN_ACTION;

            //执行下一个行为
            npc.trigActIdx++;
            if(npc.trigActIdx < trigs[npc.trigIdx].acts.length) {
                trigs[npc.trigIdx].startAction(npc);

                while(trigs[npc.trigIdx].checkActionEnd(npc)) {
                    trigs[npc.trigIdx].doActionEnd(npc);
                    npc.actType = Trigger.UNKNOWN_ACTION;
                    //执行下一个行为
                    npc.trigActIdx++;
                    if(npc.trigActIdx < trigs[npc.trigIdx].acts.length) {
                        trigs[npc.trigIdx].startAction(npc);
                        startCheckTrigActIdx = npc.trigActIdx;
                        continue;
                    }
                    npc.stopTriggerAction();
                    break;
                }

                if(npc.haveTriggerAction)
                {
                    return;
                }
                startCheckTrigActIdx = npc.trigActIdx;
            }

            //到最后了
            npc.haveTriggerAction = false;
        }

        //找找还有没有
        for(int i = startCheckTrigActIdx, size = trigs.length; i < size; i++) {
            //检查第i个trigger是否处于冷却时间
            if((boss) && Trigger.haveColdTime(npc, i)) {
                continue;
            }
            Trigger.coldTime = 0;
            if(trigs[i].isAvailable(npc)) {
                //触发了一个Trigger
                npc.haveTriggerAction = true;
                npc.trigIdx = i;
                npc.trigActIdx = 0;
                npc.triggerActionStartTime = MainCanvas.currentFrame;
                trigs[i].startAction(npc);
                if(Trigger.coldTime != 0)
                {
                    Trigger.addColdTime(npc, i, MainCanvas.currentFrame - GameContext.page.startAttackTime, Trigger.coldTime);
                }
                while(trigs[npc.trigIdx].checkActionEnd(npc)) {
                    trigs[npc.trigIdx].doActionEnd(npc);
                    npc.actType = Trigger.UNKNOWN_ACTION;
                    //执行下一个行为
                    npc.trigActIdx++;
                    if(npc.trigActIdx < trigs[npc.trigIdx].acts.length) {
                        trigs[npc.trigIdx].startAction(npc);
                        startCheckTrigActIdx = npc.trigActIdx;
                        continue;
                    }
                    npc.stopTriggerAction();
                    if(i == size - 1)
                    {
                        i = -1;
                        startCheckTrigActIdx = 0;
                    }
                    break;
                }
                if(npc.haveTriggerAction)
                {
                    break;
                }
            }
        }
    }
}
