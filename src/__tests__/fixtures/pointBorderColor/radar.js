/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "radar",
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          data: [5, 10, 6, 8, 3],
          pointBorderColor: "emerald-600",
          pointBorderWidth: 3,
          radius: 5,
        },
        {
          data: [7, 3, 9, 4, 6],
          pointBorderColor: "indigo-500",
          pointBorderWidth: 3,
          radius: 5,
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
