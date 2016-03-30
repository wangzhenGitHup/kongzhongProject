/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package fishfly.guard.arpg;

/**
 *
 * @author huyang
 */
public interface PageSize {

    //J2ME模拟器的规格
    //#if E62
//#     public static final int SCREEN_WIDTH = 320;
//#     public static final int SCREEN_HEIGHT = 240;
//#     public static final int SCREEN_OFFSET_X = 40;
//#     public static final int SCREEN_OFFSET_Y = -80;
    //#elif N5800
//#     public static final int SCREEN_WIDTH = 480;
//#     public static final int SCREEN_HEIGHT = 272;
//#     public static final int SCREEN_OFFSET_X = 0;
//#     public static final int SCREEN_OFFSET_Y = 0;
    //#else
    //public int SCREEN_WIDTH;
//    public static final int SCREEN_HEIGHT = 272;
    //public int SCREEN_HEIGHT;

    public static final int SCREEN_OFFSET_X = 0;
    public static final int SCREEN_OFFSET_Y = 0;
    //#endif

//    public static final int TEACH_REFINERY = 0;
//    public static final int TEACH_MISSION = 2;
//    public static final int TEACH_MAP = 3;
//    public static final int TEACH_SKILL = 4;
//    public static final int TEACH_SKILL_LEARN = 41;
    //上传积分结果
    public static final int UPDATE_OVER_TAB = 11;
}
