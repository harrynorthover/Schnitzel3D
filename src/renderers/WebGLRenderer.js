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

        scope.setup();
        scope.setDimensions( scope.width, scope.height );
        scope.setClearColor( scope.autoClearColor );

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

    this.render = function( scene /*, camera*/ )
    {
        var camera = scene.getCurrentCamera();

        // camera.updateViewMatrix();

        /*
         * TODO: Viewport calculation has been added to Matrix4, is it needed by WebGL?
         */
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