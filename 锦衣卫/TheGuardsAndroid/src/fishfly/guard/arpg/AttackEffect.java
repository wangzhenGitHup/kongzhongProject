/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import javax.microedition.lcdui.Graphics;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class AttackEffect {
    //攻击特效
    //没有任何效果
    public static final int EMPTY_EFFECT = 0;
    //持续时间伤害
    public static final int KEEP_HURT_EFFECT = 1;
   //晕眩效果
    public static final int PUZZLE_EFFECT = 2;
    //击退
    public static final int TOUCH_ATTACK_EFFECT = 3;
    //吸收效果
    public static final int SUCK_EFFECT = 4;

    //是否存活
    public boolean isLive = true;
    //起始时间
    public int startFrame;
    //效果类型
    public int effectType;
    //持续时间
    public int keepTime;
    //成功率
    public int sucessProb;

    //效果数据
    public int effectData1;
    //貌似只有一个效果数据，不用第二个了，不过保留在这里，为将来预备，也为扩展功能的时候指引
    public int effectData2;


    public String getDec()
    {
        StringBuffer buf = new StringBuffer();
        buf.append("百分之").append(sucessProb).append("几率");
        if(effectType == KEEP_HURT_EFFECT)
        {
           buf.append("持续掉血");
        }
          if(effectType == TOUCH_ATTACK_EFFECT)
        {
            buf.append("击退敌人一段距离");
        }
        if(effectType == PUZZLE_EFFECT)
        {
           buf.append("让敌人定身");
        }
        return buf.toString();
    }

    /**
     * 是否在几率之内
     * @return
     */
    public boolean isRunLogic()
    {
        if(sucessProb < GameContext.getRand(0, 100))
        {
            return false;
        }
        return true;
    }

    public boolean isCanUseAttackEffect(Npc npc) {
        if (effectType == EMPTY_EFFECT) {
            return false;
        }
        if ((effectType == TOUCH_ATTACK_EFFECT) || (effectType == PUZZLE_EFFECT)) {
            if (npc.keepAttackEffect != null && npc.keepAttackEffect.isLive) {
                npc.keepAttackEffect.delEffect(npc);
            }
            return true;
        }
        if (npc.keepAttackEffect == null || !npc.keepAttackEffect.isLive) {
            //#if PRINTDEBUG == 1
            System.out.println(npc.name + "中效果" + effectType);
            //#endif
            return true;
        }
        if (!npc.file.boss && npc.keepAttackEffect == null) {
            return true;
        }
        return false;
    }

    /**
     * 主角能否受状态
     * @return
     */
    public boolean isCanUseAttackEffect() {
        if (GameContext.actor.keepAttackEffect == null || !GameContext.actor.keepAttackEffect.isLive) {
            return true;
        }
        return false;
    }

    public AttackEffect clone()
    {
        //除了反伤其他的都是有成功几率的
        if(!isRunLogic())
        {
            return null;
        }
        AttackEffect effect = new AttackEffect();
        effect.effectType = effectType;
        effect.keepTime = keepTime;
        effect.sucessProb = sucessProb;
        effect.effectData1 = effectData1;
        effect.effectData2 = effectData2;
        effect.startFrame = MainCanvas.currentFrame;
        return effect;
    }

    /**
     * 删除状态
     * @param role
     */
    public void delEffect(Role role)
    {
        isLive = false;
        if ((effectType == PUZZLE_EFFECT) && (role != null)) {
            role.isMess = false;
        }
        GameContext.actor.isStopKey = false;
        effectType = EMPTY_EFFECT;
    }

    public boolean isDrawPaintUnit() {
        return false;
    }

    public void draw(Graphics g, Role role)
    {
        if(!isLive)
        {
            return;
        }
        if(effectType == EMPTY_EFFECT)
        {
            return;
        }
        PaintUnit paintUnit = null;
        Rect box = new Rect();
        switch(effectType)
        {
            case KEEP_HURT_EFFECT:
                role.getPaintBox(box);
                paintUnit = GameContext.page.attackEffectIcon[0];
                paintUnit.x = role.x;
                paintUnit.y = role.y - box.getHeight();
                break;
            case PUZZLE_EFFECT:
                role.getPaintBox(box);
                paintUnit = GameContext.page.attackEffectIcon[1];
                paintUnit.x = role.x;
                paintUnit.y = role.y - box.getHeight();
                break;
        }
        if(paintUnit == null)
        {
            return;
        }
        paintUnit.paint(g, GameContext.page.offsetX, GameContext.page.offsetY);
    }

    /**
     * role死亡之后启动的攻击效果
     * @param role
     */
    public void logicEnd(Role role)
    {
        if(!isLive)
        {
            return;
        }
        if(keepTime != 0)
        {
            if(MainCanvas.currentFrame - startFrame >= keepTime)
            {
                delEffect(role);
                isLive = false;
                return;
            }
        }
    }

    /**
     * 攻击效果被调用的逻辑
     * @param role
     */
    public void logicPassive(Role role) {
        if (!isLive) {
            return;
        }
    }

    /**
     * 攻击效果持续逻辑
     * @param role
     */
    public void logic(Role role)
    {
        if(!isLive)
        {
            return;
        }
        if(keepTime != 0)
        {
            if (MainCanvas.currentFrame - startFrame >= keepTime) {
                delEffect(role);
                isLive = false;
                return;
            }
        }
        switch(effectType)
        {
            case KEEP_HURT_EFFECT:
                doLogicKeepHurtEffect(role);
                break;
            case TOUCH_ATTACK_EFFECT:
                System.out.println("击退=======");
                doRepelEffect(role);
                break;
            case PUZZLE_EFFECT:
                System.out.println("眩晕=======");
                role.isMess = true;
                if (role.type == Role.TYPE_ACTOR) {
                    GameContext.actor.status = Role.STAND_STATUS;
                    GameContext.actor.changeAction();
                    return;
                }
                if (role.type == Role.TYPE_NPC) {
                    Npc npc = (Npc) role;
                    npc.stopTriggerAction();
                    npc.status = RoleConst.STAND_STATUS;
                    npc.changeAction();
                }
                break;
            case SUCK_EFFECT:
                System.out.println("吸星大法=======");
                 doLogicKeepSuck(role);
                break;
        }
    }

     /**
     * npc被击退
     * @param role
     */
    private void doRepelEffect(Role role)
    {
        isLive = false;
        if (role.status == Role.DEFENSE_STATUS || role.status == Role.FALL_STATUS) {
            return;
        }
        int x = role.x;
        int y = role.y;
        if (role.dir == Role.RIGHT) {
            x -= effectData1;
        }
        else if (role.dir == Role.LEFT) {
            x += effectData1;
        }
        int nextCol = x >> 4;
        int nextRow = y >> 4;
        //下一个位置不是物理层的话
        if(!GameContext.map.canMoveTile(nextCol, nextRow))
        {
            return;
        }
        if (role == GameContext.actor) {
            if(!RoleManager.getInstance().canMove(GameContext.actor, x, y)) {
                //撞上人了
                return;
            }
            GameContext.actor.setPosition(x, y);
            return;
        }
        if(!((Npc)role).file.isIgnorePh && !RoleManager.getInstance().canMoveNpc((Npc)role, x, y)) {
            //撞上人了
            return;
        }
        ((Npc)role).setPosition(x, y);
    }



    /**
     * 攻击效果持续逻辑 持续伤害
     * @param role
     */
    private void doLogicKeepHurtEffect(Role role)
    {
        //没8个周期运行一下
        if(((MainCanvas.currentFrame - startFrame) & 0xf) != 0)
        {
            return;
        }
        int data = effectData1 * GameContext.actor.ap / 100;
        role.hp -= data;
        if (role.hp <= 0)
        {
            role.status = Role.DEAD_STATUS;
            role.changeAction();
        }
        GameContext.page.addAttackedNumber(role, data, false);
    }

    public void save(DataOutputStream out) throws IOException
    {
        out.writeByte(effectType);
        out.writeByte(sucessProb);
        out.writeShort(keepTime);
        out.writeShort(effectData1);
        out.writeShort(effectData2);
    }

    public void load(DataInputStream dataIn) throws IOException {
        effectType = dataIn.readByte();
        sucessProb = dataIn.readByte();
        keepTime = (dataIn.readShort() & 0xffff) / 10;
        effectData1 = dataIn.readShort();
        effectData2 = dataIn.readShort();
    }

    public void load(FishStream dataIn) {
//        effectType = dataIn.readByte();
//        switch (effectType)
//        {
//            case EMPTY_EFFECT:
//                isLive = false;
//                break;
//            case PUZZLE_EFFECT:
//                keepTime = (dataIn.readShort() & 0xffff) / 100;
//                sucessProb = dataIn.readByte();
//                break;
//            case KEEP_HURT_EFFECT:
//                effectData1 = dataIn.readShort() & 0xffff;
//                keepTime = (dataIn.readShort() & 0xffff) / 100;
//                sucessProb = dataIn.readByte();
//                break;
//        }
//        effectType = dataIn.readByte();
//        sucessProb = dataIn.readByte();
//        keepTime = dataIn.readShort();
//        effectData1 = dataIn.readShort();
//        effectData2 = dataIn.readShort();
    }

    public static AttackEffect loadEffect(DataInputStream dataIn) throws IOException {
        AttackEffect effect = new AttackEffect();
        effect.load(dataIn);
        return effect;
    }

    private void doLogicKeepSuck(Role role) {
        int posX = 216;
        int posY = 150;
        //更改方向
        int disX = role.x - posX;
        int disY = role.y - posY;
        if(disX == 0 && disY == 0)
        {
            return;
        }
        int dir = 0;
        //横坐标比纵坐标大的话
        if(Math.abs(disX) > Math.abs(disY))
        {
            if(disX < 0)
            {
                dir = Role.LEFT;
            }
            else
            {
                dir = Role.RIGHT;
            }
        }
        //横坐标比纵坐标小的话
        else
        {
            if(disY < 0)
            {
                dir = Role.UP;
            }
            else
            {
                dir = Role.DOWN;
            }
        }
        if(dir != role.dir)
        {
            role.dir = dir;
            role.changeDir();
        }
        int speed = effectData1;
        int x = role.x;
        int y = role.y;
        if(Math.abs(disX) < speed)
        {
            x = posX;
        }
        else
        {
            x += disX < 0 ? speed : -speed;
        }

        if(Math.abs(disY) < speed)
        {
            y = posY;
        }
        else
        {
            y += disY < 0 ? speed : -speed;
        }

        ((Actor)role).setPosition(x, y);
    }
}
