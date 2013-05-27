/**
 *
 * @project skyline
 * @author Harry
 * @time 16:03 21/04/2013
 *
 */

SKYLINE.Scene = function()
{
    this.id                         = SKYLINE.SceneCount++;
    this.name                       = 'Scene' + this.id;

    this.objects                    = new Array();
    this.lights                     = new Array();
    this.cameras                    = new Array();

    this.currentCameraIndex         = 0;
    this.numChildren                = 0; /* This does not include cameras */
    this.numCameras                 = 0;

    /*
     * Used by the renderer.
     */
    this.autoUpdate                 = true;

    this.__objectsAdded             = new Array();
    this.__objectsRemoved           = new Array();

    this.__numObjectsAdded          = 0;
    this.__numObjectsRemoved        = 0;

    this.__webGLObjectsInit         = false;

    this.add = function( obj )
    {
        if( /* obj instanceof SKYLINE.Light */ false )
        {
            this.lights.push( obj );

            this.numChildren++;
        }
        else if( obj instanceof SKYLINE.Object3D )
        {
            this.objects.push( obj );
            this.__objectsAdded.push( obj );

            this.__numObjectsAdded++;
            this.numChildren++;
        }
        else
        {
            console.warn("[SKYLINE.Scene].add - Trying to add a non-renderable to the scene ", this.name);
        }
    }

    this.addCamera = function( obj, makeDefaultCamera )
    {
        if( obj instanceof SKYLINE.Camera )
        {
            this.cameras.push( obj );

            if( makeDefaultCamera === true || makeDefaultCamera === undefined )
            {
                this.currentCameraIndex = this.cameras.length - 1;
            }

            this.numCameras++;
        }
        else
        {
            console.error("[SKYLINE.Scene] addCamera requires an instance of SKYLINE.Camera to be passed in as the first parameter! ");

            return false;
        }
    }

    /*
     * Removing objects.
     */

    this.remove = function( obj )
    {
        if( obj instanceof SKYLINE.Object3D )
        {
            for( var i = 0; i < this.objects.length; ++i )
            {
                if(obj === this.objects[i])
                {
                    this.objects.splice(i, 1);
                    this.__objectsRemoved( obj );

                    this.__numObjectsRemoved--;
                    this.numChildren--;
                }
            }
        }
        else if(/* obj instanceof SKYLINE.Light */ false)
        {
            for( var i = 0; i < this.lights.length; ++i )
            {
                if(obj === this.lights[i])
                {
                    this.lights.splice(i, 1);

                    this.numChildren--;
                }
            }
        }
        else if( obj instanceof SKYLINE.Camera )
        {
            for( var i = 0; i < this.cameras.length; ++i )
            {
                if(obj === this.cameras[i])
                {
                    /*
                     * When removing a camera we have to update the currentCameraIndex so the renderer has a camera to render the scene with.
                     * TODO: Decided what to do if the user is removing the only camera in the scene.
                     */
                    if(i == this.currentCameraIndex)
                    {
                        this.currentCameraIndex = ( this.cameras.length > 1 ) ? i-1 : null;
                    }

                    this.cameras.splice(i, 1);

                    this.numCameras--;
                }
            }
        }
    }

    this.removeObjectAt = function( index )
    {
        this.objects.splice(index,1);
    }

    this.getObjectAt = function( index )
    {
        return this.objects[index];
    }

    /*
     * Camera management
     */

    this.setCamera = function( obj, autoAdd )
    {
        var found   = false;
        var a       = autoAdd || true;

        if( obj instanceof SKYLINE.Camera )
        {
            for( var i = 0, len = this.cameras.length; i < len; ++i )
            {
                if( obj === this.cameras[i] )
                {
                    this.currentCameraIndex = i;
                    found = true;
                }
            }
        }

        if(!found)
        {
            if(a)
            {
                this.addCamera(obj, true);
            }
            else
            {
                console.warn("[SKYLINE.Scene].setCamera - Could not set the specified camera. Maybe you forgot the add it to the scene with scene.addCamera(obj, makeDefault)? You can auto add the camera by passing in setCamera( camera, true ).");
            }
        }

        return found;
    }

    this.getCurrentCamera = function()
    {
        return this.cameras[this.currentCameraIndex];
    }

    /*
     * Render utilities
     */

    this.updateChildCount = function()
    {
        this.numChildren = this.objects.length;
    }

    /*
     * Called by the renderer when all the new objects that have been added/removed have been
     * added to the pipeline.
     */
    this.__clearRenderBuffers = function( added, removed )
    {
        var added = (added !== undefined) ? added : true;
        var removed = (removed !== undefined) ? removed : true;

        if(added)
        {
            this.__objectsAdded = new Array();
        }

        if(removed)
        {
            this.__objectsRemoved = new Array();
        }
    }
}

SKYLINE.Scene.prototype = new SKYLINE.Object3D();

/*
 * Scene Counter
 */

SKYLINE.SceneCount = 0;