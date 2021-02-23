/*export class Tag {

    name: string;

    childTags: Tag[] = [];
    parentTags: Tag[] = [];

    items: Item[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addChildTag(child: Tag) {
        child.parentTags.push(this);
        this.childTags.push(child);
    }

    addChildItem(child: Item) {
        this.items.push(child);
        child.tags.push(this);
    }

}

export class Item {

    name: string;

    childItems: Item[] = [];
    parentItems: Item[] = [];

    tags: Tag[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addChildItem(child: Item) {
        child.parentItems.push(this);
        this.childItems.push(child);
    }
}
*/

export class Node {
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

