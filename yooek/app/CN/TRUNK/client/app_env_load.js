//*********************************************************
//**************************下载环境**********************
//*********************************************************
{
	__Page.appEnv.DownLoadCore = function()
	{
		//如果有需要下载的核心文件
		if(this.checkVo.coreFiles.length)
		{
			this.page.stateLogin.loading(
				{
					preTxt:this.page.STR.Downloading,
					steps:this.checkVo.coreFiles.length,
					cb:this.onDownLoadCore,
					cbobj:this,
					minpercent:19,
					maxpercent:22
				}
			);
			//此时因为，没有list的属性，所以在stateLogin界面中不会进入到stepIn函数中，会执行下面的下载流程 
			//下载数组 this.checkVo.coreFiles 指定的一组文件到 cache中。
			//下载完成一个文件jiu 执行回调函数一次，参数 function(error, url) , url 为下载完成的文件 URL。
			//此时的回调函数为上面的onDownLoadCore
			this.downloadStub = System.download(this.checkVo.coreFiles, this.page.stateLogin.stepIn, this.page.stateLogin);
		}
		else
		{
			this.DownLoad();
		}
	};
	
	__Page.appEnv.onDownLoadCore = function(finish, error, url)
	{
		//下载完成了再检查一次
		if(finish)
		{
			this.downloadStub = null;
			setFrameout(0, this.DownLoad, this);
		}
	};
	
	__Page.appEnv.DownLoad = function(url)
	{
		var list = [], i, j, filename, found;
	
		//vo中需要删除的文件列表
		for(i = 0; i < this.checkVo.filelist[0].file.length; i++)
		{
			filename = this.checkVo.filelist[0].file[i];
			found = false;
			for(j = 0; j < jmlList.length; j++)
			{
				if(jmlList[j] == filename)
				{
					found = true;
					break;
				}
			}
			if(!found)
			{
				for(j = 0; j < defList.length; j++)
				{
					if(defList[j] == filename)
					{
						found = true;
						break;
					}
				}
			}
			
			//都没有，则将此vo中需要删除的文件压栈
			if(!found)
			{
				list.push(this.page.genPageURL(filename));
			}
		}
		
		//文件列表没有，就启动软件
		if(!list.length)
		{
			this.startSoft();
			return;
		}

		//有文件则下载
		this.page.stateLogin.loading(
			{
				preTxt:this.page.STR.Downloading,
				steps:list.length,
				cb:this.onDownLoad,
				cbobj:this,
				minpercent:23,
				maxpercent:40
			}
		);
		
		//执行完下载进入回调函数onDownLoad中
		this.downloadStub = System.download(list, this.page.stateLogin.stepIn, this.page.stateLogin);
		/*var list = [FilesURL + url];
		DBOut("list---: " + list[0]);
		this.downloadStub = System.download(list,function(a,b,c){DBOut("111111111111111: " + a + ", " + b + ", " + c);} , this);*/
	};
	
	__Page.appEnv.onDownLoad = function(finish, error, url)
	{
		DBOut("+++++++++++onDownLoad " + finish + "=" + url + " needReload=" + this.needReload);
		if(finish)
		{
			this.downloadStub = null;
			//需要重新下载
			if(this.needReload)
			{
				this.edLayer.resGC();
				jgx.App.switchApp(this.page.genPageURL(mainPath));
			}
			else
			{
				this.form.setFrameout(0, this.startSoft, this);
			}
		}
	};
}