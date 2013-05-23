/**
 *
 * @project skyline
 * @author harry.northover
 * @time 18:44 17/05/2013
 *
 * Math utilities used by Skyline.
 *
 */

SKYLINE.Math = SKYLINE.Math || {};

SKYLINE.Math.Utils = {
    degreesToRadians : function( degrees )
    {
        return degrees * 180 / Math.PI;
    },

    radiansToDegrees : function( radians )
    {
        throw new Error("[SKYLINE.Utils].radiansToDegrees - This function has not been implemented yet!");
    }
}