/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "bar",
    data: {
      labels: ["A", "B", "C", "D"],
      datasets: [
        {
          data: [3, 6, 4, 8],
          /** @type {import("chart.js").Scriptable<string, import("chart.js").ScriptableContext<"bar">>} */
          backgroundColor: ({ dataIndex }) =>
            ["red-500", "blue-500/50", "green-600", "rgb(120 53 15)"][
              dataIndex
            ],
          /** @type {import("chart.js").Scriptable<string, import("chart.js").ScriptableContext<"bar">>} */
          borderColor: ({ dataIndex }) =>
            ["red-900", "blue-900/75", "green-900", "#78350f"][dataIndex],
          borderWidth: 3,
        },
      ],
    },
    options: {
      scales: { x: { display: false }, y: { display: false } },
      plugins: { legend: false, tooltip: false },
    },
  },
}
