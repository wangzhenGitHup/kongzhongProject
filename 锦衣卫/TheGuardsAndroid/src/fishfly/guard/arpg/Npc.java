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
 */
public class Npc extends Role {
    /**
     * 复活动画
     */
    PaintUnit risePaint = new PaintUnit();
    boolean isDrawRisePaint;

    /**
     * npc文件
     */
    NpcFile file;

    //等级
    int lv;
    //生命值
    int dp;
    //死亡给的经验
    int getEx;
    //是否是敌人
    boolean enemy;
    //生命值占满值的百分比, 为了减少运算
    int hpPercent = 100;

    /**
     * 原先的位置
     */
    int originalPos;
    /**
     * 是否是投掷物
     */
    boolean isHelper;
    
    //无敌
    boolean isSuper;

    //是否僵硬
    boolean isStiff;

    //是否可以穿越
    //这个属性是指某些敌对NPC不可被穿越的情况，例如: 洞口堵路的石头
    //只在敌对NPC上发生效果
    //缺省为可穿越
    boolean canPass = true;

    //NPC AI 脚本的类型
    //对话脚本
    public static final int TALK_SCRIPT = 0;
    //任务死亡
    public static final int DIE_SCRIPT = 1;

    ScriptEngine talkScript;
    ScriptEngine dieScript;

    ScriptEngine curScript;

    //是被什么招式攻击到的
    int beAttackSkillIndex = 0;

    /**
     * 开始行为时间
     */
    public long startActionTime;
    /**
     * npc的阶段
     */
    private int stage = 1;
    /**
     * 跟屁虫周期
     */
    public int withTime;
    /**
     * 跟屁虫目的npc名称
     */
    public String withNpcName;

    //记录上次的Trigger触发行为执行时间
    long triggerActionStartTime;
    
    //是否是第一次执行某个操作，因为第一次这个标志，必须是每个NPC一份，
    //所以，给每个Trigger中的这种条件一个独立的位,然后在Trigger中记录位的索引
    //这里假定一个int的32位，足够装所有这种情况
    int firstTimeFlag;
    
    //触发的Trigger的索引
    boolean haveTriggerAction;
    int trigIdx;
    //在执行Trigger的第几个行为
    int trigActIdx;
    //动作行为类型
    int actType;
    
    //与攻击行为相关参数
    long actionStartTime;
    //ACTION使用的数据
    boolean actionData1;
    int actionData2;
    int actionDuration;
    
    //******************************技能相关数据***********************************//
    /**
     * npc身上的不良攻击状态
     */
    AttackEffect keepAttackEffect;
    
    /**
     * npc的攻击效果
     */
    AttackEffect attackEffect;
    
    //****************************************************************************//
    /**
     * 提示逻辑
     * 4位npc是否死亡
     * 5位npc是否可以刷新
     * 7位npc可以删除了
     */
    int stateData;


    /**
     * 绘制效果光柱
     */
    private boolean isDrawEffectRect = false;
    private boolean isDrawNpcFront = false;
    private int effectRextX;
    private int effectRextY;
    private int effectRextW;
    private int effectRextH;
    private int effectRectColor;
    private int[] effectLineColor;
    private boolean effectRectIsLR;

    public void setDrawEffectRect(int x, int y, int w, int h, int backColor, int[] color, boolean isDrawNpcFront, int dir) {
        isDrawEffectRect = true;
        this.isDrawNpcFront = isDrawNpcFront;
        effectRextX = x;
        effectRextY = y;
        effectRextW = w;
        effectRextH = h;
        effectRectColor = backColor;
        effectLineColor = color;
        effectRectIsLR = (dir == LEFT || dir == RIGHT);
    }

    private void drawEffectRect(Graphics g, int offsetX, int offsetY, boolean front) {
        if (!isDrawEffectRect) {
            return;
        }
        if (isDrawNpcFront != front) {
            return;
        }
        isDrawEffectRect = false;
        g.setColor(effectRectColor);
        int rectX = effectRextX - offsetX;
        int rectY = effectRextY - offsetY + 5;
        g.fillRect(rectX, rectY, effectRextW, effectRextH);
        for (int index = 0; index < effectLineColor.length; index++) {
            g.setColor(effectLineColor[index]);
            if (effectRectIsLR) {
                g.drawLine(rectX, rectY + index, rectX + effectRextW - 1, rectY + index);
                g.drawLine(rectX, rectY + effectRextH - index - 1, rectX + effectRextW - 1, rectY + effectRextH - index - 1);
            } else {
                g.drawLine(rectX + index, rectY, rectX + index, rectY + effectRextH - 1);
                g.drawLine(rectX + effectRextW - index - 1, rectY, rectX + effectRextW - index - 1, rectY + effectRextH - 1);
            }
        }
    }

    /**
     * 将npc设置成可以删除的
     * @param isDel
     */
    public void setDel(boolean isDel)
    {
        if(isDel)
        {
            stateData |= 0x80;
            return;
        }
        stateData &= 0x7f;
    }
    
    /**
     * npc是否可以删除
     * @return true 可删除 false 不可删除
     */
    public boolean isDel()
    {
        return ((stateData >> 7) & 0x1) == 1;
    }

    /**
     * 将npc设置成可以定时刷新的
     * @param isFlash
     */
    public void setFlash(boolean isFlash)
    {
        if(isFlash)
        {
            stateData |= 0x20;
            return;
        }        
        stateData &= 0xDF;
    }

    /**
     * npc是否可以定时刷新
     * @return true 定时刷新 false 不刷新
     */
    public boolean isFlash()
    {
        return ((stateData >> 5) & 0x1) == 1;
    }

    /**
     * npc设置为死亡状态
     * @param isDie
     */
    public void setDie(boolean isDie)
    {
        if (keepAttackEffect != null) {
            keepAttackEffect.delEffect(this);
            keepAttackEffect = null;
        }
        if(isDie)
        {
            stateData |= 0x10;
            return;
        }
        stateData &= 0xEF;
    }
    
    /**
     * npc是否死亡
     * @return true npc死亡了 false npc没有死亡
     */
    public boolean isDie()
    {
        return ((stateData >> 4) & 0x1) == 1;
    }

