if(!__Page.pmtJoint)
{
	__Page.pmtJoint=new __Page.gamePage.pmtBase(__Page,__Page.gamePage.appEnv,3,0);
	//添加至AppEnv的自动初始化列表中:
	__Page.pmtJoint.init=function(appEnv)
	{
		this.name="pmtJoint";
	};

	__Page.pmtJoint.enter=function(preState,vo)
	{
		this.dlgPage.gamePage.pmtBase.prototype.init.call(this,this.appEnv);
		this.dlgPage.gamePage.pmtBase.prototype.enter.call(this,preState,vo);

		var def,level,url;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		DBOut("pmtJoint.enter: "+appEnv);

		this.pmtVO=vo;
		if(vo)
		{
			this.hold=0;
			this.aisBld=vo.bld;
			this.infoText.setAlignH(1);
			this.pmtTitle._setText(textLib["JointTitle"]);
			this.infoText._setText("");
			var picEmpty=imgLib.getImg("pic_joint_empty");
			var x=this.contentW/2, y=this.contentH/2-12, w=picEmpty.w, h=picEmpty.h;
			this.topTxt=this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([x,30,0],textLib["JointDesc"],530,30,1,1,1,1),fade:1,fade_size:1,fade_alpha:0,wrap:1});

			this.aniBox=this.cntBox.appendNewChild({type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH});
			this.bigBg=this.aniBox.appendNewChild({type:"icon",pos:[x,y,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_joint_bg"),});
			this.aniBg=this.aniBox.appendNewChild({type:"icon",pos:[x,y,0],anchor_h:1,anchor_v:1,css:picEmpty});
			this.aniObj=this.aniBg.appendNewChild({type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_joint_rotate")});
			this.appEnv.addRotate_z(this.aniObj);
//			this.itemObj=this.cntBox.appendNewChild({type:"icon",pos:[x,y,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("plu_L4_09_32"),w:w,h:h,display:0});
//			this.itemName=this.itemObj.appendNewChild({type:"text",pos:[0,h/2+20,0],text:"",anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:FS.FM,
//				color_r:10,color_g:10,color_b:10,color_a:200});
			this.btmTxt=this.aniBox.appendNewChild({css:cssLib.textFineMid.createCSS([x,y+h/2+72,0],textLib["Wait"],200,30,1,1,1,1)});
			var keyid=this.appEnv.hudKeys.getKey(this);
			this.btnOK=cssLib.btnDlgOK.create(this.cntBox,[x,y+h/2+72,0],keyid);
			this.regKeyVO(keyid,this,this.onOkClk);
			this.btnOK.setDisplay(0);

			var pic=imgLib.getImg("pic_joint_bg"), picW=pic.w, picH=pic.h;
			w=448, h=picH+4;
			this.midTxt=this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([x,y,0],"",w,h,1,1,1,0),wrap:1});

			x=(this.contentW-w)/2;
			this.okBox=this.cntBox.appendNewChild({type:"div3x3",pos:[x,y,0],w:w,h:h,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_green"),display:0,items:[
				{type:"icon",pos:[110,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_joint_bg"),},
				{type:"icon",pos:[110,0,0],anchor_h:1,anchor_v:1,css:picEmpty},
				{id:"item",type:"icon",pos:[110,0,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("plu_L4_09_32"),w:picEmpty.w,h:picEmpty.h},
				{id:"info",css:cssLib.textFineMid.createCSS([200,0,0],textLib["Wait"],230,h,0,1,0,1)}
			]});
		}
		this.closeItem.setEnabled(0);
		this.btnClose.setDisplay(0);
		appEnv.hudIn(this.pmtFrame,10);
		//{"dels": [{"codename": "plu_L1_02", "num": 1}, {"codename": "plu_L1_02", "num": 1}], "news": [{"codename": "plu_L2_01", "num": 1}], "status": 1}
		this.timer=appEnv.layer.setTimeout(3000,this.checkResult,this);
	};

	__Page.pmtJoint.leave=function(nextState)
	{
		this.pmtFrame.getItemById("dlgCloseKey").setKey(0);
		this.btnClose.setKey(0);
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,20,function(){
			this.pmtFrame.getFather().removeChild(this.pmtFrame);
		},this);
		if(this.timer)
		{
			appEnv.layer.clearTimeou(this.timer);
			this.timer=null;
		}
	};

	__Page.pmtJoint.checkResult=function()
	{
		this.timer=null;
		var appEnv=this.appEnv;
		if(this.svrVO)
		{
			this.hold=0;
			var vo=this.svrVO;
			this.btnOK.setDisplay(1);
			if(vo.news && vo.news.length)
			{
				this.jointDone(vo);
			}
			else
				this.jointFailed();
		}
		else
		{
			this.timer=appEnv.layer.setTimeout(500,this.checkResult,this);
		}
	};
	//--------------------------------------------------------------------------
	//结果处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtJoint.jointDone=function(vo)
		{
			//TODO: Call bld's command:
			this.page.audioObject.playSound("com_success");
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			this.pmtTitle.fadeIn(5,0);
			this.topTxt.fadeIn(5,0);
			this.pmtTitle._setText(textLib["JointSuccessTitle"]);
			this.topTxt._setText(textLib["JointSuccessDesc"]);
			this.btnClose.setDisplay(1);
			this.closeItem.setEnabled(1);
			this.aisBld.cbk_JointDone({
				base1:{type:this.pmtVO.addon1.codeName},
				base2:{type:this.pmtVO.addon2.codeName},
				fuseOil:this.pmtVO.addon3?{type:this.pmtVO.addon3.codeName}:"",
				newAddOn:{type:vo.news[0].codename}
			});
			var def=window.aisEnv.defLib.addon[vo.news[0].codename];
//			this.aniBg.setDisplay(0);
//			this.itemObj.setDisplay(1);
//			this.itemObj.setTexURL(this.page.imgLib.genIconPath(vo.news[0].codename+"_32"));
//			this.itemName.setText(def.name);
			this.aniBox.setDisplay(0);
			this.okBox.setDisplay(1);
			this.okBox.getItemById("item").setTexURL(this.page.imgLib.genIconPath(vo.news[0].codename+"_32"));
			this.okBox.getItemById("info")._setText(def.name+"\n"+def.desc);
		}
		
		__Page.pmtJoint.jointFailed=function()
		{
			//TODO: Call bld's command:
			this.page.audioObject.playSound("com_fail");
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			this.pmtTitle.fadeIn(5,0);
			this.topTxt.fadeIn(5,0);
			this.pmtTitle._setText(textLib["JointLostTitle"]);
		//	this.topTxt._setText(textLib["JointLostDesc"]);
			this.btnClose.setDisplay(1);
			this.closeItem.setEnabled(1);
			this.aisBld.cbk_JointFailed({
				base1:"",//{type:this.pmtVO.addon1.codeName}
				base2:{type:this.pmtVO.addon2.codeName},
				fuseOil:this.pmtVO.addon3?{type:this.pmtVO.addon3.codeName}:""
			});
//			this.aniBg.setDisplay(0);
//			this.itemObj.setDisplay(1);
//			this.itemObj.setTexURL(this.page.imgLib.genIconPath(this.pmtVO.addon1.codeName+"_32"));
//			this.itemName.setText(this.pmtVO.addon1.name);
			this.aniBox.setDisplay(0);
			this.topTxt.setDisplay(0);
			this.midTxt._setText(textLib["JointLostDesc"]);
		}
	}
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtJoint.onCloseClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.closePmtDlg();
				if(this.pmtVO && this.pmtVO.pmtObj && this.pmtVO.pmtFunc)
				{
					this.pmtVO.pmtFunc.call(this.pmtVO.pmtObj,0);
				}
			}
		};
	}
	
}
