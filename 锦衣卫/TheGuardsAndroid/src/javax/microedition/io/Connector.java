/*
 * Copyright(c) 2011 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package javax.microedition.io;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 *
 * @author huyang
 */
public class Connector
{
    public static Connection open(String name)
    {
        if(name.startsWith("sms://"))
        {
            return new MyMessageConnection(name.substring(6));
        }
        return new MyConnection();
    }

    public static Connection open(String name, int mode)
    {
        if(name.startsWith("sms://"))
        {
            return new MyMessageConnection(name.substring(6));
        }
        return new MyConnection();
    }

    public static Connection open(String name, int mode, boolean timeouts)
    {
        if(name.startsWith("sms://"))
        {
            return new MyMessageConnection(name.substring(6));
        }
        return new MyConnection();
    }

    public static DataInputStream openDataInputStream(String name)
    {
        return new DataInputStream(new ByteArrayInputStream(new byte[]{0, 0}));
    }

    public static DataOutputStream openDataOutputStream(String name)
    {
        return new DataOutputStream(new ByteArrayOutputStream());
    }

    public static InputStream openInputStream(String name)
    {
        return new DataInputStream(new ByteArrayInputStream(new byte[]{0, 0}));
    }

    public static OutputStream openOutputStream(String name) 
    {
        return new DataOutputStream(new ByteArrayOutputStream());
    }
          

}
