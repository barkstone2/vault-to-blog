import React, {ReactNode, useState} from "react";
import {RightTriangle} from "../svg/RightTriangle";
import {HeaderOfToc} from "../../types/HeaderOfToc";

interface TocHeaderProp {
    header: HeaderOfToc;
    handleHeaderClicked: () => void;
    children?: ReactNode;
}

export function TocHeader({header, handleHeaderClicked, children}: TocHeaderProp) {
    const [headerOpened, setHeaderOpened] = useState(true);
    const toggleOpened = (event: React.MouseEvent) => {
        event.stopPropagation();
        setHeaderOpened(!headerOpened);
    }

    const hasChildren = (header: HeaderOfToc) => {
        return header.children.length > 0;
    }

    return (
        <div className={'tree-item'}>
            <div className={`tree-item-self is-clickable ${hasChildren(header) && 'mod-collapsible'}`}
                 onClick={handleHeaderClicked}
                style={{
                    marginInlineStart: '0px !important',
                    paddingInlineStart: '24px !important'

                }}
                 data-testid={'tree-item-self'}
            >
                {
                    hasChildren(header) &&
                  <div className={`tree-item-icon collapse-icon ${!headerOpened && 'is-collapsed'}`} onClick={toggleOpened} data-testid={'collapse-icon'}>
                    <RightTriangle/>
                  </div>
                }

                <div className="tree-item-inner">{header.value}</div>
            </div>
            {
                hasChildren(header) &&
                headerOpened &&
              <div className={`tree-item-children`} data-testid={'tree-item-children'}>
                  {children}
              </div>
            }
        </div>
    );
}