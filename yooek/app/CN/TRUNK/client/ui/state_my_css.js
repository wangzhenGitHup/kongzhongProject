this.initTopBarCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	
	return {
		"type":"item", "id":"myItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("myTopBar", sw, sh, textLib.txtSoftName, this, this.onBackClk, 0)},
		],//End of: items*/
	};
};

this.initScrollBoxCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	return{
		css:cssLib["scrollBox"]([0, topH, 0], sw, sh)
	};
};

//登录后的界面
this.initLoginUserEditorCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;

	var bgImg = cssLib.genIconPath("userbg");
	var userFlagImg = "owner_icon"; //vo.headurl ? vo.headurl : "userflag";
	var userFlagImgW = 120;// + (appEnv.scaleFactorY - 1) * 40;
	var userFlagImgH = 120;// + (appEnv.scaleFactorY - 1) * 40;
	var userFlagX = 30;
	var params = {ah:0, av:1, scale:0.98};
	
	var userName = vo.nickname ? vo.nickname : textLib.txtEditorNickNameTip;
	var userNameSize = appEnv.getTextSize(userName, 30, 0, sw);
	
	var userNameX = userFlagX + userFlagImgW + 20;
	var itemParameter = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[1, 1, 1, 1], align_h:0, align_v:1, anchor_h:0,
		anchor_v:1, wrap:0};
	
	var userEditorImg = "usereditor";
	var userEditorImgW = 40 + (appEnv.scaleFactorY - 1) * 40;
	var userEditorImgH = 40 + (appEnv.scaleFactorY - 1) * 40;
	var userEditorX = userNameX + userNameSize.w + 20;
	
	var userLevelImg = "star_yellow";
	var userLevelImgW = 30 + (appEnv.scaleFactorY - 1) * 30;
	var userLevelImgH = 30 + (appEnv.scaleFactorY - 1) * 30;
	var starImgW = userLevelImgW * vo.buyerlevel + (vo.buyerlevel - 1) * 2;
	var starImgX = 0;
	var starItemX = 0;
	var starCSS = [];
	for(var i = 0; i < vo.buyerlevel; i++)
	{
		starCSS[i] = {css:cssLib["simpleIcon"]([starImgX, 0, 0], "star", userLevelImg, userLevelImgW, userLevelImgH, 0, 1)};
		starImgX += userLevelImgW + 2;
	}
	
	if(starImgW > userNameSize.w)
	{
		starItemX = userNameX;
	}
	else
	{
		starItemX = userNameX + (userNameSize.w - starImgW) / 2;
	}
	
	return{
		"type":"icon","id":"userEditorBg","pos":[0, (sh >> 1), 0],"w":sw,"h":sh,"ui_event":1,"anchor_h":0,"anchor_v":1,
		obj:{"type":"image", "tex":bgImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
		items:[
			{css:cssLib["key_icon"]([userFlagX, 0, 0], "userIcon", userFlagImg, userFlagImg, userFlagImgW, userFlagImgH,
				params, this, this.onSetUserIcon)},
				
			{css:cssLib["stdText"]([userNameX, -15, 0], "userName", [userNameSize.w, userNameSize.h], userName, itemParameter)},
			
			{css:cssLib["key_icon"]([userEditorX, -15, 0], "userEditor", userEditorImg, userEditorImg, userEditorImgW,
				userEditorImgH, params, this, this.onSetUserName)},
			
			{
				"type":"icon", "id":"starBg", "pos":[starItemX, 20 + (appEnv.scaleFactorY - 1) * 20, 0], "w":starImgW, "h":userLevelImgH, "anchor_h":0, 
				"anchor_v":1,
				items:starCSS,
				_setPos:function(x)
				{
					if(starImgW > x)
					{
						x = userNameX;
					}
					else
					{
						x = userNameX + (x - starImgW) / 2;
					}
					this.setPos([x, 20, 0]);
				},
			},
		],
	};
};

