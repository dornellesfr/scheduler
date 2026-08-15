import { render } from "@testing-library/react-native";

import HistoryScreen from "../src/app/(tabs)/history";

jest.mock("lucide-react-native", () => ({
  History: () => null,
}));

describe("History screen", () => {
  it("renders the initial empty state", async () => {
    const { getByText } = await render(<HistoryScreen />);

    expect(getByText("Histórico de consultas")).toBeTruthy();
    expect(getByText("Nenhuma consulta encontrada.")).toBeTruthy();
  });
});
