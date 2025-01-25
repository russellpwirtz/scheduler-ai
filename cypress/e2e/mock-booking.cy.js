describe('Scheduling Flow', () => {
  it('completes a booking journey', () => {
    cy.intercept('POST', '/api/chat', {
      statusCode: 200,
      body: { 
        response: "!schedule(Jane Doe, 2023-07-20T14:00)",
        error: null 
      }
    }).as('chatRequest');

    cy.visit('http://localhost:3000');
    
    // Update selectors to match actual form elements
    cy.get('[data-testid="message-input"]').should('be.visible').type('Book Jane Doe for next available slot');
    cy.get('[data-testid="submit-button"]').click();
    
    cy.wait('@chatRequest');
    cy.contains('[BOOKING SCHEDULED]').should('exist');
    cy.get('canvas[data-testid="confetti-canvas"]').should('exist');
  });
}); 