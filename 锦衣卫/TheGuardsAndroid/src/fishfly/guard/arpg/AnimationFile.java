package fishfly.guard.arpg;

/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
import java.io.DataInputStream;
import java.io.IOException;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.game.Sprite;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class AnimationFile {
    //ACTION
    private static final int ACT_DURATION_IDX = 0;
    private static final int ACT_SEQ_ID_IDX = 1;
    
    //FRAME sprite
    private static final int FRAME_MOD_ID_IDX = 0;
    private static final int FRAME_FLIP_TYPE_IDX = 1;
    private static final int FRAME_SPRITE_X_IDX = 2;
    private static final int FRAME_SPRITE_Y_IDX = 3;
    
    //框的数组下标常量
    private static final int BOX_LEFT_X_IDX = 0;
    private static final int BOX_TOP_Y_IDX = 1;
    private static final int BOX_RIGHT_X_IDX = 2;
    private static final int BOX_BOTTOM_Y_IDX = 3;
    short id;
    
    byte[] actionDurations;
    short[] actionFrameIds;
    byte[] sequenceCnts;
    short[] actionOffsets;
    
    short[] frames;
    //记录每帧sprite的个数
    byte[] sprites;
    short[] frameOffsets;
    
    //攻击框标记
    int[] attackFlags;
    
    //碰撞框标记
    int[] bodyFlags;
    
    //攻击框
    short[] attackBoxs;
    
    //碰撞框
    byte[] bodyBoxs;
    
    //绘制框
    byte[] paintBoxs;
    
    public short[] modulePositions;
    public short[] moduleSizes;
   
    public AnimationFile(DataInputStream dataIn) {
        try {
            load(dataIn);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    public int getModuleCount() {
        return moduleSizes.length >> 1;
    }
    
    public int getModuleY(int imod) {
        int idx = imod << 1;
        return modulePositions[idx + 1];
    }
    
    private void load(DataInputStream dataIn) throws IOException {
        //载入modules
        readModules(dataIn);
        readFrames(dataIn);
        readActions(dataIn);
        dataIn.close();
    }
    
    private void readModules(DataInputStream dataIn) throws IOException {
        int modCnt = dataIn.readShort();
        
        //数据个数为modCnt * 4
        int dataCnt = modCnt << 1;
        modulePositions = new short[dataCnt];
        moduleSizes = new short[dataCnt];
        for(int imod = 0; imod < modCnt; imod++) {
            int idx = imod << 1; 
            modulePositions[idx] = dataIn.readShort();
            modulePositions[idx + 1] = dataIn.readShort();
            moduleSizes[idx] = (short)(dataIn.readShort() & 0xFFFF);
            moduleSizes[idx + 1] = (short)(dataIn.readShort() & 0xFFFF);
        }
    }
    
    private void readFrames(DataInputStream dataIn) throws IOException  {
        int frameCnt = dataIn.readShort();
        
        sprites = new byte[frameCnt];
        frameOffsets = new short[frameCnt];
        
        int flagCnt = (frameCnt >> 5) + 1;
        attackFlags = new int[flagCnt];
        bodyFlags = new int[flagCnt];
        attackBoxs = new short[frameCnt << 2];
        bodyBoxs = new byte[frameCnt << 2];
        paintBoxs = new byte[frameCnt << 2];
        
        int frameDataLen = 0;
        short[][] fs = new short[frameCnt][];
        
        short offset = 0;
        for(int iframe = 0; iframe < frameCnt; iframe++) {
            int idx = iframe  << 2;
            readBox(dataIn, paintBoxs, idx);
            
            boolean hasAttackBox = dataIn.readBoolean();
            if(hasAttackBox) {
                setFlag(attackFlags, iframe);
            }
            //忽略攻击框的数据
            if(hasAttackBox) {
                readBox(dataIn, attackBoxs, idx);
            }

            //忽略碰撞框的数据
            boolean hasBodyBox = dataIn.readBoolean();
            if(hasBodyBox) {
                setFlag(bodyFlags, iframe);
            }
            if(hasBodyBox) {
                readBox(dataIn, bodyBoxs, idx);
            }
            
            short spriteCnt = dataIn.readShort();
            sprites[iframe] = (byte)(spriteCnt & 0xFF);
            frameOffsets[iframe] = offset;
            offset += spriteCnt;
            short sp[] = new short[spriteCnt << 2];
            fs[iframe] = sp;
            frameDataLen += (spriteCnt << 2);
            for(int isprite = 0; isprite < spriteCnt; isprite++) {
                int is = isprite << 2;
                sp[is] = dataIn.readShort();
                
                sp[is + 1] = dataIn.readByte();
                
                sp[is + 2] =  dataIn.readShort();
                
                sp[is + 3] = dataIn.readShort();
            }
        }
        
        frames = new short[frameDataLen];
        int i = 0;
        for(int ifs = 0; ifs < frameCnt; ifs++) {
            for(int imod = 0, size = fs[ifs].length; imod < size; imod++) {
                frames[i] = fs[ifs][imod];
                i++;
            }
        }
        fs = null;
    }
    private void readBox(DataInputStream dataIn, short[] boxs, int idx) throws IOException {
        boxs[idx + BOX_LEFT_X_IDX] = dataIn.readShort();
        boxs[idx + BOX_TOP_Y_IDX] = dataIn.readShort();
        boxs[idx + BOX_RIGHT_X_IDX] = dataIn.readShort();
        boxs[idx + BOX_BOTTOM_Y_IDX] = dataIn.readShort();
    }
    private void readBox(DataInputStream dataIn, byte[] boxs, int idx) throws IOException {
        byte buf1 = (byte)dataIn.readShort();
        byte buf2 = (byte)dataIn.readShort();
        byte buf3 = (byte)dataIn.readShort();
        byte buf4 = (byte)dataIn.readShort();
        boxs[idx + BOX_LEFT_X_IDX] = (buf1 < Byte.MIN_VALUE) ? Byte.MIN_VALUE : (byte) buf1;
        boxs[idx + BOX_TOP_Y_IDX] = (buf2 < Byte.MIN_VALUE) ? Byte.MIN_VALUE : (byte) buf2;
        boxs[idx + BOX_RIGHT_X_IDX] = (buf3 > Byte.MAX_VALUE) ? Byte.MAX_VALUE : (byte) buf3;
        boxs[idx + BOX_BOTTOM_Y_IDX] = (buf4 > Byte.MAX_VALUE) ? Byte.MAX_VALUE : (byte) buf4;
    }
    
    
    private boolean hasFlag(int[] flags, int index) {
        //首先计算是第几个int
        int intIdx = index >> 5;
        //然后计算是第几位
        int ibit = index & 0x1F;
        return ((flags[intIdx] >> ibit) & 0x01) != 0;
    }
    
    private void setFlag(int[] flags, int index) {
        //首先计算是第几个int
        int intIdx = index >> 5;
        //然后计算是第几位
        int ibit = index & 0x1F;
        flags[intIdx] |= (0x01 << ibit);
    }
    
    private void readActions(DataInputStream dataIn)  throws IOException {
        int actCnt = dataIn.readShort();
        sequenceCnts = new byte[actCnt];
        actionOffsets = new short[actCnt];
        short offset = 0;
        short[][][] actions = new short[actCnt][][];
        for(int iact = 0; iact < actCnt; iact++) {
            //抛弃名字
            dataIn.readUTF();
            
            short seqCnt = dataIn.readShort();
            
            sequenceCnts[iact] = (byte)(seqCnt & 0xFF);
            actionOffsets[iact] = offset;
            offset += seqCnt;
            
            actions[iact] = new short[seqCnt][2];
            for(int iseq = 0; iseq < seqCnt; iseq++) {
                actions[iact][iseq][ACT_DURATION_IDX] = dataIn.readByte();
                actions[iact][iseq][ACT_SEQ_ID_IDX] = dataIn.readShort();
            }
        }
        
        actionFrameIds = new short[offset];
        actionDurations = new byte[offset];
        for(int iact = 0; iact < actCnt; iact++) {
            short seqCnt = sequenceCnts[iact];
            
            int idx = actionOffsets[iact];
            for(int iseq = 0; iseq < seqCnt; iseq++) {
                actionDurations[idx + iseq] = (byte)(actions[iact][iseq][ACT_DURATION_IDX] & 0xFF);
                
                actionFrameIds[idx + iseq] = actions[iact][iseq][ACT_SEQ_ID_IDX];
            }
        }
        
        actions = null;
    }
    
    /**
     * 获得当前行为的帧数
     * @param actionId
     * @return
     */
    public int getFrameCount(int actionId) {
        if(actionId >= sequenceCnts.length) {
            return 0;
        }
        
        return sequenceCnts[actionId];
    }
    
    public void changeFrameDuration(int actionId, int frameId, byte newDuration)
    {
        int actionOffset = actionOffsets[actionId];
        actionDurations[actionOffset + frameId] =  newDuration;
    }
    
    public int getFrameDuration(int actionId, int frameId) {
        int actionOffset = actionOffsets[actionId];
        return actionDurations[actionOffset + frameId];
    }
    
    //画特定的帧
    public void drawFrame(Graphics g, int actionId, int frameId, int x, int y, PaintUnit unit) {        
//        System.out.println("draw frame:" + actionId + ":" + frameId + ":" + sequenceCnts[actionId]);
        int frameIdx = getFrameIndex(actionId, frameId);
        
        int frameOffset = (frameOffsets[frameIdx] << 2);
        int spriteCnt = sprites[frameIdx];
        
        for(int isprite = 0; isprite < spriteCnt; isprite++) {
            drawSprite(g, frameOffset, x, y, unit);
            frameOffset += 4;
        }
    }
    
    private int getFrameIndex(int actionId, int frameId) {
        int actionOffset = actionOffsets[actionId];
        
        int frameIdx = actionFrameIds[actionOffset + frameId];
        return frameIdx;
    }
    
    private void drawSprite(Graphics g, int offset, int x, int y, PaintUnit unit) {
        int modId = frames[offset + FRAME_MOD_ID_IDX];
        int flipType = frames[offset + FRAME_FLIP_TYPE_IDX];
        int offsetX = frames[offset + FRAME_SPRITE_X_IDX];
        int offsetY = frames[offset + FRAME_SPRITE_Y_IDX];
        if(offsetX == 0xff || offsetY == 0xff)
        {
            return;
        }
        
        
        int drawFlipType = flipType;
        int anchor = Graphics.LEFT | Graphics.TOP;
        
        switch(flipType) {
            case Sprite.TRANS_MIRROR:
                anchor = Graphics.RIGHT | Graphics.TOP;
                break;
                
            case Sprite.TRANS_MIRROR_ROT180:
                anchor = Graphics.LEFT | Graphics.BOTTOM;
                break;
                
            case Sprite.TRANS_ROT180:
                anchor = Graphics.RIGHT | Graphics.BOTTOM;
                break;

            case Sprite.TRANS_ROT90:
                anchor = Graphics.RIGHT | Graphics.TOP;
                break;
                
            case Sprite.TRANS_MIRROR_ROT270:
                anchor = Graphics.LEFT | Graphics.TOP;
                
                break;
            case Sprite.TRANS_ROT270:
                anchor = Graphics.LEFT | Graphics.BOTTOM;
                break;
                
            case Sprite.TRANS_MIRROR_ROT90:
                anchor = Graphics.RIGHT | Graphics.BOTTOM;
                break;
        }
        
        int idx = modId << 1;
        if(unit.singleImg) {
            Util.drawRegion(g, 
                unit.img, 
                modulePositions[idx],
                modulePositions[idx + 1], 
                (moduleSizes[idx] & 0xFFFF), 
                (moduleSizes[idx + 1] & 0xFFFF), 
                drawFlipType,
                x + offsetX, y + offsetY, 
                anchor);
            return;
        }
        
        //多图的情况
        int imgId = unit.modImgs[modId] & 0xFFFF;
        int modY = modulePositions[idx + 1] - ((unit.modImgs[modId] >> 16) & 0xffff);
        if(unit.imgs[imgId] == null)
        {
            return;
        }
//        try {
        if(unit.imgs[imgId].getWidth() < modulePositions[idx])
        {
            return;
        }
        Util.drawRegion(g,
                unit.imgs[imgId], 
                modulePositions[idx],
                modY, 
                (moduleSizes[idx] & 0xFFFF), 
                (moduleSizes[idx + 1] & 0xFFFF),
                drawFlipType,
                x + offsetX, y + offsetY, 
                anchor);
//        }catch(Exception ex) {
//            ex.printStackTrace();
//            System.out.println("modId:"+modId);
//            System.out.println("imgId:" + imgId);
//            System.out.println("x:" + modulePositions[idx]);
//            System.out.println("modY:" + modY);
//            System.out.println("width:" + (moduleSizes[idx] & 0xFFFF));
//            System.out.println("height:" + (moduleSizes[idx + 1] & 0xFFFF));
//            throw new RuntimeException();
//        }
    }
    
    public Rect getPaintBox(int actId, int frameId, Rect box) {
        int frameIdx = getFrameIndex(actId, frameId);
        copyBox(paintBoxs, frameIdx, box);
        
        return box;
    }
    
    public Rect getBodyBox(int actId, int frameId, Rect box) {
        int frameIdx = getFrameIndex(actId, frameId);
        if(!hasFlag(bodyFlags, frameIdx)) {
            box.setEmpty();
            return box;
        }
        
        copyBox(bodyBoxs, frameIdx, box);
        return box;
    }
    
    public Rect getAttackBox(int actId, int frameId, Rect box) {
        int frameIdx = getFrameIndex(actId, frameId);
        if(!hasFlag(attackFlags, frameIdx)) {
            box.setEmpty();
            return box;
        }
        
        copyBox(attackBoxs, frameIdx, box);
        return box;
    }
    
    private void copyBox(byte[] boxData, int frameIdx, Rect dst) {
        int offset = frameIdx << 2;
        int leftX = boxData[offset + BOX_LEFT_X_IDX];
        int topY = boxData[offset + BOX_TOP_Y_IDX];
        int rightX = boxData[offset + BOX_RIGHT_X_IDX];
        int bottomY = boxData[offset + BOX_BOTTOM_Y_IDX];
        
        dst.set(leftX, topY, rightX, bottomY);
    }
    private void copyBox(short[] boxData, int frameIdx, Rect dst) {
        int offset = frameIdx << 2;
        int leftX = boxData[offset + BOX_LEFT_X_IDX];
        int topY = boxData[offset + BOX_TOP_Y_IDX];
        int rightX = boxData[offset + BOX_RIGHT_X_IDX];
        int bottomY = boxData[offset + BOX_BOTTOM_Y_IDX];

        dst.set(leftX, topY, rightX, bottomY);
    }
}
