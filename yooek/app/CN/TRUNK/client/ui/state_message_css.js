this.initMessageCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"item", "id":"initMessageItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("initmessageTop", sw, topH, textLib.txtMessageTip, this, this.onBackClk)},
			/*{
				"type":"icon", "id":"bg1","pos":[0, topH, 0], "w":sw, "h":20, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
			},*/
			{css:cssLib["scrollBox"]([0, topH + 0, 0], sw, sh - topH, this)},
		],
	};
};

this.loadDetailMessageData = function(vo, btnMsg)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var sw = appEnv.scrSize[0];
	var bgH = 100;
	var icon;
	var iconW = 80;
	var iconH = 80;
	var messageOwner = "卖家";
	if(0 == vo.flag)
	{
		messageOwner = textLib.txtSaleManTip;
		icon = "message_icon1";
	}
	else if(1 == vo.flag)
	{
		messageOwner = textLib.txtKeFuTip;
		icon = "kefu_message";
	}
	/*else if(2 == vo.flag)
	{
		messageOwner = textLib.txtYooekTip;
		icon = "yooek_message";
	}*/
	var messageOwnerSize = appEnv.getTextSize(messageOwner, 30, 0, sw);
	
	var messageName = "";//vo.sendname;
	if(appEnv.userInfoObj.customersysno == vo.receivecustomersysno)
	{
		messageName = vo.sendname;
	}
	else
	{
		messageName = vo.receivename;
	}
	var messageNameSize = appEnv.getTextSize(messageName, 30, 0, sw);
	
	var leftW = sw - 70 - iconW
	var detailMessage = vo.message;
	var detailMessageSize = appEnv.getTextSize(detailMessage, 20, 0, leftW);
	if(detailMessageSize.w > leftW)
	{
		detailMessage = detailMessage.substring(0, 30) + "..........";
	}
	var timeTxt = "";
	//if(0 == vo.timeType)
	{
		timeTxt = appEnv.formatDate(vo.indate);
	}
	/*else if(1 == vo.timeType)
	{
		timeTxt = textLib.txtAfternoonTip + vo.indate;
	}*/
	var timeTxtSize = appEnv.getTextSize(timeTxt, 20, 0, sw);
	var clr1 = [0, 0.71, 1, 1];
	var clr2 = [0, 0, 0, 1];
	var cbobj = this;
	var cb = this.onOpenMessageClk;

	return{
		"type":"key", "pos":[0, bgH >> 1, 0], "w":sw, "h":bgH, "ui_event":0, "key":0,  "anchor_h":0,
		"anchor_v":1, "down_scale":1,
		"state_up":{"type":"box", "color":[1, 1, 1, 1]},
		"state_down":{"type":"box", "color":[1, 1, 1, 0.6]},
		
		OnClick:function(msg, extra)
		{
			if(!cb)
			{
				return;
			}
			cb.call(cbobj, msg, extra, btnMsg);
		},
		items:[
			{css:cssLib["simpleIcon"]([20, 0, 0], "", icon, iconW, iconH, 0, 1)},
			
			{css:cssLib["stdText"]([30 + iconW, -30, 0], "tip1", [messageOwnerSize.w, messageOwnerSize.h],
				messageOwner, {tColor:clr1, tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
					anchor_v:0, wrap:0})},
			
			{css:cssLib["stdText"]([30 + iconW + messageOwnerSize.w, -30, 0], "tip2", [messageNameSize.w, messageNameSize.h],
				messageName, {tColor:clr2, tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
					anchor_v:0, wrap:0})},
			
			{css:cssLib["stdText"]([30 + iconW, 10, 0], "tip3", [detailMessageSize.w, detailMessageSize.h], detailMessage,
				{tColor:[0, 0, 0, 0.4], tSize:20, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0,
					anchor_v:0, wrap:0})},
			
			{css:cssLib["stdText"]([sw - timeTxtSize.w - 20, -30, 0], "tip3", [timeTxtSize.w, timeTxtSize.h], timeTxt,
				{tColor:[0, 0, 0, 0.3], tSize:20, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0,
					anchor_v:0, wrap:0})},
		],
	};
};