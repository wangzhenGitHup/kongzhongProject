if(__Page.appEnv && !__Page.appEnv.textLib)
{
	__Page.appEnv.textLib={
		getText:function(text,args){
			var i;
			for(i in args){
				text = text.replace("<"+i+">",  args[i]);
			}
			return text;
		},
		getTextEx:function(text,args){
			var textEx = this[text];
			var i;
			for(i in args){
				textEx = textEx.replace("<"+i+">",  args[i]);
			}
			return textEx;
		},
		<include check="0">"text/text_ui_"+window.LanguageStr+".js"</include>
	};
}
