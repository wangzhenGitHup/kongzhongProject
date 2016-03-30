/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/**
 *
 * @author 何召卫@fishfly.com
 * 终于瘦了
 */
public class MyItem {
    
    Item item;
//    指标类型：
    static final int 强化价格 = 0;
    static final int 增加攻击上限 = 1;
    static final int 增加防御上限 = 2;
    static final int 增加闪避上限 = 3;
    static final int 增加暴击上限 = 4;
    static final int 更换主角图片 = 5;
    static final int 强化等级 = 6;
    static final int 增加武器攻击上限 = 7;
    static final int 更换物品 = 8;
    static final int 增加武器百分比攻击 = 9;
    static final int 恢复生命 = 10;
    static final int 恢复灵气 = 11;
    static final int 补满生命 = 12;
    static final int 补满灵气 = 13;
    static final int 增加生命上限 = 14;
    static final int 增加灵气上限 = 15;
    static final int 需要材料 = 16;
    static final int 需要材料数量 = 17;
    static final int 晶石经验 = 18;
    static final int 增加晶石暴击上限 = 19;
    static final int 增加晶石生命上限 = 20;
    static final int 增加晶石内力上限 = 21;
    static final int 增加晶石攻击上限 = 22;
    static final int 增加晶石防御上限 = 23;
    static final int 增加晶石闪避上限 = 24;
    
    //等级
    int lv = 0;
    //个数
    int cnt = 1;
    //是否装备
    boolean isActorEquip;

    //补血药水
    static final short[] ADD_HP_ITEM_ID = {30, 32};
    //补充内力的药水
    static final short[] ADD_MP_ITEM_ID = {31, 33};
    //武器id
    static final short WEAPON_START_ID = 0;
    //最强防具id
    static final short SUPER_ARMOR_ID = 10;
    //配方id
    static final short FORMULA_START_ID = 50;
    //混元丹id
    static final short DETOXIFICATION_ID = 39;
    
    public MyItem(short itemId) {
        item = GameContext.getItem(itemId);
    }
    
    public MyItem(Item item) {
        this.item = item;
    }
    
    public MyItem() {
    }
    
    public short getId() {
        return item.id;
    }
    
    public int getType() {
        return item.type;
    }
    
    public void setItem(short itemId) {
        item = GameContext.getItem(itemId);
    }

    public void save(DataOutputStream dataOut) throws IOException {
        dataOut.writeShort(item.id);
        dataOut.writeShort(lv);
        dataOut.writeInt(cnt);
        dataOut.writeBoolean(isActorEquip);
    }

    public void load(DataInputStream dataIn) throws IOException {
        short itemId = dataIn.readShort();
        this.item = GameContext.getItem(itemId);
        lv = dataIn.readShort();
        cnt = dataIn.readInt();
        isActorEquip = dataIn.readBoolean();
    }

    //获取该物品有几个指标
    public int getAttrCount() {
        if (item.attrTypes == null) {
            return 0;
        }
        return item.attrTypes.length;
    }
      
    //使用物品
    public String use() {
        if (getType() == Item.MEDICINE) {
            GameContext.addVar(EffortManager.EFFORT_USE_MEDICINE, 1);
        }
        StringBuffer buf = new StringBuffer();
        int effectCnt = getAttrCount();
        for (int index = 0; index < effectCnt; index++) {
            int effectType = item.attrTypes[index];
            int effectValue = getAttrValue(effectType);
            if (effectValue <= 0) {
                continue;
            }
            String str = use(effectType, effectValue);
            if (str != null) {
                buf.append(str);
            }
        }
        GameContext.actor.updateBaseData();
        return buf.toString();
    }    

    //装备物品
    public void install() {
        int effectCnt = getAttrCount();
        for (int index = 0; index < effectCnt; index++) {
            int effectType = item.attrTypes[index];
            int effectValue = getAttrValue(effectType);
            if (effectValue <= 0) {
                continue;
            }
            install(effectType, effectValue);
        }
        isActorEquip = true;
        GameContext.actor.updateBaseData();        
    }

