import { render } from "@testing-library/react-native";

import App from "./index";

describe("Scheduler screen", () => {
  it("renders the Scheduler identity", async () => {
    const { getByText } = await render(<App />);

    expect(getByText("Scheduler")).toBeTruthy();
  });
});
