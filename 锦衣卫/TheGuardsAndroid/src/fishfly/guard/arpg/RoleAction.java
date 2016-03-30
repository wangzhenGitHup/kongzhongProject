/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.IOException;

/**
 *
 * @author 何召卫@fishfly.com
 */
public abstract class RoleAction {
    public static final int UNIFORM_ACTION = 0;
    public static final int SPEED_ACTION = 1;
    
    /**
     * 无效果
     */
    public static final int NO_EFFECT = 0;

    /**
     * 屏幕全白
     */
    public static final int SCREEN_DARK = 1;

    /**
     * 屏幕全黑
     */
    public static final int SCREEN_BLACK = 2;

    /**
     * 震屏
     */
    public static final int VIBRATION = 3;

    /**
     * 停顿
     */
    public static final int SLEEP = 4;

    /**
     * 同伴技能效果
     */
    public static final int USE_SKILL1 = 5;
    public static final int USE_SKILL2 = 6;
    public static final int USE_SKILL3 = 7;
    public static final int USE_SKILL4 = 8;
    public static final int USE_SKILL5 = 9;
    public static final int USE_SKILL6 = 10;
    public static final int USE_SKILL7 = 11;
    public static final int USE_SKILL8 = 12;
    public static final int USE_SKILL9 = 13;
    public static final int USE_SKILL10 = 14;
    public static final int USE_SKILL11 = 15;
    public static final int USE_SKILL12 = 16;
    public static final int USE_SUPER_SKILL1 = 19;
    public static final int USE_SKILL13 = 20;
    /**
     * 主角投掷物
     */
    public static final int ATTACK_THROW = 17;
    public static final int ATTACK_THROW2 = 18;

    //敌人技能效果
    public static final int ENEMY_ATTACK1 = 21;
    public static final int ENEMY_ATTACK2 = 22;
    public static final int ENEMY_ATTACK3 = 23;
    public static final int ENEMY_ATTACK4 = 24;

    //保留功能
    public static final int EFFECT_1 = 25;
    public static final int EFFECT_2 = 26;
    public static final int EFFECT_3 = 27;
    public static final int EFFECT_4 = 28;
    
    int type;
    short aniId;
    
    //每个方向动画个数
    int aniCnt;
    //四个方向集中放在一个数组里, 根据方向和aniCnt可以计算偏移量
    short[] acts;
    //在四个方向上的索引，避免乘法运算
    int actOffsets;
    
    /**
     * 判断动作是否是空的
     * @return
     */
    public boolean isActEmpty()
    {
        return aniCnt == 0;
    }
    
    public abstract void load(DataInputStream dataIn) throws IOException;
    public abstract void updateSpeed(Role role);
    /**
     * 更改这个动作的速度
     * @param data
     */
    public void changeSpeed(int data){};
    
    public void setSpeed(int data){};
    /**
     * 获得此方向第一个行为第一帧的速度
     * @param dir
     * @return
     */
    public abstract int getSpeed(int dir);
    /**
     * 得到某个方向上的动画索引，
     * @param dir
     * @param actIdx表示第几个动画
     * @return
     */
    public short getAnimation(int dir, int actIdx) {
        int actOffset = (actOffsets >> (dir << 3)) & 0xFF;
        return acts[actOffset + actIdx];
    }
    
    void prepareOffsets() {
        short offset = 0;
        for(int idir = 0; idir < PaintUnit.DIR_CNT; idir++) {
            //offset << (idr * 8)
            actOffsets |= offset << (idir << 3);
            offset += aniCnt;
        }
    }
    
    public static RoleAction loadAction(DataInputStream dataIn) throws IOException {
        int type = dataIn.readByte();
        
        RoleAction act = null;
        if(type < 0)
        {
            return null;
        }
        
        switch(type) {
            case UNIFORM_ACTION:
                act = new UniformRoleAction();
                break;
            case SPEED_ACTION:
                act = new SpeedRoleAction();
                break;
        }
        
        act.load(dataIn);
        return act;
    }
    
    /**
     * 当前动作序列的第几个动画
     * @param idx
     * @param fameIdx 第几帧
     * @return
     */
    public int getEffect(int idx, int frameIdx) {
        return -1;
    }
}
