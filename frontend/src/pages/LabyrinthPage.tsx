import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";

// ==============================
// CONFIG
// ==============================
const ROWS = 19;
const COLS = 19;
const SPECIAL_CELL_PROBABILITY = 0.05;
const VISION_RADIUS = 4;

// ==============================
// COLORS
// ==============================
const COLORS = {
    cell: {
        visible: "rgba(255,255,255,0.5)",
        hidden: "rgba(0,0,0,1)",
    },
    wall: {
        solid: "rgba(0,0,0,0.9)",
        transparent: "transparent",
    },
};

type cellType = "normal" | "special" | "exit";
type direction = "top" | "right" | "bottom" | "left";

class Positioned {
    row: number;
    col: number;
    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

// ==============================
// CELL
// ==============================
/**
 * Represents a single cell in the grid-based labyrinth.
 * Each cell tracks its row/column coordinates, whether it's a
 * special cell (e.g. triggers an event), and which of its four
 * walls are present. Walls are booleans named `top|right|bottom|left`.
 */
class Cell extends Positioned {
    type: cellType;
    walls: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
    constructor(row: number, col: number) {
        super(row, col);
        this.type = "normal";
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true,
        };
    }

    /**
     * Check whether the cell currently has a wall in `direction`.
     * @param {"top"|"right"|"bottom"|"left"} direction
     * @returns {boolean}
     */
    hasWall(direction: direction): boolean {
        return this.walls[direction];
        }
    /**
     * Remove the wall on this cell at `direction` (used by the
     * maze-carving algorithm to open passages between adjacent cells).
     * @param {"top"|"right"|"bottom"|"left"} direction
     */
    removeWall(direction: "top" | "right" | "bottom" | "left") {
        this.walls[direction] = false;
    }


    /**
     * Return true if `other` is an orthogonally adjacent neighbor
     * (Manhattan distance of exactly 1). Useful to validate moves
     * and clicks between player and neighboring cells.
     * @param {Cell} other
     */
    isNeighborOf(other: Cell | Player): boolean {
        const dr = Math.abs(this.row - other.row);
        const dc = Math.abs(this.col - other.col);
        return dr + dc === 1;
    }
}

// ==============================
// PLAYER
// ==============================
/**
 * Simple player model that stores the current grid coordinates of
 * the avatar within the labyrinth. The UI uses this to determine
 * visibility, rendering, and allowed moves.
 */
class Player extends Positioned {
    /**
     * @param {number} row - starting row (default 0)
     * @param {number} col - starting column (default 0)
     */
    constructor(row = 0, col = 0) {
        super(row, col);
    }

    /**
     * Move the player to absolute grid coordinates.
     * Note: movement validity should be checked with `Labyrinth.canMove`.
     * @param {number} row
     * @param {number} col
     */
    moveTo(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    /**
     * Return true if the player is located at the same coordinates as `cell`.
     * @param {Cell} cell
     */
    isAt(cell: Cell): boolean {
        return this.row === cell.row && this.col === cell.col;
    }
}

// ==============================
// LABYRINTH
// ==============================
/**
 * Labyrinth encapsulates the grid of `Cell`s and contains the
 * maze-generation algorithm and helper methods used by the UI.
 *
 * Generation: uses a randomized depth-first search (recursive
 * backtracker). Starting at (0,0) it visits cells, shuffles the
 * four orthogonal directions, and carves passages by removing
 * walls between the current cell and an unvisited neighbor.
 * This produces a perfect maze (one unique path between any two
 * cells) before special cells are assigned.
 */
class Labyrinth {
    num_rows: number;
    num_cols: number;
    grid: Cell[][];
    exit: { row: number; col: number };
    /**
     * @param {number} rows
     * @param {number} cols
     */
    constructor(rows: number, cols: number) {
        this.num_rows = rows;
        this.num_cols = cols;
        this.grid = this.generate();
        // Designate an exit roughly centered in the grid
        this.exit = {
            row: Math.floor(rows / 2),
            col: Math.floor(cols / 2),
        };
    }

    /** Return the `Cell` at absolute grid coordinates */
    getCell(row: number, col: number): Cell {
        return this.grid[row][col];
    }

    /**
     * Generate a new maze grid and mark some cells as special.
     * Implementation details:
     *  - Build an empty grid of `Cell` instances.
     *  - Use a `visited` boolean grid to track DFS progress.
     *  - `shuffle` randomizes neighbor visitation order to produce
     *    different maze layouts on each run.
     *  - `carve` is the recursive DFS/backtracking function that
     *    removes walls between the current cell and an unvisited
     *    neighbor, then recurses into that neighbor.
     *  - After carving, randomly mark non-center cells as `special`
     *    based on `SPECIAL_CELL_PROBABILITY`.
     *
     * @returns {Cell[][]}
     */
    generate() {
        const grid = Array.from({ length: this.num_rows }, (_, r) =>
            Array.from({ length: this.num_cols }, (_, c) => new Cell(r, c))
        );

        const visited = Array.from({ length: this.num_rows }, () =>
            Array(this.num_cols).fill(false)
        );

        // Lightweight Fisher–Yates style shuffle (using sort for brevity)
        const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

        // Recursive DFS/backtracker that carves passages
        const carve = (r: number, c: number) => {
            visited[r][c] = true;

            for (const [dr, dc, w1, w2] of shuffle([
                [0, -1, "left", "right"],
                [0, 1, "right", "left"],
                [-1, 0, "top", "bottom"],
                [1, 0, "bottom", "top"],
            ])) {
                const nr = r + dr;
                const nc = c + dc;

                if (
                    nr >= 0 &&
                    nc >= 0 &&
                    nr < this.num_rows &&
                    nc < this.num_cols &&
                    !visited[nr][nc]
                ) {
                    // Remove the wall between current and neighbor
                    grid[r][c].removeWall(w1);
                    grid[nr][nc].removeWall(w2);
                    carve(nr, nc);
                }
            }
        };

        // Start carving from the top-left corner
        carve(0, 0);

        // Mark some cells as special (avoid marking the central exit)
        const cr = Math.floor(this.num_rows / 2);
        const cc = Math.floor(this.num_cols / 2);
        grid[cr][cc].type = "exit";
        for (let r = 0; r < this.num_rows; r++) {
            for (let c = 0; c < this.num_cols; c++) {
                if (
                    Math.random() < SPECIAL_CELL_PROBABILITY &&
                    !(r === cr && c === cc)
                ) {
                    grid[r][c].type = "special";
                }
            }
        }

        return grid;
    }

