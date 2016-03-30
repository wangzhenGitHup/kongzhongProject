/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;

/**
 * 箭文件，:)
 * @author 何召卫@fishfly.com
 */
public class ArrowFile {
    int id;
    boolean isEnemy;
    int aliveTime;
    int ap;
    //是否聪明
    boolean isClever;
    //是否自己移动
    boolean isMoveSelf;
    //是否出现在主角身边
    boolean isBeside;
    //是否全屏攻击
    boolean isFullScreenAttack;
    //站立的行为动画
    RoleAction aliveAction;
    //死亡动画
    RoleAction dieAction;
    AttackEffect attackEffect;
    /**
     * 多余的逻辑
     */
    int flag;
    
    /**
     * 是否有线
     * @return
     */
    boolean isHaveLine()
    {
        return (flag & 0x1) == 1;
    }
    
    void load(String fileName)
    {
        try
        {
            DataInputStream dataIn = null;
            dataIn = RoleManager.getInstance().openFile(fileName);
            id = RoleManager.getRoleId(fileName);
//            roleType = 
            dataIn.readShort();
            dataIn.readUTF();
            isEnemy = dataIn.readBoolean();
            isClever = dataIn.readBoolean();
            isBeside = dataIn.readBoolean();
            isFullScreenAttack = dataIn.readBoolean();
            isMoveSelf = dataIn.readBoolean();
            ap = dataIn.readShort();
            int time = dataIn.readShort() & 0xffff;
            flag = dataIn.readShort();
            aliveTime = time / 100;
            attackEffect = AttackEffect.loadEffect(dataIn);
            aliveAction = RoleAction.loadAction(dataIn);
            dieAction = RoleAction.loadAction(dataIn);
            dataIn.close();
        }
        catch (Exception ex)
        {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
}
