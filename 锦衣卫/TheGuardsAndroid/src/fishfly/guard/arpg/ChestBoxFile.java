/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;

/**
 * 宝箱数据
 * @author 胡阳@fishfly.com
 */
public class ChestBoxFile {
    
    /**
     * 待机动画
     */
    short aniId;
    short aliveActUp;
    short aliveActDown;
    short aliveActLeft;
    short aliveActRight;
    /**
     * 死亡动画
     */
    short dieAct;
    int id;
    
    void load(String roleFile) {
        try {
            RoleManager roleMgr = RoleManager.getInstance();
            DataInputStream dataIn = roleMgr.openFile(roleFile);
            //#if PRINTDEBUG == 1
            if(dataIn == null) {
                System.out.println("打开文件为空roleFile:#" + roleFile + "#");
            }
            //#endif
            dataIn.readShort();
            dataIn.readUTF();
            UniformRoleAction aliveAction = (UniformRoleAction)
                    (RoleAction.loadAction(dataIn));   
            aniId = aliveAction.aniId;
            AnimationManager aniMgr = AnimationManager.getInstance();
            aniMgr.preloadAnimation(aniId);
            aliveActUp = aliveAction.getAnimation(0, 0);
            aliveActDown = aliveAction.getAnimation(0, 1);
            aliveActLeft = aliveAction.getAnimation(0, 2);
            aliveActRight = aliveAction.getAnimation(0, 3);
            
            UniformRoleAction dieAction = (UniformRoleAction)(RoleAction.loadAction(dataIn));
            if(dieAction != null) {
                dieAct = dieAction.getAnimation(0, 0);
            }
            dataIn.close();
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    public short getAliveAction(int dir) {
        switch(dir) {
            case PaintUnit.UP:
                return aliveActUp;
                
            case PaintUnit.DOWN:
                return aliveActDown;
                
            case PaintUnit.LEFT:
                return aliveActLeft;
                
            case PaintUnit.RIGHT:
                return aliveActRight;
        }
        return aliveActDown;
    }
}
