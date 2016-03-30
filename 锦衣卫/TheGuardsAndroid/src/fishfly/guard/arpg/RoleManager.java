/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.Hashtable;

/**
 * 每个角色构成一个角色文件，文件名的格式为role+id.dat，在手机上，放在资源中的role目录下
 * @author 何召卫@fishfly.com
 */
public class RoleManager implements RoleConst {
    private static RoleManager instance;
    //#if PKG == 1
//#     public PackageReader pkg;
    //#endif
    
    HashtableShort npcFileMap;
    //投掷物的文件缓存
    HashtableShort arrowFileMap;
    /**
     * 机关文件缓存
     */
    HashtableShort organFileMap;
    /**
     * 宝箱缓存
     */
    HashtableShort chestBoxFileMap;
    
    //这两个结构，一个照顾随机访问，一个照顾遍历
    Hashtable npcMap;
    Npc[] npcs;
    
    /**
     * 是否将npc上锁了
     */
    boolean isNpcLock;
    /**
     * 死亡npc数组
     */
    Npc[] dieNpcs;
    int[] dieNpcsCount;
    int dieNpcSize;
    boolean[] dieNpcByScriptSwitch;
    
    //箱子数组
    ChestBox[] chestBoxs;    
    int chestBoxCnt;
    
    
    //箭头数组
    Arrow[] arrows;
    int arrowCnt;   
    
    Npc boss;    
            
    //用来检测是否可以行走的中间变量
    Rect box1 = new Rect();
    Rect box2 = new Rect();
    Rect box3 = new Rect();
    
    public static RoleManager getInstance() {
        if(instance == null) {
            instance = new RoleManager();
        }
        
        return instance;
    }
    
    /**
     * 设置boss
     * @param boss
     * @param index
     */
    public void setBoss(Npc boss)
    {
        if(!boss.file.boss)
        {
            return;
        }
        if(!boss.visible)
        {
            return;
        }
        this.boss = boss;
        GameContext.page.setBossName(boss.name);
    }     
    
    private RoleManager() {
        //#if PKG == 1
//#         pkg = new PackageReader("/role.idx", "/role.pkg");
        //#endif
        initRole();
    }
    
    /**
     * 初始化所有数据
     */
    public void initRole()
    {
        final int FILE_CACHE = 30;
        npcFileMap = new HashtableShort(FILE_CACHE);
        arrowFileMap = new HashtableShort(FILE_CACHE);
        chestBoxFileMap = new HashtableShort(FILE_CACHE);
        organFileMap = new HashtableShort(FILE_CACHE);
        
        npcMap = new Hashtable();
        final int NPC_CACHE = 80;
        npcs = new Npc[NPC_CACHE];
        dieNpcs = new Npc[NPC_CACHE];
        dieNpcsCount = new int[NPC_CACHE];
        dieNpcByScriptSwitch = new boolean[NPC_CACHE];
        dieNpcSize = 0;

        chestBoxCnt = 0;
        chestBoxs = new ChestBox[NPC_CACHE];

        final int ARROW_CACHE = 80;
        arrows = new Arrow[ARROW_CACHE];
        arrowCnt = 0;
        
        boss = null;
    }
    
    public DataInputStream openFile(String roleFile) throws IOException {
        //#if PKG == 1
//#         return pkg.openFile(roleFile);
        //#else 
        return Util.open("/role/" + roleFile);
        //#endif
    }
    
    public static short getRoleId(String roleFile) {
        return (short)Integer.parseInt(roleFile.substring(4, roleFile.length() - 4));
    }
    
    public static String getRoleFile(short roleId) {
        StringBuffer buf = new StringBuffer("role");
        buf.append(roleId);
        buf.append(".dat");
        String roleFile = buf.toString();
        return roleFile;
    }
    
    public NpcFile getNpcFile(String roleFile) {
        short roleId = getRoleId(roleFile);
        
        NpcFile file = (NpcFile)npcFileMap.get(roleId);
        if(file == null) {
            file = new NpcFile();
            file.id = roleId;
            file.load(roleFile);
            npcFileMap.put(roleId, file);
        }
        return file;
    }
    
    public ChestBoxFile getChestBoxFile(String chestBoxFile) {
        short roleId = getRoleId(chestBoxFile);
        
        ChestBoxFile file = (ChestBoxFile)chestBoxFileMap.get(roleId);
        if(file == null) {
            file = new ChestBoxFile();
            file.id = roleId;
            file.load(chestBoxFile);
            chestBoxFileMap.put(roleId, file);
        }
        return file;
    }    
    
