async function main() {
  let data;
  try {
    const res = await fetch("data/data.json");
    data = await res.json();
    console.log("Data loaded:", data);
  } catch (err) {
    console.error("Failed to fetch JSON:", err);
    alert("Failed to load data. Check data/data.json path and GitHub Pages.");
    return;
  }

  // Initialize Tabulator table
  const table = new Tabulator("#table", {
    data: data,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    columns: [
      { title: "Name", field: "name", sorter: "string" },
      { title: "Category", field: "category", sorter: "string" },
      { title: "Status", field: "status", sorter: "string" },
      { title: "Value", field: "value", sorter: "number" },
      { title: "Date", field: "date", sorter: "date" },
    ],
  });

  // Global search
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    table.setFilter((row) => {
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query)
      );
    });
  });

  // Category filter
  const categorySelect = document.getElementById("category");
  categorySelect.addEventListener("change", () => {
    const val = categorySelect.value;
    table.setFilter(val ? "category" : "", val ? "=" : "", val);
  });

  // Status filter
  const statusSelect = document.getElementById("status");
  statusSelect.addEventListener("change", () => {
    const val = statusSelect.value;
    table.setFilter(val ? "status" : "", val ? "=" : "", val);
  });
}

main();
