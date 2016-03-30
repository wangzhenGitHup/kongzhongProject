{//搜索军团
	this.Search_loadUI=function(state,param)
	{
		if(!this.state_Search)
			this.state_Search={name:"Search"};
		if(!state)
			state=this.state_Search;
		if(state.loaded)return;
		state.loaded=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var dt=150;
		var txtSearchX=240;
		var txtSearchY=50;
		state.txtSearchCSS=cssLib.textFineMid.createCSS([txtSearchX,txtSearchY,0],textLib["ClanSearch"],100,24,2,1,2,1);
		var pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w*2/3;
		var btnH=pic.h*2/3;
		var btnX=this.contentW-dt-btnW/2;
		var btnY=txtSearchY;
		state.btnCSS=cssLib.normalBtn.createCSS([btnX,btnY,0],0,0,textLib["Search"],btnW,btnH);
		var inputW=this.contentW-txtSearchX-dt-btnW-20;
		var inputH=btnH;
		var inputX=txtSearchX+10;
		var inputY=btnY;
		state.inputCSS={type:"div3x3",id:"inputBox",pos:[inputX,inputY,0],w:inputW,h:inputH,css:imgLib.getImg("box_chat_input"),anchor_h:0,anchor_v:1,ui_event:1,
			items:[
				{id:"btn",type:"key",pos:[0,0,0],w:inputW,h:inputH,anchor_h:0,anchor_v:1,key:0,button:1,ui_event:1,state_up:{w:inputW,h:inputH},audio:this.page.audioObject.genFileURL("btn_click"),},
				{id:"txt",type:"text",pos:[12,0,0],w:inputW,h:inputH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,text:"",wrap:1,color_r:60,color_g:60,color_b:60,color_a:160,font_size:FS.S}
			]
		};
		var tipX=inputX;
		var tipY=inputY+inputH/2+20;
		var tipW=500;
		var tipH=20;
		state.tipCSS={type:"text",pos:[tipX,tipY,0],w:tipW,h:tipH,text:textLib["SearchTip"],anchor_h:0,anchor_v:1,align_h:0,align_v:1,color_r:60,color_g:60,color_b:60,color_a:160,font_size:FS.S};

		var listX=this.contentInner[0];
		var listY=tipY+tipH;
		var listW=this.contentW-this.contentInner[0]*2;
		var listH=this.contentH-listY-this.contentInner[1];
		state.lbxClanCSS=cloneToObj(this.lbxClanCSS);
		state.lbxClanCSS.pos=[listX,listY,0];
		state.lbxClanCSS.w=listW;
		state.lbxClanCSS.h=listH;
	};
	this.Search_loadUI();

	this.Search_initUI=function(state,param)
	{
		if(!state)
			state=this.state_Search;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cntBox=state.cntBox=this.cntBox.appendNewChild({id:"clanSearch",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		var clanBox=state.clanBox=cntBox.appendNewChild({id:"box-clan",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		var memberBox=state.memberBox=cntBox.appendNewChild({id:"box-member",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});

		state.searchTxt=clanBox.appendNewChild(state.txtSearchCSS);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSearchClk);
		state.btn=clanBox.appendNewChild({css:state.btnCSS,key:keyid});
		var box=state.inputBox=clanBox.appendNewChild(state.inputCSS);
		state.inputBtn=box.getItemById("btn");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Search_onInputClk);
		state.inputBtn.setKey(keyid);
		state.inputTxt=box.getItemById("txt");
		DBOut(state.inputTxt);
		state.tipTxt=clanBox.appendNewChild(state.tipCSS);
		state.errorTxt=clanBox.appendNewChild({css:state.tipCSS,color_r:200,color_g:50,color_b:50,display:0});

		this.addClanBox(state,clanBox);
		this.addMemberBox(state,memberBox);
	};

	this.Search_enter=function(state,param)
	{
		if(!state)
		{
			state=this.state_Search;
			this.curState=state;
		}
		state.cntBox.fadeIn(5,0);

		state.clanBox.setDisplay(1);
		state.memberBox.setDisplay(0);
	};

	this.Search_leave=function(isHide)
	{
		var state=this.state_Search;
		this.appEnv.hudOut(state.cntBox,5,function(){
			if(!isHide)
			{
				state.lbxClan.clearItems();
				state.lbxMember.clearItems();
			}
		},this);
		if(state.status=="Edit")
			this["Create_leave"]();
	};

	this.Search_showResult=function()
	{

	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		this.Search_onInputClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Search;
				DBOut("Search_onInputClk");
				var textLib=this.appEnv.textLib;
				var txtTip=textLib["InputSearchName"], txtDefault="";
				if(-1==extra)
					txtTip=textLib["IllegalInput"];
				if(state.searchName)
					txtDefault=state.searchName;
				var txt=Dialogs.getText(txtTip,txtDefault);
				if(txt)
				{
					//检测输入是否含有非法字符
					if(this.appEnv.isNameValid4CJK(txt))
					{
						this.appEnv.layer.setFrameout(10,function(){this.Search_onInputClk(1,0,1,-1);},this);
						return;
					}

					state.inputTxt.setText(txt);
					state.inputTxt.setColor(0,0,0,200);
					state.searchName=txt;
				}
			}
		};

		this.onSearchClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Search;
				state.tipTxt.setDisplay(1);
				state.errorTxt.setDisplay(0);
				DBOut("onSearchClk");
				if(!state.searchName)
					return;
				if(this.dwrObj)
					return;
				this.txtLoading.setText(this.appEnv.textLib["IsLoading"]);
				this.txtLoading.setDisplay(1);
				this.dwrObj=this.appEnv.newMsg(["ClanDwr","searchByName",state.searchName],{cb:function(vo){
					//DBOut("searchByName: "+toJSON(vo));
					this.txtLoading.setDisplay(0);
					this.dwrObj=null;
					if(vo && vo.length)
					{
						state.lbxClan.clearItems();
						this.addClans(state,state.lbxClan,vo,2);
					}
					else
					{
						state.tipTxt.setDisplay(0);
						state.errorTxt.setDisplay(1);
						state.errorTxt.setText(this.appEnv.textLib["SearchError"](state.searchName));
						state.lbxClan.clearItems();
					}
				},cbobj:this,eh:function(){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);},ehobj:this},window.ClanDWRUrl);
			}
		};

		this.Search_onBackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("Search_onBackClk");
				var state=this.state_Search;
				this.btnBack.setDisplay(0);
				state.clanBox.setDisplay(1);
				state.memberBox.setDisplay(0);
				state.lbxMember.clearItems();
			}
		};
	}
}