"OK":"确认",
"Cancel":"取消",
"IsLoading":"正在获取信息……",
"GetInfoError":"获取信息失败",
"GetCDTime":function(cdTime)
{
	return "冷却时间: "+this.getTimeText(cdTime);
},


"InputPwd":"请输入密码",
"InputPwdError":"密码过短，小于5位",
"ServiceEmail":"联系客服",
"OfficialWebsite":"访问官网",
"UserId":"用户ID",
"UserName":"用户昵称",
"IllegalInput":"包含非法字符或文字，请重新输入！",
"Copyright":"版权信息",
"Feedback":"用户反馈",
"ChangeUser":"更改用户",

"InputPwdTip":"请输入密码：（长度6~20位）",//（包含6~20位英文或数字）
"RepeatPwd":"请再次输入密码",
"PwdErrorLen":"密码长度不合法",
"PwdErrorStr":"密码含有非法字符",
"PwdErrorRe":"两次输入的密码不一致",
"LoginMail":"登陆帐号（已绑定的邮箱）",
"LoginPwd":"登录密码",
"Login":"登陆",

"Gem":"钻石",

"StrDay":"天",
"StrHour":"时",
"StrMin":"分",
"StrSec":"秒",
digiGapText:function(score){
	var len;
	score=""+score;
	len=score.length;
	//DBOut(">>>>>>>>>Len: "+len);
	while(len>3)
	{
		len-=3;
		score=score.substring(0,len)+","+score.substring(len);
	}
	//DBOut(">>>>>>>>>score: "+score);
	return score;
},
getTimeText:function(time){
	var d,h,m,s,str;
	d=Math.floor(time/(1000*60*60*24));
	time-=d*(1000*60*60*24);
	h=Math.floor(time/(1000*60*60));
	time-=h*(1000*60*60);
	m=Math.floor(time/(1000*60));
	time-=m*(1000*60);
	s=Math.floor(time/(1000));
	if(d)
	{
		str=""+d+"天 ";
		if(h)str+=(h+"小时 ")
	//	return ""+d+"天 "+h+"小时 ";
	}
	else if(h)
	{
		str=""+h+"小时 ";
		if(m)str+=(m+"分 ")
	//	return ""+h+"小时 "+m+"分 ";
	}
	else if(m)
	{
		str=""+m+"分 ";
		if(s)str+=(s+"秒 ")
	//	return ""+m+"分 "+s+"秒";
	}
	else
	{
		str=""+s+"秒 ";
	//	return ""+s+"秒";
	}
	return str;
},
getDebugTimeText:function(time){
	var d,h,m,s;
	d=Math.floor(time/(1000*60*60*24));
	time-=d*(1000*60*60*24);
	h=Math.floor(time/(1000*60*60));
	time-=h*(1000*60*60);
	m=Math.floor(time/(1000*60));
	time-=m*(1000*60);
	s=Math.floor(time/(1000));
	return ""+d+"d "+h+"h "+m+"m "+s+"s";
},

