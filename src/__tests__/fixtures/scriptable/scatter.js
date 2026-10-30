/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "scatter",
    data: {
      labels: ["A", "B", "C", "D"],
      datasets: [
        {
          data: [
            { x: 1, y: 3, r: 20 },
            { x: 2, y: 6, r: 28 },
            { x: 3, y: 4, r: 16 },
            { x: 4, y: 8, r: 24 },
          ],
          /** @type {import("chart.js").Scriptable<string, import("chart.js").ScriptableContext<"scatter">>} */
          backgroundColor: ({ dataIndex }) =>
            ["red-500", "blue-500/50", "green-600", "rgb(120 53 15)"][
              dataIndex
            ],
          /** @type {import("chart.js").Scriptable<string, import("chart.js").ScriptableContext<"scatter">>} */
          borderColor: ({ dataIndex }) =>
            ["red-900", "blue-900/75", "green-900", "#78350f"][dataIndex],
          borderWidth: 3,
          pointRadius: 12,
        },
      ],
    },
    options: {
      scales: { x: { display: false }, y: { display: false } },
      plugins: { legend: false, tooltip: false },
    },
  },
}