    public ChestBoxFile getChestBoxFile(short roleId) {
        ChestBoxFile file = (ChestBoxFile)chestBoxFileMap.get(roleId);
        if(file == null) {
            String roleFile = getRoleFile(roleId);
            file = new ChestBoxFile();
            file.id = roleId;
            file.load(roleFile);
            chestBoxFileMap.put(roleId, file);
        }
        return file;
    }
    
    public NpcFile getNpcFile(short roleId) {
        NpcFile file = (NpcFile)npcFileMap.get(roleId);
        if(file == null) {
            String roleFile = getRoleFile(roleId);
            file = new NpcFile();
            file.id = roleId;
            file.load(roleFile);
            npcFileMap.put(roleId, file);
        }
        return file;
    }
    
    public ArrowFile getArrowFile(short roleId) {
        ArrowFile file = (ArrowFile)arrowFileMap.get(roleId);
        if(file == null) {
            String roleFile = getRoleFile(roleId);
            file = new ArrowFile();
            file.load(roleFile);
            arrowFileMap.put(roleId, file);
        }
        return file;
    }
    
    public void addChestBox(ChestBox box)
    {
        chestBoxs[chestBoxCnt] = box;
        chestBoxCnt++;
    }
    
    public ChestBox getChestBox(String name)
    {
        for(int index = 0; index < chestBoxCnt; index++)
        {
            if(chestBoxs[index].name.equals(name))
            {
                return chestBoxs[index];
            }
        }
        return null;
    }
    
    public void removeChestBox(ChestBox box)
    {
        boolean hasObj = removeObject(chestBoxs, chestBoxCnt, box);
        if(hasObj && chestBoxCnt > 0) {
            chestBoxCnt--;
        }            
    }   
    
    public void updateChestBox()
    {
        for(int index =0; index < chestBoxCnt; index++)
        {
            chestBoxs[index].logic();
        }
    }
    
    public void addNpc(Npc npc) {
        //填入末尾
        int size = npcMap.size();
        npcs[size] = npc;
        if(npc.file.boss)
        {
            setBoss(npc);
        }
        npcMap.put(npc.name, npc);
    }
    
    public int getNpcCount() {
        return npcMap.size();
    }
    
    /**
     * 写入死亡NPC
     * @param npc
     */
    public void addDieNpc(Npc npc)
    {
        dieNpcsCount[dieNpcSize] = MainCanvas.currentFrame;
        dieNpcs[dieNpcSize] = npc;
        dieNpcByScriptSwitch[dieNpcSize] = false;
        dieNpcSize ++;        
    }
    
    public void addDieNpcWithoutFlash(Npc npc, boolean isScriptSwitch)
    {
        dieNpcsCount[dieNpcSize] = -1;
        dieNpcs[dieNpcSize] = npc;
        dieNpcByScriptSwitch[dieNpcSize] = isScriptSwitch;
        dieNpcSize ++;        
    }    
    
    public void updateDieNpc()
    {
        if(GameContext.script != null && !GameContext.script.isEnd())
        {
            return;
        }
        if(isNpcLock)
        {
            return;
        }
        Npc dieNpc = null;
        final int FLASH_TIME = 600;
        for(int index = 0; index < dieNpcSize; index++)
        {           
            dieNpc = dieNpcs[index];
            if(dieNpcsCount[index] < 0)
            {
                continue;
            }
            if(MainCanvas.currentFrame - dieNpcsCount[index] >= FLASH_TIME)
            {
                delDieNpc(dieNpc, index);
                dieNpc.rise();
                dieNpc.isDrawRisePaint = true;
                addNpc(dieNpc);                
                index --;
            }
        }
    }
    
    public void delDieNpc(Npc npc, int index)
    {
        dieNpcsCount[index] = dieNpcsCount[dieNpcSize - 1];
        dieNpcsCount[dieNpcSize - 1] = 0;
        boolean hasObj = removeObject(dieNpcs, dieNpcSize, npc);
        if(hasObj && dieNpcSize > 0) {
            dieNpcSize--;
        }
    }
    
    /**
     * 相对于遍历来说，删除毕竟是个调用次数比较少的动作，这里处理稍微复杂些就可以原谅了
     * @param npc
     */
    public void removeNpc(Npc npc) {
        int size = npcMap.size();
        npcMap.remove(npc.name);
        
        removeObject(npcs, size, npc);
        //如果删除的npc是boss就删除
        if(npc == boss)
        {
            boss = null;
	    //看看剩下的有没有boss
	    for(int index = 0, cnt = npcMap.size(); index < cnt; index++){
		Npc n = npcs[index];
		if(n.file.boss){
		    boss = n;
		}
	    }
        }
    }
    
