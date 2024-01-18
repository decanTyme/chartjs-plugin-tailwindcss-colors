/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "line",
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          data: [5, -6, -4, -8, -6, 10, 0, 7],
          /** @type {import("chart.js").Scriptable<string, import("chart.js").ScriptableContext<"bar">>} */
          backgroundColor: ({ dataset, dataIndex }) => {
            const value = dataset.data[dataIndex]
            const max = Math.max(...dataset.data)
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
