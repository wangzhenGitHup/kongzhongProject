/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class FishStream {
    byte[] data;
    int offset;
    
    public FishStream() {
    }
    
    public FishStream(byte[] data) {
        setData(data);
    }
    
    public void setData(byte[] data) {
        this.data = data;
        offset = 0;
    }
    
    public void init()
    {
        offset = 0;
    }
    
    public byte readByte() {
        return data[offset++];
    }
    
    public short readShort() {
        short ret = (short)(((data[offset] & 0xFF) << 8) | (data[offset + 1] & 0xFF));
        offset += 2;
        return ret;
    }
    
    public int readInt() {
        int ret = ((data[offset] & 0xFF) << 24) | ((data[offset + 1] & 0xFF) << 16) | ((data[offset + 2] & 0xFF) << 8) | (data[offset + 3] & 0xFF);
        offset += 4;
        return ret;
    }

    public long readLong() {
        long ret = ((data[offset] & 0xFFL) << 56) | ((data[offset + 1] & 0xFFL) << 48)
	| ((data[offset + 2] & 0xFFL) << 40) | ((data[offset + 3] & 0xFFL) << 32) | ((data[offset + 4] & 0xFFL) << 24)
	| ((data[offset + 5] & 0xFFL) << 16) | ((data[offset + 6] & 0xFFL) << 8) | (data[offset + 7] & 0xFFL);
        offset += 8;
        return ret;
    }
    
    public String readUTF() {
        short byteCnt = readShort();
        StringBuffer buf = new StringBuffer();
        int ibyte = offset;
        int byteEnd = byteCnt + ibyte;
        //数据采用UTF8编码
        while(ibyte < byteEnd) {
            //读入第一个byte
            byte b1 = data[ibyte];
            if((b1 & 0x80) == 0) {
                buf.append((char)b1);
                ibyte++;
                continue;
            }
            
            if((b1 & 0xE0) == 0xE0) {
                byte b2 = data[ibyte + 1];
                byte b3 = data[ibyte + 2];
                
                int val = ((b1 & 0x0F) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F);
                buf.append((char)val);
                ibyte += 3;
                continue;
            }
            
            if((b1 & 0xC0) == 0xC0) {
                byte b2 = data[ibyte + 1];
                
                int val = ((b1 & 0x1F) << 6) | (b2 & 0x3F);
                buf.append((char)val);
                ibyte += 3;
                continue;
            }
        }
        
        offset += byteCnt;
        return buf.toString();
    }
    
    public void skip(int bytes) {
        offset += bytes;
    }
    
    public boolean readBoolean() {
        return readByte() == 1;
    }
    
    public char readChar() {
        char ret = (char)((data[offset] << 8) | (data[offset + 1] & 0xff));
        offset += 2;
        return ret;
    }
    
    public byte read() {
        return readByte();
    }
}
