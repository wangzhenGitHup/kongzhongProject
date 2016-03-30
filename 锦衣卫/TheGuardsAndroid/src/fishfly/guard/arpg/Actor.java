/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.Hashtable;
import javax.microedition.lcdui.Graphics;

/**
 * 主角的信息
 * @author 何召卫@fishfly.com
 */
public class Actor extends Role {
    
    RoleManager roleMgr = null;
    AnimationManager aniMgr;
    MissionManager missionMgr;
    ImageManager imgMgr;

    /**
     * 主角的动画组id
     */
    final static int ACTOR_ACT_ID = 97;
    public static String DIE_STR = "胜败乃兵家常事，请大侠重新来过。";

//    /**
//     * 残影
//     */
//    ShadowArray shadows;
    /**
     * 无敌动画
     */
    public PaintUnit superCartoon;

    /**
     * 是否死亡
     */
    boolean isDie;

    /**
     * 死亡脚本
     */
    ScriptEngine dieScript;
    
    /**
     * 是否忽略物品层 true 忽略
     */
    boolean isPhysical;

    /**
     * 拥有金钱
     */
    private int money = 0;

    /**
     * 功绩
     */
    int featPoints;
    /**
     * 官职
     */
    int officialLv;
    
    //各种参数
    private int lv = 1;
    int mp;
    int maxMp;
    int dp;
    int bigAttackProb;
    int avoidProb;
    long curEx;
    long maxEx = 150;

    //主角自身属性
    int appendHp;
    int appendMp;
    int appendAp;
    int appendDp;
    int appendBigAttackProb;
    int appendAvoidProb;

    //武器数量
    final int EQUIP_WEAPON_COUNT = 5;
    //下面是装备对主角属性的加成
    int equipHp;
    int equipMp;
    int[] equipAp = new int[EQUIP_WEAPON_COUNT];
    int equipDp;
    int equipBigAttackProb;
    int equipAvoidProb;
    int equipExSpeed;

    //晶石数量
    final int EQUIP_STONE_COUNT = 6;
    //主角盒子上的晶石经验
    int[] stoneExp = new int[EQUIP_STONE_COUNT];
    //晶石对主角属性的加成
    int stoneHp;
    int stoneMp;
    int stoneAp;
    int stoneDp;
    int stoneBigAttackProb;
    int stoneAvoidProb;

    //无敌：主角升级、复活、吃药后都会有一段时间无敌
    boolean isSuper = false;
    //无敌开始时间
    int superStartTime;
    //无敌持续时间
    int superDuration;

    //行为信息
    RoleAction[][] acts;
    public int curActIndex;

    //攻击相关参数
    boolean fireKeyPressed;

    //*******************************物品相关数据********************************
    /**
     * 背包数据
     */
    final int ITEM_CNT = 60;
    HashtableShort items;
    MyItem[] bagItems;
    int bagItemCnt = 0;
    /**
     * 身上装备的物品
     */
    final int ACTOR_EQUIP_CNT = 4;
    MyItem[] equipmentItem = new MyItem[ACTOR_EQUIP_CNT];

    //自动回血的物品
    MyItem addHPItem;
    //自动回魔的物品
    MyItem addMPItem;
    /**
     * 自动吃药冷却时间, 也是以帧数为单位
     */
    static final int HP_COOL_TIME = 10;

    /**
     * 是否补充声明或者真气
     */
    public boolean isAddHpOrMp;

    /**
     * 失去生命值
     */
    int loseHp;
    
    //*******************************技能相关数据********************************
    
    /**
     * 当前技能
     */
    public int curAttackSkillIndex = 0;
    
    //攻击技能列表
    AttackSkill[] attackSkills;

    /**
     * 当前攻击技能
     */
    public AttackSkill curAttackSkill;
    
    /**
     * 是否停止主角对键盘的响应
     */
    boolean isStopKey;
    
    /**
     * 是否在发动技能
     */
    boolean isRunSkillAttack;

    /**
     * 主角身上的不良攻击效果
     */
    public AttackEffect keepAttackEffect;
        
    /**
     * 主角的攻击效果
     */
    public AttackEffect attackEffect;
    
    public Actor() {
        imgMgr = ImageManager.getInstance();
        roleMgr = RoleManager.getInstance();
        aniMgr = AnimationManager.getInstance();
        bagItems = new MyItem[ITEM_CNT];
        items = new HashtableShort(ITEM_CNT);
        type = TYPE_ACTOR;
    }

    public void addMoney(int m)
    {
        money += m;
    }

    public void loseMoney(int m)
    {
        money -= m;
    }

    public boolean isHaveMoney(int m)
    {
        return money >= m;
    }

    public int getMoney()
    {
        return money;
    }

    /**
     * 增加/减少功绩
     * @param point
     */
    public void addFeat(int point) {
        featPoints += point;
    }

    public void loseFeat(int point) {
        featPoints -= point;
    }

    /**
     * 添加经验
     * @param ex
     */
    public void addEx(int ex)
    {
        curEx += ex;
        while(curEx >= maxEx)
        {
            curEx -= maxEx;
            updateActorLv();
        }
    }
    
    public void setLevel(int lv) {
        this.lv = lv;
    }
    
    public void addLevel(int lv) {
        for(int index = 0; index < lv; index++)
        {
            updateActorLv();
        }
    }
    
    public int getLevel() {
        return lv;
    }


    /**
     * 设置主角等级
     * @param lv
     */
    void setActorLv(int lv)
    {
        //TODO
    }

    //********物品相关逻辑*******************************
    public void addItem(MyItem item) {
        if (item == null || item.item == null) {
            return;
        }
        short itemId = item.getId();
        if (itemId > 0 && itemId < 5) {//是否是技能物品，需要装备
            item.install();
        }
        //寻找是否有可以叠加的
        MyItem i = (MyItem) items.get(itemId);
        if (i == null) {
            //添加了一个新的物品
            items.put(itemId, item);
            addBagItems(item);
            updateAddItem();
            return;
        }

        //不可叠加的直接添加
        if (i.canOverPosition()) {
            i.cnt++;
            updateAddItem();
            return;
        }

        addBagItems(item);
        updateAddItem();
    }

    private void addBagItems(MyItem item) {
        if (bagItemCnt >= bagItems.length) {
            MyItem[] buf = new MyItem[bagItems.length + (bagItems.length >> 1)];
            System.arraycopy(bagItems, 0, buf, 0, bagItemCnt);
            bagItems = buf;
        }
        bagItems[bagItemCnt] = item;
        bagItemCnt++;
    }

    public void addItem(MyItem item, int itemCount) {
        for (int index = 0; index < itemCount; index++) {
            addItem(item);
        }
    }

    /**
     * 添加物品
     * @param itemId
     */
    public void addItem(short itemId) {
        MyItem i = new MyItem(itemId);
        addItem(i);
    }

    /**
     * 添加物品
     * @param itemId
     * @param itemCount
     */
    public void addItem(short itemId, int itemCount) {
        MyItem i = new MyItem(itemId);
        for (int index = 0; index < itemCount; index++) {
            addItem(i);
        }
    }

    /**
     * 删除物品
     * @param itemId
     */
    public void removeItem(short itemId) {
        MyItem i = getItemFromActorBag(itemId);
        removeItem(i);
    }

    /**
     * 删除物品
     * @param itemId
     * @param itemCount
     */
    public void removeItem(short itemId, int itemCount) {
        for (int index = 0; index < itemCount; index++) {
            removeItem(itemId);
        }
    }

    public void removeItem(MyItem item, int itemCount) {
        for (int index = 0; index < itemCount; index++) {
            removeItem(item);
        }
    }

