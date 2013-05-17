/**
 *
 * @project skyline
 * @author Harry
 * @time 14:01 22/04/2013
 *
 */

module( "SKYLINE.Vector3" );

test( "constructor",
    function() {
        var v = new SKYLINE.Vector3(2,3,4);
        var v2 = new SKYLINE.Vector3(v);

        ok(v.x == 2);
        ok(v.y == 3);
        ok(v.z == 4);

        ok(v2.x == 2);
        ok(v2.y == 3);
        ok(v2.z == 4);
});

test( "add",
    function() {
        var v1 = new SKYLINE.Vector3(2,1,4);
        var v2 = new SKYLINE.Vector3(2,1,4);

        v1.add(v2);

        ok(v1.x == 4);
        ok(v1.y == 2);
        ok(v1.z == 8);
});

test( "subtract",
    function() {
        var v1 = new SKYLINE.Vector3(2,1,4);
        var v2 = new SKYLINE.Vector3(2,1,4);

        v1.sub(v2);

        ok(v1.x == 0);
        ok(v1.y == 0);
        ok(v1.z == 0);
});

test( "vectorMultiplication",
    function() {
        var v1 = new SKYLINE.Vector3(2,1,4);
        var v2 = new SKYLINE.Vector3(2,1,4);

        v1.multiply(v2);

        ok(v1.x == 4);
        ok(v1.y == 1);
        ok(v1.z == 16);
});

test( "scalarMultiplication",
    function() {
        var v1 = new SKYLINE.Vector3(2,1,4);

        v1.multiply(10);

        ok(v1.x == 20);
        ok(v1.y == 10);
        ok(v1.z == 40);
});

test( "cross product",
    function() {
        var v1 = new SKYLINE.Vector3(2, 1, 4);
        var v2 = new SKYLINE.Vector3(3, 3, 3);
        var v3 = new SKYLINE.Vector3(-9, 6, 3);

        var cross = v1.crossProduct(v2);
        ok( cross.equals(v3) );
});

test( "dot",
    function() {
        var v1 = new SKYLINE.Vector3(2, 1, 4);
        var v2 = new SKYLINE.Vector3(3, 3, 3);

        var dot = v1.dot(v2);

        v1.normalize();
        v2.normalize();

        ok( dot == 21 );
    });

test( "createEulerFromMatrix",
    function() {
        var rotation_matrix = new SKYLINE.Matrix4(0.492403876506104, 0.586824088833465, 0.586824088833465, 0,
                                                  0.413175911166535, 0.492403876506104, 0.766044443118978, 0,
                                                  0.766044443118978, -0.642787609686539, 0, 0);
        var v1 = new SKYLINE.Vector3( 0, 0, 0 );
        var v2 = new SKYLINE.Vector3( 0, 1, 0 );

        v1.makeEulerFromMatrix( rotation_matrix, SKYLINE.Object3D.DEFAULT_EULER_ORDER );
        v1.toString( );

        var m2 = new SKYLINE.Matrix4( );
        m2.makeRotationFromEuler( v2, SKYLINE.Object3D.DEFAULT_EULER_ORDER );
        m2.transpose();
        m2.toString( );

        expect(0);
    });

