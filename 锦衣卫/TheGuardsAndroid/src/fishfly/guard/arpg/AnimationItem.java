/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.IOException;
import javax.microedition.lcdui.Image;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class AnimationItem {
    public int id;
    public String fileName;
    boolean single = true;
    short imageId;
    String palPath;
    
    public short[] imgIds;
    public String[] pals;
    
    public void load(DataInputStream dataIn) throws IOException {
        fileName = dataIn.readUTF();
        int imgCnt = dataIn.readByte();
        boolean hasPal = false;
        if(imgCnt == 1) {
            imageId = dataIn.readShort();
            hasPal = dataIn.readBoolean();
            if(hasPal) {
                palPath = dataIn.readUTF();
            }
            return;
        }
        
        single = false;
        imgIds = new short[imgCnt];
        pals = new String[imgCnt];
        
        for(int imgIdx = 0; imgIdx < imgCnt; imgIdx++) {
            imgIds[imgIdx] = dataIn.readShort();
            hasPal = dataIn.readBoolean();
            if(hasPal) {
                pals[imgIdx] = dataIn.readUTF();
            }
        }
    }
    
    public void prepareImages(PaintUnit unit) {
        if(unit.imgReady) {
            return;
        }

        try {
            if(single) {
                unit.singleImg = true;
                unit.img = getImage(imageId, palPath);
                return;
            }
            
            int imgCnt = imgIds.length;
            String pal = null;
            short imgId = 0;
            unit.singleImg = false;

            Image[] imgs = new Image[imgCnt];
            int[] heights = new int[imgCnt];
            int height = 0;
            for(int imgIdx = 0; imgIdx < imgCnt; imgIdx++) {
                imgId = imgIds[imgIdx];
                pal = pals[imgIdx];

                imgs[imgIdx] = getImage(imgId, pal);
                height += imgs[imgIdx].getHeight();
                heights[imgIdx] = height;
            }
            
            unit.imgs = imgs;
            AnimationFile ani = unit.ani;
            int modCnt = ani.getModuleCount();
            int[] modImgs = new int[modCnt];
            int modImg = 0;
            int modY = 0;
            
            for(int imod = 0; imod < modCnt; imod++) {
                modY = ani.getModuleY(imod);
                
                modImg = getImage(heights, modY, 0, imgCnt - 1);
                
                modImgs[imod] = modImg;
                if(modImg > 0) {
                    modImgs[imod] |= (heights[modImg - 1] << 16);
                }
            }
            unit.modImgs = modImgs;
            unit.imgReady = true;
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    private int getImage(int[] heights, int y, int start, int end) {
        int mid = 0;
        while(start <= end) {
            if(hasModule(heights, start, y)) {
                return start;
            }
            if(hasModule(heights, end, y)) {
                return end;
            }
            mid = (start + end) >> 1;
            if(hasModule(heights, mid, y)) {
                return mid;
            }
            
            if(heights[mid] > y) {
                end = mid - 1;
                start = start + 1;
                continue;
            }
            
            start = mid + 1;
            end = end - 1;
        }
        
        return 0;
    }
    
    private boolean hasModule(int[] heights, int idx, int y) {
        int upLine = 0;
        if(idx > 0) {
            upLine = heights[idx - 1];
        }
        int downLine = heights[idx];
        return (y >= upLine && y < downLine);
    }
    
    private Image getImage(short imgId, String pal) throws IOException {
        Image img = null;
        ImageManager imgMgr = ImageManager.getInstance();
        if(pal != null) {
            byte[] imgBytes = imgMgr.getImageBytes(imgId);
            byte[] palBytes = Util.readFully("/" + pal);
            img = Util.changePalette(imgBytes, palBytes);
        } else {
            img = imgMgr.getImage(imgId);
        }
        return img;
    }
}