    public void removeItem(MyItem item) {
        if (item == null || item.item == null) {
            return;
        }
        short itemId = item.getId();
        if (item.canOverPosition()) {
            item.cnt--;
            if (item.cnt <= 0) {
                items.remove(itemId);
                delItem(item);
            }
            return;
        }
        //这里需要做一个判断，如果要删除一个主角正装备的物品，需要先将物品从主角身上卸下再删除
        if (item.isActorEquip) {
            int itemType = item.item.type;
            if (equipmentItem[itemType] != null && equipmentItem[itemType].item.id == itemId) {
                equipmentItem[itemType].uninstall();
                equipmentItem[itemType] = null;
            }
        }
        //非叠加物品直接删除
        delItem(item);
        if (!haveItem(itemId, 1)) {
            items.remove(itemId);
        }
    }

    private void delItem(MyItem item) {
        for (int index = 0; index < bagItemCnt; index++) {
            if (bagItems[index] == item) {
                if (index < bagItemCnt - 1) {
                    System.arraycopy(bagItems, index + 1, bagItems, index, bagItemCnt - index);
                }
                bagItemCnt--;
                return;
            }
        }
    }

    public MyItem getItemFromId(short itemId) {
        Object o = items.get(itemId);
        if (o == null) {
            return null;
        }
        return (MyItem) o;
    }

    public int itemKindSize() {
        return items.size();
    }

    /**
     * 获取某个物品的个数,
     * @param itemId
     * @return
     */
    public int getItemCount(short itemId) {
        MyItem item = (MyItem) items.get(itemId);
        if (item == null) {
            return 0;
        }

        return getItemCount(item);
    }

    /**
     * 获得物品个数
     * @param item
     * @return
     */
    public int getItemCount(MyItem item) {
        //可覆盖的物品看数量
        if (item.canOverPosition()) {
            MyItem i = (MyItem) items.get(item.getId());
            if (i == null) {
                return 0;
            }
            return i.cnt;
        }
        int count = 0;
        for (int index = 0; index < bagItemCnt; index++) {
            if (bagItems[index].item.id == item.item.id) {
                count++;
            }
        }
        return count;
    }

    /**
     * 是否有多少个物品
     * @param itemId
     * @param itemCount
     * @return
     */
    public boolean haveItem(short itemId, int itemCount) {
        MyItem item = (MyItem) items.get(itemId);
        if (item == null) {
            return false;
        }

        //可叠加
        if (item.canOverPosition()) {
            return item.cnt >= itemCount;
        }
        int cutCnt = 0;
        for (int index = 0, itemCnt = items.size(); index < itemCnt; index++) {
            MyItem i = (MyItem) items.value(index);
            if (i.item.id == itemId) {
                cutCnt++;
            }
        }
        return cutCnt >= itemCount;
    }

    public boolean isHaveItem(int id) {
        Object o = items.get((short) id);
        if (o == null) {
            return false;
        }
        return true;
    }

    /**
     * 从主角背包里面获取装备
     * @param itemType
     * @return
     */
    public MyItem[] getItemsFromActorBag() {
        MyItem[] item = new MyItem[bagItemCnt];
        int itemIndex = 0;
        for (int index = 0, cnt = bagItemCnt; index < cnt; index++) {
            MyItem i = bagItems[index];
            if (i.cnt > 0) {
                item[itemIndex] = i;
                itemIndex++;
            }
        }
        MyItem[] i = new MyItem[itemIndex];
        System.arraycopy(item, 0, i, 0, itemIndex);
        return i;
    }

    /**
     * 从主角背包里面获取该类型物品
     * @param itemType
     * @return
     */
    public MyItem[] getItemsFromActorBag(int itemType) {
        MyItem[] item = new MyItem[bagItemCnt];
        int itemIndex = 0;
        for (int index = 0, cnt = bagItemCnt; index < cnt; index++) {
            MyItem i = bagItems[index];
            if (i.item.type == itemType && i.cnt > 0) {
                item[itemIndex] = i;
                itemIndex++;
            }
        }
        MyItem[] i = new MyItem[itemIndex];
        System.arraycopy(item, 0, i, 0, itemIndex);
        return i;
    }

    /**
     * 从主角背包里面获取我所需要的物品
     * @param itemType
     * @return
     */
    public MyItem[] getItemsFromActorBag(short[] itemId) {
        MyItem[] item = new MyItem[bagItemCnt];
        int itemIndex = 0;
        for (int index = 0; index < itemId.length; index++) {
            MyItem i = getItemFromId(itemId[index]);
            if (i != null) {
                item[itemIndex] = i;
                itemIndex++;
            }
        }
        MyItem[] i = new MyItem[itemIndex];
        System.arraycopy(item, 0, i, 0, itemIndex);
        return i;
    }

    public MyItem getItemFromActorBag(short itemId) {
        MyItem item = new MyItem(itemId);
        int cnt = getItemCount(itemId);
        if (cnt == 0) {
            return null;
        }
        if (item.canOverPosition()) {
            return getItemFromId(itemId);
        }
        item = null;
        for (int index = 0; index < bagItemCnt; index++) {
            if (bagItems[index].getId() == itemId) {
                if (cnt == 1) {
                    return bagItems[index];
                }
                if (item == null || item.lv < bagItems[index].lv) {
                    item = bagItems[index];
                }
            }
        }
        return item;
    }
    

    /**
     * 新游戏初始化所有数据
     */
    public void initAllData()
    {
        lv = 1;
        officialLv = 5;
        curEx = 0;

        appendHp = 500;
        appendMp = 80;
        appendAp = 5;
        appendDp = 5;
        appendBigAttackProb = 1;
        appendAvoidProb = 1;

        equipHp = 0;
        equipMp = 0;
        equipAp = new int[EQUIP_WEAPON_COUNT];
        for (int index = 0; index < EQUIP_WEAPON_COUNT; index++) {
            equipAp[index] = 0;
        }
        equipDp = 0;
        equipBigAttackProb = 0;
        equipAvoidProb = 0;
        equipExSpeed = 0;

        stoneExp = new int[EQUIP_STONE_COUNT];
        for (int index = 0; index < EQUIP_STONE_COUNT; index++) {
            stoneExp[index] = 0;
        }
        stoneHp = 0;
        stoneMp = 0;
        stoneAp = 0;
        stoneDp = 0;
        stoneBigAttackProb = 0;
        stoneAvoidProb = 0;

        attackEffect = null;
        curAttackSkill = null;
        isDie = false;

        final int[] EQUIP_ITEM_INIT_ID = {0, 5};
        for (int index = 0; index < EQUIP_ITEM_INIT_ID.length; index++) {
            Item item = GameContext.getItem((short) EQUIP_ITEM_INIT_ID[index]);
            if (item == null) {
                continue;
            }
            equipmentItem[item.type] = new MyItem(item);
            equipmentItem[item.type].install();
            addItem(equipmentItem[item.type]);
        }

        /*********测试代码******************/
//        isLearn[SKILL_COUNT - 2] = 3;
//        for (int index = 0; index < isLearn.length - 1; index++) {
//            isLearn[index] = 3;
//        }
////        featPoints += 30;
//        for (int index = 0; index < GameContext.itemMap.size(); index++) {
//            short itemId = GameContext.itemMap.key(index);
//            addItem(itemId);
//        }
////        appendAp = 2500;
//        missionMgr = MissionManager.getInstance();
//        for (int index = 0; index < missionMgr.missionMap.size(); index++) {//
//            Mission m = missionMgr.getMission((short)index);
//            m.giveMissionToActor();
//        }
//        money = 100000;
//        appendHp = 2;
//        appendAp = 2;
//        appendMp = 5000;
//        appendAp = 2000;
//        appendDp = 1000;
//        appendBigAttackProb = 1;
//        appendAvoidProb = 1;
//        EffortManager.getInstance().allEffortCount = 200;
//        GameContext.setVar(EffortManager.EFFORT_BUY_LV, 1);
        /***************************/

        initSkillData();
        updateBaseData();
        initAttackSuperFile();
    }

