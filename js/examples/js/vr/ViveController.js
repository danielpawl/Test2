/**
 * @author mrdoob / http://mrdoob.com
 * @author stewdio / http://stewd.io
 */
THREE.ViveController = function ( id ) {

	THREE.Object3D.call( this );

	var scope = this;
	var gamepad;
	id= id;

	var axes = [ 0, 0 ];
	var thumbpadIsPressed = false;
	var triggerIsPressed = false;
	var gripsArePressed = false;
	var menuIsPressed = false;

	const vibeChannel = []
	vibeChannel.name = ''
	vibeChannel.intensity = 0
	this.vibeChannels = [ vibeChannel ]
	this.vibeChannels.intensity = 0
	this.vibeChannels.prior = 0
	

	function findGamepad( id ) {

		// Iterate across gamepads as Vive Controllers may not be
		// in position 0 and 1.

		var gamepads = navigator.getGamepads && navigator.getGamepads();

		for ( var i = 0, j = 0; i < gamepads.length; i ++ ) {

			var gamepad = gamepads[ i ];

			if ( gamepad && ( gamepad.id === 'OpenVR Gamepad' || gamepad.id.startsWith( 'Oculus Touch' ) || gamepad.id.startsWith( 'Spatial Controller' ) ) ) {

				if ( j === id ) return gamepad;

				j ++;

			}

		}

	}

	this.matrixAutoUpdate = false;
	this.standingMatrix = new THREE.Matrix4();

	this.getGamepad = function () {

		return gamepad;

	};

	
	

	this.getButtonState = function ( button ) {

		if ( button === 'thumbpad' ) return thumbpadIsPressed;
		if ( button === 'trigger' ) return triggerIsPressed;
		if ( button === 'grips' ) return gripsArePressed;
		if ( button === 'menu' ) return menuIsPressed;

	};

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

			//  Thumbpad and Buttons.

			if ( axes[ 0 ] !== gamepad.axes[ 0 ] || axes[ 1 ] !== gamepad.axes[ 1 ] ) {

				axes[ 0 ] = gamepad.axes[ 0 ]; //  X axis: -1 = Left, +1 = Right.
				axes[ 1 ] = gamepad.axes[ 1 ]; //  Y axis: -1 = Bottom, +1 = Top.
				scope.dispatchEvent( { type: 'axischanged', axes: axes } );

			}

			if ( thumbpadIsPressed !== gamepad.buttons[ 0 ].pressed ) {

				thumbpadIsPressed = gamepad.buttons[ 0 ].pressed;
				scope.dispatchEvent( { type: thumbpadIsPressed ? 'thumbpaddown' : 'thumbpadup', axes: axes } );

			}

			if ( triggerIsPressed !== gamepad.buttons[ 1 ].pressed ) {

				triggerIsPressed = gamepad.buttons[ 1 ].pressed;
				scope.dispatchEvent( { type: triggerIsPressed ? 'triggerdown' : 'triggerup' } );

			}

			if ( gripsArePressed !== gamepad.buttons[ 2 ].pressed ) {

				gripsArePressed = gamepad.buttons[ 2 ].pressed;
				scope.dispatchEvent( { type: gripsArePressed ? 'gripsdown' : 'gripsup' } );

			}

			if ( menuIsPressed !== gamepad.buttons[ 3 ].pressed ) {

				menuIsPressed = gamepad.buttons[ 3 ].pressed;
				scope.dispatchEvent( { type: menuIsPressed ? 'menudown' : 'menuup' } );

			}
			this.applyVibes(gamepad);	//for vibrations

		} else {

			scope.visible = false;

		}
		
		

	};
	//=================================================== Vibrations ==============================================
	this.applyVibes = function(gamepad){


		if( gamepad.hapticActuators && 
			gamepad.hapticActuators[ 0 ]){
	
			const
			renderedIntensity = this.renderVibes(),
			now = window.performance.now()
	
			if( renderedIntensity !== this.vibeChannels.prior ||
				now - this.vibeChannels.lastCommanded > VIBE_TIME_MAX / 2 ){
	
				this.vibeChannels.lastCommanded = now
				gamepad.hapticActuators[ 0 ].pulse( renderedIntensity, VIBE_TIME_MAX )
				this.vibeChannels.prior = renderedIntensity
			}
		}
	}

	this.renderVibes = function(){


		//  First we need to clear away any past-due commands,
		//  and update the current intensity value.
	
		const 
		now = window.performance.now(),
		controller = this
	
		controller.vibeChannels.forEach( function( channel ){
	
			while( channel.length && now > channel[ 0 ][ 0 ]){
	
				channel.intensity = channel[ 0 ][ 1 ]
				channel.shift()
			}
			if( typeof channel.intensity !== 'number' ) channel.intensity = 0
		})
	
	
		//  Now each channel knows its current intensity so we can sum those values.
		
		const sum = Math.min( 1, Math.max( 0, 
		
			this.vibeChannels.reduce( function( sum, channel ){
		
				return sum + +channel.intensity
		
			}, 0 )
		))
		this.vibeChannels.intensity = sum
		return sum
	}

	var VIBE_TIME_MAX = 5 * 1000;

	this.setVibe = function(name, intensity){
	if( typeof name === 'number' && intensity === undefined ){

		intensity = name
		name = ''
	}
	if( typeof name === 'string' ){

		const controller = this,
		o = {}


		//  If this channel does not exist yet we must create it,
		//  otherwise we want to remove any future commands 
		//  while careful NOT to delete the ‘intensity’ property.

		let channel = controller.vibeChannels.find( function( channel ){

			return channel.name === name
		})
		if( channel === undefined ){

			channel = []
			channel.name = name
			channel.intensity = 0
			controller.vibeChannels.push( channel )
		}
		else channel.splice( 0 )


		//  If we received a valid intensity then we should apply it now,
		//  but if not we’ll just hold on to the previously reported intensity.
		//  This allows us to reselect a channel and apply a wait() command
		//  before applying an initial set() command!

		if( typeof intensity === 'number' ) channel.intensity = intensity
		else {

			if( typeof channel.intensity === 'number' ) intensity = channel.intensity

			
			//  But if we’re SOL then we need to default to zero.

			else intensity = 0
		}

		let cursor = window.performance.now()
		o.set = function( intensity ){

			channel.push([ cursor, intensity ])
			return o
		}
		o.wait = function( duration ){

			cursor += duration
			return o
		}
		return o
	} 
} 
//========================================Paint Mode======================================================
	var PI2 = Math.PI * 2;

	var MODES = { COLOR: 0, SIZE: 1 };
	var mode = MODES.COLOR;

	var color = new THREE.Color( 1, 1, 1 );
	var size = 1.0;

	paintActive = false;


	// COLOR UI

	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { 
		map: generateHueTexture(),
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.8
	 });
	var colorUI = new THREE.Mesh( geometry, material );
	colorUI.position.set( 0, 0.02, - 0.1 );				//colorUI.position.set( 0, 0.005, 0.0495 );	
	colorUI.rotation.x = - 1.45;
	colorUI.scale.setScalar( 0.1 );
	this.add( colorUI );
	

	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	material.color = color;
	var ball = new THREE.Mesh( geometry, material );
	colorUI.add( ball );

	colorUI.visible = false;


	// SIZE UI
	var sizeUI = new THREE.Group();
	sizeUI.position.set( 0, 0.005, 0.0495 );
	sizeUI.rotation.x = - 1.45;
	sizeUI.scale.setScalar( 0.02 );
	this.add( sizeUI );

	var triangleShape = new THREE.Shape();
	triangleShape.moveTo( 0, -1 );
	triangleShape.lineTo( 1, 1 );
	triangleShape.lineTo( -1, 1 );

	var geometry = new THREE.ShapeGeometry( triangleShape );
	var material = new THREE.MeshBasicMaterial( { color: 0x222222, wireframe:true } );
	var sizeUIOutline = new THREE.Mesh( geometry, material ) ;
	sizeUIOutline.position.z = 0.001;
	resizeTriangleGeometry(sizeUIOutline.geometry, 1.0);
	sizeUI.add( sizeUIOutline );

	var geometry = new THREE.ShapeGeometry( triangleShape );
	var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide } );
	material.color = color;
	var sizeUIFill = new THREE.Mesh( geometry, material ) ;
	sizeUIFill.position.z = 0.0011;
	resizeTriangleGeometry(sizeUIFill.geometry, 0.5);
	sizeUI.add( sizeUIFill );

	sizeUI.visible = false;


	function generateHueTexture() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 256;
		canvas.height = 256;

		var context = canvas.getContext( '2d' );
		var imageData = context.getImageData( 0, 0, 256, 256 );
		var data = imageData.data;
		var swatchColor = new THREE.Color();

		for ( var i = 0, j = 0; i < data.length; i += 4, j ++ ) {

			var x = ( ( j % 256 ) / 256 ) - 0.5;
			var y = ( Math.floor( j / 256 ) / 256 ) - 0.5;

			swatchColor.setHSL( Math.atan2( y, x ) / PI2, 1,( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );

			data[ i + 0 ] = swatchColor.r * 256;
			data[ i + 1 ] = swatchColor.g * 256;
			data[ i + 2 ] = swatchColor.b * 256;
			data[ i + 3 ] = 256;

		}

		context.putImageData( imageData, 0, 0 );

		return new THREE.CanvasTexture( canvas );

	}

	


	var lastPos = new THREE.Vector3();
	function onAxisChanged( event ) {

		if (  paintActive === false ) return;

		sizeUI.visible = true;
		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;

		if (colorUI.visible === true && event.axes[0] !== 0 && event.axes[1] !== 0){
			color.setHSL( Math.atan2( y, x ) / PI2, 1, ( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );
			ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		}
		

		if ( colorUI.visible === false && event.axes[1] !== 0) {

			var ratio = (0.5 - y);
			size = ratio * 2;
			resizeTriangleGeometry(sizeUIFill.geometry, ratio);
		}
	}

	function resizeTriangleGeometry(geometry, ratio) {

		var x = 0, y = 0;
		var fullWidth = 0.75, fullHeight = 1.5;
		var angle = Math.atan( ( fullWidth / 2 ) / fullHeight );

		var bottomY = y - fullHeight / 2;
		var height = fullHeight * ratio;
		var width = ( Math.tan( angle ) * height ) * 2;

		geometry.vertices[ 0 ].set( x, bottomY, 0 );
		geometry.vertices[ 1 ].set( x + width / 2, bottomY + height, 0 );
		geometry.vertices[ 2 ].set( x - width / 2, bottomY + height, 0 );

		geometry.verticesNeedUpdate = true;

	}

	/*function onGripsDown( event ) {

		if ( mode === MODES.COLOR ) {
			mode = MODES.SIZE;
			colorUI.visible = false;
			sizeUI.visible = true;
			return;
		}

		if ( mode === MODES.SIZE ) {
			mode = MODES.COLOR;
			colorUI.visible = true;
			sizeUI.visible = false;
			return;
		}

	} */

	this.getColorUIState = function() {return colorUI.visible; };
	this.getColor = function () { return color; };
	this.getSize = function () { return size; };
	this.toggleColorUI = function () {
		if (colorUI.visible === false){
			colorUI.visible = true;
		} else if (colorUI.visible === true){
			colorUI.visible = false;
		}
	}

	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown1 );

	this.paintOn = function() {
		paintActive = true;
		//colorUI.visible = true;
	}


	this.paintOff = function() {
		paintActive = false;
		colorUI.visible = false;
	}

};

THREE.ViveController.prototype = Object.create( THREE.Object3D.prototype );
THREE.ViveController.prototype.constructor = THREE.ViveController;
