import * as React from "react";

import Enzyme, { shallow } from "enzyme";

import App from "./App";
import EnzymeAdapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe("App", () => {
  it("renders without crashing", () => {
    const app = shallow(<App />);
    expect(app.exists()).toBe(true);
  });
});
