/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package fishfly.guard.arpg;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;

/**
 * 攻击技能
 * @author 胡阳@fishfly.com
 */
public class AttackSkill 
{
    //技能类型
    // 攻击技能
    public static final int ATTACK_SKILL_TYPE = 0;
    //被动技能
    public static final int PASSIVE_SKILL_TYPE = 1;
    /**
     * 特殊技能
     */
    public static final int SPECIAL_SKILL = 2;

    //条件类型
    //没有条件
    public static final int NO_CONDITIONS_TYPE = 0;
    //技能条件
    public static final int SKILL_TYPE = 1;
    //需要剧情获得
    public static final int SKILL_STORY = 2;
    //需要特殊物品习得
    public static final int SKILL_ITEM = 3;
    //需要达到等级
    public static final int SKILL_LV = 4;
    //技能功能
    //提升攻击力
    public static final int ATTACK_UP_TYPE = 0;
    //主角扔东西
    public static final int ATTACK_THROW = 1;
    //增加生命恢复的能力
    public static final int EFFECT_UP_LIFE = 2;
    //每秒回血
    public static final int EFFECT_REGAIN_LIFE = 3;    
    //每秒恢复法力
    public static final int EFFECT_REGAIN_MP = 4;    
    //增加命中
    public static final int EFFECT_UP_HIT = 5;    
    //增加回避
    public static final int EFFECT_UP_AVOID = 6;    
    //暴击
    public static final int EFFECT_BIG_FIGHT = 7;   
    //提高暴击伤害
    public static final int EFFECT_ATTACK_NUM = 9;
    //提高速度
    public static final int EFFECT_MOVE_SPEED = 10;
    //降低不良效果时间
    public static final int EFFECT_LOSE_TIME = 11;
    //增加防御率
    public static final int EFFECT_DEFENSE_PRO = 12;
    //增加怒气
    public static final int EFFECT_ANGER = 13;
    //更换图片
    public static final int EFFECT_CHANGE_IMAGE = 14;
    
    //技能属性
    //技能名称
    public char[] name;
    //技能说明
    public char[] desc;
    //技能种类
    public int type;
    //技能属性
    public int attr;
    //技能学费
    public int price;
    //技能ID
    public int id;
    //是否已经学习了
    public boolean learned;
    //条件数据
    public int condData;
    //技能学习条件
    public int cond;
    //技能功能,需使用FishStream解析
    public byte[] funcs;
    //使用的mp
    public int mp;
    //每秒耗费的mp值
    public int mpPerSecond;
    //攻击动作
    public RoleAction act;
    //特效动作
    public RoleAction effectAct;

    //攻击的效果
    AttackEffect effect;
    
    /**
     * 攻击的限定条件，主角在什么情况下发动这个技能
     */
//    public int[] attackKindCondition = null;
    public int attackKindCondition;
    /**
     * 是否可以击退敌兵
     */
    public boolean breakBack;
    //是否更改人物攻击
    public boolean changeAttack;
    //任务的攻击方式索引
    public int changeAttackIdx;
    //按键索引
    public int keyIndex;
    
    boolean isStart;
    
    static FishStream stream = new FishStream();
    
    public AttackSkill() {
    }
    
