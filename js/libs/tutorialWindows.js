//==========================Window for buttons=============================================================================
        function tutorialWindows(){
                //Main menu
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
                var lineMat = new THREE.LineBasicMaterial({color: 0x0D3846});           //Material for all lines

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
    