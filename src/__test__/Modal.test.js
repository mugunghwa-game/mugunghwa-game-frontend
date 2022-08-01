import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import React from "react";

import Modal from "../components/Modal";
import ModalPortal from "../Portal";

describe("Modal component", () => {
  beforeEach(() => {
    let portalRoot = document.getElementById("modal-root");

    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "modal-root");
      portalRoot.setAttribute("test-id", "modal-root");
      document.body.appendChild(portalRoot);
    }

    render(
      <ModalPortal>
        <Modal>
          <div>hello</div>
        </Modal>
      </ModalPortal>
    );
  });

  it("1.Modal 컴포넌트에 props가 있으면 그대로 보여줘야 한다.", () => {
    const modal = screen.findByTestId("modal-root");

    expect(modal).toBeTruthy();
    expect(screen.getByText("hello")).toContainHTML("div");
  });

  it("2. Modal 컴포넌트의 display, justify-content, flex-direction 스타일이 정해져 있고, 일치해야한다.", () => {
    const div = screen.getByText("hello");

    expect(div).toHaveStyle(`display: flex`);
    expect(div).toHaveStyle(`justify-content: center`);
    expect(div).toHaveStyle(`flex-direction: column`);
  });
});
