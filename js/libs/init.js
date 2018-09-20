
var scene, render, renderer, dollyCam, camera, viveController, clock, cube;
var tutorialWindows = new THREE.Object3D();
var dragCube = false;
var firstTimePressed = false;
var tempMatrix = new THREE.Matrix4();
var intersected = [];
var rayGeo, raycaster;
var rayGroup = new THREE.Group();
var robo;
var manager;
var menuStep = 0;
var prevMenuStep = 0;
var mode = [];
var menuLevel = [];
var menuCreated = false;
var targetNext;
var targetNo = 0;
var prevTarget = 0;
var axisX;
var axisY;
var trackpadTrackerInit = true;
var tracker;

//====================== for paint mode =======================================
var vector1 = new THREE.Vector3();
var vector2 = new THREE.Vector3();
var vector3 = new THREE.Vector3();
var vector4 = new THREE.Vector3();
var up = new THREE.Vector3( 0, 1, 0 );

var point4 = new THREE.Vector3();
var point5 = new THREE.Vector3();

var pivot;                                      //painting is created from this point
var shapes = {};
var paintLine;
var toggleState = true;
var paintState = true;


init();
render();
        
//=================================Init=Function==========================================================
function init(){
            
    //======================= Loading Manager ==================================================== 

        manager = new THREE.LoadingManager( () => {									//KUDOS MUGEN87
            const loadingScreen = document.getElementById( 'loading-screen' );
            loadingScreen.classList.add( 'fade-out' );
            // optional: remove loader from DOM via event listener
            //loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
        } );

    //====================== Basic Setup =========================================================
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); //0xd8d3cb

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.vr.enabled = true;
        renderer.vr.standing = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(renderer.domElement);
        
        document.body.appendChild(WEBVR.createButton(renderer));    //WEBVR BUTTON

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
        dollyCam = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
        dollyCam.add(camera);
        scene.add(dollyCam);

        clock = new THREE.Clock(); 

        var floorGeo = new THREE.PlaneBufferGeometry(200, 200, 20, 20);
        var floorMat = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 1.0,
            metalness: 0.0
        });
        var floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.set(0,0,0);
        floor.rotateX(-90* Math.PI/180);
        floor.receiveShadow = true;
        rayGroup.add(floor);


        scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );
        var point = new THREE.DirectionalLight(0xffffff);
        point.castShadow = true;
        point.shadow.camera.top = 2;
        point.shadow.camera.bottom = -2;
        point.shadow.camera.right = 2;
        point.shadow.camera.left = -2;
        point.shadow.mapSize.set( 4096, 4096 );
        point.shadow.mapSize.set( 4096, 4096 );
        scene.add(point);
        point.position.set(0,10,0);

        var cubeGeo = new THREE.BoxBufferGeometry(2,2,2);
        var cubeMat = new THREE.MeshStandardMaterial({color: 0x00ff00});
        cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(camera.position.x, camera.position.y, camera.position.z -5);
        cube.castShadow = true;
        cube.receiveShadow = true;
        rayGroup.add(cube);
        
        scene.add(rayGroup);

        
    
        

        
    //====================== Controller ============================================

        viveController = new THREE.ViveController(0);
        viveController.standingMatrix = renderer.vr.getStandingMatrix();
        viveController.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		viveController.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
        scene.add(viveController);
        loadController();

        createTutorial();

        

    
    //====================== RayCaster ============================================

        rayGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
        line = new THREE.Line(rayGeo);
        line.name = 'line';
        line.scale.z = 5;
        viveController.add(line.clone());
        raycaster = new THREE.Raycaster();

    //===================== Functions ================================================
    
    robo();
    createTracker();
    initGeometry()


}
//=========================== Init End===================================================

//================================ Render ===============================================

function render(){

    viveController.update();
    renderer.setAnimationLoop(render);
    renderer.render(scene, camera);
    
    if(dragCube == true){
        cube.position.y += 0.05;
    }
    if(clock.getElapsedTime() >= 30 || firstTimePressed === true){
        viveController.remove(tutorialWindows);
    };
    cleanIntersected();
    intersectObjects(viveController);
    if(clock.getElapsedTime() >= 2){
        robo.rotation.z += 0.01;
    };

    var count = paintLine.geometry.drawRange.count;
    handleController(viveController);
    updateGeometry( count, paintLine.geometry.drawRange.count );
    
}

