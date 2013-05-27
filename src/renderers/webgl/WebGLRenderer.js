/**
 *
 * @project skyline
 * @author Harry
 * @time 14:50 21/04/2013
 *
 */

SKYLINE.WebGLRenderer = function( parameters )
{
    this.DEFAULT_CLEAR_COLOR            = "#000000";

    this.canvasElement                  = null;
    this.ctx                            = null;

    this.width                          = 0;
    this.height                         = 0;

    this.viewportWidth                  = 0;
    this.viewportHeight                 = 0;
    this.viewportX                      = 0;
    this.viewportY                      = 0;

    this.canRender                      = false;
    /*
     * Whether we are rendering into an existing DOM element.
     */
    this.usingExistingElement           = false;

    /*
     * Auto Clear
     */
    this.autoClear                      = true;
    this.autoClearColor                 = null;

    /*
     * Automatically call ctx.viewport when changing the canvas DOM element size.
     */
    this.autoUpdateViewportDimensions   = true;

    /*
     * Used when fullscreen and the dimensions update when the browser resizes.
     */
    this.fullscreen                     = false;
    this.autoResize                     = true;

    function init( parameters, scope )
    {
        parameters                          = parameters || {};

        /*
         * Parse any parameters.
         */
        scope.width                         = ( parameters.width !== undefined ) ? parameters.width : window.innerWidth;
        scope.height                        = ( parameters.height !== undefined ) ? parameters.height : window.innerHeight;
        scope.usingExistingElement          = ( parameters.canvasElement !== undefined );
        scope.canvasElement                 = ( scope.usingExistingElement ) ? parameters.canvasElement : document.createElement("canvas");
        scope.autoClear                     = ( parameters.autoClear !== undefined ) ? parameters.autoClear : true;
        scope.autoClearColor                = ( parameters.autoClearColor !== undefined ) ? parameters.autoClearColor : new SKYLINE.Color( scope.DEFAULT_CLEAR_COLOR );
        scope.autoUpdateViewportDimensions  = ( parameters.autoUpdateViewportDimensions !== undefined ) ? parameters.autoUpdateViewportDimensions : true;
        scope.fullscreen                    = ( parameters.fullscreen !== undefined ) ? parameters.fullscreen : false;
        scope.autoResize                    = ( parameters.autoResize !== undefined ) ? parameters.autoResize : true;
        scope.depthTesting                  = ( parameters.depthTesting !== undefined ) ? parameters.depthTesting : true;

        scope.setup();

        scope.setDimensions( scope.width, scope.height );
        scope.setClearColor( scope.autoClearColor );
        scope.setDepthTesting( scope.depthTesting );

        console.log( scope );
    }

    /*
     * OpenGL Initialisation
     */

    this.setup = function()
    {
        this.getWebGLContext();

        if( !this.ctx )
        {
            /*
             * No WebGL support.
             */

            console.error("[SKYLINE.WebGLRenderer] No WebGL support!");

            return false;
        }
        else
        {
            if(!this.usingExistingElement)
            {
                this.addDOMElementToPage();
            }

            if(this.fullscreen && this.autoResize)
            {
                var that = this;

                window.addEventListener( "resize", function( e ) {
                    that.onWindowResizeHandler( e );
                });
            }

            this.canRender = true;
        }
    }

    /*
     * Setters for dimensions of the canvas element and the viewport.
     */

    this.setDimensions = function( width, height )
    {
        /*
         * Store the new width and height that have been specified.
         */
        this.width                      = width  || window.innerWidth;
        this.height                     = height || window.innerHeight;

        /*
         * Set the canvas DOM element width & height.
         */
        this.canvasElement.width        = this.width;
        this.canvasElement.height       = this.height;

        if(this.autoUpdateViewportDimensions)
        {
            /*
             * Update the WebGL context viewport dimensions.
             */
            this.setViewportDimensions( 0, 0, this.width, this.height );
        }
    }

    this.setViewportDimensions = function( x, y, w, h )
    {
        this.viewportX          = x || 0;
        this.viewportY          = y || 0;

        this.viewportWidth      = w || this.canvasElement.width;
        this.viewportHeight     = h || this.canvasElement.height;

        this.ctx.viewport( this.viewportX ,this.viewportY, this.viewportWidth, this.viewportHeight);
    }

    /*
     * Assigns either a newly created canvas element or an existing one,
     * then retrieves the "webgl" context, which can be forced to be "experimental-webgl".
     */

    this.getWebGLContext = function(forceExperimental)
    {
        var force  = forceExperimental || false;
        this.ctx   = (force) ? this.canvasElement.getContext("experimental-webgl") : this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl");
    }

    /*
     * Adds this.canvasElement to the page.
     */

    this.addDOMElementToPage = function()
    {
        document.body.appendChild( this.canvasElement );
    }

    /*
     * Rendering
     */

    this.render = function( scene, forceClear )
    {
        var camera = scene.getCurrentCamera();

        /*
         * Check the set camera is of the correct type.
         */
        if( camera instanceof SKYLINE.Camera === false )
        {
            console.error("[SKYLINE.WebGLRenderer].render - The current camera in the scene is not an instance of SKYLINE.Camera. Cannot render scene. ");

            return false;
        }

        /*
         * Clear the canvas.
         */
        if( this.autoClear || forceClear )
        {
            this.clear();
        }

        /*
         * Create, initalise and set WebGL objects.
         */
        if( scene.autoUpdate || !scene.__webGLInit )
        {
            this.initWebGLObjects( scene );
        }

        camera.updateViewMatrix();

        var i, len = scene.numChildren, obj;

        for( i = 0; i < len; ++i )
        {
            obj = scene.getObjectAt( i );

            if( obj instanceof SKYLINE.Mesh )
            {
                this.renderMesh( obj );
            }
        }
    }

    this.renderMesh = function( object )
    {
        var geometry        = object.geometry;
        var material        = object.material;

        for( var f = 0; f < geometry.faces; ++f )
        {
            var currentFace = geometry[f];

            if( currentFace instanceof SKYLINE.Triangle )
            {
                this.renderFace( currentFace );
            }
        }
    }

    this.renderFace = function( face )
    {
        var f = face;
        var vertexBuffer = face.__webGlVerticesBuffer;

        this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, vertexBuffer );
        this.ctx.drawArrays( this.ctx.TRIANGLE_STRIP, 0, vertexBuffer.length );
    }

    /*
     * WebGL Object Management
     */

    this.initWebGLObjects = function( scene )
    {
        /*
         * Add any new objects to the pipeline.
         */
        for( var a = 0; a < scene.__numObjectsAdded; ++a )
        {
            var obj = scene.getObjectAt( a );
            this.addObject( obj, scene );
        }

        /*
         * Remove any new objects to the pipeline.
         */
        for( var r = 0; r < scene.__numObjectsRemoved; ++r )
        {
            var obj = scene.getObjectAt( r );
            this.removeObject( obj, scene );
        }

        /*
         * Update all the scene data.
         */
        for( var u = 0; u < scene.numChildren; ++u )
        {
            var obj = scene.getObjectAt( u );
            this.updateObject( obj, scene );
        }

        scene.__webGLObjectsInit = true;
        scene.__clearRenderBuffers( true, true );
    }

    this.addObject = function( object, scene )
    {
        var geometry        = object.geometry;
        var material        = object.material;

        this.createGeometryBuffer( geometry );
        this.initGeometryBuffer( geometry );

        console.log('[SKYLINE.WebGLRenderer].render.addObject[', object, ']');

        object.__webGLInit = true;
    }

    this.removeObject = function( object, scene )
    {
        /*
         * TODO: Implement removeObject in WebGLRenderer.
         */
    }

    this.updateObject = function( object, scene )
    {
        var geometry = object.geometry;

        if( geometry.verticesNeedUpdating || geometry.normalsNeedUpdating || geometry.facesNeedUpdating || geometry.textureUVNeedUpdaing )
        {
            this.setGeometryBuffer( geometry );
        }
    }

    /*
     * Buffer creation
     */

    this.createGeometryBuffer = function( gObject )
    {
        gObject.__webGlVerticesBuffer     = this.ctx.createBuffer();
        gObject.__webGlNormalsBuffer      = this.ctx.createBuffer();
        gObject.__webGlFacesBuffer        = this.ctx.createBuffer();
    }

    /*
     * This creates all Float32Arrays.
     */
    this.initGeometryBuffer = function( geometry )
    {
        var numFaces                = geometry.faces.length * 3;
        var numVertices             = numFaces * 3;
        var numNormals              = numVertices;

        geometry.__vertexArray      = new Float32Array( numVertices );

        geometry.__vertexArray.itemSize = 3;
        geometry.__vertexArray.numItems = numVertices;

        geometry.__normalsArray     = new Float32Array( numNormals );
        geometry.__facesArray       = new Float32Array( numVertices );
    }

    this.setGeometryBuffer = function( geometry )
    {
        var vertexData  = geometry.__vertexArray,
            offset      = 0,
            f           = 0,
            cf          = 0,
            fl          = geometry.faces.length,
            v1,
            v2,
            v3;

        if( geometry.verticesNeedUpdating )
        {
            this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, geometry.__webGlVerticesBuffer );

            for( f = 0; f < fl; ++f )
            {
                cf = geometry.faces[f];

                v1 = geometry.vertices[ cf.a ].position;
                v2 = geometry.vertices[ cf.b ].position;
                v3 = geometry.vertices[ cf.c ].position;

                vertexData[ offset ]        = v1.x;
                vertexData[ offset + 1 ]    = v1.y;
                vertexData[ offset + 2 ]    = v1.z;

                vertexData[ offset + 3 ]    = v2.x;
                vertexData[ offset + 4 ]    = v2.y;
                vertexData[ offset + 5 ]    = v2.z;

                vertexData[ offset + 6 ]    = v3.x;
                vertexData[ offset + 7 ]    = v3.y;
                vertexData[ offset + 8 ]    = v3.z;

                offset += 9;
            }

            this.ctx.bufferData( this.ctx.ARRAY_BUFFER, vertexData, this.ctx.DYNAMIC_DRAW );
        }

        console.log('__vertexArray: ', vertexData);
    }

    /*
     * Shader Shizzel
     */

    this.setProgram = function( object )
    {
        var material = object.material;

    }

    /*
     * Clearing the context.
     */

    this.setClearColor = function( color )
    {
        this.ctx.clearColor( color.r, color.g, color.b, color.a );
    }

    this.clear = function()
    {
        this.ctx.clear( this.ctx.COLOR_BUFFER_BIT );
    }

    /*
     * Depth testing
     */

    this.setDepthTesting = function( shouldEnable )
    {
        if(shouldEnable)
        {
            this.ctx.enable(this.ctx.DEPTH_TEST);
        }
        else
        {
            this.ctx.disable(this.ctx.DEPTH_TEST);
        }

        this.ctx.depthFunc(this.ctx.LEQUAL);
    }

    /*
     * Event Handlers
     */

    /*
     * This is only activated if fullscreen and autoresize are set to
     * true in the initialisation parameters.
     */
    this.onWindowResizeHandler = function( e )
    {
        this.setDimensions();
    }

    init( parameters, this );
}