    public Npc getNpc(String npcName) {
        return (Npc) npcMap.get(npcName);
    }
    
    public void updateNpc() {
        int npcCnt = npcMap.size();
        for(int inpc = 0; inpc < npcCnt; inpc++) {
            Npc npc = npcs[inpc];
            //因为npc在更新自己的时候有可能会杀死自己
            //所以需要判断一下npc是否为空，目前来看只有npc有这种情况
            if(npc == null)
            {
                continue;
            }
            npc.logic();
            npcCnt = npcMap.size();
        }
        delDieNpc();
        updateDieNpc();
    }
    
    /**
     * 刷新所有的弓箭
     */
    public void updateArrow()
    {
        for(int index = 0; index < arrowCnt; index++)
        {
            Arrow arrow = arrows[index];
            arrow.logic();
            if(!arrow.isLive)
            {
                removeArrow(arrow);
                index --;
                GameContext.flyMat.removeUnit(arrow);
            }
        }
    }

    /**
     * 删除所有的投掷物
     */
    void delAllArrow()
    {
        for(int index = 0; index < arrowCnt; index++)
        {
            Arrow arrow = arrows[index];
            arrow.isLive = false;
        }
    }
        
    /**
     * 删除所有的敌人
     */
    void delAllEnemy()
    {
	GameContext.page.releaseArrowData();
        final int BOSS_COUNT = 5;
        boss = null;
        Npc npc = null;
        Trigger.clearAll();
        for(int index = 0; index < npcMap.size(); index++)
        {
            npc = npcs[index];
            if(!npc.file.boss && npc.enemy && npc.visible)
            {
                removeNpc(npc);
                npc.removePaintMatrix();
                index--;
                continue;
            }
        }
        for(int index = 0; index < arrowCnt; index++)
        {
            Arrow arrow = arrows[index];
            GameContext.flyMat.removeUnit(arrow);
            arrow.isLive = false;
        }
        GameContext.page.setEffort(0);
        GameContext.actor.status = STAND_STATUS;
        GameContext.actor.changeAction();
    }
    
    /**
     * 删除已经死亡的npc
     */
    private void delDieNpc()
    {
        Npc npc = null;
        for(int index = 0; index < npcMap.size(); index++)
        {
            npc = npcs[index];
            if(!npc.isDel())
            {
                continue;
            }
            removeNpc(npc);
            npc.removePaintMatrix();
            index--;
            if(npc.isFlash())
            {
                addDieNpc(npc);
            }
            else
            {
                npc.releaseImages();
            }
        }
    }
    