    //卸下物品
    public void uninstall() {
        int effectCnt = getAttrCount();
        for (int index = 0; index < effectCnt; index++) {
            int effectType = item.attrTypes[index];
            int effectValue = getAttrValue(effectType);
            if (effectValue <= 0) {
                continue;
            }
            uninstall(effectType, effectValue);
        }
        isActorEquip = false;
        GameContext.actor.updateBaseData();        
    }

    //获得物品效果描述
    public char[] getEffectsDescription() {
        StringBuffer buf = new StringBuffer();
        if (item.type == Item.FORMULA) {
            int createItemId = item.extra[Item.EXTRA_TYPE_CREATE_ITEM];
            Item createItem = GameContext.getItem((short) createItemId);
            if (createItem == null) {
                return null;
            }
            buf.append("生成物品：").append(createItem.name);
            return buf.toString().toCharArray();
        }
        int effectCnt = getAttrCount();
        for (int index = 0; index < effectCnt; index++) {
            int effectType = item.attrTypes[index];
            int effectValue = getAttrValue(effectType);
            if (effectValue <= 0) {
                continue;
            }
            String str = getEffectsDescription(effectType, effectValue);
            if (str == null || str.length() == 0) {
                continue;
            }
            buf.append(str).append("|");
        }
        return buf.toString().toCharArray();
    }

    //获取价格
    public int getPrice()
    {
        return item.getPrice(lv);
    }

    //是否可以数量累加
    public boolean canOverPosition() {
        return item.canOverPosition();
    }

    //是否可以卖出
    public boolean canSale() {
        return item.canSale() && !isActorEquip;
    }

    //是否可以装备
    public boolean canEquip() {
        return item.canEquip();
    }

    //获取一共有多少等级（多少指标条数）
    public int getMaxLv() {
        if (item.attrs == null) {
            return 0;
        }
        return item.attrs.length;
    }
    
    //是否能够强化
    public boolean canUpgrade() {
        if (!canEquip()) {
            return false;
        }
        if (item.attrs == null || item.attrs.length == 0) {
            return false;
        }
        if (lv + 1 >= item.attrs.length) {
            return false;
        }
        return true;
    }

    //获取物品名称
    public char[] getName() {
        if (item.type == Item.WEAPON) {
            final String[] LV_NAME = {"铜", "银", "金"};
            StringBuffer buf = new StringBuffer();
            buf.append(item.name).append("(").append(LV_NAME[getRareLv()]).append(")");
            return buf.toString().toCharArray();
        }
        return item.name;
    }

    //获取物品名称显示颜色
    public int getNameColor() {
        if (item.type == Item.WEAPON) {
            final int[] LV_COLOR = {0x0b973f, 0xcfd9d8, 0xf8e832};
            return LV_COLOR[getRareLv()];
        }
        return 0xf8e832;
    }

    //获取稀有等级
    public int getRareLv() {
        if (item.type != Item.WEAPON) {
            return 0;
        }
        final int RARE_LV_ONCE = 9;
        return lv / RARE_LV_ONCE;
    }
    
    //获取指标类型
    public int getAttrType(int idx) {
        return item.attrTypes[idx];
    }

    //获取某个指标
    public int getAttrValue(int attrTypeIndex) {
        int idx = item.getAttrIndex(attrTypeIndex);
        if (idx < 0) {
            return -1;
        }
        return item.getAttrValue(lv, idx);
    }

    //获取某个指标
    public int getAttrValue(int attrTypeIndex, int lv) {
        int idx = item.getAttrIndex(attrTypeIndex);
        if (idx < 0) {
            return -1;
        }
        return item.getAttrValue(lv, idx);
    }