//未登录时的界面
this.noLoginUserEditorCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var bgImg = cssLib.genIconPath("userbg");
	var userFlagImg = "userflag";
	var userFlagImgW = 100 + (appEnv.scaleFactorY - 1) * 40;
	var userFlagImgH = 100 + (appEnv.scaleFactorY - 1) * 40;
	var userFlagX = 30;
	var params = {ah:0, av:1, scale:0.98};
	
	var userName = textLib.txtNoLoginTip;
	var userNameSize = appEnv.getTextSize(userName, 30, 0, sw);
	
	var userNameX = userFlagX + userFlagImgW + 20;
	var itemParameter = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[1, 1, 1, 1], align_h:0, align_v:1, anchor_h:0,
		anchor_v:1, wrap:0};

	var btnIcon = "btn8";
	var btnIconW = 139 + (appEnv.scaleFactorY - 1) * 30;
	var btnIconH = 37 + (appEnv.scaleFactorY - 1) * 30;
	var params = {tColor:[0, 0.71, 1, 1], tSize:26, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1,
		anchor_h:0, anchor_v:1, wrap:0, scale:0.98};
	
	return{
		"type":"icon","id":"userEditorBg","pos":[0, (sh >> 1), 0],"w":sw,"h":sh,"ui_event":1,"anchor_h":0,"anchor_v":1,
		obj:{"type":"image", "tex":bgImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
		items:[
			{css:cssLib["simpleIcon"]([30, 0, 0], "", userFlagImg, userFlagImgW, userFlagImgH, 0, 1)},
			
			{css:cssLib["stdText"]([userNameX, -15, 0], "userName", [userNameSize.w, userNameSize.h], userName, itemParameter)},
			
			{css:cssLib["key_icon_txt"]([userNameX, btnIconH, 0], "exitAccount", btnIcon, btnIcon, textLib.txtLoginTip,
				btnIconW, btnIconH, params, this, this.onLoginClk)},
		],
	};
};

//账户余额
this.initUserBalanceCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var cssTxt;
	//var topH = 220;
	var money = "" + vo.sumcoin;
	var m1, m2;
	var mark = "￥"; 
	var itemParameter1 = {align_h:0, align_v:1, anchor_h:0, anchor_v:0, wrap:0};
	var index = money.indexOf(".");

	if(index != -1)
	{
		m1 = money.substring(0, index);
		m2 = money.substring(index, money.length);
		cssTxt = {css:cssLib["multi_text_three"]([30, -18 - (appEnv.scaleFactorY - 1) * 5, 0], sw, sh, mark, m1, m2, {r:1, g:0.54, b:0, a:1}, {r:1, g:0.54, b:0, a:1}, {r:1, g:0.54, b:0, a:1}, 26, 40, 30, itemParameter1)};
	}
	else
	{
		m1 = money;
		cssTxt = {css:cssLib["multi_text"]([30, -18 - (appEnv.scaleFactorY - 1) * 5, 0], sw, sh, mark, m1, {r:1, g:0.54, b:0, a:1}, {r:1, g:0.54, b:0, a:1}, 26, 40, itemParameter1)};
	}

	var balanceTipSize = appEnv.getTextSize(textLib.txtBalance, 30, 0, sw);
	var itemParameter2 = {tColor:[0, 0, 0, 0.2], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
		anchor_h:0, anchor_v:0, wrap:0};
	
	return {
		"type":"icon", "id":"balanceItem", "pos":[0, 0, 0], "w":sw, "h":sh, "ui_event":1, "anchor_h":0, "anchor_v":0,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			cssTxt,
			{css:cssLib["stdText"]([30, 40 + (appEnv.scaleFactorY - 1) * 15, 0], "tip", [balanceTipSize.w, balanceTipSize.h], textLib.txtBalance, itemParameter2)},
		],//End of: items*/
	};
};