    public boolean canMove(Role role, int nextX, int nextY) {
        int dir = role.dir;
        if(dir <= PaintUnit.DOWN)
        {
            box1.set(role.x - HALF_BOX, role.y, nextX + HALF_BOX, nextY);
        }
        else
        {
            box1.set(role.x, role.y - BOX_HEIGHT, nextX, nextY + BOX_HEIGHT);
        }
        int npcCnt = npcMap.size();
        Npc canMoveNpc = null;
        for(int inpc = 0; inpc < npcCnt; inpc++) {
            Npc npc = npcs[inpc];
            //不判断敌对npc碰撞
            if (!npc.visible)
            {
                continue;
            }
            if((npc.enemy || npc.file.enemy) && npc.canPass)
            {
               continue;
            }
            if(npc.file != null && !npc.file.enemy && npc.file.trigs.length != 0)
            {
                continue;
            }
            if (npc.isHelper) {
                continue;
            }
            //如果当前npc是不能通过的话就用身体矩形与其碰撞
            if(!npc.canPass)
            {
                npc.getBodyBox(box2);
                box2.offset(npc.x, npc.y);
                if ((box2.pointIn((nextX + role.x) >> 1, (nextY + role.y) >> 1)) || (box2.pointIn(nextX,nextY))){
                    if (role.x != role.nextX) {
                        role.nextX = role.x > box2.xmax ? box2.xmax + 2 : box2.xmin - 2;
                    }
                    if (role.y != role.nextY) {
                        role.nextY = role.y > box2.ymax ? box2.ymax + 2 : box2.ymin - 2;
                    }
                    if (!GameContext.map.canMoveTile(role.nextX >> 4, role.nextY >> 4)) {
                        role.nextX = role.x;
                        role.nextY = role.y;
                    }
                    return false;
                }
                continue;
            }
            if (npc.file.dropMoney == 99) {//单独判断牢门的问题，不合牢门的基点框碰撞
                continue;
            }
            box2.set(npc.x - HALF_BOX, npc.y - BOX_HEIGHT, npc.x + HALF_BOX, npc.y + BOX_HEIGHT);
            if(box1.testIntersect(box2)) {
                if (canMoveNpc == null) {
                    canMoveNpc = npc;
                    continue;
                }
                if(dir == PaintUnit.UP) {
                    canMoveNpc = (canMoveNpc.y < npc.y) ? npc : canMoveNpc;
                }
                else if(dir == PaintUnit.DOWN) {
                    canMoveNpc = (canMoveNpc.y > npc.y) ? npc : canMoveNpc;
                }
                else if(dir == PaintUnit.LEFT) {
                    canMoveNpc = (canMoveNpc.x < npc.x) ? npc : canMoveNpc;
                }
                else {
                    canMoveNpc = (canMoveNpc.x > npc.x) ? npc : canMoveNpc;
                }
            }
        }
        if (canMoveNpc != null) {
            if (role.x != role.nextX) {
                role.nextX = role.x > canMoveNpc.x ? canMoveNpc.x + HALF_BOX + 1 : canMoveNpc.x - HALF_BOX - 1;
            }
            if (role.y != role.nextY) {
                role.nextY = role.y > canMoveNpc.y ? canMoveNpc.y + BOX_HEIGHT + 1 : canMoveNpc.y - BOX_HEIGHT - 1;
            }
            if (!GameContext.map.canMoveTile(role.nextX >> 4, role.nextY >> 4)) {
                role.nextX = role.x;
                role.nextY = role.y;
            }
            return false;
        }
        for (int index = 0; index < chestBoxCnt; index++)
        {
            ChestBox curChest = chestBoxs[index];
            if(!curChest.visible) {
                continue;
            }
            curChest.getBodyBox(box1);
            box1.offset(curChest.x, curChest.y);
            if (box1.pointIn(nextX, nextY))
            {
                if(role.x != role.nextX)
                {
                    role.nextX = role.x > box1.xmax ? box1.xmax + 2 : box1.xmin - 2;
                }
                if(role.y != role.nextY)
                {
                    role.nextY = role.y > box1.ymax ? box1.ymax + 2 : box1.ymin - 2;
                }
                if(!GameContext.map.canMoveTile(role.nextX  >> 4, role.nextY >> 4))
                {
                    role.nextX = role.x;
                    role.nextY = role.y;
                }
                return false;
            }
        }
        return true;
    }
    
    public boolean canMove(int nextX, int nextY) {
        box1.set(nextX - HALF_BOX, nextY - BOX_HEIGHT, nextX + HALF_BOX, nextY);
        
        int npcCnt = npcMap.size();
        
        for(int inpc = 0; inpc < npcCnt; inpc++) {
            Npc npc = npcs[inpc];
            //不判断敌对npc碰撞
            if((npc.enemy && npc.canPass) || !npc.visible)
            {
               continue;
            }
            box2.set(npc.x - HALF_BOX, npc.y - BOX_HEIGHT, npc.x + HALF_BOX, npc.y);
            if(box1.testIntersect(box2)) {                
                return false;
            }
        }
        for (int index = 0; index < chestBoxCnt; index++)
        {
            ChestBox curChest = chestBoxs[index];
            if(!curChest.visible) {
                continue;
            }
            curChest.getBodyBox(box1);
            box1.offset(curChest.x, curChest.y);
            if (box1.pointIn(nextX, nextY))
            {
                return false;
            }
        }
        return true;
    }
    
