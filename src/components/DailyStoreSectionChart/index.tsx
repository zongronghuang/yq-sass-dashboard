import { BarChart } from "@mui/x-charts";
import { Paper } from "@mui/material";

export default function DailyStoreSectionChart({
  dailyStoreData,
}: {
  dailyStoreData: { [key: string]: any }[];
}) {
  const { locations, waitTimes, usageRatios, staff } = dailyStoreData.reduce(
    (collection, { locationName, metrics }) => {
      const { waitTimeSeconds, workForceUtilization } = metrics;
      const { total, persons } = workForceUtilization;
      collection.locations.push(locationName);
      collection.waitTimes.push(waitTimeSeconds);
      collection.usageRatios.push(total);
      collection.staff.push(persons.length);
      return collection;
    },
    { locations: [], waitTimes: [], usageRatios: [], staff: [] }
  );

  return (
    <Paper className="grow-1 drop-shadow-lg">
      <BarChart
        sx={{ maxWidth: "800px", margin: "0 auto" }}
        xAxis={[{ data: locations }]}
        series={[
          { data: waitTimes, label: "Wait time (s)", color: "lightblue" },
        ]}
        height={300}
        barLabel="value"
      />
      <BarChart
        sx={{ maxWidth: "800px", margin: "0 auto" }}
        xAxis={[{ data: locations }]}
        series={[
          {
            data: usageRatios,
            label: "Workforce usage (%)",
            color: "pink",
            valueFormatter: (value) => `${value}%`,
          },
        ]}
        height={300}
        barLabel="value"
      />
      <BarChart
        sx={{ maxWidth: "800px", margin: "0 auto" }}
        xAxis={[{ data: locations }]}
        series={[{ data: staff, label: "Staff", color: "darkseagreen" }]}
        height={300}
        barLabel="value"
      />
    </Paper>
  );
}
