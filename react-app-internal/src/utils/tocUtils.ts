import {HeaderOfToc} from "../types/HeaderOfToc";

export function createTocTree(headers: HeaderOfToc[]) {
    const root: HeaderOfToc = { value: '', depth: 0, id: '', children: [] };
    const stack: HeaderOfToc[] = [];
    stack.push(root);

    let prev: HeaderOfToc = root;
    for (const header of headers) {
        // If items left on stack and prev depth is ge than current depth
        // Pop until stack will be empty or prev depth will be smaller that current depth
        while (stack.length > 0 && prev.depth >= header.depth) {
            prev = stack.pop()!;
        }

        // If stack is empty and prev depth is ge than current depth
        // It means tree is invalid, so stop initializing tree
        if (stack.length === 0 && prev.depth >= header.depth) {
            break;
        }

        // At below this line, prev depth should be less than current depth

        prev.children.push(header);
        stack.push(header);
        prev = header;
    }
    return root;
}