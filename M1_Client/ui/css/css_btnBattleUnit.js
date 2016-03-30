this.cssLib.btnBattleUnit=
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
			type:"key",id:"BtnTrainUnit_"+(typeIdx+1),"pos":[5+80/2,10+100/2,0],"css":imgLib["box_unit_bg"],mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			gray:num<=0,
			state_up:{"css":imgLib["box_unit_bg"],w:80,h:100,mode3x3:1,},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib["box_unit_bg"],w:80,h:100,mode3x3:1,},
			state_gray:{"css":imgLib["box_unit_bg"],w:80,h:100,color_r:100,color_g:100,color_b:100,color_a:255,mode3x3:1,},
			items:[
				//{type:"div3x3",id:"UnitBg",pos:[0,0,0],w:80,h:100,"anchor_h":1,key:keyid,"anchor_v":1,css:imgLib.getImg("box_unit_bg")},
				{
					type:"icon",id:"UnitIcon",pos:[0,10,0],w:64,h:64,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
				},
				{type:"text",id:"UnitNum",css:cssLib.textFineMid.createCSS([0,-35,0],""+num,60,16,1,1,1,1),display:0==group?0:1},
			//	{type:"text",id:"UnitLv",css:cssLib.textFineSmall.createCSS([5,64,0],txtLib["Level Text"](lv),60,16,0,0,2,0)},
				{type:"icon",id:"LvIcon",pos:[-30+lvPicDef.w/2,45-lvPicDef.h/2,0],css:lvPic,anchor_h:1,anchor_v:1,display:(0==group || 12==group)?0:1},
				{type:"div3x3",id:"UnitSel",pos:[0,0,0],w:80,h:100,css:imgLib.getImg("box_unit_sel"),"anchor_h":1,key:keyid,"anchor_v":1,display:0,flash:2},
			],
			page:page,appEnv:appEnv,unitNum:num,unitDefIdx:typeIdx,unitGroup:group,unitUnits:units,exvo:exvo,
			update:this.update,
			putDown:this.putDown
		};
		if(exvo)
		{
			var url
			icon="bg_tier"+cIcon.substr(12,cIcon.length-12)+"_32.png";
			//css.items[0].css={tex:page.genPageURL(window.imgPath+"/icon/"+icon),tex_u:0,tex_v:0,tex_w:1,tex_h:1};
			css.css={tex:page.genPageURL(window.imgPath+"/icon/"+icon),tex_u:0,tex_v:0,tex_w:1,tex_h:1};
			css.state_up.css=css.css;
			css.state_down.css=css.css;
			css.state_gray.css=css.css;
			if(exvo.state>1)
			{
				url=page.genPageURL(window.imgPath+"/icon/icon_noATK64_32.png");
				css.items.push({type:"icon",pos:[0,0,0],tex:url,tex_w:1,tex_h:1,tex_u:0,tex_v:0,w:64,h:64,"anchor_h":1,"anchor_v":1});
				//css.state_up={"css":img_css,color_r:128,color_g:128,color_b:128,color_a:200};
			}
			var x,y;
			x=0;y=0;
			if(exvo.control)
			{
				y+=-64;
				url=page.genPageURL(window.imgPath+"/icon/icon_control64_32.png");
				css.items.push({type:"icon",pos:[x,y,0],tex:url,tex_w:1,tex_h:1,tex_u:0,tex_v:0,w:64,h:64,"anchor_h":1,"anchor_v":1});
				css.items.push({
					type:"bar",id:"cdBar",pos:[x,y,0],tex:url,tex_w:1,tex_h:1,tex_u:0,tex_v:0,w:64,h:64,"anchor_h":1,"anchor_v":1,
					iMode:1,value_full:1,value_init:0,face_r:100,face_g:0,face_b:0,face_a:100
				});
			}
			if(exvo.skill && exvo.skill.length)
			{
				y+=(y<0)?-46:-64;
				url=page.genPageURL(window.imgPath+"/icon/icon_skill64_32.png");
				css.items.push({type:"icon",pos:[x,y,0],tex:url,tex_w:1,tex_h:1,tex_u:0,tex_v:0,w:64,h:64,"anchor_h":1,"anchor_v":1});
			}
		}
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
};
