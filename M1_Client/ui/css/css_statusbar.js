this.cssLib.boxStatusBar=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	w:342,
	createCSS:function(pos,name,icon,cur,max,next,spd,curEx,nextEx,maxEx)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;
		var storage, def;
		var box=imgLib.getImg("box_resbox");
		var bar, barBG=imgLib.getImg("box_resBar_bg");
		bar=imgLib.getImg("box_statusBar_bar");
		var barLight=imgLib.getImg("box_resbox_light");
		var boxW=this.w;
		var boxH=box.h;
		var barW=boxW-box.mgW;
		var barH=bar.h;
		var resIcon=imgLib.getIcon(icon,64);
		var css={
			type:"shape",id:"StatusBar-"+name,pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,
			items:[
				{
					type:"icon",id:"BarBox",pos:[-boxW/2,0,0],w:boxW,h:boxH,css:cssLib.expBox,anchor_h:0,anchor_v:1,
					items:[
						{type:"div3x3",id:"bar-bg",pos:[box.mgL,0,0],css:barBG,w:barW,h:barH,anchor_h:0,anchor_v:1},
						{type:"div3x3",id:"ExBar",pos:[box.mgL,0,0],css:bar,w:0,h:barH,anchor_h:0,anchor_v:1,
							color_r:144,color_g:200,color_b:144,color_a:140},
						{type:"div3x3",id:"ValueBar",pos:[box.mgL,0,0],css:bar,w:0,h:barH,anchor_h:0,anchor_v:1},
						{type:"div3x3",id:"bar-light",pos:[0,0,0],css:barLight,w:boxW,h:boxH,anchor_h:0,anchor_v:1},
						{type:"icon",id:"Pic-Res",pos:[box.mgL/2,0,0],w:64,h:64,css:resIcon,anchor_h:1,anchor_v:1,},//资源图标
					]
				},
				{type:"text",id:"Text-Cur",css:cssLib.textFineMid.createCSS([-(box.mgR+64-10),-barH,0],textLib[name],barW,barH,0,1,0,1)},//
//				{
//					id:"BarText",type:"txt_score",pos:[100,100,0],anchor_h:0,anchor_v:1,align_h:0,align_v:1,w:100,h:20,font_size:12,
//					score:0,digit:1,grow:1/25,prefix:"前缀",postfix:"后缀",value_type:1,
//					edge:1,egde_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:241,color_b:211,
//				}
			],
			barW:barW,barH:barH,
			page:page,appEnv:appEnv,storage:storage,//res:resDef,
			update:this.update,viewId:"ResBar",
			setTimer:this.setTimer,
			aisUpdateView:this.update,
		};
		return css;
	},
	create:function(box,pos,name,icon,cur,max,next,spd,curEx,nextEx,maxEx)
	{
		var css,bar;
		css=this.createCSS(pos,name,icon,cur,max,next,spd,curEx,nextEx,maxEx);
		bar=box.appendNewChild(css);
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.picRes=bar.getItemById("Pic-Res");
		bar.valBar=bar.getItemById("ValueBar");
		bar.exBar=bar.getItemById("ExBar");
	//	storage.addUIView(bar);
		//spd:num/ms
		spd*=FPS;
		bar.cur=cur;
		bar.max=max;
		bar.next=next;
		bar.spd=spd;
		bar.name=name;
		bar.curEx=curEx;
		bar.nextEx=nextEx;
		bar.maxEx=maxEx;
		bar.update();
		return bar;
	},
	setTimer:function(full,cur)
	{
		var bar,timer;
		bar=this.getItemById("BarFace");
		bar.startTimer(Math.floor(full),Math.floor(cur));
		
		timer=this.getItemById("BarText");
		timer.setTime(Math.floor(full)-Math.floor(cur));
	//	setGrowFactor();
	},
	update:function()
	{
		var textLib=this.appEnv.textLib;
		var maxCap,curCap,nextCap,addCap,maxCapEx=0,curCapEx=0,nextCapEx=0,addCapEx=0,text,size;
		maxCap=this.max;
		curCap=this.cur;
		nextCap=this.next;
		addCap=nextCap-curCap;
		maxCapEx=this.maxEx;
		curCapEx=this.curEx;
		nextCapEx=this.nextEx;
		addCapEx=nextCapEx-curCapEx;
		var maxTxt,curTxt,nextTxt,addTxt,maxTxtEx="",curTxtEx="",nextTxtEx="",addTxtEx="";
		if(Math.floor(maxCap)<maxCap || Math.floor(curCap)<curCap || Math.floor(nextCap)<nextCap)
		{
			tail="%";
			maxTxt=Math.round(maxCap*100);
			curTxt=Math.round(curCap*100);
			nextTxt=Math.round(nextCap*100);
			addTxt=Math.round(addCap*100);
			if(maxCapEx)
				maxTxtEx=Math.round(maxCapEx*100);
			if(curCapEx)
				curTxtEx=Math.round(curCapEx*100);
			if(nextCapEx)
				nextTxtEx=Math.round(nextCapEx*100);
			if(addCapEx)
				addTxtEx=Math.round(addCapEx*100);
		}
		else
		{
			tail="";
			maxTxt=maxCap;
			curTxt=curCap;
			nextTxt=nextCap;
			addTxt=addCap;
			if(maxCapEx)
				maxTxtEx=maxCapEx;
			if(curCapEx)
				curTxtEx=curCapEx;
			if(nextCapEx)
				nextTxtEx=nextCapEx;
			if(addCapEx)
				addTxtEx=addCapEx;
		}
		if(nextCap>0){
			text=curTxt+"+"+addTxt+tail;
			if(curTxtEx)
				text="("+curTxt+"+"+addTxt+tail+")~("+curTxtEx+"+"+addTxtEx+tail+")";
		}else if(maxCap && (this.name.indexOf("Cap")>-1 || ("HP"==this.name && -1!=nextCap))){
			text=curTxt+tail+"/"+maxTxt+tail;
		}else{
			text=curTxt+tail;
			if(curTxtEx)
				text=curTxt+tail+"~"+curTxtEx+tail;
		}
	//	if("PrdctRate"==this.name)
	//		text+=(" "+textLib["PerHour"]);
		this.txtCur._setText(textLib[this.name]+": "+text);
		curCap=curCap<maxCap?curCap:maxCap;
		if(maxCap>0)
		{
			size=Math.floor(curCap/maxCap*this.barW);
			this.valBar.startSzAni(size,this.barH-1,0,3);
		}
		if(nextCap>0)
		{
			size=Math.floor(nextCap/maxCap*this.barW);
			this.exBar.startSzAni(size,this.barH-1,0,3);
		}
	}
};
