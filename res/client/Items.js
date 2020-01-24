/*
 * list of items reference is item id
 * description is description
 * icon is file name in assets/item_icons
 */

const Items = {
    [Constants.ITEM_PICKAXE]: {
        name: "Pickaxe",
        description: "pick a' da wall",
        walkable: true,
        iconImage: null,
        iconColour: 'rgb(124,124,124)' //TODO change to use icon
    },
    [Constants.ITEM_WALL]: {
        name: "Wall",
        description: "'tis wall",
        walkable: false,
        iconImage: null,
        iconColour: 'rgb(61,61,79)' //TODO change to use icon
    },
    [Constants.ITEM_DIRT]: {
        name: "Dirt",
        description: "eww, dirt",
        walkable: true,
        iconImage: "/items/dirt",
        // iconColour: 'rgb(156,117,31)' //TODO change to use icon
    }
};