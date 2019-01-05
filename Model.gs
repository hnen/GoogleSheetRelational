/**
 * Data that defines the schema that the sheets must adhere to.
 *
 * Routines assume that the constants and global object "tables" exist.
 */

var PRIMARY_KEY = 1;
var FOREIGN_KEY = 2;

var model_hero = [
  [PRIMARY_KEY, ["Id"]]
];

var model_herodeck = [
  [PRIMARY_KEY, ["HeroId", "CardN"]],
  [FOREIGN_KEY, "HeroId", "Hero"],
  [FOREIGN_KEY, "CardId", "BattleCard"]
];

var model_battlecard = [
  [PRIMARY_KEY, ["Id"]]
];
  
var tables = {
  "Hero": model_hero,
  "HeroDeck": model_herodeck,
  "BattleCard": model_battlecard
};





