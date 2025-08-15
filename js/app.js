async function main() {
  try {
    const res = await fetch("data/data.json");
    const data = await res.json();

    const table = new Tabulator("#table", {
      data,
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 10,
      columns: [
        { title: "ID", field: "id" },
        { title: "Name", field: "name" },
        { title: "Category", field: "category" },
        { title: "Status", field: "status" },
        { title: "Value", field: "value" },
        { title: "Date", field: "date" },
      ],
    });

    // Basic global search
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      table.setFilter((row) => {
        return Object.values(row).some((val) =>
          String(val).toLowerCase().includes(query)
        );
      });
    });
  } catch (err) {
    console.error("Failed to load data:", err);
    alert(
      "Failed to load data. Check your data/data.json path and GitHub Pages settings."
    );
  }
}

main();
