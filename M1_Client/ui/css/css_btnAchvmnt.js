this.cssLib.btnAchvmnt=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,keyid)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib,css;
		var def,level,levelDef,res,num,resDef,url;
		appEnv=page.appEnv;
		var resIcon=imgLib.getIcon("btn_ach_32");
		resIcon.w=resIcon.h=64;
		css={
			type:"key",id:"BtnAchvmnt",pos:pos,key:keyid,css:resIcon,anchor_h:1,anchor_v:1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{css:resIcon},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{css:resIcon,w:resIcon.w,h:resIcon.h},
			state_gray:{css:resIcon,color_a:63},
			display:1,fade:1,fade_pos:pos,fade_size:1,fade_alpha:0,
			items:[
				{type:"icon",id:"NewMark",pos:[20,20,0],css:imgLib.mark_newchvmnt,anchor_h:1,anchor_v:1}
			],
			page:page,appEnv:appEnv,king:aisGame.king,achvmnts:aisGame.king.achvmnts,
			viewId:"UIButton",
			aisUpdateView:function()
			{
				DBOut("Achvmnt Button Update: "+this.achvmnts.bonusNum);
				this.mark.setDisplay(this.achvmnts.bonusNum>0?1:0);
			},
		};
		return css;
	},
	create:function(box,pos,keyid)
	{
		var css,btn;
		css=this.createCSS(pos,keyid);
		btn=box.appendNewChild(css);
		btn.mark=btn.getItemById("NewMark");
		window.aisGame.king.achvmnts.addUIView(btn);
		return btn;
	},
};
