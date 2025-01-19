import {TocHeader} from "./TocHeader";
import {HeaderOfToc} from "../../types/HeaderOfToc";
import {useFlashingElement} from "../../hooks/useFlashingElement";

interface TocHeadersProps {
    headers: HeaderOfToc[];
}

export function TocHeaders({headers}: TocHeadersProps) {
    const {flashElementById} = useFlashingElement();
    const handleHeaderClicked = (header: HeaderOfToc) => {
        location.href = `#${header.id}`;
        flashElementById(header.id);
    }
    return (
        <>
            {
                headers.map((header, index) => (
                    <TocHeader key={index} header={header} handleHeaderClicked={() => {handleHeaderClicked(header)}}>
                        <TocHeaders headers={header.children}/>
                    </TocHeader>
                ))
            }
        </>
    )
}