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

SKYLINE.PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
    this.projectionMatrix.calculatePerspective( this.fieldOfView, this.aspectRatio, this.near, this.far, true );
    this.projectionMatrixExpired = false;
}