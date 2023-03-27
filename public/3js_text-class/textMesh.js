// this class creates a bouncing text object
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export class textMesh {
  // the constructor is a special function which is called when we create a new
  // 'instance' of this class
  constructor(x, y, z, text, scene) {
    this.position = new THREE.Vector3(x, y, z);
    // console.log(this.position);
    this.text = text;
    this.scene = scene;

    const loader = new FontLoader();

    this.frameCount = 0;
    this.zSpeed = 100;
    this.zDist = Math.random() * 100;

    this.textMeshId;
    // load the font, then save it into our class,
    loader.load("../fonts/fangsong_regular.typeface.json", (font) => {
      this.font = font;
      this.addTextGeometry();
      // this.addRaycastGeo();
    });
  }

  addTextGeometry() {
    let geo = new TextGeometry(this.text, {
      font: this.font,
      size: 2,
      height: 0.25,
      curveSegments: 12,
    });
    geo.center();

    let mat = new THREE.MeshBasicMaterial({
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.rotation.x = 90;
    this.scene.add(this.mesh);
    // this.mesh.position.copy(this.position); // copy the position vector we created in the constructor
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    this.mesh.layers.set(0); // set layer

  }

  update(speed) {
    this.frameCount++;
    var speedUnit = 1; //very fast on load.
    this.speed = speed;

    // animate the mesh if it exists yet
    if (this.mesh) {
      if (this.speed >= 1){ // if mouse is moving
        speedUnit = - this.speed/300;
        if (this.mesh.position.z < this.position.z){
          this.mesh.position.z = this.position.z;
        }
      }
      if (this.speed < 1) {
        speedUnit = 0.7;
      }

      this.mesh.position.z += speedUnit;

      if (this.mesh.position.z >= 40){
        this.mesh.position.z = this.position.z;
      }
      
      // console.log(this.mesh.position.z);

    }

  }


  // onRaycast(mouse, camera, textMeshObjects){
  //   this.mouse = mouse;
  //   this.camera = camera;
  //   this.textMeshObjects = textMeshObjects;

  //   var raycaster = new THREE.Raycaster();
  //   raycaster.setFromCamera(this.mouse, this.camera);
  //   // console.log(textMeshObjects.length);
  //   const intersects = raycaster.intersectObjects(this.textMeshObjects);
  
  //   console.log(this.mouse);
  
  //   // // run an intersection check 
  //   // if (intersects.length > 0 ){
  //   //   for (let i = 0; i < 8; i++) {
  //   //     // console.log(intersects[i]);
  //   //     // intersects[i].object.position.y = 0;	
  //   //     let captionIndex = textpairs.find(function(textImg) {
  //   //       return textImg.flowText === textpairs[i].flowText; //Change 3 to what you want to search for
  //   //     });
  //   //     caption.innerHTML = captionIndex.cap;
  //   //   }
  //   // } else{
  //   //   caption.innerHTML = "[...]";
  //   // }
  // }


}

// textMesh.raycastMesh = class{

// }