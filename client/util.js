function fetchMultivers(url) {
  return fetch( new Request(url, {
    headers: {
      user: localStorage.getItem('user')
    }
  }) )
}

function createLight( color ) {
  var intensity = 1.5;
  var pointLight = new THREE.PointLight( color, intensity, 20 );
  pointLight.castShadow = true;
  pointLight.shadow.camera.near = 1;
  pointLight.shadow.camera.far = 60;
  pointLight.shadow.bias = - 0.005; // reduces self-shadowing on double-sided objects
  var geometry = new THREE.SphereBufferGeometry( 0.6, 12, 6 );
  var material = new THREE.MeshBasicMaterial( { color: color } );
  material.color.multiplyScalar( intensity );
  var sphere = new THREE.Mesh( geometry, material );
  pointLight.add( sphere );
  var texture = new THREE.CanvasTexture( generateTexture() );
  texture.magFilter = THREE.NearestFilter;
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set( 1, 3.5 );
  var geometry = new THREE.SphereBufferGeometry( 1.5, 32, 8 );
  var material = new THREE.MeshPhongMaterial( {
    side: THREE.DoubleSide,
    alphaMap: texture,
    alphaTest: 0.5
  } );
  var sphere = new THREE.Mesh( geometry, material );
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  pointLight.add( sphere );
  // custom distance material
  var distanceMaterial = new THREE.MeshDistanceMaterial( {
    alphaMap: material.alphaMap,
    alphaTest: material.alphaTest
  } );
  sphere.customDistanceMaterial = distanceMaterial;
  return pointLight;
}

function generateTexture() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = 2;
  canvas.height = 2;
  var context = canvas.getContext( '2d' );
  context.fillStyle = 'white';
  context.fillRect( 0, 1, 2, 1 );
  return canvas;
}
