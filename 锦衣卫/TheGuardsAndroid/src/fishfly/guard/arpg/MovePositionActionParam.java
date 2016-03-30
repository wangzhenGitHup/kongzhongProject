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
public class MovePositionActionParam {
    public boolean isActor;
    public int time;
    public int posX;
    public int posY;
    
    public void load(DataInputStream dataIn) throws IOException
    {
        isActor = dataIn.readBoolean();
        //转换成毫秒
        time = dataIn.readShort();
        posX = dataIn.readShort();
        posY = dataIn.readShort();
    }
}
