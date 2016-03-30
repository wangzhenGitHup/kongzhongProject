﻿if(!__Page.dlgChooseAddOn)
{
	__Page.dlgChooseAddOn=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgChooseAddOn.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	};
	__Page.dlgChooseAddOn.init=function(appEnv)
	{
		this.name="dlgChooseAddOn";
		this.viewId="dlgChooseAddOn";
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
		this.cntBox=this.dlgFrame.appendNewChild({id:"contentField-info",css:[this.contentFieldCSS],display:0});

		var cntW=this.contentW, cntH=this.contentH;
		var infoX=20, infoY=8, infoW=cntW-infoX*2, infoH=170;
		var iconW=150, iconH=150, iconX=10+iconW/2, iconY=infoH/2;
		var nameW=450, nameH=30, nameX=iconX+iconW/2+28, nameY=20, useY=nameY/*+nameH*/, lvY=useY+nameH, descY=lvY+nameH;
		var btnX=infoW-100, confirmY=infoH/2-40, unloadY=infoH/2+40;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onConfirmClk);
		var keyid1=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid1,this,this.onRemoveClk);
		var tw=appEnv.getTextSize(textLib["AddOnDesc"],FS.M,0,nameW,nameH).w;
		this.infoBox=this.cntBox.appendNewChild({id:"info-box",type:"div3x3",pos:[infoX,infoY,0],w:infoW,h:infoH,ui_event:1,css:imgLib.getImg("box_green"),items:[
			{id:"hot",type:"div3x3",pos:[iconX,iconY,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_solid"),},
			{id:"icon",type:"icon",pos:[iconX,iconY,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,},
			{id:"name",type:"text",pos:[nameX,nameY,0],w:nameW,h:nameH,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["AddOnName"],font_size:FS.M},
		//	{id:"use",type:"text",pos:[nameX,useY,0],w:nameW,h:nameH,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["AddOnEffect"],font_size:FS.M},
			{id:"lv",type:"text",pos:[nameX,lvY,0],w:nameW,h:nameH,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["AddOnLevel"],font_size:FS.M},
			{id:"desc1",type:"text",pos:[nameX,descY,0],w:nameW,h:nameH,color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["AddOnDesc"],font_size:FS.M},
			{id:"desc",type:"text",pos:[nameX+tw,descY,0],w:nameW-tw,h:nameH,color_r:0,color_g:0,color_b:0,color_a:160,text:"??",font_size:FS.M},
			{id:"confirm",css:cssLib.normalBtn.createCSS([btnX,confirmY,0],keyid,0,textLib["Confirm"])},
			{id:"Unload",css:cssLib.normalBtn.createCSS([btnX,unloadY,0],keyid1,1,textLib["Unload"])},
		]});
		this.btnConfirm=this.infoBox.getItemById("confirm");
		this.btnRemove=this.infoBox.getItemById("Unload");
		this.hotIcon=this.infoBox.getItemById("hot");

		var txtX=infoX, txtY=infoY+infoH+5, txtW=infoW, txtH=26;
		this.cntBox.appendNewChild({type:"text",pos:[txtX,txtY,0],color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["OwnedAddOn"]+":",font_size:FS.M});

		var storeX=infoX, storeY=txtY+txtH, storeW=infoW, storeH=cntH-storeY-8;
		this.storeBox=this.cntBox.appendNewChild({id:"store-box",type:"div3x3",pos:[storeX,storeY,0],w:storeW,h:storeH,ui_event:1,clip:1});

		var subW=100, subH=110, subX=subW/2, subY=subH/2, iconW=80, iconH=80, nameW=subW, nameH=subH-iconH, nameX=0, nameY=subH/2-3, self=this;
		this.addOnCSS={
			createCSS:function(keyid)
			{
				var css={type:"key",pos:[subX,subY,0],anchor_h:1,anchor_v:1,w:subW,h:subH,ui_event:1,key:keyid,down_scale:0.9,
					state_up:{w:subW,h:subH},state_down:{w:subW,h:subH},state_gray:{w:subW,h:subH},audio:page.audioObject.genFileURL("btn_click"),
					items:[
						{type:"div3x3",pos:[0,-subY,0],w:iconW,h:iconH,anchor_h:1,anchor_v:0,css:imgLib.getImg("box_solid")},
						{type:"icon",id:"Icon",pos:[0,-subY,0],w:iconW,h:iconH,anchor_h:1,anchor_v:0,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,},
						{type:"text",id:"QTip",css:cssLib.textFineSmall.createCSS([0,-subY+3,0],"",iconW-6,iconH-6,1,0,0,0),font_size:FS.L,display:1},
						{type:"text",id:"NTip",css:cssLib.textFineSmall.createCSS([0,-subY,0],"",iconW-10,iconH-3,1,0,2,2),font_size:FS.L,display:1},
						{type:"text",id:"Name",pos:[nameX,nameY,0],w:nameW,h:nameH,anchor_h:1,anchor_v:2,align_h:1,align_v:1,color_r:0,color_g:0,color_b:0,color_a:160,
							text:"",font_size:FS.S,display:1},
						{type:"div3x3",id:"sel",pos:[0,-5,0],w:subW+8,h:subH+16,css:imgLib.getImg("box_sel"),anchor_h:1,anchor_v:1,display:0}
					],
					dlg:self,update:this.update,
				};
				return css;
			},
			update:function(vo)
			{
				def=vo.def;
				tq=vo.tq;
				num=vo.num;
				this.num=num;

				var icon,tip,q,ntip;
				var picURL="";
				icon=this.getItemById("Icon");
				tip=this.getItemById("QTip");
				ntip=this.getItemById("NTip");
				name=this.getItemById("Name");
				if(def)
				{
					name.setText(def.name);
					this.def=def;
					picURL=imgLib.genIconPath(def.codeName+"_32");
					icon.setDisplay(1);
					if(!tq)
					{
						q=def.quality>0?def.quality:1;
						tip._setText(appEnv.getAddOnLv(q));
					}
					else
					{
						if(tq==def.quality)
						{
							tip._setText("=");
						}
						else if(tq>def.quality)
						{
							tip._setText("<");
						}
						else
						{
							tip._setText(">");
						}
					}
					if(num>=0)
					{
						ntip._setText("x"+num);
						ntip.setColor(255,255,255,255);
						if(0==num)
						{
							ntip.setColor(230,10,10,255);
						}
					}
					else
					{
						ntip._setText("");
					}
				}
				else
				{
					name.setText("");
					icon.setDisplay(0);
					tip._setText("");
					ntip._setText("");
				}
				icon.setTexURL(picURL);
			}
		};

		var lbxX=0, lbxY=8, lbxW=storeW, lbxH=storeH-lbxY;
		this.lbxStore=this.storeBox.appendNewChild({css:cssLib.multiList.createCSS([lbxX,lbxY,0],lbxW,lbxH,keyid,storeW,subH,subW,subH,0,60)});
	};

	__Page.dlgChooseAddOn.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib;
		var cssLib;
		var homeDlg;
		var list,i,n,keyid,btn,css;
		var textLib=aisEnv.textLib;
		var items,itemx,itemy,item;
		var boxw,boxh,btnw,btnh;
		var storage,slotName,slot,def,url;
		var partList,i,n,j,x,y,curIdx;

		homeDlg=this.dlgPage.dlgGarage;
		imgLib=page.imgLib;
		cssLib=page.cssLib;

		itemx=150;itemy=(appEnv.scrSize[1]-220)/2+10;
		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			homeDlg.dlgTitle._setText(vo.title);
		}

		var defLib=window.aisEnv.defLib.addon;
		var storage=homeDlg.aisBld.city.addOnStorage;
		//for(i in storage)DBOut(i+":"+storage[i]);
		var addOnList=defLib.allAddOns, defs=[];
		//首先清理旧的按钮
		this.lbxStore.clearItems();
		for(i=0; i<addOnList.length; i++)
		{
			keyid=appEnv.hudKeys.getKey(this);
			btn=this.lbxStore._addItem(i,this.addOnCSS.createCSS(keyid));
			this.regKeyVO(keyid,btn,this.onAddOnClk);
			def=defLib[addOnList[i]];
			defs.push({def:def,num:storage.getItemNum(def.codeName),tq:0});
		}

		this.btnConfirm.setDisplay(0);
		boxw=this.dlgPage.dlgGarage.boxW;
		boxh=this.dlgPage.dlgGarage.boxH;
		btnw=(boxw-20-240-4*150)/4+150;

		partList=[];
		list=storage.slots;
		for(slotName in list)
		{
			n=0;
			DBOut("Slot: "+slotName);
			slot=list[slotName];
			if(slot.num)
			{
				def=slot.def;
				if(def["effect"])
				{
					for(i in def["effect"])
					{
						if(i!="compose")
						{
							n=1;
							break;
						}
					}
				}
				if(n)
					partList.push(slot);
			}
		}
		if(vo.def)
		{
			if(!storage.slots[vo.def.codeName] || !storage.slots[vo.def.codeName].num)
			{
				DBOut("push new def");
				partList.push({slotIdx:vo.def.codeName,def:vo.def,perSize:0,num:0});
			}
			this.curAddOn=vo.def.codeName;
			DBOut("=== curAddOn:"+this.curAddOn);
		}
		else
		{
			this.curAddOn=null;
			this.btnRemove.setDisplay(0);
		}

		list=partList;
		n=list.length;
		for(i=0;i<n;i++)
		{
			for(j=0;j<n-1;j++)
			{
				if(list[j].def.quality>list[j+1].def.quality)
				{
					slot=list[j];
					list[j]=list[j+1];
					list[j+1]=slot;
				}
			}
		}

		n=list.length;
		for(i=0;i<n;i++)
		{
			def=list[i].def;
			if(def.codeName==this.curAddOn)
			{
				curIdx=i;
				DBOut("--- curIdx:"+curIdx);
				break;
			}
		}
		this.selAddOn=null;
		this.lbxStore.update(list);
		DBOut(toJSON(list));
		if(curIdx)
		{
			var itemVO=this.lbxStore.findItem(curIdx);
			this.lbxStore.showItem(itemVO.idx);
			this.onAddOnClk.call(itemVO.item,1,0,1,1);
		}
		else
			this.onAddOnClk.call(this.lbxStore.itemAt(0).getItemById("sub0"),1,0,1,1);

		this.appEnv.hudIn(this.cntBox,5);
	};

	__Page.dlgChooseAddOn.leave=function(nextState)
	{
		var i,list,n;
		this.appEnv.hudOut(this.cntBox,5);
	};

	__Page.dlgChooseAddOn.updateInfo=function(def,num)
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var keyid;

		var icon=this.infoBox.getItemById("icon");
		var name=this.infoBox.getItemById("name");
	//	var use=this.infoBox.getItemById("use");
		var lv=this.infoBox.getItemById("lv");
		var desc=this.infoBox.getItemById("desc");
		var confirm=this.infoBox.getItemById("confirm");
		var unload=this.infoBox.getItemById("unload");

		icon.setTexURL(def?imgLib.genIconPath(def.codeName+"_32"):"");
		name.setText(textLib["AddOnName"]+(def?def.name:""));
	//	use.setText(textLib["AddOnEffect"]+(def?def.use:""));
		lv.setText(textLib["AddOnLevel"]+(def?appEnv.getAddOnLv(def.quality):""));
	//	desc.setText(textLib["AddOnDesc"]+(def?def.desc:""));
		desc.setText(def?def.desc:"");
		if(!def)
		{
			this.btnConfirm.setEnabled(0);
			this.btnRemove.setEnabled(0);
		}
		else
		{
			this.btnConfirm.setDisplay(1);
			this.btnRemove.setDisplay(1);
			if(num)
			{
				this.btnConfirm.setEnabled(1);
			}
			else
			{
				this.btnConfirm.setEnabled(0);
			}
			if(def.codeName==this.curAddOn)
			{
				this.btnRemove.setEnabled(1);
			}
			else
			{
				this.btnRemove.setEnabled(0);
			}
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgChooseAddOn.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way && msg)
				DBOut("dlgChooseAddOn.onKey: "+key+", "+msg+", "+extra);
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//Addon被点击
		__Page.dlgChooseAddOn.onAddOnClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var self=this.dlg;
				if(!this.def)return;
				if(self.selAddOn==this)return;
				if(self.selAddOn){
					self.selAddOn.getItemById("sel").setDisplay(0);
					self.selAddOn.update({def:self.selAddOn.def,num:self.selAddOn.num});
				}
				DBOut("onAddOnClk: "+this.def.codeName+", num:"+this.num);
				self.selAddOn=this;
				self.selAddOn.getItemById("sel").setDisplay(1);
				self.updateInfo(this.def,this.num);
				this.update({def:this.def,num:(!self.selAddOn && this.def.codeName==self.curAddOn)?this.num:(this.num)});
			}
		};

		__Page.dlgChooseAddOn.onConfirmClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var def;
				def=this.selAddOn.def;
				DBOut("Will change add-on to: "+(def?def.codeName:"None"));
				this.dlgPage.dlgGarage.dlgChooseAddOn(def);
				this.appEnv.switchDlg(this.dlgPage.dlgGarage,0,null);
			}
		};

		__Page.dlgChooseAddOn.onRemoveClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("Will remove add-on!");
				this.dlgPage.dlgGarage.dlgChooseAddOn(null);
				this.appEnv.switchDlg(this.dlgPage.dlgGarage,0,null);
			}
		}
	}
}
