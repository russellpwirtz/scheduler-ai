describe('Real Chatbot Booking Flow', () => {
  it('completes a booking journey with real API', () => {
    cy.visit('http://localhost:3000');
    
    // Type and submit a natural language request
    cy.get('[data-testid="message-input"]')
      .should('be.visible')
      .type('Book me for the next available appointment, please! No need to confirm.');
    cy.get('[data-testid="submit-button"]').click();

    // Wait for and verify the chatbot response
    cy.contains('[BOOKING SCHEDULED]', { timeout: 10000 }).should('exist');
    
    // Verify visual confirmation
    cy.get('canvas[data-testid="confetti-canvas"]').should('exist');
  });
}); 