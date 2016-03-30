{
	//过滤的字符
	__Page.appEnv.textFilter = {
		//检查违法字符
		check:function(text){
			if(!text)
			{
				return 0;
			}
			var list = this.textLib;
			var sign = [" ",",",".",":","\'","\"","，","。","：","‘","’","“","”","、"];
			var i, j, txt = [], have;
			for(i = 0; i < text.length; i++)
			{
				have = 0;
				for(j = 0; j < sign.length; j++)
				{
					if(text[i] == sign[j])
					{
						have = 1;
						break;
					}
				}
				if(!have)
				{
					txt.push(text[i]);
				}
			}
			txt = txt.join("");
			for(var i = 0; i < list.length; i++)
			{
				if(txt.indexOf(list[i]) > -1)
				{
					return 1;
				}
			}
			return 0;
		},
		
		//检查用户名
		checkUserName:function(text)
		{
			var len = text.length;
			//var pattern = "[a-zA-z0-9\u4E00-\u9FA5]*";
			if(/^[a-zA-z0-9\u4E00-\u9FA5]*$/.test(text))
			{
				return 1;
			}
			return 0;
		},
		
		//检查手机号
		checkPhoneNumber:function(text)
		{	
			if(!text)
			{
				return 0;
			}
			if(text.length < 11 || text.length > 11)
			{
				DBOut("手机号码位数不对");
				return 0;
			}
			var len = text.length;
			for(var i = 0; i < len; i++)
			{
				if(text[i] >= "0" && text[i] <= "9")
				{
					continue;
				}
				DBOut("手机号码不是数字: ", i);
				return 0;
			}
			return 1;
		},
		
		//判断有没有汉字
		checkChinese:function(text)
		{
			if(!text)
			{
				return 0;
			}
			var len = text.length;

			if((/[\u4e00-\u9fa5]+/).test(text))
			{
				return 0;
			}
			return 1;
		},
		
		textLib:[
			<include check=0>"text/text_filter_"+(window.LanguageStr?window.LanguageStr:"cn")+".js"</include>
		],
	};	
	
	//检查用户名ing是否正确
	__Page.appEnv.isCheckUserId = function(txt, isNotShow)
	{
		if(!txt || !txt.length)
		{
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtAccountErrorTip);
			return 0;
		}

		if(txt.length < 4 || txt.length > 20)
		{
			DBOut("=====位数不够或是超过了====");
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtAccountErrorTip1);
			return 0;
		}
		if(!this.textFilter.checkChinese(txt))
		{
			DBOut("=====为汉字======");
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtAccountErrorTip4);
			return 0;
		}

		if(!this.textFilter.checkUserName(txt))
		{
			DBOut("=====有特殊字符======");
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtStringErrorTip2);
			return 0;
		}
		return 1;
	};
	
	//检查密码是否正确 
	__Page.appEnv.isCheckPassword = function(txt, isNotShow)
	{
		if(!txt || !txt.length)
		{
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtPwdNullTip);
			return 0;
		}

		if(txt.length < 6 || txt.length > 20)
		{
			DBOut("=====位数不够或是超过了====");
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtPasswordErrorTip2);
			return 0;
		}
		
		if(!this.textFilter.checkChinese(txt))
		{
			DBOut("=====为汉字======");
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtPasswordIllegeTip);
			return 0;
		}

		if(!this.textFilter.checkUserName(txt))
		{
			DBOut("=====有特殊字符======");
			if(isNotShow)
			{
				return 0;
			}
			Dialogs.alert(this.textLib.txtStringErrorTip2);
			return 0;
		}
		return 1;
	};
	
	//手机号中间4位变成*
	__Page.appEnv.changePhoneNumnberToStar = function(txt)
	{
		if(!txt)
		{
			return"";
		}
		var test = "" + txt;
		var txt1 = test.substring(0, 3);
		var txt2 = test.substring(7, 11);
		var showPhoneNumber = txt1 + "****" + txt2;
		return showPhoneNumber;
	};
	
	//判断2次输入的文本是否一致
	__Page.appEnv.isCheckAccording = function(txt1, txt2)
	{
		if(!txt1 || !txt2)
		{
			return 0;
		}
		if(txt1.length != txt2.length)
		{
			return 0;
		}
		var len = txt1.length;
		for(var i = 0; i < len; i++)
		{
			if(txt1[i] != txt2[i])
			{
				return 0;
			}
		}
		return 1;
	};
	
	//检验验证码是否正确 
	__Page.appEnv.isCheckCode = function(code1, code2)
	{
		if(!code1 || !code2)
		{
			return 0;
		}
		if(code1.length != code2.length)
		{
			return 0;
		}
		var len = code1.length;
		for(var i = 0; i < len; i++)
		{
			if(code1[i] != code2[i])
			{
				return 0;
			}
		}
		return 1;
	};
	
	//警示输入错误
	__Page.appEnv.warningInputError = function(txt, isUserId)
	{
		if(isUserId)
		{
			if(!this.isCheckUserId(txt))
			{
				return 0;
			}
			return 1;
		}
		
		if(!this.isCheckPassword(txt))
		{
			return 0;
		}
		return 1;
	};
	
	//获取文本内容的宽高
	__Page.appEnv.getTextSize = function(text, font, wrap, sw)
	{
		var sh = 60;
		var hud = this.pmtLayer.addHudItem({
			"type":"icon", "id":"", "pos":[0,0,0], "auto_size":0,"w":sw, "h":sh, display:0,
			obj:{
				"type":"text", "text":text, "font_size":font, "wrap":wrap, 
			}
		});
		var item = hud.getGraphicObj();
		var size = {w:item.getTextW(), h:item.getTextH()};
		this.pmtLayer.removeHudItem(hud);
		return size;
	};
	
	//判断卖家等级
	__Page.appEnv.computerSellerLevel = function(count)
	{
		/*if(0 == count)//0星
		{
			return 0;
		}*/
		if(count >= 0 && count <= 9)//1星
		{
			return 1;
		}
		if(count >= 10 && count <= 29)//2星
		{
			return 2;
		}
		if(count >= 30 && count <= 99)//3星
		{
			return 3;
		}
		if(count >= 100 && count <= 299)//4星
		{
			return 4;
		}
		if(count >= 300 && count <= 499)//5星
		{
			return 5;
		}

		//钻
		if(count >= 500 && count <= 999)//1钻
		{
			return 6;
		}
		if(count >= 1000 && count <= 1999)//2钻
		{
			return 7;
		}
		if(count >= 2000 && count <= 4999)//3钻
		{
			return 8;
		}
		if(count >= 5000 && count <= 9999)//4钻
		{
			return 9;
		}
		if(count >= 10000 && count <= 19999)//5钻
		{
			return 10;
		}
		
		//皇冠
		if(count >= 20000 && count <= 49999)//1皇冠
		{
			return 11;
		}
		if(count >= 50000 && count <= 99999)//2皇冠
		{
			return 12;
		}
		if(count >= 100000 && count <= 199999)//3皇冠
		{
			return 13;
		}
		if(count >= 200000 && count <= 499999)//4皇冠
		{
			return 14;
		}
		if(count >= 500000)//5皇冠
		{
			return 15;
		}
	};
	
	//获取卖家信誉度图标
	__Page.appEnv.getSellerCreditIcon = function(type)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		
		if(type < 6)
		{
			return "star";
		}
		if(type >= 6 && type < 11)
		{
			return "gem";
		}
		
		if(type >= 11)
		{
			return "kinghat";
		}
	};
}