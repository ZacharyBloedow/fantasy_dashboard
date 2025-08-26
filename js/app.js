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

  // Global search
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    table.setFilter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query)
      )
    );
  });

  // Position filter
  const positionSelect = document.getElementById("position");
  positionSelect.addEventListener("change", () => {
    const val = positionSelect.value;
    table.setFilter(val ? "category" : "", val ? "=" : "", val);
  });

  // NFL Team filter
  const nflTeamSelect = document.getElementById("nfl_team");
  nflTeamSelect.addEventListener("change", () => {
    const val = nflTeamSelect.value;
    table.setFilter(val ? "status" : "", val ? "=" : "", val);
  });

  // Fantasy Team filter
  const fantasyTeamSelect = document.getElementById("fantasy_team");
  fantasyTeamSelect.addEventListener("change", () => {
    const val = fantasyTeamSelect.value;
    table.setFilter(val ? "fantasy_team" : "", val ? "=" : "", val);
  });
}

main();