    public Npc() {
        final short IMG_ID = 311;
        imgTip = ImageManager.getInstance().getImage(IMG_ID);
        short risePaintId = 135;
        AnimationManager.getInstance().getAnimation(risePaintId, risePaint);
        risePaint.actId = 0;
        risePaint.initFrame();
        type = TYPE_NPC;
        setFlash(true);
    }

    //没有提示
    final int TIP_NOTHING = 0;
    //亮叹号，可以接任务
    final int TIP_GET = 1;
    //灰问号，等待做任务
    final int TIP_WAIT_FINISH = 2;
    //亮问号，可以交任务
    final int TIP_GIVE_MISSION = 3;
    //药品商人
    final int TIP_SALEMEDICINE = 4;
    //武器商人
    final int TIP_SALEARMOR = 5;
    //配方商人
    final int TIP_SALEFORMULA = 6;
    //赌场老板
    final int TIP_GAMBLING = 7;
    //提示图标种类
    final int TIP_COUNT = 8;
    //提示数据
    int tipData;
    Image imgTip;

    /**
     * 设置提示图标
     * @param tipState
     */
    public void setTipData(int tipState) {
        if (tipState >= TIP_COUNT) {
            tipData = TIP_NOTHING;
            return;
        }
        tipData = tipState;
    }

    /**
     * 获得提示种类
     * @return
     */
    public int getTipData() {
        return tipData;
    }
    
    /**
     * 用这个函数，在更新hp的同时更新hp的百分比，避免多次运算
     * @param hp npc当前血量
     */
    public void setHp(int hp) {
        if(hp <= 0) {
            this.hp = 0;
            hpPercent = 0;
            return;
        }
        
        this.maxHp = this.hp = hp;
        this.hpPercent = this.hp * 100 / maxHp;
    }

    /**
     * 运算npc的血量百分比
     */
    public void updatePercent()
    {
        if(this.hp < 0)
        {
            this.hpPercent = 0;
            return;
        }
        this.hpPercent = this.hp * 100 / maxHp;
    }

    /**
     * 设置npc的脚本
     * @param script 脚本对象
     * @param type 脚本类型
     */
    public void setAi(ScriptEngine script, int type) {
        switch(type) {
            case TALK_SCRIPT:
                talkScript = script;
                return;
            case DIE_SCRIPT:
                dieScript = script;
                return;
        }
    }

    /**
     * 获取npc身上的脚本
     * @param type 想要获取的脚本类型
     * @return npc身上的脚本
     */
    public ScriptEngine getAi(int type) {
        switch(type) {
            case TALK_SCRIPT:
                return talkScript;
            case DIE_SCRIPT:
                return dieScript;
        }
        return null;
    }

    /**
     * 保存npc的原始坐标
     * @param x 原始坐标X
     * @param y 原始坐标Y
     */
    public void setOriginalPos(int x, int y)
    {
        originalPos = (x << 16) | (y & 0xffff);
    }

    /**
     * 获取npc当前的动作
     */
    public void resetAction() {
        curAct = file.getAction(status);
    }

    /**
     * 获取npc的攻击矩形框
     * @param box 
     */
    public void getAttackBox(Rect box) {
        if (file == GameContext.actor.superSkillFile2 && frameId == 5) {
            box.set(Page.scrRect);
            box.offset(GameContext.page.offsetX, GameContext.page.offsetY);
            box.offset(-x, -y);
            return;
        }
        ani.getAttackBox(actId, frameId, box);
    }

    /**
     * 渲染NPC
     * @param g 画笔
     * @param offsetX 屏幕X偏移
     * @param offsetY 屏幕Y偏移
     */
    public void paint(Graphics g, int offsetX, int offsetY) {
        if(isHide) {
            return;
        }
        if(!visible)
        {
            return;
        }
        if(isDrawRisePaint)
        {
            risePaint.x = x;
            risePaint.y = y;
            risePaint.paintAnimation(g, offsetX, offsetY);
            if(risePaint.isEndAnimation())
            {
                isDrawRisePaint = false;
                risePaint.resetFrame();
            }
            else
            {
                risePaint.playNextFrame();
                return;
            }
        }
        drawEffectRect(g, offsetX, offsetY, false);
        paintAnimation(g, offsetX, offsetY);
        drawEffectRect(g, offsetX, offsetY, true);
        drawTip(g, offsetX, offsetY);
        //#if PRINTDEBUG > 1
//#         g.setColor(0xffffff);
//#         g.drawString(name, drawX, drawY, Graphics.HCENTER | Graphics.BOTTOM);
        //#endif
        if(keepAttackEffect != null)
        {
            keepAttackEffect.draw(g, this);
        }
    }
    
    private void drawTip(Graphics g, int offX, int offY)
    {
        if (enemy) {
            return;
        }
        if (tipData == TIP_NOTHING && !isTipShow) {
            return;
        }
        int[] imgX = {0, 35, 60, 86, 110, 136, 162};
        int[] imgWidth = {28, 9, 17, 17, 23, 24, 26};
        int[] imgHeightOffSide = {5, 5, 5, 5, 5, 5, 0};
        Rect paintBox = RoleManager.getInstance().box2;
        getPaintBox(paintBox);
        int posX = x - offX;
        int posY = y - offY;
        //有提示图标
         int tipIndex = -1;
        if (tipData == TIP_SALEFORMULA) {
            tipIndex = 0;
        } else if (tipData == TIP_WAIT_FINISH) {
            tipIndex = 2;
        } else if (tipData == TIP_GET) {
            tipIndex = 1;
        } else if (tipData == TIP_GIVE_MISSION) {
            tipIndex = 3;
        } else if (tipData == TIP_GAMBLING) {
            posY += 4;
            tipIndex = 4;
        } else if (tipData == TIP_SALEMEDICINE) {
            tipIndex = 5;
        } else if (tipData == TIP_SALEARMOR) {
            tipIndex = 6;
        }
        if (tipData != TIP_NOTHING) {
            int imgHeight = imgTip.getHeight();
            Util.drawClipImage(g, imgTip, posX - (imgWidth[tipIndex] >> 1), posY - paintBox.getHeight() - imgHeight+imgHeightOffSide[tipIndex], imgX[tipIndex], 0, imgWidth[tipIndex], imgHeight);
            return;
        }

        if (isTipShow) {
            GameContext.page.tipPaint.x = x;
            GameContext.page.tipPaint.y = y - paintBox.getHeight();
            GameContext.page.tipPaint.paint(g, offX, offY);
            GameContext.page.tipPaint.playNextFrame();
            if (GameContext.page.tipPaint.isEndAnimation()) {
            }
        }
    }

    
    /**
     * 死亡刷新
     */
    public void rise()
    {
        keepAttackEffect = null;
        isMess = false;
        status = STAND_STATUS;
        hp = maxHp;
        x = (originalPos >> 16) & 0xffff;
        y = originalPos & 0xffff;      
        setDie(false);
        setDel(false);
        changeAction();
        addPaintMatrix();
    }
       