    //读取主角数据
    public void readActorData(DataInputStream in) throws Exception
    {
        isDie = false;
        isSuper = false;
        attackEffect = null;
        //保存技能
        isLearn = new int[SKILL_COUNT];
        for (int index = 0, cnt = isLearn.length; index < cnt; index++)
        {
            isLearn[index] = in.readByte();
        }
        name = in.readUTF();
        //所在场景的位置
        setPosition(in.readShort(), in.readShort());
        //方向
        dir = in.readByte();
        money = in.readInt();
        featPoints = in.readInt();
        //官职
        officialLv = in.readInt();
        //保存变量
        acts[curActIndex][Actor.MOVE_STATUS].setSpeed(in.readShort());
        
        hp = in.readShort();
        mp = in.readInt();
        lv = in.readShort();
        curEx = in.readLong();

        appendHp = in.readShort();
        appendMp = in.readShort();
        appendAp = in.readInt();
        appendDp = in.readInt();
        appendBigAttackProb = in.readShort();
        appendAvoidProb = in.readShort();

        equipHp = in.readShort();
        equipMp = in.readShort();
        equipAp = new int[EQUIP_WEAPON_COUNT];
        for (int index = 0; index < EQUIP_WEAPON_COUNT; index++) {
            equipAp[index] = in.readShort();
        }
        equipDp = in.readShort();
        equipBigAttackProb = in.readShort();
        equipAvoidProb = in.readShort();
        equipExSpeed = in.readShort();

        stoneExp = new int[EQUIP_STONE_COUNT];
        for (int index = 0; index < EQUIP_STONE_COUNT; index++) {
            stoneExp[index] = in.readShort();
        }
        stoneHp = in.readShort();
        stoneMp = in.readShort();
        stoneAp = in.readShort();
        stoneDp = in.readShort();
        stoneBigAttackProb = in.readShort();
        stoneAvoidProb = in.readShort();

        readImage(in);
        readBag(in);

        changeDir();
        curAct.updateSpeed(GameContext.actor);
        updateSkillData();
        updateBaseData();

        for(int index = 0; index < equipmentItem.length; index++)
        {
            MyItem i = equipmentItem[index];
            if(i != null)
            {
                //为了换装
                i.uninstall();
                i.install();
            }
        }
        initAttackSuperFile();
    }

    /**
     * 保存主角数据
     * @param out
     * @throws Exception 
     */
    public void saveActorData(DataOutputStream out) throws Exception
    {
        //保存技能
        for(int index = 0,cnt = isLearn.length; index < cnt; index++)
        {
            out.writeByte(isLearn[index]);
        }
        out.writeUTF(name);
        //所在场景的位置
        out.writeShort(x);
        out.writeShort(y);
        //方向
        out.writeByte(dir);
        out.writeInt(money);
        //功绩
        out.writeInt(featPoints);
        //官职
        out.writeInt(officialLv);
        //速度
        out.writeShort(acts[curActIndex][Actor.MOVE_STATUS].getSpeed(UP));

        out.writeShort(hp);
        out.writeInt(mp);
        out.writeShort(lv);
        out.writeLong(curEx);

        out.writeShort(appendHp);        
        out.writeShort(appendMp);
        out.writeInt(appendAp);
        out.writeInt(appendDp);
        out.writeShort(appendBigAttackProb);
        out.writeShort(appendAvoidProb); 

        out.writeShort(equipHp);
        out.writeShort(equipMp);
        for (int index = 0; index < EQUIP_WEAPON_COUNT; index++) {
            out.writeShort(equipAp[index]);
        }
        out.writeShort(equipDp);
        out.writeShort(equipBigAttackProb);
        out.writeShort(equipAvoidProb);
        out.writeShort(equipExSpeed);

        for (int index = 0; index < EQUIP_STONE_COUNT; index++) {
            out.writeShort(stoneExp[index]);
        }
        out.writeShort(stoneHp);
        out.writeShort(stoneMp);
        out.writeShort(stoneAp);
        out.writeShort(stoneDp);
        out.writeShort(stoneBigAttackProb);
        out.writeShort(stoneAvoidProb);

        //写入图片
        saveImage(out);
        saveBag(out);
    }

    /**
     * 获得当前主角的图片id数组
     * @return
     */
    public short[] getCurActorImages()
    {
        return ((AnimationItem)AnimationManager.getInstance().grpMap.get(ani.id)).imgIds == null ? new short[0] : ((AnimationItem)AnimationManager.getInstance().grpMap.get(ani.id)).imgIds;
    }
    
    private void saveImage(DataOutputStream out) throws Exception
    {
        short[] curImgs = getCurActorImages();
        for (int index = 0, count = curImgs.length; index < count; index++)
        {
            out.writeShort(curImgs[index]);
        }        
    }

    private void readImage(DataInputStream in) throws Exception
    {
        short[] curImgs = getCurActorImages();
        for (int index = 0, count = curImgs.length; index < count; index++)
        {
            int id = in.readShort();
            if(id != curImgs[index])
            {
                ImageManager.getInstance().removeImage(curImgs[index]);
                imgs[index] = ImageManager.getInstance().getImage((short)id);
                curImgs[index] = (short) id;
            }
        }
    }

    /**
     * 保存背包
     * @param out
     * @throws java.lang.Exception
     */
    public void saveBag(DataOutputStream out) throws Exception {
        out.writeShort(bagItemCnt);
        for (int index = 0; index < bagItemCnt; index++) {
            MyItem item = bagItems[index];
            item.save(out);
        }
    }

    /**
     * 读取背包
     * @param in
     * @throws java.lang.Exception
     */
    public void readBag(DataInputStream in) throws Exception {
        items.clear();
        bagItems = new MyItem[ITEM_CNT];
        bagItemCnt = 0;
        equipmentItem = new MyItem[ACTOR_EQUIP_CNT];
        int itemSize = in.readShort();

        for (int index = 0; index < itemSize; index++) {
            MyItem item = new MyItem();
            item.load(in);
            items.put(item.getId(), item);
            addBagItems(item);
            if (item.isActorEquip) {
                equipmentItem[item.item.type] = item;
            }
        }
    }
    
    /**
     * 刷新主角升级
     */
    public void updateActorLv()
    {
        lv++;
        EffortManager.getInstance().addMaxLv(lv);
        if (lv == 2) {
            GameContext.addVar(EffortManager.EFFORT_LV_UP, 2);
        } else {
            GameContext.addVar(EffortManager.EFFORT_LV_UP, 1);
        }
        featPoints ++;
        appendAp += 6;
        appendDp += 2;
        appendHp += 20;
        appendMp += 5;
//        if(lv < 10)
//        {
//            appendBigAttackProb ++;
//            appendAvoidProb ++;
//        }
//        else
//        {
//            if(appendBigAttackProb < 25 && appendAvoidProb < 25)
//            {
//                int lvCount = lv / 10 + 1;
//                if ((lv % lvCount) == (lvCount - 1))
//                {
//                    appendBigAttackProb++;
//                    appendAvoidProb++;
//                }
//            }
//        }
        maxEx = 150 * lv * lv;
        GameContext.page.setDrawActorLv();
        updateBaseData();
        //满血满魔
        hp = maxHp;
        mp = maxMp;
        loseHp = hp;
    }
    
    public void addAttr(int attrKind, int data)
    {
        switch(attrKind)
        {
            case EXP_ATRR:
                addEx(data);
                break;
            case MONEY_ATTR:
                addMoney(data);
                break;
            case FEAT_ATTR:
                addFeat(data);
                break;
        }
    }
    
    /**
     * 获取属性名称
     * @param attrKind
     * @return
     */
    public String getAttrName(int attrKind, int attrValue)
    {
        switch(attrKind)
        {
            case HP_ATTR:
                return attrValue + "点生命值";
            case DP_ATTR:
                return attrValue + "点防御力";
            case MP_ATTR:
                return attrValue + "点内力值";
            case AP_ATTR:
                return attrValue + "点攻击力";
            case BIG_ATTACK_ATTR:
                return attrValue + "点暴击率";
            case AVOID_ATTR:
                return attrValue + "点闪避率";
            case MONEY_ATTR:
                return "金钱" + attrValue + "金";
            case EXP_ATRR:
                return attrValue + "点经验";
            case FEAT_ATTR:
                return attrValue + "点功绩";
        }        
        return "未定义";
    }    
    