    /**
     * 判断Npc是否可以移动
     * @param n
     * @param nextX
     * @param nextY
     * @return 
     */
      public boolean canMoveNpc(Npc n, int nextX, int nextY) {
        box1.set(nextX - HALF_BOX, nextY - BOX_HEIGHT, nextX + HALF_BOX, nextY);

        int npcCnt = npcMap.size();

        for(int inpc = 0; inpc < npcCnt; inpc++) {
            Npc npc = npcs[inpc];
            if (n == npc) {
                continue;
            }
            if (!npc.visible) {
                continue;
            }
            if (!npc.canPass) {
                npc.getBodyBox(box2);
                box2.offset(npc.x, npc.y);
                if ((box2.pointIn((nextX + n.x) >> 1, (nextY + n.y) >> 1)) || (box2.pointIn(nextX, nextY))) {
                    if (n.x != n.nextX) {
                        n.nextX = n.x > box2.xmax ? box2.xmax + 2 : box2.xmin - 2;
                    }
                    if (n.y != n.nextY) {
                        n.nextY = n.y > box2.ymax ? box2.ymax + 2 : box2.ymin - 2;
                    }
                    if (!GameContext.map.canMoveTile(n.nextX >> 4, n.nextY >> 4)) {
                        n.nextX = n.x;
                        n.nextY = n.y;
                    }
                    return false;
                }
                continue;
            }
            if (n.enemy != npc.enemy) {
                continue;
            }
            box2.set(npc.x - HALF_BOX, npc.y - BOX_HEIGHT, npc.x + HALF_BOX, npc.y);
            if(box1.testIntersect(box2)) {
                return false;
            }
        }
        //再看看与主角是否碰撞
        box2.set(GameContext.actor.x - HALF_BOX, GameContext.actor.y - BOX_HEIGHT, GameContext.actor.x + HALF_BOX, GameContext.actor.y);
        if(box1.testIntersect(box2)) {
            return false;
        }
        for (int index = 0; index < chestBoxCnt; index++)
        {
            ChestBox curChest = chestBoxs[index];
            if(!curChest.visible)
            {
                continue;
            }
            curChest.getBodyBox(box1);
            box1.offset(curChest.x, curChest.y);
            if (box1.pointIn(nextX, nextY))
            {
                return false;
            }
        }
        return true;
    }
    
    public void addArrow(Arrow arrow) {
        arrows[arrowCnt] = arrow;
        arrowCnt++;
    }
    
    private boolean removeObject(Object[] objs, int size, Object obj) {
        if(size == 0) {
            //#if PRINTDEBUG
            System.out.println("没找到要删除的" + obj + "，检查问题");
            //#endif
            return false;
        }
        
        if(size == 1) {
            objs[0] = null;
            return true;
        } 
        
        int idx = -1;
        for(int iobj = 0; iobj < size; iobj++) {
            if(obj == objs[iobj]) {
                idx = iobj;
                break;
            }
        }

        if(idx < 0) {
            //#if PRINTDEBUG
            System.out.println("没找到要删除的" + obj + "，检查问题");
            //#endif
            return false;
        }

        //如果是最后一个，直接干掉最后一个
        if(idx == size - 1) {
            objs[idx] = null;
        }
        
        //把最后一个拿过来
        objs[idx] = objs[size - 1];
        objs[size - 1] = null;
        return true;
    }
    
    public void removeArrow(Arrow arrow) {
        boolean hasObj = removeObject(arrows, arrowCnt, arrow);
        if(hasObj && arrowCnt > 0) {
            arrowCnt--;
        }
    }