    /**
     * 处理死亡掉落
     */
    private void doDropProp() {
        if(GameContext.map.id == 0)
        {
            return;
        }
        if (isHelper)
        {
            return;
        }

        Actor actor = GameContext.actor;
        //#if PRINTDEBUG == 1
        System.out.println("npc："+name+"死亡掉落");
        //#endif

        int curEx = getEx;
        //#if SMS == 1
        if (Sms.doubleExp) {
            curEx *= 2;
        }
        //#else
//#         curEx *= 3;
        //#endif
        if(!file.boss && actor.getLevel() - lv >= 10)
        {
            actor.addEx(curEx / 5);
        }
        else
        {
            actor.addEx(curEx);
        }
        int curMoney = 0;
        if (file.dropMoney != 0) {
            curMoney = file.dropMoney + (lv << 1);
        }

        //#if SMS == 1
        if (Sms.doubleMoney) {
            curMoney *= 2;
        }
        //#else
//#         curMoney *= 3;
        //#endif
        actor.addMoney(curMoney);
        StringBuffer buf = new StringBuffer();
        StringManager strMgr = StringManager.getInstance();
        strMgr.copyString((short) 24, buf);
        strMgr.copyString((short) 83, buf);
        buf.append(curMoney);
        if (curMoney != 0) {
            GameContext.page.showFlashNote(buf.toString().toCharArray());
        }
        final int TEAM_COUNT = 5;
        for (int index = 0, count = file.dropItems.length; index < count; index += TEAM_COUNT) {
            if((file.dropItems[index + 3] != 0 && lv < file.dropItems[index + 3])
                    ||(file.dropItems[index + 4] != 0 && lv > file.dropItems[index + 4]) )
            {
                continue;
            }
            int porp = GameContext.getRand(0, 100);
            if (porp > file.dropItems[index + 2]) {
                continue;
            }
            short itemId = file.dropItems[index];
            Item item = GameContext.getItem(itemId);
            GameContext.map.addMapItem(itemId, x, y, item.iconLeftX, item.iconTopY);
        }

        if (!isHelper) {
            GameContext.addVar(EffortManager.EFFORT_KILL_ENEMY, 1);
        }
        if (beAttackSkillIndex == 1) {
            GameContext.addVar(EffortManager.EFFORT_KILL_ENEMY_BY_SKILL1, 1);
        }
        else if(beAttackSkillIndex == 2) {
            GameContext.addVar(EffortManager.EFFORT_KILL_ENEMY_BY_SKILL2, 1);
        }
        else if(beAttackSkillIndex == 3) {
            GameContext.addVar(EffortManager.EFFORT_KILL_ENEMY_BY_SKILL3, 1);
        }
        else if(beAttackSkillIndex == 4) {
            GameContext.addVar(EffortManager.EFFORT_KILL_ENEMY_BY_SKILL4, 1);
        }
    }

    /**
     * 死亡逻辑
     */
    private void doDieLogic() {
        //如果是吸血的话直接运行逻辑
        if (enemy && GameContext.actor.attackEffect != null && GameContext.actor.attackEffect.isRunLogic()) {
            GameContext.actor.attackEffect.logicEnd(null);
        }
        if (GameContext.script != null && !GameContext.script.isEnd() && dieScript != null) {
            return;
        }
        setDel(true);
        if (file.boss) {
            GameContext.setVar("BOSSX", x);
            GameContext.setVar("BOSSY", y);
            RoleManager.getInstance().delAllEnemy();
            GameContext.page.initComboData();
            EffortManager.getInstance().setKillBossTime(this, (int) (System.currentTimeMillis() - startActionTime) / 1000);
        }
        //处理掉落
        doDropProp();
        //加到死人堆里面
        if (dieScript != null) {
            //#if PRINTDEBUG >= 1
            System.out.println("npc" + name + "运行死亡脚本;" + dieScript.fileName);
            //#endif
            dieScript.init();
            dieScript.execute();
            //如果死亡脚本没有运行玩的话就把它交给场景脚本运行
            if (!dieScript.isEnd()) {
                GameContext.script = dieScript;
            }
            return;
        }
    }

    /**
     * npc逻辑处理
     */
    public void logic()
    {
        if(GameContext.page.isShowMapName && GameContext.page.readingGame) {
            //这时不接受按键
            return;
        }
        if(!visible) {
            return;
        }
        if(bufferAni != null)
        {
            return;
        }
        if(isDrawRisePaint)
        {
            return;
        }
        //#if PRINTDEBUG == 1
//        System.out.println("Npc:" + name + " 更新");
        //#endif 
        //死亡了不做判断
        if(isDie() && !isDel())
        {
            System.out.println("Npc:" + name + "挂了");
            doDieLogic();
            return;
        }
        if (file.dropMoney == 11){
            setHp(1);
        }
        updateShowTip();
        if((keepAttackEffect != null && !keepAttackEffect.isLive))
        {
            keepAttackEffect = null;
        }        
        //刷新不良状态
        updateKeepAttackEffect();
        if(isMess)
        {
            return;
        }
        //这会儿Npc不具有主动性,npc在受伤和死亡的时候不运行Triger
        if (
            (status != HURT_STATUS && status != DEAD_STATUS/* && status != DEFENSE_STATUS && status != FALL_STATUS*/)
            &&
            (
                (enemy && GameContext.page.startAttackTime != 0 && !GameContext.page.observerMode)
                || (!enemy && !file.enemy && GameContext.page.talkNpc != this)
            )
        )
        {
            if(startActionTime == 0)
            {
                startActionTime = System.currentTimeMillis();
            }
            file.updateNpc(this);
        }
        if(haveMoveTask) {
            curAct.updateSpeed(this);
            updateMoveTask(file.isFly, false);
        }else if(haveMoveLine)
        {
            curAct.updateSpeed(this);
            updateMoveLineTask(file.isFly, false);
        }
        else {
            updatePosition();
        }        
    }

