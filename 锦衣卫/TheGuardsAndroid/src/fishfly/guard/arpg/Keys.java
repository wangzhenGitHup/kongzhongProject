/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Canvas;

/**
 *
 * @author 何召卫@fishfly.com
 */
public interface Keys {
    int 
            KEY_NUM1 = Canvas.KEY_NUM1,
            KEY_NUM2 = Canvas.KEY_NUM2,
            KEY_NUM3 = Canvas.KEY_NUM3,
            KEY_NUM4 = Canvas.KEY_NUM4,
            KEY_NUM5 = Canvas.KEY_NUM5,
            KEY_NUM6 = Canvas.KEY_NUM6,
            KEY_NUM7 = Canvas.KEY_NUM7,
            KEY_NUM8 = Canvas.KEY_NUM8,
            KEY_NUM9 = Canvas.KEY_NUM9,
            KEY_NUM0 = Canvas.KEY_NUM0,
            KEY_STAR = Canvas.KEY_STAR,
            KEY_POUND = Canvas.KEY_POUND,
            
            //下面这些键不同的机型定义不同的预处理键值
            //#if V8||E2
//#             KEY_UP = -1,
//#             KEY_DOWN = -2,
//#             KEY_LEFT = -3,
//#             KEY_RIGHT = -4,
//#             KEY_LEFT_SOFT = -21,
//#             KEY_RIGHT_SOFT = -22,
//#             KEY_FIRE = -5,
//#             KEY_CLEAR = -8
            //#else
            KEY_UP = -1,
            KEY_DOWN = -2,
            KEY_LEFT = -3,
            KEY_RIGHT = -4,
            KEY_FIRE = -5,
            KEY_CLEAR = -8,
            KEY_LEFT_SOFT = -6,
            KEY_RIGHT_SOFT = -7
            //#endif
            ;
    
        byte  MASK_NUM0 = 0
          , MASK_NUM1 = 1
          , MASK_NUM2 = 2
          , MASK_NUM3 = 3
          , MASK_NUM4 = 4
          , MASK_NUM5 = 5
          , MASK_NUM6 = 6
          , MASK_NUM7 = 7
          , MASK_NUM8 = 8
          , MASK_NUM9 = 9
          , MASK_LEFT = 10
          , MASK_UP = 11
          , MASK_RIGHT = 12
          , MASK_DOWN = 13
          , MASK_FIRE = 14
          , MASK_STAR = 15
          , MASK_POUND = 16
          , MASK_SOFT1 = 17
          , MASK_SOFT2 = 18
          , MASK_SOFT3 = 19
          ;
}
