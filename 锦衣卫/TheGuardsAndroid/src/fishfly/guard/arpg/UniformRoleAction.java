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
public class UniformRoleAction extends RoleAction {
    int speedX;
    int speedY;
    
    public UniformRoleAction() {
    }
    
    public void changeSpeed(int data)
    {
        speedX += data;
        speedY += data;
    }
    
    public void setSpeed(int data)
    {
        speedX = data;
        speedY = data;
    }
    
    public void load(DataInputStream dataIn) throws IOException {
        type = (byte)dataIn.read();
        //#if PRINTDEBUG == 1
        System.out.println("载入恒速行为：" + type);
        //#endif
        boolean movable = dataIn.readBoolean();
        
        if(movable) {
            speedX = (byte)(dataIn.read() & 0xff);
            speedY = (byte)(dataIn.read() & 0xff);
        }
        
        int iact = 0;
        
        for(int idir = 0; idir < PaintUnit.DIR_CNT; idir++) {
            aniCnt = (short)dataIn.read();
            if(acts == null) {
                acts = new short[aniCnt << 2];
            }
            
            for(int iani = 0; iani < aniCnt; iani++) {
                aniId = dataIn.readShort();
                acts[iact] = dataIn.readShort();
                iact++;
            }
        }
        
        prepareOffsets();
        //载入动画
        AnimationManager.getInstance().preloadAnimation(aniId);
    }
    
    public void updateSpeed(Role role) {
        if(speedX == 0 && speedY == 0) {
            role.speed = 0;
            return;
        }
        
        switch(role.dir) {
            case PaintUnit.UP:
            case PaintUnit.DOWN:
                role.speed = speedX;
                break;
                
            case PaintUnit.LEFT:
            case PaintUnit.RIGHT:
                role.speed = speedY;
                break;
        }
    }
    
    public int getSpeed(int dir) { 
        if(speedX == 0 && speedY == 0) {
            return 0;
        }
        
        switch(dir) {
            case PaintUnit.UP:
            case PaintUnit.DOWN:
                return speedX;
                
            case PaintUnit.LEFT:
            case PaintUnit.RIGHT:
                return speedY;
        }
        return 0;
    }
}
