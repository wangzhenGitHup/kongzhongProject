/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 * 以Short为Key得Hashtable
 * 目的：
 * 1. 减少对象创建，查找和插入都不必创建Integer
 * 2. 以插入时的损失，提高查询时的效率
 * @author 何召卫@fishfly.com
 */
final public class HashtableShort {
    static final int INC_GRANULARITY = 10;
    private short[] keys;
    private Object[] vals;
    private int size;
    
    public HashtableShort(int gra) {
        if(gra <= 0) {
            gra = INC_GRANULARITY;
        }
        init(gra);
    }
    
    public HashtableShort() {
        init(INC_GRANULARITY);
    }
    
    private void init(int gra) {
        keys = new short[gra];
        vals = new Object[gra];
        size = 0;
    }
    
    public static int findKey(short[] keys, short key) {
        return findKey(keys, keys.length, key);
    }
    
    public static int findKey(short[] keys, int len, short key) {
        //在一个数组中，找一个值，确定其位置
        int start = 0;
        int end = len - 1;
        
        while(start <= end) {
            if(keys[start] == key) {
                return start;
            }
            
            if(keys[end] == key) {
                return end;
            }
            
            int mid = (start + end) >> 1;
            if(keys[mid] == key) {
                return mid;
            }
            
            if(keys[mid] > key) {
                start = start + 1;
                end = mid - 1;
                continue;
            }
            
            start = mid + 1;
            end = end - 1;
        }
        
        //没找到
        return -1;
    }
    
    public void put(short key, Object val) {
        if(size >= keys.length) {
            int oldLen = keys.length;
            int newLen = oldLen << 1;
            //开始膨胀
            short[] newKeys = new short[newLen];
            System.arraycopy(keys, 0, newKeys, 0, oldLen);
            Object[] newVals = new Object[newLen];
            System.arraycopy(vals, 0, newVals, 0, oldLen);
            keys = null;
            keys = newKeys;
            vals = null;
            vals = newVals;
        }
        
        //查找并插入
        if(size == 0) {
            keys[0] = key;
            vals[0] = val;
            size++;
            return;
        }
        
        int overwriteIndex = findKey(keys, size, key);
        
        if(overwriteIndex >= 0) {
            vals[overwriteIndex] = val;
            return;
        }
        
        for(int i = 0; i < size; i++) {
            if(keys[i] > key) {
                overwriteIndex = i;
                break;
            }
        }

        if(overwriteIndex >= 0) {
            for(int imove = size - 1; imove >= overwriteIndex; imove--) {
                keys[imove + 1] = keys[imove];
                vals[imove + 1] = vals[imove];
            }
            keys[overwriteIndex] = key;
            vals[overwriteIndex] = val;
            size++;
            return;
        }
        
        //添加到最后
        keys[size] = key;
        vals[size] = val;
        size++;
    }
    
    public Object get(short key) {
        int findIndex = findKey(keys, size, key);
        
        if(findIndex < 0) {
            return null;
        }
        
        return vals[findIndex];
    }
    
    public void remove(short key) {
        int findIndex = findKey(keys, size, key);
        
        if(findIndex < 0) {
            return;
        }
        
        //后面的元素移动过来
        for(int imove = findIndex; imove < size - 1; imove++) {
            keys[imove] = keys[imove + 1];
            vals[imove] = vals[imove + 1];
        }
        
        //去掉引用，免得垃圾收集的时候释放不掉
        vals[size - 1] = null;
        
        //变更尺寸
        size--;
    }
    
    public int size() {
        return size;
    }
    
    //下面是遍历方法
    public short key(int index) {
        return keys[index];
    }
    
    public Object value(int index) {
        return vals[index];
    }
    
    /**
     * 清空所有容纳的元素
     */
    public void clear() {
        for(int i = 0; i < size; i++) {
            vals[i] = null;
            keys[i] = 0;
        }
        size = 0;
    }
}
