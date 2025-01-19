import {describe, expect, it} from "vitest";
import {createTocTree} from "./tocUtils";
import {HeaderOfToc} from "../types/HeaderOfToc";

describe('tocUtils Unit Test', () => {

    describe('When empty headers passed', () => {
        it('should return only root of tree', () => {
            const emptyHeaders: HeaderOfToc[] = [];
            const result = createTocTree(emptyHeaders);

            const root: HeaderOfToc = {id: '', value: '', depth: 0, children: []}
            expect(result).toStrictEqual(root);
        });
    });

    describe('When tree is invalid', () => {
        it('should stop creating tree at invalid point', () => {
            const headers: HeaderOfToc[] = [
                {id: '1', value: '1', depth: 1, children: []},
                {id: '1-1', value: '1-1', depth: 2, children: []},
                {id: '2', value: '2', depth: 1, children: []},
                {id: 'invalid', value: 'invalid', depth: 1, children: []},
            ];
            const result = createTocTree(headers);

            const root: HeaderOfToc = {id: '', value: '', depth: 0, children: []}
            root.children.push({id: '1', value: '1', depth: 1, children: [{id: '1-1', value: '1-1', depth: 2, children: []}]});
            root.children.push({id: '2', value: '2', depth: 1, children: []});
            expect(result).toStrictEqual(root);
        });
    });

    describe('When prev node depth is ge than current node depth', () => {
        it('should pop until depth will be smaller than current node depth', () => {
            const headers: HeaderOfToc[] = [
                {id: '1', value: '1', depth: 1, children: []},
                {id: '', value: '', depth: 2, children: []},
                {id: '', value: '', depth: 3, children: []},
                {id: '', value: '', depth: 4, children: []},
                {id: '2', value: '2', depth: 1, children: []},
            ];

            const result = createTocTree(headers);
            expect(result.children).toContainEqual({id: '2', value: '2', depth: 1, children: []})
        });
    })
});