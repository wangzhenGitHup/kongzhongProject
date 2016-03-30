/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class AllOperand implements Operand {
    //****数值条件********//    
    int val;
    //*******************//
    
    //*****系统变量条件***//    
    
    /**
     * 系统变量名称
     */
    String name;
    //*******************//
    
    private byte checkType;
    /**
     * 物品ID条件
     */
    private short itemId;
    
    /**
     * 任务条件数
     */
    short missionId = 0;
    
    /**
     * 条件操作数类型
     */
    int type;

    AllOperand(int type)
    {
        this.type = type;
    }
    
    public void load(FishStream dataIn) {
        switch(type)
        {
            case GET_ACTOR_LV:
                break;
            case MISSION_FAIL:
                missionId = dataIn.readShort();
                break;
            case GET_VAR_OP:
                name = dataIn.readUTF();
                break;
            case HAS_ITEM:
                itemId = dataIn.readShort();
                break;
            case HAS_MISSION:
                missionId = dataIn.readShort();
                break;
            case HAS_MONEY:
                break;
            case MISSION_FINISH:
                missionId = dataIn.readShort();
                break;
            case VALUE_OP:
                val = dataIn.readInt();
                break;
            case CHECK_ATTR:
                checkType = dataIn.readByte();
                break;
        }
    }

    private int checkAttr()
    {
        switch(checkType)
        {
            case RoleConst.HP_ATTR:
                break;
            case RoleConst.DP_ATTR:
                break;
            case RoleConst.MP_ATTR:
                break;
            case RoleConst.AP_ATTR:
                break;
            case RoleConst.FEAT_ATTR:
                return GameContext.actor.featPoints;
        }
        return 0;
    }
    
    public int getValue() {
        Mission m = null;
        switch(type)
        {
            case VALUE_OP:
                return val;     
            case CHECK_ATTR:
                return checkAttr();
            case GET_ACTOR_LV:
                return GameContext.actor.getLevel();
            case GET_VAR_OP:
                return GameContext.getVar(name);
            case HAS_ITEM:
                return GameContext.actor.getItemCount(itemId);
            case HAS_MONEY:
                return GameContext.actor.getMoney();

            case HAS_MISSION:
                m = MissionManager.getInstance().getMission(missionId);
                if(m == null)
                {
                    return 0;
                }
                return m.getMissionState() == Mission.STATE_ACCEPT ? 1 : 0;
            case MISSION_FAIL:
                m = MissionManager.getInstance().getMission(missionId);
                if(m == null)
                {
                    return 0;
                }
                return m.getMissionState() == Mission.STATE_FAIL ? 1 : 0;
            case MISSION_FINISH:
                m = MissionManager.getInstance().getMission(missionId);
                if(m == null)
                {
                    return 0;
                }
                //完成或者失败都算任务完成过了
                return m.getMissionState() == Mission.STATE_FINISH ? 1 : 0;
        }
        return 0;
    }
    
    //#if PRINTDEBUG == 1
    public String toString() {
        switch(type) {
            case MISSION_FAIL:
                return "MISSION_FILE" + missionId;
            
            case GET_VAR_OP:
                return "GetVar " + name;
                
            case HAS_ITEM:
                return "HasItem " + itemId;
                
            case HAS_MISSION:
                return "HasMission " + missionId;
                
            case HAS_MONEY:
                return "Has Money ";
                
            case MISSION_FINISH:
                return "MissionFinished " + missionId;
                
            case VALUE_OP:
                return " " + val;
        }
        
        return "未知操作符:" + type;
    }
    //#endif
}
