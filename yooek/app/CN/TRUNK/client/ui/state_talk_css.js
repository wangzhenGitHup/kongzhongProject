this.initMessageCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var goodsBgH = 0;
	var titleTxt;
	var goodsIcon;
	var goodsIconW;
	var goodsIconH;
	var typeName;
	var typeNameSize;
	var serverName;
	var serverNameSize;
	var priceTxt;
	var priceTxtSize;
	var tipSizeOne;
	var priceTxtX;
	var sendGoodsBtnIcon;
	var sendGoodsBtnIconW;
	var sendGoodsBtnIconH;
	var css = null;
	var itemParameter2 = {tColor:[0, 0.71, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:1,
		align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
		
	var itemParameter3 = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:0, anchor_v:0, wrap:0, scale:0.98};
		
	var params = {tColor:[0, 0, 0, 1], tSize:28, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_v:1, wrap:1};
	
	var lookTipSize = [textLib.txtLookMoreTalkContentTip.length * 24, 24];
	
	if(this.PAGE_GOODS == this.whatJump)
	{
		titleTxt = vo.sellname;
		goodsBgH = 150;
		goodsIcon = vo.gameimageurl;
		goodsIconW = 90;
		goodsIconH = 90;
		
		typeName = vo.productname;
		typeNameSize = page.appEnv.getTextSize(typeName, 26, 0, sw);
		
		serverName = textLib.txtGameServerTip + ":" + vo.zonestr + "/" + vo.serverstr;
		serverNameSize = page.appEnv.getTextSize(serverName, 24, 0, sw);
		
		priceTxt = "" + vo.rebateprice;
		priceTxtSize = page.appEnv.getTextSize(priceTxt, 40, 0, sw);
		tipSizeOne = page.appEnv.getTextSize(textLib.txtYuanTip, 30, 0, sw);
		priceTxtX = sw - tipSizeOne.w - 30 -  priceTxtSize.w;
		//var itemParameter1 = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};

		sendGoodsBtnIcon = "message_bar1";
		sendGoodsBtnIconW = 181;
		sendGoodsBtnIconH = 50;
		css = {
			"type":"icon", "id":"bg1","pos":[0, topH, 0], "w":sw, "h":goodsBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
			obj:{"type":"box", "color":[1, 1, 1, 1]},
			items:[
				{css:cssLib["url_icon"]([20, 20, 0], "", goodsIcon, goodsIconW, goodsIconH, 0, 0)},
				
				{css:cssLib["stdText"]([30 + goodsIconW, 20, 0], "typeName", [typeNameSize.w, typeNameSize.h],
					typeName, {tColor:[0, 0, 0, 1], tSize:26, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0,
						anchor_h:0, anchor_v:0, wrap:0})},
		
				{css:cssLib["stdText"]([30 + goodsIconW, 60, 0], "serverName", [serverNameSize.w, serverNameSize.h],
					serverName, {tColor:[0, 0, 0, 0.4], tSize:24, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0,
						anchor_h:0, anchor_v:0, wrap:0})},
				
				{css:cssLib["multi_text"]([priceTxtX, 50, 0], 200, 30, priceTxt, textLib.txtYuanTip,
					{r:0.51, g:0.75, b:0.05, a:1}, {r:0, g:0, b:0, a:0.6}, 40, 30, {wrap:0, align_h:0, align_v:0,
						anchor_h:0, anchor_v:0,})},

				{css:cssLib["key_icon_txt"]([sw >> 1, goodsBgH - (sendGoodsBtnIconH >> 1), 0], "sendGoodsBtn",
					sendGoodsBtnIcon, sendGoodsBtnIcon, textLib.txtSendGoodsInfoTip, sendGoodsBtnIconW,
					sendGoodsBtnIconH, itemParameter2, this, this.onSendGoodsInfoClk)},
			],
		};
	}
	else
	{
		if(appEnv.userInfoObj.customersysno == vo.receivecustomersysno)
		{
			titleTxt = vo.sendname;
		}
		else
		{
			titleTxt = vo.receivename;
		}
	}
	
	var scrollBoxH = sh - topH - goodsBgH - 147;
	var messageInputBoxIcon = cssLib.genIconPath("message_inputbox");
	var messageInputBoxIconW = sw - 60 - 120;
	var messageInputBoxIconH = 70;
	
	var sendBtnIcon = "send_btn";
	var sendBtnIconW = 120;
	var sendBtnIconH = 67;
	var cbobj = this;
	var cb = this.getSendTalkContent;
	
	return{
		"type":"item", "id":"initMessageItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("initmessageTop", sw, topH, titleTxt, this, this.onBackClk)},

			css,
			
			{css:cssLib["key_txt"]([sw >> 1, topH + goodsBgH + lookTipSize[1], 0], this,
				this.onLookMoreTalkContentClk, lookTipSize[0], lookTipSize[1], textLib.txtLookMoreTalkContentTip,
				{anchor_h:1, anchor_v:0, scale:0.98, upclr:[0, 0.71, 1, 1], fs:24, downclr:[0, 0.71, 1, 1],
					align_h:1, align_v:0, edge:0, edgeclr:[]})},
			
			{css:cssLib["scrollBox"]([0, topH + goodsBgH + 60, 0], sw, scrollBoxH)},
			
			{
				"type":"icon", "id":"bg1","pos":[0, sh - 80, 0], "w":sw, "h":80, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{
						"type":"icon", "id":"bgIcon", "pos":[20, (80 - messageInputBoxIconH) / 2, 0], 
						"w":messageInputBoxIconW, "h":messageInputBoxIconH, "anchor_h":0, "anchor_v":0, "ui_event":1,
						obj:{"type":"image", "tex":messageInputBoxIcon, "tex_u":0, "tex_uw":1, "tex_vh":1,},
						items:[
							/*{
								"type":"edit", "id":"talkinput", "pos":[0, 0, 0],
								"w":messageInputBoxIconW, "h":messageInputBoxIconH,"text":"","font_size":28, 
								"color":[0, 0, 0, 1], "ui_event":1,"anchor_h":0,"anchor_v":0, "align_h":0, "align_v":0,
								OnEditUpdate:function()
								{
									var txt = this.getText();
									cb.call(cbobj, txt);
									this.setText(txt);
								},
								
								_setText:function(txt)
								{
									this.setText(txt);
								},
							},*/
							{css:cssLib["showTextEdit"]([0, 0, 0], "talkinput", messageInputBoxIconW, messageInputBoxIconH,
								"", "", 28, 0, cb, cbobj, 0)},
						],
					},
					
					{css:cssLib["key_icon_txt"]([sw - 30 - sendBtnIconW, 40, 0], "sendBtn",
						sendBtnIcon, sendBtnIcon, textLib.txtSendMessageTip, sendBtnIconW, sendBtnIconH,
						itemParameter3, this, this.onSendMessageClk)},
				],
			},
		],
	};
};

