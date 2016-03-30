/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 * 动作类型
 * @author 何召卫@fishfly.com
 */
public interface RoleConst {
    //攻击
    int ATTACK_STATUS = 0;
    
    //移动
    int MOVE_STATUS = 1;
    
    //站立
    int STAND_STATUS = 2;
    
    //防御
    int DEFENSE_STATUS = 3;
    
    //受伤
    int HURT_STATUS = 4;
    
    //打倒(打死、打飞)
    int FALL_STATUS = 5;
    
    //跳跃
    int JUMP_STATUS = 6;
    
    //死亡
    int DEAD_STATUS = 7;
    
    /**
     * 持刀站立
     */
    int STAND_DAO = 8;

    /**
     * 飞行
     */
    int FLY_STATUS = 9;

    /**
     * 收刀
     */
    int BRAKE_STATUS = 10;
    
    //角色属性
    int HP_ATTR = 0;
    //防御
    int DP_ATTR = 1;
    //攻击力
    int AP_ATTR = 2;
    //魔法值
    int MP_ATTR = 3;
    //攻击间隔
    int ATTACK_INTERVAL_ATTR = 4;
    //暴击
    int BIG_ATTACK_ATTR = 5;
    //命中
    int HIT_ATTR = 6;
    //闪避
    int AVOID_ATTR = 7;

    //经验
    int EXP_ATRR = 8;
    //金钱
    int MONEY_ATTR = 9;
    //技能点
    int FEAT_ATTR = 10;
    
    //移动过程中的身体矩形参数
    int BOX_WIDTH = 20;
    int BOX_HEIGHT = 4;
    int HALF_BOX = BOX_WIDTH >> 1;
}
