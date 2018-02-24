describe('Game Requirements', function() {
  it('Has Two Boards', function() {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=board]').should(grids => {
      expect(grids).to.have.length(2);
    });
  });
  it('has 64 cells per board', function() {
    cy.get('[data-cy=cell]').should(grids => {
      expect(grids).to.have.length(128);
    });
  });
  //  A board is an 8x8 grid for a total of 64 units
  //  Two players
  //  Each player has five ships that are 3 grid units in length.
  //  A ship can be considered to be composed of three parts one for each grid unit
  //  Each player will place the ship on the board either vertically or horizontally
  //  Players will take turns firing at their opponent's ship
  //  A hit is when a ship part is in a grid unit that a player fires at
  //  A ship is sunk when all three parts have been hit
  //  Grid units are specified by column and row
  //  Columns are labeled A to H
  //  Rows are labeled 1 to 8
  //  The player grid should be displayed
});
