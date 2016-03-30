if(!window.aisFeature)
{
//---------------------------------------------------------------------------
window.aisTypes.aisFeatureOwner=function()
{
	this.features={};
};

//---------------------------------------------------------------------------
window.aisTypes.aisFeatureOwner.addFeature=function(feature,owner)
{
	var slot,def;
	slot=this.features[feature];
	def=aisEnv.defLib.feature[feature];
	if(!def)
	{
		//TODO: Report error;
		return 0;
	}
	if(!slot)
	{
		slot=this.features[feature]=new aisTypes.FeatureSlot(def);
		
	}
	slot.list.push(new aisTypes.Feature(def,owner));
};

//---------------------------------------------------------------------------
window.aisTypes.aisFeatureOwner.removeFeature=function(feature,owner)
{
	var slot;
	var list,i,n;
	owner=owner?owner:null;
	slot=this.features[feature];
	if(slot)
	{
		list=slot.list;
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i].owner==owner)
			{
				list.splice(i,1);
				return;
			}
		}
		//TODO: Report error
		DBOut("aisFeatureOwner.removeFeature Error: "+feature+", owner:"+owner+": "+owner.type);
	}
	else
	{
		//TODO: Report error
		DBOut("aisFeatureOwner.removeFeature Error: "+feature);
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisFeatureOwner.hasFeature=function(feature,checkOwner)
{
	if(this.features[feature])
	{
		return 1;
	}
	if(this.owner && checkOwner)
		return this.owner.hasFeature(feature,1);
	return 0;
};

//---------------------------------------------------------------------------
window.aisTypes.aisFeatureOwner.getMissingFeatures=function(features,checkOwner)
{
	var i,n;
	var missed=[];
	n=features.length;
	for(i=0;i<n;i++)
	{
		if(!this.features[features[i]])
		{
			missed.push(features[i]);
		}
	}
	if(missed.length)
	{
		if(checkOwner && this.owner)
			return this.owner.getMissingFeatures(missed,1);
		return missed;
	}
	return 0;
};

//***************************************************************************
//***************************************************************************
window.aisTypes.Feature=function(def,owner)
{
	this.def=def;
	this.owner=owner?owner:null;
	this.busy=0;
};


//***************************************************************************
//***************************************************************************
window.aisTypes.FeatureSlot=function(def)
{
	this.def=def;
	this.busy=0;
	this.list=[];
};
}
