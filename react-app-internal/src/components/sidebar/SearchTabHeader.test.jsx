import {describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import SearchTabHeader from "./SearchTabHeader.jsx";

describe("SearchTabHeader", () => {
  it("클릭 시 search 탭 선택 콜백을 호출한다.", () => {
    const onSelectTab = vi.fn();

    render(<SearchTabHeader isActive={false} onSelectTab={onSelectTab}/>);
    fireEvent.click(screen.getByLabelText("Search"));

    expect(onSelectTab).toHaveBeenCalledWith("search");
  });
});
