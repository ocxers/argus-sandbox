argo.post('Reporting:Reporting:createFolder',{
	sType: 'DASH',
	sName: 'test folder dashboards'
},function(success,result){
	if (!success) return;
	var id = result;
	
	argo.post('Reporting:Reporting:createDashboard',{
		nFolderID: id,
		sName: 'test dashboard'
	},function(success,result){
		if (!success) return;
		console.log(result);
	});
});

argo.post('Reporting:Reporting:createFolder',{
	sType: 'REPT',
	sName: 'test folder reports'
},function(success,result){
	if (!success) return;
	var id = result;
	
	argo.post('Reporting:Reporting:createReport',{
		nFolderID: id,
		sName: 'test report'
	},function(success,result){
		if (!success) return;
		console.log(result);
	});
});

argo.post('Reporting:Reporting:createFolder',{
	sType: 'SLIDE',
	sName: 'test folder slideshows'
},function(success,result){
	if (!success) return;
	var id = result;
	
	argo.post('Reporting:Reporting:createSlideshow',{
		nFolderID: id,
		sName: 'test slideshow'
	},function(success,result){
		if (!success) return;
		console.log(result);
	});
});

// wait and then test the load methods
setTimeout(function(){
	
	argo.post('Reporting:Reporting:loadDashboards',{},function(success,result){
		if (!success) return;
		console.log(result);
		
		argo.post('Reporting:Reporting:saveDashboards',{
			folders: result
		},function(success,result){
			if (!success) return;
			console.log(result);
		});
	});
	
	argo.post('Reporting:Reporting:loadReports',{},function(success,result){
		if (!success) return;
		console.log(result);
		
		argo.post('Reporting:Reporting:saveReports',{
			folders: result
		},function(success,result){
			if (!success) return;
			console.log(result);
		});
	});
	
	argo.post('Reporting:Reporting:loadSlideshows',{},function(success,result){
		if (!success) return;
		console.log(result);
		
		argo.post('Reporting:Reporting:saveSlideshows',{
			folders: result
		},function(success,result){
			if (!success) return;
			console.log(result);
		});
	});
	
	argo.post('Reporting:Reporting:getTreeFavorites',{},function(success,result){
		if (!success) return;
		console.log(result);
	});
	
},1000*5);