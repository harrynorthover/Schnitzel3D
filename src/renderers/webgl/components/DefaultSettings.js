/**
 *
 * @project skyline
 * @author harry.northover
 * @time 21:10 30/05/2013
 *
 * Default settings for the WebGLRenderer.
 *
 */

SKYLINE.WebGLRendererDefaultSettings = function()
{
    this.width                              = window.innerWidth;
    this.height                             = window.innerHeight;
    this.usingExistingElement               = false;
    this.autoClear                          = true;
    this.autoClearColor                     = new SKYLINE.Color( "#000000" );
    this.fullscreen                         = true;
    this.autoResize                         = true;
    this.autoUpdateViewportDimensions       = true;
    this.depthTesting                       = true;
}