if(!window.aisTypes.aisViewConnect)
{
//---------------------------------------------------------------------------
window.aisTypes.aisViewConnect=function()
{
	this.uiViews={};//与该对象相关的view
};

//---------------------------------------------------------------------------
//将一个ui控件与当前建筑相关联
window.aisTypes.aisViewConnect.addUIView=function(view,viewId)
{
	viewId=viewId?viewId:view.viewId;
	this.uiViews[viewId]=view;
	if(view.aisUpdateView && typeof view.aisUpdateView =="function")
	{
		view.aisUpdateView();
	}
};
//---------------------------------------------------------------------------
//取消一个控件与当前建筑的关联
window.aisTypes.aisViewConnect.removeUIView=function(view,viewId)
{
	viewId=viewId?viewId:view.viewId;
	if(this.uiViews[viewId] && this.uiViews[viewId]==view)
	{
		this.uiViews[viewId]=null;
		delete this.uiViews[viewId];
	}
};
//---------------------------------------------------------------------------
//将与当前建筑相关联的控件都设置为需要更新
window.aisTypes.aisViewConnect.makeViewsDirty=function()
{
	var i,list,view;
	list=this.uiViews;
	for(i in list)
	{
		view=list[i];
		if(view.deadOut && view.viewId)
		{
			this.uiViews[view.viewId]=null;
			delete this.uiViews[view.viewId];
		}
		else
		{
			this.env.addDirtyView(view);
		}
	}
};

}
