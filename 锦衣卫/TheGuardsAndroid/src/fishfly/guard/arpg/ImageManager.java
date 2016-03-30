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
public class ImageManager {
    //#if PKG == 1
//#     private static final String ROOT = "/";
    //#else
    private static final String ROOT = "/images/";
    //#endif
    
    private int[] ids;
    private String[] imgNames;
    private String[] palPaths;

    HashtableShort cache = new HashtableShort(50);
    //#if PKG == 1
//#     public PackageReader imgPkg;
    //#endif
    
    private static ImageManager instance;
    
    public static ImageManager getInstance() {
        if(instance == null) {
            instance = new ImageManager();
        }
        return instance;
    }
            
    private ImageManager() {
        loadImages();
    }
    
    private void loadImages() {
        try {
            //#if PKG == 1
//#             final String LIST_NAME = "/images.dat";
            //#else
            final String LIST_NAME = "/images/images.dat";
            //#endif
            DataInputStream dataIn = Util.open(LIST_NAME);
            int imgCnt = dataIn.readShort();
            ids = new int[imgCnt];
            imgNames = new String[imgCnt];
            palPaths = new String[imgCnt];
            String palName = null;
            for(int imgIdx = 0; imgIdx < imgCnt; imgIdx++) {
                ids[imgIdx] = dataIn.readShort();
                imgNames[imgIdx] = dataIn.readUTF();
                palName = dataIn.readUTF();
                if(palName != null && palName.length() == 0) {
                    palName = null;
                } 
                
                if(palName != null) {
                    palName = ROOT + palName;
                }
                
                palPaths[imgIdx] = palName;
            }
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    private String getImagePath(String fileName) {
        StringBuffer pathBuf = new StringBuffer(ROOT);
        //#if EN == 1
//#         pathBuf.append(fileName.substring(0, fileName.length() - 3));
//#         pathBuf.append("fs");
        //#else 
        pathBuf.append(fileName);
        //#endif
        return pathBuf.toString();
    }
    
    private Image getImage(String fileName) throws IOException
    {
        System.out.println("读取图片:" + fileName);
        String imgPath = getImagePath(fileName);
        System.out.println("图片路径为:" + imgPath);
        if (MainCanvas.EN == 0) {
            return Image.createImage(imgPath);
        } else {
            if (imgPath.indexOf(".fs") == -1) {
                int pos = imgPath.indexOf('.');
                String firstPart = imgPath.substring(0, pos);
                StringBuffer buf = new StringBuffer();
                buf.append(firstPart);
                buf.append(".fs");
                imgPath = buf.toString();
            }
            byte[] buf = Util.decryptImage(imgPath);
            return Image.createImage(buf, 0, buf.length);
        }
    }
    
    /**
     * 获得透明图片
     * @param img 不透明图片
     * @param imgGray 灰度图片
     * @return
     */
    public Image getImageFromGray(Image img, Image imgGray)
    {       
        int imgWidth = img.getWidth();
        int imgHeight = img.getHeight();
        int[] data = new int[imgWidth * imgHeight];
        img.getRGB(data, 0, imgWidth, 0, 0, imgWidth, imgHeight);
        int[] dataGray = new int[imgWidth * imgHeight];
        imgGray.getRGB(dataGray, 0, imgWidth, 0, 0, imgWidth, imgHeight);
        for (int index = 0, count = data.length; index < count; index++)
        {
            if((data[index] >> 24) == 0)
            {
                continue;
            }
            //#if N73 || E62
//#             if((data[index]) == 0xffffffff)
//#             {
//#                 data[index] &= 0xffffff;
//#                 continue;
//#             }
            //#endif
            data[index] &= 0xffffff;
            data[index] |= (dataGray[index] & 0xff) << 24;
        }
        return Image.createRGBImage(data, imgWidth, imgHeight, true);
    }
    
    public void clear() {
        cache.clear();
    }    
    
    public void removeImage(short[] imgIds)
    {
        for(int index =0; index < imgIds.length; index++)
        {
            cache.remove(imgIds[index]);
        }
    }
    

    public void removeImage(Image[] img)
    {
        for(int index = 0; index > img.length; index++)
        {
            removeImage(img[index]);
        }
    }
    
    public void removeImage(Image img)
    {
        Image i = null;
        for(int index = 0, count = cache.size(); index < count; index++)
        {
            i = (Image) cache.value(index);
            if(i == img)
            {
                removeImage(cache.key((short)index));
                count = cache.size();
                index --;
            }
        }
    }
    
    public void removeImage(short id)
    {
        cache.remove(id);
    }
    
    private byte[] getImageByteArray(String path)
    {
        try
        {
            String imgPath = getImagePath(path);
            //#if EN == 0
            if (MainCanvas.EN == 1) {
                if (imgPath.indexOf(".fs") == -1) {
                    int pos = imgPath.indexOf('.');
                    String firstPart = imgPath.substring(0, pos);
                    StringBuffer buf = new StringBuffer();
                    buf.append(firstPart);
                    buf.append(".fs");
                    imgPath = buf.toString();
                }
                byte[] buf = Util.decryptImage(imgPath);
                return buf;
            } else {
                return Util.readFully(imgPath);
            }
//            
            //#else
            
            //#endif
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
        
        return null;
    }
    
    public Image getImage(short id) {
        Image img = (Image)cache.get(id);
        if(img != null) {
            return img;
        }
        
        String imgName = getPath(imgNames, id);
        String palPath = getPath(palPaths, id);
        if(imgName == null) {
            return null;
        }

        try {
            if(palPath == null)
            {
                img = getImage(imgName);
            }
            else
            {
                img = getImageFromColor(imgName, palPath);
            }            
            cache.put(id, img);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
            
            try
            {
                return img = getImage(imgName);
            }
            catch (IOException ex1)
            {
                //#if PRINTDEBUG == 1
                ex1.printStackTrace();
                //#endif
            }
        }
        return img;
    }
    
    private Image getImageFromColor(String imageName, String palPath)
    {
        byte[] imgArray = getImageByteArray(imageName);
        byte[] colorArray = Util.readFully(palPath);
        
        return Util.changePalette(imgArray, colorArray);
    }    

    public byte[] getImageBytes(int id) throws IOException {
        String path = getPath(imgNames, id);
        if(path == null) {
            return null;
        }
        //#if PKG == 1
//#         if(imgPkg.contains(path))
//#         {
//#             return imgPkg.readFile(path);
//#         }
        //#endif
        //#if EN == 1
//#         return Util.decryptImage(getImagePath(path));
        //#else
        return Util.readFully(ROOT + path);
        //#endif
    }
    
    private String getPath(String[] paths, int id) {
        int start = 0;
        int end = ids.length - 1;
        
        while(start <= end) {
            if(ids[start] == id) {
                return paths[start];
            }

            if(ids[end] == id) {
                return paths[end];
            }

            int mid = (start + end) >> 1;
            
            if(ids[mid] == id) {
                return paths[mid];
            }
            
            if(ids[mid] > id) {
                end = mid - 1;
                continue;
            }        
            start = mid + 1;
        }
        
        return null;
    }
}
