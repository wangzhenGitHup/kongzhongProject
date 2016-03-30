/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 *
 * @author 何召卫@fishfly.com
 */
public interface Operand {
    int VALUE_OP = 0;
    int GET_VAR_OP = 1;

    //条件操作数
    int COND_OP = 2;
    int HAS_MISSION = 3;
    int MISSION_FINISH = 4;
    int MISSION_FAIL = 5;
    int HAS_ITEM = 6;
    int HAS_MONEY = 7;
    int CHECK_ATTR = 8;
    int GET_ACTOR_LV = 9;

    void load(FishStream dataIn);
    int getValue();
}
