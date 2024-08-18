/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "bar",
    data: {
      labels: [0, 1, 2, 3, 4, 5],
      datasets: [
        {
          data: [-5, 5, 10, 5, -10, -5],
          backgroundColor: [
            "red-600",
            "#3b82f6/75",
            "choco-200",
            "navy",
            "purple-900/60",
            "orange/25",
          ],
        },
        {
          data: [-5, 5, 10, 5, -10, -5],
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
