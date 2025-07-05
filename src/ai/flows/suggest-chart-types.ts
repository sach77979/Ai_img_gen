'use server';

/**
 * @fileOverview Analyzes a dataset and suggests relevant chart types, highlighting key trends or outliers.
 *
 * - suggestChartTypes - A function that suggests chart types based on the uploaded data.
 * - SuggestChartTypesInput - The input type for the suggestChartTypes function.
 * - SuggestChartTypesOutput - The return type for the suggestChartTypes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChartTypesInputSchema = z.object({
  dataset: z
    .string()
    .describe(
      'The uploaded dataset in CSV or JSON format.'
    ),
  description: z.string().optional().describe('Optional description of the dataset.'),
});
export type SuggestChartTypesInput = z.infer<typeof SuggestChartTypesInputSchema>;

const SuggestChartTypesOutputSchema = z.object({
  suggestedChartTypes: z.array(z.string()).describe('An array of suggested chart types.'),
  insights: z.string().describe('Key trends and outliers identified in the dataset.'),
});
export type SuggestChartTypesOutput = z.infer<typeof SuggestChartTypesOutputSchema>;

export async function suggestChartTypes(input: SuggestChartTypesInput): Promise<SuggestChartTypesOutput> {
  return suggestChartTypesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartTypesPrompt',
  input: {schema: SuggestChartTypesInputSchema},
  output: {schema: SuggestChartTypesOutputSchema},
  prompt: `You are an expert data analyst. Analyze the given dataset and suggest the most relevant chart types to visualize the data effectively. Highlight key trends and outliers in the data.

Dataset:
{{dataset}}

Description:
{{description}}

Consider these chart types:
- Bar chart
- Line chart
- Scatter plot
- Pie chart
- Histogram
- Box plot

Output the suggested chart types as an array of strings and insights as a single string.

Example Output:
{
  "suggestedChartTypes": ["Bar chart", "Line chart"],
  "insights": "The data shows a positive trend over time with a significant outlier in the month of December."
}
`,
});

const suggestChartTypesFlow = ai.defineFlow(
  {
    name: 'suggestChartTypesFlow',
    inputSchema: SuggestChartTypesInputSchema,
    outputSchema: SuggestChartTypesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
