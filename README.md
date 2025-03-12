# AI-powered Startup Venture Ideation Tool

An intelligent application that guides users through a structured workflow to refine ideas, analyze market opportunities, and generate pitch materials for startup ventures.

## Features

- **Complete Ideation Workflow**: Structured process through 7 key stages of venture development
- **AI-Powered Analysis**: Uses OpenAI to analyze ideas, market opportunities, and more
- **Auto-Complete Functionality**: Option to automatically generate complete venture analysis in one click
- **Interactive Visualizations**: Charts and data visualizations for market analysis
- **Pitch Materials Generation**: Creates comprehensive pitch deck and reports

## Stages of Venture Development

1. **Initial Idea**: Capture and refine your startup concept
2. **SMART Refinement**: Make your idea Specific, Measurable, Achievable, Relevant, and Time-bound
3. **Opportunity Analysis**: Analyze market size, growth potential, and competitive landscape
4. **Venture Thesis**: Create a compelling vision and business model
5. **Viability Assessment**: Evaluate market demand, financial projections, and risk factors
6. **Go-to-Market Strategy**: Define target segments, marketing approach, and launch plan
7. **Pitch Report**: Generate comprehensive pitch materials

## Technical Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Express, Node.js
- **Data Visualization**: Recharts
- **AI Integration**: OpenAI API
- **PDF Generation**: jsPDF

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/venture-ideation-tool.git
   cd venture-ideation-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Deployment

This application can be easily deployed to Vercel. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by OpenAI's API
- UI components from Shadcn UI
- Charts provided by Recharts