"txtSignStringTip":"59tg6ga917a73tm53geqgb087m15xk1ssj94gn2i42y1cv179pn2cs0o38gbdqs2v2arfmbkxys42e6z3wa799oks7wiikd4c5ekn51yzet0sijk7nh7hlmpel5r4qxw",
"txtConfirmTip":"确认",
"txtMainPageTip":"首页",
"txtMainGameTip":"游戏",
"txtMainMeTip":"我",
"txtNoHaveMoreTalkContentTip":"暂无更多的消息",
"txtBuyGoodsTip1":"该商品暂时没有首充续充商品",
"txtBuyGoodsTip2":"您购买的商品已下架",
"txtBuyGoodsTip3":"您购买的商品库存不足",
"txtLookMoreTalkContentTip":"查看更多消息",
"txtConnectNetErrorTip":"网络链接错误，是否重新链接？",
"txtNetTip1":"咦？数据加载失败了，再链接试试吧",
"txtCheckingTradeResultTip":"正在检查支付结果，请稍后......",
"txtNoHaveAccountTip":"查无此账号，现在去首充吧",
"txtAccountTip1":"此账号为",
"txtAccountTip2":"账号，现在就去充值",
"txtPayTip2":"您还未设置支付密码，现在要设置吗？",
"txtPayTip3":"没有设置支付密码，不能用余额支付！",
"txtNetTip2":"请检查一下您的网络，重新加载吧",
"txtPayTip4":"当前余额不足，请选择其他支付方式！",
"txtPullDownFreshTip":"上拉刷新",
"txtPriceTip1":"原价",
"txtDiscountTip1":"折",
"txtNoHave":"空",
"txtCheckIsLoginTip":"用户未登录",
"txtCheckIsLoginTip2":"System.0012",
"txtCheckIsLoginTip3":"请重新登录！",
"txtErrorTip4":"新密码和旧密码一样!",
"txtLoginPasswordAlertSuccessTip":"登录密码修改成功",
"txtNoUpdateTip":"最新版本不需要更新！",
"txtAdverFailTip":"意见提交失败！",
"txtAdverSuccessTip":"意见提交成功！",
"txtNoFunctionTip":"功能暂时未开通",
"txtPleaseInputVerifycodeTip":"请输入正确的验证码",
"txtMustWriteInfomationTip":"必填信息没有写",
"txtKeyTip":"请输入关键字",
"txtBuyBalanceTip":"余额足够，不需要选择其他支付方式",
"txtReleaseRefreshTip":"释放开始刷新",
"txtNoHaveBackDataTip":"抱歉，当前没有您所要的信息！",
"txtRefreshIngTip":"正在刷新中.....",
"txtDataFullTip":"已获加载全部数据",
"txtVerifycodeWarningTip":"请输入验证码",
"txtSubmitTip":"提交成功！",
"txtDeleteOrderFailedTip":"删除订单失败！",
"txtVersionTip":"当前版本号为:V",
"txtAlertPwdSuccessTip":"密码修改成功",
"txtSetPayoutPasswordErrorTip":"设置支付密码错误",
"txtWriteErrorTip":"必填信息没有填写完整",
"txtPleaseLoginTip":"请先登录",
"txtBindPhoneNumberFailedTip":"绑定手机号失败！",
"txtAccountErrorTip":"登录名为空！",
"txtStringErrorTip2":"输入的字符中包含有特殊字符！",
"txtAccountErrorTip3":"输入的登录名必须是4到20位！",
"txtStringErrorTip4":"输入的字符中包含有汉字！",
"txtStringErrorTip5":"输入的字符过长了！",
"txtUpdatePasswordFailedTip":"更新密码失败！",
"txtNotLoginTip":"您还没有登录！",
"txtPasswordErrorTip2":"输入的密码必须是6到20位！",
"txtPasswordErrorTip3":"请按照要求输入正确格式的密码！",
"txtAccountErrorTip1":"输入的用户名必须是4到20位！",
"txtAccountErrorTip2":"请按照要求输入正确格式的用户名！",
"txtAccountErrorTip4":"输入的用户名不合法！",
"txtPhoneNumberIsNullTip":"手机号码为空！",
"txtPasswordErrorTip":"您输入的密码有误！",
"txtPleaseInputUserNameTip":"请输入用户名",
"txtPhoneNumberErrorTip":"请输入正确的手机号",
"txtAlertPasswordFailedTip":"修改密码失败",
"txtSendVerifyCodeSuccess":"获取验证码发送成功！",
"txtSendVerifyCodeFailed":"获取验证码发送失败！",
"txtVerifyCodeErrorTip":"验证码错误！",
"txtConfirmReceiverGoodsTip":"确认收货",
"txtConfirmReceiverGoodsFailedTip":"确认收货失败",
"txtNoLoginTip":"您还未登录",
"txtImmediatelyUpgradeTip":"立即升级",
"txtInputBoxTip7":"请再次输入支付密码，英文及数字6-20位",
"txtInputBoxTip6":"请输入支付密码，英文及数字6-20位",
"txtPayPasswordTip":"请输入支付密码",
"txtForenoonTip":"上午",
"txtAfternoonTip":"下午",
"txtYooekTip":"YOOEK",
"txtKeFuTip":"客服",
"txtEnterTalkListTip":"进入聊天列表失败,请再次进入！",
"txtInputBoxTip5":"请输入新密码，6-20位",
"txtInputBoxTip4":"请再次输入新密码，6-20位",
"txtOldPasswordTip":"请输入您的旧密码",
"txtTotalTip":"共",
"txtOnceTip":"件",
"txtPwdNullTip":"密码未填写，请输入！",
"txtDeleteOrderTip2":"您确认删除该订单吗？删除后，订单将不可恢复",
"txtAccountTip3":"账号",
"txtResetPwdTip":"重置密码",
"txtInputBoxTip3":"请输入账号绑定的手机号码",
"txtPartnerAccountTip":"合作方账号登录",
"txtfindBackPwdTip":"找回密码",
"txtAutoLoginTip":"自动登录",
"txtPasswordTip":"密码",
"txtUserNameTip":"用户名",
"txtRegisterTip":"注册",
"txtBuyPersonTip":"人购买",
"txtLoginTip":"登录",
"txtPayFinishTip":"支付完成",
"txtadviseRestroactionErrorTip":"请填写您的意见！",
"txtSelectPayMethodTip":"请选择一种支付方式",
"txtPasswordIllegeTip":"输入的密码不合法！",
"txtFillOutTip3":"必填：请与之前的密码输入一致",
"txtFillOutTip2":"必填：仅支持英文、字符及数字，6-20位",
"txtFillOutTip1":"必填：支持英文及数字，4-20位",
"txtInputPhoneNumberTip":"请输入手机号码",
"txtImmediatelyRegisterTip":"立即注册",
"txtRegisterTip1":"注册即表示您同意",
"txtRegisterTip2":"游易客服务条款",
"txtRegisterTip3":"，游易客不会以任何形式泄露您的手机号和相关信息。",
"txtOrderTip":"订单",
"txtNoHaveSearchTip":"抱歉，没有你所搜索的信息！",
"txtLoginAndRegisterTip":"登录/注册",
"txtLastSearchTip":"最近搜索",
"txtSearchTip":"搜索",
"txtSendGoodsInfoTip":"发送商品信息",
"txtSendMessageTip":"发送",
"txtMessageTip":"消息",
"txtQueryTip":"查询",
"txtInputAccountTip":"请输入账号",
"txtSafeTip2":"温馨提示",
"txtSaleManNameTip":"卖家名称",
"txtGameServerTip":"游戏区服",
"txtCreateOrderFailedTip":"订单创建失败！",
"txtGoodsTypeTip":"商品类型",
"txtImmeditaleyBuyTip":"立即购买",
"txtUserRegisterTip":"用户注册",
"txtQQVipTip":"QQ会员",
"txtSaleCountTip":"销量",
"txtDiscountTip":"折扣",
"txtFirstRechargeTip":"首充新号",
"txtSecondRechargeTip":"首充续充",
"txtThridRechargeTip":"苹果代充",
"txtAllGameTip":"全部游戏",
"txtEditorNickNameTip":"编辑昵称",
"txtCancelTip":"取消",
"txtIsConfirmReceiverGoodsTip":"是否确认收货？",
"txtCopySuccessTip":"复制成功！",
"txtLoadingTip":"正在获取信息……",
"txtFirstRechargeAganistTip":"首充续充金额选择",
"txtPriceTip":"价格",
"txtAgentRechargeTip":"代充金额选择",
"txtAllTip":"全部",
"txtFilterTip":"筛选",
"txtLookMyOrderTip":"查看我的订单",
"txtTimeMinTip":"分钟",
"txtBuySuccessTip3":"不要着急，很快就能收到货！",
"txtGetGoodsTimeTip":"预计收货时间",
"txtAlertTip":"前往修改",
"txtSafeTip1":"为了保证您的账号安全，请尽快修改密码、注册资料和密保安全绑定信息！",
"txtGamePwdTip":"游戏密码",
"txtGameAccountTip":"游戏账号",
"txtGoodsNameTip":"商品名称",
"txtGoodsPriceTip":"商品价格",
"txtBuySuccessTip2":"恭喜您购买成功！",
"txtBuySuccessTip":"购买成功",
"txtConfirmOrderTip":"确认订单",
"txtAccountTip":"账号",
"txtBankCardPayTip":"银行卡支付",
"txtBankCardPayTip2":"支持储蓄卡信用卡，无需开通网银",
"txtPayBaoPayTip":"支付宝支付",
"txtPayBaoTip":"支付宝",
"txtPayBaoPayTip2":"推荐安装支付宝客户端的用户使用",
"txtWeiXinPayTip":"微信支付",
"txtChargeBaoTip":"汇付宝",
"txtWeiXinTip":"微信",
"txtBankCardTip":"银行卡",
"txtWeiXinPayTip2":"推荐安装微信5.0及以上版本的使用",
"txtSelectPayForTip":"选择支付方式",
"txtConfirmPayTip":"确认支付",
"txtShouldPayForTip":"还需支付",
"txtFirstRechargeMoneyTip":"首充金额",
"txtBusinessTip":"运营商",
"txtGameNameTip":"游戏名称",
"txtGemBalanceTip":"当前钻石余额",
"txtConfirmPwdTip":"确认密码",
"txtPasswordWriteTip":"密码填写",
"txtAccountNameTip":"账号名称",
"txtTotalCountTip":"总数",
"txtCountTip":"数量",
"txtBakInfoTip":"备注信息",
"txtRoleNameTip2":"备用角色名称",
"txtRoleNameTip1":"角色名称",
"txtServiceTip1":"大区/服务器名称",
"txtSubmitOrderTip":"提交订单",
"txtSaveCard":"储蓄卡",
"txtCreditCard":"信用卡",
"txtSelectBankTip":"选择银行",
"txtNoHaveGamesTip":"亲：您还没有收藏游戏哦",
"txtFinishTip":"完成",
"txtEditorTip":"编辑",
"txtCollectGameTip":"收藏的游戏",
"txtTradeSuccessOrderTip2":"客服会及时联系您，请耐心等待！",
"txtWaitTakeOverOrderTipText":"待收货的订单",
"txtTradeSuccessOrderTip":"交易成功的订单",
"txtTradeSuccessTip":"交易成功",
"txtAgnistBuyTip":"再次购买",
"txtGoOnAgentPayTip":"后续代充",
"txtFailedReasonTip":"失败原因",
"txtDeleteOrderTip":"删除订单",
"txtSeeReasonTip":"查看原因",
"txtTradeFailedTipText":"交易失败的订单",
"txtTradeFailedTip2":"交易失败，请重新支付！",
"txtRemarksTip":"备注",
"txtIdentiSaleTip":"认证商家",
"txtWaitDeliverGoods":"待发货",
"txtWaitSendOrderTitleTip":"待发货的订单",
"txtAlreadSendGoodsTip":"已发货",
"txtContactSaleTip":"联系卖家",
"txtCreditTip":"信誉",
"txtGoodsNumberTip":"商品编号",
"txtGoodsDetailTip":"商品详情",
"txtImmediatelyTip":"立即付款",
"txtGoodsInfoTip":"商品信息",
"txtPayTip":"付款",
"txtYuanTip":"元",
"txtTotalPriceTip":"总价:",
"txtSaleManTip":"卖家",
"txtCopyTip":"复制",
"txtOrderNumTip":"订单编号",
"txtWaitPayOrderTitle":"待付款订单",
"txtAllOrderTip":"全部订单",
"txtWaitPayOrderTip":"待付款",
"txtWaitTakeOverOrderTip":"待收货",
"txtAlreadyTakeOverOrderTip":"已收货",
"txtTradeFailedOrderTip":"交易失败",
"txtOrderManagerTip":"订单管理",
"txtInputNameTip":"请输入新的昵称",
"txtSaveTip":"保存",
"txtEditorNameTip":"编辑昵称",
"txtAdviseInitTip":"欢迎您提出宝贵的意见和建议，您留下的每个字都将用来改善我们的软件。",
"txtLimitWordsTip":"限定(200)字以内",
"txtDoBestAdviseTip":"优化建议",
"txtQuestionErrorTip":"问题错误",
"txtQuestionRestroactionTip":"问题反馈",
"txtSubmitRestroactionTip":"提交反馈",
"txtInputPhoneTip":"请输入手机号",
"txtNextStepTip":"下一步",
"txtCheckCodeTip2":"提示：点击上方按钮，验证码会发送到您当前账号绑定的手机号码中",
"txtCheckCodeTip":"请输入您收到的验证码",
"txtOldPwdTip":"旧密码",
"txtNewPwdTip":"新密码",
"txtConfirmPwdTip":"密码确认",
"txtInputBoxTip1":"英文及数字6-20位",
"txtHelpTip1":"《游易客》介绍",
"txtHelpTip2":"买家帮助",
"txtSubmit":"提交",
"txtOldBindPhoneTip":"旧绑定手机",
"txtNewBindPhoneTip":"新绑定手机",
"txtBindPhoneTip":"绑定手机",
"txtGetCheckCode":"获取验证码",
"txtPhoneNumTip":"您的手机号",
"txtAlertLoginPwd":"修改登录密码",
"txtPayPasswordSetTip":"支付密码设置",
"txtSoftName":"我的游易客",
"txtBalance":"账户余额",
"txtChange":"更换",
"txtAlert":"修改",
"txtAlertPayPasswordTip":"修改支付密码",
"txtUnSet":"未设置",
"txtAlreadBindPhone":"已绑定手机",
"txtLoginNameTip":"登录名",
"txtLoginPassword":"登录密码",
"txtPayPassword":"支付密码",
"txtMyGame":"我的游戏",
"txtMyOrder":"我的订单",
"txtShowPhoto":"图片显示",
"txtClearCachePhoto":"清除缓存图片",
"txtHelpCenter":"帮助中心",
"txtAdviseSubmit":"意见反馈",
"txtAdviseSubmitDes":"欢迎您提出宝贵的意见和建议，您留下的每个字都将用来改善我们的软件。",
"txtContactCustomService":"联系客服",
"txtAbout":"关于",
"txtVersionUpdate":"版本更新",
"txtCustomServiceProtocol":"服务协议",
"txtExitAccount":"退出账号",
"txtMyAccount":"我的账户",
"txtLockBalance":"冻结余额",
"txtCanUseBalance":"可用余额",
"txtAlertNickFailedTip":"更改昵称失败！",
"txtVersion":"版本号：v",
"txtOfficalWebsite":"WEB网站：HTTP://WWW.YOOKE.COM",
"txtCustomServiceTime":"客服时间：工作日9:00-24:00",
"txtCompanyName":"北京深蓝之光网络技术有限公司",
"txtAboutOur":"关于我们",
"txtUseHelp":"使用帮助",
"txtSpecialDesTip":"特别说明",
"txtSpecialDes":" 本网站在国家相关法律法规规定的范围内，只按现有状况提供虚拟物品在线交易第三方网络平台服务，\
本网站及其所有者非交易一方，也非交易任何一方之代理人或代表；同时，\
本网站及其所有者也未授权任何人代表或代理本网站及其所有者从事任何网络交易行为或做出任何承诺、\
保证或其他类似行为，除非有明确的书面授权。",