    //使用物品，效果
    private String use(int type, int data) {
        Actor actor = GameContext.actor;
        switch(type)
        {
            case 恢复生命:
                actor.addHp((actor.appendHp * data) / 100);
                return "气血恢复" + data + "%" + "|";
            case 恢复灵气:
                actor.addMp((actor.appendMp * data) / 100);
                return "内力恢复" + data + "%" + "|";
            case 补满生命:
                actor.fillAllHp();
                return "气血补满|";
            case 补满灵气:
                actor.fillAllMp();
                return "内力补满|";
            case 增加攻击上限:
                actor.appendAp += data;
                return "攻击力增加" + data + "|";
            case 增加防御上限:
                actor.appendDp += data;
                return "防御力增加" + data + "|";
            case 增加生命上限:
                actor.appendHp += data;
                return "气血上限增加" + data + "|";
            case 增加灵气上限:
                actor.appendMp += data;
                return "内力上限增加" + data + "|";
            case 增加武器攻击上限:
                int weaponIndex = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
                actor.equipAp[weaponIndex] = data;
                break;
            case 晶石经验:
                break;
            case 增加晶石暴击上限:
                actor.stoneBigAttackProb = data;
                break;
            case 增加晶石生命上限:
                actor.stoneHp = data;
                break;
            case 增加晶石内力上限:
                actor.stoneMp = data;
                break;
            case 增加晶石攻击上限:
                actor.stoneAp = data;
                break;
            case 增加晶石防御上限:
                actor.stoneDp = data;
                break;
            case 增加晶石闪避上限:
                actor.stoneAvoidProb = data;
                break;
            case 增加武器百分比攻击:
                actor.ap = actor.ap * data / 100;
                int weaponIdx = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
                actor.equipAp[weaponIdx] = actor.ap;
                break;
            default:
                //#if PRINTDEBUG == 1
                try {
                    throw new Exception("没有这个效果，type = " + type);
                }
                catch (Exception ex) {
                }
                //#endif
                break;
        }
        return null;
    }

    //装备物品，效果
    private void install(int type, int data) {
        Actor actor = GameContext.actor;
        switch(type)
        {
            case 增加武器攻击上限:
                int weaponIndex = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
                actor.equipAp[weaponIndex] = data;
                break;
            case 增加防御上限:
                actor.equipDp += data;
                break;
            case 增加闪避上限:
                actor.equipAvoidProb += data;
                break;
            case 增加暴击上限:
                actor.equipBigAttackProb += data;
                break;
            case 增加生命上限:
                actor.equipHp += data;
                break;
            case 增加灵气上限:
                actor.equipMp += data;
                break;
            case 更换主角图片:
                changeActorEquipImage(data);
                break;
            case 增加武器百分比攻击:
                actor.ap = actor.ap * data / 100;
                int weaponIdx = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
                actor.equipAp[weaponIdx] = actor.ap;
                break;
            default:
                //#if PRINTDEBUG == 1
                try {
                    throw new Exception("没有这个效果，type = " + type);
                }
                catch (Exception ex) {
                }
                //#endif
                break;
        }
    }

    //卸下物品，效果
    private void uninstall(int type, int data) {
        Actor actor = GameContext.actor;
        switch(type)
        {
            case 增加武器攻击上限:
                int weaponIndex = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
                actor.equipAp[weaponIndex] = 0;
                break;
            case 增加防御上限:
                actor.equipDp -= data;
                break;
            case 增加闪避上限:
                actor.equipAvoidProb -= data;
                break;
            case 增加暴击上限:
                actor.equipBigAttackProb -= data;
                break;
            case 增加生命上限:
                actor.equipHp -= data;
                break;
            case 增加灵气上限:
                actor.equipMp -= data;
                break;
            case 更换主角图片:
                break;
            case 增加武器百分比攻击:
                int weaponIdx = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
                actor.equipAp[weaponIdx] = 0;
                break;
            default:
                //#if PRINTDEBUG == 1
                try {
                    throw new Exception("没有这个效果，type = " + type);
                }
                catch (Exception ex) {
                }
                //#endif
                break;
        }
    }

