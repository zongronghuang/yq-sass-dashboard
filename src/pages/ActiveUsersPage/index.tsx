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
import { mockActiveUsers } from "../../mocks";

export default function ActiveUsersPage() {
  const anchorRef = useRef<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeView, setActiveView] = useState("table");

  return (
    <div className="pt-14">
      <header className="flex outline min-h-14 outline-black relative justify-center items-center">
        <h1>Active Users</h1>

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
    { id: "time_bucket", label: "Time Bucket" },
    { id: "value", label: "Value" },
  ];
  const sortedRows = useMemo(
    () =>
      [...mockActiveUsers].sort((a, b) => {
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
                  align="center"
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
                <TableRow key={user.timeBucket}>
                  <TableCell align="center">{user.timeBucket}</TableCell>
                  <TableCell align="center">{user.value}</TableCell>
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
        count={mockActiveUsers.length}
        onPageChange={(_event: unknown, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
      />
    </Paper>
  );
}
