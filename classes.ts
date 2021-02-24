class Node {
    name: string;

    type: string;

    children: Node[] = [];
    parents: Node[] = [];

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    addChild(child: Node) {
        child.parents.push(this);
        this.children.push(child);
    }

    addParent(parent: Node) {
        parent.children.push(this);
        this.parents.push(parent);
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

            newJson.nodes.push({ id: Object.keys(this.allNodes).indexOf(nodeName), label: node.name });

            node.children.forEach(child => {
                newJson.edges.push({ from: Object.keys(this.allNodes).indexOf(nodeName), to: Object.keys(this.allNodes).indexOf(child.name) });
            });
                
        });

        return JSON.stringify(newJson);
    }
}