    public void loadSkill(DataInputStream dataIn)
    {
        try
        {
            name = dataIn.readUTF().toCharArray();
            desc = dataIn.readUTF().toCharArray();
            price = dataIn.readByte() & 0xff;
            attr = dataIn.readByte();
            
            loadCondition(dataIn);
            
            loadFunctions(dataIn);
            
            mp = dataIn.readShort();
            mpPerSecond = dataIn.readShort();
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
    }
    
    private void loadCondition(DataInputStream dataIn) throws IOException {
        cond = dataIn.readByte() & 0xFF;
        
        switch(cond)
        {
            case SKILL_TYPE:
                condData = dataIn.readShort();
                break;
                
            case SKILL_LV:
                condData = dataIn.readByte();
                break;
        }
    }
    
    public String getConditionDesc() {
        StringBuffer buf = new StringBuffer();
        switch(cond) {
            case SKILL_LV:
                buf.append("需要");
                buf.append(condData);
                buf.append("级才可习得");
                break;
            case SKILL_STORY:
                return "需要通过剧情习得";
            case SKILL_ITEM:
                return "需要使用特殊物品习得";
            case NO_CONDITIONS_TYPE:
                return "";
        }
        return buf.toString();
    }
    
    private void loadFunctions(DataInputStream dataIn) throws IOException {
        ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
        DataOutputStream dataOut = new DataOutputStream(byteOut);
        
        int funcCnt = dataIn.readByte();
        dataOut.writeByte(funcCnt);
        for(int i = 0; i < funcCnt; i++) {
            int skillType = dataIn.readByte() & 0xff;
            dataOut.writeByte(skillType);
            
            switch(skillType)
            {
                case ATTACK_UP_TYPE:
                    int upgradeAttack = dataIn.readShort() & 0xffff;
                    dataOut.writeShort(upgradeAttack);
                    break;

                case EFFECT_ANGER:
                case EFFECT_DEFENSE_PRO:
                case EFFECT_LOSE_TIME:
                case EFFECT_UP_LIFE:
                case EFFECT_REGAIN_MP:
                case EFFECT_ATTACK_NUM:
                case EFFECT_UP_AVOID:
                case EFFECT_BIG_FIGHT:
                case EFFECT_UP_HIT:
                case EFFECT_MOVE_SPEED:
                    int data = dataIn.readShort();
                    dataOut.writeShort(data);
                    break;

                case ATTACK_THROW:
                    int aniId = dataIn.readShort();
                    int roleCnt = dataIn.readByte();

                    dataOut.writeShort(aniId);
                    dataOut.writeShort(roleCnt);
                    break;

                case EFFECT_CHANGE_IMAGE:
                    int imgIdx = dataIn.readShort();
                    int imgId = dataIn.readShort();
                    dataOut.writeShort(imgIdx);
                    dataOut.writeShort(imgId);
                    break;
            }
        }
        
        funcs = byteOut.toByteArray();
    }
    
    /**
     * 是否能够使用这个技能
     * @param actKind 1代表风 2代表雷 3代表火
     * @return
     */
    public boolean canUse(int actKind)
    {
        if(attr == ((actKind - 1) << 1))
        {
            return true;
        }
        return false;
    }

    public void load(DataInputStream dataIn)
    {
        try
        {
            //抛弃类型
            dataIn.readByte();
            
            loadSkill(dataIn);
            act = RoleAction.loadAction(dataIn);
            boolean isHave = dataIn.readBoolean();
            if(isHave)
            {
                effectAct = RoleAction.loadAction(dataIn);
            }
            
            breakBack = dataIn.readBoolean();
            changeAttack = dataIn.readBoolean();
            changeAttackIdx = dataIn.readByte();
            loadEffect(dataIn);
            keyIndex = dataIn.readByte() & 0xff;
            int count = dataIn.read() & 0xff;
//            System.out.println("攻击类型条件:" + count);
//            attackKindCondition = new int[count];
//            for(int index =0; index < count; index++)
//            {
//                attackKindCondition[index] = dataIn.read() & 0xff;
//            }
            if(count > 0) {
                attackKindCondition = dataIn.read() & 0xff;
            }
        }
        catch (Exception ex)
        {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    private void loadEffect(DataInputStream dataIn) throws IOException {
        effect = AttackEffect.loadEffect(dataIn);
    }
    
    /**
     * 结束在运行的技能功能
     */
    public void endSkillEffort()
    {
        if(!isStart)
        {
            return;
        }
        isStart = false;
        stream.setData(funcs);
        int funcCnt = stream.readByte();
        Actor actor = GameContext.actor;
        for(int i = 0; i < funcCnt; i++) {
            int skillType = stream.readByte() & 0xff;            
            switch(skillType)
            {
                case ATTACK_UP_TYPE:
                    stream.readShort();
                    break;
                case EFFECT_ANGER:
                    stream.readShort();
                    break;
                case EFFECT_ATTACK_NUM:
                    stream.readShort();
                    break;
                case EFFECT_DEFENSE_PRO:
                case EFFECT_LOSE_TIME:
                case EFFECT_UP_LIFE:
                case EFFECT_REGAIN_MP:     
                    stream.readShort();
                    break;
                case EFFECT_UP_AVOID:
                    stream.readShort();
                    break;
                case EFFECT_BIG_FIGHT:
                    stream.readShort();
                    break;
                case EFFECT_UP_HIT:
                case EFFECT_MOVE_SPEED:
                    stream.readShort(); 
                    break;
                case ATTACK_THROW:
                    int aniId = stream.readShort();
                    int roleCnt = stream.readByte();
                    break;                    
                case EFFECT_CHANGE_IMAGE:
                    int imgIdx = stream.readShort();
                    int imgId = stream.readShort();
                    break;
            }
        }        
    }
    
//    public void runSkillEffort(Role role)
//    {
//        stream.setData(funcs);
//        int funcCnt = stream.readByte();
//        Actor actor = GameContext.actor;
//        for(int i = 0; i < funcCnt; i++) {
//            int skillType = stream.readByte() & 0xff;            
//            switch(skillType)
//            {
//                case ATTACK_UP_TYPE:
//                    stream.readShort();
//                    break;
//                case EFFECT_ANGER:
//                    stream.readShort();
//                    break;                    
//                case EFFECT_ATTACK_NUM:
//                    stream.readShort();
//                    break;
//                case EFFECT_DEFENSE_PRO:
//                case EFFECT_LOSE_TIME:
//                case EFFECT_UP_LIFE:
//                case EFFECT_REGAIN_MP:     
//                    stream.readShort();
//                    break;
//                case EFFECT_UP_AVOID:
//                    stream.readShort();
//                    break;                    
//                case EFFECT_BIG_FIGHT:
//                    stream.readShort();
//                    break;                    
//                case EFFECT_UP_HIT:
//                case EFFECT_MOVE_SPEED:
//                    stream.readShort();  
//                    break;
//                case ATTACK_THROW:
//                    stream.readShort();
//                    stream.readByte();
//                    break;                    
//                case EFFECT_CHANGE_IMAGE:
//                    stream.readShort();
//                    stream.readShort();
//                    break;
//            }
//        }        
//    }
    
    /**
     * 开始就运行的技能功能
     */
    public void startSkillEffort()
    {
        if(isStart)
        {
            return;
        }
        isStart = true;
        stream.setData(funcs);
        int funcCnt = stream.readByte();
        Actor actor = GameContext.actor;
        for(int i = 0; i < funcCnt; i++) {
            int skillType = stream.readByte() & 0xff;
            switch (skillType)
            {
                case ATTACK_UP_TYPE:
                    stream.readShort();
                    break;
                case EFFECT_ANGER:
                    break;                    
                case EFFECT_ATTACK_NUM:
                    stream.readShort();
                    break;
                case EFFECT_DEFENSE_PRO:
                case EFFECT_LOSE_TIME:
                case EFFECT_UP_LIFE:
                case EFFECT_REGAIN_MP:     
                    stream.readShort();
                    break;
                case EFFECT_UP_AVOID:
                    stream.readShort();
                    break;                    
                case EFFECT_BIG_FIGHT:
                    stream.readShort();
                    break;                    
                case EFFECT_UP_HIT:
                case EFFECT_MOVE_SPEED:
                    int data = stream.readShort();  
                    break;
                case ATTACK_THROW:
                    int aniId = stream.readShort();
                    int roleCnt = stream.readByte();
                    break;                    
                case EFFECT_CHANGE_IMAGE:
                    int imgIdx = stream.readShort();
                    int imgId = stream.readShort();
                    break;
            }
        }
    }
}