this.initUserDataCSS = function(sw, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	//var topH = 0;
	var frameH = 60 + (appEnv.scaleFactorY - 1) * 30;
	var sh = 0;
	var phoneNumber = "" + vo.phone;
	var imgs = ["my_account", "my_order", "my_game", "pay_pwd", "login_pwd", "bind_phone"];
	var txts = [textLib.txtMyAccount, textLib.txtMyOrder, textLib.txtMyGame, textLib.txtPayPassword, textLib.txtLoginPassword,
		textLib.txtAlreadBindPhone];
		
	var size = [[120, 30], [120, 30], [120, 30], [120, 30], [120, 30], [150, 30]];
	var ids = ["myAccount", "myOrder", "myGame", "payPwd", "loginPwd", "bindPhone"];
	var status = [vo.paypwdstatus?textLib.txtAlert:textLib.txtUnSet, textLib.txtAlert, textLib.txtChange];
	var cbArr = [this.onEnterMyAccount, this.onMyOrderClk, this.onEnterMyGame, this.onSetPayPasswordClk,
		this.onAlertLoginPasswordClk, this.onOldBindPhoneClk];
		
	var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
		anchor_v:1, wrap:0};
		
	var enterFlagImg = "enter";
	var enterFlagImgW = 31 + (appEnv.scaleFactorY - 1) * 20;
	var enterFlagImgH = 41 + (appEnv.scaleFactorY - 1 )* 20;
	var flagImgW = 50 + (appEnv.scaleFactorY - 1) * 20;
	var params = {ah:1, av:1, scale:0.98};
	var css = [];
	var length = 0;
	var y = (frameH >> 1) + 1;
	var posY = 0;
	if(appEnv.isLogin)
	{
		//topH = 320;
		sh = frameH * 6 + 5;
		length = 6;
		posY = 7.1 * appEnv.scaleFactorY;
	}
	else
	{
		//topH = 220;
		sh = frameH * 3 + 2;
		length = 3;
	}
	
	for(var i = 0; i < length; i++)
	{
		if(i > 2)
		{
			css[i] = {css:cssLib["my_custom_bar_key1"]([0, y, 0], ids[i], sw, frameH, [imgs[i], enterFlagImg],
				[flagImgW, enterFlagImgW], [flagImgW, enterFlagImgH], [txts[i], (i == 5) ? appEnv.changePhoneNumnberToStar(phoneNumber):null,
				status[i - 3]], this, cbArr[i])};
		}
		else
		{
			css[i] = {css:cssLib["my_custom_bar_key1"]([0, y, 0], ids[i], sw, frameH, [imgs[i], enterFlagImg],
				[flagImgW, enterFlagImgW], [flagImgW, enterFlagImgH], [txts[i], (i == 5) ? appEnv.changePhoneNumnberToStar(phoneNumber):null,
				status[i - 3]], this, cbArr[i])};
		}
		y += frameH + 2;
	}
	
	return{
		"type":"item", "id":"userDataItem","pos":[0, posY, 0], "w":sw,"h":sh,"ui_event":1,
		//obj:{"type":"box", "color":[0, 1, 1, 1]},
		items:css,
	};
};

//================退出账号===========================================
this.loadExitAccount = function(sw)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var keyImg = "btn2";
	var keyImgW = sw - 60;
	var keyImgH = 60;
	var params = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1,
		anchor_v:1, wrap:0, scale:0.98};
	
	return{
		"type":"item", "id":"softInfoItem","pos":[sw >> 1, 80 + 20 * appEnv.scaleFactorY, 0], "w":sw,"h":60,"ui_event":1, "anchor_h":1, "anchor_v":1,
		items:[
			{css:cssLib["key_icon_txt"]([0, 0, 0], "exitAccount", keyImg, keyImg, textLib.txtExitAccount, keyImgW, keyImgH,
				params, this, this.onExitAccountClk)},
		],
	};
};

//===============================我的账户===========================================
this.loadMyAccountCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var boxH1 = 80;
	var boxH2 = 120;
	var canUseBalanceImg = "balance_flag";
	var canUseBalanceImgW = 50;
	var canUseBalanceImgH = 50;
	var canUseMoney = textLib.txtCanUseBalance + ":" + vo.validcoin;
	var canUseMoneySize = appEnv.getTextSize(canUseMoney, 30, 0, sw);
	
	var itemParameter = {tColor:[0, 0, 0, 0.3], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
		anchor_h:0, anchor_v:1, wrap:0};
	var lockBalanceImg = "lock_balance_flag";
	var lockmoneyTxt = textLib.txtLockBalance + ":" + (vo.sumcoin - vo.validcoin);
	var lockMoneySize = appEnv.getTextSize(lockmoneyTxt, 30, 0, sw);
	
	return{
		"type":"item", "id":"loadMyAccount","pos":[0, 0, 0], "w":sw,"h":sh, "ui_event":1, "anchor_h":0, "anchor_v":0,
		items:[
			{css:cssLib["modelTopBgFirst"]("loadMyAccountBar", sw, topH, textLib.txtMyAccount, this, this.onBackClk)},
			{
				"type":"icon", "id":"bg", "pos":[0, topH, 0], "w":sw, "h":boxH1, "ui_event":1,
				"anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([30, boxH1 >> 1, 0], "", canUseBalanceImg, canUseBalanceImgW, canUseBalanceImgH, 0, 1)},
					
					{css:cssLib["stdText"]([30 + canUseBalanceImgW, boxH1 >> 1, 0], "canUseBalanceTxt",
						[canUseMoneySize.w, canUseMoneySize.h], canUseMoney, itemParameter)},
				],
			},
			
			{
				"type":"icon", "id":"bg", "pos":[0, topH + boxH1 + 1, 0], "w":sw, "h":boxH2, "ui_event":1,
				"anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([30, (boxH2 >> 1) - 20, 0], "", lockBalanceImg, canUseBalanceImgW, canUseBalanceImgH, 0, 1)},
					
					{css:cssLib["stdText"]([30 + canUseBalanceImgW, (boxH2 >> 1) - 20, 0], "canUseBalanceTxt",
						[lockMoneySize.w, lockMoneySize.h], lockmoneyTxt, itemParameter)},
				],
			},
		],
	};
};

