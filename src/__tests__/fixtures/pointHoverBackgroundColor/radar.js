/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "radar",
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          data: [7, 3, 9, 4, 6],
          pointHoverBackgroundColor: "rose-700",
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
    async run(chart) {
      const element = chart.getDatasetMeta(0).data[2]

      await helpers.triggerMouseEvent(chart, "mousemove", element)
    },
  },
}
