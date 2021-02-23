import { Node, Tree } from './classes';
import * as fs from 'fs';

const TAGS_LOCATION: string = './minecraft-data/tags/items/';
const RECIPES_LOCATION: string = './minecraft-data/recipes/';

const tree = new Tree();

loadTags();
loadItems();

console.log(tree);

function loadTags() {
    let files: string[] = fs.readdirSync(TAGS_LOCATION);

    files.forEach(file => {
        let values: string[] = JSON.parse(
            fs.readFileSync(TAGS_LOCATION + file, 'utf-8')
        ).values;

        let mainTag = tree.getNode('minecraft:' + file.replace('.json', ''), "tag");

        values.forEach(value => {
            if (value.startsWith('#')) {

                let noHash = value.replace('#', '');

                mainTag.addChild(tree.getNode(noHash, "tag"));                

                return;
            }
            mainTag.addChild(tree.getNode(value, "item"));
        });      
    });
}

function loadItems() {
    let files: string[] = fs.readdirSync(RECIPES_LOCATION);

    files.forEach(file => {
        let item: object = JSON.parse(
            fs.readFileSync(RECIPES_LOCATION + file, 'utf-8')
        );

        if (item['type'].startsWith('minecraft:crafting_special'))
            return;

        let result = tree.getNode(item['result']['item'], "item");

        if (item['ingredients'] !== undefined) {
            item['ingredients'].forEach(ingredient => {
                tree.getNode(ingredient['item'], "item").addChild(result);
            });

            return;
        }

        if (item['ingredient'] !== undefined) {
            tree.getNode(item['ingredient']['item'], "item").addChild(result);

            return;
        }

        if (item['type'] === 'minecraft:smithing') {
            tree.getNode(item['base']['item'], "item").addChild(result);
            tree.getNode(item['addition']['item'], "item").addChild(result);

            return;
        }

        if (item['type'] === 'minecraft:crafting_shaped') {

            Object.keys(item['key']).forEach(key => {

                tree.getNode(item['key'][key]['item'], "item").addChild(result);
            })

            return;
        }
    });
}