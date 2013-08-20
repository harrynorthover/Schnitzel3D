/**
 *
 * @project skyline
 * @author Harry
 * @time 16:05 21/04/2013
 *
 */

SKYLINE.Camera = function()
{
    SKYLINE.Object3D.call(this);

    this.projectionMatrix           = new SKYLINE.Matrix4();
    this.viewMatrix                 = new SKYLINE.Matrix4();
    this.modelViewMatrix            = new SKYLINE.Matrix4();

    this.projectionMatrixExpired    = false;
}

SKYLINE.Camera.prototype = Object.create( SKYLINE.Object3D.prototype );
SKYLINE.Camera.prototype.constructor = SKYLINE.Camera();

SKYLINE.Camera.prototype.lookAt = function( target )
{
    var result = this.calculateLookAtMatrix(this.position, target.position, this.up);

    /*
     * Extract Euler angle from the Matrix
     */
    this.rotation.makeEulerFromMatrix( result, this.eulerOrder );
};

/*
 * TODO: This is untested.
 */
SKYLINE.Camera.prototype.calculateLookAtMatrix = function( eye, target, up )
{
    var x = new SKYLINE.Vector3( 0, 0, 0 ),
        y = new SKYLINE.Vector3( 0, 0, 0 ),
        z = new SKYLINE.Vector3( 0, 0, 0 );

    /* Calculate the axis of rotation */
    z = z.subtractVectors( eye, target );
    /* Calculate the amount of rotation */
    x = x.crossVectors( up, z );

    z.normalize();
    x.normalize();

    /* Last axis to finish position */
    y = y.crossVectors( x, z );

    var result = new SKYLINE.Matrix4( x.x, x.y, x.z, 0,
                                      y.x, y.y, y.z, 0,
                                      z.x, z.y, z.z, 0,
                                      0,   0,   0,  1);

    return result;
};

SKYLINE.Camera.prototype.updateViewMatrix = function()
{
    this.updateWorldMatrix();

    this.viewMatrix.copy( this.worldMatrix.getInverse() );

    this.modelViewMatrix.copy( this.viewMatrix );
};
