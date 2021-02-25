import { Tree } from './classes';
import * as fs from 'fs';

const TAGS_LOCATION: string = './minecraft-data/tags/items/';
const RECIPES_LOCATION: string = './minecraft-data/recipes/';

const ENTITY_DROP_LOCATIONS: string[] = ['./minecraft-data/loot_tables/entities/', './minecraft-data/loot_tables/entities/sheep/',];
const CHEST_DROP_LOCATIONS: string[] = ['./minecraft-data/loot_tables/chests/', './minecraft-data/loot_tables/chests/village/',]
const FURNACE_CLONES = ['minecraft:blasting', 'minecraft:campfire_cooking', 'minecraft:smoking'];

const tree = new Tree();

loadTags();
loadItems();
loadEntityDrops();
loadChestDrops();

fs.writeFileSync('./rendering/static/vis-data.js', 'const tree = JSON.parse(\'' + tree.generateVisJSON() + '\')');

function loadTags() {
    let files: string[] = fs.readdirSync(TAGS_LOCATION);

    files.forEach(file => {
        let values: string[] = JSON.parse(
            fs.readFileSync(TAGS_LOCATION + file, 'utf-8')
        ).values;

        let mainTag = tree.getNode(file.replace('.json', ''), "tag");

        values.forEach(value => {

            if (value.startsWith('#')) {

                let noHash = value.replace('#', '');

                mainTag.addParent(tree.getNode(noHash, "tag"), "tag");                

                return;
            }

            mainTag.addParent(tree.getNode(value, "item"), "tag");
        });      
    });
}

function loadItems() {
    let files: string[] = fs.readdirSync(RECIPES_LOCATION);

    files.forEach(file => {
        let item: object = JSON.parse(
            fs.readFileSync(RECIPES_LOCATION + file, 'utf-8')
        );

        if (item['type'].startsWith('minecraft:crafting_special') || FURNACE_CLONES.includes(item['type']))
            return;

        let formattedIngredients = [];

        let result = tree.getNode(item['result']['item'] ?? item['result'], "item");

        if (item['type'] === 'minecraft:crafting_shapeless') {

            item['ingredients'].forEach(ingredient => {
                formattedIngredients.push({ ingredient: ingredient, type: item['type'] });
            });
        }       

        else if (item['type'] === 'minecraft:smithing') {

            formattedIngredients.push({ ingredient: item['base'], type: item['type'] });
            formattedIngredients.push({ ingredient: item['addition'], type: item['type'] });
        }

        else if (item['type'] === 'minecraft:crafting_shaped') {

            Object.keys(item['key']).forEach(key => {
                formattedIngredients.push({ ingredient: item['key'][key], type: item['type'] });
                
            });
        }

        else if (item['type'] === "minecraft:smelting") {

            formattedIngredients.push({ ingredient: item['ingredient'], type: item['type'] });            
        }

        else if (item['type'] === "minecraft:stonecutting") {

            formattedIngredients.push({ ingredient: item['ingredient'], type: item['type'] });
        }

        formattedIngredients.forEach(ingredient => {

            let rawArray = [];

            if (!Array.isArray(ingredient.ingredient)) {
                rawArray = [ingredient.ingredient];
            } else {
                rawArray = ingredient.ingredient;
            }

            rawArray.forEach(singleIngredient => {

                if (singleIngredient['item'] !== undefined) {

                    tree.getNode(singleIngredient['item'], 'item').addChild(result, ingredient.type);

                    return;
                }

                tree.getNode(singleIngredient['tag'], 'tag').addChild(result, ingredient.type);
            });         
        });
    });
}

function loadEntityDrops() {
    ENTITY_DROP_LOCATIONS.forEach(location => {
        let files: string[] = fs.readdirSync(location);

        files.forEach(file => {
            if (fs.lstatSync(location + file).isDirectory())
                return;           

            let data = JSON.parse(fs.readFileSync(location + file, 'utf-8'));

            if (data.pools === undefined)
                return;

            let newItem = tree.getNode(file.replace('.json', '') + (location.endsWith('sheep/') ? "_sheep" : ""), 'entity');            

            data.pools.forEach(pool => {
                pool.entries.forEach(entry => {

                    if (entry['type'] === 'minecraft:empty' || entry['type'] === 'minecraft:loot_table')
                        return;


                    if (entry['type'] === 'minecraft:item') {
                        tree.getNode(entry['name'], "item").addParent(newItem, "drop");
                        return;
                    }

                    if (entry['type'] === 'minecraft:tag') {
                        tree.getNode(entry['name'], "tag").addParent(newItem, "drop");
                        return;
                    }
                });

            });            

        });

    });
}

function loadChestDrops() {
    CHEST_DROP_LOCATIONS.forEach(location => {
        let files: string[] = fs.readdirSync(location);

        files.forEach(file => {
            if (fs.lstatSync(location + file).isDirectory())
                return;

            let data = JSON.parse(fs.readFileSync(location + file, 'utf-8'));

            if (data.pools === undefined)
                return;

            let newItem = tree.getNode(file.replace('.json', ''), 'structure');

            data.pools.forEach(pool => {
                pool.entries.forEach(entry => {

                    if (entry['type'] === 'minecraft:empty' || entry['type'] === 'minecraft:loot_table')
                        return;


                    if (entry['type'] === 'minecraft:item') {
                        tree.getNode(entry['name'], "item").addParent(newItem, "chest");
                        return;
                    }

                    if (entry['type'] === 'minecraft:tag') {
                        tree.getNode(entry['name'], "tag").addParent(newItem, "chest");
                        return;
                    }
                });

            });

        });

    });
}