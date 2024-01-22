/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "line",
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          data: [5, -6, -4, -8, -6, 10, 0, 7],
          pointBorderColor: "fuchsia-400",
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