    /**
     * Determine whether the player can move by delta `(dr,dc)` from
     * their current cell. Movement is blocked if the corresponding
     * wall exists on the player's current cell.
     * @param {Player} player
     * @param {number} dr
     * @param {number} dc
     * @returns {boolean}
     */
    canMove(player: Player, dr: number, dc: number): boolean {
        const cell = this.getCell(player.row, player.col);
        if (dr === -1 && cell.hasWall("top")) return false;
        if (dr === 1 && cell.hasWall("bottom")) return false;
        if (dc === -1 && cell.hasWall("left")) return false;
        if (dc === 1 && cell.hasWall("right")) return false;
        return true;
    }

    /**
     * Visibility rules for the player: a cell is visible if it is within
     * `VISION_RADIUS` Manhattan distance and either is the player's own
     * cell or an immediate neighbor that is not blocked by a wall on the
     * player's current cell. This keeps visibility simple and deterministic.
     * @param {Player} player
     * @param {Cell} cell
     * @returns {boolean}
     */
    isVisible(player: Player, cell: Cell) {
        const dist =
            Math.abs(player.row - cell.row) +
            Math.abs(player.col - cell.col);

        if (dist > VISION_RADIUS) return false;
        if (player.isAt(cell)) return true;

        const pr = player.row;
        const pc = player.col;

        if (cell.row === pr - 1 && cell.col === pc)
            return !this.getCell(pr, pc).hasWall("top");
        if (cell.row === pr + 1 && cell.col === pc)
            return !this.getCell(pr, pc).hasWall("bottom");
        if (cell.row === pr && cell.col === pc - 1)
            return !this.getCell(pr, pc).hasWall("left");
        if (cell.row === pr && cell.col === pc + 1)
            return !this.getCell(pr, pc).hasWall("right");
        return false;
    }
}

// ==============================
// MAIN COMPONENT
// ==============================
export default function LabyrinthPage() {
    const labyrinth = useMemo(
        () => new Labyrinth(ROWS, COLS),
        []
    );

    const [player, setPlayer] = useState(() => new Player());
    const [overlayImg, setOverlayImg] = useState(null);
    const [fullVision] = useState(true);

    const move = useCallback(
        (dr: number, dc: number) => {
            if (!labyrinth.canMove(player, dr, dc)) return;

            const nr = player.row + dr;
            const nc = player.col + dc;
            const target = labyrinth.getCell(nr, nc);

            const newPlayer = new Player(nr, nc);
            setPlayer(newPlayer);

            if (target.type === "special") {
                fetch("/api/photo")
                    .then(r => r.json())
                    .then(d => setOverlayImg(d.url));
            }
        },
        [player, labyrinth]
    );
    // Handle keyboard input for movement
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp" || e.key === "w") move(-1, 0);
            if (e.key === "ArrowDown" || e.key === "s") move(1, 0);
            if (e.key === "ArrowLeft" || e.key === "a") move(0, -1);
            if (e.key === "ArrowRight" || e.key === "d") move(0, 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [move]);

    const wall = (hasWall: boolean) =>
        hasWall
            ? `2px solid ${COLORS.wall.solid}`
            : `2px solid ${COLORS.wall.transparent}`;
    return (
        <>
            <div className="flex-1 h-full">
                <div className="flex justify-center pt-4"
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${COLS}, 32px)`,
                        lineHeight: 0,
                    }}
                >
                    {labyrinth.grid.flat().map((cell: Cell) => {
                        const visible = fullVision
                            ? true
                            : labyrinth.isVisible(player, cell);
                        return (
                            <div
                                key={`${cell.row}-${cell.col}`}
                                onClick={() => {
                                    if (cell.isNeighborOf(player))
                                        move(
                                            cell.row - player.row,
                                            cell.col - player.col
                                        );
                                }}
                                className="relative cursor-pointer"
                                style={{
                                    width: 32,
                                    height: 32,
                                    background: visible
                                        ? COLORS.cell.visible
                                        : COLORS.cell.hidden,
                                    borderTop: wall(cell.walls.top),
                                    borderRight: wall(cell.walls.right),
                                    borderBottom: wall(cell.walls.bottom),
                                    borderLeft: wall(cell.walls.left),
                                }}
                            >
                                {visible && cell.type === "exit" && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        ❤️
                                    </span>
                                )}
                                {visible && player.isAt(cell) && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        👩
                                    </span>
                                )}
                                {visible &&
                                    cell.type === "special" &&
                                    !player.isAt(cell) && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            ✨
                                        </span>
                                    )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
