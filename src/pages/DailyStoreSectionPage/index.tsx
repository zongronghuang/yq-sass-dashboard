import { useRef, useState, useMemo, type ChangeEvent } from "react";
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
import { mockDailyStoreSectionData } from "../../mocks";

export default function DailyStoreSectionPage() {
  const anchorRef = useRef<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeView, setActiveView] = useState("table");

  return (
    <div className="pt-14">
      <header className="flex outline min-h-14 outline-black relative justify-center items-center">
        <h1>Daily Store Section</h1>

        <IconButton
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
      <DataTable />
    </div>
  );
}

function DataTable() {
  const [sortCategory, setSortCategory] = useState("time_bucket");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const headCells = [
    { id: "location", label: "Location" },
    { id: "wait", label: "Wait(s)" },
    { id: "total", label: "People" },
    { id: "staff", label: "Staff" },
  ];
  const sortedRows = useMemo(
    () =>
      [...mockDailyStoreSectionData].sort((a, b) => {
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
    [sortCategory, sortDirection]
  );

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 530 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((cell) => (
                <TableCell
                  key={cell.id}
                  align="left"
                  sx={{ backgroundColor: "rgb(25, 118, 210)" }}
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
                <TableRow key={area.locationName}>
                  <TableCell align="left">{area.locationName}</TableCell>
                  <TableCell align="center">
                    {area.metrics.waitTimeSeconds}
                  </TableCell>
                  <TableCell align="center">
                    {area.metrics.workForceUtilization.total}
                  </TableCell>
                  <TableCell align="left" className="!flex flex-col">
                    {area.metrics.workForceUtilization.persons.map((p) => (
                      <span>
                        {p.firstName} {p.lastName}
                      </span>
                    ))}
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
        count={mockDailyStoreSectionData.length}
        onPageChange={(_event: unknown, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
      />
    </Paper>
  );
}
