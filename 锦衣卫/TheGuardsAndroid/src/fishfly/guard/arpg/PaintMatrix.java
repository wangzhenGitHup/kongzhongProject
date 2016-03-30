/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;


/**
 *
 * @author 何召卫@fishfly.com
 */
public class PaintMatrix {
    PaintUnitHead head = null;
    
    //下面是对PaintUnitHead的缓存
    private static final int UNUSED = -1000;
    
    private static final int CACHE_SIZE = 200;
    private static PaintUnitHead[] cache;
    
    static {
        cache = new PaintUnitHead[CACHE_SIZE];
        for(int i = 0; i < CACHE_SIZE; i++) {
            cache[i] = new PaintUnitHead();
            cache[i].y = UNUSED;
        }
    }
    
    /**
     * 释放所有资源
     */
    public static void releaseHeads()
    {
        for(int i = 0; i < CACHE_SIZE; i++) {
            cache[i].y = UNUSED;
            cache[i].next = null;
            cache[i].child = null;
        }        
    }
    
    private static PaintUnitHead getHead() {
        for(int i = 0; i < CACHE_SIZE; i++) {
            if(cache[i].y == UNUSED) {
                cache[i].y = 0;
                return cache[i];
            }
        }
        return null;
    }
    
    private static void releaseHead(PaintUnitHead head) {
        head.y = UNUSED;
        head.child = null;
        head.next = null;
    }
    
    public void clear()
    {
        head = null;
    }

    public void paint(Graphics g, int offsetX, int offsetY) {
        PaintUnitHead headIt = head;
        while(headIt != null) {
            PaintUnit unitIt = headIt.child;
            
            while(unitIt != null) {
                unitIt.paint(g, offsetX, offsetY);
                unitIt = unitIt.next;
            }
            headIt = headIt.next;
        }
    }

    public void update() {
        PaintUnitHead headIt = head;
        while(headIt != null) {
            PaintUnit unitIt = headIt.child;

            while(unitIt != null) {
                unitIt.update();
                unitIt = unitIt.next;
            }
            headIt = headIt.next;
        }
    }

    public void removeUnit(PaintUnit unit) {
        if(unit == null)
        {
            return;
        }
        if(head == null) {
            return;
        }
        
        if(head.y > unit.y) {
            return;
        }
        
        PaintUnitHead headIt = head;
        PaintUnitHead prevHeadIt = head;
        
        while(headIt != null) {
            if(headIt.y > unit.y) {
                //没找到
                return;
            }
            
            if(headIt.y < unit.y) {
                prevHeadIt = headIt;
                headIt = headIt.next;
                continue;
            }

            if(headIt.y > unit.y) {
                //没找到这个元素
                return;
            }

            //就在这里了
            //先删除unit
            PaintUnit unitIt = headIt.child;
            if(unitIt == unit) {
                headIt.child = unitIt.next;
                if(headIt.child == null) {
                    //删除头
                    if(headIt == head) {
                        head = headIt.next;
                    } else {
                        prevHeadIt.next = headIt.next;
                    }
                    
                    releaseHead(headIt);
                }
                unit.next = null;
                return;
            }
            
            //不是第一个元素
            PaintUnit prevUnitIt = unitIt;
            while(unitIt != null) {
                if(unitIt == unit) {
                    prevUnitIt.next = unitIt.next;
                    unit.next = null;
                    return;
                }
                prevUnitIt = unitIt;
                unitIt = unitIt.next;
            }
            
            //没找到这个元素
            break;
        }
    }
    
    public void addUnit(PaintUnit unit) {
        if(unit == null)
        {
            return;
        }
        if(head == null) {
            head = getHead();
            head.child = unit;
            head.y = unit.y;
            return;
        }
        
        //插入到第一个的前面
        if(head.y > unit.y) {
            PaintUnitHead unitHead = getHead();
            unitHead.y = unit.y;
            unitHead.child = unit;
            unitHead.next = head;
            head = unitHead;
            return;
        }
        
        PaintUnitHead headIt = head;
        
        PaintUnitHead prevHeadIt = head;
        
        while(headIt != null) {
            if(headIt.y > unit.y) {
                PaintUnitHead unitHead = getHead();
                unitHead.y = unit.y;
                unitHead.child = unit;
                unitHead.next = headIt;
                prevHeadIt.next = unitHead;
                return;
            }
            
            if(headIt.y < unit.y) {
                prevHeadIt = headIt;
                headIt = headIt.next;
                continue;
            }
            
            //插入到当前列
            PaintUnit unitIt = headIt.child;
            //插入完毕
            if(unitIt.x > unit.x) {
                headIt.child = unit;
                unit.next = unitIt;
                return;
            }
            
            PaintUnit prevUnitIt = unitIt;
            
            while(unitIt != null) {
                if(unitIt.x > unit.x) {
                    prevUnitIt.next = unit;
                    unit.next = unitIt;
                    return;
                }
                if(unitIt == unit)
                {
                    return;
                }
                
                prevUnitIt = unitIt;
                unitIt = unitIt.next;
            }
            
            if(unitIt == null) {
                //找到最后一个元素
                prevUnitIt.next = unit;
                return;
            }
        }
        
        //插入到队尾
        PaintUnitHead unitHead = getHead();
        unitHead.y = unit.y;
        unitHead.child = unit;
        prevHeadIt.next = unitHead;
    }
    
    public void updateUnit(PaintUnit unit, int x, int y) {
        removeUnit(unit);
        unit.x = x;
        unit.y = y;
        addUnit(unit);
    }
    
    public void releaseImages() {
        PaintUnitHead headIt = head;
        AnimationManager aniMgr = AnimationManager.getInstance();
        while (headIt != null)
        {
            PaintUnit unitIt = headIt.child;
            while (unitIt != null)
            {
                if(unitIt == GameContext.actor)
                {
                    unitIt = unitIt.next;
                    continue;
                }
                unitIt.releaseImages();
                unitIt = unitIt.next;
            }
            headIt = headIt.next;
        }            
    }
}
