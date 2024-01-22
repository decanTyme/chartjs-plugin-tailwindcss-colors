/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "line",
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          data: [5, -6, -4, -8, -6, 10, 0, 7],
          pointHoverBackgroundColor: "blue-900",
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      scales: {
        x: { display: false },
        y: { display: false },
      },
      plugins: { legend: false, tooltip: false },
    },
  },

  options: {
    tolerance: 0.0001,
    async run(chart) {
      const element = chart.getDatasetMeta(0).data[2]

      await helpers.triggerMouseEvent(chart, "mousemove", element)
    },
  },
}
