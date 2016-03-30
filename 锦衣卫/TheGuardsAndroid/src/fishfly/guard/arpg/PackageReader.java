/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Hashtable;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class PackageReader {
    Hashtable fileMap;
    int[] offsets;
    int[] lens;
    int fileCnt;
    String pkgName;

    int fileIndexCnt;

    //调试用
    //String[] files;
    //调试结束
    boolean loaded;
    Hashtable pkgData = new Hashtable();

    public PackageReader(String idxName, String pkgName) {
        try {
            loadIndex(idxName);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
        this.pkgName = pkgName;
    }

    public boolean contains(String strBuffer) {
        return fileMap.containsKey(strBuffer);
    }

    public void loadIndex(String idxFile) throws IOException {

        DataInputStream dataIn = Util.open(idxFile);
        fileCnt = dataIn.readShort();
        fileMap = new Hashtable(fileCnt << 1);
        offsets = new int[fileCnt];
        lens = new int[fileCnt];
        for(int i = 0; i < fileCnt; i++) {
            String fileName = dataIn.readUTF();
            System.out.println("fileName======================"+fileName);
            lens[i] = dataIn.readInt();
            offsets[i] = dataIn.readInt();
            fileMap.put(fileName, new Integer(i));
            fileIndexCnt = (offsets[i] >> 24) & 0xffff;
        }
        try
        {
            dataIn.close();
        }
        catch (Exception e)
        {
        }
    }

    /**
     * 预载入缓存的文件
     */
    public void preload() {
        if(loaded) {
            return;
        }
        for(int index = 0; index <= fileIndexCnt; index++)
        {
            try
            {
                InputStream in =  Util.openFile(pkgName.substring(0, pkgName.length() - 4) + index + ".pkg");
                byte[] buf = new byte[120000];
                in.read(buf);
                pkgData.put(new Integer(index), buf);
                in.close();
            }
            catch (Exception Exception)
            {
            }
        }
	loaded = true;
    }

    /**
     * 释放缓存的文件
     */
    public void release() {
        loaded = false;
        pkgData = new Hashtable();
    }

    public byte[] readFile(String fileName){
        Integer fileIdxObj = (Integer) fileMap.get(fileName);
        if(fileIdxObj == null) {
            //#if PRINTDEBUG == 1
            System.out.println("没找到文件:" + fileName);
            //#endif
            throw new RuntimeException();
        }
        int fileIdx = fileIdxObj.intValue();
        int fileIndex = (offsets[fileIdx] >> 24) & 0xff;
        byte[] body = null;
        try
        {
            InputStream in = null;
            if (loaded)
            {
                in = new DataInputStream(new ByteArrayInputStream((byte[]) pkgData.get(new Integer(fileIndex))));
            }
            else
            {
                in = Util.openFile(pkgName.substring(0, pkgName.length() - 4) + fileIndex +".pkg");
            }
            in.skip(offsets[fileIdx] & 0xffffff);
            int fileLen = (lens[fileIdx]);
            body = new byte[fileLen];

            int totalReaded = 0;
            while (totalReaded < fileLen)
            {
                int readed = in.read(body, totalReaded, fileLen - totalReaded);
                if (readed > 0)
                {
                    totalReaded += readed;
                }
            }
            in.close();
            return body;
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
        return body;
    }

    public int getFileCount() {
        return fileCnt;
    }
//
//    public byte[] readFile(int i) throws IOException {
//        return readFile(files[i]);
//    }

    public DataInputStream openFile(String fileName) throws IOException {
        ByteArrayInputStream byteIn = new ByteArrayInputStream(readFile(fileName));
        DataInputStream dataIn = new DataInputStream(byteIn);
        return dataIn;
    }

    public int getOffsetStart(String fileName) {
        Integer fileIdxObj = (Integer) fileMap.get(fileName);
        int fileIdx = fileIdxObj.intValue();
        return offsets[fileIdx] & 0xffffff;
    }

    public int getLength(String fileName) {
        Integer fileIdxObj = (Integer) fileMap.get(fileName);
        int fileIdx = fileIdxObj.intValue();
        return (lens[fileIdx]);
    }

}
