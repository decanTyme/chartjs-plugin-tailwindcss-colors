/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "line",
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      datasets: [
        {
          data: [12, 19, 3, 5, 2, 33, 21, 12, 45, 18, 8, 15],
          borderColor: "yellow-500",
          backgroundColor: "yellow-500/40",
          fill: true,
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
