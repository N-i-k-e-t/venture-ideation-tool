import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useVenture } from "@/context/venture-context";
import SidebarNav from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Stage, stageLabels } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { PlusIcon, Trash2Icon, ArrowRightIcon, FolderIcon, ClockIcon } from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { setCurrentVenture } = useVenture();
  const [newVentureTitle, setNewVentureTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // In a real app, we'd get the userId from auth context
  const userId = 1;

  const { data: ventures, isLoading, refetch } = useQuery({
    queryKey: [`/api/ventures?userId=${userId}`],
  });

  const handleCreateVenture = async () => {
    if (!newVentureTitle.trim()) {
      toast({
        title: "Please enter a title for your venture idea",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const response = await apiRequest("POST", "/api/ventures", {
        userId,
        title: newVentureTitle,
        currentStage: 1,
        isCompleted: false
      });
      
      const venture = await response.json();
      
      setCurrentVenture(venture);
      toast({
        title: "Venture idea created!",
        description: "Let's start developing your idea.",
      });
      
      await refetch();
      setNewVentureTitle("");
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

  const handleContinueVenture = (venture: any) => {
    setCurrentVenture(venture);
    navigate(`/ideation/${venture.id}`);
  };

  const handleDeleteVenture = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/ventures/${id}`);
      toast({
        title: "Venture deleted",
        description: "Your venture idea has been deleted.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error deleting venture",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getStageLabel = (stageNumber: number): string => {
    const stageKeys = Object.keys(stageOrder) as Stage[];
    const stage = stageKeys.find(key => stageOrder[key] === stageNumber);
    return stage ? stageLabels[stage] : "Unknown Stage";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarNav />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-3">
                  <Input
                    placeholder="New venture idea name"
                    value={newVentureTitle}
                    onChange={(e) => setNewVentureTitle(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button onClick={handleCreateVenture} disabled={isCreating}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {isCreating ? "Creating..." : "New Venture"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="px-4 sm:px-6 lg:px-8 mt-6">
              <Tabs defaultValue="in-progress">
                <TabsList>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="in-progress" className="mt-6">
                  {isLoading ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">Loading your ventures...</p>
                    </div>
                  ) : ventures && ventures.filter((v: any) => !v.isCompleted).length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {ventures
                        .filter((venture: any) => !venture.isCompleted)
                        .map((venture: any) => (
                          <Card key={venture.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <CardTitle>{venture.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                Last updated: {new Date(venture.updatedAt).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center text-sm text-gray-500 mb-4">
                                <FolderIcon className="h-4 w-4 mr-2" />
                                Current stage: {getStageLabel(venture.currentStage)}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${(venture.currentStage / 7) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {venture.currentStage}/7 stages completed
                              </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteVenture(venture.id)}
                              >
                                <Trash2Icon className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              <Button 
                                onClick={() => handleContinueVenture(venture)}
                                size="sm"
                              >
                                Continue
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center border border-dashed border-gray-300 rounded-lg">
                      <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No ventures in progress</h3>
                      <p className="text-gray-500 mb-4">Start creating your first venture idea</p>
                      <Button onClick={() => setNewVentureTitle("My First Venture")}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create New Venture
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="mt-6">
                  {isLoading ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">Loading your ventures...</p>
                    </div>
                  ) : ventures && ventures.filter((v: any) => v.isCompleted).length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {ventures
                        .filter((venture: any) => venture.isCompleted)
                        .map((venture: any) => (
                          <Card key={venture.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                                Completed
                              </div>
                              <CardTitle>{venture.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                Completed: {new Date(venture.updatedAt).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: '100%' }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                7/7 stages completed
                              </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteVenture(venture.id)}
                              >
                                <Trash2Icon className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              <Button 
                                onClick={() => handleContinueVenture(venture)}
                                size="sm"
                              >
                                View Report
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center border border-dashed border-gray-300 rounded-lg">
                      <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No completed ventures</h3>
                      <p className="text-gray-500">Complete your in-progress ventures to see them here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
