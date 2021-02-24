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
    allNodes: Node[] = [];

    getNode(name: string, type?: string): Node {
        if (!(name in this.allNodes)) {
            if (type === undefined)
                throw new Error('Type parameter illegally unset.');

            let newNode: Node = new Node(name, type);
            this.allNodes[name] = newNode;
        }
        return this.allNodes[name];
    }
}

