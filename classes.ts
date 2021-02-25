class Node {
    name: string;

    type: string;

    children: Link[] = [];
    parents: Link[] = [];

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    addChild(child: Node, type: string) {

        let newLink: Link = new Link(type, this, child);

        child.parents.push(newLink);
        this.children.push(newLink);
    }

    addParent(parent: Node, type: string) {

        let newLink: Link = new Link(type, parent, this);

        parent.children.push(newLink);
        this.parents.push(newLink);
    }

    static nameToFriendlyName(name): string {
        let splitName: string[] = name.split("_");

        for (let i = 0; i < splitName.length; i++) {
            splitName[i] = splitName[i][0].toUpperCase() + splitName[i].substring(1, splitName[i].length);
        }




        

        return splitName.join(" ");

    }
}

class Link {
    type: string;

    parent: Node;
    child: Node;

    constructor(type: string, parent: Node, child: Node) {
        this.type = type;
        this.child = child;
        this.parent = parent;
    }
}

export class Tree {
    allNodes = {};

    getNode(name: string, type?: string): Node {

        name = name.replace('minecraft:', '');

        if (!(name in this.allNodes)) {
            if (type === undefined)
                throw new Error('Type parameter illegally unset.');

            let newNode: Node = new Node(name, type);
            this.allNodes[name] = newNode;
        }
        return this.allNodes[name];
    }
    
    generateVisJSON(): string {

        let newJson = {
            nodes: [],
            edges: []
        };

        Object.keys(this.allNodes).forEach(nodeName => {

            let node: Node = this.allNodes[nodeName];

            newJson.nodes.push({ id: Object.keys(this.allNodes).indexOf(nodeName), label: Node.nameToFriendlyName(node.name), color: Colors.nodeTypes[node.type] });

            node.children.forEach(child => {

                newJson.edges.push({
                    from: Object.keys(this.allNodes).indexOf(nodeName),
                    to: Object.keys(this.allNodes).indexOf(child.child.name),
                    arrows: "to",
                    color: { color: Colors.methodTypes[child.type] },
                });
            });
                
        });

        return JSON.stringify(newJson);
    }
}

class Colors {
    static methodTypes = {
        "minecraft:crafting_shapeless": "#0000ff",
        "minecraft:crafting_shaped": "#0000ff",
        "minecraft:smithing": "#ffffff",
        "minecraft:smelting": "#ff8800",
        'minecraft:stonecutting': "#666666",
        "tag": "#ff00ff",
        "drop": "#00ff00", 
        "chest": "#ff99ff",
    }

    static nodeTypes = {
        "tag": "#ffccff",
        "item": "#ccccff",
        "entity": "#ccffcc",
        "structure": "#ff99ff"
    }
}

