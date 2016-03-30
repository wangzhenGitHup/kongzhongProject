/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package javax.microedition.io;

import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author huyang
 */
public class FishFlyInputStream extends InputStream{

    private byte[] buf;

    private int length;

    private int offSet;

    public FishFlyInputStream(byte[] buf)
    {
        this.buf = buf;
        length = buf.length;
        offSet = 0;
    }

    public int available()
    {
        return length - offSet;
    }

    public long skip(long skip)
    {
        int dis = (int) (offSet + skip);
        if(dis >= length)
        {
            offSet = length - 1;
            return skip - (dis - length);
        }
        offSet += skip;
        return skip;
    }

    @Override
    public int read() throws IOException {
        if(offSet >= length)
        {
            return -1;
        }
        return buf[offSet++];
    }

    public int read(byte[] b) throws IOException {
        int curLength = available();
        if(b.length >= curLength)
        {
            System.arraycopy(buf, offSet, b, 0, curLength);
            offSet = length;
            return curLength;
        }
        System.arraycopy(buf, offSet, b, 0, b.length);
        offSet += b.length;
        return b.length;
    }

    public int read(byte[] b, int off, int len) throws IOException {
        int curLength = available();
        if(len >= curLength)
        {
            System.arraycopy(buf, offSet, b, off, curLength);
            offSet = length;
            return curLength;
        }
        System.arraycopy(buf, offSet, b, off, len);
        offSet += len;
        return len;
    }


    public void close()
    {
        buf = null;        
    }

    public void reset()
    {
        offSet = 0;
    }

    public void mark(int readlimit)
    {
        
    }

    public boolean markSupported()
    {
        return true;
    }

}
