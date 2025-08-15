// Utility: debounce to avoid over-filtering while typing
function debounce(fn, ms = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const els = {};
function $(id) {
  return document.getElementById(id);
}

let table;

async function main() {
  // Load data from the repo (same origin, so fetch works on GitHub Pages)
  const res = await fetch("data/data.json");
  const data = await res.json();

  // Build the table
  table = new Tabulator("#table", {
    data,
    layout: "fitColumns",
    reactiveData: false,
    height: "600px",
    pagination: "local",
    paginationSize: 15,
    paginationSizeSelector: [10, 15, 25, 50, 100],
    initialSort: [{ column: "date", dir: "desc" }],
    columns: [
      {
        title: "ID",
        field: "id",
        sorter: "number",
        width: 80,
        headerFilter: "number",
      },
      { title: "Name", field: "name", headerFilter: "input" },
      {
        title: "Category",
        field: "category",
        headerFilter: "select",
        headerFilterParams: { values: true },
      },
      {
        title: "Status",
        field: "status",
        headerFilter: "select",
        headerFilterParams: { values: true },
      },
      {
        title: "Value",
        field: "value",
        sorter: "number",
        headerFilter: "number",
      },
      { title: "Date", field: "date", sorter: "date", headerFilter: "input" },
    ],
  });

  // Hook up external controls
  els.search = $("search");
  els.category = $("category");
  els.status = $("status");
  els.minVal = $("minVal");
  els.maxVal = $("maxVal");
  els.clear = $("clear");
  els.download = $("download");

  const updateFilters = debounce(() => {
    const term = (els.search.value || "").toLowerCase().trim();
    const category = els.category.value;
    const statuses = Array.from(els.status.selectedOptions).map((o) => o.value);
    const minVal = parseFloat(els.minVal.value);
    const maxVal = parseFloat(els.maxVal.value);

    table.setFilter((rowData) => {
      // Global search across all fields
      const globalOK =
        !term ||
        Object.values(rowData).some((v) =>
          String(v).toLowerCase().includes(term)
        );

      // Category exact match (if chosen)
      const categoryOK = !category || String(rowData.category) === category;

      // Multi-status (if any selected)
      const statusOK =
        statuses.length === 0 || statuses.includes(String(rowData.status));

      // Numeric range on 'value'
      let valueOK = true;
      const v = Number(rowData.value);
      if (!Number.isNaN(minVal)) valueOK = valueOK && v >= minVal;
      if (!Number.isNaN(maxVal)) valueOK = valueOK && v <= maxVal;

      return globalOK && categoryOK && statusOK && valueOK;
    });
  }, 150);

  els.search.addEventListener("input", updateFilters);
  els.category.addEventListener("change", updateFilters);
  els.status.addEventListener("change", updateFilters);
  els.minVal.addEventListener("input", updateFilters);
  els.maxVal.addEventListener("input", updateFilters);

  els.clear.addEventListener("click", () => {
    els.search.value = "";
    els.category.value = "";
    Array.from(els.status.options).forEach((o) => (o.selected = false));
    els.minVal.value = "";
    els.maxVal.value = "";
    table.clearFilter();
  });

  els.download.addEventListener("click", () => {
    table.download("csv", "dashboard-data.csv");
  });
}

main().catch((err) => {
  console.error(err);
  alert(
    "Failed to load data. Check your data/data.json path and GitHub Pages settings."
  );
});