//======================设置支付密码======================================
this.setPayPasswordCSS = function(sw, sh, phoneNum)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
		anchor_h:0, anchor_v:1, wrap:0};
	var checkCodeImg = "check_code";
	var checkCodeImgW = 50;
	var checkCodeImgH = 50;
	var checkCodeImgX = 30;
	var inputBoxW = sw - checkCodeImgW - 230;
	var inputBoxH = 70;
	var btnCheckCodeImg = "btn_checkcode";
	var btnCheckCodeImgW = 147;
	var btnCheckCodeImgH = 60;
	var params = {tColor:[1, 1, 1, 1], tSize:26, edge:0, edgeColor:[1, 0.71, 0.03, 1], align_h:1, align_v:1,
		anchor_h:1, anchor_v:1, wrap:0};
		
	var params2 = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1,
		anchor_h:1, anchor_v:1, wrap:0};
		
	var payPwdImg = "input";
	var payPwdImgW = checkCodeImgW;
	var payPwdImgH = checkCodeImgH;
	var confirmPayPwdImg = "confirm_input";
	var confirmPayPwdImgW = payPwdImgW;
	var confirmPayPwdImgH = payPwdImgH;
	var btnSubmitImg = "btn";
	var btnSubmitImgW = sw - 70;
	var btnSubmitImgH = 60;
	var phoneNumSize = appEnv.getTextSize(textLib.txtPhoneNumTip + ":" + phoneNum, 30, 0, sw - 30);
	
	var tipH = 60;
	var inputBoxBgH = 100;
	
	return{
		"type":"item", "id":"setPayPassword","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		//obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["modelTopBgFirst"]("specialDesTop", sw, topH, textLib.txtPayPasswordSetTip, this, this.onBackClk, 0)},

			{
				"type":"icon", "id":"phoneNumTip","pos":[0, topH, 0], "w":sw, "h":tipH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([15, tipH >> 1, 0], "", [phoneNumSize.w, phoneNumSize.h],
						textLib.txtPhoneNumTip + ":" + phoneNum, itemParameter)},
				],
			},
			
			{
				"type":"icon", "id":"checkCode","pos":[0, topH + tipH + 1, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", checkCodeImg, checkCodeImgW, checkCodeImgH, 0, 1)},
					
					{css:cssLib["showTextEdit"]([30 + checkCodeImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "checkCode1", inputBoxW, inputBoxH,
						"", textLib.txtCheckCodeTip, 30, 2, this.inputBoxEvent, this, 0)},
					
					{css:cssLib["key_icon_txt"]([sw - (btnCheckCodeImgW >> 1) - 20, inputBoxBgH >> 1, 0], "getCheckCode",
						btnCheckCodeImg, btnCheckCodeImg, textLib.txtGetCheckCode, btnCheckCodeImgW, btnCheckCodeImgH, params,
						this, this.getCheckCode, 0)},
				],
			},
			
			{
				"type":"icon", "id":"payPwd","pos":[0, topH + tipH + inputBoxBgH + 2, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", payPwdImg, payPwdImgW, payPwdImgH, 0, 1)},
		
					{css:cssLib["showTextEdit"]([30 + payPwdImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "pwd1", sw - (40 + payPwdImgW), inputBoxH,
						"", textLib.txtInputBoxTip6, 30, 0, this.inputBoxEvent, this, 1, 0, false, 1, this.editWarning)},
				],
			},
			
			{
				"type":"icon", "id":"confirmPayPwd","pos":[0, topH + (inputBoxBgH << 1) + tipH + 3, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0,
				"anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", confirmPayPwdImg, confirmPayPwdImgW, confirmPayPwdImgH, 0, 1)},

					{css:cssLib["showTextEdit"]([30 + confirmPayPwdImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "pwd2", sw - (40 + confirmPayPwdImgW), inputBoxH,
						"", textLib.txtInputBoxTip7, 30, 1, this.inputBoxEvent, this, 1, 0, false, 1, this.editWarning)},
				],
			},
			
			{
				"type":"icon", "id":"submitBg","pos":[sw >> 1, topH + (inputBoxBgH << 1) + inputBoxBgH + tipH + 4, 0], "w":sw, "h":120, "anchor_h":1, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_icon_txt"]([0, 60, 0], "btnSubmit", btnSubmitImg, btnSubmitImg, textLib.txtSubmit,
						btnSubmitImgW, btnSubmitImgH, params2, this, this.onSubmitPwdClk, 0)},
				],
			},
		],
	};
};