    private void updateShowTip()
    {
        if (GameContext.script != null && !GameContext.script.isEnd())
        {
            isTipShow = false;
            return;
        }
        if (enemy || !visible) {
            isTipShow = false;
            return;
        }
        if (getAi(Npc.TALK_SCRIPT) == null)
        {
            isTipShow = false;
            return;
        }
        int title = Map.TILE_SIZE;
        int dir = GameContext.actor.dir;
        int distX = x - GameContext.actor.x;
        int distY = y - GameContext.actor.y;
        if ((dir == PaintUnit.UP && distX >= -(title) && distX < title && distY >= -title && distY <= 0)
            || (dir == PaintUnit.DOWN && distX >= -(title) && distX < title && distY <= title && distY >= 0)
            || (dir == PaintUnit.LEFT && distY >= -(title) && distY < title && distX >= -title && distX <= 0)
            || (dir == PaintUnit.RIGHT && distY >= -(title) && distY < title && distX <= title && distX >= 0)) {
            if(isTipShow)
            {
                return;
            }
            isTipShow = true;
            Rect paintBox = RoleManager.getInstance().box2;
            getPaintBox(paintBox);
            GameContext.page.tipPaint.x = x;
            GameContext.page.tipPaint.y = y - paintBox.getHeight();
            GameContext.page.tipPaint.resetFrame();
            return;
        }
        isTipShow = false;
    }

    /**
     * npc动画刷新处理
     */
    public void update() {
        int curFrame = frameId;
        updateAnimation();
        if (frameId != curFrame)
        {
            //写入变速运动功能
            int effort = curAct.getEffect(curActionIndex, frameId);
            if (effort >= 0)
            {
                GameContext.page.setEffort(effort, this);
            }
        }   
    }
    boolean isBig;
    /**
     * npc被弓箭攻击
     * @param arrow
     */
    void attacked(Arrow arrow)
    {
        //无敌直接返回
        if(isSuper)
        {
            return;
        }
        if(isDrawRisePaint)
        {
            return;
        }
        //如果正在播放死亡动画不做判断
        if(status == DEAD_STATUS)
        {
            return;
        }
        
        int loseHp = arrow.getAttackPoint();
        //没有攻击力就直接返回
        if(loseHp == 0)
        {
            return;
        }
        //不是boss的话挂状态不良状态
        if (arrow.file.attackEffect != null && arrow.file.attackEffect.isCanUseAttackEffect(this))
        {
            keepAttackEffect = arrow.file.attackEffect.clone();
            if (keepAttackEffect != null) {
                changeBeattackDir(arrow);
                keepAttackEffect.logic(this);
            }
        }
        GameContext.page.addComboNum();
        //运算攻击力和伤害值
        isBig = false;
        if(((loseHp >> 31) & 0x1) == 1)
        {
            isBig = true;
        }        
        loseHp = loseHp & 0xffffff;
        loseHp -= dp >> 1;
        loseHp = loseHp + loseHp * GameContext.getRand(-50, 50) / 500;
        if(loseHp < 0)
        {
            loseHp = 1;
        }
        if(isBig)
        {
            loseHp <<= 1;
            GameContext.page.addAttackedNumber(this, loseHp, true);
            //暴击的话屏幕震动一下子
            GameContext.page.setVibration();        
            GameContext.page.setDrawAttackCross();
        }
        else
        {
            GameContext.page.addAttackedNumber(this, loseHp, false);
        }
        //#if PRINTDEBUG == 1
        System.out.println("npc名称=" + name + ";npc等级=" + lv + ";npc血量=" + maxHp + ";arrow攻击力=" + arrow.ap + ";npc防御力=" + dp);
        System.out.println("投掷物造成攻击力="+loseHp);
        //#endif
        EffortManager.getInstance().addMaxAttack(loseHp);
        //减低伤害
        hp -= loseHp;
        //#if PRINTDEBUG == 1
        System.out.println(name + ";受到伤害=" + loseHp);
        System.out.println(name + ";是否死亡=" + (hp <= 0));
        System.out.println(name + ";npchp ="+hp);
        //#endif
        
        updatePercent();
        //判断死亡
        if(hp <= 0)
        {
            haveTriggerAction = false;
            status = DEAD_STATUS;
            MusicPlayer.getInstance().playSound(SoundConst.ENEMYDISAPPERA);
            changeAction();
            return;
        }
        //如果僵硬直接返回
        if(isStiff || file.isFly)
        {
            return;
        }
        //如果已经是受伤动作了返回
        if(status == HURT_STATUS || status == DEFENSE_STATUS)
        {
            return;
        }
        if(file.getAction(HURT_STATUS) == null)
        {
            return;
        }
        status = HURT_STATUS;
        //更改方向
        haveTriggerAction = false;
        trigIdx = 0;
        changeAction();        
    }

    /**
     * 判断npc是否是某个阶段
     * @param stage 判断的阶段id
     * @return true在同一阶段 false不在同一阶段
     */
    public boolean isSaveStage(int stage)
    {
        return this.stage == stage;
    }
    
    /**
     * 切换NPC的阶段，需要等待npc当前trigger运行完毕。
     * @param stage
     */
    public void setNpcStage(int stage)
    {
        if(this.stage == stage)
        {
            return;
        }
        this.stage = stage;
    }
    
    /**
     * 立刻切换npc的阶段，并且强行中断当前运行的trigger，慎用可能会出现不可预见的错误
     * @param stage 
     */
    public void setActorStagePrompt(int stage)
    {
        haveTriggerAction = false;
        this.stage = stage;
    }
    
    
    /**
     * 刷新不良状态
     */
    private void updateKeepAttackEffect()
    {
        if(hp <= 0)
        {
            return;
        }
        if(keepAttackEffect != null)
        {
            keepAttackEffect.logic(this);
        }        
    }
    
