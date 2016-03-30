if(!__Page.dlgCSSBtnPrt)
{
	__Page.dlgCSSBtnPrt={
		createCSS:function(page,appEnv,x,y,keyid)
		{
			var imgLib=page.imgLib;
			var cssLib=page.cssLib;
			var page=cssLib.page;
			var textLib;
			var css;
			
			textLib=appEnv.textLib;
			picURL="";
			css={
				type:"key",id:"BtnMacPart","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
				state_up:{"css":imgLib.box_shopitem,w:150,h:150},audio:page.audioObject.genFileURL("btn_click"),
				state_down:{"css":imgLib.box_shopitem,w:150,h:150},
				state_gray:{"css":imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
				items:[
					{type:"icon",pos:[40,40,0],display:1,css:imgLib.getImg("pic_mech_add"),anchor_h:1,anchor_v:1,filter:1,ui_event:1,flash:2},
					{
						type:"icon",id:"PartIcon",pos:[0,0,0],w:150,h:150,display:1,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
					},
					{
						type:"text",id:"TxtBldLvReq",css:cssLib.textFineSmall.createCSS([0,0,0],"Click\nto\nChange",150,150,1,1,1,1),wrap:0,display:0
					}
				],
				page:page,appEnv:appEnv,part:null,subType:null,
				update:this.update
			};
			return css;
		},
		update:function(partDef,subType,level)
		{
			var picURL="";
			if(partDef)
			{
				picURL=this.page.genPageURL(window.imgPath+"/icon/"+partDef.codeName+"_b_32.png");
			}
			this.part=partDef;
			this.subType=subType;
			this.level=level;
			this.getItemById("PartIcon").setTexURL(picURL);
		},
	};

	__Page.dlgCSSBoxPrt={
		createCSS:function(page,appEnv,x,y,keyid,hideInfo,enhance)
		{
			var imgLib=page.imgLib;
			var cssLib=page.cssLib;
			var page=cssLib.page;
			var textLib;
			var css;
			
			textLib=appEnv.textLib;
			
			picURL="";
			css={
				type:"key",id:"BoxMechPart",pos:[x,y,0],css:imgLib.box_shopitem,mode3x3:1,anchor_h:1,anchor_v:1,key:keyid,ui_event:1,filter:1,button:1,down_scale:0.9,
				state_up:{css:imgLib.box_shopitem,w:150,h:150},audio:page.audioObject.genFileURL("btn_click"),
				state_down:{css:imgLib.box_shopitem,w:150,h:150},
				state_gray:{css:imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
				items:[
					{
						type:"icon",id:"PartIcon",pos:[0,0,0],w:150,h:150,display:1,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
						items:[
							{css:cssLib.btnInfo.createCSS([50,-50,0],keyid-1),display:hideInfo?0:1}
						]
					},
					{
						type:"text",id:"TipText",css:cssLib.textFineMid.createCSS([0,0,0],"???",150,150,1,1,1,1),wrap:0,display:0
					},
					{type:"text",id:"Name",css:cssLib.textFineMid.createCSS([-68,-68,0],"",150,150,0,0,0,0),wrap:1,font_size:FS.L},
					{type:"text",id:"Part",css:cssLib.textFineMid.createCSS([5,-5,0],"",150,150,1,1,0,2),wrap:1,font_size:FS.L},
					{type:"text",id:"Lv",css:cssLib.textFineMid.createCSS([-5,-5,0],"Lv.?",150,150,1,1,2,2),wrap:1,font_size:FS.L},
				],
				page:page,appEnv:appEnv,part:null,subType:null,enhance:enhance,
				update:this.update
			};
			return css;
		},
		update:function(partDef,subType,locked,level)
		{
			var picURL="";
			var icon,tip;
			icon=this.getItemById("PartIcon");
			tip=this.getItemById("TipText");
			var textLib=this.appEnv.textLib;
			this.part=partDef;
			this.subType=subType;
			this.locked=locked;
			this.level=level;
			picURL=partDef?this.page.genPageURL(window.imgPath+"/icon/"+partDef.codeName+"_m_32.png"):"";
			if(partDef)
			{
				this.getItemById("Name")._setText(partDef.name);
				this.getItemById("Part")._setText(textLib[(partDef.weight)?"AtkPart":"MovePart"]);
				this.getItemById("Lv")._setText("Lv."+(level+1));
				if(locked)
				{
					if(!this.enhance)
					{
						icon.setColor([255,255,255,128]);
					}
					tip._setText(textLib["Used"]);
					tip.setDisplay(1);
					icon.setDisplay(1);
				}
				else
				{
					icon.setColor([255,255,255,255]);
					icon.setDisplay(1);
					tip.setDisplay(0);
				}
			}
			else
			{
				this.getItemById("Name")._setText("");
				this.getItemById("Part")._setText("");
				this.getItemById("Lv")._setText("");
				icon.setDisplay(0);
				tip._setText(textLib["Empty"]);
				tip.setDisplay(1);
			}
			icon.setTexURL(picURL);
		},
	};
	
	__Page.dlgCSSBtnAddon={
		createCSS:function(page,appEnv,x,y,keyid)
		{
			var imgLib=page.imgLib;
			var cssLib=page.cssLib;
			var page=cssLib.page;
			var textLib;
			var css;
			
			textLib=appEnv.textLib;
			picURL="";
			css={
				type:"key",id:"BtnAddOn","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.98,
				state_up:{"css":imgLib.box_shopitem,w:100,h:100},audio:page.audioObject.genFileURL("btn_click"),
				state_down:{"css":imgLib.box_shopitem,w:100,h:100},
				state_gray:{"css":imgLib.box_shopitem_g,w:100,h:100,color_r:128,color_g:128,color_b:128,color_a:128},
				items:[
					{
						type:"icon",id:"PartIcon",pos:[0,0,0],w:100,h:100,display:1,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
					},
					{
						type:"text",id:"TipText",css:cssLib.textFineMid.createCSS([0,0,0],textLib["ChooseAddOn1"],100,100,1,1,1,1),wrap:1,display:0,font_size:FS.M
					}
				],
				page:page,appEnv:appEnv,part:null,subType:null,
				update:this.update
			};
			return css;
		},
		update:function(def)
		{
			var picURL="";
			var icon,tip;
			icon=this.getItemById("PartIcon");
			tip=this.getItemById("TipText");
			this.def=def;
			if(def)
			{
				picURL=this.page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_32.png");
				icon.setTexURL(picURL);
				icon.setDisplay(1);
				tip.setDisplay(0);
			}
			else
			{
				icon.setDisplay(0);
				tip.setDisplay(1);
			}
		},
	};

	//表示仓库里的
	__Page.dlgCSSSlotAddon={
		createCSS:function(page,appEnv,x,y,keyid)
		{
			var imgLib=page.imgLib;
			var cssLib=page.cssLib;
			var page=cssLib.page;
			var textLib;
			var css;
			
			textLib=appEnv.textLib;
			picURL="";
			css={
				type:"key",id:"BtnAddOn","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
				state_up:{"css":imgLib.box_shopitem,w:150,h:150},audio:page.audioObject.genFileURL("btn_click"),
				state_down:{"css":imgLib.box_shopitem,w:150,h:150},
				state_gray:{"css":imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
				items:[
					{
						type:"icon",id:"PartIcon",pos:[-64,-64,0],w:128,h:128,display:1,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,ui_event:1,
					},
					{
						type:"text",id:"NumText",css:cssLib.textFineMid.createCSS([-64,36,0],"None.\nClick\nto\nInstall",120,30,0,0,2,1),wrap:0,display:0
					}
				],
				page:page,appEnv:appEnv,part:null,subType:null,
				update:this.update
			};
			return css;
		},
		update:function(def,num)
		{
			var picURL="";
			var icon,tip;
			icon=this.getItemById("PartIcon");
			tip=this.getItemById("NumText");
			this.def=def;
			this.num=num;
			if(def)
			{
				picURL=this.page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_32.png");
				icon.setTexURL(picURL);
				icon.setDisplay(1);
				tip._setText("x"+num);
				tip.setDisplay(1);
			}
			else
			{
				icon.setDisplay(0);
				tip.setDisplay(0);
			}
		},
	};
}