//======================修改登录密码======================================
this.alertLoginPwdCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
		anchor_h:0, anchor_v:1, wrap:0};
		
	var itemParameter2 = {tColor:[0, 0.71, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0,
		align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var pwdImg = "password_flag";
	var pwdImgW = 50;
	var pwdImgH = 50;
	var pwdImgX = 30;
	var inputBoxW = sw - pwdImgW - 200;
	var inputBoxH = 70;
	var btnSubmitImg = "btn";
	var btnSubmitImgW = sw - 70;
	var btnSubmitImgH = 60;
	var params = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1,
		anchor_h:1, anchor_v:1, wrap:0};
	var inputBoxBgH = 100;
	
	return{
		"type":"item", "id":"alertLoginPwd","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("alertLoginPwdTop", sw, topH, textLib.txtAlertLoginPwd, this, this.onBackClk, 0)},
			
			{
				"type":"icon", "id":"oldPwdItem","pos":[0, topH, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", pwdImg, pwdImgW, pwdImgH, 0, 1)},
					
					{css:cssLib["stdText"]([30 + pwdImgW, inputBoxBgH >> 1, 0], "", [120, 26], textLib.txtOldPwdTip, itemParameter2)},

					{css:cssLib["showTextEdit"]([130 + pwdImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "oldPwdInput", sw - (140 + pwdImgW), inputBoxH,
						"", textLib.txtInputBoxTip1, 30, 3, this.inputBoxEvent, this, 1, 0, false, 1, this.editWarning)},
				],
			},
			
			{
				"type":"icon", "id":"newPwdItem","pos":[0, topH + inputBoxBgH + 1, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", pwdImg, pwdImgW, pwdImgH, 0, 1)},
					
					{css:cssLib["stdText"]([30 + pwdImgW, inputBoxBgH >> 1, 0], "", [120, 26], textLib.txtNewPwdTip, itemParameter2)},

					{css:cssLib["showTextEdit"]([130 + pwdImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "newPwdInput", sw - (140 + pwdImgW), inputBoxH,
						"", textLib.txtInputBoxTip1, 30, 4, this.inputBoxEvent, this, 1, 0, false, 1, this.editWarning)},
				],
			},
			
			{
				"type":"icon", "id":"confirmPwdItem","pos":[0, topH + (inputBoxBgH << 1) + 2, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", pwdImg, pwdImgW, pwdImgH, 0, 1)},
					
					{css:cssLib["stdText"]([30 + pwdImgW, inputBoxBgH >> 1, 0], "", [120, 26], textLib.txtConfirmPwdTip, itemParameter2)},

					{css:cssLib["showTextEdit"]([160 + pwdImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "confirmPwdInput", sw - (170 + pwdImgW), inputBoxH,
						"", textLib.txtInputBoxTip1, 30, 5, this.inputBoxEvent, this, 1, 0, false, 1, this.editWarning)},
				],
			},
			
			{
				"type":"icon", "id":"submitBg","pos":[sw >> 1, topH + (inputBoxBgH << 1) + inputBoxBgH + 3, 0], "w":sw, "h":120, "anchor_h":1, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_icon_txt"]([0, 60, 0], "btnSubmit", btnSubmitImg, btnSubmitImg,
						textLib.txtSubmit, btnSubmitImgW, btnSubmitImgH, params, this, this.onSubmitPwdClk, 1)},
				],
			},
		],
	};
};

