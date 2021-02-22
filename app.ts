import { Item, Tag } from './classes';

const fs = require('fs');


const TAGS_LOCATION: string = './minecraft-data/tags/items/';
const tags: object = {};
const items: object = {};

loadTags();

console.log(tags);

function loadTags() {
    let files: string[] = fs.readdirSync(TAGS_LOCATION);

    files.forEach(file => {
        let values: string[] = JSON.parse(
            fs.readFileSync(TAGS_LOCATION + file)
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
