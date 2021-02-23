import { Item, Tag } from './classes';
import * as fs from 'fs';

const TAGS_LOCATION: string = './minecraft-data/tags/items/';
const RECIPES_LOCATION: string = './minecraft-data/recipes/';

const tags: object = {};
const items: object = {};

loadTags();
loadItems();


function loadTags() {
    let files: string[] = fs.readdirSync(TAGS_LOCATION);

    files.forEach(file => {
        let values: string[] = JSON.parse(
            fs.readFileSync(TAGS_LOCATION + file, 'utf-8')
        ).values;

        let mainTag = getTag('minecraft:' + file.replace('.json', ''));

        values.forEach(value => {
            if (value.startsWith('#')) {

                let noHash = value.replace('#', '');

                mainTag.addChildTag(getTag(noHash));                

                return;
            }
            mainTag.addChildItem(getItem(value));
            tags[mainTag.name] = mainTag;
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

        let result = getItem(item['result']['item']);

        if (item['ingredients'] !== undefined) {
            item['ingredients'].forEach(ingredient => {
                getItem(ingredient['item']).addChildItem(result);
            });

            return;
        }

        if (item['ingredient'] !== undefined) {
            getItem(item['ingredient']['item']).addChildItem(result);

            return;
        }

        if (item['type'] === 'minecraft:smithing') {
            getItem(item['base']['item']).addChildItem(result);
            getItem(item['addition']['item']).addChildItem(result);

            return;
        }

        if (item['type'] === 'minecraft:crafting_shaped') {

            Object.keys(item['key']).forEach(key => {

                getItem(item['key'][key]['item']).addChildItem(result);
            })

            return;
        }
    });
}

function getItem(name: string): Item {
    if (!(name in items)) {
        let newItem: Item = new Item(name);
        items[name] = newItem;
    }
    return items[name];
}

function getTag(name: string): Tag {
    if (!(name in tags)) {
        let newTag: Tag = new Tag(name);
        tags[name] = newTag;
    }
    return tags[name];
}


}