this.loadDetailMessageData = function(vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var sw = appEnv.scrSize[0];
	var bgH = 80;
	var icon = "owner_icon";
	var kefuIcon = "kefu_message";//客服消息的头像
	var yooekIcon = "yooek_message";//系统消息的头像 
	var iconW = 62;
	var iconH = 62;
	var messageOwner = "卖家";
	var messageName = "小猴子";
	var detailMessage = "亲， 我在的呢？";
	var timeTxt = "下午3:01";
	var clr1 = [0, 0.71, 1, 1];
	var clr2 = [0, 0, 0, 1];
	var cbobj = this;
	var cb = this.onOpenMessageClk;
	
	return{
		"type":"key", "pos":[0, bgH >> 1, 0], "w":sw, "h":bgH, "ui_event":1, "key":0, "anchor_h":0, "anchor_v":1, "down_scale":1,
		"state_up":{"type":"box", "color":[1, 1, 1, 1]},
		"state_down":{"type":"box", "color":[1, 1, 1, 0.6]},
		OnClick:function(msg, extra)
		{
			if(!cb)
			{
				return;
			}
			cb.call(cbobj, msg, extra);
		},
		items:[
			{css:cssLib["simpleIcon"]([20, 0, 0], "", icon, iconW, iconH, 0, 1)},
			
			{css:cssLib["stdText"]([30 + iconW, -30, 0], "tip1", [messageOwner.length * 30, 30], messageOwner,
				{tColor:clr1, tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
			
			{css:cssLib["stdText"]([30 + iconW + messageOwner.length * 30, -30, 0], "tip2", [messageOwner.length * 30, 30],
				messageName, {tColor:clr2, tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
					anchor_v:0, wrap:0})},
			
			{css:cssLib["stdText"]([30 + iconW, 10, 0], "tip3", [detailMessage.length * 20, 20], detailMessage,
				{tColor:[0, 0, 0, 0.3], tSize:20, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
					anchor_v:0, wrap:0})},
			
			{css:cssLib["stdText"]([sw - timeTxt.length * 20, -30, 0], "tip3", [timeTxt.length * 20, 20], timeTxt,
				{tColor:[0, 0, 0, 0.3], tSize:20, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
					anchor_v:0, wrap:0})},
		],
	};
};