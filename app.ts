import { Tree } from './classes';
import * as fs from 'fs';
import * as http from 'http';

const TAGS_LOCATION: string = './minecraft-data/tags/items/';
const RECIPES_LOCATION: string = './minecraft-data/recipes/';

const INGREDIENT_RESULT_TYPES: string[] = ['minecraft:smelting', 'minecraft:stonecutting', 'minecraft:blasting', 'minecraft:campfire_cooking', 'minecraft:smoking'];

const tree = new Tree();

loadTags();
loadItems();

fs.writeFileSync('./rendering/static/vis-data.json', tree.generateVisJSON());

http.createServer(function (req, res) {
    console.log(req.url);

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(fs.readFileSync('./rendering/static/index.html'), 'utf-8');
        res.end();
    } else if (req.url === '/data') {
        res.writeHead(200, { 'Content-Type': 'text/json' });
        res.write(fs.readFileSync('./rendering/static/vis-data.json'), 'utf-8');
        res.end();
    }



}).listen(8080);

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

                mainTag.addParent(tree.getNode(noHash, "tag"));                

                return;
            }

            mainTag.addParent(tree.getNode(value, "item"));
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

        let formattedIngredients: object[] = [];

        let result = tree.getNode(item['result']['item'] ?? item['result'], "item");

        if (item['type'] === 'minecraft:crafting_shapeless') {

            item['ingredients'].forEach(ingredient => {
                formattedIngredients.push(ingredient);
            });

        }       

        else if (item['type'] === 'minecraft:smithing') {

            formattedIngredients.push(item['base']);
            formattedIngredients.push(item['addition']);

        }

        else if (item['type'] === 'minecraft:crafting_shaped') {

            Object.keys(item['key']).forEach(key => {
                formattedIngredients.push(item['key'][key]);
            });
        }

        else if (INGREDIENT_RESULT_TYPES.includes(item['type'])) {

            formattedIngredients.push(item['ingredient']);
        }

        formattedIngredients.forEach(ingredient => {

            let rawArray = [];

            if (!Array.isArray(ingredient)) {
                rawArray = [ingredient];
            } else {
                rawArray = ingredient;
            }

            rawArray.forEach(singleIngredient => {

                if (singleIngredient['item'] !== undefined) {

                    tree.getNode(singleIngredient['item'], 'item').addChild(result);

                    return;
                }

                tree.getNode(singleIngredient['tag'], 'tag').addChild(result);
            });

         
        });
    });
}