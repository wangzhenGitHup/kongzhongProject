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
public class BossSpeakActionParam {
    public char[] chs;
    //存储每行的开始和结束
    int[] parts;
    
    public int color;
    public String soundFile;
    
    public void load(DataInputStream dataIn) throws IOException {
        chs = dataIn.readUTF().toCharArray();
        //把文字分成行，用&分割
        int ipart = 0;
        int start = 0;
        int len = 0;
        
        final int CACHE_SIZE = 10;
        int[] cache = new int[CACHE_SIZE];
        
        for(int i = 0, size = chs.length; i < size; i++) {
            char ch = chs[i];
            if(ch == '&') {
                cache[ipart] = start;
                cache[ipart + 1] = len;
                ipart += 2;
                start = i + 1;
                len = 0;
                continue;
            }
            len++;
        }
        if(len > 0) {
            cache[ipart] = start;
            cache[ipart + 1] = len;
            ipart += 2;
        }
        
        parts = new int[ipart];
        System.arraycopy(cache, 0, parts, 0, ipart);
        
        color = dataIn.readInt();
        soundFile = dataIn.readUTF();
    }
}
