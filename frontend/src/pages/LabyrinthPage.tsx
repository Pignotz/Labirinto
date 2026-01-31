import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { User } from "../models/User";
import { Photo } from "../models/Photo";
import { addPhotoToUser } from "../api/userPhotoApi";
import { getRandomUncollectedPhoto } from "../api/photoApi";

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
    backgroundColor: string = "rgba(255,255,255,0.5)";
    photo: Photo | null = null;

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

    /**
     * Convert hex color to rgba with alpha
     */
    setBackgroundColorFromHex(hexColor: string | null, alpha: number = 1) {
        if (!hexColor) return;
        const hex = hexColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        this.backgroundColor = `rgba(${r},${g},${b},${alpha})`;
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
 */
class Labyrinth {
    num_rows: number;
    num_cols: number;
    grid: Cell[][];
    exit: { row: number; col: number };
    specialCells: Cell[] = [];

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
     */
    generate() {
        const grid = Array.from({ length: this.num_rows }, (_, r) =>
            Array.from({ length: this.num_cols }, (_, c) => new Cell(r, c))
        );

        const visited = Array.from({ length: this.num_rows }, () =>
            Array(this.num_cols).fill(false)
        );

        const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

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
                    grid[r][c].removeWall(w1);
                    grid[nr][nc].removeWall(w2);
                    carve(nr, nc);
                }
            }
        };

        carve(0, 0);

        // Mark special cells
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
                    this.specialCells.push(grid[r][c]);
                }
            }
        }

        return grid;
    }

    /**
     * Propagate color from special cells using fair multi-source BFS
     * Each special cell expands one level at a time in round-robin fashion
     * Ensures equal opportunity for each photo's color to spread through the maze
     */
    propagateColors() {
        const coloredCells = new Map<string, { color: string; alpha: number }>();
        
        // Initialize: color special cells themselves with full opacity
        for (const specialCell of this.specialCells) {
            if (!specialCell.photo?.representativeColor) continue;
            
            const cellKey = `${specialCell.row}-${specialCell.col}`;
            specialCell.setBackgroundColorFromHex(specialCell.photo.representativeColor, 1);
            coloredCells.set(cellKey, {
                color: specialCell.photo.representativeColor,
                alpha: 1
            });
        }

        // Multi-source BFS: each special cell gets one iteration per distance level
        const frontiers = this.specialCells.map(cell => ({
            cell,
            nextCells: [cell],
            distance: 0
        }));

        let maxDistance = 8;
        let hasExpanded = true;

        while (hasExpanded && frontiers[0].distance < maxDistance) {
            hasExpanded = false;

            // Round-robin through each special cell's frontier
            for (const frontier of frontiers) {
                const nextFrontier: Cell[] = [];

                // Expand each cell in current frontier by one step
                for (const cell of frontier.nextCells) {
                    const neighbors: Cell[] = [];

                    // Check all valid maze passages
                    if (cell.row > 0 && !cell.hasWall("top")) {
                        neighbors.push(this.getCell(cell.row - 1, cell.col));
                    }
                    if (cell.row < this.num_rows - 1 && !cell.hasWall("bottom")) {
                        neighbors.push(this.getCell(cell.row + 1, cell.col));
                    }
                    if (cell.col > 0 && !cell.hasWall("left")) {
                        neighbors.push(this.getCell(cell.row, cell.col - 1));
                    }
                    if (cell.col < this.num_cols - 1 && !cell.hasWall("right")) {
                        neighbors.push(this.getCell(cell.row, cell.col + 1));
                    }

                    // Color uncolored neighbors
                    for (const neighbor of neighbors) {
                        const neighborKey = `${neighbor.row}-${neighbor.col}`;
                        if (!coloredCells.has(neighborKey) && frontier.cell.photo?.representativeColor) {
                            const alpha = Math.max(0.1, 1 - frontier.distance * 0.12);
                            // Adjust alpha based on color saturation to reduce influence of near-gray colors
                            let adjustedAlpha = alpha;
                            try {
                                const hex = (frontier.cell.photo.representativeColor || "").replace("#", "");
                                if (hex.length === 6) {
                                    const rr = parseInt(hex.substring(0, 2), 16);
                                    const gg = parseInt(hex.substring(2, 4), 16);
                                    const bb = parseInt(hex.substring(4, 6), 16);
                                    const mx = Math.max(rr, gg, bb);
                                    const mn = Math.min(rr, gg, bb);
                                    const sat = mx === 0 ? 0 : (mx - mn) / mx;
                                    const scale = 0.5 + sat * 0.5; // range 0.5..1.0
                                    adjustedAlpha = Math.min(1, Math.max(0, alpha * scale));
                                }
                            } catch (e) {
                                // ignore and use unmodified alpha
                            }

                            neighbor.setBackgroundColorFromHex(frontier.cell.photo.representativeColor, adjustedAlpha);
                            coloredCells.set(neighborKey, {
                                color: frontier.cell.photo.representativeColor,
                                alpha: adjustedAlpha
                            });
                            nextFrontier.push(neighbor);
                            hasExpanded = true;
                        }
                    }
                }

                // Update frontier for next iteration
                frontier.nextCells = nextFrontier;
                frontier.distance++;
            }
        }
    }

    /**
     * Determine whether the player can move
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
     * Visibility rules for the player
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
type Props = {
    selectedUser: User | null;
};

export default function LabyrinthPage({ selectedUser }: Props) {
    const [labyrinth, setLabyrinth] = useState<Labyrinth | null>(null);
    const [player, setPlayer] = useState(() => new Player());
    const [overlayImg, setOverlayImg] = useState<Photo | null>(null);
    const [fullVision] = useState(true);
    const [loading, setLoading] = useState(true);

    // Initialize labyrinth and load photos for special cells
    useEffect(() => {
        const initializeGame = async () => {
            const newLabyrinth = new Labyrinth(ROWS, COLS);
            
            if (selectedUser) {
                // Load random uncollected photos for each special cell
                const excludedPhotoIds: number[] = [];
                for (const specialCell of newLabyrinth.specialCells) {
                    const photo = await getRandomUncollectedPhoto(selectedUser.id, excludedPhotoIds);
                    if (photo) {
                        specialCell.photo = photo;
                        excludedPhotoIds.push(photo.id);
                    }
                }

                // Propagate colors after all photos are assigned
                newLabyrinth.propagateColors();
            }

            setLabyrinth(newLabyrinth);
            setLoading(false);
        };

        initializeGame();
    }, [selectedUser]);

    const move = useCallback(
        (dr: number, dc: number) => {
            if (!labyrinth) return;
            if (!labyrinth.canMove(player, dr, dc)) return;

            const nr = player.row + dr;
            const nc = player.col + dc;
            const target = labyrinth.getCell(nr, nc);

            const newPlayer = new Player(nr, nc);
            setPlayer(newPlayer);

            if (target.type === "special" && target.photo && selectedUser) {
                setOverlayImg(target.photo);
                // Mark photo as collected
                addPhotoToUser(selectedUser.id, target.photo.id).catch((err: any) =>
                    console.error("Error collecting photo:", err)
                );
            }
        },
        [player, labyrinth, selectedUser]
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

    if (loading) {
        return <div className="flex-1 h-full flex items-center justify-center">Caricamento labirinto...</div>;
    }

    if (!labyrinth) {
        return <div className="flex-1 h-full flex items-center justify-center">Errore nel caricamento del labirinto</div>;
    }

    if (!selectedUser) {
        return <div className="flex-1 h-full flex items-center justify-center">Seleziona un giocatore per iniziare</div>;
    }

    const wall = (hasWall: boolean) =>
        hasWall
            ? `2px solid ${COLORS.wall.solid}`
            : `2px solid ${COLORS.wall.transparent}`;

    return (
        <>
            <div className="flex-1 h-full flex flex-col">
                <div className="flex justify-center pt-4 flex-1 overflow-auto"
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${COLS}, 32px)`,
                        lineHeight: 0,
                        width: "fit-content",
                        margin: "0 auto",
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
                                        ? cell.backgroundColor
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

            {overlayImg && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm" 
                    onClick={() => setOverlayImg(null)}
                >
                    <Card className="max-w-xl w-full mx-4 bg-linear-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
                        <CardBody className="gap-4">
                            <div className="flex items-center justify-center animate-pulse">
                                <span className="text-4xl">✨</span>
                            </div>
                            <h2 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400">
                                Foto Raccolta!
                            </h2>
                            <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-yellow-500/50">
                                <img
                                    src={overlayImg.getImageUrl()}
                                    alt="Foto raccolta"
                                    className="w-full h-auto object-cover max-h-96"
                                />
                                <div 
                                    className="absolute inset-0 pointer-events-none rounded-lg"
                                    style={{
                                        boxShadow: `inset 0 0 40px ${overlayImg.representativeColor || "rgba(255,255,255,0.2)"}`,
                                    }}
                                />
                            </div>
                            <p className="text-center text-sm text-gray-300">
                                Scopri i segreti del labirinto, una foto alla volta...
                            </p>
                        </CardBody>
                        <CardFooter className="flex gap-2 justify-center">
                            <Button
                                className="bg-linear-to-r from-yellow-500 to-orange-500 text-white font-semibold px-8"
                                onPress={() => setOverlayImg(null)}
                                size="lg"
                            >
                                Continua l'Avventura
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    );
}
