import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Download, FileText, Presentation, Sparkles, Copy, Clock } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";

interface PitchReportProps {
  ventureId: number;
}

interface ReportData {
  id?: number;
  ventureId?: number;
  title?: string;
  fullReport?: any;
  pitchDeck?: any;
  elevatorPitch?: string;
  fullPitch?: string;
  createdAt?: string;
}

export default function PitchReport({ ventureId }: PitchReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const queryClient = useQueryClient();
  
  // Fetch existing report if available
  const { data: existingReport, isLoading: isLoadingReport } = useQuery({
    queryKey: [`/api/ventures/${ventureId}/report`],
    enabled: !!ventureId,
  });
  
  // Set report data if it exists
  useEffect(() => {
    if (existingReport) {
      setReportData(existingReport);
    }
  }, [existingReport]);
  
  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/ventures/${ventureId}/report`, {});
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setReportData(data);
      toast({
        title: "Report generated successfully!",
        description: "Your pitch materials are ready to view and download.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/ventures/${ventureId}/report`] });
      queryClient.invalidateQueries({ queryKey: [`/api/ventures/${ventureId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/ventures/${ventureId}/stages`] });
    },
    onError: () => {
      toast({
        title: "Error generating report",
        description: "Please make sure all previous stages are completed.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    generateReportMutation.mutate();
  };
  
  const handleDownloadPDF = () => {
    if (!reportData) return;
    
    try {
      generatePDF(reportData);
      toast({
        title: "PDF download started",
        description: "Your report is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error downloading PDF",
        description: "There was a problem creating your PDF report.",
        variant: "destructive"
      });
    }
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: `${type} copied!`,
          description: "The text has been copied to your clipboard.",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Please try again or select and copy manually.",
          variant: "destructive"
        });
      },
    );
  };
  
  // Render the pitch deck slides
  const renderPitchDeck = () => {
    if (!reportData?.pitchDeck || !Array.isArray(reportData.pitchDeck)) {
      return <p className="text-center text-gray-500 py-10">No pitch deck available</p>;
    }
    
    return (
      <div className="space-y-6">
        {reportData.pitchDeck.map((slide: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            <div className="bg-primary-50 py-2 px-4 border-b">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-primary-700">Slide {index + 1}: {slide.title}</h4>
                <Badge variant="outline">{index + 1}/{reportData.pitchDeck.length}</Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="prose prose-sm max-w-none">
                {typeof slide.content === 'string' ? (
                  <p>{slide.content}</p>
                ) : Array.isArray(slide.content) ? (
                  <ul className="space-y-1">
                    {slide.content.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{JSON.stringify(slide.content)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render the full report sections
  const renderFullReport = () => {
    if (!reportData?.fullReport) {
      return <p className="text-center text-gray-500 py-10">No report data available</p>;
    }
    
    return (
      <div className="space-y-6">
        {Object.entries(reportData.fullReport).map(([section, content]: [string, any]) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {typeof content === 'string' ? (
                  <p>{content}</p>
                ) : Array.isArray(content) ? (
                  <ul className="space-y-1">
                    {content.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : typeof content === 'object' ? (
                  <div className="space-y-3">
                    {Object.entries(content).map(([subTitle, subContent]: [string, any]) => (
                      <div key={subTitle}>
                        <h4 className="text-md font-medium capitalize">{subTitle.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        {typeof subContent === 'string' ? (
                          <p>{subContent}</p>
                        ) : Array.isArray(subContent) ? (
                          <ul className="space-y-1">
                            {subContent.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{JSON.stringify(subContent)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{JSON.stringify(content)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div id="pitch-report-stage" className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">Pitch & Report Generation</h2>
        {reportData ? (
          <Badge variant="success">Generated</Badge>
        ) : (
          <Badge>Final Step</Badge>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Generate your final pitch and comprehensive report based on all the information collected during the previous stages.
      </p>
      
      {/* Report Generation Section */}
      <div className="mt-6">
        {isLoadingReport ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Checking for existing reports...</p>
          </div>
        ) : reportData ? (
          <div>
            <Tabs defaultValue="pitch">
              <TabsList className="mb-4 grid grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="pitch">Pitch Scripts</TabsTrigger>
                <TabsTrigger value="deck">Pitch Deck</TabsTrigger>
                <TabsTrigger value="report">Full Report</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pitch">
                <div className="space-y-6">
                  {/* Elevator Pitch */}
                  {reportData.elevatorPitch && (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-md font-medium flex items-center">
                            <Clock className="h-5 w-5 text-primary-500 mr-2" />
                            20-Second Elevator Pitch
                          </CardTitle>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(reportData.elevatorPitch || '', 'Elevator pitch')}
                          >
                            <Copy className="h-4 w-4 mr-1" /> Copy
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-primary-50 p-4 rounded-md text-gray-800">
                          {reportData.elevatorPitch}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Full Pitch */}
                  {reportData.fullPitch && (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-md font-medium flex items-center">
                            <Presentation className="h-5 w-5 text-primary-500 mr-2" />
                            3-Minute Full Pitch
                          </CardTitle>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(reportData.fullPitch || '', 'Full pitch')}
                          >
                            <Copy className="h-4 w-4 mr-1" /> Copy
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-md prose prose-sm max-w-none">
                          {reportData.fullPitch.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">{paragraph}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="deck">
                {renderPitchDeck()}
              </TabsContent>
              
              <TabsContent value="report">
                {renderFullReport()}
              </TabsContent>
            </Tabs>
            
            {/* Download Options */}
            <div className="mt-6 flex justify-center">
              <Button onClick={handleDownloadPDF} className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Download Full Report (PDF)
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center">
                <Sparkles className="h-16 w-16 text-primary-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Generate Your Report</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Based on all the information you've provided in the previous stages, we'll create a comprehensive report and pitch materials.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-6">
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <FileText className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                    <h4 className="text-sm font-medium">Comprehensive Report</h4>
                    <p className="text-xs text-gray-500">Detailed business analysis</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <Presentation className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                    <h4 className="text-sm font-medium">Pitch Deck</h4>
                    <p className="text-xs text-gray-500">Ready-to-use presentation</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <Clock className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                    <h4 className="text-sm font-medium">Elevator Pitch</h4>
                    <p className="text-xs text-gray-500">20-sec and 3-min versions</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={isGenerating} 
                  size="lg"
                  className="flex items-center"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Report & Pitch Materials"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
