import {
  useRef,
  useState,
  useMemo,
  useEffect,
  lazy,
  Suspense,
  type ChangeEvent,
} from "react";
import clsx from "clsx";
import { IconButton, Menu, MenuItem, Paper } from "@mui/material";
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
import ChartSkeleton from "../../components/GeneralSkeleton";
import { getToken } from "../../utils";
import { fetchDailyStoreSections } from "../../apis";
import { mockDailyStoreSectionData } from "../../mocks";

const DailyStoreSectionChart = lazy(
  () => import("../../components/DailyStoreSectionChart")
);

export default function DailyStoreSectionPage() {
  const anchorRef = useRef<null | HTMLButtonElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeView, setActiveView] = useState("table");
  const [dailyStoreData, setDailyStoreData] = useState<
    typeof mockDailyStoreSectionData
  >([]);

  useEffect(() => {
    fetchDailyStoreSectionsFn();

    async function fetchDailyStoreSectionsFn() {
      try {
        if (!getToken()) return;

        const res = await fetchDailyStoreSections();
        if (!res?.ok)
          throw new Error(
            `Request status: ${res?.status} | ${res?.statusText}`
          );
        const data = await res?.json();

        if (data) setDailyStoreData(mockDailyStoreSectionData);
      } catch (error: any) {
        console.error(`[Request: ${error.name}] ${error.message}`);
      }
    }
  }, []);

  return (
    <div className="pt-14 sm:pl-[56px]">
      <header className="flex h-14 bg-white relative justify-center items-center  sm:h-18">
        <h1 className="font-semibold text-xl sm:text-2x">
          Daily Store Sections
        </h1>

        <IconButton
          ref={anchorRef}
          component="button"
          className="!absolute top-2/4 right-2 -translate-y-6/12"
          onClick={() => {
            setOpenMenu(!openMenu);
          }}
        >
          <TableChartIcon />
        </IconButton>

        <Menu
          anchorEl={anchorRef.current}
          open={openMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={() => {
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
      <main className="flex justify-center py-9 px-1 sm:px-3">
        {activeView === "table" && (
          <DataTable dailyStoreData={dailyStoreData} />
        )}

        <Suspense fallback={<ChartSkeleton />}>
          {activeView === "chart" && (
            <DailyStoreSectionChart dailyStoreData={dailyStoreData} />
          )}
        </Suspense>
      </main>
    </div>
  );
}

function DataTable({
  dailyStoreData,
}: {
  dailyStoreData: { [key: string]: any }[];
}) {
  const [sortCategory, setSortCategory] = useState("time_bucket");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const headCells = [
    { id: "location", label: "Area" },
    { id: "wait", label: "Wait(s)" },
    { id: "total", label: "People" },
    { id: "staff", label: "Staff" },
  ];
  const sortedRows = useMemo(
    () =>
      [...dailyStoreData].sort((a, b) => {
        if (sortCategory === "wait") {
          return sortDirection === "asc"
            ? a.metrics.waitTimeSeconds - b.metrics.waitTimeSeconds
            : b.metrics.waitTimeSeconds - a.metrics.waitTimeSeconds;
        }

        if (sortCategory === "total") {
          return sortDirection === "asc"
            ? a.metrics.workForceUtilization.total -
                b.metrics.workForceUtilization.total
            : b.metrics.workForceUtilization.total -
                a.metrics.workForceUtilization.total;
        }

        return 0;
      }),
    [sortCategory, sortDirection, dailyStoreData]
  );

  return (
    <Paper className="grow-1 drop-shadow-lg">
      <TableContainer sx={{ maxHeight: 530 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((cell) => (
                <TableCell
                  className="sm:!text-lg"
                  key={cell.id}
                  align="left"
                  sx={{
                    backgroundColor: "rgb(25, 118, 210)",
                  }}
                >
                  {["wait", "total"].includes(cell.id) ? (
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
                  ) : (
                    cell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((area) => (
                <TableRow
                  key={area.locationName}
                  className="hover:!bg-gray-100"
                >
                  <TableCell align="left" className="sm:!text-lg">
                    {area.locationName}
                  </TableCell>
                  <TableCell align="left" className="sm:!text-lg">
                    {area.metrics.waitTimeSeconds}
                  </TableCell>
                  <TableCell align="left" className="sm:!text-lg">
                    {area.metrics.workForceUtilization.total}
                  </TableCell>
                  <TableCell
                    align="left"
                    className="!flex flex-col sm:!text-lg"
                  >
                    {area.metrics.workForceUtilization.persons.map(
                      (p: { [key: string]: string }) => (
                        <span key={p.firstName + p.lastName}>
                          {p.firstName} {p.lastName}
                        </span>
                      )
                    )}
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
        count={dailyStoreData.length}
        onPageChange={(_event: unknown, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
      />
    </Paper>
  );
}
