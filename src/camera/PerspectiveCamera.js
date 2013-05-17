/**
 * @project skyline
 * @author harry.northover
 * @time 15:48 03/05/2013
 */

SKYLINE.PerspectiveCamera = function( fov, aspect, near, far )
{
    this.near           = 1;
    this.far            = 1000;
    this.aspectRatio    = 1;
    this.fieldOfView    = 45;

    function init( fov, aspect, near, far, scope )
    {
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
        this.projectionMatrix.calculatePerspective( this.fieldOfView, this.aspectRatio, this.near, this.far );

        this.projectionMatrixExpired = false;
    }

    /*
     * TODO: Decide the best place to call this? No point calling
     * it in updateProjectionMatrix as the position wont necessarily
     * change when the projection changes.
     */
    this.updateViewMatrix = function()
    {
        this.viewMatrix.copy( this.worldMatrix.getInverse() );
    }

    init( fov, aspect, near, far, this );
}

SKYLINE.PerspectiveCamera.prototype = new SKYLINE.Camera();