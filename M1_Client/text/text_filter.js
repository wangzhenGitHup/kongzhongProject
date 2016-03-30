if(__Page.appEnv && !__Page.appEnv.textFilter)
{
	__Page.appEnv.textFilter={
		check:function(text){
			var list=this.textLib;
			var sign=[" ",",",".",":","\'","\"","，","。","：","‘","’","“","”","、"];
			var i,j,txt=[],have;
			for(i=0; i<text.length; i++)
			{
				have=0;
				for(j=0; j<sign.length; j++)
				{
					if(text[i]==sign[j])
					{
						have=1;
						break;
					}
				}
				if(!have)
					txt.push(text[i]);
			}
			txt=txt.join("");
			for(var i=0; i<list.length; i++)
			{
				if(txt.indexOf(list[i])>-1)
					return 1;
			}
			return 0;
		},
		textLib:[
			<include check=0>"text/text_filter_"+(window.LanguageStr?window.LanguageStr:"cn")+".js"</include>
		],
	}
}