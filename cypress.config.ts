import { defineConfig } from "cypress";

const evaluations: Array<{
  model: string;
  test: string;
  result: string;
  timestamp: Date;
}> = [];

export default defineConfig({
  projectId: 'pmr12y',
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        logEval: ({ model, test, result }) => {
          evaluations.push({ model, test, result, timestamp: new Date() });
          return null;
        },
        generateReport: () => {
          const report = {
            date: new Date().toISOString(),
            stats: {} as Record<string, { pass: number; fail: number; total: number }>,
            details: [...evaluations]
          };
          
          evaluations.forEach(entry => {
            if (!report.stats[entry.model]) {
              report.stats[entry.model] = { pass: 0, fail: 0, total: 0 };
            }
            entry.result === 'PASS' ? report.stats[entry.model].pass++ 
                                   : report.stats[entry.model].fail++;
            report.stats[entry.model].total++;
          });

          console.log('Evaluation Report:', report);
          return null;
        }
      });
      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
