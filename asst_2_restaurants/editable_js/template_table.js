
// /**
//  * TABLE VIEW - STUDENTS IMPLEMENT
//  * Display data in sortable rows - good for scanning specific information
//  */
// 

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}


function countFailedChecks(inspection) {
  return Object.values(inspection).filter((value) => value === 'Out of Compliance').length;
}

function toTitleCase(text) {
  return text.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function showTable(data) {
  const rows = data
    .map((inspection) => ({
      name: inspection.name,
      city: toTitleCase(inspection.city),
      date: inspection.inspection_date,
      type: orNotListed(inspection.inspection_type),
      result: orNotListed(inspection.inspection_results),
      failed: countFailedChecks(inspection),
    }))
    .sort((a, b) => b.failed - a.failed || new Date(b.date) - new Date(a.date));

  const rowHTML = rows
    .map(
      (row) => `
                <tr>
                    <th scope="row">${row.name}</th>
                    <td>${row.city}</td>
                    <td>${formatDate(row.date)}</td>
                    <td>${row.type}</td>
                    <td>${row.result}</td>
                    <td>${row.failed} of 15</td>
                </tr>
            `
    )
    .join("");

  /*html*/
  return `
                <h2 class="view-title"> Table View </h2>
                <p class="view-description">Scan every inspection, with the most failed checks first</p>
                <div style="overflow-x: auto;">
                    <table class="restaurant-table">
                        <caption>All ${rows.length} inspections are sorted by number of failed food safety checks, and then by most recent date. </caption>
                        <thead>
                            <tr>
                                <th scope="col">Business</th>
                                <th scope="col">City</th>
                                <th scope="col">Inspected</th>
                                <th scope="col">Inspection type</th>
                                <th scope="col">Result</th>
                                <th scope="col">Checks out of compliance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowHTML}
                        </tbody>
                    </table>
                </div>
            `;
}

export default showTable;