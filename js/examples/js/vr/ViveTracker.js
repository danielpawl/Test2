THREE.ViveTracker = function ( id ) {

	THREE.Object3D.call( this );

	var scope = this;
	var gamepad;
	id = id;

	
	function findGamepad( id ) {

		// Iterate across gamepads as Vive Controllers may not be
		// in position 0 and 1.

		var gamepads = navigator.getGamepads && navigator.getGamepads();

		for ( var i = 0, j = 0; i < gamepads.length; i ++ ) {

            var gamepad = gamepads[ i ];
            
            

			if ( gamepad && ( gamepad.id === 'OpenVR Tracker' || gamepad.id === 'OpenVR Gamepad' || gamepad.id.startsWith( 'Oculus Touch' ) || gamepad.id.startsWith( 'Spatial Controller' ) ) ) {

				if ( j === id ) {
                   
                    return gamepad;
                }
				j ++;

			}

		}

	}

	this.matrixAutoUpdate = false;
	this.standingMatrix = new THREE.Matrix4();

	this.getGamepad = function () {
       

		return gamepad;

    };
    
    function getID(id) {
        console.log('the id is:' + id);
    }

	
	


	this.update = function () {

		gamepad = findGamepad( id );

		if ( gamepad !== undefined && gamepad.pose !== undefined ) {

			if ( gamepad.pose === null ) return; // No user action yet

			//  Position and orientation.

			var pose = gamepad.pose;
			if ( pose.position !== null ) scope.position.fromArray( pose.position );
			if ( pose.orientation !== null ) scope.quaternion.fromArray( pose.orientation );
			scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
			scope.matrix.premultiply( scope.standingMatrix );	
			scope.matrixWorldNeedsUpdate = true;
			scope.visible = true;


		} else {

			scope.visible = false;

		}
		
		

    };
}

		

THREE.ViveTracker.prototype = Object.create( THREE.Object3D.prototype );
THREE.ViveTracker.prototype.constructor = THREE.ViveTracker;