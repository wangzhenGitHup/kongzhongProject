/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;

/**
 * 所有字符串统一管理
 * @author 何召卫@fishfly.com
 */
public class StringManager {
    private static StringManager instance;
    private short[] ids;
    
    private short[] offsets;
    private short[] lens;
    private char[] chs;
    
    public static StringManager getInstance() {
        if(instance == null) {
            instance = new StringManager();
        }
        return instance;
    }
    
    private StringManager() {
        load();
    }
    
    private void load() {
        try {
            StringBuffer buf = new StringBuffer("/txt");
//            //#if POINT == 1
//            buf.append("_point");
//            //#endif
            buf.append(".dat");
            final String PATH = buf.toString();
            DataInputStream dataIn = Util.open(PATH);
            int dataLen = dataIn.readShort();
            byte[] data = new byte[dataLen];
            dataIn.readFully(data);
            
            byte[] dataOut = Util.decryptData(data);
            try
            {
                dataIn.close();
            }
            catch (Exception e)
            {
            }
            
            ByteArrayInputStream byteIn = new ByteArrayInputStream(dataOut);
            dataIn = new DataInputStream(byteIn);
            int txtLen = dataIn.readShort();
            chs = new char[txtLen];
            for(int ich = 0; ich < txtLen; ich++) {
                chs[ich] = dataIn.readChar();
            }
            
            int itemCnt = dataIn.readShort();
            ids = new short[itemCnt];
            offsets = new short[itemCnt];
            lens = new short[itemCnt];
            
            for(int i = 0; i < itemCnt; i++) {
                ids[i] = dataIn.readShort();
                
                offsets[i] = dataIn.readShort();
                lens[i] = dataIn.readShort();
            }
            
            try
            {
                dataIn.close();
            }
            catch (Exception e)
            {
            }
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    /**
     * 创建一个所求字符串的数组复制
     * 因会创建对象，请勿频繁调用获取同一个字符串
     * 严禁在刷屏显示字符串时调用，会拖慢系统性能
     * @param id
     * @return
     */
    public char[] getString(short id) {
        int idx = HashtableShort.findKey(ids, id);
        if(idx < 0) {
            return null;
        }
        
        int offset = offsets[idx];
        int len = lens[idx];
        
        char[] txt = new char[len];
        for(int i = 0; i < len; i++) {
            txt[i] = chs[offset + i];
        }
        return txt;
    }
    
    /**
     * 把对应字符串复制到buf中
     * @param id
     * @param buf
     */
    public void copyString(short id, StringBuffer buf) {
        int idx = HashtableShort.findKey(ids, id);
        if(idx < 0) {
            return;
        }
        
        int offset = offsets[idx];
        int len = lens[idx];
        
        for(int i = 0; i < len; i++) {
            buf.append(chs[offset + i]);
        }
    }
}
