import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import React from "react";

import Modal from "../components/Modal";
import ModalPortal from "../Portal";

test("1.should show modal when have props", () => {
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

  const modal = screen.findByTestId("modal-root");

  expect(modal).toBeTruthy();
  expect(screen.getByText("hello")).toContainHTML("div");
});

test("2. should have style in modal div", () => {
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
        <div className="hello">hello</div>
      </Modal>
    </ModalPortal>
  );

  const div = screen.getByText("hello");

  expect(div).toHaveStyle(`display: flex`);
  expect(div).toHaveStyle(`justify-content: center`);
  expect(div).toHaveStyle(`flex-direction: column`);
});
