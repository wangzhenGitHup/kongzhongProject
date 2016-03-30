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
public class NpcArcheryActionParam {
    short[] curDirDis;
    short[] otherDirDis;
    short roleIds[];
    int arrowCnt;
    
    public void load(DataInputStream dataIn) throws IOException {
        arrowCnt = dataIn.readByte();
        roleIds = new short[arrowCnt];
        curDirDis = new short[arrowCnt];
        otherDirDis = new short[arrowCnt];

        for (int index = 0; index < arrowCnt; index++)
        {
            roleIds[index] = (short)(dataIn.readShort() + 1);
            //这里最好预读入箭资源
            RoleManager.getInstance().getArrowFile(roleIds[index]);
            
            curDirDis[index] = dataIn.readShort();
            otherDirDis[index] = dataIn.readShort();
        }
    }
    
    public void execute(Npc npc) {
        if(roleIds == null) {
            return;
        }
        
        RoleManager roleMgr = RoleManager.getInstance();
        for(int i = 0, size = roleIds.length; i < size; i++)
        {
            Arrow arrow = new Arrow();
            arrow.startTime = MainCanvas.curSkillFrame;
            arrow.setFile(roleMgr.getArrowFile(roleIds[i]));
            
            arrow.setDir(npc.dir);
            arrow.setThrowPosition(npc);
            if(npc.dir == Role.UP)
            {
                GameContext.flyMat.updateUnit(arrow, arrow.x, arrow.y - curDirDis[i]-32);// + otherDirDis[i]
            }
            else if(npc.dir == Role.DOWN)
            {
                GameContext.flyMat.updateUnit(arrow, arrow.x , arrow.y + curDirDis[i]);//+ otherDirDis[i]
            }
            else if(npc.dir == Role.LEFT)
            {
                GameContext.flyMat.updateUnit(arrow, arrow.x - curDirDis[i], arrow.y - otherDirDis[i]);
            }
            else
            {
                GameContext.flyMat.updateUnit(arrow, arrow.x + curDirDis[i], arrow.y - otherDirDis[i]);
            }
            
            arrow.ap = npc.ap * arrow.file.ap / 100;
            arrow.setOtherMoveSpeed();
            //#if PRINTDEBUG >= 1
            System.out.println("投掷物id="+roleIds[i]+"; 投掷物的攻击力" + arrow.ap);
            //#endif
            
            //添加到RoleManager里，好进行碰撞处理
            roleMgr.addArrow(arrow);
        }
    }
}
