/**
 *
 * Scene to test the use of SKYLINE.PlaneGeometry
 *
 */

var scene       = new SKYLINE.Scene();
var camera      = new SKYLINE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 30, 1000 );
var renderer    = new SKYLINE.WebGLRenderer({
    autoClear: true,
    autoClearColor: new SKYLINE.Color(0, 0, 0, 0)
});

function createPlane()
{
    var plane = new SKYLINE.PlaneGeometry( 100, 100, 10, 10 );

    /*
     * Create a new mesh.
     */
    var mat = new SKYLINE.BasicColorMaterial( new SKYLINE.Color(0, 100, 255, 1) );
    var mesh = new SKYLINE.Mesh( plane, mat );

    scene.add( mesh );

    scene.setCamera( camera );

    camera.position.z = 0;

    mesh.position.x = random(-300, 300);
    mesh.position.y = random(-300, 300);
    mesh.position.z = random(-50, 0);
}

for( var i = 0; i < 10; ++i )
{
    createPlane();
}

setInterval(function() {
    loop();
}, 1000 / 60 );

function loop()
{
    camera.position.z -= .1;

    renderer.render( scene );
}

function random(from,to)
{
    return Math.floor( Math.random() * ( to - from + 1 ) + from );
}