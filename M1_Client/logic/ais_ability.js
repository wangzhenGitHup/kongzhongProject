if(!window.aisAbility)
{
//---------------------------------------------------------------------------
window.aisTypes.aisAbilityOwner=function()
{
	this.abilities=[];
};

//---------------------------------------------------------------------------
window.aisTypes.aisAbilityOwner.addAbility=function(ability,owner)
{
	var def;
	def=aisEnv.defLib[ability];
	if(def)
	{
		this.abilities.push({ability:ability,def:def,owner:owner});
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisAbilityOwner.removeAbility=function(ability,owner)
{
	var list,i,n;
	list=this.abilities;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i].ability==ability && list[i].owner==owner)
		{
			list.splice(i,1);
			return;
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisAbilityOwner.removeAbilityOwner=function(owner)
{
	var list,i,n;
	list=this.abilities;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i].owner==owner)
		{
			list.splice(i,1);
			i--;n--;
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisAbilityOwner.hasAbility=function(ability)
{
	var list,i,n;
	list=this.abilities;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i].ability==ability)
			return 1;
	}
	return 0;
};
}
