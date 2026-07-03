/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserCategoryTabs from "../components/UserCategoryTabs";
import { Category } from "../domain/Category";

// jsdom doesn't implement ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const makeCategories = (n: number): Category[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `cat-${i}`,
    name: `Category ${i + 1}`,
    color: "#f87171",
  }));

const noop = () => {};

describe("UserCategoryTabs", () => {
  describe("empty state", () => {
    it("renders a New collection button when there are no categories", () => {
      render(
        <UserCategoryTabs
          categories={[]}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      expect(screen.getByText("New collection")).toBeInTheDocument();
    });

    it("shows the inline input when New collection is clicked", async () => {
      render(
        <UserCategoryTabs
          categories={[]}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      fireEvent.click(screen.getByText("New collection"));
      expect(
        screen.getByPlaceholderText("Collection name…")
      ).toBeInTheDocument();
    });
  });

  describe("scroll container", () => {
    it("renders the scroll container with overflow-x-auto", () => {
      const { container } = render(
        <UserCategoryTabs
          categories={makeCategories(1)}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      // outer wrapper is the flex row containing arrow buttons + scroll div
      const outerWrapper = container.firstChild as HTMLElement;
      const scrollDiv = outerWrapper.querySelector("[class*='overflow-x-auto']") as HTMLElement;
      expect(scrollDiv).toBeInTheDocument();
    });

    it("scroll container is a flex row (not wrapping)", () => {
      const { container } = render(
        <UserCategoryTabs
          categories={makeCategories(1)}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      const outerWrapper = container.firstChild as HTMLElement;
      const scrollDiv = outerWrapper.querySelector("[class*='overflow-x-auto']") as HTMLElement;
      const innerRow = scrollDiv.firstChild as HTMLElement;
      expect(innerRow).toHaveClass("inline-flex");
    });

    it("all pill items have flex-shrink-0 so they don't collapse", () => {
      const { container } = render(
        <UserCategoryTabs
          categories={makeCategories(3)}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      const outerWrapper = container.firstChild as HTMLElement;
      const scrollDiv = outerWrapper.querySelector("[class*='overflow-x-auto']") as HTMLElement;
      const innerRow = scrollDiv.firstChild as HTMLElement;
      Array.from(innerRow.children).forEach((child) => {
        expect(child).toHaveClass("flex-shrink-0");
      });
    });

    it("renders All tab + one tab per category + add button", () => {
      const cats = makeCategories(4);
      render(
        <UserCategoryTabs
          categories={cats}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      expect(screen.getByText("All")).toBeInTheDocument();
      cats.forEach((c) => expect(screen.getByText(c.name)).toBeInTheDocument());
    });
  });

  describe("interactions", () => {
    it("calls onSelect with category id when a tab is clicked", () => {
      const onSelect = jest.fn();
      const cats = makeCategories(2);
      render(
        <UserCategoryTabs
          categories={cats}
          activeId={null}
          onSelect={onSelect}
          onCreate={noop}
          onDelete={noop}
        />
      );
      fireEvent.click(screen.getByText("Category 1"));
      expect(onSelect).toHaveBeenCalledWith("cat-0");
    });

    it("calls onSelect(null) when clicking the active category (deselect)", () => {
      const onSelect = jest.fn();
      const cats = makeCategories(2);
      render(
        <UserCategoryTabs
          categories={cats}
          activeId="cat-0"
          onSelect={onSelect}
          onCreate={noop}
          onDelete={noop}
        />
      );
      fireEvent.click(screen.getByText("Category 1"));
      expect(onSelect).toHaveBeenCalledWith(null);
    });

    it("calls onSelect(null) when All tab is clicked", () => {
      const onSelect = jest.fn();
      render(
        <UserCategoryTabs
          categories={makeCategories(2)}
          activeId="cat-0"
          onSelect={onSelect}
          onCreate={noop}
          onDelete={noop}
        />
      );
      fireEvent.click(screen.getByText("All"));
      expect(onSelect).toHaveBeenCalledWith(null);
    });

    it("calls onCreate with the typed name on Enter", () => {
      const onCreate = jest.fn();
      render(
        <UserCategoryTabs
          categories={makeCategories(1)}
          activeId={null}
          onSelect={noop}
          onCreate={onCreate}
          onDelete={noop}
        />
      );
      // open the inline input
      fireEvent.click(screen.getByLabelText("New collection"));
      const input = screen.getByPlaceholderText("Collection name…");
      fireEvent.change(input, { target: { value: "Work" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onCreate).toHaveBeenCalledWith("Work");
    });

    it("does NOT call onCreate with empty/whitespace name", () => {
      const onCreate = jest.fn();
      render(
        <UserCategoryTabs
          categories={makeCategories(1)}
          activeId={null}
          onSelect={noop}
          onCreate={onCreate}
          onDelete={noop}
        />
      );
      fireEvent.click(screen.getByLabelText("New collection"));
      const input = screen.getByPlaceholderText("Collection name…");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onCreate).not.toHaveBeenCalled();
    });

    it("shows confirmation modal when the × button on a category is clicked", () => {
      const onDelete = jest.fn();
      const cats = makeCategories(1);
      render(
        <UserCategoryTabs
          categories={cats}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={onDelete}
        />
      );
      fireEvent.click(screen.getByLabelText("Delete Category 1"));
      expect(screen.getByText("Delete collection")).toBeInTheDocument();
      expect(onDelete).not.toHaveBeenCalled();
    });

    it("calls onDelete after confirming in the modal", () => {
      const onDelete = jest.fn();
      const cats = makeCategories(1);
      render(
        <UserCategoryTabs
          categories={cats}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={onDelete}
        />
      );
      fireEvent.click(screen.getByLabelText("Delete Category 1"));
      fireEvent.click(screen.getByRole("button", { name: "Delete" }));
      expect(onDelete).toHaveBeenCalledWith("cat-0");
    });

    it("cancels deletion when Cancel is clicked in the modal", () => {
      const onDelete = jest.fn();
      const cats = makeCategories(1);
      render(
        <UserCategoryTabs
          categories={cats}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={onDelete}
        />
      );
      fireEvent.click(screen.getByLabelText("Delete Category 1"));
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onDelete).not.toHaveBeenCalled();
      expect(screen.queryByText("Delete collection")).not.toBeInTheDocument();
    });

    it("Escape key cancels creation without calling onCreate", () => {
      const onCreate = jest.fn();
      render(
        <UserCategoryTabs
          categories={makeCategories(1)}
          activeId={null}
          onSelect={noop}
          onCreate={onCreate}
          onDelete={noop}
        />
      );
      fireEvent.click(screen.getByLabelText("New collection"));
      const input = screen.getByPlaceholderText("Collection name…");
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.keyDown(input, { key: "Escape" });
      expect(onCreate).not.toHaveBeenCalled();
      expect(screen.queryByPlaceholderText("Collection name…")).not.toBeInTheDocument();
    });
  });

  describe("active state styling", () => {
    it("active tab has the yellow active class", () => {
      const cats = makeCategories(2);
      render(
        <UserCategoryTabs
          categories={cats}
          activeId="cat-0"
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      const activeTab = screen.getByText("Category 1").closest("div");
      expect(activeTab).toHaveClass("bg-yellow-400");
    });

    it("All tab is highlighted when activeId is null", () => {
      render(
        <UserCategoryTabs
          categories={makeCategories(2)}
          activeId={null}
          onSelect={noop}
          onCreate={noop}
          onDelete={noop}
        />
      );
      expect(screen.getByText("All")).toHaveClass("bg-yellow-400");
    });
  });
});
