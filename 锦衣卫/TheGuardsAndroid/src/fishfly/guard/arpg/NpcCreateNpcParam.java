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
public class NpcCreateNpcParam {
    //创建分身的个数
    int cnt;
    short[] roleIds;
    short[] xs;
    short[] ys;
    
    public void load(DataInputStream dataIn) throws IOException {
        cnt = dataIn.readByte();
        roleIds = new short[cnt];
        
        xs = new short[cnt];
        ys = new short[cnt];
        
        for (int index = 0; index < cnt; index++)
        {
            roleIds[index] = (short)(dataIn.readShort() + 1);
            //最好把相关资源载入
            RoleManager.getInstance().getNpcFile(roleIds[index]);
            xs[index] = dataIn.readShort();
            ys[index] = dataIn.readShort();
        }
    }
    
    public void execute(Npc npc)
    {
        Npc child = null;
        
        RoleManager roleMgr = RoleManager.getInstance();
        
        for (int i = 0, size = roleIds.length; i < size; i++)
        {
            child = new Npc();
            child.file = roleMgr.getNpcFile(roleIds[i]);
            child.isHelper = child.file.helper;
            child.status = Role.STAND_STATUS;
            child.changeAction();
            child.lv = npc.lv;
            child.setDataFromLevel();
            child.dir = npc.dir;
            child.x = npc.x;
            child.y = npc.y;
            //利用随机数保证人物的名字不会重复
            child.name = GameContext.getRand(0, 1000000) + "分身" + i;
            if(xs[i] <= -1000 && ys[i] <= -1000)
            {
                child.x = GameContext.actor.x + xs[i] + 1000;
                child.y = GameContext.actor.y + ys[i] + 1000; 
            }
            else
            {
                child.y = npc.y - ys[i];
                if (npc.dir == Role.UP)
                {
                    child.y = npc.y - xs[i];
                }
                else if (npc.dir == Role.DOWN)
                {
                    child.y = npc.y + xs[i];
                }
                else if (npc.dir == Role.LEFT)
                {
                    child.x = npc.x - xs[i];
                } 
                else if (npc.dir == Role.RIGHT)
                {
                    child.x = npc.x + xs[i];
                }           
            }
            //用来存储初始位置，将来这个位置会被用到，在移动回原位的时候
            child.originalPos = child.x << 16 | child.y;
            child.setFlash(false);
            child.enemy = child.file.enemy;
            //TODO设置分身的朝向以及状态
            roleMgr.addNpc(child);
            if(child.file.isFly)
            {
                GameContext.flyMat.addUnit(child);
                continue;
            }
            if (child.file.isUnderGround)
            {
                GameContext.undergroundMat.addUnit(child);
                continue;
            }
            GameContext.groundMat.addUnit(child);
        }
    }
}