//================================= Render End ================================================


//================================= Controller Load ============================================
function loadController() {

    var loader = new THREE.OBJLoader();
    loader.setPath('models/obj/vive-controller/');
    loader.load('vr_controller_vive_1_5.obj', function(object) {
            var loader = new THREE.TextureLoader();
            loader.setPath('models/obj/vive-controller/');
            var controller = object.children[0];
            controller.material.map = loader.load('onepointfive_texture.png');
            controller.material.specularMap = loader.load('onepointfive_spec.png');
            viveController.add(object.clone());
        });
        viveController.add(tutorialWindows);

 
    }
    
viveController.addEventListener('triggerdown', onTriggerDown);
viveController.addEventListener('triggerup', onTriggerUp);
viveController.addEventListener('axischanged', axisChanged);
viveController.addEventListener('thumbpaddown', onThumbpadDown);
viveController.addEventListener('thumbpadup', onThumbpadUp);
viveController.addEventListener('gripsdown', onGripsDown);
viveController.addEventListener('gripsup', onGripsUp);
viveController.addEventListener('menudown', onMenuDown);
viveController.addEventListener('menuup', onMenuUp);


function onTriggerDown(){
        if(firstTimePressed == false){
            firstTimePressed = true;
        } 



    
}

function onTriggerUp(){
        dragCube = false;
        if (paintState === false){
            paintState = true;
        }
 
    
}
 
function axisChanged(a){
    axisX = a.axes[0];
    axisY = -a.axes[1];

    tracker.visible = true;
    
    trackpadTracker(axisX, axisY);


}

function onThumbpadDown(){
    //robo.visible = true;
       /* if(targetNo == 0){
            targetNo = 1;
            menu();
            return;
        } if(targetNo == 1){
            targetNo = 0;
            menu();
            return;
        } */

    if (axisX >= 0.5 && targetNo == 0){
        targetNo = 1;
        menu();
        return;
    } if (axisX <= -0.5 && targetNo == 1){
        targetNo = 0;
        menu();
        return;
    }
    if( menuStep === 1 && targetNo === 1) {
        viveController.paintOn();
        menuStep = 0;
        menu();
    }

}
function onThumbpadUp(){
    toggleState = true;
}

function onGripsDown(){
    if (menuStep !== 0){
        menuStep -= 1;
        menu();
    }
  
}

function onGripsUp(){

}

function onMenuDown(){
    if(menuStep === 0){
        if (prevMenuStep >= 1){
            menuStep = prevMenuStep;
            menu();
        } else {
        menuStep = 1;
        menu();
        }
        return;
    } if (menuStep !== 0){
        prevMenuStep = menuStep;
        menuStep = 0;
        menu();

    }
}

function onMenuUp(){

}
//============================= Trackpad position =====================================================
function createTracker(){
    if (trackpadTrackerInit == true){
    var geometry = new THREE.CircleBufferGeometry(0.002 , 32);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    tracker = new THREE.Mesh(geometry, material);
    viveController.add(tracker)
    tracker.position.set(0, 0.01 , 0.05);
    tracker.rotateX(-90* Math.PI/ 180);
    trackpadTrackerInit = false;
    tracker.visible = false;
    }
}

function trackpadTracker(x, y){

        tracker.position.set(x/50 , 0.01 , y/50 + 0.05);

}


//============================= RayCaster =============================================================

function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    return raycaster.intersectObjects(rayGroup.children, true); 					// recursive true, to hit all object.child !

}

function intersectObjects(obj) {

    // Do not highlight when already selected
    if (obj.userData.selected !== undefined) return;

    var line = obj.getObjectByName('line');
    var intersections = getIntersections(obj);

    if (intersections.length > 0) {
        var intersection = intersections[0];
        var object = intersection.object;

        object.material.emissive.r = 1;
        intersected.push(object);
        line.scale.z = intersection.distance;
    }
    else {
        line.scale.z = 5;
    }
}

function cleanIntersected() {

    while (intersected.length) {
        var object = intersected.pop();
        object.material.emissive.r = 0;
    }
}

