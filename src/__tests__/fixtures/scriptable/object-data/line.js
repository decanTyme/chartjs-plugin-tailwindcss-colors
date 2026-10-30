/** @type {import("../../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "line",
    data: {
      labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          data: { 0: 5, 1: -6, 2: -4, 3: -8, 4: -6, 5: 10, 6: 0, 7: 7 },
          /** @type {import("chart.js").Scriptable<string, import("chart.js").ScriptableContext<"line">>} */
          backgroundColor: ({ dataset, dataIndex }) => {
            const values = /** @type {number[]} */ (Object.values(dataset.data))
            const value = values[dataIndex]
            const max = Math.max(...values)
            return value < Math.floor(max / 2) ? "red-500" : "green-600"
          },
          radius: 4,
        },
      ],
    },
    options: {
      scales: {
        x: { display: false },
        y: { display: false },
      },
      plugins: { legend: false },
    },
  },
}
