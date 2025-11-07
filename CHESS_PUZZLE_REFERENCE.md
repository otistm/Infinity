# Chess Puzzle Reference Guide

## Overview
Chess puzzles are positions where the player must find a forced checkmate within a specific number of moves. The two main types are:
- **Mate in 2**: White to move and checkmate Black in exactly 2 moves
- **Mate in 3**: White to move and checkmate Black in exactly 3 moves

## Basic Concepts

### Mate in 2 (M2)
A position where White can force checkmate in exactly 2 moves, regardless of Black's responses.

**Key Characteristics:**
- Every move by White must be a threat (forcing move)
- Black's responses are limited (often only one or two legal moves)
- The second move delivers checkmate

**Common Patterns:**
1. **Double Attack**: A move that threatens two pieces or checkmate
2. **Discovered Check**: Moving a piece to reveal a check from behind
3. **Pinning**: Restricting a piece's movement
4. **Back Rank Mate**: Attacking the back rank with rooks/queens
5. **Smothered Mate**: Knight checkmate when king is surrounded

### Mate in 3 (M3)
Similar to mate in 2, but requires one additional move to set up the final combination.

**Key Characteristics:**
- First move is often a quiet move (non-checking) that sets up the threat
- Second move creates the forcing sequence
- Third move delivers checkmate

## Puzzle Generation Strategy

### Step 1: Create the Checkmate Position
Start with a checkmate position and work backwards:

**Common Checkmate Patterns:**
1. **Back Rank Mate**: Rook/Queen on 8th rank, king trapped by own pieces
2. **Fool's Mate Pattern**: Quick mate with queen and bishop
3. **Scholar's Mate Pattern**: Queen and bishop coordination
4. **Smothered Mate**: Knight delivers mate, king surrounded
5. **Anastasia's Mate**: Rook and knight combination
6. **Damiano's Mate**: Queen and pawn/rook combination

### Step 2: Work Backwards
For Mate in 2:
- Position 1: Checkmate position
- Position 0: One move before mate (this is the puzzle start)

For Mate in 3:
- Position 2: Checkmate position
- Position 1: One move before mate
- Position 0: Two moves before mate (this is the puzzle start)

### Step 3: Ensure Uniqueness
- Only one first move should lead to mate
- Alternative moves should fail or prolong the game
- Black should have limited responses (ideally only one legal move)

## Example Positions

### Mate in 2 Example 1: Back Rank Weakness
```
Position (White to move):
r3k2r/pppp1ppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1

Solution:
1. Qd8+ Kxd8
2. Rd1#

Key: Black's king is trapped on the back rank by its own pawns.
```

### Mate in 2 Example 2: Discovered Attack
```
Position (White to move):
r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1

Solution:
1. Bxf7+ Ke7
2. Nd5#

Key: Bishop sacrifice opens discovered check, knight delivers mate.
```

### Mate in 3 Example 1: Quiet Move Setup
```
Position (White to move):
r2qkb1r/pp2pppp/2n2n2/2pp2B1/3PP3/2N2N2/PPP2PPP/R2QKB1R w KQkq - 0 1

Solution:
1. Bxf6! (quiet move, removing defender)
   If 1...exf6 then 2. Qd5+ leads to mate
   If 1...other moves then 2. Bxc6+ and mate follows
```

## Implementation Guidelines

### Chess Notation
- **Algebraic Notation**: e4, Nf3, Qd8+, etc.
- **File**: a-h (columns)
- **Rank**: 1-8 (rows)
- **Pieces**: K (king), Q (queen), R (rook), B (bishop), N (knight), P (pawn)
- **Special**: + (check), # (checkmate), x (capture), O-O (castling)

### Board Representation
- Use 8x8 array (0-7 for ranks/files or 1-8)
- Standard starting position:
  - White: K on e1, Q on d1, Rooks on a1/h1
  - Black: K on e8, Q on d8, Rooks on a8/h8

### Validation Rules
1. **Legal Move Check**: Piece can move to target square
2. **Check Detection**: King cannot be in check after move
3. **Checkmate Detection**: King is in check with no legal moves
4. **Stalemate Avoidance**: Ensure not a stalemate position

### Difficulty Levels

**Easy (Mate in 2)**:
- Obvious first move (check or capture)
- Limited Black responses (1-2 moves)
- Common patterns (back rank, simple double attack)

**Medium (Mate in 2-3)**:
- Less obvious first move
- Multiple Black responses to consider
- Combination of tactics

**Hard (Mate in 3)**:
- Quiet first move (non-checking)
- Requires looking ahead 3 moves
- Complex combinations

## Common Tactical Themes

1. **Pinning**: Attacking a piece that shields a more valuable piece
2. **Skewer**: Attacking two pieces in line, forcing one to move
3. **Fork**: Attacking two pieces simultaneously with one piece
4. **Discovered Attack**: Moving a piece reveals an attack from behind
5. **Deflection**: Forcing a piece away from an important square
6. **Decoy**: Luring a piece to a bad square
7. **Interference**: Blocking a piece's protection
8. **Overloading**: Attacking a piece that has multiple defensive duties

## Puzzle Database Structure

```javascript
{
  id: "chess_puzzle_001",
  difficulty: "easy",
  type: "mate_in_2",
  fen: "r3k2r/pppp1ppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
  solution: ["Qd8+", "Kxd8", "Rd1#"],
  explanation: "Back rank weakness - Black's king is trapped",
  theme: "back_rank_mate"
}
```

## References
- Standard chess puzzle formats: FEN notation
- Common checkmate patterns: Back rank, smothered mate, etc.
- Chess puzzle solving: Look for forcing moves, checks, captures