    /**
     * 刷新基础数值
     */
    public void updateBaseData()
    {
        maxEx = 50 * lv * lv + 50;
        maxHp = equipHp + appendHp;
        maxMp = equipMp + appendMp;
        loseHp = hp = hp > maxHp ? maxHp : hp;
        mp = mp > maxMp ? maxMp : mp;
        ap = equipAp[0] + appendAp;
        dp = equipDp + appendDp;
        bigAttackProb = equipBigAttackProb + appendBigAttackProb;
        avoidProb = equipAvoidProb + appendAvoidProb;
    }
    
    
    public void load(String roleFile) {
        try {
            DataInputStream dataIn = roleMgr.openFile(roleFile);  
            
            //抛弃角色类型
            dataIn.readShort();
            
            readAttrs(dataIn);
            readActions(dataIn);
            dir = PaintUnit.DOWN;
            changeAction();
            readSkills(dataIn);
            readAttackKinds(dataIn);
            dataIn.close();
            updateBaseData();
            readSuperCartoon();
            //TODO               
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    private void readSuperCartoon() {
//        superCartoon = new PaintUnit();
//        final short SUPER_ANI = 84;
//        AnimationManager.getInstance().getAnimation(SUPER_ANI, superCartoon);
//        superCartoon.initFrame();
    }
    
    private void readActions(DataInputStream dataIn) throws IOException {
        //记录多套动作的字段，废弃,又有用了
        int actsCnt = dataIn.read();
        acts = new RoleAction[actsCnt][];

        for (int index = 0; index < actsCnt; index++)
        {
            int actCnt = dataIn.read() & 0xff;
            acts[index] = new RoleAction[actCnt];

            for (int iact = 0; iact < actCnt; iact++)
            {
                RoleAction act = RoleAction.loadAction(dataIn);
                acts[index][iact] = act;
            }
        }

        boolean haveAttackEffect = dataIn.readBoolean();
        if (haveAttackEffect)
        {
            RoleAction.loadAction(dataIn);
        }
    }
    
    private void readAttrs(DataInputStream dataIn) throws IOException {
        int attrCnt = dataIn.readShort();
        for(int iattr = 0; iattr < attrCnt; iattr++) {
            int attrType = dataIn.readShort();
            readAttr(dataIn, attrType);
        }
    }
    
    private void readAttr(DataInputStream dataIn, int attrType) throws IOException {
        switch (attrType)
        {
            case HP_ATTR:
                hp = dataIn.readShort();
                maxHp = hp;
                break;
                
            case DP_ATTR:
                dp = dataIn.readShort();
                break;
                
            case MP_ATTR:
                mp = dataIn.readShort();
                maxMp = mp;
                break;
                
            case AP_ATTR:
                ap = dataIn.readShort();
                break;

            case HIT_ATTR:
                dataIn.readShort();
                break;

            case BIG_ATTACK_ATTR:
                bigAttackProb = dataIn.readShort();
                break;

            case AVOID_ATTR:
                avoidProb = dataIn.readShort();
                break;
        }
    }
    
    /**
     * 读取人物技能
     * @param dataIn
     */
    private void readSkills(DataInputStream dataIn) throws IOException {
        attackSkills = loadAttackSkills(dataIn);
        
        dataIn.readByte();//读取被动技能的个数，忽略
        dataIn.readByte();//读取特殊技能的个数，忽略
    }
    
    private AttackSkill[] loadAttackSkills(DataInputStream dataIn) throws IOException {
        int count = dataIn.readByte() & 0xff;
        AttackSkill[] skills = new AttackSkill[count];
        for(int iskill = 0; iskill < count; iskill++)
        {
            AttackSkill skill = new AttackSkill();
            skill.load(dataIn);
            skill.id = iskill;
            skills[iskill] = skill;
        } 
        
        return skills;
    }
    
    /**
     * 读取人物的攻击种类，因为只有一种，所以忽略之
     * @param dataIn
     * @throws java.io.IOException
     */
    private void readAttackKinds(DataInputStream dataIn) throws IOException
    {
        int count = dataIn.readByte() & 0xff;
        String[] attackKinds = new String[count];
        for (int index = 0; index < count; index++)
        {
            attackKinds[index] = dataIn.readUTF();
        }
    }


    /**
     * 补血
     * @param hp
     */
    public void addHp(int hp)
    {
        this.hp += hp;
        if(this.hp >= maxHp)
        {
            this.hp = maxHp;
        }
    }
    
    /**
     * 补满血
     */
    public void fillAllHp()
    {
        hp = maxHp;
    }

    public void loseHp(int hp) {
        this.hp -= hp;
        if(this.hp < 0)
        {
            this.hp = 0;
        }
    }
    
    /**
     * 补充法力
     * @param mp
     */
    public void addMp(int mp)
    {
        this.mp += mp;
        if(this.mp >= maxMp)
        {
            this.mp = maxMp;
        }
    }
    
    /**
     * 补满法力
     */
    public void fillAllMp()
    {
        mp = maxMp;
    }

    public void loseMp (int mp) {
        this.mp -= mp;
        if(this.mp < 0)
        {
            this.mp = 0;
        }
    }

    public void updateAddItem()
    {
        addHPItem = null;
        addMPItem = null;
        short[] addHpId = MyItem.ADD_HP_ITEM_ID;
        for(int index = 0, count = addHpId.length; index < count; index++)
        {
            MyItem item = getItemFromActorBag(addHpId[index]);
            if(item != null)
            {
                addHPItem = item;
                break;
            }
        }
        short[] addMpId = MyItem.ADD_MP_ITEM_ID;
        for (int index = 0, count = addHpId.length; index < count; index++)
        {
            MyItem item = getItemFromActorBag(addMpId[index]);
            if(item != null)
            {
                addMPItem = item;
                break;
            }
        }
    }

    //补血
    public void addHpFromCure() {
        if(GameContext.script != null && !GameContext.script.isEnd())
        {
            return;
        }
        if(addHPItem == null || addHPItem.cnt <= 0)
        {
            return;
        }
        if(hp >= maxHp >> 1)
        {
            return;
        }
        addHPItem.use();
        addHPItem.cnt--;
        if(loseHp < hp)
        {
            loseHp = hp;
        }
        StringBuffer buf = new StringBuffer();
        buf.append("自动使用");
        buf.append(addHPItem.item.name);
        buf.append("恢复生命");
        GameContext.page.showFlashNote(buf.toString().toCharArray());
        if(addHPItem.cnt == 0) {
            items.remove(addHPItem.getId());
            addHPItem = null;
            updateAddItem();
        }

        isAddHpOrMp = true;
        addHpFromCure();
    }

    /**
     * 自动补充怒气
     */
    private void addMpFromCure()
    {
        if(GameContext.script != null && !GameContext.script.isEnd())
        {
            return;
        }
        if (addMPItem == null || addMPItem.cnt <= 0) {
            return;
        }
        if(mp >= maxMp >> 1)
        {
            return;
        }
        addMPItem.use();
        addMPItem.cnt--;
        //显示提示信息
        StringBuffer buf = new StringBuffer();
        buf.append("自动使用");
        buf.append(addMPItem.item.name);
        buf.append("恢复内力");
        GameContext.page.showFlashNote(buf.toString().toCharArray());
        if (addMPItem.cnt == 0) {
            items.remove(addMPItem.getId());
            addMPItem = null;
            updateAddItem();
        }

        isAddHpOrMp = true;
        addMpFromCure();
    }

    public RoleAction getNormalAction(int state)
    {
        return acts[0][state];
    }

    public void resetAction() {
        curAct = acts[curActIndex][status];
    }
    
    public void logic()
    {
        if(!visible)
        {
            return;
        }
        if (status == DEAD_STATUS) {
            return;
        }
        isDie = false;
        updateAddItem();
        updatSkillCoolTime();
        addHpFromCure();
        addMpFromCure();
        updateSuper();
        //后面的动作都可能调整动画        
        updateKeepAttackEffect();
        
        if(GameContext.page.isTalk || GameContext.page.isSelectTalk) {
            return;
        }
        if (isMess) {
            return;
        }

        //如果改变了动画，这次就不要更新动画了
        if(!GameContext.page.observerMode && !isStopKey) {
            updateKey();
        }

        if(curAct != null) {
            curAct.updateSpeed(this);
        }
        if(haveMoveTask) {
            updateMoveTask(false, false);
            GameContext.page.updateCameraByActor();
        }else if(haveMoveLine)
        {
            curAct.updateSpeed(this);
            updateMoveLineTask(false, false);
            GameContext.page.updateCameraByActor();
        } else {
            updatePosition();
        }
        
        if(GameContext.script == null || GameContext.script.isEnd()) {
            //触发脚本
            int scriptX = x;
            int scriptY = y;
            ScriptEngine script = GameContext.map.getEvent(scriptX, scriptY);
            if(script != null) {
                script.init();
                GameContext.script = script;               
                script.execute();
                if(GameContext.script.isEnd())
                {
                    GameContext.script = null;
                }
                return;
            }
        }         
    }
    
    public void update() {
        if(!visible)
        {
            return;
        }
        //先更新当前动画的帧数
        int curFrame = frameId;
        updateAnimation();
        if(curFrame != frameId)
        {
            //写入变速运动功能
            int effort = curAct.getEffect(curActionIndex, frameId);
            if (effort >= 0)
            {
                GameContext.page.setEffort(effort);                
            }
        }   
    }

    /**
     * 刷新主角身上的不量效果
     */
    private void updateKeepAttackEffect()
    {
        if(keepAttackEffect != null)
        {
            keepAttackEffect.logic(this);
        }
        if(attackEffect != null)
        {
            attackEffect.isLive = true;
        }        
    }
    
    private void updatePosition() {
        if(speed == 0) {            
            return;
        }
        resetNextPosition(this, dir, speed);
        
        //是否撞上其他人
        if(!isPhysical)
        {
            if (!roleMgr.canMove(this, nextX, nextY))
            {
                if(x == nextX && y == nextY)
                {
                    return;
                }
                setPosition(nextX, nextY);
                return;
            }
            GameContext.map.moveRole(this, dir, x, y, nextX, nextY, false, false);
        }
        else
        {
            setPosition(nextX, nextY);
        }
        GameContext.page.updateCameraByActor();
    }
    
    void doAnimationEnd() {
        curAct.updateSpeed(this);
        //如果是死亡动画的话设置死亡
        if (status == DEAD_STATUS) {
            setActorDie();
            return;
        }
        //如果是受伤结束恢复站立
        if(status == HURT_STATUS || status == FALL_STATUS || status == JUMP_STATUS)
        {
            status = STAND_STATUS;
            changeAction();
            isStopKey = false;
            isPhysical = false;
            return;
        }
        
        if(status != ATTACK_STATUS) {
            resetFrame();
            return;
        }
        
        //下一个攻击动作
        KeyManager keyMgr = GameContext.page.keyMgr;
        if(isRunSkillAttack)
        {
            //如果是盾的技能，中途可以改变方向
            if (curAttackSkillIndex == 2 && curActionIndex < curAct.aniCnt - 1) {
                if(keyMgr.isPressed(Keys.MASK_UP) || keyMgr.isPressed(Keys.MASK_NUM2)) {
                    dir = UP;
                }
                if(keyMgr.isPressed(Keys.MASK_DOWN) || keyMgr.isPressed(Keys.MASK_NUM8)) {
                    dir = DOWN;
                }
                if(keyMgr.isPressed(Keys.MASK_LEFT) || keyMgr.isPressed(Keys.MASK_NUM4)) {
                    dir = LEFT;
                }
                if(keyMgr.isPressed(Keys.MASK_RIGHT) || keyMgr.isPressed(Keys.MASK_NUM6)) {
                    dir = RIGHT;
                }
                curActionIndex++;
                actId = curAct.getAnimation(dir, curActionIndex);
                resetFrame();
                curAct.updateSpeed(this);
                return;
            }
            endAttack();
            return;
        }
        if(!keyMgr.isPressed(Keys.MASK_NUM5) && !keyMgr.isPressed(Keys.MASK_FIRE) && !fireKeyPressed)
        {
            endAttack();
            return;
        }
        fireKeyPressed = false;
        curActionIndex++;
        if(curActionIndex >= curAct.aniCnt)
        {
            curActionIndex = 0;
        }
        actId = curAct.getAnimation(dir, curActionIndex);
        resetFrame();
        curAct.updateSpeed(this);
    }
    
    private void endAttack() {
//        if(shadows != null)
//        {
//            shadows.clear();
//        }
        //如果是技能结束就恢复站立
        if(curAttackSkill != null)
        {
            curAttackSkill.endSkillEffort();            
            curAttackSkill = null;
        }
        curActionIndex = 0;
        GameContext.page.setEffort(0);
        isStopKey = false;
        isPhysical = false;
        isRunSkillAttack = false;
        status = STAND_STATUS;
        changeAction();
    }
    /**
     * 根据主角身边的NPC更改主角的方向
     */
    private void reviseActorAttackNpcDirection()
    {
        final int DIS = 16;
        final int LENGTH_DIS = 48;
        /**
         * 上下左右四个方向的敌人个数
         */
        byte[] dirNpcCount = new byte[4];
        boolean isHaveNpc = false;
        int disX = 0;
        int disY = 0;
        boolean isSaveCol = false;
        boolean isSaveRow = false;
        for(int index = 0, npcCnt = roleMgr.npcMap.size(); index < npcCnt; index++)
        {
            Npc curNpc = roleMgr.npcs[index];
            if (!curNpc.enemy || !curNpc.visible || curNpc.isHide || curNpc.isHelper)
            {
                continue;
            }
            disX = curNpc.x - x;
            disY = curNpc.y - y;
            isSaveCol = Math.abs(disX) <= DIS;
            isSaveRow = Math.abs(disY) <= DIS;
            
            //npc在主角的左边
            if(disX <= 0 && disX >= -LENGTH_DIS && isSaveRow)
            {
                dirNpcCount[LEFT] ++;
                isHaveNpc = true;
                continue;
            }
            //NPC在主角的右边
            if(disX >= 0 && disX <= LENGTH_DIS && isSaveRow)
            {
                dirNpcCount[RIGHT] ++;
                isHaveNpc = true;
                continue;
            }
            //npc在主角的上边
            if(disY <= 0 && disY >= -LENGTH_DIS && isSaveCol)
            {
                dirNpcCount[UP] ++;
                isHaveNpc = true;
                continue;
            }
            //NPC在主角的下边
            if(disY >= 0 && disY <= LENGTH_DIS && isSaveCol)
            {
                dirNpcCount[DOWN] ++;
                isHaveNpc = true;
                continue;
            }
        }
        //如果主角当前方向有敌人的话,或者根本就没有敌人的话就返回，否则就改变方向
        if(dirNpcCount[dir] != 0 || !isHaveNpc)
        {
            return;
        }
        int dirIndex = -1;
        int npcCount = 0;
        for (int index = 0; index < dirNpcCount.length; index++)
        {
            if (dirNpcCount[index] > npcCount)
            {
                npcCount = dirNpcCount[index];
                dirIndex = index;
            }
        }
        if(dirIndex != dir)
        {
            dir = dirIndex;
            changeDir();
        }
    }

    /**
     * 更换主角动画组
     * @param kind
     */
    public void changeActGroup(int kind)
    {
        if(curActIndex == kind)
        {
            return;
        }
        curActIndex = kind;
        changeAction();
        imgReady = false;
        changeAction();
    }

    /**
     * 主角是否在攻击
     * @return
     */
    public boolean isActorAttack()
    {
        if(curActIndex != 0)
        {
            return false;
        }
        return status == ATTACK_STATUS;
    }

    /**
     * 
     * @return 是否已经变更了动画
     */
    private void updateKey() {
        if(GameContext.page.effortDrawName != null)
        {
            return;
        }
        if(status == JUMP_STATUS || status == FLY_STATUS || status == FALL_STATUS)
        {
            return;
        }
        if(!visible)
        {
            return;
        }
        KeyManager keyMgr = GameContext.page.keyMgr;
        if(GameContext.actor.curActIndex == 0 && !GameContext.page.sceneMode)
        {
            if (isLearn[SKILL_COUNT - 1] != 0 && keyMgr.isPressed(Keys.MASK_NUM9) && skillCoolTime[SKILL_COUNT - 1] == 0) {
                startBigAttackSkill(SKILL_COUNT - 1);
                keyMgr.resetKey();
                keyMgr.resetKeyIm();
                return;
            }
            int skillIndex = -1;
            for (int index = 0; index < SKILL_KEY.length; index++) {
                if (!keyMgr.isPressed(SKILL_KEY[index])) {
                    continue;
                }
                if (isLearn[index] == 0) {
                    break;
                }
                if (skillCoolTime[index] > 0) {
                    break;
                }
                if (mp < SKILL_NEED_MP[index * SKILL_LV_COUNT + isLearn[index] - 1]) {
                    GameContext.page.showFlashNote("内力不足！");
                    break;
                }
                skillIndex = index;
                break;
            }
            if(skillIndex != -1)
            {
                startBigAttackSkill(skillIndex);
                keyMgr.resetKey();
                keyMgr.resetKeyIm();                  
                return;
            }
        }
        
        //fire键别按下
        if(keyMgr.isPressed(Keys.MASK_NUM5) || keyMgr.isPressed(Keys.MASK_FIRE)) {
            if(status != ATTACK_STATUS && GameContext.actor.curActIndex == 0 && !GameContext.page.sceneMode) {
                fireKeyPressed = false;
                status = ATTACK_STATUS;
                changeAction();
                reviseActorAttackNpcDirection();
//                if (shadows == null)
//                {
//                    shadows = new ShadowArray(3);
//                }
//                shadows.clear();
                return;
            }
        }
        
        if(status == ATTACK_STATUS || status == HURT_STATUS) {
            return;
        }

        if(keyMgr.isPressed(Keys.MASK_UP) || keyMgr.isPressed(Keys.MASK_NUM2)) {
            testDirKey(MOVE_STATUS, UP);
            return;
        }
        
        if(keyMgr.isPressed(Keys.MASK_DOWN) || keyMgr.isPressed(Keys.MASK_NUM8)) {
            testDirKey(MOVE_STATUS, DOWN);
            return;
        }
        
        if(keyMgr.isPressed(Keys.MASK_LEFT) || keyMgr.isPressed(Keys.MASK_NUM4)) {
            testDirKey(MOVE_STATUS, LEFT);
            return;
        }
        
        if(keyMgr.isPressed(Keys.MASK_RIGHT) || keyMgr.isPressed(Keys.MASK_NUM6)) {
            testDirKey(MOVE_STATUS, RIGHT);
            return;
        }      
        if(status == STAND_STATUS)
        {
            keyMgr.resetKey();
            keyMgr.resetKeyIm();
            return;
        }
        else if(!keyMgr.isPressed(Keys.MASK_UP) && !keyMgr.isPressed(Keys.MASK_NUM2) && !keyMgr.isPressed(Keys.MASK_DOWN) && !keyMgr.isPressed(Keys.MASK_NUM8)
                && !keyMgr.isPressed(Keys.MASK_LEFT) && !keyMgr.isPressed(Keys.MASK_NUM4) && !keyMgr.isPressed(Keys.MASK_RIGHT) && !keyMgr.isPressed(Keys.MASK_NUM6))
        {
            status = STAND_STATUS;
            changeAction();
            keyMgr.resetKey();
            keyMgr.resetKeyIm();            
        }
    }
    
    private void testDirKey(int status, int dir) {
        if(this.status == status && this.dir == dir) {
            //继续播放动画就好
            return;
        }
        this.status = status;
        this.dir = dir;
        changeAction();
    }
    
    public void setPosition(int x, int y) {
        GameContext.groundMat.updateUnit(this, x, y);
    }

    public void addPaintMatrix() {
        GameContext.groundMat.addUnit(this);
    }

    public void removePaintMatrix() {
        GameContext.groundMat.removeUnit(this);
    }

    public void updatePaintMatrix() {
        GameContext.groundMat.updateUnit(this, x, y);
    }
    
    public void paint(Graphics g, int offsetX, int offsetY) {
        if(keepAttackEffect != null)
        {
            keepAttackEffect.draw(g, this);
        }        
        if(!visible)
        {
            return;
        }
        //#if N7370 || N7370small
//#         paintAnimation(g, offsetX, offsetY);
        //#else
//        if (status == ATTACK_STATUS && actId >= 16 && actId <= 19)
//        {
//            shadows.paintAnimation(this, x, y);
//            shadows.paint(g, offsetX, offsetY);
//        }
//        else
        {
            paintAnimation(g, offsetX, offsetY);
        }
        //#endif
        
        //#if PRINTDEBUG == 1
//        drawX = x - offsetX;
//        drawY = y - offsetY;
//        g.drawRect(drawX - 5, drawY - 4, 10, 6);
        //#endif
        if(GameContext.page.addCartoon != null && isAddHpOrMp)
        {
            GameContext.page.addCartoon.x = x;
            GameContext.page.addCartoon.y = y;
            GameContext.page.addCartoon.paintAnimation(g, offsetX, offsetY);
            if(GameContext.page.addCartoon.isEndAnimation())
            {
                isAddHpOrMp = false;
                GameContext.page.addCartoon.resetFrame();
                return;
            }
            GameContext.page.addCartoon.playNextFrame();
        }
//        if (superCartoon != null && isSuper)
//        {
//            superCartoon.x = x;
//            superCartoon.y = y + 30;
//            superCartoon.paintAnimation(g, offsetX, offsetY);
//            if(superCartoon.isEndAnimation())
//            {
//                superCartoon.resetFrame();
//                return;
//            }
//            superCartoon.playNextFrame();
//        }
    }
    
    /**
     * 记录按键的目的，是为了记录抬起，没有按下的按键，在抬起中是无效的
     * 这是为了防止上一层窗口遗留的按键抬起事件污染到后面的GamePage中Actor的行为
     * @param keyCode
     */
    public void keyPressed(int keyCode) {
        if(isStopKey)
        {
            return;
        }
        switch(keyCode) {
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:                
                doKeypressedScript();
                break;                 
        }
    }
    
    private void doKeypressedScript()
    {
        if(GameContext.page.checkingTalkNpc || GameContext.page.openBoxStatus)
        {
            return;
        }
        if(GameContext.script != null && !GameContext.script.isEnd()) {
            return;
        }

        ScriptEngine e = null;
//        ScriptEngine e = roleMgr.getScriptFromCloseNpc();
        Npc npc = roleMgr.getCloseNpcHaveScript();
        if (npc != null) {
            e = npc.getAi(Npc.TALK_SCRIPT);
            if (e != null) {
                GameContext.page.checkingTalkNpc = true;
                GameContext.script = e;
                GameContext.page.curNpc = npc;
                GameContext.page.keyMgr.resetKey();
                GameContext.page.keyMgr.resetKeyIm();
                return;
            }
        }
        
        ChestBox chestBox = roleMgr.getCloseChest();
        if(chestBox != null) {
            e = chestBox.getAi();
            if(e != null)
            {
                GameContext.page.openBoxStatus = true;
                e.init();
                GameContext.script = e;
                GameContext.page.curBox = chestBox;
                GameContext.page.keyMgr.resetKey();
                GameContext.page.keyMgr.resetKeyIm();
                return;
            }
        }
        if(!fireKeyPressed)
        {
            fireKeyPressed = true;
        }
    }
    
    public void keyReleased(int keyCode) {
        if(isStopKey)
        {
            return;
        }
        if(GameContext.page.checkingTalkNpc || GameContext.page.openBoxStatus)
        {
            return;
        }
        switch(keyCode) {
            case Keys.KEY_FIRE:
            case Keys.KEY_NUM5:
                break;
        }
    }
    
    public void attacked(Npc npc) {
        //无敌呐
        if(isSuper) {
            return;
        }
        if (status == DEAD_STATUS) {
            return;
        }
        if (npc.attackEffect != null && npc.attackEffect.isCanUseAttackEffect()) {
            keepAttackEffect = npc.attackEffect.clone();
            npc.attackEffect = null;
        }
        if (keepAttackEffect != null) {
            if (keepAttackEffect.effectType == AttackEffect.SUCK_EFFECT) {
                return;
            }
        }
        if (isRunSkillAttack && curAttackSkillIndex >= SKILL_COUNT - 2) {
            return;
        } 
        //如果有反击效果的话
        if(attackEffect != null)
        {
            attackEffect.logicPassive(npc);
        }
        //让主角朝向攻击的NPC
        if(status != ATTACK_STATUS) {
            if(npc.dir == UP || npc.dir == LEFT) {
                dir = npc.dir + 1;
            } else {
                dir = npc.dir - 1;
            }
        }
        
        int curLoseHp = npc.getAttackPoint();
        //#if PRINTDEBUG == 1
//        System.out.println("" + npc.name + ":攻击力 = " + curLoseHp);
        //#endif
        
        int curAvoid = GameContext.getRand(0, 100);
        //没打中
        if (avoidProb / 5 + 10 > curAvoid) {
//            System.out.println("" + npc.name + "没有打中侯文麟。啊哈哈哈哈哈，闪避=" + avoidProb);
            return;
        }
        if(avoidProb / 5 + 10 > curAvoid) {
            return;
        }
        
        //NPC攻击主角，没有暴击伤害
        //普通伤害
        curLoseHp -= dp;
        //#if PRINTDEBUG == 1
//        System.out.println("主角防御力 = " + dp);
        //#endif
        
        //减少防御力的
        int ranDp = GameContext.getRand(-50, 50);
        curLoseHp += curLoseHp * ranDp / 500;        
        if(curLoseHp < 0)
        {
            curLoseHp = 1;
        }
        
        //#if PRINTDEBUG == 1
//        System.out.println("主角损失生命:" + curLoseHp);
//        System.out.println("主角当前血量:" + hp);
        //#endif
        this.loseHp = hp;               
        hp -= curLoseHp & 0xffffff;
        //#if PRINTDEBUG == 1
//        System.out.println("主角受攻击之后血量：" + hp);
        //#endif
        addHpFromCure();
        //#if PRINTDEBUG == 1
//        System.out.println("主角补充生命之后血量：" + hp);
        //#endif
        
        if(hp <= 0)
        {
            status = DEAD_STATUS;
            changeAction();
            return;
        }  
        //如果当前有技能技能立刻结束
        if(curAttackSkill != null)
        {
            curAttackSkill.endSkillEffort();   
            curAttackSkill = null;
        }
        //在发动武将计的时候僵硬
        if(isRunSkillAttack)
        {
            return;
        }
        //#if PRINTDEBUG == 1
//        System.out.println("npc" + npc.name + "攻击完毕");
        //#endif
        GameContext.page.setEffort(0);
        status = HURT_STATUS;
        changeAction();
    }
    
    public void attacked(Arrow arrow) {
        if(arrow.isAttack && !arrow.file.isFullScreenAttack)
        {
            return;
        }
        arrow.isAttack = true;
        //无敌呐
        if(isSuper) {
            return;
        }
        if (status == DEAD_STATUS) {
            return;
        }
        if (isRunSkillAttack && curAttackSkillIndex >= SKILL_COUNT - 2) {
            return;
        }
        //把弓箭的攻击效果赋值给主角
        arrow.attackEndLogic(this);
        //让主角朝向攻击的NPC
        if(status != ATTACK_STATUS) {
            if(arrow.dir == UP || arrow.dir == LEFT) {
                dir = arrow.dir + 1;
            } else {
                dir = arrow.dir - 1;
            }
        }
        
        int curLoseHp = arrow.getAttackPoint();
//        //如果攻击力是0的话代表秒杀主角
        //#if PRINTDEBUG >= 1
//        System.out.println("投掷物id="+arrow.ani.id+"；投掷物攻击力="+arrow.ap);
        //#endif
        int curAvoid = GameContext.getRand(0, 100);
        //没打中
        if (avoidProb / 5 + 10 > curAvoid) {
//            System.out.println("" + arrow.ani.id + "没有打中侯文麟。啊哈哈哈哈哈，闪避=" + avoidProb);
            return;
        }
        if(avoidProb / 5 + 10 > curAvoid) {
            //#if PRINTDEBUG == 1
//            System.out.println("闪避了投掷物攻击");
            //#endif
            return;
        }
        //减少防御力的
        int ranDp = GameContext.getRand(-50, 50);
        
        //NPC攻击主角，没有暴击伤害
        //普通伤害
        curLoseHp -= dp;        
        curLoseHp += curLoseHp * ranDp / 500;
        if(curLoseHp < 0)
        {
            curLoseHp = 1;
        }
        
        //#if PRINTDEBUG == 1
//        System.out.println(name + "损失生命:" + curLoseHp);
        //#endif
        this.loseHp = hp;
        hp -= curLoseHp & 0xffffff;
        addHpFromCure();
        
        if(hp <= 0)
        {
//            setActorDie();
            status = DEAD_STATUS;
            changeAction();
            return;
        }
        //如果当前有技能技能立刻结束
        if(curAttackSkill != null)
        {
            curAttackSkill.endSkillEffort();            
            curAttackSkill = null;
        }
        //在发动武将计的时候僵硬
        if(isRunSkillAttack)
        {
            return;
        }
        //#if PRINTDEBUG == 1
//        System.out.println("arrow" + "攻击完毕");
        //#endif        
        GameContext.page.setEffort(0);
        status = HURT_STATUS;
        changeAction();        
    }
    
    private void setActorDie()
    {
        if(dieScript != null)
        {
            hp = 1;
            dieScript.init();
            GameContext.script = dieScript;
            dieScript = null;
            GameContext.script.execute();
            return;
        }
        if(isDie)
        {
            return;
        }        
	hp = 0;
        isDie = true;
        isStopKey = false;
        isRunSkillAttack = false;
        //#if SMS == 1
        if(GameContext.script != null)
        {
            GameContext.script.setEnd();
        }
        GameContext.page.observerMode = false;
        GameContext.script = null;
        GameContext.page.script = null;
        final short BUY_LIFE = 132;
        GameContext.page.dlg.btnBoxOp = Dialog.LIFE_OP;
        if (!Sms.allStory) {
            GameContext.page.dlg.showButtonBox("您还未开启关卡，是否免费原地复活？".toCharArray());
        }
        else {
            GameContext.page.dlg.showButtonBox(StringManager.getInstance().getString(BUY_LIFE));
        }
    }
    
    /**
     * 更新无敌状态
     */
    private void updateSuper() {
        if(!isSuper) {
            return;
        }
        
        if(MainCanvas.currentFrame - superStartTime >= superDuration) {
            isSuper = false;
            superStartTime = 0;
            superDuration = 0;
        }
        if (keepAttackEffect != null) {
            keepAttackEffect.delEffect(GameContext.actor);
            keepAttackEffect = null;
        }
    }
    
    /**
     * 设置无敌
     * @param time 无敌周期
     */
    public void setActorSuper(int time)
    {
        isSuper = true;
//        superCartoon.initFrame();
        superStartTime = MainCanvas.currentFrame;
        superDuration = time;
        GameContext.actor.visible = true;
        if(GameContext.actor.keepAttackEffect != null)
        {
            GameContext.actor.keepAttackEffect.delEffect(GameContext.actor);        
            GameContext.actor.keepAttackEffect = null;
        }
    }
    
    /**
     * 获取攻击力
     * @return
     */
    public int getAttackCount()
    {
        int curAp = ap;
        if (isRunSkillAttack && equipAp[curAttackSkillIndex] != 0) {
            curAp += equipAp[curAttackSkillIndex + 1] - equipAp[0];
        }
        //是否暴击
        if(GameContext.getRand(0, 100) < bigAttackProb / 5 + 10)
        {
            curAp |= 1 << 31;
        }
        return curAp;
    }

    /**
     * 是否攻击npc
     * @return
     */
    public boolean isAttackActor()
    {
        return curActIndex != 1;
    }

    //*****************技能相关数据**************************//
    /**
     * 技能个数
     */
    final int SKILL_COUNT = EQUIP_WEAPON_COUNT;
    /**
     * 每个技能的等级
     */
    final int SKILL_LV_COUNT = 3;

    /**
     * 技能学习等级，0为没有学习
     */
    public int[] isLearn = new int[SKILL_COUNT];

    /**
     * 学习当前技能
     */
    public void learnCurSkill(int curLearnIndex)
    {
        if (isLearn[curLearnIndex] > 0) {
            return;
        }
        isLearn[curLearnIndex] = 1;
        initAttackSuperFile();
    }

    /**
     * 升级技能
     * @param curSkillIndex
     */
    public void updataCurSkill(int curSkillIndex)
    {
        if (isLearn[curSkillIndex] >= SKILL_LV_COUNT) {
            return;
        }
        isLearn[curSkillIndex]++;
    }

    /**
     * 初始化被动技能数据
     */
    private void initSkillData()
    {
    }

    /**
     * 刷新被动技能数据
     */
    final private void updateSkillData()
    {
    }

    /**
     * 所需要的内力
     */
    private int[] SKILL_NEED_MP =
    {
        30, 35, 40,
        40, 55, 70,
        50, 52, 55,
        100, 125, 150,
        0, 0, 0,
    };

    /**
     * 技能需要冷却时间
     */
    public int[] SKILL_NEED_COOL_TIME =
    {
        20, 16, 12, 
        10, 9, 8, 
        25, 20, 15, 
        50, 45, 40,
        80, 80, 80,
    };

    /**
     * 技能当前冷却时间
     */
    public int[] skillCoolTime = new int[SKILL_COUNT];

    /**
     * 技能名称
     */
    public static String[] SKILL_NAME = {"蛇毒", "凤鸣", "熊吼", "龙吟"};

    /**
     * 刷新技能CD时间
     */
    private void updatSkillCoolTime() {
        for (int index = 0; index < SKILL_COUNT; index++) {
            if (skillCoolTime[index] == 0) {
                continue;
            }
            if (isRunSkillAttack && curAttackSkillIndex == index) {
                continue;
            }
            skillCoolTime[index]--;
        }
    }

    /**
     * 技能按键
     */
    private int[] SKILL_KEY = {Keys.MASK_NUM1, Keys.MASK_NUM3, Keys.MASK_NUM7, Keys.MASK_NUM9};

    /**
     * 释放技能
     */
    public void startBigAttackSkill(int skillIndex)
    {
        curAttackSkillIndex = skillIndex;
        isRunSkillAttack = true;
        isStopKey = true;
        skillIndex = curAttackSkillIndex * SKILL_LV_COUNT + isLearn[curAttackSkillIndex] - 1;
        loseMp(SKILL_NEED_MP[skillIndex]);
        skillCoolTime[curAttackSkillIndex] = SKILL_NEED_COOL_TIME[skillIndex];
        if (curAttackSkillIndex == SKILL_COUNT - 1) {
            ScriptEngine script = (ScriptEngine) GameContext.itemScriptHash.get(ARROW_SKILL_SCRIPT_NAME);
            script.init();
            script.execute();
            GameContext.script = script;
            return;
        }
        curAttackSkill = attackSkills[skillIndex];
        curAttackSkill.startSkillEffort();
        attackEffect = curAttackSkill.effect;
        curAct = curAttackSkill.act;
        status = ATTACK_STATUS;
        resetAnimation(true);
        curAct.updateSpeed(this);
    }

    //万箭齐发
    final int ARROW_AP = 300;
    final int ARROW_ROLE_ID = 52;
    static final String ARROW_SKILL_SCRIPT_NAME = "arrowAttackSkill";
    public void startArrowAttacSkill() {
        NpcFile npcFile = roleMgr.getNpcFile((short)ARROW_ROLE_ID);
        Npc npc = new Npc();
        npc.setFile(npcFile);
        npc.setFlash(false);
        npc.isHelper = true;
        npc.name = ARROW_SKILL_SCRIPT_NAME + GameContext.getRand(0, 10000);
        npc.ap = ARROW_AP;
        npc.dir = dir;
        final int[] disX = {-8, -8, -80, 60};
        final int[] disY = {-76, 48, -16, -16};
        int npcX = x + disX[dir];
        int npcY = y + disY[dir];
        npc.status = Role.STAND_STATUS;
        npc.changeAction();
        npc.changeDir();
        npc.setPosition(npcX, npcY);
        roleMgr.addNpc(npc);
        
        isRunSkillAttack = false;
        isStopKey = false;
    }

    public void startSuperAttackSkill(int index) {
        NpcFile npcFile = (index == 0) ? superSkillFile1 : superSkillFile2;
        Npc npc = new Npc();
        npc.setFile(npcFile);
        npc.setFlash(false);
        npc.isHelper = true;
        int npcX = x;
        int npcY = y;
        if (index == 0) {
            npc.name = "superAttackReady" + GameContext.getRand(0, 10000);
            npc.ap = 0;
            npcX = (dir == LEFT || dir == DOWN) ? x - 12 : x + 12;
            npcY = y + 12;
        }
        else {
            npc.name = "superAttack" + GameContext.getRand(0, 10000);
            npc.ap = ap;
            if (equipAp[EQUIP_WEAPON_COUNT - 1] > 0) {
                npc.ap += equipAp[EQUIP_WEAPON_COUNT - 1] - equipAp[0];
            }
            npcX = (Page.SCREEN_WIDTH >> 1) + GameContext.page.offsetX;
            npcY = (Page.SCREEN_HEIGHT >> 1) + GameContext.page.offsetY;
        }
        npc.dir = dir;
        npc.status = Role.STAND_STATUS;
        npc.changeAction();
        npc.changeDir();
        npc.setPosition(npcX, npcY);
        roleMgr.addNpc(npc);
    }

    //大炮和炮弹的role
    public NpcFile superSkillFile1;
    public NpcFile superSkillFile2;
    final int superSkillFileId1 = 40;
    final int superSkillFileId2 = 43;

    /**
     * 读取大招或者攻击特效
     */
    public void initAttackSuperFile()
    {
        if (isLearn[SKILL_COUNT - 2] == 0) {
            return;
        }
        if (superSkillFile1 != null) {
            AnimationManager.getInstance().release(superSkillFile1.standAct.aniId);
            superSkillFile1 = null;
        }
        if (superSkillFile2 != null) {
            AnimationManager.getInstance().release(superSkillFile2.standAct.aniId);
            superSkillFile2 = null;
        }
        int skillLv = isLearn[SKILL_COUNT - 1];
        superSkillFile1 = roleMgr.getNpcFile((short)(superSkillFileId1 + skillLv));
        superSkillFile2 = roleMgr.getNpcFile((short)superSkillFileId2);
    }
}