    /**
     * 检查NPC是否除了运动范围
     */
    private void changeMovePostion()
    {
        if(x == nextX && y == nextY)
        {
            return;
        }
        if (file.moveX == 0 && file.moveY == 0 && file.moveWidth == 0 && file.moveHeight == 0)
        {
            return;
        }
        //npc出了运动范围
        if(nextX <= file.moveX || nextX >= file.moveX + file.moveWidth || nextY <= file.moveY || nextY >= file.moveY + file.moveHeight)
        {
            nextX = x;
            nextY = y;
            status = STAND_STATUS;
            changeAction();
        }
    }
    
    private void updatePosition() {
        curAct.updateSpeed(this);
        if (status == MOVE_STATUS) {
            speed += exSpeed;
        }
        if(speed == 0) {    
            return;
        }
        resetNextPosition(this, dir, speed);     
        if(isScriptStop)
        {
            nextX = x;
            nextY = y;
        }
        changeMovePostion();
        //是否撞上其他人
        if(!file.isIgnorePh && !RoleManager.getInstance().canMoveNpc(this, nextX, nextY)) {
            //撞上人了
            return;
        }
        if(file.isIgnorePh)
        {
            setPosition(nextX, nextY);
            return;
        }
        
        GameContext.map.moveRole(this, dir, x, y, nextX, nextY, file.isFly, false);
    }
          
    /**
     * 找个方向，随机移动
     */
    void randomMove(int range) {
        //移动方向保持不变
        int startDir = dir;
        
        //最低四位用来表示是否已经搜索过
        int flag = 0;
        int leftDir = DIR_CNT;
        
        for(int idir = 0; idir < DIR_CNT; idir++) {
            if(canMove(startDir, range) && GameContext.getRand(0, 100) < 30) {
                //没有人
                dir = startDir;
                status = MOVE_STATUS;
                changeAction();
                return;
            }
            
            //对应位置一
            flag |= 0x01 << startDir;
            
            //确定下一个方向的策略，就是出来一个随机数，然后根据这个随机数，数所有未访问的方向，落在哪里算哪里
            int ran = GameContext.getRand(1, leftDir);
            leftDir--;
            int testCnt = 0;
            for(int testDir = 0; testDir < DIR_CNT; testDir++) {
                if((flag & (0x01 << testDir)) != 0) {
                    continue;
                }
                
                testCnt++;
                if(testCnt == ran) {
                    startDir = testDir;
                }
            }
        }
        status = STAND_STATUS;
        changeAction();
    }

    /**
     * 是否在范围内
     * @param range
     * @return
     */
    boolean isMoveInRange(int posX, int posY, int range) {
        if (range == 0) {
            return true;
        }
        int originalX = (originalPos >> 16) & 0xffff;
        int originalY = originalPos & 0xffff;
        range >>= 1;
        int minX = originalX - range;
        int minY = originalY - range;
        int maxX = originalX + range;
        int maxY = originalY + range;
        minX = (minX < 0) ? 0 : minX;
        minY = (minY < 0) ? 0 : minY;
        maxX = (maxX > GameContext.map.width) ? GameContext.map.width : maxX;
        maxY = (maxY > GameContext.map.height) ? GameContext.map.height : maxY;
        Rect rangeBox = new Rect(minX, minY, maxX, maxY);
        if (rangeBox.pointIn(posX, posY)) {
            return true;
        }
        return false;
    }
    
    /**
     * 是否可以向某个方向前进一步
     * @param dir
     * @return
     */
    boolean canMove(int dir, int range) {
        RoleAction moveAct = file.moveAct;
        int dirSpeed = moveAct.getSpeed(dir);
        if(dirSpeed == 0) {
            return false;
        }
        
        resetNextPosition(this, dir, dirSpeed);
        if (range != 0 && !isMoveInRange(nextX, nextY, range)) {
            return false;
        }

        boolean canMoveTile = GameContext.map.canMoveTile(nextX >> 4, nextY >> 4);
        if(!canMoveTile) {
            return false;
        }
        if(file.isIgnorePh)
        {
            return true;
        }        
        return RoleManager.getInstance().canMoveNpc(this, nextX, nextY);
    }
    
    /**
     * 为了实现某个方向多个动作，需要覆盖ROLE的这个方法，根据主角和boss相对方向修改不同的动作
     * @param updateAnimation
     */
    void resetAnimation(boolean updateAnimation) {
        if(updateAnimation) {
            AnimationManager aniMgr = AnimationManager.getInstance();
            aniMgr.getAnimation(curAct.aniId, this);
        }
        //如果当前方向多个动作就根据主角和boss的相对位置来设置动画的ID
        if(curAct.aniCnt > 1)
        {
            curActionIndex = GameContext.actor.x < x ? 0 : 1;
        }
        else
        {
            curActionIndex = 0;
        }
        actId = curAct.getAnimation(dir, curActionIndex);
        resetFrame();
    }

    void doAnimationEnd() {
        curAct.updateSpeed(this);        
        //如果是死亡动画的话设置死亡
        if(status == DEAD_STATUS || isDie())
        {
            setDie(true);
            haveTriggerAction = false;
            return;
        }
        //如果是受伤动画的话就变成站立
        if(status == HURT_STATUS || status == FALL_STATUS)
        {
            status = STAND_STATUS;
            changeAction();
            return;
        }
        resetFrame();
    }
    
    /**
     * 根据等级调整参数
     */
    public void setDataFromLevel() {
        int formulaIndex = GameContext.npcTypeCnt - 1;
        if(file.formulaIndex < GameContext.npcTypeCnt - 1 && file.formulaIndex >= 0) {
            formulaIndex = file.formulaIndex;
        }
        int offset = formulaIndex * GameContext.levelDataCnt;
        int levelData[] = GameContext.levelData;
        maxHp = hp = levelData[offset] + lv * levelData[offset + 1];
        ap = levelData[offset + 2] + lv * levelData[offset + 3];
        dp = levelData[offset + 4] + lv * levelData[offset + 5];
        getEx = levelData[offset + 6] + lv * levelData[offset + 7];
        if(lv - levelData[offset + 8] >= 0)
        {
            maxHp = hp = hp +  levelData[offset + 9] * lv;
        }
        //#if PRINTDEBUG == 1
        System.out.println("" + name + ":maxHp = " + maxHp + ";lv=" + lv + ";formulaIndex=" + formulaIndex);
        //#endif
        hpPercent = 100;
    }   
    
