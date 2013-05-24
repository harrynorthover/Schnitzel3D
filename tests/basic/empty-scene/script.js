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
    fullscreen: true
});

var g = new SKYLINE.Geometry();

/*
 * Create the vertices that represent a triangle.
 */
var v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( 0, -1, 0 ) );
var v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( -1, -1, 0 ) );
var v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( 1, 0, 0 ) );

g.vertices.push( v1, v2, v3/*, v3, v2, v1, v1*/ );

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
var mesh = new SKYLINE.Mesh( g, new SKYLINE.BasicColorMaterial( new SKYLINE.Color( 0, 255, 0 ) ) );

scene.add( mesh );

/*
 * Set the camera.
 */
scene.setCamera( camera );

renderer.render( scene );