//==============================Robo=================================================================
function robo(){
    var colladaLoader = new THREE.ColladaLoader(manager);
    var textureLoader = new THREE.TextureLoader(manager);
    var dae;
    var oldMat = new THREE.MeshBasicMaterial() ;
    colladaLoader.load('models/dae/robo/kuka-kr5-r650.dae', function(collada){
        dae = collada.scene;
        dae.traverse( function ( node ) {
            if ( node instanceof THREE.Mesh){
                oldMat.color = node.material.color
                node.material = oldMat;
                node.castShadow = true;
                node.flatShading = true;
            } 
        }); 


        dae.scale.set(0.15 , 0.15, 0.15);
        scene.add(dae);
        viveController.add(dae);
        dae.position.set(0, -0.015, -0.045);
        dae.rotateX(-60* Math.PI/180);
        robo = dae;
        robo.visible = false;

    },
    function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },

    function ( error ) {
    console.log( 'An error happened' )
    })
    
} 

//========================== Window for buttons ==========================================================

function createTutorial(){
    //Main menu
        var loader = new THREE.TextureLoader(manager);
        var textMainMenuGeo = new THREE.PlaneBufferGeometry(0.1, 0.05);
        var textMainMenuMat = new THREE.MeshBasicMaterial({
            map: loader.load('images/text/mainmenu.png'),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
            });
        var textMainMenu = new THREE.Mesh(textMainMenuGeo, textMainMenuMat);

        tutorialWindows.add(textMainMenu);                                  //Add window to parent
        textMainMenu.position.set(0, 0.01 , -0.1 );                         //Position to parent
        textMainMenu.rotateX(-90 * Math.PI / 180);                          //Rotation for better view


    //Trigger
        var textTriggerGeo = new THREE.PlaneBufferGeometry(0.1, 0.05);
        var textTriggerMat = new THREE.MeshBasicMaterial({
            map: loader.load('images/text/trigger.png'),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        var textTrigger = new THREE.Mesh(textTriggerGeo, textTriggerMat);

        tutorialWindows.add(textTrigger);
        textTrigger.position.set(-0.15 , -0.05, 0.05);
        textTrigger.rotateX(-90 * Math.PI / 180);


    //Trackpad
        var textTrackpadGeo = new THREE.PlaneBufferGeometry(0.1, 0.05);
        var textTrackpadMat = new THREE.MeshBasicMaterial({
            map: loader.load('images/text/trackpad.png'),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        var textTrackpad = new THREE.Mesh(textTrackpadGeo, textTrackpadMat);

        tutorialWindows.add(textTrackpad);
        textTrackpad.position.set(0.15 , 0.02, 0.05);
        textTrackpad.rotateX(-90 * Math.PI / 180);
    

    //Grip

    //System


//Connection lines button to window
    var lineMat = new THREE.LineBasicMaterial({color: 0x00ffff});           //Material for all lines

    //Main menu
        var lineMainGeo = new THREE.Geometry();
        lineMainGeo.vertices.push(new THREE.Vector3(0, 0.01, -0.075), new THREE.Vector3(0, 0.007, 0.015));      //vertices for the line

        var lineMain = new THREE.Line(lineMainGeo, lineMat);
        tutorialWindows.add(lineMain);                                      //Add line to parent
    
    //Trigger
        var lineTriggerGeo = new THREE.Geometry();
        lineTriggerGeo.vertices.push(new THREE.Vector3(-0.1, -0.05, 0.05), new THREE.Vector3(0, -0.035, 0.05));

        var lineTrigger = new THREE.Line(lineTriggerGeo, lineMat);
        tutorialWindows.add(lineTrigger);
    
    //Trackpad
        var lineTrackpadGeo = new THREE.Geometry();
        lineTrackpadGeo.vertices.push(new THREE.Vector3(0.1, 0.02, 0.05), new THREE.Vector3(0, 0.005, 0.05));

        var lineTrackpad = new THREE.Line(lineTrackpadGeo, lineMat);
        tutorialWindows.add(lineTrackpad);

    //Grip

    //System
    
//Glowing tutorial windows
    var textGlowMat = new THREE.SpriteMaterial({                          //Material for all windows
            map: loader.load('images/textures/glow.png'),
            color: 0x0D3846,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    
    //Main menu
        var textMainGlow = new THREE.Sprite(textGlowMat);               
        textMainGlow.scale.set(0.15, 0.15, 0.05);
        textMainMenu.add(textMainGlow);                                   //Add sprite to window
        textMainGlow.position.set(0, 0, -0.01);                           //Set position behind window (better performance)

    //Trigger
        var textTriggerGlow = new THREE.Sprite(textGlowMat);
        textTriggerGlow.scale.set(0.15, 0.15, 0.05);
        textTrigger.add(textTriggerGlow);
        textTriggerGlow.position.set(0, 0, -0.01);

    //Trackpad
        var textTrackpadGlow = new THREE.Sprite(textGlowMat);
        textTrackpadGlow.scale.set(0.15, 0.15, 0.05);
        textTrackpad.add(textTriggerGlow);
        textTrackpadGlow.position.set(0, 0, -0.01);

    //Grip

    //System

    return;
}

//==================== Configurator ===================================================================

function menu(){
    var target;
  
    
    if (menuCreated ===false){
        createMenu();                            //creates all objects for menu
    }

    function createMenu(){                  //function for creating objects for menu
        var loader = new THREE.TextureLoader(manager);
        var modePos = new THREE.Vector3(-0.05 , 0.0 , -0.15);

        //======================== Modes =====================
        menuLevel[0] = new THREE.Object3D();
        var modeMat = [];

        modeGeo = new THREE.PlaneBufferGeometry(0.05, 0.05);
        modeMat[0] = new THREE.MeshBasicMaterial({
            map: loader.load('./images/symbols/mode_configurator.png'),
            side: THREE.DoubleSide,
            
        });
        
        modeMat[1] = new THREE.MeshBasicMaterial({
            map: loader.load('./images/symbols/mode_paint.png'),
            side: THREE.DoubleSide,
        })

      for (var i = 0; i <= 1; i++){
            mode[i] = new THREE.Mesh(modeGeo, modeMat[i]);
        } 
        
        modeFrameGeo = [];
        for (var i = 0; i <= (mode.length - 1); i++){
            modeFrameGeo[i] = [0 , 1 , 2 , 3];

            modeFrameGeo[i][0] = new THREE.Mesh(new THREE.BoxBufferGeometry(0.005, 0.003, 0.061), new THREE.MeshBasicMaterial({color: 0xffffff}));   //right
            modeFrameGeo[i][0].position.set((mode[i].geometry.parameters.height/2.0) + modeFrameGeo[i][0].geometry.parameters.height , 0 , 0 );
            modeFrameGeo[i][0].rotateX(-90 * Math.PI / 180);

            modeFrameGeo[i][1] = new THREE.Mesh(new THREE.BoxBufferGeometry(0.005, 0.003, 0.061), new THREE.MeshBasicMaterial({color: 0xffffff}));   //left
            modeFrameGeo[i][1].position.set((-mode[i].geometry.parameters.height/2.0) - modeFrameGeo[i][0].geometry.parameters.height , 0 , 0 );
            modeFrameGeo[i][1].rotateX(-90 * Math.PI / 180);

            modeFrameGeo[i][2] = new THREE.Mesh(new THREE.BoxBufferGeometry(0.005, 0.003, 0.051), new THREE.MeshBasicMaterial({color: 0xffffff}));   //top
            modeFrameGeo[i][2].position.set(0 , (mode[i].geometry.parameters.height/2.0) + modeFrameGeo[i][0].geometry.parameters.height , 0 );
            modeFrameGeo[i][2].rotateX(-90 * Math.PI / 180);
            modeFrameGeo[i][2].rotateY(-90 * Math.PI / 180);

            modeFrameGeo[i][3] = new THREE.Mesh(new THREE.BoxBufferGeometry(.005, 0.003, 0.051), new THREE.MeshBasicMaterial({color: 0xffffff}));   //bottom
            modeFrameGeo[i][3].position.set(0 , (-mode[i].geometry.parameters.height/2.0) - modeFrameGeo[i][0].geometry.parameters.height , 0 );
            modeFrameGeo[i][3].rotateX(-90 * Math.PI / 180);
            modeFrameGeo[i][3].rotateY(-90 * Math.PI / 180);
            

        } 
        

        for (var i = 0; i <= (mode.length-1); i++){
           for (var j = 0; j <= 3; j++){
                mode[i].add(modeFrameGeo[i][j])
            } 
            
            mode[i].position.set(modePos.x, modePos.y, modePos.z);
            mode[i].rotateX(-75* Math.PI / 180);
            modePos.x +=  0.1;
            menuLevel[0].add(mode[i]);
            //menuLevel[0].visible = false;
            viveController.add(menuLevel[0]);
        } 

        menuCreated = true;
    } 
    
    return menuNavi(menuStep);

    function menuNavi(menuStep){
        switch(menuStep){
            case 0:
                menuLevel[0].visible = false;
                break;
            case 1:
                menuLevel[0].visible = true;

                    target(targetNo);

  
                break;
            case 2:
                break;
        }
    }

    function target(n){
        if (prevTarget == n){
            mode[n].traverse( function ( node ) {
                if ( node instanceof THREE.Mesh){
                    node.material.color.setHex(0x00ff00);
                } 
            });
           // mode[n].scale.set(1.5 , 1.5, 1.5);
        } else {
            mode[prevTarget].traverse( function ( node ) {
                if ( node instanceof THREE.Mesh){
                    node.material.color.setHex(0xffffff);
                   // node.scale.set(1, 1, 1);
                } 
            });
        }
        mode[n].traverse( function ( node ) {
            if ( node instanceof THREE.Mesh){
                node.material.color.setHex(0x00ff00);
                //node.scale.set(1.5, 1.5, 1.5);
            } 
        });
        prevTarget = n;
    }
}


//===================================================== Paint function ==============================================================


    function initGeometry() {
            pivot = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 0.01, 2 ) );           //Init for pivot
            pivot.name = 'pivot';
            pivot.position.y = -0.016;
            pivot.position.z = -0.043;
            pivot.rotation.x = Math.PI / 5.5;
            viveController.add( pivot );
            pivot.visible = false;
            pivot.material = pivot.material.clone();
        

            var geometry = new THREE.BufferGeometry();                                              
            var positions = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );    //geometry for painted line
            positions.dynamic = true;
            geometry.addAttribute( 'position', positions );
            var normals = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
            normals.dynamic = true;
            geometry.addAttribute( 'normal', normals );
            var colors = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
            colors.dynamic = true;
            geometry.addAttribute( 'color', colors );
            geometry.drawRange.count = 0;
            //
        
            var material = new THREE.MeshStandardMaterial( {
                roughness: 0.9,
                metalness: 0.0,
                // envMap: reflectionCube,
                vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            } );
            paintLine = new THREE.Mesh( geometry, material );
            paintLine.frustumCulled = false;
            paintLine.castShadow = true;
            paintLine.receiveShadow = true;
            scene.add( paintLine );
            // Shapes
            shapes[ 'tube' ] = getTubeShapes( 1.0 );                    //calles function for creating tube shape
    }

    function getTubeShapes( size ) {                                    //function for creating tube shape
        var PI2 = Math.PI * 2;
        var sides = 10;
        var array = [];
        var radius = 0.01 * size;
        for( var i = 0; i < sides; i ++ ) {
            var angle = ( i / sides ) * PI2;
            array.push( new THREE.Vector3( Math.sin( angle ) * radius, Math.cos( angle ) * radius, 0 ) );
        }
        return array;
    }




    function stroke( controller, point1, point2, matrix1, matrix2 ) {   //function to paint line in VR
        var color = controller.getColor();
        var shapes = getTubeShapes( controller.getSize() );
        var geometry = paintLine.geometry;
        var attributes = geometry.attributes;
        var count = geometry.drawRange.count;
        var positions = attributes.position.array;
        var normals = attributes.normal.array;
        var colors = attributes.color.array;
        for ( var j = 0, jl = shapes.length; j < jl; j ++ ) {
            var vertex1 = shapes[ j ];
            var vertex2 = shapes[ ( j + 1 ) % jl ];
            // positions
            vector1.copy( vertex1 );
            vector1.applyMatrix4( matrix2 );
            vector1.add( point2 );
            vector2.copy( vertex2 );
            vector2.applyMatrix4( matrix2 );
            vector2.add( point2 );
            vector3.copy( vertex2 );
            vector3.applyMatrix4( matrix1 );
            vector3.add( point1 );
            vector4.copy( vertex1 );
            vector4.applyMatrix4( matrix1 );
            vector4.add( point1 );
            vector1.toArray( positions, ( count + 0 ) * 3 );
            vector2.toArray( positions, ( count + 1 ) * 3 );
            vector4.toArray( positions, ( count + 2 ) * 3 );
            vector2.toArray( positions, ( count + 3 ) * 3 );
            vector3.toArray( positions, ( count + 4 ) * 3 );
            vector4.toArray( positions, ( count + 5 ) * 3 );
            // normals
            vector1.copy( vertex1 );
            vector1.applyMatrix4( matrix2 );
            vector1.normalize();
            vector2.copy( vertex2 );
            vector2.applyMatrix4( matrix2 );
            vector2.normalize();
            vector3.copy( vertex2 );
            vector3.applyMatrix4( matrix1 );
            vector3.normalize();
            vector4.copy( vertex1 );
            vector4.applyMatrix4( matrix1 );
            vector4.normalize();
            vector1.toArray( normals, ( count + 0 ) * 3 );
            vector2.toArray( normals, ( count + 1 ) * 3 );
            vector4.toArray( normals, ( count + 2 ) * 3 );
            vector2.toArray( normals, ( count + 3 ) * 3 );
            vector3.toArray( normals, ( count + 4 ) * 3 );
            vector4.toArray( normals, ( count + 5 ) * 3 );
            // colors
            color.toArray( colors, ( count + 0 ) * 3 );
            color.toArray( colors, ( count + 1 ) * 3 );
            color.toArray( colors, ( count + 2 ) * 3 );
            color.toArray( colors, ( count + 3 ) * 3 );
            color.toArray( colors, ( count + 4 ) * 3 );
            color.toArray( colors, ( count + 5 ) * 3 );
            count += 6;
        }
        geometry.drawRange.count = count;
    }

    function updateGeometry( start, end ) {             //render function: updating painted geometry
        if ( start === end ) return;
        var offset = start * 3;
        var count = ( end - start ) * 3;
        var geometry = paintLine.geometry;
        var attributes = geometry.attributes;
        attributes.position.updateRange.offset = offset;
        attributes.position.updateRange.count = count;
        attributes.position.needsUpdate = true;
        attributes.normal.updateRange.offset = offset;
        attributes.normal.updateRange.count = count;
        attributes.normal.needsUpdate = true;
        attributes.color.updateRange.offset = offset;
        attributes.color.updateRange.count = count;
        attributes.color.needsUpdate = true;
    }

    function handleController( controller ) {           //render function: handle controller for paint mode
        var pivot = controller.getObjectByName( 'pivot' );
        if (paintActive === true){
            pivot.visible = true;
            if ( pivot ) {
                pivot.material.color.copy( controller.getColor() );
                pivot.scale.setScalar(controller.getSize());
                var matrix = pivot.matrixWorld;
                var point1 = controller.userData.points[ 0 ];
                var point2 = controller.userData.points[ 1 ];
                var matrix1 = controller.userData.matrices[ 0 ];
                var matrix2 = controller.userData.matrices[ 1 ];
                point1.setFromMatrixPosition( matrix );
                matrix1.lookAt( point2, point1, up );
                if ( controller.getButtonState( 'trigger' ) ) {
                    if( controller.getColorUIState() === false && paintState === true){
                    stroke( controller, point1, point2, matrix1, matrix2 );
                    } if( controller.getColorUIState() === true){
                        controller.toggleColorUI();
                        paintState = false;
                    }
                }
                if (controller.getButtonState('thumbpad')){
                    if (toggleState === true){
                        controller.toggleColorUI();
                        toggleState = false;
                    }
                } 

                point2.copy( point1 );
                matrix2.copy( matrix1 );
                
            }
        } else {
            pivot.visible = false;
            
        }
    }