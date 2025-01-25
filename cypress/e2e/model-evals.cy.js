describe('Model Evaluation Suite', () => {
  const TEST_MODELS = ['gpt-3.5-turbo', 'gpt-4o-2024-08-06', 'gpt-4o-mini-2024-07-18'];
  const EVAL_PROMPTS = [
    {
      name: 'direct_booking',
      prompt: 'Book next available appointment with Bill, no need to confirm.',
      expected: /[BOOKING SCHEDULED]/
    },
    {
      name: 'ambiguous_request',
      prompt: 'I need some time tomorrow',
      expected: /(availab.*\?|.*\?.*availab)/i
    },
    {
      name: 'error_condition',
      prompt: 'Book me for yesterday at 3pm',
      expected: /(not able|today onwards|cannot schedule)/i
    }
  ];

  // Existing parameterized tests remain unchanged
  describe('Model Comparison Suite', () => {
    TEST_MODELS.forEach((model) => {
      describe(`Testing ${model}`, () => {
        beforeEach(() => {
          cy.visit(`http://localhost:3000?model=${model}`);
        });
        EVAL_PROMPTS.forEach(({ name, prompt, expected }) => {
          it(`handles ${name} scenario`, () => {
            cy.get('[data-testid="message-input"]')
              .type(prompt);
            cy.intercept('POST', '/api/chat').as('chatRequest');
            cy.get('[data-testid="submit-button"]').click();
            
            // Wait for both the network response and UI update
            cy.wait('@chatRequest');
            cy.get('[data-testid="typing-indicator"]', { timeout: 15000 })
              .should('not.exist');

            // Add assertion to wait for expected content pattern
            cy.contains(expected, { timeout: 20000 }).should('exist');
            
            // Update selector to be more specific to assistant messages
            cy.get('[data-testid="message-content"]').then($elements => {
              cy.wrap($elements.last()).within(() => {
                cy.contains(expected, { timeout: 20000 })
                  .then(() => {
                    cy.task('logEval', {
                      model,
                      test: name,
                      result: 'PASS',
                      timestamp: new Date().toISOString()
                    });
                  });
              });
            });
          });
        });
      });
    });
  });

  after(() => {
    cy.task('generateReport');
  });
}); 