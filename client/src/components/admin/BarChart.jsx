import { toClassName } from "../../utils/adminHelpers";

// A simple horizontal bar chart made with plain HTML and CSS (no library).
// Each bar's width is that item's share of the total.
// Props:
//   title - heading shown above the chart
//   data  - array like [{ label: "Water", value: 3 }]
//   total - number used to work out percentages
//   tone  - optional: when true, bars are coloured by label (status colours)
function BarChart({ title, data, total, tone = false }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>

      {total === 0 ? (
        <p className="chart-empty">No data to display.</p>
      ) : (
        data.map((item) => {
          const percent = Math.round((item.value / total) * 100);

          return (
            <div className="bar-row" key={item.label}>
              <div className="bar-label">
                <span>{item.label}</span>
                <span>
                  {item.value} ({percent}%)
                </span>
              </div>

              <div className="bar-track">
                {/* The width is the only inline style: it depends on the data */}
                <div
                  className={
                    tone
                      ? `bar-fill tone-${toClassName(item.label)}`
                      : "bar-fill"
                  }
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default BarChart;