"txtCustomHelpSubTip1":"1.支付安全问题如何保证？",
"txtCustomHelpSubDes1":"  • 移动支付会通过密钥、安全插件、手机短信验证码、风险控制等技术手段来校验使用者身份，保证您的资金安全。\n\
  • 在使用支付时遇到资金盗刷等小概率事件时，第三方支付公司将给予全额赔付。",

"txtCustomHelpSubTip2":"2.为何要进行安全绑定？",
"txtCustomHelpSubDes2":"• 游易客建议您在注册账号时密码尽量设置复杂，切记不可账号，密码一致，或使用一些简单数字，并且在注册之后，请尽快进行邮箱、手机号等安全绑定。\n\
• 如遇账号泄露、被盗等事件时，第一时间联系客服并通过安全绑定信息，暂时冻结您的账号，避免您的财产收到侵害。官方唯一客服：010-88577123。",

"txtCustomHelpSubTip3":"3.如何购买商品？",
"txtCustomHelpSubDes3":"（1）登录游易客个人账户。\n\
（2）选择游戏种类-->选中所要购买的商品-->查看商品详  情-->点击“立即购买”-->填写订单信息-->点击“提交订单”--“确认支付”。\n\
（3）联系客服，确认收货。",

"txtSoftHelpTipTitle":"1.《游易客》介绍",
"txtCustomHelpTipTitle":"2.《游易客》优势",

