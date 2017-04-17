app.controller('ContentCtrl', ['$scope', '$log', 'particleCloud',
	function($scope, $log, particleCloud) {
		$log.debug('instance: ContentCtrl');
		var canvas = document.getElementById('wrap-for-particle');
		var particleCloudObj = new particleCloud(canvas);
		particleCloudObj.startDraw();
	}
]);
