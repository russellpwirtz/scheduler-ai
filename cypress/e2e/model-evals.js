describe('Model Evaluation Suite', () => {
  const TEST_MODELS = ['gpt-3.5-turbo', 'gpt-4o-2024-08-06', 'gpt-4o-mini-2024-07-18'];
  const EVAL_PROMPTS = [
    {
      name: 'direct_booking',
      prompt: 'Book next available appointment with Dr. Smith',
      expected: /!schedule\(Dr\. Smith, .+\)/
    },
    {
      name: 'ambiguous_request',
      prompt: 'I need some time tomorrow',
      expected: /clarify.*(service|time|provider)/i
    },
    {
      name: 'error_condition',
      prompt: 'Book me for yesterday at 3pm',
      expected: /(past date|invalid time|cannot schedule)/i
    }
  ];

  // Add a test group for default model
  describe('Testing Default Model', () => {
    it('uses fallback model when no parameter specified', () => {
      cy.visit('http://localhost:3000'); // No model parameter
      
      cy.get('[data-testid="message-input"]')
        .type('What model are you using?');
      cy.get('[data-testid="submit-button"]').click();

      cy.contains('gpt-3.5-turbo', { timeout: 15000 })
        .should('exist');
    });
  });

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
            cy.get('[data-testid="submit-button"]').click();

            cy.contains(expected, { timeout: 15000 })
              .should('exist')
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

  after(() => {
    cy.task('generateReport');
  });
}); 