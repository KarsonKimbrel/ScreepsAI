const Utils = require("utils");
const Constants = require("constants");

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    creep.say("Idling");
	    creep.moveTo(Utils.getClosestIdleLocation(creep), {visualizePathStyle: Utils.getPathVisualStyle(creep)});
	}
};

module.exports = roleUpgrader;