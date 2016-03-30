/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class Mission {

    //任务id
    public int id;
    
    //任务名称
    public char[] name;

    //任务说明
    public char[] desc;

    //任务变量名称
    public String[] varName;
    //任务变量完成值
    public int[] varFinishValue;

    //任务奖励
    public int awardMoney;
    public int awardExp;
    public int awardOther;
    public int[] awardItemId;
    public int[] awardItemCnt;

    /**
     * 任务类型
     */
    public boolean isMain;

    /**
     * 任务是否可见
     */
    public boolean visible;
    /**
     * 任务是否可见(初始状态)
     */
    private boolean fileVisible;

    public int[] mapId;

    /**
     * 任务状态
     */
    //未接受
    public static final int STATE_NOT_ACCEPT = 0;
    //已接受
    public static final int STATE_ACCEPT = 1;
    //任务完成
    public static final int STATE_FINISH = 2;
    //任务失败
    public static final int STATE_FAIL = 3;
    //任务状态
    private int state = STATE_NOT_ACCEPT;

    /**
     * 读取文件数据
     * @param dataIn
     * @throws IOException
     */
    public void load(DataInputStream dataIn) throws IOException
    {
        id = dataIn.readShort();
        isMain = dataIn.readBoolean();
        fileVisible = dataIn.readBoolean();
        name = dataIn.readUTF().toCharArray();
        desc = dataIn.readUTF().toCharArray();
        int varCnt = dataIn.readShort();
        if (varCnt != 0) {
            varName = new String[varCnt];
            varFinishValue = new int[varCnt];
            for (int index = 0; index < varCnt; index++) {
                varName[index] = dataIn.readUTF();
                varFinishValue[index] = dataIn.readShort();
            }
        }
        varCnt = dataIn.readShort();
        if (varCnt != 0) {
            mapId = new int[varCnt];
            for (int index = 0; index < varCnt; index++) {
                mapId[index] = dataIn.readInt();
            }
        }
        awardMoney = dataIn.readInt();
        awardExp = dataIn.readInt();
        awardOther = dataIn.readInt();
        int itemCnt = dataIn.readShort();
        if (itemCnt != 0) {
            awardItemId = new int[itemCnt];
            awardItemCnt = new int[itemCnt];
            for (int index = 0; index < itemCnt; index++) {
                awardItemId[index] = dataIn.readShort();
                awardItemCnt[index] = dataIn.readShort();
            }
        }
    }

    /**
     * 初始化任务
     */
    public void init()
    {
        state = STATE_NOT_ACCEPT;
        visible = fileVisible;
    }

    /**
     * 保存任务状态
     * @param out
     */
    public void saveMission(DataOutputStream out)
    {
        try
        {
            out.writeByte(state);
            out.writeBoolean(visible);
        } catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
    }

    /**
     * 读取任务状态
     * @param in
     */
    public void readMission(DataInputStream in)
    {
        try
        {
            state = in.readByte();
            visible = in.readBoolean();
        } catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
    }

    /**
     * 设置任务状态
     * @param state
     */
    public void setMissionState(int state) {
        if (state > STATE_FAIL) {
            //#if PRINTDEBUG == 1
            throw new RuntimeException("没有这个任务状态:" + state);
            //#else
//#             this.state = STATE_NOT_ACCEPT;
//#             return;
            //#endif
        }
        if (state == STATE_FINISH && !isMain && visible) {
            GameContext.addVar(EffortManager.EFFORT_MISSION_EXTENSION, 1);
        }
        this.state = state;
    }

    /**
     * 获取任务状态
     * @return
     */
    public int getMissionState() {
        return state;
    }
    
    /**
     * 把这个任务给玩家
     */
    public void giveMissionToActor() {
        state = STATE_ACCEPT;
        visible = true;
    }

    /**
     * 获得任务变量完成情况描述
     */
    public char[] getMissionVarDec() {
        if (varName == null || varName.length == 0) {
            return null;
        }
        StringBuffer buf = new StringBuffer();
        for (int index = 0; index < varName.length; index++) {
            buf.append(varName[index]);
            int curVarValue = GameContext.getVar(varName[index]);
            if (curVarValue >= varFinishValue[index]) {
                buf.append("(完成)");
            }
            else if (varFinishValue[index] == 1) {
                buf.append("(未完成)");
            }
            else {
                buf.append("(").append(curVarValue).append("/").append(varFinishValue[index]).append(")");
            }
            buf.append("|");
        }
        return buf.toString().toCharArray();
    }

    /**
     * 获得任务奖励描述
     * @return
     */
    public char[] getMissionAwardDec() {
        StringBuffer buf = new StringBuffer();
        if (awardOther > 0) {
            buf.append("功绩 + ").append(awardOther).append("|");
        }
        if (awardMoney > 0) {
            buf.append("金钱 + ").append(awardMoney).append("|");
        }
        if (awardExp > 0) {
            buf.append("经验 + ").append(awardExp).append("|");
        }
        if (awardItemId == null || awardItemId.length == 0) {
            return buf.toString().toCharArray();
        }
        for (int index = 0; index < awardItemId.length; index++) {
            Item item = GameContext.getItem((short) awardItemId[index]);
            if (item == null) {
                continue;
            }
            buf.append(item.name).append(" × ").append(awardItemCnt[index]).append("|");
        }
        return buf.toString().toCharArray();
    }
}
