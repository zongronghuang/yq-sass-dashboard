import { LineChart } from "@mui/x-charts/LineChart";
import { Paper } from "@mui/material";

export default function ActiveUsersChart({
  activeUsers,
}: {
  activeUsers: any[];
}) {
  const { xData, yData } = activeUsers.reduce(
    (collection, user) => {
      collection.xData.push(Date.parse(user.timeBucket));
      collection.yData.push(user.value);
      return collection;
    },
    { xData: [], yData: [] }
  );

  return (
    <Paper className="grow-1 drop-shadow-lg">
      <LineChart
        xAxis={[
          {
            data: xData,
            valueFormatter: (value: string) =>
              new Date(value).toLocaleDateString(),
          },
        ]}
        series={[{ data: yData }]}
        height={300}
      />
    </Paper>
  );
}
