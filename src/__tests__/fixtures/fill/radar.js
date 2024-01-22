/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "radar",
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          data: [5, 10, 6, 8, 3],
          borderColor: "yellow-500",
          backgroundColor: "yellow-500/40",
          fill: true,
        },
        {
          data: [7, 3, 9, 4, 6],
          borderColor: "cyan-500",
          backgroundColor: "cyan-500/40",
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
