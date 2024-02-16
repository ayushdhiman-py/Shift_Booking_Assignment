import * as express from "express";
import { createMockDb } from "./db.js";
import mockShifts from "./mockShifts.js";

const db = createMockDb({ shifts: mockShifts });
const router = express.Router();

router.get("/", async (req, res) => {
  const shifts = await db.shifts.list();
  res.json(shifts);
});

router.get("/:id", async (req, res) => {
  const shift = await db.shifts.get(req.params.id);
  if (!shift) {
    return res.status(404).send(`Shift not found with id ${req.params.id}`);
  }
  res.json(shift);
});

router.post("/:id/book", async (req, res) => {
  const shift = await db.shifts.get(req.params.id);
  if (!shift) {
    return res.status(404).send(`Shift not found with id ${req.params.id}`);
  } else if (shift.booked) {
    return res.status(400).send(`Shift ${req.params.id} is already booked`);
  } else if (Date.now() >= shift.endTime) {
    return res.status(403).send("Shift is already finished");
  } else if (Date.now() > shift.startTime) {
    return res.status(401).send("Shift has already started");
  }
  const allShifts = await db.shifts.list();
  const overlappingShiftExists = !!allShifts
    .filter((s) => s.booked)
    .find((s) => s.startTime < shift.endTime && s.endTime > shift.startTime);
  if (overlappingShiftExists) {
    return res.status(409).send("Cannot book an overlapping shift");
  }
  await db.shifts.set(req.params.id, { booked: true });
  const updatedShift = await db.shifts.get(req.params.id);
  res.json(updatedShift);
});

router.post("/:id/cancel", async (req, res) => {
  try {
    const shift = await db.shifts.get(req.params.id);
    if (!shift) {
      return res
        .status(404)
        .json({ error: `Shift not found with id ${req.params.id}` });
    } else if (!shift.booked) {
      return res
        .status(400)
        .json({ error: "Cannot cancel shift that is not booked" });
    }

    await db.shifts.set(req.params.id, { booked: false });
    const updatedShift = await db.shifts.get(req.params.id);
    res.json(updatedShift);
  } catch (error) {
    console.error("Error cancelling shift:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as plugin };