    /**
     * 碰撞检测
     */
    public void detectCollision() {
        if(!GameContext.actor.isAttackActor())
        {
            return;
        }
        Actor actor = GameContext.actor;
        if(actor == null) {
            return;
        }
        if(GameContext.script != null && !GameContext.script.isEnd())
        {
            return;
        }
	if(GameContext.actor.isDie){
	    return;
	}

        //先检测主角与NPC
        if(actor.isActorAttack()) {
            box1.setEmpty();
            actor.getAttackBox(box1);
            boolean box1NotEmpty = !box1.isEmpty();
            if(box1NotEmpty) {
                if(box1NotEmpty) {
                    box1.offset(actor.x, actor.y);
                }
                
                for(int inpc = 0, size = npcMap.size(); inpc < size; inpc++) {
                    Npc npc = npcs[inpc];
                    if(!npc.enemy || !npc.visible || npc.isHide) {
                        //#if PRINTDEBUG == 1
                        //System.out.println("npc " + npc.name + "不接受攻击:" + npc.enemy + "," + npc.visible + "," + npc.isHide);
                        //#endif
                        continue;
                    }
                    //#if PRINTDEBUG == 1
//                    System.out.println("npc " + npc.name + "在受到攻击");
                    //#endif
                    npc.getBodyBox(box2);
                    box2.offset(npc.x, npc.y);
                    if(box1NotEmpty && box1.testIntersect(box2)) {
                        npc.attacked(actor);
                        GameContext.page.addBeattackRolePos(box2, npc);
                    }
                }
            }
        }
        
        //检测友方npc攻击地方ncp
        for(int inpc = 0, size = npcMap.size(); inpc < size; inpc++) {
            Npc npc = npcs[inpc];
            if(!npc.enemy || !npc.visible) {
                npc.getAttackBox(box3);
                if(box3.isEmpty())
                {
                    continue;
                }
                box3.offset(npc.x, npc.y);
                for(int npcIndex = 0; npcIndex < size; npcIndex++)
                {
                    Npc n = npcs[npcIndex];
                    if(!n.enemy || !n.visible || n.isHide)
                    {
                        continue;
                    }
                    n.getBodyBox(box2);
                    box2.offset(n.x, n.y);
                    if(box3.testIntersect(box2)) {
                        n.attacked(npc);
                        GameContext.page.addBeattackRolePos(box2, n);
                    }
                }
                continue;
            }
        }
        
        //检测主角的被攻击
        GameContext.actor.getBodyBox(box1);
        box1.offset(actor.x, actor.y);
        for(int inpc = 0, size = npcMap.size(); inpc < size; inpc++) {
            Npc npc = npcs[inpc];
            if(!npc.enemy || !npc.visible) {
                    continue;
            }
            npc.getAttackBox(box2);
            if(box2.isEmpty()) {                
                continue;
            }
            box2.offset(npc.x, npc.y);
            if(box1.testIntersect(box2)) {
                GameContext.actor.attacked(npc);
            }
        }
        
        //然后检测主角与箭头
        for(int iarrow = 0; iarrow < arrowCnt; iarrow++) {
            Arrow arrow = arrows[iarrow];            
            arrow.getAttackBox(box2);
            box2.offset(arrow.x, arrow.y);
            //如果是敌人的话就和主角进行碰撞检测
            if (arrow.file.isEnemy)
            {
		//#if PRINTDEBUG == 1
                System.out.println("投掷物攻击到主角了");
		//#endif
                //箭头的攻击框都是真的
                if (box2.testIntersect(box1))
                {
                    GameContext.actor.attacked(arrow);
                }
                continue;
            }
            //否则就和npc进行碰撞检测
            for (int inpc = 0, size = npcMap.size(); inpc < size; inpc++)
            {
                Npc npc = npcs[inpc];
                if (!npc.enemy || !npc.visible || npc.isHide)
                {
                    continue;
                }
                npc.getBodyBox(box3);
                box3.offset(npc.x, npc.y);
                if (box2.testIntersect(box3))
                {
                    npc.attacked(arrow);
                    GameContext.page.addBeattackRolePos(box3, npc);
                }
            }
        }
    }
    
    /**
     * 从最近的NPC那里读取它的对话脚本
     * @return
     */
    public ScriptEngine getScriptFromCloseNpc()
    {
        int size = npcMap.size();
        int title = Map.TILE_SIZE;
        Actor actor = GameContext.actor;
        int dir = actor.dir;
        int actorX = actor.x;
        int actorY = actor.y;
        
        for(int index = 0; index < size; index++)
        {
            Npc npc = npcs[index];
            if(npc.enemy || !npc.visible)
            {
                continue;
            }
            
            int distX = npc.x - actorX;
            int distY = npc.y - actorY;
            if ((dir == PaintUnit.UP && distX >= -(title) && distX < title && distY >= -title && distY <= 0) 
                    || (dir == PaintUnit.DOWN && distX >= -(title) && distX < title && distY <= title && distY >= 0) 
                    || (dir == PaintUnit.LEFT && distY >= -(title) && distY < title && distX >= -title && distX <= 0) 
                    || (dir == PaintUnit.RIGHT && distY >= -(title) && distY < title && distX <= title && distX >= 0))
            {
                ScriptEngine e = npc.getAi(Npc.TALK_SCRIPT);
                if (e == null)
                {
                    return null;
                }
                e.init();
                actor.status = STAND_STATUS;
                actor.changeAction();
                GameContext.page.talkNpc = npc;
                if (!npc.canPass) {//npc不能穿越，该npc为固定物体，与它对话不改变方向
                    return e;
                }
                GameContext.page.talkNpcOldDir = npc.dir;
                if(dir == PaintUnit.UP || dir == PaintUnit.LEFT)
                {
                    npc.dir = actor.dir + 1;
                }
                else
                {
                    npc.dir = actor.dir - 1;
                }
                npc.changeDir();
                return e;
            }
        }
        return null;
    }

