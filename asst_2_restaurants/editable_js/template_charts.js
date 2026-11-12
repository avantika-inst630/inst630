/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */


/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}

function countBy(data, getKey) {
  const counts = {};
  data.forEach((item) => {
    const key = getKey(item);
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, number]) => ({ label, number }))
    .sort((a, b) => b.number - a.number);
}

function wrapLabel(text, maxLength) {
  const lines = [];
  let line = '';
  text.split(' ').forEach((word) => {
    if (line && (line + ' ' + word).length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  });
  lines.push(line);
  return lines;
}

function businessTypeCounts(data) {
  const sorted = countBy(data, (item) => orNotListed(item.category));
  const top = sorted.slice(0, 8);
  const otherTotal = sorted.slice(8).reduce((sum, entry) => sum + entry.number, 0);
  return otherTotal > 0 ? [...top, { label: 'All other types', number: otherTotal }] : top;
}

function resultCounts(data) {
  return countBy(data, (item) => orNotListed(item.inspection_results));
}

function failedCheckCounts(data) {
  const checkNames = Object.keys(data[0]).filter(
    (key) => data[0][key] === 'In Compliance' || data[0][key] === 'Out of Compliance'
  );
  return checkNames
    .map((name) => {
      const readable = name.replace(/_and$/, '').replace(/_/g, ' ');
      return {
        label: readable.charAt(0).toUpperCase() + readable.slice(1),
        number: data.filter((item) => item[name] === 'Out of Compliance').length,
      };
    })
    .filter((entry) => entry.number > 0)
    .sort((a, b) => b.number - a.number);
}

function showCharts(data) {
  const types = businessTypeCounts(data);
  const results = resultCounts(data);
  const checks = failedCheckCounts(data);
  const notListed = results.find((entry) => entry.label === 'Not listed');
  const topResult = results.find((entry) => entry.label !== 'Not listed');

  const summaryOne = `${types[0].label} had the most inspections: ${types[0].number} of ${data.length}.`;
  const summaryTwo = `"${topResult.label}" was the most common result: ${topResult.number} of ${data.length} inspections, while ${
    notListed ? notListed.number : 0
  } had no result listed.`;
  const summaryThree = `${checks[0].label} was the check most often out of compliance: ${checks[0].number} times across ${data.length} inspections.`



  return `
                <h2 class="view-title"> Charts View</h2>
                <p class="view-description">Patterns in the data at a glance</p>
                <div class="charts-grid">
                    <figure class="chart-figure">
                        <canvas id="chart-one" role="img" aria-describedby="chart-one-summary"></canvas>
                        <figcaption class="chart-summary" id="chart-one-summary">${summaryOne}</figcaption>
                    </figure>
                    <figure class="chart-figure">
                        <canvas id="chart-two" role="img" aria-describedby="chart-two-summary"></canvas>
                        <figcaption class="chart-summary" id="chart-two-summary">${summaryTwo}</figcaption>
                    </figure>
                    <figure class="chart-figure">
                        <canvas id="chart-three" role="img" aria-describedby="chart-three-summary"></canvas>
                        <figcaption class="chart-summary" id="chart-three-summary">${summaryThree}</figcaption>
                    </figure>
                </div>
            `;
}

function drawCharts(data) {
  if (typeof Chart === 'undefined') {
    document.querySelector('.charts-grid').innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }

  const types = businessTypeCounts(data);
  new Chart(document.querySelector('#chart-one'), {
    type: 'bar',
    data: {
      labels: types.map((entry) => entry.label),
      datasets: [{ label: 'Number of inspections', data: types.map((entry) => entry.number), backgroundColor: '#2a78d6' }]
    },
    options: {
      indexAxis: 'y',
      aspectRatio: 1,
      plugins: {
        title: { display: true, text: 'Inspections by type of business' },
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'Inspections' }, beginAtZero: true },
        y: { title: { display: true, text: 'Type of business' } }
      }
    }
  });

  const results = resultCounts(data);
  new Chart(document.querySelector('#chart-two'), {
    type: 'pie',
    data: {
      labels: results.map((entry) => entry.label),
      datasets: [{
        label: 'Number of inspections',
        data: results.map((entry) => entry.number),
        backgroundColor: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      aspectRatio: 1,
      plugins: {
        title: { display: true, text: 'Share of inspections by result' },
        legend: { position: 'bottom' }
      }
    }
  });

  const checks = failedCheckCounts(data);
  new Chart(document.querySelector('#chart-three'), {
    type: 'bar',
    data: {
      labels: checks.map((entry) => wrapLabel(entry.label, 16)),
      datasets: [{ label: 'Times out of compliance', data: checks.map((entry) => entry.number), backgroundColor: '#eb6834' }]
    },
    options: {
      indexAxis: 'y',
      aspectRatio: 1,
      plugins: {
        title: { display: true, text: 'Food safety checks most often out of compliance' },
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'Inspections where the check failed' }, beginAtZero: true },
        y: { title: { display: true, text: 'Food safety check' }, ticks: { autoSkip: false } }
      }
    }
  });
}

export { showCharts, drawCharts };
