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
			this.hold=1;
			this.aisBld=vo.bld;
			this.infoText.setAlignH(1);
			this.pmtTitle._setText(textLib["JointTitle"]);
			this.infoText._setText(textLib["JointDesc"]);
			var pic=imgLib.getImg("pic_joint_empty");
			var x=this.contentW/2, y=this.contentH/2, w=pic.w, h=pic.h;
			this.aniBg=this.cntBox.appendNewChild({type:"icon",pos:[x,y,0],anchor_h:1,anchor_v:1,css:pic});
			this.aniObj=this.aniBg.appendNewChild({type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_joint_rotate")});
			this.appEnv.addRotate_z(this.aniObj);
			this.itemObj=this.cntBox.appendNewChild({type:"icon",pos:[x,y,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("plu_L4_09_32"),w:w,h:h,display:0});
			this.itemName=this.itemObj.appendNewChild({type:"text",pos:[0,h/2+20,0],text:"",anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:FS.FM,color_r:10,color_g:10,color_b:10,color_a:200});
		}
		this.closeItem.setEnabled(0);
		this.btnClose.setDisplay(0);
		appEnv.hudIn(this.pmtFrame,10);
		appEnv.layer.setTimeout(3000,this.checkResult,this);
	};

	__Page.pmtJoint.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,20);
	};

	__Page.pmtJoint.checkResult=function()
	{
		var appEnv=this.appEnv;
		if(this.svrVO)
		{
			this.hold=0;
			var vo=this.svrVO;
			if(vo.news && vo.news.length)
			{
				this.jointDone(vo);
			}
			else
				this.jointFailed();
		}
		else
		{
			appEnv.layer.setTimeout(500,this.checkResult,this);
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
			this.infoText.fadeIn(5,0);
			this.pmtTitle._setText(textLib["JointSuccessTitle"]);
			this.infoText._setText(textLib["JointSuccessDesc"]);
			this.btnClose.setDisplay(1);
			this.closeItem.setEnabled(1);
			this.aisBld.cbk_JointDone({
				base1:{type:this.pmtVO.addon1.codeName},
				base2:{type:this.pmtVO.addon2.codeName},
				fuseOil:this.pmtVO.addon3?{type:this.pmtVO.addon3.codeName}:"",
				newAddOn:{type:vo.news[0].codename}
			});
			this.aniBg.setDisplay(0);
			this.itemObj.setDisplay(1);
			this.itemObj.setTexURL(this.page.imgLib.genIconPath(vo.news[0].codename+"_32"));
			var def=window.aisEnv.defLib.addon[vo.news[0].codename];
			this.itemName.setText(def.name);
		}
		
		__Page.pmtJoint.jointFailed=function()
		{
			//TODO: Call bld's command:
			this.page.audioObject.playSound("com_fail");
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			this.pmtTitle.fadeIn(5,0);
			this.infoText.fadeIn(5,0);
			this.pmtTitle._setText(textLib["JointLostTitle"]);
			this.infoText._setText(textLib["JointLostDesc"]);
			this.btnClose.setDisplay(1);
			this.closeItem.setEnabled(1);
			this.aisBld.cbk_JointFailed({
				base1:"",//{type:this.pmtVO.addon1.codeName}
				base2:{type:this.pmtVO.addon2.codeName},
				fuseOil:this.pmtVO.addon3?{type:this.pmtVO.addon3.codeName}:""
			});
			this.aniBg.setDisplay(0);
			this.itemObj.setDisplay(1);
			this.itemObj.setTexURL(this.page.imgLib.genIconPath(this.pmtVO.addon1.codeName+"_32"));
			this.itemName.setText(this.pmtVO.addon1.name);
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