    /**
     * 找到最近的有对话脚本的npc
     * @return
     */
    public Npc getCloseNpcHaveScript()
    {
        int size = npcMap.size();
        int title = Map.TILE_SIZE;
        Actor actor = GameContext.actor;
        int dir = actor.dir;
        int actorX = actor.x;
        int actorY = actor.y;
        for(int index = 0; index < size; index++)
        {
            Npc npc = npcs[index];
            if(npc.enemy || !npc.visible || npc.isHide)
            {
                continue;
            }
            int distX = npc.x - actorX;
            int distY = npc.y - actorY;
            if ((dir == PaintUnit.UP && distX >= -(title) && distX < title && distY >= -title && distY <= 0)
                    || (dir == PaintUnit.DOWN && distX >= -(title) && distX < title && distY <= title && distY >= 0)
                    || (dir == PaintUnit.LEFT && distY >= -(title) && distY < title && distX >= -title && distX <= 0)
                    || (dir == PaintUnit.RIGHT && distY >= -(title) && distY < title && distX <= title && distX >= 0))
            {
                ScriptEngine e = npc.getAi(Npc.TALK_SCRIPT);
                if (e == null)
                {
                    return null;
                }
                e.init();
                actor.status = STAND_STATUS;
                actor.changeAction();
                GameContext.page.talkNpc = npc;
                if (!npc.canPass) {//npc不能穿越，该npc为固定物体，与它对话不改变方向
                    return npc;
                }
                GameContext.page.talkNpcOldDir = npc.dir;
                if(dir == PaintUnit.UP || dir == PaintUnit.LEFT)
                {
                    npc.dir = actor.dir + 1;
                }
                else
                {
                    npc.dir = actor.dir - 1;
                }
                npc.changeDir();
                return npc;
            }
        }
        return null;
    }
    
    /**
     * 找到最近的宝箱
     * @return
     */
    public ChestBox getCloseChest()
    {
        Actor actor = GameContext.actor;
        if(actor == null) {
            return null;
        }
        
        int dir = actor.dir;
        int actorX = actor.x;
        int actorY = actor.y;
        final int boxRectSize = 8;
        
        box2.set(actorX - boxRectSize, actorY - (boxRectSize), actorX + (boxRectSize << 1), actorY + (boxRectSize));
        for(int index =0; index < chestBoxCnt; index++)
        {
            ChestBox r = chestBoxs[index];
            //宝箱已经开了
            if(r.isOpen() || !r.visible) {
                continue;
            }
            
            ScriptEngine e = r.getAi();
            if(e == null)
            {
                continue;
            }
            r.getPaintBox(box1);
            if(box1.isEmpty())
            {
                continue;
            }
            box1.offset(r.x, r.y);
            if (!box1.testIntersect(box2)) {
                    continue;
            }
            if((dir == PaintUnit.UP && r.y <= actorY)
                || (dir == PaintUnit.DOWN && r.y >= actorY)
                || (dir == PaintUnit.LEFT && r.x <= actorX)
                || (dir == PaintUnit.RIGHT && r.x >= actorX)
                || (box1.getIntersectHeight(box2) > box2.getHeight() && box1.getIntersectWidth(box2) > box2.getWidth())
              )
            {
                actor.status = STAND_STATUS;
                actor.changeAction();
                return r;
            }
        }
        return null;
    }
    
    public void releaseNpcAnimations() {
        for(int index = 0, count = npcMap.size(); index < count; index++)
        {
            Npc npc = npcs[index];
            npc.releaseImages();
            //机关不释放
        }
    }
    
    public void releaseDeadNpcAnimations() {
        for(int index = 0; index < dieNpcSize; index++)
        {
            Npc npc = dieNpcs[index];            
            npc.releaseImages();
        }
    }
    
    public void releaseChestAnimations() {
        for(int index = 0; index < chestBoxCnt; index++)
        {
            ChestBox npc = chestBoxs[index];
            npc.releaseImages();
        }
    }
    
    public void releaseArrowAnimations() {
        AnimationManager aniMgr = AnimationManager.getInstance();
        for(int index = 0; index < arrowCnt; index++)
        {
            Arrow arrow = arrows[index];
            if(arrow.file.isEnemy)
            {
                arrow.releaseImages();
            }
        }
    }
    
    public void openNpcs()
    {
        isNpcLock = false;
        for(int index = 0; index < dieNpcSize; index++)
        {
            if (!dieNpcByScriptSwitch[index]) {
                continue;
            }
            Npc dieNpc = dieNpcs[index];
            delDieNpc(dieNpc, index);
            dieNpc.rise();
            addNpc(dieNpc);
            index--;
//            Npc npc = dieNpcs[index];
//            npc.rise();
//            npc.isDrawRisePaint = true;
//            addNpc(npc);
//            dieNpcs[index] = null;
        }        
//        dieNpcSize = 0;
    }
    
