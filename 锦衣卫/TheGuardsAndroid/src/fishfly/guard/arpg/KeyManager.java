package fishfly.guard.arpg;

public class KeyManager implements Keys {
    //用来存放键是否被按下，用位来表示，当键按下时把相应位置1，直到按键释放才置0
    int keyFlag;    
    
    //这里采用增加一个标志位，可以有效防止在两次检测的过程中，短暂按键不能被程序知道的问题
    int keyFlagIm;
    long keyPressTime;
    long keyReleaseTime;
    long keyDurationTime;
    
    public KeyManager() {
    }
   
    public int getKeyLabel(int keyCode) {
        switch (keyCode) {
            case KEY_NUM0:
                // 向左移N位后，即该位置1 下同
                return MASK_NUM0;

            case KEY_NUM1:
                return MASK_NUM1;

            case KEY_NUM2:
                return MASK_NUM2;

            case KEY_NUM3:
                return MASK_NUM3;

            case KEY_NUM4:
                return MASK_NUM4;

            case KEY_NUM5:
                return MASK_NUM5;

            case KEY_NUM6:
                return MASK_NUM6;

            case KEY_NUM7:
                return MASK_NUM7;

            case KEY_NUM8:
                return MASK_NUM8;

            case KEY_NUM9:
                return MASK_NUM9;

            case KEY_STAR:
                return MASK_STAR;

            case KEY_POUND:
                return MASK_POUND;

            case KEY_UP:
                return MASK_UP;

            case KEY_DOWN:
                return MASK_DOWN;

            case KEY_LEFT:
                return MASK_LEFT;

            case KEY_RIGHT:
                return MASK_RIGHT;

            case KEY_FIRE:
                return MASK_FIRE;
                
            case KEY_LEFT_SOFT:
                return MASK_SOFT1;
                
            case KEY_RIGHT_SOFT:
                return MASK_SOFT2;
        }

        //缺省值，可能会有问题
        return -1;
    }

    public int getKeyValue(int mask) {
        switch (mask) {
            case MASK_NUM0:
                // 向左移N位后，即该位置1 下同
                return KEY_NUM0;

            case MASK_NUM1:
                return KEY_NUM1;

            case MASK_NUM2:
                return KEY_NUM2;

            case MASK_NUM3:
                return KEY_NUM3;

            case MASK_NUM4:
                return KEY_NUM4;

            case MASK_NUM5:
                return KEY_NUM5;

            case MASK_NUM6:
                return KEY_NUM6;

            case MASK_NUM7:
                return KEY_NUM7;

            case MASK_NUM8:
                return KEY_NUM8;

            case MASK_NUM9:
                return KEY_NUM9;

            case MASK_STAR:
                return KEY_STAR;

            case MASK_POUND:
                return KEY_POUND;

            case MASK_UP:
                return KEY_UP;

            case MASK_DOWN:
                return KEY_DOWN;

            case MASK_LEFT:
                return KEY_LEFT;

            case MASK_RIGHT:
                return KEY_RIGHT;

            case MASK_FIRE:
                return KEY_FIRE;

            case MASK_SOFT1:
                return KEY_LEFT_SOFT;

            case MASK_SOFT2:
                return KEY_RIGHT_SOFT;
        }

        //缺省值，可能会有问题
        return -1;
    }

    public void keyPressed(int keyCode) {
        //keyLabel 按键的MASK值
        int keyLabel = getKeyLabel(keyCode);
        
        //没找到感兴趣的按键
        if (keyLabel < 0) {
            return;
        }
        
//        keyFlag = 0;
        //判断是否该键已经被按下，如果没有被按下，记录按键信息，并记录按键时间
        //在模拟器上这是必要的，在手机上，这个检查可以去掉
        //因为PC上，按下键盘会不停地收到按键的事件
        if ((keyFlag & (0x01 << keyLabel)) != 0) {
            keyFlagIm = keyFlag;
            return;
        }

        keyFlag |= (0x01 << keyLabel);
        keyPressTime = System.currentTimeMillis();

        keyFlagIm = keyFlag;
    }

    public void keyReleased(int keyCode) {
        int keyLabel = getKeyLabel(keyCode);
        if (keyLabel < 0) {
            return;
        }
//        keyFlag = 0;
        keyFlag &= ~(0x01 << keyLabel);
        keyReleaseTime = System.currentTimeMillis();
        keyDurationTime = keyReleaseTime - keyPressTime;
    }

    /**
     * 用来标示是否某个键被按了，这里采用增加一个标志位keyFlagIm，
     * 可以有效防止在两次检查按键的间隔过程中，短暂按键不能被程序知道的问题
     * @param keyLabel int 键的MASK值
     * @return boolean
     */
    public boolean isPressed(int keyLabel) {
        //如果此标志位为1则返回真
        if ((keyFlag & (0x01 << keyLabel)) != 0) {
            return true;
        }
        return false;
    }

    /**
     * 复位键状态,在使用这个键后，有时候，我们并不想这个键值在下一个循环中仍有效，
     * 因此我们将其复位，防止后面的操作也被这个键值所作用。
     *
     * reset all key flags
     */
    public void resetKey() {
        keyFlag = keyFlagIm = 0;
    }

    /**
     * 重置短时按键的记录，用于主动地精细控制
     */
    public void resetKeyIm() {
        keyFlagIm = 0;
    }

    public long getDuration() {
        return keyDurationTime;
    }
}
