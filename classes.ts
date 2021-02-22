class Tag {

    name: string;

    childTags: Tag[];
    parentTags: Tag[];

    items: Item[];

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

class Item {

    name: string;

    childItems: Item[];
    parentItems: Item[];

    tags: Tag[];

    constructor(name: string) {
        this.name = name;
    }

    addChildItem(child: Item) {
        child.parentItems.push(this);
        this.childItems.push(child);
    }

} 