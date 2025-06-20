import { Paper } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function GeneralSkeleton() {
  return (
    <Paper className="w-full p-10 sm:pl-[56px] mt-16">
      <Stack height={300} className="flex flex-col justify-between">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rounded" width="100%" height={60} />
        <Skeleton variant="rounded" width="100%" height={60} />
        <Skeleton variant="rounded" width="100%" height={60} />
      </Stack>
    </Paper>
  );
}
