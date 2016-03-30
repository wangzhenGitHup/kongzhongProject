
if(!__Page.cmccEnv)
{


// var p = __Page;
	__Page.cmccEnv = {
		page:__Page,
		keys:{},
	};
	__Page.cmccEnv.init = function()
	{
		DBOut("cmccInit")
		// this.soundOption();
		//this.page.onExit();
		window.screenType=Screen.w>=(480*2)?"hd":"normal";
		window.ScreenW = Screen.w;
		window.ScreenH = Screen.h;
		this.bgLayer = this.page.getElementById("bg-layer");
		this.uiLayer = this.page.getElementById("ui-layer");
		if(this.page.soundOption)
		{
			this.page.soundOption.enter(this);
		}
	};
	__Page.cmccEnv.onKey = function(msg,key,way,extra)
	{
		if(way==1)
		{
			var keyInfo,params;
			if(msg==1)
			{
				keyInfo = this.keys[key];
				if(keyInfo&&keyInfo.act)
				{
					// DBOut("-------***:playSound");
					//���а�ť����Ч
					//this.page.audioObject.playSound("btn_click");
					
					params = [key];
					if(keyInfo.params)
						params.push.apply(params,keyInfo.params);
					keyInfo.act.apply(keyInfo.actobj?keyInfo.actobj:this,params);
					return 1;
				}
			}
			else if(msg==2)
			{
				keyInfo = this.listkeys[key];
				if(keyInfo&&keyInfo.act)
				{
					params = [extra];
					if(keyInfo.params)
						params.push.apply(params,keyInfo.params);
					keyInfo.act.apply(keyInfo.actobj?keyInfo.actobj:this,params);
					return 1;
				}
			}
		}
		return 0;//Key not handled.
	};
	
	__Page.loadOptions = function() {
		var option = this.getCookie(cookieDomain,"option");
		DBOut("565656 new:" + option);
		if (option != null) {
			option=fromJSON(option);
			DBOut("opt new:" + option);
		} else {
			option = {
				music:1,
				sound:1,
				volume:[128,128],
				audio:1
				//nickname:__Page.language.player_default_name.replace(/\$random_number\$/g, Math.floor(Math.random()*20)),
				//isDefaultName:1,
				//isChanged:1
			};
			this.setCookie(cookieDomain,"option",toJSON(option),3600*24*30*12);
			DBOut("787878 new:" + toJSON(option));
		}
		DBOut("this.optionsVO:old:"+toJSON(this.optionsVO));
		this.optionsVO = option;
		audio.setGroupEnable(0, this.optionsVO.audio?1:0);
		DBOut("this.optionsVO:"+toJSON(this.optionsVO));
	};
	__Page.saveOptions = function() {
		this.setCookie(cookieDomain,"option",toJSON(this.optionsVO),3600*24*30*12);
	};
	
	__Page.loadOptions();
	__Page.cmccEnv.soundOption = function(status)
	{
		DBOut("option sounds")
		// var option = this.page.getCookie("XOL","option");
		var option = this.page.getCookie(cookieDomain,"option");
		DBOut("optionsVO2:" + option);
		// if(option)
		// {
			// option = fromJSON(option);
		// }else
		// {
			// option = {sound:1,music:1,volume:[128,128]};
		// }
		
		if(option)
		{
			option = fromJSON(option);
		}else
		{
			option = {
				music:1,
				sound:1,
				volume:[128,128],
				audio:1
				//nickname:__Page.language.player_default_name.replace(/\$random_number\$/g, Math.floor(Math.random()*20)),
				//isDefaultName:1,
				//isChanged:1
			};
		}
		if(status=="on")
		{
		/*
			if(option.volume[0]==0)
				option.volume[0]=128;
			if(option.volume[1]==0)
				option.volume[1]=128;
				*/
				this.page.optionsVO.music = 1;
				this.page.optionsVO.sound = 1;
				this.page.optionsVO.audio = 1;
				DBOut("on new:" + status);
				// this.page.saveOptions();
							// this.page.music.play();
							// this.page.shake.setEnable(1);
							// this.music_on.setDisplay(1);
							// this.music_off.setDisplay(0);
		}else
		{
			//option.volume = [0,0];
			
			this.page.optionsVO.music = 0;
			this.page.optionsVO.sound = 0;
			this.page.optionsVO.audio = 0;
			
			
							// __Page.uiOptionsState.sound_on.setDisplay(0);
							// __Page.uiOptionsState.sound_off.setDisplay(1);
							// audio.setGroupEnable(0, 0);
			// this.page.saveOptions();
			DBOut("off new:" + status);
							// this.page.music.stop();
							// this.page.shake.setEnable(0);
							// this.music_on.setDisplay(0);
							// this.music_off.setDisplay(1);
			
		}
		
		//this.page.setCookie("XOL","option",toJSON(option),1000000,1);
		this.page.setCookie(cookieDomain,"option",toJSON(this.page.optionsVO),1000000,1);
		DBOut("getCookie:" + this.page.getCookie(cookieDomain,"option"));
		// if(status=="on")
		// {
			
		// }
	};
}
