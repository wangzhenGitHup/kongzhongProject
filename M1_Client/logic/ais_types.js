if(!window.aisTypes)
{
window.aisTypes={};

//---------------------------------------------------------------------------
//让一个对象继承一种数据类型
window.aisTypes.applyType=function(obj,type)
{
	var i;
	type.call(obj);
	for(i in type)
	{
		if(typeof(type[i])=="function")
		{
			if(!obj[i])//如果该函数没有被重载，那就添加该函数
			{
				obj[i]=type[i];
			}
		}
	}
};

}
