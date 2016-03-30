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
public class AttackActionParam {
    //攻击动作
    RoleAction act;
    //攻击效果
    AttackEffect effect;
    //攻击是否击飞
    boolean flying;
    //攻击提升百分比
    int upgrade;
    //攻击持续时间
    int duration;
    
    public void load(DataInputStream dataIn) throws IOException {
        act = RoleAction.loadAction(dataIn);
        effect = AttackEffect.loadEffect(dataIn);
        flying = dataIn.readBoolean();
        upgrade = dataIn.readShort();
        duration = (dataIn.readByte() & 0xff) * 1000;
    }
}
