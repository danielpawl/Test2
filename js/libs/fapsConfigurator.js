THREE.FAPSConfigurator = function() {
    THREE.Object3D.call( this );
    var menuLevel = [];
    var mode = [];

    this.createBasisMenu = function(number){                  //function for creating objects for menu
        var loader = new THREE.TextureLoader();
        var modePos = new THREE.Vector3(-0.05 , 0.0 , -0.15);

        //======================== Modes =====================
        menuLevel[0] = new THREE.Object3D();                    //0 = basis menu

        geometry = new THREE.PlaneBufferGeometry(0.05, 0.05);
        material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, 
        });

        for(var i = 0; i <= mode.length -1 ; i++){
            mode[i] = new THREE.Mesh(geometry, material)
        }

        
        var modeFrameGeo = [];
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
            ding.add(menuLevel[0]);
        } 

        menuCreated = true;
    } 
    
    return menuNavi(menuStep);

    function menuNavi(menuStep){
        switch(menuStep){
            case 0:
                menuLevel[0].visible = false;   //mode menu
                menuLevel[1].visible = false;   //configurator menu
                break;

            case 1:
                menuLevel[0].visible = true;
                    target(targetNo);
                break;

            case 2:
                menuLevel[0].visible = false;
                menuLevel[1].visible = true;
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
//===================================================== Configurator ===============================================================
    function initConfigurator(){

        ding.add(menuLevel[1]);
        
        var loader = new THREE.TextureLoader(manager);
        var Pos = new THREE.Vector3(-0.1 , 0.0 , -0.15);
        var config = [];


        menuLevel[1] = new THREE.Object3D();
        var Mat = [];

        var Geo = new THREE.PlaneBufferGeometry(0.03, 0.03);
        Mat[0] = new THREE.MeshBasicMaterial({
            map: loader.load('./images/symbols/mode_configurator.png'),
            side: THREE.DoubleSide,
            
        });
        
        Mat[1] = new THREE.MeshBasicMaterial({
            map: loader.load('./images/symbols/mode_paint.png'),
            side: THREE.DoubleSide,
        })

      for (var i = 0; i <= 1; i++){
            config[i] = new THREE.Mesh(Geo, Mat[i]);
        } 
        
        FrameGeo = [];
        for (var i = 0; i <= (config.length - 1); i++){
            FrameGeo[i] = [0 , 1 , 2 , 3];

            FrameGeo[i][0] = new THREE.Mesh(new THREE.BoxBufferGeometry(0.003, 0.002, 0.037), new THREE.MeshBasicMaterial({color: 0xffffff}));   //right
            FrameGeo[i][0].position.set((config[i].geometry.parameters.height/2.0) + FrameGeo[i][0].geometry.parameters.height , 0 , 0 );
            FrameGeo[i][0].rotateX(-90 * Math.PI / 180);

            FrameGeo[i][1] = new THREE.Mesh(new THREE.BoxBufferGeometry(0.003, 0.002, 0.037), new THREE.MeshBasicMaterial({color: 0xffffff}));   //left
            FrameGeo[i][1].position.set((-config[i].geometry.parameters.height/2.0) - FrameGeo[i][0].geometry.parameters.height , 0 , 0 );
            FrameGeo[i][1].rotateX(-90 * Math.PI / 180);

            FrameGeo[i][2] = new THREE.Mesh(new THREE.BoxBufferGeometry(0.003, 0.002, 0.031), new THREE.MeshBasicMaterial({color: 0xffffff}));   //top
            FrameGeo[i][2].position.set(0 , (config[i].geometry.parameters.height/2.0) + FrameGeo[i][0].geometry.parameters.height , 0 );
            FrameGeo[i][2].rotateX(-90 * Math.PI / 180);
            FrameGeo[i][2].rotateY(-90 * Math.PI / 180);

            FrameGeo[i][3] = new THREE.Mesh(new THREE.BoxBufferGeometry(0.003, 0.002, 0.031), new THREE.MeshBasicMaterial({color: 0xffffff}));   //bottom
            FrameGeo[i][3].position.set(0 , (-config[i].geometry.parameters.height/2.0) - FrameGeo[i][0].geometry.parameters.height , 0 );
            FrameGeo[i][3].rotateX(-90 * Math.PI / 180);
            FrameGeo[i][3].rotateY(-90 * Math.PI / 180);
            

        } 
        

        for (var i = 0; i <= (config.length-1); i++){
           for (var j = 0; j <= 3; j++){
                config[i].add(FrameGeo[i][j])
            } 
            
            config[i].position.set(Pos.x, Pos.y, Pos.z);
            config[i].rotateX(-75* Math.PI / 180);
            Pos.z +=  0.1;
            menuLevel[1].add(config[i]);
            //menuLevel[0].visible = false;
            ding.add(menuLevel[1]);
        } 


    }
}