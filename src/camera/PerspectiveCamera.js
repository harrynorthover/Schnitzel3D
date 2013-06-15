/**
 * @project skyline
 * @author harry.northover
 * @time 15:48 03/05/2013
 */

SKYLINE.PerspectiveCamera = function( fov, aspect, near, far )
{
    this.near           = 10;
    this.far            = 1000;
    this.aspectRatio    = 1;
    this.fieldOfView    = 45;

    function init( fov, aspect, near, far, scope )
    {
        SKYLINE.Camera.call( this );

        if(fov !== undefined)
        {
            scope.fieldOfView    = fov;
            scope.aspectRatio    = aspect;
            scope.near           = near;
            scope.far            = far;
        }

        scope.updateProjectionMatrix();
    }

    this.updateProjectionMatrix = function()
    {
        this.projectionMatrix.calculatePerspective( this.fieldOfView, this.aspectRatio, this.near, this.far, true );
        this.projectionMatrixExpired = false;
    }

    init( fov, aspect, near, far, this );
}

SKYLINE.PerspectiveCamera.prototype = new SKYLINE.Camera();