describe('Basic Test', () => {
  it('Visits the app', () => {
    cy.visit('http://localhost:3000')
    cy.get('body').should('exist')
    cy.log('Body exists: ' + cy.get('body'))
    cy.contains('Scheduler Bot').should('exist')
  })
}) 