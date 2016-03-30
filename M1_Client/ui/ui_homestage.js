if(!__Page.uiHomeStage)
{
//********************************************************************
//玩家自己基地的舞台对象
__Page.uiHomeStage={
	page:__Page,
	listener:null,//舞台的监听者对象
	layer:null,
	gameHud:null,//CoC游戏3DHud控件
	navBox:null,//用于拖动地图的控件
	game:null,//CoC游戏GameMode对象
	level:null,//CoC游戏逻辑Level对象
	selBldToolIdx:0,//用于选中建筑物的HudTool的def的ID
	curHud:null,//当前选中的建筑的HudTool控件
	selBld:null,//当前选中的建筑的逻辑对象
	badPosBld:null,//当前位置错误的建筑的逻辑对象
	newPosBld:null,//当前正在获取创建位置的建筑的逻辑对象
	isDraging:0,//当前是否在拖拽某个建筑
	dragStartPenX:0,//拖拽开始的时候的鼠标位置X
	dragStartPenY:0,//拖拽开始的时候的鼠标位置Y
	dragStartBldX:0,//拖拽开始的时候的建筑物位置X
	dragStartBldY:0,//拖拽开始的时候的建筑物位置Y
	dragCurBldX:0,//拖拽过程中建筑物当前的位置X
	dragCurBldY:0,//拖拽过程中建筑物当前的位置Y
	uid2BldHash:[]
};
/************************************************
	监听者对象接口函数：
	stageOnBldInited(bld);//某个建筑初始化成功，根据当前状态添加HudTool、特效之类的东西
	stageOnBldTouch(bld);//某个建筑被点击，决定是否可以选中，选中后是否可以移动
	stageOnBldMoved(bld);//某个建筑被玩家移动，通知新的位置
	stageOnNewBldOK(bld,def);//玩家确定创建某个建筑，通知位置，更新状态
	stageOnNewBldAbort(bld,def);//玩家放弃创建某个建筑
***************************************************/

//---------------------------------------------------------------------------
//初始化Game的Def定义VO对象，可以在这里增加一些资源之类的东西
__Page.uiHomeStage.initGameDefVO=function(gameVO)
{
	//TODO: Code this:
};

//---------------------------------------------------------------------------
//初始化舞台对象，与Game进行绑定
__Page.uiHomeStage.initStage=function(game,gameHud,navBox,listener)
{
	this.game=game;
	//一下这些game对象下的成员对象需要事先设置好
	this.layer=game.layer;
	this.level=game.level;
	this.hudTools=game.hudTools;
	this.tileMap=game.tileMap;
	
	this.gameHud=gameHud;
	this.navBox=navBox;
	this.curHud=null;
	this.selBld=null;
	this.badPosBld=null;
	this.isDraging=0;
	this.dragStartPenX=0;
	this.dragStartPenY=0;
	this.dragStartBldX=0;
	this.dragStartBldY=0;
	this.dragCurBldX=0;
	this.dragCurBldY=0;

	//TODO:如何确定使用哪个HudTool？
	this.selBldToolIdx=game.hudTools.getHudToolDef("bld_selected");
	this.newBldToolIdx=game.hudTools.getHudToolDef("bld_getNewPos");;
	this.uid2BldHash=[];
};

//---------------------------------------------------------------------------
//新增一个建筑，让玩家选位置
__Page.uiHomeStage.addBlds=function(list)
{
	//TODO: Code this
};

//---------------------------------------------------------------------------
//舞台的触屏消息处理函数
__Page.uiHomeStage.onTouch=function(msg,x,y,way)
{
	var page=this.page;
	var level=this.level;
	var game=this.game;
	var bld,bldGame,toolItem,w;
	var dx,dy,pos;

	if(msg==0 && way==1)
	{
		if(this.selBld)//如果当前有选中的建筑（也可能是位置错误的建筑）
		{
			bld=this.selBld;
			pos=[0,0,0];
			bld.getPos(pos);
			dx=x-pos[0];
			dy=y-pos[1];
			if(bld.canMove && dx>=0 && dx<bld.getTileW() && dy>=0 && dy<bld.getTileH())//点击在建筑身上，如果当前建筑可以移动，开始拖拽
			{
				DBOut("Will start drag!!");
				this.isDraging=1;
				this.dragStartPenX=x;
				this.dragStartPenY=y;
				this.dragCurBldX=this.dragStartBldX=Math.floor(pos[0]);
				this.dragCurBldY=this.dragStartBldY=Math.floor(pos[1]);
				page.navBox.setNavItem(null);
				if(!this.badPosBld)
				{
					game.tileMap.startDrag(bld);
				}
				return 1;
			}
		}
	}
	else if(msg==1 && way==0)
	{
		if(this.isDraging)//如果正在拖拽，是否要更新当前拖拽建筑的位置？
		{
			dx=x-this.dragStartPenX;
			dy=y-this.dragStartPenY;
			dx=Math.floor(this.dragStartBldX+dx);
			dy=Math.floor(this.dragStartBldY+dy);
			if(dx!=this.dragCurBldX || dy!=this.dragCurBldY)//位置需要更新
			{
				this.dragCurBldX=dx;
				this.dragCurBldY=dy;
				this.selBld.setPos([dx,dy,0]);
				//新位置是否合法？
				this.updateBldPad();
			}
		}
	}
	else if(this.isDraging && msg==2 && way==1)//如果正在拖拽，且玩家释放鼠标
	{
		//是否是合法的建筑物位置？
		if(!this.newPosBld)
		{
			if(game.tileMap.isPosGoodForBuilding(this.selBld))//合法
			{
				DBOut("Will end drag!");
				game.tileMap.endDrag(this.selBld);//通知底层建筑停止拖拽
				if(this.listener)//回调通知建筑位置改变
				{
					this.listener.onBldMoved(this.selBld);
				}
				if(this.selBld.isWall())//如果是墙的话，需要更新墙的连接性
				{
					DBOut("Refresh wall connection!");
					bldGame=game.lgcObj2GameObj(this.selBld);
					bldGame.refreshWallConnection();
				}
				//更新当前建筑的“最近合法停留位置”
				pos=[0,0,0];
				this.selBld.getPos(pos);
				this.selBld.oldGoodX=pos[0];
				this.selBld.oldGoodY=pos[1];
				if(pos[0]==this.dragStartBldX && pos[1]==this.dragStartBldY)//如果建筑位置未改变，释放当前的建筑选择
				{
					if(this.curHud)
					{
						game.hudTools.freeTool(this.curHud);
					}
					this.curHud=null;
					this.selBld=null;
					this.badPosBld=null;
				}
			}
			else//非法位置，设置非法位置为当前建筑
			{
				this.badPosBld=this.selBld;
			}
		}
		this.isDraging=0;
		this.navBox.setNavItem(this.gameHud);
	}
	else if(msg==2 && way==1)//没有拖拽的时候，鼠标抬起
	{
		if(x>=0 && x<40 && y>=0 && y<40 && !this.newPosBld)
		{
			if(this.badPosBld)//检查选择还是复位旧的错位建筑
			{
				pos=[0,0,0];
				this.badPosBld.getPos(pos);
				dx=x-pos[0];
				dy=y-pos[1];
				if(dx>=0 && dx<this.badPosBld.getTileW() && dy>=0 && dy<this.badPosBld.getTileH())
				{
					//应该执行不到这里
				}
				else
				{
					//复位建筑位置到“最近合法停留位置”
					DBOut("Will restore bld pos:");
					pos=[this.badPosBld.oldGoodX,this.badPosBld.oldGoodY,0];
					this.badPosBld.setPos(pos);
					game.tileMap.endDrag(this.badPosBld);
					if(this.curHud)
					{
						game.hudTools.freeTool(this.curHud);
					}
					//取消当前选中的建筑
					this.curHud=null;
					this.selBld=null;
					this.badPosBld=null;
				}
			}
			//是否选择一个（新的）建筑
			{
				bld=level.getDockBuildingAt(x,y);
				DBOut("Bld at touch pos: "+bld+", curHud: "+this.curHud);
				if(bld)//当前鼠标抬起位置有一个建筑
				{
					if(bld==this.selBld && this.curHud)//当前鼠标位置的建筑就是当前选中的建筑，取消当前选中建筑
					{
						game.hudTools.freeTool(this.curHud);
						this.curHud=null;
						this.selBld=null;
					}
					else//选中了一个新建筑
					{
						this.selectBld(bld);
					}
					return 1;
				}
				else
				{
					if(this.curHud)
					{
						game.hudTools.freeTool(this.curHud);
						this.curHud=null;
						this.selBld=null;
					}
				}
			}
		}
	}
	return 0;
};

//---------------------------------------------------------------------------
//选中一个建筑
__Page.uiHomeStage.selectBld=function(bld)
{
	var game=this.game;
	var canMov,pos,toolItem;
	var bldGame;
	canMov=1;
	if(this.listener)
	{
		canMov=this.listener.stageOnBldTouch(bld);
	}
	if(canMov)//可以选择
	{
		bldGame=game.lgcObj2GameObj(bld);//获取与LgcGameObject对应的GameObject
		if(this.curHud)//如果有当前HudTool，释放之
		{
			game.hudTools.freeTool(this.curHud);
		}
		//为当前选中的建筑增加HudTool
		this.curHud=game.hudTools.addToolOn(this.selBldToolIdx,bldGame);
		if(canMov==1)//可以移动
		{
			toolItem=this.curHud.getSubItem(0);
			toolItem.setDisplay(0);

			toolItem=this.curHud.getSubItem(1);
			toolItem.setOffset([-bld.getTileW()/2,0,0]);

			toolItem=this.curHud.getSubItem(2);
			toolItem.setOffset([0,-bld.getTileW()/2,0]);

			toolItem=this.curHud.getSubItem(3);
			toolItem.setOffset([bld.getTileW()/2,0,0]);

			toolItem=this.curHud.getSubItem(4);
			toolItem.setOffset([0,bld.getTileW()/2,0]);
									
			this.selBld=bld;
			bld.canMove=1;
			pos=[0,0,0];
			bld.getPos(pos);
			bld.oldGoodX=pos[0];
			bld.oldGoodY=pos[1];
		}
		else
		{
			toolItem=this.curHud.getSubItem(0);
			toolItem.setDisplay(0);
			toolItem=this.curHud.getSubItem(1);
			toolItem.setDisplay(0);
			toolItem=this.curHud.getSubItem(2);
			toolItem.setDisplay(0);
			toolItem=this.curHud.getSubItem(3);
			toolItem.setDisplay(0);
			toolItem=this.curHud.getSubItem(4);
			toolItem.setDisplay(0);
									
			this.selBld=bld;
			bld.canMove=0;
			pos=[0,0,0];
			bld.getPos(pos);
			bld.oldGoodX=pos[0];
			bld.oldGoodY=pos[1];
		}
	}
};

//---------------------------------------------------------------------------
//清除当前的选中建筑,如果当前建筑位置非法，重置为合法位置
__Page.uiHomeStage.clearSelBld=function()
{
	var pos,uid;
	var game=this.game;
	if(this.selBld)
	{
		if(this.newPosBld)
		{
			//TODO: 如果有位置未定的新建筑，取消这个建筑的创建
			uid=this.newPosBld.getId();
			if(uid>0 && uid<1000)
			{
				this.uid2BldHash[uid]=null;
			}
			this.newPosBld.signAsDead();
			this.newPosBld=null;
		}
		else if(this.badPosBld)
		{
			if(this.badPosBld==this.selBld)
			{
				if(!game.tileMap.isPosGoodForBuilding(this.badPosBld))
				{
					//复位建筑位置到“最近合法停留位置”
					DBOut("Will restore bld pos:");
					pos=[this.badPosBld.oldGoodX,this.badPosBld.oldGoodY,0];
					this.badPosBld.setPos(pos);
				}
				game.tileMap.endDrag(this.badPosBld);
			}
			this.badPosBld=null;
		}
		if(this.curHud)
		{
			game.hudTools.freeTool(this.curHud);
		}
		this.selBld=null;
		this.curHud=null;
		this.badPosBld=null;
		this.newPosBld=null;
	}
	this.isDraging=0;
	this.navBox.setNavItem(this.gameHud);
};

//---------------------------------------------------------------------------
//根据建筑当前位置的合法性，设置底板
__Page.uiHomeStage.updateBldPad=function()
{
	var game=this.game;
	var toolItem,w,hudItem,keyItem;
	if(!this.selBld || !this.curHud)
	{
		return;
	}
	if(game.tileMap.isPosGoodForBuilding(this.selBld))//合法的位置
	{
		toolItem=this.curHud.getSubItem(0);
		toolItem.setDisplay(1);
		w=this.selBld.getTileW();
		switch(w)
		{
		case 1:
		default:
			toolItem.setAction(0);
			break;
		case 2:
			toolItem.setAction(1);
			break;
		case 3:
			toolItem.setAction(2);
			break;
		case 4:
			toolItem.setAction(3);
			break;
		}
		if(this.newPosBld)
		{
			toolItem=this.curHud.getSubItem(5);
			hudItem=toolItem.getHudItem();
			keyItem=hudItem.getItemById("BtnOK");
			keyItem.setEnabled(1);
		}
	}
	else//非法的位置
	{
		//DBOut("Bad Pos!!");
		toolItem=this.curHud.getSubItem(0);
		toolItem.setDisplay(1);
		w=this.selBld.getTileW();
		switch(w)
		{
		case 1:
		default:
			toolItem.setAction(4);
			break;
		case 2:
			toolItem.setAction(5);
			break;
		case 3:
			toolItem.setAction(6);
			break;
		case 4:
			toolItem.setAction(7);
			break;
		}
		if(this.newPosBld)
		{
			toolItem=this.curHud.getSubItem(5);
			hudItem=toolItem.getHudItem();
			keyItem=hudItem.getItemById("BtnOK");
			keyItem.setEnabled(0);
		}
	}
};

//---------------------------------------------------------------------------
//新增一个建筑，让玩家选位置
__Page.uiHomeStage.askNewBldPos=function(defIdx,uid,group)
{
	var bld,w,h;
	var pos;
	var game=this.game;
	var level=this.level;

	this.clearSelBld();
	pos=[this.page.getW()/2,this.page.getH()/2,0];
	this.gameHud.scrPos2Game(pos);
	pos[0]=Math.floor(pos[0]);
	pos[1]=Math.floor(pos[1]);
	//在屏幕中间位置上“预创建”建筑
	bld=level.aboutAddObjectJS(defIdx,uid,group,pos,45);
	
	if(uid>0 && uid<1000)
	{
		this.uid2BldHash[uid]=bld;
	}
	
	this.newPosBld=bld;
	//TODO: 增加HudTool控件
	bldGame=game.lgcObj2GameObj(bld);//获取与LgcGameObject对应的GameObject
	//为当前选中的建筑增加HudTool
	this.curHud=game.hudTools.addToolOn(this.newBldToolIdx,bldGame);
	toolItem=this.curHud.getSubItem(0);
	toolItem.setDisplay(0);

	w=bld.getTileW()/2;
	toolItem=this.curHud.getSubItem(1);
	toolItem.setOffset([-w,0,0]);

	toolItem=this.curHud.getSubItem(2);
	toolItem.setOffset([0,-w,0]);

	toolItem=this.curHud.getSubItem(3);
	toolItem.setOffset([w,0,0]);

	toolItem=this.curHud.getSubItem(4);
	toolItem.setOffset([0,w,0]);
							
	this.selBld=bld;
	bld.canMove=1;
	
	this.updateBldPad();
	
	return bld;
};

//---------------------------------------------------------------------------
//确认新建建筑的位置
__Page.uiHomeStage.confirmNewBld=function()
{
	//TODO: Code this
	var bld,city;
	if(!this.newPosBld)
		return;
	city=aisGame.curCity;
	if(cityfreeBldWorkerNum>0)
	{
		bld=this.newPosBld;
		this.game.tileMap.endDrag(bld);
		this.newPosBld=null;
		//this.layer.setFrameout(0,this.clearSelBld,this);
		this.clearSelBld();
	}
	else
	{
	}
};

//---------------------------------------------------------------------------
//取消新建建筑
__Page.uiHomeStage.abortNewBld=function()
{
	//this.layer.setFrameout(0,this.clearSelBld,this);
	this.clearSelBld();
};

//---------------------------------------------------------------------------
//变型（升级）一个建筑，实际上就是删除后再添加
__Page.uiHomeStage.morphBld=function(bld,newDefIdx)
{
	var sel;
	var pos,level,uid,group;
	
	//TODO: Code this
	level=this.level;
	sel=(bld==this.selBld);
	pos=[0,0,0];
	uid=bld.getId();
	group=bld.getGroup();
	bld.getPos(pos);
	bld.signAsDead();
	bld=level.addObject(idx,uid,group,pos,45);
	if(uid>0 && uid<1000)
	{
		this.uid2BldHash[uid]=bld;
	}
	if(this.listener)
	{
		this.listener.stageOnBldInited(bld);
	}
	if(sel)
		this.selectBld(bld);
	return bld;
};

//---------------------------------------------------------------------------
//删除一个建筑
__Page.uiHomeStage.removeBld=function(bld)
{
	//TODO: Code this
	var uid;
	if(this.selBld==bld)
		this.clearSelBld();
	uid=bld.getId();
	if(uid>0 && uid<1000)
	{
		this.uid2BldHash[uid]=bld;
	}
	bld.signAsDead();
};

//---------------------------------------------------------------------------
//通过uid获得一个建筑
__Page.uiHomeStage.getBldByUId=function(uid)
{
	if(uid>0 && uid<1000)
	{
		return this.uid2BldHash[uid];
	}
	return null;
};

};
