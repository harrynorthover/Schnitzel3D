/**
 *
 * @project skyline
 * @author harry.northover
 * @time 17:31 06/05/2013
 *
 * Basic setup test.
 *
 */

var scene       = new SKYLINE.Scene();
var camera      = new SKYLINE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 30, 1000 );
var renderer    = new SKYLINE.WebGLRenderer({
    autoClear: true,
    autoClearColor: new SKYLINE.Color(255, 0, 0, 1),
    fullscreen: false
});

var g = new SKYLINE.Geometry();

/*
 * Create the vertices that represent a triangle.
 */
var t_v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( -200, -100, -300 ) );
var t_v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( 0, -100, -300 ) );
var t_v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( 0, 50, -300 ) );

var v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( t_v1.position.x, t_v1.position.y, t_v1.position.z ) );
var v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( t_v2.position.x, t_v2.position.y, t_v2.position.z ) );
var v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( t_v3.position.x, t_v3.position.y, t_v3.position.z ) );

v1.position.toString();
v2.position.toString();
v3.position.toString();

g.vertices.push( v1, v2, v3 );

/*
 * Add a triangle with references to the vertices.
 */
var t = new SKYLINE.Triangle( 0, 1, 2 );

g.faces.push( t );

g.mergeGeometry();
g.computeVertexNormals();

/*
 * Create a new mesh.
 */
var mat = new SKYLINE.ShaderMaterial( { fragement:getShader('shader-fs'), vertex:getShader('shader-vs') } );
var mesh = new SKYLINE.Mesh( g, mat );

scene.add( mesh );

/*
 * Set the camera.
 */
scene.setCamera( camera );

//camera.position.z = -300;

setInterval(function() {
    loop();
}, 200);

function loop()
{
    //mesh.scale.x += .01;
    //mesh.scale.z += .01;

    //mesh.rotation.y += .0001;
    //mesh.rotation.z += .0001;

    //mesh.position.z -= 1;

    camera.position.z += 10;

    renderer.render( scene );
}