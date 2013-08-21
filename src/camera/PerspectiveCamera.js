/**
 * @project skyline
 * @author harry.northover
 * @time 15:48 03/05/2013
 */

SKYLINE.PerspectiveCamera = function( fov, aspect, near, far )
{
    SKYLINE.Camera.call( this );

    this.near           = near || 10;
    this.far            = far || 1000;
    this.aspectRatio    = aspect || 1;
    this.fieldOfView    = fov || 45;
}

SKYLINE.PerspectiveCamera.prototype = Object.create( SKYLINE.Camera.prototype );
SKYLINE.PerspectiveCamera.prototype.constructor = SKYLINE.PerspectiveCamera;

SKYLINE.PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
    this.projectionMatrix.calculatePerspective( this.fieldOfView, this.aspectRatio, this.near, this.far, true );
    this.projectionMatrixExpired = false;
}

SKYLINE.PerspectiveCamera.prototype.changePerspective = function( fov, aspect, near, far )
{
    this.near = near;
    this.far = far;
    this.aspectRatio = aspect;
    this.fieldOfView = fov;

    this.projectionMatrixExpired = true;
}