    /**
     * npc开始移动
     * @param dstX
     * @param dstY
     */
    public void startMove(int dstX, int dstY) {
        //#if PRINTDEBUG == 1
        System.out.println(x + "," + y + "," + dstX + "," + dstY);
        //#endif

        int newDir = GameContext.map.findWayDir(this, x >> 4, y >> 4, dstX >> 4, dstY >> 4, file.isIgnorePh);
        if(newDir != NO_DIR) {
            dir = newDir;
            status = RoleConst.MOVE_STATUS;
            changeAction();
            return;
        }
    }
    
    public void updatePaintMatrix()
    {
        if(file.isFly)
        {
            GameContext.flyMat.updateUnit(this, x, y);
            return;
        }
        if (file.isUnderGround)
        {
            GameContext.undergroundMat.updateUnit(this, x, y);
            return;
        }
        GameContext.groundMat.updateUnit(this, x, y);        
    }

    public void addPaintMatrix()
    {
        if(file.isFly)
        {
            GameContext.flyMat.addUnit(this);
            return;
        }
        if (file.isUnderGround) {
            GameContext.undergroundMat.addUnit(this);
            return;
        }
        GameContext.groundMat.addUnit(this);
    }

    public void removePaintMatrix()
    {
        if(file.isFly)
        {
            GameContext.flyMat.removeUnit(this);
            return;
        }
        if (file.isUnderGround) {
            GameContext.undergroundMat.removeUnit(this);
            return;
        }
        GameContext.groundMat.removeUnit(this);
    }

    /**
     * 设置npc的坐标
     * @param x npcX坐标
     * @param y npcY坐标
     */
    public void setPosition(int nextX, int nextY)
    {
        if(file.isFly)
        {
            GameContext.flyMat.updateUnit(this, nextX, nextY);
            return;
        }
        if (file.isUnderGround) {
            GameContext.undergroundMat.updateUnit(this, nextX, nextY);
            return;
        }
        GameContext.groundMat.updateUnit(this, nextX, nextY);
    }
    
    /**
     * 根据目的坐标调整方向
     * @param dstX
     * @param dstY
     */
    public void updateDirByDestination(int dstX, int dstY)
    {
        int disX = dstX - x;
        int disY = dstY - y;
        if(disX == 0 && disY == 0)
        {
            if(status != STAND_STATUS)
            {
                status = STAND_STATUS;
                changeAction();
            }
            return;
        }
        if (Math.abs(disX) < speed && disX != 0)
        {
            nextX = dstX;
            nextY = y;
            setPosition(nextX, nextY);
            disX = 0;
        }
        if (Math.abs(disY) < speed && disY != 0)
        {
            nextY = dstY;
            nextX = x;
            setPosition(nextX, nextY);
            disY = 0;            
        }
        if(disX == 0 && disY == 0)
        {
            if(status != STAND_STATUS)
            {
                status = STAND_STATUS;
                changeAction();
            }
            return;            
        }
        int newDir = NO_DIR;
        if(disX != 0)
        {
            newDir = x < dstX ? RIGHT : LEFT;
            if (newDir != dir)
            {
                dir = newDir;
                changeDir();
            }
            return;
        }
        if (disY != 0)
        {
            newDir = y < dstY ? DOWN : UP;
            if (newDir != dir)
            {
                dir = newDir;
                changeDir();
            }
            return;
        }
    }
    
    /**
     * 被攻击之后更改方向
     * @param attacker
     */
    public void changeBeattackDir(Role attacker)
    {
        //设置挨打方向
        if(attacker.dir == UP || attacker.dir == LEFT)
        {
            dir = attacker.dir + 1;
        }
        else
        {
            dir = attacker.dir - 1;
        }
    }

