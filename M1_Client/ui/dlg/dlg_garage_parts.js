if(!__Page.dlgChoosePart)
{
	__Page.dlgChoosePart=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgChoosePart.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	};
	__Page.dlgChoosePart.init=function(appEnv)
	{
		this.name="dlgChoosePart";
		this.viewId="dlgChoosePart";
		this.slotVsn=0;
		this.rmCap=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgGarage;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({id:"contentField-part",css:[this.contentFieldCSS],display:0});

		var cntW=this.contentW, cntH=this.contentH;
		var infoX=20, infoY=8, infoW=cntW-infoX*2, infoH=170;
		var iconW=150, iconH=150, iconX=10+iconW/2, iconY=infoH/2;
		var w=230, h1=30, h2=30, x1=iconX+iconW/2+28, y1=10, y2=y1+h1, y3=y2+h1, y4=y3+h1, y5=y4+h1, x2=x1+w+12;
		var btnX=infoW-100, confirmY=infoH/2-40, unloadY=infoH/2+40;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onConfirmClk);
		var keyid1=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid1,this,this.onRemoveClk);
		this.infoBox=this.cntBox.appendNewChild({id:"info-box",type:"div3x3",pos:[infoX,infoY,0],w:infoW,h:infoH,ui_event:1,css:imgLib.getImg("box_green"),items:[
			{id:"hot",type:"div3x3",pos:[iconX,iconY,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_solid"),},
			{id:"icon",type:"icon",pos:[iconX,iconY,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,fliter:1},
			{id:"a1",type:"text",pos:[x1,y1,0],w:w,h:h1,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["Name"]+": ",font_size:FS.M},
			{id:"a2",type:"text",pos:[x1,y2,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["Level"]+": ",font_size:FS.M},
			{id:"a3",type:"text",pos:[x1,y3,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["Weight"]+": ",font_size:FS.M},
			{id:"a4",type:"text",pos:[x1,y4,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["HP"]+": ",font_size:FS.M},
			{id:"a5",type:"text",pos:[x1,y5,0],w:w,h:h1,color_r:0,color_g:0,color_b:0,color_a:160,text:"",font_size:FS.M},

			{id:"a6",type:"text",pos:[x2,y1,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:"",font_size:FS.M},
			{id:"a7",type:"text",pos:[x2,y2,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:"",font_size:FS.M},
			{id:"a8",type:"text",pos:[x2,y3,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:"",font_size:FS.M},
			{id:"a9",type:"text",pos:[x2,y4,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:"",font_size:FS.M},
			{id:"a10",type:"text",pos:[x2,y5,0],w:w,h:h2,color_r:0,color_g:0,color_b:0,color_a:160,text:"",font_size:FS.M},
			{id:"confirm",css:cssLib.normalBtn.createCSS([btnX,confirmY,0],keyid,0,textLib["Confirm"])},
			{id:"Unload",css:cssLib.normalBtn.createCSS([btnX,unloadY,0],keyid1,1,textLib["Unload"])},
		]});
		this.btnConfirm=this.infoBox.getItemById("confirm");
		this.btnRemove=this.infoBox.getItemById("Unload");
		this.hotIcon=this.infoBox.getItemById("hot");

		var txtX=infoX, txtY=infoY+infoH+5, txtW=infoW, txtH=26;
		this.infoTxt=this.cntBox.appendNewChild({type:"text",pos:[txtX,txtY,0],color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["MechPart"],font_size:FS.M});
		this.selFrame=this.cntBox.appendNewChild({type:"div3x3",pos:[0,0,0],w:168,h:168,css:imgLib.getImg("box_sel"),anchor_h:1,anchor_v:1,display:0});

		this.prtBtns=[];
		this.emptyBtns=[];
		this.curPartDef=null;
	};

	__Page.dlgChoosePart.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib;
		var cssLib;
		var homeDlg;
		var list,i,n,keyid,btn,css;
		var textLib=appEnv.textLib;
		var items,itemx,itemy,item;
		var boxw,boxh,btnw,btnh;
		var storage,slotName,slot,def,url;
		var partList,i,n,j,x,y;

		homeDlg=this.dlgPage.dlgGarage;
		imgLib=page.imgLib;
		cssLib=page.cssLib;
		
		itemx=150;itemy=(appEnv.scrSize[1]-220)/2+10;
		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			homeDlg.dlgTitle._setText(vo.title);
			if(vo.bodyPart)
				this.infoTxt.setText(textLib["BodyPart"]);
			else
				this.infoTxt.setText(textLib["LegPart"]);
		}

		this.curPartDef=null;
		this.btnConfirm.setDisplay(0);
		this.btnRemove.setDisplay(0);
		boxw=this.dlgPage.dlgGarage.boxW;
		boxh=this.dlgPage.dlgGarage.boxH;
		btnw=(boxw-20-240-4*150)/4+150;
		btnh=(boxh-80-240-150-150)+150;

		list=this.prtBtns;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.cntBox.removeChild(list[i]);
		}
		this.prtBtns=[];
		list=this.emptyBtns;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.cntBox.removeChild(list[i]);
		}
		this.emptyBtns=[];

		partList=[];
		storage=this.dlgPage.dlgGarage.aisBld.city.partStorage;
		list=storage.slots;
		this.chooseBody=vo.bodyPart;
		for(slotName in list)
		{
			DBOut("Slot: "+slotName);
			slot=list[slotName];
			if(!slot.num>0)
				continue;
			def=slot.def;
			if(vo.bodyPart)
			{
				if(def.weight && (!slot.lockNum))
				{
					partList.push(slot);
				}
			}
			else
			{
				if(def.load && (!slot.lockNum))
				{
					partList.push(slot);
				}
			}
		}
		list=partList;
		n=list.length;
		var lv1,lv2;
		for(i=0;i<n;i++)
		{
			for(j=0;j<n-1;j++)
			{
				lv1=list[j].subInfo.level;
				lv2=list[j+1].subInfo.level;
				if(list[j].def.levels[lv1].cost.time>list[j+1].def.levels[lv2].cost.time)
				{
					slot=list[j];
					list[j]=list[j+1];
					list[j+1]=slot;
				}
			}
		}

		n=list.length;
		this.trainX=120, this.trainY=290;
		for(i=0;i<n;i++)
		{
			def=list[i].def;
			DBOut("def: "+list[i]+": "+def);
			x=(i%5)*btnw;
			y=Math.floor(i/5)*btnh;
			keyid=appEnv.appKeys.bldTrainUnit_1-(i?i:0)*2;
			css=cssLib.btnChoosePart.createCSS(def,i,this.trainX+x,this.trainY+y,keyid,list[i].subInfo.level);
			DBOut("pos: "+css.pos[0]+", "+css.pos[1]);
			btn=this.cntBox.appendNewChild(css);
			btn.def=def;
			btn.subType=list[i].subType;
			btn.dlg=this;
			btn.level=list[i].subInfo.level;
			this.prtBtns.push(btn);
			this.regKeyVO(keyid,btn,this.onPartClk);
		}

		for(;i<10;i++)
		{
			x=(i%5)*btnw;
			y=Math.floor(i/5)*btnh;
			btn=this.cntBox.appendNewChild({
				type:"icon",pos:[this.trainX+x,this.trainY+y,0],css:cssLib.boxSolid,w:150,h:150,color_r:120,color_g:120,color_b:120,color_a:128,anchor_h:1,anchor_v:1
			});
			this.emptyBtns.push(btn);
		}

		if(vo.def)
		{
			this.updateInfo(vo.def,vo.level);
			this.curPartDef=vo.def;
			this.curSubType=vo.subType;
			this.curLevel=vo.level;
		}

		this.updateInfo();
		if(this.prtBtns[0])
			this.onPartClk.call(this.prtBtns[0],1,0,1,1);
		this.appEnv.hudIn(this.cntBox,5);
	};

	__Page.dlgChoosePart.leave=function(nextState)
	{
		var i,list,n;
		this.appEnv.hudOut(this.cntBox,5);
	};

	__Page.dlgChoosePart.updateInfo=function(def,level)
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var keyid, attr=[], attrTxt=[], i;

		var icon=this.infoBox.getItemById("icon");
		var a1=this.infoBox.getItemById("a1");//name
		var a2=this.infoBox.getItemById("a2");//level
		var a3=this.infoBox.getItemById("a3");//weight
		var a4=this.infoBox.getItemById("a4");//hp
		var a5=this.infoBox.getItemById("a5");
		var a6=this.infoBox.getItemById("a6");
		var a7=this.infoBox.getItemById("a7");
		var a8=this.infoBox.getItemById("a8");
		var a9=this.infoBox.getItemById("a9");
		var a10=this.infoBox.getItemById("a10");
		attrTxt=[a1,a2,a3,a4,a5,a6,a7,a8,a9,a10];

		icon.setTexURL(def?imgLib.genIconPath(def.codeName+"_m_32"):"");
		level+=1;
		if(def)
		{
			var lvo=def["levels"][level];
			var factor=lvo["factor"];
			attr.push({name:"Name",val:def["name"]});
			attr.push({name:"Level",val:level});
			attr.push({name:"HP",val:factor["hp"]});
			attr.push({name:"RepairTime",val:textLib.getTimeText(lvo["RepairSec"]*1000)});
			if(def["weight"])//上半身
			{
				attr.push({name:"Weight",val:def["weight"]+"T"});
				attr.push({name:"DmgPerSec",val:factor["power"]});
				attr.push({name:"DmgType",val:def["dmg_type"]});
				attr.push({name:"DmgTarget",val:def["target"]});
				attr.push({name:"DmgFavor",val:def["favor"]});
				attr.push({name:"DmgRange",val:lvo["factor"]["range"]/100+textLib["Tiles"]});
			}
			else//下半身
			{
				attr.push({name:"WeightCap",val:def["load"]+"T"});
				attr.push({name:"MovementSpeed",val:factor["move_speed"]});
			}
		}
		for(i=0; i<attrTxt.length; i++)
		{
			if(attr[i])
			{
				attrTxt[i].setText(textLib[attr[i].name]+": "+attr[i].val);
			}
			else
			{
				attrTxt[i].setText("");
			}
		}
		if(!def)
		{
			this.btnConfirm.setEnabled(0);
			this.btnRemove.setEnabled(0);
		}
		else
		{
			this.btnConfirm.setEnabled(1);
			this.btnConfirm.setDisplay(1);
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgChoosePart.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
				DBOut("dlgChoosePart.onKey: "+key+", "+msg+", "+extra);
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//关闭按钮被点击
		__Page.dlgChoosePart.onPartClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var self=this.dlg;
				var def=this.def;
				var url,page;
				page=self.page;
				self.updateInfo(def,this.level);
				self.curPartDef=def;
				self.curSubType=this.subType;
				self.curLevel=this.level;

				var pos=[];
				this.getPos(pos);
				self.selFrame.setPos(pos);
				self.selFrame.setDisplay(1);
			}
		};

		__Page.dlgChoosePart.onConfirmClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				if(this.chooseBody)
				{
					this.dlgPage.dlgGarage.dlgChooseBody(this.curPartDef,this.curSubType,this.curLevel);
				}
				else
				{
					this.dlgPage.dlgGarage.dlgChooseLeg(this.curPartDef,this.curSubType,this.curLevel);
				}
				this.appEnv.switchDlg(this.dlgPage.dlgGarage,0,null);
			}
		};

		__Page.dlgChoosePart.onRemoveClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("Will remove add-on!");
				return;
				this.dlgPage.dlgGarage.dlgChooseAddOn(null);
				this.appEnv.switchDlg(this.dlgPage.dlgGarage,0,null);
			}
		}
	}
}
