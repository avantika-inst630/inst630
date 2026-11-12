// /**
//  * CATEGORY VIEW - STUDENTS IMPLEMENT
//  * Group data by categories
//  */


function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}

function countFailedChecks(inspection) {
  return Object.values(inspection).filter((value) => value === 'Out of Compliance').length;
}

function showCategories(data) {
  
  const groups = {};
  data.forEach((inspection) => {
    const key = orNotListed(inspection.category);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(inspection);
  });

  const summaries = Object.entries(groups)
    .map(([name, items]) => {
      const failedTotal = items.reduce((sum, item) => sum + countFailedChecks(item), 0);
      return { name, items, average: failedTotal / items.length };
    })
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name));

  const sectionHTML = summaries
    .map((group) => {
      const itemHTML = group.items
        .slice()
        .sort((a, b) => new Date(b.inspection_date) - new Date(a.inspection_date))
        .map(
          (item) => `
                    <div class="category-item">
                        <span><strong>${item.name}</strong><br>${item.city}</span>
                        <span>${formatDate(item.inspection_date)}<br>${orNotListed(item.inspection_results)}</span>
                    </div>
                `
        )
        .join("");
      return `
                <section class="category-section">
                    <h3 class="category-header" style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                        <span>${group.name}</span>
                        <span>${group.items.length} inspections · ${group.average.toFixed(2)} failed checks on average</span>
                    </h3>
                    <div class="category-items">
                        ${itemHTML}
                    </div>
                </section>
            `;
    })
    .join("");

  /*html*/
  return `
                <h2 class="view-title"> Category View</h2>
                <p class="view-description">Compare types of business: there are ${summaries.length} groups arranged as largest first</p>
                ${sectionHTML}
            `;
}

export default showCategories;