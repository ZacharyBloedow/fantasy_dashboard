async function main() {
  let data;
  try {
    const res = await fetch("data/data.json");
    data = await res.json();
  } catch (err) {
    console.error("Failed to load JSON:", err);
    alert("Failed to load data.json.");
    return;
  }

  // Populate dropdown filters
  const positions = [...new Set(data.map((d) => d.category))].sort();
  const nflTeams = [...new Set(data.map((d) => d.status))].sort();
  const fantasyTeams = [...new Set(data.map((d) => d.fantasy_team))].sort();

  const posSelect = document.getElementById("position");
  positions.forEach((p) => posSelect.add(new Option(p, p)));
  const nflSelect = document.getElementById("nfl_team");
  nflTeams.forEach((t) => nflSelect.add(new Option(t, t)));
  const fantasySelect = document.getElementById("fantasy_team");
  fantasyTeams.forEach((t) => fantasySelect.add(new Option(t, t)));

  const table = new Tabulator("#table", {
    data: data,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 15,
    columns: [
      { title: "Player", field: "name", sorter: "string" },
      { title: "Position", field: "category", sorter: "string" },
      { title: "NFL Team", field: "status", sorter: "string" },
      { title: "Fantasy Team", field: "fantasy_team", sorter: "string" },
      { title: "Keeper Round", field: "keeper_round", sorter: "number" },
      { title: "Overall Pick", field: "value", sorter: "number" },
      { title: "Keeper Pick", field: "keeper_pick", sorter: "number" },
      { title: "Date", field: "date", sorter: "date" },
    ],
  });

  document.getElementById("search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    table.setFilter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  });
  posSelect.addEventListener("change", (e) => {
    table.setFilter(
      e.target.value ? "category" : "",
      e.target.value ? "=" : "",
      e.target.value
    );
  });
  nflSelect.addEventListener("change", (e) => {
    table.setFilter(
      e.target.value ? "status" : "",
      e.target.value ? "=" : "",
      e.target.value
    );
  });
  fantasySelect.addEventListener("change", (e) => {
    table.setFilter(
      e.target.value ? "fantasy_team" : "",
      e.target.value ? "=" : "",
      e.target.value
    );
  });
}

main();
