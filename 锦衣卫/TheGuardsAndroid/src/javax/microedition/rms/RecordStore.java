/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package javax.microedition.rms;

import android.content.Context;
import fishfly.guard.arpg.GameContext;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

/**
 *PC端模拟用，只有接口，没有实现
 * @author jinkui
 */
public class RecordStore {

    final String PATH = "/data/data/fishfly.guard/files/";
    
    private String recordStoreName;
    
    private int storeCnt;
    
    private HashMap<Integer, byte[]> map = new HashMap<Integer, byte[]>();
    
    public RecordStore(String recordStoreName)
    {
        this.recordStoreName = recordStoreName;
        load();
    }
    
    public static RecordStore openRecordStore(String recordStoreName,
                                          boolean createIfNecessary)
                                   throws RecordStoreException,
                                          RecordStoreFullException,
                                          RecordStoreNotFoundException
    {
        return new RecordStore(recordStoreName);
    }

    public int getNumRecords()
                  throws RecordStoreNotOpenException
    {
        return storeCnt;
    }

    public int addRecord(byte[] data,
                     int offset,
                     int numBytes)
              throws RecordStoreNotOpenException,
                     RecordStoreException,
                     RecordStoreFullException
    {
        storeCnt++;
        map.put(new Integer(storeCnt), data);
        return 0;
    }

    public void closeRecordStore()
                      throws RecordStoreNotOpenException,
                             RecordStoreException
    {
        save();
    }

    public byte[] getRecord(int recordId)
                 throws RecordStoreNotOpenException,
                        InvalidRecordIDException,
                        RecordStoreException
    {
        return map.get(new Integer(recordId));
    }

    public void setRecord(int recordId,
                      byte[] newData,
                      int offset,
                      int numBytes)
               throws RecordStoreNotOpenException,
                      InvalidRecordIDException,
                      RecordStoreException,
                      RecordStoreFullException
    {
        map.put(new Integer(recordId), newData);       
    }

    public RecordEnumeration enumerateRecords(RecordFilter filter,
                                          RecordComparator comparator,
                                          boolean keepUpdated)
                                   throws RecordStoreNotOpenException
    {
        return new RecordEnumeration();
    }

    private void load() {
        try {
            File f = new File(PATH + recordStoreName);
            if (!f.exists()) {
                if (!f.getParentFile().exists()) {
                    f.getParentFile().mkdirs();
                }
                f.createNewFile();
                DataOutputStream out = new DataOutputStream(new FileOutputStream(f));
                out.writeInt(0);
                out.close();
                return;
            }

            DataInputStream dataIn = new DataInputStream(new FileInputStream(f));
            storeCnt = dataIn.readInt();
            System.out.println("storeCnt = "+storeCnt);
            for(int index = 0; index < storeCnt; index++)
            {
                int id = dataIn.readInt();
                int length = dataIn.readShort();
                byte[] buf = new byte[length];
                dataIn.readFully(buf);
                map.put(new Integer(id), buf);
            }
            dataIn.close();            
        } catch (Exception e)
        {
            e.printStackTrace();
        }
    }
    
    private void save()
    {
        try
        {
            File f = new File(PATH + recordStoreName);
            if (f.exists())
            {
                f.delete();
            }
//
//            DataOutputStream dataOut = new DataOutputStream(new FileOutputStream(f));

            FileOutputStream outStream = GameContext.display.openFileOutput(recordStoreName,Context.MODE_PRIVATE);
            ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
            DataOutputStream dataOut = new DataOutputStream(byteOut);

            dataOut.writeInt(map.size());
            Set<Integer> keys = map.keySet();
            Iterator i = keys.iterator();
            while(i.hasNext())
            {
                Integer id = (Integer) i.next();
                byte[] buf = map.get(id);
                dataOut.writeInt(id.intValue());
                dataOut.writeShort(buf.length);
                dataOut.write(buf, 0, buf.length);
            }
            outStream.write(byteOut.toByteArray());

            outStream.close();
            dataOut.close();
            byteOut.close();
        } catch (Exception e)
        {
        }
    }
}
