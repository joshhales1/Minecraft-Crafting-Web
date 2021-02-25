# Minecraft Crafting Web

## Information
The goal of this project was to generate a full Minecraft production tree. 

The new version shows:
- Crafting
- Smelting
- Stonecutter crafting
- Smithing table crafting (`netherite_pickaxe` etc)
- Mob drops
- Chest drops (found in structures)

This version does not *yet* show:
- Brewing
- Villager trading
- Connections between loot tables
    - For example, `guardians` drop `prismarine_shards`, but also a random fish from the `fish` loot table. This graph only shows the "true" drops so the fish is missing.
- Fishing   

The current version is shown below:

![A Minecraft production tree](./rendering/static/result.png)

## Method
A NodeJS program reads through the JSON which was extracted from the (currently 1.16.2) .jar Minecraft file and connects the correct nodes. It then saves the file and a browser is used to render the resulting graph structure with vis.js ready to be saved and downloaded from the canvas. The rendering process can take several minutes. 
