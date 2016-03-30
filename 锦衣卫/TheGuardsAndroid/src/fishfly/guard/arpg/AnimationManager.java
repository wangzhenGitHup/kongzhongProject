/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Hashtable;

/**
 * 管理动画资源，负责动画资源的载入以及相应动画文件的创建
 * @author 何召卫@fishfly.com
 */
public class AnimationManager {
    HashtableShort grpMap;
    
    Hashtable fileMap;
    //#if PKG == 1
//#     public PackageReader aniPkg;
    //#endif
    
    private static AnimationManager instance;
    
    public static AnimationManager getInstance() {
        if(instance == null) {
            instance = new AnimationManager();
        }
        return instance;
    }
    
    private AnimationManager() {
        try {
            //#if PKG == 1
//#             final String ANIS_PATH = "/anis.dat";
//#             aniPkg = new PackageReader("/ani.idx", "/ani.pkg");
            //#else
            final String ANIS_PATH = "/anis/anis.dat";
            //#endif
            
            load(ANIS_PATH);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
        fileMap = new Hashtable(500);
    }
    
    private void load(String fileName) throws IOException {
        DataInputStream dataIn = Util.open(fileName);
        
        int grpCnt = dataIn.readShort();
        
        grpMap = new HashtableShort(grpCnt);
        
        short grpId = 0;
        AnimationItem item = null;
        
        for(int igrp = 0; igrp < grpCnt; igrp++) {
            grpId = dataIn.readShort();
            item = new AnimationItem();
            item.id = grpId;
            grpMap.put(grpId, item);
            item.load(dataIn);
        }
        
        dataIn.close();
    }
    
    public AnimationFile preloadAnimation(short id) {
        AnimationItem item = (AnimationItem)grpMap.get(id);
        if(item == null) {
            //#if PRINTDEBUG == 1
            System.out.println("没找到这个动画文件:" + id);
            //#endif
            return null;
        }
        
        AnimationFile ani = (AnimationFile)fileMap.get(item.fileName);
        if(ani != null) {
            return ani;
        }
        
        try {
            //#if PKG == 1
//#             DataInputStream dataIn = aniPkg.openFile(item.fileName);
//#             if(dataIn == null) {
//#                 dataIn = Util.open("/" + item.fileName);
//#             }
            //#else 
             InputStream in = Util.openFile("/anis/" + item.fileName);
             DataInputStream dataIn = new DataInputStream(in);
            
            //#if PRINTDEBUG == 1
            if(dataIn == null) {
                System.out.println("没找到这个动画:" + item.fileName);
            }
            //#endif
            //#endif
            ani = new AnimationFile(dataIn);
            ani.id = id;
            try
            {
                //#if PKG != 1
                in.close();
                //#endif
                dataIn.close();
            }
            catch (Exception e)
            {
                //#if PRINTDEBUG == 1
                e.printStackTrace();
                //#endif
            }
            //压入缓存
            fileMap.put(item.fileName, ani);
            return ani;
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
        return null;
    }
    
    public void getAnimation(short id, PaintUnit unit) {
        AnimationFile ani = preloadAnimation(id);
        unit.ani = ani;
        AnimationItem item = (AnimationItem)grpMap.get(id);
        //准备图片
        item.prepareImages(unit);
        unit.aniItem = item;
    }
    
    /**
     * 释放指定的动画，在每个界面结束的时候，清理的时候调用
     * @param fileId
     */
    public void release(int fileId) {
        AnimationItem item = (AnimationItem)grpMap.get((short)fileId);
        if(item == null)
        {
            return;
        }
        ImageManager.getInstance().removeImage(item.imageId);
        if(item.imgIds != null)
        {
            ImageManager.getInstance().removeImage(item.imgIds);
        }
        fileMap.remove(item.fileName);
    }

    public void releaseAniOnly(AnimationFile ani)
    {
        if(ani == null) {
            return;
        }
        AnimationItem item = (AnimationItem)grpMap.get(ani.id);
        if(item == null)
        {
            return;
        }
        fileMap.remove(item.fileName);
    }

    public void releaseAni(AnimationFile ani) {
//        fileMap.clear();
        if(ani == null) {
            return;
        }

        release(ani.id);           
    }
}
