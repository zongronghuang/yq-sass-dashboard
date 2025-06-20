import { useRef, useState, useMemo, useEffect, type ChangeEvent } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import { IconButton, Menu, MenuItem, Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableViewIcon from "@mui/icons-material/TableView";
import BarChartIcon from "@mui/icons-material/BarChart";
import { mockActiveUsers } from "../../mocks";
import { getToken } from "../../utils";
import { fetchActiveUsers } from "../../apis";

export default function ActiveUsersPage() {
  const anchorRef = useRef<null | HTMLButtonElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeView, setActiveView] = useState("table");
  const [activeUsers, setActiveUsers] = useState<typeof mockActiveUsers>([]);

  useEffect(() => {
    fetchActiveUsersFn();

    async function fetchActiveUsersFn() {
      try {
        if (!getToken()) return;

        const res = await fetchActiveUsers();
        if (!res?.ok)
          throw new Error(
            `Request status: ${res?.status} | ${res?.statusText}`
          );
        const data = await res?.json();
        if (data) setActiveUsers(mockActiveUsers);
      } catch (error: any) {
        console.error(`[Request: ${error.name}] ${error.message}`);
      }
    }
  }, []);

  return (
    <div className="pt-14 sm:pl-[56px]">
      <header className="flex bg-white h-14 relative justify-center items-center sm:h-18">
        <h1 className="font-semibold text-xl sm:text-2x">Active Users</h1>

        <IconButton
          ref={anchorRef}
          component="button"
          className="!absolute top-2/4 right-2 -translate-y-6/12"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <TableChartIcon />
        </IconButton>

        <Menu
          anchorEl={anchorRef.current}
          open={openMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={() => {
            console.log("close menu");
            setOpenMenu(false);
          }}
        >
          <MenuItem
            className={clsx({
              "!bg-blue-600 !text-white": activeView === "table",
            })}
            onClick={() => setActiveView("table")}
          >
            <TableViewIcon className="mr-2" />
            Table View
          </MenuItem>
          <MenuItem
            className={clsx({
              "!bg-blue-600 !text-white": activeView === "chart",
            })}
            onClick={() => setActiveView("chart")}
          >
            <BarChartIcon className="mr-2" />
            Chart View
          </MenuItem>
        </Menu>
      </header>
      <main className="flex justify-center  py-9 px-1 sm:px-3">
        {activeView === "table" && <DataTable activeUsers={activeUsers} />}
        {activeView === "chart" && <DataChart activeUsers={activeUsers} />}
      </main>
    </div>
  );
}

function DataTable({ activeUsers }: { activeUsers: any[] }) {
  const [sortCategory, setSortCategory] = useState("time_bucket");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const headCells = [
    { id: "time_bucket", label: "Time" },
    { id: "value", label: "Users" },
  ];
  const sortedRows = useMemo(
    () =>
      [...activeUsers].sort((a, b) => {
        if (sortCategory === "time_bucket") {
          return sortDirection === "asc"
            ? Date.parse(a.timeBucket) - Date.parse(b.timeBucket)
            : Date.parse(b.timeBucket) - Date.parse(a.timeBucket);
        } else {
          return sortDirection === "asc"
            ? a.value - b.value
            : b.value - a.value;
        }
      }),
    [sortCategory, sortDirection, activeUsers]
  );

  return (
    <Paper className="grow-1 drop-shadow-lg">
      <TableContainer className="max-h-[65vh]">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((cell) => (
                <TableCell
                  className="sm:!text-lg"
                  key={cell.id}
                  align="left"
                  sx={{ backgroundColor: "rgb(25, 118, 210)" }}
                >
                  <TableSortLabel
                    sx={{
                      "&.Mui-active": {
                        color: "white",
                      },
                      "& svg": {
                        opacity: 1,
                      },
                      "&.Mui-active svg": { stroke: "white", fill: "white" },
                    }}
                    active={sortCategory === cell.id}
                    direction={sortDirection}
                    onClick={() => {
                      setSortCategory(cell.id);
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    {cell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((user) => (
                <TableRow key={user.timeBucket} className="hover:!bg-gray-100">
                  <TableCell align="left" className="sm:!text-lg">
                    {dayjs(user.timeBucket).format("YYYY-MM-DD (HH:mm:ss)")}
                  </TableCell>
                  <TableCell align="left" className="sm:!text-lg">
                    {user.value}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        rowsPerPage={rowsPerPage}
        page={page}
        count={activeUsers.length}
        onPageChange={(_event: unknown, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
      />
    </Paper>
  );
}

function DataChart({ activeUsers }: { activeUsers: any[] }) {
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
