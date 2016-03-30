/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.IOException;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class Item {
    //物品类型：0武器 1防具 2鞋子 3饰品 4药品 5材料 6配方 7晶石
    public static final int WEAPON = 0;
    public static final int ARMOR = 1;
    public static final int FOOT = 2;
    public static final int ADORN = 3;
    public static final int MEDICINE = 4;
    public static final int MATERIAL = 5;
    public static final int FORMULA = 6;
    public static final int STONE = 7;
    
    //装备的补充变量
    //线性价值
    static final int EXTRA_TYPE_ADD_MONEY = 0;
    //装备等级限制
    static final int EXTRA_TYPE_EQUIP_LV_LIMIT = 1;
    //武器格位置
    static final int EXTRA_TYPE_WEAPON_INDEX = 2;
    //配方的补充变量
    //生成物品
    static final int EXTRA_TYPE_CREATE_ITEM = 0;
    //材料的补充变量
    //掉落物品图标
    static final int EXTRA_TYPE_DROP_ICON = 0;
    //晶石的补充变量
    //晶石格位置
    static final int EXTRA_TYPE_STONE_INDEX = 0;

    //id
    short id;
    //iconType
    int iconType;
    //类型
    int type;
    //名称
    char[] name;
    //描述
    char[] desc;
    //价格
    int price;
    
    //补充变量
    int[] extra;
    final int EXTRA_CNT = 5;

    //指标
    short attrTypes[];
    short attrs[][];

    //坐标位置
    int iconLeftX;
    int iconTopY;
    static Image icon[];
    static int iconWidth[];
    static int iconHeight[];    

    /**
     * 读取物品数据
     * @param dataIn
     * @throws IOException
     */
    public void load(DataInputStream dataIn) throws IOException
    {
        id = (short)dataIn.readInt();
        iconType = dataIn.readInt();
        name = dataIn.readUTF().toCharArray();
        desc = dataIn.readUTF().toCharArray();
        price = dataIn.readInt();
        type = dataIn.readInt();
        extra = new int[EXTRA_CNT];
        for (int index = 0; index < extra.length; index++) {
            extra[index] = dataIn.readInt();
        }
        int len = dataIn.readInt();
        if (len != 0) {
            attrTypes = new short[len];
            for (int i = 0; i < len; i++) {
                attrTypes[i] = (short)dataIn.readInt();
            }
            int cnt = dataIn.readInt();
            attrs = new short[cnt][len];
            for (int i = 0; i < cnt; i++) {
                for (int j = 0; j < len; j++) {
                    attrs[i][j] = (short)dataIn.readInt();
                }
            }
        }
        iconLeftX = dataIn.readInt();
        iconTopY = dataIn.readInt();
    }

    //绘制物品图标
    public void paintIcon(Graphics g, int x, int y) {
        if(icon == null) {
            return;
        }        
        Util.drawRegion(g, icon[iconType], iconLeftX, iconTopY, iconWidth[iconType], iconHeight[iconType], Sprite.TRANS_NONE, x, y, Graphics.LEFT | Graphics.TOP);
    }

    public void paintIcon(Graphics g, int x, int y, int iconIndex) {
        if(icon == null) {
            return;
        }
        int iconCols = icon[iconType].getWidth() / iconWidth[iconType];
        int iCol = iconIndex % iconCols;
        int iRow = iconIndex / iconCols;
        Util.drawRegion(g, icon[iconType], iCol * iconWidth[iconType], iRow * iconHeight[iconType], iconWidth[iconType], iconHeight[iconType], Sprite.TRANS_NONE, x, y, Graphics.LEFT | Graphics.TOP);
    }

    //是否能够装备
    public boolean canEquip() {
        return type <= ADORN;
    }
    
    //是否可以数量累加
    public boolean canOverPosition() {
        return !canEquip();
    }

    //是否可以卖出
    public boolean canSale() {
        return type != WEAPON;
    }

    //获取物品类型名称
    public static String getItemTypeName(int type)
    {
        //武器 防具 鞋子 饰品 药品 材料 配方 晶石
        switch(type)
        {
            case WEAPON:
                return "武器";
            case ARMOR:
                return "防具";
            case FOOT:
                return "鞋子";
            case ADORN:
                return "饰品";
            case MEDICINE:
                return "药品";
            case MATERIAL:
                return "材料";
            case FORMULA:
                return "配方";
            case STONE:
                return "晶石";
        }
        return null;
    }

    //获取价格
    public int getPrice(int lv)
    {
        if (canEquip()) {
            return price + lv * extra[EXTRA_TYPE_ADD_MONEY];
        }
        return price;
    }

    //根据指标类型获取对应的index
    public int getAttrIndex(int attrType) {
        if (attrTypes == null || attrTypes.length == 0) {
            return -1;
        }
        for (int index = 0; index < attrTypes.length; index++) {
            if (attrType == attrTypes[index]) {
                return index;
            }
        }
        return -1;
    }

    //获取指标类型
    public int getAttrType(int idx) {
        return attrTypes[idx];
    }

    //获取指标
    public int getAttrValue(int lv, int idx) {
        return attrs[lv][idx];
    }

    //获取指标类型名称
    public static String getAttrTypeName(int attrType) {
        return (String) GameContext.itemAttrTypeNameMap.get((short) attrType);
    }
}