    /**
     * npc被npc攻击的逻辑处理
     * @param npc
     */
    public void attacked(Npc npc) {
        //无敌直接返回
        if(isSuper)
        {
            return;
        }
        if(isDrawRisePaint)
        {
            return;
        }
        //如果正在播放死亡动画不做判断
        if(status == DEAD_STATUS || status == FALL_STATUS)
        {
            return;
        }

        int loseHp = npc.ap;
        //#if PRINTDEBUG == 1
        System.out.println("主角攻击力=" + loseHp);
        //#endif
        //没有攻击力就直接返回
        if (loseHp == 0)
        {
            return;
        }
        GameContext.page.addComboNum();
        //不是boss的话挂状态不良状态
        if (npc.attackEffect != null && npc.attackEffect.isCanUseAttackEffect(this))
        {
            keepAttackEffect = npc.attackEffect.clone();
        }
        //运算攻击力和伤害值
        isBig = false;
        if (((loseHp >> 31) & 0x1) == 1)
        {
            isBig = true;
        }
        loseHp = loseHp & 0xffffff;
        loseHp -= dp >> 1;
        loseHp = loseHp + loseHp * GameContext.getRand(-50, 50) / 500;
        if (loseHp < 0)
        {
            loseHp = 1;
        }
        if (isBig)
        {
            loseHp <<= 1;
            GameContext.page.addAttackedNumber(this, loseHp, true);
            //暴击的话屏幕震动一下子
            GameContext.page.setVibration();
            GameContext.page.setDrawAttackCross();
        }
        else
        {
            GameContext.page.addAttackedNumber(this, loseHp, false);
        }
        //#if PRINTDEBUG == 1
        System.out.println("被攻击npc名称=" + name + ";被攻击npc等级=" + lv + ";被攻击npc血量=" + maxHp + ";攻击npc攻击力=" + npc.ap + ";被攻击npc防御力=" + dp + ";被攻击npc受到伤害=" + loseHp);
        //#endif
        //减低伤害
        hp -= loseHp;
        updatePercent();

        beAttackSkillIndex = 0;
        if (enemy) {
            if(npc.file != null && npc.file == GameContext.actor.superSkillFile2) {
                beAttackSkillIndex = GameContext.actor.SKILL_COUNT - 1;
            }
            EffortManager.getInstance().addMaxAttack(loseHp);
        }

        //判断死亡
        if(hp <= 0)
        {
            haveTriggerAction = false;
            if(file.getAction(DEAD_STATUS) == null)
            {
                hp = 1;
                return;
            }
            //原来处理冰冻的现在不用了
            MusicPlayer.getInstance().playSound(SoundConst.ENEMYDISAPPERA);
            status = DEAD_STATUS;
            changeAction();
            return;
        }
        //如果僵硬直接返回
        if(isStiff || file.isFly)
        {
            return;
        }
        //如果已经是受伤动作了返回
        if(status == HURT_STATUS || status == FALL_STATUS || status == DEFENSE_STATUS)
        {
            return;
        }

        if(file.getAction(HURT_STATUS) == null)
        {
            return;
        }
        status = HURT_STATUS;
        //更改方向
        changeBeattackDir(npc);
        haveTriggerAction = false;
        trigIdx = 0;
        changeAction();
    }
    /**
     * npc受到主角攻击的逻辑处理
     * @param actor
     */
    public void attacked(Actor actor) {
         System.out.println("npc名称=" + name);
        //无敌直接返回
        if(isSuper)
        {
            MusicPlayer.getInstance().playSound(SoundConst.KNIFESWINGNULL);
            return;
        }
        if(isDrawRisePaint)
        {
            MusicPlayer.getInstance().playSound(SoundConst.KNIFESWINGNULL);
            return;
        }
        //如果正在播放死亡动画不做判断
        if(status == DEAD_STATUS || status == FALL_STATUS)
        {
            MusicPlayer.getInstance().playSound(SoundConst.KNIFESWINGNULL);
            return;
        }
        int loseHp = actor.getAttackCount();
        //#if PRINTDEBUG == 1
        System.out.println("主角攻击力=" + loseHp);
        MusicPlayer.getInstance().playSound(SoundConst.KNIFEBEAT);
        //#endif
        //没有攻击力就直接返回
        if (loseHp == 0)
        {
            return;
        }
        GameContext.page.addComboNum();
        //不是boss的话挂状态不良状态
        if (actor.attackEffect != null && actor.attackEffect.isCanUseAttackEffect(this)) {
            keepAttackEffect = actor.attackEffect.clone();
            actor.attackEffect = null;
            if (keepAttackEffect != null) {
                changeBeattackDir(actor);
                keepAttackEffect.logic(this);
            }
        }
        //运算攻击力和伤害值
        isBig = false;
        if (((loseHp >> 31) & 0x1) == 1)
        {
            isBig = true;
        }
        loseHp = loseHp & 0xffffff;
        loseHp -= dp >> 1;
        loseHp = loseHp + loseHp * GameContext.getRand(-50, 50) / 500;
        if (loseHp < 0)
        {
            loseHp = 1;
        }
        if (isBig)
        {
            loseHp <<= 1;
            GameContext.page.addAttackedNumber(this, loseHp, true);
            //暴击的话屏幕震动一下子
            GameContext.page.setVibration();
            GameContext.page.setDrawAttackCross();
        }
        else
        {
            GameContext.page.addAttackedNumber(this, loseHp, false);
        }
        //#if PRINTDEBUG == 1
        System.out.println("npc名称=" + name + ";npc等级=" + lv + ";npc血量=" + maxHp + ";npc攻击力=" + ap + ";npc防御力=" + dp + ";npc受到伤害=" + loseHp);
        //#endif            
        //减低伤害
        hp -= loseHp;
        updatePercent();

        beAttackSkillIndex = 0;
        if(actor.isRunSkillAttack) {
            beAttackSkillIndex = actor.curAttackSkillIndex + 1;
        }
        EffortManager.getInstance().addMaxAttack(loseHp);
        
        //判断死亡
        if(hp <= 0)
        {
            haveTriggerAction = false;
            if(file.getAction(DEAD_STATUS) == null)
            {
                hp = 1;
                return;
            }
            //原来处理冰冻的现在不用了
            MusicPlayer.getInstance().playSound(SoundConst.ENEMYDISAPPERA);
            status = DEAD_STATUS;
            changeAction();
            return;
        }
        //如果僵硬直接返回
        if(isStiff || file.isFly || isMess)
        {
            return;
        }
        //如果已经是受伤动作了返回
        if(status == HURT_STATUS || status == FALL_STATUS || status == DEFENSE_STATUS)
        {
            return;
        }

        if(actor.isRunSkillAttack && actor.curAttackSkillIndex <= 1)
        {
            if(file.getAction(FALL_STATUS) != null && !file.getAction(FALL_STATUS).isActEmpty())
            {
                status = FALL_STATUS;
                changeBeattackDir(actor);
                changeAction();
                haveTriggerAction = false;
                trigIdx = 0;
                return;
            }
        }
        if(file.getAction(HURT_STATUS) == null)
        {
            return;
        }
        status = HURT_STATUS;
        changeBeattackDir(actor);
        changeAction();
        haveTriggerAction = false;
        trigIdx = 0;
    }

    /**
     * 获取npc可以造成的伤害
     * @return 造成的伤害数值
     */
    public int getAttackPoint()
    {
        int attackPoint = ap;
        if(actType == Trigger.ATTACK_ACTION && actionData2 > 0) {
            attackPoint += attackPoint * actionData2 / 100;
        }
        return attackPoint;
    }

    /**
     * 保存npc当前状态
     * @param dataOut
     * @throws IOException
     */
    public void save(DataOutputStream dataOut) throws IOException {
        dataOut.writeShort(file.id);
        dataOut.writeByte((lv & 0xff));
        if(!enemy && !file.enemy && file.trigs != null && file.trigs.length != 0)
        {
            dataOut.writeShort((originalPos >> 16) & 0xffff);
            dataOut.writeShort(originalPos & 0xffff);
        }
        else
        {
            dataOut.writeShort(x);
            dataOut.writeShort(y);            
        }
        dataOut.writeByte(dir);
        dataOut.writeUTF(name);
        dataOut.writeBoolean(enemy);
        dataOut.writeBoolean(visible);
        dataOut.writeBoolean(isFlash());
        dataOut.writeByte(tipData);

        RoleManager.saveScript(dataOut, talkScript);
        RoleManager.saveScript(dataOut, dieScript);
        dataOut.writeBoolean(canPass);
        if(bufferAni != null)
        {
            dataOut.writeBoolean(true);
            dataOut.writeShort(ani.id);
            dataOut.writeShort(actId);
            dataOut.writeBoolean(isKeepLastFrame);
            dataOut.writeBoolean(isResumeAct);
        }
        else
        {
            dataOut.writeBoolean(false);
        }
        dataOut.writeShort(stateData);
    }

