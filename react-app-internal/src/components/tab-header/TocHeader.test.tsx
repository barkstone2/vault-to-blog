import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {TocHeader} from "./TocHeader";
import {userEvent} from "@testing-library/user-event";
import {HeaderOfToc} from "../../types/HeaderOfToc";

describe("TocHeader Unit Test", () => {
    describe('When children of header is empty', () => {
        const header: HeaderOfToc = {value: '', depth: 0, id: '', children: []};

        it('should not have mod-collapsible class', () => {
            render(<TocHeader header={header} handleHeaderClicked={vi.fn()}/>);
            expect(screen.queryByTestId('tree-item-self')?.classList.contains('mod-collapsible')).toBe(false);
        });

        it('should not have collapse icon', () => {
            render(<TocHeader header={header} handleHeaderClicked={vi.fn()}/>);
            expect(screen.queryByTestId('collapse-icon')).not.toBeInTheDocument();
        });

        it('should not have children div', () => {
            render(<TocHeader header={header} handleHeaderClicked={vi.fn()}/>);
            expect(screen.queryByTestId('tree-item-children')).not.toBeInTheDocument();
        });
    });

    describe('When children of header is not empty', () => {
        const header: HeaderOfToc = {value: '', depth: 0, id: '', children: [{value: '', depth: 0, id: '', children: []}]};

        it('should have mod-collapsible class', () => {
            render(<TocHeader header={header} handleHeaderClicked={vi.fn()}/>);
            expect(screen.queryByTestId('tree-item-self')?.classList.contains('mod-collapsible')).toBe(true);
        });

        it('should have collapse icon', () => {
            render(<TocHeader header={header} handleHeaderClicked={vi.fn()}/>);
            expect(screen.queryByTestId('collapse-icon')).toBeInTheDocument();
        });

        it('should have children div', () => {
            render(<TocHeader header={header} handleHeaderClicked={vi.fn()}/>);
            expect(screen.queryByTestId('tree-item-children')).toBeInTheDocument();
        });
    });

    describe('When collapse icon is clicked', () => {
        const header: HeaderOfToc = {value: '', depth: 0, id: '', children: [{value: '', depth: 0, id: '', children: []}]};
        it('should change display state of children div', async () => {
            render(<TocHeader header={header} handleHeaderClicked={vi.fn()}/>);
            const collapseIcon = screen.queryByTestId('collapse-icon') as Element;
            expect(screen.queryByTestId('tree-item-children')).toBeInTheDocument();

            await userEvent.click(collapseIcon);

            expect(screen.queryByTestId('tree-item-children')).not.toBeInTheDocument();
        });
    })

    describe('When tree item is clicked', () => {
        const header: HeaderOfToc = {value: '', depth: 0, id: 'test-id', children: [{value: '', depth: 0, id: '', children: []}]};
        it('should invoke handleHeaderClicked', async () => {
            const mockHandler = vi.fn();
            render(<TocHeader header={header} handleHeaderClicked={mockHandler}/>)
            const treeItemSelf = screen.queryByTestId('tree-item-self') as Element;
            await userEvent.click(treeItemSelf);

            expect(mockHandler).toBeCalled();
        });
    });
});