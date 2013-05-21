(function(){
	window.Argo = function(cfg){
		this.url = cfg.url;
		this.baseParams = cfg.baseParams || {};
		
		this.setBaseParams = function(obj) {
			Ext.apply(this.baseParams, obj);
		};
		
		this.post = function(method, params, callback, scope) {
			params   = params || {};
			callback = callback || function(){};
			scope    = scope || window;
			
			var jsonData = Ext.apply({}, params, this.baseParams);
			$.ajax({
				type: 'POST',
				url: this.url + method,
				data: JSON.stringify(jsonData),
				dataType: 'json',
				success: function(response){
					var success = (response.success === true);
					var result = (success ? response.result : response.errormsg);
					if (!success) {
						Ext.Msg.alert('Error',result);
					}
					callback.call(scope, success, result);
				},
				error: function(response){
					Ext.Msg.alert('Error','Unable to connect to server...');
					callback.call(_scope, false, response);
				},
				context: this
			});
		};
		return this;
	};
}).call(this);