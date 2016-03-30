this.cssLib.btnDefenseSkill=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(codename,cIcon,typeIdx,num,lv,keyid,group,units,exvo)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv;
		var level,picURL,lvPic,lvPicDef;
		var css,ex,icon,clanFlag=page.getCookie("Runtime","ClanFlag");

		appEnv=page.appEnv;
		var txtLib=appEnv.textLib;
		//检查资源
		icon=codename.substr(0,codename.length-1)+"128";
		if(group==0){
			ex="icon_badge";
			icon=clanFlag+"64"
		}else if(group==4 ||group==5){
			ex="icon_spell_";
		}else if(group==12){
			icon=cIcon.substr(0,cIcon.length-3);
			ex="";
		}else{
			ex="icon_chr_";
		}
		//if(group==0)ex="";//联盟城堡
		picURL=page.genPageURL(window.imgPath+"/icon/"+ex+icon+"_32.png");
		lvPicDef=imgLib.getImg("pic_lv1");
		lvPic=imgLib.getImg("pic_lv"+(lv));
		css={
			type:"key",id:"BtnTrainUnit_"+(typeIdx+1),"pos":[5+80/2,(10+100/2)+40,0],"css":imgLib["box_unit_bg"],mode3x3:1,"anchor_h":1,key:0,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			gray:num<=0,
			state_up:{"css":imgLib["box_unit_bg"],w:80,h:100,mode3x3:1,},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib["box_unit_bg"],w:80,h:100,mode3x3:1,},
			state_gray:{"css":imgLib["box_unit_bg"],w:80,h:100,color_r:100,color_g:100,color_b:100,color_a:255,mode3x3:1,},
			items:[
				{
					type:"icon",id:"UnitIcon",pos:[0,10,0],w:64,h:64,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
				},
				{type:"text",id:"UnitNum",css:cssLib.textFineMid.createCSS([0,-35,0],""+num,60,16,1,1,1,1),display:0},
				{type:"icon",id:"LvIcon",pos:[-30+lvPicDef.w/2,45-lvPicDef.h/2,0],css:lvPic,anchor_h:1,anchor_v:1,display:(0==group || 12==group)?0:1},
				{
					type:"cdicon",id:"cdBar",pos:[0,0,0],css:imgLib["box_achieveBar_bg"],w:80,h:100,"anchor_h":1,"anchor_v":1,color_a:0,
					mode:2,val_full:100,val_cur:100,val_speed:0,
					color_dr:64,color_dg:64,color_db:64,color_lr:255,color_lg:255,color_lb:255,color_la:128,
					onValEvent:function(){this.setValSpeed(0);this.getFather().resetGemCDBtn(0);},
				},
				{type:"div3x3",id:"UnitSel",pos:[0,0,0],w:80,h:100,css:imgLib.getImg("box_unit_sel"),"anchor_h":1,key:keyid,"anchor_v":1,display:0,flash:2},

				{type:"key",id:"gembtn",pos:[0,-(imgLib["box_unit_bg"].h)-40,0],usetimes:0,display:0,//gray:1,
					css:imgLib["btn_type_d"],mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
					state_up:{"css":imgLib["btn_type_d"],w:80,h:40,mode3x3:1,},audio:page.audioObject.genFileURL("btn_click"),
					state_down:{"css":imgLib["btn_type_d"],w:80,h:40,mode3x3:1,},
					state_gray:{"css":imgLib["btn_type_d"],w:80,h:40,color_r:100,color_g:100,color_b:100,color_a:200,mode3x3:1,},
					items:[
						{type:"icon",pos:[-15,0,0],w:40,h:40,tex:page.genURL(window.imgPath+"/icon/icon_res_gem64_32.png"),tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1},
						{type:"text",id:"GemNum",css:cssLib.textFineMid.createCSS([15,0,0],""+exvo.baseGem,60,16,1,1,1,1)},
					]
				}
			],
			page:page,appEnv:appEnv,unitNum:num,unitDefIdx:typeIdx,unitGroup:group,unitUnits:units,exvo:exvo,
			update:this.update,
			putDown:this.putDown,useGemCD:this.useGemCD,resetGemCDBtn:this.resetGemCDBtn,getGemCost:this.getGemCost,
		};

		return css;
	},
	putDown:function()
	{
		if(this.unitNum)
		{
			this.unitNum--;
			this.getItemById("UnitNum")._setText(this.unitNum+"");
			this.update();
		}
	},
	update:function()
	{
		if(!this.unitNum)
		{
			var icon=this.getItemById("UnitIcon");
			if(icon)icon.setColor([50,50,50,128]);
			if(!this.exvo)
				this.setStateStyle(0,{"css":this.page.imgLib.box_shopitem_g,w:80,h:100,mode3x3:1,color_r:255,color_g:255,color_b:255,color_a:255});
			else
				this.setEnabled(0);
			icon=this.getItemById("UnitBg");
			if(icon)icon.setDisplay(0);
		}
	},
	resetGemCDBtn:function(f)
	{
		gembtn=this.getItemById("gembtn");
		//gembtn.setEnabled(f);
		gembtn.setDisplay(f);
	},
	useGemCD:function()
	{
		gembtn=this.getItemById("gembtn");
		gembtn.usetimes++;
		var num=this.exvo.baseGem+this.exvo.incGem*gembtn.usetimes;
		//gembtn.setEnabled(0);
		gembtn.setDisplay(0);
		gembtn.getItemById("GemNum")._setText(""+num);

		return num;
	},
	getGemCost:function()
	{
		gembtn=this.getItemById("gembtn");
		return this.exvo.baseGem+this.exvo.incGem*gembtn.usetimes;
	}
};