    /**
     * 给npc设置npcFile文件
     * @param file
     */
    public void setFile(NpcFile file)
    {
        this.file = file;
    }

    /**
     * 读取npc数据
     * @param dataIn
     * @throws IOException
     */
    public void load(DataInputStream dataIn) throws IOException {
        short roleId = dataIn.readShort();
        file = RoleManager.getInstance().getNpcFile(roleId);
        lv = dataIn.readByte() & 0xff;
        x = dataIn.readShort();
        y = dataIn.readShort();
        dir = dataIn.readByte();            
        name = dataIn.readUTF();
        enemy = dataIn.readBoolean();
        visible = dataIn.readBoolean();
        setFlash(dataIn.readBoolean());
        tipData = dataIn.readByte();

        status = Role.STAND_STATUS;
        changeAction();
        setDataFromLevel();
        originalPos = (x << 16) | (y & 0xffff);
        talkScript = RoleManager.loadScript(dataIn);
        dieScript = RoleManager.loadScript(dataIn);
        canPass = dataIn.readBoolean();
        if(dataIn.readBoolean())
        {
            int aniID = dataIn.readShort();
            int actID = dataIn.readShort();
            isKeepLastFrame = dataIn.readBoolean();
            isResumeAct = dataIn.readBoolean();
            bufferAni = ani;
            bufferActId = actId;
            AnimationManager.getInstance().getAnimation((short)aniID, this);
            actId = (short) actID;            
            initFrame();            
        }
        stateData = dataIn.readShort();
    }

    /**
     * 当前和npc是否用了同一张图片
     * @param npc
     * @return 可以释放的图片id数组
     */
    private short[] isUseSaveImage(Npc npc, short[] curNpcImgs)
    {
        short[] curCanNpcImgs = new short[curNpcImgs.length];
        int curNpcImgsCnt = 0;
        AnimationItem npcAniItem = (AnimationItem)AnimationManager.getInstance().grpMap.get((short) npc.aniItem.id);
        if(npcAniItem.single)
        {
            for(int index = 0, cnt = curNpcImgs.length; index < cnt; index++)
            {
                if(curNpcImgs[index] == npcAniItem.imageId)
                {
                    continue;
                }
                curCanNpcImgs[curNpcImgsCnt] = curNpcImgs[index];
                curNpcImgsCnt++;
            }
            return curCanNpcImgs;
        }
        short[] npcImgs = npcAniItem.imgIds;
        for (int index = 0, cnt = curNpcImgs.length; index < cnt; index++)
        {
            boolean isCanDel = true;
            for (int npcIndex = 0, npcCnt = npcImgs.length; npcIndex < npcCnt; npcIndex++)
            {
                if (curNpcImgs[index] == npcImgs[npcIndex])
                {
                    isCanDel = false;
                    break;
                }
            }
            if(!isCanDel)
            {
                continue;
            }
            curCanNpcImgs[curNpcImgsCnt] = curNpcImgs[index];
            curNpcImgsCnt++;
        }
        return curCanNpcImgs;
    }

    /**
     * 释放npc的所有资源
     */
    public void releaseImages()
    {
        if(file == null || file == GameContext.actor.superSkillFile1 || file == GameContext.actor.superSkillFile2)
        {
            return;
        }
        //如果是主角的话直接返回
        if(file.moveAct.aniId == Actor.ACTOR_ACT_ID)
        {
            return;
        }
        //切换到站立动画，将图片释放，因为有可能会公用死亡动画
        status = STAND_STATUS;
        changeAction();
        RoleManager roleMgr = RoleManager.getInstance();
        AnimationItem aniItem = (AnimationItem)AnimationManager.getInstance().grpMap.get((short) this.aniItem.id);
        short[] canDelImgs = aniItem.single ? new short[]{aniItem.imageId} : aniItem.imgIds;
        //是否需要释放图片
        boolean isCanDelImage = true;
        for(int index = 0,count = roleMgr.npcMap.size(); index < count; index++)
        {
            Npc npc = roleMgr.npcs[index];
            if(npc == this)
            {
                continue;
            }
            if(npc.file == null)
            {
                continue;
            }
            //npc队列中有和当前npc相同的file，那就不用释放图片了
            if(npc.file == file)
            {
                isCanDelImage = false;
                break;
            }
        }
        if (isCanDelImage)
        {
            for (int index = 0, count = roleMgr.npcMap.size(); index < count; index++)
            {
                Npc npc = roleMgr.npcs[index];
                if (npc == this)
                {
                    continue;
                }
                if (npc.file == null)
                {
                    continue;
                }
                canDelImgs = isUseSaveImage(npc, canDelImgs);
                //没有需要释放的图片的话就不释放
                if(canDelImgs[0] == 0)
                {
                    break;
                }
            }
            for (int index = 0, cnt = canDelImgs.length; index < cnt; index++)
            {
                if (canDelImgs[index] == 0)
                {
                    continue;
                }
                ImageManager.getInstance().removeImage(canDelImgs[index]);
            }
        }
        file = null;
        
        //这里只用释放动画文件，图片文件在上面已经释放过了。
        AnimationManager.getInstance().releaseAniOnly(ani);
        if(bufferAni != null)
        {
            AnimationManager.getInstance().releaseAni(bufferAni);
            AnimationManager.getInstance().releaseAni(ani);
        }
    }

    /**
     * trigger改变的额外速度
     */
    private int exSpeed = 0;
    public void setExSpeed(int changeSpeed) {
        if (exSpeed == changeSpeed) {
            return;
        }
        exSpeed += changeSpeed;
    }

    /**
     * 强行中断trigger运行，把所有状态恢复
     */
    public void stopTriggerAction() {
        haveTriggerAction = false;
        trigActIdx = 0;
        isStiff = false;
        isSuper = false;
    }
}
