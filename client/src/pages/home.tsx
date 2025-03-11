import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useVenture } from "@/context/venture-context";
import { Zap, BrainCircuit, BarChart3, FileText, LightbulbIcon } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { setCurrentVenture } = useVenture();
  const [ideaTitle, setIdeaTitle] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreateIdea = async () => {
    if (!ideaTitle.trim()) {
      toast({
        title: "Please enter a title for your venture idea",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // In a real app, we'd get the userId from auth context
      const userId = 1;
      
      const response = await apiRequest("POST", "/api/ventures", {
        userId,
        title: ideaTitle,
        currentStage: 1,
        isCompleted: false
      });
      
      const venture = await response.json();
      
      setCurrentVenture(venture);
      toast({
        title: "Venture idea created!",
        description: "Let's start developing your idea.",
      });
      
      navigate(`/ideation/${venture.id}`);
    } catch (error) {
      console.error("Error creating venture:", error);
      toast({
        title: "Error creating venture",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-6">
            <Zap className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-sm font-medium text-primary-700">AI-Powered Venture Ideation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Transform Your Ideas into Viable Startups</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            VentureForge guides you through a structured workflow to refine your concept, analyze opportunities, and create compelling startup pitches.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                placeholder="Enter your venture idea title"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                className="bg-white"
              />
              <Button onClick={handleCreateIdea} disabled={isCreating}>
                {isCreating ? "Creating..." : "Start Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Process Overview Section */}
      <div className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Structured Process</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow our proven 7-step methodology to transform your initial concept into a fully developed venture thesis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <LightbulbIcon className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Initial Idea Refinement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Share your concept and our AI assistant will help clarify and refine your initial idea.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <BrainCircuit className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>SMART Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Make your idea Specific, Measurable, Achievable, Relevant, and Time-bound.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Opportunity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Evaluate market size, competition, and growth potential for your venture.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>Venture Thesis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Develop a compelling business model and vision for your startup.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-10">
          <Button onClick={() => setIdeaTitle("My New Venture") } variant="outline" size="lg">
            See the full workflow
          </Button>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use VentureForge?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform offers unique advantages for entrepreneurs and innovators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accelerated Ideation</h3>
              <p className="text-gray-600">Reduce the time from concept to pitch with our structured, AI-guided workflow.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Benefit from AI analysis based on thousands of successful startup patterns.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Analysis</h3>
              <p className="text-gray-600">Get detailed market assessments and business viability metrics for your idea.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build Your Startup?</h2>
        <div className="max-w-md mx-auto">
          <Input
            placeholder="Enter your venture idea title"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleCreateIdea} disabled={isCreating} size="lg" className="w-full">
            {isCreating ? "Creating..." : "Begin Your Venture Journey"}
          </Button>
        </div>
      </div>
    </div>
  );
}