    /**
     * 关闭NPC
     */
    public void lockNpcs()
    {
        isNpcLock = true;
        for(int index = 0, count = npcMap.size(); index < count; index++)
        {
            Npc npc = npcs[index];
            if(!npc.enemy)
            {
                continue;
            }
            if(!npc.visible)
            {
                continue;
            }
            if(!npc.isFlash())
            {
                continue;
            }
            npc.removePaintMatrix();
            addDieNpcWithoutFlash(npc, true);
            removeNpc(npc);
            count = npcMap.size();
            index --;
        }
        for(int index = 0, count = arrowCnt; index < count; index++)
        {
            Arrow arrow = arrows[index];
            GameContext.flyMat.removeUnit(arrow);
            removeArrow(arrow);
            count = arrowCnt;
            index--;
        }  
    }    
    
    public void save(DataOutputStream dataOut) throws IOException {
        dataOut.writeShort(npcMap.size());
        for(int i = 0, size = npcMap.size(); i < size; i++) {
            Npc npc = npcs[i];
            npc.save(dataOut);
        }
        dataOut.writeShort(dieNpcSize);
        for(int index = 0; index < dieNpcSize; index++)
        {
            Npc npc = dieNpcs[index];
            npc.save(dataOut);
            dataOut.writeInt(dieNpcsCount[index]);
        }
        
        dataOut.writeShort(chestBoxCnt);
        for(int i = 0; i < chestBoxCnt; i++) {
            ChestBox box = chestBoxs[i];
            
            dataOut.writeShort(box.file.id);
            dataOut.writeByte(box.status);
            dataOut.writeShort(box.x);
            dataOut.writeShort(box.y);
            dataOut.writeBoolean(box.visible);
            dataOut.writeByte(box.dir);
            dataOut.writeUTF(box.name);
            saveScript(dataOut, box.liveScript);
            saveScript(dataOut, box.deadScript);
//            System.out.println("存储宝箱" + box.name + " visible:" + box.visible);
        }        
        dataOut.writeShort(0);
    }
    
    public void load(DataInputStream dataIn) throws IOException {
        int cnt = dataIn.readShort();
        for(int i = 0; i < cnt; i++) {
            Npc npc = new Npc();
            npc.load(dataIn);
            addNpc(npc);
            if(npc.visible) {
                npc.addPaintMatrix();
            }
        }
        int dieCnt = dataIn.readShort();
        int dieCount = 0;
        for(int index = 0; index < dieCnt; index++)
        {
            Npc npc = new Npc();
            npc.load(dataIn);
            dieCount = dataIn.readInt();
            if(dieCount < 0)
            {
                addDieNpcWithoutFlash(npc, false);
                continue;
            }
            addNpc(npc);
            if(npc.visible) 
            {
                npc.addPaintMatrix();
            }            
        }
        
        cnt = dataIn.readShort();
        AnimationManager aniMgr = AnimationManager.getInstance();
        for(int i = 0; i < cnt; i++) {
            short roleId = dataIn.readShort();
            int status = dataIn.readByte();
            int x = dataIn.readShort();
            int y = dataIn.readShort();
            boolean visible = dataIn.readBoolean();
            int dir = dataIn.readByte();
            String name = dataIn.readUTF();
            ChestBox box = new ChestBox(name, x, y);
            
            ChestBoxFile file = getChestBoxFile(roleId);
            box.file = file;
            aniMgr.getAnimation(file.aniId, box);
            box.visible = visible;
            box.dir = dir;
            box.status = status;
            box.resetAction();
            addChestBox(box);
            if(visible) {
                GameContext.groundMat.addUnit(box);
            }
            box.liveScript = loadScript(dataIn);
            box.deadScript = loadScript(dataIn);
        }
        
        cnt = dataIn.readShort();
    }
    
    public static ScriptEngine loadScript(DataInputStream dataIn) throws IOException{
        String script = dataIn.readUTF();
        if(script == null || script.length() == 0) {
            return null;
        }
        return new ScriptEngine(script);
    }
    
    public static void saveScript(DataOutputStream dataOut, ScriptEngine script) throws IOException {
        if(script == null) {
            dataOut.writeUTF("");
            return;
        }
        dataOut.writeUTF(script.fileName);
    }
}
