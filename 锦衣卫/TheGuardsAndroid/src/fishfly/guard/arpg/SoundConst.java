/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package fishfly.guard.arpg;

/**
 *
 * @author songxiaobo
 */
public class SoundConst {

    private static SoundConst soundCon;
    public static final int SYSBUTTON = 1;//所有基础系统按钮、开始游戏、移动等音效
    public static final int SYSCHOOSE = 2;//菜单选择音效
    public static final int ERROR = 3;//错误提示、提示信息音效
    public static final int ARTIFICE = 4;//炼化动画音效
    public static final int KNIFESWINGNULL = 5;//刀挥空音效（小兵用攻击音效）匕首
    public static final int KNIFEBEAT = 6;//刀打击敌人音效（BOSS用攻击音效）
    public static final int GUN = 7;//主角火枪音效
    public static final int SHIELD = 8;//主角盾牌（砸地，成就）音效
    public static final int PREPARECANNON = 9;//箱子变大炮音效
    public static final int CANNONBOOM = 10;//大炮轰击音效
    public static final int ACTORHURT = 11;//主角受伤音效
    public static final int MENGGU1 = 12;//蒙古王子地裂音效
    public static final int MENGGU2 = 13;//蒙古王子旋转音效
    public static final int HUDIE1 = 14;//蝴蝶发鞭子音效
    public static final int HUDIE2 = 15;//蝴蝶莲花光音效
    public static final int LONGXIAO1 = 16;//龙啸冰柱音效
    public static final int TENTACLE = 17;//触手攻击音效（风特效）
    public static final int QUBOOM = 18;//蛆虫爆炸音效（大鬼，魔蟹吐毒）
    public static final int SUCK = 19;//鬼王吸收音效，狼嚎
    public static final int BITE = 20;//鬼王吸收音效，狼嚎
    public static final int ARRORW = 21;//射箭音效
    public static final int LIGHTNING = 22;//白莲道士雷击音效
    public static final int MISSION = 23;//任务提示音，捡起道具音效
    public static final int ENCHANT = 24;//武器强化，升级
    public static final int DICE = 25;//掷骰子音效
    public static final int HORSESHOE = 26;//马蹄音效
    public static final int SCENESWITCH = 27;//切换场景音效
    public static final int ROLEBROW = 28;//表情出现音效
    public static final int ENEMYDISAPPERA = 29;//敌人消失音效
    public static final int FIRE = 30;//着火，火柱音效

    public static final String[] SOUND_NAME = {
        "1",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
    };
    public SoundConst() {
    }

    public static SoundConst getInstans() {
        if (soundCon == null) {
            soundCon = new SoundConst();
        }
        return soundCon;
    }
}
