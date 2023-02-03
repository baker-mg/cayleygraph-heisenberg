import * as THREE from 'three';
import * as math from 'mathjs';
import CameraControls from 'camera-controls';

CameraControls.install( { THREE: THREE } );
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();

const container = document.getElementById('container');

renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setPixelRatio(window.devicePixelRatio);
container.append(renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 500 );
camera.position.set( 16, 16, 16 );
camera.lookAt( 8, 8, 8 );

const scene = new THREE.Scene();

const cameraControls = new CameraControls( camera, renderer.domElement );

const xarrow = new THREE.ArrowHelper(
    new THREE.Vector3(1,0,0),
    new THREE.Vector3(0,0,0),
    10,
    0xFFFFFF,
    0.5,
    0.1
)

const yarrow = new THREE.ArrowHelper(
    new THREE.Vector3(0,1,0),
    new THREE.Vector3(0,0,0),
    10,
    0xFFFFFF,
    0.5,
    0.1
)

const zarrow = new THREE.ArrowHelper(
    new THREE.Vector3(0,0,1),
    new THREE.Vector3(0,0,0),
    10,
    0xFFFFFF,
    0.5,
    0.1
)


scene.add(xarrow);
scene.add(yarrow);
scene.add(zarrow);

const size = 10;
const LINE_COUNT = 300*((size+1)**3);
let geom = new THREE.BufferGeometry();
geom.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(6*LINE_COUNT), 3)
);
geom.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(6*LINE_COUNT), 3)
);
let mat = new THREE.LineDashedMaterial({
    vertexColors: true,
    dashSize: 1,
    gapSize: 1e10
});

let lines = new THREE.LineSegments(geom, mat);
scene.add(lines);

const a = math.matrix([
    [1,1,0],
    [0,1,0],
    [0,0,1]
]);
const b = math.matrix([
    [1,0,0],
    [0,1,1],
    [0,0,1]
]);
const c = math.matrix([
    [1,0,1],
    [0,1,0],
    [0,0,1]
])


let line_index = 0;

let pos = geom.getAttribute("position");
let pa = pos.array;

let col = geom.getAttribute('color');
let ca = col.array;
let points = [];

for (let i=0; i <= size; i++) {
    for (let j=0; j <= size; j++) {
        for (let k=0; k <= size; k++) {
            points.push([i,j,k])
        }
    }
}

points.sort((a, b) => {
    const da = math.sqrt(a[0]**2 + a[1]**2 + a[2]**2);
    const db = math.sqrt(b[0]**2 + b[1]**2 + b[2]**2);
    return da-db
})

const pf = 0.1

points.forEach(([i,j,k]) => {
    const pMat = math.matrix([
        [1, i, j],
        [0, 1, k],
        [0, 0, 1]
    ]);
    const aeMat = math.multiply(pMat, a);
    const beMat = math.multiply(pMat, b);
    const ceMat = math.multiply(pMat, c);

    
    for (let g =pf; g<=1; g = g+pf) {
        pa[6*line_index] = i + (g-pf)*(math.subset(aeMat, math.index(0, 1)) - i);
        pa[6*line_index+1] = j +(g-pf)*(math.subset(aeMat, math.index(0,2))-j);
        pa[6*line_index+2]= k + (g-pf)*(math.subset(aeMat, math.index(1, 2)) - k);
        pa[6*line_index+3] = i + (g)*(math.subset(aeMat, math.index(0, 1)) - i);
        pa[6*line_index+4] = j +(g)*(math.subset(aeMat, math.index(0,2))-j);
        pa[6*line_index+5] =  k + (g)*(math.subset(aeMat, math.index(1, 2)) - k);
        
        ca[6*line_index] = 0;
        ca[6*line_index+1] = 1;
        ca[6*line_index+2]= 0;
        ca[6*line_index+3] = 0;
        ca[6*line_index+4] = 1;
        ca[6*line_index+5]= 0;
        
        line_index = line_index + 1;
    }

    for (let g =pf; g<=1; g = g+pf) {
        pa[6*line_index] = i + (g-pf)*(math.subset(beMat, math.index(0, 1)) - i);
        pa[6*line_index+1] = j +(g-pf)*(math.subset(beMat, math.index(0,2))-j);
        pa[6*line_index+2]= k + (g-pf)*(math.subset(beMat, math.index(1, 2)) - k);
        pa[6*line_index+3] = i + (g)*(math.subset(beMat, math.index(0, 1)) - i);
        pa[6*line_index+4] = j +(g)*(math.subset(beMat, math.index(0,2))-j);
        pa[6*line_index+5] =  k + (g)*(math.subset(beMat, math.index(1, 2)) - k);
        
        ca[6*line_index] = 1;
        ca[6*line_index+1] = 0;
        ca[6*line_index+2]= 0;
        ca[6*line_index+3] = 1;
        ca[6*line_index+4] = 0;
        ca[6*line_index+5]= 0;
        
        line_index = line_index + 1;
    }

    for (let g =pf; g<=1; g = g+pf) {
        pa[6*line_index] = i + (g-pf)*(math.subset(ceMat, math.index(0, 1)) - i);
        pa[6*line_index+1] = j +(g-pf)*(math.subset(ceMat, math.index(0,2))-j);
        pa[6*line_index+2]= k + (g-pf)*(math.subset(ceMat, math.index(1, 2)) - k);
        pa[6*line_index+3] = i + (g)*(math.subset(ceMat, math.index(0, 1)) - i);
        pa[6*line_index+4] = j +(g)*(math.subset(ceMat, math.index(0,2))-j);
        pa[6*line_index+5] =  k + (g)*(math.subset(ceMat, math.index(1, 2)) - k);
        
        ca[6*line_index] = 0;
        ca[6*line_index+1] = 0;
        ca[6*line_index+2]= 1;
        ca[6*line_index+3] = 0;
        ca[6*line_index+4] = 0;
        ca[6*line_index+5]= 1;
        
        line_index = line_index + 1;
    }
});


lines.geometry.setDrawRange(0,0);
let drawcount = 0;
( function anim () {

	const delta = clock.getDelta();
	const elapsed = clock.getElapsedTime();
	const updated = cameraControls.update( delta );

	// if ( elapsed > 30 ) { return; }

	requestAnimationFrame( anim );

    drawcount = (drawcount +1) %(6*LINE_COUNT);

    lines.geometry.setDrawRange(0,drawcount);

	if ( updated ) {

		renderer.render( scene, camera );
		console.log( 'rendered' );

	}
    renderer.render( scene, camera );
} )();
renderer.render( scene, camera );
