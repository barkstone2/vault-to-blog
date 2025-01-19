export interface HeaderOfToc {
    value: string;
    depth: number;
    id: string;
    children: HeaderOfToc[];
}