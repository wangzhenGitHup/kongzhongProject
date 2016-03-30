if(!__Page.vwCityEdit)
{
//********************************************************************
//玩家自己基地的舞台对象
__Page.vwCityEdit={
	page:__Page,
	appEnv:null,//JS的App环境对象
	layer:null,
	gameHud:null,//CoC游戏3DHud控件
	navBox:null,//用于拖动地图的控件
	gameDefVO:null,
	game:null,//CoC游戏GameMode对象
	level:null,//CoC游戏逻辑Level对象
	curUnitIdx:-1,
	allObjs:[],
	selObjs:[],
	curSelObj:null,
	multiSelect:0,
	isDraging:0,
	feildW:44,
	feildH:44,
	actorIdx:{
	},
	toolIdx:{
		selBld:-1,			//选中建筑物的HudTool的定义ID
		badPos:-1,
	},
	layerIdx:{
	},
};
/************************************************
***************************************************/

//---------------------------------------------------------------------------
//初始化舞台对象
__Page.vwCityEdit.initStage=function()
{
	this.appEnv=this.page.appEnv;
	this.game=null;
	this.layer=null;
	this.level=null;
	this.hudTools=null;
	this.tileMap=null;
	this.gameHud=null;
	this.navBox=null;

	this.initGameHud();
};

//***************************************************************************
//用户触屏消息, 建筑选择/取消选择函数
//***************************************************************************
{
	//---------------------------------------------------------------------------
	//舞台的触屏消息处理函数,this为舞台Hud控件
	__Page.vwCityEdit.onLevelTouch=function(msg,x,y,way)
	{
		return this.editStage.onTouch(msg,x,y,way);
	};

	//---------------------------------------------------------------------------
	//舞台的触屏消息处理函数
	__Page.vwCityEdit.onTouch=function(msg,x,y,way)
	{
		var page=this.page;
		var level=this.level;
		var game=this.game;
		var bld,bldGame,toolItem,w,aisBld,bldGame;
		var dx,dy,pos,group,idx,eft,cocDef,cocBld;
		var obj,list,i,n;

		this.bldDraged=0;
		if(msg==0 && way==1)//按下,:
		{
			if(this.selObjs.length)//如果当前有选中的建筑（也可能是位置错误的建筑）
			{
				bld=level.getObjectAt(2,x,y);
				if(bld && bld.edSelected)//点击在建筑身上，如果当前建筑可以移动，开始拖拽
				{
					this.isDraging=1;
					this.dragStartPenX=x;
					this.dragStartPenY=y;
					pos=[0,0,0];
					list=this.selObjs;
					n=list.length;
					for(i=0;i<n;i++)
					{
						list[i].getPos(pos);
						list[i].dragCurBldX=list[i].dragStartBldX=Math.floor(pos[0]);
						list[i].dragCurBldY=list[i].dragStartBldY=Math.floor(pos[1]);
						list[i].dragMoved=0;
						game.tileMap.startDrag(list[i]);//通知底层建筑停止拖拽
					}
					this.navBox.setNavItem(null);
					return 1;
				}
			}
		}
		else if(msg==1 && way==0)//移动,
		{
			if(this.isDraging)//如果正在拖拽，是否要更新当前拖拽建筑的位置？
			{
				list=this.selObjs;
				n=list.length;
				for(i=0;i<n;i++)
				{
					dx=x-this.dragStartPenX;
					dy=y-this.dragStartPenY;
					dx=Math.floor(list[i].dragStartBldX+dx);
					dy=Math.floor(list[i].dragStartBldY+dy);
					if(dx!=list[i].dragCurBldX || dy!=list[i].dragCurBldY)//位置需要更新
					{
						list[i].dragCurBldX=dx;
						list[i].dragCurBldY=dy;
						list[i].setPos([dx,dy,0]);
						list[i].dragMoved=1;
						this.appEnv.hudOut(page.stateCityEdit.hudBaseBox,3);
						this.bldDraged=1;
						this.checkPos(list[i]);
					}
				}
			}
		}
		else if(this.isDraging && msg==2 && way==1)//拖拽中鼠标抬起
		{
			DBOut("Pen msg: "+msg+", "+way);
			list=this.selObjs;
			n=list.length;
			pos=[0,0,0];
			for(i=0;i<n;i++)
			{
				game.tileMap.endDrag(list[i]);//通知底层建筑停止拖拽
				if(list[i].isWall())//如果是墙的话，需要更新墙的连接性
				{
					bldGame=game.lgcObj2GameObj(list[i]);
					bldGame.refreshWallConnection();
				}
				list[i].getPos(pos);
				if(pos[0]!=list[i].dragStartBldX || pos[1]!=list[i].dragStartBldY)//如果建筑位置未改变，释放当前的建筑选择
				{
					this.bldDraged=1;
					//暂时什么也不做:
					//this.clearSelBld();
				}
			}
			this.isDraging=0;
			this.checkAllPos();
			this.navBox.setNavItem(this.gameHud);
			this.appEnv.hudIn(page.stateCityEdit.hudBaseBox,3);
		}
		if(!this.bldDraged && msg==2 && way==1)//鼠标抬起
		{
			DBOut("Pen up!!");
			if(page.stateCityEdit.curEditMode==0)//选择建筑
			{
				bld=level.getObjectAt(2,x,y);
				DBOut("Bld: "+bld);
				if(bld)//当前鼠标抬起位置有一个建筑
				{
					DBOut("Test select: "+bld.edSelected);
					if(bld.edSelected)//当前鼠标位置的建筑就是当前选中的建筑，取消当前选中建筑
					{
						DBOut("Remove select");
						this.removeSelBld(bld);
					}
					else//选中了一个新建筑
					{
						if(this.multiSelect)
						{
							this.addSelectBld(bld);
						}
						else
						{
							this.selectBld(bld);
						}
					}
					return 1;
				}
				else//点击位置没有建筑,如果当前有选中建筑,取消选择
				{
					if(!this.multiSelect)
					{
						this.clearSelBld();
					}
				}
			}
			else if(page.stateCityEdit.curEditMode==1)//新建建筑
			{
				idx=page.stateCityEdit.curNewBldDefIdx;
				if(idx>=0)
				{
					x=Math.floor(x);
					y=Math.floor(y);
					group=2;
					cocBld=level.addObjectJS(idx,0,group,[x,y,0],45);
					cocBld.defIdx=idx;
					this.allObjs.push(cocBld);
					//播放特效
					cocDef=this.objDefs[idx];
					eft=cocDef.effect.select;
					if(!(eft<0))
					{
						DBOut("Effect: "+eft);
						if(!(eft>=0))
						{
							eft=this.effects.getEffectDef(eft);
							cocDef.effect.select=eft;
						}
						if(eft>=0)
						{
							DBOut("Play Effect: "+eft);
							bldGame=this.game.lgcObj2GameObj(cocBld);
							bldGame.playEffect(eft);
						}
					}
					this.checkPos(cocBld);
				}
			}
			else if(page.stateCityEdit.curEditMode==2)//删除建筑
			{
				obj=level.getObjectAt(2,x,y);
				list=this.allObjs;
				n=list.length;
				for(i=0;i<n;i++)
				{
					if(list[i]==obj)
					{
						list.splice(i,1);
						break;
					}
				}
				DBOut("Will delete: "+obj);
				if(obj)
				{
					if(obj.hudBadPad)
					{
						this.game.hudTools.freeTool(obj.hudBadPad);
						obj.hudBadPad=null;
					}
					obj.signAsDead();
					this.checkAllPos();
				}
			}
		}
		return 0;
	};
}

//***************************************************************************
//新增建筑, 建筑升级等
//***************************************************************************
{
	__Page.vwCityEdit.selectBld=function(bld)
	{
		var tool,bldGame;
		//先清除所有选中的:
		this.clearSelBld();
		bld.edSelected=1;
		this.selObjs.push(bld);
		this.curSelObj=bld;
		//增加Tool:
		bldGame=this.game.lgcObj2GameObj(bld);
		if(bldGame)
		{
			bld.hudTool=tool=this.game.hudTools.addToolOn(this.toolIdx.selBld,bldGame);
			//tool.fadeIn(0.2);
			tool.cocBld=bld;
			this.updateHudPad(tool);
		}
	};

	__Page.vwCityEdit.addSelectBld=function(bld)
	{
		var tool,bldGame;
		if(!bld.edSelected)//防止重复加入
		{
			bld.edSelected=1;
			this.selObjs.push(bld);
			this.curSelObj=bld;
			//TODO: 增加Tool:
			bldGame=this.game.lgcObj2GameObj(bld);
			if(bldGame)
			{
				bld.hudTool=tool=this.game.hudTools.addToolOn(this.toolIdx.selBld,bldGame);
				//tool.fadeIn(0.2);
				tool.cocBld=bld;
				this.updateHudPad(tool);
			}
		}
	};

	__Page.vwCityEdit.removeSelBld=function(bld)
	{
		var i,n,list,tool;
		bld.edSelected=0;
		list=this.selObjs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i]==bld)
			{
				list.splice(i,1);
				break;
			}
		}
		//Remove Tool:
		if(bld.hudTool)
		{
			this.game.hudTools.freeTool(bld.hudTool);
			bld.hudTool=null;
		}
	};

	__Page.vwCityEdit.clearSelBld=function()
	{
		var i,n,list,bld;
		list=this.selObjs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			bld=list[i];
			bld.edSelected=0;
			//Remove Tool:
			if(bld.hudTool)
			{
				this.game.hudTools.freeTool(bld.hudTool);
				bld.hudTool=null;
			}
		}
		list.splice(0,n);
	};

	__Page.vwCityEdit.checkPos=function(bld)
	{
		var list,i,n,tbld,bad;
		var bx1,bx2,by1,by2,tx1,tx2,ty1,ty2;
		var minx,maxx,miny,maxy,w,h;
		var pos,bldGame;
		pos=[0,0,0];
		bld.getPos(pos);
		bx1=pos[0];
		bx2=pos[0]+bld.getTileW();
		by1=pos[1];
		by2=pos[1]+bld.getTileH();
		bad=0;
		list=this.allObjs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			tbld=list[i];
			if(tbld==bld)
				continue;
			tbld.getPos(pos);
			tx1=pos[0];
			tx2=pos[0]+tbld.getTileW();
			ty1=pos[1];
			ty2=pos[1]+tbld.getTileH();

			minx=tx1>bx1?tx1:bx1;
			maxx=tx2<bx2?tx2:bx2;
			miny=ty1>by1?ty1:by1;
			maxy=ty2<by2?ty2:by2;
			w=maxx-minx;
			h=maxy-miny;
			if(w>0 && h>0)//Bad pos!!
			{
				DBOut("Find bad pos bld!!");
				bad=1;
				//TODO: Add bad pad to both bld!!
				if(!bld.hudBadPad)
				{
					bldGame=this.game.lgcObj2GameObj(bld);
					if(bldGame)
					{
						bld.hudBadPad=this.game.hudTools.addToolOn(this.toolIdx.badPos,bldGame);
						bld.hudBadPad.cocBld=bld;
						this.updateBadPad(bld.hudBadPad);
					}
				}
				if(!tbld.hudBadPad)
				{
					bldGame=this.game.lgcObj2GameObj(tbld);
					if(bldGame)
					{
						tbld.hudBadPad=this.game.hudTools.addToolOn(this.toolIdx.badPos,bldGame);
						tbld.hudBadPad.cocBld=tbld;
					}
				}
			}
		}
		if(!bad && bld.hudBadPad)
		{
			this.game.hudTools.freeTool(bld.hudBadPad);
			bld.hudBadPad=null;
		}
	};

	__Page.vwCityEdit.checkAllPos=function()
	{
		var list,i,n,j,bld,tbld;
		var bx1,bx2,by1,by2,tx1,tx2,ty1,ty2;
		var minx,maxx,miny,maxy,w,h;
		var pos,bad;
		pos=[0,0,0];
		list=this.allObjs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			bld=list[i];
			bld.isAllPosBad=0;
		}
		for(i=0;i<n-1;i++)
		{
			bld=list[i];
			bld.getPos(pos);
			bx1=pos[0];
			bx2=pos[0]+bld.getTileW();
			by1=pos[1];
			by2=pos[1]+bld.getTileH();
			for(j=i+1;j<n;j++)
			{
				if(tbld==bld)
					continue;
				tbld=list[j];
				tbld.getPos(pos);
				tx1=pos[0];
				tx2=pos[0]+tbld.getTileW();
				ty1=pos[1];
				ty2=pos[1]+tbld.getTileH();

				minx=tx1>bx1?tx1:bx1;
				maxx=tx2<bx2?tx2:bx2;
				miny=ty1>by1?ty1:by1;
				maxy=ty2<by2?ty2:by2;
				w=maxx-minx;
				h=maxy-miny;
				if(w>0 && h>0)//Bad pos!!
				{
					DBOut("Find bad pos bld!!");
					bld.isAllPosBad=1;
					tbld.isAllPosBad=1;
					if(!bld.hudBadPad)
					{
						bldGame=this.game.lgcObj2GameObj(bld);
						if(bldGame)
						{
							bld.hudBadPad=this.game.hudTools.addToolOn(this.toolIdx.badPos,bldGame);
							bld.hudBadPad.cocBld=bld;
							this.updateBadPad(bld.hudBadPad);
						}
					}
					if(!tbld.hudBadPad)
					{
						bldGame=this.game.lgcObj2GameObj(tbld);
						if(bldGame)
						{
							tbld.hudBadPad=this.game.hudTools.addToolOn(this.toolIdx.badPos,bldGame);
							tbld.hudBadPad.cocBld=tbld;
						}
					}
				}
			}
			if(!bld.isAllPosBad && bld.hudBadPad)
			{
				this.game.hudTools.freeTool(bld.hudBadPad);
				bld.hudBadPad=null;
			}
		}
		if(n>0)
		{
			bld=list[n-1];
			if(!bld.isAllPosBad && bld.hudBadPad)
			{
				this.game.hudTools.freeTool(bld.hudBadPad);
				bld.hudBadPad=null;
			}
		}
	};

	//-------------------------------------------------------------------------
	//更新HudTool的建筑物底板:
	__Page.vwCityEdit.updateHudPad=function(tool)
	{
		var game,bld;
		var toolItem,w,hudItem,keyItem,w;

		game=this.game;
		bld=tool.cocBld;
		toolItem=tool.getSubItem(0);
		toolItem.setDisplay(0);

		toolItem=tool.getSubItem(1);
		toolItem.setOffset([-bld.getTileW()/2,0,0]);

		toolItem=tool.getSubItem(2);
		toolItem.setOffset([0,-bld.getTileW()/2,0]);

		toolItem=tool.getSubItem(3);
		toolItem.setOffset([bld.getTileW()/2,0,0]);

		toolItem=tool.getSubItem(4);
		toolItem.setOffset([0,bld.getTileW()/2,0]);

		toolItem=tool.getSubItem(5);
		toolItem.setDisplay(0);

		if(1)//game.tileMap.isPosGoodForBuilding(this.cocBld))//合法的位置
		{
			toolItem=tool.getSubItem(0);
			toolItem.setDisplay(tool.cocBld.dragMoved);
			w=tool.cocBld.getTileW();
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
		}
		else//非法的位置
		{
			//DBOut("Bad Pos!!");
			toolItem=tool.getSubItem(0);
			toolItem.setDisplay(1);
			w=tool.cocBld.getTileW();
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
		}
	};

	//-------------------------------------------------------------------------
	//更新HudTool的错误位置底板:
	__Page.vwCityEdit.updateBadPad=function(tool)
	{
		var game,bld;
		var toolItem,w,hudItem,keyItem,w;

		game=this.game;
		bld=tool.cocBld;
		{
			toolItem=tool.getSubItem(0);
			toolItem.setDisplay(1);
			w=tool.cocBld.getTileW();
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
		}
	};
}