//=========绑定旧手机=============================================================
this.oldBindPhoneCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0,
		align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var itemParameter2 = {tColor:[0, 0, 0, 0.3], tSize:20, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var checkCodeImg = "check_code";
	var checkCodeImgW = 55;
	var checkCodeImgH = 55;
	var checkCodeImgX = 10;
	var inputBoxW = sw - checkCodeImgW - 230;
	var inputBoxH = 70;
	var btnCheckCodeImg = "btn_checkcode";
	var btnCheckCodeImgW = 147;
	var btnCheckCodeImgH = 50;
	var params = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[1, 0.71, 0.03, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var params2 = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var btnSubmitImg = "btn";
	var btnSubmitImgW = sw - 70;
	var btnSubmitImgH = 60;
	
	var tipH = 70;
	var inputBoxBgH = 100;
	var submitBgH = 120;
	
	return{
		"type":"item", "id":"bindPhone","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("bindPhoneTop", sw, topH, textLib.txtBindPhoneTip, this, this.onBackClk, 0)},

			{
				"type":"icon", "id":"phoneNumTip","pos":[0, topH, 0], "w":sw, "h":tipH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([15, tipH >> 1, 0], "", [sw - 30, 30], textLib.txtOldBindPhoneTip, itemParameter)},
				],
			},
			
			{
				"type":"icon", "id":"checkCode","pos":[0, topH + tipH + 1, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([20, inputBoxBgH >> 1, 0], "", checkCodeImg, checkCodeImgW, checkCodeImgH, 0, 1)},

					{css:cssLib["showTextEdit"]([40 + checkCodeImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "checkCode", inputBoxW, inputBoxH,
						"", textLib.txtCheckCodeTip, 30, 2, this.inputBoxEvent, this, 0)},
					
					{css:cssLib["key_icon_txt"]([sw - (btnCheckCodeImgW >> 1) - 20, inputBoxBgH >> 1, 0], "getCheckCode",
						btnCheckCodeImg, btnCheckCodeImg, textLib.txtGetCheckCode, btnCheckCodeImgW, btnCheckCodeImgH,
						params, this, this.getCheckCode, 1)},
				],
			},
			
			{
				"type":"icon", "id":"tip","pos":[0, topH + tipH + 2 + inputBoxBgH, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([15, inputBoxBgH >> 1, 0], "", [sw - 30, 30], textLib.txtCheckCodeTip2, itemParameter2)},
				],
			},
			
			{
				"type":"icon", "id":"submitBg","pos":[sw >> 1, topH + tipH + 3 + (inputBoxBgH << 1), 0], "w":sw, "h":submitBgH, "anchor_h":1, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_icon_txt"]([0, submitBgH >> 1, 0], "btnSubmit", btnSubmitImg, btnSubmitImg, textLib.txtNextStepTip,
						btnSubmitImgW, btnSubmitImgH, params2, this, this.onSubmitPwdClk, 2)},
				],
			},
		],
	};
};

