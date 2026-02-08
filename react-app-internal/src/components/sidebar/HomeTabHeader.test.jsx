import {describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

import HomeTabHeader from "./HomeTabHeader.jsx";

describe("HomeTabHeader", () => {
  it("클릭하면 항상 루트 경로(/)로 이동한다.", () => {
    mockNavigate.mockClear();

    render(<HomeTabHeader/>);
    fireEvent.click(screen.getByLabelText("Home"));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