    //更换主角武器图片
    private void changeActorEquipImage(int imgId) {
        Actor actor = GameContext.actor;
        final int[] EQUIP_IMG_INDEX = {3, 4, 2, 1};
        final int[] DEFAULT_IMG_ID = {220, 224, 222, 227};
        int weaponIndex = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
        if (weaponIndex > EQUIP_IMG_INDEX.length - 1) {
            return;
        }
        int imgIndex = EQUIP_IMG_INDEX[weaponIndex];
        if (imgIndex > actor.imgs.length - 1) {
            return;
        }
        ImageManager imgMgr = ImageManager.getInstance();
        AnimationItem animationItem = (AnimationItem) AnimationManager.getInstance().grpMap.get(actor.ani.id);
        //更换的图片ID
        if (imgId == 0) {
            imgId = DEFAULT_IMG_ID[weaponIndex];
        }
        Image oldImg = actor.imgs[imgIndex];
        actor.imgs[imgIndex] = imgMgr.getImage((short) imgId);
        animationItem.imgIds[imgIndex] = (short) imgId;
        imgMgr.removeImage(oldImg);
    }

    //获得物品效果描述
    public String getEffectsDescription(int effectType, int data) {
        switch(effectType)
        {
            case 恢复生命:
                return "恢复气血：" + data + "%";
            case 恢复灵气:
                return "恢复内力：" + data + "%";
            case 补满生命:
                return "补满气血";
            case 补满灵气:
                return "补满内力";
            case 增加攻击上限:
                if (getType() == Item.MEDICINE) {
                    return "永久增加" + data + "攻击力";
                }
                return "攻击力：" + data;
            case 增加防御上限:
                if (getType() == Item.MEDICINE) {
                    return "永久增加" + data + "防御力";
                }
                return "防御力：" + data;
            case 增加暴击上限:
                if (getType() == Item.MEDICINE) {
                    return "永久增加" + data + "%暴击率";
                }
                return "暴击率：" + data + "%";
            case 增加闪避上限:
                if (getType() == Item.MEDICINE) {
                    return "永久增加" + data + "%闪避率";
                }
                return "闪避率：" + data + "%";
            case 增加生命上限:
                if (getType() == Item.MEDICINE) {
                    return "永久增加" + data + "气血上限";
                }
                return "气血上限：" + data;
            case 增加灵气上限:
                if (getType() == Item.MEDICINE) {
                    return "永久增加" + data + "内力上限";
                }
                return "内力上限：" + data;
            case 增加武器攻击上限:
                int weaponIndex = item.extra[Item.EXTRA_TYPE_WEAPON_INDEX];
                if (weaponIndex == 0) {
                    return "攻击力：" + data;
                }
                return "技能攻击力：" + data;
            case 增加晶石暴击上限:
                return "晶石加成" + data + "%暴击率";
            case 增加晶石生命上限:
                return "晶石加成" + data + "气血上限";
            case 增加晶石内力上限:
                return "晶石加成" + data + "内力上限";
            case 增加晶石攻击上限:
                return "晶石加成" + data + "攻击力";
            case 增加晶石防御上限:
                return "晶石加成" + data + "防御力";
            case 增加晶石闪避上限:
                return "晶石加成" + data + "%闪避率";
            case 增加武器百分比攻击:
                 return "技能攻击力：" + data;
        }
//        //#if PRINTDEBUG == 1
//        System.out.println("这个效果不用显示描述：type = " + type);
//        //#endif
        return null;
    }

    //绘制物品图标
    public void paintIcon(Graphics g, int x, int y) {
        int iconIndex = getAttrValue(更换物品, lv);
        if (iconIndex <= 0) {
            item.paintIcon(g, x, y);
            return;
        }
        item.paintIcon(g, x, y, iconIndex);
    }
}
