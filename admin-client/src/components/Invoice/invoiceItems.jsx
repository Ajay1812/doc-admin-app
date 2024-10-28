import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from "@mui/material";
import { BiTrash } from "react-icons/bi";
import { EditableField } from "./EditableField.jsx";

export const InvoiceItems = ({
  items,
  onItemizedItemEdit,
  currency,
  onRowDel,
  onRowAdd,
}) => {
  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ITEM</TableCell>
              <TableCell>QTY</TableCell>
              <TableCell>PRICE/RATE</TableCell>
              <TableCell align="center">ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onItemizedItemEdit={onItemizedItemEdit}
                onDelEvent={onRowDel}
                currency={currency}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="secondary"
        onClick={onRowAdd}
        sx={{ mt: 2 }}
      >
        Add Item
      </Button>
    </div>
  );
};

const ItemRow = ({ item, onItemizedItemEdit, onDelEvent, currency }) => {
  const handleDelete = () => {
    onDelEvent(item);
  };

  return (
    <TableRow>
      <TableCell sx={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "name",
            placeholder: "Item name",
            value: item.name,
            id: item.id,
          }}
        />
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "description",
            placeholder: "Item description",
            value: item.description,
            id: item.id,
          }}
        />
      </TableCell>
      <TableCell sx={{ minWidth: "150px" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: item.quantity,
            id: item.id,
          }}
        />
      </TableCell>
      <TableCell sx={{ minWidth: "150px" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            leading: currency,
            type: "number",
            name: "price",
            min: 1,
            step: "0.01",
            precision: 2,
            textAlign: "end",
            value: item.price,
            id: item.id,
          }}
        />
      </TableCell>
      <TableCell align="center" sx={{ minWidth: "50px" }}>
        <IconButton onClick={handleDelete} color="error">
          <BiTrash style={{ fontSize: "24px" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
