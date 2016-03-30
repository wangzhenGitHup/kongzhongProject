/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.IOException;

/**
 * 变速运动的行为数据
 * @author 何召卫@fishfly.com
 */
public class SpeedRoleAction extends RoleAction {
    //一个方向有组动画，就有n组效果数组，四个方向共用效果数组
    byte[] effects;
    
    //aniCnt个偏移量
    short[] effectOffsets;
    
    HashtableShort speedMap;
    
    public void load(DataInputStream dataIn) throws IOException {
        type = (byte)dataIn.read();
        
        //#if PRINTDEBUG == 1
        System.out.println("载入变速行为：" + type);
        //#endif
        //每个方向动画个数
        aniCnt = dataIn.read();
        prepareOffsets();
        //全部动画个数
        int actCnt = aniCnt << 2;
        
        speedMap = new HashtableShort(actCnt);
        acts = new short[actCnt];
        effectOffsets = new short[aniCnt];
        
        byte[][] efs = new byte[aniCnt][];
        
        short effectIdx = 0;
        
        for(int iani =0; iani < aniCnt; iani++)
        {
            //无效数据
            dataIn.read();
            
            int actStart = 0;
            for (int idir = 0; idir < PaintUnit.DIR_CNT; idir++)
            {
                aniId = dataIn.readShort();
                short actId = dataIn.readShort();
                acts[actStart + iani] = actId; 

                int speedCnt = dataIn.readByte();
                //#if PRINTDEBUG == 1
//                System.out.println("变速运动数据:" + actId + " 速度个数:" + speedCnt);
//                if(actId == 28) {
//                    System.out.println("here");
//                }
                //#endif
                if (speedCnt > 0)
                {
                    byte[] actSpeeds = new byte[speedCnt];
                    
                    for (int ispeed = 0; ispeed < speedCnt; ispeed++)
                    {
                        actSpeeds[ispeed] = dataIn.readByte();
                    }
                    speedMap.put(actId, actSpeeds);
                } 
                /*else {
                    speedMap.put(actId, null);
                }*/
                actStart += aniCnt;
            }
            
            int effectLen = dataIn.readByte();
            efs[iani] = new byte[effectLen];
            effectOffsets[iani] = effectIdx;
            for (int ieffect = 0; ieffect < effectLen; ieffect++)
            {
                byte effect = dataIn.readByte();
                efs[iani][ieffect] = effect;
                effectIdx++;
            }
        }
        
        if(effectIdx == 0) {
            effectOffsets = null;
            effects = null;
            return;
        }
        
        effects = new byte[effectIdx];
        
        effectIdx = 0;
        for(int iani = 0; iani < aniCnt; iani++)
        {
            byte[] actEffects = efs[iani];
            System.arraycopy(actEffects, 0, effects, effectIdx, actEffects.length);
            effectIdx += actEffects.length;
        }
        
        //载入动画
        AnimationManager.getInstance().preloadAnimation(aniId);
    }
    
    public void updateSpeed(Role role) {
        byte[] actSpeeds = (byte[])speedMap.get(role.actId);
        if(actSpeeds == null || role.frameId >= actSpeeds.length) {
            role.speed = 0;
            return;
        }
        
        //#if PRINTDEBUG == 1
//        if(role.frameId >= actSpeeds.length) {
//            System.out.println("frameId:" + role.frameId + ", actSpeeds szie:" + actSpeeds.length);
//        }
        //#endif 
        
        role.speed = actSpeeds[role.frameId];
    }
    
    /**
     * 查找当前方向上的第一个速度值
     * @param dir
     * @return
     */
    public int getSpeed(int dir) {
        short actId = getAnimation(dir, 0);
        byte[] actSpeeds = (byte[])speedMap.get(actId);
        if(actSpeeds == null) {
            return 0;
        }
        
        return actSpeeds[0];
    }
    
    public int getEffect(int idx, int frameIdx) {
        int index = effectOffsets[idx] + frameIdx;
        if(index >= effects.length)
        {
            return 0;
        }
        return effects[index];
    }
}