//***************************************************************************
//初始化舞台, 界面
//***************************************************************************
{
	//初始化CoC游戏的Hud
	__Page.vwCityEdit.initGameHud=function()
	{
		var page;
		var layer,appEnv;
		var scale,css,w,h;

		page=this.page;
		appEnv=page.appEnv;
		this.layer=layer=page.getElementById("ui-layer");
		scale=1;

		//创建触屏操作底板,TODO: min/max_pos需要正确的初始化
		this.navBox=layer.addHudItem({
			"type":"nav_box",id:"navBox","pos":[0,0,0],w:960,h:640,ui_event:1,display:1,csm_pos:0,
			min_pos:[-800,-800,0],max_pos:[800,100,0],key:appEnv.appKeys.navBox,inertia_damping:3,
		});
		this.setNavBoxRangeByScale(scale);
		//初始化CoC游戏控件的Hud的Def对象
		this.hudDef={
			type:"coc_game",pos:[appEnv.scrSize[0]>>1,-((54*40))>>1,0],w:this.feildW,h:this.feildH,scale:scale,ui_event:1,display:0,
			game:this.genGameDefVO(),
			page:this.page,editStage:this,
			onTouch:this.onLevelTouch
		};
		//初始化CoC游戏控件
		this.gameHud=layer.addHudItem(this.hudDef);
		this.game=this.gameHud.getGameMode();
		this.game.editStage=this;
		this.game.page=page;
		this.game.layer=layer;
		this.game.effects=this.game.getEffects();
		this.game.hudTools=this.game.getHudTools();
		this.game.onGameLoaded=this.onGameLoaded;
		this.objDefs=this.hudDef.game.level.obj_defs;
	};

	//设置navbox的范围
	__Page.vwCityEdit.setNavBoxRangeByScale=function(scale)
	{
		var w,h,appEnv=this.page.appEnv;
		var scrSize=appEnv.scrSize;
		w=72;h=54;
		this.navBox.setMinNavPos([scrSize[0]-(3000/2)*scale,scrSize[1]-(2500)*scale+8,0]);
		this.navBox.setMaxNavPos([(3000/2)*scale,-8,0]);
		if(this.gameHud)
		this.gameHud.setScale(scale);
	};

	//---------------------------------------------------------------------------
	//CoC游戏初始化完成的回调:
	__Page.vwCityEdit.onGameLoaded=function()
	{
		var self,game,w,h,css,page;
		self=this.editStage;
		game=self.game;
		page=self.page;

		//在这里初始化底部文本
		w=Math.floor(page.stateCityEdit.hudBCBox.getW()/2);
		h=page.stateCityEdit.hudBCBox.getH()-page.imgLib.btn_btminfo.h-12;
		css={
			type:"text",css:page.cssLib.textFineMid.createCSS([w,h,0],"Bottom Text (Level XX)",100,20,1,1,1,1,[255,241,211]),
			display:0,fade:1,fade_size:1,fade_alpha:0
		};
		self.hudBtmText=page.stateCityEdit.hudBCBox.appendNewChild(css);

		page.stateCityEdit.onGameLoaded();

		self.level=self.game.level=self.game.getLevel();
		//DBOut("Level: "+self.level);
		self.level.page=self.page;
		self.game.tileMap=self.level.getTileMap();
		self.navBox.setNavItem(self.gameHud);
		self.effects=self.game.effects=self.game.getEffects();

		//确定使用哪个HudTool
		self.toolIdx.selBld=game.hudTools.getHudToolDef("bld_selected");
		self.toolIdx.badPos=game.hudTools.getHudToolDef("bld_badpos");

		//初始化已有的建筑
		self.initCityBlds();

		//启动游戏?
		self.layer.setFrameout(0,self.startGame,self);

		//设置所有图都读完了的回调：
		game.onGameTexLoaded=self.onGameTexLoaded;
		//这个是为了兼容旧的不支持“onGameTexLoaded”客户端版本添加的，正式版可以去掉
		self.layer.setTimeout(3000,self.onGameTexLoaded,game);
	};

	//---------------------------------------------------------------------------
	//启动当前的CoC游戏引擎逻辑更新
	__Page.vwCityEdit.startGame=function()
	{
		this.game.setGameState(JGXCoCGameMode.STATE_RUNNING);
	}

	__Page.vwCityEdit.onGameTexLoaded=function()
	{
		var self,game,w,h,css,page;
		self=this.editStage;
		if(self.gameHud.getDisplay())return;
		//取消回调
		this.onGameTexLoaded=null;
		self.gameHud.setDisplay(1);
		self.page.appEnv.delSearchAni(0);
		self.page.appEnv.addScale(self.gameHud,[0.8,0.8,1],[1,1,1]);
	};

	//---------------------------------------------------------------------------
	//根据当前的AISGame/King/City创建已有的建筑
	__Page.vwCityEdit.initCityBlds=function()
	{
		var page,appEnv,game,level,city;
		var savedTxt,gameVO;
		var list,i,n,m;
		var bldDef,defIdx,group;
		var uid,cocBld;
		var pos;

		page=this.page;
		game=this.game;
		level=game.level;
		appEnv=this.appEnv;

	};

	//---------------------------------------------------------------------------
	//创建游戏初始化VO对象
	__Page.vwCityEdit.genGameDefVO=function()
	{
		var gameDefVO
		var page=this.page;
		gameDefVO={
			grid_size:72,
			render_core:{
				max_stub:2000,
				//       0          1          2            3          4            5         6        7          8        9        10
				layers:[{name:"bld_base",sort:0},{name:"bld_dock",sort:0},{name:"gnd_shadow",sort:0},{name:"gnd_objs",sort:1,col:1,row:54,tile_w:3168,tile_h:44,grid_x:-1584,grid_y:0},{name:"sky_shadow",sort:0},{name:"gnd_fxs",sort:0},"gnd_ui","sky_objs","sky_ui",{name:"sky_fx",sort:0},"top"]
			},
			stage:{
				"gnd_tex":page.genPageURL(window.imgPath+"/gnd/gnd_back_32.png"),"env_tex_1":page.genPageURL(window.imgPath+"/gnd/pic_env_01_32.pvr"),"env_tex_2":page.genPageURL(window.imgPath+"/gnd/pic_env_02_32.pvr"),
				env_offset_x:0,env_offset_y:2*54,
			},
			splib:[{lib:page.genPageURL(window.imgPath+"/fx/fx.spl"),auto_res:0},{lib:page.genPageURL(window.imgPath+"/fx/fx2.spl"),auto_res:0},{lib:page.genPageURL(window.imgPath+"/ui/ui.spl"),auto_res:0},],
			anis:[
				<include check="0">"ani/ani_buildings.js"</include>
				<include check="0">"ani/ani_characters.js"</include>
				<include check="0">"ani/ani_part.js"</include>
				<include check="0">"ani/ani_uis.js"</include>
				<include check="0">"ani/ani_projectiles.js"</include>
				<include check="0">"ani/ani_effects.js"</include>
			],
			effects:[
				<include check="0">"eft/eft_uis.js"</include>
				<include check="0">"eft/eft_buildings.js"</include>
				<include check="0">"eft/eft_characters.js"</include>
				<include check="0">"eft/eft_battles.js"</include>
			],
			hudtools:[
				<include check="0">"htl/htl_home.js"</include>
			],
			level:this.genLevelDefVO(),
		};
		return gameDefVO;
	};

	//---------------------------------------------------------------------------
	//创建游戏Level初始化VO对象
	__Page.vwCityEdit.genLevelDefVO=function()
	{
		var levelVO,list,i,n;
		var page=this.page;
		levelVO={
			map_w:this.feildW,map_h:this.feildH,map_bolder:2,
			groups:[
				<include check="0">"def/def_groups.js"</include>
			],
			prjtl_defs:[
				<include check="0">"def/def_projectiles.js"</include>
			],
			obj_defs:[
				<include check="0">"def/def_buildings.js"</include>
				<include check="0">"def/def_characters.js"</include>
				<include check="0">"def/def_spells.js"</include>
				<include check="0">"def/def_add.js"</include>
				<include check="0">"def/def_mech.js"</include>
				<include check="0">"def/def_addon.js"</include>
				//TODO: 增加障碍物, 村民, 装饰等
			],
		};
		//修正战斗单位的combat属性:
		list=levelVO.obj_defs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i]._combat)
			{
				list[i].combat=list[i]._combat;
			}
		}
		return levelVO;
	};
}

