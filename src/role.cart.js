const Constants = require("constants");
const RoleIdle = require("role.idle");
const Utils = require("utils");

const MODE_CHOOSE_SOURCE = 0;
const MODE_WITHDRAW = 1;
const MODE_CHOOSE_DESTINATION = 2;
const MODE_DEPOSIT = 3;

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
		
	    if (creep.memory.cart_mode == undefined ||
				creep.memory.cart_mode == MODE_CHOOSE_SOURCE) {
			
			if (Utils.isCreepFull(creep)) {
				creep.memory.cart_mode == MODE_CHOOSE_DESTINATION;
			}
			else {
				var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, 
				    {
				        filter: (resource) => {
                            return resource.resourceType == RESOURCE_ENERGY;
                        }
				    }
				);
				var container = Utils.findPriorityFullStorage(creep);
				if (droppedEnergy != undefined) {
					creep.memory.cart_source = droppedEnergy.id;
					creep.memory.cart_mode = MODE_WITHDRAW;
				}
				else if (container != undefined) {
					creep.memory.cart_source = container.id;
					creep.memory.cart_mode = MODE_WITHDRAW;
				}
				else {
					RoleIdle.run(creep);
				}
			}
		}
		
	    if (creep.memory.cart_mode == MODE_WITHDRAW) {
            var target = Game.getObjectById(creep.memory.cart_source);
            if (target != undefined) {
				if (target instanceof Resource) {
					if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
					}
					if (Utils.isCreepFull(creep)) {
						creep.memory.cart_mode = MODE_CHOOSE_DESTINATION;
					}
				}
				else if (target instanceof StructureContainer) {
					if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
					}
					if (Utils.isCreepFull(creep) 
							|| Utils.isContainerEmpty(container)) {
						
						creep.memory.cart_mode = MODE_CHOOSE_DESTINATION;
					}
				}
            }
            else {
				creep.memory.cart_mode = MODE_CHOOSE_SOURCE;
            }
        }
		
	    if (creep.memory.cart_mode == MODE_CHOOSE_DESTINATION) {
			var container = Utils.findPriorityStorage(creep);
			if (container != undefined) {
				creep.memory.cart_destination = container.id;
				creep.memory.cart_mode = MODE_DEPOSIT;
			}
            else {
                RoleIdle.run(creep);
            }
		}
		
        if (creep.memory.cart_mode == MODE_DEPOSIT) {
            var container = Game.getObjectById(creep.memory.cart_destination);
            if (container != undefined) {
				var transferResult = creep.transfer(container, RESOURCE_ENERGY)
				if (Utils.isCreepEmpty(creep)) {
					creep.memory.cart_mode = MODE_CHOOSE_SOURCE;
				}
				else if (Utils.isContainerFull(container)) {
					creep.memory.cart_mode = MODE_CHOOSE_DESTINATION;
				}
                else if (transferResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
                }
            }
			else {
				if (Utils.isCreepEmpty(creep)) {
					creep.memory.cart_mode = MODE_CHOOSE_SOURCE;
				}
				else {
					creep.memory.cart_mode = MODE_CHOOSE_DESTINATION;
				}
			}
        }
		
	}
}