//=============绑定新手机==============================================
this.newBindPhoneCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var itemParameter2 = {tColor:[0, 0, 0, 0.3], tSize:20, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var phoneImg = "phone_flag";
	var phoneImgW = 55;
	var phoneImgH = 55;
	var checkCodeImg = "check_code";
	var checkCodeImgW = 55;
	var checkCodeImgH = 55;
	var checkCodeImgX = 55;
	var inputBoxW = sw - checkCodeImgW - 230;
	var inputBoxH = 70;
	var btnCheckCodeImg = "btn_checkcode";
	var btnCheckCodeImgW = 147;
	var btnCheckCodeImgH = 50;
	var params = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[1, 0.71, 0.03, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var params2 = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var btnSubmitImg = "btn";
	var btnSubmitImgW = sw - 70;
	var btnSubmitImgH = 60;
	
	var tipH = 70;
	var inputBoxBgH = 100;
	
	return{
		"type":"item", "id":"bindPhone","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("bindPhoneTop", sw, topH, textLib.txtBindPhoneTip, this, this.onBackClk, 0)},

			{
				"type":"icon", "id":"phoneNumTip","pos":[0, topH, 0], "w":sw, "h":tipH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([15, tipH >> 1, 0], "", [sw - 30, 30], textLib.txtNewBindPhoneTip, itemParameter)},
				],
			},
			
			{
				"type":"icon", "id":"inputPhoneNum","pos":[0, topH + tipH + 1, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", phoneImg, phoneImgW, phoneImgH, 0, 1)},
					
					{css:cssLib["showTextEdit"]([40 + phoneImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "newPhone", sw - (40 + phoneImgW) - 20, inputBoxH,
						"", textLib.txtInputPhoneTip, 30, 7, this.inputBoxEvent, this, 0)},
				],
			},
			
			{
				"type":"icon", "id":"checkCode","pos":[0, topH + tipH + inputBoxBgH + 2, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([15, inputBoxBgH >> 1, 0], "", checkCodeImg, checkCodeImgW, checkCodeImgH, 0, 1)},
					
					{css:cssLib["showTextEdit"]([40 + checkCodeImgW, (inputBoxBgH - inputBoxH) >> 1, 0], "newPhoneCheckCode", inputBoxW, inputBoxH,
						"", textLib.txtCheckCodeTip, 30, 8, this.inputBoxEvent, this, 0)},
						
					{css:cssLib["key_icon_txt"]([sw - (btnCheckCodeImgW >> 1) - 20, inputBoxBgH >> 1, 0], "getCheckCode",
						btnCheckCodeImg, btnCheckCodeImg, textLib.txtGetCheckCode, btnCheckCodeImgW, btnCheckCodeImgH,
						params, this, this.getCheckCode, 2)},
				],
			},
			
			{
				"type":"icon", "id":"tip","pos":[0, topH + tipH + (inputBoxBgH << 1) + 3, 0], "w":sw, "h":inputBoxBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([15, inputBoxBgH >> 1, 0], "", [sw - 30, 30], textLib.txtCheckCodeTip2, itemParameter2)},
				],
			},
			
			{
				"type":"icon", "id":"submitBg","pos":[sw >> 1, topH + tipH + (inputBoxBgH << 1) + inputBoxBgH + 4, 0], "w":sw, "h":120, "anchor_h":1, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_icon_txt"]([0, 60, 0], "btnSubmit", btnSubmitImg, btnSubmitImg, textLib.txtSubmit,
						btnSubmitImgW, btnSubmitImgH, params2, this, this.onSubmitPwdClk, 3)},
				],
			},
		],
	};
};

//==============编辑用户名===================================================
this.loadEditorCustomName = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var btnSaveImg = "btn_checkcode";
	var btnSaveImgW = 90;
	var btnSaveImgH = 50;
	var editorBgImg = "flower_bar";
	var editorBgImgW = sw;
	var editorBgImgH = 28;
	var inputFrameImg = cssLib.genIconPath("input_frame_bg");
	var inputFrameImgW = sw - 40;
	var inputFrameImgH = 119;
	var cb = this.inputBoxEvent;
	var cbobj = this;
	
	return{
		"type":"item", "id":"editorNameItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFour"]("editorNameTop", sw, topH, [textLib.txtEditorNameTip, textLib.txtSaveTip],
				btnSaveImg, btnSaveImg, btnSaveImgW, btnSaveImgH, this, [this.onBackClk, this.onSaveNameClk])},
				
			{
				"type":"icon", "id":"bg","pos":[0, topH, 0], "w":sw, "h":372, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
			},
			
			{css:cssLib["simpleIcon"]([0, topH + 372, 0], "", editorBgImg, editorBgImgW, editorBgImgH, 0, 0)},
			
			{
				"type":"icon", "id":"inputBoxBg", "pos":[20, 10 + topH, 0], "w":inputFrameImgW, "h":inputFrameImgH, "ui_event":1,
				obj:{"type":"image", "tex":inputFrameImg, "id":"upSpl", "tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
				items:[
					{css:cssLib["showTextEdit"]([0, 0, 0], "userName", inputFrameImgW, inputFrameImgH,
						"", textLib.txtInputNameTip, 30, 9, cb, cbobj, 0, 0, false, 0)},
				],
			},
		],
	};
};

