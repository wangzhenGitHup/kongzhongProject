this.initLoginCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var pwdLoginW = (sw - 1) >> 1;
	var pwdLoginH = 90;
	var pwdLoginX = (pwdLoginW >> 1);
	var pwdLoginY = topH + 45;
	
	var phoneLoginX = pwdLoginW + pwdLoginX + 1;
	var userNameY = topH;
	var pwdY = userNameY + 2 + pwdLoginH;
	var loginKeyY = pwdY + pwdLoginH;
	
	var doLoginBtnW = sw >> 1;
	var doLoginBtnH = pwdLoginH - 10;
	var loginBtnX = 20 + pwdLoginW;
	var loginBtnY = loginKeyY + (doLoginBtnH >> 1) + 1;
	
	var autoLoginKeyH = pwdLoginH + 40;
	var keyParameter = {anchor_h:0, anchor_v:1, ui_event:1, display:1,};
	var imgUrl = "check_select";
	var imgSize = [58, 56];
	var itemParameter1 = {
		tColor:[1, 1, 1, 1], tSize: 36,
		edge: 0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v: 1,
		anchor_h:1, anchor_v:1,
	};
	var itemParameter2 = {
		tColor:[0, 0, 0, 0.2], tSize: 30,
		edge: 1, edgeColor:[0, 0, 0, 0.2],
		align_h:1, align_v: 1,
		anchor_h:1, anchor_v:1,
	};
	var textAutoSize = appEnv.getTextSize(textLib.txtAutoLoginTip, 30, 0, sw >> 1);
	
	var findPwdY = loginKeyY + autoLoginKeyH + (autoLoginKeyH >> 1) + 22;
	var theOtherLoginBtnH = 200;//sh - findPwdY - autoLoginKeyH - 100;
	var theOtherLoginY = sh - theOtherLoginBtnH / 2;//findPwdY + autoLoginKeyH + (theOtherLoginBtnH >> 1);
	
	var upImage = cssLib.genIconPath("btn");
	var userFlagImg = cssLib.genIconPath("user_flag");
	var userFlagImgW = 64;
	var userFlagImgH = 90;
	
	var passwordFlagImg = cssLib.genIconPath("password_flag");
	var passwordFlagImgW = 64;
	var passwordFlagImgH = 90;
	
	var phoneLoginFlagDownImg = cssLib.genIconPath("phone_login_select");
	var phoneLoginFlagUpImg = cssLib.genIconPath("phone_login_unselect");
	var passwordLoginFlagDownImg = cssLib.genIconPath("password_login_select");
	var passwordLoginFlagUpImg = cssLib.genIconPath("password_login_unselect");
	var params1 = {scale:0.98, upclr:[0, 0, 0, 0.2], downclr:[0, 0, 0, 0.2], fs:30, edgeclr:[0, 0, 0, 0.2], edge:1};
	
	return {
		"type":"item", "id":"loginItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{
				"type":"icon", "id":"bg","pos":[0, 0, 0],"auto_size":0,"w":sw,"h":sh,"ui_event":1,
				obj:{"type":"box", "color":[0.88, 0.88, 0.88, 1], },
				items:[
					{css:cssLib["modelTopBgSecond"]("loginTopBar", sw, topH, textLib.txtLoginTip, textLib.txtRegisterTip,
						80, 80, 40, this, [this.onBackClk, this.onRegisterClk])},
					//用户名 
					{
						"type":"icon", "id":"userflag", "pos":[userFlagImgW >> 1, userNameY + userFlagImgH / 2, 0],
						"w":userFlagImgW + 40, "h":userFlagImgH, "anchor_h":1, "anchor_v":1,
						obj:{"type":"box", "color":[1, 1, 1, 1], },
						items:[
							{
								"type":"icon", "id":"userflagIcon", "pos":[15, 0, 0], "w":60, "h":60, "anchor_h":1, "anchor_v":1,
								obj:{"type":"image", "tex":userFlagImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
							},
						]
					},
					
					{css:cssLib["showTextEdit"]([userFlagImgW + 21, userNameY, 0], "inputUserName", sw, pwdLoginH,
						"", textLib.txtUserNameTip, 36, 0, this.getInputBoxText, this, 0, 0, false, 1, this.editWarning)},
					//密码 
					{
						"type":"icon", "id":"pwdflag", "pos":[passwordFlagImgW >> 1, pwdY + passwordFlagImgH / 2 - 1, 0],
						"w":passwordFlagImgW + 40, "h":passwordFlagImgH, "anchor_h":1, "anchor_v":1,
						obj:{"type":"box", "color":[1, 1, 1, 1], },
						items:[
							{
								"type":"icon", "id":"pwdflagIcon", "pos":[15, 0, 0], "w":60, "h":60, "anchor_h":1, "anchor_v":1,
								obj:{"type":"image", "tex":passwordFlagImg, "tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
							},
						]
					},
					
					{css:cssLib["showTextEdit"]([passwordFlagImgW + 21, pwdY - 1, 0], "inputPwd", sw - passwordFlagImgW - 21, pwdLoginH,
						"", textLib.txtPasswordTip, 36, 1, this.getInputBoxText, this, 1, 0, false, 1, this.editWarning)},
					
					{
						"type":"icon", "pos":[0, loginKeyY + 1, 0], "w":sw, "h":doLoginBtnH+70, "ui_event":1,
						obj:{"type":"box", "color":[1, 1, 1, 1]},
						items:[
							{css:cssLib["stdBtn"]([pwdLoginW, doLoginBtnH / 2 + 30, 0], "login", [pwdLoginW * 2 - 120, doLoginBtnH],
								upImage, upImage, textLib.txtLoginTip, itemParameter1, this.onLoginClk, this)},
						],
					},
					
					{
						"type":"icon", "id":"bg", "pos":[doLoginBtnW >> 1, findPwdY, 0],
						"anchor_h":1, "anchor_v":1, "w":doLoginBtnW, "h":autoLoginKeyH, "ui_event":1,
						obj:{"type":"box", "color":[1, 1, 1, 1,], },
						items:[
							{css:cssLib["stdText"]([0, -10, 0], "", [textAutoSize.w, textAutoSize.h],
								textLib.txtAutoLoginTip, itemParameter2), },
		
							{css:cssLib["simpleIcon"]([-(imgSize[0] << 1) - 20, -15, 0], "autoLoginKey", imgUrl, imgSize[0],
								imgSize[1], 0, 1)},
						],
					},
					
					{
						"type":"icon", "id":"findPwd", "pos":[doLoginBtnW + (doLoginBtnW >> 1), findPwdY, 0], "w":doLoginBtnW,
						"h":autoLoginKeyH, "ui_event":1, "anchor_h":1, "anchor_v":1,
						obj:{"type":"box", "color":[1, 1, 1, 1], },
						items:[
							{css:cssLib["key_txt"]([0, -20, 0], this, this.onFindPwdClk, doLoginBtnW, autoLoginKeyH,
								textLib.txtfindBackPwdTip, params1)},
						],
					},
					
					{
						"type":"icon", "id":"otherLoginBg", "pos":[20 + ((sw - 40) >> 1), theOtherLoginY, 0],
						"w":sw - 40, "h":theOtherLoginBtnH, "anchor_h":1, "anchor_v":1, "ui_event":1,
						obj:{"type":"box", "color":[1, 1, 1, 0],},
						items:[
							{css:cssLib["stdText"]([0, -44, 0], "", [216, 36], textLib.txtPartnerAccountTip,
								{tColor:[0, 0, 0, 0.2], tSize:36, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:1, align_v:1,
									anchor_v:1, anchor_h:1,})},
									
							{css:cssLib["key_icon"]([0, 40, 0], "otherLogin", "qq_load", "qq_load", 96, 96,
								{ah: 1, av: 1, scale: 0.9}, this, this.onTheThridLoginMethodClk)},
						],
					},
				],//End of: items
	
			},
		],//End of: items
	};
}