//***************************************************************************
//I/O函数
//***************************************************************************
{
	//---------------------------------------------------------------------------
	//创建存盘VO对象
	__Page.vwCityEdit.genSaveVO=function()
	{
		var voObj={};
		var slist,tlist,i,n,cocBld,cocDef;
		var pos;

		voObj.bunkerunits=[];
		tlist=voObj.objs=[];
		pos=[0,0,0];
		slist=this.allObjs;
		n=slist.length;
		for(i=0;i<n;i++)
		{
			cocBld=slist[i];
			if(cocBld && cocBld.defIdx>=0)
			{
				cocDef=this.objDefs[cocBld.defIdx];
				cocBld.getPos(pos);
				tlist.push({defName:cocDef.def_name,def:cocBld.defIdx,group:2,x:pos[0],y:pos[1],codename:cocDef.codename,level:cocDef.level});
			}
		}
		return voObj;
	};

	//--------------------------------------------------------------------------
	//从存盘文件中读取
	__Page.vwCityEdit.loadSavedVO=function(saveVO)
	{
		var list,i,n,bldVO,cocBld,defIdx;;
		list=saveVO.objs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			bldVO=list[i];
			//添加建筑:
			defIdx=bldVO.def;
			if(defIdx>=0)
			{
				if(this.objDefs[defIdx].def_name!=bldVO.defName)
				{
					defIdx=this.level.getObjDefIdx(bldVO.defName);
				}
				if(defIdx>=0)
				{
					cocBld=this.level.addObjectJS(defIdx,0,bldVO.group,[bldVO.x,bldVO.y,0],45);
					cocBld.defIdx=defIdx;
					this.allObjs.push(cocBld);
				}
			}
		}
		this.checkAllPos();
	};
}//End of I/O Functions.

}//End of file