"txtSoftHelpTip1":"  《游易客》是以\"互联网中最了解用户的商务平台\"为产品设计理念的游戏虚拟物品交易平台。\
主要为玩家提供首充新号、首充续充、苹果代充的交易服务，更多游戏更多服务陆续开发中，敬请期待。\n",
  
"txtSoftHelpTip2":"  游易客独特的运营模式使得整个交易过程更加正规、更加安全、更加高效，极大程度的降低交易过程中所存在的不确定风险。\n\
  账号、道具、游戏币被盗的几率将大大降低，交易后账号被封、物品被找回也很大程度降低了可能性。\n\
  力求让让玩家卖的舒心，买的安心。 ",
 
"txtServerProtocolTip":"  欢迎阅读服务条款协议，\
		本协议阐述之条款和条件适用于您使用游易客交易平台yooek.com网站（以下简称“网站”）的各种功能和享受的各项网站服务（以下简称“服务”）。\
		本服务协议双方为本网站所有者北京深蓝之光网络技术有限公司（以下简称“本公司”）与本网站用户，本服务协议具有合同效力。\
		本服务协议内容包括本协议正文及所有本网站已经发布的或将来可能发布的各类规则、声明等各项规范网站运营及明确本公司和用户权利义务、责任的文件资料。\
		所有规则、声明等均为本服务协议不可分割的一部分，与本服务协议具有同等法律效力。\n\   \n\
		  用户在使用本网站提供的各项服务的同时，承诺接受并遵守本服务协议及各项相关规则、声明的规定。本网站有权根据需要不时制定、\
		修改本协议或各类规则、声明，如本协议有任何变更，将在网站上以刊载公告的方式通知予用户。如用户不同意相关变更，\
		必须停止使用本网站各项功能和享受各项“服务”。经修订的协议一经在本网站上公布，立即自动生效。各类规则、声明等会在发布后生效，\
		亦成为本协议的一部分。登录或继续使用本网站各项功能或享受各项“服务”将表示用户接受经修订的协议。除另行明确声明外，\
		任何使“服务”范围扩大或功能增强的新内容均受本协议约束。\n\  \n\
		  按照国家对未成年人保护的相关法律法规规定及国家对网络游戏进行管理的相关要求：游易客交易平台加入身份验证系统。\
		将对注册时所填写的帐号身份证信息进行验证。凡未填写身份信息（真实姓名、身份证号码）、\
		身份证号码年龄在18岁以下以及身份证号码与姓名不符的用户帐号，将不支持使用游易客交易平台功能。\
		在用户点击“同意”选项确认本服务协议后，本服务协议即在用户与本公司之间产生法律效力。\
		请用户务必在注册之前认真阅读全部服务协议内容，如有任何疑问，可向本网站咨询。\
		鉴于本网站无法掌控和确定用户是否已仔细阅读服务协议内容，且阅读与否责任并不在本网站和本公司，因此特别声明如下：\n\   \n\
			   （1）无论用户事实上是否在注册之前认真阅读本服务协议，只要用户点击注册页面的“同意”选项，并按照网站注册程序成功注册为用户，\
			   即视为用户已经全文阅读并接受本服务协议之全部内容，本服务协议即在本公司和用户之间签订，对双方具有约束力。\n\  \n\
			   （2）本协议仅系本公司与本网站用户间因使用本网站而产生的权利义务关系，不涉及本网站用户之间网上交易而产生的法律关系及法律纠纷。",

